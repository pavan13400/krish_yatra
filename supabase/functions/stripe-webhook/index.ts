// These imports use Deno/Edge-specific module resolution. We suppress TypeScript's
// Node-based module resolution errors with @ts-ignore; they are valid at runtime.
// @ts-ignore -- Deno std server import for Edge Functions
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore -- npm:stripe is supported by Deno's npm compatibility layer
import Stripe from "npm:stripe";
// @ts-ignore -- Supabase client via URL import for Edge Functions
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Minimal type declaration so the TypeScript linter recognises the Deno global.
// The real implementation is provided at runtime by the Edge Functions environment.
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    console.error("❌ Missing stripe-signature");
    return new Response("Missing signature", { status: 400 });
  }

  const body = await req.text();

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
    apiVersion: "2023-10-16",
  });

  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(
            body,
            signature,
            Deno.env.get("STRIPE_WEBHOOK_SECRET")!
          );
  } catch (err) {
    console.error("❌ Signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  console.log("✅ Stripe event:", event.type);
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
  const twilioFromWhatsApp = Deno.env.get("TWILIO_WHATSAPP_FROM");

  async function sendWhatsAppMessage(to: string, message: string) {
    if (!twilioAccountSid || !twilioAuthToken || !twilioFromWhatsApp) {
      console.log(
        "ℹ️ Twilio env vars missing – skipping WhatsApp notification",
      );
      return;
    }

    const url =
      `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;

    const body = new URLSearchParams({
      From: twilioFromWhatsApp,
      To: to,
      Body: message,
    });

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " +
          btoa(`${twilioAccountSid}:${twilioAuthToken}`),
      },
      body: body.toString(),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        "❌ Twilio WhatsApp API error:",
        res.status,
        errorText,
      );
      return;
    }

    const data = await res.json();
    console.log("✅ WhatsApp confirmation sent, SID:", data.sid);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.booking_id;
    // 🔎 Get booking details (slot, phone, timing)
    const { data: booking, error: bookingFetchError } = await supabase
      .from("bookings")
      .select("slot_id, farmer_phone, start_date, time_slot, machinery_id, notes")
      .eq("id", bookingId)
      .single();

    if (bookingFetchError || !booking?.slot_id) {
      console.error("❌ Failed to fetch slot_id:", bookingFetchError);
      return new Response("Slot fetch failed", { status: 500 });
    }


    if (!bookingId) {
      console.error("❌ booking_id missing");
      return new Response("Missing booking_id", { status: 400 });
    }

    // ✅ Confirm booking
    const { error: bookingUpdateError } = await supabase
      .from("bookings")
      .update({ status: "confirmed" })
      .eq("id", bookingId);

    if (bookingUpdateError) {
      console.error("❌ Booking update failed:", bookingUpdateError);
      return new Response("Booking update failed", { status: 500 });
    }

    // 🔓 Make slot permanent (remove expiry)
    const { error: slotUpdateError } = await supabase
      .from("slots")
      .update({
        is_booked: true,
      })
      .eq("id", booking.slot_id);

    if (slotUpdateError) {
      console.error("❌ Slot update failed:", slotUpdateError);
      return new Response("Slot update failed", { status: 500 });
    }
    function normalizeIndianNumber(phone: string) {
      let p = phone.replace(/\D/g, ""); // remove spaces, +, -
      if (p.startsWith("91") && p.length === 12) return `+${p}`;
      if (p.length === 10) return `+91${p}`;
      return `+${p}`; // fallback
    }
    
    const toNumber = `whatsapp:${normalizeIndianNumber(booking.farmer_phone)}`;   
    console.log("✅ Booking confirmed & slot locked:", bookingId);

    // 📲 Send WhatsApp confirmation via Twilio HTTP API (non-blocking for Stripe)
    if (booking.farmer_phone) {
      // const toNumber = `whatsapp:+91${booking.farmer_phone}`;
      const toNumber = `whatsapp:${normalizeIndianNumber(booking.farmer_phone)}`;
      const machineryLabel = booking.notes ?? booking.machinery_id ?? "Machinery";
      console.log("📲 WhatsApp FROM:", twilioFromWhatsApp);
      console.log("📲 WhatsApp TO:", toNumber);
      const message = `✅ KrishiYantra Booking Confirmed\n\n` +
        `Machinery: ${machineryLabel}\n` +
        `Date: ${booking.start_date}\n` +
        `Time: ${booking.time_slot}\n` +
        `Booking ID: ${bookingId}\n\n` +
        `Thank you for using KrishiYantra. Please be ready at your field before the slot time.`;

      try {
        await sendWhatsAppMessage(toNumber, message);
      } catch (err) {
        console.error("❌ Failed to send WhatsApp message:", err);
      }
    } else {
      console.log(
        "ℹ️ farmer_phone missing – skipping WhatsApp notification",
      );
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

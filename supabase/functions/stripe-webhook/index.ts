import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "npm:stripe";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.booking_id;
    // 🔎 Get slot_id from booking
    const { data: booking, error: bookingFetchError } = await supabase
      .from("bookings")
      .select("slot_id")
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

    console.log("✅ Booking confirmed & slot locked:", bookingId);
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

// @ts-ignore - Deno URL import; valid at runtime in Supabase Edge Functions
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore - npm: specifier is valid in Deno's npm compatibility layer
import Stripe from "npm:stripe";

declare const Deno: {
  env: { get(key: string): string | undefined };
};

console.log("🚀 Function file loaded");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const stripe = new Stripe(
  Deno.env.get("STRIPE_SECRET_KEY")!,
  { apiVersion: "2023-10-16" }
);

serve(async (req) => {
  console.log("👉 Function HIT");
  console.log("👉 Method:", req.method);
  console.log("👉 Headers:", Object.fromEntries(req.headers));

  // CORS
  if (req.method === "OPTIONS") {
    console.log("🟡 OPTIONS request");
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    console.log("❌ Not POST");
    return new Response("Method Not Allowed", { status: 405 });
  }

  let body;
  try {
    body = await req.json();
    console.log("✅ Body received:", body);
  } catch (e) {
    console.log("❌ Failed to parse JSON body", e);
    return new Response("Invalid JSON", { status: 400 });
  }

  const { bookingId, amount, machineryName, successUrl, cancelUrl } = body;

  // Fallback base URL: set PUBLIC_APP_URL in Supabase secrets to your Vercel URL (e.g. https://your-app.vercel.app)
  const baseUrl = Deno.env.get("PUBLIC_APP_URL") ?? "http://localhost:8080";
  const success = successUrl
    ? `${successUrl}?booking_id=${bookingId}`
    : `${baseUrl}/payment-success?booking_id=${bookingId}`;
  const cancel = cancelUrl ?? `${baseUrl}/payment-cancelled`;

  console.log("📦 bookingId:", bookingId);
  console.log("💰 amount:", amount);
  console.log("🚜 machineryName:", machineryName);
  console.log("🔗 success_url:", success);
  console.log("🔗 cancel_url:", cancel);

  try {
    console.log("💳 Creating Stripe session...");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: machineryName ?? "Machinery Booking",
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        booking_id: bookingId,
      },
      success_url: success,
      cancel_url: cancel,
    });

    console.log("✅ Stripe session created:", session.id);

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.log("🔥 Stripe ERROR:", err);
    return new Response("Stripe Error", {
      status: 500,
      headers: corsHeaders,
    });
  }
});


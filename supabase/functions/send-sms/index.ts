import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SMSRequest {
  bookingId: string;
  type: "confirmation" | "reminder";
  language?: "en" | "hi";
}

const messages = {
  confirmation: {
    en: (name: string, machinery: string, date: string) => 
      `Dear ${name}, your booking for ${machinery} on ${date} is confirmed! Thank you for using KrishiYantra. For help: 1800-XXX-XXXX`,
    hi: (name: string, machinery: string, date: string) => 
      `प्रिय ${name}, ${date} को ${machinery} के लिए आपकी बुकिंग पक्की हो गई है! कृषि यंत्र का उपयोग करने के लिए धन्यवाद। सहायता: 1800-XXX-XXXX`,
  },
  reminder: {
    en: (name: string, machinery: string, date: string) => 
      `Reminder: Dear ${name}, your ${machinery} booking is tomorrow (${date}). Please ensure field is ready. - KrishiYantra`,
    hi: (name: string, machinery: string, date: string) => 
      `याद दिलाना: प्रिय ${name}, ${machinery} की बुकिंग कल (${date}) है। कृपया खेत तैयार रखें। - कृषि यंत्र`,
  },
};

const handler = async (req: Request): Promise<Response> => {
  console.log("SMS function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
    const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
    const TWILIO_PHONE_NUMBER = Deno.env.get("TWILIO_PHONE_NUMBER");

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      console.error("Missing Twilio credentials");
      return new Response(
        JSON.stringify({ error: "SMS service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { bookingId, type, language = "en" }: SMSRequest = await req.json();
    console.log(`Processing ${type} SMS for booking: ${bookingId}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch booking details with farmer profile and machinery
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select(`
        id,
        start_date,
        farmer_phone,
        farmer_id,
        machinery (name)
      `)
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      console.error("Booking not found:", bookingError);
      return new Response(
        JSON.stringify({ error: "Booking not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get farmer profile for name
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, phone, preferred_language")
      .eq("user_id", booking.farmer_id)
      .single();

    const farmerName = profile?.full_name || "Farmer";
    const farmerPhone = booking.farmer_phone || profile?.phone;
    const preferredLang = (profile?.preferred_language as "en" | "hi") || language;
    const machineryName = (booking.machinery as any)?.name || "machinery";
    const bookingDate = new Date(booking.start_date).toLocaleDateString("en-IN");

    if (!farmerPhone) {
      console.error("No phone number found for booking");
      return new Response(
        JSON.stringify({ error: "No phone number available" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate message based on type and language
    const messageContent = messages[type][preferredLang](farmerName, machineryName, bookingDate);
    console.log(`Sending ${type} SMS in ${preferredLang} to ${farmerPhone}`);

    // Send SMS via Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const formattedPhone = farmerPhone.startsWith("+") ? farmerPhone : `+91${farmerPhone}`;

    const twilioResponse = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: formattedPhone,
        From: TWILIO_PHONE_NUMBER,
        Body: messageContent,
      }),
    });

    const twilioResult = await twilioResponse.json();
    console.log("Twilio response:", twilioResult);

    if (!twilioResponse.ok) {
      console.error("Twilio error:", twilioResult);
      return new Response(
        JSON.stringify({ error: "Failed to send SMS", details: twilioResult }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update booking to mark notification as sent
    const updateField = type === "confirmation" ? "notification_sent" : "reminder_sent";
    await supabase
      .from("bookings")
      .update({ [updateField]: true })
      .eq("id", bookingId);

    console.log(`SMS sent successfully: ${twilioResult.sid}`);
    return new Response(
      JSON.stringify({ 
        success: true, 
        messageSid: twilioResult.sid,
        message: "SMS sent successfully"
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error in send-sms function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
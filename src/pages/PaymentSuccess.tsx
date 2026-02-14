import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const bookingId = params.get("booking_id");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [lastStatus, setLastStatus] = useState<string | null>(null);
  const [pollError, setPollError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) return;

    let attempts = 0;

    const interval = setInterval(async () => {
      attempts++;

      const { data, error } = await supabase
        .from("bookings")
        .select("status")
        .eq("id", bookingId)
        .single();

      if (error) {
        console.error("PaymentSuccess poll error:", error);
        setPollError(error.message);
      }
      setLastStatus(data?.status ?? null);
      console.log(`🔄 [${attempts}/15] booking_id=${bookingId} status=`, data?.status, error ? { error: error.message } : "");

      if (data?.status === "confirmed") {
        setConfirmed(true);
        setLoading(false);
        clearInterval(interval);
      }

      if (attempts >= 15) {
        setLoading(false);
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [bookingId]);

  if (!bookingId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <p className="text-red-500 font-medium mb-4">Missing booking ID</p>
          <p className="text-muted-foreground mb-6">No booking_id in URL. Did you complete checkout?</p>
          <Button onClick={() => navigate("/")}>Go home</Button>
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen flex items-center justify-center bg-background">
    {loading ? (
      <div className="text-center">
        <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">
          Waiting for payment confirmation…
        </p>
      </div>
    ) : confirmed ? (
      <div className="text-center max-w-md">
        <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">
          Payment Successful 🎉
        </h1>
        <p className="text-muted-foreground mb-6">
          Your booking has been confirmed.
        </p>
        <Button onClick={() => navigate("/dashboard")}>
          Go to Dashboard
        </Button>
      </div>
    ) : (
      <div className="text-center max-w-md">
        <p className="text-red-500 font-medium mb-4">
          Payment not confirmed yet
        </p>
        <p className="text-muted-foreground mb-2">
          If money was deducted, your booking will still be confirmed shortly.
        </p>
        {(lastStatus || pollError) && (
          <p className="text-sm text-muted-foreground mb-4 font-mono">
            {pollError ? `Error: ${pollError}` : `Last status: ${lastStatus}`}
          </p>
        )}
        <p className="text-xs text-muted-foreground mb-6">
          Ensure your Stripe webhook in the Dashboard points to your Supabase function URL so bookings can be confirmed.
        </p>
        <Button onClick={() => navigate("/dashboard")}>
          Go to Dashboard
        </Button>
      </div>
    )}
  </div>
);

};

export default PaymentSuccess;

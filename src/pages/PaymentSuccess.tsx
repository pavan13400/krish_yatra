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

useEffect(() => {
  if (!bookingId) return;

  let attempts = 0;

  const interval = setInterval(async () => {
    attempts++;

    const { data } = await supabase
      .from("bookings")
      .select("status")
      .eq("id", bookingId)
      .single();

    console.log("🔄 status:", data?.status);

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
          Payment is taking longer than expected.
        </p>
        <p className="text-muted-foreground mb-6">
          If money was deducted, your booking will still be confirmed shortly.
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

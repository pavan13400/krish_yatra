import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);
  const fetchBookings = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("bookings")
      .select(`
        id,
        start_date,
        time_slot,
        status,
        total_amount,
        farmer_phone,
        notes,
        machinery:machinery_id (
          name,
          price,
          category
        )
      `)
      .eq("farmer_id", user!.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching bookings:", error);
    } else {
      setBookings(data || []);
    }

    setLoading(false);
  };

  if (!user) {
    return (
      <div className="text-center py-20">
        <p>Please login to view your bookings.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin w-6 h-6" />
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-muted-foreground">No bookings found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => {
            const machineName = booking.notes || booking.machinery?.name || "Machinery";
            const priceDisplay =
              booking.total_amount != null
                ? `₹${booking.total_amount}`
                : booking.machinery?.price ?? "—";
            const categoryDisplay = booking.machinery?.category ?? "—";
            return (
              <Card key={booking.id}>
                <CardContent className="p-5 space-y-2">
                  <p className="font-semibold">
                    🚜 Machine: {machineName}
                  </p>
                  <p className="font-semibold"> Category : {categoryDisplay} </p>
                  <p className="font-semibold"> Price : {priceDisplay} </p>
                  <p>📅 Date: {booking.start_date}</p>
                  <p>⏰ Time: {booking.time_slot}</p>
                  {booking.farmer_phone && (
                    <p className="text-sm text-muted-foreground">
                      📞 Phone: {booking.farmer_phone}
                    </p>
                  )}
                  <p className="text-green-600 font-medium">
                    Status: {booking.status ?? "Confirmed"}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;

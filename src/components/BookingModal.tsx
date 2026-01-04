import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { X, Clock, Calendar as CalendarIcon, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  machinery: {
    id?: string;
    name: string;
    nameHindi?: string;
    image?: string;
    price: string;
    dailyRate?: number;
  };
}

const timeSlots = [
  "6:00 AM - 9:00 AM",
  "9:00 AM - 12:00 PM",
  "12:00 PM - 3:00 PM",
  "3:00 PM - 6:00 PM",
];

const BookingModal = ({ isOpen, onClose, machinery }: BookingModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBooking = async () => {
    if (!selectedDate || !selectedSlot || phoneNumber.length !== 10) return;

    // Check if user is authenticated
    if (!user) {
      toast.error("Please login to book machinery");
      onClose();
      navigate("/auth");
      return;
    }

    setIsLoading(true);

    try {
      // Calculate end date (same as start for single day booking)
      const endDate = new Date(selectedDate);
      
      // If machinery has an ID (from database), use it; otherwise create without machinery reference
      const bookingData: any = {
        farmer_id: user.id,
        start_date: selectedDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        status: 'confirmed',
        farmer_phone: phoneNumber,
        notes: `Time slot: ${selectedSlot}`,
        total_amount: machinery.dailyRate || null,
      };

      // Only add machinery_id if we have a valid UUID
      if (machinery.id && machinery.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        bookingData.machinery_id = machinery.id;
      }

      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert(bookingData)
        .select()
        .single();

      if (bookingError) {
        console.error("Booking error:", bookingError);
        throw new Error("Failed to create booking");
      }

      // Try to send SMS notification (don't fail booking if SMS fails)
      try {
        await supabase.functions.invoke("send-sms", {
          body: {
            bookingId: booking.id,
            type: "confirmation",
          },
        });
      } catch (smsError) {
        console.warn("SMS notification failed:", smsError);
        // Don't throw - booking was successful even if SMS failed
      }

      setIsBooked(true);
      toast.success("Booking confirmed! 🎉");

      setTimeout(() => {
        setIsBooked(false);
        onClose();
        setSelectedDate(undefined);
        setSelectedSlot("");
        setPhoneNumber("");
      }, 3000);

    } catch (error) {
      console.error("Booking failed:", error);
      toast.error("Failed to create booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card rounded-2xl shadow-elevated animate-scale-in">
        {/* Success State */}
        {isBooked ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 rounded-full hero-gradient flex items-center justify-center mx-auto mb-6 animate-scale-in">
              <CheckCircle2 className="w-10 h-10 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Booking Confirmed! 🎉</h3>
            <p className="text-muted-foreground mb-2">बुकिंग की पुष्टि हो गई!</p>
            <p className="text-sm text-muted-foreground">
              You will receive a confirmation SMS on {phoneNumber}
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-4">
                <img
                  src={machinery.image}
                  alt={machinery.name}
                  className="w-16 h-16 object-contain bg-muted rounded-lg p-2"
                />
                <div>
                  <h3 className="text-lg font-bold text-foreground">{machinery.name}</h3>
                  <p className="text-sm text-muted-foreground">{machinery.nameHindi}</p>
                  <p className="text-sm font-semibold text-primary">{machinery.price}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Login prompt for non-authenticated users */}
            {!user && (
              <div className="mx-6 mt-6 p-4 bg-accent/20 rounded-xl border border-accent">
                <p className="text-sm text-accent-foreground">
                  💡 <strong>Tip:</strong> Login to save your bookings and get personalized recommendations.
                </p>
              </div>
            )}

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Date Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
                  <CalendarIcon className="w-4 h-4 text-primary" />
                  Select Date (तारीख चुनें)
                </label>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-xl border border-border"
                  />
                </div>
              </div>

              {/* Time Slot Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
                  <Clock className="w-4 h-4 text-primary" />
                  Select Time Slot (समय चुनें)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                        selectedSlot === slot
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
                  📱 Phone Number (फोन नंबर)
                </label>
                <input
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  maxLength={10}
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border">
              <Button
                variant="hero"
                size="xl"
                className="w-full"
                onClick={handleBooking}
                disabled={!selectedDate || !selectedSlot || phoneNumber.length !== 10 || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
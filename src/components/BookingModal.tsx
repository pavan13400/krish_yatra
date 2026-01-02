import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { X, Clock, Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  machinery: {
    name: string;
    nameHindi?: string;
    image?: string;
    price: string;
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
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleBooking = () => {
    if (selectedDate && selectedSlot && phoneNumber) {
      setIsBooked(true);
      setTimeout(() => {
        setIsBooked(false);
        onClose();
        setSelectedDate(undefined);
        setSelectedSlot("");
        setPhoneNumber("");
      }, 3000);
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
                  onChange={(e) => setPhoneNumber(e.target.value)}
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
                disabled={!selectedDate || !selectedSlot || phoneNumber.length !== 10}
              >
                Confirm Booking
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingModal;

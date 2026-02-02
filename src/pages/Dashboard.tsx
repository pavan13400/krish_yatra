import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  User, Calendar, Clock, Star, Tractor, LogOut, 
  MapPin, Phone, Edit2, Loader2, ChevronRight 
} from "lucide-react";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

interface Profile {
  id: string;
  full_name: string;
  phone: string;
  village: string | null;
  district: string | null;
  state: string;
  preferred_language: string | null;
  farm_size_acres: number | null;
  primary_crops: string[] | null;
}

interface Booking {
  id: string;
  start_date: string;
  end_date: string;
  status: string;
  total_amount: number | null;
  notes: string | null;
  slots: {
    date: string;
    time_slot: string;
  } | null;
}

const Dashboard = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "bookings">("profile");
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchBookings();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
    } else {
      setProfile(data);
    }
    setIsLoading(false);
  };

  const fetchBookings = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("bookings")
      .select(`
        id,
        start_date,
        end_date,
        status,
        total_amount,
        notes,
        machinery_id,
        time_slot
      `)
      .eq("farmer_id", user.id)
      .order("created_at", { ascending: false })
      .returns<Booking[]>();

    console.log("Fetched bookings:", data);
    if (error) {
      console.error("Error fetching bookings:", error);
    } else {
      setBookings(data ?? []);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-primary/10 text-primary";
      case "pending": return "bg-accent/20 text-accent-foreground";
      case "completed": return "bg-muted text-muted-foreground";
      case "cancelled": return "bg-destructive/10 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center">
              <Tractor className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">KrishiYantra</span>
          </a>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-card rounded-2xl p-6 mb-8 shadow-soft border border-border">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full hero-gradient flex items-center justify-center">
                <User className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Welcome, {profile?.full_name || "Farmer"}! 🌾
                </h1>
                <p className="text-muted-foreground">
                  Manage your profile and view booking history
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === "profile"
                  ? "hero-gradient text-primary-foreground shadow-soft"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === "bookings"
                  ? "hero-gradient text-primary-foreground shadow-soft"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Bookings ({bookings.length})
            </button>
          </div>

          {/* Content */}
          {activeTab === "profile" ? (
            <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Profile Details</h2>
                <Button variant="outline" size="sm">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Full Name</label>
                    <p className="text-foreground font-medium">{profile?.full_name || "—"}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Phone
                    </label>
                    <p className="text-foreground font-medium">{profile?.phone || "—"}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Location
                    </label>
                    <p className="text-foreground font-medium">
                      {[profile?.village, profile?.district, profile?.state].filter(Boolean).join(", ") || "—"}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Farm Size</label>
                    <p className="text-foreground font-medium">
                      {profile?.farm_size_acres ? `${profile.farm_size_acres} acres` : "—"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Primary Crops</label>
                    <p className="text-foreground font-medium">
                      {profile?.primary_crops?.join(", ") || "—"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Preferred Language</label>
                    <p className="text-foreground font-medium">
                      {profile?.preferred_language === "hi" ? "Hindi" : "English"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <div className="bg-card rounded-2xl p-12 text-center shadow-soft border border-border">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No bookings yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start by finding machinery for your farm
                  </p>
                  <Button variant="hero" onClick={() => navigate("/")}>
                    Find Machinery
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ) : (
                bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-card rounded-xl p-4 shadow-soft border border-border flex items-center gap-4"
                  >
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                      {/* {booking.machinery?.image_url ? (
                        <img
                          alt={booking.machinery.name}  
                          src={booking.machinery.image_url}
                          className="w-12 h-12 object-contain"
                        />
                      ) : 
                      (
                        <Tractor className="w-8 h-8 text-muted-foreground" />
                      )} */}
                      <Tractor className="w-8 h-8 text-muted-foreground" />
                      <Calendar className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">
                        {booking.slots?.date || "Machinery"}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {/* {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()} */}
                          {booking.slots?.date} | {booking.slots?.time_slot}
                        </span>
                        {booking.total_amount && (
                          <span>₹{booking.total_amount}</span>
                        )}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
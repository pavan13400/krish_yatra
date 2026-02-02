import { MapPin, Brain, Calendar, Shield, Clock, Headphones } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Location-Based",
    // titleHindi: "स्थान आधारित",
    description: "Get recommendations based on your exact location, soil type, and weather conditions.",
  },
  {
    icon: Brain,
    title: "AI-Powered",
    // titleHindi: "AI संचालित",
    description: "Smart machine learning algorithms analyze your needs to suggest the perfect machinery.",
  },
  {
    icon: Calendar,
    title: "Easy Booking",
    // titleHindi: "आसान बुकिंग",
    description: "Book time slots instantly with our simple calendar interface. No hassle, no waiting.",
  },
  {
    icon: Shield,
    title: "Verified Machines",
    // titleHindi: "सत्यापित मशीनें",
    description: "All machinery is quality-checked and well-maintained for optimal performance.",
  },
  {
    icon: Clock,
    title: "Real-time Availability",
    // titleHindi: "वास्तविक समय उपलब्धता",
    description: "Check live availability and book slots that work best for your farming schedule.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    // titleHindi: "24/7 सहायता",
    description: "Get help anytime in your preferred language - Hindi, English, or regional languages.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose KrishiYantra?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Modern technology meets traditional farming wisdom
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 bg-card rounded-2xl shadow-soft hover:shadow-elevated transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl hero-gradient flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">{feature.title}</h3>
              {/* <p className="text-sm text-primary font-medium mb-2">{feature.titleHindi}</p> */}
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
  
export default FeaturesSection;

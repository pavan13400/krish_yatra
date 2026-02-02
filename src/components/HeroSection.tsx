import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-farm.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 pt-20 relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Recommendations</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Find the{" "}
            <span className="text-gradient-primary">Perfect Machinery</span>
            <br />
            for Your Farm
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Smart recommendations based on your location, soil type, and crop. 
            Book machinery slots instantly and boost your farming efficiency.
          </p>

          {/* Hindi tagline */}
          {/* <p className="text-base text-secondary font-medium mb-8 animate-fade-in" style={{ animationDelay: "0.25s" }}>
            आपके खेत के लिए सही यंत्र, सही समय पर
          </p> */}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button variant="hero" size="xl" className="group">
              <MapPin className="w-5 h-5" />
              Select Your Location
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="xl">
              View All Machinery
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {[
              { value: "500+", label: "Machines" },
              { value: "15K+", label: "Farmers" },
              { value: "28", label: "States" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;

import { useState } from "react";
import MachineryCard from "./MachineryCard";
import BookingModal from "./BookingModal";
import { Sparkles, Filter, Lightbulb, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FarmData } from "./LocationSelector";

interface MachineryRecommendation {
  id: number;
  name: string;
  nameHindi?: string;
  category: string;
  price: string;
  priceNumeric: number;
  specs: {
    power: string;
    fuelType: string;
    suitableFor: string;
    efficiency?: string;
    fuelConsumption?: string;
    workingWidth?: string;
  };
  description?: string;
  matchScore: number;
  aiReasons: string[];
  warnings: string[];
  isRecommended: boolean;
}

interface AIResponse {
  success: boolean;
  recommendations: MachineryRecommendation[];
  strategyAdvice: string;
  seasonalTips: string;
  costSavingTips: string;
  farmData: FarmData;
}

interface MachineryResultsProps {
  aiResponse: AIResponse | null;
  isLoading: boolean;
  error: string | null;
}

const MachineryResults = ({ aiResponse, isLoading, error }: MachineryResultsProps) => {
  const [selectedMachinery, setSelectedMachinery] = useState<MachineryRecommendation | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const handleBook = (machinery: MachineryRecommendation) => {
    setSelectedMachinery(machinery);
    setIsBookingOpen(true);
  };

  if (error) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Something went wrong</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">AI is Analyzing Your Farm</h3>
            <p className="text-muted-foreground">
              Considering soil type, crop requirements, farm size, and budget to find optimal machinery...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!aiResponse) return null;

  const { recommendations, strategyAdvice, seasonalTips, costSavingTips, farmData } = aiResponse;

  const categories = ["all", ...new Set(recommendations.map(r => r.category))];
  const filteredRecommendations = categoryFilter === "all" 
    ? recommendations 
    : recommendations.filter(r => r.category === categoryFilter);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 mb-3">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent-foreground">AI Recommendations</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Recommended for Your Farm
            </h2>
            <p className="text-muted-foreground">
              Based on <span className="font-medium text-foreground">{farmData.state}</span>,{" "}
              <span className="font-medium text-foreground">{farmData.crop}</span>,{" "}
              <span className="font-medium text-foreground">{farmData.soil} soil</span>,{" "}
              <span className="font-medium text-foreground">{farmData.farmSize}</span>
            </p>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={categoryFilter === category ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(category)}
              >
                {category === "all" ? "All" : category}
              </Button>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <div className="glass-card rounded-xl p-5 border border-primary/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Strategy Advice</h4>
                <p className="text-sm text-muted-foreground">{strategyAdvice}</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-5 border border-accent/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Seasonal Tips</h4>
                <p className="text-sm text-muted-foreground">{seasonalTips}</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-5 border border-secondary/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-lg">💰</span>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Cost Saving Tips</h4>
                <p className="text-sm text-muted-foreground">{costSavingTips}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecommendations.map((machinery, index) => (
            <div
              key={machinery.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <MachineryCard
                name={machinery.name}
                // nameHindi={machinery.nameHindi}
                category={machinery.category}
                rating={machinery.matchScore / 20}
                price={machinery.price}
                specs={machinery.specs}
                isRecommended={machinery.isRecommended}
                matchScore={machinery.matchScore}
                aiReasons={machinery.aiReasons}
                warnings={machinery.warnings}
                description={machinery.description}
                onBook={() => handleBook(machinery)}
              />
            </div>
          ))}
        </div>

        {filteredRecommendations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No machinery found for this category.</p>
          </div>
        )}

        {/* Booking Modal */}
        {selectedMachinery && (
          <BookingModal
            isOpen={isBookingOpen}
            onClose={() => setIsBookingOpen(false)}
            machinery={{
              name: selectedMachinery.name,
              // nameHindi: selectedMachinery.nameHindi,
              price: selectedMachinery.price,
            }}
          />
        )}
      </div>
    </section>
  );
};

export default MachineryResults;

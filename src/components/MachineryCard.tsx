import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Fuel, Gauge, Wrench, Calendar, CheckCircle, AlertTriangle } from "lucide-react";

interface MachineryCardProps {
  name: string;
  nameHindi?: string;
  image?: string;
  category: string;
  rating: number;
  price: string;
  specs: {
    power: string;
    fuelType: string;
    suitableFor: string;
    efficiency?: string;
    fuelConsumption?: string;
    workingWidth?: string;
  };
  isRecommended?: boolean;
  matchScore?: number;
  aiReasons?: string[];
  warnings?: string[];
  description?: string;
  onBook: () => void;
}

const MachineryCard = ({
  name,
  nameHindi,
  image,
  category,
  rating,
  price,
  specs,
  isRecommended,
  matchScore,
  aiReasons,
  warnings,
  description,
  onBook,
}: MachineryCardProps) => {
  // Generate a placeholder gradient based on category
  const getCategoryColor = () => {
    const colors: Record<string, string> = {
      "Tractor": "from-green-500/20 to-emerald-500/20",
      "Harvester": "from-amber-500/20 to-orange-500/20",
      "Tillage": "from-yellow-500/20 to-lime-500/20",
      "Seeding": "from-teal-500/20 to-cyan-500/20",
      "Spraying": "from-blue-500/20 to-indigo-500/20",
      "Land Preparation": "from-purple-500/20 to-violet-500/20",
      "Planting": "from-pink-500/20 to-rose-500/20",
    };
    return colors[category] || "from-primary/20 to-primary/10";
  };

  const getCategoryIcon = () => {
    const icons: Record<string, string> = {
      "Tractor": "🚜",
      "Harvester": "🌾",
      "Tillage": "⚙️",
      "Seeding": "🌱",
      "Spraying": "💧",
      "Land Preparation": "🏗️",
      "Planting": "🌿",
    };
    return icons[category] || "🔧";
  };

  return (
    <div className={`group relative bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 ${isRecommended ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}>
      {/* Match Score Badge */}
      {matchScore !== undefined && (
        <div className="absolute top-4 right-4 z-10">
          <div className={`px-2 py-1 rounded-lg text-xs font-bold ${
            matchScore >= 80 ? "bg-green-500 text-white" :
            matchScore >= 60 ? "bg-amber-500 text-white" :
            "bg-muted text-muted-foreground"
          }`}>
            {matchScore}% Match
          </div>
        </div>
      )}

      {/* Recommended Badge */}
      {isRecommended && (
        <div className="absolute top-4 left-4 z-10">
          <Badge className="hero-gradient text-primary-foreground font-semibold px-3 py-1">
            ⭐ AI Recommended
          </Badge>
        </div>
      )}

      {/* Image or Placeholder */}
      <div className={`relative h-48 bg-gradient-to-br ${getCategoryColor()} overflow-hidden flex items-center justify-center`}>
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
            {getCategoryIcon()}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category & Rating */}
        <div className="flex items-center justify-between mb-3">
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Name */}
        <h3 className="text-lg font-bold text-foreground mb-1">{name}</h3>
        {/* {nameHindi && <p className="text-sm text-muted-foreground mb-2">{nameHindi}</p>} */}
        
        {/* Description */}
        {description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{description}</p>
        )}

        {/* AI Reasons */}
        {aiReasons && aiReasons.length > 0 && (
          <div className="mb-3 space-y-1">
            {aiReasons.slice(0, 2).map((reason, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-xs text-green-600">
                <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-1">{reason}</span>
              </div>
            ))}
          </div>
        )}

        {/* Warnings */}
        {warnings && warnings.length > 0 && (
          <div className="mb-3">
            {warnings.slice(0, 1).map((warning, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-xs text-amber-600">
                <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-1">{warning}</span>
              </div>
            ))}
          </div>
        )}

        {/* Specs */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Gauge className="w-4 h-4 text-primary" />
            <span>{specs.power}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Fuel className="w-4 h-4 text-primary" />
            <span>{specs.fuelType}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wrench className="w-4 h-4 text-primary" />
            <span>{specs.suitableFor}</span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Rental from</p>
            <p className="text-lg font-bold text-primary">{price}</p>
          </div>
          <Button variant={isRecommended ? "hero" : "default"} onClick={onBook}>
            <Calendar className="w-4 h-4" />
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MachineryCard;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, ChevronDown, Check, Search, Leaf, Droplets, Calendar, Wallet } from "lucide-react";

const indianStates = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan",
  "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const crops = [
  { name: "Rice", icon: "🌾", value: "Rice" },
  { name: "Wheat", icon: "🌾", value: "Wheat" },
  { name: "Sugarcane", icon: "🎋", value: "Sugarcane" },
  { name: "Cotton", icon: "🌿", value: "Cotton" },
  { name: "Maize", icon: "🌽", value: "Maize" },
  { name: "Pulses", icon: "🫘", value: "Pulses" },
];

const soilTypes = [
  { name: "Alluvial Soil", value: "Alluvial" },
  { name: "Black Soil", value: "Black" },
  { name: "Red Soil", value: "Red" },
  { name: "Laterite Soil", value: "Laterite" },
  { name: "Sandy Soil", value: "Sandy" },
];

const farmSizes = [
  { name: "Small (1-5 acres)", value: "1-5 acres" },
  { name: "Medium (5-15 acres)", value: "5-15 acres" },
  { name: "Large (15-50 acres)", value: "15-50 acres" },
  { name: "Very Large (50+ acres)", value: "50+ acres" },
];

const budgetRanges = [
  { name: "Low (₹200-500/hr)", value: "low" },
  { name: "Medium (₹500-1500/hr)", value: "medium" },
  { name: "High (₹1500-3000/hr)", value: "high" },
  { name: "Premium (₹3000+/hr)", value: "premium" },
];

const waterSources = [
  { name: "Canal Irrigation", value: "canal", icon: "💧" },
  { name: "Tube Well / Bore Well", value: "tubewell", icon: "🔧" },
  { name: "Rain-fed Only", value: "rainfed", icon: "🌧️" },
  { name: "Pond / Tank", value: "pond", icon: "🏞️" },
];

const farmingStages = [
  { name: "Land Preparation ", value: "Land Preparation", icon: "🚜" },
  { name: "Sowing", value: "Sowing", icon: "🌱" },
  { name: "Intercultural Operations", value: "Intercultural Operations", icon: "🔄" },
  { name: "Harvesting", value: "Harvesting", icon: "🌾" },
];

export interface FarmData {
  state: string;
  crop: string;
  soil: string;
  farmSize: string;
  budget: string;
  waterSource: string;
  farmingStage: string;
}

interface LocationSelectorProps {
  onLocationSelect: (data: FarmData) => void;
  isLoading?: boolean;
}

const LocationSelector = ({ onLocationSelect, isLoading }: LocationSelectorProps) => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedSoil, setSelectedSoil] = useState("");
  const [selectedFarmSize, setSelectedFarmSize] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedWaterSource, setSelectedWaterSource] = useState("");
  const [selectedFarmingStage, setSelectedFarmingStage] = useState("");
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStates = indianStates.filter(state => 
    state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isFormValid = selectedState && selectedCrop && selectedSoil && 
    selectedFarmSize && selectedBudget && selectedWaterSource && selectedFarmingStage;

  const handleSubmit = () => {
    if (isFormValid) {
      onLocationSelect({
        state: selectedState,
        crop: selectedCrop,
        soil: selectedSoil,
        farmSize: selectedFarmSize,
        budget: selectedBudget,
        waterSource: selectedWaterSource,
        farmingStage: selectedFarmingStage,
      });
    }
  };

  return (
    <section id="find" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Smart Selection</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Tell Us About Your Farm
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Provide detailed information for AI-powered personalized machinery recommendations
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="glass-card rounded-2xl p-6 md:p-8 shadow-elevated">
            <div className="grid md:grid-cols-2 gap-8">
              {/* State Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Select Your State
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsStateOpen(!isStateOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 border-border bg-background hover:border-primary/50 transition-colors text-left"
                  >
                    <span className={selectedState ? "text-foreground" : "text-muted-foreground"}>
                      {selectedState || "Choose a state..."}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isStateOpen ? "rotate-180" : ""}`} />
                  </button>
                  
                  {isStateOpen && (
                    <div className="absolute z-20 w-full mt-2 bg-card border border-border rounded-xl shadow-elevated overflow-hidden animate-scale-in">
                      <div className="p-2 border-b border-border">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Search state..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                          />
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredStates.map((state) => (
                          <button
                            key={state}
                            onClick={() => {
                              setSelectedState(state);
                              setIsStateOpen(false);
                              setSearchTerm("");
                            }}
                            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted transition-colors text-left"
                          >
                            <span className="text-sm">{state}</span>
                            {selectedState === state && <Check className="w-4 h-4 text-primary" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Farm Size Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-primary" />
                  Farm Size
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {farmSizes.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => setSelectedFarmSize(size.value)}
                      className={`px-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm ${
                        selectedFarmSize === size.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50 bg-background"
                      }`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Crop Selection */}
              <div className="space-y-3 md:col-span-2">
                <label className="text-sm font-medium text-foreground">
                  🌾 Select Your Crop
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {crops.map((crop) => (
                    <button
                      key={crop.value}
                      onClick={() => setSelectedCrop(crop.value)}
                      className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl border-2 transition-all duration-200 ${
                        selectedCrop === crop.value
                          ? "border-primary bg-primary/10 shadow-soft"
                          : "border-border hover:border-primary/50 bg-background"
                      }`}
                    >
                      <span className="text-2xl">{crop.icon}</span>
                      <span className="text-xs font-medium text-center">{crop.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Soil Type Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  🏔️ Soil Type
                </label>
                <div className="space-y-2">
                  {soilTypes.map((soil) => (
                    <button
                      key={soil.value}
                      onClick={() => setSelectedSoil(soil.value)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 transition-all duration-200 ${
                        selectedSoil === soil.value
                          ? "border-primary bg-primary/10 shadow-soft"
                          : "border-border hover:border-primary/50 bg-background"
                      }`}
                    >
                      {selectedSoil === soil.value && <Check className="w-4 h-4 text-primary" />}
                      <span className="text-sm font-medium">{soil.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Water Source */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-primary" />
                  Water Source
                </label>
                <div className="space-y-2">
                  {waterSources.map((source) => (
                    <button
                      key={source.value}
                      onClick={() => setSelectedWaterSource(source.value)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 transition-all duration-200 ${
                        selectedWaterSource === source.value
                          ? "border-primary bg-primary/10 shadow-soft"
                          : "border-border hover:border-primary/50 bg-background"
                      }`}
                    >
                      <span className="text-lg">{source.icon}</span>
                      <span className="text-sm font-medium">{source.name}</span>
                      {selectedWaterSource === source.value && <Check className="w-4 h-4 text-primary ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Farming Stage */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Current Farming Stage
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {farmingStages.map((stage) => (
                    <button
                      key={stage.value}
                      onClick={() => setSelectedFarmingStage(stage.value)}
                      className={`flex items-center gap-2 px-3 py-3 rounded-xl border-2 transition-all duration-200 ${
                        selectedFarmingStage === stage.value
                          ? "border-primary bg-primary/10 shadow-soft"
                          : "border-border hover:border-primary/50 bg-background"
                      }`}
                    >
                      <span className="text-lg">{stage.icon}</span>
                      <span className="text-xs font-medium">{stage.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-primary" />
                  Budget Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {budgetRanges.map((budget) => (
                    <button
                      key={budget.value}
                      onClick={() => setSelectedBudget(budget.value)}
                      className={`px-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm ${
                        selectedBudget === budget.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50 bg-background"
                      }`}
                    >
                      {budget.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 mt-4">
                <Button
                  variant="hero"
                  size="xl"
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⚙️</span>
                      AI Analyzing Your Farm...
                    </>
                  ) : (
                    "Get AI-Powered Recommendations 🤖"
                  )}
                </Button>
                {!isFormValid && (
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Please fill all fields to get accurate recommendations
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSelector;

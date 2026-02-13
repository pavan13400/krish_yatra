import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import LocationSelector, { FarmData } from "@/components/LocationSelector";
import MachineryResults from "@/components/MachineryResults";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
// import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AIResponse {
  success: boolean;
  recommendations: any[];
  strategyAdvice: string;
  seasonalTips: string;
  costSavingTips: string;
  farmData: FarmData;
}

const Index = () => {
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLocationSelect = async (data: FarmData) => {
    setIsLoading(true);
    setError(null);
    setAiResponse(null);

    // Scroll to results area
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    try {
      // const { data: responseData, error: funcError } = await supabase.functions.invoke(
      //   "recommend-machinery",
      //   { body: data }
      // );

      // if (funcError) {
      //   throw new Error(funcError.message);
      // }

      // if (responseData?.error) {
      //   if (responseData.error.includes("Rate limit")) {
      //     toast.error("Too many requests. Please try again in a moment.");
      //   } else if (responseData.error.includes("Payment")) {
      //     toast.error("Service temporarily unavailable. Please try again later.");
      //   }
      //   throw new Error(responseData.error);
      // }

      // setAiResponse(responseData);
      const payload = {
          state: data.state,
          crop: data.crop,
          soil: data.soil,
          farmSize: data.farmSize.includes("1-5") ? "Small"
                    : data.farmSize.includes("5-15") ? "Medium"
                    : "Large",
          budget: data.budget,
          waterSource: data.waterSource,
          stage: data.farmingStage,
          irrigation: data.waterSource === "rainfed" ? 0 : 1,
          mechanization: "Medium"
      };

      const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
      });

      if (!response.ok) {
      throw new Error("ML server error");
      }

      const responseData = await response.json();

      setAiResponse(responseData);
      toast.success("AI recommendations ready!");
    } catch (err) {
      console.error("Error getting recommendations:", err);
      setError(err instanceof Error ? err.message : "Failed to get recommendations");
      toast.error("Failed to get AI recommendations");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <LocationSelector onLocationSelect={handleLocationSelect} isLoading={isLoading} />
        <div id="results">
          <MachineryResults 
            aiResponse={aiResponse} 
            isLoading={isLoading} 
            error={error} 
          />
        </div>
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

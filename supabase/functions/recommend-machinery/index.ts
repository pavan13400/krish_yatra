import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FarmData {
  state: string;
  crop: string;
  soil: string;
  farmSize: string;
  budget: string;
  waterSource: string;
  farmingStage: string;
}

const machineryDatabase = [
  {
    id: 1,
    name: "Mahindra Arjun 605",
    nameHindi: "महिंद्रा अर्जुन 605 ट्रैक्टर",
    category: "Tractor",
    price: "₹800/hr",
    priceNumeric: 800,
    specs: {
      power: "55 HP Engine",
      fuelType: "Diesel",
      suitableFor: "All Soil Types",
      efficiency: "High",
      fuelConsumption: "4.5 L/hr",
      workingWidth: "2m",
    },
    suitableCrops: ["Rice", "Wheat", "Sugarcane", "Cotton", "Maize", "Pulses"],
    suitableSoils: ["Alluvial", "Black", "Red", "Laterite", "Sandy"],
    suitableStages: ["Land Preparation", "Sowing", "Intercultural Operations"],
    farmSizeRange: { min: 1, max: 50 },
    description: "Versatile tractor suitable for multiple farming operations with excellent fuel efficiency.",
  },
  {
    id: 2,
    name: "John Deere 5310",
    nameHindi: "जॉन डीयर 5310 ट्रैक्टर",
    category: "Tractor",
    price: "₹1,000/hr",
    priceNumeric: 1000,
    specs: {
      power: "55 HP Engine",
      fuelType: "Diesel",
      suitableFor: "Heavy Duty Work",
      efficiency: "Very High",
      fuelConsumption: "4.2 L/hr",
      workingWidth: "2.2m",
    },
    suitableCrops: ["Rice", "Wheat", "Sugarcane", "Cotton"],
    suitableSoils: ["Alluvial", "Black", "Red"],
    suitableStages: ["Land Preparation", "Sowing", "Harvesting Support"],
    farmSizeRange: { min: 5, max: 100 },
    description: "Premium tractor with superior build quality and lower maintenance costs.",
  },
  {
    id: 3,
    name: "John Deere Combine Harvester",
    nameHindi: "जॉन डीयर कंबाइन हार्वेस्टर",
    category: "Harvester",
    price: "₹2,500/hr",
    priceNumeric: 2500,
    specs: {
      power: "120 HP Engine",
      fuelType: "Diesel",
      suitableFor: "Wheat, Rice, Sugarcane",
      efficiency: "Very High",
      fuelConsumption: "12 L/hr",
      workingWidth: "3.5m",
    },
    suitableCrops: ["Wheat", "Rice", "Sugarcane", "Maize"],
    suitableSoils: ["Alluvial", "Black", "Red"],
    suitableStages: ["Harvesting"],
    farmSizeRange: { min: 10, max: 500 },
    description: "High-capacity combine harvester for efficient grain harvesting with minimal losses.",
  },
  {
    id: 4,
    name: "Heavy Duty Rotavator",
    nameHindi: "हेवी ड्यूटी रोटावेटर",
    category: "Tillage",
    price: "₹400/hr",
    priceNumeric: 400,
    specs: {
      power: "Works with 35+ HP",
      fuelType: "Tractor Attached",
      suitableFor: "Soil Preparation",
      efficiency: "High",
      fuelConsumption: "Included with Tractor",
      workingWidth: "1.8m",
    },
    suitableCrops: ["Rice", "Wheat", "Cotton", "Maize", "Pulses"],
    suitableSoils: ["Alluvial", "Black", "Red", "Laterite"],
    suitableStages: ["Land Preparation"],
    farmSizeRange: { min: 1, max: 50 },
    description: "Essential tillage equipment for thorough soil preparation and weed management.",
  },
  {
    id: 5,
    name: "Seed Drill Machine",
    nameHindi: "सीड ड्रिल मशीन",
    category: "Seeding",
    price: "₹350/hr",
    priceNumeric: 350,
    specs: {
      power: "Works with 35+ HP",
      fuelType: "Tractor Attached",
      suitableFor: "Precision Sowing",
      efficiency: "High",
      fuelConsumption: "Included with Tractor",
      workingWidth: "2.1m",
    },
    suitableCrops: ["Wheat", "Rice", "Pulses", "Cotton"],
    suitableSoils: ["Alluvial", "Black", "Red"],
    suitableStages: ["Sowing"],
    farmSizeRange: { min: 2, max: 100 },
    description: "Precision seed drill for uniform seed placement and optimal germination rates.",
  },
  {
    id: 6,
    name: "Boom Sprayer",
    nameHindi: "बूम स्प्रेयर",
    category: "Spraying",
    price: "₹300/hr",
    priceNumeric: 300,
    specs: {
      power: "Works with 25+ HP",
      fuelType: "Tractor Attached",
      suitableFor: "Pesticide/Fertilizer Application",
      efficiency: "Very High",
      fuelConsumption: "Included with Tractor",
      workingWidth: "10m",
    },
    suitableCrops: ["Rice", "Wheat", "Cotton", "Sugarcane", "Maize"],
    suitableSoils: ["All Types"],
    suitableStages: ["Intercultural Operations"],
    farmSizeRange: { min: 5, max: 200 },
    description: "Wide coverage sprayer for efficient pesticide and fertilizer application.",
  },
  {
    id: 7,
    name: "Laser Land Leveler",
    nameHindi: "लेजर लैंड लेवलर",
    category: "Land Preparation",
    price: "₹1,200/hr",
    priceNumeric: 1200,
    specs: {
      power: "Works with 50+ HP",
      fuelType: "Tractor Attached",
      suitableFor: "Precision Leveling",
      efficiency: "Very High",
      fuelConsumption: "Included with Tractor",
      workingWidth: "3m",
    },
    suitableCrops: ["Rice", "Wheat"],
    suitableSoils: ["Alluvial", "Black"],
    suitableStages: ["Land Preparation"],
    farmSizeRange: { min: 5, max: 100 },
    description: "GPS-guided precision leveler for optimal water distribution and yield improvement.",
  },
  {
    id: 8,
    name: "Sugarcane Harvester",
    nameHindi: "गन्ना हार्वेस्टर",
    category: "Harvester",
    price: "₹3,500/hr",
    priceNumeric: 3500,
    specs: {
      power: "200 HP Engine",
      fuelType: "Diesel",
      suitableFor: "Sugarcane Harvesting",
      efficiency: "Very High",
      fuelConsumption: "18 L/hr",
      workingWidth: "Single Row",
    },
    suitableCrops: ["Sugarcane"],
    suitableSoils: ["Alluvial", "Black"],
    suitableStages: ["Harvesting"],
    farmSizeRange: { min: 10, max: 500 },
    description: "Specialized harvester for efficient sugarcane cutting and loading.",
  },
  {
    id: 9,
    name: "Paddy Transplanter",
    nameHindi: "धान रोपाई मशीन",
    category: "Planting",
    price: "₹600/hr",
    priceNumeric: 600,
    specs: {
      power: "4 HP Engine",
      fuelType: "Petrol",
      suitableFor: "Rice Transplanting",
      efficiency: "High",
      fuelConsumption: "1.5 L/hr",
      workingWidth: "1.8m (6 rows)",
    },
    suitableCrops: ["Rice"],
    suitableSoils: ["Alluvial", "Laterite"],
    suitableStages: ["Sowing"],
    farmSizeRange: { min: 2, max: 50 },
    description: "Mechanical transplanter for uniform paddy planting with reduced labor costs.",
  },
  {
    id: 10,
    name: "Cotton Picker",
    nameHindi: "कपास पिकर मशीन",
    category: "Harvester",
    price: "₹2,800/hr",
    priceNumeric: 2800,
    specs: {
      power: "180 HP Engine",
      fuelType: "Diesel",
      suitableFor: "Cotton Harvesting",
      efficiency: "Very High",
      fuelConsumption: "15 L/hr",
      workingWidth: "2 Rows",
    },
    suitableCrops: ["Cotton"],
    suitableSoils: ["Black", "Red"],
    suitableStages: ["Harvesting"],
    farmSizeRange: { min: 20, max: 500 },
    description: "Efficient mechanical cotton harvester reducing manual picking labor.",
  },
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const farmData: FarmData = await req.json();
    console.log("Received farm data:", farmData);
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Create a detailed prompt for the AI
    const systemPrompt = `You are an expert agricultural machinery recommendation system for Indian farmers. 
Your task is to analyze farm conditions and recommend the most suitable machinery.

You have access to this machinery database:
${JSON.stringify(machineryDatabase, null, 2)}

Analyze the farmer's conditions and return a JSON response with:
1. Top 3-5 recommended machinery IDs ranked by suitability
2. A match score (0-100) for each machinery
3. Specific reasons why each machinery is recommended
4. Any warnings or considerations
5. An overall farming strategy recommendation

Consider these factors:
- Soil type compatibility
- Crop suitability  
- Farm size requirements
- Budget constraints
- Current farming stage needs
- Water source availability
- Regional conditions based on state

Return ONLY valid JSON in this exact format:
{
  "recommendations": [
    {
      "id": number,
      "matchScore": number,
      "reasons": ["reason1", "reason2"],
      "warnings": ["warning1"] or []
    }
  ],
  "strategyAdvice": "Overall farming strategy advice in Hindi and English",
  "seasonalTips": "Tips specific to current season",
  "costSavingTips": "Ways to optimize machinery usage costs"
}`;

    const userPrompt = `Analyze this Indian farmer's conditions and recommend optimal machinery:

State: ${farmData.state}
Primary Crop: ${farmData.crop}
Soil Type: ${farmData.soil}
Farm Size: ${farmData.farmSize}
Budget Range: ${farmData.budget}
Water Source: ${farmData.waterSource}
Current Farming Stage: ${farmData.farmingStage}

Provide detailed recommendations considering all these factors. Give higher priority to machinery that:
1. Matches the specific crop requirements
2. Works well with the soil type mentioned
3. Fits the farm size
4. Stays within budget
5. Is relevant to the current farming stage`;

    console.log("Calling AI Gateway for recommendations...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log("AI Response received");

    const content = aiResponse.choices?.[0]?.message?.content || "";
    
    // Parse the JSON from the AI response
    let aiRecommendations;
    try {
      // Extract JSON from the response (handle markdown code blocks)
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      aiRecommendations = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Fallback to rule-based recommendations
      aiRecommendations = {
        recommendations: machineryDatabase.slice(0, 4).map((m, i) => ({
          id: m.id,
          matchScore: 90 - i * 10,
          reasons: [`Suitable for ${farmData.crop}`, `Compatible with ${farmData.soil}`],
          warnings: []
        })),
        strategyAdvice: "AI recommendations are temporarily unavailable. Showing general recommendations.",
        seasonalTips: "Consider local weather conditions when planning machinery usage.",
        costSavingTips: "Book machinery during off-peak hours for better rates."
      };
    }

    // Enhance recommendations with full machinery data
    const enrichedRecommendations = aiRecommendations.recommendations.map((rec: any) => {
      const machinery = machineryDatabase.find(m => m.id === rec.id);
      if (!machinery) return null;
      return {
        ...machinery,
        matchScore: rec.matchScore,
        aiReasons: rec.reasons,
        warnings: rec.warnings,
        isRecommended: rec.matchScore >= 80,
      };
    }).filter(Boolean);

    return new Response(JSON.stringify({
      success: true,
      recommendations: enrichedRecommendations,
      strategyAdvice: aiRecommendations.strategyAdvice,
      seasonalTips: aiRecommendations.seasonalTips,
      costSavingTips: aiRecommendations.costSavingTips,
      farmData: farmData,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in recommend-machinery function:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

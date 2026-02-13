import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Predict = () => {
    const [formData, setFormData] = useState({
    state: "",
    farm_size: "",
    crop_type: "",
    soil_type: "",
    water_source: "",
    farming_stage: "",
    budget_range: ""
    });


  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      setResult(data.recommended_machinery);

    } catch (error) {
      setResult("Prediction failed");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Farm Buddy – Machinery Recommendation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.keys(formData).map((key) => (
              <Input
                key={key}
                name={key}
                placeholder={key.replace("_", " ")}
                value={(formData as any)[key]}
                onChange={handleChange}
                required
              />
            ))}

            <Button type="submit" disabled={loading}>
              {loading ? "Predicting..." : "Predict Machinery"}
            </Button>
          </form>

          {result && (
            <div className="mt-4 text-lg font-semibold">
              Recommended Machinery: <span className="text-green-600">{result}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Predict;

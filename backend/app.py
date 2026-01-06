from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

model = joblib.load("rf_machinery_model.pkl")
encoders = joblib.load("label_encoders.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    # Order must match training
    input_features = [
        encoders["state"].transform([data["state"]])[0],
        encoders["farm_size"].transform([data["farmSize"]])[0],
        encoders["crop_type"].transform([data["crop"]])[0],
        encoders["soil_type"].transform([data["soil"]])[0],
        encoders["water_source"].transform([data["waterSource"]])[0],
        encoders["farming_stage"].transform([data["stage"]])[0],
        encoders["budget_range"].transform([data["budget"]])[0],
        data["irrigation"],
        encoders["mechanization_level"].transform([data["mechanization"]])[0],
    ]

    probs = model.predict_proba([input_features])[0]
    classes = model.classes_

    top_indices = np.argsort(probs)[::-1][:3]

    recommendations = []
    for i, idx in enumerate(top_indices):
        machine = encoders["machinery"].inverse_transform([classes[idx]])[0]
        score = int(probs[idx] * 100)

        recommendations.append({
            "id": i + 1,
            "name": machine,
            "category": machine,
            "price": "₹1,200/day",
            "priceNumeric": 1200,
            "specs": {
                "power": "45–60 HP",
                "fuelType": "Diesel",
                "suitableFor": data["crop"]
            },
            "description": f"Best suited for {data['crop']} farming in {data['state']}",
            "matchScore": score,
            "aiReasons": [
                f"Suitable for {data['soil']} soil",
                f"Matches {data['farmSize']} farms"
            ],
            "warnings": score < 60 and ["May increase fuel cost"] or [],
            "isRecommended": i == 0
        })

    return jsonify({
        "success": True,
        "recommendations": recommendations,
        "strategyAdvice": "Use mechanization to reduce labor cost.",
        "seasonalTips": "Plan machinery usage before peak season.",
        "costSavingTips": "Rent instead of buying for small farms.",
        "farmData": data
    })

if __name__ == "__main__":
    app.run(debug=True)

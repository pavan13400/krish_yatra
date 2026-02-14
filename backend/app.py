from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import warnings
import os

warnings.filterwarnings("ignore", category=UserWarning)

app = Flask(__name__)
CORS(app)

# Safe absolute paths (Render-friendly)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model = joblib.load(os.path.join(BASE_DIR, "crop_model.pkl"))
encoders = joblib.load(os.path.join(BASE_DIR, "label_encoders.pkl"))

def normalize_input(data):
    return {
        "state": data.get("state", "").title(),
        "crop": data.get("crop", "").title(),
        "soil": data.get("soil", "").title(),
        "farm_size": (
            "Small" if "1-5" in data.get("farmSize", "")
            else "Medium" if "5-15" in data.get("farmSize", "")
            else "Large"
        ),
        "budget": data.get("budget", "").capitalize(),
        "water_source": (
            "Rainfed" if data.get("waterSource", "").lower() == "rainfed"
            else "Canal" if data.get("waterSource", "").lower() == "canal"
            else "Borewell"
        ),
        "stage": data.get("stage", "").title(),
        "irrigation": int(data.get("irrigation", 0)),
        "mechanization": data.get("mechanization", "Medium").capitalize()
    }

def safe_encode(encoder, value):
    if value in encoder.classes_:
        return encoder.transform([value])[0]
    # fallback to most common class
    return encoder.transform([encoder.classes_[0]])[0]\

@app.route("/", methods=["GET"])
def health():
    return jsonify({
        "status": "Krish Yatra backend running 🚀"
    })

@app.route("/predict", methods=["POST"])
def predict():
    try:
        raw = request.json
        data = normalize_input(raw)

        features = [
            safe_encode(encoders["state"], data["state"]),
            safe_encode(encoders["farm_size"], data["farm_size"]),
            safe_encode(encoders["crop_type"], data["crop"]),
            safe_encode(encoders["soil_type"], data["soil"]),
            safe_encode(encoders["water_source"], data["water_source"]),
            safe_encode(encoders["farming_stage"], data["stage"]),
            safe_encode(encoders["budget_range"], data["budget"]),
            data["irrigation"],
            safe_encode(encoders["mechanization_level"], data["mechanization"])
        ]

        probs = model.predict_proba([features])[0]
        classes = model.classes_

        top = probs.argsort()[::-1][:3]

        recommendations = []
        for i, idx in enumerate(top):
            machine = encoders["machinery"].inverse_transform([classes[idx]])[0]
            score = int(probs[idx] * 100)

            recommendations.append({
                "id": i + 1,
                "name": machine,
                "category": machine,
                "price": "₹1200/day",
                "priceNumeric": 1200,
                "specs": {
                    "power": "45–60 HP",
                    "fuelType": "Diesel",
                    "suitableFor": data["crop"]
                },
                "description": f"Best suited for {data['crop']} farming",
                "matchScore": score,
                "aiReasons": [
                    f"Suitable for {data['soil']} soil",
                    f"Works well for {data['farm_size']} farms"
                ],
                "warnings": [] if score > 60 else ["May be less cost-effective"],
                "isRecommended": i == 0
            })

        return jsonify({
            "success": True,
            "recommendations": recommendations,
            "strategyAdvice": "Use mechanization to reduce labor dependency.",
            "seasonalTips": "Book machinery early during peak season.",
            "costSavingTips": "Rent instead of buying for small farms.",
            "farmData": raw
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


import pandas as pd
import joblib
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Initialize FastAPI app
app = FastAPI(
    title="Heart Disease Prediction API",
    description="An API to predict the likelihood of heart disease based on clinical features.",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, specify the actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the preprocessing pipeline and the trained model
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PREPROCESSOR_PATH = os.path.join(BASE_DIR, "models", "preprocessor.joblib")
MODEL_PATH = os.path.join(BASE_DIR, "models", "Optimized_Random_Forest.joblib")

try:
    preprocessor = joblib.load(PREPROCESSOR_PATH)
    model = joblib.load(MODEL_PATH)
    print("✅ Successfully loaded Preprocessor and Optimized Random Forest Model.")
except Exception as e:
    print(f"❌ Error loading model or preprocessor: {e}")
    preprocessor, model = None, None

# Define the Pydantic schema for the input JSON
class HeartDiseaseInput(BaseModel):
    age: float = Field(..., example=63.0)
    sex: int = Field(..., description="1 = male, 0 = female", example=1)
    cp: int = Field(..., description="Chest pain type (1-4)", example=3)
    trestbps: float = Field(..., description="Resting blood pressure", example=145.0)
    chol: float = Field(..., description="Serum cholestoral in mg/dl", example=233.0)
    fbs: int = Field(..., description="Fasting blood sugar > 120 mg/dl (1 = true; 0 = false)", example=1)
    restecg: int = Field(..., description="Resting electrocardiographic results (0-2)", example=0)
    thalach: float = Field(..., description="Maximum heart rate achieved", example=150.0)
    exang: int = Field(..., description="Exercise induced angina (1 = yes; 0 = no)", example=0)
    oldpeak: float = Field(..., description="ST depression induced by exercise relative to rest", example=2.3)
    slope: int = Field(..., description="The slope of the peak exercise ST segment (1-3)", example=0)
    ca: float = Field(..., description="Number of major vessels (0-3) colored by flourosopy", example=0.0)
    thal: float = Field(..., description="3 = normal; 6 = fixed defect; 7 = reversable defect", example=6.0)

# Define the Output schema
class PredictionOutput(BaseModel):
    prediction: int
    probability: float
    message: str

@app.get("/")
def health_check():
    return {"status": "ok", "message": "Heart Disease Prediction API is running!"}

@app.post("/predict", response_model=PredictionOutput)
def predict(data: HeartDiseaseInput):
    if preprocessor is None or model is None:
        raise HTTPException(status_code=500, detail="Model is not loaded properly.")
    
    # Convert input to a DataFrame (the preprocessor expects a DataFrame)
    df = pd.DataFrame([data.dict()])
    
    try:
        # Preprocess features
        X_processed = preprocessor.transform(df)
        
        # Make prediction
        pred = model.predict(X_processed)[0]
        prob = model.predict_proba(X_processed)[0][1] # Probability of class 1
        
        message = "High risk of heart disease." if pred == 1 else "Low risk of heart disease."
        
        return PredictionOutput(
            prediction=int(pred),
            probability=float(prob),
            message=message
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")

# To run locally: uvicorn main:app --reload

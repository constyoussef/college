"use client";

import { useState } from "react";

type PatientData = {
  age: number | "";
  sex: number | "";
  cp: number | "";
  trestbps: number | "";
  chol: number | "";
  fbs: number | "";
  restecg: number | "";
  thalach: number | "";
  exang: number | "";
  oldpeak: number | "";
  slope: number | "";
  ca: number | "";
  thal: number | "";
};

type PredictionResult = {
  prediction: number;
  probability: number;
  message: string;
};

export default function Home() {
  const [formData, setFormData] = useState<PatientData>({
    age: 50,
    sex: 1,
    cp: 3,
    trestbps: 130,
    chol: 240,
    fbs: 0,
    restecg: 1,
    thalach: 150,
    exang: 0,
    oldpeak: 1.0,
    slope: 1,
    ca: 0,
    thal: 3,
  });

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? "" : parseFloat(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    // Prepare numeric payload, falling back to 0 for any empty fields
    const payload = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        value === "" ? 0 : value,
      ]),
    );

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          "Failed to connect to the prediction API. Make sure the backend is running.",
        );
      }

      const data = await response.json();
      setResult(data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <div className="header">
        <h1>CardiAI Predictor</h1>
        <p>Advanced Heart Disease Prediction System powered by ML</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="input-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="1"
                max="120"
                required
              />
            </div>

            <div className="input-group">
              <label>Sex</label>
              <select name="sex" value={formData.sex} onChange={handleChange}>
                <option value={1}>Male</option>
                <option value={0}>Female</option>
              </select>
            </div>

            <div className="input-group">
              <label>Chest Pain (CP)</label>
              <select name="cp" value={formData.cp} onChange={handleChange}>
                <option value={1}>Typical Angina</option>
                <option value={2}>Atypical Angina</option>
                <option value={3}>Non-Anginal</option>
                <option value={4}>Asymptomatic</option>
              </select>
            </div>

            <div className="input-group">
              <label>Resting BP (mm Hg)</label>
              <input
                type="number"
                name="trestbps"
                value={formData.trestbps}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Cholesterol (mg/dl)</label>
              <input
                type="number"
                name="chol"
                value={formData.chol}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Fasting Blood Sugar</label>
              <select name="fbs" value={formData.fbs} onChange={handleChange}>
                <option value={0}>Below 120 mg/dl</option>
                <option value={1}>Above 120 mg/dl</option>
              </select>
            </div>

            <div className="input-group">
              <label>Resting ECG</label>
              <select
                name="restecg"
                value={formData.restecg}
                onChange={handleChange}
              >
                <option value={0}>Normal</option>
                <option value={1}>ST-T Wave Abnormality</option>
                <option value={2}>Ventricular Hypertrophy</option>
              </select>
            </div>

            <div className="input-group">
              <label>Max Heart Rate (thalach)</label>
              <input
                type="number"
                name="thalach"
                value={formData.thalach}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Exercise Angina</label>
              <select
                name="exang"
                value={formData.exang}
                onChange={handleChange}
              >
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </select>
            </div>

            <div className="input-group">
              <label>ST Depression (oldpeak)</label>
              <input
                type="number"
                name="oldpeak"
                value={formData.oldpeak}
                step="0.1"
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>ST Slope</label>
              <select
                name="slope"
                value={formData.slope}
                onChange={handleChange}
              >
                <option value={1}>Upsloping</option>
                <option value={2}>Flat</option>
                <option value={3}>Downsloping</option>
              </select>
            </div>

            <div className="input-group">
              <label>Major Vessels (0-3)</label>
              <input
                type="number"
                name="ca"
                value={formData.ca}
                min="0"
                max="3"
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Thalassemia</label>
              <select name="thal" value={formData.thal} onChange={handleChange}>
                <option value={3}>Normal</option>
                <option value={6}>Fixed Defect</option>
                <option value={7}>Reversable Defect</option>
              </select>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading
              ? "Analyzing Clinical Data..."
              : "Generate Risk Assessment"}
          </button>
        </form>

        {error && (
          <div className="result-card danger" style={{ marginTop: "2rem" }}>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div
            className={`result-card ${result.prediction === 1 ? "danger" : "success"}`}
          >
            <h2 className="result-title">{result.message}</h2>
            <p className="result-prob">
              Calculated Probability: {(result.probability * 100).toFixed(1)}%
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

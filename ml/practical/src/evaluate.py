import os
import glob
import numpy as np
import pandas as pd
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

def load_test_data():
    X_test = np.load("../data/processed/X_test.npy")
    y_test = np.load("../data/processed/y_test.npy")
    return X_test, y_test

def evaluate_models():
    print("Starting Model Evaluation...\n")
    X_test, y_test = load_test_data()
    
    # Get all saved models
    model_files = glob.glob("../models/*.joblib")
    # Filter out preprocessor if it's there
    model_files = [f for f in model_files if "preprocessor" not in f]
    
    os.makedirs("../notebooks/plots/confusion_matrices", exist_ok=True)
    
    results = []
    
    for model_path in model_files:
        model_name = os.path.basename(model_path).replace('.joblib', '')
        model = joblib.load(model_path)
        
        # Predict
        y_pred = model.predict(X_test)
        
        # Calculate metrics
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, zero_division=0)
        rec = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        
        results.append({
            "Model": model_name,
            "Accuracy": acc,
            "Precision": prec,
            "Recall": rec,
            "F1 Score": f1
        })
        
        # Confusion Matrix
        cm = confusion_matrix(y_test, y_pred)
        
        # Plot Confusion Matrix
        plt.figure(figsize=(5, 4))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', cbar=False)
        plt.title(f'{model_name} - Confusion Matrix')
        plt.xlabel('Predicted Label')
        plt.ylabel('True Label')
        plt.tight_layout()
        plt.savefig(f"../notebooks/plots/confusion_matrices/{model_name}_cm.png")
        plt.close()
        
    # Create DataFrame for results
    results_df = pd.DataFrame(results)
    # Sort by F1 Score descending
    results_df = results_df.sort_values(by="F1 Score", ascending=False).reset_index(drop=True)
    
    print("--- Model Comparison ---")
    print(results_df.to_string(index=False))
    
    # Best Model
    best_model_name = results_df.iloc[0]["Model"]
    best_f1 = results_df.iloc[0]["F1 Score"]
    print(f"\n🏆 Best Model based on F1 Score: **{best_model_name}** (F1: {best_f1:.4f})")
    
    # Save results to CSV
    results_df.to_csv("../data/processed/evaluation_results.csv", index=False)
    print("\nResults saved to '../data/processed/evaluation_results.csv'")
    print("Confusion matrices saved to '../notebooks/plots/confusion_matrices/'")

if __name__ == "__main__":
    # Ensure matplotlib doesn't hang in headless mode
    import matplotlib
    matplotlib.use('Agg')
    evaluate_models()

import os
import numpy as np
import joblib

# Base Models
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier

# Advanced Models
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier
from catboost import CatBoostClassifier

def load_data():
    print("Loading preprocessed training data...")
    X_train = np.load("../data/processed/X_train.npy")
    y_train = np.load("../data/processed/y_train.npy")
    return X_train, y_train

def get_models():
    """Returns a dictionary of all models to train."""
    models = {
        "Logistic_Regression": LogisticRegression(max_iter=1000, random_state=42),
        "KNN": KNeighborsClassifier(),
        "SVM_Linear": SVC(kernel="linear", probability=True, random_state=42),
        "SVM_Kernel": SVC(kernel="rbf", probability=True, random_state=42),
        "Naive_Bayes": GaussianNB(),
        "Decision_Tree": DecisionTreeClassifier(random_state=42),
        "Random_Forest": RandomForestClassifier(random_state=42),
        "Gradient_Boosting": GradientBoostingClassifier(random_state=42),
        "XGBoost": XGBClassifier(use_label_encoder=False, eval_metric="logloss", random_state=42),
        "LightGBM": LGBMClassifier(random_state=42, verbose=-1),
        "CatBoost": CatBoostClassifier(verbose=0, random_state=42)
    }
    return models

def train_and_save_models():
    X_train, y_train = load_data()
    models = get_models()
    
    os.makedirs("../models", exist_ok=True)
    
    print(f"Starting training for {len(models)} models...")
    for name, model in models.items():
        print(f"Training {name}...")
        model.fit(X_train, y_train)
        
        # Save model
        model_path = f"../models/{name}.joblib"
        joblib.dump(model, model_path)
        print(f"  -> Saved to {model_path}")

    print("\nAll models trained and saved successfully!")

if __name__ == "__main__":
    train_and_save_models()

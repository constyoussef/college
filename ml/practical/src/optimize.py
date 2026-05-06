import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

def optimize_random_forest():
    print("Loading data for optimization...")
    X_train = np.load("../data/processed/X_train.npy")
    y_train = np.load("../data/processed/y_train.npy")
    X_test = np.load("../data/processed/X_test.npy")
    y_test = np.load("../data/processed/y_test.npy")
    
    print("Setting up GridSearchCV for Random Forest...")
    rf = RandomForestClassifier(random_state=42)
    
    # Define hyperparameter grid
    param_grid = {
        'n_estimators': [50, 100, 200],
        'max_depth': [None, 10, 20, 30],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4],
        'bootstrap': [True, False]
    }
    
    # 5-fold cross-validation
    grid_search = GridSearchCV(
        estimator=rf, 
        param_grid=param_grid, 
        cv=5, 
        n_jobs=-1, # Use all available CPU cores
        scoring='f1', # Optimize for F1 score
        verbose=1
    )
    
    print("Running optimization (this might take a minute)...")
    grid_search.fit(X_train, y_train)
    
    best_params = grid_search.best_params_
    best_model = grid_search.best_estimator_
    
    print("\n--- Optimization Results ---")
    print(f"Best Hyperparameters: {best_params}")
    print(f"Best Cross-Validation F1 Score: {grid_search.best_score_:.4f}")
    
    # Evaluate the optimized model on the test set
    y_pred = best_model.predict(X_test)
    
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    
    print("\n--- Optimized Model Test Set Evaluation ---")
    print(f"Accuracy:  {acc:.4f}")
    print(f"Precision: {prec:.4f}")
    print(f"Recall:    {rec:.4f}")
    print(f"F1 Score:  {f1:.4f}")
    
    # Save optimized model
    save_path = "../models/Optimized_Random_Forest.joblib"
    joblib.dump(best_model, save_path)
    print(f"\nSaved optimized model to: {save_path}")

if __name__ == "__main__":
    optimize_random_forest()

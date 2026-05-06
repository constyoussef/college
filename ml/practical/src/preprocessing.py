import os
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

def load_and_clean_data(filepath="../data/raw_heart_disease.csv"):
    """Loads dataset and performs basic cleaning and target transformation."""
    df = pd.read_csv(filepath)
    
    # Target transformation: The original 'num' is 0 (no disease) to 4 (severe).
    # We will convert this into a binary classification problem: 0 = No, 1 = Yes
    df['target'] = df['num'].apply(lambda x: 1 if x > 0 else 0)
    df = df.drop(columns=['num'])
    
    # Separate features and target
    X = df.drop(columns=['target'])
    y = df['target']
    
    return X, y

def build_preprocessor():
    """Builds a scikit-learn ColumnTransformer for preprocessing."""
    # Define feature types
    numeric_features = ['age', 'trestbps', 'chol', 'thalach', 'oldpeak']
    # sex, fbs, and exang are already binary (0 or 1), they can pass through or be handled.
    binary_features = ['sex', 'fbs', 'exang']
    categorical_features = ['cp', 'restecg', 'slope', 'ca', 'thal']

    # 1. Numeric pipeline: Impute missing (just in case) and Scale
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    # 2. Categorical pipeline: Impute missing (mode) and One-Hot Encode
    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])

    # 3. Combine into ColumnTransformer
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features),
            ('bin', 'passthrough', binary_features) # Leave binary features as is
        ])
    
    return preprocessor

def run_preprocessing():
    print("Starting Data Preprocessing...")
    
    X, y = load_and_clean_data()
    print(f"Data loaded. Features shape: {X.shape}, Target distribution: {y.value_counts().to_dict()}")

    # Train/Test Split (80/20)
    # Stratify ensures the same ratio of 0s and 1s in train and test
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    print(f"Split data -> Train: {X_train.shape[0]}, Test: {X_test.shape[0]}")

    preprocessor = build_preprocessor()

    # Fit on training data and transform BOTH train and test
    # (Doing this prevents data leakage from test set to training set)
    X_train_processed = preprocessor.fit_transform(X_train)
    X_test_processed = preprocessor.transform(X_test)
    
    print(f"Preprocessing applied. Processed Train Features Shape: {X_train_processed.shape}")

    # Ensure directories exist
    os.makedirs("../models", exist_ok=True)
    os.makedirs("../data/processed", exist_ok=True)

    # Save the fitted preprocessor for later use in API and Evaluation
    preprocessor_path = "../models/preprocessor.joblib"
    joblib.dump(preprocessor, preprocessor_path)
    print(f"Saved preprocessor pipeline to: {preprocessor_path}")

    # Save processed numpy arrays
    import numpy as np
    np.save("../data/processed/X_train.npy", X_train_processed)
    np.save("../data/processed/X_test.npy", X_test_processed)
    np.save("../data/processed/y_train.npy", y_train.values)
    np.save("../data/processed/y_test.npy", y_test.values)
    print("Saved processed datasets to '../data/processed/'")
    print("Preprocessing successfully completed!")

if __name__ == "__main__":
    run_preprocessing()

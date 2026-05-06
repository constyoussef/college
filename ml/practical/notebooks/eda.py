import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

def main():
    print("Loading Heart Disease dataset from CSV...")
    
    # Define column names as per UCI Cleveland dataset
    columns = [
        "age", "sex", "cp", "trestbps", "chol", "fbs", "restecg",
        "thalach", "exang", "oldpeak", "slope", "ca", "thal", "num"
    ]
    
    csv_path = "../data/raw_heart_disease.csv"
    df = pd.read_csv(csv_path, names=columns, na_values="?")

    print("\n--- First 5 Rows ---")
    print(df.head())

    print("\n--- Features Info ---")
    print(df.info())

    print("\n--- Missing Values ---")
    missing_vals = df.isnull().sum()
    print(missing_vals[missing_vals > 0])

    print("\n--- Summary Statistics ---")
    print(df.describe())

    # Ensure directories exist
    os.makedirs("plots", exist_ok=True)

    # Save to CSV with headers
    df.to_csv(csv_path, index=False)
    print(f"\nSaved raw dataset with headers back to: {csv_path}")

    # Visualizations
    sns.set_theme(style="whitegrid")
    
    # 1. Target Distribution
    plt.figure(figsize=(8, 5))
    sns.countplot(data=df, x='num', palette='viridis', hue='num', legend=False)
    plt.title('Target Distribution (0 = No Disease, 1-4 = Disease Severity)')
    plt.xlabel('Heart Disease (num)')
    plt.ylabel('Count')
    plt.savefig('plots/target_distribution.png')
    plt.close()

    # 2. Correlation Matrix
    plt.figure(figsize=(12, 10))
    corr = df.corr()
    sns.heatmap(corr, annot=True, cmap='coolwarm', fmt=".2f")
    plt.title('Feature Correlation Matrix')
    plt.tight_layout()
    plt.savefig('plots/correlation_matrix.png')
    plt.close()

    print("\nEDA completed. Plots saved to 'notebooks/plots/'")

if __name__ == "__main__":
    main()

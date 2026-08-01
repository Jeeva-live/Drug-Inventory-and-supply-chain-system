import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.metrics import precision_score, recall_score, f1_score, accuracy_score
import random

def validate_anomaly_model():
    print("Generating validation dataset with known anomalies...")
    
    # parameters
    n_samples = 1000
    n_anomalies = 50 # 5%
    
    # 1. Generate Normal Data (Gaussian distribution)
    # Mean=100, Std=10
    normal_data = np.random.normal(loc=100, scale=10, size=n_samples - n_anomalies)
    
    # 2. Generate Anomalies
    # Spikes (very high) and Drops (very low)
    anomalies_high = np.random.uniform(low=200, high=500, size=n_anomalies // 2)
    anomalies_low = np.random.uniform(low=0, high=20, size=n_anomalies - (n_anomalies // 2))
    anomalies = np.concatenate([anomalies_high, anomalies_low])
    
    # Combine
    data = np.concatenate([normal_data, anomalies])
    
    # Create Ground Truth Labels
    # Normal = 1, Anomaly = -1 (Standard Isolation Forest output)
    y_true = np.concatenate([np.ones(len(normal_data)), -1 * np.ones(len(anomalies))])
    
    # Shuffle for realism
    indices = np.arange(len(data))
    np.random.shuffle(indices)
    data = data[indices]
    y_true = y_true[indices]
    
    df = pd.DataFrame(data, columns=['value'])
    
    print("Training Isolation Forest...")
    # Using same params as app.py
    iso_forest = IsolationForest(contamination=n_anomalies/n_samples, random_state=42)
    
    # Predict
    # Returns -1 for outliers and 1 for inliers
    y_pred = iso_forest.fit_predict(df[['value']])
    
    # Calculate Metrics
    # Note: scikit-learn metrics usually expects 1 for positive class (anomaly). 
    # But Isolation Forest returns -1 for anomaly.
    # Let's map: Anomaly (-1) -> 1, Normal (1) -> 0 for metric calc
    y_true_binary = [1 if x == -1 else 0 for x in y_true]
    y_pred_binary = [1 if x == -1 else 0 for x in y_pred]
    
    precision = precision_score(y_true_binary, y_pred_binary)
    recall = recall_score(y_true_binary, y_pred_binary)
    f1 = f1_score(y_true_binary, y_pred_binary)
    acc = accuracy_score(y_true_binary, y_pred_binary)
    
    print("\n--- Isolation Forest Performance ---")
    print(f"Total Samples: {n_samples}")
    print(f"True Anomalies Injected: {n_anomalies}")
    print(f"Detected Anomalies: {sum(y_pred_binary)}")
    print("-" * 30)
    print(f"Accuracy: {acc*100:.2f}%")
    print(f"Precision: {precision:.4f}")
    print(f"Recall: {recall:.4f}")
    print(f"F1 Score: {f1:.4f}")
    
    # Save to file
    with open("anomaly_validation_output.txt", "w") as f:
        f.write(f"Accuracy: {acc*100:.2f}%\n")
        f.write(f"Precision: {precision:.4f}\n")
        f.write(f"Recall: {recall:.4f}\n")
        f.write(f"F1 Score: {f1:.4f}\n")

if __name__ == "__main__":
    validate_anomaly_model()

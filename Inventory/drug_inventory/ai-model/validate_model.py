import pandas as pd
from prophet import Prophet
from sklearn.metrics import mean_absolute_error, mean_squared_error
import numpy as np
import os
import json

DATA_PATH = os.path.join('data', 'inventory_data.csv')

def validate_model():
    print("Loading data...")
    if not os.path.exists(DATA_PATH):
        print("Data file not found!")
        return

    df = pd.read_csv(DATA_PATH)
    products = df['product_id'].unique()
    
    results = []
    
    print(f"Validating model across {len(products)} products...")
    
    for pid in products:
        # Prepare data
        p_df = df[df['product_id'] == pid].copy()
        p_df = p_df.groupby('timestamp').agg({'daily_sales': 'sum'}).reset_index()
        p_df.rename(columns={'timestamp': 'ds', 'daily_sales': 'y'}, inplace=True)
        p_df['ds'] = pd.to_datetime(p_df['ds'])
        p_df = p_df.sort_values('ds')
        
        if len(p_df) < 30:
            print(f"Skipping {pid}: Not enough data")
            continue

        # Split Train/Test (Last 30 days for testing)
        train = p_df.iloc[:-30]
        test = p_df.iloc[-30:]
        
        if len(train) < 30: 
            continue
            
        # Train
        model = Prophet(
            daily_seasonality=True,
            yearly_seasonality=True,
            weekly_seasonality=True,
            changepoint_prior_scale=0.1,
            seasonality_prior_scale=10.0
        )
        model.fit(train)
        
        # Predict
        future = model.make_future_dataframe(periods=len(test))
        forecast = model.predict(future)
        
        # Evaluate
        predictions = forecast.tail(len(test))['yhat'].values
        actuals = test['y'].values
        
        # Metrics
        mae = mean_absolute_error(actuals, predictions)
        rmse = np.sqrt(mean_squared_error(actuals, predictions))
        
        avg_sales = actuals.mean()
        # Relative error (approximate)
        error_pct = (mae / avg_sales) * 100 if avg_sales > 0 else 0
        
        # Calculate Classification Metrics (Accuracy, Precision, Recall, F1)
        # Definition of "Correct Prediction": Error <= 20%
        threshold = 0.20
        y_true_class = [] # Always 1 (Demand existed)
        y_pred_class = [] # 1 if prediction close, 0 if far off
        
        for a, p in zip(actuals, predictions):
            if a == 0: continue # Avoid div by zero
            
            # If actual demand exists, we consider it a "Positive" instance of demand
            y_true_class.append(1)
            
            # If prediction is within threshold, we consider it a "True Positive" detection of that demand
            # If prediction is way off, it's a "False Negative" (Missed the mark)
            relative_error = abs(a - p) / a
            if relative_error <= threshold:
                y_pred_class.append(1)
            else:
                y_pred_class.append(0)
                
        # Calculate for this product
        from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
        
        # Handle edge case where all are 0
        if len(y_true_class) > 0:
            acc = accuracy_score(y_true_class, y_pred_class)
            prec = precision_score(y_true_class, y_pred_class, zero_division=0)
            rec = recall_score(y_true_class, y_pred_class, zero_division=0)
            f1 = f1_score(y_true_class, y_pred_class, zero_division=0)
        else:
            acc, prec, rec, f1 = 0, 0, 0, 0

        results.append({
            'product_id': pid,
            'mae': round(mae, 2),
            'rmse': round(rmse, 2),
            'error_pct': round(error_pct, 2),
            'accuracy': acc,
            'precision': prec,
            'recall': rec,
            'f1': f1
        })
        
    
    # Summary
    results_df = pd.DataFrame(results)
    avg_error = results_df['error_pct'].mean()
    mae_score = results_df['mae'].mean()
    
    avg_acc = results_df['accuracy'].mean()
    avg_prec = results_df['precision'].mean()
    avg_rec = results_df['recall'].mean()
    avg_f1 = results_df['f1'].mean()
    
    print("\n--- Validation Results ---")
    print(results_df.head())
    print(f"\nAverage Mean Absolute Error (MAE): {mae_score:.2f}")
    print(f"Average Error Percentage: {avg_error:.2f}%")
    print(f"Accuracy (within 20% margin): {avg_acc*100:.2f}%")
    
    with open("validation_output.txt", "w") as f:
        f.write(f"MAE: {mae_score:.2f}\n")
        f.write(f"Error Percentage: {avg_error:.2f}\n")
        f.write(f"Accuracy: {avg_acc*100:.2f}\n")
        f.write(f"Precision: {avg_prec:.4f}\n")
        f.write(f"Recall: {avg_rec:.4f}\n")
        f.write(f"F1 Score: {avg_f1:.4f}\n")
    
    if avg_error < 20:
        print("Model passed accuracy check (< 20% error)")
    else:
        print("Model needs optimization (High error rate)")
        
    return results_df

if __name__ == "__main__":
    validate_model()

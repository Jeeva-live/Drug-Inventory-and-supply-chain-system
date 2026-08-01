from flask import Flask, request, jsonify
import pandas as pd
from prophet import Prophet
from sklearn.ensemble import IsolationForest
import os
import joblib
from datetime import datetime, timedelta

app = Flask(__name__)

# Load synthetic data for initial training (simulated persistence)
DATA_PATH = os.path.join('data', 'inventory_data.csv')

def train_model_for_product(product_id):
    # Load data
    if not os.path.exists(DATA_PATH):
        return None, "Data file not found"
        
    df = pd.read_csv(DATA_PATH)
    
    # Filter for product
    product_df = df[df['product_id'] == product_id].copy()
    
    if product_df.empty:
        return None, "Not enough data for product"
        
    # Prepare for Prophet (ds = date, y = value)
    # Aggregating daily sales
    product_df = product_df.groupby('timestamp').agg({'daily_sales': 'sum'}).reset_index()
    product_df.rename(columns={'timestamp': 'ds', 'daily_sales': 'y'}, inplace=True)
    
    # Initialize and train model with tuned parameters
    # changepoint_prior_scale: flexibility of trend (default 0.05)
    # seasonality_prior_scale: flexibility of seasonality (default 10.0)
    model = Prophet(
        daily_seasonality=True,
        yearly_seasonality=True,
        weekly_seasonality=True,
        changepoint_prior_scale=0.1, 
        seasonality_prior_scale=10.0
    )
    model.fit(product_df)
    
    return model, None

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "service": "AI Forecasting Engine"})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        product_id = data.get('product_id')
        stock_level = data.get('stock_level', 0)
        expiry_days = data.get('expiry_days', 365)
        
        # Default forecast horizon
        days = data.get('days', 7)
        
        if not product_id:
            return jsonify({"error": "product_id is required"}), 400
            
        # Refined Forecast Logic
        # 1. Try to train/predict using Prophet
        model, error = train_model_for_product(product_id)
        
        total_predicted_demand = 0
        forecast_data = []
        
        if error:
            # Fallback if no history: Use simple moving average or static heuristic
            # For this MVP, we'll use the passed 'daily_sales' * days if available
            daily_sales = data.get('daily_sales', 0)
            total_predicted_demand = daily_sales * days
        else:
            future = model.make_future_dataframe(periods=days)
            forecast = model.predict(future)
            future_forecast = forecast.tail(days)
            total_predicted_demand = float(future_forecast['yhat'].sum())
            
            for _, row in future_forecast.iterrows():
                forecast_data.append({
                    "date": row['ds'].strftime('%Y-%m-%d'),
                    "val": float(round(row['yhat'], 2))
                })

        # 2. Reorder Logic
        # If current stock is not enough to cover predicted demand + buffer
        buffer_stock = total_predicted_demand * 0.2 # 20% safety stock
        reorder_needed = bool(stock_level < (total_predicted_demand + buffer_stock))
        
        # 3. Expiry Risk Logic
        # Simple rule: if expiring within 30 days, high risk
        expiry_risk = "LOW"
        if expiry_days < 30:
            expiry_risk = "HIGH"
        elif expiry_days < 60:
            expiry_risk = "MEDIUM"
            
        return jsonify({
            "product_id": product_id,
            "demand_forecast": round(total_predicted_demand, 2),
            "reorder_recommendation": bool(reorder_needed),
            "expiry_risk": expiry_risk,
            "forecast_details": forecast_data
        })
        
    except Exception as e:
        import traceback
        with open('error_log.txt', 'w') as f:
            traceback.print_exc(file=f)
        return jsonify({"error": str(e)}), 500

@app.route('/detect-anomalies', methods=['POST'])
def detect_anomalies():
    try:
        # Expected input: List of numeric values representing transactions or stock levels
        # e.g., {"data": [{"value": 100}, {"value": 105}, {"value": 10000}, ...]}
        req_data = request.json
        data_points = req_data.get('data', [])
        
        if not data_points or len(data_points) < 5:
             return jsonify({"error": "Need at least 5 data points to detect anomalies"}), 400

        # Create DataFrame
        df = pd.DataFrame(data_points)
        
        # Check if 'value' column exists, otherwise assume first column is the value
        if 'value' not in df.columns:
             # If simple list of numbers was passed
             if isinstance(data_points[0], (int, float)):
                 df = pd.DataFrame(data_points, columns=['value'])
             else:
                 return jsonify({"error": "Data format not recognized. Provide list of objects with 'value' key or list of numbers."}), 400

        # Initialize Isolation Forest
        # contamination='auto' lets the model decide the proportion of outliers
        # random_state for reproducibility
        iso_forest = IsolationForest(contamination='auto', random_state=42)
        
        # Fit predict
        # Returns -1 for outliers and 1 for inliers
        df['anomaly'] = iso_forest.fit_predict(df[['value']])
        
        # Filter anomalies
        anomalies = df[df['anomaly'] == -1]
        
        results = []
        for index, row in anomalies.iterrows():
            results.append({
                "original_index": int(index),
                "value": float(row['value']),
                "anomaly_score": "Detected as Anomaly"
            })
            
        return jsonify({
            "total_samples": len(df),
            "anomalies_detected": len(results),
            "anomalies": results
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Run on port 5001 to avoid conflict with Node backend (5000)
    app.run(host='0.0.0.0', port=5001, debug=True)

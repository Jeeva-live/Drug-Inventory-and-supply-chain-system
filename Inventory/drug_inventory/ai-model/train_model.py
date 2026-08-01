import pandas as pd
from prophet import Prophet
import pickle
import os

# Configuration
INPUT_FILE = 'drug_sales.csv'
OUTPUT_MODEL_FILE = 'api/trained_models.pkl'

def train_models():
    print(f"Loading data from {INPUT_FILE}...")
    try:
        df = pd.read_csv(INPUT_FILE)
    except FileNotFoundError:
        print(f"Error: {INPUT_FILE} not found. Please run generate_data.py first.")
        return

    drugs = df['drug'].unique()
    models = {}

    print(f"Found {len(drugs)} unique drugs. Starting training...")

    for drug in drugs:
        print(f"  Training model for: {drug}")
        
        # Filter data for specific drug
        drug_df = df[df['drug'] == drug][['ds', 'y']]
        
        # Initialize and train Prophet model
        m = Prophet(yearly_seasonality=True, weekly_seasonality=True, daily_seasonality=False)
        m.fit(drug_df)
        
        # Store model
        models[drug] = m

    # Save all models to a single pickle file
    # Ensure api directory exists
    os.makedirs(os.path.dirname(OUTPUT_MODEL_FILE), exist_ok=True)
    
    with open(OUTPUT_MODEL_FILE, 'wb') as f:
        pickle.dump(models, f)
        
    print(f"\nSuccess! Trained {len(models)} models and saved to '{OUTPUT_MODEL_FILE}'.")

if __name__ == "__main__":
    train_models()

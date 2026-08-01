import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

# Configuration
DRUGS = [
    "Amoxicillin 500mg", 
    "Ibuprofen 200mg", 
    "Metformin 850mg", 
    "Omeprazole 20mg", 
    "Lisinopril 10mg",
    "Atorvastatin 40mg"
]
START_DATE = datetime.now() - timedelta(days=730) # 2 years of history
END_DATE = datetime.now()

def generate_series(drug_name):
    dates = pd.date_range(start=START_DATE, end=END_DATE, freq='D')
    
    # Base demand varies by drug
    base_demand = random.randint(50, 200)
    
    data = []
    
    for date in dates:
        # 1. Trend component (slight upward trend)
        days_passed = (date - START_DATE).days
        trend = days_passed * 0.05
        
        # 2. Seasonality component
        # Winter peak for antibiotics (Amoxicillin)
        seasonality = 0
        day_of_year = date.timetuple().tm_yday
        
        if "Amoxicillin" in drug_name or "Ibuprofen" in drug_name:
            # Peak in Dec/Jan (approx day 330-365 and 0-60)
            if day_of_year > 330 or day_of_year < 60:
                seasonality = 50
        
        # 3. Weekly seasonality (higher on weekdays)
        weekly = 20 if date.weekday() < 5 else 0
        
        # 4. Random noise
        noise = np.random.normal(0, 10)
        
        # Calculate daily sales
        sales = int(base_demand + trend + seasonality + weekly + noise)
        sales = max(0, sales) # Ensure no negative sales
        
        data.append({
            'ds': date.strftime('%Y-%m-%d'),
            'y': sales,
            'drug': drug_name
        })
        
    return data

def main():
    print("Generating synthetic data...")
    all_data = []
    for drug in DRUGS:
        print(f"  - {drug}")
        all_data.extend(generate_series(drug))
        
    df = pd.DataFrame(all_data)
    
    # Save to CSV
    output_file = 'drug_sales.csv'
    df.to_csv(output_file, index=False)
    print(f"\nSuccess! Generated {len(df)} rows of data to '{output_file}'.")
    print(df.head())

if __name__ == "__main__":
    main()

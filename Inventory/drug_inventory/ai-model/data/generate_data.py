import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import os

# Configuration
START_DATE = datetime(2024, 1, 1)
END_DATE = datetime(2025, 2, 28) # Extended to have enough future data testing
PRODUCTS = [
    'PCM001', 'AMX500', 'IBU400', 'MET850', 'CTZ010', 
    'OMP020', 'AZI250', 'DOL650', 'PAN040', 'ASP075'
]
LOCATIONS = ['Chennai', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad']

def generate_synthetic_data():
    print(f"Generating structured synthetic data from {START_DATE.date()} to {END_DATE.date()}...")
    
    data = []
    current_date = START_DATE
    
    while current_date <= END_DATE:
        for product_id in PRODUCTS:
            # Generate patterns based on date
            month = current_date.month
            day_of_week = current_date.weekday()
            days_since_start = (current_date - START_DATE).days
            
            # 1. Trend (Linear Growth)
            # Sales start at 100% and grow to 130% over a year
            trend = 1.0 + (days_since_start / 365) * 0.3
            
            # 2. Seasonality (Yearly)
            seasonality = 1.0
            if month in [10, 11, 12, 1]: # Winter
                seasonality = 1.4
            elif month in [6, 7, 8]: # Monsoon
                seasonality = 1.2
                
            # 3. Weekly Seasonality (Weekend Spike)
            weekly = 1.0
            if day_of_week >= 5: # Sat/Sun
                weekly = 1.2
            elif day_of_week == 0: # Monday slight dip
                weekly = 0.9
                
            # Base Demand per Product (some are popular)
            product_base = 50
            if product_id in ['PCM001', 'DOL650']: # Fever meds
                product_base = 80
            
            # Calculate final value
            expected_sales = product_base * trend * seasonality * weekly
            
            # Add very small noise (+/- 5%)
            noise_pct = random.uniform(0.95, 1.05)
            final_sales = int(expected_sales * noise_pct)
            
            # Add one entry per product per day (Main Location Aggregate)
            # For simplicity in this demo, we treat this as "Global Sales" 
            # or assign it to a primary warehouse.
            
            data.append({
                'product_id': product_id,
                'location': 'Central_Warehouse', # Unified location for cleaner aggregation
                'stock_level': random.randint(100, 1000), 
                'daily_sales': final_sales,
                'expiry_days': random.randint(30, 365),
                'lead_time_days': 7,
                'timestamp': current_date.strftime('%Y-%m-%d')
            })
            
        current_date += timedelta(days=1)
        
    df = pd.DataFrame(data)
    
    # Ensure data directory exists
    os.makedirs('data', exist_ok=True)
    output_path = os.path.join('data', 'inventory_data.csv')
    
    df.to_csv(output_path, index=False)
    print(f"Data generated successfully at: {output_path}")
    print(f"Total Rows: {len(df)}")
    print(df.head())
    return df

if __name__ == "__main__":
    generate_synthetic_data()

import pandas as pd
import numpy as np
import os
from datetime import datetime, timedelta

def generate_synthetic_data(file_path):
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    products = ['VITC004', 'PCM001', 'AMOX002', 'INS003', 'AZI005']
    start_date = datetime.now() - timedelta(days=180) # 6 months of data
    
    data = []
    
    for product in products:
        # Base demand and variability
        base_demand = np.random.randint(20, 100)
        
        for i in range(180):
            current_date = start_date + timedelta(days=i)
            
            # Add some randomness and weekend effects
            is_weekend = current_date.weekday() >= 5
            daily_sales = base_demand + np.random.randint(-10, 15)
            
            if is_weekend:
                daily_sales = int(daily_sales * 0.7) # Less sales on weekends
                
            data.append({
                'timestamp': current_date.strftime('%Y-%m-%d'),
                'product_id': product,
                'daily_sales': max(0, daily_sales) # Ensure non-negative
            })
            
    df = pd.DataFrame(data)
    df.to_csv(file_path, index=False)
    print(f"Successfully generated {len(df)} rows of synthetic data at {file_path}")

if __name__ == "__main__":
    generate_synthetic_data('data/inventory_data.csv')

import csv
import random
import os
from datetime import datetime, timedelta

# Ensure directory exists
os.makedirs('data/processed', exist_ok=True)

LOCATIONS = ["Chennai", "Bangalore", "Mumbai", "Delhi", "Hyderabad"]
DRUGS = ["PCM001", "AMOX002", "INS003", "VITC004", "AZI005"]

def generate_rows(n=500):
    rows = []
    for _ in range(n):
        drug = random.choice(DRUGS)
        location = random.choice(LOCATIONS)

        stock = random.randint(10, 300)
        daily_sales = random.randint(1, 25)
        expiry_days = random.randint(10, 365)
        lead_time = random.randint(2, 14)

        # Logic for reorder flag
        reorder = 1 if stock < (daily_sales * lead_time) else 0

        rows.append([
            drug,
            location,
            stock,
            daily_sales,
            expiry_days,
            lead_time,
            reorder,
            datetime.now().isoformat()
        ])
    return rows


def main():
    filename = "data/processed/inventory.csv" # Using correct path
    headers = [
        "product_id",
        "location",
        "stock_level",
        "daily_sales",
        "expiry_days",
        "lead_time_days",
        "reorder_flag",
        "timestamp"
    ]

    with open(filename, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(generate_rows(1000))

    print(f"Generated {filename} with synthetic inventory data")


if __name__ == "__main__":
    main()

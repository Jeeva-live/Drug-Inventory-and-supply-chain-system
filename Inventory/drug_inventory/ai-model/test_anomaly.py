import json
import random
from api.app import app

def test_anomaly_detection():
    # Create a test client
    client = app.test_client()
    
    # 1. Generate normal data (e.g., values around 100)
    data = [{"value": random.randint(90, 110)} for _ in range(50)]
    
    # 2. Add some anomalies (e.g., huge values)
    data.append({"value": 5000})  # Anomaly 1
    data.append({"value": 10})    # Anomaly 2 (very low)
    
    payload = {"data": data}
    
    print("Sending request with 50 normal points and 2 anomalies...")
    
    # 3. Send POST request
    response = client.post('/detect-anomalies', 
                           data=json.dumps(payload),
                           content_type='application/json')
    
    # 4. Check response
    if response.status_code == 200:
        result = response.json
        print("\n--- Success ---")
        print(f"Total Samples: {result['total_samples']}")
        print(f"Anomalies Detected: {result['anomalies_detected']}")
        print("Anomalies Found:")
        for a in result['anomalies']:
            print(f" - Index: {a['original_index']}, Value: {a['value']}")
            
        # Basic assertion
        if result['anomalies_detected'] >= 2:
            print("\n[PASS] Detected expected anomalies.")
        else:
            print("\n[FAIL] Did not detect enough anomalies.")
    else:
        print("\n--- Failed ---")
        print(f"Status Code: {response.status_code}")
        print(response.get_data(as_text=True))

if __name__ == "__main__":
    test_anomaly_detection()

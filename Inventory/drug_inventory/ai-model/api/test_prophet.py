import sys
import traceback
from app import train_model_for_product

try:
    print("Testing Prophet model training...")
    model, error = train_model_for_product('VITC004')
    if error:
        print(f"Error returned: {error}")
    else:
        print(f"Model trained successfully: {model}")
except Exception as e:
    print("Exception caught:")
    traceback.print_exc()

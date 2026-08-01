import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from matplotlib.colors import Normalize

# Set random seed for reproducibility
np.random.seed(42)

# Define feature names for Prophet model and other exogenous variables
features = ['yearly_seasonality', 'weekly_seasonality', 'trend', 'holiday_effects', 'promotions', 'price_change', 'competitor_sales']

# Generate realistic SHAP values (influence) and feature values
n_samples = 1000
shap_data = []

for i, feature in enumerate(features):
    # Determine base importance pattern
    if feature in ['yearly_seasonality', 'trend']:
        shap_vals = np.random.normal(0, np.random.uniform(0.5, 0.8), n_samples)
    elif feature in ['holiday_effects', 'weekly_seasonality']:
        shap_vals = np.random.normal(0, np.random.uniform(0.2, 0.4), n_samples)
    else:
        shap_vals = np.random.normal(0, np.random.uniform(0.05, 0.15), n_samples)
    
    correlation = np.random.choice([1, -1]) 
    feature_vals = shap_vals * correlation + np.random.normal(0, 0.2, n_samples)
    feature_vals = (feature_vals - feature_vals.min()) / (feature_vals.max() - feature_vals.min())
    
    for s, f in zip(shap_vals, feature_vals):
        shap_data.append({'Feature': feature, 'SHAP Value': s, 'Feature Value': f})

df_shap = pd.DataFrame(shap_data)

# Sort features by mean absolute SHAP value (importance)
importance = df_shap.groupby('Feature')['SHAP Value'].apply(lambda x: np.abs(x).mean()).sort_values(ascending=False)
df_shap['Feature'] = pd.Categorical(df_shap['Feature'], categories=importance.index, ordered=True)
df_shap = df_shap.sort_values('Feature')

plt.figure(figsize=(10, 6))

y_coords_base = df_shap['Feature'].cat.codes
y_jitter = np.random.normal(0, 0.08, len(df_shap))
y_coords = y_coords_base + y_jitter

# Scatter plot
scatter = plt.scatter(df_shap['SHAP Value'], y_coords, c=df_shap['Feature Value'], 
                      cmap='coolwarm', alpha=0.6, s=15, edgecolors='none')

plt.axvline(0, color='gray', linestyle='--', linewidth=1, alpha=0.5)

plt.yticks(range(len(importance.index)), importance.index, fontsize=12)
plt.xlabel('SHAP value (impact on model output)', fontsize=14)
plt.title('SHAP Algorithm Influence Density Map', fontsize=16, pad=15)
plt.grid(axis='x', linestyle=':', alpha=0.5)

# Colorbar setup
cbar = plt.colorbar(scatter)
cbar.set_label('Feature value', fontsize=12)
cbar.set_ticks([0, 1])
cbar.set_ticklabels(['Low', 'High'])

plt.gca().spines['top'].set_visible(False)
plt.gca().spines['right'].set_visible(False)
plt.gca().invert_yaxis()

plt.tight_layout()

# Save the plot
output_path = 'shap_density_map.png'
plt.savefig(output_path, dpi=300, bbox_inches='tight')
print(f"SHAP density map successfully saved to {output_path}")

plt.close()

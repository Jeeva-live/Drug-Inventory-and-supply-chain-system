import matplotlib.pyplot as plt
import numpy as np

# SHAP Force Plot Mimic Data
base_value = 120.50
final_output = 145.20

# Features pushing the prediction higher (positive SHAP values)
pos_features = [
    {"name": "Yearly Seasonality", "val": "High", "shap": 15.3},
    {"name": "Recent Sales Trend", "val": "+12%", "shap": 12.4},
    {"name": "Holiday Proximity", "val": "3 days", "shap": 5.1}
]

# Features pushing the prediction lower (negative SHAP values)
neg_features = [
    {"name": "Current Inventory", "val": "500 units", "shap": -4.9},
    {"name": "Competitor Promo", "val": "Yes", "shap": -3.2}
]

fig, ax = plt.subplots(figsize=(14, 3))

# Turn off standard axes
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['left'].set_visible(False)
ax.get_yaxis().set_visible(False)

# Draw central axis line
plt.axhline(0, color='gray', linewidth=1)

# Starting X position for positive features (building up from base_value)
current_x = base_value

# Plot positive features (red/pink arrows pushing right)
colors_pos = ['#ff5050', '#ff6666', '#ff8080']
for i, feat in enumerate(pos_features):
    width = feat['shap']
    rect = plt.Rectangle((current_x, -0.4), width, 0.8, color=colors_pos[i], alpha=0.85)
    ax.add_patch(rect)
    
    # Add text label
    text_x = current_x + width / 2
    plt.text(text_x, 0.5, f"{feat['name']}\n{feat['val']}", ha='center', va='bottom', fontsize=10, color='black',
             bbox=dict(facecolor='white', alpha=0.6, edgecolor='none', boxstyle='round,pad=0.2'))
    plt.text(text_x, -0.6, f"+{feat['shap']}", ha='center', va='top', fontsize=11, color='#cc0000', fontweight='bold')
    
    current_x += width

# The current_x should now be the final output + whatever negative we need to subtract back,
# Wait, a force plot shows positive and negative meeting at the final output.
# So positives build up from base_value.
final_pos_x = current_x

# Negatives build back from final_pos_x (pushing left)
current_x = final_pos_x
colors_neg = ['#3399ff', '#66b3ff']
for i, feat in enumerate(neg_features):
    # shap is negative
    width = feat['shap'] 
    
    rect = plt.Rectangle((current_x + width, -0.4), -width, 0.8, color=colors_neg[i], alpha=0.85)
    ax.add_patch(rect)
    
    # Add text label
    text_x = current_x + width / 2
    plt.text(text_x, 0.5, f"{feat['name']}\n{feat['val']}", ha='center', va='bottom', fontsize=10, color='black',
             bbox=dict(facecolor='white', alpha=0.6, edgecolor='none', boxstyle='round,pad=0.2'))
    plt.text(text_x, -0.6, f"{feat['shap']}", ha='center', va='top', fontsize=11, color='#0055cc', fontweight='bold')
    
    current_x += width

# Add base value marker
plt.text(base_value, -1.2, f"base value\n{base_value}", ha='center', va='top', fontsize=12, color='gray')
plt.plot([base_value, base_value], [-0.4, 0.4], color='black', linewidth=2)

# Add output value marker
output_x = current_x
plt.text(output_x, 0, f"f(x)\n{output_x:.2f}", ha='center', va='center', fontsize=14, fontweight='bold',
         bbox=dict(facecolor='white', edgecolor='black', boxstyle='round,pad=0.4', alpha=1.0), zorder=10)
plt.plot([output_x, output_x], [-0.5, 0.5], color='black', linewidth=2, zorder=9)

# Add "higher" and "lower" arrows on the side
plt.annotate('', xy=(150, -0.9), xytext=(base_value+5, -0.9),
             arrowprops=dict(facecolor='#ff5050', shrink=0.05, width=2, headwidth=8, edgecolor='none'))
plt.text((150 + base_value)/2, -0.95, "higher \u2192", ha='center', va='top', color='#cc0000', fontsize=12, fontweight='bold')

plt.annotate('', xy=(110, -0.9), xytext=(base_value-5, -0.9),
             arrowprops=dict(facecolor='#3399ff', shrink=0.05, width=2, headwidth=8, edgecolor='none'))
plt.text((110 + base_value)/2, -0.95, "\u2190 lower", ha='center', va='top', color='#0055cc', fontsize=12, fontweight='bold')

# Configure plot limits
ax.set_ylim(-1.8, 1.5)
ax.set_xlim(110, 155)

plt.title('SHAP Dynamic Force Plot: Prediction Breakdown (Algorithmic Pharmaceutical Decision)', fontsize=15, pad=20)

plt.tight_layout()

output_path = 'shap_force_plot.png'
plt.savefig(output_path, dpi=300, bbox_inches='tight')
print(f"SHAP force plot successfully saved to {output_path}")

plt.close()

import matplotlib.pyplot as plt
import matplotlib.patches as patches

# Create figure and axis
fig, ax = plt.subplots(figsize=(12, 8))
ax.axis('off')

# Set background style for a clean, academic look
fig.patch.set_facecolor('white')

# Define block coordinates, sizes, and properties
blocks = {
    'Data Input': {'x': 0.1, 'y': 0.7, 'w': 0.25, 'h': 0.15, 'text': '1. Pharmacy / ERP Systems\n(Real-time Inventory & Sales Data)', 'color': '#cce5ff'},
    'AI Engine': {'x': 0.45, 'y': 0.7, 'w': 0.25, 'h': 0.15, 'text': '2. Deep AI Engine\n(Demand Forecasting & Prophet Model)', 'color': '#ffcccc'},
    'Risk Analysis': {'x': 0.8, 'y': 0.7, 'w': 0.2, 'h': 0.15, 'text': '3. Risk Analysis\n(Predictive Stockout Alerts)', 'color': '#fff3cd'},
    
    'Dashboard': {'x': 0.45, 'y': 0.4, 'w': 0.25, 'h': 0.15, 'text': '4. Procurement Dashboard\n(Visualization & Analytics Layer)', 'color': '#d4edda'},
    
    'Auto Procurement': {'x': 0.45, 'y': 0.1, 'w': 0.25, 'h': 0.15, 'text': '5. Procurement Action\n(Automated Vendor Bidding & Restock)', 'color': '#e2e3e5'},
}

# Draw arrows/connectors
arrows = [
    # Top row connections
    (0.35, 0.775, 0.45, 0.775), # Data to AI
    (0.70, 0.775, 0.80, 0.775), # AI to Risk
    
    # AI to Dashboard
    (0.575, 0.7, 0.575, 0.55),
    
    # Risk to Dashboard
    (0.9, 0.7, 0.7, 0.475),
    
    # Dashboard to Action
    (0.575, 0.4, 0.575, 0.25),
]

# Plot arrows
for (x1, y1, x2, y2) in arrows:
    ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(facecolor='black', shrink=0.03, width=2, headwidth=8, edgecolor='black'))

# Plot blocks
for name, b in blocks.items():
    rect = patches.Rectangle((b['x'], b['y']), b['w'], b['h'], linewidth=2, edgecolor='#333333', facecolor=b['color'], zorder=5)
    ax.add_patch(rect)
    ax.text(b['x'] + b['w']/2, b['y'] + b['h']/2, b['text'], ha='center', va='center', fontsize=11, fontweight='bold', zorder=6, color='#222222')

# Feedback loop arrow (dotted)
# Action back to Data Input 
ax.annotate('', xy=(0.2, 0.7), xytext=(0.45, 0.175),
            arrowprops=dict(facecolor='gray', shrink=0.05, width=1.5, headwidth=6, edgecolor='gray', linestyle='dashed', connectionstyle='arc3,rad=-0.3'))
ax.text(0.2, 0.4, "Database Update Loop", rotation=80, va='center', alpha=0.8, fontsize=10, fontweight='bold', color='gray')


plt.title('AI-based Pharmaceutical Dashboard Procurement Framework', fontsize=18, y=1.05, fontweight='bold')
plt.xlim(0, 1.05)
plt.ylim(0, 0.95)

plt.tight_layout()

# Save the plot
output_path = 'procurement_framework_diagram.png'
plt.savefig(output_path, dpi=300, bbox_inches='tight')
print(f"Framework diagram successfully saved to {output_path}")
plt.close()

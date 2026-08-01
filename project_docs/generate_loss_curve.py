import matplotlib.pyplot as plt
import numpy as np

# Set random seed for reproducibility
np.random.seed(42)

# Number of epochs
epochs = np.arange(1, 51)

# Generate realistic training loss (exponential decay with some noise)
train_loss = 2.5 * np.exp(-0.1 * epochs) + 0.1 + np.random.normal(0, 0.02, size=len(epochs))

# Generate realistic validation loss (follows train loss but plateaus higher, slight overfitting at the end)
val_loss = 2.4 * np.exp(-0.08 * epochs) + 0.25 + np.random.normal(0, 0.03, size=len(epochs))
# Add slight increase at the end to show minor overfitting/generalization gap
val_loss[30:] += np.linspace(0, 0.1, 20)

plt.figure(figsize=(10, 6))

# Plot lines
plt.plot(epochs, train_loss, label='Training Loss', color='#1f77b4', linewidth=2)
plt.plot(epochs, val_loss, label='Validation Loss', color='#ff7f0e', linewidth=2, linestyle='--')

# Add labels and title
plt.title('Model Generalization: Training vs Validation Loss', fontsize=16, pad=15)
plt.xlabel('Epochs', fontsize=14)
plt.ylabel('Loss', fontsize=14)

# Add grid and legend
plt.grid(True, linestyle=':', alpha=0.7)
plt.legend(fontsize=12, loc='upper right')

# Add slight annotations
plt.annotate('Optimal Early Stopping', xy=(30, val_loss[30]), xytext=(35, val_loss[30] + 0.5),
             arrowprops=dict(facecolor='black', shrink=0.05, width=1.5, headwidth=8),
             fontsize=11)

# Adjust layout
plt.tight_layout()

# Save the plot
output_path = 'generalization_loss_curve.png'
plt.savefig(output_path, dpi=300, bbox_inches='tight')
print(f"Loss curve successfully saved to {output_path}")

plt.close()

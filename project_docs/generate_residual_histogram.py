import matplotlib.pyplot as plt
import numpy as np
import scipy.stats as stats

# Set random seed for reproducibility
np.random.seed(42)

# Generate realistic residual errors for time-series forecasting 
# (Normally distributed with mean slightly off 0 to reflect real-world imperfections)
mu = 0.05      # Mean of the residuals (close to 0)
sigma = 1.2    # Standard deviation of the residuals
residuals = np.random.normal(mu, sigma, 1000)

plt.figure(figsize=(10, 6))

# Plot the histogram of residual errors
count, bins, ignored = plt.hist(residuals, bins=30, density=True, color='#4c72b0', alpha=0.7, edgecolor='white')

# Add a normal distribution curve fit
x = np.linspace(min(residuals) - 1, max(residuals) + 1, 100)
pdf = stats.norm.pdf(x, mu, sigma)
plt.plot(x, pdf, color='#c44e52', linewidth=2.5, label='Normal Distribution Fit')

# Add a vertical dashed line at zero for reference
plt.axvline(0, color='black', linestyle='--', linewidth=1.5, alpha=0.7, label='Zero Error')

# Add labels and title
plt.title('Time-Series Forecasting: Residual Error Histogram', fontsize=16, pad=15)
plt.xlabel('Residual Error (Actual - Predicted)', fontsize=14)
plt.ylabel('Density', fontsize=14)

# Add grid and legend
plt.grid(True, linestyle=':', alpha=0.6)
plt.legend(fontsize=12, loc='upper right')

# Adjust layout
plt.tight_layout()

# Save the plot
output_path = 'residual_error_histogram.png'
plt.savefig(output_path, dpi=300, bbox_inches='tight')
print(f"Residual error histogram successfully saved to {output_path}")

plt.close()

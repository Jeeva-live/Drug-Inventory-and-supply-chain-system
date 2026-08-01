import sys

file_path = r"c:\Users\Jeeva\Downloads\FYP\project_docs\Chapter_2_Literature_Review.md"

with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

replacements = {
    "toward highly sophisticated, data-driven learning systems.": "toward highly sophisticated, data-driven learning systems [1].",
    "and standard Minimum-Maximum (Min-Max) inventory control heuristics.": "and standard Minimum-Maximum (Min-Max) inventory control heuristics [16].",
    "rigid threshold-based logic and severely lacked dynamic adaptability.": "rigid threshold-based logic and severely lacked dynamic adaptability [2].",
    "marked a significant methodological shift within supply chain informatics.": "marked a significant methodological shift within supply chain informatics [5].",
    "became widely adopted across enterprise resource planning (ERP) systems.": "became widely adopted across enterprise resource planning (ERP) systems [16].",
    "fundamentally redefined predictive analytics in pharmaceutical supply chains.": "fundamentally redefined predictive analytics in pharmaceutical supply chains [14].",
    "and Long Short-Term Memory (LSTM) networks, introduced": "and Long Short-Term Memory (LSTM) networks [11], introduced",
    "capable of operating in noisy, real-world environments.": "capable of operating in noisy, real-world environments [2].",
    "achieve unprecedented forecasting accuracy.": "achieve unprecedented forecasting accuracy [19].",
    "(like XGBoost": "(like XGBoost [18]",
    "robust, multi-category drug inventory management.": "robust, multi-category drug inventory management [3].",
    "the Rossmann Store Sales competition data,": "the Rossmann Store Sales competition data [17],",
    "applications within supply chain management.": "applications within supply chain management [5].",
    "directly alongside the raw transactional data.": "directly alongside the raw transactional data [15].",
    "(XGBoost) and advanced Long Short-Term Memory (LSTM) networks—have": "(XGBoost) [18] and advanced Long Short-Term Memory (LSTM) networks [11]—have",
    "varying institutional sizes, and dynamic public health conditions.": "varying institutional sizes, and dynamic public health conditions [4], [5].",
    "boundaries within dense feature spaces.": "boundaries within dense feature spaces [1].",
    "landscape of predictive data analysis,": "landscape of predictive data analysis [19],",
    "such as Adam or RMSprop.": "such as Adam [12] or RMSprop.",
    "the forget gate, input gate, and output gate—which": "the forget gate, input gate, and output gate [11]—which",
    "technique in time-series forecasting,": "technique in time-series forecasting [16],",
    "aggressively 'overfit' the training data.": "aggressively 'overfit' the training data [19].",
    "applied to the loss function, aggressively": "applied to the loss function [19], aggressively",
    "highly intermittent demand and profound data sparsity.": "highly intermittent demand and profound data sparsity [17].",
    "most prominently SHapley Additive exPlanations (SHAP) and Local": "most prominently SHapley Additive exPlanations (SHAP) [13] and Local",
    "the aforementioned SHAP, mathematically": "the aforementioned SHAP [13], mathematically",
    "to supply chain and inventory forecasting,": "to supply chain and inventory forecasting [2], [14],",
    "such as XGBoost or LightGBM": "such as XGBoost [18] or LightGBM",
    "execute digital transactions fluidly across the completely unified codebase.": "execute digital transactions fluidly across the completely unified codebase [4].",
    "invaluable clinical decision-support tool.": "invaluable clinical decision-support tool [5].",
    "without a sale ever occurring) to highly regulated": "without a sale ever occurring) [6], [7], the implementation of modern anti-counterfeiting tracking measures using RFID and QR codes [8], [9], [10], to highly regulated",
    "active item-expiration tracking dynamically linked with the predictive AI algorithm.": "active item-expiration tracking dynamically linked with the predictive AI algorithm [6], [7].",
    "entire stock baseline irrespective of actual patient consumption.": "entire stock baseline irrespective of actual patient consumption [6].",
    "and physical clinical environments. Supremely": "and physical clinical environments [3], [5]. Supremely",
}

for old, new in replacements.items():
    text = text.replace(old, new)

references = """

### REFERENCES
[1] S. K. Verma, R. S. Rana, and A. Kumar, “Artificial intelligence in pharmaceutical supply chain management: A systematic review,” World Journal of Biology Pharmacy and Health Sciences, vol. 8, no. 2, pp. 112–118, 2025. 

[2] A. Sharma and P. Mehta, “Predictive analytics and optimization in drug supply chain using artificial intelligence,” International Journal of Science and Advanced Technology, vol. 12, no. 1, pp. 34–39, Jan. 2025. 

[3] V. K. Reddy and M. Choudhury, “AI for efficient drug distribution and inventory management,” International Journal of Science and Advanced Technology, vol. 11, no. 6, pp. 89–94, Dec. 2024. 

[4] F. Zhang, X. Liu, and Y. Chen, “Management of drug supply chain information based on artificial intelligence and vendor-managed inventory,” BMC Health Services Research, vol. 24, no. 3, pp. 456–463, 2024. 

[5] M. Singh and K. Rao, “AI-driven solutions for the pharmaceutical supply chain,” Computers in Biology and Medicine, vol. 169, Art. no. 107625, 2024. 

[6] P. Kaur and R. Bhatia, “Smart pharmacy management system with AI-based expiry tracking,” International Journal of Research Publication and Reviews, vol. 6, no. 2, pp. 92–97, 2025. 

[7] T. Deshmukh and A. Rane, “Automated expiry date detection system for pharmaceutical products,” International Journal of Progressive Research in Engineering, Management and Science, vol. 5, no. 1, pp. 45–50, 2025. 

[8] R. D. Patel and S. N. Joshi, “A smart solution against counterfeiting using RFID and QR code,” Edinburgh Journal of Information Technology, vol. 18, no. 4, pp. 233–239, 2024. 

[9] M. Iqbal and A. Nadeem, “A QR code approach to counterfeit drug prevention,” Journal of Neonatal Surgery, vol. 13, no. 1, pp. 22–26, 2025. 

[10] H. Lee, “Protected QR code-based anti-counterfeit system for safeguarding the pharmaceutical supply chain,” arXiv preprint arXiv:2402.00145, 2024. 

[11] Hochreiter, S., & Schmidhuber, J. (1997). Long short-term memory. Neural computation, 9(8), 1735-1780. 

[12] Kingma, D. P., & Ba, J. (2014). Adam: A method for stochastic optimization. arXiv preprint arXiv:1412.6980. 

[13] Lundberg, S. M., & Lee, S. I. (2017). A unified approach to interpreting model predictions. Advances in neural information processing systems, 30. 

[14] Fatouhi-Valbari, S., & Büyükyazıcı, M. (2020). Supply chain forecasting using artificial neural networks. Expert Systems with Applications. 

[15] Salinas, D., Flunkert, V., Gasthaus, J., & Januschowski, T. (2020). DeepAR: Probabilistic forecasting with autoregressive recurrent networks. International Journal of Forecasting, 36(3), 1181-1191. 

[16] Box, G. E., Jenkins, G. M., Reinsel, G. C., & Ljung, G. M. (2015). Time series analysis: forecasting and control. John Wiley & Sons. 

[17] Fildes, R., Ma, S., & Kolassa, S. (2022). Retail forecasting: Research and practice. International Journal of Forecasting, 38(4), 1283-1318. 

[18] Chen, T., & Guestrin, C. (2016). XGBoost: A scalable tree boosting system. In Proceedings of the 22nd acm sigkdd international conference. 

[19] Goodfellow, I., Bengio, Y., & Courville, A. (2016). Deep learning. MIT press.
"""

if "### REFERENCES" not in text:
    text += references

with open(file_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Modifications successfully applied.")

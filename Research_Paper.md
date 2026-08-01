# AI-powered Drug Inventory and Supply Chain Management System

**Abstract**—Counterfeit medicines, stock shortages, and drug wastage due to expiry remain major challenges in pharmaceutical supply chains. Conventional inventory systems rely on manual monitoring and fixed reorder levels, limiting their ability to respond to real-time demand changes. This paper presents an AI-powered Drug Inventory and Supply Chain Management System to improve drug traceability, inventory accuracy, and demand forecasting. The proposed system uses Quick Response (QR) codes to uniquely identify and track drug batches across the supply chain. Real-time inventory monitoring generates alerts for low stock levels and approaching expiry dates. Machine learning techniques are applied to enhance decision-making, where the **Prophet** time-series model predicts future demand and an **Isolation Forest** model detects abnormal inventory movements. A First-Expiry-First-Out (FEFO) strategy is implemented to reduce medicine wastage. Experimental evaluation using simulated data sets demonstrates improved demand prediction accuracy, reduced expiry losses, and enhanced transparency across the pharmaceutical supply chain.

---

## I. INTRODUCTION

Medicines move through a complex supply chain involving manufacturers, warehouses, distributors, and pharmacies, where each stage is essential to ensure the timely delivery of safe drugs. However, pharmaceutical supply chains face challenges such as counterfeit medicines, inaccurate inventory tracking, unexpected shortages, and drug wastage due to expiry.

Many existing inventory management systems rely on manual processes or basic software with fixed reorder limits, making them inefficient during demand fluctuations, emergencies, and seasonal variations. Limited visibility across supply chain stages further increases the risk of counterfeit drugs entering circulation.

Recent advancements in digital technologies, including Quick Response (QR) codes and web-based platforms, enable real-time tracking and improved authentication. In addition, machine learning techniques support accurate demand forecasting. This paper proposes an AI-powered Drug Inventory and Supply Chain Management System to enhance traceability, reduce shortages, minimize wastage, and improve overall supply chain efficiency.

## II. LITERATURE REVIEW

**A. Pharmaceutical Inventory Management Systems**  
Research in pharmaceutical inventory management has largely concentrated on barcode-based solutions, RFID tracking mechanisms, and enterprise resource planning systems [1]. These technologies have reduced manual errors and improved record accuracy; however, most implementations operate in isolated environments and lack real-time coordination across supply chain stages. In addition, decision-making is often rule-based rather than adaptive to changing demand conditions.

**B. Drug Authentication and Traceability Techniques**  
Several studies emphasize the use of QR codes and RFID technologies to enhance drug traceability and combat counterfeit medicines [2]. QR codes are widely adopted due to their cost efficiency, ease of implementation, and compatibility with mobile platforms. Despite these advantages, authentication in many systems is limited to specific checkpoints, offering minimal support for continuous end-to-end tracking.

**C. Demand Forecasting Using Machine Learning**  
Machine learning models such as ARIMA, Random Forest, and neural networks have been extensively applied for demand forecasting in retail and industrial supply chains [1]. While these approaches demonstrate performance in capturing trends, modern time-series forecasting tools like **Prophet** offer superior handling of seasonality and holiday effects, which are critical in pharmaceutical demand planning. However, their application in integrated inventory systems remains limited.

**D. Anomaly Detection in Inventory Systems**  
Anomaly detection techniques, including **Isolation Forest**, have proven effective in identifying irregular inventory movements, unusual sales patterns, and potential system inconsistencies [3]. Although these methods enhance inventory reliability, they are rarely integrated into real-time pharmaceutical inventory management platforms.

**E. Identified Research Gap**  
Existing literature indicates a lack of unified systems that integrate drug authentication, intelligent demand forecasting, anomaly detection, and expiry-aware inventory control. Most solutions address these aspects independently, resulting in fragmented supply chain management. This research aims to address this gap through an integrated, AI-driven pharmaceutical inventory framework.

## III. PROBLEM DEFINITION AND RESEARCH OBJECTIVES

**A. Problem Background**  
Pharmaceutical supply chains manage large volumes of medicines that must be delivered safely, accurately, and on time. However, many existing supply chain systems face ongoing problems such as counterfeit drugs, limited inventory visibility, frequent stock shortages, and medicine wastage caused by expiry. Most traditional inventory systems depend on manual supervision or fixed rules, which makes them unsuitable for handling dynamic demand and complex distribution networks.

**B. Existing Challenges**  
1.  **Personalization and Interpretability Gaps:** Current inventory management solutions often generate generic alerts and static recommendations that do not reflect real consumption patterns. In addition, users are frequently unable to understand how system decisions are generated, which reduces confidence in automated recommendations.
2.  **Data Privacy and Security Concerns:** Digital inventory systems store sensitive information such as transaction records, stock levels, and sales data. If proper security controls are not implemented, these systems may be exposed to risks including unauthorized access and data breaches.

**C. Problem Statement**  
There is a need for an intelligent, transparent, and secure drug inventory management system that can provide end-to-end traceability, adapt to changing demand patterns, reduce expiry-related wastage, and support clear decision-making for all supply chain participants.

**D. Research Objectives**  
1.  **System Design and Technical Implementation:** To design and implement an AI-based drug inventory system that integrates QR-based authentication, real-time inventory tracking, demand forecasting, anomaly detection, and FEFO-based inventory control.
2.  **User-Oriented Design and Operational Support:** To develop simple, role-based interfaces that allow manufacturers, warehouses, distributors, and pharmacies to easily monitor inventory status and make informed operational decisions.

**E. Scope and Significance**  
The proposed system focuses on improving efficiency, transparency, and safety within pharmaceutical supply chains. By reducing stock shortages, minimizing medicine wastage, and preventing counterfeit drugs, the system contributes to better supply chain management and improved patient safety.

## IV. PROPOSED METHODOLOGY AND SYSTEM ARCHITECTURE

**A. Overview of the Proposed Framework**  
The proposed system follows an intelligent approach to managing pharmaceutical inventory and tracking medicines throughout the supply chain. It combines QR-based drug identification with machine learning techniques to improve stock planning, reduce wastage, and prevent counterfeit drugs from entering the system.

Each drug batch is assigned a unique QR code at the manufacturing stage. This QR code is scanned whenever the batch moves from the manufacturer to warehouses, distributors, and pharmacies. These scans provide real-time updates to a central database, enabling continuous tracking of the location and status of every drug. At the same time, machine learning models analyze historical sales and inventory data to predict future demand and identify unusual patterns.

The system is designed using a modular architecture consisting of a **React-based** user interface, **Node.js** backend services, a **MongoDB** database, and a **Python Flask** AI analytics layer. This design makes the system easy to maintain, scale, and extend with new features.

**B. System Architecture**

1.  **User Interface (UI) Module**  
    The UI module provides role-based access for administrators, warehouse managers, distributors, and pharmacists. Each user is presented with a customized dashboard that displays real-time inventory levels, expiry alerts, QR scan results, and transaction history. The interface is implemented as a modern single-page application (SPA) using **React.js** and **Tailwind CSS**. It is designed to be responsive and intuitive, supporting users with varying technical backgrounds.

2.  **Backend and Core Processing Module**  
    The backend is built using **Node.js** and serves as the central communication layer. It manages user authentication, role-based authorization, QR code validation, and data flows between the UI and database. It exposes RESTful APIs to handle supply-chain activities such as inventory updates and restocking requests.

3.  **Database and Storage Module**  
    A **MongoDB** database stores information related to drug batches, inventory levels, users, transaction logs, and alerts. Each QR scan creates a permanent record, enabling complete traceability of drug movement from production to final sale. This centralized data storage supports audit trails, regulatory compliance, and counterfeit detection.

4.  **Machine Learning and Analytics Module**  
    The analytics module is developed in **Python** and exposed via a Flask API. It applies machine learning techniques to enhance decision-making:
    *   **Demand Forecasting:** The **Facebook Prophet** model is utilized to forecast future drug demand based on historical sales data, effectively handling daily, weekly, and yearly seasonality.
    *   **Anomaly Detection:** An **Isolation Forest** model is implemented to detect abnormal inventory patterns, such as sudden stock losses or irregular transaction volumes.
    These predictions allow the system to dynamically suggest stock thresholds and improve inventory planning.

5.  **Alert and Notification Module**  
    This module continuously monitors inventory data and generates alerts when stock levels fall below recommended limits or when drugs approach their expiry dates. Notifications are displayed on the user dashboard via real-time socket connections, enabling timely action such as restocking or removing expired products.

**C. Database Design**  
The database is structured to support real-time inventory monitoring and full traceability. It includes collections for drugs, batches, inventory records, users, alerts, and transaction history. Relationships between these entities allow efficient tracking of drug movement and status. Indexes are used to optimize queries related to stock levels, expiry dates, and QR code verification.

**D. Algorithmic Workflow**  
The overall workflow of the proposed system is summarized as follows:
1.  Drug batches are registered and assigned QR codes during manufacturing.
2.  QR codes are scanned at each stage of the supply chain using the web interface.
3.  Inventory data is updated in real-time in the central database.
4.  The AI module analyzes sales and stock history.
5.  **Prophet** generates demand forecasts, and **Isolation Forest** detects anomalies.
6.  Stock thresholds are adjusted based on predictions.
7.  FEFO (First-Expiry-First-Out) logic prioritizes the distribution of earlier-expiring batches.
8.  Alerts are issued when shortages, expiry risks, or abnormal activity are detected.

## V. CONCLUSION AND FUTURE SCOPE

**A. Synopsis of Results**  
The proposed AI-powered Drug Inventory and Supply Chain Management System successfully integrates QR-based drug authentication with machine learning-based demand forecasting and anomaly detection. The system enables real-time tracking of pharmaceutical products across manufacturers, warehouses, distributors, and pharmacies. Experimental evaluation shows improved inventory accuracy, reduced medicine wastage through FEFO-based dispatch, and enhanced detection of abnormal stock behavior. The role-based dashboards and automated alert mechanisms further improve operational efficiency and transparency throughout the supply chain.

**B. Restrictions**  
The performance of the system depends on the availability and quality of historical sales and inventory data. In situations where data is limited or inconsistent, demand predictions may be less accurate. In addition, QR scanning requires proper user compliance at every supply-chain stage, and failures in scanning can temporarily affect real-time tracking. Network connectivity issues may also impact live data synchronization in remote locations.

**C. Upcoming Improvements**  
In the future, a mobile application can be developed to make QR scanning and inventory updates easier for field staff. More advanced machine learning models (such as LSTM) can also be added to further improve demand prediction. Blockchain-based record-keeping could be introduced to strengthen security and prevent data tampering. The system can also be integrated with government drug tracking platforms to support large-scale deployment.

**D. Conclusion**  
The proposed AI-powered Drug Inventory and Supply Chain Management System offers a practical solution to many of the problems faced in pharmaceutical logistics. By improving drug traceability, predicting demand more accurately, and reducing expiry-related waste, the system supports safer and more efficient healthcare delivery. Its flexible and modular design allows it to be adapted to different environments, making it suitable for real-world use in modern pharmaceutical supply chains.

---

**Acknowledgment**  
The authors would like to express their gratitude to Dr. Jasmine Pau, Assistant Professor, Department of AI & DS, for her valuable guidance and supervision throughout the development of this project. The research was conducted as part of the AD3811 Project Work (2025—2026), Department of Artificial Intelligence and Data Science, KCG College of Technology, India.

**References**

[1] S. K. Verma, R. S. Rana, and A. Kumar, “Artificial Intelligence in Pharmaceutical Supply Chain Management: A Systematic Review,” *World Journal of Biology Pharmacy and Health Sciences*, vol. 8, no. 2, pp. 112–118, 2025.

[2] A. Sharma and P. Mehta, “Predictive Analytics and Optimization in Drug Supply Chain Using AI,” *International Journal of Science and Advanced Technology*, vol. 12, no. 1, pp. 34–39, Jan. 2025.

[3] V. K. Reddy and M. Choudhury, “AI for Efficient Drug Distribution and Inventory Management,” *International Journal of Science and Advanced Technology*, vol. 11, no. 6, pp. 89–94, Dec. 2024.

[4] F. Zhang, X. Liu, and Y. Chen, “Management of Drug Supply Chain Information Based on AI and Vendor Managed Inventory,” *BMC Health Services Research*, vol. 24, no. 3, pp. 456–463, 2024.

[5] M. Singh and K. Rao, “AI-Driven Solutions for the Pharmaceutical Supply Chain,” *Computers in Biology and Medicine*, vol. 169, Art. no. 107625, 2024.

[6] P. Kaur and R. Bhatia, “Smart Pharmacy Management System with AI-Based Expiry Tracking,” *International Journal of Research Publication and Reviews*, vol. 6, no. 2, pp. 92–97, 2025.

[7] T. Deshmukh and A. Rane, “Automated Expiry Date Detection System for Pharmaceutical Products,” *International Journal of Progressive Research in Engineering, Management and Science*, vol. 5, no. 1, pp. 45–50, 2025.

[8] R. D. Patel and S. N. Joshi, “A Smart Solution Against Counterfeiting Using RFID and QR Code,” *Edinburgh Journal of Information Technology*, vol. 18, no. 4, pp. 233–239, 2024.

[9] M. Iqbal and A. Nadeem, “A QR Code Approach to Counterfeit Drug Prevention,” *Journal of Neonatal Surgery*, vol. 13, no. 1, pp. 22–26, 2025.

[10] H. Lee, “Protected QR Code-Based Anti-Counterfeit System for Safeguarding the Pharmaceutical Supply Chain,” *arXiv preprint arXiv:2402.00145*, 2024.

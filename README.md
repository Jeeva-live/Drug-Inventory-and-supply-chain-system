# 🏥 AI-Powered Drug Inventory & Supply Chain Management System

The pharmaceutical supply chain is a critical infrastructure that safely delivers life-saving medicines from manufacturers to patients. However, the industry is often plagued by inefficiencies, fragmentation, and lack of transparency. 

This **AI-Powered Drug Inventory System** is designed to transform traditional supply networks into autonomous, self-correcting ecosystems. By integrating real-time QR code tracking with advanced Machine Learning algorithms, this system creates a robust, interconnected platform for manufacturers, warehouses, vendors, and pharmacies.

## 🎯 Key Objectives & Core Problems Solved

This system is built to minimize financial losses and patient health risks by addressing three major supply chain challenges:

1. **Drug Expiry (FEFO Management):** Continuously monitors stock and sends alert notifications as batches near their expiration dates, minimizing wastage.
2. **Stockouts & Demand Forecasting:** Utilizes the **Prophet** ML model alongside historical sales data to accurately forecast future demands and automate restocking alerts for local and remote pharmacies.
3. **Counterfeit Detection:** Uses unique QR code authentication from the manufacturer stage and **Isolation Forest** algorithms to track anomalies in the supply chain, actively working to achieve zero counterfeits.

## ✨ System Features

- **End-to-End Traceability:** Process QR codes for new batches (Manufacturer to System) and track them downstream through the Warehouse to the Pharmacy.
- **Role-Based Dynamic Dashboards:** Dedicated interfaces for Admin, Pharmacy, Warehouse, Manufacturer, and Vendors for customized inventory insights.
- **Predictive Analytics Engine:** A dedicated Python/Flask AI service utilizing `Prophet` and `Isolation Forest` for forecasting, outlier detection, and supply node efficiency rating.
- **Real-time Alerting:** Immediate notifications for stakeholders regarding low stock, imminent expiry, and potential counterfeit anomalies.
- **Modern Full-Stack Architecture:** A scalable architecture bridging a Node.js API, React frontend, and a Python AI data-processing service.

## 🛠️ Technology Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **AI / Data Science Service:** Python, Flask, Prophet, Isolation Forest

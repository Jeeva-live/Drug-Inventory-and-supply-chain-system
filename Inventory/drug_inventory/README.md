# AI-Powered Drug Inventory System

A restructuring of the drug inventory system into a scalable, modern architecture.

## Structure

- **backend/**: Node.js/Express REST API (MVC Pattern)
- **frontend/**: Vanilla JavaScript + Vite + Tailwind CSS Application
- **ai-model/**: Python/Flask AI Service for Demand Forecasting & Anomaly Detection

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- MongoDB Atlas URI

### 1. Backend Setup
```bash
cd backend
npm install
# Ensure .env is set with MONGO_URI, JWT_SECRET
npm start
# Server runs on http://localhost:5000
```

### 2. AI Service Setup
```bash
cd ai-model
pip install -r requirements.txt
cd api
python app.py
# Service runs on http://localhost:5001
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

## Features
- Role-based Access (Admin, Pharmacy, Warehouse, Manufacturer, Vendor)
- Real-time Inventory Tracking
- AI-driven Demand Forecasting (Prophet)
- Anomaly Detection (Isolation Forest)
- Integrated QR Code Scanning (Simulated)

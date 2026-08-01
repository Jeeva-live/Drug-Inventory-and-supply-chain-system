const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5001';

const getDemandForecast = async (drugId, location) => {
    try {
        // Updated to match app.py /predict signature
        // We'll treat this as a forecast request
        const response = await axios.post(`${AI_SERVICE_URL}/predict`, {
            product_id: drugId,
            stock_level: 1000, // Dummy for pure forecast query or fetch real if needed
            daily_sales: 50
        });
        return {
            predicted_demand: response.data.demand_forecast,
            confidence_score: 0.9, // Prophet doesn't give a simple score, mocking for UI
            raw: response.data
        };
    } catch (error) {
        console.error('AI Service Error:', error.message);
        return {
            predicted_demand: 0,
            confidence_score: 0.0,
            note: 'AI Service Unavailable'
        };
    }
};

const detectAnomalies = async (data) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/detect-anomalies`, data);
        return response.data;
    } catch (error) {
        return { status: 'Unknown', anomalies: [] };
    }
};

module.exports = {
    getDemandForecast,
    detectAnomalies
};

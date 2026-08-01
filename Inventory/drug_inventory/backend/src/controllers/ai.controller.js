const axios = require("axios");

// POST /api/ai/predict
exports.predictDemand = async (req, res) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:5001/predict",
      req.body
    );

    res.json(response.data);
  } catch (err) {
    console.error("AI SERVICE ERROR:", err.message);
    res.status(500).json({ message: "AI service unavailable" });
  }
};

// GET /api/ai/forecast
// Mock endpoint to serve forecasting graph data
exports.getForecastData = async (req, res) => {
  try {
    // In production, this would query a real Python Model service or specialized DB table.
    const forecast_series = [120, 135, 128, 142, 155, 148];
    const actual_series = [115, 130, 134, 140, 150, 0]; // 0 means not reached yet
    res.json({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      forecast: forecast_series,
      actual: actual_series
    });
  } catch (err) {
    res.status(500).json({ message: "Unable to retrieve forecast data" });
  }
};

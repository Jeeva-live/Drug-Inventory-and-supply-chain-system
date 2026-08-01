const Alert = require("../models/Alert.model");

// GET /api/alerts
exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/alerts
exports.createAlert = async (req, res) => {
  try {
    const alert = await Alert.create(req.body);
    res.status(201).json(alert);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/alerts/:id/read
exports.markAlertRead = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    res.json(alert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    drug: { type: mongoose.Schema.Types.ObjectId, ref: 'Drug' },
    productId: { type: String }, // For demo/seed data mapping
    location: { type: String },
    current_stock: Number,
    dailySales: Number, // AI Metric
    expiryDays: Number, // AI Metric
    leadTime: Number, // AI Metric
    threshold: Number,
    ai_recommended_threshold: Number,
    status: { type: String, default: 'Active' }, // Active, Sent, Received
    qrStatus: { type: String, default: 'Generated' },
    last_updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inventory', inventorySchema);

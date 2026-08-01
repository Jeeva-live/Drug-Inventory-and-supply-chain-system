const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
    aiMode: {
        type: Boolean,
        default: true
    },
    lowStockAlerts: {
        type: Boolean,
        default: true
    },
    lowStockThreshold: {
        type: Number,
        default: 20
    },
    expiryAlertDays: {
        type: Number,
        default: 30
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Settings", settingsSchema);

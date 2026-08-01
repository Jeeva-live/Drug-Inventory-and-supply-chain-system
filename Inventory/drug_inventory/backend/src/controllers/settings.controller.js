const Settings = require("../models/Settings.model");

// Get Settings (Create default if not exists)
exports.getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update Settings
exports.updateSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create(req.body);
        } else {
            Object.assign(settings, req.body);
            await settings.save();
        }
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

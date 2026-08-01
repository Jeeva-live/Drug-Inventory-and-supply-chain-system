const axios = require('axios');
const cron = require('node-cron');
const Inventory = require('../models/Inventory.model');
const Alert = require('../models/Alert.model');
const socketService = require('./socket.service');
const Settings = require('../models/Settings.model');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:5001';

/**
 * START THE AUTONOMOUS PIPELINE
 * This is "The One Script" that drives the feedback loop.
 */
exports.startPipeline = () => {
    console.log('[AI Pipeline] Initializing Autonomous Scanner...');

    // Run every 1 minute
    cron.schedule('*/1 * * * *', async () => {
        // Check Global AI Switch
        try {
            const settings = await Settings.findOne();
            if (!settings || !settings.aiMode) {
                // console.log('[AI Pipeline] AI Mode is disabled. Skipping scan.');
                return;
            }
        } catch (e) {
            console.error('Error checking settings:', e);
            return;
        }

        console.log('[AI Pipeline] Scanning inventory for AI Analysis...');
        await runAnalysis();
    });
};

async function runAnalysis() {
    try {
        const items = await Inventory.find().populate('drug');

        for (const item of items) {
            // Support both Populated Drug (Real App) and Seeded Data (Demo)
            const productId = item.drug ? item.drug.name : item.productId;
            const expiryDays = item.drug
                ? Math.ceil((new Date(item.drug.expiry_date) - new Date()) / (1000 * 60 * 60 * 24))
                : item.expiryDays;

            if (!productId) continue;

            // 1. Prepare Data for AI
            // Map to Python Service Expected Format
            const payload = {
                product_id: productId,
                stock_level: item.quantity || item.currentStock || 0,
                expiry_days: expiryDays
            };

            // 2. Call AI Service
            let prediction;
            try {
                // Use correct endpoint /predict
                const response = await axios.post(`${AI_SERVICE_URL}/predict`, payload);
                prediction = response.data;
            } catch (err) {
                console.error(`[AI Service Error] Could not predict for ${productId}: ${err.message}`);
                continue;
            }

            // 3. Act on Prediction
            // "reorder_recommendation" implies we need stock
            if (prediction.reorder_recommendation) {
                await processRisk(item, prediction, productId);
            }
        }
    } catch (err) {
        console.error('[AI Pipeline Error]', err);
    }
}

async function processRisk(item, prediction, productName) {
    let type = 'INFO';
    let msg = '';
    let severity = 'LOW';

    if (prediction.reorder_recommendation) {
        type = 'REORDER';
        msg = `AI Recommends Reorder. Forecast Demand: ${prediction.demand_forecast}`;
        severity = 'medium';
    }

    if (prediction.expiry_risk === 'HIGH') {
        type = 'EXPIRING';
        msg = `High Expiry Risk detected by AI for ${productName}.`;
        severity = 'CRITICAL';
    }

    // Deduplicate - Alert.drug refers to Inventory Item ID
    const exists = await Alert.findOne({
        drug: item._id,
        type: type,
        status: 'OPEN',
        location: item.location
    });

    if (!exists) {
        const alert = await Alert.create({
            drug: item._id, // Correct ref to Inventory
            location: item.location,
            type: type,
            message: msg,
            severity: severity,
            status: 'OPEN',
            ai_generated: true
        });

        // 4. Real-time Push
        try {
            const io = socketService.getIO();
            io.emit('alert_new', alert);
            console.log(`[AI Pipeline] Pushed Alert: ${type} for ${productName}`);
        } catch (e) {
            console.warn('Socket not active');
        }
    }
}

// Keep the manual trigger for instant feedback
exports.analyzeStock = async (item) => {
    // Re-use logic for single item
    // ... (simplified for now to avoid duplication, dependent on scheduled run)
    console.log('[AI Pipeline] Manual trigger receive (processed in next loop)');
};

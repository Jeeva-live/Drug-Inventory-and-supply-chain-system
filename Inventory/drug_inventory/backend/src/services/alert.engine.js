const cron = require('node-cron');
const Inventory = require('../models/Inventory.model');
const Alert = require('../models/Alert.model');
const socketService = require('./socket.service');

// Schedule: Run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
    console.log('Running alert engine...');

    try {
        const items = await Inventory.find();

        for (const item of items) {
            // LOW STOCK CHECK
            if (item.quantity <= item.threshold) {
                const alert = await checkAndCreateAlert({
                    type: 'LOW_STOCK',
                    drug: item._id,
                    location: item.location,
                    message: `${item.name} is below threshold (${item.quantity})`,
                    severity: 'LOW'
                });
                if (alert) pushAlert(alert);
            }

            // EXPIRY CHECK
            if (item.drug && item.drug.expiry_date) {
                const daysLeft = (new Date(item.drug.expiry_date) - Date.now()) / (1000 * 60 * 60 * 24);
                if (daysLeft <= 30) {
                    const alert = await checkAndCreateAlert({
                        type: 'EXPIRING',
                        drug: item._id,
                        location: item.location,
                        message: `${item.name} expires in ${Math.ceil(daysLeft)} days`,
                        severity: daysLeft <= 7 ? 'CRITICAL' : 'EXPIRING'
                    });
                    if (alert) pushAlert(alert);
                }
            }
        }
    } catch (e) {
        console.error('[Alert Engine Error]', e);
    }
});

/**
 * Helper: Deduplicate and Create Alert
 */
async function checkAndCreateAlert(data) {
    // 1. Check if an OPEN alert of same type exists for this drug
    const existing = await Alert.findOne({
        drug: data.drug,
        type: data.type,
        status: 'OPEN',
        location: data.location
    });

    if (existing) {
        return null;
    }

    return await Alert.create({ ...data, status: 'OPEN' });
}

/**
 * Helper: Push to Socket
 */
function pushAlert(alert) {
    try {
        const io = socketService.getIO();
        io.emit('alert_new', alert);
        console.log(`[Alert Engine] Pushed alert: ${alert.type} for ${alert.drug}`);
    } catch (err) {
        console.warn('Socket not active, alert saved to DB');
    }
}

require('dotenv').config({ path: '../.env' }); // Adjust path to reach .env in backend root
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');

const Inventory = require('../src/models/Inventory.model');

async function connectDB() {
    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI is missing in .env");
        process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");
}

async function seed() {
    await connectDB();

    await Inventory.deleteMany({});
    console.log("Old inventory cleared");

    const results = [];
    const csvPath = '../../ai-model/data/data/processed/inventory.csv'; // Corrected path

    if (!fs.existsSync(csvPath)) {
        console.error(`CSV file not found at ${csvPath}. Run the python generator first.`);
        process.exit(1);
    }

    fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (data) => {
            results.push({
                // Map CSV headers to Schema fields
                productId: data.product_id,
                location: data.location,
                current_stock: Number(data.stock_level), // Map to correct schema field
                dailySales: Number(data.daily_sales),
                expiryDays: Number(data.expiry_days),
                leadTime: Number(data.lead_time_days),
                threshold: Number(data.daily_sales) * Number(data.lead_time_days) // Calculate threshold dynamically
            });
        })
        .on('end', async () => {
            try {
                await Inventory.insertMany(results);
                console.log(`Seeded ${results.length} inventory records`);
                process.exit();
            } catch (err) {
                console.error("Seeding error:", err);
                process.exit(1);
            }
        });
}

seed();

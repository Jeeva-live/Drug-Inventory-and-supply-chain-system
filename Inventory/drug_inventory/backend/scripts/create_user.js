const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');
const User = require('../src/models/User.model');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createUser() {
    try {
        if (!process.env.MONGO_URI) {
            console.error("❌ MONGO_URI is missing in .env");
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Custom User Creator - MongoDB Connected");

        console.log("\n--- Create New User ---");

        const name = await question("Name: ");
        const email = await question("Email: ");

        // Check if user exists
        const existing = await User.findOne({ email });
        if (existing) {
            console.error("\n❌ User with this email already exists!");
            process.exit(1);
        }

        const passwordPlain = await question("Password: ");
        const role = await question("Role (admin/pharmacy/manufacturer/vendor): ");
        const location = await question("Location: ");

        const password = await bcrypt.hash(passwordPlain, 10);

        const newUser = new User({
            name,
            email,
            password,
            role: role.toLowerCase(),
            location: location,
            status: 'active'
        });

        await newUser.save();
        console.log("\n✅ User created successfully!");
        console.log(`Email: ${email}`);
        console.log(`Role: ${role}`);

    } catch (err) {
        console.error("\n❌ Error creating user:", err.message);
    } finally {
        await mongoose.connection.close();
        rl.close();
        process.exit();
    }
}

createUser();

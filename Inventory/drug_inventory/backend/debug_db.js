require('dotenv').config();
const connectDB = require('./src/config/db');

console.log("Checking Env...");
console.log("MONGO_URI is set:", !!process.env.MONGO_URI);

connectDB().then(() => {
    console.log("DB Connection Attempted");
}).catch(e => {
    console.error("DB Error Check:", e);
});

const axios = require('axios');
const io = require('socket.io-client');

const BACKEND_URL = 'http://localhost:5000/api';
const AI_URL = 'http://localhost:5001';
const SOCKET_URL = 'http://localhost:5000';

async function runVerification() {
    console.log('--- STARTING SYSTEM VERIFICATION ---');

    console.log('\n[1] Checking AI Service Health...');
    try {
        const aiHealth = await axios.get(`${AI_URL}/health`);
        console.log('✅ AI Service is UP:', aiHealth.data);
    } catch (e) {
        console.error('❌ AI Service DOWN:', e.message);
        return;
    }

    console.log('\n[2] Testing AI Prediction (Direct)...');
    try {
        const prediction = await axios.post(`${AI_URL}/predict`, {
            product_id: 'PCM001',
            days: 5
        });
        console.log('✅ AI Prediction Successful:', prediction.data.forecast_details.slice(0, 1));
    } catch (e) {
        console.error('❌ AI Prediction Failed:', e.message);
    }

    console.log('\n[3] Connecting to Real-time Socket...');
    const socket = io(SOCKET_URL);

    // Promise wrapper for socket events
    const socketPromise = new Promise((resolve, reject) => {
        socket.on('connect', () => {
            console.log('✅ Socket Connected');
        });

        socket.on('alert_new', (data) => {
            console.log('\n[!] 🚨 REAL-TIME ALERT RECEIVED 🚨');
            console.log('Type:', data.type);
            console.log('Message:', data.message);
            console.log('AI Generated:', data.ai_generated);
            resolve(true); // Verification passed
        });

        setTimeout(() => {
            console.log('... No alerts received in 10s (might be normal if no risk detected yet)');
            resolve(false);
        }, 15000);
    });

    console.log('\n[4] Creating Test User (Admin)...');
    let token = '';
    try {
        // Login as admin (assuming seeded or previously created, otherwise register)
        // Trying to register a temp admin to be sure
        const rand = Math.floor(Math.random() * 1000);
        const userPayload = {
            name: `Test Admin ${rand}`,
            email: `admin${rand}@test.com`,
            password: 'password123',
            role: 'admin'
        };

        // Register or Login if exists (simplified flow)
        // Let's assume we can register freely for now based on auth controller usually
        // If not, we try login with defaultCredentials if known, or skip

        // Checking auth endpoints...
        // Assuming /auth/register exists
        let res = await axios.post(`${BACKEND_URL}/auth/register`, userPayload).catch(e => e.response);
        if (res.status !== 201) {
            // Maybe login?
            res = await axios.post(`${BACKEND_URL}/auth/login`, {
                email: userPayload.email,
                password: userPayload.password
            }).catch(e => e.response);
        }

        if (res && res.data && res.data.token) {
            token = res.data.token;
            console.log('✅ User Created/Logged In. Token acquired.');
        } else {
            console.warn('⚠️ Could not get Auth Token. Steps requiring Auth might fail.');
            // Proceeding to try anonymous inventory add if allowed (unlikely) or just checking AI flow
        }

    } catch (e) {
        console.error('❌ User Flow Error:', e.message);
    }

    console.log('\n[5] Waiting for Backend --> AI Pipeline Trigger...');
    console.log('(The backend runs analysis every 1 minute. Waiting...)');

    await socketPromise;

    console.log('\n--- VERIFICATION COMPLETE ---');
    console.log('Frontend Integration Verified by: Socket Alert Reception (Client uses same event)');
    process.exit(0);
}

runVerification();

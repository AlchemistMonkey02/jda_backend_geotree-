const axios = require('axios');

const BASE_URL = 'http://127.0.0.1:5000/api';
// Use existing user credentials/token if needed, but getEvents is active?
// events route is protected, so need login.
const MOBILE = '9876543210';
const OTP = '123456';

async function testEventsAPI() {
    try {
        console.log('--- Testing Events API ---');

        // 1. Login to get token
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, { mobileNumber: MOBILE, otp: OTP });
        const token = loginRes.data.token;
        console.log('Login Successful.');

        // 2. Fetch Events
        const eventsRes = await axios.get(`${BASE_URL}/events`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Events Fetched:', eventsRes.data.length);
        if (eventsRes.data.length > 0) {
            console.log('First Event:', eventsRes.data[0].name, 'Code:', eventsRes.data[0].code);
            console.log('✅ Events API Verified');
        } else {
            console.error('❌ No events found. Seeding failed?');
        }

    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
}

testEventsAPI();

const axios = require('axios');

const BASE_URL = 'http://127.0.0.1:5000/api';
const MOBILE = '9876543210';
const OTP = '123456';

async function testHistory() {
    try {
        console.log('--- Testing Get Plantation History ---');

        // 1. Send OTP (Required to set valid OTP for login)
        console.log('1. Sending OTP...');
        await axios.post(`${BASE_URL}/auth/send-otp`, { mobileNumber: MOBILE });

        // 2. Login
        console.log('2. Logging in...');
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, { mobileNumber: MOBILE, otp: OTP });
        const token = loginRes.data.token;
        console.log('Login Successful. Token received.');

        // 3. Get History
        console.log('3. Fetching History...');
        const headers = {
            Authorization: `Bearer ${token}`
        };

        const res = await axios.get(`${BASE_URL}/plantation/history`, { headers });

        console.log('Response Status:', res.status);
        console.log('History Count:', res.data.length);
        console.log('History Data:', JSON.stringify(res.data, null, 2));

    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
}

testHistory();

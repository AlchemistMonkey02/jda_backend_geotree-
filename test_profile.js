const axios = require('axios');

const BASE_URL = 'http://127.0.0.1:5000/api';
const MOBILE = '9876543210';
const OTP = '123456';

async function testProfile() {
    try {
        console.log('--- Testing Profile API ---');

        // 1. Send OTP
        await axios.post(`${BASE_URL}/auth/send-otp`, { mobileNumber: MOBILE });

        // 2. Login
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, { mobileNumber: MOBILE, otp: OTP });
        const token = loginRes.data.token;
        console.log('Login Successful.');

        if (!token) throw new Error('No token received');

        // 3. Get Profile
        const profileRes = await axios.get(`${BASE_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Profile Response:', profileRes.data);

        if (profileRes.data.mobileNumber === MOBILE && profileRes.data.role) {
            console.log('✅ Profile Verification Passed');
        } else {
            console.error('❌ Profile Verification Failed');
        }

    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
}

testProfile();

const axios = require('axios');

const BASE_URL = 'http://127.0.0.1:5000/api';
const MOBILE = '9999988888'; // New number for signup test
const OTP = '123456';
const NAME = 'Signup Test User';
const EMAIL = 'signup.test@example.com';

async function testSignup() {
    try {
        console.log('--- Testing Signup ---');

        // 1. Send OTP
        console.log('1. Sending OTP...');
        await axios.post(`${BASE_URL}/auth/send-otp`, { mobileNumber: MOBILE });

        // 2. Signup
        console.log('2. Registering User...');
        const signupRes = await axios.post(`${BASE_URL}/auth/signup`, {
            name: NAME,
            email: EMAIL,
            mobileNumber: MOBILE,
            otp: OTP
        });

        console.log('Signup Response:', signupRes.data);

        if (signupRes.data.token && signupRes.data.email === EMAIL && signupRes.data.name === NAME) {
            console.log('✅ Signup Flow Verified');
        } else {
            console.error('❌ Signup Flow Failed');
        }

        // Cleanup: Delete the created user
        const authHeaders = { headers: { Authorization: `Bearer ${signupRes.data.token}` } };
        await axios.delete(`${BASE_URL}/auth/profile`, authHeaders);
        console.log('Cleanup: Test user deleted.');

    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
}

testSignup();

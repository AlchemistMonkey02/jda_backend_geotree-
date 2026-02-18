const axios = require('axios');

const BASE_URL = 'http://127.0.0.1:5000/api';
const MOBILE = '9876543210'; // Using the same mobile as before
const OTP = '123456';

async function testProfileManagement() {
    try {
        console.log('--- Testing Profile Management ---');

        // 1. Login (Ensure user exists or create one via signup flow if needed, but test_flow.js likely created it)
        // If previous tests deleted it, we might need to recreate. 
        // Let's try to signup/login.

        console.log('1. Logging in...');
        await axios.post(`${BASE_URL}/auth/send-otp`, { mobileNumber: MOBILE }); // Ensure OTP is set
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, { mobileNumber: MOBILE, otp: OTP });
        let token = loginRes.data.token;
        console.log('Login Successful.');

        const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

        // 2. Update Profile
        console.log('\n2. Updating Profile...');
        const newName = 'Updated Name ' + Date.now();
        const newEmail = `updated${Date.now()}@example.com`;

        const updateRes = await axios.put(`${BASE_URL}/auth/profile`, {
            name: newName,
            email: newEmail
        }, authHeaders);

        console.log('Update Response:', updateRes.data);

        if (updateRes.data.name === newName && updateRes.data.email === newEmail) {
            console.log('✅ Profile Update Verified');
        } else {
            console.error('❌ Profile Update Failed');
        }

        // 3. Delete Account
        console.log('\n3. Deleting Account...');
        const deleteRes = await axios.delete(`${BASE_URL}/auth/profile`, authHeaders);
        console.log('Delete Response:', deleteRes.data);

        // 4. Verify Deletion
        console.log('\n4. Verifying Deletion (Try Login)...');
        try {
            await axios.post(`${BASE_URL}/auth/send-otp`, { mobileNumber: MOBILE }); // Re-sending OTP might work if it creates a NEW user skeleton, 
            // but the previous user document should be gone.
            // Actually, send-otp might create a new user if not exists (based on my controller logic).
            // So checking if the OLD user data is gone is harder if send-otp recreates it.
            // But `login` with OLD token should fail.

            await axios.get(`${BASE_URL}/auth/profile`, authHeaders);
            console.error('❌ Account Deletion Failed (Token still works or user exists)');
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 404)) {
                console.log('✅ Account Deletion Verified (Access Denied/Not Found)');
            } else {
                console.error('Unexpected error during verification:', error.message);
            }
        }

    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
}

testProfileManagement();

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://127.0.0.1:5000/api';
// Use existing user from previous tests or login again
const MOBILE = '9876543210';
const OTP = '123456';

// Dummy file creation for upload test
const createDummyFile = (filename) => {
    const filePath = path.join(__dirname, filename);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, 'dummy content');
    }
    return filePath;
};

async function testEventPlantation() {
    try {
        console.log('--- Testing Event Plantation API ---');

        // 1. Send OTP (Required to set valid OTP for login)
        await axios.post(`${BASE_URL}/auth/send-otp`, { mobileNumber: MOBILE });

        // 2. Login
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, { mobileNumber: MOBILE, otp: OTP });
        const token = loginRes.data.token;
        console.log('Login Successful.');

        // 2. Create Event Plantation
        const form = new FormData();
        form.append('type', 'event');
        form.append('eventCode', 'EVT-2026-001');
        form.append('plantName', 'Neem');
        form.append('category', 'Medicinal');
        form.append('height', '3-4 Feet');
        form.append('areaType', 'Urban');
        form.append('landOwnership', 'Community');
        form.append('lat', '26.9124');
        form.append('lng', '75.7873');

        const sitePath = createDummyFile('site_test.jpg');
        const plantPath = createDummyFile('plant_test.jpg');

        form.append('siteImage', fs.createReadStream(sitePath));
        form.append('plantationImage', fs.createReadStream(plantPath));

        const headers = {
            ...form.getHeaders(),
            Authorization: `Bearer ${token}`
        };

        console.log('Creating Event Plantation...');
        const res = await axios.post(`${BASE_URL}/plantation/create`, form, { headers });

        console.log('Response:', res.data);

        if (res.data.success && res.data.data.type === 'event' && res.data.data.eventCode === 'EVT-2026-001') {
            console.log('✅ Event Plantation Verified');
        } else {
            console.error('❌ Event Plantation Failed');
        }

        // Cleanup
        fs.unlinkSync(sitePath);
        fs.unlinkSync(plantPath);

    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
}

testEventPlantation();

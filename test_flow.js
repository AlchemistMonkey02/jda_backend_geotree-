const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://127.0.0.1:5000/api';
const MOBILE = '9876543210';
const OTP = '123456';

async function runTest() {
    try {
        console.log('--- 1. Testing Auth ---');
        // 1. Send OTP
        console.log('Sending OTP...');
        await axios.post(`${BASE_URL}/auth/send-otp`, { mobileNumber: MOBILE });
        console.log('OTP Sent.');

        // 2. Login
        console.log('Logging in...');
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, { mobileNumber: MOBILE, otp: OTP });
        const token = loginRes.data.token;
        console.log('Login Successful. Token received.');

        const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

        console.log('\n--- 2. Testing Plantation Creation ---');
        // 3. Create Plantation
        // Create dummy image file if not exists
        const dummyImgPath = path.join(__dirname, 'test_image.png');
        if (!fs.existsSync(dummyImgPath)) {
            // Create a simple text file but name it .png (multer checks extension, and maybe magic numbers? hopefully just extension)
            // Multer's default checkFileType regex in my code only checks extension and mimetype from request, not magic numbers unless I used a specific library.
            // My code: `checkFileType` uses `file.mimetype` and `path.extname`.
            fs.writeFileSync(dummyImgPath, 'dummy image content');
        }

        const form = new FormData();
        form.append('plantName', 'Test Neem');
        form.append('category', 'Medicinal');
        form.append('height', '5-6 Feet');
        form.append('areaType', 'urban');
        form.append('landOwnership', 'Private');
        form.append('lat', '26.9');
        form.append('lng', '75.8');
        form.append('siteImage', fs.createReadStream(dummyImgPath), 'site.png');
        form.append('plantationImage', fs.createReadStream(dummyImgPath), 'plant.png');

        console.log('Creating Plantation...');
        const createRes = await axios.post(`${BASE_URL}/plantation/create`, form, {
            headers: {
                ...authHeaders.headers,
                ...form.getHeaders()
            }
        });
        const plantationId = createRes.data.data._id;
        console.log(`Plantation Created. ID: ${plantationId}`);

        console.log('\n--- 3. Testing History ---');
        // 4. Get History
        const historyRes = await axios.get(`${BASE_URL}/plantation/history`, authHeaders);
        const historyItem = historyRes.data.find(h => h.id === plantationId);
        if (historyItem) {
            console.log('History fetched and verified.');
        } else {
            console.error('Plantation not found in history!');
        }

        console.log('\n--- 4. Testing Certificate Generation ---');
        // 5. Generate Certificate
        const certForm = new FormData();
        certForm.append('plantationId', plantationId);
        certForm.append('name', 'Test User');
        certForm.append('selfieImage', fs.createReadStream(dummyImgPath), 'selfie.png');

        console.log('Generating Certificate...');
        await axios.post(`${BASE_URL}/certificate/generate`, certForm, {
            headers: {
                ...authHeaders.headers,
                ...certForm.getHeaders()
            }
        });
        console.log('Certificate Generated.');

        // 6. Get Certificates
        const certRes = await axios.get(`${BASE_URL}/certificate/my-certificates`, authHeaders);
        if (certRes.data.some(c => c.id === plantationId)) {
            console.log('Certificate verified in list.');
        } else {
            console.error('Certificate not found in list!');
        }

        console.log('\n--- ALL TESTS PASSED ---');

    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
}

// Check if server is running? 
// I'll assume I run this script AFTER starting server.
runTest();

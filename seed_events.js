const axios = require('axios');

async function seedEvents() {
    try {
        console.log('Seeding Events...');
        const res = await axios.post('http://127.0.0.1:5000/api/events/seed');
        console.log('Seed Result:', res.data);
    } catch (error) {
        console.error('Seed Error:', error.response?.data || error.message);
    }
}

seedEvents();

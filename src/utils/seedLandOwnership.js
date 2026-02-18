const fs = require('fs');
const path = require('path');
const LandOwnership = require('../models/LandOwnership');

const seedLandOwnership = async () => {
    try {
        const count = await LandOwnership.countDocuments();
        if (count > 0) {
            console.log('LandOwnership collection already populated. Skipping seed.');
            return;
        }

        console.log('Seeding LandOwnership data...');

        const csvPath = path.join(__dirname, '../../assets/land_ownership.csv');

        if (!fs.existsSync(csvPath)) {
            console.error(`CSV file not found at ${csvPath}`);
            return;
        }

        const data = fs.readFileSync(csvPath, 'utf8');
        const lines = data.split('\n');

        const results = [];

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;

            const parts = trimmedLine.split(',');
            if (parts.length >= 2) {
                const id = parseInt(parts[0].trim());
                const name = parts[1].trim();

                if (!isNaN(id) && name) {
                    results.push({ id, name });
                }
            }
        }

        if (results.length > 0) {
            await LandOwnership.insertMany(results);
            console.log(`LandOwnership data seeded successfully! (${results.length} records)`);
        } else {
            console.log('No valid data found in CSV to seed.');
        }

    } catch (error) {
        console.error('Error in seedLandOwnership:', error);
    }
};

module.exports = seedLandOwnership;

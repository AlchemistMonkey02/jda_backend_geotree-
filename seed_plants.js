const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Plant = require('./src/models/Plant');
const connectDB = require('./src/config/db'); // Assuming this export exists

dotenv.config();

connectDB();

const importData = async () => {
    try {
        const filePath = path.join(__dirname, 'assets/plant_list.csv');
        if (!fs.existsSync(filePath)) {
            console.error('Plant list CSV not found at', filePath);
            process.exit(1);
        }

        const data = fs.readFileSync(filePath, 'utf8');
        const lines = data.trim().split('\n');

        const plants = [];

        // Skip header if exists? The current CSV doesn't seem to have a header based on previous view
        // 216,Bauhinia racemosa,Jungle Jalebi... 
        // So we process all lines.

        for (const line of lines) {
            const parts = line.split(',');
            // CSV Structure: ID, ScientificName, EnglishName, CreatedAt, UpdatedAt, HindiName, Category
            if (parts.length >= 3) {
                plants.push({
                    plantId: parts[0] ? parts[0].trim() : '',
                    scientificName: parts[1] ? parts[1].trim() : '',
                    englishName: parts[2] ? parts[2].trim() : '',
                    hindiName: parts[5] ? parts[5].trim() : '',
                    category: parts[6] ? parts[6].trim() : 'Other'
                });
            }
        }

        await Plant.deleteMany(); // Clear existing
        await Plant.insertMany(plants);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jda_geotree', {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);

        if (error.message.includes('whitelist') || error.message.includes('SSL')) {
            console.error('\n*********************************************************************************');
            console.error('CRITICAL: MongoDB Connection Failed due to Network/SSL/Whitelist Issue.');
            console.error('ACTION REQUIRED: Please add your current IP address to the MongoDB Atlas Network Access Whitelist.');
            console.error('Link: https://cloud.mongodb.com/v2/#/security/network/accessList');
            console.error('*********************************************************************************\n');
        }

        console.log('Retrying connection in 5 seconds...');
        setTimeout(connectDB, 5000);
    }
};

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB Disconnected. Attempting to reconnect...');
    connectDB();
});

mongoose.connection.on('error', (err) => {
    console.error(`MongoDB Runtime Error: ${err.message}`);
});

module.exports = connectDB;

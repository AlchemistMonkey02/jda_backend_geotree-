// api vesrion  1.0.0
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./src/config/db');

// Load env vars
dotenv.config();

// Connect to database
// Connect to database
connectDB();

// Seeders
const seedLandOwnership = require('./src/utils/seedLandOwnership');
// Run seeder after DB connection is established (or ideally use a delayed check, but here we can call it)
// Note: connectDB is async but doesn't return promise in some templates, but usually mongoose operations buffer.
// Better to call it.
seedLandOwnership();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const { errorHandler } = require('./src/middleware/errorMiddleware');

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/events', require('./src/routes/eventRoutes'));
app.use('/api', require('./src/routes/plantationRoutes'));
app.use('/api/location', require('./src/routes/locationRoutes'));
app.use('/api/options', require('./src/routes/optionRoutes'));

app.use(errorHandler); // Register error handler last
// app.use('/api/certificate', require('./src/routes/certificateRoutes')); // Integrated into plantationRoutes
// app.use('/api/dashboard', require('./src/routes/dashboardRoutes')); // Integrated into plantationRoutes

app.get('/', (req, res) => {
    res.json({
        message: 'API is running...',
        version: '1.0.0'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

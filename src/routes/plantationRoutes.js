const express = require('express');
const router = express.Router();
const {
    createPlantation,
    getHistory,
    generateCertificate,
    getCertificates,
    getStats
} = require('../controllers/plantationController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Plantation Routes
router.post('/plantation/create', protect, upload.fields([
    { name: 'siteImage', maxCount: 1 },
    { name: 'plantationImage', maxCount: 1 }
]), createPlantation);

router.get('/plantation/history', protect, getHistory);

// Certificate Routes
router.post('/certificate/generate', protect, upload.single('selfieImage'), generateCertificate);
router.get('/certificate/my-certificates', protect, getCertificates);

// Dashboard Routes
router.get('/dashboard/stats', getStats);

module.exports = router;

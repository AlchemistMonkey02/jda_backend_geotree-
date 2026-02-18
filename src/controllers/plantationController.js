const Plantation = require('../models/Plantation');
const path = require('path');

// Helper to get full image URL
const getImageUrl = (req, filename) => {
    if (!filename) return null;
    return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
}

// @desc    Create new plantation
// @route   POST /api/plantation/create
// @access  Private
const createPlantation = async (req, res) => {
    try {
        const {
            type,
            eventCode,
            plantName,
            category,
            height,
            areaType,
            landOwnership,
            lat,
            lng,
            address,
            date
        } = req.body;

        // Validation for Event Plantation
        if (type === 'event' && !eventCode) {
            return res.status(400).json({ message: 'Event Code is required for event plantation' });
        }

        // Get image paths
        const siteImage = req.files['siteImage'] ? req.files['siteImage'][0].filename : null;
        const plantationImage = req.files['plantationImage'] ? req.files['plantationImage'][0].filename : null;

        const plantation = await Plantation.create({
            userId: req.user._id,
            type: type || 'individual',
            eventCode,
            plantName,
            category,
            height,
            areaType,
            landOwnership,
            location: {
                lat: lat ? parseFloat(lat) : null,
                lng: lng ? parseFloat(lng) : null,
                address
            },
            images: {
                site: siteImage,
                plantation: plantationImage
            },
            date: date || Date.now()
        });

        res.status(201).json({
            success: true,
            data: plantation
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user plantation history
// @route   GET /api/plantation/history
// @access  Private
const getHistory = async (req, res) => {
    try {
        const plantations = await Plantation.find({ userId: req.user._id }).sort({ date: -1 });

        // Map to frontend structure
        const historyData = plantations.map(p => ({
            id: p._id,
            date: new Date(p.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            plantName: p.plantName,
            category: p.category,
            height: p.height,
            location: p.location.address || `Lat: ${p.location.lat?.toFixed(4)}, Lng: ${p.location.lng?.toFixed(4)}`, // Fallback
            landOwnership: p.landOwnership,
            remark: p.status === 'verified' ? 'Verified Plantation' : 'Pending Verification',
            images: {
                site: getImageUrl(req, p.images.site),
                plantation: getImageUrl(req, p.images.plantation),
                selfie: getImageUrl(req, p.images.selfie)
            }
        }));

        res.json(historyData);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Generate Certificate (Upload selfie)
// @route   POST /api/certificate/generate
// @access  Private
const generateCertificate = async (req, res) => {
    try {
        const { plantationId, name } = req.body;
        const selfieImage = req.file ? req.file.filename : null;

        const plantation = await Plantation.findOne({ _id: plantationId, userId: req.user._id });

        if (!plantation) {
            return res.status(404).json({ message: 'Plantation not found' });
        }

        plantation.images.selfie = selfieImage;
        plantation.certificateIssued = true;
        plantation.certificateDetails = {
            name: name || req.user.name,
            dateIssued: Date.now()
        };

        // Generate a simple Certificate ID
        const datePart = new Date().getFullYear();
        const idPart = plantation._id.toString().substr(-6).toUpperCase();
        plantation.certificateId = `GEO-${datePart}-${idPart}`;

        await plantation.save();

        res.json({
            success: true,
            data: plantation
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get User Certificates
// @route   GET /api/certificate/my-certificates
// @access  Private
const getCertificates = async (req, res) => {
    try {
        // Find plantations with certificates
        const plantations = await Plantation.find({
            userId: req.user._id,
            certificateIssued: true
        }).sort({ 'certificateDetails.dateIssued': -1 });

        const certificates = plantations.map(p => ({
            id: p._id,
            certificateId: p.certificateId,
            plantName: p.plantName,
            location: p.location.address || 'Unknown Location',
            date: new Date(p.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            image: getImageUrl(req, p.images.plantation) || getImageUrl(req, p.images.site), // Use plantation image for cert preview
            selfie: getImageUrl(req, p.images.selfie)
        }));

        res.json(certificates);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Dashboard Stats
// @route   GET /api/dashboard/stats
// @access  Public (or Private)
const getStats = async (req, res) => {
    try {
        const totalPlantations = await Plantation.countDocuments();
        const varieties = await Plantation.distinct('plantName');

        // Mocking some other stats for now or aggregating
        res.json({
            totalPlantations,
            varieties: varieties.length,
            contributors: await Plantation.distinct('userId').then(ids => ids.length),
            locations: 25 // Mock
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createPlantation,
    getHistory,
    generateCertificate,
    getCertificates,
    getStats
};

const LandOwnership = require('../models/LandOwnership');

// @desc    Get all land ownership options
// @route   GET /api/options/land-ownership
// @access  Public
const getLandOwnerships = async (req, res) => {
    try {
        const options = await LandOwnership.find({}).sort({ name: 1 }); // Sort alphabetically or by ID as per requirement
        res.status(200).json({
            success: true,
            count: options.length,
            data: options
        });
    } catch (error) {
        console.error("Error fetching land ownerships:", error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

module.exports = {
    getLandOwnerships
};

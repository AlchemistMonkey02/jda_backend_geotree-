const axios = require('axios');

// @desc    Get address details from lat/lon
// @route   GET /api/location/address-details
// @access  Public (or Private based on needs)
const getAddressDetails = async (req, res) => {
    try {
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({ message: 'Latitude and Longitude are required' });
        }

        const apiKey = process.env.GEO_PLANET_API_KEY;

        const config = {
            method: 'get',
            url: `https://gpspl.geoplanetsolution.in/pincode/?lat=${lat}&long=${lon}&boundary=true`,
            headers: {
                'X-Auth-Key': apiKey
            }
        };

        const response = await axios(config);
        console.log("Location API Response:", response.data);

        // The external API returns text/html sometimes or JSON. User code did response.text().
        // Usually axios parses JSON automatically. If it returns text, axios data will be text.
        // We'll return whatever it sends.
        res.json(response.data);

    } catch (error) {
        console.error("Location API Error:", error.message);
        // Handle specific axios errors
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        res.status(500).json({ message: 'Failed to fetch location details' });
    }
};

module.exports = {
    getAddressDetails
};

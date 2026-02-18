const express = require('express');
const router = express.Router();
const { getAddressDetails } = require('../controllers/locationController');

// @route   GET /api/location/address-details
router.get('/address-details', getAddressDetails);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getLandOwnerships } = require('../controllers/optionController');

router.get('/land-ownership', getLandOwnerships);

module.exports = router;

const express = require('express');
const router = express.Router();
const { createEvent, getEvents, seedEvents } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect, createEvent);
router.get('/', protect, getEvents);
router.post('/seed', seedEvents); // Open for easy seeding

module.exports = router;

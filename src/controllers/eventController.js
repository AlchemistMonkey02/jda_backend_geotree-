const Event = require('../models/Event');

// @desc    Create new event
// @route   POST /api/events/create
// @access  Private (Admin only ideally, but Public for now)
const createEvent = async (req, res) => {
    try {
        const { name, code, description, date, location, organizer } = req.body;

        const eventExists = await Event.findOne({ code });
        if (eventExists) {
            return res.status(400).json({ message: 'Event code already exists' });
        }

        const event = await Event.create({
            name,
            code,
            description,
            date,
            location,
            organizer
        });

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all active events
// @route   GET /api/events
// @access  Private
const getEvents = async (req, res) => {
    try {
        const events = await Event.find({ isActive: true }).sort({ date: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Seed default events
// @route   POST /api/events/seed
// @access  Public
const seedEvents = async (req, res) => {
    try {
        const events = [
            {
                name: 'Van Mahotsav 2026',
                code: 'VAN2026',
                description: 'Annual forest festival to celebrate nature.',
                date: new Date('2026-07-01'),
                location: 'Central Park, Jaipur',
                organizer: 'JDA',
                status: 'upcoming'
            },
            {
                name: 'Green Jaipur Drive',
                code: 'GRNJP',
                description: 'City-wide plantation drive.',
                date: new Date('2026-08-15'),
                location: 'Various Locations',
                organizer: 'JDA',
                status: 'upcoming'
            },
            {
                name: 'Earth Day Special',
                code: 'EARTH26',
                description: 'Special plantation for Earth Day.',
                date: new Date('2026-04-22'),
                location: 'Smriti Van',
                organizer: 'NGO Alliance',
                status: 'upcoming'
            }
        ];

        await Event.deleteMany({}); // Clear existing
        const createdEvents = await Event.insertMany(events);

        res.json({ message: 'Events seeded successfully', count: createdEvents.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createEvent,
    getEvents,
    seedEvents
};

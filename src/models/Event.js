const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    description: String,
    date: {
        type: Date,
        required: true
    },
    location: String,
    organizer: String,
    status: {
        type: String,
        enum: ['active', 'completed', 'upcoming'],
        default: 'upcoming'
    },
    bgImage: String, // Path to background image if any
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);

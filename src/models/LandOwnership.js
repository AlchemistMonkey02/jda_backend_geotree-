const mongoose = require('mongoose');

const LandOwnershipSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('LandOwnership', LandOwnershipSchema);

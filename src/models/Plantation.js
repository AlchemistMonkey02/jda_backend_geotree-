const mongoose = require('mongoose');

const plantationSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    type: {
        type: String,
        enum: ['individual', 'event'],
        default: 'individual'
    },
    eventCode: {
        type: String
    },
    plantName: {
        type: String,
        required: true
    },
    category: {
        type: String
    },
    height: {
        type: String
    },
    areaType: {
        type: String // urban, rural etc. - although frontend sends 'urban' by default
    },
    landOwnership: {
        type: String // Private, Government, Community
    },
    location: {
        lat: { type: Number },
        lng: { type: Number },
        address: { type: String }
    },
    images: {
        site: { type: String }, // Path to site preparation image
        plantation: { type: String }, // Path to plantation image
        selfie: { type: String } // Path to selfie (certificate) image
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'verified' // verified, pending, rejected
    },
    certificateIssued: {
        type: Boolean,
        default: false
    },
    certificateId: {
        type: String
    },
    certificateDetails: {
        name: String,
        dateIssued: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Plantation', plantationSchema);

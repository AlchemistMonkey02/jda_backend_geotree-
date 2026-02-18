const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        select: false // Don't return password by default
    },
    role: {
        type: String,
        default: 'Member' // Member, Admin, etc.
    },
    otp: {
        type: String
    },
    otpExpires: {
        type: Date
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);

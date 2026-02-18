const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Send OTP
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res) => {
    const { mobileNumber } = req.body;

    if (!mobileNumber) {
        return res.status(400).json({ message: 'Mobile number is required' });
    }

    try {
        // Generate Mock OTP
        const otp = '123456';
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Check if user exists
        let user = await User.findOne({ mobileNumber });

        if (!user) {
            // If user doesn't exist, we validly can't save OTP to a non-existent user record for login
            // But for signup, we verify OTP before creating user.
            // Strategy: We can either create a temporary record or just return OTP (Mock).
            // For this flow: We will check coverage.
            // If it's a new user, we can't save OTP to DB unless we create a temp user or handle it in signup.
            // Simplified approach: Create user with empty name if not exists, or just send OK.
            // BETTER: We will upsert the user or handle it in a sophisticated way?
            // Let's just create the user shell if not exists, or update if exists.

            // Actually for "Signup", the user passes name. 
            // If we strictly follow "Send OTP -> Signup/Login", 
            // we should probably store OTP in a separate collection or allow creating user without name initially?
            // Let's go with: "Login" flow creates/updates user.
        }

        // For simplicity: We will create/update the user with just mobile number and OTP.
        // If name is missing, it's fine for now, will be updated in signup.

        if (user) {
            user.otp = otp;
            user.otpExpires = otpExpires;
            await user.save();
        } else {
            user = await User.create({
                name: 'New User', // Placeholder
                mobileNumber,
                otp,
                otpExpires
            });
        }

        res.status(200).json({ message: 'OTP sent successfully', otp }); // Returning OTP for testing convenience
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Register a new user / Verify OTP for Signup
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
    const { name, mobileNumber, otp, email } = req.body;

    try {
        const user = await User.findOne({ mobileNumber });

        if (!user) {
            return res.status(404).json({ message: 'User not found (OTP not sent?)' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        // Update user details
        user.name = name;
        user.email = email || ''; // Update email if provided
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            mobileNumber: user.mobileNumber,
            role: user.role,
            token: generateToken(user._id)
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    const { mobileNumber, otp } = req.body;

    try {
        const user = await User.findOne({ mobileNumber });

        if (user && (user.otp === otp && user.otpExpires > Date.now())) {

            // Clear OTP
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                mobileNumber: user.mobileNumber,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid OTP or Mobile Number' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                mobileNumber: user.mobileNumber,
                role: user.role
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            // If updating mobile number, ensure it's not taken by another user
            if (req.body.mobileNumber && req.body.mobileNumber !== user.mobileNumber) {
                const userExists = await User.findOne({ mobileNumber: req.body.mobileNumber });
                if (userExists) {
                    return res.status(400).json({ message: 'Mobile number already in use' });
                }
                user.mobileNumber = req.body.mobileNumber;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                mobileNumber: updatedUser.mobileNumber,
                role: updatedUser.role,
                token: generateToken(updatedUser._id) // Optional: issue new token if needed, but not strictly required unless claims change
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user account
// @route   DELETE /api/auth/profile
// @access  Private
const deleteAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    sendOtp,
    signup,
    login,
    getProfile,
    updateProfile,
    deleteAccount
};

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const signToken = (userId) =>
    jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '2d' });

// ── SIGNUP ──────────────────────────────────────────
// POST /api/auth/signup
router.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !phone || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        // Check existing user
        const existing = await User.findOne({ email: email.toLowerCase().trim() });
        if (existing) {
            return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
        }

        // Create user
        const user = await User.create({ firstName, lastName, email, phone, password });

        const token = signToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Account created successfully! Welcome to Zomato 🎉',
            token,
            user: user.toJSON(),
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ success: false, message: 'Email already registered.' });
        }
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((e) => e.message).join(', ');
            return res.status(400).json({ success: false, message: messages });
        }
        console.error('Signup error:', err);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
});

// ── LOGIN ───────────────────────────────────────────
// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }

        // Find user (include password for comparison)
        const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        const token = signToken(user._id);

        res.status(200).json({
            success: true,
            message: `Welcome back, ${user.firstName}! 👋`,
            token,
            user: user.toJSON(),
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
});

// ── GET ME (verify token) ────────────────────────────
// GET /api/auth/me  (Authorization: Bearer <token>)
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ success: false, message: 'No token provided.' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

        res.json({ success: true, user });
    } catch (err) {
        res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
});

module.exports = router;

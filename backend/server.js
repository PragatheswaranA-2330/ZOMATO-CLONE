require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// ── MIDDLEWARE ──
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── ROUTES ──
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Zomato API is running 🚀', db: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal server error.' });
});

// ── MONGODB CONNECTION ──
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('✅  MongoDB connected:', process.env.MONGO_URI);
        app.listen(PORT, () => {
            console.log(`🚀  Zomato API running on http://localhost:${PORT}`);
            console.log(`📋  Health check: http://localhost:${PORT}/api/health`);
        });
    })
    .catch((err) => {
        console.error('❌  MongoDB connection failed:', err.message);
        process.exit(1);
    });

const express = require('express');
const router = express.Router();

// Import route modules
const healthRoutes = require('./healthRoutes');
const contactRoutes = require('./contactRoutes');
const authRoutes = require('./authRoutes');
const contentRoutes = require('./contentRoutes');
const adminRoutes = require('./adminRoutes');

// Mount routes
router.use('/health', healthRoutes);
router.use('/contact', contactRoutes);
router.use('/admin', authRoutes);
router.use('/content', contentRoutes);
router.use('/admin', adminRoutes);

module.exports = router;

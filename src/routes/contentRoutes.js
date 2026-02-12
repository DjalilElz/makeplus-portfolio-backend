const express = require('express');
const router = express.Router();
const { getPublicStats } = require('../controllers/statsController');
const { getPublicVideos } = require('../controllers/videoController');
const { getPublicPartners } = require('../controllers/partnerController');

// Public content routes
router.get('/stats', getPublicStats);
router.get('/videos', getPublicVideos);
router.get('/partners', getPublicPartners);

module.exports = router;

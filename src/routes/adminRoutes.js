const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/auth');
const { adminLimiter } = require('../middleware/rateLimiter');

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Import controllers
const { getStats, updateStats } = require('../controllers/statsController');
const {
  getAllVideos,
  getVideo,
  createVideo,
  updateVideo,
  deleteVideo,
  reorderVideos
} = require('../controllers/videoController');
const {
  getAllPartners,
  getPartner,
  createPartner,
  updatePartner,
  deletePartner,
  reorderPartners
} = require('../controllers/partnerController');
const {
  getAllContacts,
  getContact,
  updateContactStatus,
  deleteContact,
  getContactStats
} = require('../controllers/adminContactController');

// Import validators
const {
  validateStats,
  validateVideoCreate,
  validateVideoUpdate,
  validatePartnerCreate,
  validatePartnerUpdate,
  validateContactStatus
} = require('../middleware/validator');

// Apply protection and rate limiting to all admin routes
router.use(protect);
router.use(adminLimiter);

// Statistics routes
router.get('/stats', getStats);
router.put('/stats', validateStats, updateStats);

// Video routes
router.get('/videos', getAllVideos);
router.get('/videos/:id', getVideo);
router.post('/videos', validateVideoCreate, createVideo);
router.put('/videos/:id', validateVideoUpdate, updateVideo);
router.delete('/videos/:id', deleteVideo);
router.put('/videos/reorder', reorderVideos);

// Partner routes
router.get('/partners', getAllPartners);
router.get('/partners/:id', getPartner);
router.post('/partners', upload.single('logo'), validatePartnerCreate, createPartner);
router.put('/partners/:id', upload.single('logo'), validatePartnerUpdate, updatePartner);
router.delete('/partners/:id', deletePartner);
router.put('/partners/reorder', reorderPartners);

// Contact submissions routes
router.get('/contacts', getAllContacts);
router.get('/contacts/stats/summary', getContactStats);
router.get('/contacts/:id', getContact);
router.put('/contacts/:id/status', validateContactStatus, updateContactStatus);
router.delete('/contacts/:id', deleteContact);

module.exports = router;

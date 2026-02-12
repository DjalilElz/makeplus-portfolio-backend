const express = require('express');
const router = express.Router();
const { loginAdmin, logoutAdmin, getMe } = require('../controllers/authController');
const { validateLogin } = require('../middleware/validator');
const { loginLimiter } = require('../middleware/rateLimiter');
const { protect } = require('../middleware/auth');

router.post('/login', loginLimiter, validateLogin, loginAdmin);
router.post('/logout', protect, logoutAdmin);
router.get('/me', protect, getMe);

module.exports = router;

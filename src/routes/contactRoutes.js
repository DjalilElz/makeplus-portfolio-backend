const express = require('express');
const router = express.Router();
const { submitContactForm } = require('../controllers/contactController');
const { validateContact } = require('../middleware/validator');
const { contactLimiter } = require('../middleware/rateLimiter');

router.post('/', contactLimiter, validateContact, submitContactForm);

module.exports = router;

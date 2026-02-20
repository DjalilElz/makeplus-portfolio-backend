const { body, validationResult } = require('express-validator');

/**
 * Validation middleware
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg
      }))
    });
  }

  next();
};

/**
 * Contact form validation rules
 */
const validateContact = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/).withMessage('Name can only contain letters, spaces, hyphens, and apostrophes')
    .escape(),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 10, max: 20 }).withMessage('Phone must be between 10 and 20 characters')
    .matches(/^[\d\s+()-]+$/).withMessage('Phone can only contain numbers, spaces, +, (), and -')
    .escape(),

  body('company')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Company name cannot exceed 100 characters')
    .escape(),

  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required')
    .isLength({ min: 3, max: 200 }).withMessage('Subject must be between 3 and 200 characters')
    .escape(),

  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters')
    .escape(),

  body('language')
    .optional()
    .isIn(['fr', 'en']).withMessage('Language must be either fr or en'),

  validate
];

/**
 * Admin login validation
 */
const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),

  validate
];

/**
 * Stats update validation
 */
const validateStats = [
  body('internationalCongress.value')
    .optional()
    .isInt({ min: 0 }).withMessage('Value must be a positive integer'),

  body('symposium.value')
    .optional()
    .isInt({ min: 0 }).withMessage('Value must be a positive integer'),

  body('satisfiedCompanies.value')
    .optional()
    .isInt({ min: 0 }).withMessage('Value must be a positive integer'),

  validate
];

/**
 * Video validation (Create)
 */
const validateVideoCreate = [
  body('titleFr')
    .trim()
    .notEmpty().withMessage('French title is required')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters')
    .escape(),

  body('titleEn')
    .trim()
    .notEmpty().withMessage('English title is required')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters')
    .escape(),

  body('youtubeUrl')
    .trim()
    .notEmpty().withMessage('YouTube URL is required')
    .isURL().withMessage('Invalid YouTube URL format'),

  body('isActive').optional().isBoolean(),
  body('order').optional().isInt({ min: 0 }),
  validate
];

/**
 * Video validation (Update)
 */
const validateVideoUpdate = [
  body('titleFr').optional().trim().notEmpty().isLength({ max: 200 }).escape(),
  body('titleEn').optional().trim().notEmpty().isLength({ max: 200 }).escape(),
  body('youtubeUrl').optional().trim().isURL().withMessage('Invalid YouTube URL format'),
  body('isActive').optional().isBoolean(),
  body('order').optional().isInt({ min: 0 }),
  validate
];

/**
 * Partner validation (Create)
 */
const validatePartnerCreate = [
  body('name')
    .trim()
    .notEmpty().withMessage('Partner name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters')
    .escape(),

  body('website')
    .optional({ checkFalsy: true })
    .trim()
    .isURL().withMessage('Invalid URL format'),

  body('isActive').optional().isBoolean(),
  body('order').optional().isInt({ min: 0 }),
  validate
];

/**
 * Partner validation (Update)
 */
const validatePartnerUpdate = [
  body('name').optional().trim().notEmpty().isLength({ max: 100 }).escape(),
  body('website').optional().trim().isURL(),
  body('isActive').optional().isBoolean(),
  body('order').optional().isInt({ min: 0 }),
  validate
];

/**
 * Contact status update validation
 */
const validateContactStatus = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['new', 'read', 'replied', 'archived']).withMessage('Invalid status value'),

  validate
];

module.exports = {
  validateContact,
  validateLogin,
  validateStats,
  validateVideoCreate,
  validateVideoUpdate,
  validatePartnerCreate,
  validatePartnerUpdate,
  validateContactStatus
};

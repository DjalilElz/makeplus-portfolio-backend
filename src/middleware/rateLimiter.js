const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for contact form submissions
 * Limit: 5 requests per 15 minutes per IP
 */
const contactLimiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 5, // 5 requests per window
  message: {
    success: false,
    message: 'Too many contact form submissions from this IP. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

/**
 * Rate limiter for admin routes
 * More lenient for authenticated requests
 */
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.ADMIN_RATE_LIMIT_MAX || 100, // 100 requests per window
  message: {
    success: false,
    message: 'Too many requests from this IP'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for authenticated requests in development
    return process.env.NODE_ENV === 'development';
  }
});

/**
 * Rate limiter for login attempts
 * Strict limit to prevent brute force attacks
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts per window
  message: {
    success: false,
    message: 'Too many login attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
});

module.exports = {
  contactLimiter,
  adminLimiter,
  loginLimiter
};

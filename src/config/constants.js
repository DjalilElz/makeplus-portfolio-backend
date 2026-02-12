// Application constants
module.exports = {
  // File upload limits
  MAX_VIDEO_SIZE: process.env.MAX_VIDEO_SIZE || 100 * 1024 * 1024, // 100MB
  MAX_IMAGE_SIZE: process.env.MAX_IMAGE_SIZE || 5 * 1024 * 1024, // 5MB
  
  // Allowed file types
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/quicktime'],
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'],
  
  // Contact status
  CONTACT_STATUS: {
    NEW: 'new',
    READ: 'read',
    REPLIED: 'replied',
    ARCHIVED: 'archived'
  },
  
  // Admin roles
  ADMIN_ROLES: {
    SUPERADMIN: 'superadmin',
    ADMIN: 'admin'
  },
  
  // Languages
  LANGUAGES: {
    FR: 'fr',
    EN: 'en'
  },
  
  // Rate limiting
  RATE_LIMIT: {
    WINDOW_MS: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
    MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS || 5,
    ADMIN_MAX: process.env.ADMIN_RATE_LIMIT_MAX || 100
  },
  
  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100
  },
  
  // JWT
  JWT: {
    SECRET: process.env.JWT_SECRET,
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN || 7
  },
  
  // Email
  EMAIL: {
    FROM: process.env.EMAIL_FROM,
    TO: process.env.EMAIL_TO || 'contact@makeplus.com'
  }
};

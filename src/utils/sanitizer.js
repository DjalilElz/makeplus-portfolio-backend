/**
 * Sanitization utilities
 */

/**
 * Escape HTML to prevent XSS attacks
 */
const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

/**
 * Remove potentially dangerous characters from input
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Trim whitespace
  let sanitized = input.trim();
  
  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');
  
  // Remove control characters except newline and tab
  sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
  
  return sanitized;
};

/**
 * Validate and sanitize email
 */
const sanitizeEmail = (email) => {
  if (typeof email !== 'string') return '';
  
  return email.toLowerCase().trim();
};

/**
 * Sanitize phone number
 */
const sanitizePhone = (phone) => {
  if (typeof phone !== 'string') return '';
  
  // Keep only numbers, spaces, +, (), and -
  return phone.replace(/[^\d\s+()-]/g, '');
};

module.exports = {
  escapeHtml,
  sanitizeInput,
  sanitizeEmail,
  sanitizePhone
};

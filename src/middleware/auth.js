const jwt = require('jsonwebtoken');
const { Admin } = require('../models-sql');

/**
 * Protect routes - Authentication middleware
 */
const protect = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in header or cookie
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if admin still exists
      const admin = await Admin.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });
      
      if (!admin || !admin.is_active) {
        return res.status(401).json({
          success: false,
          message: 'Admin no longer exists or is inactive'
        });
      }
      
      req.admin = admin;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token is invalid or has expired'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

/**
 * Restrict to specific roles
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

module.exports = { protect, restrictTo };

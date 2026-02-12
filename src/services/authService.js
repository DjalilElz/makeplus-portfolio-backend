const jwt = require('jsonwebtoken');
const { Admin } = require('../models-sql');

/**
 * Generate JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

/**
 * Create and send token in response
 */
const sendTokenResponse = (admin, statusCode, res) => {
  const token = generateToken(admin.id);
  
  const options = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };
  
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        }
      }
    });
};

/**
 * Login admin
 */
const login = async (email, password) => {
  // Check if admin exists
  const admin = await Admin.findOne({ 
    where: { email },
    attributes: { include: ['password'] }
  });
  
  if (!admin) {
    throw new Error('Invalid credentials');
  }
  
  // Check if admin is active
  if (!admin.is_active) {
    throw new Error('Account is deactivated');
  }
  
  // Check password
  const isPasswordMatch = await admin.comparePassword(password);
  
  if (!isPasswordMatch) {
    throw new Error('Invalid credentials');
  }
  
  // Update last login
  admin.last_login = new Date();
  await admin.save();
  
  return admin;
};

/**
 * Verify token
 */
const verifyToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!admin || !admin.is_active) {
      return null;
    }
    
    return admin;
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  sendTokenResponse,
  login,
  verifyToken
};

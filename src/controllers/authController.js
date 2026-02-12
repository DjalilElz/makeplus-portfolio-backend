const { sendTokenResponse, login } = require('../services/authService');

/**
 * @route   POST /api/admin/login
 * @desc    Admin login
 * @access  Public
 */
const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const admin = await login(email, password);
    
    sendTokenResponse(admin, 200, res);
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @route   POST /api/admin/logout
 * @desc    Admin logout
 * @access  Private
 */
const logoutAdmin = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

/**
 * @route   GET /api/admin/me
 * @desc    Get current admin info
 * @access  Private
 */
const getMe = async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: req.admin
  });
};

module.exports = {
  loginAdmin,
  logoutAdmin,
  getMe
};

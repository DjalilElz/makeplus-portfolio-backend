/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 * @access  Public
 */
const healthCheck = async (req, res) => {
  const uptime = process.uptime();
  
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(uptime),
    environment: process.env.NODE_ENV || 'development'
  });
};

module.exports = {
  healthCheck
};

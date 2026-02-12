require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/models-sql');

const PORT = process.env.PORT || 5000;

// Connect to MySQL Database
connectDB();

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📧 Email notifications will be sent to: ${process.env.EMAIL_TO}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

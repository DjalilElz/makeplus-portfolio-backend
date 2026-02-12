import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { connectDB } from './config/database-worker';
import healthRoutes from './routes/healthRoutes-worker';
import contactRoutes from './routes/contactRoutes-worker';
import authRoutes from './routes/authRoutes-worker';
import contentRoutes from './routes/contentRoutes-worker';
import adminRoutes from './routes/adminRoutes-worker';
import { errorHandler } from './middleware/errorHandler-worker';

const app = new Hono();

// Middleware
app.use('*', secureHeaders());
app.use('*', logger());
app.use('*', cors({
  origin: (origin) => {
    const allowedOrigins = [
      'https://makeplus.com',
      'https://admin.makeplus.com',
      'http://localhost:3000',
      'http://localhost:3001'
    ];
    return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
}));

// Connect to MongoDB on each request (Workers pattern)
app.use('*', async (c, next) => {
  try {
    await connectDB(c.env.MONGODB_URI);
    await next();
  } catch (error) {
    console.error('Database connection error:', error);
    return c.json({ success: false, message: 'Database connection failed' }, 500);
  }
});

// Routes
app.route('/api/health', healthRoutes);
app.route('/api/contact', contactRoutes);
app.route('/api/admin', authRoutes);
app.route('/api/content', contentRoutes);
app.route('/api/admin', adminRoutes);

// Error handling
app.onError(errorHandler);

// 404 handler
app.notFound((c) => {
  return c.json({
    success: false,
    message: 'Endpoint not found'
  }, 404);
});

export default app;

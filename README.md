# Makeplus Portfolio Backend API

A production-ready Node.js/Express backend API for the Makeplus portfolio website with contact form handling, content management, and admin dashboard capabilities.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Security](#security)

## ✨ Features

- **Contact Form Management**: Handle contact form submissions with email notifications
- **Admin Dashboard**: Secure admin authentication and management panel
- **Content Management**: Manage portfolio content (videos, partners, statistics)
- **Email Integration**: Automated email notifications via SMTP
- **Security**: JWT authentication, rate limiting, helmet security headers, input validation
- **Database**: MySQL with Sequelize ORM for robust data persistence
- **CORS**: Configured for specific frontend and admin origins
- **Production-Ready**: Optimized for cPanel/shared hosting deployment

## 🛠 Tech Stack

- **Runtime**: Node.js (≥18.0.0)
- **Framework**: Express.js 4.x
- **Database**: MySQL (with Sequelize ORM 6.x)
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer
- **Security**: Helmet, bcrypt, express-rate-limit
- **Validation**: express-validator

## 📦 Prerequisites

Before installation, ensure you have:

- Node.js 18.x or higher
- npm or yarn package manager
- MySQL database (5.7+ or 8.0+)
- SMTP email account credentials

## 🚀 Installation

1. **Extract the files** to your server

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   - Rename `.env.production` to `.env`
   - Update with your database credentials (see Configuration below)

## ⚙️ Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-domain.com
ADMIN_URL=https://your-admin-panel-domain.com

# Database Configuration (MySQL)
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_SYNC=true
DB_ALTER=false

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7

# Email Configuration
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@yourdomain.com
SMTP_PASSWORD=your_email_password
EMAIL_FROM="Your Company Name" <contact@yourdomain.com>
EMAIL_TO=notifications@yourdomain.com

# File Upload Configuration
MAX_VIDEO_SIZE=100000000
MAX_IMAGE_SIZE=5000000
UPLOAD_PATH=./uploads

# Security
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
ADMIN_RATE_LIMIT_MAX=200

# Default Admin (for first-time setup)
DEFAULT_ADMIN_EMAIL=admin@yourdomain.com
DEFAULT_ADMIN_PASSWORD=change-this-password
DEFAULT_ADMIN_NAME=Admin Name
```

### Environment Variables Explained

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode (production/development) | production |
| `PORT` | Server port | 5000 |
| `FRONTEND_URL` | Frontend application URL (for CORS) | - |
| `ADMIN_URL` | Admin panel URL (for CORS) | - |
| `DB_DIALECT` | Database type | mysql |
| `DB_HOST` | Database host | localhost |
| `DB_NAME` | Database name | - |
| `DB_USER` | Database username | - |
| `DB_PASSWORD` | Database password | - |
| `DB_SYNC` | Auto-create tables on startup | true |
| `JWT_SECRET` | Secret key for JWT tokens (min 32 chars) | - |
| `JWT_EXPIRES_IN` | Token expiration time | 7d |
| `SMTP_HOST` | SMTP server host | - |
| `SMTP_PORT` | SMTP server port | 587 |
| `SMTP_USER` | SMTP username | - |
| `SMTP_PASSWORD` | SMTP password | - |
| `EMAIL_FROM` | Sender email address | - |
| `EMAIL_TO` | Notification recipient email | - |

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```
Uses nodemon for automatic restarts on file changes.

### Production Mode

```bash
npm start
```

### Create Admin User

After first deployment, create an admin user:

```bash
npm run create-admin
```

Follow the prompts to enter admin details, or it will use `DEFAULT_ADMIN_*` values from `.env`.

### Verify Setup

Check database connectivity and configuration:

```bash
npm run verify
```

## 📚 API Documentation

See [API-DOCUMENTATION.md](./API-DOCUMENTATION.md) for complete endpoint documentation.

### Quick Overview

- **Base URL**: `http://yourdomain.com/api`
- **Authentication**: JWT Bearer tokens in Authorization header

### Main Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/health` | GET | No | Health check |
| `/api/contact` | POST | No | Submit contact form |
| `/api/content/stats` | GET | No | Get portfolio stats |
| `/api/content/videos` | GET | No | Get portfolio videos |
| `/api/content/partners` | GET | No | Get partners |
| `/api/admin/login` | POST | No | Admin login |
| `/api/admin/*` | Various | Yes | Admin operations |

## 📁 Project Structure

```
makeplus-portfolio-backend/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── config/
│   │   ├── constants.js       # Application constants
│   │   └── database-sql.js    # Database connection
│   ├── controllers/           # Request handlers
│   │   ├── adminContactController.js
│   │   ├── authController.js
│   │   ├── contactController.js
│   │   ├── healthController.js
│   │   ├── partnerController.js
│   │   ├── statsController.js
│   │   └── videoController.js
│   ├── middleware/            # Express middleware
│   │   ├── auth.js           # JWT authentication
│   │   ├── errorHandler.js   # Global error handler
│   │   ├── rateLimiter.js    # Rate limiting
│   │   └── validator.js      # Request validation
│   ├── models-sql/            # Sequelize models
│   │   ├── index.js          # Database initialization
│   │   ├── Admin.js          # Admin user model
│   │   ├── Contact.js        # Contact submission model
│   │   ├── Partner.js        # Partner model
│   │   ├── Stats.js          # Statistics model
│   │   └── Video.js          # Video model
│   ├── routes/                # API routes
│   │   ├── index.js          # Route aggregator
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── contentRoutes.js
│   │   └── healthRoutes.js
│   ├── services/              # Business logic
│   │   ├── authService.js    # Authentication logic
│   │   └── emailService.js   # Email sending
│   ├── templates/             # Email templates
│   │   ├── autoReplyEmail.js
│   │   └── notificationEmail.js
│   └── utils/                 # Helper functions
│       ├── helpers.js
│       ├── logger.js
│       └── sanitizer.js
├── scripts/
│   ├── createAdmin.js         # Admin creation script
│   └── verify-setup.js        # Setup verification
├── server.js                  # Application entry point
├── package.json               # Dependencies and scripts
├── .env.production            # Production env template
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

## 📜 Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Start | `npm start` | Run in production mode |
| Dev | `npm run dev` | Run with auto-reload (nodemon) |
| Create Admin | `npm run create-admin` | Create admin user |
| Verify | `npm run verify` | Verify database and config |

## 🔒 Security Features

- **Helmet**: Security headers configuration
- **CORS**: Restricted to specified origins
- **Rate Limiting**: Protection against brute force attacks
- **JWT**: Secure token-based authentication
- **Bcrypt**: Password hashing (10 rounds)
- **Input Validation**: express-validator for all inputs
- **SQL Injection Protection**: Sequelize ORM parameterized queries
- **XSS Protection**: Input sanitization

### Security Best Practices

1. **Change JWT_SECRET**: Use a strong, unique secret (min 32 characters)
2. **Use HTTPS**: Always use SSL/TLS in production
3. **Update Dependencies**: Regularly run `npm audit` and update packages
4. **Strong Passwords**: Enforce strong admin passwords
5. **Environment Variables**: Never commit `.env` files to version control
6. **CORS Configuration**: Only allow trusted frontend domains

## 🔧 Troubleshooting

### Database Connection Issues

```bash
# Test database connection
npm run verify

# Check MySQL is running
mysql -u username -p -h localhost

# Verify credentials in .env file
```

### Port Already in Use

```bash
# Change PORT in .env file
PORT=3000

# Or kill process using port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or kill process using port 5000 (Linux)
lsof -ti:5000 | xargs kill -9
```

### Email Not Sending

1. Verify SMTP credentials in `.env`
2. Check SMTP port (587 for TLS, 465 for SSL)
3. Ensure SMTP_SECURE matches port (false for 587)
4. Test email configuration with a simple SMTP tester
5. Check firewall/hosting provider allows outbound SMTP

### 404 Errors on All Routes

1. Check Application URL configuration in cPanel/hosting
2. Verify routes are mounted correctly (see `src/app.js`)
3. Check server logs for startup errors
4. Ensure `.env` file exists and is loaded

## � Important Notes

- **Node.js**: Requires version ≥18.0.0
- **Database**: MySQL with Sequelize ORM
- **Auto-sync**: `DB_SYNC=true` creates tables automatically on first run (set to `false` after initial deployment)
- **Security**: Change `JWT_SECRET` to a strong random string (min 32 characters)
- **Email**: Configure SMTP settings for contact form notifications
- **CORS**: Update `FRONTEND_URL` and `ADMIN_URL` with your actual domain URLs

## 📄 License

ISC License - Copyright (c) 2026 Makeplus

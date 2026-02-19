# Complete Backend Documentation - Makeplus Portfolio API

**Version**: 1.0.0  
**Last Updated**: February 18, 2026  
**Deployment**: cPanel Production Environment

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Database Structure](#database-structure)
4. [Installation & Setup](#installation--setup)
5. [cPanel Deployment Guide](#cpanel-deployment-guide)
6. [Environment Configuration](#environment-configuration)
7. [API Endpoints](#api-endpoints)
8. [Security](#security)
9. [Maintenance & Monitoring](#maintenance--monitoring)
10. [Troubleshooting](#troubleshooting)
11. [Backup & Recovery](#backup--recovery)

---

## 📖 Overview

### Project Description

The Makeplus Portfolio Backend is a production-ready Node.js/Express API that powers the Makeplus portfolio website and admin dashboard. It handles contact form submissions with automated email notifications, content management, and secure admin authentication.

### Key Features

- ✅ **Contact Form System**: Public contact form with email notifications
- ✅ **Admin Dashboard**: Secure authentication and management interface
- ✅ **Content Management**: Videos, partners, and statistics
- ✅ **Email Integration**: Automated SMTP email notifications (admin + auto-reply)
- ✅ **Security**: JWT authentication, rate limiting, input validation, CORS
- ✅ **Database**: MySQL with Sequelize ORM
- ✅ **Production-Ready**: Optimized for cPanel/shared hosting

### Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | ≥18.0.0 | Runtime environment |
| Express.js | 4.x | Web framework |
| MySQL | 5.7+ / 8.0+ | Database |
| Sequelize | 6.x | ORM (Object-Relational Mapping) |
| JWT | 9.x | Authentication tokens |
| Nodemailer | 6.x | Email service |
| Bcrypt | 2.x | Password hashing |
| Helmet | 7.x | Security headers |

---

## 🏗️ System Architecture

### Application Structure

```
Backend API
    │
    ├── Express Server (server.js)
    │   └── Port: 5000 (configurable)
    │
    ├── Middleware Layer
    │   ├── CORS (Frontend + Admin domains)
    │   ├── Helmet (Security headers)
    │   ├── Rate Limiting (5-200 req/15min)
    │   ├── JWT Authentication
    │   └── Input Validation
    │
    ├── Routes Layer
    │   ├── /api/health - Health check
    │   ├── /api/contact - Public contact form
    │   ├── /api/content/* - Public content
    │   ├── /api/admin/login - Authentication
    │   └── /api/admin/* - Protected admin routes
    │
    ├── Controllers Layer
    │   ├── Process requests
    │   ├── Call services
    │   └── Return responses
    │
    ├── Services Layer
    │   ├── authService - JWT & authentication
    │   └── emailService - SMTP email sending
    │
    ├── Models Layer (Sequelize ORM)
    │   ├── Admin
    │   ├── Contact
    │   ├── Video
    │   ├── Partner
    │   └── Stats
    │
    └── Database (MySQL)
        └── Tables: admins, contacts, videos, partners, stats
```

### Request Flow

```
Client Request
    ↓
CORS Check → Rate Limiting → Authentication (if protected)
    ↓
Route Handler
    ↓
Input Validation
    ↓
Controller
    ↓
Service Layer / Database
    ↓
Response to Client
```

### Directory Structure

```
makeplus-portfolio-backend/
│
├── server.js                      # Application entry point
├── package.json                   # Dependencies & scripts
├── .env                          # Environment configuration
├── .env.production               # Production template
│
├── src/
│   ├── app.js                    # Express app configuration
│   │
│   ├── config/
│   │   ├── constants.js          # Application constants
│   │   └── database-sql.js       # Database connection
│   │
│   ├── controllers/              # Request handlers
│   │   ├── adminContactController.js  # Admin contact management
│   │   ├── authController.js          # Admin authentication
│   │   ├── contactController.js       # Public contact form
│   │   ├── healthController.js        # Health check
│   │   ├── partnerController.js       # Partner CRUD
│   │   ├── statsController.js         # Stats CRUD
│   │   └── videoController.js         # Video CRUD
│   │
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication
│   │   ├── errorHandler.js       # Global error handler
│   │   ├── rateLimiter.js        # Rate limiting config
│   │   └── validator.js          # Request validation
│   │
│   ├── models-sql/               # Database models (Sequelize)
│   │   ├── index.js              # Model initialization
│   │   ├── Admin.js              # Admin user model
│   │   ├── Contact.js            # Contact submission model
│   │   ├── Partner.js            # Partner/client model
│   │   ├── Stats.js              # Statistics model
│   │   └── Video.js              # Video portfolio model
│   │
│   ├── routes/                   # API routes
│   │   ├── index.js              # Route aggregator
│   │   ├── adminRoutes.js        # Admin management routes
│   │   ├── authRoutes.js         # Authentication routes
│   │   ├── contactRoutes.js      # Contact form routes
│   │   ├── contentRoutes.js      # Public content routes
│   │   └── healthRoutes.js       # Health check routes
│   │
│   ├── services/                 # Business logic
│   │   ├── authService.js        # JWT & auth logic
│   │   └── emailService.js       # Email sending logic
│   │
│   ├── templates/                # Email templates
│   │   ├── autoReplyEmail.js     # User auto-reply
│   │   └── notificationEmail.js  # Admin notification
│   │
│   └── utils/                    # Helper utilities
│       ├── helpers.js            # General helpers
│       ├── logger.js             # Logging utility
│       ├── sanitizer.js          # Input sanitization
│       └── youtubeHelpers.js     # YouTube URL helpers
│
└── scripts/                      # Utility scripts
    ├── createAdmin.js            # Create admin user
    └── verify-setup.js           # Verify configuration
```

---

## 🗄️ Database Structure

### Overview

**Database Type**: MySQL 5.7+ / 8.0+  
**ORM**: Sequelize 6.x  
**Total Tables**: 5

### Entity Relationship Diagram

```
┌─────────────┐         ┌──────────────┐
│   admins    │────────>│   contacts   │
│             │         │              │
│  (created)  │         │  (status)    │
└─────────────┘         └──────────────┘
      │
      │ (created_by)
      ↓
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   videos    │         │   partners   │         │    stats    │
└─────────────┘         └──────────────┘         └─────────────┘
```

---

### Table: `admins`

**Purpose**: Store admin user accounts with encrypted passwords

| Column | Type | Null | Default | Description |
|--------|------|------|---------|-------------|
| `id` | INT | NO | AUTO_INCREMENT | Primary key |
| `email` | VARCHAR(255) | NO | - | Unique admin email |
| `password` | VARCHAR(255) | NO | - | Bcrypt hashed password |
| `name` | VARCHAR(100) | NO | - | Admin display name |
| `role` | ENUM('admin','superadmin') | NO | 'admin' | Admin role level |
| `is_active` | BOOLEAN | NO | true | Account status |
| `last_login` | DATETIME | YES | NULL | Last login timestamp |
| `created_at` | DATETIME | NO | CURRENT_TIMESTAMP | Record creation time |
| `updated_at` | DATETIME | NO | CURRENT_TIMESTAMP | Last update time |

**Indexes**:
- PRIMARY KEY (`id`)
- UNIQUE KEY (`email`)
- INDEX (`is_active`)

**Security**:
- Passwords hashed with bcrypt (12 rounds)
- Password field excluded from JSON responses
- Email validated for proper format

**Sample Data**:
```sql
INSERT INTO admins (email, password, name, role) 
VALUES ('info@wemakeplus.com', '$2a$12$...', 'Makeplus Admin', 'superadmin');
```

---

### Table: `contacts`

**Purpose**: Store contact form submissions from website visitors

| Column | Type | Null | Default | Description |
|--------|------|------|---------|-------------|
| `id` | INT | NO | AUTO_INCREMENT | Primary key |
| `name` | VARCHAR(100) | NO | - | Contact name (2-100 chars) |
| `email` | VARCHAR(255) | NO | - | Contact email |
| `phone` | VARCHAR(20) | YES | NULL | Contact phone (optional) |
| `company` | VARCHAR(100) | YES | NULL | Company name (optional) |
| `subject` | VARCHAR(200) | NO | - | Message subject (5-200 chars) |
| `message` | TEXT | NO | - | Message content (10-2000 chars) |
| `language` | ENUM('fr','en') | NO | 'fr' | Form language |
| `status` | ENUM('new','read','replied','archived') | NO | 'new' | Message status |
| `ip_address` | VARCHAR(45) | YES | NULL | Submitter IP address |
| `user_agent` | TEXT | YES | NULL | Browser user agent |
| `email_sent` | BOOLEAN | NO | false | Email notification sent flag |
| `email_sent_at` | DATETIME | YES | NULL | Email sent timestamp |
| `created_at` | DATETIME | NO | CURRENT_TIMESTAMP | Submission time |
| `updated_at` | DATETIME | NO | CURRENT_TIMESTAMP | Last update time |

**Indexes**:
- PRIMARY KEY (`id`)
- INDEX (`email`)
- INDEX (`status`)
- INDEX (`created_at` DESC)
- INDEX (`language`)

**Validation**:
- Name: 2-100 characters
- Email: Valid email format
- Subject: 5-200 characters
- Message: 10-2000 characters
- Language: 'fr' or 'en'
- Status: 'new', 'read', 'replied', 'archived'

**Workflow**:
1. User submits form → Creates record with status='new'
2. Email sent to admin → Updates `email_sent=true`
3. Auto-reply sent to user → Logged in `email_sent_at`
4. Admin views message → Status='read'
5. Admin replies → Status='replied'
6. Admin archives → Status='archived'

**Sample Data**:
```sql
INSERT INTO contacts (name, email, subject, message, language, status) 
VALUES ('John Doe', 'john@example.com', 'Project Inquiry', 'I need a video...', 'en', 'new');
```

---

### Table: `videos`

**Purpose**: Store portfolio video showcases (YouTube videos)

| Column | Type | Null | Default | Description |
|--------|------|------|---------|-------------|
| `id` | INT | NO | AUTO_INCREMENT | Primary key |
| `title_fr` | VARCHAR(200) | NO | - | French video title |
| `title_en` | VARCHAR(200) | NO | - | English video title |
| `description_fr` | TEXT | YES | NULL | French description |
| `description_en` | TEXT | YES | NULL | English description |
| `youtube_url` | VARCHAR(255) | NO | - | Full YouTube URL |
| `youtube_video_id` | VARCHAR(50) | YES | NULL | Extracted video ID |
| `category` | VARCHAR(50) | YES | NULL | Video category |
| `tags` | JSON | NO | [] | Video tags (array) |
| `display_order` | INT | NO | 0 | Display order (lower first) |
| `is_active` | BOOLEAN | NO | true | Active/inactive flag |
| `created_by` | INT | YES | NULL | Admin who created (FK) |
| `created_at` | DATETIME | NO | CURRENT_TIMESTAMP | Creation time |
| `updated_at` | DATETIME | NO | CURRENT_TIMESTAMP | Last update time |

**Indexes**:
- PRIMARY KEY (`id`)
- INDEX (`display_order`)
- INDEX (`is_active`)
- INDEX (`created_at` DESC)
- FOREIGN KEY (`created_by`) REFERENCES `admins(id)`

**Features**:
- Bilingual support (French/English)
- YouTube URL validation
- Auto-extract video ID from URL
- JSON tags support (MySQL 8.0+)
- Display ordering

**Sample Data**:
```sql
INSERT INTO videos (title_fr, title_en, youtube_url, category, display_order) 
VALUES ('Vidéo Corporate', 'Corporate Video', 'https://youtube.com/watch?v=abc123', 'corporate', 1);
```

---

### Table: `partners`

**Purpose**: Store partner/client logos and information

| Column | Type | Null | Default | Description |
|--------|------|------|---------|-------------|
| `id` | INT | NO | AUTO_INCREMENT | Primary key |
| `name` | VARCHAR(100) | NO | - | Partner name (1-100 chars) |
| `logo` | LONGTEXT | NO | - | Base64 encoded logo image |
| `logo_mime_type` | VARCHAR(50) | NO | 'image/png' | Image MIME type |
| `website` | VARCHAR(255) | YES | NULL | Partner website URL |
| `display_order` | INT | NO | 0 | Display order (lower first) |
| `is_active` | BOOLEAN | NO | true | Active/inactive flag |
| `created_at` | DATETIME | NO | CURRENT_TIMESTAMP | Creation time |
| `updated_at` | DATETIME | NO | CURRENT_TIMESTAMP | Last update time |

**Indexes**:
- PRIMARY KEY (`id`)
- INDEX (`display_order`)
- INDEX (`is_active`)

**Logo Storage**:
- **Format**: Base64 encoded string
- **Storage**: LONGTEXT field (supports large images)
- **MIME Types**: image/png, image/jpeg, image/gif, image/webp
- **Max Size**: Limited by `MAX_IMAGE_SIZE` env variable (5MB default)

**Sample Data**:
```sql
INSERT INTO partners (name, logo, website, display_order) 
VALUES ('Company ABC', 'data:image/png;base64,iVBORw0KGgo...', 'https://company.com', 1);
```

---

### Table: `stats`

**Purpose**: Store portfolio statistics (single row, updated)

| Column | Type | Null | Default | Description |
|--------|------|------|---------|-------------|
| `id` | INT | NO | AUTO_INCREMENT | Primary key |
| `international_congress_value` | INT | NO | 11 | Congress count |
| `international_congress_label_fr` | VARCHAR(100) | NO | 'Congrés Internationale' | French label |
| `international_congress_label_en` | VARCHAR(100) | NO | 'International Congress' | English label |
| `symposium_value` | INT | NO | 24 | Symposium count |
| `symposium_label_fr` | VARCHAR(100) | NO | 'Symposium' | French label |
| `symposium_label_en` | VARCHAR(100) | NO | 'Symposium' | English label |
| `satisfied_companies_value` | INT | NO | 28 | Companies count |
| `satisfied_companies_label_fr` | VARCHAR(100) | NO | 'Societé satisfait' | French label |
| `satisfied_companies_label_en` | VARCHAR(100) | NO | 'Satisfied Companies' | English label |
| `updated_by` | INT | YES | NULL | Admin who updated (FK) |
| `updated_at` | DATETIME | NO | CURRENT_TIMESTAMP | Last update time |

**Indexes**:
- PRIMARY KEY (`id`)
- FOREIGN KEY (`updated_by`) REFERENCES `admins(id)`

**Note**: 
- Typically contains only 1 row
- Updated by admin, not inserted
- No `created_at` field (only updates matter)

**Sample Data**:
```sql
INSERT INTO stats (id, international_congress_value, symposium_value, satisfied_companies_value) 
VALUES (1, 11, 24, 28);
```

---

### Database Relationships

```sql
-- admins -> videos (one-to-many)
ALTER TABLE videos 
ADD CONSTRAINT fk_videos_admin 
FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL;

-- admins -> stats (one-to-many)
ALTER TABLE stats 
ADD CONSTRAINT fk_stats_admin 
FOREIGN KEY (updated_by) REFERENCES admins(id) ON DELETE SET NULL;
```

---

### Database Initialization

**Automatic Setup**: When `DB_SYNC=true`, Sequelize auto-creates tables on first run.

**Manual Creation**: If needed, connect to MySQL and run:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS wemaszvr_portfolio 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE wemaszvr_portfolio;

-- Tables will be created automatically by Sequelize
-- when the application starts with DB_SYNC=true
```

---

## 🚀 Installation & Setup

### Prerequisites

Before starting, ensure you have:

- ✅ **Node.js**: Version 18.0.0 or higher
- ✅ **npm**: Package manager (comes with Node.js)
- ✅ **MySQL**: Database server 5.7+ or 8.0+
- ✅ **SMTP Account**: For sending emails (e.g., cPanel email)
- ✅ **cPanel Access**: For deployment
- ✅ **Domain**: With SSL certificate

### Local Development Setup

**Step 1: Clone or Extract Files**

```bash
# Extract the backend files to your local machine
cd /path/to/makeplus-portfolio-backend/
```

**Step 2: Install Dependencies**

```bash
npm install
```

**Step 3: Configure Environment**

```bash
# Copy production template
cp .env.production .env

# Edit .env with your credentials
nano .env  # or use any text editor
```

**Step 4: Create Database**

```sql
-- Connect to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE makeplus_portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

**Step 5: Start Development Server**

```bash
npm run dev
```

The server will start on `http://localhost:5000`

**Step 6: Verify Setup**

```bash
npm run verify
```

**Step 7: Create Admin User**

```bash
npm run create-admin
```

---

## 📦 cPanel Deployment Guide

### Complete Deployment Steps

#### Step 1: Prepare Database in cPanel

1. **Login to cPanel**
2. Go to **MySQL® Databases**
3. **Create New Database**:
   - Database name: `wemaszvr_portfolio` (cPanel adds prefix automatically)
   - Click "Create Database"
4. **Create Database User**:
   - Username: `portfoliouser`
   - Password: Generate strong password
   - Click "Create User"
5. **Add User to Database**:
   - Select user and database
   - Grant **ALL PRIVILEGES**
   - Click "Make Changes"
6. **Note Your Credentials**:
   ```
   DB_HOST=localhost
   DB_NAME=wemaszvr_portfolio  (with cPanel prefix)
   DB_USER=wemaszvr_portfoliouser  (with cPanel prefix)
   DB_PASSWORD=(your generated password)
   ```

#### Step 2: Setup Node.js Application in cPanel

1. Go to **Setup Node.js App**
2. Click **Create Application**
3. Configure:
   - **Node.js version**: 18.x or higher
   - **Application mode**: Production
   - **Application root**: `/home/username/portfolio-api` (or your path)
   - **Application URL**: `wemakeplus.com` (your domain)
   - **Application startup file**: `server.js`
4. Click **Create**

#### Step 3: Upload Backend Files

**Option A: File Manager**
1. Go to cPanel → **File Manager**
2. Navigate to your application root (e.g., `/home/username/portfolio-api`)
3. Upload all files (except `node_modules` and `.env`)
4. Compress locally, upload ZIP, then extract

**Option B: FTP/SFTP**
```bash
# Using SFTP
sftp username@wemakeplus.com
cd portfolio-api
put -r * 
```

**Option C: Git (Recommended)**
1. Setup Git in cPanel (if available)
2. Clone repository
3. Pull updates when needed

#### Step 4: Configure Environment Variables

1. In cPanel File Manager, navigate to application root
2. Create/Edit `.env` file:

```env
# Server Configuration
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://wemakeplus.com
ADMIN_URL=https://admin.wemakeplus.com

# Database Configuration
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=wemaszvr_portfolio
DB_USER=wemaszvr_portfoliouser
DB_PASSWORD=djalildjalil23
DB_SYNC=true
DB_ALTER=false

# JWT Configuration
JWT_SECRET=mk7pL9vR2nX4qW8tY3jH6bN1mK5sP0oU9iE4wQ7aZ2cF3gD8hT6vB1nM
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7

# Email Configuration
SMTP_HOST=mail.wemakeplus.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@wemakeplus.com
SMTP_PASSWORD=oPQ2Z2b-MHjL
EMAIL_FROM="Makeplus Website" <contact@wemakeplus.com>
EMAIL_TO=info@wemakeplus.com

# File Upload
MAX_VIDEO_SIZE=100000000
MAX_IMAGE_SIZE=5000000
UPLOAD_PATH=./uploads

# Security
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
ADMIN_RATE_LIMIT_MAX=200

# Default Admin
DEFAULT_ADMIN_EMAIL=info@wemakeplus.com
DEFAULT_ADMIN_PASSWORD=oPQ2Z2b-MHjL
DEFAULT_ADMIN_NAME=Makeplus Admin
```

#### Step 5: Install Dependencies in cPanel

1. Go back to **Setup Node.js App**
2. Click on your application
3. Click **Run NPM Install** button
4. Wait for installation to complete

#### Step 6: Start Application

1. In **Setup Node.js App**, click **Start App** or **Restart**
2. Check status shows "Running"
3. Note the application URL

#### Step 7: Create Admin User

Using cPanel Terminal:

```bash
cd /home/username/portfolio-api
npm run create-admin
```

Or manually via database:

```sql
-- Connect to MySQL
mysql -u wemaszvr_portfoliouser -p wemaszvr_portfolio

-- Insert admin (password will be hashed on first login)
INSERT INTO admins (email, password, name, role, is_active) 
VALUES ('info@wemakeplus.com', '$2a$12$...bcrypt_hash...', 'Makeplus Admin', 'superadmin', 1);
```

#### Step 8: Test Deployment

**Test Health Check**:
```bash
curl https://wemakeplus.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-18T...",
  "uptime": 123,
  "environment": "production"
}
```

**Test from Browser**:
```
https://wemakeplus.com/api/health
```

#### Step 9: Configure SSL (HTTPS)

1. Go to cPanel → **SSL/TLS Status**
2. Enable **AutoSSL** for your domain
3. Wait 5-10 minutes for certificate installation
4. Verify HTTPS works: `https://wemakeplus.com/api/health`

#### Step 10: Update Frontend CORS

After frontend deployment, update `.env`:

```env
FRONTEND_URL=https://wemakeplus.com
ADMIN_URL=https://admin.wemakeplus.com
```

Then restart the app in cPanel (Setup Node.js App → Restart).

---

### cPanel Application Management

**Restart Application**:
- Setup Node.js App → Click "Restart"
- Required after: .env changes, code updates

**View Logs**:
- Setup Node.js App → Click "View Logs"
- Check for errors, startup messages

**Stop Application**:
- Setup Node.js App → Click "Stop App"

**Update Code**:
1. Upload new files via File Manager/FTP
2. Click "Restart" in Setup Node.js App

**Update Dependencies**:
1. Modify `package.json` if needed
2. Click "Run NPM Install" in Setup Node.js App
3. Click "Restart"

---

## ⚙️ Environment Configuration

### Complete Environment Variables Reference

#### Server Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | Yes | production | Environment mode |
| `PORT` | Yes | 5000 | Server port |
| `FRONTEND_URL` | Yes | - | Frontend domain (CORS) |
| `ADMIN_URL` | Yes | - | Admin domain (CORS) |

**Example**:
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://wemakeplus.com
ADMIN_URL=https://admin.wemakeplus.com
```

#### Database Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DB_DIALECT` | Yes | mysql | Database type |
| `DB_HOST` | Yes | localhost | Database host |
| `DB_PORT` | No | 3306 | Database port |
| `DB_NAME` | Yes | - | Database name |
| `DB_USER` | Yes | - | Database username |
| `DB_PASSWORD` | Yes | - | Database password |
| `DB_SYNC` | No | true | Auto-create tables |
| `DB_ALTER` | No | false | Auto-alter tables |

**Example**:
```env
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=wemaszvr_portfolio
DB_USER=wemaszvr_portfoliouser
DB_PASSWORD=your_strong_password
DB_SYNC=true
DB_ALTER=false
```

**Important**:
- Set `DB_SYNC=true` for first deployment (creates tables)
- Set `DB_SYNC=false` after initial setup (prevents accidental table drops)
- Never use `DB_ALTER=true` in production (can cause data loss)

#### JWT Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `JWT_SECRET` | Yes | - | Secret key (min 32 chars) |
| `JWT_EXPIRES_IN` | No | 7d | Token expiration (7d, 30d, etc.) |
| `JWT_COOKIE_EXPIRES_IN` | No | 7 | Cookie expiration (days) |

**Example**:
```env
JWT_SECRET=mk7pL9vR2nX4qW8tY3jH6bN1mK5sP0oU9iE4wQ7aZ2cF3gD8hT6vB1nM
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7
```

**Generate Strong JWT Secret**:
```bash
# Node.js command
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use online generator
# https://randomkeygen.com/
```

#### Email Configuration (SMTP)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SMTP_HOST` | Yes | - | SMTP server host |
| `SMTP_PORT` | Yes | 587 | SMTP port (587 for TLS, 465 for SSL) |
| `SMTP_SECURE` | No | false | Use SSL (true for port 465) |
| `SMTP_USER` | Yes | - | SMTP username |
| `SMTP_PASSWORD` | Yes | - | SMTP password |
| `EMAIL_FROM` | Yes | - | Sender email address |
| `EMAIL_TO` | Yes | - | Admin notification email |

**Example - cPanel Email**:
```env
SMTP_HOST=mail.wemakeplus.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@wemakeplus.com
SMTP_PASSWORD=your_email_password
EMAIL_FROM="Makeplus Website" <contact@wemakeplus.com>
EMAIL_TO=info@wemakeplus.com
```

**Port Configuration**:
- **Port 587**: TLS/STARTTLS (`SMTP_SECURE=false`)
- **Port 465**: SSL (`SMTP_SECURE=true`)
- **Port 25**: Usually blocked by hosting providers

#### File Upload Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MAX_VIDEO_SIZE` | No | 100000000 | Max video size (bytes) |
| `MAX_IMAGE_SIZE` | No | 5000000 | Max image size (bytes) |
| `UPLOAD_PATH` | No | ./uploads | Upload directory |

**Example**:
```env
MAX_VIDEO_SIZE=100000000  # 100 MB
MAX_IMAGE_SIZE=5000000    # 5 MB
UPLOAD_PATH=./uploads
```

#### Security Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `RATE_LIMIT_WINDOW` | No | 15 | Rate limit window (minutes) |
| `RATE_LIMIT_MAX_REQUESTS` | No | 100 | Max requests per window |
| `ADMIN_RATE_LIMIT_MAX` | No | 200 | Admin max requests per window |

**Example**:
```env
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
ADMIN_RATE_LIMIT_MAX=200
```

#### Default Admin Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DEFAULT_ADMIN_EMAIL` | No | - | Pre-fill admin email |
| `DEFAULT_ADMIN_PASSWORD` | No | - | Pre-fill admin password |
| `DEFAULT_ADMIN_NAME` | No | - | Pre-fill admin name |

**Example**:
```env
DEFAULT_ADMIN_EMAIL=info@wemakeplus.com
DEFAULT_ADMIN_PASSWORD=ChangeThisPassword123!
DEFAULT_ADMIN_NAME=Makeplus Admin
```

**Note**: Only used by `npm run create-admin` script for convenience.

---

## 🔌 API Endpoints

### Quick Reference

For complete API documentation, see [API-DOCUMENTATION.md](./API-DOCUMENTATION.md).

#### Public Endpoints (No Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/content/stats` | Get portfolio statistics |
| GET | `/api/content/videos` | Get portfolio videos |
| GET | `/api/content/partners` | Get partners |

#### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login (returns JWT) |
| GET | `/api/admin/me` | Get current admin profile |
| POST | `/api/admin/logout` | Logout (client-side) |

#### Admin Endpoints (Require JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/contacts` | Get all contacts (paginated) |
| GET | `/api/admin/contacts/:id` | Get single contact |
| PUT | `/api/admin/contacts/:id/status` | Update contact status |
| DELETE | `/api/admin/contacts/:id` | Delete contact |
| POST | `/api/admin/stats` | Create/update stats |
| PUT | `/api/admin/stats/:id` | Update stats |
| POST | `/api/admin/videos` | Create video |
| PUT | `/api/admin/videos/:id` | Update video |
| DELETE | `/api/admin/videos/:id` | Delete video |
| POST | `/api/admin/partners` | Create partner |
| PUT | `/api/admin/partners/:id` | Update partner |
| DELETE | `/api/admin/partners/:id` | Delete partner |

---

## 🔒 Security

### Security Features Implemented

#### 1. Authentication & Authorization
- **JWT Tokens**: 7-day expiration, secure signing
- **Bcrypt Password Hashing**: 12 rounds
- **Role-Based Access**: Admin vs Super Admin
- **Token Verification**: Middleware on protected routes

#### 2. Rate Limiting
- **Contact Form**: 5 requests / 15 minutes per IP
- **Admin Login**: 5 attempts / 15 minutes per IP
- **General API**: 100 requests / 15 minutes per IP
- **Admin API**: 200 requests / 15 minutes per IP

#### 3. Input Validation & Sanitization
- **express-validator**: All inputs validated
- **Sanitization**: XSS protection, SQL injection prevention
- **Type Checking**: Strict data types enforced
- **Length Limits**: Max lengths on all fields

#### 4. HTTP Security Headers (Helmet)
- Content Security Policy (CSP)
- X-Frame-Options (clickjacking protection)
- X-Content-Type-Options (MIME sniffing protection)
- Strict-Transport-Security (HTTPS enforcement)
- X-XSS-Protection

#### 5. CORS Policy
- **Whitelist Only**: Specific domains allowed
- **Credentials**: Allowed for authenticated requests
- **Pre-flight**: OPTIONS requests handled

#### 6. Database Security
- **Sequelize ORM**: Parameterized queries (SQL injection protection)
- **Connection Pool**: Limited connections
- **Password**: Never returned in API responses
- **Timestamps**: Audit trail on all records

### Security Best Practices

✅ **DO**:
- Use strong passwords (min 12 characters, mixed case, numbers, symbols)
- Change JWT_SECRET to unique value (min 32 characters)
- Use HTTPS in production (SSL certificate required)
- Keep `NODE_ENV=production` in production
- Regular `npm audit` and dependency updates
- Monitor logs for suspicious activity
- Backup database regularly
- Limit database user privileges
- Use strong SMTP credentials
- Keep `.env` file secure (never commit to Git)

❌ **DON'T**:
- Use default passwords
- Expose `.env` file publicly
- Use `DB_ALTER=true` in production
- Allow wildcard (*) in CORS
- Log sensitive data (passwords, tokens)
- Run as root user
- Expose error stack traces to clients
- Use outdated Node.js/npm packages

### Password Requirements

**Admin Passwords**:
- Minimum 8 characters
- Mix of uppercase, lowercase, numbers, symbols
- No common words (password, admin, 123456, etc.)

**JWT Secret**:
- Minimum 32 characters
- Random alphanumeric string
- Generate with `crypto.randomBytes(32).toString('hex')`

---

## 🔧 Maintenance & Monitoring

### Regular Maintenance Tasks

#### Daily

**Check Application Status**:
- Visit: `https://wemakeplus.com/api/health`
- Verify: `"status": "healthy"`
- cPanel → Setup Node.js App → Check "Running"

**Monitor Logs**:
```bash
# cPanel Terminal
cd /home/username/portfolio-api
tail -f logs/app.log  # if logging configured
```

Or in cPanel → Setup Node.js App → View Logs

#### Weekly

**Check Disk Space**:
```bash
# cPanel Terminal
df -h
```

**Review Contact Submissions**:
- Login to admin dashboard
- Check new messages
- Mark as read/replied

**Check Email Delivery**:
- Verify contact form emails arriving
- Check spam folder
- Test auto-reply

#### Monthly

**Update Dependencies**:
```bash
npm outdated  # Check for updates
npm audit     # Security check
npm update    # Update minor/patch versions
```

**Database Backup** (see Backup section)

**Review Rate Limit Logs**:
- Check for blocked IPs
- Identify suspicious patterns

**SSL Certificate Check**:
- cPanel → SSL/TLS Status
- Verify expiration date
- Renew if needed (AutoSSL does this automatically)

#### Quarterly

**Security Audit**:
- Review admin accounts
- Remove inactive admins
- Update passwords

**Performance Review**:
- Check response times
- Optimize database queries if needed
- Review server resources

**Major Updates**:
- Update Node.js version if new LTS available
- Update major dependencies (test first!)

---

### Monitoring

#### Health Check Endpoint

**URL**: `https://wemakeplus.com/api/health`

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-18T10:30:00.000Z",
  "uptime": 86400,
  "environment": "production"
}
```

**Monitoring Script** (optional):
```bash
#!/bin/bash
# health-check.sh
response=$(curl -s https://wemakeplus.com/api/health)
status=$(echo $response | jq -r '.status')

if [ "$status" != "healthy" ]; then
    echo "ALERT: API is down!" | mail -s "API Alert" admin@wemakeplus.com
fi
```

#### Database Monitoring

**Check Connection**:
```sql
-- Connect via cPanel phpMyAdmin or Terminal
mysql -u wemaszvr_portfoliouser -p wemaszvr_portfolio

-- Check tables
SHOW TABLES;

-- Check row counts
SELECT 'admins' as table_name, COUNT(*) as rows FROM admins
UNION ALL
SELECT 'contacts', COUNT(*) FROM contacts
UNION ALL
SELECT 'videos', COUNT(*) FROM videos
UNION ALL
SELECT 'partners', COUNT(*) FROM partners
UNION ALL
SELECT 'stats', COUNT(*) FROM stats;
```

**Database Size**:
```sql
SELECT 
    table_schema as 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) as 'Size (MB)'
FROM information_schema.tables 
WHERE table_schema = 'wemaszvr_portfolio'
GROUP BY table_schema;
```

#### Performance Monitoring

**Node.js Memory Usage**:
```bash
# cPanel Terminal
ps aux | grep node
```

**Response Time Test**:
```bash
curl -o /dev/null -s -w "Time: %{time_total}s\n" https://wemakeplus.com/api/health
```

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### 1. Application Won't Start

**Symptoms**:
- Status shows "Stopped" in cPanel
- Health check returns connection error

**Solutions**:

**Check A: Port conflict**
```bash
# cPanel Terminal
netstat -tulnp | grep 5000
# If port in use, change PORT in .env
```

**Check B: Missing dependencies**
```bash
cd /home/username/portfolio-api
npm install
# Then restart in cPanel
```

**Check C: .env file missing or incorrect**
```bash
ls -la .env  # Check file exists
cat .env     # Review contents
```

**Check D: Database connection**
```bash
# Test MySQL connection
mysql -u wemaszvr_portfoliouser -p wemaszvr_portfolio
# If fails, check DB credentials in .env
```

**Check E: View logs**
- cPanel → Setup Node.js App → View Logs
- Look for error messages

---

#### 2. Database Connection Errors

**Error**: `SequelizeConnectionError: Access denied`

**Solution**:
1. Verify database credentials in `.env`
2. Check user has privileges:
```sql
-- As root or admin
SHOW GRANTS FOR 'wemaszvr_portfoliouser'@'localhost';
-- Should show ALL PRIVILEGES on database
```
3. Reset password if needed
4. Restart application

---

**Error**: `SequelizeConnectionError: Unknown database`

**Solution**:
1. Check database name in `.env`
2. List databases:
```sql
SHOW DATABASES LIKE 'wemaszvr%';
```
3. Create database if missing:
```sql
CREATE DATABASE wemaszvr_portfolio 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

#### 3. CORS Errors

**Symptoms**:
- Frontend shows "CORS policy" error
- Network tab shows preflight OPTIONS request failing

**Solutions**:

**Check A: Update CORS URLs in .env**
```env
FRONTEND_URL=https://wemakeplus.com
ADMIN_URL=https://admin.wemakeplus.com
```

**Check B: Restart application**
- CORS changes require restart
- cPanel → Setup Node.js App → Restart

**Check C: Verify exact URL match**
- URL must be exact (https, no trailing slash)
- `https://wemakeplus.com` ≠ `http://wemakeplus.com`
- `https://wemakeplus.com` ≠ `https://www.wemakeplus.com`

**Check D: Multiple domains**
```env
# Separate with commas
FRONTEND_URL=https://wemakeplus.com,https://www.wemakeplus.com
```

---

#### 4. Email Not Sending

**Symptoms**:
- Contact form submits but no emails received
- `email_sent=false` in database

**Solutions**:

**Check A: SMTP credentials**
```env
# Verify in .env
SMTP_HOST=mail.wemakeplus.com
SMTP_USER=contact@wemakeplus.com
SMTP_PASSWORD=correct_password
```

**Check B: SMTP ports**
- Port 587 (TLS): `SMTP_SECURE=false`
- Port 465 (SSL): `SMTP_SECURE=true`
- Port 25: Often blocked by hosting providers

**Check C: Test SMTP manually**
```bash
# Using telnet
telnet mail.wemakeplus.com 587
```

**Check D: Email account exists**
- cPanel → Email Accounts
- Verify account is active

**Check E: Check spam folder**
- Both admin and user emails

**Check F: Firewall**
- cPanel/server may block outbound SMTP
- Contact hosting provider

---

#### 5. 401 Unauthorized on Admin Routes

**Symptoms**:
- Login works but subsequent requests fail
- Token not being accepted

**Solutions**:

**Check A: Token expiration**
- JWT expires after 7 days (default)
- Login again to get new token

**Check B: Token sent correctly**
```javascript
// Frontend should send:
headers: {
  'Authorization': 'Bearer ' + token  // Note the space after "Bearer"
}
```

**Check C: JWT secret changed**
- If `JWT_SECRET` changed, all old tokens invalid
- Users must login again

---

#### 6. Rate Limit Errors (429)

**Symptoms**:
- Error: "Too many requests"
- Status code 429

**Solutions**:

**For Legitimate Traffic**:
- Wait 15 minutes
- Increase limits in `.env`:
```env
RATE_LIMIT_MAX_REQUESTS=200  # Increase from 100
ADMIN_RATE_LIMIT_MAX=400      # Increase from 200
```
- Restart application

**For Testing**:
- Use different IP
- Disable rate limiting temporarily (not recommended for production)

---

#### 7. Database Sync Issues

**Error**: `SequelizeUnique ConstraintError` or `Table already exists`

**Solution A: Reset sync flags**
```env
DB_SYNC=false
DB_ALTER=false
```

**Solution B: Manual table creation**
```sql
-- Drop and recreate if needed (CAUTION: loses data)
DROP DATABASE IF EXISTS wemaszvr_portfolio;
CREATE DATABASE wemaszvr_portfolio 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
Then set `DB_SYNC=true` and restart.

---

#### 8. Cannot Create Admin User

**Error**: `Admin already exists` or `Email must be unique`

**Solution A: Check existing admins**
```sql
SELECT id, email, name, role, is_active FROM admins;
```

**Solution B: Reset password**
```sql
-- Update existing admin password
-- Generate bcrypt hash first
UPDATE admins 
SET password = '$2a$12$new_bcrypt_hash_here' 
WHERE email = 'info@wemakeplus.com';
```

**Solution C: Delete and recreate**
```sql
DELETE FROM admins WHERE email = 'info@wemakeplus.com';
-- Then run: npm run create-admin
```

---

### Error Logs

**View Application Logs**:
- cPanel → Setup Node.js App → View Logs

**View MySQL Error Logs**:
- cPanel → Metrics → Errors

**View Email Logs**:
- cPanel → Email → Track Delivery

---

## 💾 Backup & Recovery

### Database Backup

#### Manual Backup via cPanel

**Method 1: phpMyAdmin**
1. cPanel → phpMyAdmin
2. Select `wemaszvr_portfolio` database
3. Click "Export" tab
4. Format: SQL
5. Click "Go"
6. Save `wemaszvr_portfolio.sql` file

**Method 2: cPanel Backup**
1. cPanel → Backup Wizard
2. Click "Backup"
3. Select "Download a MySQL Database Backup"
4. Choose `wemaszvr_portfolio`
5. Download `.sql.gz` file

**Method 3: Terminal**
```bash
# cPanel Terminal
mysqldump -u wemaszvr_portfoliouser -p wemaszvr_portfolio > backup_$(date +%Y%m%d).sql

# Compress
gzip backup_$(date +%Y%m%d).sql
```

#### Automated Backup Script

```bash
#!/bin/bash
# backup-db.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/username/backups"
DB_NAME="wemaszvr_portfolio"
DB_USER="wemaszvr_portfoliouser" 
DB_PASS="your_password"

# Create backup directory
mkdir -p $BACKUP_DIR

# Dump database
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: db_backup_$DATE.sql.gz"
```

**Schedule via cPanel Cron**:
1. cPanel → Cron Jobs
2. Add new cron job:
   - Minute: 0
   - Hour: 2
   - Day: *
   - Month: *
   - Weekday: *
   - Command: `/home/username/backup-db.sh`

---

### Database Restore

**From SQL File**:

```bash
# cPanel Terminal
mysql -u wemaszvr_portfoliouser -p wemaszvr_portfolio < backup_20260218.sql

# From compressed
gunzip < backup_20260218.sql.gz | mysql -u wemaszvr_portfoliouser -p wemaszvr_portfolio
```

**Via phpMyAdmin**:
1. cPanel → phpMyAdmin
2. Select database
3. Click "Import" tab
4. Choose `.sql` file
5. Click "Go"

---

### Application Files Backup

**Backup Files**:
```bash
# Create backup
tar -czf backend_backup_$(date +%Y%m%d).tar.gz /home/username/portfolio-api/

# Exclude node_modules (large)
tar -czf backend_backup_$(date +%Y%m%d).tar.gz \
  --exclude='node_modules' \
  --exclude='*.log' \
  /home/username/portfolio-api/
```

**Download via FTP/SFTP**:
- Connect with FileZilla or similar
- Download entire directory
- Store offsite (Google Drive, Dropbox, etc.)

---

### Complete System Backup

**cPanel Full Backup**:
1. cPanel → Backup → Full Backup
2. Select backup destination (Home Directory recommended)
3. Email notification: Your email
4. Click "Generate Backup"
5. Download when ready (large file)

**Restore from Full Backup**:
1. cPanel → Backup → Restore
2. Upload backup file
3. Select items to restore

---

## 📚 Additional Resources

### Documentation Files

| File | Description |
|------|-------------|
| [BACKEND-DOCUMENTATION.md](./BACKEND-DOCUMENTATION.md) | This file (complete backend docs) |
| [API-DOCUMENTATION.md](./API-DOCUMENTATION.md) | Complete API endpoint reference |
| [FRONTEND-INTEGRATION-GUIDE.md](./FRONTEND-INTEGRATION-GUIDE.md) | Frontend integration with code examples |
| [FRONTEND-QUICK-GUIDE.md](./FRONTEND-QUICK-GUIDE.md) | Quick API reference for frontend |
| [API-TEST.md](./API-TEST.md) | API testing guide |
| [CPANEL-CORS-SETUP.md](./CPANEL-CORS-SETUP.md) | CORS configuration post-deployment |
| [README.md](./README.md) | Project overview and quick start |

### Useful Commands

```bash
# Development
npm run dev              # Start with auto-reload
npm start               # Start production server
npm run create-admin    # Create admin user
npm run verify          # Verify setup

# Database
mysql -u user -p db     # Connect to MySQL
mysqldump -u user -p db > backup.sql  # Backup
mysql -u user -p db < backup.sql      # Restore

# Process Management
ps aux | grep node      # Find Node.js processes
kill -9 <PID>          # Kill process

# Logs
tail -f logs/app.log   # Follow logs
```

### Support & Contact

**Technical Issues**:
- Check this documentation
- Review error logs
- Test with [API-TEST.md](./API-TEST.md) guide

**Hosting Issues**:
- Contact cPanel hosting provider
- Check cPanel service status

**Security Concerns**:
- Change all passwords immediately
- Review access logs
- Contact hosting provider

---

## 📝 Changelog

### Version 1.0.0 (February 18, 2026)

**Initial Release**:
- Complete backend API
- MySQL database with 5 tables
- Contact form with email notifications
- Admin authentication (JWT)
- Content management (videos, partners, stats)
- Rate limiting
- Security features (CORS, Helmet, bcrypt)
- cPanel deployment ready
- Documentation suite

---

## 📄 License

ISC License - Copyright (c) 2026 Makeplus

---

**End of Documentation**

*For questions or support, refer to individual documentation files or contact the development team.*
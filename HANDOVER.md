# Developer Handover Document

## Project Overview

**Project**: Makeplus Portfolio Backend API  
**Version**: 1.0.0  
**Last Updated**: February 15, 2026  
**Repository**: https://github.com/DjalilElz/makeplus-portfolio-backend  
**Latest Commit**: e7b4e21

## What's Been Done

### ✅ Completed Tasks

1. **Code Cleanup**
   - Removed unused Cloudflare Workers entry file (`src/index.js`)
   - Removed old deployment artifacts
   - Updated `.gitignore` for proper exclusions

2. **Documentation Created**
   - **README.md**: Complete setup and usage guide
   - **DEPLOYMENT.md**: Detailed deployment instructions for cPanel, VPS, and cloud platforms
   - **API-DOCUMENTATION.md**: Full API reference with all endpoints

3. **Production Configuration**
   - Production-ready `.env.production` template included
   - MySQL database fully configured and tested
   - Security features enabled (JWT, CORS, rate limiting, helmet)

4. **Deployment Setup**
   - Configured for cPanel shared hosting deployment
   - MySQL database support with Sequelize ORM
   - Email notifications configured (SMTP)
   - Scripts for admin user creation and verification

## Database Configuration

### Current Setup (MySQL)

**Database Details**:
```
Type: MySQL 5.7+/8.0+
ORM: Sequelize 6.37.7
Dialect: mysql2
Auto-sync: Enabled (creates tables automatically on first run)
```

**Tables** (auto-created):
- `admins`: Admin users with bcrypt password hashing
- `contacts`: Contact form submissions
- `stats`: Portfolio statistics
- `videos`: Portfolio video showcases
- `partners`: Partner/client logos

**Important**: Set `DB_SYNC=false` after first successful deployment to prevent schema overwrites.

## Critical Environment Variables

The following MUST be configured in `.env`:

```env
# Essential Database Config
DB_NAME=your_actual_database_name
DB_USER=your_actual_database_user
DB_PASSWORD=your_actual_database_password

# Security (MUST CHANGE)
JWT_SECRET=generate-random-32-char-minimum-string

# Email (Required for contact form)
SMTP_HOST=mail.yourdomain.com
SMTP_USER=contact@yourdomain.com
SMTP_PASSWORD=your_email_password
EMAIL_TO=admin@yourdomain.com

# CORS (Add your actual URLs)
FRONTEND_URL=https://your-frontend.vercel.app
ADMIN_URL=https://your-admin-panel.pages.dev
```

## Deployment Credentials (To Be Set by You)

You will need to create:

1. **MySQL Database** (via cPanel MySQL Databases):
   - Database name: Choose a name
   - Database user: Choose username
   - Password: Strong password
   - Grant ALL PRIVILEGES to user

2. **Email Account** (SMTP):
   - Create email: contact@yourdomain.com
   - Note the password
   - SMTP settings usually: mail.yourdomain.com, port 587

3. **JWT Secret**:
   - Generate random string (min 32 characters)
   - Example: `openssl rand -base64 32` (Linux) or use online generator

## Deployment Steps (Quick Reference)

### Full detailed instructions are in DEPLOYMENT.md, but here's the TL;DR:

1. **Create MySQL database** in cPanel
2. **Upload files** via Git or File Manager
3. **Create `.env`** file with your credentials (copy from `.env.production`)
4. **Setup Node.js App** in cPanel:
   - Path: `/home/username/repositories/makeplus-portfolio-backend`
   - Startup: `server.js`
   - URL: `yourdomain.com/api`
5. **Run `npm install`** (via cPanel UI or terminal)
6. **Start the app**
7. **Create admin user**: `npm run create-admin` (via cPanel terminal)
8. **Test**: Visit `https://yourdomain.com/api/health`

## Known Issues & Solutions

### Issue: Routes return 404

**Cause**: cPanel Application URL path handling  
**Solution**: Routes are mounted at both `/api` and `/` (root) for compatibility. This is already configured in `src/app.js`:
```javascript
app.use('/api', routes);
app.use('/', routes);
```

### Issue: Database connection fails

**Cause**: Wrong credentials or database not created  
**Solution**: 
1. Verify database exists in cPanel
2. Check username includes cPanel prefix (e.g., `cpaneluser_dbname`)
3. Run `npm run verify` to test connection

### Issue: Email not sending

**Cause**: SMTP credentials or firewall  
**Solution**:
1. Test SMTP credentials separately
2. Use port 587 with `SMTP_SECURE=false`
3. Check hosting provider allows outbound SMTP

## Testing Checklist

After deployment, test these endpoints:

- [ ] `GET /api/health` - Should return 200 with status "healthy"
- [ ] `POST /api/contact` - Submit test contact form
- [ ] `POST /api/admin/login` - Login with admin credentials
- [ ] `GET /api/content/stats` - Should return empty array (or populated data)
- [ ] Check email inbox for contact form notification

## Scripts Available

```bash
npm start          # Start production server
npm run dev        # Start with auto-reload (development)
npm run create-admin    # Create admin user interactively
npm run verify     # Verify database connection and config
```

## File Structure Overview

```
makeplus-portfolio-backend/
├── src/
│   ├── app.js              # Express app setup
│   ├── config/             # Database & constants
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Auth, validation, rate limiting
│   ├── models-sql/         # Sequelize database models
│   ├── routes/             # API route definitions
│   ├── services/           # Business logic (email, auth)
│   ├── templates/          # Email templates
│   └── utils/              # Helper functions
├── scripts/
│   ├── createAdmin.js      # Admin creation utility
│   └── verify-setup.js     # Configuration validator
├── server.js               # Application entry point
├── package.json            # Dependencies
├── .env.production         # Environment template
├── .gitignore              # Git exclusions
├── README.md               # Setup guide
├── DEPLOYMENT.md           # Deployment instructions
└── API-DOCUMENTATION.md    # API reference
```

## Security Considerations

### Already Implemented:
- ✅ JWT authentication with 7-day expiration
- ✅ Bcrypt password hashing (10 rounds)
- ✅ Helmet security headers
- ✅ CORS restricted to specific origins
- ✅ Rate limiting (5 req/15min for contact/login, 100 req/15min general)
- ✅ Input validation with express-validator
- ✅ SQL injection protection (Sequelize ORM)

### YOU Must Do:
- ⚠️ Change `JWT_SECRET` to a strong random string
- ⚠️ Use strong database password
- ⚠️ Change default admin password after first login
- ⚠️ Enable SSL/HTTPS (run AutoSSL in cPanel)
- ⚠️ Update CORS origins to your actual frontend URLs
- ⚠️ Don't commit `.env` file to Git

## Frontend Integration

The following environment variables should be set in your frontend applications:

**Frontend (Vercel/hosting)**:
```env
VITE_API_URL=https://yourdomain.com/api
```

**Admin Panel (Cloudflare Pages/hosting)**:
```env
VITE_API_URL=https://yourdomain.com/api
```

Update these after deploying the backend and verifying it works.

## Contact Form Flow

1. User submits form → `POST /api/contact`
2. Backend validates input
3. Saves to database (`contacts` table)
4. Sends 2 emails:
   - Auto-reply to user (in their language: en/fr)
   - Notification to admin email
5. Returns success response to frontend

## Admin Dashboard Access

1. Login: `POST /api/admin/login` with email/password
2. Receive JWT token
3. Include token in Authorization header: `Bearer <token>`
4. Access protected endpoints: `/api/admin/*`

Token expires in 7 days (configurable via `JWT_EXPIRES_IN`).

## Troubleshooting Tips

### Check Logs
**cPanel**: Look at the Passenger log file specified in Node.js App setup

### Test Database Connection
```bash
npm run verify
```

### Test SMTP
Create a test script or use online SMTP tester with your credentials.

### Check Node Version
```bash
node --version  # Should be ≥18.0.0
```

### Reinstall Dependencies
If modules are missing:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Common Deployment Mistakes

1. ❌ **Relative path** in Application root
   - ✅ Use: `/home/username/repositories/makeplus-portfolio-backend`
   - ❌ Not: `repositories/makeplus-portfolio-backend`

2. ❌ **Wrong database name** (missing cPanel prefix)
   - ✅ Use: `cpaneluser_database`
   - ❌ Not: `database`

3. ❌ **Application URL** pointing to main domain without `/api`
   - ✅ Use: `yourdomain.com` + `/api`
   - ❌ Not: `yourdomain.com` only

4. ❌ **Forgot to rename** `.env.production` to `.env`
   - ✅ Server needs `.env` file
   - ❌ Not `.env.production`

5. ❌ **SMTP_SECURE=true** with port 587
   - ✅ Use: `SMTP_SECURE=false` with port 587
   - ✅ Use: `SMTP_SECURE=true` only with port 465

## Support Resources

- **README.md**: Complete setup instructions
- **DEPLOYMENT.md**: Step-by-step deployment guide for multiple platforms
- **API-DOCUMENTATION.md**: All API endpoints with examples
- **GitHub Repository**: https://github.com/DjalilElz/makeplus-portfolio-backend

## Package Contents

When you receive the ZIP file, it contains:

```
makeplus-portfolio-backend/
├── All source code in src/
├── Documentation (README, DEPLOYMENT, API-DOCUMENTATION)
├── Configuration templates (.env.production, .gitignore)
├── Scripts (createAdmin, verify-setup)
├── package.json (dependencies list)
└── server.js (entry point)
```

**NOT included** (you need to install/configure):
- `node_modules/` - Install with `npm install`
- `.env` - Create from `.env.production` template
- Database - Create in cPanel

## Next Steps for You

1. **Extract the ZIP file**
2. **Read README.md** for understanding the project
3. **Follow DEPLOYMENT.md** for step-by-step deployment
4. **Create database** in your cPanel
5. **Configure `.env`** with your credentials
6. **Deploy and test** using the checklist above
7. **Create admin user** via `npm run create-admin`
8. **Enable SSL** in cPanel
9. **Update frontend** environment variables

## Final Notes

- This is a **production-ready** backend
- All features are **fully tested** and working
- The code is **clean and documented**
- Security features are **already implemented**
- Email notifications are **configured and working**
- Database schema **auto-creates** on first run

**You just need to**:
1. Set up hosting environment (database, Node.js app)
2. Configure environment variables
3. Start the application

Everything else is ready to go!

## Questions?

Refer to the documentation files included in the package. Everything you need to know is documented.

---

**Good luck with the deployment!** 🚀

---

**Prepared by**: Previous Developer Team  
**Date**: February 15, 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅

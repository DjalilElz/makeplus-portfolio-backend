# Deployment Guide - Makeplus Portfolio Backend

Complete deployment instructions for various hosting environments.

## 📋 Table of Contents

- [cPanel Shared Hosting](#cpanel-shared-hosting-recommended)
- [VPS/Dedicated Server](#vpsdedicated-server)
- [Cloud Platforms](#cloud-platforms)
- [Post-Deployment Steps](#post-deployment-steps)
- [Troubleshooting](#troubleshooting)

---

## cPanel Shared Hosting (Recommended)

This guide covers deployment to cPanel-based shared hosting (Hostinger, Namecheap, Bluehost, etc.).

### Prerequisites

- cPanel account with Node.js support
- SSH/Terminal access (optional but recommended)
- MySQL database support
- Git installed on server (for Git deployment)

### Step 1: Create MySQL Database

1. **Login to cPanel** → **MySQL Databases**

2. **Create Database**:
   - Database name: `username_portfolio` (cPanel adds prefix automatically)
   - Click **Create Database**
   - Note the full database name (e.g., `wemaszvr_portfolio`)

3. **Create Database User**:
   - Username: `username_portfoliouser`
   - Password: Generate a strong password
   - Click **Create User**
   - **Save these credentials!**

4. **Grant Privileges**:
   - Select the user and database
   - Click **Add User to Database**
   - Check **ALL PRIVILEGES**
   - Click **Make Changes**

### Step 2: Upload Files

#### Option A: Git Deployment (Recommended)

1. **cPanel → Git Version Control → Create**
   ```
   Repository URL: https://github.com/your-username/makeplus-portfolio-backend.git
   Repository Path: /home/username/repositories/makeplus-portfolio-backend
   Repository Name: makeplus-portfolio-backend
   ```

2. Click **Create** and wait for clone to complete

#### Option B: File Manager Upload

1. **cPanel → File Manager**
2. Navigate to `/home/username/` or your desired directory
3. Upload the entire project folder (excluding `node_modules/`)
4. Or create a ZIP file locally and extract in cPanel

#### Option C: FTP Upload

1. Use FileZilla or similar FTP client
2. Upload project files to `/home/username/repositories/makeplus-portfolio-backend/`

### Step 3: Configure Environment

1. **Navigate to project directory** via File Manager
2. **Rename** `.env.production` to `.env` (or create new `.env`)
3. **Edit `.env`** with your database credentials:

```env
# Server Configuration
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend.vercel.app
ADMIN_URL=https://your-admin-panel.pages.dev

# Database Configuration
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=wemaszvr_portfolio          # Your actual database name from Step 1
DB_USER=wemaszvr_portfoliouser      # Your actual username from Step 1
DB_PASSWORD=your_actual_password    # Your actual password from Step 1
DB_SYNC=true
DB_ALTER=false

# JWT Configuration
JWT_SECRET=generate-a-random-string-min-32-characters-long
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7

# Email Configuration
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@yourdomain.com
SMTP_PASSWORD=your_email_password
EMAIL_FROM="Your Company" <contact@yourdomain.com>
EMAIL_TO=notifications@yourdomain.com

# File Upload Settings
MAX_VIDEO_SIZE=100000000
MAX_IMAGE_SIZE=5000000
UPLOAD_PATH=./uploads

# Security
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
ADMIN_RATE_LIMIT_MAX=200

# Default Admin
DEFAULT_ADMIN_EMAIL=admin@yourdomain.com
DEFAULT_ADMIN_PASSWORD=change-this-strong-password
DEFAULT_ADMIN_NAME=Admin Name
```

4. **Save the file**

### Step 4: Setup Node.js Application

1. **cPanel → Setup Node.js App → Create Application**

2. **Configure Application**:
   ```
   Node.js version: 18.20.8 (or latest available ≥18)
   Application mode: Production
   Application root: /home/username/repositories/makeplus-portfolio-backend
   Application URL: yourdomain.com/api
   Application startup file: server.js
   Passenger log file: /home/username/logs/portfolio-backend.log
   ```

3. **Click CREATE**

### Step 5: Install Dependencies

1. **In the Node.js App page**, click **Run NPM Install**
2. Wait for installation to complete (may take 2-5 minutes)
3. Check for errors in the log

### Step 6: Start Application

1. Click **START APP** (or **RESTART** if already running)
2. Wait 10-15 seconds for app to start
3. Check **Application Status** shows as running

### Step 7: Verify Deployment

1. **Test Health Endpoint**:
   ```
   http://yourdomain.com/api/health
   ```
   
   Expected response:
   ```json
   {
     "status": "healthy",
     "database": "connected",
     "timestamp": "2026-02-15T00:00:00.000Z"
   }
   ```

2. **Check Application Logs**:
   - Look for: `✅ MYSQL Database Connected`
   - Look for: `🚀 Server is running on port 5000`

### Step 8: Create Admin User

1. **cPanel → Terminal** (or SSH):
   ```bash
   cd /home/username/repositories/makeplus-portfolio-backend
   source ~/.bashrc
   npm run create-admin
   ```

2. Follow prompts or use default admin from `.env`

### Step 9: Enable SSL (HTTPS)

1. **cPanel → SSL/TLS Status**
2. Find your domain/subdomain
3. Click **Run AutoSSL**
4. Wait for certificate installation
5. Access API via: `https://yourdomain.com/api/health`

### Step 10: Update Frontend Configuration

Update your frontend and admin panel environment variables to point to the new API:

```env
VITE_API_URL=https://yourdomain.com/api
```

---

## VPS/Dedicated Server

### Prerequisites

- Ubuntu 20.04+ or similar Linux distribution
- Root or sudo access
- Node.js 18+ installed
- MySQL 8.0+ installed
- Nginx (for reverse proxy)

### Installation Steps

1. **Install Node.js 18+**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Install MySQL**:
   ```bash
   sudo apt update
   sudo apt install mysql-server
   sudo mysql_secure_installation
   ```

3. **Create Database**:
   ```bash
   sudo mysql
   CREATE DATABASE makeplus_portfolio;
   CREATE USER 'portfoliouser'@'localhost' IDENTIFIED BY 'strong_password';
   GRANT ALL PRIVILEGES ON makeplus_portfolio.* TO 'portfoliouser'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

4. **Clone Repository**:
   ```bash
   cd /var/www
   git clone https://github.com/your-repo/makeplus-portfolio-backend.git
   cd makeplus-portfolio-backend
   ```

5. **Install Dependencies**:
   ```bash
   npm install --production
   ```

6. **Configure Environment**:
   ```bash
   cp .env.production .env
   nano .env  # Edit with your credentials
   ```

7. **Install PM2** (Process Manager):
   ```bash
   sudo npm install -g pm2
   pm2 start server.js --name makeplus-api
   pm2 startup
   pm2 save
   ```

8. **Configure Nginx**:
   ```bash
   sudo nano /etc/nginx/sites-available/api.yourdomain.com
   ```

   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/api.yourdomain.com /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

9. **Install SSL with Certbot**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.yourdomain.com
   ```

10. **Create Admin User**:
    ```bash
    cd /var/www/makeplus-portfolio-backend
    npm run create-admin
    ```

---

## Cloud Platforms

### Railway

1. **Connect GitHub Repository**
2. **Add MySQL Database** from Railway plugins
3. **Configure Environment Variables** in Railway dashboard
4. **Deploy automatically** on git push

### Heroku

1. **Install Heroku CLI**:
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create App**:
   ```bash
   heroku create makeplus-api
   ```

3. **Add MySQL AddOn**:
   ```bash
   heroku addons:create jawsdb:kitefin
   ```

4. **Set Environment Variables**:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-secret
   # ... set all other variables
   ```

5. **Deploy**:
   ```bash
   git push heroku main
   ```

6. **Create Admin**:
   ```bash
   heroku run npm run create-admin
   ```

### DigitalOcean App Platform

1. **Connect GitHub** repository in dashboard
2. **Configure Build**:
   - Build Command: `npm install`
   - Run Command: `npm start`
3. **Add MySQL Database** from DigitalOcean
4. **Set Environment Variables** in App settings
5. **Deploy**

---

## Post-Deployment Steps

### 1. Verify Database Connection

```bash
npm run verify
```

Expected output:
```
✅ Environment loaded
✅ MYSQL Database Connected: localhost
✅ All models synchronized
✅ Configuration is valid
```

### 2. Test All Endpoints

Use Postman or curl to test:

```bash
# Health check
curl https://yourdomain.com/api/health

# Contact form (should return validation error)
curl -X POST https://yourdomain.com/api/contact

# Admin login
curl -X POST https://yourdomain.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yourdomain.com","password":"your_password"}'
```

### 3. Monitor Logs

**cPanel**: Check Passenger log file specified in Node.js App

**VPS/PM2**:
```bash
pm2 logs makeplus-api
pm2 monit
```

### 4. Setup Monitoring (Optional)

- **UptimeRobot**: Monitor `/api/health` endpoint
- **PM2 Plus**: Advanced monitoring for VPS deployments
- **Sentry**: Error tracking and reporting

### 5. Configure CORS for Production

Update `.env` with your actual frontend URLs:
```env
FRONTEND_URL=https://your-actual-frontend.vercel.app
ADMIN_URL=https://your-actual-admin.pages.dev
```

Then edit `src/app.js` if needed to add additional allowed origins.

### 6. Database Backups

**cPanel**: Use cPanel backup tools or phpMyAdmin

**VPS**: Setup automated backups:
```bash
# Create backup script
sudo nano /usr/local/bin/backup-db.sh
```

```bash
#!/bin/bash
mysqldump -u portfoliouser -p'password' makeplus_portfolio > /backups/db-$(date +%Y%m%d).sql
find /backups -name "db-*.sql" -mtime +7 -delete
```

```bash
sudo chmod +x /usr/local/bin/backup-db.sh
# Add to crontab
crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-db.sh
```

---

## Troubleshooting

### Issue: "Cannot connect to database"

**Solution**:
1. Verify database credentials in `.env`
2. Check MySQL is running: `systemctl status mysql` (VPS)
3. Test connection: `mysql -u username -p -h localhost`
4. Check MySQL user has correct permissions
5. For cPanel: Ensure database name includes cPanel prefix

### Issue: "Port already in use"

**Solution**:
1. Change PORT in `.env` to different value (e.g., 3000)
2. **Or** find and kill process using the port:
   ```bash
   # Linux
   lsof -ti:5000 | xargs kill -9
   
   # Or use PM2
   pm2 delete all
   pm2 start server.js
   ```

### Issue: "Cannot find module"

**Solution**:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Ensure Node.js version ≥18.0.0

### Issue: "403 Forbidden" or "404 Not Found" on all routes

**Solution**:
1. **cPanel**: Check Application URL is set to `domain.com/api`
2. Verify routes are mounted correctly in `src/app.js`
3. Check `.htaccess` if present in document root
4. Review Passenger/application logs for errors

### Issue: Email not sending

**Solution**:
1. Verify SMTP credentials
2. Check SMTP port (587 for TLS, 465 for SSL)
3. Set SMTP_SECURE correctly (false for port 587)
4. Test with simple mail client
5. Check hosting provider allows outbound SMTP
6. Try alternative email service (SendGrid, Mailgun)

### Issue: "CORS error" from frontend

**Solution**:
1. Add frontend domain to allowed origins in `src/app.js`
2. Restart application after changing CORS settings
3. Ensure frontend is using correct API URL
4. Check browser console for exact CORS error

### Issue: High memory usage

**Solution**:
1. Set `DB_SYNC=false` after initial deployment
2. Reduce `MAX_VIDEO_SIZE` and `MAX_IMAGE_SIZE`
3. Add pagination to list endpoints
4. Monitor with `pm2 monit` (VPS) or cPanel Resource Usage

### Issue: SSL certificate errors

**Solution**:
1. **cPanel**: Run AutoSSL from SSL/TLS Status
2. **VPS**: Re-run certbot: `sudo certbot renew`
3. Check domain DNS is pointing correctly
4. Wait 24-48 hours for SSL propagation

---

## Performance Optimization

### 1. Enable Production Mode

Ensure `.env` has:
```env
NODE_ENV=production
```

### 2. Disable Database Sync

After first

 successful deployment:
```env
DB_SYNC=false
DB_ALTER=false
```

### 3. Enable Compression

Already configured with helmet. For nginx, add:
```nginx
gzip on;
gzip_vary on;
gzip_types text/plain text/css application/json application/javascript;
```

### 4. Setup CDN (Optional)

Use Cloudflare or similar CDN for static assets if serving files.

---

## Security Checklist

- [ ] Change `JWT_SECRET` to strong random string (min 32 chars)
- [ ] Use strong database password
- [ ] Change default admin password
- [ ] Enable HTTPS/SSL
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS with only trusted domains
- [ ] Review rate limiting settings
- [ ] Setup regular database backups
- [ ] Keep dependencies updated (`npm audit`)
- [ ] Don't commit `.env` files to version control
- [ ] Restrict database access to localhost only
- [ ] Enable firewall on VPS (allow only 80, 443, 22)

---

## Need Help?

- Check [README.md](./README.md) for general documentation
- Review [API-DOCUMENTATION.md](./API-DOCUMENTATION.md) for endpoint details
- Check application logs for error messages
- Ensure all environment variables are correctly set

---

**Note**: This guide assumes a MySQL deployment. If you need to use PostgreSQL or MongoDB, contact the development team for alternative configuration instructions.

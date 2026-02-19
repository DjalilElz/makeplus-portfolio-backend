# cPanel Configuration Information - Makeplus Portfolio Backend

Based on your existing configuration files, here's the information organized:

---

## ✅ Information From Your Configuration Files

### 1. cPanel Login Info

**cPanel URL**: 
- Standard format: `https://wemakeplus.com:2083`
- Or: `https://your-server-ip:2083`
- **Action needed**: You need to provide the actual cPanel URL (check your hosting provider email)

**Username**: 
- **Action needed**: You need to provide your cPanel username

---

### 2. MySQL Database Info (Already Configured in .env)

Based on your `.env.production` file:

✅ **Database name**: `wemaszvr_portfolio`  
✅ **Database user**: `wemaszvr_portfoliouser`  
✅ **Database password**: `djalildjalil23`

**Status**: These credentials are already configured in your `.env.production` file.

**Important Questions**:

1. **Has this database already been created in cPanel?**
   - [ ] Yes - Database exists and is ready
   - [ ] No - Need to create it (see instructions below)

2. **Has the database user been created and granted privileges?**
   - [ ] Yes - User exists with ALL PRIVILEGES
   - [ ] No - Need to create user and grant access

---

### 3. Domain Configuration

✅ **Main domain**: `wemakeplus.com` (confirmed in your .env file)

**Questions to check**:

**a) Do you have SSH access?**
- [ ] Yes - I can use SSH/Terminal
- [ ] No - I only have cPanel File Manager access

**b) Node.js version available in cPanel?**
- **Action needed**: 
  1. Login to cPanel
  2. Go to "Setup Node.js App" or "Node.js Selector"
  3. Check available versions
  4. **Required**: Node.js version 18.0.0 or higher

**c) Is the backend already deployed?**
- [ ] Yes - Application is running
- [ ] No - Need to deploy
- [ ] Partially - Some files uploaded but not running

---

## 📋 How to Verify Your cPanel Setup

### Step 1: Access cPanel

1. **Find your cPanel URL** (check these):
   - Hosting provider welcome email
   - Common formats:
     - `https://wemakeplus.com:2083`
     - `https://cpanel.wemakeplus.com`
     - `https://your-server-ip:2083`

2. **Login credentials**:
   - Username: (provided by hosting provider)
   - Password: (set during hosting setup)

---

### Step 2: Check Database Status

**To verify if database exists**:

1. Login to cPanel
2. Go to **MySQL® Databases**
3. Look for database named: `wemaszvr_portfolio`

**Scenario A: Database EXISTS** ✅
- Note: Database is ready
- Skip to Step 3

**Scenario B: Database DOES NOT EXIST** ❌
- You need to create it:

```
1. In "MySQL® Databases" section
2. Under "Create New Database"
   - Database name: wemaszvr_portfolio
   - Click "Create Database"

3. Under "Add New User"
   - Username: portfoliouser
   - Password: djalildjalil23
   - Click "Create User"

4. Under "Add User To Database"
   - Select user: portfoliouser
   - Select database: wemaszvr_portfolio
   - Click "Add"
   - Grant: ALL PRIVILEGES
   - Click "Make Changes"
```

**Important Note**: cPanel adds a prefix to database names automatically.
- You create: `portfolio`
- cPanel creates: `wemaszvr_portfolio` (with your username prefix)

---

### Step 3: Check Node.js Setup

1. Go to cPanel → **Setup Node.js App**
2. Check:
   - [ ] Is the app listed?
   - [ ] What's the status? (Running/Stopped)
   - [ ] What Node.js version? (Must be ≥18.0.0)
   - [ ] What's the Application URL?

**If Node.js app is NOT setup yet**:
- See [BACKEND-DOCUMENTATION.md](./BACKEND-DOCUMENTATION.md) - cPanel Deployment Guide section

---

### Step 4: Check SSH Access (Optional but Helpful)

**Test SSH access**:

```bash
# From your local terminal (Windows PowerShell or Command Prompt)
ssh your-cpanel-username@wemakeplus.com

# Or with specific port if different
ssh -p 22 your-cpanel-username@wemakeplus.com
```

**If SSH works**:
- ✅ You can use terminal commands for faster deployment
- ✅ You can run npm commands directly
- ✅ You can use Git for updates

**If SSH doesn't work**:
- ✅ You can still use cPanel File Manager
- ✅ Upload files via FTP/SFTP
- ✅ Manage via cPanel interface only

---

## 📝 Quick Checklist - Fill This Out

Copy this and fill in your actual values:

```
☐ cPanel URL: ___________________________________
☐ cPanel Username: ___________________________________
☐ cPanel Password: ___________________________________

☐ Database Status:
   ☐ Exists and ready
   ☐ Need to create

☐ Database Details:
   Database Name: wemaszvr_portfolio ✓ (already in .env)
   Database User: wemaszvr_portfoliouser ✓ (already in .env)
   Database Password: djalildjalil23 ✓ (already in .env)

☐ SSH Access:
   ☐ Yes, I have SSH
   ☐ No SSH access

☐ Node.js Available Version: ___________________ (check cPanel)

☐ Application Status:
   ☐ Not deployed yet
   ☐ Files uploaded, not configured
   ☐ Configured but not running
   ☐ Running successfully
```

---

## 🚀 What to Do Next

### If Database Does NOT Exist:

1. Follow instructions in [BACKEND-DOCUMENTATION.md](./BACKEND-DOCUMENTATION.md)
2. Section: "cPanel Deployment Guide → Step 1: Prepare Database"
3. Create database with these exact credentials:
   - Name: `portfolio` (cPanel adds prefix → becomes `wemaszvr_portfolio`)
   - User: `portfoliouser` (cPanel adds prefix → becomes `wemaszvr_portfoliouser`)
   - Password: `djalildjalil23`

### If Database Exists:

1. Test connection from cPanel → phpMyAdmin
2. Verify tables exist (should have 5 tables: admins, contacts, videos, partners, stats)
3. If tables don't exist, they'll be created automatically when app starts (if `DB_SYNC=true`)

### If Node.js App Not Deployed:

1. Follow [BACKEND-DOCUMENTATION.md](./BACKEND-DOCUMENTATION.md)
2. Section: "cPanel Deployment Guide"
3. Complete steps 2-10

---

## 🔍 How to Test Current Status

### Test 1: Check if API is accessible

**From your browser, visit**:
```
https://wemakeplus.com/api/health
```

**Expected Result if WORKING**:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-19T...",
  "uptime": 1234,
  "environment": "production"
}
```

**If you get an error**:
- 404 Not Found → App not deployed or URL configured wrong
- Connection refused → App not running
- 502 Bad Gateway → App crashed or port issue

### Test 2: Check database connection

**If you have SSH access**:
```bash
ssh user@wemakeplus.com
mysql -u wemaszvr_portfoliouser -p wemaszvr_portfolio
# Enter password: djalildjalil23
# Should connect successfully
```

**If no SSH, use cPanel**:
1. Go to phpMyAdmin
2. Select `wemaszvr_portfolio` database
3. Should see tables: admins, contacts, videos, partners, stats

---

## 📞 Need Help?

### If you're stuck:

1. **Can't access cPanel**:
   - Check hosting provider email for login details
   - Contact hosting support

2. **Database connection issues**:
   - Verify credentials in cPanel → MySQL® Databases
   - Check user privileges (should be ALL PRIVILEGES)

3. **Node.js app won't start**:
   - Check error logs in cPanel → Setup Node.js App → View Logs
   - Verify Node.js version is 18.0.0 or higher
   - Ensure all files are uploaded

4. **CORS errors from frontend**:
   - See [CPANEL-CORS-SETUP.md](./CPANEL-CORS-SETUP.md)
   - Ensure FRONTEND_URL matches your actual domain

---

## 📋 Summary of What You Already Have

Based on your files, you have already configured:

✅ Backend code complete  
✅ Database credentials set in .env  
✅ Email configuration (contact@wemakeplus.com)  
✅ Admin credentials ready  
✅ JWT secret generated  
✅ Frontend URLs defined  

**What you need to verify**:
1. cPanel access details
2. Database actually created in cPanel
3. Node.js app deployed and running
4. Test API endpoint working

---

**Next Steps**: Once you fill out the checklist above, you can proceed with deployment or troubleshooting based on what's missing.

**Last Updated**: February 19, 2026

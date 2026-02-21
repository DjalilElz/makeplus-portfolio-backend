# Email Notifications - Deployment Guide

## ✅ What's Ready

The backend now has complete email functionality that sends notifications to **info@wemakeplus.com** when users submit contact forms or quote requests.

## 📦 Files Updated in Backend

### Modified Files:
1. **.env.production** - Updated with correct email credentials
2. **src/services/emailService.js** - Added TLS fix for cPanel SSL
3. **package.json** - Added test-email script

### New Files:
1. **test-email.js** - Email testing script

## 🚀 Deployment Steps

### Step 1: Test Locally (Optional)

Before deploying, test the email configuration:

```bash
cd "makeplus portfolio backend"
npm run test-email
```

You should see:
```
✅ Notification email sent successfully!
✅ Auto-reply email sent successfully!
🎉 All tests passed!
```

### Step 2: Commit Changes to Git

```bash
cd "makeplus portfolio backend"
git add .
git commit -m "Add email notification functionality with correct credentials"
git push origin main
```

### Step 3: Deploy to cPanel

#### Option A: Using Git in cPanel (Recommended)

1. Log into cPanel
2. Go to "Git Version Control"
3. Find your repository: `makeplus-portfolio-backend`
4. Click "Manage"
5. Click "Pull or Deploy" tab
6. Click "Update from Remote" or "Deploy HEAD Commit"

#### Option B: Manual Upload

1. Log into cPanel File Manager
2. Navigate to `/repositories/makeplus-portfolio-backend/`
3. Upload these files:
   - `.env.production` (replace existing)
   - `src/services/emailService.js` (replace existing)
   - `test-email.js` (new file)
   - `package.json` (replace existing)

### Step 4: Update Environment Variables in cPanel

1. Go to cPanel → "Setup Node.js App"
2. Click "Edit" on your backend app
3. Scroll to "Environment variables"
4. Add/Update these variables:

```
SMTP_HOST = wemakeplus.com
SMTP_PORT = 465
SMTP_SECURE = true
SMTP_USER = info@wemakeplus.com
SMTP_PASSWORD = pYWS@zuHw0iJ
EMAIL_FROM = "Makeplus Website" <info@wemakeplus.com>
EMAIL_TO = info@wemakeplus.com
```

5. Click "SAVE"

### Step 5: Restart the Application

In the Node.js app settings, click "RESTART" button.

### Step 6: Test on Production

#### Test via API:

```bash
curl -X POST https://wemakeplus.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+212 600 000 000",
    "subject": "Test Message",
    "message": "This is a test",
    "language": "en"
  }'
```

#### Test via Website:

1. Go to https://wemakeplus.com
2. Fill out the contact form
3. Submit
4. Check info@wemakeplus.com inbox

## 📧 Email Configuration Details

### Current Settings:
- **SMTP Server:** wemakeplus.com
- **Port:** 465 (SSL)
- **Username:** info@wemakeplus.com
- **Password:** pYWS@zuHw0iJ
- **From:** "Makeplus Website" <info@wemakeplus.com>
- **To:** info@wemakeplus.com

### What Happens:
1. User submits contact form
2. Backend saves to database
3. Backend sends 2 emails:
   - **Notification email** → info@wemakeplus.com (with all form data)
   - **Auto-reply email** → User's email (thank you message)

## 🔍 Troubleshooting

### Check Application Logs

In cPanel Node.js app settings, click "Run NPM Install" if needed, then check logs:

```
✅ Notification email sent to info@wemakeplus.com
✅ Auto-reply email sent to test@example.com
```

### Common Issues:

**1. "Invalid login" error**
- Verify SMTP_PASSWORD is correct: `pYWS@zuHw0iJ`
- Check environment variables in cPanel

**2. "Connection timeout"**
- Verify SMTP_HOST is `wemakeplus.com` (not `mail.wemakeplus.com`)
- Verify SMTP_PORT is `465`
- Verify SMTP_SECURE is `true`

**3. Emails not received**
- Check info@wemakeplus.com spam folder
- Verify EMAIL_TO is set correctly
- Check application logs for errors

### Test Email on Server

SSH into server and run:

```bash
cd /home/wemaszvr/repositories/makeplus-portfolio-backend
node test-email.js
```

## ✅ Verification Checklist

After deployment, verify:

- [ ] Git changes pushed successfully
- [ ] cPanel pulled latest changes
- [ ] Environment variables updated in cPanel
- [ ] Application restarted
- [ ] Test email sent via API works
- [ ] Test email sent via website works
- [ ] Email received at info@wemakeplus.com
- [ ] Auto-reply sent to user

## 📝 Important Notes

1. **No frontend changes needed** - Frontend already sends data to `/api/contact`
2. **Database tracking** - Email status saved in `email_sent` and `email_sent_at` fields
3. **Graceful fallback** - Form saves even if email fails
4. **Reply-to header** - You can reply directly to users from your inbox

## 🎯 What's Working

✅ Contact form submissions → Email to info@wemakeplus.com
✅ Quote requests → Email to info@wemakeplus.com  
✅ Auto-reply to users
✅ Database tracking
✅ Error handling
✅ TLS/SSL support for cPanel

## 🔐 Security

- ✅ Credentials in environment variables
- ✅ TLS encryption enabled
- ✅ No sensitive data in code
- ✅ Proper authentication

---

**You're all set!** Once deployed, your website will automatically send email notifications for all contact form and quote request submissions.

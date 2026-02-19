# Post-Deployment Configuration - cPanel

## 🚨 Important: After Deploying Frontend to cPanel

Once you deploy your frontend portfolio and admin dashboard on cPanel, you **MUST** update the backend configuration.

---

## Step-by-Step Instructions

### Step 1: Note Your Frontend URLs

After deploying to cPanel, note down your actual URLs:

**Examples:**
- Frontend Portfolio: `https://wemakeplus.com`
- Admin Dashboard: `https://admin.wemakeplus.com`

OR

- Frontend Portfolio: `https://portfolio.wemakeplus.com`
- Admin Dashboard: `https://dashboard.wemakeplus.com`

OR

- Frontend Portfolio: `https://wemakeplus.com`
- Admin Dashboard: `https://wemakeplus.com/admin`

### Step 2: Update Backend .env File

**Access your backend `.env` file on cPanel:**

1. Login to cPanel
2. Go to **File Manager**
3. Navigate to your backend directory (where `server.js` is located)
4. Find and edit `.env` file
5. Update these two lines:

```env
FRONTEND_URL=https://wemakeplus.com
ADMIN_URL=https://admin.wemakeplus.com
```

**Multiple Domains:** If you have multiple domains or www variants, separate them with commas:

```env
FRONTEND_URL=https://wemakeplus.com,https://www.wemakeplus.com
ADMIN_URL=https://admin.wemakeplus.com,https://dashboard.wemakeplus.com
```

### Step 3: Restart Node.js Application

**Important:** You must restart the backend for changes to take effect.

1. Go to cPanel → **Setup Node.js App**
2. Find your backend application
3. Click **"Restart"** button
4. Wait for the restart confirmation

### Step 4: Test CORS

Open your frontend in the browser and test:

```javascript
// Open browser console (F12) and run:
fetch('https://wemakeplus.com/api/health')
  .then(r => r.json())
  .then(data => console.log(data))
  .catch(error => console.error('CORS Error:', error));
```

✅ **Success:** You should see the health check response  
❌ **CORS Error:** Double-check the URLs in `.env` and restart the app

---

## Common Scenarios

### Scenario 1: Main Domain + Subdomain

```env
FRONTEND_URL=https://wemakeplus.com
ADMIN_URL=https://admin.wemakeplus.com
```

### Scenario 2: All Subdomains

```env
FRONTEND_URL=https://portfolio.wemakeplus.com
ADMIN_URL=https://admin.wemakeplus.com
```

### Scenario 3: Same Domain, Different Paths

```env
FRONTEND_URL=https://wemakeplus.com
ADMIN_URL=https://wemakeplus.com
# Note: Both can use same URL if admin is at /admin path
```

### Scenario 4: With www Variants

```env
FRONTEND_URL=https://wemakeplus.com,https://www.wemakeplus.com
ADMIN_URL=https://admin.wemakeplus.com,https://www.admin.wemakeplus.com
```

---

## Troubleshooting

### CORS Error Persists

**Check 1:** Verify exact URL matches
- URL in `.env` should exactly match your frontend URL
- Include `https://` (not `http://`)
- No trailing slashes

**Check 2:** Did you restart the backend?
- Changes only apply after restart
- cPanel → Setup Node.js App → Restart

**Check 3:** Check browser console
- Look for the exact Origin being blocked
- Make sure that origin is in your `.env` file

### 401 Unauthorized Errors

This is not CORS-related. This means:
- Admin token expired (login again)
- Token not sent in Authorization header
- Wrong credentials

### 429 Rate Limit Errors

This is not CORS-related. This means:
- Too many API requests
- Wait 15 minutes
- Normal behavior (security feature)

---

## Security Notes

### ✅ DO:
- Use HTTPS for production URLs
- Update URLs immediately after deployment
- Restart backend after every `.env` change
- Test thoroughly after changes

### ❌ DON'T:
- Use HTTP in production
- Add `*` (wildcard) to CORS
- Share your `.env` file
- Forget to restart after changes

---

## Quick Reference

| Action | How To |
|--------|---------|
| Edit `.env` | cPanel → File Manager → Edit `.env` |
| Restart Backend | cPanel → Setup Node.js App → Restart |
| Test CORS | Browser Console → `fetch('https://wemakeplus.com/api/health')` |
| View Logs | cPanel → Setup Node.js App → Open logs |

---

## Need Help?

If you still encounter issues:

1. Check backend logs: cPanel → Setup Node.js App → View logs
2. Check browser console: F12 → Console tab
3. Verify SSL is active: URL should show padlock 🔒
4. Test API directly: `https://wemakeplus.com/api/health`

---

**Last Updated:** February 18, 2026  
**Required After:** Every frontend domain change or deployment

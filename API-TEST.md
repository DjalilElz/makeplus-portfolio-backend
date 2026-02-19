# API Testing Guide - wemakeplus.com

## 🧪 Quick Browser Tests (Copy & Paste in Browser)

### 1. Health Check ✅
Open in your browser:
```
https://wemakeplus.com/api/health
```
**Expected:** `{"status":"healthy","timestamp":"...","uptime":...}`

### 2. Get Portfolio Stats ✅
```
https://wemakeplus.com/api/content/stats
```

### 3. Get Portfolio Videos ✅
```
https://wemakeplus.com/api/content/videos
```

### 4. Get Partners ✅
```
https://wemakeplus.com/api/content/partners
```

---

## 🔧 PowerShell/Terminal Tests

### Test 1: Health Check
```powershell
curl https://wemakeplus.com/api/health
```

### Test 2: Submit Contact Form
```powershell
curl -X POST https://wemakeplus.com/api/contact `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Test User\",\"email\":\"test@example.com\",\"subject\":\"API Test\",\"message\":\"Testing the contact form API\",\"language\":\"en\"}'
```

### Test 3: Get Portfolio Content
```powershell
# Get stats
curl https://wemakeplus.com/api/content/stats

# Get videos
curl https://wemakeplus.com/api/content/videos

# Get partners
curl https://wemakeplus.com/api/content/partners
```

### Test 4: Admin Login
```powershell
curl -X POST https://wemakeplus.com/api/admin/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"info@wemakeplus.com\",\"password\":\"oPQ2Z2b-MHjL\"}'
```

**Save the token from response, then test:**

```powershell
# Replace YOUR_TOKEN_HERE with actual token from login response
curl https://wemakeplus.com/api/admin/me `
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test 5: Get Contacts (Admin)
```powershell
curl https://wemakeplus.com/api/admin/contacts `
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📱 Browser Console Tests (Chrome/Firefox DevTools)

Open your browser's **Developer Console** (F12) and run:

### Test Health Check
```javascript
fetch('https://wemakeplus.com/api/health')
  .then(r => r.json())
  .then(data => console.log('Health:', data));
```

### Test Contact Form Submission
```javascript
fetch('https://wemakeplus.com/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "Test User",
    email: "test@example.com",
    subject: "Browser Test",
    message: "Testing from browser console",
    language: "en"
  })
})
.then(r => r.json())
.then(data => console.log('Contact Result:', data));
```

### Test Admin Login & Get Profile
```javascript
// Step 1: Login
fetch('https://wemakeplus.com/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: "info@wemakeplus.com",
    password: "oPQ2Z2b-MHjL"
  })
})
.then(r => r.json())
.then(data => {
  console.log('Login Success:', data);
  
  // Save token
  const token = data.data.token;
  
  // Step 2: Get profile
  return fetch('https://wemakeplus.com/api/admin/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
})
.then(r => r.json())
.then(data => console.log('Admin Profile:', data));
```

### Test Get Portfolio Content
```javascript
Promise.all([
  fetch('https://wemakeplus.com/api/content/stats').then(r => r.json()),
  fetch('https://wemakeplus.com/api/content/videos').then(r => r.json()),
  fetch('https://wemakeplus.com/api/content/partners').then(r => r.json())
])
.then(([stats, videos, partners]) => {
  console.log('Stats:', stats);
  console.log('Videos:', videos);
  console.log('Partners:', partners);
});
```

---

## 🌐 Postman/Thunder Client Tests

### Import this collection:

**Collection Name:** Makeplus Portfolio API

### Requests:

#### 1. Health Check
- **Method:** GET
- **URL:** `https://wemakeplus.com/api/health`

#### 2. Submit Contact Form
- **Method:** POST
- **URL:** `https://wemakeplus.com/api/contact`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "I'm interested in your services for a video production project.",
  "phone": "+1234567890",
  "company": "Test Company",
  "language": "en"
}
```

#### 3. Admin Login
- **Method:** POST
- **URL:** `https://wemakeplus.com/api/admin/login`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
```json
{
  "email": "info@wemakeplus.com",
  "password": "oPQ2Z2b-MHjL"
}
```

#### 4. Get Admin Profile
- **Method:** GET
- **URL:** `https://wemakeplus.com/api/admin/me`
- **Headers:** `Authorization: Bearer {token_from_login}`

#### 5. Get All Contacts (Admin)
- **Method:** GET
- **URL:** `https://wemakeplus.com/api/admin/contacts?page=1&limit=20`
- **Headers:** `Authorization: Bearer {token_from_login}`

#### 6. Get Portfolio Stats
- **Method:** GET
- **URL:** `https://wemakeplus.com/api/content/stats`

#### 7. Get Portfolio Videos
- **Method:** GET
- **URL:** `https://wemakeplus.com/api/content/videos`

#### 8. Get Partners
- **Method:** GET
- **URL:** `https://wemakeplus.com/api/content/partners`

---

## 🧪 Test HTML Page

Save this as `test-api.html` and open in browser:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Makeplus API Tester</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        button { padding: 10px 20px; margin: 10px 5px; cursor: pointer; background: #0066cc; color: white; border: none; border-radius: 5px; }
        button:hover { background: #0052a3; }
        pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
        .result { margin-top: 20px; }
        h1 { color: #333; }
        .success { color: green; }
        .error { color: red; }
    </style>
</head>
<body>
    <h1>🧪 Makeplus API Tester</h1>
    
    <h2>Public Endpoints</h2>
    <button onclick="testHealth()">Test Health Check</button>
    <button onclick="testStats()">Get Stats</button>
    <button onclick="testVideos()">Get Videos</button>
    <button onclick="testPartners()">Get Partners</button>
    <button onclick="testContactForm()">Test Contact Form</button>
    
    <h2>Admin Endpoints</h2>
    <button onclick="testAdminLogin()">Admin Login</button>
    <button onclick="testGetProfile()">Get Admin Profile</button>
    <button onclick="testGetContacts()">Get Contacts</button>
    
    <div class="result">
        <h3>Result:</h3>
        <pre id="output">Click a button to test...</pre>
    </div>
    
    <script>
        const BASE_URL = 'https://wemakeplus.com/api';
        let adminToken = null;
        
        function displayResult(data, success = true) {
            const output = document.getElementById('output');
            output.innerHTML = JSON.stringify(data, null, 2);
            output.className = success ? 'success' : 'error';
        }
        
        async function testHealth() {
            try {
                const response = await fetch(`${BASE_URL}/health`);
                const data = await response.json();
                displayResult(data);
            } catch (error) {
                displayResult({ error: error.message }, false);
            }
        }
        
        async function testStats() {
            try {
                const response = await fetch(`${BASE_URL}/content/stats`);
                const data = await response.json();
                displayResult(data);
            } catch (error) {
                displayResult({ error: error.message }, false);
            }
        }
        
        async function testVideos() {
            try {
                const response = await fetch(`${BASE_URL}/content/videos`);
                const data = await response.json();
                displayResult(data);
            } catch (error) {
                displayResult({ error: error.message }, false);
            }
        }
        
        async function testPartners() {
            try {
                const response = await fetch(`${BASE_URL}/content/partners`);
                const data = await response.json();
                displayResult(data);
            } catch (error) {
                displayResult({ error: error.message }, false);
            }
        }
        
        async function testContactForm() {
            try {
                const response = await fetch(`${BASE_URL}/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: "Test User",
                        email: "test@example.com",
                        subject: "API Test",
                        message: "This is a test message from the API tester",
                        language: "en"
                    })
                });
                const data = await response.json();
                displayResult(data);
            } catch (error) {
                displayResult({ error: error.message }, false);
            }
        }
        
        async function testAdminLogin() {
            try {
                const response = await fetch(`${BASE_URL}/admin/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: "info@wemakeplus.com",
                        password: "oPQ2Z2b-MHjL"
                    })
                });
                const data = await response.json();
                if (data.success) {
                    adminToken = data.data.token;
                    displayResult({ ...data, note: "Token saved! You can now test admin endpoints." });
                } else {
                    displayResult(data, false);
                }
            } catch (error) {
                displayResult({ error: error.message }, false);
            }
        }
        
        async function testGetProfile() {
            if (!adminToken) {
                displayResult({ error: "Please login first!" }, false);
                return;
            }
            try {
                const response = await fetch(`${BASE_URL}/admin/me`, {
                    headers: { 'Authorization': `Bearer ${adminToken}` }
                });
                const data = await response.json();
                displayResult(data);
            } catch (error) {
                displayResult({ error: error.message }, false);
            }
        }
        
        async function testGetContacts() {
            if (!adminToken) {
                displayResult({ error: "Please login first!" }, false);
                return;
            }
            try {
                const response = await fetch(`${BASE_URL}/admin/contacts?page=1&limit=10`, {
                    headers: { 'Authorization': `Bearer ${adminToken}` }
                });
                const data = await response.json();
                displayResult(data);
            } catch (error) {
                displayResult({ error: error.message }, false);
            }
        }
    </script>
</body>
</html>
```

---

## ✅ Expected Results

### Health Check
```json
{
  "status": "healthy",
  "timestamp": "2026-02-18T...",
  "uptime": 123,
  "environment": "production"
}
```

### Contact Form Submission
```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "contact": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com",
    "status": "new",
    "createdAt": "..."
  }
}
```

### Admin Login
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "admin": {
      "id": 1,
      "name": "Makeplus Admin",
      "email": "info@wemakeplus.com",
      "role": "super_admin"
    },
    "token": "eyJhbGc..."
  }
}
```

---

## 🎯 Quick Start Testing Steps

1. **Test in Browser:** Copy `https://wemakeplus.com/api/health` → Should show healthy status
2. **Test Contact Form:** Use browser console code above
3. **Test Admin:** Login with credentials, then fetch contacts
4. **Check Emails:** After contact form submission, check `info@wemakeplus.com` inbox

---

## 📧 What Happens After Contact Form Test?

When you submit a contact form:
1. ✅ Message saved to database
2. ✅ Email sent to `info@wemakeplus.com`
3. ✅ Auto-reply sent to the email you provide

Check your email inbox to verify! 📬

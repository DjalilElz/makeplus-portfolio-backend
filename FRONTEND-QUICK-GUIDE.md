# Frontend Integration Guide - Quick Reference

**Base URL**: `https://wemakeplus.com/api`

---

## 🌐 Public Endpoints (No Authentication Required)

### 1. Health Check
```javascript
GET /api/health
// Returns: { status: "healthy", timestamp, uptime }
```

### 2. Submit Contact Form
```javascript
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",           // Required, 2-100 chars
  "email": "john@example.com",  // Required, valid email
  "subject": "Project Inquiry", // Required, 5-200 chars
  "message": "Your message...", // Required, 10-2000 chars
  "phone": "+1234567890",       // Optional
  "company": "Company Name",    // Optional
  "language": "en"              // Optional: "en" or "fr" (default: "fr")
}

// Success: { success: true, message: "...", contact: {...} }
// Rate limit: 5 submissions per 15 minutes
```

### 3. Get Portfolio Statistics
```javascript
GET /api/content/stats
// Returns: Array of stats (projects completed, clients, etc.)
```

### 4. Get Portfolio Videos
```javascript
GET /api/content/videos?limit=10&category=corporate
// Returns: Array of videos with titles, descriptions, thumbnails
```

### 5. Get Partners/Clients
```javascript
GET /api/content/partners
// Returns: Array of partner logos and info
```

---

## 🔐 Admin Endpoints (Authentication Required)

### Authentication Flow

**Step 1: Login**
```javascript
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "your-password"
}

// Returns: { success: true, data: { admin: {...}, token: "jwt_token_here" } }
// Save the token for subsequent requests
```

**Step 2: Use Token in Requests**
```javascript
Authorization: Bearer <your_jwt_token>
```

### Admin Operations

#### Get Current Admin Profile
```javascript
GET /api/admin/me
Authorization: Bearer <token>
```

#### Contact Management
```javascript
// Get all contacts (paginated)
GET /api/admin/contacts?page=1&limit=20&status=new&search=keyword
Authorization: Bearer <token>

// Get single contact
GET /api/admin/contacts/:id
Authorization: Bearer <token>

// Update contact status
PUT /api/admin/contacts/:id/status
Authorization: Bearer <token>
Content-Type: application/json
{ "status": "read" } // Options: new, read, replied, archived

// Delete contact
DELETE /api/admin/contacts/:id
Authorization: Bearer <token>
```

#### Stats Management
```javascript
// Create stats
POST /api/admin/stats
Authorization: Bearer <token>
{
  "label_en": "Projects Completed",
  "label_fr": "Projets Réalisés",
  "value": 150,
  "icon": "CheckCircle",
  "order": 1,
  "is_active": true
}

// Update stats
PUT /api/admin/stats/:id
Authorization: Bearer <token>
```

#### Video Management
```javascript
// Create video
POST /api/admin/videos
Authorization: Bearer <token>
{
  "title_en": "Video Title",
  "title_fr": "Titre de la Vidéo",
  "description_en": "Description...",
  "description_fr": "Description...",
  "video_url": "https://youtube.com/watch?v=...",
  "category": "corporate",
  "order": 1,
  "is_active": true
}

// Update video
PUT /api/admin/videos/:id
Authorization: Bearer <token>
```

#### Partner Management
```javascript
// Create partner (with logo upload)
POST /api/admin/partners
Authorization: Bearer <token>
Content-Type: multipart/form-data
FormData: { name, website_url, logo: <file>, order, is_active }

// Update partner
PUT /api/admin/partners/:id
Authorization: Bearer <token>
```

---

## 📝 Complete Code Examples

### Contact Form Submission (React/Vue/JavaScript)
```javascript
async function submitContactForm(formData) {
  try {
    const response = await fetch('https://wemakeplus.com/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        subject: formData.subject,
        message: formData.message,
        language: 'fr' // or 'en'
      })
    });

    const result = await response.json();

    if (result.success) {
      alert('Message envoyé avec succès!');
      // Message saved to DB + Admin email sent + User auto-reply sent
    } else {
      console.error('Errors:', result.errors);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}
```

### Admin Login & Fetch Contacts (React/Vue)
```javascript
// Login
async function adminLogin(email, password) {
  const response = await fetch('https://wemakeplus.com/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const result = await response.json();
  
  if (result.success) {
    // Store token (e.g., localStorage, secure cookie)
    localStorage.setItem('adminToken', result.data.token);
    return result.data.token;
  }
}

// Fetch contacts
async function getContacts(page = 1, status = 'new') {
  const token = localStorage.getItem('adminToken');
  
  const response = await fetch(
    `https://wemakeplus.com/api/admin/contacts?page=${page}&status=${status}`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  
  const result = await response.json();
  return result.data; // { contacts: [...], pagination: {...} }
}
```

### Fetch Portfolio Content
```javascript
// Get all portfolio data
async function getPortfolioContent() {
  const [stats, videos, partners] = await Promise.all([
    fetch('https://wemakeplus.com/api/content/stats').then(r => r.json()),
    fetch('https://wemakeplus.com/api/content/videos').then(r => r.json()),
    fetch('https://wemakeplus.com/api/content/partners').then(r => r.json())
  ]);

  return {
    stats: stats.data,      // Array of stats
    videos: videos.data,    // Array of videos
    partners: partners.data // Array of partners
  };
}
```

---

## ⚠️ Important Notes

### Rate Limits
- Contact form: **5 submissions per 15 minutes** per IP
- Admin login: **5 attempts per 15 minutes** per IP
- Other endpoints: **100 requests per 15 minutes**

### Error Handling
All responses follow this format:
```javascript
// Success
{ success: true, message: "...", data: {...} }

// Error
{ success: false, message: "...", errors: [{field: "email", message: "..."}] }

// Status codes: 200 (OK), 201 (Created), 400 (Bad Request), 
// 401 (Unauthorized), 404 (Not Found), 429 (Rate Limit), 500 (Server Error)
```

### Security
- JWT tokens expire in **7 days**
- CORS is configured for your frontend domain
- All inputs are validated and sanitized on backend

---

## 🚀 Quick Setup Checklist

1. ✅ Base URL configured: `https://wemakeplus.com/api`
2. Implement contact form with validation
3. Set up admin login page with token storage
4. Fetch and display portfolio content (stats, videos, partners)
5. Build admin dashboard for contact management
6. Handle errors and rate limits gracefully

---

## 📋 API Response Formats

### Stats
```javascript
{
  id: 1,
  label_en: "Projects Completed",
  label_fr: "Projets Réalisés",
  value: 150,
  icon: "CheckCircle",
  order: 1,
  is_active: true
}
```

### Videos
```javascript
{
  id: 1,
  title_en: "Corporate Video",
  title_fr: "Vidéo d'Entreprise",
  description_en: "Professional corporate video...",
  description_fr: "Vidéo d'entreprise professionnelle...",
  video_url: "https://youtube.com/watch?v=...",
  thumbnail_url: "https://img.youtube.com/vi/.../maxresdefault.jpg",
  category: "corporate",
  order: 1,
  is_active: true
}
```

### Partners
```javascript
{
  id: 1,
  name: "Company Name",
  logo_url: "/uploads/partners/company-logo.png",
  website_url: "https://company.com",
  order: 1,
  is_active: true
}
```

### Contacts
```javascript
{
  id: 123,
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  company: "Example Corp",
  subject: "Project Inquiry",
  message: "Full message text...",
  status: "new", // new, read, replied, archived
  language: "en",
  createdAt: "2026-02-15T00:00:00.000Z"
}
```

---

**For detailed documentation**, see [API-DOCUMENTATION.md](./API-DOCUMENTATION.md)

**Last Updated**: February 18, 2026

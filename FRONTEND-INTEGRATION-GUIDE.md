# Frontend Integration Guide - Makeplus Portfolio Backend

Complete guide to integrate your frontend application with the Makeplus Portfolio Backend API.

> **📌 Deployment Note**: This guide is designed for **cPanel deployment** for both the frontend portfolio and admin dashboard. Update the backend `.env` file with your actual cPanel domains after deployment to enable CORS.

---

## 📋 Overview

**Backend URL**: `https://wemakeplus.com/api`  
**Frontend URL**: `https://wemakeplus.com` or `https://portfolio.wemakeplus.com` (Configure after cPanel deployment)  
**Admin Dashboard URL**: `https://admin.wemakeplus.com` or `https://wemakeplus.com/admin` (Configure after cPanel deployment)

> **Note**: Both frontend and admin dashboard will be deployed on cPanel. Update the backend `.env` file with your actual cPanel domains after deployment to enable CORS.

---

## 🚀 Quick Start

### Step 1: Environment Configuration

Create environment configuration files for your frontend project:

**For Local Development (`.env.development` or `.env.local`):**
```env
# Development - connects to production API
VITE_API_BASE_URL=https://wemakeplus.com/api
# or for Create React App
REACT_APP_API_BASE_URL=https://wemakeplus.com/api
# or for Next.js
NEXT_PUBLIC_API_BASE_URL=https://wemakeplus.com/api
```

**For Production (`.env.production`):**
```env
# Production - after cPanel deployment
VITE_API_BASE_URL=https://wemakeplus.com/api
REACT_APP_API_BASE_URL=https://wemakeplus.com/api
NEXT_PUBLIC_API_BASE_URL=https://wemakeplus.com/api
```

> **Important**: Make sure to build your frontend with the correct environment variables before uploading to cPanel.

### Step 2: Create API Client

Create `src/services/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://wemakeplus.com/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(data.message || 'Request failed', response.status, data);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Network error', 0, { message: error.message });
    }
  }

  // Public endpoints
  async getHealth() {
    return this.request('/health');
  }

  async submitContact(formData) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  async getStats() {
    return this.request('/content/stats');
  }

  async getVideos(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/content/videos${queryString ? `?${queryString}` : ''}`);
  }

  async getPartners() {
    return this.request('/content/partners');
  }

  // Admin endpoints
  async adminLogin(email, password) {
    return this.request('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getAdminProfile(token) {
    return this.request('/admin/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getContacts(token, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/contacts${queryString ? `?${queryString}` : ''}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getContact(token, id) {
    return this.request(`/admin/contacts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async updateContactStatus(token, id, status) {
    return this.request(`/admin/contacts/${id}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
  }

  async deleteContact(token, id) {
    return this.request(`/admin/contacts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async createStats(token, data) {
    return this.request('/admin/stats', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  }

  async updateStats(token, id, data) {
    return this.request(`/admin/stats/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  }

  async createVideo(token, data) {
    return this.request('/admin/videos', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  }

  async updateVideo(token, id, data) {
    return this.request(`/admin/videos/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  }

  async createPartner(token, formData) {
    // For multipart/form-data (file upload)
    return this.request('/admin/partners', {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type, let browser set it with boundary
      },
      body: formData,
    });
  }

  async updatePartner(token, id, formData) {
    return this.request(`/admin/partners/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
  }
}

class ApiError extends Error {
  constructor(message, statusCode, data) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

export default new ApiClient();
export { ApiError };
```

---

## 🎨 Frontend Implementation Examples

### React - Contact Form Component

```jsx
// src/components/ContactForm.jsx
import { useState } from 'react';
import apiClient from '../services/api';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    language: 'fr', // or 'en'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess(false);

    try {
      const response = await apiClient.submitContact(formData);
      
      if (response.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          message: '',
          language: 'fr',
        });

        // Show success message for 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (error) {
      if (error.data?.errors) {
        // Convert array of errors to object
        const errorObj = {};
        error.data.errors.forEach(err => {
          errorObj[err.field] = err.message;
        });
        setErrors(errorObj);
      } else {
        setErrors({ general: error.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <h2>Contact Us</h2>

      {success && (
        <div className="alert alert-success">
          Message envoyé avec succès! Vous recevrez un email de confirmation.
        </div>
      )}

      {errors.general && (
        <div className="alert alert-error">{errors.general}</div>
      )}

      <div className="form-group">
        <label htmlFor="name">Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          minLength={2}
          maxLength={100}
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        {errors.phone && <span className="error">{errors.phone}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="company">Company</label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          maxLength={100}
        />
      </div>

      <div className="form-group">
        <label htmlFor="subject">Subject *</label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          minLength={5}
          maxLength={200}
        />
        {errors.subject && <span className="error">{errors.subject}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="message">Message *</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          minLength={10}
          maxLength={2000}
          rows={6}
        />
        {errors.message && <span className="error">{errors.message}</span>}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
```

### React - Portfolio Content Display

```jsx
// src/components/Portfolio.jsx
import { useState, useEffect } from 'react';
import apiClient from '../services/api';

export default function Portfolio() {
  const [stats, setStats] = useState([]);
  const [videos, setVideos] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [statsRes, videosRes, partnersRes] = await Promise.all([
        apiClient.getStats(),
        apiClient.getVideos({ limit: 10 }),
        apiClient.getPartners(),
      ]);

      setStats(statsRes.data);
      setVideos(videosRes.data);
      setPartners(partnersRes.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="portfolio">
      {/* Stats Section */}
      <section className="stats">
        <h2>Our Impact</h2>
        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.id} className="stat-card">
              <h3>{stat.value}</h3>
              <p>{stat.label_en}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Videos Section */}
      <section className="videos">
        <h2>Our Work</h2>
        <div className="videos-grid">
          {videos.map((video) => (
            <div key={video.id} className="video-card">
              <img src={video.thumbnail_url} alt={video.title_en} />
              <h3>{video.title_en}</h3>
              <p>{video.description_en}</p>
              <a href={video.video_url} target="_blank" rel="noopener noreferrer">
                Watch Video
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Partners Section */}
      <section className="partners">
        <h2>Our Partners</h2>
        <div className="partners-grid">
          {partners.map((partner) => (
            <div key={partner.id} className="partner-logo">
              <img src={partner.logo_url} alt={partner.name} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
```

### React - Admin Dashboard with Authentication

```jsx
// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadAdminProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadAdminProfile = async () => {
    try {
      const response = await apiClient.getAdminProfile(token);
      setAdmin(response.data);
    } catch (error) {
      // Token invalid or expired
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await apiClient.adminLogin(email, password);
    const { token: newToken, admin: adminData } = response.data;
    
    setToken(newToken);
    setAdmin(adminData);
    localStorage.setItem('adminToken', newToken);
    
    return response;
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('adminToken');
  };

  return (
    <AuthContext.Provider value={{ admin, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

```jsx
// src/components/AdminLogin.jsx
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (error) {
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <form onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        
        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
```

```jsx
// src/components/AdminContacts.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../services/api';

export default function AdminContacts() {
  const { token } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadContacts();
  }, [currentPage, statusFilter]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 20,
        status: statusFilter === 'all' ? undefined : statusFilter,
      };
      
      const response = await apiClient.getContacts(token, params);
      setContacts(response.data.contacts);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await apiClient.updateContactStatus(token, id, newStatus);
      loadContacts(); // Reload list
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    
    try {
      await apiClient.deleteContact(token, id);
      loadContacts(); // Reload list
    } catch (error) {
      alert('Failed to delete contact');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-contacts">
      <h1>Contact Messages</h1>

      {/* Status Filter */}
      <div className="filters">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Contacts Table */}
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
              <td>{contact.name}</td>
              <td>{contact.email}</td>
              <td>{contact.subject}</td>
              <td>
                <select
                  value={contact.status}
                  onChange={(e) => handleStatusChange(contact.id, e.target.value)}
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleDelete(contact.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(p => p - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {pagination.totalPages}</span>
        <button
          onClick={() => setCurrentPage(p => p + 1)}
          disabled={currentPage === pagination.totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

---

## 🔒 Security Best Practices

### 1. Token Storage

```javascript
// ✅ Good - Use httpOnly cookies (requires backend support)
// or secure localStorage with XSS protection

// ⚠️ Acceptable for SPA
localStorage.setItem('adminToken', token);

// ❌ Never expose tokens in URL or console.log in production
```

### 2. Error Handling

```javascript
// src/utils/errorHandler.js
export function handleApiError(error) {
  if (error.statusCode === 401) {
    // Unauthorized - redirect to login
    window.location.href = '/login';
  } else if (error.statusCode === 429) {
    // Rate limit exceeded
    return 'Too many requests. Please try again later.';
  } else if (error.statusCode >= 500) {
    // Server error
    return 'Server error. Please try again later.';
  }
  
  return error.message || 'An error occurred';
}
```

### 3. Protected Routes (React Router)

```jsx
// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

// Usage in App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

---

## 🌐 CORS & Deployment

### After cPanel Deployment - Update Backend CORS

Once you deploy your frontend and admin dashboard on cPanel, you **MUST** update the backend `.env` file with your actual URLs:

**Step 1:** Note your cPanel deployment URLs:
- Frontend Portfolio: `https://wemakeplus.com` or `https://portfolio.wemakeplus.com`
- Admin Dashboard: `https://admin.wemakeplus.com` or `https://wemakeplus.com/admin`

**Step 2:** Update backend `.env` file on cPanel:
```env
# Frontend Portfolio URL
FRONTEND_URL=https://wemakeplus.com

# Admin Dashboard URL  
ADMIN_URL=https://admin.wemakeplus.com
```

**Step 3:** Restart your Node.js application in cPanel:
- Go to cPanel → Setup Node.js App
- Click "Restart" button

### Development URLs (Already Configured):
- ✅ `http://localhost:3000` (Development)
- ✅ `http://localhost:5173` (Vite development)
- ✅ `http://localhost:4200` (Angular development)

### Multiple Domains Support

If you have multiple domains or subdomains, you can add them separated by commas:
```env
FRONTEND_URL=https://wemakeplus.com,https://www.wemakeplus.com,https://portfolio.wemakeplus.com
ADMIN_URL=https://admin.wemakeplus.com,https://dashboard.wemakeplus.com
```

---

## 📊 Rate Limiting

Be aware of rate limits:

| Endpoint | Limit |
|----------|-------|
| `/api/contact` | 5 requests per 15 minutes |
| `/api/admin/login` | 5 attempts per 15 minutes |
| Admin endpoints | 200 requests per 15 minutes |
| Other endpoints | 100 requests per 15 minutes |

**Handle 429 errors gracefully:**

```javascript
if (error.statusCode === 429) {
  showNotification('Too many requests. Please wait before trying again.');
}
```

---

## 🎯 Complete Integration Checklist

### Public Website
- [ ] Environment variables configured
- [ ] API client created
- [ ] Contact form implemented
- [ ] Contact form validation added
- [ ] Success/error messages displayed
- [ ] Portfolio stats displayed
- [ ] Portfolio videos displayed
- [ ] Partners/clients logos displayed
- [ ] Error handling implemented
- [ ] Loading states added

### Admin Dashboard
- [ ] Authentication context created
- [ ] Login page implemented
- [ ] Protected routes configured
- [ ] Token storage implemented
- [ ] Contacts list page created
- [ ] Contact details view added
- [ ] Status update functionality
- [ ] Delete contact functionality
- [ ] Pagination implemented
- [ ] Logout functionality added

---

## � cPanel Deployment Guide

### Deploying Frontend to cPanel

**Step 1: Build Your Frontend**

```bash
# For React/Vite
npm run build

# For Next.js
npm run build

# For Angular
ng build --configuration production
```

This creates a `dist/` or `build/` folder with static files.

**Step 2: Upload to cPanel**

1. Login to cPanel
2. Go to **File Manager**
3. Navigate to `public_html/` (for main domain) or create a subdomain folder
4. Upload all files from your `dist/` or `build/` folder
5. Make sure `index.html` is in the root

**Step 3: Configure Domain**

- **Main domain**: Place files in `public_html/`
- **Subdomain**: Create subdomain in cPanel → Domains → Create Subdomain
  - Example: `portfolio.wemakeplus.com` → points to `public_html/portfolio/`
  - Example: `admin.wemakeplus.com` → points to `public_html/admin/`

**Step 4: Update Backend CORS**

After deployment, update backend `.env` file with your actual URLs:

```env
FRONTEND_URL=https://wemakeplus.com
ADMIN_URL=https://admin.wemakeplus.com
```

Then restart the Node.js app in cPanel.

**Step 5: Test**

Visit your deployed frontend and test:
- Contact form submission
- Portfolio content loading
- Admin login (if admin dashboard)

### .htaccess for Single Page Applications (SPA)

If using React Router, Vue Router, or similar, create `.htaccess` in your public folder:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

This ensures all routes work correctly.

### SSL/HTTPS Setup

1. Go to cPanel → SSL/TLS Status
2. Enable AutoSSL for your domain
3. Wait 5-10 minutes for certificate installation
4. Your site will be accessible via HTTPS

### Troubleshooting cPanel Deployment

**Issue: White Screen / Blank Page**
- Check browser console for errors
- Verify all assets are uploaded
- Check base path in your build configuration

**Issue: API Calls Failing**
- Verify API URL in environment variables
- Check CORS configuration in backend
- Ensure HTTPS is used (not HTTP)

**Issue: Routes Not Working (404)**
- Add `.htaccess` file (see above)
- Enable mod_rewrite in cPanel

---

## �🐛 Testing & Debugging

### Debug Mode

Add this to your API client for debugging:

```javascript
async request(endpoint, options = {}) {
  console.log('API Request:', {
    url: `${this.baseURL}${endpoint}`,
    method: options.method || 'GET',
    headers: options.headers,
  });

  const response = await fetch(`${this.baseURL}${endpoint}`, options);
  const data = await response.json();

  console.log('API Response:', { status: response.status, data });

  return data;
}
```

### Common Issues

**Issue: CORS Error**
- Check that your domain is in the CORS whitelist
- Verify you're using HTTPS in production

**Issue: 401 Unauthorized**
- Token expired (7 days validity)
- Token not included in request headers
- Check Authorization header format: `Bearer <token>`

**Issue: Rate Limit (429)**
- Too many requests
- Wait 15 minutes or implement request queuing

---

## 📚 Additional Resources

- **Full API Documentation**: [API-DOCUMENTATION.md](./API-DOCUMENTATION.md)
- **Testing Guide**: [API-TEST.md](./API-TEST.md)
- **Quick Reference**: [FRONTEND-QUICK-GUIDE.md](./FRONTEND-QUICK-GUIDE.md)

---

## 🆘 Support

For integration issues:
1. Check browser console for errors
2. Verify API endpoint URLs
3. Test endpoints using [API-TEST.md](./API-TEST.md) guide
4. Check network tab in browser DevTools

---

**Last Updated**: February 18, 2026  
**API Base URL**: `https://wemakeplus.com/api`  
**Backend Version**: 1.0.0

# Contact Form Message Handling - Frontend Integration Guide

## 📨 How Messages Are Handled

When a user submits the contact form, the backend handles it in **3 ways simultaneously**:

### 1. **Saved to Database** ✅
- All messages are stored in the `contacts` table
- Includes: name, email, phone, company, subject, message, language, timestamp
- Each message has a status: `new`, `read`, `replied`, or `archived`

### 2. **Email to Admin** ✅
- **Recipient**: The email configured in `EMAIL_TO` (e.g., `info@wemakeplus.com`)
- **Subject**: `[Makeplus Contact] {user's subject}`
- **Contains**: Full message details + user's contact information
- **Purpose**: Admin receives instant notification in their email inbox

### 3. **Auto-Reply Email to User** ✅
- **Recipient**: The user who submitted the form
- **Language**: Matches the form language (English or French)
- **Subject**: 
  - French: "Merci pour votre message - Makeplus"
  - English: "Thank you for your message - Makeplus"
- **Purpose**: Confirmation that we received their message

---

## 🎯 Admin Dashboard Access

Messages are **also accessible via API** for the admin dashboard:

### Get All Messages
```
GET /api/admin/contacts
Authorization: Bearer {admin_jwt_token}
```

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `status`: Filter by status (new/read/replied/archived)
- `search`: Search in name, email, or subject

**Response**:
```json
{
  "success": true,
  "data": {
    "contacts": [
      {
        "id": 123,
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "company": "Example Corp",
        "subject": "Project Inquiry",
        "message": "I'm interested in...",
        "status": "new",
        "language": "en",
        "created_at": "2026-02-15T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 93
    }
  }
}
```

### Get Single Message
```
GET /api/admin/contacts/:id
Authorization: Bearer {admin_jwt_token}
```

### Update Message Status
```
PUT /api/admin/contacts/:id/status
Authorization: Bearer {admin_jwt_token}
Content-Type: application/json

{
  "status": "read"  // or "replied", "archived"
}
```

### Delete Message
```
DELETE /api/admin/contacts/:id
Authorization: Bearer {admin_jwt_token}
```

---

## 🔗 Frontend Integration

### Contact Form Submission Endpoint

**Endpoint**: `POST /api/contact`

**Headers**:
```
Content-Type: application/json
```

**Required Fields**:
```json
{
  "name": "John Doe",          // Required, 2-100 chars
  "email": "john@example.com", // Required, valid email
  "subject": "Project Inquiry", // Required, 5-200 chars
  "message": "Your message...", // Required, 10-2000 chars
  "phone": "+1234567890",       // Optional
  "company": "Company Name",    // Optional
  "language": "en"              // Optional, "en" or "fr", default "fr"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "id": 123,
    "timestamp": "2026-02-15T10:00:00.000Z"
  }
}
```

**Error Response (400)**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

---

## 🚀 Frontend Implementation Example

### React/Vue/JavaScript Example

```javascript
async function submitContactForm(formData) {
  try {
    const response = await fetch('https://yourdomain.com/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        subject: formData.subject,
        message: formData.message,
        language: 'fr' // or 'en' based on site language
      })
    });

    const result = await response.json();

    if (result.success) {
      // Show success message to user
      alert('Message envoyé avec succès!');
      // Reset form
    } else {
      // Show error messages
      console.error('Errors:', result.errors);
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('Une erreur est survenue. Veuillez réessayer.');
  }
}
```

---

## 📋 Summary for Frontend Developer

**What happens when user submits contact form:**

1. ✅ **Message saved to database** → Admin can view in dashboard
2. ✅ **Email sent to admin** → Admin receives notification in inbox
3. ✅ **Auto-reply sent to user** → User gets confirmation email

**What you need to implement:**

- Contact form with required fields (name, email, subject, message)
- POST request to `/api/contact` endpoint
- Success/error handling and user feedback
- Form validation (matches backend requirements)
- Language selection (optional: 'en' or 'fr')

**Rate Limiting:**
- **5 submissions per 15 minutes per IP address**
- If exceeded, user gets 429 error with message "Too many requests"

**Security:**
- CORS is configured to allow your frontend domain
- No authentication required for public contact form
- Input validation and sanitization handled by backend

---

## 🎨 Recommended User Experience

### Before Submit:
- Client-side validation for required fields
- Character count indicators for message field
- Disable submit button during submission

### On Success:
- Show success message: "Message envoyé avec succès!" (FR) or "Message sent successfully!" (EN)
- Clear form fields
- Mention: "Vous recevrez un email de confirmation" (You'll receive a confirmation email)

### On Error:
- Display specific error messages from backend
- Keep form data filled (don't clear on error)
- Highlight fields with errors

### Rate Limit Exceeded:
- Show friendly message: "Trop de demandes. Veuillez réessayer dans 15 minutes."
- Disable submit button temporarily

---

## 📧 Email Configuration (Backend Side)

The backend sends emails via SMTP. Configuration in `.env`:

```env
SMTP_HOST=mail.wemakeplus.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@wemakeplus.com
SMTP_PASSWORD=your_password
EMAIL_FROM="Makeplus Website" <contact@wemakeplus.com>
EMAIL_TO=info@wemakeplus.com  # ← Admin receives messages here
```

**Note**: The frontend doesn't need to know these details - just that emails are sent automatically.

---

## 🔍 Testing Checklist

After backend deployment, test:

- [ ] Submit form with all fields → Check success response
- [ ] Submit without required field → Check validation error
- [ ] Submit with invalid email → Check email validation error
- [ ] Check admin email inbox → Should receive notification
- [ ] Check user email inbox → Should receive auto-reply
- [ ] Try 6 submissions rapidly → Should get rate limit error
- [ ] Login to admin dashboard → See message in contacts list

---

## 📞 Support

For API questions or issues, refer to:
- **API-DOCUMENTATION.md**: Complete API reference
- **README.md**: Backend setup and configuration

---

**Last Updated**: February 15, 2026  
**API Version**: 1.0.0  
**Base URL**: `https://yourdomain.com/api`

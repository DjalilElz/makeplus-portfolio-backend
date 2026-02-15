# API Documentation - Makeplus Portfolio Backend

Complete API reference for the Makeplus Portfolio Backend API.

## Base URL

```
Production: https://yourdomain.com/api
Development: http://localhost:5000/api
```

## Authentication

Most admin endpoints require JWT authentication.

### Headers

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Authentication Flow

1. Login via `/api/admin/login`
2. Receive JWT token in response
3. Include token in subsequent requests

---

## Table of Contents

- [Health & Status](#health--status)
- [Contact Management](#contact-management)
- [Authentication](#authentication-endpoints)
- [Content Management](#content-management)
- [Admin Operations](#admin-operations)

---

## Health & Status

### Health Check

Check API health and database connectivity.

**Endpoint**: `GET /api/health`

**Authentication**: None

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-15T00:00:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

**Status Codes**:
- `200`: API is healthy
- `500`: API or database error

---

## Contact Management

### Submit Contact Form

Submit a contact form message from the public website.

**Endpoint**: `POST /api/contact`

**Authentication**: None

**Rate Limit**: 5 requests per 15 minutes per IP

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "Example Corp",
  "subject": "Project Inquiry",
  "message": "I'm interested in your services...",
  "language": "en"
}
```

**Field Validation**:
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | string | Yes | 2-100 characters |
| `email` | string | Yes | Valid email format |
| `phone` | string | No | Valid phone format |
| `company` | string | No | Max 100 characters |
| `subject` | string | Yes | 5-200 characters |
| `message` | string | Yes | 10-2000 characters |
| `language` | string | No | 'en' or 'fr', default 'fr' |

**Success Response**:
```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "contact": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com",
    "status": "new",
    "createdAt": "2026-02-15T00:00:00.000Z"
  }
}
```

**Error Response**:
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

**Status Codes**:
- `201`: Contact submitted successfully
- `400`: Validation error
- `429`: Rate limit exceeded
- `500`: Server error

**Email Notifications**:
- Sends auto-reply to submitter (multilingual)
- Sends notification to admin email

---

### Get All Contacts (Admin)

Retrieve all contact form submissions with pagination.

**Endpoint**: `GET /api/admin/contacts`

**Authentication**: Required (Admin)

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page (max 100) |
| `status` | string | all | Filter by status: new, read, replied, archived |
| `search` | string | - | Search in name, email, subject |

**Request Example**:
```
GET /api/admin/contacts?page=1&limit=20&status=new
Authorization: Bearer <token>
```

**Success Response**:
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
        "ip_address": "192.168.1.1",
        "createdAt": "2026-02-15T00:00:00.000Z",
        "updatedAt": "2026-02-15T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 93,
      "itemsPerPage": 20
    }
  }
}
```

**Status Codes**:
- `200`: Success
- `401`: Unauthorized
- `403`: Forbidden (not admin)
- `500`: Server error

---

### Get Single Contact (Admin)

Retrieve details of a specific contact.

**Endpoint**: `GET /api/admin/contacts/:id`

**Authentication**: Required (Admin)

**URL Parameters**:
- `id`: Contact ID

**Success Response**:
```json
{
  "success": true,
  "data": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "Example Corp",
    "subject": "Project Inquiry",
    "message": "Full message text...",
    "status": "new",
    "language": "en",
    "ip_address": "192.168.1.1",
    "user_agent": "Mozilla/5.0...",
    "createdAt": "2026-02-15T00:00:00.000Z",
    "updatedAt": "2026-02-15T00:00:00.000Z"
  }
}
```

**Status Codes**:
- `200`: Success
- `401`: Unauthorized
- `404`: Contact not found
- `500`: Server error

---

### Update Contact Status (Admin)

Update the status of a contact submission.

**Endpoint**: `PUT /api/admin/contacts/:id/status`

**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "status": "read"
}
```

**Valid Status Values**:
- `new`: Not yet reviewed
- `read`: Reviewed by admin
- `replied`: Admin has replied
- `archived`: Archived/closed

**Success Response**:
```json
{
  "success": true,
  "message": "Contact status updated",
  "data": {
    "id": 123,
    "status": "read",
    "updatedAt": "2026-02-15T00:00:00.000Z"
  }
}
```

**Status Codes**:
- `200`: Success
- `400`: Invalid status value
- `401`: Unauthorized
- `404`: Contact not found
- `500`: Server error

---

### Delete Contact (Admin)

Permanently delete a contact submission.

**Endpoint**: `DELETE /api/admin/contacts/:id`

**Authentication**: Required (Admin)

**Success Response**:
```json
{
  "success": true,
  "message": "Contact deleted successfully"
}
```

**Status Codes**:
- `200`: Success
- `401`: Unauthorized
- `404`: Contact not found
- `500`: Server error

---

## Authentication Endpoints

### Admin Login

Authenticate an admin user and receive JWT token.

**Endpoint**: `POST /api/admin/login`

**Authentication**: None

**Rate Limit**: 5 attempts per 15 minutes per IP

**Request Body**:
```json
{
  "email": "admin@example.com",
  "password": "your-password"
}
```

**Success Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "admin": {
      "id": 1,
      "name": "Admin Name",
      "email": "admin@example.com",
      "role": "super_admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response**:
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Status Codes**:
- `200`: Login successful
- `400`: Validation error
- `401`: Invalid credentials
- `403`: Account inactive
- `429`: Too many attempts
- `500`: Server error

**Token Expiration**: 7 days (configurable via `JWT_EXPIRES_IN`)

---

### Get Current Admin

Get the authenticated admin's profile.

**Endpoint**: `GET /api/admin/me`

**Authentication**: Required

**Success Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Admin Name",
    "email": "admin@example.com",
    "role": "super_admin",
    "is_active": true,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "last_login": "2026-02-15T00:00:00.000Z"
  }
}
```

**Status Codes**:
- `200`: Success
- `401`: Unauthorized
- `500`: Server error

---

### Admin Logout

Invalidate the current JWT token (client-side).

**Endpoint**: `POST /api/admin/logout`

**Authentication**: Required

**Note**: JWT tokens are stateless, so logout is primarily client-side (remove token from storage). This endpoint can be used for logging/tracking.

**Success Response**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Status Codes**:
- `200`: Success
- `401`: Unauthorized

---

## Content Management

### Get Portfolio Statistics

Get portfolio statistics (projects, clients, etc.).

**Endpoint**: `GET /api/content/stats`

**Authentication**: None

**Success Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "label_en": "Projects Completed",
      "label_fr": "Projets Réalisés",
      "value": 150,
      "icon": "CheckCircle",
      "order": 1,
      "is_active": true
    },
    {
      "id": 2,
      "label_en": "Happy Clients",
      "label_fr": "Clients Satisfaits",
      "value": 200,
      "icon": "Users",
      "order": 2,
      "is_active": true
    }
  ]
}
```

**Status Codes**:
- `200`: Success
- `500`: Server error

---

### Get Portfolio Videos

Get portfolio video showcases.

**Endpoint**: `GET /api/content/videos`

**Authentication**: None

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 10 | Max videos to return |
| `category` | string | - | Filter by category |

**Success Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title_en": "Corporate Video",
      "title_fr": "Vidéo d'Entreprise",
      "description_en": "Professional corporate video...",
      "description_fr": "Vidéo d'entreprise professionnelle...",
      "video_url": "https://youtube.com/watch?v=...",
      "thumbnail_url": "https://img.youtube.com/vi/.../maxresdefault.jpg",
      "category": "corporate",
      "order": 1,
      "is_active": true,
      "views": 1250,
      "createdAt": "2026-01-15T00:00:00.000Z"
    }
  ]
}
```

**Status Codes**:
- `200`: Success
- `500`: Server error

---

### Get Partners

Get partner/client logos.

**Endpoint**: `GET /api/content/partners`

**Authentication**: None

**Success Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Company Name",
      "logo_url": "/uploads/partners/company-logo.png",
      "website_url": "https://company.com",
      "order": 1,
      "is_active": true
    }
  ]
}
```

**Status Codes**:
- `200`: Success
- `500`: Server error

---

## Admin Operations

### Create/Update Stats (Admin)

**Create**: `POST /api/admin/stats`
**Update**: `PUT /api/admin/stats/:id`

**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "label_en": "Projects Completed",
  "label_fr": "Projets Réalisés",
  "value": 150,
  "icon": "CheckCircle",
  "order": 1,
  "is_active": true
}
```

**Status Codes**:
- `200/201`: Success
- `400`: Validation error
- `401`: Unauthorized
- `500`: Server error

---

### Create/Update Videos (Admin)

**Create**: `POST /api/admin/videos`
**Update**: `PUT /api/admin/videos/:id`

**Authentication**: Required (Admin)

**Request Body**:
```json
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
```

**Status Codes**:
- `200/201`: Success
- `400`: Validation error
- `401`: Unauthorized
- `500`: Server error

---

### Create/Update Partners (Admin)

**Create**: `POST /api/admin/partners`
**Update**: `PUT /api/admin/partners/:id`

**Authentication**: Required (Admin)

**Request Body** (multipart/form-data for logo upload):
```
name: "Company Name"
website_url: "https://company.com"
logo: <file>
order: 1
is_active: true
```

**Status Codes**:
- `200/201`: Success
- `400`: Validation error
- `401`: Unauthorized
- `413`: File too large
- `500`: Server error

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Specific error message"
    }
  ],
  "statusCode": 400
}
```

### Common Error Codes

| Code | Meaning |
|------|---------|
| `400` | Bad Request - Invalid input |
| `401` | Unauthorized - Invalid/missing token |
| `403` | Forbidden - Insufficient permissions |
| `404` | Not Found - Resource doesn't exist |
| `429` | Too Many Requests - Rate limit exceeded |
| `500` | Internal Server Error |

---

## Rate Limiting

Rate limiting is applied to prevent abuse:

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/contact` | 5 requests | 15 minutes |
| `/api/admin/login` | 5 requests | 15 minutes |
| All other endpoints | 100 requests | 15 minutes |
| Admin endpoints | 200 requests | 15 minutes |

**Rate Limit Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1644912000
```

**Rate Limit Error**:
```json
{
  "success": false,
  "message": "Too many requests, please try again later",
  "statusCode": 429
}
```

---

## CORS Policy

The API accepts requests from:
- Frontend application (configured in `FRONTEND_URL`)
- Admin dashboard (configured in `ADMIN_URL`)
- `localhost:3000` and `localhost:5173` (development)

Cross-origin requests from other domains will be blocked.

---

## File Uploads

### Size Limits

- **Images**: 5 MB (configured via `MAX_IMAGE_SIZE`)
- **Videos**: 100 MB (configured via `MAX_VIDEO_SIZE`)

### Supported Formats

- **Images**: JPG, JPEG, PNG, GIF, WebP
- **Videos**: MP4, WebM, OGG (or YouTube URLs)

---

## WebSocket Support

Not currently implemented. The API is REST-only.

---

## Versioning

Current API version: `v1`

The API does not currently use URL versioning. Future versions may implement:
```
/api/v2/endpoint
```

---

## Support & Contact

For API support or issues:
- Check [README.md](./README.md) for setup instructions
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- Contact the development team

---

## Changelog

### Version 1.0.0 (2026-02-15)
- Initial release
- Contact form management
- Admin authentication
- Content management (stats, videos, partners)
- Email notifications
- Rate limiting
- Security features (JWT, helmet, CORS)

---

**Last Updated**: February 15, 2026

# Inquiries Module

This module handles customer inquiry management for the Natural Farm admin dashboard.

## Features

- Create inquiries (public endpoint - no authentication required)
- List inquiries with pagination and search
- View individual inquiry details
- Toggle read/unread status

## Endpoints

### Public Endpoints

#### Create Inquiry
```
POST /api/inquiries
```

Creates a new customer inquiry. This endpoint is public and does not require authentication.

**Request Body:**
```json
{
  "customer_name": "John Doe",
  "phone_number": "1234567890",
  "message": "Optional inquiry message"
}
```

**Response:**
```json
{
  "id": "uuid",
  "customer_name": "John Doe",
  "phone_number": "1234567890",
  "message": "Optional inquiry message",
  "is_read": false,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Protected Endpoints (Require JWT Authentication)

#### List Inquiries
```
GET /api/inquiries?page=1&limit=50&search=john
```

Returns a paginated list of inquiries sorted by creation date (newest first).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)
- `search` (optional): Search term to filter by customer name or phone number

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "customer_name": "John Doe",
      "phone_number": "1234567890",
      "message": "Optional inquiry message",
      "is_read": false,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 50,
  "totalPages": 2
}
```

#### Get Inquiry Details
```
GET /api/inquiries/:id
```

Returns full details of a specific inquiry.

**Response:**
```json
{
  "id": "uuid",
  "customer_name": "John Doe",
  "phone_number": "1234567890",
  "message": "Optional inquiry message",
  "is_read": false,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### Update Read Status
```
PATCH /api/inquiries/:id/read
```

Toggles the read/unread status of an inquiry.

**Request Body:**
```json
{
  "is_read": true
}
```

**Response:**
```json
{
  "id": "uuid",
  "customer_name": "John Doe",
  "phone_number": "1234567890",
  "message": "Optional inquiry message",
  "is_read": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## Database Schema

The inquiries table includes:
- `id`: UUID primary key
- `customer_name`: Customer's name (required)
- `phone_number`: Customer's phone number (required)
- `message`: Optional inquiry message
- `is_read`: Boolean flag for read status (default: false)
- `created_at`: Timestamp of creation
- `updated_at`: Timestamp of last update

## Implementation Details

- Inquiries are sorted by `created_at` in descending order (newest first)
- Pagination defaults to 50 items per page
- Search functionality filters by customer name or phone number (case-insensitive)
- The create endpoint is public to allow customer submissions from the website
- All other endpoints require JWT authentication for admin access

# Categories Module

This module handles CRUD operations for product categories with bilingual support (English and Kannada).

## Features

- Create categories with English and Kannada names
- List all categories
- Update category information
- Delete categories (with subcategory validation)
- JWT authentication required for all endpoints

## API Endpoints

### POST /api/categories
Create a new category.

**Request Body:**
```json
{
  "name_en": "Vegetables",
  "name_kn": "ತರಕಾರಿಗಳು"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "name_en": "Vegetables",
  "name_kn": "ತರಕಾರಿಗಳು",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### GET /api/categories
List all categories.

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name_en": "Vegetables",
    "name_kn": "ತರಕಾರಿಗಳು",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET /api/categories/:id
Get a single category by ID.

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name_en": "Vegetables",
  "name_kn": "ತರಕಾರಿಗಳು",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### PUT /api/categories/:id
Update a category.

**Request Body:**
```json
{
  "name_en": "Fresh Vegetables",
  "name_kn": "ತಾಜಾ ತರಕಾರಿಗಳು"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name_en": "Fresh Vegetables",
  "name_kn": "ತಾಜಾ ತರಕಾರಿಗಳು",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### DELETE /api/categories/:id
Delete a category.

**Response:** `204 No Content`

**Error Response (if subcategories exist):** `400 Bad Request`
```json
{
  "statusCode": 400,
  "message": "Cannot delete category with existing subcategories"
}
```

## Validation

- Both `name_en` and `name_kn` are required when creating a category
- Both fields must be non-empty strings
- When updating, at least one field must be provided
- Categories with subcategories cannot be deleted

## Authentication

All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Implementation Details

- Uses Supabase PostgreSQL for data storage
- Implements soft validation for subcategory relationships
- Returns appropriate HTTP status codes (200, 201, 204, 400, 404)
- Validates bilingual content requirements per Requirement 15.5

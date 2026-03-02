# Banner Management API

This module handles banner image management for the admin dashboard.

## Features

- Upload banner images with validation (JPEG, PNG, WebP, max 5MB)
- List all banners sorted by display order
- Delete banners with automatic file cleanup
- Reorder banners via drag-and-drop

## Endpoints

### POST /api/banners
Upload a new banner image.

**Authentication:** Required (JWT)

**Request:**
- Content-Type: multipart/form-data
- Body: `file` (image file)

**Response:**
```json
{
  "id": "uuid",
  "image_url": "https://...",
  "display_order": 0,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### GET /api/banners
Get all banners sorted by display order.

**Authentication:** Required (JWT)

**Response:**
```json
[
  {
    "id": "uuid",
    "image_url": "https://...",
    "display_order": 0,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

### DELETE /api/banners/:id
Delete a banner and its associated file.

**Authentication:** Required (JWT)

**Response:**
```json
{
  "message": "Banner deleted successfully"
}
```

### PUT /api/banners/reorder
Update display order of multiple banners.

**Authentication:** Required (JWT)

**Request:**
```json
{
  "banners": [
    { "id": "uuid1", "display_order": 0 },
    { "id": "uuid2", "display_order": 1 }
  ]
}
```

**Response:**
```json
[
  {
    "id": "uuid",
    "image_url": "https://...",
    "display_order": 0,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

## Validation

- File types: JPEG, PNG, WebP
- Max file size: 5MB
- Automatic display order assignment for new banners

## Storage

Files are stored in the `banners` Supabase Storage bucket with unique UUID-based filenames.

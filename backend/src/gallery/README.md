# Gallery Management API

This module handles gallery image management for the admin dashboard.

## Features

- Upload multiple gallery images simultaneously
- List all gallery images
- Delete individual images with file cleanup
- Bulk delete multiple images
- Validation for each uploaded file (JPEG, PNG, WebP, max 5MB)

## Endpoints

### POST /api/gallery
Upload one or more gallery images.

**Authentication:** Required (JWT)

**Request:**
- Content-Type: multipart/form-data
- Body: `files` (array of image files, max 20)

**Response:**
```json
[
  {
    "id": "uuid",
    "image_url": "https://...",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### GET /api/gallery
Get all gallery images sorted by creation date (newest first).

**Authentication:** Required (JWT)

**Response:**
```json
[
  {
    "id": "uuid",
    "image_url": "https://...",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### DELETE /api/gallery/:id
Delete a single gallery image and its associated file.

**Authentication:** Required (JWT)

**Response:**
```json
{
  "message": "Gallery image deleted successfully"
}
```

### DELETE /api/gallery/bulk/delete
Delete multiple gallery images at once.

**Authentication:** Required (JWT)

**Request:**
```json
{
  "ids": ["uuid1", "uuid2", "uuid3"]
}
```

**Response:**
```json
{
  "message": "Gallery images deleted successfully"
}
```

## Validation

- File types: JPEG, PNG, WebP
- Max file size: 5MB per file
- Max files per upload: 20
- Each file is validated individually

## Storage

Files are stored in the `gallery` Supabase Storage bucket with unique UUID-based filenames.

## Error Handling

- If one file fails during multi-upload, other files continue processing
- Failed uploads are logged but don't stop the entire operation
- Database failures trigger automatic file cleanup

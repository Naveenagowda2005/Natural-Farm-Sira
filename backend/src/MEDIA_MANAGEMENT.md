# Media Management API - Implementation Summary

This document provides an overview of the media management API implementation for the Natural Farm admin dashboard.

## Overview

The media management system consists of three modules:
1. **Banners** - Homepage promotional images with ordering
2. **Gallery** - Photo gallery with bulk operations
3. **Videos** - Video content (URLs or uploads)

All modules use Supabase Storage for file storage and PostgreSQL for metadata.

## Architecture

### Common Components

- **StorageService**: Handles file uploads, validation, and deletion
- **SupabaseService**: Manages database connections
- **JwtAuthGuard**: Protects all endpoints with JWT authentication

### Storage Buckets

- `banners` - Banner images (5MB max)
- `gallery` - Gallery images (5MB max)
- `videos` - Video files (50MB max)

### File Validation

All uploads are validated for:
- File type (MIME type checking)
- File size (enforced limits)
- Unique filename generation (UUID-based)

## Modules

### 1. Banners Module

**Location:** `backend/src/banners/`

**Features:**
- Upload banner images
- List banners sorted by display order
- Delete banners with file cleanup
- Reorder banners

**Endpoints:**
- `POST /api/banners` - Upload banner
- `GET /api/banners` - List all banners
- `DELETE /api/banners/:id` - Delete banner
- `PUT /api/banners/reorder` - Update display order

**Validation:**
- Formats: JPEG, PNG, WebP
- Max size: 5MB

### 2. Gallery Module

**Location:** `backend/src/gallery/`

**Features:**
- Upload multiple images simultaneously (max 20)
- List all gallery images
- Delete individual images
- Bulk delete multiple images

**Endpoints:**
- `POST /api/gallery` - Upload images
- `GET /api/gallery` - List all images
- `DELETE /api/gallery/:id` - Delete single image
- `DELETE /api/gallery/bulk/delete` - Bulk delete

**Validation:**
- Formats: JPEG, PNG, WebP
- Max size: 5MB per file
- Max files: 20 per request

### 3. Videos Module

**Location:** `backend/src/videos/`

**Features:**
- Add videos via URL (YouTube/Vimeo)
- Upload video files (MP4/WebM)
- Update video titles
- Delete videos with file cleanup

**Endpoints:**
- `POST /api/videos` - Add video (URL or file)
- `GET /api/videos` - List all videos
- `PUT /api/videos/:id` - Update title
- `DELETE /api/videos/:id` - Delete video

**Validation:**
- URL: YouTube/Vimeo only
- File formats: MP4, WebM
- Max size: 50MB

## Database Schema

### banners
```sql
id UUID PRIMARY KEY
image_url TEXT NOT NULL
display_order INTEGER NOT NULL DEFAULT 0
created_at TIMESTAMP
updated_at TIMESTAMP
```

### gallery_images
```sql
id UUID PRIMARY KEY
image_url TEXT NOT NULL
created_at TIMESTAMP
```

### videos
```sql
id UUID PRIMARY KEY
title VARCHAR(255) NOT NULL
video_url TEXT
video_file_url TEXT
video_type VARCHAR(50) NOT NULL
created_at TIMESTAMP
updated_at TIMESTAMP
```

## Error Handling

All modules implement consistent error handling:

1. **File Validation Errors**: Return 400 Bad Request with descriptive message
2. **Not Found Errors**: Return 404 with entity-specific message
3. **Database Errors**: Propagate Supabase errors with cleanup
4. **File Cleanup**: Automatic cleanup on database failures

## Security

- All endpoints protected with JWT authentication
- File type validation prevents malicious uploads
- File size limits prevent storage abuse
- Unique filenames prevent collisions and overwrites

## Requirements Coverage

### Banner Management (Requirement 7)
✅ 7.1 - Display list with thumbnails
✅ 7.2 - Add banner with upload interface
✅ 7.3 - Validate format and size
✅ 7.4 - Store file and database entry
✅ 7.5 - Delete with confirmation
✅ 7.6 - Remove file and database entry
✅ 7.7 - Reorder banners
✅ 7.8 - Save display order

### Gallery Management (Requirement 8)
✅ 8.1 - Display grid with thumbnails
✅ 8.2 - Multiple file upload
✅ 8.3 - Validate each file
✅ 8.4 - Store files and entries
✅ 8.5 - Delete with confirmation
✅ 8.6 - Remove file and entry
✅ 8.7 - Bulk deletion

### Video Management (Requirement 9)
✅ 9.1 - Display list with titles
✅ 9.2 - Add video form (URL or file)
✅ 9.3 - Validate YouTube/Vimeo URLs
✅ 9.4 - Validate video files
✅ 9.5 - Store reference or file
✅ 9.6 - Delete with confirmation
✅ 9.7 - Remove file or reference
✅ 9.8 - Edit video titles

## Testing

To test the endpoints:

1. Start the backend server: `npm run start:dev`
2. Obtain JWT token via `/api/auth/login`
3. Use the token in Authorization header: `Bearer <token>`
4. Test endpoints with tools like Postman or curl

Example:
```bash
# Upload banner
curl -X POST http://localhost:3000/api/banners \
  -H "Authorization: Bearer <token>" \
  -F "file=@banner.jpg"

# List banners
curl http://localhost:3000/api/banners \
  -H "Authorization: Bearer <token>"
```

## Future Enhancements

Potential improvements:
- Image optimization/resizing on upload
- Video thumbnail generation
- Progress tracking for large uploads
- CDN integration for better performance
- Image metadata extraction (dimensions, format)

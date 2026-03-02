# Video Management API

This module handles video management for the admin dashboard, supporting both external URLs (YouTube/Vimeo) and uploaded video files.

## Features

- Add videos via URL (YouTube/Vimeo) or file upload (MP4/WebM)
- List all videos
- Update video titles
- Delete videos with automatic file cleanup
- URL validation for YouTube and Vimeo
- File validation (MP4, WebM, max 50MB)

## Endpoints

### POST /api/videos
Add a new video (URL or file upload).

**Authentication:** Required (JWT)

**Request (URL):**
- Content-Type: application/json
```json
{
  "title": "Video Title",
  "video_url": "https://www.youtube.com/watch?v=...",
  "video_type": "url"
}
```

**Request (File):**
- Content-Type: multipart/form-data
- Body:
  - `title`: Video title
  - `video_type`: "file"
  - `file`: Video file

**Response:**
```json
{
  "id": "uuid",
  "title": "Video Title",
  "video_url": "https://...",
  "video_file_url": null,
  "video_type": "url",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### GET /api/videos
Get all videos sorted by creation date (newest first).

**Authentication:** Required (JWT)

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Video Title",
    "video_url": "https://...",
    "video_file_url": null,
    "video_type": "url",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

### PUT /api/videos/:id
Update a video's title.

**Authentication:** Required (JWT)

**Request:**
```json
{
  "title": "Updated Video Title"
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Updated Video Title",
  "video_url": "https://...",
  "video_file_url": null,
  "video_type": "url",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### DELETE /api/videos/:id
Delete a video and its associated file (if file type).

**Authentication:** Required (JWT)

**Response:**
```json
{
  "message": "Video deleted successfully"
}
```

## Validation

### URL Type
- Supported platforms: YouTube, Vimeo
- URL format validation using regex patterns

### File Type
- File formats: MP4, WebM
- Max file size: 50MB

## Storage

Video files are stored in the `videos` Supabase Storage bucket with unique UUID-based filenames. URL-based videos only store the reference URL in the database.

## Video Types

- **url**: External video URL (YouTube/Vimeo)
  - `video_url` contains the external URL
  - `video_file_url` is null
  
- **file**: Uploaded video file
  - `video_url` is null
  - `video_file_url` contains the Supabase Storage URL

## Error Handling

- Invalid URLs are rejected with descriptive error messages
- File upload failures trigger automatic cleanup
- Database failures trigger automatic file cleanup

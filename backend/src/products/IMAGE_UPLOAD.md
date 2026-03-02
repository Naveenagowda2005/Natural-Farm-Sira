# Product Image Upload

## Overview

The product image upload feature allows administrators to upload and manage product images through the API. Images are stored in Supabase Storage and validated for format and size.

## Endpoint

### Upload Product Image

**POST** `/api/products/:id/image`

Uploads or replaces a product image.

#### Authentication

Requires JWT authentication token in the Authorization header:
```
Authorization: Bearer <token>
```

#### Request

- **Method**: POST
- **Content-Type**: multipart/form-data
- **URL Parameter**: `id` - Product UUID
- **Body**: Form data with `image` field containing the file

#### File Requirements

- **Allowed formats**: JPEG, PNG, WebP
- **Maximum size**: 5MB
- **Field name**: `image`

#### Response

**Success (200 OK)**
```json
{
  "id": "uuid",
  "name_en": "Product Name",
  "name_kn": "ಉತ್ಪನ್ನದ ಹೆಸರು",
  "price": 100,
  "mrp": 120,
  "subcategory_id": "uuid",
  "is_visible": true,
  "image_url": "https://storage.supabase.co/...",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Error Responses**

- **400 Bad Request**: Invalid file format, size exceeds limit, or no file provided
- **401 Unauthorized**: Missing or invalid authentication token
- **404 Not Found**: Product with specified ID does not exist

#### Example Usage

**Using cURL**
```bash
curl -X POST \
  http://localhost:3000/api/products/123e4567-e89b-12d3-a456-426614174000/image \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/image.jpg"
```

**Using JavaScript (fetch)**
```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

const response = await fetch(
  `http://localhost:3000/api/products/${productId}/image`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  }
);

const updatedProduct = await response.json();
```

## Implementation Details

### Image Replacement Logic

When uploading an image for a product that already has an image:
1. The new image is uploaded to Supabase Storage
2. The old image is deleted from storage
3. The product record is updated with the new image URL

If the old image deletion fails, the operation continues (new image is already uploaded and product is updated).

### Image Deletion on Product Removal

When a product is deleted via `DELETE /api/products/:id`:
1. The product record is removed from the database
2. If the product has an associated image, it is deleted from Supabase Storage
3. If image deletion fails, the operation continues (product is already deleted)

### Storage Service Integration

The image upload uses the `StorageService` which provides:
- File validation (format and size)
- Unique filename generation using UUID
- Upload to Supabase Storage bucket `product-images`
- Public URL generation
- File deletion and replacement

### Error Handling

The endpoint validates:
- File presence (400 if missing)
- Product existence (404 if not found)
- File format (400 if invalid)
- File size (400 if exceeds 5MB)
- Database operations (400 if update fails)

## Testing

Unit tests are available in `products.service.spec.ts` covering:
- Upload with no file provided
- Upload for non-existent product
- Upload new image (no existing image)
- Replace existing image
- Database update failure
- Product deletion with image cleanup

Run tests:
```bash
npm test -- products.service.spec.ts
```

## Requirements Satisfied

This implementation satisfies the following requirements from the admin dashboard spec:

- **6.1**: Image upload interface when editing a product
- **6.2**: File format validation (JPEG, PNG, WebP)
- **6.3**: File storage and database association
- **6.4**: Display current product image
- **6.5**: Image replacement for products with existing images
- **6.6**: Image deletion when product is deleted
- **6.7**: File size validation (max 5MB)
- **6.8**: Error messages for invalid uploads
- **12.2**: Unique filename generation
- **12.3**: Database reference storage

# Storage Service

This module handles file uploads and management using Supabase Storage.

## Features

- File validation (type and size)
- Unique filename generation
- Upload to Supabase Storage buckets
- File deletion
- File replacement (upload new, delete old)

## Storage Buckets

The following buckets are configured:

1. **product-images**: Product images (JPEG, PNG, WebP, max 5MB)
2. **banners**: Homepage banners (JPEG, PNG, WebP, max 5MB)
3. **gallery**: Gallery images (JPEG, PNG, WebP, max 5MB)
4. **videos**: Video files (MP4, WebM, max 50MB)

## Setup

### 1. Create Storage Buckets

Run the setup script to create the storage buckets in Supabase:

```bash
npm run setup:storage
```

This will create all required buckets with the following configuration:
- Public read access enabled
- File size limits configured
- Allowed MIME types configured

### 2. Configure Storage Policies

The buckets need Row Level Security (RLS) policies for authenticated uploads and public reads.

**Option A: Using Supabase Dashboard**

1. Go to your Supabase project dashboard
2. Navigate to Storage > Policies
3. For each bucket, create policies:
   - INSERT: Allow authenticated users
   - UPDATE: Allow authenticated users
   - DELETE: Allow authenticated users
   - SELECT: Allow public access

**Option B: Using SQL**

Run the SQL script in the Supabase SQL Editor:

```bash
# Copy the contents of backend/database/storage-policies.sql
# and run it in the Supabase SQL Editor
```

The policies enable:
- ✅ Authenticated users can upload files
- ✅ Authenticated users can update files
- ✅ Authenticated users can delete files
- ✅ Public users can read/view files

## Usage

### Import the Module

```typescript
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [StorageModule],
})
export class YourModule {}
```

### Inject the Service

```typescript
import { StorageService, StorageBucket } from './storage/storage.service';

@Injectable()
export class YourService {
  constructor(private readonly storageService: StorageService) {}
}
```

### Upload a File

```typescript
async uploadProductImage(file: Express.Multer.File): Promise<string> {
  const imageUrl = await this.storageService.uploadFile(
    file,
    StorageBucket.PRODUCT_IMAGES,
  );
  return imageUrl;
}
```

### Delete a File

```typescript
async deleteProductImage(imageUrl: string): Promise<void> {
  await this.storageService.deleteFile(
    imageUrl,
    StorageBucket.PRODUCT_IMAGES,
  );
}
```

### Replace a File

```typescript
async replaceProductImage(
  oldImageUrl: string,
  newFile: Express.Multer.File,
): Promise<string> {
  const newImageUrl = await this.storageService.replaceFile(
    oldImageUrl,
    newFile,
    StorageBucket.PRODUCT_IMAGES,
  );
  return newImageUrl;
}
```

## File Validation

The service automatically validates files before upload:

- **File Type**: Only allowed MIME types are accepted
- **File Size**: Files exceeding the maximum size are rejected

Validation rules per bucket:

| Bucket | Allowed Types | Max Size |
|--------|--------------|----------|
| product-images | JPEG, PNG, WebP | 5MB |
| banners | JPEG, PNG, WebP | 5MB |
| gallery | JPEG, PNG, WebP | 5MB |
| videos | MP4, WebM | 50MB |

## Error Handling

The service throws `BadRequestException` for:
- Invalid file type
- File size exceeds limit
- Upload failure
- Invalid file URL
- Deletion failure

Handle these errors in your controllers:

```typescript
try {
  const url = await this.storageService.uploadFile(file, bucket);
  return { url };
} catch (error) {
  // Error is automatically handled by NestJS exception filters
  throw error;
}
```

## Security

- Files are stored with unique UUIDs to prevent collisions
- File validation prevents malicious uploads
- RLS policies ensure only authenticated users can upload
- Public read access allows the frontend to display files
- Service role key is used for server-side operations

## Requirements Satisfied

- **12.1**: Files stored in dedicated Supabase Storage buckets
- **12.6**: File type validation before storage
- **12.7**: File size limits implemented

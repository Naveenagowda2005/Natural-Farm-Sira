# Supabase Storage Setup Guide

This guide walks you through setting up Supabase Storage for the Natural Farm admin dashboard.

## Prerequisites

- Supabase project created
- Environment variables configured in `.env`:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`

## Step 1: Create Storage Buckets

Run the automated setup script:

```bash
npm run setup:storage
```

This creates four storage buckets:
- `product-images` - For product images (max 5MB, JPEG/PNG/WebP)
- `banners` - For homepage banners (max 5MB, JPEG/PNG/WebP)
- `gallery` - For gallery images (max 5MB, JPEG/PNG/WebP)
- `videos` - For video files (max 50MB, MP4/WebM)

All buckets are configured with:
- ✅ Public read access
- ✅ File size limits
- ✅ Allowed MIME types

## Step 2: Configure Storage Policies

Storage policies control who can upload, update, and delete files.

### Option A: Supabase Dashboard (Recommended)

1. Open your Supabase project dashboard
2. Go to **Storage** in the left sidebar
3. Click on **Policies** tab
4. For each bucket (`product-images`, `banners`, `gallery`, `videos`):

   **INSERT Policy:**
   - Name: "Authenticated users can upload"
   - Target roles: `authenticated`
   - Policy definition: `bucket_id = 'bucket-name'`

   **UPDATE Policy:**
   - Name: "Authenticated users can update"
   - Target roles: `authenticated`
   - Policy definition: `bucket_id = 'bucket-name'`

   **DELETE Policy:**
   - Name: "Authenticated users can delete"
   - Target roles: `authenticated`
   - Policy definition: `bucket_id = 'bucket-name'`

   **SELECT Policy:**
   - Name: "Public read access"
   - Target roles: `public`
   - Policy definition: `bucket_id = 'bucket-name'`

### Option B: SQL Script

1. Open the Supabase SQL Editor
2. Copy the contents of `backend/database/storage-policies.sql`
3. Run the SQL script

This will create all necessary policies for all buckets.

## Step 3: Verify Setup

Test the storage setup:

1. Start the backend server:
   ```bash
   npm run start:dev
   ```

2. The StorageService is now available for use in your modules

3. Check the Supabase dashboard:
   - Go to **Storage** > **Buckets**
   - Verify all four buckets are created
   - Check that policies are configured

## Usage in Code

Import the StorageModule in your feature modules:

```typescript
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [StorageModule],
  // ...
})
export class ProductsModule {}
```

Use the StorageService:

```typescript
import { StorageService, StorageBucket } from '../storage/storage.service';

@Injectable()
export class ProductsService {
  constructor(private readonly storageService: StorageService) {}

  async uploadImage(file: Express.Multer.File) {
    const url = await this.storageService.uploadFile(
      file,
      StorageBucket.PRODUCT_IMAGES,
    );
    return url;
  }
}
```

## Troubleshooting

### Bucket Creation Fails

- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are correct
- Check that you're using the service role key, not the anon key
- Ensure your Supabase project is active

### Upload Fails with "Policy Violation"

- Verify storage policies are configured (Step 2)
- Check that you're using an authenticated JWT token
- Ensure the bucket name matches exactly

### Files Not Accessible

- Verify buckets are set to public
- Check that SELECT policies allow public access
- Ensure the file URL is correct

## Security Notes

- The service role key bypasses RLS policies - keep it secure
- Only authenticated admin users should be able to upload files
- Public read access allows the frontend to display images
- File validation prevents malicious uploads
- Unique filenames prevent collisions and overwrites

## Next Steps

After completing this setup:
1. ✅ Storage buckets are ready
2. ✅ Policies are configured
3. ✅ StorageService is available for use
4. → Proceed to implement product image upload (Task 7.2)

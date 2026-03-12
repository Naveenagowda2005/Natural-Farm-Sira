# Database Migration Instructions

## Apply Display Order Migration

You need to run the SQL migration to add `display_order` columns to the `gallery_images` and `videos` tables.

### Option 1: Using psql Command Line

```bash
# If using local PostgreSQL
psql -U postgres -d natural_farm_db -f backend/database/add-display-order-gallery-videos.sql

# If using Supabase (get connection string from Supabase dashboard)
psql "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres" -f backend/database/add-display-order-gallery-videos.sql
```

### Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Open the file `backend/database/add-display-order-gallery-videos.sql`
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click "Run" to execute

### Option 3: Using Database Management Tool

If you're using a tool like pgAdmin, DBeaver, or TablePlus:

1. Connect to your database
2. Open a new SQL query window
3. Copy the contents of `backend/database/add-display-order-gallery-videos.sql`
4. Paste and execute

## Verification

After running the migration, verify it worked:

```sql
-- Check gallery_images table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'gallery_images' AND column_name = 'display_order';

-- Check videos table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'videos' AND column_name = 'display_order';

-- Check if existing records have display_order values
SELECT id, display_order FROM gallery_images LIMIT 5;
SELECT id, display_order FROM videos LIMIT 5;
```

## What the Migration Does

1. Adds `display_order INTEGER DEFAULT 0` column to `gallery_images`
2. Adds `display_order INTEGER DEFAULT 0` column to `videos`
3. Creates indexes for better query performance
4. Updates existing records with sequential display_order values based on created_at

## After Migration

Once the migration is complete:

1. Restart your backend server (if running)
2. The drag-and-drop functionality will work immediately
3. Test by dragging items in the Gallery and Videos admin pages
4. Order will be saved automatically

## Rollback (if needed)

If you need to rollback the changes:

```sql
-- Remove display_order from gallery_images
ALTER TABLE gallery_images DROP COLUMN IF EXISTS display_order;
DROP INDEX IF EXISTS idx_gallery_display_order;

-- Remove display_order from videos
ALTER TABLE videos DROP COLUMN IF EXISTS display_order;
DROP INDEX IF EXISTS idx_videos_display_order;
```

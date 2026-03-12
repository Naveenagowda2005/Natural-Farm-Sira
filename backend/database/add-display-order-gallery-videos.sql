-- Add display_order columns to gallery_images and videos tables

-- Add display_order to gallery_images
ALTER TABLE gallery_images 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Add display_order to videos
ALTER TABLE videos 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_gallery_display_order ON gallery_images(display_order);
CREATE INDEX IF NOT EXISTS idx_videos_display_order ON videos(display_order);

-- Update existing records to have sequential display_order based on created_at
WITH numbered_gallery AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) - 1 as new_order
  FROM gallery_images
)
UPDATE gallery_images
SET display_order = numbered_gallery.new_order
FROM numbered_gallery
WHERE gallery_images.id = numbered_gallery.id;

WITH numbered_videos AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) - 1 as new_order
  FROM videos
)
UPDATE videos
SET display_order = numbered_videos.new_order
FROM numbered_videos
WHERE videos.id = numbered_videos.id;

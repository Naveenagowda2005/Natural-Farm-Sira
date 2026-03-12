-- Add display_order column to subcategories table

-- Add display_order to subcategories
ALTER TABLE subcategories 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_subcategories_display_order ON subcategories(display_order);

-- Update existing records to have sequential display_order based on created_at
WITH numbered_subcategories AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) - 1 as new_order
  FROM subcategories
)
UPDATE subcategories
SET display_order = numbered_subcategories.new_order
FROM numbered_subcategories
WHERE subcategories.id = numbered_subcategories.id;
# SubCategories Display Order Migration

To enable drag and drop functionality for subcategories, you need to run this SQL migration in your Supabase dashboard:

## Steps:
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the following SQL commands:

```sql
-- Add display_order column to subcategories table
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
```

## What this does:
- Adds a `display_order` column to the `subcategories` table
- Creates an index for better performance when ordering
- Sets initial display_order values based on creation date

After running this migration, the drag and drop functionality for subcategories will work properly.
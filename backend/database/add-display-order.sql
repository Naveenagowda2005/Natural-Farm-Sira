-- Add display_order column to categories, subcategories, and products tables
-- Run this migration in Supabase SQL Editor

-- Add display_order to categories
ALTER TABLE categories ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Add display_order to subcategories
ALTER TABLE subcategories ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Add display_order to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);
CREATE INDEX IF NOT EXISTS idx_subcategories_display_order ON subcategories(display_order);
CREATE INDEX IF NOT EXISTS idx_products_display_order ON products(display_order);

-- Initialize display_order values based on created_at (oldest = 0, newest = highest)
WITH ranked_categories AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) - 1 AS new_order
  FROM categories
)
UPDATE categories
SET display_order = ranked_categories.new_order
FROM ranked_categories
WHERE categories.id = ranked_categories.id;

WITH ranked_subcategories AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY created_at ASC) - 1 AS new_order
  FROM subcategories
)
UPDATE subcategories
SET display_order = ranked_subcategories.new_order
FROM ranked_subcategories
WHERE subcategories.id = ranked_subcategories.id;

WITH ranked_products AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY subcategory_id ORDER BY created_at ASC) - 1 AS new_order
  FROM products
)
UPDATE products
SET display_order = ranked_products.new_order
FROM ranked_products
WHERE products.id = ranked_products.id;

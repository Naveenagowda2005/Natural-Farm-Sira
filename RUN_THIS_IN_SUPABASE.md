# URGENT: Run This SQL in Supabase

## Error
```
Database operation failed: Could not find the 'description' column of 'products' in the schema cache
```

## Solution

You need to add the `description` column to the products table.

## Steps to Fix

1. **Open Supabase Dashboard**: https://app.supabase.com/
2. **Select your project**
3. **Go to SQL Editor** (left sidebar)
4. **Click "New Query"**
5. **Copy and paste this SQL**:

```sql
-- Add description column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name = 'description';
```

6. **Click "Run"** (or press Ctrl+Enter)
7. **You should see**: A result showing the description column was added

## Verification

After running the SQL, you should see output like:
```
column_name  | data_type
-------------+-----------
description  | text
```

## Then

1. **Go back to your admin dashboard**
2. **Refresh the page** (Ctrl + Shift + R)
3. **Try creating a product again**
4. **The error should be gone!**

---

**This is a one-time migration. Once you run it, the description field will work permanently.**

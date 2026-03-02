# Database Migration Guide

This guide explains how to set up and manage the database schema for the Natural Farm Admin Dashboard.

## Initial Setup

### Step 1: Create Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the project to be provisioned
3. Note down your project URL and API keys from the project settings

### Step 2: Run Schema Migration

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `database/schema.sql`
5. Paste into the SQL editor
6. Click **Run** to execute the schema

This will create:
- All required tables (admin_users, categories, subcategories, products, banners, gallery_images, videos, inquiries)
- Indexes for optimized queries
- Triggers for automatic timestamp updates
- Foreign key constraints for data integrity

### Step 3: Verify Schema

After running the migration, verify that all tables were created:

1. Go to **Table Editor** in the Supabase dashboard
2. You should see all 8 tables listed
3. Click on each table to verify the columns match the schema

### Step 4: Create Admin User

Use the provided script to create your first admin user:

```bash
# Build the project first
npm run build

# Create admin user
node dist/scripts/create-admin.js admin yourSecurePassword
```

## Schema Overview

### admin_users
Stores admin user credentials with bcrypt-hashed passwords.

### categories
Top-level product categories with bilingual names (English and Kannada).

### subcategories
Second-level product groupings, linked to parent categories.
- **Constraint**: Cannot delete a category if it has subcategories

### products
Product information including pricing, images, and visibility control.
- **Constraint**: Cannot delete a subcategory if it has products
- **Feature**: Soft visibility toggle (is_visible) to hide products without deletion

### banners
Homepage banner images with display order for carousel.

### gallery_images
Images displayed in the website gallery section.

### videos
Video content, supporting both external URLs (YouTube, Vimeo) and uploaded files.

### inquiries
Customer contact form submissions with read/unread status.

## Row Level Security (RLS)

For production deployments, consider enabling Row Level Security:

```sql
-- Enable RLS on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated admin users
-- Note: Implement proper authentication checks based on your auth strategy
```

## Future Migrations

When schema changes are needed:

1. Create a new migration file: `database/migrations/YYYYMMDD_description.sql`
2. Document the changes in this guide
3. Test the migration on a development database first
4. Apply to production during a maintenance window

## Backup and Restore

### Backup
Supabase provides automatic backups, but you can also:
1. Use the Supabase dashboard to export data
2. Use `pg_dump` with your database connection string

### Restore
1. Use the Supabase dashboard to import data
2. Use `psql` with your database connection string

## Troubleshooting

### Error: relation already exists
If you see this error, tables already exist. You can either:
- Drop existing tables first (WARNING: This deletes all data)
- Modify the schema.sql to use `CREATE TABLE IF NOT EXISTS`

### Error: permission denied
Ensure you're using the Service Role Key, not the Anon Key, for schema operations.

### Foreign Key Constraint Violations
When deleting categories or subcategories, ensure they have no child records:
- Categories must have no subcategories
- Subcategories must have no products

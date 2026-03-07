const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runMigration() {
  console.log('🚀 Running display_order migration...\n');

  try {
    // Add columns
    console.log('1. Adding display_order columns...');
    await supabase.rpc('exec_sql', { 
      sql: 'ALTER TABLE categories ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0' 
    });
    await supabase.rpc('exec_sql', { 
      sql: 'ALTER TABLE subcategories ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0' 
    });
    await supabase.rpc('exec_sql', { 
      sql: 'ALTER TABLE products ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0' 
    });
    console.log('✅ Columns added\n');

    // Create indexes
    console.log('2. Creating indexes...');
    await supabase.rpc('exec_sql', { 
      sql: 'CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order)' 
    });
    await supabase.rpc('exec_sql', { 
      sql: 'CREATE INDEX IF NOT EXISTS idx_subcategories_display_order ON subcategories(display_order)' 
    });
    await supabase.rpc('exec_sql', { 
      sql: 'CREATE INDEX IF NOT EXISTS idx_products_display_order ON products(display_order)' 
    });
    console.log('✅ Indexes created\n');

    console.log('✅ Migration completed successfully!');
    console.log('\nYou can now test the order switching feature.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();

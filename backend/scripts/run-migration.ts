import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('Running migration: add-display-order.sql');
  
  const migrationPath = path.join(__dirname, '../database/add-display-order.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');
  
  // Split by semicolon and filter out comments and empty statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--'));
  
  for (const statement of statements) {
    if (!statement) continue;
    
    console.log(`Executing: ${statement.substring(0, 50)}...`);
    
    const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
    
    if (error) {
      console.error('Error executing statement:', error);
      console.error('Statement:', statement);
      process.exit(1);
    }
  }
  
  console.log('Migration completed successfully!');
}

runMigration().catch(console.error);

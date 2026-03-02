import { createClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as readline from 'readline';

// Load environment variables
dotenv.config();

const SALT_ROUNDS = 10;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function createAdminUser() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env file');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Get username from user input
    const username = await question('Enter admin username: ');
    if (!username || username.trim().length === 0) {
      console.error('Error: Username cannot be empty');
      rl.close();
      process.exit(1);
    }

    // Check if username already exists
    const { data: existingUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('username', username.trim())
      .single();

    if (existingUser) {
      console.error(`Error: Username "${username}" already exists`);
      rl.close();
      process.exit(1);
    }

    // Get password from user input
    const password = await question('Enter admin password: ');
    if (!password || password.length < 6) {
      console.error('Error: Password must be at least 6 characters long');
      rl.close();
      process.exit(1);
    }

    // Hash password
    console.log('Hashing password...');
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert admin user
    console.log('Creating admin user...');
    const { data, error } = await supabase
      .from('admin_users')
      .insert([{ username: username.trim(), password_hash }])
      .select()
      .single();

    if (error) {
      console.error('Error creating admin user:', error.message);
      rl.close();
      process.exit(1);
    }

    console.log('\n✓ Admin user created successfully!');
    console.log(`  Username: ${data.username}`);
    console.log(`  ID: ${data.id}`);
    console.log(`  Created at: ${data.created_at}`);
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

createAdminUser();

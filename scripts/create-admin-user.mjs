// Script to create admin user in Supabase Auth
// Run this once: node scripts/create-admin-user.mjs

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read .env file manually
function loadEnv() {
  const envPath = join(__dirname, '..', '.env');
  const envContent = readFileSync(envPath, 'utf-8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  return env;
}

const env = loadEnv();
const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.error('❌ Missing Supabase environment variables in .env file');
  console.error('Make sure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function createAdminUser() {
  const email = 'keerthanaahv@gmail.com';
  const password = 'keerthanaa20';

  try {
    console.log('🔐 Creating admin user...');
    console.log(`   Email: ${email}`);
    
    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('already registered') || error.message.includes('User already registered')) {
        console.log('✅ User already exists in Supabase Auth');
        console.log('\n📝 You can now log in at: http://localhost:8080/admin');
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${password}`);
      } else {
        console.error('❌ Error:', error.message);
        throw error;
      }
    } else {
      console.log('✅ Admin user created successfully!');
      if (data.user) {
        console.log(`   User ID: ${data.user.id}`);
      }
      console.log('\n📝 You can now log in at: http://localhost:8080/admin');
      console.log(`   Email: ${email}`);
      console.log(`   Password: ${password}`);
      
      if (data.session) {
        console.log('\n✅ Session created - you are now logged in!');
      } else {
        console.log('\n⚠️  Note: You may need to verify your email if email confirmation is enabled.');
      }
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
}

createAdminUser();

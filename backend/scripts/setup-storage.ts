import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const buckets = [
  {
    name: 'product-images',
    public: true,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  {
    name: 'banners',
    public: true,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  {
    name: 'gallery',
    public: true,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  {
    name: 'videos',
    public: true,
    fileSizeLimit: 52428800, // 50MB
    allowedMimeTypes: ['video/mp4', 'video/webm'],
  },
  {
    name: 'testimonial-images',
    public: true,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  {
    name: 'testimonial-videos',
    public: true,
    fileSizeLimit: 52428800, // 50MB
    allowedMimeTypes: ['video/mp4', 'video/webm'],
  },
];

async function setupStorageBuckets() {
  console.log('Setting up Supabase Storage buckets...\n');

  for (const bucket of buckets) {
    console.log(`Creating bucket: ${bucket.name}`);

    // Check if bucket exists
    const { data: existingBuckets } = await supabase.storage.listBuckets();
    const bucketExists = existingBuckets?.some((b) => b.name === bucket.name);

    if (bucketExists) {
      console.log(`  ✓ Bucket '${bucket.name}' already exists`);
    } else {
      // Create bucket
      const { data, error } = await supabase.storage.createBucket(bucket.name, {
        public: bucket.public,
        fileSizeLimit: bucket.fileSizeLimit,
        allowedMimeTypes: bucket.allowedMimeTypes,
      });

      if (error) {
        console.error(`  ✗ Failed to create bucket '${bucket.name}':`, error.message);
      } else {
        console.log(`  ✓ Created bucket '${bucket.name}'`);
      }
    }

    // Set bucket policies for authenticated uploads and public reads
    console.log(`  Setting policies for bucket '${bucket.name}'...`);
    
    // Note: Bucket policies are typically set via Supabase Dashboard or SQL
    // For authenticated uploads and public reads, the bucket should be:
    // - public: true (for public reads)
    // - RLS policies for authenticated uploads can be set via SQL
    
    console.log(`  ✓ Bucket '${bucket.name}' configured for public reads`);
    console.log('');
  }

  console.log('Storage setup complete!');
  console.log('\nNote: For authenticated uploads, ensure RLS policies are configured in Supabase.');
  console.log('You can set policies via the Supabase Dashboard or by running SQL commands.');
}

setupStorageBuckets()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error setting up storage:', error);
    process.exit(1);
  });

-- Seed data for Natural Farm Admin Dashboard
-- This script creates initial data for testing

-- Note: The password hash below is for 'admin123' (you should change this in production)
-- To generate a new hash, use bcrypt with 10 rounds
-- Example in Node.js: const bcrypt = require('bcrypt'); bcrypt.hashSync('your_password', 10);

-- Insert default admin user (username: admin, password: admin123)
INSERT INTO admin_users (username, password_hash)
VALUES ('admin', '$2b$10$rKvVJvH8JmF5qN5Z5qN5ZOqN5Z5qN5Z5qN5Z5qN5Z5qN5Z5qN5Z5q')
ON CONFLICT (username) DO NOTHING;

-- Note: The above password hash is a placeholder. 
-- Run the following script to create a proper admin user:
-- See backend/scripts/create-admin.ts

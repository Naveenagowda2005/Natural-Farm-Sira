# Natural Farm Backend API

Backend API for the Natural Farm Admin Dashboard built with NestJS and Supabase.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account and project

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Edit the `.env` file and add your Supabase credentials:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key_here
```

### 3. Set Up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `database/schema.sql`
4. Execute the SQL script to create all tables

### 4. Create Admin User

Run the admin user creation script:

```bash
npm run build
node dist/scripts/create-admin.js [username] [password]
```

Example:
```bash
node dist/scripts/create-admin.js admin mySecurePassword123
```

If no arguments are provided, it will create a user with:
- Username: `admin`
- Password: `admin123`

**Important:** Change the default password after first login!

### 5. Start the Development Server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3001`

## Available Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:prod` - Start in production mode
- `npm run build` - Build the application
- `npm run test` - Run tests
- `npm run lint` - Lint the code

## Database Schema

The database includes the following tables:

- **admin_users** - Admin user accounts with hashed passwords
- **categories** - Product categories (bilingual: English & Kannada)
- **subcategories** - Product subcategories linked to categories
- **products** - Products with pricing, images, and visibility control
- **banners** - Homepage banner images with display order
- **gallery_images** - Gallery images for the website
- **videos** - Video content (URLs or uploaded files)
- **inquiries** - Customer contact form submissions

## API Endpoints

API endpoints will be documented as they are implemented in subsequent tasks.

## Project Structure

```
backend/
├── database/           # Database schema and seed files
│   ├── schema.sql     # Database schema
│   └── seed.sql       # Seed data
├── scripts/           # Utility scripts
│   └── create-admin.ts # Admin user creation script
├── src/
│   ├── supabase/      # Supabase client configuration
│   │   ├── supabase.module.ts
│   │   └── supabase.service.ts
│   ├── app.module.ts  # Main application module
│   └── main.ts        # Application entry point
├── .env.example       # Environment variables template
├── nest-cli.json      # NestJS CLI configuration
├── package.json       # Dependencies and scripts
└── tsconfig.json      # TypeScript configuration
```

## Security Notes

- Always use strong passwords for admin accounts
- Keep your `.env` file secure and never commit it to version control
- Use the `SUPABASE_SERVICE_ROLE_KEY` only on the backend (never expose it to the frontend)
- Implement proper authentication and authorization for all API endpoints
- Enable Row Level Security (RLS) in Supabase for additional security

## Next Steps

After completing this setup:

1. Implement authentication endpoints (login, logout, session management)
2. Create CRUD endpoints for categories, subcategories, and products
3. Implement file upload functionality for images and videos
4. Add inquiry management endpoints
5. Implement proper error handling and validation

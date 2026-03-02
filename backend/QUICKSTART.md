# Quick Start Guide

Get the Natural Farm backend API up and running in 5 minutes.

## Prerequisites

- Node.js v18+ installed
- A Supabase account (free tier works fine)

## Step-by-Step Setup

### 1. Install Dependencies (2 minutes)

```bash
cd backend
npm install
```

### 2. Set Up Supabase (2 minutes)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for provisioning to complete
3. Go to Project Settings → API
4. Copy your project URL and service_role key

### 3. Configure Environment (1 minute)

```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your Supabase credentials
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
# JWT_SECRET=any-random-string-here
```

### 4. Create Database Schema (1 minute)

1. Open your Supabase dashboard
2. Go to SQL Editor
3. Copy all content from `database/schema.sql`
4. Paste and click "Run"

### 5. Create Admin User (30 seconds)

```bash
npm run create:admin admin yourPassword123
```

### 6. Start the Server (10 seconds)

```bash
npm run start:dev
```

Visit http://localhost:3001 - you should see:
```json
{
  "message": "Natural Farm Backend API is running",
  "timestamp": "2024-01-..."
}
```

Visit http://localhost:3001/health to check database connection:
```json
{
  "status": "ok",
  "database": "connected"
}
```

## What's Next?

Your backend is ready! The next tasks will add:
- Authentication endpoints (login/logout)
- Category management APIs
- Product management APIs
- File upload for images
- And more...

## Troubleshooting

**"Cannot find module" errors**
- Run `npm install` again

**"Supabase URL must be provided" error**
- Check your `.env` file exists and has correct values
- Make sure you're using the SERVICE_ROLE_KEY, not the ANON_KEY

**Database connection fails**
- Verify your Supabase project is active
- Check the URL and key are correct
- Ensure you ran the schema.sql script

**Port 3001 already in use**
- Change PORT in `.env` file to another port like 3002

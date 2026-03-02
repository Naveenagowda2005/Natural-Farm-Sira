# Natural Farm Admin Dashboard - Deployment Guide

## 🎉 Project Status

**Backend**: ✅ Complete and Ready for Deployment
**Frontend**: ⚠️ Requires Implementation (Tasks 12-22)

## Backend Deployment

### Prerequisites

1. **Supabase Account** - Create a free account at [supabase.com](https://supabase.com)
2. **Node.js** - Version 18 or higher
3. **npm** or **yarn** - Package manager

### Step 1: Set Up Supabase

1. Create a new Supabase project
2. Wait for provisioning to complete (2-3 minutes)
3. Go to **Project Settings** → **API**
4. Copy your:
   - Project URL
   - Service Role Key (keep this secret!)

### Step 2: Create Database Schema

1. Open Supabase Dashboard → **SQL Editor**
2. Copy the contents of `backend/database/schema.sql`
3. Paste and click **Run**
4. Verify all tables are created in the **Table Editor**

### Step 3: Set Up Storage Buckets

1. Run the storage setup script:
   ```bash
   cd backend
   npm install
   npm run setup:storage
   ```

2. Or manually create buckets in Supabase Dashboard:
   - Go to **Storage** → **Create bucket**
   - Create: `product-images`, `banners`, `gallery`, `videos`
   - Set all buckets to **Public**

3. Apply storage policies:
   - Open **SQL Editor**
   - Copy contents of `backend/database/storage-policies.sql`
   - Run the script

### Step 4: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit `.env` with your values:
   ```env
   # Supabase Configuration
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   
   # JWT Configuration
   JWT_SECRET=your-random-secret-key-here
   JWT_EXPIRES_IN=24h
   
   # Server Configuration
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   ```

### Step 5: Create Admin User

```bash
cd backend
npm run create:admin
```

Follow the prompts to create your admin account.

### Step 6: Start the Backend

**Development:**
```bash
npm run start:dev
```

**Production:**
```bash
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3001`

### Step 7: Verify Backend

Test the health endpoint:
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "database": "connected"
}
```

Test login:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-password"}'
```

## Backend API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Subcategories
- `GET /api/subcategories` - List all subcategories
- `POST /api/subcategories` - Create subcategory
- `PUT /api/subcategories/:id` - Update subcategory
- `DELETE /api/subcategories/:id` - Delete subcategory

### Products
- `GET /api/products` - List products (with filters)
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `PATCH /api/products/:id/visibility` - Toggle visibility
- `POST /api/products/:id/image` - Upload product image

### Banners
- `GET /api/banners` - List banners
- `POST /api/banners` - Upload banner
- `DELETE /api/banners/:id` - Delete banner
- `PUT /api/banners/reorder` - Reorder banners

### Gallery
- `GET /api/gallery` - List gallery images
- `POST /api/gallery` - Upload images (multiple)
- `DELETE /api/gallery/:id` - Delete image
- `DELETE /api/gallery/bulk/delete` - Bulk delete

### Videos
- `GET /api/videos` - List videos
- `POST /api/videos` - Add video (URL or file)
- `PUT /api/videos/:id` - Update video title
- `DELETE /api/videos/:id` - Delete video

### Inquiries
- `POST /api/inquiries` - Create inquiry (public)
- `GET /api/inquiries` - List inquiries (admin)
- `GET /api/inquiries/:id` - Get inquiry details
- `PATCH /api/inquiries/:id/read` - Toggle read status

All endpoints except `POST /api/inquiries` require JWT authentication via `Authorization: Bearer <token>` header.

## Frontend Implementation (Remaining Work)

The frontend tasks (12-22) need to be implemented:

### Required Tasks:
1. **Admin Dashboard Structure** (Task 12)
   - Admin routing and layout
   - Authentication context and login page
   
2. **Category Management UI** (Task 13)
   - Category list and forms
   - API integration

3. **Subcategory Management UI** (Task 14)
   - Subcategory list and forms
   - API integration

4. **Product Management UI** (Task 16)
   - Product list and forms
   - Visibility toggle
   - Image upload UI
   - API integration

5. **Media Management UI** (Task 17)
   - Banner management interface
   - Gallery management interface
   - Video management interface
   - API integration

6. **Inquiry Management UI** (Task 18)
   - Inquiry list interface
   - Search and pagination
   - Read/unread toggle
   - API integration

7. **Integration** (Task 20)
   - Update routing configuration
   - Create public inquiry submission endpoint
   - Connect public website to admin-managed content

8. **Final Polish** (Task 21)
   - Environment configuration
   - Comprehensive error handling
   - Loading and success feedback

### Technology Stack for Frontend:
- React + TypeScript (already in use)
- React Router (for admin routes)
- Shadcn UI components (already installed)
- Axios or Fetch for API calls
- React Hook Form for form management
- React Query for data fetching (optional but recommended)

## Production Deployment

### Backend Deployment Options:

1. **Vercel** (Recommended for Node.js)
   - Connect your GitHub repository
   - Set environment variables in Vercel dashboard
   - Deploy automatically on push

2. **Railway**
   - Connect repository
   - Add environment variables
   - Deploy with one click

3. **Heroku**
   - Create Heroku app
   - Set config vars
   - Deploy via Git

4. **DigitalOcean App Platform**
   - Connect repository
   - Configure environment
   - Deploy

### Environment Variables for Production:
```env
SUPABASE_URL=your-production-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-production-key
JWT_SECRET=strong-random-secret
JWT_EXPIRES_IN=24h
PORT=3001
FRONTEND_URL=https://your-frontend-domain.com
NODE_ENV=production
```

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secret (32+ characters)
- [ ] Keep service role key secret (never expose to frontend)
- [ ] Enable HTTPS in production
- [ ] Set proper CORS origins
- [ ] Enable rate limiting (optional)
- [ ] Regular database backups
- [ ] Monitor error logs

## Testing

Run backend tests:
```bash
cd backend
npm test
```

All 23 tests should pass.

## Documentation

Comprehensive documentation is available in:
- `backend/README.md` - Backend overview
- `backend/QUICKSTART.md` - Quick setup guide
- `backend/STORAGE_SETUP.md` - Storage configuration
- `backend/ERROR_HANDLING_IMPLEMENTATION.md` - Error handling details
- Each module has its own README.md with API documentation

## Support

For issues or questions:
1. Check the module-specific README files
2. Review the error logs
3. Verify environment variables
4. Check Supabase dashboard for database/storage issues

## Next Steps

1. ✅ Backend is complete and tested
2. ⏳ Implement frontend tasks (12-22)
3. ⏳ Test end-to-end functionality
4. ⏳ Deploy to production

The backend is production-ready and waiting for the frontend implementation!

# Railway Backend Deployment Guide

## Current Status
- Railway URL: `https://natural-farm-backend.up.railway.app`
- Status: Application not found (deployment incomplete)

## Steps to Fix Railway Deployment

### 1. Check Railway Dashboard
Go to your Railway project dashboard and check:
- Build logs for any errors
- Deployment status
- Service status

### 2. Required Railway Settings

**Root Directory:**
```
backend
```

**Build Command:**
```
npm install && npm run build
```

**Start Command:**
```
npm run start:prod
```

**Watch Paths:**
```
backend/**
```

### 3. Required Environment Variables in Railway

Add these in Railway Settings → Variables:

```
NODE_ENV=production
PORT=3001
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret_key
```

### 4. Common Railway Issues & Solutions

**Issue: "Application not found"**
- Solution: Check if service is running in Railway dashboard
- Verify build completed successfully
- Check start command is correct

**Issue: "MODULE_NOT_FOUND"**
- Solution: Ensure root directory is set to `backend`
- Verify package.json has correct scripts
- Check build command creates dist folder

**Issue: Port binding errors**
- Solution: Railway automatically sets PORT variable
- Ensure your app listens on `process.env.PORT || 3001`

### 5. Verify Backend is Working

Once deployed, test these endpoints:

```bash
# Should return 401 Unauthorized (means backend is working)
curl https://natural-farm-backend.up.railway.app/api/categories

# Should return 404 Not Found (means backend is responding)
curl https://natural-farm-backend.up.railway.app/api
```

### 6. Update Netlify After Railway Works

Once Railway backend is confirmed working:

1. Go to Netlify Dashboard
2. Select your site: `beautiful-zuccutto-cab8a3`
3. Go to Site Settings → Environment Variables
4. Add or update:
   ```
   VITE_API_URL=https://natural-farm-backend.up.railway.app
   ```
5. Go to Deploys → Trigger Deploy → Clear cache and deploy site

## Alternative: Check Railway Logs

In Railway dashboard:
1. Click on your service
2. Go to "Deployments" tab
3. Click on latest deployment
4. Check "Build Logs" and "Deploy Logs" for errors

## Need Help?

If Railway continues to fail, consider:
1. Creating a separate backend repository (easier for Railway)
2. Using Render.com instead (has better monorepo support)
3. Using Vercel for backend deployment

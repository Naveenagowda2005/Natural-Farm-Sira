# 🚀 Netlify Deployment Guide for Natural Farm Sira

## Part 1: Deploy Backend (Railway - Free & Easy)

### Step 1: Deploy Backend to Railway

1. **Go to [Railway.app](https://railway.app)**
   - Sign up/Login with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `sira-agri-hub` repository
   - Select the `backend` folder as root directory

3. **Configure Backend**
   - Railway will auto-detect it's a Node.js app
   - Click on your service → Settings
   - Set **Root Directory**: `backend`
   - Set **Build Command**: `npm install && npm run build`
   - Set **Start Command**: `npm run start:prod`

4. **Add Environment Variables**
   - Go to Variables tab
   - Add these variables:
     ```
     SUPABASE_URL=your_supabase_url
     SUPABASE_KEY=your_supabase_anon_key
     JWT_SECRET=your_secret_key_here
     PORT=3001
     ```
   - Get Supabase URL and Key from your Supabase project settings

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy your backend URL (e.g., `https://your-app.railway.app`)

---

## Part 2: Deploy Frontend to Netlify

### Step 2: Prepare Frontend

1. **In Kiro Terminal, run:**
   ```bash
   npm run build
   ```
   - This creates the `dist` folder with your production build

### Step 3: Deploy to Netlify (Option A - Drag & Drop)

1. **Go to [Netlify.com](https://netlify.com)**
   - Sign up/Login

2. **Deploy via Drag & Drop**
   - Go to Sites
   - Drag and drop your `dist` folder to the upload area
   - Wait for deployment

3. **Configure Site**
   - Click on your site
   - Go to Site settings → Environment variables
   - Add variable:
     ```
     VITE_API_URL=https://your-backend-url.railway.app
     ```
   - Replace with your actual Railway backend URL

4. **Redeploy**
   - Go to Deploys
   - Click "Trigger deploy" → "Deploy site"

### Step 3: Deploy to Netlify (Option B - GitHub)

1. **Push to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub
   - Select your repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Show advanced" → "New variable"
   - Add: `VITE_API_URL` = `https://your-backend-url.railway.app`

4. **Deploy**
   - Click "Deploy site"
   - Wait for deployment

---

## Part 3: Post-Deployment Setup

### Step 4: Update CORS in Backend

Your backend needs to allow requests from your Netlify domain.

1. **In Railway Dashboard**
   - Go to your backend service
   - Add environment variable:
     ```
     FRONTEND_URL=https://your-site.netlify.app
     ```

2. **Update Backend Code** (if needed)
   - The backend should already have CORS enabled
   - If you get CORS errors, let me know

### Step 5: Test Your Deployment

1. **Visit your Netlify URL**
   - Test public pages (Home, Products, Gallery, Videos, Success Stories, Contact)

2. **Test Admin Dashboard**
   - Go to `/admin/login`
   - Login with your admin credentials
   - Test all admin features

3. **Test Features**
   - ✅ Product browsing
   - ✅ Contact form submission
   - ✅ Gallery images loading
   - ✅ Videos playing
   - ✅ Success stories displaying
   - ✅ Admin dashboard functionality

---

## 🎯 Quick Deployment Checklist

### Backend (Railway)
- [ ] Backend deployed to Railway
- [ ] Environment variables set (SUPABASE_URL, SUPABASE_KEY, JWT_SECRET)
- [ ] Backend URL copied

### Frontend (Netlify)
- [ ] `npm run build` completed successfully
- [ ] Deployed to Netlify
- [ ] VITE_API_URL environment variable set
- [ ] Site redeployed after adding env variable

### Testing
- [ ] Public pages working
- [ ] Admin login working
- [ ] API calls successful
- [ ] Images/videos loading
- [ ] Forms submitting

---

## 🔧 Troubleshooting

### Issue: API calls failing
**Solution:** Check that `VITE_API_URL` in Netlify matches your Railway backend URL exactly (no trailing slash)

### Issue: Images not loading
**Solution:** Verify Supabase storage buckets are public and URLs are correct

### Issue: Admin login not working
**Solution:** 
1. Check JWT_SECRET is set in Railway
2. Verify admin user exists in database
3. Check browser console for errors

### Issue: CORS errors
**Solution:** Add FRONTEND_URL environment variable in Railway with your Netlify URL

---

## 📱 Custom Domain (Optional)

### Add Custom Domain to Netlify
1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow instructions to update DNS records

### Add Custom Domain to Railway
1. Go to your service → Settings
2. Click "Generate Domain" or add custom domain
3. Update VITE_API_URL in Netlify with new domain

---

## 🎉 You're Live!

Your Natural Farm Sira application is now deployed and accessible worldwide!

**Frontend:** https://your-site.netlify.app
**Backend:** https://your-app.railway.app
**Admin:** https://your-site.netlify.app/admin

Share your site with customers and start managing your agricultural business online! 🌾

# Complete Deployment Guide - Natural Farm Sira

## Current Status
- ✅ Frontend: Deployed on Netlify at `https://beautiful-zuccutto-cab8a3.netlify.app`
- ⏳ Backend: Needs to be deployed on Railway at `https://natural-farm-backend.up.railway.app`
- ✅ Database: Supabase (already configured)
- ✅ Storage: Supabase Storage (already configured)

---

## Step 1: Deploy Backend on Railway

### A. Railway Project Setup

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository: `Natural-Farm-Sira`
4. Railway will auto-detect the configuration

### B. Configure Railway Service

**Important Settings:**

1. **Root Directory**: 
   ```
   backend
   ```

2. **Build Command** (if not auto-detected):
   ```
   npm install && npm run build
   ```

3. **Start Command** (if not auto-detected):
   ```
   npm run start:prod
   ```

### C. Add Environment Variables in Railway

Go to your Railway service → Variables tab and add:

```
NODE_ENV=production
SUPABASE_URL=<your_supabase_project_url>
SUPABASE_KEY=<your_supabase_anon_key>
JWT_SECRET=<any_random_secure_string>
```

**How to get Supabase credentials:**
1. Go to your Supabase project dashboard
2. Click Settings → API
3. Copy "Project URL" for `SUPABASE_URL`
4. Copy "anon public" key for `SUPABASE_KEY`

**Generate JWT_SECRET:**
You can use any random string, or generate one:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### D. Deploy and Verify

1. Railway will automatically deploy after you add environment variables
2. Wait for deployment to complete (check Deployments tab)
3. Once deployed, you'll get a URL like: `https://natural-farm-backend.up.railway.app`

### E. Test Backend

Test if backend is working:
```bash
curl https://natural-farm-backend.up.railway.app/api/categories
```

Expected response: `401 Unauthorized` (this means backend is working, just needs authentication)

---

## Step 2: Update Netlify Frontend

### A. Add Environment Variable

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site: `beautiful-zuccutto-cab8a3`
3. Go to **Site Settings** → **Environment Variables**
4. Click "Add a variable"
5. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://natural-farm-backend.up.railway.app`
6. Click "Save"

### B. Redeploy Frontend

1. Go to **Deploys** tab
2. Click "Trigger deploy" → "Clear cache and deploy site"
3. Wait for deployment to complete (2-3 minutes)

---

## Step 3: Verify Full Deployment

### Test the Complete Application

1. **Visit Frontend**: `https://beautiful-zuccutto-cab8a3.netlify.app`

2. **Test Public Pages**:
   - Home page should load
   - Products page should show products
   - Gallery should show images
   - Videos should display
   - Success Stories should load
   - Contact form should work

3. **Test Admin Dashboard**:
   - Go to: `https://beautiful-zuccutto-cab8a3.netlify.app/admin/login`
   - Login with your admin credentials
   - Test all admin features:
     - Categories
     - Subcategories
     - Products
     - Banners
     - Gallery
     - Videos
     - Testimonials
     - Inquiries (including "Clear All" button)

---

## Troubleshooting

### Backend Issues

**Problem: "Application not found" on Railway**
- Solution: Check Railway deployment logs for errors
- Verify root directory is set to `backend`
- Ensure all environment variables are set

**Problem: "MODULE_NOT_FOUND" error**
- Solution: Check build logs in Railway
- Verify `npm run build` creates `dist` folder
- Check `package.json` has correct scripts

**Problem: Backend responds but frontend can't connect**
- Solution: Verify CORS is configured in `backend/src/main.ts`
- Check Netlify URL is in CORS origins list
- Verify `VITE_API_URL` is set correctly in Netlify

### Frontend Issues

**Problem: "Network Error" or "Failed to fetch"**
- Solution: Check `VITE_API_URL` in Netlify environment variables
- Verify backend URL is correct and accessible
- Check browser console for CORS errors

**Problem: Images/Videos not loading**
- Solution: Verify Supabase storage buckets are public
- Check storage policies in Supabase dashboard
- Ensure `SUPABASE_URL` and `SUPABASE_KEY` are correct

---

## Railway Configuration Files

Your project now includes:

1. **backend/nixpacks.toml** - Nixpacks build configuration
2. **backend/Procfile** - Process file for Railway
3. **backend/railway.json** - Railway-specific settings

These files help Railway properly build and deploy your NestJS backend.

---

## Post-Deployment Checklist

- [ ] Backend deployed successfully on Railway
- [ ] Backend URL is accessible
- [ ] Environment variables set in Railway
- [ ] Frontend environment variable updated in Netlify
- [ ] Frontend redeployed with new backend URL
- [ ] Public pages working (Home, Products, Gallery, Videos, Success Stories, Contact)
- [ ] Admin login working
- [ ] All admin features functional
- [ ] Images and videos loading correctly
- [ ] Contact form submitting inquiries
- [ ] "Clear All" inquiries button working

---

## Support

If you encounter issues:

1. Check Railway deployment logs
2. Check Netlify deployment logs
3. Check browser console for errors
4. Verify all environment variables are set correctly
5. Test backend endpoints directly using curl or Postman

---

## URLs Summary

- **Frontend**: https://beautiful-zuccutto-cab8a3.netlify.app
- **Backend**: https://natural-farm-backend.up.railway.app
- **Admin Login**: https://beautiful-zuccutto-cab8a3.netlify.app/admin/login
- **GitHub Repo**: https://github.com/Naveenagowda2005/Natural-Farm-Sira

---

## Next Steps After Deployment

1. Test all features thoroughly
2. Add your actual products, images, and content
3. Share the website URL with your client
4. Monitor Railway and Netlify dashboards for any issues
5. Consider setting up a custom domain (optional)

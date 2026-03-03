# How to Add Environment Variables in Netlify

## Step-by-Step Guide

### Step 1: Go to Netlify Dashboard
1. Open your browser and go to: https://app.netlify.com
2. Log in to your account
3. You should see your site: `beautiful-zuccutto-cab8a3`

### Step 2: Access Site Settings
1. Click on your site name: `beautiful-zuccutto-cab8a3`
2. Look at the top navigation menu
3. Click on **"Site configuration"** or **"Site settings"** button

### Step 3: Find Environment Variables
In the left sidebar menu, look for one of these options:
- **"Environment variables"** (newer Netlify UI)
- **"Build & deploy"** → then **"Environment"** (older Netlify UI)
- **"Environment"** (direct link)

### Step 4: Add New Environment Variable

#### Option A: If you see "Add a variable" button
1. Click **"Add a variable"** or **"Add environment variable"**
2. You'll see two fields:
   - **Key**: Enter `VITE_API_URL`
   - **Value**: Enter `https://natural-farm-sira-1.onrender.com`
3. Click **"Save"** or **"Create variable"**

#### Option B: If you see "Edit variables" button
1. Click **"Edit variables"**
2. Click **"New variable"**
3. Enter:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://natural-farm-sira-1.onrender.com`
4. Click **"Save"**

### Step 5: Redeploy Your Site

After adding the environment variable:

1. Go to **"Deploys"** tab (top navigation)
2. Click **"Trigger deploy"** button (top right)
3. Select **"Clear cache and deploy site"**
4. Wait 2-3 minutes for deployment to complete

---

## Alternative Method: Using Netlify CLI

If you prefer command line:

```bash
# Install Netlify CLI (if not installed)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link to your site
netlify link

# Set environment variable
netlify env:set VITE_API_URL https://natural-farm-sira-1.onrender.com

# Trigger new deployment
netlify deploy --prod
```

---

## Verify Environment Variable is Set

After deployment completes:

1. Go to **Site configuration** → **Environment variables**
2. You should see:
   - `VITE_API_URL` = `https://natural-farm-sira-1.onrender.com`

---

## Test Your Deployed Site

Once redeployed, visit:
- **Frontend**: https://beautiful-zuccutto-cab8a3.netlify.app
- **Admin**: https://beautiful-zuccutto-cab8a3.netlify.app/admin/login

The site should now connect to your Render backend!

---

## Troubleshooting

### Can't find "Environment variables" option?
- Try looking under: **Site configuration** → **Environment variables**
- Or: **Build & deploy** → **Environment**
- Make sure you're on the correct site

### Environment variable not working?
- Make sure the key is exactly: `VITE_API_URL` (case-sensitive)
- Make sure the value is: `https://natural-farm-sira-1.onrender.com` (no trailing slash)
- Redeploy the site after adding the variable

### Still having issues?
- Check browser console for errors
- Verify backend is running: https://natural-farm-sira-1.onrender.com/api/categories
- Should return 401 Unauthorized (this is correct!)

---

## Your Deployment URLs

- **Backend (Render)**: https://natural-farm-sira-1.onrender.com
- **Frontend (Netlify)**: https://beautiful-zuccutto-cab8a3.netlify.app
- **Admin Login**: https://beautiful-zuccutto-cab8a3.netlify.app/admin/login
- **GitHub Repo**: https://github.com/Naveenagowda2005/Natural-Farm-Sira

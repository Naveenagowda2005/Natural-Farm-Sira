# Custom Domain Setup Guide - naturalfarmsira.com

## Overview
You have purchased `naturalfarmsira.com` from GoDaddy and want to connect it to your Netlify site.

---

## Part 1: Deploy Frontend to Netlify (if not done)

### Step 1: Create New Netlify Site
1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **GitHub** → Choose **"Natural-Farm-Sira"** repository
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Add environment variable:
     - Key: `VITE_API_URL`
     - Value: `https://natural-farm-sira-1.onrender.com`
5. Click **"Deploy site"**

---

## Part 2: Add Custom Domain to Netlify

### Step 1: Add Domain in Netlify
1. Go to your Netlify site dashboard
2. Click **"Domain management"** (or "Domain settings") in left sidebar
3. Click **"Add custom domain"** or **"Add domain"**
4. Enter: `naturalfarmsira.com`
5. Click **"Verify"**
6. Netlify will show you DNS records to configure

### Step 2: Note Down DNS Records
Netlify will provide these records (example values):

**For Root Domain (naturalfarmsira.com):**
- Type: `A`
- Name: `@` or leave blank
- Value: `75.2.60.5` (Netlify's IP - actual value shown in Netlify)

**For WWW Subdomain (www.naturalfarmsira.com):**
- Type: `CNAME`
- Name: `www`
- Value: `your-site-name.netlify.app`

**Alternative (Recommended):**
- Type: `CNAME`
- Name: `@` or leave blank
- Value: `your-site-name.netlify.app`

---

## Part 3: Configure DNS in GoDaddy

### Step 1: Login to GoDaddy
1. Go to https://www.godaddy.com
2. Login to your account
3. Go to **"My Products"**
4. Find `naturalfarmsira.com` and click **"DNS"** or **"Manage DNS"**

### Step 2: Add/Update DNS Records

#### Option A: Using A Record (Traditional)

1. **Add A Record for Root Domain:**
   - Type: `A`
   - Name: `@`
   - Value: `75.2.60.5` (use the IP Netlify provides)
   - TTL: `600` seconds (or default)

2. **Add CNAME for WWW:**
   - Type: `CNAME`
   - Name: `www`
   - Value: `your-site-name.netlify.app`
   - TTL: `600` seconds

#### Option B: Using CNAME (Recommended - if GoDaddy supports CNAME flattening)

1. **Add CNAME for Root:**
   - Type: `CNAME`
   - Name: `@`
   - Value: `your-site-name.netlify.app`
   - TTL: `600` seconds

2. **Add CNAME for WWW:**
   - Type: `CNAME`
   - Name: `www`
   - Value: `your-site-name.netlify.app`
   - TTL: `600` seconds

### Step 3: Remove Conflicting Records
- Delete any existing `A` records pointing to other IPs
- Delete any existing `CNAME` records for `@` or `www`
- Keep only the new records you just added

### Step 4: Save Changes
- Click **"Save"** or **"Save DNS"** in GoDaddy

---

## Part 4: Verify Domain in Netlify

### Step 1: Wait for DNS Propagation
- DNS changes can take 5 minutes to 48 hours
- Usually takes 15-30 minutes
- Check status at: https://www.whatsmydns.net/#A/naturalfarmsira.com

### Step 2: Enable HTTPS in Netlify
1. Go back to Netlify → **Domain management**
2. Once domain is verified, click **"Verify DNS configuration"**
3. Netlify will automatically provision SSL certificate
4. Wait 5-10 minutes for SSL to activate
5. Your site will be accessible via HTTPS

---

## Part 5: Update Backend CORS

Once your custom domain is working, update backend to allow it:

### In backend/src/main.ts:
```typescript
app.enableCors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://naturalfarmsira.com',
    'https://www.naturalfarmsira.com',
    'https://naturalfarmsiraa.netlify.app'
  ],
  credentials: true,
});
```

Then:
1. Commit and push changes
2. Render will auto-deploy
3. Wait 2-3 minutes

---

## Part 6: Test Your Custom Domain

After DNS propagation and SSL activation:

### Test URLs:
- **Main site**: https://naturalfarmsira.com
- **WWW**: https://www.naturalfarmsira.com
- **Admin**: https://naturalfarmsira.com/admin/login
- **Products**: https://naturalfarmsira.com/products
- **Gallery**: https://naturalfarmsira.com/gallery
- **Videos**: https://naturalfarmsira.com/videos
- **Success Stories**: https://naturalfarmsira.com/success-stories
- **Contact**: https://naturalfarmsira.com/contact

---

## Troubleshooting

### Domain not working after 1 hour?
1. Check DNS records in GoDaddy are correct
2. Use https://www.whatsmydns.net to check propagation
3. Clear browser cache or try incognito mode
4. Check Netlify domain settings for any errors

### SSL Certificate not activating?
1. Make sure DNS is fully propagated
2. In Netlify, go to Domain management → HTTPS
3. Click "Verify DNS configuration"
4. If still failing, try "Renew certificate"

### CORS errors on custom domain?
1. Make sure backend CORS includes your custom domain
2. Redeploy backend on Render
3. Clear browser cache

---

## Final Deployment Summary

After completing all steps:

- ✅ **Custom Domain**: https://naturalfarmsira.com
- ✅ **Backend**: https://natural-farm-sira-1.onrender.com
- ✅ **Database**: Supabase
- ✅ **Storage**: Supabase Storage
- ✅ **SSL**: Automatic via Netlify
- ✅ **GitHub**: https://github.com/Naveenagowda2005/Natural-Farm-Sira

---

## Quick Reference: GoDaddy DNS Settings

```
Type    Name    Value                           TTL
A       @       75.2.60.5 (Netlify IP)         600
CNAME   www     your-site-name.netlify.app     600
```

Or if using CNAME for root:
```
Type    Name    Value                           TTL
CNAME   @       your-site-name.netlify.app     600
CNAME   www     your-site-name.netlify.app     600
```

---

## Need Help?

- Netlify DNS docs: https://docs.netlify.com/domains-https/custom-domains/
- GoDaddy DNS help: https://www.godaddy.com/help/manage-dns-records-680
- Check DNS propagation: https://www.whatsmydns.net

# Video Display Troubleshooting Guide

## Issue
Videos uploaded in admin dashboard are not showing on the public Videos page.

## Quick Checks

### 1. Verify You're on the Correct Page

- **Admin Videos Page**: `http://localhost:8080/admin/videos` (requires login)
- **Public Videos Page**: `http://localhost:8080/videos` (no login required)

Make sure you're checking the **public page** at `/videos`, not the admin page.

### 2. Check API Response

Open your browser console (F12) and run:

```javascript
fetch('http://localhost:3001/api/videos/public')
  .then(r => r.json())
  .then(data => console.log('Videos:', data));
```

You should see an array of videos with this structure:
```json
[
  {
    "id": "uuid",
    "title": "Video Title",
    "video_url": "https://youtu.be/...",
    "video_file_url": null,
    "video_type": "url",
    "created_at": "2026-02-28T..."
  }
]
```

### 3. Clear Browser Cache

The frontend might be showing cached content:

1. **Hard Refresh**: Press `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
2. **Clear Cache**:
   - Open DevTools (F12)
   - Right-click the refresh button
   - Select "Empty Cache and Hard Reload"

### 4. Check Browser Console for Errors

1. Open the public Videos page: `http://localhost:8080/videos`
2. Open DevTools (F12) → Console tab
3. Look for any red error messages
4. Common errors:
   - CORS errors
   - Network errors
   - 404 Not Found

### 5. Verify Backend is Running

```bash
curl http://localhost:3001/api/videos/public
```

Should return JSON array of videos.

### 6. Check Network Tab

1. Open DevTools (F12) → Network tab
2. Refresh the Videos page
3. Look for the request to `/api/videos/public`
4. Check:
   - Status code (should be 200)
   - Response data (should contain your videos)

## Common Issues and Solutions

### Issue: "Videos Coming Soon!" Message Displayed

**Cause**: The API returned an empty array `[]`

**Solutions**:
1. Verify videos exist in database (check admin dashboard)
2. Check backend logs for errors
3. Verify Supabase connection

### Issue: Videos Show in Admin but Not Public Page

**Cause**: You might be looking at the wrong page

**Solution**: 
- Admin page: `http://localhost:8080/admin/videos`
- Public page: `http://localhost:8080/videos` ← Check this one!

### Issue: CORS Error in Console

**Cause**: Backend CORS not configured for frontend URL

**Solution**:
1. Check `backend/.env` has `FRONTEND_URL=http://localhost:8080`
2. Restart backend server
3. Clear browser cache

### Issue: Network Error / Failed to Fetch

**Cause**: Backend not running or wrong API URL

**Solutions**:
1. Verify backend is running: `curl http://localhost:3001/health`
2. Check `.env` file has `VITE_API_URL=http://localhost:3001`
3. Restart frontend if you changed `.env`

### Issue: Videos Not Rendering Properly

**Cause**: Missing `video_type` field in database

**Solution**: The recent fix added `video_type` to the create mutation. For existing videos:

```sql
-- Run this in Supabase SQL Editor to fix existing videos
UPDATE videos 
SET video_type = CASE 
  WHEN video_url IS NOT NULL THEN 'url'
  WHEN video_file_url IS NOT NULL THEN 'file'
  ELSE 'url'
END
WHERE video_type IS NULL;
```

## Step-by-Step Verification

1. **Open public Videos page**: `http://localhost:8080/videos`
2. **Open DevTools**: Press F12
3. **Go to Console tab**: Check for errors
4. **Go to Network tab**: Look for `/api/videos/public` request
5. **Check Response**: Should show your videos

## Testing the Fix

1. **Clear browser cache** (Ctrl + Shift + R)
2. **Navigate to**: `http://localhost:8080/videos`
3. **You should see**:
   - Loading spinner briefly
   - Then your uploaded videos in a grid
   - Each video with thumbnail and title

## If Videos Still Don't Show

1. **Check database directly** in Supabase:
   - Go to Supabase Dashboard
   - Table Editor → videos table
   - Verify your videos are there
   - Check `video_type` column has values ('url' or 'file')

2. **Check backend logs**:
   - Look at the terminal where backend is running
   - Check for any errors when accessing `/api/videos/public`

3. **Restart both servers**:
   ```bash
   # Backend
   cd backend
   npm run start:dev
   
   # Frontend (in another terminal)
   npm run dev
   ```

4. **Try incognito/private browsing**:
   - This ensures no cache issues
   - Open `http://localhost:8080/videos` in incognito mode

## Expected Behavior

### Public Videos Page (`/videos`)
- Shows all videos from database
- No authentication required
- Displays YouTube/Vimeo embeds for URL videos
- Displays video player for uploaded files
- Shows "Videos Coming Soon!" if no videos exist

### Admin Videos Page (`/admin/videos`)
- Requires login
- Shows all videos with edit/delete buttons
- Has "Add Video" button
- Can upload new videos

---

**Most Common Solution**: Hard refresh the browser with `Ctrl + Shift + R` while on the public Videos page (`/videos`).

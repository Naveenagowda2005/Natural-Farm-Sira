# Frontend Troubleshooting Guide

## Issue: Categories Not Showing After Creation

### ✅ Fixed Issues

1. **Wrong API Port in api.ts**
   - **Problem**: The API client was using port 3000 as fallback instead of 3001
   - **Fixed**: Changed `API_BASE_URL` fallback from `http://localhost:3000` to `http://localhost:3001`
   - **File**: `src/lib/api.ts`

### How to Verify the Fix

1. **Clear Browser Cache and Reload**
   - Press `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
   - This forces a hard reload and clears cached JavaScript

2. **Check Browser Console**
   - Open Developer Tools (F12)
   - Go to Console tab
   - Look for any errors related to API calls
   - Network tab should show requests to `http://localhost:3001/api/categories`

3. **Verify Token is Stored**
   - Open Developer Tools (F12)
   - Go to Application tab → Local Storage
   - Check that `admin_token` exists and has a value

4. **Test the API Directly**
   ```bash
   # Get your token from localStorage in browser console
   # Then test the endpoint
   curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3001/api/categories
   ```

### Common Issues and Solutions

#### 1. Categories Still Not Showing

**Possible Causes:**
- Browser cache not cleared
- Old token expired (tokens expire after 24 hours)
- React Query cache needs to be invalidated

**Solutions:**
1. **Hard refresh the page**: `Ctrl + Shift + R`
2. **Logout and login again** to get a fresh token
3. **Clear browser cache completely**:
   - Chrome: Settings → Privacy → Clear browsing data
   - Select "Cached images and files"
   - Click "Clear data"

#### 2. "Unauthorized" or 401 Errors

**Cause**: Token expired or invalid

**Solution:**
1. Logout from admin panel
2. Login again with credentials:
   - Username: `adminnaturalfarmsira`
   - Password: `Admin@123456`

#### 3. Network Errors

**Cause**: Backend not running or wrong URL

**Solution:**
1. Verify backend is running: http://localhost:3001/health
2. Check `.env` file has correct `VITE_API_URL=http://localhost:3001`
3. Restart frontend dev server if you changed `.env`

#### 4. CORS Errors

**Cause**: Backend CORS not configured for frontend URL

**Solution:**
1. Check `backend/.env` has `FRONTEND_URL=http://localhost:8080`
2. Restart backend server
3. Backend `main.ts` should have CORS enabled for this URL

### Testing Checklist

After the fix, test these scenarios:

- [ ] Login works correctly
- [ ] Can see existing categories
- [ ] Can create new category
- [ ] New category appears immediately after creation
- [ ] Can edit existing category
- [ ] Can delete category (without subcategories)
- [ ] Success/error toasts appear correctly

### React Query Cache Behavior

The Categories page uses React Query which:
- Caches data automatically
- Invalidates cache after mutations (create/update/delete)
- Refetches data when cache is invalidated

If categories aren't showing after creation:
1. Check browser console for errors
2. Verify the `createMutation.onSuccess` is calling `queryClient.invalidateQueries`
3. Check Network tab to see if refetch request is made

### Debug Mode

To see what's happening, add console logs:

```typescript
// In Categories.tsx, add to useQuery
const { data: categories = [], isLoading } = useQuery({
  queryKey: ['categories'],
  queryFn: async () => {
    console.log('Fetching categories...');
    const result = await categoriesApi.getAll();
    console.log('Categories fetched:', result);
    return result;
  },
});
```

### Backend Verification

Verify categories exist in Supabase:
1. Go to Supabase Dashboard
2. Navigate to Table Editor
3. Open `categories` table
4. Check if your created categories are there

If categories are in Supabase but not showing in frontend:
- It's a frontend/API issue
- Check token, API URL, and network requests

If categories are NOT in Supabase:
- It's a backend issue
- Check backend logs for errors
- Verify database connection

### Quick Fix Commands

```bash
# Restart frontend (if .env changed)
# Stop the current process and run:
npm run dev

# Restart backend (if needed)
cd backend
npm run start:dev

# Test backend health
curl http://localhost:3001/health

# Test categories endpoint (replace TOKEN)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3001/api/categories
```

### Environment Variables

Ensure these are set correctly:

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:3001
```

**Backend `backend/.env`:**
```env
PORT=3001
FRONTEND_URL=http://localhost:8080
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
```

## Summary

The main issue was the wrong API port in the fallback URL. After fixing this:
1. Hard refresh your browser (`Ctrl + Shift + R`)
2. Logout and login again if needed
3. Try creating a new category
4. It should now appear immediately in the list

If issues persist, check the browser console and network tab for specific error messages.

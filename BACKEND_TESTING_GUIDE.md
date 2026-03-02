# Backend Testing Guide

Quick guide to test the Natural Farm Admin Dashboard backend API.

## Prerequisites

- Supabase project created
- Database schema applied
- Storage buckets created
- Environment variables configured
- Admin user created

## Start the Backend

```bash
cd backend
npm install
npm run start:dev
```

Server should start at `http://localhost:3001`

## Test Endpoints

### 1. Health Check

```bash
curl http://localhost:3001/health
```

Expected: `{"status":"ok","database":"connected"}`

### 2. Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-password"}'
```

Save the `access_token` from the response.

### 3. Create Category

```bash
curl -X POST http://localhost:3001/api/categories \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"name_en":"Vegetables","name_kn":"ತರಕಾರಿಗಳು"}'
```

### 4. List Categories

```bash
curl http://localhost:3001/api/categories \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Create Subcategory

```bash
curl -X POST http://localhost:3001/api/subcategories \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"category_id":"CATEGORY_ID_HERE","name_en":"Organic Rice","name_kn":"ಸಾವಯವ ಅಕ್ಕಿ"}'
```

### 6. Create Product

```bash
curl -X POST http://localhost:3001/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"subcategory_id":"SUBCATEGORY_ID_HERE","name_en":"Basmati Rice","name_kn":"ಬಾಸ್ಮತಿ ಅಕ್ಕಿ","price":80.00,"mrp":100.00,"is_visible":true}'
```

### 7. Upload Product Image

```bash
curl -X POST http://localhost:3001/api/products/PRODUCT_ID_HERE/image \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "image=@/path/to/image.jpg"
```

### 8. Upload Banner

```bash
curl -X POST http://localhost:3001/api/banners \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@/path/to/banner.jpg"
```

### 9. Upload Gallery Images

```bash
curl -X POST http://localhost:3001/api/gallery \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "files=@/path/to/image1.jpg" \
  -F "files=@/path/to/image2.jpg"
```

### 10. Create Inquiry (Public)

```bash
curl -X POST http://localhost:3001/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{"customer_name":"John Doe","phone_number":"1234567890","message":"Test inquiry"}'
```

### 11. List Inquiries

```bash
curl "http://localhost:3001/api/inquiries?page=1&limit=50" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Run Tests

```bash
cd backend
npm test
```

All 23 tests should pass.

## Common Issues

### "Unauthorized" Error
- Check that your JWT token is valid
- Token expires after 24 hours by default
- Login again to get a new token

### "Database error"
- Verify Supabase connection
- Check that schema.sql was applied
- Verify environment variables

### "File upload failed"
- Check that storage buckets exist
- Verify storage policies are applied
- Check file size and format

### "Category/Subcategory not found"
- Create categories before subcategories
- Create subcategories before products
- Use correct UUIDs from previous responses

## Postman Collection

For easier testing, you can import these endpoints into Postman:

1. Create a new collection
2. Add environment variables:
   - `base_url`: `http://localhost:3001`
   - `token`: Your JWT token
3. Add requests with `{{base_url}}` and `{{token}}`

## Next Steps

Once backend testing is complete:
1. Implement frontend UI (Tasks 12-22)
2. Integrate frontend with backend APIs
3. Test end-to-end functionality
4. Deploy to production

The backend is fully functional and ready for frontend integration!

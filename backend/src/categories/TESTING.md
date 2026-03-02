# Testing Categories Module

## Prerequisites

1. Ensure the backend server is running: `npm run start:dev`
2. Have a valid JWT token from the `/auth/login` endpoint
3. Database schema is set up with the categories table

## Manual Testing with cURL

### 1. Login to get JWT token

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your_password"}'
```

Save the `access_token` from the response.

### 2. Create a Category

```bash
curl -X POST http://localhost:3001/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name_en": "Vegetables",
    "name_kn": "ತರಕಾರಿಗಳು"
  }'
```

**Expected:** 201 Created with category object

### 3. Test Validation - Missing Kannada Name

```bash
curl -X POST http://localhost:3001/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name_en": "Fruits"
  }'
```

**Expected:** 400 Bad Request with validation error

### 4. Test Validation - Empty English Name

```bash
curl -X POST http://localhost:3001/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name_en": "",
    "name_kn": "ಹಣ್ಣುಗಳು"
  }'
```

**Expected:** 400 Bad Request with validation error

### 5. List All Categories

```bash
curl -X GET http://localhost:3001/api/categories \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected:** 200 OK with array of categories

### 6. Get Single Category

```bash
curl -X GET http://localhost:3001/api/categories/CATEGORY_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected:** 200 OK with category object

### 7. Update Category

```bash
curl -X PUT http://localhost:3001/api/categories/CATEGORY_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name_en": "Fresh Vegetables",
    "name_kn": "ತಾಜಾ ತರಕಾರಿಗಳು"
  }'
```

**Expected:** 200 OK with updated category

### 8. Delete Category (without subcategories)

```bash
curl -X DELETE http://localhost:3001/api/categories/CATEGORY_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected:** 204 No Content

### 9. Test Delete Prevention (with subcategories)

First, create a subcategory linked to a category, then try to delete the category:

```bash
curl -X DELETE http://localhost:3001/api/categories/CATEGORY_WITH_SUBCATEGORIES_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected:** 400 Bad Request with error message "Cannot delete category with existing subcategories"

### 10. Test Authentication

Try accessing without JWT token:

```bash
curl -X GET http://localhost:3001/api/categories
```

**Expected:** 401 Unauthorized

## Testing Checklist

- [x] Create category with valid bilingual data
- [x] Validation error for missing English name
- [x] Validation error for missing Kannada name
- [x] Validation error for empty fields
- [x] List all categories
- [x] Get single category by ID
- [x] Update category
- [x] Delete category without subcategories
- [x] Prevent deletion when subcategories exist
- [x] Authentication required for all endpoints

## Requirements Coverage

This module satisfies the following requirements:

- **2.1**: Display list of categories with bilingual names
- **2.2**: Add category form accepting English and Kannada names
- **2.3**: Validate both language fields are non-empty
- **2.4**: Edit category with pre-populated form
- **2.5**: Save category updates
- **2.6**: Delete category with confirmation
- **2.7**: Prevent deletion when subcategories exist
- **2.8**: Remove category from database on confirmed deletion
- **2.9**: Assign unique identifier (UUID) to each category
- **15.5**: Bilingual content validation

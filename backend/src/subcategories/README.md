# SubCategories Module

This module handles subcategory management for the Natural Farm admin dashboard.

## Features

- Create subcategories with bilingual names (English and Kannada)
- List all subcategories (grouped by category)
- Update subcategory information including parent category
- Delete subcategories (with product validation)
- Parent category validation on create/update
- Foreign key relationship to categories table

## API Endpoints

All endpoints require JWT authentication via the `Authorization: Bearer <token>` header.

### POST /api/subcategories
Create a new subcategory.

**Request Body:**
```json
{
  "category_id": "uuid",
  "name_en": "Organic Rice",
  "name_kn": "ಸಾವಯವ ಅಕ್ಕಿ"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "category_id": "uuid",
  "name_en": "Organic Rice",
  "name_kn": "ಸಾವಯವ ಅಕ್ಕಿ",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Validation:**
- All fields are required
- `category_id` must be a valid UUID of an existing category
- `name_en` and `name_kn` must be non-empty strings

**Error Responses:**
- `400 Bad Request` - Validation failed or parent category does not exist
- `401 Unauthorized` - Missing or invalid JWT token

### GET /api/subcategories
Get all subcategories, ordered by category and creation date.

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "category_id": "uuid",
    "name_en": "Organic Rice",
    "name_kn": "ಸಾವಯವ ಅಕ್ಕಿ",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

### GET /api/subcategories/:id
Get a specific subcategory by ID.

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "category_id": "uuid",
  "name_en": "Organic Rice",
  "name_kn": "ಸಾವಯವ ಅಕ್ಕಿ",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Error Responses:**
- `404 Not Found` - SubCategory with specified ID does not exist

### PUT /api/subcategories/:id
Update a subcategory.

**Request Body:**
```json
{
  "category_id": "uuid",
  "name_en": "Premium Organic Rice",
  "name_kn": "ಪ್ರೀಮಿಯಂ ಸಾವಯವ ಅಕ್ಕಿ"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "category_id": "uuid",
  "name_en": "Premium Organic Rice",
  "name_kn": "ಪ್ರೀಮಿಯಂ ಸಾವಯವ ಅಕ್ಕಿ",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Validation:**
- All fields are optional
- If `category_id` is provided, it must be a valid UUID of an existing category

**Error Responses:**
- `400 Bad Request` - Validation failed or parent category does not exist
- `404 Not Found` - SubCategory with specified ID does not exist

### DELETE /api/subcategories/:id
Delete a subcategory.

**Response:** `204 No Content`

**Error Responses:**
- `400 Bad Request` - Cannot delete subcategory with existing products
- `404 Not Found` - SubCategory with specified ID does not exist

## Database Schema

```sql
CREATE TABLE subcategories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    name_en VARCHAR(255) NOT NULL,
    name_kn VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subcategories_category_id ON subcategories(category_id);
```

## Business Rules

1. **Parent Category Validation**: When creating or updating a subcategory, the parent category must exist
2. **Deletion Protection**: A subcategory cannot be deleted if it has associated products
3. **Bilingual Support**: Both English and Kannada names are required for all subcategories
4. **Foreign Key Constraint**: The `category_id` field has a foreign key constraint with `ON DELETE RESTRICT` to prevent deletion of categories with subcategories

## Requirements Mapping

This module implements the following requirements:
- 3.1: Display subcategories grouped by parent category
- 3.2: Add subcategory form with parent category selection
- 3.3: Validate all fields are non-empty
- 3.4: Edit subcategory with pre-populated values
- 3.5: Save subcategory updates
- 3.6: Delete subcategory with confirmation
- 3.7: Prevent deletion when products exist
- 3.8: Remove subcategory from database
- 3.9: Assign unique identifier to each subcategory
- 15.5: Store bilingual content in separate fields

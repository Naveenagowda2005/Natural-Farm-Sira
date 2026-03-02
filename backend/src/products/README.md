# Products Module

This module handles product management for the Natural Farm admin dashboard.

## Features

- Create products with bilingual names (English and Kannada)
- Update product information
- Delete products
- List products with optional filtering
- Price and MRP validation
- Visibility control (is_visible flag)
- Subcategory association

## Endpoints

All endpoints require JWT authentication via the `Authorization: Bearer <token>` header.

### POST /api/products
Create a new product.

**Request Body:**
```json
{
  "subcategory_id": "uuid",
  "name_en": "Product Name",
  "name_kn": "ಉತ್ಪನ್ನದ ಹೆಸರು",
  "description": "Product description text",
  "price": 100.50,
  "mrp": 120.00,
  "image_url": "https://example.com/image.jpg",
  "is_visible": true
}
```

**Notes:**
- `subcategory_id`, `name_en`, `name_kn`, and `price` are required
- `description`, `mrp`, `image_url`, and `is_visible` are optional
- `is_visible` defaults to `true` if not provided
- `price` and `mrp` must be positive numbers
- Validates that the subcategory exists

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "subcategory_id": "uuid",
  "name_en": "Product Name",
  "name_kn": "ಉತ್ಪನ್ನದ ಹೆಸರು",
  "description": "Product description text",
  "price": 100.50,
  "mrp": 120.00,
  "image_url": "https://example.com/image.jpg",
  "is_visible": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### GET /api/products
List all products with optional filtering.

**Query Parameters:**
- `subcategory_id` (optional): Filter by subcategory UUID
- `is_visible` (optional): Filter by visibility status (`true` or `false`)

**Examples:**
- `/api/products` - Get all products
- `/api/products?subcategory_id=uuid` - Get products in a specific subcategory
- `/api/products?is_visible=true` - Get only visible products
- `/api/products?subcategory_id=uuid&is_visible=true` - Combine filters

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "subcategory_id": "uuid",
    "name_en": "Product Name",
    "name_kn": "ಉತ್ಪನ್ನದ ಹೆಸರು",
    "description": "Product description text",
    "price": 100.50,
    "mrp": 120.00,
    "image_url": "https://example.com/image.jpg",
    "is_visible": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

### GET /api/products/:id
Get a single product by ID.

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "subcategory_id": "uuid",
  "name_en": "Product Name",
  "name_kn": "ಉತ್ಪನ್ನದ ಹೆಸರು",
  "description": "Product description text",
  "price": 100.50,
  "mrp": 120.00,
  "image_url": "https://example.com/image.jpg",
  "is_visible": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Error Response:** `404 Not Found`
```json
{
  "statusCode": 404,
  "message": "Product with ID {id} not found"
}
```

### PUT /api/products/:id
Update a product.

**Request Body:** (all fields optional)
```json
{
  "subcategory_id": "uuid",
  "name_en": "Updated Name",
  "name_kn": "ನವೀಕರಿಸಿದ ಹೆಸರು",
  "description": "Updated description",
  "price": 110.00,
  "mrp": 130.00,
  "image_url": "https://example.com/new-image.jpg",
  "is_visible": false
}
```

**Notes:**
- All fields are optional
- If `subcategory_id` is provided, validates that the subcategory exists
- Price and MRP validation applies if provided

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "subcategory_id": "uuid",
  "name_en": "Updated Name",
  "name_kn": "ನವೀಕರಿಸಿದ ಹೆಸರು",
  "description": "Updated description",
  "price": 110.00,
  "mrp": 130.00,
  "image_url": "https://example.com/new-image.jpg",
  "is_visible": false,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:01Z"
}
```

### DELETE /api/products/:id
Delete a product.

**Response:** `204 No Content`

**Error Response:** `404 Not Found`
```json
{
  "statusCode": 404,
  "message": "Product with ID {id} not found"
}
```

## Validation Rules

### Create Product
- `subcategory_id`: Required, must be a valid UUID, subcategory must exist
- `name_en`: Required, must be a non-empty string
- `name_kn`: Required, must be a non-empty string
- `description`: Optional, must be a string if provided
- `price`: Required, must be a number, must be >= 0
- `mrp`: Optional, must be a number if provided, must be >= 0
- `image_url`: Optional, must be a string if provided
- `is_visible`: Optional, must be a boolean if provided, defaults to `true`

### Update Product
- All fields are optional
- Same validation rules apply to provided fields
- If `subcategory_id` is provided, subcategory must exist

## Database Schema

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subcategory_id UUID NOT NULL REFERENCES subcategories(id) ON DELETE RESTRICT,
    name_en VARCHAR(255) NOT NULL,
    name_kn VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    mrp DECIMAL(10, 2),
    image_url TEXT,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Error Handling

The module returns appropriate HTTP status codes:
- `200 OK`: Successful GET/PUT request
- `201 Created`: Successful POST request
- `204 No Content`: Successful DELETE request
- `400 Bad Request`: Validation errors or subcategory not found
- `401 Unauthorized`: Missing or invalid JWT token
- `404 Not Found`: Product not found

## Requirements Satisfied

This implementation satisfies the following requirements:
- 4.1: Display list of products with name, price, and visibility status
- 4.2: Add product form with bilingual names, price, MRP, and subcategory
- 4.3: Validate required fields are non-empty
- 4.4: Edit product with pre-populated form
- 4.5: Save product updates
- 4.6: Delete product with confirmation
- 4.7: Remove product from database
- 4.8: Assign unique identifier to each product
- 4.9: Allow MRP field to be empty
- 4.10: Validate price values follow currency format
- 5.5: Set visibility status to enabled by default for new products
- 15.5: Store English and Kannada text in separate database fields

## Usage Example

```typescript
// Create a product
const newProduct = await fetch('/api/products', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    subcategory_id: 'subcategory-uuid',
    name_en: 'Organic Rice',
    name_kn: 'ಸಾವಯವ ಅಕ್ಕಿ',
    price: 80.00,
    mrp: 100.00,
    is_visible: true,
  }),
});

// Get all visible products
const products = await fetch('/api/products?is_visible=true', {
  headers: {
    'Authorization': 'Bearer <token>',
  },
});

// Update product visibility
const updated = await fetch('/api/products/product-uuid', {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    is_visible: false,
  }),
});

// Delete a product
await fetch('/api/products/product-uuid', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer <token>',
  },
});
```

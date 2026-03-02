# Error Handling and Validation Implementation

## Overview

This document describes the comprehensive error handling and validation system implemented for the Natural Farm Admin Dashboard backend API.

## Components Implemented

### 1. Global Exception Filter (`HttpExceptionFilter`)

**Location:** `backend/src/common/filters/http-exception.filter.ts`

**Purpose:** Provides consistent error responses across all API endpoints.

**Features:**
- Catches all exceptions (HTTP and non-HTTP)
- Returns standardized error response format
- Logs internal server errors and database failures with full context
- Automatically applied globally in `main.ts`

**Error Response Format:**
```json
{
  "statusCode": 400,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/categories",
  "method": "POST",
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 2. Custom Validation Pipe (`CustomValidationPipe`)

**Location:** `backend/src/common/pipes/validation.pipe.ts`

**Purpose:** Enhances validation error messages for better user experience.

**Features:**
- Uses class-validator decorators from DTOs
- Transforms validation errors into readable messages
- Returns field-specific error messages
- Automatically applied globally in `main.ts`

**Example Validation Error:**
```json
{
  "statusCode": 400,
  "message": ["English name is required", "Kannada name is required"],
  "error": "Validation Error"
}
```

### 3. Database Error Handler (`DatabaseErrorHandler`)

**Location:** `backend/src/common/utils/database-error.handler.ts`

**Purpose:** Maps PostgreSQL error codes to user-friendly HTTP exceptions.

**Supported Error Codes:**
- `23505` - Unique violation → "A record with this value already exists"
- `23503` - Foreign key violation → "Cannot perform this operation due to related records"
- `23502` - Not null violation → "Required field is missing"
- `22P02` - Invalid text representation → "Invalid data format"
- `42P01` - Undefined table → "Database configuration error"
- Default → "Database operation failed: [error message]"

**Usage Example:**
```typescript
if (error) {
  DatabaseErrorHandler.handleError(error, 'create category');
}
```

## HTTP Status Code Mapping

The application uses standard HTTP status codes as required:

- **200 OK** - Successful GET, PUT, PATCH requests
- **201 Created** - Successful POST requests (implicit in NestJS)
- **400 Bad Request** - Validation errors, invalid data, business logic errors
- **401 Unauthorized** - Authentication failures (handled by JWT guard)
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Database failures, unexpected errors

## Services Updated

All service files have been updated to use the `DatabaseErrorHandler`:

1. **CategoriesService** - `backend/src/categories/categories.service.ts`
2. **SubCategoriesService** - `backend/src/subcategories/subcategories.service.ts`
3. **ProductsService** - `backend/src/products/products.service.ts`
4. **BannersService** - `backend/src/banners/banners.service.ts`
5. **GalleryService** - `backend/src/gallery/gallery.service.ts`
6. **VideosService** - `backend/src/videos/videos.service.ts`
7. **InquiriesService** - `backend/src/inquiries/inquiries.service.ts`

## Validation Implementation

All DTOs use class-validator decorators for input validation:

**Example DTO:**
```typescript
export class CreateCategoryDto {
  @IsNotEmpty({ message: 'English name is required' })
  @IsString()
  name_en: string;

  @IsNotEmpty({ message: 'Kannada name is required' })
  @IsString()
  name_kn: string;
}
```

**Validation Features:**
- Required field validation
- Type validation (string, number, boolean)
- Format validation (email, URL, etc.)
- Custom error messages
- Automatic transformation of input data

## Error Logging

The system implements comprehensive error logging:

1. **Database Errors:** Logged with operation context and error details
2. **Internal Server Errors:** Logged with full stack traces and request context
3. **File Operation Failures:** Logged as warnings (non-critical)
4. **Validation Errors:** Returned to client without logging (expected errors)

**Log Format:**
```
[Nest] 12345  - 01/01/2024, 12:00:00 PM   ERROR [DatabaseErrorHandler] Database error during create category: duplicate key value violates unique constraint
```

## Testing

All existing tests have been updated to work with the new error handling:

- **23 tests passing** across all service test files
- Tests verify proper error handling and logging
- Tests confirm correct HTTP status codes are returned

## Requirements Satisfied

This implementation satisfies the following requirements:

- **Requirement 11.6:** Backend API returns appropriate HTTP status codes (200, 400, 401, 404, 500)
- **Requirement 11.8:** Database operation failures are logged
- **Requirement 14.1:** Field-specific error messages for validation failures
- **Requirement 14.2:** Invalid data validation with clear error messages
- **Requirement 14.3:** User-friendly error messages when backend requests fail

## Usage Guidelines

### For Developers

1. **Service Methods:** Use `DatabaseErrorHandler.handleError()` for all database operations
2. **DTOs:** Add class-validator decorators with custom error messages
3. **Custom Errors:** Throw appropriate NestJS exceptions (BadRequestException, NotFoundException, etc.)
4. **Logging:** The global filter handles logging automatically

### Error Handling Pattern

```typescript
async create(createDto: CreateDto): Promise<Entity> {
  const supabase = this.supabaseService.getClient();
  
  const { data, error } = await supabase
    .from('table')
    .insert([createDto])
    .select()
    .single();

  if (error) {
    DatabaseErrorHandler.handleError(error, 'create entity');
  }

  return data;
}
```

## Future Enhancements

Potential improvements for future iterations:

1. Add request ID tracking for better debugging
2. Implement error rate monitoring and alerting
3. Add more specific error codes for business logic errors
4. Implement retry logic for transient database errors
5. Add error response localization for bilingual support

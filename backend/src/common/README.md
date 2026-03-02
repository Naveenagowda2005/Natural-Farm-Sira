# Common Utilities

This directory contains shared utilities, filters, and pipes used across the application.

## Error Handling

### Global Exception Filter

The `HttpExceptionFilter` provides consistent error responses across all endpoints:

**Features:**
- Catches all exceptions (HTTP and non-HTTP)
- Returns standardized error response format
- Logs internal server errors and database failures
- Maps HTTP status codes appropriately

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

### Database Error Handler

The `DatabaseErrorHandler` utility maps PostgreSQL error codes to user-friendly HTTP exceptions:

**Supported Error Codes:**
- `23505` - Unique violation → "A record with this value already exists"
- `23503` - Foreign key violation → "Cannot perform this operation due to related records"
- `23502` - Not null violation → "Required field is missing"
- `22P02` - Invalid text representation → "Invalid data format"
- `42P01` - Undefined table → "Database configuration error"

**Usage:**
```typescript
if (error) {
  DatabaseErrorHandler.handleError(error, 'create category');
}
```

### Custom Validation Pipe

The `CustomValidationPipe` provides enhanced validation error messages:

**Features:**
- Uses class-validator decorators
- Returns field-specific error messages
- Transforms validation errors into readable format
- Automatically applied globally in main.ts

## HTTP Status Code Mapping

The application uses standard HTTP status codes:

- **200 OK** - Successful GET, PUT, PATCH requests
- **201 Created** - Successful POST requests (implicit in NestJS)
- **400 Bad Request** - Validation errors, invalid data
- **401 Unauthorized** - Authentication failures
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Database failures, unexpected errors

## Validation

All DTOs use class-validator decorators for input validation:

**Example:**
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

## Logging

- Database errors are logged with full stack traces
- Internal server errors are logged with request context
- File operation failures are logged as warnings
- All logs include operation context for debugging

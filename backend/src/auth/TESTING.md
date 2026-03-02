# Testing JWT Authentication

This document provides instructions for testing the JWT authentication implementation.

## Prerequisites

1. Ensure you have a `.env` file in the backend directory with:
   ```
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=24h
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

2. Create an admin user using the script:
   ```bash
   npm run create:admin
   ```

## Manual Testing with cURL

### 1. Test Login Endpoint

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your_password"}'
```

Expected response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin"
}
```

### 2. Test Invalid Credentials

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"wrong_password"}'
```

Expected response (401 Unauthorized):
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 3. Test Protected Route

First, get a token from the login endpoint, then:

```bash
curl -X GET http://localhost:3001/protected-route \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 4. Test Protected Route Without Token

```bash
curl -X GET http://localhost:3001/protected-route
```

Expected response (401 Unauthorized):
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

## Automated Testing

Run the unit tests:

```bash
npm test -- auth.service.spec.ts
```

## Testing Checklist

- [x] Login with valid credentials returns JWT token
- [x] Login with invalid credentials returns 401
- [x] Protected routes require valid JWT token
- [x] Protected routes reject requests without token
- [x] Protected routes reject requests with invalid token
- [x] JWT token expires after configured time
- [x] User information is available in protected routes

## Integration with Frontend

The frontend should:

1. Send login credentials to `/auth/login`
2. Store the `access_token` in localStorage or a secure cookie
3. Include the token in all subsequent requests:
   ```
   Authorization: Bearer <access_token>
   ```
4. Handle 401 responses by redirecting to login page
5. Clear token on logout

## Security Notes

- JWT_SECRET should be a strong, random string in production
- Tokens expire after 24 hours by default (configurable)
- Passwords are hashed with bcrypt before storage
- All admin routes should use the JwtAuthGuard

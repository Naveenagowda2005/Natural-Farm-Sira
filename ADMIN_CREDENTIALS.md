# Admin Login Credentials

## ✅ Login Fixed!

The login validation error has been resolved by adding proper validation decorators to the LoginDto.

## Admin Credentials

Use these credentials to login to the admin dashboard:

- **Username**: `adminnaturalfarmsira`
- **Password**: `Admin@123456`

## Login URL

- **Admin Login**: http://localhost:8080/admin/login
- **Admin Dashboard**: http://localhost:8080/admin

## What Was Fixed

1. **Added validation decorators** to `backend/src/auth/dto/login.dto.ts`:
   - Added `@IsNotEmpty()` and `@IsString()` decorators
   - This fixes the "unknown value was passed to the validate function" error

2. **Created admin user** with username `adminnaturalfarmsira`

## Testing

The backend login endpoint has been tested and is working correctly:

```bash
POST http://localhost:3001/auth/login
Content-Type: application/json

{
  "username": "adminnaturalfarmsira",
  "password": "Admin@123456"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "adminnaturalfarmsira"
}
```

## Next Steps

1. Open http://localhost:8080/admin/login
2. Enter the credentials above
3. Click "Login"
4. You should be redirected to the admin dashboard

## Creating Additional Admin Users

To create more admin users, run:

```bash
cd backend
npm run create:admin
```

Then follow the prompts to enter username and password.

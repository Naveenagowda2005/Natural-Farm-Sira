# Auth Module

This module implements JWT-based authentication for the admin dashboard.

## Features

- JWT token generation and validation
- Login endpoint with username/password authentication
- JWT and Local Passport strategies
- Auth guards for protecting routes

## Usage

### Login Endpoint

```
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "your_password"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin"
}
```

### Protecting Routes

Use the `JwtAuthGuard` to protect routes:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards';

@Controller('admin')
export class AdminController {
  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  getDashboard() {
    return { message: 'Protected route' };
  }
}
```

### Accessing User Information

The authenticated user is available in the request object:

```typescript
@Get('profile')
@UseGuards(JwtAuthGuard)
getProfile(@Request() req) {
  return req.user; // { id: '...', username: '...' }
}
```

## Configuration

Required environment variables:

- `JWT_SECRET`: Secret key for signing JWT tokens
- `JWT_EXPIRES_IN`: Token expiration time (default: 24h)

## Components

- **AuthService**: Handles user validation and token generation
- **AuthController**: Provides login endpoint
- **JwtStrategy**: Validates JWT tokens
- **LocalStrategy**: Validates username/password credentials
- **JwtAuthGuard**: Protects routes requiring authentication
- **LocalAuthGuard**: Used for login endpoint

# Admin Users Module

This module handles admin user management with secure password hashing using bcrypt.

## Features

- Create admin users with hashed passwords
- Find admin users by username or ID
- Password comparison for authentication
- Automatic password hashing with bcrypt (10 salt rounds)

## Usage

### Creating an Admin User

Use the provided script to create an admin user:

```bash
npm run create:admin
```

This will prompt you for:
- Username
- Password (minimum 6 characters)

The script will:
1. Validate the username doesn't already exist
2. Hash the password using bcrypt
3. Store the admin user in the database

### Service Methods

#### `create(createAdminUserDto: CreateAdminUserDto): Promise<AdminUser>`
Creates a new admin user with hashed password.

#### `findByUsername(username: string): Promise<AdminUser | null>`
Finds an admin user by username.

#### `findById(id: string): Promise<AdminUser | null>`
Finds an admin user by ID.

#### `hashPassword(password: string): Promise<string>`
Hashes a password using bcrypt.

#### `comparePassword(password: string, hash: string): Promise<boolean>`
Compares a plain text password with a hashed password.

## Security

- Passwords are hashed using bcrypt with 10 salt rounds before storage
- Plain text passwords are never stored in the database
- Username uniqueness is enforced at the database level

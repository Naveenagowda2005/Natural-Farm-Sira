/**
 * Example: How to protect routes with JWT authentication
 * 
 * This file demonstrates how to use the JwtAuthGuard to protect
 * admin routes that require authentication.
 */

import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards';

@Controller('example')
export class ExampleController {
  /**
   * Protected route - requires valid JWT token
   * 
   * Usage:
   * GET /example/protected
   * Headers: Authorization: Bearer <jwt_token>
   */
  @Get('protected')
  @UseGuards(JwtAuthGuard)
  getProtectedData(@Request() req) {
    // req.user contains: { id: string, username: string }
    return {
      message: 'This is protected data',
      user: req.user,
    };
  }

  /**
   * Public route - no authentication required
   */
  @Get('public')
  getPublicData() {
    return {
      message: 'This is public data',
    };
  }

  /**
   * Protected route with user information
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return {
      id: req.user.id,
      username: req.user.username,
    };
  }
}

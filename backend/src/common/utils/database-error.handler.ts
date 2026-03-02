import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PostgrestError } from '@supabase/supabase-js';

export class DatabaseErrorHandler {
  private static readonly logger = new Logger(DatabaseErrorHandler.name);

  /**
   * Handle Supabase/PostgreSQL errors and throw appropriate HTTP exceptions
   */
  static handleError(error: PostgrestError, operation: string): never {
    this.logger.error(
      `Database error during ${operation}: ${error.message}`,
      error.details || error.hint,
    );

    // Map common PostgreSQL error codes to user-friendly messages
    switch (error.code) {
      case '23505': // unique_violation
        throw new BadRequestException(
          'A record with this value already exists',
        );
      case '23503': // foreign_key_violation
        throw new BadRequestException(
          'Cannot perform this operation due to related records',
        );
      case '23502': // not_null_violation
        throw new BadRequestException('Required field is missing');
      case '22P02': // invalid_text_representation
        throw new BadRequestException('Invalid data format');
      case '42P01': // undefined_table
        this.logger.error(`Table not found: ${error.message}`);
        throw new InternalServerErrorException(
          'Database configuration error',
        );
      default:
        // For unknown errors, throw internal server error
        throw new InternalServerErrorException(
          `Database operation failed: ${error.message}`,
        );
    }
  }

  /**
   * Log successful database operations for debugging
   */
  static logSuccess(operation: string, details?: any): void {
    this.logger.log(`Database operation successful: ${operation}`, details);
  }
}

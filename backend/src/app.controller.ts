import { Controller, Get } from '@nestjs/common';
import { SupabaseService } from './supabase/supabase.service';

@Controller()
export class AppController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get()
  getHello(): { message: string; timestamp: string } {
    return {
      message: 'Natural Farm Backend API is running',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  async getHealth(): Promise<{ status: string; database: string }> {
    try {
      // Test database connection
      const { error } = await this.supabaseService
        .getClient()
        .from('admin_users')
        .select('count')
        .limit(1);

      return {
        status: 'ok',
        database: error ? 'disconnected' : 'connected',
      };
    } catch (error) {
      return {
        status: 'error',
        database: 'disconnected',
      };
    }
  }
}

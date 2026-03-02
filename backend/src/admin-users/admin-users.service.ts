import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import * as bcrypt from 'bcrypt';
import { AdminUser, CreateAdminUserDto } from './admin-user.entity';

@Injectable()
export class AdminUsersService {
  private readonly SALT_ROUNDS = 10;

  constructor(private readonly supabaseService: SupabaseService) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async create(createAdminUserDto: CreateAdminUserDto): Promise<AdminUser> {
    const { username, password } = createAdminUserDto;
    const supabase = this.supabaseService.getClient();

    // Check if username already exists
    const { data: existingUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('username', username)
      .single();

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Hash password
    const password_hash = await this.hashPassword(password);

    // Insert new admin user
    const { data, error } = await supabase
      .from('admin_users')
      .insert([{ username, password_hash }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create admin user: ${error.message}`);
    }

    return data as AdminUser;
  }

  async findByUsername(username: string): Promise<AdminUser | null> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !data) {
      return null;
    }

    return data as AdminUser;
  }

  async findById(id: string): Promise<AdminUser | null> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return data as AdminUser;
  }
}

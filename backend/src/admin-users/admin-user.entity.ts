export interface AdminUser {
  id: string;
  username: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateAdminUserDto {
  username: string;
  password: string;
}

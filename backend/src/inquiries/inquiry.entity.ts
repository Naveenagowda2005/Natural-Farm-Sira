export interface Inquiry {
  id: string;
  customer_name: string;
  phone_number: string;
  message?: string;
  is_read: boolean;
  created_at: Date;
  updated_at: Date;
}

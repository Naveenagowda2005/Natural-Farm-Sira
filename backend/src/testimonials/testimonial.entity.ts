export interface Testimonial {
  id: string;
  customer_name: string;
  message: string;
  media_url?: string;
  media_type?: 'image' | 'video';
  rating: number;
  is_visible: boolean;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

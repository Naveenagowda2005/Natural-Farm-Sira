export interface Product {
  id: string;
  subcategory_id: string;
  name_en: string;
  name_kn: string;
  description: string | null;
  price: number;
  mrp: number | null;
  image_url: string | null;
  is_visible: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateProductDto {
  subcategory_id: string;
  name_en: string;
  name_kn: string;
  description?: string | null;
  price: number;
  mrp?: number | null;
  image_url?: string | null;
  is_visible?: boolean;
}

export interface UpdateProductDto {
  subcategory_id?: string;
  name_en?: string;
  name_kn?: string;
  description?: string | null;
  price?: number;
  mrp?: number | null;
  image_url?: string | null;
  is_visible?: boolean;
}

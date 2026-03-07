export interface SubCategory {
  id: string;
  category_id: string;
  name_en: string;
  name_kn: string;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateSubCategoryDto {
  category_id: string;
  name_en: string;
  name_kn: string;
}

export interface UpdateSubCategoryDto {
  category_id?: string;
  name_en?: string;
  name_kn?: string;
}

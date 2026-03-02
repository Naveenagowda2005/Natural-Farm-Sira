export interface Category {
  id: string;
  name_en: string;
  name_kn: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateCategoryDto {
  name_en: string;
  name_kn: string;
}

export interface UpdateCategoryDto {
  name_en?: string;
  name_kn?: string;
}

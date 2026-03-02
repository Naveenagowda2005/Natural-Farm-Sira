import { IsString, IsNumber, IsOptional, IsBoolean, IsUUID, Min } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsUUID('4', { message: 'Subcategory ID must be a valid UUID' })
  subcategory_id?: string;

  @IsOptional()
  @IsString()
  name_en?: string;

  @IsOptional()
  @IsString()
  name_kn?: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price must be a positive value' })
  price?: number;

  @IsOptional()
  @IsNumber({}, { message: 'MRP must be a number' })
  @Min(0, { message: 'MRP must be a positive value' })
  mrp?: number | null;

  @IsOptional()
  @IsString()
  image_url?: string | null;

  @IsOptional()
  @IsBoolean()
  is_visible?: boolean;
}

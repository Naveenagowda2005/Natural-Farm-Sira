import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean, IsUUID, Min } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Subcategory ID is required' })
  @IsUUID('4', { message: 'Subcategory ID must be a valid UUID' })
  subcategory_id: string;

  @IsNotEmpty({ message: 'English name is required' })
  @IsString()
  name_en: string;

  @IsNotEmpty({ message: 'Kannada name is required' })
  @IsString()
  name_kn: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price must be a positive value' })
  price: number;

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

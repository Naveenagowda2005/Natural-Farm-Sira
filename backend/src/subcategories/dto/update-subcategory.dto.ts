import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateSubCategoryDto {
  @IsOptional()
  @IsUUID()
  category_id?: string;

  @IsOptional()
  @IsString()
  name_en?: string;

  @IsOptional()
  @IsString()
  name_kn?: string;
}

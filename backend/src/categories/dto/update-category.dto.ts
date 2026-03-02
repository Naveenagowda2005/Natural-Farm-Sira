import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsNotEmpty({ message: 'English name cannot be empty' })
  @IsString()
  name_en?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Kannada name cannot be empty' })
  @IsString()
  name_kn?: string;
}

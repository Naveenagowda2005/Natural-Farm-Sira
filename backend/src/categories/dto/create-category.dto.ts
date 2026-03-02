import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'English name is required' })
  @IsString()
  name_en: string;

  @IsNotEmpty({ message: 'Kannada name is required' })
  @IsString()
  name_kn: string;
}

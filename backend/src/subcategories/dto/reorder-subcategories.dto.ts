import { IsArray, ValidateNested, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class SubCategoryOrderItem {
  @IsString()
  id: string;

  @IsNumber()
  display_order: number;
}

export class ReorderSubCategoriesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubCategoryOrderItem)
  subcategories: SubCategoryOrderItem[];
}

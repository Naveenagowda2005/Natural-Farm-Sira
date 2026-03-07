import { IsArray, IsUUID, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SubCategoryOrderItem {
  @IsUUID()
  id: string;

  @IsInt()
  display_order: number;
}

export class ReorderSubCategoriesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubCategoryOrderItem)
  subcategories: SubCategoryOrderItem[];
}

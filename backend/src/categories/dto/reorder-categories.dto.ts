import { IsArray, IsUUID, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CategoryOrderItem {
  @IsUUID()
  id: string;

  @IsInt()
  display_order: number;
}

export class ReorderCategoriesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryOrderItem)
  categories: CategoryOrderItem[];
}

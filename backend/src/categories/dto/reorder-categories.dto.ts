import { IsArray, ValidateNested, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class CategoryOrderItem {
  @IsString()
  id: string;

  @IsNumber()
  display_order: number;
}

export class ReorderCategoriesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryOrderItem)
  categories: CategoryOrderItem[];
}

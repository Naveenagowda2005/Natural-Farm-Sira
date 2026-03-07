import { IsArray, IsUUID, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductOrderItem {
  @IsUUID()
  id: string;

  @IsInt()
  display_order: number;
}

export class ReorderProductsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductOrderItem)
  products: ProductOrderItem[];
}

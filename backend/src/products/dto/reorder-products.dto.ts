import { IsArray, ValidateNested, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class ProductOrderItem {
  @IsString()
  id: string;

  @IsNumber()
  display_order: number;
}

export class ReorderProductsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductOrderItem)
  products: ProductOrderItem[];
}

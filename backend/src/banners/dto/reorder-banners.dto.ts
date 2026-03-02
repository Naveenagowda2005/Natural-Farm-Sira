import { IsArray, IsUUID, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class BannerOrderItem {
  @IsUUID()
  id: string;

  @IsInt()
  display_order: number;
}

export class ReorderBannersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BannerOrderItem)
  banners: BannerOrderItem[];
}

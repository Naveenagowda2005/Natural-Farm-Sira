import { IsArray, ValidateNested, IsString, IsUUID, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

class GalleryOrderItem {
  @IsString()
  @IsUUID()
  id: string;

  @IsInt()
  @Min(0)
  display_order: number;
}

export class ReorderGalleryDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GalleryOrderItem)
  images: GalleryOrderItem[];
}

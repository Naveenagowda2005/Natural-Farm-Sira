import { IsArray, ValidateNested, IsString, IsUUID, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

class VideoOrderItem {
  @IsString()
  @IsUUID()
  id: string;

  @IsInt()
  @Min(0)
  display_order: number;
}

export class ReorderVideosDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VideoOrderItem)
  videos: VideoOrderItem[];
}

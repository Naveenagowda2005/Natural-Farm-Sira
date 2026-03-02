import { IsString, IsOptional, IsIn, ValidateIf } from 'class-validator';

export class CreateVideoDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.video_type === 'url')
  video_url?: string;

  @IsIn(['url', 'file'])
  video_type: 'url' | 'file';
}

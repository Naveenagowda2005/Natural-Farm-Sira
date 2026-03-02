import { IsBoolean } from 'class-validator';

export class UpdateInquiryReadDto {
  @IsBoolean()
  is_read: boolean;
}

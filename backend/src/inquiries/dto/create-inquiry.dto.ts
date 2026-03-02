import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateInquiryDto {
  @IsString()
  @IsNotEmpty()
  customer_name: string;

  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsString()
  @IsOptional()
  message?: string;
}

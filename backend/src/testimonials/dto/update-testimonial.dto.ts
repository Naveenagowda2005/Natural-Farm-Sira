import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';

export class UpdateTestimonialDto {
  @IsString()
  @IsOptional()
  customer_name?: string;

  @IsString()
  @IsOptional()
  message?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;
}

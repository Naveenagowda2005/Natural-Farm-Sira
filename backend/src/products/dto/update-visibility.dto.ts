import { IsBoolean } from 'class-validator';

export class UpdateVisibilityDto {
  @IsBoolean({ message: 'is_visible must be a boolean value' })
  is_visible: boolean;
}

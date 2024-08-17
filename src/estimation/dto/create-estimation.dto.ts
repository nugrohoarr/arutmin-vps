import { IsInt, IsOptional, IsString, MaxLength, ValidateIf, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEstimationDto {
  @ValidateIf(o => o.animalId !== undefined)
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  animalId: number;

  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'Maximum length is 255 characters' })
  area: string | null;

  @IsString()
  @IsOptional()
  @MaxLength(20, { message: 'Maximum length is 20 characters' })
  year: string | null;

  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Maximum length is 100 characters' })
  total: string | null;
}

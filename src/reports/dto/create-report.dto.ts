
import { IsInt, IsOptional, IsString, MaxLength, ValidateIf, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReportDto {
  @ValidateIf(o => o.animalId !== undefined)
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  animalId: number;

  
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(2048)
  imageUrl?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  location: string;

  @ValidateIf(o => o.animalCount !== undefined)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  animalCount: number;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  desc: string;

  @IsNotEmpty()
  @IsOptional()
  created_at?: Date;

  @IsNotEmpty()
  @IsOptional()
  updated_at?: Date;

  @IsNotEmpty()
  @IsOptional()
  deleteAt?: Date;
}

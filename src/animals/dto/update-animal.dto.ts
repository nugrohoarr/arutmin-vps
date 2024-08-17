// src/animals/dto/update-animal.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAnimalDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  estimationAmounts?: string;
}

import { IsNotEmpty, IsString, IsOptional, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateEstimationDto } from 'src/estimation/dto/create-estimation.dto';

export class AddAnimalDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  latinName?: string;

  @IsString()
  @IsOptional()
  distribution?: string;

  @IsString()
  @IsOptional()
  characteristics?: string;

  @IsString()
  @IsOptional()
  habitat?: string;

  @IsString()
  @IsOptional()
  foodType?: string;

  @IsString()
  @IsOptional()
  uniqueBehavior?: string;

  @IsString()
  @IsOptional()
  gestationPeriod?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ValidateNested({ each: true })
  @Type(() => CreateEstimationDto)
  @IsOptional()
  @ArrayMinSize(0)
  estimationAmounts?: CreateEstimationDto[];
}

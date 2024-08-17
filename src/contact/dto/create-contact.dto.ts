import { IsInt, IsOptional, IsString, MaxLength, ValidateIf, IsNotEmpty } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @MaxLength(16)
  phone: string;

  @IsString()
  @IsOptional()
  fax: string;

  @IsString()
  @MaxLength(500)
  email: string;

  @IsString()
  @MaxLength(1000)
  instagram: string;

  @IsString()
  @MaxLength(1000)
  facebook: string;
}

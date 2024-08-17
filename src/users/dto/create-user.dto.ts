import { IsEmail, IsNotEmpty, IsString, IsOptional, IsEnum, MinLength, MaxLength } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100, {message: 'Full name must be less than 100 characters'})
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20, {message: 'Phone number must be less than 20 characters'})
  noHp: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, {message: 'Password must be at least 8 characters'})
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role: Role = Role.MASYARAKAT;

  @IsNotEmpty()
  @IsOptional()
  created_at?: Date;

  @IsNotEmpty()
  @IsOptional()
  updated_at?: Date;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateAdminUserDto {
  @ApiPropertyOptional({ example: 'Leonardo Silva', maxLength: 100 })
  @IsOptional() @IsString() @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: 'leonardo@example.com' })
  @IsOptional() @IsEmail()
  email?: string;

  @ApiPropertyOptional({ enum: ['user', 'admin'] })
  @IsOptional() @IsIn(['user', 'admin'])
  role?: 'user' | 'admin';

  @ApiPropertyOptional({ enum: ['free', 'premium'] })
  @IsOptional() @IsIn(['free', 'premium'])
  plan?: 'free' | 'premium';

  @ApiPropertyOptional({ example: true })
  @IsOptional() @IsBoolean()
  isBanned?: boolean;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  @IsOptional()
  bannedUntil?: string | null;
}

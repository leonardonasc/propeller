import { IsBoolean, IsEmail, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateAdminUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsIn(['user', 'admin'])
  role?: 'user' | 'admin';

  @IsOptional()
  @IsIn(['free', 'premium'])
  plan?: 'free' | 'premium';

  @IsOptional()
  @IsBoolean()
  isBanned?: boolean;

  @IsOptional()
  bannedUntil?: string | null;
}

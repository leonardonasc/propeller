import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Website novo', maxLength: 20 })
  @IsString() @IsNotEmpty() @MaxLength(20)
  name: string;

  @ApiPropertyOptional({ example: 'Redesign da loja e do checkout.', maxLength: 100 })
  @IsString() @IsOptional() @MaxLength(100)
  description?: string;
}

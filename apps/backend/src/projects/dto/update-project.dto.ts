import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateProjectDto } from './create-project.dto.js';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @ApiPropertyOptional({ example: 'Novo nome do projeto' })
  @IsOptional() @IsString() @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({ example: null, nullable: true, description: 'Defina uma data ISO para arquivar ou null para restaurar.' })
  @IsOptional() @IsDateString()
  archivedAt?: string | null;
}

import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateRoadmapDto } from './create-roadmap.dto.js';

export class UpdateRoadmapDto extends PartialType(CreateRoadmapDto) {
  @ApiPropertyOptional({ example: 'Melhoria no dashboard' })
  @IsOptional() @IsString() @IsNotEmpty()
  title?: string;

  @ApiPropertyOptional({ example: 'Descricao atualizada.' })
  @IsOptional() @IsString() @IsNotEmpty()
  description?: string;
}

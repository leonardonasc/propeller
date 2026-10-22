import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRoadmapDto {
  @ApiProperty({ example: 'Notificacoes no app' })
  @IsString() @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Receba avisos importantes diretamente no workspace.' })
  @IsString() @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: ['planned', 'in_progress', 'completed'], example: 'planned' })
  @IsIn(['planned', 'in_progress', 'completed'])
  status: 'planned' | 'in_progress' | 'completed';

  @ApiProperty({ enum: ['feature', 'improvement', 'bug'], example: 'feature' })
  @IsIn(['feature', 'improvement', 'bug'])
  category: 'feature' | 'improvement' | 'bug';

  @ApiPropertyOptional({ example: 1 })
  @IsOptional() @IsNumber()
  position?: number;
}


import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Título da tarefa',
    example: 'Implementar autenticação',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Descrição da tarefa',
    example: 'Criar login com e-mail e senha',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Status da tarefa',
    enum: ['todo', 'in_progress', 'completed'],
    example: 'todo',
  })
  @IsOptional()
  @IsIn(['todo', 'in_progress', 'completed'])
  status?: 'todo' | 'in_progress' | 'completed';

  @ApiPropertyOptional({
    description: 'Prioridade da tarefa',
    enum: ['low', 'medium', 'high'],
    example: 'low',
  })
  @IsOptional()
  @IsIn(['low', 'medium', 'high'])
  priority?: 'low' | 'medium' | 'high';

  @ApiPropertyOptional({
    description: 'Data de vencimento da tarefa',
    example: '2026-10-25T18:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

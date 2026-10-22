import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsDateString, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateTaskDto } from './create-task.dto.js';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({ example: 'Revisar o checkout' })
  @IsOptional() @IsString() @IsNotEmpty()
  title?: string;

  @ApiPropertyOptional({ example: 'Detalhes atualizados da tarefa.' })
  @IsOptional() @IsString() @IsNotEmpty()
  description?: string;

  @ApiPropertyOptional({ enum: ['todo', 'in_progress', 'completed'] })
  @IsOptional() @IsIn(['todo', 'in_progress', 'completed'])
  status?: 'todo' | 'in_progress' | 'completed';

  @ApiPropertyOptional({ enum: ['low', 'medium', 'high'] })
  @IsOptional() @IsIn(['low', 'medium', 'high'])
  priority?: 'low' | 'medium' | 'high';

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true, example: '2026-10-25T18:00:00.000Z' })
  @IsOptional() @IsDateString()
  dueDate?: string;
}

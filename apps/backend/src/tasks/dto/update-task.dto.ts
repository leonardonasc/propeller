import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto.js';
import { IsDateString, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    title?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    description?: string;

    @IsOptional()
    @IsString()
    @IsIn(["todo", "in_progress", "completed"])
    status?: "todo" | "in_progress" | "completed";

    @IsOptional()
    @IsString()
    @IsIn(["low", "medium", "high"])
    priority?: "low" | "medium" | "high";

    @IsOptional()
    @IsDateString()
    dueDate?: string;

}

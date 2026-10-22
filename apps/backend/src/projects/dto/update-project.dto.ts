import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto.js';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsDateString()
    archivedAt?: string | null;
}

import { IsDateString, IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    @IsIn(["todo", "in_progress", "completed"])
    status: "todo" | "in_progress" | "completed";

    @IsOptional()
    @IsString()
    @IsIn(["low", "medium", "high"])
    priority: "low" | "medium" | "high";

    @IsOptional()
    @IsDateString()
    dueDate?: string;

}

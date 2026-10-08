import {
    IsIn,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from "class-validator"

export class CreateRoadmapDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsIn(["planned", "in_progress", "completed"])
    status: "planned" | "in_progress" | "completed"

    @IsIn(["feature", "improvement", "bug"])
    category: "feature" | "improvement" | "bug"

    @IsOptional()
    @IsNumber()
    position?: number
}
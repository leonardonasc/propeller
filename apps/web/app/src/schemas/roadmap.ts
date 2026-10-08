import { z } from 'zod';

export const createRoadmapSchema = z.object({
    title: z.string().min(1, { message: 'O título do roadmap é obrigatório' })
        .max(50, { message: 'O título do roadmap deve ter no máximo 50 caracteres' }),
    description: z.string()
        .max(200, { message: 'A descrição do roadmap deve ter no máximo 200 caracteres' })
        .optional(),
    status: z.enum(['planned', 'in_progress', 'completed'], { message: 'O status do roadmap deve ser "planned", "in_progress" ou "completed"' }),
    category: z.enum(['feature', 'improvement', 'bug'], { message: 'A categoria do roadmap deve ser "feature", "improvement" ou "bug"' }),
    position: z.number().optional(),
});

export const updateRoadmapSchema = createRoadmapSchema.partial();

export const roadmapSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    status: z.enum(['planned', 'in_progress', 'completed']),
    category: z.enum(['feature', 'improvement', 'bug']),
    position: z.number(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const roadmapsSchema = z.array(roadmapSchema);

export type CreateRoadmapInput = z.infer<typeof createRoadmapSchema>;
export type UpdateRoadmapInput = z.infer<typeof updateRoadmapSchema>;
export type Roadmap = z.infer<typeof roadmapSchema>;
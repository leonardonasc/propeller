import { z } from 'zod';

export const createTaskSchema = z.object({
    title: z.string().min(1, { message: 'O título da tarefa é obrigatório' })
        .max(50, { message: 'O título da tarefa deve ter no máximo 50 caracteres' }),
    description: z.string()
        .max(200, { message: 'A descrição da tarefa deve ter no máximo 200 caracteres' })
        .optional(),
    position: z.number().int().nonnegative().optional(),
    status: z.enum(['todo', 'in_progress', 'completed'], { message: 'O status da tarefa deve ser "todo", "in_progress" ou "completed"' }),
    priority: z.enum(['low', 'medium', 'high'], { message: 'A prioridade da tarefa deve ser "low", "medium" ou "high"' }),
    dueDate: z.date().optional(),
    projectId: z.string(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const taskSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    position: z.number(),
    status: z.enum(['todo', 'in_progress', 'completed']),
    priority: z.enum(['low', 'medium', 'high']),
    dueDate: z.coerce.date().nullable(),
    projectId: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const tasksSchema = z.array(taskSchema);

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type Task = z.infer<typeof taskSchema>;
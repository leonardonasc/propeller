import { z } from 'zod';
import { taskSchema } from './tasks';

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'O nome do projeto é obrigatório' })
    .max(20, {
      message: 'O nome do projeto deve ter no máximo 20 caracteres',
    }),

  description: z
    .string()
    .max(100, {
      message: 'A descrição do projeto deve ter no máximo 100 caracteres',
    })
    .optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export const projectSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  tasks: z.array(taskSchema).optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const projectsSchema = z.array(projectSchema);

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type Project = z.infer<typeof projectSchema>;
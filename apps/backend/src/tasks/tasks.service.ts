
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';

@Injectable()
export class TasksService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) { }

  async findAll(userId: string, projectId: string) {
    await this.ensureProjectOwnership(userId, projectId);

    return this.db.query.tasks.findMany({
      where: eq(schema.tasks.projectId, projectId),
      orderBy: (tasks, { asc }) => [
        asc(tasks.status),
        asc(tasks.position),
      ],
    });
  }

  async findOne(userId: string, projectId: string, id: string) {
    await this.ensureProjectOwnership(userId, projectId);

    const task = await this.db.query.tasks.findFirst({
      where: and(
        eq(schema.tasks.id, id),
        eq(schema.tasks.projectId, projectId),
      ),
    });

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    return task;
  }

  async create(userId: string, projectId: string, dto: CreateTaskDto) {
    await this.ensureProjectOwnership(userId, projectId);

    const status = dto.status ?? 'todo';

    const [lastTask] = await this.db
      .select({ position: schema.tasks.position })
      .from(schema.tasks)
      .where(
        and(
          eq(schema.tasks.projectId, projectId),
          eq(schema.tasks.status, status),
        ),
      )
      .orderBy(desc(schema.tasks.position))
      .limit(1);

    const position = lastTask ? lastTask.position + 1 : 0;

    const [task] = await this.db
      .insert(schema.tasks)
      .values({
        id: crypto.randomUUID(),
        projectId,
        title: dto.title,
        description: dto.description,
        position,
        status,
        priority: dto.priority ?? 'low',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      })
      .returning();

    return task;
  }

  async update(
    userId: string,
    projectId: string,
    id: string,
    dto: UpdateTaskDto,
  ) {
    await this.ensureProjectOwnership(userId, projectId);

    const existingTask = await this.db.query.tasks.findFirst({
      where: and(
        eq(schema.tasks.id, id),
        eq(schema.tasks.projectId, projectId),
      ),
    });

    if (!existingTask) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    const [task] = await this.db
      .update(schema.tasks)
      .set({
        ...dto,
        dueDate:
          dto.dueDate === null
            ? null
            : dto.dueDate
              ? new Date(dto.dueDate)
              : null,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(schema.tasks.id, id),
          eq(schema.tasks.projectId, projectId),
        ),
      )
      .returning();

    return task;
  }

  async remove(userId: string, projectId: string, id: string) {
    await this.ensureProjectOwnership(userId, projectId);

    const [task] = await this.db
      .delete(schema.tasks)
      .where(
        and(
          eq(schema.tasks.id, id),
          eq(schema.tasks.projectId, projectId),
        ),
      )
      .returning();

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    return task;
  }

  private async ensureProjectOwnership(userId: string, projectId: string) {
    const project = await this.db.query.projects.findFirst({
      where: and(
        eq(schema.projects.id, projectId),
        eq(schema.projects.userId, userId),
      ),
      columns: { id: true },
    });

    if (!project) {
      throw new NotFoundException('Projeto não encontrado');
    }
  }
}

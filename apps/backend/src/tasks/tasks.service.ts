
import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { DATABASE_CONNECTION } from '../database/database-connection.js';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema/index.js';

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

  async findComments(userId: string, projectId: string, taskId: string) {
    await this.ensureTaskOwnership(userId, projectId, taskId);
    return this.db.query.taskComments.findMany({
      where: eq(schema.taskComments.taskId, taskId),
      orderBy: (comments, { asc }) => [asc(comments.createdAt)],
      with: { author: { columns: { id: true, name: true, image: true } } },
    });
  }

  async createComment(userId: string, projectId: string, taskId: string, content: string) {
    await this.ensureTaskOwnership(userId, projectId, taskId);
    if (typeof content !== 'string') {
      throw new BadRequestException('Comentário inválido');
    }
    const normalizedContent = content.trim();
    if (!normalizedContent || normalizedContent.length > 2000) {
      throw new BadRequestException('Comentário inválido');
    }
    const [comment] = await this.db.insert(schema.taskComments).values({
      id: crypto.randomUUID(), taskId, userId, content: normalizedContent,
    }).returning();
    return this.db.query.taskComments.findFirst({
      where: eq(schema.taskComments.id, comment.id),
      with: { author: { columns: { id: true, name: true, image: true } } },
    });
  }

  async updateComment(userId: string, projectId: string, taskId: string, commentId: string, content: string) {
    await this.ensureTaskOwnership(userId, projectId, taskId);
    if (typeof content !== 'string' || !content.trim() || content.trim().length > 2000) {
      throw new BadRequestException('Comentário inválido');
    }
    const existing = await this.db.query.taskComments.findFirst({
      where: and(eq(schema.taskComments.id, commentId), eq(schema.taskComments.taskId, taskId)),
      columns: { userId: true },
    });
    if (!existing) throw new NotFoundException('Comentário não encontrado');
    if (existing.userId !== userId) throw new ForbiddenException('Você só pode editar os próprios comentários');

    await this.db.update(schema.taskComments)
      .set({ content: content.trim() })
      .where(and(eq(schema.taskComments.id, commentId), eq(schema.taskComments.taskId, taskId)));
    return this.db.query.taskComments.findFirst({
      where: eq(schema.taskComments.id, commentId),
      with: { author: { columns: { id: true, name: true, image: true } } },
    });
  }

  async deleteComment(userId: string, projectId: string, taskId: string, commentId: string) {
    await this.ensureTaskOwnership(userId, projectId, taskId);
    const existing = await this.db.query.taskComments.findFirst({
      where: and(eq(schema.taskComments.id, commentId), eq(schema.taskComments.taskId, taskId)),
      columns: { userId: true },
    });
    if (!existing) throw new NotFoundException('Comentário não encontrado');
    if (existing.userId !== userId) throw new ForbiddenException('Você só pode excluir os próprios comentários');
    await this.db.delete(schema.taskComments).where(and(eq(schema.taskComments.id, commentId), eq(schema.taskComments.taskId, taskId)));
    return { success: true };
  }

  async create(userId: string, projectId: string, dto: CreateTaskDto) {
    await this.ensureProjectOwnership(userId, projectId);

    const status = dto.status ?? 'todo';

    return this.db.transaction(async (tx) => {
      await tx.update(schema.tasks)
        .set({ position: sql`${schema.tasks.position} + 1` })
        .where(and(eq(schema.tasks.projectId, projectId), eq(schema.tasks.status, status)));

      const [task] = await tx
        .insert(schema.tasks)
        .values({
          id: crypto.randomUUID(),
          projectId,
          title: dto.title,
          description: dto.description,
          position: 0,
          status,
          priority: dto.priority ?? 'low',
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        })
        .returning();

      return task;
    });
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

  private async ensureTaskOwnership(userId: string, projectId: string, taskId: string) {
    await this.ensureProjectOwnership(userId, projectId);
    const task = await this.db.query.tasks.findFirst({
      where: and(eq(schema.tasks.id, taskId), eq(schema.tasks.projectId, projectId)),
      columns: { id: true },
    });
    if (!task) throw new NotFoundException('Tarefa não encontrada');
  }
}

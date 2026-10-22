import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, eq, isNull, isNotNull, count } from 'drizzle-orm';

import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { DATABASE_CONNECTION } from '../database/database-connection.js';
import * as schema from '../database/schema/index.js';

@Injectable()
export class ProjectsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) { }

  async findAll(userId: string, archived = false) {
    return this.db.query.projects.findMany({
      where: and(eq(schema.projects.userId, userId), archived ? isNotNull(schema.projects.archivedAt) : isNull(schema.projects.archivedAt)),
      orderBy: (projects, { desc }) => [desc(projects.updatedAt)],
      with: { 
        tasks: true,
      },
    });
  }

  async findOne(userId: string, id: string) {
  const project = await this.db.query.projects.findFirst({
    where: and(
      eq(schema.projects.id, id),
      eq(schema.projects.userId, userId),
    ),

    with: {
      tasks: true,
    },
  })

  if (!project) {
    throw new NotFoundException("Projeto não encontrado")
  }

  return project
}

  async create(userId: string, dto: CreateProjectDto) {
    const [account] = await this.db.select({ plan: schema.user.plan }).from(schema.user).where(eq(schema.user.id, userId));
    if (account?.plan !== 'premium') {
      const [{ value: projectCount }] = await this.db.select({ value: count() }).from(schema.projects)
        .where(and(eq(schema.projects.userId, userId), isNull(schema.projects.archivedAt)));
      if (projectCount >= 3) throw new ForbiddenException('Usuarios do plano Free podem manter ate 3 projetos ativos.');
    }
    const [project] = await this.db
      .insert(schema.projects)
      .values({
        id: crypto.randomUUID(),
        userId,
        name: dto.name,
        description: dto.description,
      })
      .returning();

    return project;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateProjectDto,
  ) {
    const [project] = await this.db
      .update(schema.projects)
      .set({
        ...dto,
        archivedAt: dto.archivedAt === null ? null : dto.archivedAt ? new Date(dto.archivedAt) : undefined,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(schema.projects.id, id),
          eq(schema.projects.userId, userId),
        ),
      )
      .returning();

    if (!project) {
      throw new NotFoundException('Projeto não encontrado');
    }

    return project;
  }

  async remove(userId: string, id: string) {
    const [project] = await this.db
      .delete(schema.projects)
      .where(
        and(
          eq(schema.projects.id, id),
          eq(schema.projects.userId, userId),
        ),
      )
      .returning();

    if (!project) {
      throw new NotFoundException('Projeto não encontrado');
    }

    return project;
  }
}

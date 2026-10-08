import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, eq } from 'drizzle-orm';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { DATABASE_CONNECTION } from '../database/database-connection';
import * as schema from '../database/schema';

@Injectable()
export class ProjectsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) { }

  async findAll(userId: string) {
    return this.db.query.projects.findMany({
      where: eq(schema.projects.userId, userId),
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
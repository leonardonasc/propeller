import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { eq } from 'drizzle-orm'

import { DATABASE_CONNECTION } from '../database/database-connection'
import * as schema from '../database/schema'

import { CreateRoadmapDto } from './dto/create-roadmap.dto'
import { UpdateRoadmapDto } from './dto/update-roadmap.dto'

@Injectable()
export class RoadmapService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async findAll() {
    return this.db.query.roadmap.findMany({
      orderBy: (roadmap, { asc }) => [asc(roadmap.position)],
    })
  }

  async findOne(id: string) {
    const [item] = await this.db
      .select()
      .from(schema.roadmap)
      .where(eq(schema.roadmap.id, id))

    if (!item) {
      throw new NotFoundException('Item da roadmap não encontrado')
    }

    return item
  }

  async create(dto: CreateRoadmapDto) {
    const [item] = await this.db
      .insert(schema.roadmap)
      .values({
        id: crypto.randomUUID(),
        title: dto.title,
        description: dto.description,
        status: dto.status,
        category: dto.category,
        position: dto.position ?? 0,
      })
      .returning()

    return item
  }

  async update(id: string, dto: UpdateRoadmapDto) {
    const [item] = await this.db
      .update(schema.roadmap)
      .set({
        ...dto,
        updatedAt: new Date(),
      })
      .where(eq(schema.roadmap.id, id))
      .returning()

    if (!item) {
      throw new NotFoundException('Item da roadmap não encontrado')
    }

    return item
  }

  async remove(id: string) {
    const [item] = await this.db
      .delete(schema.roadmap)
      .where(eq(schema.roadmap.id, id))
      .returning()

    if (!item) {
      throw new NotFoundException('Item da roadmap não encontrado')
    }

    return item
  }
}
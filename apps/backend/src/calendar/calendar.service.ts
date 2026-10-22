import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, gte, lt } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../database/database-connection.js';
import * as schema from '../database/schema/index.js';

@Injectable()
export class CalendarService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof schema>) {}
  list(userId: string, from?: string, to?: string) {
    const filters = [eq(schema.calendarEvents.userId, userId)];
    if (from && !Number.isNaN(Date.parse(from))) filters.push(gte(schema.calendarEvents.startsAt, new Date(from)));
    if (to && !Number.isNaN(Date.parse(to))) filters.push(lt(schema.calendarEvents.startsAt, new Date(to)));
    return this.db.query.calendarEvents.findMany({ where: and(...filters), orderBy: (events, { asc }) => [asc(events.startsAt)] });
  }
  async create(userId: string, dto: { title: string; description?: string; startsAt: string; allDay?: boolean }) {
    const startsAt = new Date(dto.startsAt);
    if (!dto.title?.trim() || !Number.isFinite(startsAt.getTime())) throw new BadRequestException('Informe titulo e data de inicio validos.');
    const [event] = await this.db.insert(schema.calendarEvents).values({ id: crypto.randomUUID(), userId, title: dto.title.trim(), description: dto.description || null, startsAt, endsAt: null, allDay: Boolean(dto.allDay) }).returning();
    return event;
  }
  async remove(userId: string, id: string) {
    const [event] = await this.db.delete(schema.calendarEvents).where(and(eq(schema.calendarEvents.id, id), eq(schema.calendarEvents.userId, userId))).returning();
    if (!event) throw new NotFoundException('Compromisso não encontrado'); return event;
  }
}

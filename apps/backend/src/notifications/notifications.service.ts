import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, desc, eq, isNull } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../database/database-connection.js';
import * as schema from '../database/schema/index.js';

@Injectable()
export class NotificationsService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof schema>) {}

  list(userId: string) {
    return this.db.select().from(schema.notifications).where(eq(schema.notifications.userId, userId))
      .orderBy(desc(schema.notifications.createdAt)).limit(50);
  }

  async clear(userId: string) {
    const deleted = await this.db.delete(schema.notifications)
      .where(eq(schema.notifications.userId, userId)).returning({ id: schema.notifications.id });
    return { deleted: deleted.length };
  }

  async markRead(userId: string, id: string) {
    const [notification] = await this.db.update(schema.notifications).set({ readAt: new Date() })
      .where(and(eq(schema.notifications.id, id), eq(schema.notifications.userId, userId), isNull(schema.notifications.readAt)))
      .returning();
    if (notification) return notification;
    const [existing] = await this.db.select().from(schema.notifications).where(and(eq(schema.notifications.id, id), eq(schema.notifications.userId, userId))).limit(1);
    if (!existing) throw new NotFoundException('Notificação não encontrada.');
    return existing;
  }

  async broadcast(title: string, message: string) {
    const normalizedTitle = title?.trim();
    const normalizedMessage = message?.trim();
    if (!normalizedTitle || normalizedTitle.length > 120 || !normalizedMessage || normalizedMessage.length > 2000) {
      throw new BadRequestException('Informe um título de até 120 caracteres e uma mensagem de até 2000 caracteres.');
    }
    const recipients = await this.db.select({ id: schema.user.id }).from(schema.user).where(isNull(schema.user.deletedAt));
    if (!recipients.length) return { recipients: 0 };
    await this.db.insert(schema.notifications).values(recipients.map(({ id }) => ({ id: crypto.randomUUID(), userId: id, title: normalizedTitle, message: normalizedMessage })));
    return { recipients: recipients.length };
  }
}

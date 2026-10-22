import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { count, desc, eq, ilike, or } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../database/database-connection';
import * as schema from '../database/schema';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';

@Injectable()
export class AdminService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof schema>) {}

  async listUsers(page: number, pageSize: number, search = '') {
    const offset = (page - 1) * pageSize;
    const filter = search.trim()
      ? or(ilike(schema.user.name, `%${search.trim()}%`), ilike(schema.user.email, `%${search.trim()}%`))
      : undefined;
    const [users, [{ total }]] = await Promise.all([
      this.db.select({
        id: schema.user.id,
        name: schema.user.name,
        email: schema.user.email,
        role: schema.user.role,
        plan: schema.user.plan,
        isBanned: schema.user.isBanned,
        bannedUntil: schema.user.bannedUntil,
        createdAt: schema.user.createdAt,
      }).from(schema.user).where(filter).orderBy(desc(schema.user.createdAt)).limit(pageSize).offset(offset),
      this.db.select({ total: count() }).from(schema.user).where(filter),
    ]);
    return { users, total, page, pageSize };
  }

  async getUser(id: string) {
    const [user] = await this.db.select({
      id: schema.user.id,
      name: schema.user.name,
      email: schema.user.email,
      role: schema.user.role,
      plan: schema.user.plan,
      isBanned: schema.user.isBanned,
      bannedUntil: schema.user.bannedUntil,
      createdAt: schema.user.createdAt,
    }).from(schema.user).where(eq(schema.user.id, id));
    if (!user) throw new NotFoundException('Usuário não encontrado');
    const projects = await this.db.query.projects.findMany({
      where: eq(schema.projects.userId, id),
      with: { tasks: true },
      orderBy: (project, { desc: sortDesc }) => [sortDesc(project.createdAt)],
    });
    return { ...user, projects };
  }

  async updateUser(adminId: string, id: string, dto: UpdateAdminUserDto) {
    if (adminId === id && (dto.role === 'user' || dto.isBanned === true || Boolean(dto.bannedUntil))) {
      throw new BadRequestException('Não é possível remover o próprio acesso de administrador.');
    }
    const [existing] = await this.db.select({ id: schema.user.id }).from(schema.user).where(eq(schema.user.id, id));
    if (!existing) throw new NotFoundException('Usuário não encontrado');

    const updates: Partial<typeof schema.user.$inferInsert> = { updatedAt: new Date() };
    if (dto.name !== undefined) updates.name = dto.name.trim();
    if (dto.email !== undefined) updates.email = dto.email.trim().toLowerCase();
    if (dto.role !== undefined) updates.role = dto.role;
    if (dto.plan !== undefined) updates.plan = dto.plan;
    if (dto.isBanned !== undefined) updates.isBanned = dto.isBanned;
    if (dto.isBanned === false) updates.bannedUntil = null;
    else if (dto.bannedUntil !== undefined) {
      if (dto.bannedUntil === null || dto.bannedUntil === '') updates.bannedUntil = null;
      else {
        const date = new Date(dto.bannedUntil);
        if (Number.isNaN(date.getTime()) || date.getTime() <= Date.now()) {
          throw new BadRequestException('A data de banimento temporário deve estar no futuro.');
        }
        updates.bannedUntil = date;
        updates.isBanned = true;
      }
    }

    const [updated] = await this.db.update(schema.user).set(updates).where(eq(schema.user.id, id)).returning({
      id: schema.user.id,
      name: schema.user.name,
      email: schema.user.email,
      role: schema.user.role,
      plan: schema.user.plan,
      isBanned: schema.user.isBanned,
      bannedUntil: schema.user.bannedUntil,
      createdAt: schema.user.createdAt,
    });
    return updated;
  }
}

import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, ne } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../database/database-connection.js';
import * as schema from '../database/schema/index.js';

@Injectable()
export class UsersService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof schema>) {}

  async checkUsername(id: string, rawUsername: string) {
    const username = this.normalizeUsername(rawUsername);
    if (!this.isValidUsername(username)) return { available: false, valid: false };
    const [existing] = await this.db.select({ id: schema.user.id }).from(schema.user)
      .where(and(eq(schema.user.username, username), ne(schema.user.id, id))).limit(1);
    return { available: !existing, valid: true };
  }

  async updateProfile(id: string, name: string, rawUsername: string) {
    const username = this.normalizeUsername(rawUsername);
    if (!name?.trim() || name.trim().length > 80) throw new BadRequestException('Informe um nome de ate 80 caracteres.');
    if (!this.isValidUsername(username)) throw new BadRequestException('O @ deve ter 3 a 20 caracteres: letras minusculas, numeros ou _.');
    const [existing] = await this.db.select({ id: schema.user.id }).from(schema.user)
      .where(and(eq(schema.user.username, username), ne(schema.user.id, id))).limit(1);
    if (existing) throw new ConflictException('Este @ ja esta em uso.');
    const [updated] = await this.db.update(schema.user).set({ name: name.trim(), username, updatedAt: new Date() })
      .where(eq(schema.user.id, id)).returning({ name: schema.user.name, username: schema.user.username });
    if (!updated) throw new NotFoundException('Usuario nao encontrado');
    return updated;
  }

  private normalizeUsername(value: string) { return (value ?? '').trim().replace(/^@/, '').toLowerCase(); }
  private isValidUsername(value: string) { return /^[a-z0-9_]{3,20}$/.test(value); }

  async getMe(id: string) {
    const [user] = await this.db.select({
      id: schema.user.id,
      name: schema.user.name,
      username: schema.user.username,
      email: schema.user.email,
      emailVerified: schema.user.emailVerified,
      role: schema.user.role,
      plan: schema.user.plan,
      isBanned: schema.user.isBanned,
      bannedUntil: schema.user.bannedUntil,
      image: schema.user.image,
      createdAt: schema.user.createdAt,
      deletedAt: schema.user.deletedAt,
    }).from(schema.user).where(eq(schema.user.id, id));
    if (!user) throw new NotFoundException('Usuário não encontrado');
    const { deletedAt, ...profile } = user;
    return { ...profile, isDeactivated: Boolean(deletedAt) };
  }
}

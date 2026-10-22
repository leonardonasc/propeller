import { ForbiddenException, Inject, Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../../database/database-connection';
import * as schema from '../../database/schema';

@Injectable()
export class AccountBanGuard implements CanActivate {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof schema>) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user?.id) return true;

    const [account] = await this.db.select({ isBanned: schema.user.isBanned, bannedUntil: schema.user.bannedUntil, deletedAt: schema.user.deletedAt })
      .from(schema.user).where(eq(schema.user.id, user.id));
    if (account?.deletedAt) throw new ForbiddenException({ code: 'ACCOUNT_DELETED' });
    if (!account?.isBanned) return true;

    const expiresAt = account.bannedUntil ? new Date(account.bannedUntil) : null;
    if (expiresAt && expiresAt.getTime() <= Date.now()) return true;

    // The web middleware needs this endpoint to decide whether to show the ban screen.
    if (
      request.path === '/users/me' ||
      request.path === '/users/session' ||
      request.path.endsWith('/sign-out')
    ) return true;

    throw new ForbiddenException({
      code: 'ACCOUNT_BANNED',
      bannedUntil: expiresAt?.toISOString() ?? null,
    });
  }
}

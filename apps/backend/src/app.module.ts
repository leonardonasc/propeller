import { Module } from "@nestjs/common"
import { APP_GUARD } from "@nestjs/core"
import { ConfigModule, ConfigService } from "@nestjs/config"

import { AuthGuard, AuthModule } from "@thallesp/nestjs-better-auth"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { NodePgDatabase } from "drizzle-orm/node-postgres"

import { DatabaseModule } from "./database/database.module.js"
import { DATABASE_CONNECTION } from "./database/database-connection.js"
import { UsersModule } from "./users/users.module.js"
import { ProjectsModule } from "./projects/projects.module.js"
import { RoadmapModule } from "./roadmap/roadmap.module.js"
import { TasksModule } from './tasks/tasks.module.js';
import { AdminModule } from './admin/admin.module.js';
import { AccountBanGuard } from './auth/guards/account-ban.guard.js';
import { CalendarModule } from './calendar/calendar.module.js';

@Module({
  imports: [
    ConfigModule.forRoot(),

    DatabaseModule,

    UsersModule,

    AuthModule.forRootAsync({
      imports: [DatabaseModule, ConfigModule],

      useFactory: (
        database: NodePgDatabase,
        configService: ConfigService,
      ) => ({
        auth: betterAuth({
          database: drizzleAdapter(database, {
            provider: "pg",
          }),

          user: {
            additionalFields: {
              role: {
                type: "string",
                input: false,
                defaultValue: "user",
              },
              plan: {
                type: "string",
                input: false,
                defaultValue: "free",
              },
              username: { type: "string", input: false, required: false },
              isBanned: {
                type: "boolean",
                input: false,
                defaultValue: false,
              },
              bannedUntil: {
                type: "date",
                input: false,
                required: false,
              },
            },
          },

          emailAndPassword: {
            enabled: true,
          },

          trustedOrigins: [
            configService.getOrThrow("UI_URL"),
          ],
        }),
      }),

      inject: [DATABASE_CONNECTION, ConfigService],
    }),

    ProjectsModule,

    RoadmapModule,

    TasksModule,

    AdminModule,

    CalendarModule,
  ],

  controllers: [],

  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AccountBanGuard,
    },
  ],
})
export class AppModule { }

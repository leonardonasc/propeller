import { Module } from "@nestjs/common"
import { APP_GUARD } from "@nestjs/core"
import { ConfigModule, ConfigService } from "@nestjs/config"

import { AuthGuard, AuthModule } from "@thallesp/nestjs-better-auth"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { NodePgDatabase } from "drizzle-orm/node-postgres"

import { DatabaseModule } from "./database/database.module"
import { DATABASE_CONNECTION } from "./database/database-connection"
import { UsersModule } from "./users/users.module"
import { ProjectsModule } from "./projects/projects.module"
import { RoadmapModule } from "./roadmap/roadmap.module"
import { TasksModule } from './tasks/tasks.module';
import { AdminModule } from './admin/admin.module';
import { AccountBanGuard } from './auth/guards/account-ban.guard';
import { CalendarModule } from './calendar/calendar.module';

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

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
  ],

  controllers: [],

  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule { }
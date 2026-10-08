import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DATABASE_CONNECTION } from "./database-connection";
import { Pool } from "pg";
import * as authSchema from "./schema/auth";
import * as projectsSchema from "./schema/projects";
import * as roadmapSchema from "./schema/roadmap";
import * as tasksSchema from "./schema/tasks";
import { drizzle } from "drizzle-orm/node-postgres";

@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: DATABASE_CONNECTION,
            useFactory: (configService: ConfigService) => {
                const pool = new Pool({
                    connectionString: configService.get<string>("DATABASE_URL"),
                })
                return drizzle(pool, {
                    schema: {
                        ...authSchema,
                        ...projectsSchema,
                        ...roadmapSchema,
                        ...tasksSchema,
                    }
                });
            },
            inject: [ConfigService],
        }
    ],
    exports: [DATABASE_CONNECTION]
})
export class DatabaseModule { }
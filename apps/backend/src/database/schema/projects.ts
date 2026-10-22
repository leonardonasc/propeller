import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './auth.js';
import { relations } from 'drizzle-orm';
import { tasks } from './tasks.js';

export const projects = pgTable('projects', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at')
        .defaultNow()
        .notNull(),

    updatedAt: timestamp('updated_at')
        .defaultNow()
        .notNull(),
    archivedAt: timestamp('archived_at'),
});

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(user, {
    fields: [projects.userId],
    references: [user.id],
  }),
  tasks: many(tasks),
}))

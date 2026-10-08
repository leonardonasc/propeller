import {
    integer,
    pgTable,
    text,
    timestamp,
} from 'drizzle-orm/pg-core';

export const roadmap = pgTable('roadmap', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    status: text('status', {
        enum: ['planned', 'in_progress', 'completed'],
    }).notNull(),
    category: text('category', {
        enum: ['feature', 'improvement', 'bug'],
    }).notNull(),
    position: integer('position').notNull().default(0),
    createdAt: timestamp('created_at')
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at')
        .defaultNow()
        .notNull(),
});
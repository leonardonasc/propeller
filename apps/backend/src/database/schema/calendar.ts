import { pgTable, text, timestamp, boolean, index } from 'drizzle-orm/pg-core';
import { user } from './auth';

export const calendarEvents = pgTable('calendar_events', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  startsAt: timestamp('starts_at').notNull(),
  endsAt: timestamp('ends_at'),
  allDay: boolean('all_day').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [index('calendar_events_user_starts_idx').on(table.userId, table.startsAt)]);

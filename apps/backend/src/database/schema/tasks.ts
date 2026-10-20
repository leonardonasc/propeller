import {
  pgTable,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

import { projects } from "./projects"

export const tasks = pgTable("tasks", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, {
      onDelete: "cascade",
    }),
  title: text("title").notNull(),
  description: text("description"),
  position: integer("position").notNull().default(0),
  status: text("status", {
    enum: ["todo", "in_progress", "completed"],
  })
    .notNull()
    .default("todo"),
  priority: text("priority", {
    enum: ["low", "medium", "high"],
  })
    .notNull()
    .default("low"),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
})

export const tasksRelations = relations(tasks, ({ one }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
}))
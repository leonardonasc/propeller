import {
  pgTable,
  text,
  timestamp,
  integer,
  index,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

import { projects } from "./projects.js"
import { user } from "./auth.js"

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

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  comments: many(taskComments),
}))

export const taskComments = pgTable("task_comments", {
  id: text("id").primaryKey(),
  taskId: text("task_id").notNull().references(() => tasks.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("task_comments_task_id_idx").on(table.taskId)])

export const taskCommentsRelations = relations(taskComments, ({ one }) => ({
  task: one(tasks, { fields: [taskComments.taskId], references: [tasks.id] }),
  author: one(user, { fields: [taskComments.userId], references: [user.id] }),
}))

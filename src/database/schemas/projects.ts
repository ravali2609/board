import { index, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
id: serial().primaryKey(),
user_id:text().notNull(),
project_name: text().notNull(),
description: text(),
created_at: timestamp().notNull().defaultNow(),
updated_at: timestamp().notNull().defaultNow(),
deleted_at: timestamp(),
},  (t: { user_id: any; project_name: any }) => [
  index("projects_project_name_idx").on(t.project_name),
  index("projects_user_id_idx").on(t.user_id),
]);


export type ProjectsTable = typeof projects;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;


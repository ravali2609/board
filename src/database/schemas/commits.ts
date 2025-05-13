import { index, integer, text,pgTable, serial, timestamp} from "drizzle-orm/pg-core";
export const commits = pgTable("commits", {
  id: serial().primaryKey(),
  project_id:integer().notNull(),//fk
  user_id:integer().notNull(),//fk
  repositry_id: text().notNull(),
  commit_link: text(),
  line_of_codes:integer(),
  commit_message:text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
  deleted_at: timestamp(),
  }, t => [
    index("commits_user_id_idx").on(t.user_id),
    index("commits_project_id_idx").on(t.project_id),
  ]);

  export type CommitsTable = typeof commits;
  export type Commit = typeof commits.$inferSelect;
  export type NewCommit = typeof commits.$inferInsert;
import type { PgInsertValue } from "drizzle-orm/pg-core";

import type { Project, ProjectsTable } from "../database/schemas/projects.js";
import type { User, UsersTable } from "../database/schemas/users.js";

export type DBTable = UsersTable | ProjectsTable;

export type DBRecord<T extends DBTable> = T extends UsersTable ? User : Project;

export type DBNewRecord<T extends DBTable> = PgInsertValue<T>;

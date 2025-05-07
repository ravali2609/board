import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

import env from "../env.js";

const { Pool } = pg;

const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
});
const db = drizzle({ client: pool });

export default db;

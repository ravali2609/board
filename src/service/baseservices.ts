// import { db } from '../database/db.js';
// import { pgTable, sql } from 'drizzle-orm/pg-core';
// import { Users } from '../database/schemas/users';

// export class BaseService<T> {
//   private table: pgTable<any>;

//   constructor(table: pgTable<any>) {
//     this.table = table;
//   }

//   // Create operation
//   async create(data: Partial<T>): Promise<T> {
//     const [createdEntity] = await db.insert(this.table).values(data).returning();
//     return createdEntity;
//   }

//   // Read operation by ID
//   async findById(id: number): Promise<T | null> {
//     const [entity] = await db.select().from(this.table).where(sql`${this.table.id} = ${id}`).limit(1);
//     return entity || null;
//   }

//   // Read all records
//   async findAll(): Promise<T[]> {
//     return db.select().from(this.table);
//   }

//   // Update operation by ID
//   async update(id: number, data: Partial<T>): Promise<T | null> {
//     const [updatedEntity] = await db
//       .update(this.table)
//       .set(data)
//       .where(sql`${this.table.id} = ${id}`)
//       .returning();
//     return updatedEntity || null;
//   }

//   // Delete operation by ID
//   async delete(id: number): Promise<boolean> {
//     const result = await db.delete(this.table).where(sql`${this.table.id} = ${id}`);
//     return result.count > 0;
//   }
// }
import type { SQL } from "drizzle-orm";

import { eq, getTableName, sql } from "drizzle-orm";

import type { DBNewRecord, DBRecord, DBTable } from "../types/db-types.js";

import { DB_ID_INVALID, DB_SAVE_DATA_FAILED, EMPTY_DB_DATA } from "../constants/app-messages.js";
import db from "../database/db.js";
import UnprocessableEntityException from "../exceptions/unprocessable-entity-exception.js";
//create 
export async function saveRecord<T extends DBTable>(
  table: T,
  record: DBNewRecord<T>,
): Promise<DBRecord<T>> {
  if (!record) {
    throw new UnprocessableEntityException(EMPTY_DB_DATA);
  }

  const result = await db.insert(table).values(record).returning();

  if (!Array.isArray(result) || result.length === 0) {
    throw new UnprocessableEntityException(DB_SAVE_DATA_FAILED);
  }

  return result[0] as DBRecord<T>;
}
//get by id
export async function getRecordByPrimaryKey<
  T extends DBTable,
  C extends keyof DBRecord<T> = keyof DBRecord<T>,
>(
  table: T,
  id: number,
  columnsToSelect?: readonly C[],
): Promise<Pick<DBRecord<T>, C> | null> {
  if (Number.isNaN(id) || id <= 0) {
    throw new UnprocessableEntityException(DB_ID_INVALID);
  }

  const columnsRequired = _prepareSelectColumnsForQuery<T>(table, columnsToSelect);
  const baseQuery = columnsRequired
    ? db.select(columnsRequired).from(table as any).$dynamic()
    : db.select().from(table as any).$dynamic();
  const query = baseQuery.where(eq(table.id, id));
  const result = await query;
  return Array.isArray(result) && result.length > 0
    ? result[0] as Pick<DBRecord<T>, C>
    : null;
}

function _prepareSelectColumnsForQuery<T extends DBTable>(
  table: T,
  columnsToSelect?: readonly(keyof DBRecord<T>)[],
): Record<string, SQL> | null {
  if (!columnsToSelect) {
    return null;
  }

  if (columnsToSelect.length === 0) {
    return {};
  }

  const columnsForQuery: Record<string, SQL> = {};
  columnsToSelect.forEach((column) => {
    columnsForQuery[column as string] = sql.raw(
      `${getTableName(table)}.${column as string}`,
    );
  });
  return columnsForQuery;
}
export async function getAllRecords<
  T extends DBTable,
  C extends keyof DBRecord<T> = keyof DBRecord<T>,
>(
  table: T,
  columnsToSelect?: readonly C[],
  limit?: number,
  offset?: number,
): Promise<Pick<DBRecord<T>, C>[]> {
  const columnsRequired = _prepareSelectColumnsForQuery<T>(table, columnsToSelect);
  let baseQuery = columnsRequired
    ? db.select(columnsRequired).from(table as any).$dynamic()
    : db.select().from(table as any).$dynamic();

  if (typeof limit === "number") {
    baseQuery = baseQuery.limit(limit);
  }
  if (typeof offset === "number") {
    baseQuery = baseQuery.offset(offset);
  }

  const results = await baseQuery;
  return results as Pick<DBRecord<T>, C>[];
}
//update
export async function updateRecordById<T extends DBTable>(
  table: T,
  id: number,
  updateData: Partial<T["$inferInsert"]>,
): Promise<DBRecord<T>> {
  if (Number.isNaN(id) || id <= 0) {
    throw new UnprocessableEntityException(DB_ID_INVALID);
  }

  if (!updateData || Object.keys(updateData).length === 0) {
    throw new UnprocessableEntityException(EMPTY_DB_DATA);
  }

  const result = await db
    .update(table)
    .set(updateData as any)
    .where(eq(table.id, id))
    .returning();

  if (!Array.isArray(result) || result.length === 0) {
    throw new UnprocessableEntityException(DB_SAVE_DATA_FAILED);
  }

  return result[0] as DBRecord<T>;
}

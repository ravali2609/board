import db from "../database/db.js"
import type { NewUser, User, UsersTable } from "../database/schemas/users.js";
import type { SQL } from "drizzle-orm";

type DBTable = UsersTable 
type NewDBRecord  = NewUser
type DBRecordRow = User

export const saverecord = async <DBRecordRow> (table : DBTable , record : NewDBRecord )=>{
    const result = await db.insert(table).values(record).returning() ;
    return result[0]  
}

export const updateRecord = async (table: DBTable, data: Partial<NewDBRecord>, where: SQL) => {
    const result = await db.update(table).set(data).where(where).returning();
    return result;
}

export const findRecordById = async (table: DBTable, id: number) => {
    const result = await db.select().from(table).where(table.id.eq(id)).limit(1);
    return result[0] || null;
}
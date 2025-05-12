import { eq } from "drizzle-orm";
import db from "../database/db.js"
import { users, type NewUser, type User, type UsersTable } from "../database/schemas/users.js";
import { count } from "drizzle-orm";

type DBTable = UsersTable 
type NewDBRecord  = NewUser
type DBRecordRow = User

//create new user
export const saverecord = async (table : DBTable , record : NewDBRecord )=>{
    const result = await db.insert(table).values(record).returning() ;
    return result[0]  
}

//getById user
export const getRecordById = async(table: DBTable,id: number) => {
    const result = await db.select().from(table).where(eq(users.id,id));
    return result[0];
};

//get all users 
export const getAllRecords = async(table: DBTable) => {
    const result = await db.select().from(table);
    const totalCount =  await db.select({ count: count()}) .from(table)
    .then(res => Number(res[0].count));

    return {result, totalCount}
};


//delete 
export const deleteRecordById = async(table: DBTable, id: number) => {
    const result = await db.delete(table).where(eq(users.id, id)).returning();
    return result[0];
  };


//update
 export const updateRecordById= async(table: any, id: number, data: NewUser) => {


  const updated = await db
    .update(table)
    .set({...data,updated_at: new Date()})
    .where(eq(table.id, id))
    .returning();

  return updated[0];
}
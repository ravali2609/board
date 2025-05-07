import db from "../database/db.js";
import { users, type NewUser } from "../database/schemas/viewUserSchema.js";

export const createUser=async (userData: NewUser)=>{
    const  user =await db.insert(users).values(userData).returning();
    return user[0];
  }
  
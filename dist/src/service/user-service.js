import db from "../database/db.js";
import { users } from "../database/schemas/users.js";
export const createUser = async (userData) => {
    const user = await db.insert(users).values(userData).returning();
    return user[0];
};

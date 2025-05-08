import db from "../database/db.js";
export const saverecord = async (table, record) => {
    const result = await db.insert(table).values(record).returning();
    return result[0];
};

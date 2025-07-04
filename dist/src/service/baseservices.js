import db from "../database/db.js";
export const saverecord = async (table, record) => {
    const result = await db.insert(table).values(record).returning();
    return result[0];
};
export const updateRecord = async (table, data, where) => {
    const result = await db.update(table).set(data).where(where).returning();
    return result;
};
export const findRecordById = async (table, id) => {
    const result = await db.select().from(table).where(table.id.eq(id)).limit(1);
    return result[0] || null;
};

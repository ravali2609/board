import { pgTable , text, serial, date, timestamp,index} from "drizzle-orm/pg-core";
export const users=pgTable("users",{
    id: serial().primaryKey(),
    first_Name: text().notNull(),      
    last_Name: text(),
    email: text().unique().notNull(),
    phone : text(),
    dob: date({ mode: "date" }).notNull(),
    doj: date({ mode: "date" }).notNull(),
    designation: text().notNull(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow()

    /// add fileds
    // status 
},t=> [
    index("users_email_idx").on(t.email),
    index("users_first_name_idx").on(t.first_Name),
]);

export type UsersTable = typeof users;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

import { pgTable , text, serial, date, timestamp} from "drizzle-orm/pg-core";
export const user=pgTable(  "Viewusers",{
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

}
)
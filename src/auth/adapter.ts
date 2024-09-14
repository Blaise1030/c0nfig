import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle"
import { db, sessionTable, userTable } from "~/db"

export const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);

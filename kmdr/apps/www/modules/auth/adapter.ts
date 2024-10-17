import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle"
import { db, sessionTable, userTable } from "~/db"

export const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);
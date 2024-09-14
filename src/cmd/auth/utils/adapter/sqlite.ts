export default `import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle"
import { db, sessionTable, userTable } from "$databasePath"

export const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);
`

export default `import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle"
import { db, sessionTable, userTable } from "$databasePath"

export const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);
`
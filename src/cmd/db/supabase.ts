const dependencies = ['drizzle-orm', 'postgres']
const devDependencies = ['drizzle-kit']

// db.ts
const init = `import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
export * from "./schema";

const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString);
export const db = drizzle(client);
`

// schema.ts
const schema = `
import { pgTable, serial } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
});
`

// drizzle.config.ts
const drizzleKit = (databasePath: string) => `import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: '${databasePath}/schema.ts',
    out: '${databasePath}/migrations',
    dialect: 'postgresql',        
    verbose: true,
    strict: true,
    dbCredentials: {
        url: process.env.DATABASE_URL as string
    }
});`


export const supabase = { init, schema, drizzleKit, dependencies, devDependencies }
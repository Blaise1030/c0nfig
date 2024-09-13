const dependencies = ['drizzle-orm', '@libsql/client']
const devDependencies = ['drizzle-kit']

// db.ts
const init = `import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
export * from "./schema";

const client = createClient({ url: process.env.VITE_DATABASE_URL, authToken: process.env.DATABASE_TOKEN });
export const db = drizzle(client);`

// schema.ts
const schema = `import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable('users', { id: text('id') });`

// drizzle.config.ts
const drizzleKit = (databasePath: string) => `import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: '${databasePath}/schema.ts',
    out: '${databasePath}/migrations',
    dialect: 'sqlite',
    driver: 'turso',
    verbose: true,
    strict: true,
    dbCredentials: {
        authToken: process.env.DATABASE_AUTH as string,
        url: process.env.DATABASE_URL as string
    }
});`


export const turso = { init, schema, drizzleKit, dependencies, devDependencies }
const dependencies = ['drizzle-orm', 'better-sqlite3']
const devDependencies = ['drizzle-kit']

// db.ts
const init = `import { drizzle } from 'drizzle-orm/better-sqlite3';
export * from "./schema";

import Database from 'better-sqlite3';
const sqlite = new Database('sqlite.db');
export const db = drizzle(sqlite);`

// schema.ts
const schema = `import { sql } from "drizzle-orm";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";

export const users = sqliteTable('users', {
  id: text('id'),  
});`

// drizzle.config.ts
const drizzleKit = (databasePath: string) => `import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: '${databasePath}/schema.ts',
    out: '${databasePath}/migrations',
    dialect: 'sqlite',    
    verbose: true,
    strict: true,
    dbCredentials: {
        url: 'sqlite.db'
    }
});`


export const sqlite = { init, schema, drizzleKit, dependencies, devDependencies }
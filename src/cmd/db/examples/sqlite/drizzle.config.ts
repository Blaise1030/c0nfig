import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: '${databasePath}/schema.ts',
  out: '${databasePath}/migrations',
  dialect: 'sqlite',
  verbose: true,
  strict: true,
  dbCredentials: {
    url: 'sqlite.db'
  }
});
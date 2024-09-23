import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: '${databasePath}/schema.ts',
  out: '${databasePath}/migrations',
  dialect: 'postgresql',
  verbose: true,
  strict: true,
  dbCredentials: {
    url: process.env.DATABASE_URL as string
  }
});
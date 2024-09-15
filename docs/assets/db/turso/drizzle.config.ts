import { defineConfig } from 'drizzle-kit';

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
});
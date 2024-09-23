import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: '$absDbPath/schema.ts',
  out: '$absDbPath/migrations',
  dialect: 'sqlite',
  driver: 'turso',
  verbose: true,
  strict: true,
  dbCredentials: {
    authToken: process.env.DATABASE_AUTH as string,
    url: process.env.DATABASE_URL as string
  }
});
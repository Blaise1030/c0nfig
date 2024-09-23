import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: '$absDbPath/schema.ts',
  out: '$absDbPath/migrations',
  dialect: 'postgresql',
  verbose: true,
  strict: true,
  dbCredentials: {
    url: process.env.DATABASE_URL as string
  }
});
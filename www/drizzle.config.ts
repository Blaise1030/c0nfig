import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './modules/db/schema.ts',
  out: './modules/db/migrations',
  dialect: 'postgresql',
  verbose: true,
  strict: true,
  dbCredentials: {
    url: process.env.DATABASE_URL as string
  }
});
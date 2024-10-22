import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: '$absDbPath/schema.ts',
  out: '$absDbPath/migrations',
  dialect: 'sqlite',
  verbose: true,
  strict: true,
  dbCredentials: {
    url: 'sqlite.db'
  }
});
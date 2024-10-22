import { defineConfig } from 'drizzle-kit';

const connectionString = process.env.DATABASE_URL as string

export default defineConfig({
  schema: './be/db/schema.ts',
  out: './be/db/migrations',
  dialect: 'postgresql',
  verbose: true,
  strict: true,
  dbCredentials: {
    url: connectionString
  }
});

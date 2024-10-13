import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
export * from "./schema";

const client = createClient({ url: process.env.VITE_DATABASE_URL, authToken: process.env.DATABASE_TOKEN });
export const db = drizzle(client);
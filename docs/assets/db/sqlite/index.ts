import { drizzle } from 'drizzle-orm/better-sqlite3';
export * from "./schema";

import Database from 'better-sqlite3';
const sqlite = new Database('sqlite.db');
export const db = drizzle(sqlite);
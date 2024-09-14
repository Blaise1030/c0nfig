import { text, sqliteTable } from "drizzle-orm/sqlite-core";

export const users = sqliteTable('users', {
  id: text('id'),
});
export * from "~/auth/auth-schema"
export * from "~/auth/oauth-schema"
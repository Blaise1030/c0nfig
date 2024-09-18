import { pgTable, serial } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
});
export * from "~/auth/auth-schema"
export * from "~/auth/oauth-schema"
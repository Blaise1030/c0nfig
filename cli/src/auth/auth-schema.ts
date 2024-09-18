import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const userTable = pgTable('users', {
  id: text('id').primaryKey(),
  username: text('username').default(''),
  passwordHash: text('password_hash').default('')
});

export const sessionTable = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => userTable.id).notNull(),
  expiresAt: timestamp('expires_at').notNull()
})
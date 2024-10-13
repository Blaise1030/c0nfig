import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').default(''),
  passwordHash: text('password_hash').default('')
});

export const sessionTable = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => userTable.id).notNull(),
  expiresAt: integer('expires_at').notNull()
})
import { pgTable, text, primaryKey } from "drizzle-orm/pg-core";

export const oauthAccountTable = pgTable('oauth_account', {
  providerId: text('provider_id').notNull(),
  providerUserId: text('provider_user_id').notNull(),
  userId: text('user_id').notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.providerId, table.providerUserId] })
}));
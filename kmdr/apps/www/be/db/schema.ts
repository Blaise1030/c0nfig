import { sql } from "drizzle-orm";
import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "~/auth/auth-schema"

// Templates Table
export const templates = pgTable('template', {
  id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  authorId: uuid('author_id')
    .notNull()
    .references(() => user.id),
  commandJson: jsonb('command_json').notNull(),
  url: text('url').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export * from "~/auth/auth-schema"
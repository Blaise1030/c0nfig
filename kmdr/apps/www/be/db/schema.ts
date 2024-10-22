import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "~/auth/auth-schema"
import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";

export const templates = pgTable('template', {
  id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  slug: text('slug').notNull(),
  authorId: text('author_id')
    .notNull()
    .references(() => user.id),
  commandItems: jsonb('command_items').$type<{
    slug: string,
    title: string,
    description: string,
    url: string
  }[]>().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const usersRelations = relations(user, ({ many }) => ({
  posts: many(templates),
}));

export const templatesRelation = relations(templates, ({ one }) => ({
  author: one(user, {
    fields: [templates.authorId],
    references: [user.id],
  }),
}));

export * from "~/auth/auth-schema"
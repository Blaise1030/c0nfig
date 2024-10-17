import { pgTable, serial } from "drizzle-orm/pg-core";
import { userTable } from "~/auth/auth-schema"

export const registry = pgTable('registry', {
  id: serial('id').primaryKey()
})

export * from '~/auth/auth-schema'
export * from '~/auth/oauth-schema'

import { createAuthClient } from "better-auth/client"

export const client = createAuthClient()

export const signin = async (provider: 'discord' | 'github') => {
  await client.signIn.social({ provider: provider })
}
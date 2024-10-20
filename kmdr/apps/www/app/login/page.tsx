'use client'

import { createAuthClient } from "better-auth/client"
const client = createAuthClient()

const signin = async () => {
  const data = await client.signIn.social({
    provider: "github"
  })

  console.log(data)
}

export default function LoginPage() {
  return <div>
    <button onClick={signin}>Click me </button>
    This is the login page
  </div>
}
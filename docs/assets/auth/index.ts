import { Lucia } from "lucia";
import { adapter } from "./adapter"
export * from "./auth-schema"
// export * from "./oauth-schema"

// import { webcrypto } from "crypto";
// globalThis.crypto = webcrypto as Crypto;

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production"
    }
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username
    };
  }
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<{ username: string }, "id">;
  }
}
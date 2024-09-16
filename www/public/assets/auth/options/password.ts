// dependencies: ['@node-rs/argon2', 'zod']
import { generateIdFromEntropySize } from "lucia";
import { hash, verify } from "@node-rs/argon2";
import { eq } from "drizzle-orm";
import z from 'zod'

import { lucia, userTable } from "$authPath";
import { db } from "$databasePath"

const signUpSchema = z.object({
    email: z.string().email('Must be an email.'),
    password: z.string().min(8),
});

export async function passwordSignUp(request: Request) {
    const body = await request.json();
    const result = signUpSchema.safeParse(body);
    if (!result.success) {
        return new Response(result.error.message, { status: 400 });
    }
    const email = result.data.email;
    const password = result.data.password;

    const passwordHash = await hash(password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
    });
    const userId = generateIdFromEntropySize(10); // 16 characters long

    try {
        await db.insert(userTable).values({
            id: userId,
            username: email,
            passwordHash
        })

        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        return new Response(null, {
            status: 302,
            headers: {
                Location: "/",
                "Set-Cookie": sessionCookie.serialize()
            }
        });
    } catch {
        return new Response("Email already used", {
            status: 400
        });
    }
}

export async function passwordSignIn(request: Request) {
    const body = await request.json();
    const result = signUpSchema.safeParse(body);
    if (!result.success) {
        return new Response(result.error.message, { status: 400 });
    }
    const email = result.data.email;
    const password = result.data.password;

    const user = (db.select().from(userTable).where(eq(userTable.username, email))).get()


    if (!user) {
        // NOTE:
        // Returning immediately allows malicious actors to figure out valid emails from response times,
        // allowing them to only focus on guessing passwords in brute-force attacks.
        // As a preventive measure, you may want to hash passwords even for invalid emails.
        // However, valid emails can be already be revealed with the signup page
        // and a similar timing issue can likely be found in password reset implementation.
        // It will also be much more resource intensive.
        // Since protecting against this is non-trivial,
        // it is crucial your implementation is protected against brute-force attacks with login throttling etc.
        // If emails/usernames are public, you may outright tell the user that the username is invalid.
        return new Response("Invalid email or password", {
            status: 400
        });
    }

    const validPassword = await verify(user?.passwordHash as string, password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
    });
    if (!validPassword) {
        return new Response("Invalid email or password", {
            status: 400
        });
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    return new Response(null, {
        status: 302,
        headers: {
            Location: "/",
            "Set-Cookie": sessionCookie.serialize()
        }
    });
}
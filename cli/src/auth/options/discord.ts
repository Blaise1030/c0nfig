import { serializeCookie, parseCookies } from "oslo/cookie"
import { db, oauthAccountTable, userTable } from "~/db";
import { Discord, generateState } from "arctic";
import { and, eq } from "drizzle-orm";
import { generateId } from "lucia";
import { lucia } from "~/auth";


const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID as string;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET as string;

const discord = new Discord(DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET);

export async function discordOAuthRedirect(_: Request): Promise<Response> {
    const state = generateState();

    const url: URL = await discord.createAuthorizationURL(state, {
        scopes: ["identify"]
    });
    scopes: ["identify"]

    const discordOauthState = serializeCookie('discord_oauth_state', state, {
        path: '/',
        secure: true,
        httpOnly: true,
        maxAge: 600,
        sameSite: 'lax'
    })

    const response = new Response(null, { status: 302, headers: { Location: url.toString() } });
    response.headers.append("Set-Cookie", discordOauthState)
    return response
}

export async function discordOAuthCallback(request: Request) {
    const url = new URL(request.url)
    const params = new URLSearchParams(url.searchParams)

    const code = params.get('code')
    const state = params.get("state");

    const cookies = parseCookies(request.headers.get('cookie'))
    const storedState = cookies.get('discord_oauth_state')

    if (!code || !state || !storedState || state !== storedState)
        return new Response(null, { status: 400 });

    try {
        const tokens = await discord.validateAuthorizationCode(code);
        const response = await fetch("https://discord.com/api/users/@me", {
            headers: {
                Authorization: `Bearer ${tokens.accessToken}`
            }
        });
        const user = await response.json();
        const existingUser = (await db.select()
            .from(oauthAccountTable)
            .where(
                and(
                    eq(oauthAccountTable.providerId, 'discord'),
                    eq(oauthAccountTable.providerUserId, user?.id)
                )
            )
        )[0]

        if (existingUser) {
            const session = await lucia.createSession(existingUser?.userId, {});
            const sessionCookie = lucia.createSessionCookie(session.id);
            return new Response(null, {
                status: 302,
                headers: {
                    Location: url.toString(),
                    "Set-Cookie": sessionCookie.serialize()
                }
            });
        }

        const userId = generateId(15);

        await db.transaction(async (tx) => {
            await tx.insert(userTable).values({ id: userId, username: user?.login } as any)
            await tx.insert(oauthAccountTable).values({ providerId: 'discord', providerUserId: user.id, userId });
        })

        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);

        return new Response(null, {
            status: 302,
            headers: {
                Location: url.toString(),
                "Set-Cookie": sessionCookie.serialize()
            }
        });
    } catch (e) {
        return new Response(null, { status: 500 });
    }
}
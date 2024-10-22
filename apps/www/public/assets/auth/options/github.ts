import { serializeCookie, parseCookies } from "oslo/cookie"
import { db, oauthAccountTable, userTable } from "~/db";
import { GitHub, generateState } from "arctic";
import { and, eq } from "drizzle-orm";
import { generateId } from "lucia";
import { lucia } from "~/auth";

interface GitHubUser {
    id: string;
    login: string;
}

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID as string;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET as string;

const github = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET);

export async function githubOAuthRedirect(_: Request): Promise<Response> {
    const state = generateState();

    const url: URL = await github.createAuthorizationURL(state, {
        scopes: ["user:email"]
    });

    const githubOauthState = serializeCookie('github_oauth_state', state, {
        path: '/',
        secure: true,
        httpOnly: true,
        maxAge: 600,
        sameSite: 'lax'
    })

    const response = new Response(null, { status: 302, headers: { Location: url.toString() } });
    response.headers.append("Set-Cookie", githubOauthState)
    return response
}

export async function githubOAuthCallback(request: Request) {
    const url = new URL(request.url)
    const params = new URLSearchParams(url.searchParams)

    const code = params.get('code')
    const state = params.get("state");

    const cookies = parseCookies(request.headers.get('cookie'))
    const storedState = cookies.get('github_oauth_state')

    if (!code || !state || !storedState || state !== storedState)
        return new Response(null, { status: 400 });

    try {
        const tokens = await github.validateAuthorizationCode(code);
        const githubUserResponse = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${tokens.accessToken}`
            }
        });
        const user: GitHubUser = await githubUserResponse.json();
        const existingUser = (await db.select()
            .from(oauthAccountTable)
            .where(
                and(
                    eq(oauthAccountTable.providerId, 'github'),
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
            await tx.insert(oauthAccountTable).values({ providerId: 'github', providerUserId: user.id, userId });
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
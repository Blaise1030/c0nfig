import { Google, generateCodeVerifier, generateState } from "arctic";
import { serializeCookie, parseCookies } from "oslo/cookie"
import { db, oauthAccountTable, userTable } from "~/db";
import { and, eq } from "drizzle-orm";
import { generateId } from "lucia";
import { lucia } from "~/auth";


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

const google = new Google(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);

export async function googleOAuthRedirect(_: Request): Promise<Response> {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    const url: URL = await google.createAuthorizationURL(state, codeVerifier, {
        scopes: ["profile", "email"]
    });

    const googleOAuthState = serializeCookie('google_oauth_state', state, {
        path: '/',
        secure: true,
        httpOnly: true,
        maxAge: 600,
        sameSite: 'lax'
    })

    const googleCodeVerifier = serializeCookie('google_code_verifier', codeVerifier, {
        path: '/',
        secure: true,
        httpOnly: true,
        maxAge: 600,
        sameSite: 'lax'
    })

    const response = new Response(null, { status: 302, headers: { Location: url.toString() } });
    response.headers.append("Set-Cookie", googleOAuthState)
    response.headers.append("Set-Cookie", googleCodeVerifier)
    return response
}

export async function googleOAuthCallback(request: Request) {
    const url = new URL(request.url)
    const params = new URLSearchParams(url.searchParams)

    const code = params.get('code')
    const state = params.get("state");

    const cookies = parseCookies(request.headers.get('cookie'))
    const storedState = cookies.get('google_oauth_state')
    const codeVerifier = cookies.get('google_code_verifier')

    if (!code || !state || !storedState || state !== storedState)
        return new Response(null, { status: 400 });

    try {
        const tokens = await google.validateAuthorizationCode(code, codeVerifier);

        const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', { headers: { Authorization: `Bearer ${tokens?.accessToken}` } });
        const user = await response.json() as { name: string, email: string, sub: string };

        const existingUser = (await db.select().from(oauthAccountTable).where(and(eq(oauthAccountTable.providerId, 'google'), eq(oauthAccountTable.providerUserId, user?.sub))))[0]

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
            await tx.insert(userTable).values({ id: userId, username: user?.email } as any)
            await tx.insert(oauthAccountTable).values({ providerId: "google", providerUserId: user.sub, userId });
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
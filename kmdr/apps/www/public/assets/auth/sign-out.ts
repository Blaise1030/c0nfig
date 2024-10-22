import { lucia } from "./index";

export async function signOut(request: Request) {
    const session = lucia.readSessionCookie(request.headers.get("Cookie") ?? "");
    if (!session) return new Response(null, { status: 401 });
    await lucia.invalidateSession(session);
    const sessionCookie = lucia.createBlankSessionCookie();
    return new Response(null, {
        status: 302,
        headers: {
            Location: "/",
            "Set-Cookie": sessionCookie.serialize()
        }
    });
}
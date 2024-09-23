export const prerender = false;

import type { APIRoute } from "astro";
import { googleOAuthCallback, passwordSignUp } from "~/auth";

export const GET: APIRoute = async (param) => {
    return googleOAuthCallback(param?.request)
}
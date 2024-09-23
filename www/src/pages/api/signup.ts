export const prerender = false;

import type { APIRoute } from "astro";
import { passwordSignUp } from "~/auth";

export const POST: APIRoute = async (param) => {
    return passwordSignUp(param?.request)
}



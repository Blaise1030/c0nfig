/**
 * @module
 * Serve Static Middleware for Hono.
 */
import type { Context, Data } from '../../context';
import type { Env, MiddlewareHandler } from '../../types';
export type ServeStaticOptions<E extends Env = Env> = {
    root?: string;
    path?: string;
    mimes?: Record<string, string>;
    rewriteRequestPath?: (path: string) => string;
    onNotFound?: (path: string, c: Context<E>) => void | Promise<void>;
};
/**
 * This middleware is not directly used by the user. Create a wrapper specifying `getContent()` by the environment such as Deno or Bun.
 */
export declare const serveStatic: <E extends Env = Env>(options: ServeStaticOptions<E> & {
    getContent: (path: string, c: Context<E, any, {}>) => Promise<Data | Response | null>;
    pathResolve?: ((path: string) => string) | undefined;
    isDir?: ((path: string) => boolean | undefined | Promise<boolean | undefined>) | undefined;
}) => MiddlewareHandler;

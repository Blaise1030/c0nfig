// src/middleware/combine/index.ts
import { TrieRouter } from "../../router/trie-router/index.js";
import { METHOD_NAME_ALL } from "../../router.js";
import { compose } from "../../compose.js";
var some = (...middleware) => {
  return async function some2(c, next) {
    let lastError;
    for (const handler of middleware) {
      try {
        const result = await handler(c, next);
        if (result === true && !c.finalized) {
          await next();
        } else if (result === false) {
          lastError = new Error("No successful middleware found");
          continue;
        }
        lastError = void 0;
        break;
      } catch (error) {
        lastError = error;
        continue;
      }
    }
    if (lastError) {
      throw lastError;
    }
  };
};
var every = (...middleware) => {
  const wrappedMiddleware = middleware.map((m) => async (c, next) => {
    const res = await m(c, next);
    if (res === false) {
      throw new Error("Unmet condition");
    }
  });
  const handler = async (c, next) => compose(wrappedMiddleware.map((m) => [[m, void 0], c.req.param()]))(c, next);
  return async function every2(c, next) {
    await handler(c, next);
  };
};
var except = (condition, ...middleware) => {
  let router = void 0;
  const conditions = (Array.isArray(condition) ? condition : [condition]).map((condition2) => {
    if (typeof condition2 === "string") {
      router ||= new TrieRouter();
      router.add(METHOD_NAME_ALL, condition2, true);
    } else {
      return condition2;
    }
  }).filter(Boolean);
  if (router) {
    conditions.unshift((c) => !!router?.match(METHOD_NAME_ALL, c.req.path)?.[0]?.[0]?.[0]);
  }
  const handler = some((c) => conditions.some((cond) => cond(c)), every(...middleware));
  return async function except2(c, next) {
    await handler(c, next);
  };
};
export {
  every,
  except,
  some
};

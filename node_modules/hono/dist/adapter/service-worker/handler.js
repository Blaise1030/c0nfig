// src/adapter/service-worker/handler.ts
var handle = (app, opts = {
  fetch: globalThis.self !== void 0 ? globalThis.self.fetch : fetch
}) => {
  return (evt) => {
    evt.respondWith(
      (async () => {
        const res = await app.fetch(evt.request);
        if (opts.fetch && res.status === 404) {
          return await opts.fetch(evt.request);
        }
        return res;
      })()
    );
  };
};
export {
  handle
};

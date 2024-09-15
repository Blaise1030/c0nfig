// src/adapter/deno/websocket.ts
var upgradeWebSocket = (createEvents, options) => async (c, next) => {
  if (c.req.header("upgrade") !== "websocket") {
    return await next();
  }
  const events = await createEvents(c);
  const { response, socket } = Deno.upgradeWebSocket(c.req.raw, options || {});
  const wsContext = {
    binaryType: "arraybuffer",
    close: (code, reason) => socket.close(code, reason),
    get protocol() {
      return socket.protocol;
    },
    raw: socket,
    get readyState() {
      return socket.readyState;
    },
    url: socket.url ? new URL(socket.url) : null,
    send: (source) => socket.send(source)
  };
  socket.onopen = (evt) => events.onOpen?.(evt, wsContext);
  socket.onmessage = (evt) => events.onMessage?.(evt, wsContext);
  socket.onclose = (evt) => events.onClose?.(evt, wsContext);
  socket.onerror = (evt) => events.onError?.(evt, wsContext);
  return response;
};
export {
  upgradeWebSocket
};

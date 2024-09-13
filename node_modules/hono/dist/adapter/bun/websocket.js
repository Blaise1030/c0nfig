// src/adapter/bun/websocket.ts
import { createWSMessageEvent } from "../../helper/websocket/index.js";
import { getBunServer } from "./server.js";
var createWSContext = (ws) => {
  return {
    send: (source, options) => {
      const sendingData = typeof source === "string" ? source : source instanceof Uint8Array ? source.buffer : source;
      ws.send(sendingData, options?.compress);
    },
    raw: ws,
    binaryType: "arraybuffer",
    readyState: ws.readyState,
    url: ws.data.url,
    protocol: ws.data.protocol,
    close(code, reason) {
      ws.close(code, reason);
    }
  };
};
var createBunWebSocket = () => {
  const websocketConns = [];
  const upgradeWebSocket = (createEvents) => {
    return async (c, next) => {
      const server = getBunServer(c);
      if (!server) {
        throw new TypeError("env has to include the 2nd argument of fetch.");
      }
      const connId = websocketConns.push(await createEvents(c)) - 1;
      const upgradeResult = server.upgrade(c.req.raw, {
        data: {
          connId,
          url: new URL(c.req.url),
          protocol: c.req.url
        }
      });
      if (upgradeResult) {
        return new Response(null);
      }
      await next();
    };
  };
  const websocket = {
    open(ws) {
      const websocketListeners = websocketConns[ws.data.connId];
      if (websocketListeners.onOpen) {
        websocketListeners.onOpen(new Event("open"), createWSContext(ws));
      }
    },
    close(ws, code, reason) {
      const websocketListeners = websocketConns[ws.data.connId];
      if (websocketListeners.onClose) {
        websocketListeners.onClose(
          new CloseEvent("close", {
            code,
            reason
          }),
          createWSContext(ws)
        );
      }
    },
    message(ws, message) {
      const websocketListeners = websocketConns[ws.data.connId];
      if (websocketListeners.onMessage) {
        const normalizedReceiveData = typeof message === "string" ? message : message.buffer;
        websocketListeners.onMessage(
          createWSMessageEvent(normalizedReceiveData),
          createWSContext(ws)
        );
      }
    }
  };
  return {
    upgradeWebSocket,
    websocket
  };
};
export {
  createBunWebSocket
};

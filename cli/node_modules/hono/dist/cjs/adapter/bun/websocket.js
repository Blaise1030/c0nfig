"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var websocket_exports = {};
__export(websocket_exports, {
  createBunWebSocket: () => createBunWebSocket
});
module.exports = __toCommonJS(websocket_exports);
var import_websocket = require("../../helper/websocket");
var import_server = require("./server");
const createWSContext = (ws) => {
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
const createBunWebSocket = () => {
  const websocketConns = [];
  const upgradeWebSocket = (createEvents) => {
    return async (c, next) => {
      const server = (0, import_server.getBunServer)(c);
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
          (0, import_websocket.createWSMessageEvent)(normalizedReceiveData),
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createBunWebSocket
});

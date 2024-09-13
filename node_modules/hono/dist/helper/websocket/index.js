// src/helper/websocket/index.ts
var createWSMessageEvent = (source) => {
  return new MessageEvent("message", {
    data: source
  });
};
export {
  createWSMessageEvent
};

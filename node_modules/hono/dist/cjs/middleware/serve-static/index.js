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
var serve_static_exports = {};
__export(serve_static_exports, {
  serveStatic: () => serveStatic
});
module.exports = __toCommonJS(serve_static_exports);
var import_filepath = require("../../utils/filepath");
var import_mime = require("../../utils/mime");
const DEFAULT_DOCUMENT = "index.html";
const defaultPathResolve = (path) => path;
const serveStatic = (options) => {
  return async (c, next) => {
    if (c.finalized) {
      await next();
      return;
    }
    let filename = options.path ?? decodeURI(c.req.path);
    filename = options.rewriteRequestPath ? options.rewriteRequestPath(filename) : filename;
    const root = options.root;
    if (!filename.endsWith("/") && options.isDir) {
      const path2 = (0, import_filepath.getFilePathWithoutDefaultDocument)({
        filename,
        root
      });
      if (path2 && await options.isDir(path2)) {
        filename = filename + "/";
      }
    }
    let path = (0, import_filepath.getFilePath)({
      filename,
      root,
      defaultDocument: DEFAULT_DOCUMENT
    });
    if (!path) {
      return await next();
    }
    const getContent = options.getContent;
    const pathResolve = options.pathResolve ?? defaultPathResolve;
    path = pathResolve(path);
    let content = await getContent(path, c);
    if (!content) {
      let pathWithOutDefaultDocument = (0, import_filepath.getFilePathWithoutDefaultDocument)({
        filename,
        root
      });
      if (!pathWithOutDefaultDocument) {
        return await next();
      }
      pathWithOutDefaultDocument = pathResolve(pathWithOutDefaultDocument);
      if (pathWithOutDefaultDocument !== path) {
        content = await getContent(pathWithOutDefaultDocument, c);
        if (content) {
          path = pathWithOutDefaultDocument;
        }
      }
    }
    if (content instanceof Response) {
      return c.newResponse(content.body, content);
    }
    if (content) {
      let mimeType;
      if (options.mimes) {
        mimeType = (0, import_mime.getMimeType)(path, options.mimes) ?? (0, import_mime.getMimeType)(path);
      } else {
        mimeType = (0, import_mime.getMimeType)(path);
      }
      if (mimeType) {
        c.header("Content-Type", mimeType);
      }
      return c.body(content);
    }
    await options.onNotFound?.(path, c);
    await next();
    return;
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  serveStatic
});

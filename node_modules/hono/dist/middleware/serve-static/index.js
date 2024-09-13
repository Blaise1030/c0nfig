// src/middleware/serve-static/index.ts
import { getFilePath, getFilePathWithoutDefaultDocument } from "../../utils/filepath.js";
import { getMimeType } from "../../utils/mime.js";
var DEFAULT_DOCUMENT = "index.html";
var defaultPathResolve = (path) => path;
var serveStatic = (options) => {
  return async (c, next) => {
    if (c.finalized) {
      await next();
      return;
    }
    let filename = options.path ?? decodeURI(c.req.path);
    filename = options.rewriteRequestPath ? options.rewriteRequestPath(filename) : filename;
    const root = options.root;
    if (!filename.endsWith("/") && options.isDir) {
      const path2 = getFilePathWithoutDefaultDocument({
        filename,
        root
      });
      if (path2 && await options.isDir(path2)) {
        filename = filename + "/";
      }
    }
    let path = getFilePath({
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
      let pathWithOutDefaultDocument = getFilePathWithoutDefaultDocument({
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
        mimeType = getMimeType(path, options.mimes) ?? getMimeType(path);
      } else {
        mimeType = getMimeType(path);
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
export {
  serveStatic
};

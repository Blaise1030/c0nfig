// src/adapter/deno/serve-static.ts
import { serveStatic as baseServeStatic } from "../../middleware/serve-static/index.js";
var { open, lstatSync } = Deno;
var serveStatic = (options) => {
  return async function serveStatic2(c, next) {
    const getContent = async (path) => {
      try {
        const file = await open(path);
        return file ? file.readable : null;
      } catch (e) {
        console.warn(`${e}`);
      }
    };
    const pathResolve = (path) => {
      return `./${path}`;
    };
    const isDir = (path) => {
      let isDir2;
      try {
        const stat = lstatSync(path);
        isDir2 = stat.isDirectory;
      } catch {
      }
      return isDir2;
    };
    return baseServeStatic({
      ...options,
      getContent,
      pathResolve,
      isDir
    })(c, next);
  };
};
export {
  serveStatic
};

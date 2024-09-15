// src/jsx/jsx-runtime.ts
import { jsxDEV, Fragment } from "./jsx-dev-runtime.js";
import { jsxDEV as jsxDEV2 } from "./jsx-dev-runtime.js";
import { html, raw } from "../helper/html/index.js";
var jsxAttr = (name, value) => typeof value === "string" ? raw(name + '="' + html`${value}` + '"') : html`${name}="${value}"`;
var jsxEscape = (value) => value;
export {
  Fragment,
  jsxDEV as jsx,
  jsxAttr,
  jsxEscape,
  html as jsxTemplate,
  jsxDEV2 as jsxs
};

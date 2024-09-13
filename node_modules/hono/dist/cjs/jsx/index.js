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
var jsx_exports = {};
__export(jsx_exports, {
  Children: () => import_children.Children,
  ErrorBoundary: () => import_components.ErrorBoundary,
  Fragment: () => import_base.Fragment,
  StrictMode: () => import_base.Fragment,
  Suspense: () => import_streaming.Suspense,
  cloneElement: () => import_base.cloneElement,
  createContext: () => import_context.createContext,
  createElement: () => import_base.jsx,
  createRef: () => import_hooks.createRef,
  default: () => jsx_default,
  forwardRef: () => import_hooks.forwardRef,
  isValidElement: () => import_base.isValidElement,
  jsx: () => import_base.jsx,
  memo: () => import_base.memo,
  startTransition: () => import_hooks.startTransition,
  startViewTransition: () => import_hooks.startViewTransition,
  use: () => import_hooks.use,
  useActionState: () => import_hooks2.useActionState,
  useCallback: () => import_hooks.useCallback,
  useContext: () => import_context.useContext,
  useDebugValue: () => import_hooks.useDebugValue,
  useDeferredValue: () => import_hooks.useDeferredValue,
  useEffect: () => import_hooks.useEffect,
  useId: () => import_hooks.useId,
  useImperativeHandle: () => import_hooks.useImperativeHandle,
  useInsertionEffect: () => import_hooks.useInsertionEffect,
  useLayoutEffect: () => import_hooks.useLayoutEffect,
  useMemo: () => import_hooks.useMemo,
  useOptimistic: () => import_hooks2.useOptimistic,
  useReducer: () => import_hooks.useReducer,
  useRef: () => import_hooks.useRef,
  useState: () => import_hooks.useState,
  useSyncExternalStore: () => import_hooks.useSyncExternalStore,
  useTransition: () => import_hooks.useTransition,
  useViewTransition: () => import_hooks.useViewTransition,
  version: () => import_base.reactAPICompatVersion
});
module.exports = __toCommonJS(jsx_exports);
var import_base = require("./base");
var import_children = require("./children");
var import_components = require("./components");
var import_context = require("./context");
var import_hooks = require("./hooks");
var import_hooks2 = require("./dom/hooks");
var import_streaming = require("./streaming");
var jsx_default = {
  version: import_base.reactAPICompatVersion,
  memo: import_base.memo,
  Fragment: import_base.Fragment,
  StrictMode: import_base.Fragment,
  isValidElement: import_base.isValidElement,
  createElement: import_base.jsx,
  cloneElement: import_base.cloneElement,
  ErrorBoundary: import_components.ErrorBoundary,
  createContext: import_context.createContext,
  useContext: import_context.useContext,
  useState: import_hooks.useState,
  useEffect: import_hooks.useEffect,
  useRef: import_hooks.useRef,
  useCallback: import_hooks.useCallback,
  useReducer: import_hooks.useReducer,
  useId: import_hooks.useId,
  useDebugValue: import_hooks.useDebugValue,
  use: import_hooks.use,
  startTransition: import_hooks.startTransition,
  useTransition: import_hooks.useTransition,
  useDeferredValue: import_hooks.useDeferredValue,
  startViewTransition: import_hooks.startViewTransition,
  useViewTransition: import_hooks.useViewTransition,
  useMemo: import_hooks.useMemo,
  useLayoutEffect: import_hooks.useLayoutEffect,
  useInsertionEffect: import_hooks.useInsertionEffect,
  createRef: import_hooks.createRef,
  forwardRef: import_hooks.forwardRef,
  useImperativeHandle: import_hooks.useImperativeHandle,
  useSyncExternalStore: import_hooks.useSyncExternalStore,
  useActionState: import_hooks2.useActionState,
  useOptimistic: import_hooks2.useOptimistic,
  Suspense: import_streaming.Suspense,
  Children: import_children.Children
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Children,
  ErrorBoundary,
  Fragment,
  StrictMode,
  Suspense,
  cloneElement,
  createContext,
  createElement,
  createRef,
  forwardRef,
  isValidElement,
  jsx,
  memo,
  startTransition,
  startViewTransition,
  use,
  useActionState,
  useCallback,
  useContext,
  useDebugValue,
  useDeferredValue,
  useEffect,
  useId,
  useImperativeHandle,
  useInsertionEffect,
  useLayoutEffect,
  useMemo,
  useOptimistic,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
  useViewTransition,
  version
});

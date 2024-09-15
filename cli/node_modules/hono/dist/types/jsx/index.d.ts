/**
 * @module
 * JSX for Hono.
 */
import { Fragment, cloneElement, isValidElement, jsx, memo, reactAPICompatVersion } from './base';
import type { DOMAttributes } from './base';
import { Children } from './children';
import { ErrorBoundary } from './components';
import { createContext, useContext } from './context';
import { createRef, forwardRef, startTransition, startViewTransition, use, useCallback, useDebugValue, useDeferredValue, useEffect, useId, useImperativeHandle, useInsertionEffect, useLayoutEffect, useMemo, useReducer, useRef, useState, useSyncExternalStore, useTransition, useViewTransition } from './hooks';
import { useActionState, useOptimistic } from './dom/hooks';
import { Suspense } from './streaming';
export { reactAPICompatVersion as version, jsx, memo, Fragment, Fragment as StrictMode, isValidElement, jsx as createElement, cloneElement, ErrorBoundary, createContext, useContext, useState, useEffect, useRef, useCallback, useReducer, useId, useDebugValue, use, startTransition, useTransition, useDeferredValue, startViewTransition, useViewTransition, useMemo, useLayoutEffect, useInsertionEffect, createRef, forwardRef, useImperativeHandle, useSyncExternalStore, useActionState, useOptimistic, Suspense, Children, DOMAttributes, };
declare const _default: {
    version: string;
    memo: <T>(component: import("./base").FC<T>, propsAreEqual?: (prevProps: Readonly<T>, nextProps: Readonly<T>) => boolean) => import("./base").FC<T>;
    Fragment: ({ children, }: {
        key?: string | undefined;
        children?: import("../utils/html").HtmlEscapedString | import("./base").Child;
    }) => import("../utils/html").HtmlEscapedString;
    StrictMode: ({ children, }: {
        key?: string | undefined;
        children?: import("../utils/html").HtmlEscapedString | import("./base").Child;
    }) => import("../utils/html").HtmlEscapedString;
    isValidElement: (element: unknown) => element is import("./base").JSXNode;
    createElement: (tag: string | Function, props: import("./base").Props | null, ...children: (string | number | import("../utils/html").HtmlEscapedString)[]) => import("./base").JSXNode;
    cloneElement: <T_1 extends import("./base").JSXNode | import("./base").JSX.Element>(element: T_1, props: Partial<import("./base").Props>, ...children: import("./base").Child[]) => T_1;
    ErrorBoundary: import("./base").FC<import("./types").PropsWithChildren<{
        fallback?: import("./base").Child;
        fallbackRender?: import("./components").FallbackRender | undefined;
        onError?: import("./components").ErrorHandler | undefined;
    }>>;
    createContext: <T_2>(defaultValue: T_2) => import("./context").Context<T_2>;
    useContext: <T_3>(context: import("./context").Context<T_3>) => T_3;
    useState: {
        <T_4>(initialState: T_4 | (() => T_4)): [T_4, (newState: T_4 | ((currentState: T_4) => T_4)) => void];
        <T_5 = undefined>(): [T_5 | undefined, (newState: T_5 | ((currentState: T_5 | undefined) => T_5 | undefined) | undefined) => void];
    };
    useEffect: (effect: () => void | (() => void), deps?: readonly unknown[] | undefined) => void;
    useRef: <T_6>(initialValue: T_6 | null) => import("./hooks").RefObject<T_6>;
    useCallback: <T_7 extends Function>(callback: T_7, deps: readonly unknown[]) => T_7;
    useReducer: <T_8, A>(reducer: (state: T_8, action: A) => T_8, initialArg: T_8, init?: ((initialState: T_8) => T_8) | undefined) => [T_8, (action: A) => void];
    useId: () => string;
    useDebugValue: (_value: unknown, _formatter?: ((value: unknown) => string) | undefined) => void;
    use: <T_9>(promise: Promise<T_9>) => T_9;
    startTransition: (callback: () => void) => void;
    useTransition: () => [boolean, (callback: () => void | Promise<void>) => void];
    useDeferredValue: <T_10>(value: T_10, initialValue?: T_10 | undefined) => T_10;
    startViewTransition: (callback: () => void) => void;
    useViewTransition: () => [boolean, (callback: () => void) => void];
    useMemo: <T_11>(factory: () => T_11, deps: readonly unknown[]) => T_11;
    useLayoutEffect: (effect: () => void | (() => void), deps?: readonly unknown[] | undefined) => void;
    useInsertionEffect: (effect: () => void | (() => void), deps?: readonly unknown[] | undefined) => void;
    createRef: <T_12>() => import("./hooks").RefObject<T_12>;
    forwardRef: <T_13, P = {}>(Component: (props: P, ref?: import("./hooks").RefObject<T_13> | undefined) => import("./base").JSX.Element) => (props: P & {
        ref?: import("./hooks").RefObject<T_13> | undefined;
    }) => import("./base").JSX.Element;
    useImperativeHandle: <T_14>(ref: import("./hooks").RefObject<T_14>, createHandle: () => T_14, deps: readonly unknown[]) => void;
    useSyncExternalStore: <T_15>(subscribe: (callback: (value: T_15) => void) => () => void, getSnapshot: () => T_15, getServerSnapshot?: (() => T_15) | undefined) => T_15;
    useActionState: <T_16>(fn: Function, initialState: T_16, permalink?: string | undefined) => [T_16, Function];
    useOptimistic: <T_17, N>(state: T_17, updateState: (currentState: T_17, action: N) => T_17) => [T_17, (action: N) => void];
    Suspense: import("./base").FC<import("./types").PropsWithChildren<{
        fallback: any;
    }>>;
    Children: {
        map: (children: import("./base").Child[], fn: (child: import("./base").Child, index: number) => import("./base").Child) => import("./base").Child[];
        forEach: (children: import("./base").Child[], fn: (child: import("./base").Child, index: number) => void) => void;
        count: (children: import("./base").Child[]) => number;
        only: (_children: import("./base").Child[]) => import("./base").Child;
        toArray: (children: import("./base").Child) => import("./base").Child[];
    };
};
export default _default;
export type * from './types';
export type { JSX } from './intrinsic-elements';

/**
 * @module
 * This module provides APIs for `hono/jsx/dom`.
 */
import { isValidElement, memo, reactAPICompatVersion } from '../base';
import type { Child, DOMAttributes, JSX, JSXNode, Props } from '../base';
import { Children } from '../children';
import { useContext } from '../context';
import { createRef, forwardRef, startTransition, startViewTransition, use, useCallback, useDebugValue, useDeferredValue, useEffect, useId, useImperativeHandle, useInsertionEffect, useLayoutEffect, useMemo, useReducer, useRef, useState, useSyncExternalStore, useTransition, useViewTransition } from '../hooks';
import { useActionState, useFormStatus, useOptimistic } from './hooks';
import { ErrorBoundary, Suspense } from './components';
import { createContext } from './context';
import { Fragment } from './jsx-runtime';
import { createPortal, flushSync } from './render';
export { render } from './render';
declare const createElement: (tag: string | ((props: Props) => JSXNode), props: Props | null, ...children: Child[]) => JSXNode;
declare const cloneElement: <T extends JSXNode | JSX.Element>(element: T, props: Props, ...children: Child[]) => T;
export { reactAPICompatVersion as version, createElement as jsx, useState, useEffect, useRef, useCallback, use, startTransition, useTransition, useDeferredValue, startViewTransition, useViewTransition, useMemo, useLayoutEffect, useInsertionEffect, useReducer, useId, useDebugValue, createRef, forwardRef, useImperativeHandle, useSyncExternalStore, useFormStatus, useActionState, useOptimistic, Suspense, ErrorBoundary, createContext, useContext, memo, isValidElement, createElement, cloneElement, Children, Fragment, Fragment as StrictMode, DOMAttributes, flushSync, createPortal, };
declare const _default: {
    version: string;
    useState: {
        <T>(initialState: T | (() => T)): [T, (newState: T | ((currentState: T) => T)) => void];
        <T_1 = undefined>(): [T_1 | undefined, (newState: T_1 | ((currentState: T_1 | undefined) => T_1 | undefined) | undefined) => void];
    };
    useEffect: (effect: () => void | (() => void), deps?: readonly unknown[] | undefined) => void;
    useRef: <T_2>(initialValue: T_2 | null) => import("../hooks").RefObject<T_2>;
    useCallback: <T_3 extends Function>(callback: T_3, deps: readonly unknown[]) => T_3;
    use: <T_4>(promise: Promise<T_4>) => T_4;
    startTransition: (callback: () => void) => void;
    useTransition: () => [boolean, (callback: () => void | Promise<void>) => void];
    useDeferredValue: <T_5>(value: T_5, initialValue?: T_5 | undefined) => T_5;
    startViewTransition: (callback: () => void) => void;
    useViewTransition: () => [boolean, (callback: () => void) => void];
    useMemo: <T_6>(factory: () => T_6, deps: readonly unknown[]) => T_6;
    useLayoutEffect: (effect: () => void | (() => void), deps?: readonly unknown[] | undefined) => void;
    useInsertionEffect: (effect: () => void | (() => void), deps?: readonly unknown[] | undefined) => void;
    useReducer: <T_7, A>(reducer: (state: T_7, action: A) => T_7, initialArg: T_7, init?: ((initialState: T_7) => T_7) | undefined) => [T_7, (action: A) => void];
    useId: () => string;
    useDebugValue: (_value: unknown, _formatter?: ((value: unknown) => string) | undefined) => void;
    createRef: <T_8>() => import("../hooks").RefObject<T_8>;
    forwardRef: <T_9, P = {}>(Component: (props: P, ref?: import("../hooks").RefObject<T_9> | undefined) => JSX.Element) => (props: P & {
        ref?: import("../hooks").RefObject<T_9> | undefined;
    }) => JSX.Element;
    useImperativeHandle: <T_10>(ref: import("../hooks").RefObject<T_10>, createHandle: () => T_10, deps: readonly unknown[]) => void;
    useSyncExternalStore: <T_11>(subscribe: (callback: (value: T_11) => void) => () => void, getSnapshot: () => T_11, getServerSnapshot?: (() => T_11) | undefined) => T_11;
    useFormStatus: () => {
        pending: false;
        data: null;
        method: null;
        action: null;
    } | {
        pending: true;
        data: FormData;
        method: "get" | "post";
        action: string | ((formData: FormData) => void | Promise<void>);
    };
    useActionState: <T_12>(fn: Function, initialState: T_12, permalink?: string | undefined) => [T_12, Function];
    useOptimistic: <T_13, N>(state: T_13, updateState: (currentState: T_13, action: N) => T_13) => [T_13, (action: N) => void];
    Suspense: import("../base").FC<import("../types").PropsWithChildren<{
        fallback: any;
    }>>;
    ErrorBoundary: import("../base").FC<import("../types").PropsWithChildren<{
        fallback?: Child;
        fallbackRender?: import("../components").FallbackRender | undefined;
        onError?: import("../components").ErrorHandler | undefined;
    }>>;
    createContext: <T_14>(defaultValue: T_14) => import("../context").Context<T_14>;
    useContext: <T_15>(context: import("../context").Context<T_15>) => T_15;
    memo: <T_16>(component: import("../base").FC<T_16>, propsAreEqual?: (prevProps: Readonly<T_16>, nextProps: Readonly<T_16>) => boolean) => import("../base").FC<T_16>;
    isValidElement: (element: unknown) => element is JSXNode;
    createElement: (tag: string | ((props: Props) => JSXNode), props: Props | null, ...children: Child[]) => JSXNode;
    cloneElement: <T_17 extends JSXNode | JSX.Element>(element: T_17, props: Props, ...children: Child[]) => T_17;
    Children: {
        map: (children: Child[], fn: (child: Child, index: number) => Child) => Child[];
        forEach: (children: Child[], fn: (child: Child, index: number) => void) => void;
        count: (children: Child[]) => number;
        only: (_children: Child[]) => Child;
        toArray: (children: Child) => Child[];
    };
    Fragment: (props: Record<string, unknown>) => JSXNode;
    StrictMode: (props: Record<string, unknown>) => JSXNode;
    flushSync: (callback: () => void) => void;
    createPortal: (children: Child, container: HTMLElement, key?: string | undefined) => Child;
};
export default _default;
export type { Context } from '../context';
export type * from '../types';

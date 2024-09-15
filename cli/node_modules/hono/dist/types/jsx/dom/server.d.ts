/**
 * @module
 * This module provides APIs for `hono/jsx/server`, which is compatible with `react-dom/server`.
 */
import type { Child } from '../base';
import version from './';
export interface RenderToStringOptions {
    identifierPrefix?: string;
}
/**
 * Render JSX element to string.
 * @param element JSX element to render.
 * @param options Options for rendering.
 * @returns Rendered string.
 */
declare const renderToString: (element: Child, options?: RenderToStringOptions) => string;
export interface RenderToReadableStreamOptions {
    identifierPrefix?: string;
    namespaceURI?: string;
    nonce?: string;
    bootstrapScriptContent?: string;
    bootstrapScripts?: string[];
    bootstrapModules?: string[];
    progressiveChunkSize?: number;
    signal?: AbortSignal;
    onError?: (error: unknown) => string | void;
}
/**
 * Render JSX element to readable stream.
 * @param element JSX element to render.
 * @param options Options for rendering.
 * @returns Rendered readable stream.
 */
declare const renderToReadableStream: (element: Child, options?: RenderToReadableStreamOptions) => Promise<ReadableStream<Uint8Array>>;
export { renderToString, renderToReadableStream, version };
declare const _default: {
    renderToString: (element: Child, options?: RenderToStringOptions) => string;
    renderToReadableStream: (element: Child, options?: RenderToReadableStreamOptions) => Promise<ReadableStream<Uint8Array>>;
    version: {
        version: string;
        useState: {
            <T>(initialState: T | (() => T)): [T, (newState: T | ((currentState: T) => T)) => void];
            <T_1 = undefined>(): [T_1 | undefined, (newState: T_1 | ((currentState: T_1 | undefined) => T_1 | undefined) | undefined) => void];
        };
        useEffect: (effect: () => void | (() => void), deps?: readonly unknown[] | undefined) => void;
        useRef: <T_2>(initialValue: T_2 | null) => import("./").RefObject<T_2>;
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
        createRef: <T_8>() => import("./").RefObject<T_8>;
        forwardRef: <T_9, P = {}>(Component: (props: P, ref?: import("./").RefObject<T_9> | undefined) => import("../base").JSX.Element) => (props: P & {
            ref?: import("./").RefObject<T_9> | undefined;
        }) => import("../base").JSX.Element;
        useImperativeHandle: <T_10>(ref: import("./").RefObject<T_10>, createHandle: () => T_10, deps: readonly unknown[]) => void;
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
        Suspense: import("./").FC<import("./").PropsWithChildren<{
            fallback: any;
        }>>;
        ErrorBoundary: import("./").FC<import("./").PropsWithChildren<{
            fallback?: Child;
            fallbackRender?: import("../components").FallbackRender | undefined;
            onError?: import("../components").ErrorHandler | undefined;
        }>>;
        createContext: <T_14>(defaultValue: T_14) => import("./").Context<T_14>;
        useContext: <T_15>(context: import("./").Context<T_15>) => T_15;
        memo: <T_16>(component: import("./").FC<T_16>, propsAreEqual?: (prevProps: Readonly<T_16>, nextProps: Readonly<T_16>) => boolean) => import("./").FC<T_16>;
        isValidElement: (element: unknown) => element is import("./").JSXNode;
        createElement: (tag: string | ((props: import("../base").Props) => import("./").JSXNode), props: import("../base").Props | null, ...children: Child[]) => import("./").JSXNode;
        cloneElement: <T_17 extends import("./").JSXNode | import("../base").JSX.Element>(element: T_17, props: import("../base").Props, ...children: Child[]) => T_17;
        Children: {
            map: (children: Child[], fn: (child: Child, index: number) => Child) => Child[];
            forEach: (children: Child[], fn: (child: Child, index: number) => void) => void;
            count: (children: Child[]) => number;
            only: (_children: Child[]) => Child;
            toArray: (children: Child) => Child[];
        };
        Fragment: (props: Record<string, unknown>) => import("./").JSXNode;
        StrictMode: (props: Record<string, unknown>) => import("./").JSXNode;
        flushSync: (callback: () => void) => void;
        createPortal: (children: Child, container: HTMLElement, key?: string | undefined) => Child;
    };
};
export default _default;

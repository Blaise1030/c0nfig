import type { UpgradeWebSocket } from '../../helper/websocket';
interface BunServerWebSocket<T> {
    send(data: string | ArrayBufferLike, compress?: boolean): void;
    close(code?: number, reason?: string): void;
    data: T;
    readyState: 0 | 1 | 2 | 3;
}
interface BunWebSocketHandler<T> {
    open(ws: BunServerWebSocket<T>): void;
    close(ws: BunServerWebSocket<T>, code?: number, reason?: string): void;
    message(ws: BunServerWebSocket<T>, message: string | Uint8Array): void;
}
interface CreateWebSocket {
    (): {
        upgradeWebSocket: UpgradeWebSocket;
        websocket: BunWebSocketHandler<BunWebSocketData>;
    };
}
export interface BunWebSocketData {
    connId: number;
    url: URL;
    protocol: string;
}
export declare const createBunWebSocket: CreateWebSocket;
export {};

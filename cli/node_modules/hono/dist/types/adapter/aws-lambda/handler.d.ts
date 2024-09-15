import type { Hono } from '../../hono';
import type { Env, Schema } from '../../types';
import type { ALBRequestContext, ApiGatewayRequestContext, ApiGatewayRequestContextV2, Handler, LambdaContext } from './types';
export type LambdaEvent = APIGatewayProxyEvent | APIGatewayProxyEventV2 | ALBProxyEvent;
export interface APIGatewayProxyEventV2 {
    version: string;
    routeKey: string;
    headers: Record<string, string | undefined>;
    multiValueHeaders?: undefined;
    cookies?: string[];
    rawPath: string;
    rawQueryString: string;
    body: string | null;
    isBase64Encoded: boolean;
    requestContext: ApiGatewayRequestContextV2;
    queryStringParameters?: {
        [name: string]: string | undefined;
    };
    pathParameters?: {
        [name: string]: string | undefined;
    };
    stageVariables?: {
        [name: string]: string | undefined;
    };
}
export interface APIGatewayProxyEvent {
    version: string;
    httpMethod: string;
    headers: Record<string, string | undefined>;
    multiValueHeaders?: {
        [headerKey: string]: string[];
    };
    path: string;
    body: string | null;
    isBase64Encoded: boolean;
    queryStringParameters?: Record<string, string | undefined>;
    requestContext: ApiGatewayRequestContext;
    resource: string;
    multiValueQueryStringParameters?: {
        [parameterKey: string]: string[];
    };
    pathParameters?: Record<string, string>;
    stageVariables?: Record<string, string>;
}
export interface ALBProxyEvent {
    httpMethod: string;
    headers?: Record<string, string | undefined>;
    multiValueHeaders?: Record<string, string[] | undefined>;
    path: string;
    body: string | null;
    isBase64Encoded: boolean;
    queryStringParameters?: Record<string, string | undefined>;
    multiValueQueryStringParameters?: {
        [parameterKey: string]: string[];
    };
    requestContext: ALBRequestContext;
}
export interface APIGatewayProxyResult {
    statusCode: number;
    statusDescription?: string;
    body: string;
    headers: Record<string, string>;
    cookies?: string[];
    multiValueHeaders?: {
        [headerKey: string]: string[];
    };
    isBase64Encoded: boolean;
}
export declare const streamHandle: <E extends Env = Env, S extends Schema = {}, BasePath extends string = "/">(app: Hono<E, S, BasePath>) => Handler;
/**
 * Accepts events from API Gateway/ELB(`APIGatewayProxyEvent`) and directly through Function Url(`APIGatewayProxyEventV2`)
 */
export declare const handle: <E extends Env = Env, S extends Schema = {}, BasePath extends string = "/">(app: Hono<E, S, BasePath>) => (event: LambdaEvent, lambdaContext?: LambdaContext) => Promise<APIGatewayProxyResult>;
declare abstract class EventProcessor<E extends LambdaEvent> {
    protected abstract getPath(event: E): string;
    protected abstract getMethod(event: E): string;
    protected abstract getQueryString(event: E): string;
    protected abstract getHeaders(event: E): Headers;
    protected abstract getCookies(event: E, headers: Headers): void;
    protected abstract setCookiesToResult(event: E, result: APIGatewayProxyResult, cookies: string[]): void;
    createRequest(event: E): Request;
    createResult(event: E, res: Response): Promise<APIGatewayProxyResult>;
    setCookies(event: E, res: Response, result: APIGatewayProxyResult): void;
}
export declare const getProcessor: (event: LambdaEvent) => EventProcessor<LambdaEvent>;
export declare const isContentTypeBinary: (contentType: string) => boolean;
export declare const isContentEncodingBinary: (contentEncoding: string | null) => boolean;
export {};

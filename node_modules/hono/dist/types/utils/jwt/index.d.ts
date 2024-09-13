/**
 * @module
 * JWT utility.
 */
export declare const Jwt: {
    sign: (payload: import("./types").JWTPayload, privateKey: import("./jws").SignatureKey, alg?: "HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "PS256" | "PS384" | "PS512" | "ES256" | "ES384" | "ES512" | "EdDSA") => Promise<string>;
    verify: (token: string, publicKey: import("./jws").SignatureKey, alg?: "HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "PS256" | "PS384" | "PS512" | "ES256" | "ES384" | "ES512" | "EdDSA") => Promise<import("./types").JWTPayload>;
    decode: (token: string) => {
        header: import("./jwt").TokenHeader;
        payload: import("./types").JWTPayload;
    };
};

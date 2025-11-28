export declare const SESSION_MAX_AGE: number;
export declare const REMEMBER_ME_MAX_AGE: number;
export interface JWTPayload {
    id: string;
    email: string;
    role: 'LEADER' | 'MEMBER';
}
export interface JWTOptions {
    maxAge?: number;
}
/**
 * Signs a JWT token with user payload
 * @param payload - User data to encode in JWT
 * @param options - Optional configuration (maxAge)
 * @returns Signed JWT token string
 */
export declare function signJWT(payload: JWTPayload, options?: JWTOptions): string;
/**
 * Verifies and decodes a JWT token
 * @param token - JWT token string to verify
 * @returns Decoded JWT payload
 * @throws Error if token is invalid or expired
 */
export declare function verifyJWT(token: string): JWTPayload;
//# sourceMappingURL=jwt.d.ts.map
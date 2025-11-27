import jwt from 'jsonwebtoken'

// Session duration constants (in seconds)
export const SESSION_MAX_AGE = 7 * 24 * 60 * 60 // 7 days
export const REMEMBER_ME_MAX_AGE = 30 * 24 * 60 * 60 // 30 days

// JWT payload interface
export interface JWTPayload {
  id: string
  email: string
  role: 'LEADER' | 'MEMBER'
}

// JWT options interface
export interface JWTOptions {
  maxAge?: number
}

/**
 * Signs a JWT token with user payload
 * @param payload - User data to encode in JWT
 * @param options - Optional configuration (maxAge)
 * @returns Signed JWT token string
 */
export function signJWT(payload: JWTPayload, options?: JWTOptions): string {
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET or NEXTAUTH_SECRET environment variable is not set')
  }

  const maxAge = options?.maxAge || SESSION_MAX_AGE

  return jwt.sign(payload, secret, {
    expiresIn: maxAge,
  })
}

/**
 * Verifies and decodes a JWT token
 * @param token - JWT token string to verify
 * @returns Decoded JWT payload
 * @throws Error if token is invalid or expired
 */
export function verifyJWT(token: string): JWTPayload {
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET or NEXTAUTH_SECRET environment variable is not set')
  }

  try {
    const decoded = jwt.verify(token, secret) as JWTPayload
    return decoded
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired')
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token')
    }
    throw error
  }
}

import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.BETTER_AUTH_SECRET || 'fallback-secret-key-min-32-chars!!');

export interface JWTPayload {
    id: string;
    name: string;
    email: string;
    role: string;
}

/**
 * Create a signed JWT token from user data.
 * Token expires in 7 days.
 */
export async function createToken(user: JWTPayload): Promise<string> {
    return await new SignJWT({ ...user })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .setIssuedAt()
        .sign(secret);
}

/**
 * Verify and decode a JWT token.
 * Returns the user payload or null if invalid/expired.
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload as unknown as JWTPayload;
    } catch {
        return null;
    }
}

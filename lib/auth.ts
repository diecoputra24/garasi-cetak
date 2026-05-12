import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

// Security Best Practice: Check environment to toggle strict security features
const isProduction = process.env.NODE_ENV === "production";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // Updated to PostgreSQL
    }),
    emailAndPassword: {
        enabled: true,
        // Security Best Practice: Enforce minimum password security
        minPasswordLength: 8,
        maxPasswordLength: 64,
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24,    // Update session once a day
        // Security Best Practice: Use a secure cookie name prefix
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60 // 5 minutes
        }
    },
    // roles added to user table
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "user",
            },
        },
    },
    trustedOrigins: [
        process.env.BETTER_AUTH_URL as string,
        ...(process.env.TRUSTED_ORIGINS ? process.env.TRUSTED_ORIGINS.split(',').map(url => url.trim()) : [])
    ].filter(Boolean),
    advanced: {
        // Security Best Practice: Enable Secure Cookies in production (HTTPS)
        useSecureCookies: isProduction,
        
        // Security Best Practice: Do NOT disable CSRF checks in production.
        // It's often disabled in dev to simplify testing with tools like Postman, 
        // but it must be active for real browser usage.
        disableCSRFCheck: false, 
        
        // Security Best Practice: Cross-origin should be handled carefully.
        // If your API and Frontend share the same domain, set this to false.
        crossOrigin: false,
        
        // Better Auth handles private key encryption for sessions automatically if not disabled
    }
});

import { auth } from "./auth";
import { headers } from "next/headers";

/**
 * Get the current user session using Better Auth.
 * Works in Server Components, Server Actions, and Route Handlers.
 */
export async function getServerSession() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return null;
        }

        return session;
    } catch (error) {
        console.error("getServerSession error:", error);
        return null;
    }
}

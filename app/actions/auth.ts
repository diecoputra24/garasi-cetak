"use server";

import { auth } from "@/lib/auth";
import { createToken } from "@/lib/jwt";
import { COOKIE_NAME } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const callbackUrl = (formData.get("callbackUrl") as string) || "/dashboard";

    if (!email || !password) {
        return { error: "Email dan password wajib diisi" };
    }

    try {
        // Verify credentials via Better Auth (only for password check)
        const result = await auth.api.signInEmail({
            body: { email, password },
        });

        if (!result || !result.user) {
            return { error: "Email atau password salah" };
        }

        // Create our own JWT token with user data
        const jwt = await createToken({
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            role: (result.user as any).role || "user",
        });

        // Set JWT as cookie - this is simple and reliable
        const cookieStore = await cookies();
        cookieStore.set(COOKIE_NAME, jwt, {
            path: "/",
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

    } catch (error: any) {
        if (error.message === "NEXT_REDIRECT") throw error;
        console.error("Login Error:", error);
        return { error: "Email atau password salah" };
    }

    // Sanitize callbackUrl
    let safeRedirect = "/dashboard";
    try {
        if (callbackUrl && callbackUrl.startsWith("/") && callbackUrl.length > 1) {
            new URL(callbackUrl, "http://localhost");
            safeRedirect = callbackUrl;
        }
    } catch {
        // Fallback to /dashboard
    }

    redirect(safeRedirect);
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
    redirect("/login");
}

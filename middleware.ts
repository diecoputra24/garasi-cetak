import { NextResponse, type NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const isDashboard = pathname.startsWith("/dashboard");

    // Check for Better Auth session cookie OR legacy JWT cookie
    // Better Auth uses "better-auth.session_token" (or "__Secure-better-auth.session_token" in HTTPS)
    const betterAuthToken = request.cookies.get("better-auth.session_token");
    const secureToken = request.cookies.get("__Secure-better-auth.session_token");
    const legacyToken = request.cookies.get("gc-auth-token");

    const isAuthenticated = betterAuthToken || secureToken || legacyToken;

    // Protect dashboard routes
    if (isDashboard && !isAuthenticated) {
        const url = new URL("/login", request.url);
        url.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard", "/dashboard/:path*"],
};

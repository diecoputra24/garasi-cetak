import { NextResponse, type NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const isDashboard = pathname.startsWith("/dashboard");

    // Check for our JWT cookie
    const authToken = request.cookies.get("gc-auth-token");

    // Protect dashboard routes
    if (isDashboard && !authToken) {
        const url = new URL("/login", request.url);
        url.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard", "/dashboard/:path*"],
};

import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {

    const { pathname } = request.nextUrl;

    const protectedRoutes = ["/dashboard"];

    if (protectedRoutes.some(route => pathname.startsWith(route))) {
        const sessionCookie = request.cookies.get("better-auth.session_token");

        if (!sessionCookie) {
            // If the user is not authenticated, redirect them to the login page, not now cuz i need to implement the login page, but later i will do it
            const loginUrl = new URL("/login", request.url);
            return Response.redirect(loginUrl.toString());
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const protectedRoutes = ["/dashboard", "/projects", "/profile", "/admin"];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const sessionCookie = request.cookies.get("better-auth.session_token")
    ?? request.cookies.get("__Secure-better-auth.session_token");

  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // The public landing remains available to everyone, even when signed in or banned.
  if (pathname !== "/" && pathname !== "/banned" && sessionCookie) {
    const apiUrl = process.env.API_URL;
    if (apiUrl) {
      try {
        const response = await fetch(`${apiUrl}/users/me`, {
          headers: { cookie: request.headers.get("cookie") ?? "" },
          cache: "no-store",
        });
        if (response.ok) {
          const user = await response.json();
          if (pathname.startsWith("/admin") && user.role !== "admin") {
            return NextResponse.redirect(new URL("/dashboard", request.url));
          }
          const bannedUntil = user.bannedUntil ? new Date(user.bannedUntil) : null;
          const isBanActive = user.isBanned && (!bannedUntil || bannedUntil.getTime() > Date.now());
          if (isBanActive) {
            const banUrl = new URL("/banned", request.url);
            if (bannedUntil) banUrl.searchParams.set("until", bannedUntil.toISOString());
            return NextResponse.redirect(banUrl);
          }
        }
      } catch {
        // Keep navigation available while the API is temporarily unreachable.
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};

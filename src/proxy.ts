import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Next.js 16 Proxy — Route Protection
 *
 * Protects /admin/* routes and /api/admin/* routes.
 * Enforces role-based access control:
 * - Admin: full access
 * - Agent: no access to /admin/agents, /admin/settings
 * - Unauthenticated: redirected to /admin/login
 */
export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const { pathname } = request.nextUrl;

  // ─── PUBLIC: Login page ───
  if (pathname === "/admin/login") {
    // Already logged in → redirect to dashboard
    if (token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // ─── PROTECTED: All /admin/* routes ───
  if (pathname.startsWith("/admin")) {
    // Not logged in → redirect to login
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // ─── Must Change Password Enforcement ───
    if (
      token.mustChangePassword &&
      !pathname.startsWith("/admin/change-password")
    ) {
      return NextResponse.redirect(
        new URL("/admin/change-password", request.url),
      );
    }

    // Agent trying to access admin-only routes
    if (token.role === "agent") {
      if (
        pathname.startsWith("/admin/agents") ||
        pathname.startsWith("/admin/settings")
      ) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }

    return NextResponse.next();
  }

  // ─── PROTECTED: /api/admin/* routes ───
  if (pathname.startsWith("/api/admin")) {
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // Agent trying to access admin-only API routes
    if (token.role === "agent") {
      if (pathname.startsWith("/api/admin/agents")) {
        return NextResponse.json(
          { success: false, error: "Forbidden" },
          { status: 403 },
        );
      }
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

// Routes that the proxy should run on
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

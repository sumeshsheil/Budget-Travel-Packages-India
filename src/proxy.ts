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
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // Determine if this is the portals domain
  // Using portals.localhost:3000 for local testing, normally this would be portals.yourdomain.com
  const isPortalsDomain =
    hostname.includes("portals.") || hostname === "portals.localhost:3000";

  let effectivePathname = url.pathname;
  let isRewriteNeeded = false;

  // 1. If on the portals domain and trying to access the public site (root)
  if (
    isPortalsDomain &&
    !url.pathname.startsWith("/admin") &&
    !url.pathname.startsWith("/api/admin") &&
    !url.pathname.startsWith("/api/auth") &&
    !url.pathname.startsWith("/_next")
  ) {
    if (url.pathname === "/") {
      effectivePathname = "/admin";
    } else {
      effectivePathname = `/admin${url.pathname}`;
    }
    isRewriteNeeded = true;
  }

  // 2. If on the public domain and trying to access admin routes (Security)
  if (!isPortalsDomain && url.pathname.startsWith("/admin")) {
    return new NextResponse(null, { status: 404 });
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // ─── PUBLIC: Login page ───
  if (effectivePathname === "/admin/login") {
    // Already logged in → redirect to dashboard
    if (token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return isRewriteNeeded
      ? NextResponse.rewrite(new URL(effectivePathname, request.url))
      : NextResponse.next();
  }

  // ─── PROTECTED: All /admin/* routes ───
  if (effectivePathname.startsWith("/admin")) {
    // Not logged in → redirect to login
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", effectivePathname);
      return NextResponse.redirect(loginUrl);
    }

    // ─── Must Change Password Enforcement ───
    if (
      token.mustChangePassword &&
      !effectivePathname.startsWith("/admin/change-password")
    ) {
      return NextResponse.redirect(
        new URL("/admin/change-password", request.url),
      );
    }

    // Agent trying to access admin-only routes
    if (token.role === "agent") {
      if (
        effectivePathname.startsWith("/admin/agents") ||
        effectivePathname.startsWith("/admin/settings")
      ) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }

    return isRewriteNeeded
      ? NextResponse.rewrite(new URL(effectivePathname, request.url))
      : NextResponse.next();
  }

  // ─── PROTECTED: /api/admin/* routes ───
  if (effectivePathname.startsWith("/api/admin")) {
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // Agent trying to access admin-only API routes
    if (token.role === "agent") {
      if (effectivePathname.startsWith("/api/admin/agents")) {
        return NextResponse.json(
          { success: false, error: "Forbidden" },
          { status: 403 },
        );
      }
    }

    return isRewriteNeeded
      ? NextResponse.rewrite(new URL(effectivePathname, request.url))
      : NextResponse.next();
  }

  return isRewriteNeeded
    ? NextResponse.rewrite(new URL(effectivePathname, request.url))
    : NextResponse.next();
}

// Routes that the proxy should run on
export const config = {
  // Broaden the matcher to catch all routes so we can perform domain routing, but exclude static files
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

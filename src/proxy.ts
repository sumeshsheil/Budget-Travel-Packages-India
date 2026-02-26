import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Next.js 16 Proxy — Route Protection
 *
 * Protects /admin/* routes and /api/admin/* routes.
 * Enforces role-based access control:
 * - Admin: full access
 *  Agent: no access to /admin/agents, /admin/settings
 * - Unauthenticated: redirected to /admin/login
 */
export async function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // 1. Redirect /travel-blogs to /blogs
  if (url.pathname.startsWith("/travel-blogs")) {
    const newPath = url.pathname.replace("/travel-blogs", "/blogs");
    return NextResponse.redirect(new URL(newPath, request.url), 301);
  }

  // 2. Redirect /travel-portals to portals domain
  if (url.pathname === "/travel-portals") {
    // In production, use portals.yourdomain.com
    const portalUrl = hostname.includes("localhost")
      ? "http://portals.localhost:3000"
      : "https://portals.budgettravelpackages.in";
    return NextResponse.redirect(new URL(portalUrl), 301);
  }

  // 3. Redirect /privacy-policy and /terms-and-conditions to /legal
  const legacyPaths = ["/privacy-policy", "/terms-and-conditions"];
  const pathname = url.pathname; // Extract pathname once
  if (legacyPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/legal", request.url), 301);
  }

  // Determine if this is the portals domain
  // Using portals.localhost:3000 for local testing, normally this would be portals.yourdomain.com
  const isPortalsDomain =
    hostname.includes("portals.") ||
    hostname === "portals.localhost:3000" ||
    hostname === "portals.5.1.1.15:3000";

  // 1. ALWAYS allow global API routes (non-admin) to pass through without rewrites
  if (
    url.pathname.startsWith("/api") &&
    !url.pathname.startsWith("/api/admin")
  ) {
    return NextResponse.next();
  }

  let effectivePathname = url.pathname;
  let isRewriteNeeded = false;

  // 1. If on the portals domain and trying to access the public site (root)
  if (
    isPortalsDomain &&
    !url.pathname.startsWith("/admin") &&
    !url.pathname.startsWith("/api") &&
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
  // Allow /admin/onboarding for direct access via IP or localhost
  if (
    !isPortalsDomain &&
    url.pathname.startsWith("/admin") &&
    url.pathname !== "/admin/onboarding"
  ) {
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
    // Not logged in → redirect to login (allow /admin/onboarding publicly)
    if (!token && effectivePathname !== "/admin/onboarding") {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", effectivePathname);
      return NextResponse.redirect(loginUrl);
    }

    // ─── Must Change Password Enforcement ───
    if (
      token &&
      token.mustChangePassword &&
      !effectivePathname.startsWith("/admin/change-password")
    ) {
      return NextResponse.redirect(
        new URL("/admin/change-password", request.url),
      );
    }

    // Agent trying to access admin-only routes
    if (token && token.role === "agent") {
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

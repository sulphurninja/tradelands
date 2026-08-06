import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "tl_token";

async function getPayload(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    return payload;
  } catch {
    return null;
  }
}

function isPrefetch(request: NextRequest) {
  return (
    request.headers.get("Next-Router-Prefetch") === "1" ||
    request.headers.get("Purpose") === "prefetch" ||
    request.headers.get("Sec-Purpose") === "prefetch"
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const payload = await getPayload(request);
  const prefetch = isPrefetch(request);

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isDashboard = pathname.startsWith("/dashboard");
  const isAdmin =
    pathname.startsWith("/admin") || pathname.startsWith("/super-admin");
  const isCrm = pathname.startsWith("/crm");

  // Never bounce prefetch of /login → /admin → / (public) → /login…
  if (isAuthPage && payload && !prefetch) {
    const role = payload.role;
    const home =
      role === "superadmin"
        ? "/super-admin"
        : role === "admin"
          ? "/admin"
          : role === "sales"
            ? "/crm"
            : "/dashboard";
    return NextResponse.redirect(new URL(home, request.url));
  }

  if ((isDashboard || isAdmin || isCrm) && !payload) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdmin) {
    const role = payload?.role;
    if (role !== "admin" && role !== "superadmin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (pathname.startsWith("/super-admin") && payload?.role !== "superadmin") {
    const fallback = payload?.role === "admin" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(fallback, request.url));
  }

  if (isCrm) {
    const role = payload?.role;
    if (role !== "sales" && role !== "admin" && role !== "superadmin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/super-admin/:path*",
    "/crm/:path*",
    "/login",
    "/register",
  ],
};

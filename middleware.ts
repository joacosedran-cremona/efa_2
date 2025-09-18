import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const pathname = request.nextUrl.pathname;

  // Allow image files to pass through without authentication
  if (
    pathname.startsWith("/logo/") ||
    pathname.includes(".png") ||
    pathname.includes(".svg") ||
    pathname.includes(".jpg")
  ) {
    return NextResponse.next();
  }

  // Define public routes that don't require authentication
  const isPublicRoute =
    pathname === "/login" ||
    pathname.startsWith("/login/recuperacion") ||
    pathname === "/signup";

  // If no token and trying to access protected route, redirect to login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If has token and trying to access login page, redirect to home
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|favicon.ico|api|logo).*)"],
};

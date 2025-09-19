import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/logo/") ||
    pathname.includes(".png") ||
    pathname.includes(".svg") ||
    pathname.includes(".jpg")
  ) {
    return NextResponse.next();
  }

  const isPublicRoute =
    pathname === "/login" ||
    pathname.startsWith("/login/recuperacion");

  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|favicon.ico|api|logo).*)"],
};

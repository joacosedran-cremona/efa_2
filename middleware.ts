import { NextResponse } from "next/server";

export function middleware() {
  // Allow all requests to pass through without authentication checks
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|favicon.ico|api|logo).*)"],
};

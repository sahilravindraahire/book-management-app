import { NextResponse } from "next/server";

const PROTECTED_PATHS = ["/dashboard"];
const AUTH_PATHS = ["/login", "/signup"];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const hasToken = request.cookies.has("accessToken");

  if (PROTECTED_PATHS.some((p) => pathname.startsWith(p)) && !hasToken) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (AUTH_PATHS.some((p) => pathname.startsWith(p)) && hasToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};

// // middleware.js
// import { NextResponse } from "next/server";

// const PUBLIC_ONLY_ROUTES = ["/login", "/signup"];
// const PROTECTED_ROUTES = ["/dashboard"];

// export function middleware(request) {
//   const { pathname } = request.nextUrl;
//   const token = request.cookies.get("accessToken")?.value;

//   const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
//     pathname.startsWith(route)
//   );
//   const isPublicOnlyRoute = PUBLIC_ONLY_ROUTES.some((route) =>
//     pathname.startsWith(route)
//   );

//   // Not logged in, trying to hit a protected route -> send to login
//   if (isProtectedRoute && !token) {
//     const loginUrl = new URL("/login", request.url);
//     loginUrl.searchParams.set("from", pathname);
//     return NextResponse.redirect(loginUrl);
//   }

//   // Already logged in, trying to hit login/signup -> send to dashboard
//   if (isPublicOnlyRoute && token) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/login", "/signup"],
// };


import { NextResponse } from "next/server";

export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};

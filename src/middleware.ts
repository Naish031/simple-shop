import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  const isProtectedRoute = pathname.startsWith("/dashboard");

  if (!token && isProtectedRoute) {
    // User not authenticated and trying to access protected route
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isAuthRoute) {
    // User authenticated but trying to access auth routes
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow access otherwise
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register", "/dashboard"],
};

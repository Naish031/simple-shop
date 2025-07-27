import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicRoutes = ["/login", "/register"];
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  console.log("token", token);

  if (token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/dashboard/:path*", "/"],
};

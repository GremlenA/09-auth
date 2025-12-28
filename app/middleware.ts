import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRIVATE_ROUTES = ["/profile"];
const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.get("accessToken");

  if (!isAuthenticated && PRIVATE_ROUTES.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthenticated && PUBLIC_ROUTES.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile", "/sign-in", "/sign-up"],
};

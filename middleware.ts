import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasAuthCookie =
    request.cookies.get("accessToken") ||
    request.cookies.get("refreshToken");

  const isPublic = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  const isPrivate = pathname.startsWith("/notes") ||
                    pathname.startsWith("/profile");

  if (!hasAuthCookie && isPrivate) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }


  if (hasAuthCookie && isPublic) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/notes/:path*",
    "/profile/:path*",
    "/sign-in",
    "/sign-up",
  ],
};

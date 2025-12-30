import { NextRequest, NextResponse } from "next/server";

export const API_PROXY_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://notehub-api.goit.study";


const publicRoutes = ["/login", "/register"];


const privateRoutes = ["/notes", "/profile"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

 
  if (!accessToken && isPrivateRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  
  if (accessToken && isPublicRoute) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

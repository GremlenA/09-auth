import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parse } from "cookie";

import { checkSession } from "@/lib/api/serverApi";

const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];
const PRIVATE_ROUTES = ["/profile", "/notes"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isPrivateRoute = PRIVATE_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  
  if (!accessToken && refreshToken) {
    try {
      const response = await checkSession();
      const setCookie = response.headers["set-cookie"];

      if (setCookie) {
        const cookiesArray = Array.isArray(setCookie)
          ? setCookie
          : [setCookie];

        for (const cookieStr of cookiesArray) {
          const parsed = parse(cookieStr);

          const options = {
            path: parsed.Path,
            expires: parsed.Expires
              ? new Date(parsed.Expires)
              : undefined,
            maxAge: parsed["Max-Age"]
              ? Number(parsed["Max-Age"])
              : undefined,
          };

          if (parsed.accessToken) {
            cookieStore.set(
              "accessToken",
              parsed.accessToken,
              options
            );
          }

          if (parsed.refreshToken) {
            cookieStore.set(
              "refreshToken",
              parsed.refreshToken,
              options
            );
          }
        }

        return NextResponse.next();
      }
    } catch {
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");
    }
  }

  
  if (!accessToken && !refreshToken && isPublicRoute) {
    return NextResponse.next();
  }

  
  if (!accessToken && isPrivateRoute) {
    return NextResponse.redirect(
      new URL("/sign-in", request.url)
    );
  }

  
  if (accessToken && isPublicRoute) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  return NextResponse.next();
}

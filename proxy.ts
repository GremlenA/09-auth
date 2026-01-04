import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parse } from "cookie";
import { checkSession } from "@/lib/api/serverApi";

const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];
const PRIVATE_ROUTES = ["/profile", "/notes"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();
  const response = NextResponse.next();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPublicRoute = PUBLIC_ROUTES.some(route =>
    pathname.startsWith(route)
  );
  const isPrivateRoute = PRIVATE_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  
  if (!accessToken && refreshToken) {
    try {
      const apiResponse = await checkSession();

      const setCookieHeader =
        apiResponse &&
        typeof apiResponse === "object" &&
        "headers" in apiResponse
          ? (apiResponse as any).headers?.["set-cookie"]
          : null;

      if (setCookieHeader) {
        const cookiesArray = Array.isArray(setCookieHeader)
          ? setCookieHeader
          : [setCookieHeader];

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
            cookieStore.set("accessToken", parsed.accessToken, options);
            response.cookies.set("accessToken", parsed.accessToken, options);
          }

          if (parsed.refreshToken) {
            cookieStore.set("refreshToken", parsed.refreshToken, options);
            response.cookies.set("refreshToken", parsed.refreshToken, options);
          }
        }

        return response;
      }
    } catch (error) {
      
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");

      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");

   
      if (isPrivateRoute) {
        return NextResponse.redirect(
          new URL("/sign-in", request.url)
        );
      }

      return response;
    }
  }

  
  if (!accessToken && !refreshToken && isPublicRoute) {
    return response;
  }

  
  if (!accessToken && isPrivateRoute) {
    return NextResponse.redirect(
      new URL("/sign-in", request.url)
    );
  }

  
  if (accessToken && isPublicRoute) {
    return NextResponse.redirect(
      new URL("/profile", request.url)
    );
  }

  return response;
}

// proxy.ts

import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";
import { checkSession } from "@/lib/api/serverApi";

const PRIVATE_PATHS = ["/profile", "/notes"];
const PUBLIC_AUTH_PATHS = ["/sign-in", "/sign-up"];

function isPrivatePath(pathname: string) {
  return PRIVATE_PATHS.some((path) => pathname.startsWith(path));
}

function isPublicAuthPath(pathname: string) {
  return PUBLIC_AUTH_PATHS.some((path) => pathname.startsWith(path));
}

function applySetCookieHeaders(
  response: NextResponse,
  setCookieHeader?: string | string[],
) {
  if (!setCookieHeader) return;

  const cookieArray = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : [setCookieHeader];

  for (const cookieStr of cookieArray) {
    const parsed = parse(cookieStr);

    const options = {
      expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
      path: parsed.Path,
      maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
    };

    if (parsed.accessToken) {
      response.cookies.set("accessToken", parsed.accessToken, options);
    }

    if (parsed.refreshToken) {
      response.cookies.set("refreshToken", parsed.refreshToken, options);
    }
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let isAuthenticated = Boolean(accessToken);
  const response = NextResponse.next();

  if (!accessToken && refreshToken) {
    try {
      const sessionResponse = await checkSession();

      isAuthenticated = Boolean(sessionResponse.data);

      const setCookieHeader = sessionResponse.headers["set-cookie"];
      applySetCookieHeaders(response, setCookieHeader);
    } catch {
      isAuthenticated = false;
    }
  }

  if (!isAuthenticated && isPrivatePath(pathname)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthenticated && isPublicAuthPath(pathname)) {
    const redirectResponse = NextResponse.redirect(new URL("/", request.url));

    if (!accessToken && refreshToken) {
      try {
        const sessionResponse = await checkSession();
        const setCookieHeader = sessionResponse.headers["set-cookie"];
        applySetCookieHeaders(redirectResponse, setCookieHeader);
      } catch {}
    }

    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
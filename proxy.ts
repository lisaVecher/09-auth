// proxy.ts

import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "@/lib/api/serverApi";

const PRIVATE_PATHS = ["/profile", "/notes"];
const PUBLIC_AUTH_PATHS = ["/sign-in", "/sign-up"];

function isPrivatePath(pathname: string) {
  return PRIVATE_PATHS.some((path) => pathname.startsWith(path));
}

function isPublicAuthPath(pathname: string) {
  return PUBLIC_AUTH_PATHS.some((path) => pathname.startsWith(path));
}

type ParsedSetCookie = {
  name: string;
  value: string;
  options: {
    expires?: Date;
    path?: string;
    maxAge?: number;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: "lax" | "strict" | "none";
  };
};

function parseSetCookieString(cookieStr: string): ParsedSetCookie | null {
  const parts = cookieStr.split(";").map((part) => part.trim());

  if (parts.length === 0) return null;

  const [nameValue, ...attributes] = parts;
  const separatorIndex = nameValue.indexOf("=");

  if (separatorIndex === -1) return null;

  const name = nameValue.slice(0, separatorIndex).trim();
  const value = nameValue.slice(separatorIndex + 1).trim();

  const options: ParsedSetCookie["options"] = {};

  for (const attr of attributes) {
    const [rawKey, ...rawValueParts] = attr.split("=");
    const key = rawKey.toLowerCase();
    const valuePart = rawValueParts.join("=");

    switch (key) {
      case "expires":
        if (valuePart) {
          options.expires = new Date(valuePart);
        }
        break;

      case "path":
        if (valuePart) {
          options.path = valuePart;
        }
        break;

      case "max-age":
        if (valuePart) {
          options.maxAge = Number(valuePart);
        }
        break;

      case "secure":
        options.secure = true;
        break;

      case "httponly":
        options.httpOnly = true;
        break;

      case "samesite": {
        const sameSite = valuePart.toLowerCase();
        if (
          sameSite === "lax" ||
          sameSite === "strict" ||
          sameSite === "none"
        ) {
          options.sameSite = sameSite;
        }
        break;
      }

      default:
        break;
    }
  }

  return { name, value, options };
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
    const parsedCookie = parseSetCookieString(cookieStr);

    if (!parsedCookie) continue;

    const { name, value, options } = parsedCookie;

    response.cookies.set(name, value, options);
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let isAuthenticated = Boolean(accessToken);
  let refreshedSetCookieHeader: string | string[] | undefined;

  if (!accessToken && refreshToken) {
    try {
      const sessionResponse = await checkSession();
      isAuthenticated = Boolean(sessionResponse.data);
      refreshedSetCookieHeader = sessionResponse.headers["set-cookie"];
    } catch {
      isAuthenticated = false;
    }
  }

  if (!isAuthenticated && isPrivatePath(pathname)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthenticated && isPublicAuthPath(pathname)) {
    const redirectResponse = NextResponse.redirect(new URL("/", request.url));
    applySetCookieHeaders(redirectResponse, refreshedSetCookieHeader);
    return redirectResponse;
  }

  const response = NextResponse.next();
  applySetCookieHeaders(response, refreshedSetCookieHeader);
  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
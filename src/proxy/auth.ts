import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { normalizePath } from "@/common/utils/path";

const authPageRoutes = new Set(["/login"]);
const apiAuthPrefix = "/api/auth";

export async function resolveAuthRedirect(
  req: NextRequest,
  response: NextResponse,
): Promise<NextResponse | null> {
  const { nextUrl } = req;
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const path = normalizePath(nextUrl.pathname);
  const isApiAuthRoute = path.startsWith(apiAuthPrefix);
  const isAuthPageRoute = authPageRoutes.has(path);

  if (isApiAuthRoute) {
    return response;
  }

  if (isAuthPageRoute && token) {
    const redirectTo = req.nextUrl.searchParams.get("redirectTo") || "/";
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  if (!token && !isAuthPageRoute) {
    const loginUrl = new URL("/login", req.url);
    const redirectTo = req.nextUrl.pathname + req.nextUrl.search;

    if (redirectTo !== "/") {
      loginUrl.searchParams.set("redirectTo", redirectTo);
    }

    return NextResponse.redirect(loginUrl);
  }

  return null;
}

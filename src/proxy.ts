import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { ensureNextLocaleCookie } from "./proxy/localeCookie";
import { resolveAuthRedirect } from "./proxy/auth";

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const response = handleI18nRouting(req);

  ensureNextLocaleCookie(req, response);

  const authResponse = await resolveAuthRedirect(req, response);
  return authResponse ?? response;
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};

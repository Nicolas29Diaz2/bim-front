import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

const LOCALE_COOKIE = "NEXT_LOCALE";
const ONE_YEAR_SECONDS = 31536000;

export function ensureNextLocaleCookie(
  req: NextRequest,
  response: NextResponse
): void {
  if (req.cookies.has(LOCALE_COOKIE)) return;

  const locale =
    response.headers.get("x-next-intl-locale") || routing.defaultLocale;

  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: ONE_YEAR_SECONDS,
    sameSite: "lax",
  });
}

import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const handle = createMiddleware(routing);

// Countries whose visitors we default to French (Morocco + Maghreb + France).
const FRENCH_COUNTRIES = new Set(["MA", "DZ", "TN", "FR"]);

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const hasLocalePrefix = routing.locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  // next-intl persists the visitor's explicit choice in this cookie — never override it.
  const hasLocaleCookie = req.cookies.has("NEXT_LOCALE");

  if (!hasLocalePrefix && !hasLocaleCookie) {
    const country = (
      req.headers.get("x-vercel-ip-country") ||
      req.headers.get("cf-ipcountry") ||
      ""
    ).toUpperCase();

    if (FRENCH_COUNTRIES.has(country)) {
      const url = req.nextUrl.clone();
      url.pathname = `/fr${pathname === "/" ? "" : pathname}`;
      return NextResponse.redirect(url);
    }
  }

  // Otherwise fall back to next-intl (Accept-Language detection, cookie, default).
  return handle(req);
}

// Named export for the Next.js 16 proxy convention.
export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

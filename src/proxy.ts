import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const handle = createMiddleware(routing);

// Countries whose visitors we default to French (Morocco + Maghreb + France).
const FRENCH_COUNTRIES = new Set(["MA", "DZ", "TN", "FR"]);

// Search engine / AI crawlers. We never geo-redirect them: a bot must always
// resolve the bare domain to the stable default locale (/en = x-default
// canonical) so crawling is consistent and not skewed by the edge IP's country.
const BOT_UA =
  /bot|crawl|spider|slurp|gptbot|oai-searchbot|chatgpt|claude|anthropic|perplexity|googlebot|bingbot|duckduck|yandex|baidu|applebot|amazonbot|bytespider|ccbot|facebookexternalhit|embedly|quora|slackbot|whatsapp|telegram|discord|twitterbot|linkedinbot/i;

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const hasLocalePrefix = routing.locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  // next-intl persists the visitor's explicit choice in this cookie — never override it.
  const hasLocaleCookie = req.cookies.has("NEXT_LOCALE");
  const isBot = BOT_UA.test(req.headers.get("user-agent") || "");

  // Serve the bare domain "/" to crawlers as 200 content in place (rewrite, not
  // redirect) so fetchers that don't follow redirects (e.g. some AI tools) still
  // read the homepage. The page's canonical is /en, so indexing consolidates
  // there. Humans keep the locale redirect below.
  if (isBot && pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/en";
    return NextResponse.rewrite(url);
  }

  if (!hasLocalePrefix && !hasLocaleCookie && !isBot) {
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

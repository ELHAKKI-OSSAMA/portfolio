import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const proxyFn = createMiddleware(routing);

// Named export for Next.js 16 proxy convention
export const proxy = proxyFn;

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

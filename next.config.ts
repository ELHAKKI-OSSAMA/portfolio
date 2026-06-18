import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // ── Performance ─────────────────────────────────────────────────────────────
  compress: true,              // Gzip/Brotli responses
  poweredByHeader: false,      // Remove X-Powered-By header
  productionBrowserSourceMaps: true, // ship source maps (Lighthouse best-practice; aids debugging)

  // ── Turbopack dev-server ────────────────────────────────────────────────────
  turbopack: {
    root: __dirname,
  },

  // ── Images ──────────────────────────────────────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "github.com" },
    ],
  },

  // ── HTTP headers ─────────────────────────────────────────────────────────────
  async headers() {
    // Content-Security-Policy. 'unsafe-inline'/'unsafe-eval' are required by the
    // Next.js runtime, the inline theme-init script, inline JSON-LD, and the
    // in-browser Pyodide sandbox (WebAssembly). jsdelivr = Pyodide CDN;
    // Google Fonts are used by the static /games pages.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://www.googletagmanager.com https://plausible.io",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "media-src 'self' blob:",
      "connect-src 'self' https://cdn.jsdelivr.net https://www.google-analytics.com https://region1.google-analytics.com https://plausible.io",
      "worker-src 'self' blob:",
      // YouTube embeds in the learning topic video panels.
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "manifest-src 'self'",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy",     value: csp },
          { key: "Strict-Transport-Security",   value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options",      value: "nosniff" },
          { key: "X-Frame-Options",             value: "SAMEORIGIN" },
          { key: "X-XSS-Protection",            value: "1; mode=block" },
          { key: "Referrer-Policy",             value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",          value: "camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()" },
          { key: "Cross-Origin-Opener-Policy",  value: "same-origin" },
          { key: "X-DNS-Prefetch-Control",      value: "on" },
        ],
      },
      {
        // Fonts
        source: "/fonts/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);

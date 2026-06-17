import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/data";

// AI / answer-engine crawlers we explicitly welcome so the site can be cited
// in ChatGPT, Claude, Perplexity, Google AI Overviews, etc. (GEO / LLMO).
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "Amazonbot",
  "Bytespider",
  "CCBot",
  "cohere-ai",
  "Meta-ExternalAgent",
  "DuckAssistBot",
  "YouBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        // Allow /_next/ (static JS/CSS/fonts + the /_next/image optimizer):
        // Google needs these to render pages and index images. Only the OG
        // image endpoint is exposed under /api/; the rest of /api/ stays blocked.
        allow: ["/", "/api/og"],
        disallow: ["/api/"],
      },
      // Explicitly allow each AI crawler full access to public content.
      ...AI_BOTS.map((bot) => ({
        userAgent: bot,
        allow: "/",
        disallow: ["/api/"],
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

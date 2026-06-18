import Link from "next/link";

export interface RelatedItem {
  title: string;
  href: string;
  subtitle?: string;
}

/**
 * Internal-linking block. Surfacing related content as crawlable <a> links in
 * the server-rendered HTML spreads crawl equity to deeper pages — directly
 * helping Google discover and index them (vs. orphaned pages reachable only
 * via the sitemap). Rendered as a labelled <nav> for accessibility.
 */
export default function RelatedLinks({
  heading,
  items,
}: {
  heading: string;
  items: RelatedItem[];
}) {
  if (!items.length) return null;
  return (
    <nav aria-label={heading} className="max-w-3xl mx-auto px-4 sm:px-6 mt-16">
      <h2 className="text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>
        {heading}
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((it) => (
          <li key={it.href}>
            <Link
              href={it.href}
              className="block h-full rounded-xl border p-4 transition-colors hover:bg-[var(--bg-elevated)]"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}
            >
              <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                {it.title}
              </span>
              {it.subtitle && (
                <span className="block text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  {it.subtitle}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

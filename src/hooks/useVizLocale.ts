import { useLocale } from "next-intl";

/**
 * Picks the right locale slab from a `{ en, fr, ar }` labels object.
 * Falls back to "en" for unknown locales.
 *
 * Usage:
 *   const L = useVizLocale(MY_LABELS);
 */
export function useVizLocale<T extends { en: object; fr: object; ar: object }>(
  labels: T,
): T["en"] {
  const locale = useLocale();
  const key = (locale as string) in labels ? locale : "en";
  return (labels as Record<string, T["en"]>)[key];
}

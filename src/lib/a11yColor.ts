// Theme-aware accessible-color helper.
//
// Vivid brand/category hues (e.g. #00d4aa, #f59e0b) look great on the dark
// theme's near-black surfaces but only reach ~2:1 contrast as text on the light
// theme's white/tinted surfaces, failing WCAG AA. `accentInk` darkens a hue
// toward black just until it clears the target contrast ratio against white, so
// it can be used as the *light-mode* text color while the original stays for
// dark mode (see the `.acc-ink` utility in globals.css).

function srgbToLinear(channel: number): number {
  const v = channel / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function luminance(r: number, g: number, b: number): number {
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

/** Contrast ratio of an rgb color against pure white. */
function ratioOnWhite(r: number, g: number, b: number): number {
  return 1.05 / (luminance(r, g, b) + 0.05);
}

/**
 * Returns `hex` darkened toward black until it reaches `target` contrast on
 * white (default 4.6:1, a small margin over the 4.5 AA threshold for body text).
 * Hue is preserved (channels scale uniformly). Already-dark colors are returned
 * unchanged.
 */
// Default target 5.2 (not 4.5) leaves headroom: chips sit on a faint tinted
// background rather than pure white, which shaves ~0.3 off the measured ratio.
export function accentInk(hex: string, target = 5.2): string {
  const parts = hex.replace("#", "").match(/.{2}/g);
  if (!parts || parts.length < 3) return hex;
  const [r, g, b] = parts.map((x) => parseInt(x, 16));
  let f = 1;
  while (f > 0.05 && ratioOnWhite(r * f, g * f, b * f) < target) f -= 0.02;
  const toHex = (v: number) => Math.max(0, Math.min(255, Math.round(v * f))).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

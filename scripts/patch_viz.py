"""
Patch all visualization .tsx files to use shared primitives.

Safe changes applied per file:
  1. Replace `import { useLocale } from "next-intl"` with useVizLocale import
  2. Collapse the 2-line locale lookup into useVizLocale(XYZ_LABELS)
  3. Add import for VizCard, VizHeader, StatGrid, TabToggle from ./shared
  4. Replace VizCard div opener + find/close matching outer </div>
  5. Replace StatGrid blocks (where the close pattern matches exactly)
"""

import re, sys, io
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

VIZ_DIR = Path(__file__).parent.parent / "src" / "components" / "learning" / "visualizations"

# ─── Imports & locale lookup ─────────────────────────────────────────────────

LOCALE_IMPORT_OLD = 'import { useLocale } from "next-intl";'
LOCALE_IMPORT_NEW = 'import { useVizLocale } from "@/hooks/useVizLocale";'

LOCALE_LOOKUP_RE = re.compile(
    r'  const locale = useLocale\(\);\n'
    r'  const L = (\w+)\[\(locale as keyof typeof \w+\) in \w+ \? \(locale as keyof typeof \w+\) : "en"\];',
)

SHARED_IMPORT = 'import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";'

# ─── VizCard ─────────────────────────────────────────────────────────────────

# Multi-line open (most files)
VIZCARD_OPEN_ML = (
    '    <div\n'
    '      className="rounded-2xl overflow-hidden border"\n'
    '      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}\n'
    '    >'
)
# Single-line open
VIZCARD_OPEN_1L_A = (
    '<div className="rounded-2xl overflow-hidden border" '
    'style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>'
)
VIZCARD_OPEN_1L_B = (
    '    <div className="rounded-2xl overflow-hidden border" '
    'style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>'
)

# The closing tag at the very end of the return — outermost </div> before ");  }"
VIZCARD_CLOSE_CANDIDATES = [
    "\n    </div>\n  );\n}",
    "\n    </div>\n  );\n}\n",
]
VIZCARD_CLOSE_REPLACE = "\n    </VizCard>\n  );\n}"

# ─── StatGrid ────────────────────────────────────────────────────────────────

STATGRID_OPEN_RE = re.compile(
    r'( +)<div className="grid grid-cols-(\d) border-t text-center" '
    r'style=\{\{ borderColor: "var\(--border\)" \}\}>\n'
    r'\1  \{\[',
)

def _make_close(indent: str, py_cls: str) -> str:
    i = indent
    # Build without f-strings for the JSX curly brace parts
    return (
        i + "  ].map(({ label, value, color }) => (\n"
        + i + '    <div key={label} className="' + py_cls + '">\n'
        + i + '      <div className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</div>\n'
        + i + '      <div className="text-sm font-bold font-mono" style={{ color }}>{value}</div>\n'
        + i + "    </div>\n"
        + i + "  ))}\n"
        + i + "</div>"
    )


def replace_statgrids(text: str) -> tuple[str, int]:
    count = 0
    while True:
        m = STATGRID_OPEN_RE.search(text)
        if not m:
            break
        indent = m.group(1)      # leading whitespace of the <div>
        close_py3 = _make_close(indent, "py-3")
        close_py25 = _make_close(indent, "py-2.5")

        start = m.start()
        items_start = m.end()

        # Try both close patterns
        found_close = None
        for close in (close_py3, close_py25):
            idx = text.find(close, items_start)
            if idx != -1:
                found_close = (close, idx)
                break

        if found_close is None:
            break  # pattern doesn't match exactly — skip this block

        close_str, close_idx = found_close
        items_text = text[items_start : close_idx].rstrip()
        py_val = "py-2.5" if "py-2.5" in close_str else "py-3"
        replacement = f'{indent}<StatGrid py="{py_val}" items={{[{items_text}\n{indent}]}} />'
        text = text[:start] + replacement + text[close_idx + len(close_str):]
        count += 1
    return text, count


# ─── Main patcher ────────────────────────────────────────────────────────────

def patch_file(path: Path, dry_run: bool = False) -> tuple[str, list[str]]:
    original = path.read_text(encoding="utf-8")
    text = original
    changes: list[str] = []

    # 1. useLocale → useVizLocale import
    if LOCALE_IMPORT_OLD in text:
        text = text.replace(LOCALE_IMPORT_OLD, LOCALE_IMPORT_NEW)
        changes.append("useLocale→useVizLocale import")

    # 2. Collapse locale lookup (2 lines → 1)
    def _lookup_replace(m: re.Match) -> str:
        return f"  const L = useVizLocale({m.group(1)});"

    new_text, n = LOCALE_LOOKUP_RE.subn(_lookup_replace, text)
    if n:
        text = new_text
        changes.append(f"locale lookup collapsed ({n}x)")

    # 3. Add shared import (insert after useVizLocale/useVizTheme line)
    if SHARED_IMPORT not in text and (
        'rounded-2xl overflow-hidden border' in text
        or 'grid-cols' in text
    ):
        for marker in (
            'import { useVizLocale }',
            'import { useVizTheme }',
            'import { useLocale }',
        ):
            if marker in text:
                idx = text.index(marker)
                line_end = text.index("\n", idx)
                text = text[: line_end + 1] + SHARED_IMPORT + "\n" + text[line_end + 1:]
                changes.append("shared import added")
                break

    # 4. VizCard open
    card_replaced = False
    if VIZCARD_OPEN_ML in text:
        text = text.replace(VIZCARD_OPEN_ML, "    <VizCard>")
        card_replaced = True
    elif VIZCARD_OPEN_1L_B in text:
        text = text.replace(VIZCARD_OPEN_1L_B, "    <VizCard>")
        card_replaced = True
    elif VIZCARD_OPEN_1L_A in text:
        text = text.replace(VIZCARD_OPEN_1L_A, "<VizCard>")
        card_replaced = True

    # 4b. VizCard close — replace last "</div>" before ");\n}" with "</VizCard>"
    if card_replaced:
        for c in VIZCARD_CLOSE_CANDIDATES:
            if c in text:
                # Use rfind so we get the LAST occurrence (the outermost one)
                idx = text.rfind(c)
                if idx != -1:
                    text = text[:idx] + VIZCARD_CLOSE_REPLACE + text[idx + len(c):]
                    break
        changes.append("VizCard wrapper")

    # 5. StatGrid
    text, n_sg = replace_statgrids(text)
    if n_sg:
        changes.append(f"StatGrid ({n_sg}x)")

    if not dry_run and text != original:
        path.write_text(text, encoding="utf-8")

    return text, changes


def main():
    dry = "--dry" in sys.argv
    files = sorted(VIZ_DIR.glob("*.tsx"))
    total_files = 0
    for f in files:
        if f.name == "shared.tsx":
            continue
        _, ch = patch_file(f, dry_run=dry)
        if ch:
            print(f"  {f.name}: {', '.join(ch)}")
            total_files += 1
    print(f"\nPatched {total_files} files.")
    if dry:
        print("(dry run — no files written)")


if __name__ == "__main__":
    main()

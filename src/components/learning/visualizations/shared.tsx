"use client";

/**
 * Shared primitives used by every visualization component.
 *
 * VizCard    – outer card wrapper
 * VizHeader  – header bar (title + optional subtitle + optional right slot)
 * StatGrid   – bottom stat row
 * TabToggle  – tab / mode-switch button group
 */

import type { ReactNode, CSSProperties } from "react";

// ─── VizCard ────────────────────────────────────────────────────────────────

interface VizCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function VizCard({ children, className = "", style }: VizCardProps) {
  return (
    <div
      className={`rounded-2xl overflow-hidden border ${className}`}
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── VizHeader ──────────────────────────────────────────────────────────────

interface VizHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  right?: ReactNode;
}

export function VizHeader({ title, subtitle, right }: VizHeaderProps) {
  return (
    <div
      className="flex items-center justify-between px-5 py-3 border-b"
      style={{ borderColor: "var(--border)" }}
    >
      <div>
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {title}
        </span>
        {subtitle && (
          <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>
            {subtitle}
          </span>
        )}
      </div>
      {right && <div className="flex items-center gap-1.5 flex-wrap justify-end">{right}</div>}
    </div>
  );
}

// ─── StatGrid ───────────────────────────────────────────────────────────────

export interface StatItem {
  label: ReactNode;
  value: ReactNode;
  color: string;
}

interface StatGridProps {
  items: StatItem[];
  /** Cell vertical padding class — default "py-3" */
  py?: "py-2" | "py-2.5" | "py-3" | "py-4";
}

export function StatGrid({ items, py = "py-3" }: StatGridProps) {
  const cols = items.length;
  const colsClass =
    cols === 2 ? "grid-cols-2"
    : cols === 3 ? "grid-cols-3"
    : cols === 4 ? "grid-cols-4"
    : cols === 5 ? "grid-cols-5"
    : "grid-cols-6";

  return (
    <div
      className={`grid ${colsClass} border-t text-center`}
      style={{ borderColor: "var(--border)" }}
    >
      {items.map((item, i) => (
        <div key={i} className={py}>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>
            {item.label}
          </div>
          <div className="text-sm font-bold font-mono" style={{ color: item.color }}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── TabToggle ──────────────────────────────────────────────────────────────

interface TabDef<T extends string> {
  id: T;
  label: string;
}

interface TabToggleProps<T extends string> {
  tabs: readonly TabDef<T>[];
  active: T;
  onChange: (id: T) => void;
  accentColor: string;
  size?: "sm" | "xs";
}

export function TabToggle<T extends string>({
  tabs,
  active,
  onChange,
  accentColor,
  size = "xs",
}: TabToggleProps<T>) {
  const padding = size === "sm" ? "px-3 py-1.5" : "px-2.5 py-1";
  return (
    <>
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`${padding} rounded-lg text-xs font-medium transition-all`}
          style={{
            backgroundColor: active === t.id ? `${accentColor}25` : "var(--bg-card)",
            color: active === t.id ? accentColor : "var(--text-muted)",
            border: `1px solid ${active === t.id ? accentColor + "50" : "var(--border)"}`,
          }}
        >
          {t.label}
        </button>
      ))}
    </>
  );
}

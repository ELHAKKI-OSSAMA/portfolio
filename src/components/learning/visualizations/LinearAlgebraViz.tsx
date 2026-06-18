"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVizLocale } from "@/hooks/useVizLocale";
import { useLocale } from "next-intl";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";
import { useVizTheme } from "@/hooks/useVizTheme";

const W = 520, H = 260;
const HALF = 240;
const PAD = 20;
// Each panel is 240px wide, with a [-3,3] coordinate range
// Origin for left panel at (PAD + HALF/2, H/2), right panel at (PAD + HALF + PAD + HALF/2, H/2)
const SCALE = (HALF - 2 * PAD) / 6; // pixels per unit

const L_OX = PAD + HALF / 2;     // left origin x
const L_OY = H / 2;              // left origin y
const R_OX = PAD + HALF + PAD + HALF / 2; // right origin x
const R_OY = H / 2;

type Matrix2x2 = [[number, number], [number, number]];

interface Preset {
  name: string;
  matrix: Matrix2x2;
  desc: string;
}

const PRESETS_EN: Preset[] = [
  { name: "Rotation 45°",  matrix: [[0.707, -0.707], [0.707, 0.707]], desc: "Rotates every vector 45° CCW" },
  { name: "Scale x2/y0.5", matrix: [[2, 0], [0, 0.5]],                desc: "Stretches x, compresses y — ill-conditioned matrix" },
  { name: "Shear",          matrix: [[1, 0.8], [0, 1]],                desc: "Horizontal shear — parallelogram effect" },
  { name: "Singular",       matrix: [[1, 1], [0.5, 0.5]],              desc: "Rank-1 matrix — collapses 2D space onto a line, det=0" },
];

const PRESETS_FR: Preset[] = [
  { name: "Rotation 45°",  matrix: [[0.707, -0.707], [0.707, 0.707]], desc: "Fait pivoter chaque vecteur de 45° sens antihoraire" },
  { name: "Échelle x2/y0.5", matrix: [[2, 0], [0, 0.5]],              desc: "Étire x, compresse y — matrice mal conditionnée" },
  { name: "Cisaillement",   matrix: [[1, 0.8], [0, 1]],               desc: "Cisaillement horizontal — effet parallélogramme" },
  { name: "Singulière",     matrix: [[1, 1], [0.5, 0.5]],             desc: "Matrice de rang 1 — réduit l'espace 2D à une droite, det=0" },
];

const PRESETS_AR: Preset[] = [
  { name: "دوران 45°",     matrix: [[0.707, -0.707], [0.707, 0.707]], desc: "يدور كل متجه 45° عكس عقارب الساعة" },
  { name: "مقياس x2/y0.5", matrix: [[2, 0], [0, 0.5]],               desc: "يمد x، يضغط y — مصفوفة سيئة التكييف" },
  { name: "قص",             matrix: [[1, 0.8], [0, 1]],               desc: "قص أفقي — تأثير متوازي الأضلاع" },
  { name: "مفردة",          matrix: [[1, 1], [0.5, 0.5]],             desc: "مصفوفة رتبة 1 — تطوي الفضاء 2D على خط، det=0" },
];

function applyMatrix(m: Matrix2x2, x: number, y: number): [number, number] {
  return [m[0][0] * x + m[0][1] * y, m[1][0] * x + m[1][1] * y];
}

function det(m: Matrix2x2): number {
  return m[0][0] * m[1][1] - m[0][1] * m[1][0];
}

function trace(m: Matrix2x2): number {
  return m[0][0] + m[1][1];
}

// Eigenvalues of 2×2: λ = (tr ± sqrt(tr²-4det)) / 2
function eigenvalues(m: Matrix2x2): string {
  const d = det(m);
  const tr = trace(m);
  const disc = tr * tr - 4 * d;
  if (Math.abs(d) < 1e-9) return "λ = 0 (singular)";
  if (disc < 0) {
    const re = tr / 2;
    const im = Math.sqrt(-disc) / 2;
    return `λ = ${re.toFixed(2)} ± ${im.toFixed(2)}i`;
  }
  const l1 = (tr + Math.sqrt(disc)) / 2;
  const l2 = (tr - Math.sqrt(disc)) / 2;
  return `λ₁ = ${l1.toFixed(3)},  λ₂ = ${l2.toFixed(3)}`;
}

// Convert math coords to SVG coords for each panel
function toSVG(ox: number, oy: number, mx: number, my: number): [number, number] {
  return [ox + mx * SCALE, oy - my * SCALE];
}

// Draw an arrow from (x1,y1) to (x2,y2) SVG coords
function ArrowHead({ x1, y1, x2, y2, color, strokeWidth = 2 }: {
  x1: number; y1: number; x2: number; y2: number; color: string; strokeWidth?: number;
}) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1) return null;
  const ux = dx / len, uy = dy / len;
  const headLen = 8;
  const px = -uy, py = ux;
  const tip = { x: x2, y: y2 };
  const base1 = { x: x2 - ux * headLen + px * headLen * 0.4, y: y2 - uy * headLen + py * headLen * 0.4 };
  const base2 = { x: x2 - ux * headLen - px * headLen * 0.4, y: y2 - uy * headLen - py * headLen * 0.4 };
  return (
    <>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <polygon points={`${tip.x},${tip.y} ${base1.x},${base1.y} ${base2.x},${base2.y}`} fill={color} />
    </>
  );
}

const GRID_RANGE = [-3, -2, -1, 0, 1, 2, 3];

export default function LinearAlgebraViz({ accentColor = "#6c63ff" }: { accentColor?: string }) {
  const vt = useVizTheme();
  const locale = useLocale();
  const PRESETS = locale === "fr" ? PRESETS_FR : locale === "ar" ? PRESETS_AR : PRESETS_EN;

  const VIZ_LABELS = {
    en: { title: "Linear Transformations — 2D Matrix Effects", origSpace: "Original Space", transSpace: "Transformed Space", areaFactor: "Area scaling factor = |det(A)| =", singular: "det = 0 (singular)" },
    fr: { title: "Transformations Linéaires — Effets 2D des Matrices", origSpace: "Espace Original", transSpace: "Espace Transformé", areaFactor: "Facteur d'échelle surfacique = |det(A)| =", singular: "det = 0 (singulière)" },
    ar: { title: "التحويلات الخطية — تأثيرات المصفوفات 2D", origSpace: "الفضاء الأصلي", transSpace: "الفضاء المحوَّل", areaFactor: "معامل تحجيم المساحة = |det(A)| =", singular: "det = 0 (مفردة)" },
  };
  const VL = VIZ_LABELS[locale as keyof typeof VIZ_LABELS] ?? VIZ_LABELS.en;

  const [preset, setPreset] = useState(0);

  const m = PRESETS[preset].matrix;
  const d = det(m);
  const eigs = eigenvalues(m);
  const absDet = Math.abs(d);

  // Build transformed grid lines
  const transformedLines = useMemo(() => {
    const lines: Array<{ x1: number; y1: number; x2: number; y2: number; strong: boolean }> = [];
    // horizontal lines (y = const, x from -3 to 3)
    for (const row of GRID_RANGE) {
      const [sx1, sy1] = applyMatrix(m, -3, row);
      const [sx2, sy2] = applyMatrix(m, 3, row);
      lines.push({
        x1: R_OX + sx1 * SCALE, y1: R_OY - sy1 * SCALE,
        x2: R_OX + sx2 * SCALE, y2: R_OY - sy2 * SCALE,
        strong: row === 0,
      });
    }
    // vertical lines (x = const, y from -3 to 3)
    for (const col of GRID_RANGE) {
      const [sx1, sy1] = applyMatrix(m, col, -3);
      const [sx2, sy2] = applyMatrix(m, col, 3);
      lines.push({
        x1: R_OX + sx1 * SCALE, y1: R_OY - sy1 * SCALE,
        x2: R_OX + sx2 * SCALE, y2: R_OY - sy2 * SCALE,
        strong: col === 0,
      });
    }
    return lines;
  }, [preset]); // eslint-disable-line react-hooks/exhaustive-deps

  // Transformed basis vectors
  const [e1tx, e1ty] = applyMatrix(m, 1, 0);
  const [e2tx, e2ty] = applyMatrix(m, 0, 1);

  return (
    <VizCard>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {VL.title}
        </span>
        <div className="flex gap-1 flex-wrap justify-end">
          {PRESETS.map((p, i) => (
            <button key={p.name} onClick={() => setPreset(i)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold"
              style={{
                backgroundColor: preset === i ? `${accentColor}22` : "transparent",
                color: preset === i ? accentColor : vt.textMuted,
                border: `1px solid ${preset === i ? accentColor + "55" : "var(--border)"}`,
              }}>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* ── Left panel: Original space ── */}
        {/* Panel background */}
        <rect x={PAD - 4} y={4} width={HALF - 8} height={H - 8} rx={6} fill={vt.surface} />
        <text x={L_OX} y={16} textAnchor="middle" fontSize={9} fill={vt.textMuted} fontWeight="600">
          {VL.origSpace}
        </text>

        {/* Left grid lines */}
        {GRID_RANGE.map(v => {
          const strong = v === 0;
          const stroke = strong ? vt.axis : vt.grid;
          const sw = strong ? 1.5 : 1;
          const [lx1, ly1] = toSVG(L_OX, L_OY, -3, v);
          const [lx2, ly2] = toSVG(L_OX, L_OY, 3, v);
          const [lx3, ly3] = toSVG(L_OX, L_OY, v, -3);
          const [lx4, ly4] = toSVG(L_OX, L_OY, v, 3);
          return (
            <g key={v}>
              <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke={stroke} strokeWidth={sw} />
              <line x1={lx3} y1={ly3} x2={lx4} y2={ly4} stroke={stroke} strokeWidth={sw} />
            </g>
          );
        })}

        {/* Left basis vectors */}
        <ArrowHead x1={L_OX} y1={L_OY} x2={L_OX + SCALE} y2={L_OY} color="#ef4444" strokeWidth={2.5} />
        <ArrowHead x1={L_OX} y1={L_OY} x2={L_OX} y2={L_OY - SCALE} color="#22c55e" strokeWidth={2.5} />
        <text x={L_OX + SCALE + 4} y={L_OY + 4} fontSize={9} fill={vt.ink("#ef4444")} fontWeight="bold">e₁</text>
        <text x={L_OX + 2} y={L_OY - SCALE - 4} fontSize={9} fill={vt.ink("#22c55e")} fontWeight="bold">e₂</text>

        {/* ── Right panel: Transformed space ── */}
        <rect x={PAD + HALF + PAD - 4} y={4} width={HALF - 8} height={H - 8} rx={6} fill={vt.surface} />
        <text x={R_OX} y={16} textAnchor="middle" fontSize={9} fill={vt.textMuted} fontWeight="600">
          {VL.transSpace}
        </text>

        {/* Transformed grid lines with AnimatePresence keyed on preset */}
        <AnimatePresence mode="wait">
          <motion.g key={`grid-${preset}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            {transformedLines.map((line, i) => (
              <line key={i}
                x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                stroke={line.strong ? vt.axis : vt.grid}
                strokeWidth={line.strong ? 1.5 : 1}
              />
            ))}
          </motion.g>
        </AnimatePresence>

        {/* Transformed basis vectors */}
        <AnimatePresence mode="wait">
          <motion.g key={`basis-${preset}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <ArrowHead x1={R_OX} y1={R_OY}
              x2={R_OX + e1tx * SCALE} y2={R_OY - e1ty * SCALE}
              color="#ef4444" strokeWidth={2.5} />
            <ArrowHead x1={R_OX} y1={R_OY}
              x2={R_OX + e2tx * SCALE} y2={R_OY - e2ty * SCALE}
              color="#22c55e" strokeWidth={2.5} />
            <text x={R_OX + e1tx * SCALE + 4} y={R_OY - e1ty * SCALE + 4} fontSize={9} fill={vt.ink("#ef4444")} fontWeight="bold">Ae₁</text>
            <text x={R_OX + e2tx * SCALE + 4} y={R_OY - e2ty * SCALE - 4} fontSize={9} fill={vt.ink("#22c55e")} fontWeight="bold">Ae₂</text>
          </motion.g>
        </AnimatePresence>

        {/* Origin dot right panel */}
        <circle cx={R_OX} cy={R_OY} r={3} fill={vt.axis} />

        {/* Matrix display — positioned inside right panel bounds (fits in 520px viewBox) */}
        <rect x={R_OX + 30} y={6} width={76} height={54} rx={4} fill={vt.surface} stroke={vt.border} strokeWidth={1} />
        <text x={R_OX + 68} y={17} textAnchor="middle" fontSize={8} fill={vt.textMuted} fontWeight="600">A</text>
        {m.map((row, ri) =>
          row.map((val, ci) => (
            <text key={`${ri}-${ci}`}
              x={R_OX + 36 + ci * 32} y={33 + ri * 17}
              fontSize={9} fill={vt.text} fontWeight="600" fontFamily="monospace">
              {val.toFixed(2)}
            </text>
          ))
        )}

        {/* Divider line */}
        <line x1={PAD + HALF + PAD / 2} y1={20} x2={PAD + HALF + PAD / 2} y2={H - 20}
          stroke={vt.border} strokeWidth={1} strokeDasharray="4,4" />
      </svg>

      {/* Insight bar */}
      <div className="px-5 py-3 border-t flex flex-col gap-0.5" style={{ borderColor: "var(--border)" }}>
        <p className="text-xs font-medium" style={{ color: vt.text }}>
          {PRESETS[preset].desc}
        </p>
        <p className="text-xs" style={{ color: vt.textMuted }}>
          {VL.areaFactor} <span className="font-mono font-semibold" style={{ color: accentColor }}>{absDet.toFixed(3)}</span>
          {Math.abs(d) < 1e-9 && <span className="ml-2 text-red-400 font-semibold">{VL.singular}</span>}
        </p>
      </div>
    </VizCard>
  );
}

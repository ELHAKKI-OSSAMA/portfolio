"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const SEG_LABELS = {
  en: {
    title: "Image Segmentation — Semantic vs Instance vs UNet",
    tabs: ["Semantic", "Instance", "UNet"] as readonly string[],
    classesTitle: "Classes",
    semanticNote: "Every pixel labeled with a class — instances not distinguished.",
    classNames: ["Sky", "Building", "Person", "Road", "Car"] as readonly string[],
    instancesTitle: "Instances",
    instanceLabels: ["Sky", "Building 1", "Building 2", "Person", "Road", "Car 1", "Car 2"] as readonly string[],
    instanceNote: "Each object instance gets a unique ID — two cars get different colors.",
    inputLabel: "Input",
    outputLabel: "Output",
    maskLabel: "Mask",
    skipConnections: "← skip connections →",
    insights: {
      semantic: "Every pixel is classified. All cars share the same color. Use case: autonomous driving lane detection, medical tissue typing.",
      instance: "Each object instance has a unique ID. Mask R-CNN adds a mask branch to Faster-RCNN to predict per-instance masks.",
      unet: "Skip connections copy encoder feature maps directly to the decoder — combining deep semantic features with shallow spatial detail. This gives UNet its sharp boundary prediction.",
    },
  },
  fr: {
    title: "Segmentation d'Image — Sémantique vs Instance vs UNet",
    tabs: ["Sémantique", "Instance", "UNet"] as readonly string[],
    classesTitle: "Classes",
    semanticNote: "Chaque pixel est étiqueté avec une classe — les instances ne sont pas distinguées.",
    classNames: ["Ciel", "Bâtiment", "Personne", "Route", "Voiture"] as readonly string[],
    instancesTitle: "Instances",
    instanceLabels: ["Ciel", "Bâtiment 1", "Bâtiment 2", "Personne", "Route", "Voiture 1", "Voiture 2"] as readonly string[],
    instanceNote: "Chaque instance d'objet a un identifiant unique — deux voitures ont des couleurs différentes.",
    inputLabel: "Entrée",
    outputLabel: "Sortie",
    maskLabel: "Masque",
    skipConnections: "← connexions de saut →",
    insights: {
      semantic: "Chaque pixel est classifié. Toutes les voitures partagent la même couleur. Cas d'usage : détection de voies en conduite autonome, typage de tissus médicaux.",
      instance: "Chaque instance d'objet a un identifiant unique. Mask R-CNN ajoute une branche de masque à Faster-RCNN pour prédire des masques par instance.",
      unet: "Les connexions de saut copient les cartes de caractéristiques de l'encodeur directement au décodeur — combinant les caractéristiques sémantiques profondes avec les détails spatiaux de surface. Cela donne à UNet sa prédiction précise des contours.",
    },
  },
  ar: {
    title: "تجزئة الصورة — دلالية مقابل نموذج مقابل UNet",
    tabs: ["دلالية", "نموذج", "UNet"] as readonly string[],
    classesTitle: "الفئات",
    semanticNote: "كل بكسل يُصنَّف بفئة — لا تتمايز النماذج.",
    classNames: ["سماء", "مبنى", "شخص", "طريق", "سيارة"] as readonly string[],
    instancesTitle: "النماذج",
    instanceLabels: ["سماء", "مبنى 1", "مبنى 2", "شخص", "طريق", "سيارة 1", "سيارة 2"] as readonly string[],
    instanceNote: "لكل نموذج كائن معرّف فريد — سيارتان تحصلان على ألوان مختلفة.",
    inputLabel: "إدخال",
    outputLabel: "إخراج",
    maskLabel: "قناع",
    skipConnections: "← اتصالات تخطي →",
    insights: {
      semantic: "كل بكسل مُصنَّف. تشترك جميع السيارات في نفس اللون. حالات الاستخدام: اكتشاف المسارات في القيادة المستقلة، تصنيف الأنسجة الطبية.",
      instance: "لكل نموذج كائن معرّف فريد. يضيف Mask R-CNN فرعاً للقناع إلى Faster-RCNN للتنبؤ بأقنعة لكل نموذج.",
      unet: "تنسخ اتصالات التخطي خرائط ميزات المشفّر مباشرةً إلى وحدة فك الترميز — تجمع بين الميزات الدلالية العميقة والتفاصيل المكانية السطحية. هذا ما يمنح UNet تنبؤاً حاداً بالحدود.",
    },
  },
} as const;

// ── Scene grid: 8 rows × 10 cols, region IDs 0–4 ─────────────────────────────
// 0=Sky, 1=Building, 2=Person, 3=Road, 4=Car
const SCENE: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // row 0 — sky
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // row 1 — sky
  [1, 1, 1, 1, 2, 2, 2, 3, 3, 3], // row 2
  [1, 1, 1, 1, 2, 2, 2, 3, 3, 3], // row 3
  [1, 1, 1, 1, 2, 2, 2, 4, 4, 4], // row 4
  [3, 3, 3, 3, 2, 2, 2, 4, 4, 4], // row 5
  [3, 3, 3, 3, 2, 2, 2, 4, 4, 4], // row 6
  [3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // row 7
];

// ── Semantic colours ──────────────────────────────────────────────────────────
const SEMANTIC_COLORS: Record<number, string> = {
  0: "#87ceeb", // Sky
  1: "#8b7355", // Building
  2: "#ff6b6b", // Person
  3: "#696969", // Road
  4: "__accent__", // Car — replaced at render time
};

const CLASS_NAMES: Record<number, string> = {
  0: "Sky",
  1: "Building",
  2: "Person",
  3: "Road",
  4: "Car",
};

// ── Instance assignments: row × col → instance id ────────────────────────────
// Buildings: cols 0-1 = instance B1, cols 2-3 = instance B2
// Cars: col 7 = C1, cols 8-9 = C2
// Person, Sky, Road: single instances
function getInstanceId(row: number, col: number, regionId: number): number {
  switch (regionId) {
    case 1: return col <= 1 ? 0 : 1; // building instances 0,1
    case 4: return col <= 7 ? 0 : 1; // car instances 0,1
    default: return 0;
  }
}

const INSTANCE_COLORS: Record<number, Record<number, string>> = {
  0: { 0: "#87ceeb" },            // sky
  1: { 0: "#a0846a", 1: "#6b4e35" }, // buildings
  2: { 0: "#ff6b6b" },            // person
  3: { 0: "#696969" },            // road
  4: { 0: "__accent__", 1: "__accent_dark__" }, // cars
};

function resolveInstanceColor(
  regionId: number,
  instanceId: number,
  accentColor: string
): string {
  const map = INSTANCE_COLORS[regionId];
  if (!map) return "#888";
  const c = map[instanceId] ?? "#888";
  if (c === "__accent__") return accentColor;
  if (c === "__accent_dark__") {
    // Darken accent by mixing with black at 40%
    const r = parseInt(accentColor.slice(1, 3), 16);
    const g = parseInt(accentColor.slice(3, 5), 16);
    const b = parseInt(accentColor.slice(5, 7), 16);
    const dr = Math.round(r * 0.6).toString(16).padStart(2, "0");
    const dg = Math.round(g * 0.6).toString(16).padStart(2, "0");
    const db = Math.round(b * 0.6).toString(16).padStart(2, "0");
    return `#${dr}${dg}${db}`;
  }
  return c;
}

// ── Layout ────────────────────────────────────────────────────────────────────
const ROWS = 8;
const COLS = 10;
const CELL_W = 35;
const CELL_H = 30;

const GRID_X = 10;
const GRID_Y = 24;
const GRID_W = COLS * CELL_W;
const GRID_H = ROWS * CELL_H;

const SVG_W = 520;
const SVG_H = 292;

// ── Helper: does a cell have a different-instance neighbour to the right/below?
function hasBoundaryRight(row: number, col: number): boolean {
  if (col >= COLS - 1) return false;
  const rA = SCENE[row][col];
  const rB = SCENE[row][col + 1];
  if (rA !== rB) return false; // different classes, handled by semantic
  return getInstanceId(row, col, rA) !== getInstanceId(row, col + 1, rB);
}

function hasBoundaryBelow(row: number, col: number): boolean {
  if (row >= ROWS - 1) return false;
  const rA = SCENE[row][col];
  const rB = SCENE[row + 1][col];
  if (rA !== rB) return false;
  return getInstanceId(row, col, rA) !== getInstanceId(row + 1, col, rB);
}

type Tab = "semantic" | "instance" | "unet";

const TAB_IDS: Tab[] = ["semantic", "instance", "unet"];

// ── Semantic tab ──────────────────────────────────────────────────────────────
function SemanticTab({
  accentColor,
  vt,
}: {
  accentColor: string;
  vt: ReturnType<typeof useVizTheme>;
}) {
  const L = useVizLocale(SEG_LABELS);

  function cellColor(regionId: number): string {
    const c = SEMANTIC_COLORS[regionId];
    return c === "__accent__" ? accentColor : c;
  }

  // Legend items
  const legendIds = [0, 1, 2, 3, 4];
  const legendX = GRID_X + GRID_W + 16;

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full">
      {/* Grid cells */}
      {SCENE.map((row, r) =>
        row.map((regionId, c) => (
          <motion.g
            key={`${r}-${c}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: r * 0.04 }}
          >
            <rect
              x={GRID_X + c * CELL_W}
              y={GRID_Y + r * CELL_H}
              width={CELL_W - 0.5}
              height={CELL_H - 0.5}
              fill={cellColor(regionId)}
              fillOpacity={0.85}
              rx={1}
            />
          </motion.g>
        ))
      )}

      {/* Grid border */}
      <rect x={GRID_X} y={GRID_Y} width={GRID_W} height={GRID_H}
        fill="none" stroke={vt.axis} strokeWidth={1} rx={3} />

      {/* Legend */}
      <text x={legendX} y={GRID_Y + 14} fontSize={10} fontWeight="600" fill={vt.text}>
        {L.classesTitle}
      </text>
      {legendIds.map((id, i) => (
        <g key={id}>
          <rect x={legendX} y={GRID_Y + 22 + i * 28} width={16} height={16}
            rx={3} fill={cellColor(id)} fillOpacity={0.85} />
          <text x={legendX + 22} y={GRID_Y + 34 + i * 28} fontSize={10} fill={vt.text}>
            {L.classNames[id]}
          </text>
        </g>
      ))}

      {/* Label below grid */}
      <text x={GRID_X + GRID_W / 2} y={GRID_Y + GRID_H + 18}
        textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        {L.semanticNote}
      </text>
    </svg>
  );
}

// ── Instance tab ──────────────────────────────────────────────────────────────
function InstanceTab({
  accentColor,
  vt,
}: {
  accentColor: string;
  vt: ReturnType<typeof useVizTheme>;
}) {
  const L = useVizLocale(SEG_LABELS);

  const legendX = GRID_X + GRID_W + 16;

  const instanceEntries = [
    { label: L.instanceLabels[0], color: "#87ceeb" },
    { label: L.instanceLabels[1], color: "#a0846a" },
    { label: L.instanceLabels[2], color: "#6b4e35" },
    { label: L.instanceLabels[3], color: "#ff6b6b" },
    { label: L.instanceLabels[4], color: "#696969" },
    { label: L.instanceLabels[5], color: accentColor },
    { label: L.instanceLabels[6], color: resolveInstanceColor(4, 1, accentColor) },
  ];

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full">
      {/* Grid cells */}
      {SCENE.map((row, r) =>
        row.map((regionId, c) => {
          const instId = getInstanceId(r, c, regionId);
          const color  = resolveInstanceColor(regionId, instId, accentColor);
          return (
            <motion.g
              key={`${r}-${c}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: r * 0.04 }}
            >
              <rect
                x={GRID_X + c * CELL_W}
                y={GRID_Y + r * CELL_H}
                width={CELL_W - 0.5}
                height={CELL_H - 0.5}
                fill={color}
                fillOpacity={0.85}
                rx={1}
              />
            </motion.g>
          );
        })
      )}

      {/* Instance boundary lines — vertical (right edge of cell) */}
      {SCENE.map((row, r) =>
        row.map((_, c) => {
          if (!hasBoundaryRight(r, c)) return null;
          const lx = GRID_X + (c + 1) * CELL_W;
          const y1 = GRID_Y + r * CELL_H;
          const y2 = y1 + CELL_H;
          return (
            <line key={`vb-${r}-${c}`}
              x1={lx} y1={y1} x2={lx} y2={y2}
              stroke="white" strokeWidth={1.5} strokeDasharray="2,1" />
          );
        })
      )}

      {/* Instance boundary lines — horizontal (bottom edge of cell) */}
      {SCENE.map((row, r) =>
        row.map((_, c) => {
          if (!hasBoundaryBelow(r, c)) return null;
          const ly = GRID_Y + (r + 1) * CELL_H;
          const x1 = GRID_X + c * CELL_W;
          const x2 = x1 + CELL_W;
          return (
            <line key={`hb-${r}-${c}`}
              x1={x1} y1={ly} x2={x2} y2={ly}
              stroke="white" strokeWidth={1.5} strokeDasharray="2,1" />
          );
        })
      )}

      {/* Grid border */}
      <rect x={GRID_X} y={GRID_Y} width={GRID_W} height={GRID_H}
        fill="none" stroke={vt.axis} strokeWidth={1} rx={3} />

      {/* Legend */}
      <text x={legendX} y={GRID_Y + 14} fontSize={10} fontWeight="600" fill={vt.text}>
        {L.instancesTitle}
      </text>
      {instanceEntries.map((entry, i) => (
        <g key={entry.label}>
          <rect x={legendX} y={GRID_Y + 22 + i * 24} width={14} height={14}
            rx={2} fill={entry.color} fillOpacity={0.85} />
          <text x={legendX + 20} y={GRID_Y + 33 + i * 24} fontSize={9} fill={vt.text}>
            {entry.label}
          </text>
        </g>
      ))}

      {/* Label */}
      <text x={GRID_X + GRID_W / 2} y={GRID_Y + GRID_H + 18}
        textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        {L.instanceNote}
      </text>
    </svg>
  );
}

// ── UNet tab — U-shaped architecture ─────────────────────────────────────────
const UNET_W = 520;
const UNET_H = 200;

// Encoder: left→right, each block steps DOWN (increasing cy = deeper in U)
const U_ENC = [
  { x: 8,   w: 68, h: 50, cy: 50  },  // E1 — top of U, largest
  { x: 90,  w: 52, h: 40, cy: 82  },  // E2
  { x: 156, w: 38, h: 30, cy: 108 },  // E3
  { x: 208, w: 28, h: 22, cy: 130 },  // E4 — near bottom
];
const U_BN = { x: 250, w: 22, h: 18, cy: 150 }; // Bottleneck — very bottom
// Decoder: left→right, each block steps UP (decreasing cy = climbing back)
const U_DEC = [
  { x: 286, w: 28, h: 22, cy: 130 },  // D1 — mirrors E4
  { x: 328, w: 38, h: 30, cy: 108 },  // D2 — mirrors E3
  { x: 380, w: 52, h: 40, cy: 82  },  // D3 — mirrors E2
  { x: 446, w: 68, h: 50, cy: 50  },  // D4 — mirrors E1, top of U
];
const U_DEPTH = [1.0, 0.82, 0.67, 0.55]; // color depth per level

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function darkenHex(hex: string, factor: number): string {
  const [r, g, b] = hexToRgb(hex);
  const dr = Math.round(r * factor).toString(16).padStart(2, "0");
  const dg = Math.round(g * factor).toString(16).padStart(2, "0");
  const db = Math.round(b * factor).toString(16).padStart(2, "0");
  return `#${dr}${dg}${db}`;
}

function UNetTab({
  accentColor,
  vt,
}: {
  accentColor: string;
  vt: ReturnType<typeof useVizTheme>;
}) {
  const L = useVizLocale(SEG_LABELS);
  const arrowColor = vt.isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)";

  return (
    <svg viewBox={`0 0 ${UNET_W} ${UNET_H}`} className="w-full">
      <defs>
        <marker id="ua" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <polygon points="0 0, 6 3, 0 6" fill={arrowColor} />
        </marker>
        <marker id="us" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <polygon points="0 0, 6 3, 0 6" fill={accentColor} fillOpacity={0.7} />
        </marker>
      </defs>

      {/* Skip connections — drawn first (behind blocks) */}
      {U_ENC.map((enc, i) => {
        const dec = U_DEC[U_DEC.length - 1 - i]; // E1↔D4, E2↔D3, E3↔D2, E4↔D1
        const color = darkenHex(accentColor, U_DEPTH[i]);
        return (
          <motion.g key={`skip-${i}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.85 + i * 0.08 }}>
            <line
              x1={enc.x + enc.w} y1={enc.cy}
              x2={dec.x} y2={dec.cy}
              stroke={color} strokeWidth={1.2}
              strokeDasharray="5,3" opacity={0.75}
              markerEnd="url(#us)" />
          </motion.g>
        );
      })}

      {/* Encoder blocks + diagonal down-arrows */}
      {U_ENC.map((b, i) => {
        const color = darkenHex(accentColor, U_DEPTH[i]);
        const next = i < U_ENC.length - 1 ? U_ENC[i + 1] : null;
        return (
          <motion.g key={`enc-${i}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}>
            <rect x={b.x} y={b.cy - b.h / 2} width={b.w} height={b.h}
              rx={4} fill={color + "55"} stroke={color} strokeWidth={1.5} />
            <text x={b.x + b.w / 2} y={b.cy + 4}
              textAnchor="middle" fontSize={7} fill={color} fontWeight="600">
              E{i + 1}
            </text>
            {next && (
              <line x1={b.x + b.w} y1={b.cy} x2={next.x} y2={next.cy}
                stroke={arrowColor} strokeWidth={1} markerEnd="url(#ua)" />
            )}
          </motion.g>
        );
      })}

      {/* E4 → Bottleneck */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
        <line x1={U_ENC[3].x + U_ENC[3].w} y1={U_ENC[3].cy}
          x2={U_BN.x} y2={U_BN.cy}
          stroke={arrowColor} strokeWidth={1} markerEnd="url(#ua)" />
      </motion.g>

      {/* Bottleneck */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={U_BN.x} y={U_BN.cy - U_BN.h / 2} width={U_BN.w} height={U_BN.h}
          rx={3} fill={accentColor + "88"} stroke={accentColor} strokeWidth={2} />
        <text x={U_BN.x + U_BN.w / 2} y={U_BN.cy + U_BN.h / 2 + 11}
          textAnchor="middle" fontSize={6.5} fill={vt.ink(accentColor)} fontWeight="700">BN</text>
        <text x={U_BN.x + U_BN.w / 2} y={U_BN.cy + U_BN.h / 2 + 21}
          textAnchor="middle" fontSize={6} fill={vt.textMuted}>28×28</text>
      </motion.g>

      {/* Bottleneck → D1 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
        <line x1={U_BN.x + U_BN.w} y1={U_BN.cy}
          x2={U_DEC[0].x} y2={U_DEC[0].cy}
          stroke={arrowColor} strokeWidth={1} markerEnd="url(#ua)" />
      </motion.g>

      {/* Decoder blocks + diagonal up-arrows */}
      {U_DEC.map((b, i) => {
        const encIdx = U_ENC.length - 1 - i; // D1→E4 depth, D4→E1 depth
        const color = darkenHex(accentColor, U_DEPTH[encIdx]);
        const next = i < U_DEC.length - 1 ? U_DEC[i + 1] : null;
        return (
          <motion.g key={`dec-${i}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.6 + i * 0.1 }}>
            <rect x={b.x} y={b.cy - b.h / 2} width={b.w} height={b.h}
              rx={4} fill={color + "44"} stroke={color} strokeWidth={1.5} />
            <text x={b.x + b.w / 2} y={b.cy + 4}
              textAnchor="middle" fontSize={7} fill={color} fontWeight="600">
              D{i + 1}
            </text>
            {next && (
              <line x1={b.x + b.w} y1={b.cy} x2={next.x} y2={next.cy}
                stroke={arrowColor} strokeWidth={1} markerEnd="url(#ua)" />
            )}
          </motion.g>
        );
      })}

      {/* Labels */}
      <text x={U_ENC[0].x + U_ENC[0].w / 2} y={U_ENC[0].cy + U_ENC[0].h / 2 + 12}
        textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>{L.inputLabel}</text>
      <text x={U_ENC[0].x + U_ENC[0].w / 2} y={U_ENC[0].cy + U_ENC[0].h / 2 + 22}
        textAnchor="middle" fontSize={6.5} fill={vt.textMuted}>572×572</text>

      <text x={U_DEC[3].x + U_DEC[3].w / 2} y={U_DEC[3].cy + U_DEC[3].h / 2 + 12}
        textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>{L.outputLabel}</text>
      <text x={U_DEC[3].x + U_DEC[3].w / 2} y={U_DEC[3].cy + U_DEC[3].h / 2 + 22}
        textAnchor="middle" fontSize={6.5} fill={vt.textMuted}>{L.maskLabel}</text>

      <text x={UNET_W / 2} y={12} textAnchor="middle" fontSize={8}
        fill={vt.ink(accentColor)} fontWeight="600">{L.skipConnections}</text>
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function SegmentationViz({ accentColor = "#6c63ff" }: { accentColor?: string }) {
  const vt = useVizTheme();
  const L = useVizLocale(SEG_LABELS);
  const [tab, setTab] = useState<Tab>("semantic");

  return (
    <div className="rounded-2xl overflow-hidden border"
      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b"
        style={{ borderColor: "var(--border)" }}>
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {L.title}
        </span>
        <div className="flex gap-1">
          {TAB_IDS.map((id, ti) => (
            <button key={id} onClick={() => setTab(id)}
              className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
              style={{
                backgroundColor: tab === id ? `${accentColor}22` : "transparent",
                color:            tab === id ? accentColor : vt.textMuted,
                border:           `1px solid ${tab === id ? accentColor + "55" : "var(--border)"}`,
              }}>
              {L.tabs[ti]}
            </button>
          ))}
        </div>
      </div>

      {/* Viz area */}
      <AnimatePresence mode="wait">
        <motion.div key={tab}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}>

          {tab === "semantic" && (
            <SemanticTab accentColor={accentColor} vt={vt} />
          )}

          {tab === "instance" && (
            <InstanceTab accentColor={accentColor} vt={vt} />
          )}

          {tab === "unet" && (
            <UNetTab accentColor={accentColor} vt={vt} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Insight bar */}
      <div className="px-5 py-3 border-t" style={{ borderColor: "var(--border)" }}>
        <p className="text-xs" style={{ color: vt.textMuted }}>
          {L.insights[tab]}
        </p>
      </div>
    </div>
  );
}

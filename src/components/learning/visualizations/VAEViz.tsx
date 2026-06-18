"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const VAE_LABELS = {
  en: {
    title: "VAE — Variational Autoencoder",
    tabEncode: "Encode",
    tabDecode: "Decode",
    inputSamples: "Input samples",
    classLabel: (name: string) => `Class ${name}`,
    encodeHint: "Encoder q(z|x)",
    decodeHint: "Click class to set z",
    latentSpace: "Latent space z ∈ ℝ²",
    reparamTitle: "Reparameterize",
    recoTitle: "Reconstruction",
    nearest: (name: string) => `Nearest: Class ${name}`,
    confHigh: "High confidence",
    confMed: "Medium confidence",
    confLow: "Low confidence",
    statClasses: "Classes",
  },
  fr: {
    title: "VAE — Auto-encodeur Variationnel",
    tabEncode: "Encoder",
    tabDecode: "Décoder",
    inputSamples: "Exemples d'entrée",
    classLabel: (name: string) => `Classe ${name}`,
    encodeHint: "Encodeur q(z|x)",
    decodeHint: "Cliquer sur la classe pour définir z",
    latentSpace: "Espace latent z ∈ ℝ²",
    reparamTitle: "Reparamétrisation",
    recoTitle: "Reconstruction",
    nearest: (name: string) => `Plus proche : Classe ${name}`,
    confHigh: "Confiance élevée",
    confMed: "Confiance moyenne",
    confLow: "Confiance faible",
    statClasses: "Classes",
  },
  ar: {
    title: "VAE — مشفّر تلقائي تغايري",
    tabEncode: "ترميز",
    tabDecode: "فك الترميز",
    inputSamples: "عينات مدخلة",
    classLabel: (name: string) => `صنف ${name}`,
    encodeHint: "مشفّر q(z|x)",
    decodeHint: "انقر على صنف لتعيين z",
    latentSpace: "الفضاء الكامن z ∈ ℝ²",
    reparamTitle: "إعادة المعلمة",
    recoTitle: "إعادة البناء",
    nearest: (name: string) => `الأقرب: صنف ${name}`,
    confHigh: "ثقة عالية",
    confMed: "ثقة متوسطة",
    confLow: "ثقة منخفضة",
    statClasses: "أصناف",
  },
} as const;

// ── Class definitions in latent space ────────────────────────────────────────
const CLASSES = [
  { name: "A", shape: "circle",   mu: [-2.0, 0.5],  sigma: 0.6, color: "#6c63ff" },
  { name: "B", shape: "square",   mu: [1.5, -1.5],  sigma: 0.7, color: "#ff6b6b" },
  { name: "C", shape: "triangle", mu: [0.0, 2.0],   sigma: 0.5, color: "#22c55e" },
] as const;

// Deterministic samples per class (offsets from μ)
const OFFSETS: [number, number][] = [
  [0.3, -0.2], [-0.4, 0.3], [0.1, 0.5], [-0.3, -0.4],
  [0.5, 0.1], [-0.1, -0.5], [0.4, -0.3], [-0.5, 0.2],
  [0.2, 0.4], [-0.2, -0.1],
];

// Latent space: x ∈ [-4, 4], y ∈ [-4, 4]
const LATENT_RANGE: [number, number] = [-4, 4];
const PANEL_W = 200, PANEL_H = 220;
const PAD = 20;

function toSVGX(v: number, w: number = PANEL_W) {
  return PAD + ((v - LATENT_RANGE[0]) / (LATENT_RANGE[1] - LATENT_RANGE[0])) * (w - 2 * PAD);
}
function toSVGY(v: number, h: number = PANEL_H) {
  return h - PAD - ((v - LATENT_RANGE[0]) / (LATENT_RANGE[1] - LATENT_RANGE[0])) * (h - 2 * PAD);
}
function fromSVGX(px: number, w: number = PANEL_W) {
  return LATENT_RANGE[0] + ((px - PAD) / (w - 2 * PAD)) * (LATENT_RANGE[1] - LATENT_RANGE[0]);
}
function fromSVGY(py: number, h: number = PANEL_H) {
  return LATENT_RANGE[0] + (1 - (py - PAD) / (h - 2 * PAD)) * (LATENT_RANGE[1] - LATENT_RANGE[0]);
}

// Nearest class based on z
function nearestClass(zx: number, zy: number) {
  let bestIdx = 0, bestDist = Infinity;
  CLASSES.forEach((cls, i) => {
    const d = Math.sqrt((zx - cls.mu[0]) ** 2 + (zy - cls.mu[1]) ** 2);
    if (d < bestDist) { bestDist = d; bestIdx = i; }
  });
  return { cls: CLASSES[bestIdx], idx: bestIdx, dist: bestDist };
}

// Approximate KL divergence from standard normal for each class
function klDivergence(muArr: number[], sigma: number) {
  const k = 2; // 2D
  const muSq = muArr.reduce((s, v) => s + v * v, 0);
  const sigmaSq = sigma * sigma;
  return 0.5 * (k * sigmaSq + muSq - k - k * Math.log(sigmaSq));
}

// ── Shape renderers ───────────────────────────────────────────────────────────
function ShapeIcon({ shape, x, y, size, color, opacity = 1 }: {
  shape: string; x: number; y: number; size: number; color: string; opacity?: number;
}) {
  if (shape === "circle") {
    return <circle cx={x} cy={y} r={size / 2} fill={color} opacity={opacity} />;
  }
  if (shape === "square") {
    return <rect x={x - size / 2} y={y - size / 2} width={size} height={size} rx={2} fill={color} opacity={opacity} />;
  }
  // triangle
  const h = size * 0.866;
  return (
    <polygon
      points={`${x},${y - h * 0.6} ${x + size / 2},${y + h * 0.4} ${x - size / 2},${y + h * 0.4}`}
      fill={color} opacity={opacity}
    />
  );
}

// ── Ellipse for σ region ──────────────────────────────────────────────────────
function SigmaEllipse({ mu, sigma, color, vt }: {
  mu: [number, number]; sigma: number; color: string;
  vt: ReturnType<typeof import("@/hooks/useVizTheme").useVizTheme>;
}) {
  const cx = toSVGX(mu[0]);
  const cy = toSVGY(mu[1]);
  const range = LATENT_RANGE[1] - LATENT_RANGE[0];
  const rx = (sigma * 2 / range) * (PANEL_W - 2 * PAD);
  const ry = (sigma * 2 / range) * (PANEL_H - 2 * PAD);
  return (
    <>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry}
        fill={color} opacity={0.1}
        stroke={color} strokeWidth={1} strokeDasharray="4,3"
      />
      <text x={cx} y={cy - ry - 5} textAnchor="middle" fontSize={8} fill={vt.ink(color)} opacity={0.8}>
        ±2σ
      </text>
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function VAEViz({ accentColor = "#a855f7" }: { accentColor?: string }) {
  const [tab, setTab] = useState<"encode" | "decode">("encode");
  const [z, setZ] = useState<[number, number]>([0.5, -0.5]);
  const [dragging, setDragging] = useState(false);
  const [selectedClass, setSelectedClass] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const vt = useVizTheme();
  const L = useVizLocale(VAE_LABELS);

  const getSVGPos = useCallback((e: React.MouseEvent) => {
    const svg = svgRef.current!;
    const rect = svg.getBoundingClientRect();
    const rawX = (e.clientX - rect.left) * (PANEL_W / rect.width);
    const rawY = (e.clientY - rect.top) * (PANEL_H / rect.height);
    return [
      Math.max(LATENT_RANGE[0] + 0.1, Math.min(LATENT_RANGE[1] - 0.1, fromSVGX(rawX))),
      Math.max(LATENT_RANGE[0] + 0.1, Math.min(LATENT_RANGE[1] - 0.1, fromSVGY(rawY))),
    ] as [number, number];
  }, []);

  const { cls: nearCls, dist: nearDist } = nearestClass(z[0], z[1]);
  const recoVariation = nearDist * 0.3;

  // Encode: show μ and σ for selected class
  const encCls = CLASSES[selectedClass];
  const epsilon: [number, number] = [
    parseFloat((Math.sin(selectedClass * 7.3 + 1.1) * 0.8).toFixed(3)),
    parseFloat((Math.cos(selectedClass * 5.7 + 2.3) * 0.6).toFixed(3)),
  ];
  const sampledZ: [number, number] = [
    parseFloat((encCls.mu[0] + epsilon[0] * encCls.sigma).toFixed(3)),
    parseFloat((encCls.mu[1] + epsilon[1] * encCls.sigma).toFixed(3)),
  ];

  const kl = CLASSES.map(c => klDivergence(c.mu as unknown as number[], c.sigma));

  return (
    <VizCard>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{L.title}</span>
          {(["encode", "decode"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
              style={{
                backgroundColor: tab === t ? `${accentColor}25` : "transparent",
                color: tab === t ? accentColor : "var(--text-muted)",
                border: `1px solid ${tab === t ? accentColor + "50" : "var(--border)"}`,
              }}
            >
              {t === "encode" ? L.tabEncode : L.tabDecode}
            </button>
          ))}
        </div>
      </div>

      <div className="flex" style={{ minHeight: 240 }}>
        {/* ── Left panel: Input samples ── */}
        <div className="flex flex-col items-center justify-center gap-2 px-4 py-4 border-r" style={{ borderColor: "var(--border)", minWidth: 130 }}>
          <span className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>{L.inputSamples}</span>
          {CLASSES.map((cls, ci) => (
            <button
              key={ci}
              onClick={() => {
                setSelectedClass(ci);
                if (tab === "decode") setZ(cls.mu as unknown as [number, number]);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl w-full transition-all"
              style={{
                backgroundColor: selectedClass === ci ? cls.color + "20" : "transparent",
                border: `1px solid ${selectedClass === ci ? cls.color + "60" : "var(--border)"}`,
              }}
            >
              <svg width={18} height={18} viewBox="0 0 18 18">
                <ShapeIcon shape={cls.shape} x={9} y={9} size={13} color={cls.color} />
              </svg>
              <span className="text-xs font-semibold" style={{ color: cls.color }}>{L.classLabel(cls.name)}</span>
            </button>
          ))}
          <div className="mt-2 text-center">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {tab === "encode" ? L.encodeHint : L.decodeHint}
            </span>
          </div>
        </div>

        {/* ── Middle panel: Latent space ── */}
        <div className="flex flex-col items-center flex-1">
          <span className="text-xs font-semibold pt-2" style={{ color: "var(--text-muted)" }}>{L.latentSpace}</span>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${PANEL_W} ${PANEL_H}`}
            style={{ width: PANEL_W, cursor: dragging ? "grabbing" : "crosshair" }}
            onMouseMove={e => { if (dragging) setZ(getSVGPos(e)); }}
            onMouseUp={() => setDragging(false)}
            onMouseLeave={() => setDragging(false)}
            onClick={e => { if (!dragging) setZ(getSVGPos(e)); }}
          >
            {/* Grid */}
            {[-3, -2, -1, 0, 1, 2, 3].map(v => (
              <g key={v}>
                <line x1={toSVGX(v)} y1={PAD} x2={toSVGX(v)} y2={PANEL_H - PAD}
                  stroke={v === 0 ? vt.gridStrong : vt.grid} strokeWidth={v === 0 ? 1.5 : 0.8} />
                <line x1={PAD} y1={toSVGY(v)} x2={PANEL_W - PAD} y2={toSVGY(v)}
                  stroke={v === 0 ? vt.gridStrong : vt.grid} strokeWidth={v === 0 ? 1.5 : 0.8} />
                {v !== 0 && (
                  <text x={toSVGX(v)} y={PANEL_H - PAD + 12} textAnchor="middle" fontSize={7} fill={vt.textFaint}>{v}</text>
                )}
              </g>
            ))}

            {/* σ ellipses */}
            {CLASSES.map((cls, ci) => (
              <SigmaEllipse key={ci} mu={cls.mu as unknown as [number, number]} sigma={cls.sigma} color={cls.color} vt={vt} />
            ))}

            {/* Sample points */}
            {CLASSES.map((cls, ci) =>
              OFFSETS.slice(0, 9).map((off, si) => (
                <ShapeIcon
                  key={`${ci}-${si}`}
                  shape={cls.shape}
                  x={toSVGX(cls.mu[0] + off[0] * cls.sigma)}
                  y={toSVGY(cls.mu[1] + off[1] * cls.sigma)}
                  size={7}
                  color={cls.color}
                  opacity={0.65}
                />
              ))
            )}

            {/* Class μ markers */}
            {CLASSES.map((cls, ci) => (
              <g key={`mu-${ci}`}>
                <circle cx={toSVGX(cls.mu[0])} cy={toSVGY(cls.mu[1])} r={5}
                  fill={cls.color} stroke={vt.isDark ? "#000" : "#fff"} strokeWidth={1.5} />
                <text x={toSVGX(cls.mu[0]) + 7} y={toSVGY(cls.mu[1]) - 6} fontSize={8} fill={cls.color} fontWeight="bold">μ_{cls.name}</text>
              </g>
            ))}

            {/* Sampled z (for encode tab) */}
            {tab === "encode" && (
              <motion.g
                animate={{ cx: toSVGX(sampledZ[0]), cy: toSVGY(sampledZ[1]) }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
              >
                <circle
                  cx={toSVGX(sampledZ[0])}
                  cy={toSVGY(sampledZ[1])}
                  r={8}
                  fill={encCls.color + "30"}
                  stroke={encCls.color}
                  strokeWidth={2}
                  strokeDasharray="4,2"
                />
                <text x={toSVGX(sampledZ[0])} y={toSVGY(sampledZ[1]) + 4} textAnchor="middle" fontSize={10} fill={encCls.color}>z</text>
              </motion.g>
            )}

            {/* Draggable z (for decode tab) */}
            {tab === "decode" && (
              <g onMouseDown={() => setDragging(true)} style={{ cursor: "grab" }}>
                <motion.text
                  x={toSVGX(z[0])} y={toSVGY(z[1]) + 5}
                  textAnchor="middle" fontSize={16} fill={accentColor}
                  animate={{ x: toSVGX(z[0]), y: toSVGY(z[1]) + 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  ✦
                </motion.text>
                <motion.circle
                  cx={toSVGX(z[0])} cy={toSVGY(z[1])} r={16}
                  fill="transparent"
                  animate={{ cx: toSVGX(z[0]), cy: toSVGY(z[1]) }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              </g>
            )}
          </svg>
        </div>

        {/* ── Right panel: Reconstruction / reparameterization ── */}
        <div className="flex flex-col items-center justify-center gap-3 px-4 py-4 border-l" style={{ borderColor: "var(--border)", minWidth: 130 }}>
          <AnimatePresence mode="wait">
            {tab === "encode" ? (
              <motion.div
                key={`encode-${selectedClass}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-2 w-full"
              >
                <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>{L.reparamTitle}</span>
                <div className="w-full rounded-xl p-2 text-center" style={{ backgroundColor: encCls.color + "15", border: `1px solid ${encCls.color}40` }}>
                  <div className="text-xs font-mono" style={{ color: encCls.color }}>
                    μ = [{encCls.mu[0]}, {encCls.mu[1]}]
                  </div>
                  <div className="text-xs font-mono mt-0.5" style={{ color: encCls.color }}>
                    σ = {encCls.sigma}
                  </div>
                </div>
                <div className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
                  ε ~ N(0,1)
                </div>
                <div className="text-xs font-mono text-center" style={{ color: accentColor }}>
                  ε = [{epsilon[0]}, {epsilon[1]}]
                </div>
                <div className="w-full rounded-xl p-2 text-center" style={{ backgroundColor: accentColor + "15", border: `1px solid ${accentColor}40` }}>
                  <div className="text-xs font-semibold mb-0.5" style={{ color: accentColor }}>z = μ + ε·σ</div>
                  <div className="text-xs font-mono" style={{ color: accentColor }}>
                    [{sampledZ[0]}, {sampledZ[1]}]
                  </div>
                </div>
                <svg width={48} height={48} viewBox="0 0 48 48">
                  <ShapeIcon shape={encCls.shape} x={24} y={24} size={28} color={encCls.color} opacity={0.85} />
                </svg>
                <span className="text-xs" style={{ color: encCls.color }}>Class {encCls.name}</span>
              </motion.div>
            ) : (
              <motion.div
                key={`decode-${nearCls.name}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-2 w-full"
              >
                <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>{L.recoTitle}</span>
                <div className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
                  z = [{z[0].toFixed(2)}, {z[1].toFixed(2)}]
                </div>
                <div className="w-full rounded-xl p-2 text-center" style={{ backgroundColor: nearCls.color + "15", border: `1px solid ${nearCls.color}40` }}>
                  <div className="text-xs font-semibold" style={{ color: nearCls.color }}>{L.nearest(nearCls.name)}</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>dist: {nearDist.toFixed(2)}</div>
                </div>
                <svg width={54} height={54} viewBox="0 0 54 54">
                  <ShapeIcon shape={nearCls.shape} x={27} y={27} size={30} color={nearCls.color} opacity={0.9} />
                  {/* Slight variation blobs */}
                  <circle cx={27 + recoVariation * 10} cy={27 - recoVariation * 8} r={3}
                    fill={nearCls.color} opacity={0.25} />
                  <circle cx={27 - recoVariation * 7} cy={27 + recoVariation * 12} r={2.5}
                    fill={nearCls.color} opacity={0.2} />
                </svg>
                <span className="text-xs font-semibold" style={{ color: nearCls.color }}>
                  p(x|z) → Class {nearCls.name}
                </span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {nearDist < 0.8 ? L.confHigh : nearDist < 1.5 ? L.confMed : L.confLow}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Formula bar */}
      <div className="px-5 py-2 border-t" style={{ borderColor: "var(--border)" }}>
        <AnimatePresence mode="wait">
          {tab === "encode" ? (
            <motion.div key="enc-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                q(z|x) = N(μ(x), σ²(x)) &nbsp;·&nbsp; z = μ + ε·σ, ε~N(0,1)
              </span>
            </motion.div>
          ) : (
            <motion.div key="dec-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                p(x|z) = N(μ(z), I) &nbsp;·&nbsp; L = E[log p(x|z)] - KL[q(z|x) ‖ p(z)]
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats */}
      <StatGrid py="py-3" items={[
          { label: L.statClasses, value: "3", color: accentColor },
          { label: "KL(A)", value: kl[0].toFixed(2), color: CLASSES[0].color },
          { label: "KL(B)", value: kl[1].toFixed(2), color: CLASSES[1].color },
          { label: "KL(C)", value: kl[2].toFixed(2), color: CLASSES[2].color },
      ]} />
    </VizCard>
  );
}

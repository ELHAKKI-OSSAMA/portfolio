"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Plus, StopCircle } from "lucide-react";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const LR_LABELS = {
  en: {
    title: "Interactive Linear Regression",
    subtitle: "drag points · watch gradient descent learn",
    addBtn: "Add",
    residualsBtn: "Residuals",
    stopBtn: "Stop",
    gdBtn: "GD",
    iterLabel: "iter",
    lossLabel: "Loss ↓",
    slopeLabel: "Slope β₁",
    r2Label: "R²",
    mseLabel: "MSE",
    olsTarget: "OLS:",
  },
  fr: {
    title: "Régression Linéaire Interactive",
    subtitle: "faites glisser les points · regardez la descente de gradient apprendre",
    addBtn: "Ajouter",
    residualsBtn: "Résidus",
    stopBtn: "Arrêter",
    gdBtn: "DG",
    iterLabel: "iter",
    lossLabel: "Perte ↓",
    slopeLabel: "Pente β₁",
    r2Label: "R²",
    mseLabel: "ECM",
    olsTarget: "MCO:",
  },
  ar: {
    title: "الانحدار الخطي التفاعلي",
    subtitle: "اسحب النقاط · شاهد الانحدار التدرجي يتعلم",
    addBtn: "إضافة",
    residualsBtn: "البواقي",
    stopBtn: "إيقاف",
    gdBtn: "GD",
    iterLabel: "تكرار",
    lossLabel: "خسارة ↓",
    slopeLabel: "ميل β₁",
    r2Label: "R²",
    mseLabel: "MSE",
    olsTarget: "MCO:",
  },
} as const;

interface Point { x: number; y: number; }

const W = 520, H = 320, PAD = 40;

function toCanvas(p: Point, xRange: [number, number], yRange: [number, number]): [number, number] {
  const cx = PAD + ((p.x - xRange[0]) / (xRange[1] - xRange[0])) * (W - 2 * PAD);
  const cy = H - PAD - ((p.y - yRange[0]) / (yRange[1] - yRange[0])) * (H - 2 * PAD);
  return [cx, cy];
}

function fromCanvas(cx: number, cy: number, xRange: [number, number], yRange: [number, number]): Point {
  return {
    x: xRange[0] + ((cx - PAD) / (W - 2 * PAD)) * (xRange[1] - xRange[0]),
    y: yRange[0] + ((H - PAD - cy) / (H - 2 * PAD)) * (yRange[1] - yRange[0]),
  };
}

function computeStats(pts: Point[], m: number, b: number) {
  if (pts.length < 2) return { slope: m, intercept: b, r2: 0, mse: 0 };
  const n = pts.length;
  const my = pts.reduce((s, p) => s + p.y, 0) / n;
  const ss_res = pts.reduce((s, p) => s + (p.y - (m * p.x + b)) ** 2, 0);
  const ss_tot = pts.reduce((s, p) => s + (p.y - my) ** 2, 0);
  return {
    slope: m,
    intercept: b,
    r2: ss_tot === 0 ? 1 : 1 - ss_res / ss_tot,
    mse: ss_res / n,
  };
}

function ols(pts: Point[]) {
  const n = pts.length;
  if (n < 2) return { m: 0, b: 0 };
  const mx = pts.reduce((s, p) => s + p.x, 0) / n;
  const my = pts.reduce((s, p) => s + p.y, 0) / n;
  const num = pts.reduce((s, p) => s + (p.x - mx) * (p.y - my), 0);
  const den = pts.reduce((s, p) => s + (p.x - mx) ** 2, 0);
  const m = den === 0 ? 0 : num / den;
  return { m, b: my - m * mx };
}

const INIT_PTS: Point[] = [
  { x: 1, y: 2.2 }, { x: 2, y: 3.1 }, { x: 3, y: 5.8 }, { x: 4, y: 4.9 },
  { x: 5, y: 7.1 }, { x: 6, y: 6.4 }, { x: 7, y: 8.2 }, { x: 8, y: 9.0 },
  { x: 9, y: 10.5 }, { x: 2.5, y: 1.8 }, { x: 5.5, y: 8.8 }, { x: 7.5, y: 7.5 },
];
const X_RANGE: [number, number] = [0, 10];
const Y_RANGE: [number, number] = [0, 12];

export default function LinearRegressionViz({ accentColor = "#6c63ff" }: { accentColor?: string }) {
  const [points, setPoints] = useState<Point[]>(INIT_PTS);
  const [dragging, setDragging] = useState<number | null>(null);
  const [showResiduals, setShowResiduals] = useState(true);
  const [addMode, setAddMode] = useState(false);
  const [gdPath, setGdPath] = useState<Array<{ m: number; b: number }>>([]);
  const [gdStep, setGdStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lossHistory, setLossHistory] = useState<number[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const vt = useVizTheme();
  const L = useVizLocale(LR_LABELS);

  // Current displayed line — OLS baseline or GD animation step
  const olsResult = ols(points);
  const activeLine = gdPath.length > 0 ? gdPath[gdStep] : olsResult;

  // Live stats from the currently displayed line (updates every GD frame)
  const liveStats = computeStats(points, activeLine.m, activeLine.b);
  const olsStats = computeStats(points, olsResult.m, olsResult.b);
  const isLearning = isAnimating && gdPath.length > 0;

  const getSVGPoint = (e: React.MouseEvent) => {
    const svg = svgRef.current!;
    const rect = svg.getBoundingClientRect();
    return fromCanvas(
      (e.clientX - rect.left) * (W / rect.width),
      (e.clientY - rect.top) * (H / rect.height),
      X_RANGE, Y_RANGE
    );
  };

  const runGradientDescent = useCallback(() => {
    if (isAnimating) return;
    let m = -1.5, b = 11; // bad starting guess
    const lr = 0.02;
    const path: Array<{ m: number; b: number }> = [{ m, b }];
    const losses: number[] = [computeStats(points, m, b).mse];
    for (let i = 0; i < 120; i++) {
      const n = points.length;
      let dm = 0, db = 0;
      for (const p of points) {
        const err = m * p.x + b - p.y;
        dm += err * p.x;
        db += err;
      }
      m -= (lr * 2 / n) * dm;
      b -= (lr * 2 / n) * db;
      path.push({ m, b });
      losses.push(computeStats(points, m, b).mse);
    }
    setGdPath(path);
    setLossHistory(losses);
    setGdStep(0);
    setIsAnimating(true);
  }, [points, isAnimating]);

  useEffect(() => {
    if (isAnimating && gdStep < gdPath.length - 1) {
      const speed = gdStep < 30 ? 45 : gdStep < 80 ? 28 : 18;
      const t = setTimeout(() => setGdStep(s => s + 1), speed);
      return () => clearTimeout(t);
    } else if (gdStep >= gdPath.length - 1 && isAnimating) {
      setIsAnimating(false);
    }
  }, [isAnimating, gdStep, gdPath.length]);

  const lineX1 = 0, lineX2 = 10;
  const [lx1, ly1] = toCanvas({ x: lineX1, y: activeLine.m * lineX1 + activeLine.b }, X_RANGE, Y_RANGE);
  const [lx2, ly2] = toCanvas({ x: lineX2, y: activeLine.m * lineX2 + activeLine.b }, X_RANGE, Y_RANGE);

  const handleMouseDown = (i: number, e: React.MouseEvent) => { e.preventDefault(); setDragging(i); };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging === null) return;
    const pt = getSVGPoint(e);
    setPoints(prev => {
      const updated = [...prev];
      updated[dragging] = { x: Math.max(0.2, Math.min(9.8, pt.x)), y: Math.max(0.2, Math.min(11.8, pt.y)) };
      return updated;
    });
  };
  const handleSvgClick = (e: React.MouseEvent) => {
    if (!addMode || dragging !== null) return;
    const pt = getSVGPoint(e);
    if (pt.x > 0.2 && pt.x < 9.8 && pt.y > 0.2 && pt.y < 11.8) setPoints(prev => [...prev, pt]);
  };

  // Loss spark-line path
  const lossSpark = lossHistory.length > 1 ? lossHistory.slice(0, gdStep + 1).map((l, i) => {
    const maxL = lossHistory[0], minL = lossHistory[lossHistory.length - 1];
    const range = maxL - minL || 1;
    const x = (i / (lossHistory.length - 1)) * 90;
    const y = 20 - ((l - minL) / range) * 18;
    return `${i === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ") : "";

  const stats = [
    { label: L.slopeLabel, value: liveStats.slope.toFixed(3), target: olsStats.slope.toFixed(3) },
    { label: L.r2Label, value: liveStats.r2.toFixed(4), target: olsStats.r2.toFixed(4) },
    { label: L.mseLabel, value: liveStats.mse.toFixed(3), target: olsStats.mse.toFixed(3) },
  ];

  return (
    <VizCard>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <div>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{L.title}</span>
          <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>{L.subtitle}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setAddMode(m => !m)} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
            style={{ backgroundColor: addMode ? `${accentColor}30` : "var(--bg-card)", color: addMode ? accentColor : "var(--text-muted)", border: `1px solid ${addMode ? accentColor : "var(--border)"}` }}>
            <Plus size={11} /> {L.addBtn}
          </button>
          <button onClick={() => setShowResiduals(r => !r)} className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
            style={{ backgroundColor: showResiduals ? "#ff6b6b20" : "var(--bg-card)", color: showResiduals ? "#ff6b6b" : "var(--text-muted)", border: `1px solid ${showResiduals ? "#ff6b6b50" : "var(--border)"}` }}>
            {L.residualsBtn}
          </button>
          <button onClick={isAnimating ? () => setIsAnimating(false) : runGradientDescent}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
            style={{ backgroundColor: isAnimating ? "#ff6b6b20" : `${accentColor}20`, color: isAnimating ? "#ff6b6b" : accentColor, border: `1px solid ${isAnimating ? "#ff6b6b50" : accentColor + "50"}` }}>
            {isAnimating ? <><StopCircle size={11} /> {L.stopBtn}</> : <><Play size={11} /> {L.gdBtn}</>}
          </button>
          <button onClick={() => { setPoints(INIT_PTS); setGdPath([]); setGdStep(0); setLossHistory([]); setIsAnimating(false); }}
            className="p-1.5 rounded-lg transition-all" style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}>
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full"
        style={{ cursor: addMode ? "crosshair" : "default" }}
        onMouseMove={handleMouseMove} onMouseUp={() => setDragging(null)} onMouseLeave={() => setDragging(null)} onClick={handleSvgClick}>
        {[2, 4, 6, 8].map(v => {
          const [gx] = toCanvas({ x: v, y: 0 }, X_RANGE, Y_RANGE);
          const [, gy] = toCanvas({ x: 0, y: v }, X_RANGE, Y_RANGE);
          return (
            <g key={v}>
              <line x1={gx} y1={PAD} x2={gx} y2={H - PAD} stroke={vt.grid} strokeWidth={1} />
              <line x1={PAD} y1={gy} x2={W - PAD} y2={gy} stroke={vt.grid} strokeWidth={1} />
              <text x={gx} y={H - PAD + 14} textAnchor="middle" fontSize={10} fill={vt.textMuted}>{v}</text>
              <text x={PAD - 8} y={gy + 4} textAnchor="end" fontSize={10} fill={vt.textMuted}>{v}</text>
            </g>
          );
        })}
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke={vt.axis} strokeWidth={1.5} />
        <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke={vt.axis} strokeWidth={1.5} />

        {/* GD starting line ghost */}
        {gdPath.length > 0 && (() => {
          const start = gdPath[0];
          const [sx1, sy1] = toCanvas({ x: 0, y: start.m * 0 + start.b }, X_RANGE, Y_RANGE);
          const [sx2, sy2] = toCanvas({ x: 10, y: start.m * 10 + start.b }, X_RANGE, Y_RANGE);
          return <line x1={sx1} y1={sy1} x2={sx2} y2={sy2} stroke={accentColor} strokeWidth={1} opacity={0.2} strokeDasharray="4,4" />;
        })()}

        {/* Residual lines */}
        {showResiduals && points.map((pt, i) => {
          const [px, py] = toCanvas(pt, X_RANGE, Y_RANGE);
          const predY = activeLine.m * pt.x + activeLine.b;
          const [, predPy] = toCanvas({ x: pt.x, y: predY }, X_RANGE, Y_RANGE);
          return <line key={i} x1={px} y1={py} x2={px} y2={predPy} stroke="#ff6b6b" strokeWidth={1.5} strokeDasharray="3,3" opacity={0.6} />;
        })}

        {/* OLS target line (faded) */}
        {isLearning && (() => {
          const [ox1, oy1] = toCanvas({ x: 0, y: olsResult.b }, X_RANGE, Y_RANGE);
          const [ox2, oy2] = toCanvas({ x: 10, y: olsResult.m * 10 + olsResult.b }, X_RANGE, Y_RANGE);
          return <line x1={ox1} y1={oy1} x2={ox2} y2={oy2} stroke={accentColor} strokeWidth={1.5} opacity={0.25} strokeDasharray="6,4" />;
        })()}

        {/* Regression line */}
        <motion.line
          x1={lx1} y1={Math.max(PAD - 20, Math.min(H + 20, ly1))}
          x2={lx2} y2={Math.max(PAD - 20, Math.min(H + 20, ly2))}
          stroke={accentColor} strokeWidth={isLearning ? 2 : 2.5} strokeLinecap="round"
          animate={{ x1: lx1, y1: ly1, x2: lx2, y2: ly2 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />

        {/* GD iteration counter */}
        {isLearning && (
          <text x={W - PAD - 4} y={PAD + 14} textAnchor="end" fontSize={10} fill={vt.ink(accentColor)} fontFamily="monospace">
            {L.iterLabel} {gdStep}/{gdPath.length - 1}
          </text>
        )}

        {/* Loss spark-line inset */}
        {lossSpark && (
          <g transform={`translate(${W - PAD - 95}, ${PAD + 20})`}>
            <rect x={-2} y={-2} width={96} height={26} rx={4} fill={vt.isDark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.7)"} />
            <text x={0} y={-4} fontSize={8} fill={vt.textMuted}>{L.lossLabel}</text>
            <path d={lossSpark} fill="none" stroke={accentColor} strokeWidth={1.5} />
          </g>
        )}

        {/* Data points */}
        {points.map((pt, i) => {
          const [px, py] = toCanvas(pt, X_RANGE, Y_RANGE);
          return (
            <g key={i} onMouseDown={e => handleMouseDown(i, e)} style={{ cursor: "grab" }}>
              <circle cx={px} cy={py} r={10} fill="transparent" />
              <motion.circle cx={px} cy={py} r={5} fill={vt.pointFill} stroke={accentColor} strokeWidth={2}
                initial={false} animate={{ cx: px, cy: py }} transition={{ type: "spring", stiffness: 400, damping: 30 }}
                whileHover={{ r: 7 }} />
            </g>
          );
        })}
      </svg>

      {/* Live stats bar — animates during GD */}
      <div className="px-5 py-3 grid grid-cols-3 gap-4 border-t text-center" style={{ borderColor: "var(--border)" }}>
        {stats.map(({ label, value, target }) => (
          <div key={label}>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</div>
            <AnimatePresence mode="wait">
              <motion.div key={value}
                initial={{ opacity: 0.5, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-bold font-mono"
                style={{ color: isLearning ? "#f59e0b" : accentColor }}>
                {value}
              </motion.div>
            </AnimatePresence>
            {isLearning && (
              <div className="text-xs font-mono mt-0.5" style={{ color: vt.textFaint }}>
                {L.olsTarget} {target}
              </div>
            )}
          </div>
        ))}
      </div>
    </VizCard>
  );
}

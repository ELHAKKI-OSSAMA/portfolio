"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const PCA_LABELS = {
  en: {
    title: "PCA — Principal Component Analysis",
    projections: "Projections",
    varianceExplained: "Variance Explained",
    keepPC1: (pct: number, noise: number) => `Keep PC1 only → retain ${pct}% of info, discard ${noise}% noise.`,
  },
  fr: {
    title: "ACP — Analyse en Composantes Principales",
    projections: "Projections",
    varianceExplained: "Variance Expliquée",
    keepPC1: (pct: number, noise: number) => `Garder PC1 seulement → conserver ${pct}% de l'info, rejeter ${noise}% de bruit.`,
  },
  ar: {
    title: "PCA — تحليل المكونات الرئيسية",
    projections: "الإسقاطات",
    varianceExplained: "التباين المُفسَّر",
    keepPC1: (pct: number, noise: number) => `الاحتفاظ بـPC1 فقط ← الاحتفاظ بـ${pct}% من المعلومات، تجاهل ${noise}% ضوضاء.`,
  },
} as const;

const W = 380, H = 280;
const CX = W / 2, CY = H / 2;

// 30 correlated 2-D points (roughly y ≈ 0.7x + noise)
const RAW_PTS = [
  [-2.1,-1.6],[-1.8,-1.1],[-1.5,-0.9],[-1.4,-1.3],[-1.2,-0.7],
  [-1.0,-0.4],[-0.8,-0.9],[-0.7,-0.2],[-0.5,-0.5],[-0.4, 0.1],
  [-0.3,-0.3],[ 0.0, 0.2],[ 0.1,-0.1],[ 0.2, 0.4],[ 0.4, 0.0],
  [ 0.5, 0.6],[ 0.6, 0.2],[ 0.7, 0.8],[ 0.9, 0.5],[ 1.0, 0.9],
  [ 1.1, 0.6],[ 1.2, 1.0],[ 1.3, 0.7],[ 1.4, 1.2],[ 1.5, 0.8],
  [ 1.6, 1.3],[ 1.8, 1.1],[ 1.9, 1.5],[ 2.0, 1.2],[ 2.2, 1.6],
];

// PC1 direction ≈ 45° (unit vector along correlation axis)
const PC1 = { dx: Math.cos(Math.PI/4), dy: Math.sin(Math.PI/4) };
// PC2 direction ≈ perpendicular (135°)
const PC2 = { dx: Math.cos(3*Math.PI/4), dy: Math.sin(3*Math.PI/4) };

const SCALE = 55; // px per unit

function toSVG(x: number, y: number) {
  return { sx: CX + x * SCALE, sy: CY - y * SCALE };
}

function projectOntoPC1(x: number, y: number) {
  const t = x * PC1.dx + y * PC1.dy;
  return { px: t * PC1.dx, py: t * PC1.dy };
}

const VAR_EXPLAINED = [78, 22]; // PC1=78%, PC2=22%

export default function PCAViz({ accentColor = "#6c63ff" }: { accentColor?: string }) {
  const vt = useVizTheme();
  const L = useVizLocale(PCA_LABELS);
  const [showPC2, setShowPC2] = useState(false);
  const [showProj, setShowProj] = useState(false);

  const PC1_LEN = 2.8, PC2_LEN = 1.4;

  const arrowHead = (ex: number, ey: number, dx: number, dy: number, col: string) => {
    const angle = Math.atan2(-dy, dx) + Math.PI;
    const a1 = angle + 2.6, a2 = angle - 2.6;
    const r = 8;
    return (
      <g>
        <line x1={CX} y1={CY}
          x2={ex} y2={ey} stroke={col} strokeWidth={2.5} />
        <polygon
          points={`${ex},${ey} ${ex + r*Math.cos(a1)},${ey - r*Math.sin(a1)} ${ex + r*Math.cos(a2)},${ey - r*Math.sin(a2)}`}
          fill={col} />
      </g>
    );
  };

  return (
    <div className="rounded-2xl overflow-hidden border" style={{ backgroundColor:"var(--bg-card)", borderColor:"var(--border)" }}>
      {/* header */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor:"var(--border)" }}>
        <span className="text-sm font-semibold" style={{ color:"var(--text-primary)" }}>
          {L.title}
        </span>
        <div className="flex gap-1">
          <button onClick={() => setShowPC2(v=>!v)}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold"
            style={{ backgroundColor:showPC2?`#f9731622`:"transparent", color:showPC2?"#f97316":vt.textMuted, border:`1px solid ${showPC2?"#f9731655":"var(--border)"}` }}>
            PC2
          </button>
          <button onClick={() => setShowProj(v=>!v)}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold"
            style={{ backgroundColor:showProj?`${accentColor}22`:"transparent", color:showProj?accentColor:vt.textMuted, border:`1px solid ${showProj?accentColor+"55":"var(--border)"}` }}>
            {L.projections}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* scatter plot */}
        <svg viewBox={`0 0 ${W} ${H}`} style={{ flex:"0 0 auto", width:"58%" }}>
          {/* grid lines */}
          {[-2,-1,0,1,2].map(v => {
            const {sx,sy} = toSVG(v,0); const {sx:sx2,sy:sy2} = toSVG(0,v);
            return (
              <g key={v}>
                <line x1={sx} y1={10} x2={sx} y2={H-10} stroke={vt.grid} strokeWidth={1} />
                <line x1={10} y1={sy2} x2={W-10} y2={sy2} stroke={vt.grid} strokeWidth={1} />
              </g>
            );
          })}

          {/* PC2 arrow */}
          {showPC2 && (
            <motion.g initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
              {arrowHead(
                CX + PC2.dx*SCALE*PC2_LEN, CY - PC2.dy*SCALE*PC2_LEN,
                -PC2.dx, PC2.dy, "#f97316"
              )}
              <text x={CX + PC2.dx*SCALE*(PC2_LEN+0.3)} y={CY - PC2.dy*SCALE*(PC2_LEN+0.3) + 4}
                textAnchor="middle" fontSize={11} fill="#f97316" fontWeight="bold">PC2</text>
            </motion.g>
          )}

          {/* PC1 arrow */}
          {arrowHead(
            CX + PC1.dx*SCALE*PC1_LEN, CY - PC1.dy*SCALE*PC1_LEN,
            -PC1.dx, PC1.dy, accentColor
          )}
          <text x={CX + PC1.dx*SCALE*(PC1_LEN+0.3)} y={CY - PC1.dy*SCALE*(PC1_LEN+0.3) + 4}
            textAnchor="middle" fontSize={11} fill={vt.ink(accentColor)} fontWeight="bold">PC1</text>

          {/* projection lines */}
          {showProj && RAW_PTS.map(([x,y], i) => {
            const {sx,sy} = toSVG(x,y);
            const proj = projectOntoPC1(x,y);
            const {sx:px,sy:py} = toSVG(proj.px, proj.py);
            return (
              <motion.g key={i} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: i*0.02 }}>
                <line x1={sx} y1={sy} x2={px} y2={py} stroke={accentColor+"60"} strokeWidth={1} strokeDasharray="3,2" />
                <circle cx={px} cy={py} r={3} fill={accentColor} />
              </motion.g>
            );
          })}

          {/* data points */}
          {RAW_PTS.map(([x,y], i) => {
            const {sx,sy} = toSVG(x,y);
            return (
              <motion.g key={i} initial={{ opacity:0, scale:0 }} animate={{ opacity:1, scale:1 }}
                transition={{ delay: i*0.025, type:"spring", stiffness:400 }}>
                <circle cx={sx} cy={sy} r={4} fill={accentColor+"cc"} stroke={accentColor} strokeWidth={1} />
              </motion.g>
            );
          })}
        </svg>

        {/* variance explained panel */}
        <div className="flex flex-col justify-center px-5 gap-4" style={{ flex:1 }}>
          <div className="text-xs font-semibold" style={{ color:"var(--text-primary)" }}>{L.varianceExplained}</div>
          {[{label:"PC1", val:VAR_EXPLAINED[0], col:accentColor},{label:"PC2", val:VAR_EXPLAINED[1], col:"#f97316"}].map(pc => (
            <div key={pc.label}>
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color:pc.col, fontWeight:700 }}>{pc.label}</span>
                <span style={{ color:"var(--text-primary)", fontWeight:700 }}>{pc.val}%</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor:vt.surface }}>
                <motion.div className="h-3 rounded-full"
                  style={{ backgroundColor:pc.col }}
                  initial={{ width:0 }} animate={{ width:`${pc.val}%` }}
                  transition={{ duration:0.8, ease:"easeOut" }} />
              </div>
            </div>
          ))}
          <div className="text-xs mt-2" style={{ color:vt.textMuted }}>
            {L.keepPC1(VAR_EXPLAINED[0], VAR_EXPLAINED[1]).split(/(\d+%)/).map((part, i) =>
              /\d+%/.test(part)
                ? <span key={i} style={{ color: i === 1 ? accentColor : "#f97316", fontWeight:700 }}>{part}</span>
                : part
            )}
          </div>
        </div>
      </div>

      {/* formula bar */}
      <div className="px-5 py-2 border-t" style={{ borderColor:"var(--border)" }}>
        <span className="text-xs font-mono" style={{ color:vt.textMuted }}>
          <span style={{ color:accentColor }}>z</span> = Xᵀ<span style={{ color:accentColor }}>v₁</span>
          &nbsp;·&nbsp; cov(X) = <span style={{ color:accentColor }}>V</span>Λ<span style={{ color:accentColor }}>V</span>ᵀ
          &nbsp;·&nbsp; {RAW_PTS.length} points → 2D → 1D projection
        </span>
      </div>
    </div>
  );
}

"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const QL_LABELS = {
  en: {
    title: "Q-Learning — 4×4 Grid World",
    stepBtn: "Step →",
    resetBtn: "Reset",
    epHeatmap: (ep: number) => `Episode ${ep} · Q-value heat map`,
    epCheckpoint: "Episode checkpoint:",
    epLabel: (ep: number, isInit: boolean, isConv: boolean) =>
      `Ep ${ep}${isInit ? " (initial)" : isConv ? " (converged)" : ""}`,
    bestAction: "Best action per state (top row):",
    start: "Start",
    goal: "Goal",
    wall: "Wall",
    insight: "Q-learning learns the value of (state, action) pairs through trial-and-error. After 200 episodes, the agent discovers the optimal path around walls to the goal.",
  },
  fr: {
    title: "Q-Learning — Monde en Grille 4×4",
    stepBtn: "Étape →",
    resetBtn: "Réinitialiser",
    epHeatmap: (ep: number) => `Épisode ${ep} · Carte de chaleur Q`,
    epCheckpoint: "Point de contrôle d'épisode :",
    epLabel: (ep: number, isInit: boolean, isConv: boolean) =>
      `Ép ${ep}${isInit ? " (initial)" : isConv ? " (convergé)" : ""}`,
    bestAction: "Meilleure action par état (première ligne) :",
    start: "Départ",
    goal: "Objectif",
    wall: "Mur",
    insight: "Le Q-learning apprend la valeur des paires (état, action) par essais et erreurs. Après 200 épisodes, l'agent découvre le chemin optimal autour des murs vers l'objectif.",
  },
  ar: {
    title: "Q-Learning — عالم الشبكة 4×4",
    stepBtn: "خطوة →",
    resetBtn: "إعادة تعيين",
    epHeatmap: (ep: number) => `الحلقة ${ep} · خريطة حرارة Q`,
    epCheckpoint: "نقطة تفتيش الحلقة:",
    epLabel: (ep: number, isInit: boolean, isConv: boolean) =>
      `حلقة ${ep}${isInit ? " (أولية)" : isConv ? " (متقاربة)" : ""}`,
    bestAction: "أفضل إجراء لكل حالة (الصف الأعلى):",
    start: "بداية",
    goal: "هدف",
    wall: "جدار",
    insight: "يتعلم Q-learning قيمة أزواج (الحالة، الإجراء) من خلال المحاولة والخطأ. بعد 200 حلقة، يكتشف العميل المسار الأمثل حول الجدران نحو الهدف.",
  },
} as const;

// ── Grid world constants ──────────────────────────────────────────────────────
const GRID = 4;
const WALLS = new Set([1 * GRID + 1, 2 * GRID + 2]); // (1,1) and (2,2)
const START = 0;                     // (0,0)
const GOAL  = GRID * GRID - 1;       // (3,3)
const ACTIONS = 4;                   // 0=Up 1=Down 2=Left 3=Right
const ACTION_LABELS = ["↑", "↓", "←", "→"];
const ACTION_DX = [0, 0, -1, 1];
const ACTION_DY = [-1, 1, 0, 0];

const REWARD_GOAL  =  10;
const REWARD_STEP  =  -1;
const REWARD_WALL  =  -5;

const LR    = 0.5;   // learning rate
const GAMMA = 0.95;  // discount
const EPSILON = 0.3; // exploration rate

// ── Deterministic Q-learning simulation ────────────────────────────────────────
// No Math.random() — actions chosen in deterministic round-robin order per episode
function stateToXY(s: number): [number, number] {
  return [s % GRID, Math.floor(s / GRID)];
}
function xyToState(x: number, y: number): number {
  return y * GRID + x;
}
function isWall(s: number): boolean {
  return WALLS.has(s);
}
function step(state: number, action: number): { next: number; reward: number; done: boolean } {
  if (state === GOAL) return { next: GOAL, reward: 0, done: true };
  const [x, y] = stateToXY(state);
  const nx = x + ACTION_DX[action];
  const ny = y + ACTION_DY[action];
  // out of bounds — stay
  if (nx < 0 || nx >= GRID || ny < 0 || ny >= GRID) {
    return { next: state, reward: REWARD_WALL, done: false };
  }
  const ns = xyToState(nx, ny);
  if (isWall(ns)) {
    return { next: state, reward: REWARD_WALL, done: false };
  }
  if (ns === GOAL) return { next: GOAL, reward: REWARD_GOAL, done: true };
  return { next: ns, reward: REWARD_STEP, done: false };
}

function simulateQLearning(): Record<number, Float32Array> {
  // Q[state * ACTIONS + action]
  const q = new Float32Array(GRID * GRID * ACTIONS).fill(0);
  const snapshots: Record<number, Float32Array> = { 0: new Float32Array(q) };
  const checkpoints = [10, 50, 100, 200];

  // Deterministic exploration: at each step pick greedy if q-values differ,
  // else use action = (stepCount % ACTIONS) as tie-breaking / exploration substitute
  let stepCount = 0;

  for (let ep = 1; ep <= 200; ep++) {
    let state = START;
    let maxSteps = 80;
    while (maxSteps-- > 0) {
      if (state === GOAL) break;
      // ε-greedy: use deterministic "random" based on stepCount
      let action: number;
      const useExplore = (stepCount % Math.round(1 / EPSILON)) === 0;
      if (useExplore) {
        action = stepCount % ACTIONS;
      } else {
        // greedy
        let bestA = 0;
        let bestQ = q[state * ACTIONS + 0];
        for (let a = 1; a < ACTIONS; a++) {
          const qv = q[state * ACTIONS + a];
          if (qv > bestQ) { bestQ = qv; bestA = a; }
        }
        action = bestA;
      }
      const { next, reward, done } = step(state, action);
      // Bellman update
      let maxNextQ = 0;
      for (let a = 0; a < ACTIONS; a++) {
        const qv = q[next * ACTIONS + a];
        if (qv > maxNextQ) maxNextQ = qv;
      }
      const target = reward + (done ? 0 : GAMMA * maxNextQ);
      q[state * ACTIONS + action] += LR * (target - q[state * ACTIONS + action]);
      state = next;
      stepCount++;
      if (done) break;
    }
    if (checkpoints.includes(ep)) {
      snapshots[ep] = new Float32Array(q);
    }
  }
  return snapshots;
}

// ── Compute optimal path from Q-table ────────────────────────────────────────
function getOptimalPath(q: Float32Array): number[] {
  const path: number[] = [START];
  const visited = new Set<number>([START]);
  let state = START;
  for (let i = 0; i < 30; i++) {
    if (state === GOAL) break;
    let bestA = 0, bestQ = q[state * ACTIONS + 0];
    for (let a = 1; a < ACTIONS; a++) {
      if (q[state * ACTIONS + a] > bestQ) { bestQ = q[state * ACTIONS + a]; bestA = a; }
    }
    const { next } = step(state, bestA);
    if (visited.has(next)) break;
    visited.add(next);
    path.push(next);
    state = next;
  }
  return path;
}

// Color for Q-value heat map: blue → yellow → red
function qHeatColor(val: number, minV: number, maxV: number): string {
  if (maxV - minV < 1e-9) return "#334155";
  const t = Math.max(0, Math.min(1, (val - minV) / (maxV - minV)));
  // blue(0.1) → teal(0.3) → yellow(0.6) → red(1.0)
  const r = Math.round(t < 0.5 ? 40 + t * 2 * 160 : 200 + (t - 0.5) * 2 * 55);
  const g = Math.round(t < 0.25 ? 80 : t < 0.75 ? 80 + (t - 0.25) * 4 * 120 : 200 - (t - 0.75) * 4 * 160);
  const b = Math.round(t < 0.5 ? 180 - t * 2 * 140 : 40);
  return `rgb(${r},${g},${b})`;
}

// ── Layout constants ─────────────────────────────────────────────────────────
const CELL = 50;
const GRID_W = GRID * CELL;         // 200
const GRID_H = GRID * CELL;         // 200
const GX = 20;                       // grid top-left x in SVG
const GY = 28;                       // grid top-left y in SVG
const W = 520, H = 260;

const CHECKPOINTS = [0, 10, 50, 100, 200] as const;

export default function QLearningViz({ accentColor = "#6c63ff" }: { accentColor?: string }) {
  const vt = useVizTheme();
  const L = useVizLocale(QL_LABELS);
  const snapshots = useMemo(() => simulateQLearning(), []);
  const [epIdx, setEpIdx] = useState(4); // default to ep=200
  const [stepIdx, setStepIdx] = useState<number | null>(null);

  const ep = CHECKPOINTS[epIdx];
  const q = snapshots[ep];

  // max Q per state
  const maxQPerState = useMemo(() => {
    const res: number[] = [];
    for (let s = 0; s < GRID * GRID; s++) {
      let mx = q[s * ACTIONS + 0];
      for (let a = 1; a < ACTIONS; a++) if (q[s * ACTIONS + a] > mx) mx = q[s * ACTIONS + a];
      res.push(mx);
    }
    return res;
  }, [q]);

  const minQ = Math.min(...maxQPerState.filter((_, i) => !isWall(i) && i !== GOAL));
  const maxQ = Math.max(...maxQPerState.filter((_, i) => !isWall(i) && i !== GOAL));

  const optPath = useMemo(() => getOptimalPath(snapshots[200]), [snapshots]);
  const steppedPath = stepIdx !== null ? optPath.slice(0, stepIdx + 1) : null;
  const displayPath = ep === 200 ? (steppedPath ?? optPath) : null;

  // Agent position
  const agentState = displayPath ? displayPath[displayPath.length - 1] : START;
  const [agentX, agentY] = stateToXY(agentState);

  return (
    <VizCard>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {L.title}
        </span>
        <div className="flex items-center gap-2">
          {ep === 200 && (
            <button
              onClick={() => setStepIdx(prev => {
                if (prev === null) return 0;
                return prev < optPath.length - 1 ? prev + 1 : prev;
              })}
              className="px-3 py-1 rounded-lg text-xs font-semibold"
              style={{
                backgroundColor: `${accentColor}22`,
                color: accentColor,
                border: `1px solid ${accentColor}55`,
              }}>
              {L.stepBtn}
            </button>
          )}
          {stepIdx !== null && (
            <button
              onClick={() => setStepIdx(null)}
              className="px-2 py-1 rounded-lg text-xs"
              style={{ color: vt.textMuted, border: `1px solid var(--border)` }}>
              {L.resetBtn}
            </button>
          )}
        </div>
      </div>

      <div className="flex">
        {/* SVG grid */}
        <svg viewBox={`0 0 ${GRID_W + GX * 2} ${GRID_H + GY + 14}`} style={{ width: GRID_W + GX * 2 + 10, flexShrink: 0 }}>
          {/* Title */}
          <text x={GX + GRID_W / 2} y={16} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
            {L.epHeatmap(ep)}
          </text>

          {/* Cells */}
          {Array.from({ length: GRID * GRID }, (_, s) => {
            const [cx, cy] = stateToXY(s);
            const sx = GX + cx * CELL;
            const sy = GY + cy * CELL;
            const isW = isWall(s);
            const isG = s === GOAL;
            const isSt = s === START;
            const mq = maxQPerState[s];

            let fill = qHeatColor(mq, minQ, maxQ);
            if (isW) fill = vt.isDark ? "#1e293b" : "#94a3b8";
            if (isG) fill = "#22c55e";
            if (isSt) fill = "#3b82f6";

            return (
              <g key={s}>
                <rect x={sx + 1} y={sy + 1} width={CELL - 2} height={CELL - 2} rx={4}
                  fill={fill} fillOpacity={isW ? 1 : 0.85} />
                {/* Cell label */}
                {isW && (
                  <text x={sx + CELL / 2} y={sy + CELL / 2 + 4} textAnchor="middle" fontSize={14} fill={vt.textFaint}>■</text>
                )}
                {isG && (
                  <text x={sx + CELL / 2} y={sy + CELL / 2 + 5} textAnchor="middle" fontSize={11} fill="white" fontWeight="bold">G</text>
                )}
                {isSt && (
                  <text x={sx + CELL / 2} y={sy + CELL / 2 + 5} textAnchor="middle" fontSize={11} fill="white" fontWeight="bold">S</text>
                )}
                {/* Q value text (non-wall, non-special) */}
                {!isW && !isG && !isSt && (
                  <text x={sx + CELL / 2} y={sy + CELL / 2 + 4} textAnchor="middle" fontSize={8}
                    fill="white" stroke="rgba(0,0,0,0.55)" strokeWidth={2.5} paintOrder="stroke"
                    fontWeight="600" opacity={0.9}>
                    {mq.toFixed(1)}
                  </text>
                )}
              </g>
            );
          })}

          {/* Optimal path arrows */}
          {displayPath && displayPath.map((s, i) => {
            if (i === 0) return null;
            const prev = displayPath[i - 1];
            const [px, py] = stateToXY(prev);
            const [cx2, cy2] = stateToXY(s);
            const x1 = GX + px * CELL + CELL / 2;
            const y1 = GY + py * CELL + CELL / 2;
            const x2 = GX + cx2 * CELL + CELL / 2;
            const y2 = GY + cy2 * CELL + CELL / 2;
            const dx = x2 - x1, dy = y2 - y1;
            const len = Math.sqrt(dx * dx + dy * dy);
            const ux = dx / len, uy = dy / len;
            const arrLen = 8;
            const bx = x2 - ux * arrLen * 1.1, by = y2 - uy * arrLen * 1.1;
            const px2 = -uy, py2 = ux;
            return (
              <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
                <line x1={x1} y1={y1} x2={bx} y2={by}
                  stroke={vt.isDark ? "white" : "rgba(0,0,0,0.65)"} strokeWidth={2} strokeOpacity={0.8} />
                <polygon
                  points={`${x2},${y2} ${bx + px2 * arrLen * 0.4},${by + py2 * arrLen * 0.4} ${bx - px2 * arrLen * 0.4},${by - py2 * arrLen * 0.4}`}
                  fill={vt.isDark ? "white" : "rgba(0,0,0,0.65)"} opacity={0.8} />
              </motion.g>
            );
          })}

          {/* Agent circle */}
          <motion.g
            animate={{ x: GX + agentX * CELL + CELL / 2, y: GY + agentY * CELL + CELL / 2 }}
            initial={false}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}>
            <circle cx={0} cy={0} r={10} fill={accentColor} fillOpacity={0.9} stroke={vt.bg} strokeWidth={2} />
            <text x={0} y={4} textAnchor="middle" fontSize={9} fill="white" fontWeight="bold">A</text>
          </motion.g>

          {/* Grid border */}
          <rect x={GX} y={GY} width={GRID_W} height={GRID_H} rx={4} fill="none"
            stroke={vt.border} strokeWidth={1} />
        </svg>

        {/* Right panel: episode selector + Q table excerpt */}
        <div className="flex-1 px-4 py-3 flex flex-col gap-2 min-w-0">
          <div className="text-xs font-semibold" style={{ color: vt.textMuted }}>{L.epCheckpoint}</div>
          <div className="flex flex-col gap-1">
            {CHECKPOINTS.map((c, i) => (
              <button key={c} onClick={() => { setEpIdx(i); setStepIdx(null); }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-left"
                style={{
                  backgroundColor: epIdx === i ? `${accentColor}22` : vt.surface,
                  color: epIdx === i ? accentColor : vt.textMuted,
                  border: `1px solid ${epIdx === i ? accentColor + "55" : "var(--border)"}`,
                }}>
                {L.epLabel(c, c === 0, c === 200)}
              </button>
            ))}
          </div>

          {/* Q-table excerpt for current state */}
          <div className="mt-2">
            <div className="text-xs font-semibold mb-1" style={{ color: vt.textMuted }}>
              {L.bestAction}
            </div>
            <div className="grid grid-cols-4 gap-0.5">
              {Array.from({ length: GRID }, (_, row) =>
                Array.from({ length: GRID }, (_, col) => {
                  const s = xyToState(col, row);
                  const isW = isWall(s);
                  const isG = s === GOAL;
                  if (isW) return (
                    <div key={s} className="text-center text-xs rounded py-0.5"
                      style={{ backgroundColor: vt.surface, color: vt.textFaint }}>■</div>
                  );
                  if (isG) return (
                    <div key={s} className="text-center text-xs rounded py-0.5 font-bold"
                      style={{ backgroundColor: "#22c55e22", color: "#22c55e" }}>G</div>
                  );
                  let bestA = 0;
                  for (let a = 1; a < ACTIONS; a++) {
                    if (q[s * ACTIONS + a] > q[s * ACTIONS + bestA]) bestA = a;
                  }
                  return (
                    <div key={s} className="text-center text-xs rounded py-0.5"
                      style={{
                        backgroundColor: s === START ? "#3b82f622" : vt.surface,
                        color: s === START ? "#3b82f6" : vt.text,
                        fontWeight: s === START ? 700 : 400,
                      }}>
                      {ACTION_LABELS[bestA]}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-2 text-xs mt-auto">
            {[
              { label: L.start, color: "#3b82f6" },
              { label: L.goal, color: "#22c55e" },
              { label: L.wall, color: vt.isDark ? "#334155" : "#94a3b8" },
            ].map(({ label, color }) => (
              <span key={label} className="flex items-center gap-1" style={{ color: vt.textMuted }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: color, display: "inline-block" }} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Insight bar */}
      <div className="px-5 py-3 border-t" style={{ borderColor: "var(--border)" }}>
        <p className="text-xs" style={{ color: vt.textMuted }}>
          {L.insight}
        </p>
      </div>
    </VizCard>
  );
}

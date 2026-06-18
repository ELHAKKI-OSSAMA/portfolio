"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const AT_LABELS = {
  en: {
    title: "Transformer — Self-Attention Walkthrough",
    stepLabels: ["Q, K, V", "Scores", "Softmax", "Output"] as readonly string[],
    qkvHeaders: ["Token", "Q (query)", "K (key)", "V (value)"] as readonly string[],
    keyTokensLabel: "← Key tokens (Kⱼ) →",
    clickInspect: "(click a row to inspect)",
    rawScoresLabel: (q: number) => `Step 1: raw scores  score[${q}][j] = Q[${q}]·Kⱼ / √4`,
    softmaxLabel: "Step 2: attention weights  α = softmax(score)",
    outHeaders: ["Token", "α weight", "V vector", "α × V"] as readonly string[],
    attnOutput: (query: string, vals: string) => `Attention output for "${query}": [${vals}]`,
    heatmapTitle: (head: number) => `Attention matrix — Head ${head} · click row to change query token`,
    queryLabel: "Query:",
  },
  fr: {
    title: "Transformer — Visualisation de l'Auto-Attention",
    stepLabels: ["Q, K, V", "Scores", "Softmax", "Sortie"] as readonly string[],
    qkvHeaders: ["Token", "Q (requête)", "K (clé)", "V (valeur)"] as readonly string[],
    keyTokensLabel: "← Tokens clés (Kⱼ) →",
    clickInspect: "(cliquer sur une ligne pour inspecter)",
    rawScoresLabel: (q: number) => `Étape 1 : scores bruts  score[${q}][j] = Q[${q}]·Kⱼ / √4`,
    softmaxLabel: "Étape 2 : poids d'attention  α = softmax(score)",
    outHeaders: ["Token", "Poids α", "Vecteur V", "α × V"] as readonly string[],
    attnOutput: (query: string, vals: string) => `Sortie d'attention pour « ${query} » : [${vals}]`,
    heatmapTitle: (head: number) => `Matrice d'attention — Tête ${head} · cliquer sur une ligne pour changer le token requête`,
    queryLabel: "Requête :",
  },
  ar: {
    title: "Transformer — عرض الانتباه الذاتي",
    stepLabels: ["Q, K, V", "نتائج", "Softmax", "مخرج"] as readonly string[],
    qkvHeaders: ["رمز", "Q (استعلام)", "K (مفتاح)", "V (قيمة)"] as readonly string[],
    keyTokensLabel: "← رموز المفاتيح (Kⱼ) →",
    clickInspect: "(انقر على صف للفحص)",
    rawScoresLabel: (q: number) => `خطوة 1: النتائج الخام  score[${q}][j] = Q[${q}]·Kⱼ / √4`,
    softmaxLabel: "خطوة 2: أوزان الانتباه  α = softmax(score)",
    outHeaders: ["رمز", "وزن α", "متجه V", "α × V"] as readonly string[],
    attnOutput: (query: string, vals: string) => `مخرج الانتباه لـ "${query}": [${vals}]`,
    heatmapTitle: (head: number) => `مصفوفة الانتباه — رأس ${head} · انقر على صف لتغيير رمز الاستعلام`,
    queryLabel: "استعلام:",
  },
} as const;

// ── Tokens and embeddings ─────────────────────────────────────────────────────
const TOKENS = ["The", "cat", "sat", "mat"];
const D = 4; // dimension

// Fixed embeddings (d=4, one per token)
const EMBEDDINGS: number[][] = [
  [ 0.8,  0.2, -0.4,  0.6],
  [ 0.3,  0.9,  0.5, -0.2],
  [-0.1,  0.4,  0.8,  0.3],
  [ 0.5, -0.3,  0.2,  0.9],
];

// Fixed weight matrices (d×d)
const WQ: number[][] = [
  [ 0.6, -0.2,  0.1,  0.4],
  [ 0.3,  0.7, -0.2,  0.1],
  [-0.1,  0.2,  0.8, -0.3],
  [ 0.4, -0.1,  0.3,  0.6],
];
const WK: number[][] = [
  [ 0.5,  0.3, -0.1,  0.2],
  [-0.2,  0.6,  0.4, -0.1],
  [ 0.1, -0.3,  0.7,  0.2],
  [ 0.3,  0.2, -0.2,  0.5],
];
const WV: number[][] = [
  [ 0.4, -0.1,  0.3,  0.2],
  [ 0.1,  0.5, -0.2,  0.4],
  [ 0.3,  0.1,  0.6, -0.1],
  [-0.2,  0.3,  0.1,  0.7],
];

// ── Math helpers ──────────────────────────────────────────────────────────────
function matVec(M: number[][], v: number[]): number[] {
  return M.map(row => row.reduce((s, m, j) => s + m * v[j], 0));
}

function dot(a: number[], b: number[]): number {
  return a.reduce((s, x, i) => s + x * b[i], 0);
}

function softmax(arr: number[]): number[] {
  const max = Math.max(...arr);
  const exps = arr.map(x => Math.exp(x - max));
  const sum = exps.reduce((s, e) => s + e, 0);
  return exps.map(e => e / sum);
}

// ── Pre-compute Q, K, V ───────────────────────────────────────────────────────
const Q = EMBEDDINGS.map(e => matVec(WQ, e));
const K = EMBEDDINGS.map(e => matVec(WK, e));
const V = EMBEDDINGS.map(e => matVec(WV, e));

// ── Color helpers ─────────────────────────────────────────────────────────────
const C_Q = "#a855f7";  // Query: purple
const C_K = "#06b6d4";  // Key: cyan
const C_V = "#00d4aa";  // Value: green

function barColor(v: number) {
  return v >= 0 ? "#00d4aa" : "#ff6b6b";
}

function attentionBg(w: number, accentColor: string): string {
  const alpha = Math.round(w * 220).toString(16).padStart(2, "0");
  return accentColor + alpha;
}

// ── Bar mini-chart helper ─────────────────────────────────────────────────────
type BarProps = { values: number[]; x: number; y: number; w: number; h: number; color?: string };

function VecBar({ values, x, y, w, h, color }: BarProps) {
  const max = Math.max(...values.map(Math.abs)) || 1;
  const bw = w / values.length - 2;
  return (
    <>
      {values.map((v, i) => {
        const bh = Math.abs(v) / max * (h / 2 - 2);
        const bx = x + i * (bw + 2);
        const by = v >= 0 ? y + h / 2 - bh : y + h / 2;
        const col = color ?? barColor(v);
        return (
          <motion.rect key={i}
            x={bx} y={by} width={bw} height={bh}
            fill={col} rx={1}
            initial={{ height: 0, y: y + h / 2 }}
            animate={{ height: bh, y: by }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          />
        );
      })}
      {/* Center line */}
      <line x1={x} y1={y + h / 2} x2={x + w} y2={y + h / 2}
        stroke="rgba(128,128,128,0.3)" strokeWidth={0.5} />
    </>
  );
}

// ── Steps ─────────────────────────────────────────────────────────────────────
type Step = "qkv" | "scores" | "weights" | "output";
const STEP_KEYS: Step[] = ["qkv", "scores", "weights", "output"];
const STEP_EQS = ["Q=Wᵩ·x, K=Wₖ·x, V=Wᵥ·x", "score = Q·Kᵀ / √d", "α = softmax(score)", "out = Σ αᵢ·Vᵢ"];

const W = 520, PAD = 20;

// ── Component ─────────────────────────────────────────────────────────────────
export default function AttentionViz({ accentColor = "#06b6d4" }: { accentColor?: string }) {
  const [step, setStep]   = useState<Step>("qkv");
  const [query, setQuery] = useState(1); // selected query token index
  const [head, setHead]   = useState(0);
  const vt = useVizTheme();
  const L = useVizLocale(AT_LABELS);
  const STEPS = STEP_KEYS.map((key, i) => ({ key, label: L.stepLabels[i], eq: STEP_EQS[i] }));

  // Head-specific attention matrices (3 fixed heads)
  const HEAD_MATRICES = useMemo(() => {
    const base = Array.from({ length: TOKENS.length }, (_, i) => {
      const scores = TOKENS.map((_, j) => dot(Q[i], K[j]) / Math.sqrt(D));
      return softmax(scores);
    });

    const head1 = base; // baseline
    // Head 2: stronger local context
    const head2 = base.map((row, i) =>
      softmax(row.map((w, j) => Math.log(w + 1e-9) + (Math.abs(i - j) <= 1 ? 1.5 : -0.5)))
    );
    // Head 3: stronger positional
    const head3 = base.map((row, i) =>
      softmax(row.map((w, j) => Math.log(w + 1e-9) + (i === j ? 2 : 0)))
    );
    return [head1, head2, head3];
  }, []);

  const attnMatrix = HEAD_MATRICES[head];

  const rawScores   = TOKENS.map((_, j) => dot(Q[query], K[j]) / Math.sqrt(D));
  const scaledScores = rawScores;
  const weights     = softmax(scaledScores);
  const outputVec   = V[0].map((_, d) =>
    weights.reduce((s, w, j) => s + w * V[j][d], 0)
  );

  // ── Step: QKV panel ───────────────────────────────────────────────────────
  const QKV_PANEL = () => {
    const rows = TOKENS.length;
    const rowH = 54, rowW = W - 2 * PAD;
    const colW = rowW / (rows + 1);
    const vecW = colW - 8, vecH = 30;

    return (
      <svg viewBox={`0 0 ${W} ${rows * rowH + 50}`} className="w-full">
        {/* Column headers */}
        {L.qkvHeaders.map((h, ci) => (
          <text key={ci} x={PAD + ci * colW + colW / 2} y={18}
            textAnchor="middle" fontSize={9}
            fill={ci === 0 ? vt.textMuted : ci === 1 ? C_Q : ci === 2 ? C_K : C_V}>
            {String(h)}
          </text>
        ))}

        {TOKENS.map((tok, ri) => {
          const ry = 30 + ri * rowH;
          const isQuery = ri === query;
          return (
            <g key={ri}
              onClick={() => setQuery(ri)}
              style={{ cursor: "pointer" }}>
              {/* Row highlight */}
              {isQuery && (
                <rect x={PAD - 2} y={ry - 2} width={rowW + 4} height={rowH}
                  fill={`${accentColor}0e`} stroke={`${accentColor}30`}
                  strokeWidth={1} rx={6} />
              )}

              {/* Token label */}
              <rect x={PAD + 2} y={ry + 6} width={colW - 12} height={24} rx={5}
                fill={isQuery ? `${accentColor}20` : vt.surface}
                stroke={isQuery ? accentColor : vt.border} strokeWidth={isQuery ? 1.5 : 0.5} />
              <text x={PAD + colW / 2} y={ry + 22} textAnchor="middle"
                fontSize={10} fill={isQuery ? accentColor : vt.text} fontWeight={isQuery ? "bold" : "normal"}>
                {tok}
              </text>

              {/* Q bar */}
              <VecBar values={Q[ri]}
                x={PAD + colW + 4} y={ry + 4} w={vecW} h={vecH} color={C_Q} />

              {/* K bar */}
              <VecBar values={K[ri]}
                x={PAD + 2 * colW + 4} y={ry + 4} w={vecW} h={vecH} color={C_K} />

              {/* V bar */}
              <VecBar values={V[ri]}
                x={PAD + 3 * colW + 4} y={ry + 4} w={vecW} h={vecH} color={C_V} />
            </g>
          );
        })}
      </svg>
    );
  };

  // ── Step: Scores panel ────────────────────────────────────────────────────
  const SCORES_PANEL = () => {
    const N = TOKENS.length;
    const CELL = (W - 2 * PAD - 70) / N;
    const rowH = 50, labW = 65;

    return (
      <svg viewBox={`0 0 ${W} ${N * rowH + 60}`} className="w-full">
        {/* Key column headers */}
        {TOKENS.map((tok, j) => (
          <text key={j} x={PAD + labW + j * CELL + CELL / 2} y={18}
            textAnchor="middle" fontSize={9} fill={C_K}>{tok}</text>
        ))}
        <text x={PAD + labW + N * CELL / 2} y={32} textAnchor="middle"
          fontSize={8} fill={vt.textMuted}>{L.keyTokensLabel}</text>

        {TOKENS.map((tok, i) => {
          const isQ = i === query;
          const scores = TOKENS.map((_, j) => dot(Q[i], K[j]) / Math.sqrt(D));
          const ry = 40 + i * rowH;
          return (
            <g key={i} onClick={() => setQuery(i)} style={{ cursor: "pointer" }}>
              {/* Row label */}
              <rect x={PAD} y={ry + 4} width={60} height={26} rx={5}
                fill={isQ ? `${C_Q}25` : vt.surface}
                stroke={isQ ? C_Q : vt.border} strokeWidth={isQ ? 1.5 : 0.5} />
              <text x={PAD + 30} y={ry + 20} textAnchor="middle"
                fontSize={9} fill={isQ ? C_Q : vt.textMuted}>{tok}</text>

              {/* Score cells */}
              {scores.map((sc, j) => {
                const maxSc = Math.max(...scores.map(Math.abs)) || 1;
                const norm = (sc / maxSc + 1) / 2; // 0-1
                return (
                  <g key={j}>
                    <motion.rect
                      x={PAD + labW + j * CELL + 2} y={ry + 4}
                      width={CELL - 4} height={26} rx={4}
                      fill={accentColor}
                      opacity={isQ ? 0.12 + norm * 0.65 : 0.06}
                      animate={{ opacity: isQ ? 0.12 + norm * 0.65 : 0.06 }}
                    />
                    <text x={PAD + labW + j * CELL + CELL / 2} y={ry + 20}
                      textAnchor="middle" fontSize={9}
                      fill={isQ ? (vt.isDark ? "white" : "#111") : vt.textMuted}
                      fontFamily="monospace" opacity={isQ ? 1 : 0.45}>
                      {sc.toFixed(2)}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Equation label */}
        <text x={W / 2} y={N * rowH + 55} textAnchor="middle" fontSize={9} fill={vt.textMuted}
          fontFamily="monospace">
          score[i][j] = Q[i] · K[j] / √{D}   {L.clickInspect}
        </text>
      </svg>
    );
  };

  // ── Step: Softmax weights panel ───────────────────────────────────────────
  const WEIGHTS_PANEL = () => {
    const BAR_W = (W - 2 * PAD - 80) / TOKENS.length;
    const maxRaw = Math.max(...rawScores.map(Math.abs)) || 1;

    return (
      <svg viewBox={`0 0 ${W} 220}`} className="w-full">
        {/* Raw scores bar chart */}
        <text x={PAD} y={18} fontSize={9} fill={vt.textMuted} fontFamily="monospace">
          {L.rawScoresLabel(query)}
        </text>
        {rawScores.map((sc, j) => {
          const bh = Math.abs(sc) / maxRaw * 50;
          const bx = PAD + 70 + j * BAR_W + 4;
          const by = sc >= 0 ? 72 - bh : 72;
          return (
            <g key={j}>
              <rect x={bx} y={by} width={BAR_W - 8} height={bh} rx={3}
                fill={sc >= 0 ? "#00d4aa" : "#ff6b6b"} opacity={0.8} />
              <text x={bx + (BAR_W - 8) / 2} y={82} textAnchor="middle"
                fontSize={8} fill={vt.textMuted}>{TOKENS[j]}</text>
              <text x={bx + (BAR_W - 8) / 2} y={by - 3} textAnchor="middle"
                fontSize={8} fill={sc >= 0 ? "#00d4aa" : "#ff6b6b"} fontFamily="monospace">
                {sc.toFixed(2)}
              </text>
            </g>
          );
        })}
        <line x1={PAD + 70} y1={72} x2={W - PAD} y2={72}
          stroke={vt.grid} strokeWidth={1} />

        {/* Arrow */}
        <text x={W / 2} y={108} textAnchor="middle" fontSize={11} fill={vt.ink(accentColor)}>↓  softmax(·)</text>

        {/* Softmax weights */}
        <text x={PAD} y={125} fontSize={9} fill={vt.textMuted} fontFamily="monospace">
          {L.softmaxLabel}
        </text>
        {weights.map((w, j) => {
          const bh = w * 60;
          const bx = PAD + 70 + j * BAR_W + 4;
          const by = 190 - bh;
          return (
            <g key={j}>
              <motion.rect x={bx} y={by} width={BAR_W - 8} height={bh} rx={3}
                fill={accentColor} opacity={0.8}
                animate={{ height: bh, y: by }}
                transition={{ duration: 0.5, delay: j * 0.07 }}
              />
              <text x={bx + (BAR_W - 8) / 2} y={204} textAnchor="middle"
                fontSize={8} fill={vt.textMuted}>{TOKENS[j]}</text>
              <text x={bx + (BAR_W - 8) / 2} y={by - 3} textAnchor="middle"
                fontSize={8} fill={vt.ink(accentColor)} fontFamily="monospace">
                {(w * 100).toFixed(0)}%
              </text>
            </g>
          );
        })}
        <line x1={PAD + 70} y1={190} x2={W - PAD} y2={190}
          stroke={vt.grid} strokeWidth={1} />
      </svg>
    );
  };

  // ── Step: Output panel ────────────────────────────────────────────────────
  const OUTPUT_PANEL = () => {
    const vecH = 28, vecW = 80;
    const rowH = 44, N = TOKENS.length;
    const COL_ALPHA = PAD + 50;
    const COL_V = COL_ALPHA + 70;
    const COL_SCALED = COL_V + vecW + 24;
    const OUT_X = COL_SCALED + vecW + 30;

    return (
      <svg viewBox={`0 0 ${W} ${N * rowH + 90}`} className="w-full">
        {/* Column headers */}
        {([
          [L.outHeaders[0], PAD + 25],
          [L.outHeaders[1], COL_ALPHA + 30],
          [L.outHeaders[2], COL_V + vecW/2],
          [L.outHeaders[3], COL_SCALED + vecW/2],
        ] as [string, number][]).map(([lbl, x]) => (
          <text key={String(lbl)} x={Number(x)} y={18} textAnchor="middle" fontSize={9}
            fill={lbl === L.outHeaders[1] ? accentColor : lbl === L.outHeaders[2] ? C_V : lbl === L.outHeaders[3] ? "#f59e0b" : vt.textMuted}>
            {String(lbl)}
          </text>
        ))}

        {TOKENS.map((tok, j) => {
          const ry = 28 + j * rowH;
          const scaled = V[j].map(v => v * weights[j]);
          return (
            <g key={j}>
              {/* Token */}
              <text x={PAD + 25} y={ry + 20} textAnchor="middle" fontSize={9} fill={vt.text}>{tok}</text>

              {/* Alpha weight */}
              <rect x={COL_ALPHA} y={ry + 6} width={50} height={18} rx={4}
                fill={`${accentColor}22`} />
              <motion.rect x={COL_ALPHA} y={ry + 6} width={50 * weights[j]} height={18} rx={4}
                fill={accentColor} opacity={0.7}
                animate={{ width: 50 * weights[j] }}
                transition={{ duration: 0.5, delay: j * 0.05 }}
              />
              <text x={COL_ALPHA + 25} y={ry + 18} textAnchor="middle" fontSize={8}
                fill={vt.isDark ? "white" : "#111"} fontFamily="monospace">
                {(weights[j] * 100).toFixed(0)}%
              </text>

              {/* V vector bar */}
              <VecBar values={V[j]} x={COL_V} y={ry + 2} w={vecW} h={vecH} color={C_V} />

              {/* Scaled V = α × V */}
              <VecBar values={scaled} x={COL_SCALED} y={ry + 2} w={vecW} h={vecH} color="#f59e0b" />
            </g>
          );
        })}

        {/* Sum line */}
        <line x1={COL_SCALED - 4} y1={28 + N * rowH} x2={COL_SCALED + vecW + 4} y2={28 + N * rowH}
          stroke={vt.axis} strokeWidth={1.5} />
        <text x={COL_SCALED + vecW + 8} y={28 + N * rowH + 4} fontSize={10} fill={vt.textMuted}>Σ</text>

        {/* Output vector */}
        <text x={COL_SCALED + vecW / 2} y={28 + N * rowH + 18} textAnchor="middle"
          fontSize={9} fill="#f59e0b" fontFamily="monospace">
          out[{query}] = Σ αⱼ·Vⱼ
        </text>
        <VecBar values={outputVec}
          x={COL_SCALED} y={28 + N * rowH + 24} w={vecW} h={34} color="#f59e0b" />

        {/* Equation summary */}
        <text x={W / 2} y={28 + N * rowH + 72} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
          {L.attnOutput(TOKENS[query], outputVec.map(v => v.toFixed(2)).join(", "))}
        </text>
      </svg>
    );
  };

  // ── Attention heatmap (always at bottom) ──────────────────────────────────
  const HEATMAP = () => {
    const N = TOKENS.length;
    const CELL = 56, OFFSET = 60;
    return (
      <svg viewBox={`0 0 ${OFFSET + N * CELL + 20} ${OFFSET + N * CELL + 10}`}
        className="w-full max-w-xs mx-auto">
        {TOKENS.map((tok, j) => (
          <text key={`col-${j}`} x={OFFSET + j * CELL + CELL/2} y={OFFSET - 8}
            textAnchor="middle" fontSize={10} fill={vt.textMuted}>{tok}</text>
        ))}
        {TOKENS.map((tok, i) => (
          <text key={`row-${i}`} x={OFFSET - 6} y={OFFSET + i * CELL + CELL/2 + 4}
            textAnchor="end" fontSize={10} fill={i === query ? accentColor : vt.textMuted}
            fontWeight={i === query ? "bold" : "normal"}>{tok}</text>
        ))}
        {attnMatrix.map((row, i) =>
          row.map((val, j) => (
            <g key={`${i}-${j}`}>
              <motion.rect
                x={OFFSET + j * CELL + 2} y={OFFSET + i * CELL + 2}
                width={CELL - 4} height={CELL - 4} rx={5}
                fill={accentColor}
                opacity={i === query ? val * 0.9 + 0.05 : val * 0.25}
                animate={{ opacity: i === query ? val * 0.9 + 0.05 : val * 0.25 }}
                style={{ cursor: "pointer" }}
                onClick={() => setQuery(i)}
              />
              <text x={OFFSET + j * CELL + CELL/2} y={OFFSET + i * CELL + CELL/2 + 4}
                textAnchor="middle" fontSize={9} fontFamily="monospace"
                fill={i === query && val > 0.3 ? (vt.isDark ? "white" : "#111") : vt.textMuted}
                opacity={i === query ? 1 : 0.4}>
                {val.toFixed(2)}
              </text>
            </g>
          ))
        )}
      </svg>
    );
  };

  const stepIdx = STEPS.findIndex(s => s.key === step);
  const curStepMeta = STEPS[stepIdx];

  return (
    <VizCard>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <div>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {L.title}
          </span>
          <span className="text-xs ml-2 font-mono" style={{ color: "var(--text-muted)" }}>
            {curStepMeta.eq}
          </span>
        </div>
        <div className="flex gap-1.5">
          {["H1", "H2", "H3"].map((h, i) => (
            <button key={h} onClick={() => setHead(i)}
              className="px-2 py-0.5 rounded-md text-xs font-medium"
              style={{
                backgroundColor: head === i ? `${accentColor}25` : "transparent",
                color: head === i ? accentColor : "var(--text-muted)",
                border: `1px solid ${head === i ? accentColor + "50" : "var(--border)"}`,
              }}>
              {h}
            </button>
          ))}
        </div>
      </div>

      {/* Step navigator */}
      <div className="flex items-center px-5 py-2 gap-1 border-b" style={{ borderColor: "var(--border)" }}>
        {STEPS.map((s, idx) => (
          <button key={s.key} onClick={() => setStep(s.key)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
            style={{
              backgroundColor: step === s.key ? `${accentColor}20` : "transparent",
              color: step === s.key ? accentColor : "var(--text-muted)",
              border: `1px solid ${step === s.key ? accentColor + "45" : "transparent"}`,
            }}>
            <span className="w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold"
              style={{ backgroundColor: step === s.key ? accentColor : "var(--border)", color: step === s.key ? "white" : "var(--text-muted)" }}>
              {idx + 1}
            </span>
            {s.label}
          </button>
        ))}
        <div className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>
          {L.queryLabel} <button onClick={() => setQuery(q => (q + 1) % TOKENS.length)}
            className="font-bold px-1.5 py-0.5 rounded" style={{ color: accentColor, backgroundColor: `${accentColor}18` }}>
            {TOKENS[query]} ↻
          </button>
        </div>
      </div>

      {/* Main visualization */}
      <div className="p-4 overflow-x-auto">
        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}>
            {step === "qkv"     && <QKV_PANEL />}
            {step === "scores"  && <SCORES_PANEL />}
            {step === "weights" && <WEIGHTS_PANEL />}
            {step === "output"  && <OUTPUT_PANEL />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Heatmap always visible */}
      <div className="border-t px-4 pb-2 pt-2" style={{ borderColor: "var(--border)" }}>
        <p className="text-xs text-center mb-2" style={{ color: "var(--text-muted)" }}>
          {L.heatmapTitle(head + 1)}
        </p>
        <HEATMAP />
      </div>

      {/* Stats footer */}
      <div className="grid grid-cols-4 border-t text-center" style={{ borderColor: "var(--border)" }}>
        {weights.map((w, j) => (
          <div key={j} className="py-2.5">
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              α[{TOKENS[query]}→{TOKENS[j]}]
            </div>
            <div className="text-sm font-bold font-mono" style={{ color: accentColor }}>
              {(w * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>
    </VizCard>
  );
}

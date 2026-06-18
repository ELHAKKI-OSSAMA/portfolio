"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const GAN_LABELS = {
  en: {
    title: "GAN — Adversarial Training",
    epochOf: (ep: number, total: number, stage: string) => `epoch ${ep}/${total} · ${stage}`,
    stageFar: "Generator far from real",
    stageConverging: "Generator converging…",
    stageEquilibrium: "Near Nash equilibrium",
    pause: "Pause",
    replay: "↺ Replay",
    train: "Train",
    legendReal: "Real p(x)",
    legendGen: "Generator G(z)",
    legendDisc: "Discriminator D(x) →",
    nashLabel: "D(x) ≈ 0.5 everywhere",
    statEpoch: "Epoch",
    statGenMu: "Gen μ",
    statKL: "KL Div",
    statDiscAcc: "Disc Acc",
  },
  fr: {
    title: "GAN — Entraînement Adversarial",
    epochOf: (ep: number, total: number, stage: string) => `époque ${ep}/${total} · ${stage}`,
    stageFar: "Générateur loin du réel",
    stageConverging: "Générateur convergeant…",
    stageEquilibrium: "Proche de l'équilibre de Nash",
    pause: "Pause",
    replay: "↺ Rejouer",
    train: "Entraîner",
    legendReal: "Réel p(x)",
    legendGen: "Générateur G(z)",
    legendDisc: "Discriminateur D(x) →",
    nashLabel: "D(x) ≈ 0.5 partout",
    statEpoch: "Époque",
    statGenMu: "Gen μ",
    statKL: "Div. KL",
    statDiscAcc: "Préc. disc.",
  },
  ar: {
    title: "GAN — التدريب التنافسي",
    epochOf: (ep: number, total: number, stage: string) => `حقبة ${ep}/${total} · ${stage}`,
    stageFar: "المولّد بعيد عن الحقيقي",
    stageConverging: "المولّد يتقارب…",
    stageEquilibrium: "قريب من توازن ناش",
    pause: "إيقاف مؤقت",
    replay: "↺ إعادة",
    train: "تدريب",
    legendReal: "حقيقي p(x)",
    legendGen: "المولّد G(z)",
    legendDisc: "المميّز D(x) →",
    nashLabel: "D(x) ≈ 0.5 في كل مكان",
    statEpoch: "حقبة",
    statGenMu: "Gen μ",
    statKL: "انحراف KL",
    statDiscAcc: "دقة المميّز",
  },
} as const;

const W = 520, H = 240, PAD = 42;
const MAX_EPOCH = 40;

// ── Gaussian PDF ─────────────────────────────────────────────────────────────
function gauss(x: number, mu: number, sigma: number) {
  return Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
}

// ── Generator parameters → evolve toward real distribution ───────────────────
function genParams(epoch: number) {
  const t = Math.min(epoch / MAX_EPOCH, 1);
  const mu    = 2.0 + 3.5 * (1 - Math.exp(-t * 4));   // 2.0 → 5.5
  const sigma = Math.max(0.45, 1.5 - t * 0.9);         // 1.5 → 0.6
  return { mu, sigma };
}

// ── Discriminator: learns to separate real (mu=5.5) from generated ───────────
//   Represented as a sigmoid over x, with boundary shifting as generator improves
function discriminator(x: number, epoch: number): number {
  const t = Math.min(epoch / MAX_EPOCH, 1);
  // Boundary between real and gen; as gen improves D becomes uncertain (→ 0.5)
  const { mu: genMu } = genParams(epoch);
  const realMu = 5.5;
  // D(x) = sigmoid(sharpness * (x - boundary))
  // When generator is far from real: D is sharp (high accuracy)
  // When generator converges to real: D becomes flat ≈ 0.5 everywhere
  const boundary = (genMu + realMu) / 2;
  const sharpness = 2.5 * (1 - t * 0.85);  // flattens as training progresses
  return 1 / (1 + Math.exp(-sharpness * (x - boundary)));
}

const REAL_MU = 5.5, REAL_SIGMA = 0.65;
const X_RANGE: [number, number] = [0, 10];
const N_PTS = 200;
const XS = Array.from({ length: N_PTS }, (_, i) =>
  X_RANGE[0] + (i / (N_PTS - 1)) * (X_RANGE[1] - X_RANGE[0])
);

// ── Coordinate helpers ────────────────────────────────────────────────────────
function toSX(x: number) {
  return PAD + ((x - X_RANGE[0]) / (X_RANGE[1] - X_RANGE[0])) * (W - 2 * PAD - 14);
}

const REAL_PEAK = gauss(REAL_MU, REAL_MU, REAL_SIGMA);
const PDF_SCALE = (H - 2 * PAD) / (REAL_PEAK * 1.25);   // pixels per PDF unit

// PDF → SVG y (left axis: PDF density)
function toSY_pdf(y: number) {
  return H - PAD - y * PDF_SCALE;
}

// Discriminator D(x) ∈ [0,1] → SVG y using SAME pixel height as full plot area
// D=0 → bottom of plot, D=1 → top of plot
function toSY_disc(d: number) {
  return H - PAD - d * (H - 2 * PAD);
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function GANViz({ accentColor = "#a855f7" }: { accentColor?: string }) {
  const [epoch, setEpoch] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const vt = useVizTheme();
  const L = useVizLocale(GAN_LABELS);

  // Auto-advance timer
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setEpoch(e => {
          if (e >= MAX_EPOCH) { setIsPlaying(false); return e; }
          return e + 1;
        });
      }, 160);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying]);

  const { mu: genMu, sigma: genSigma } = genParams(epoch);

  const realDist = useMemo(() => XS.map(x => ({ x, y: gauss(x, REAL_MU, REAL_SIGMA) })), []);
  const genDist  = useMemo(() => XS.map(x => ({ x, y: gauss(x, genMu, genSigma) })), [genMu, genSigma]);
  const discCurve = useMemo(() => XS.map(x => ({ x, d: discriminator(x, epoch) })), [epoch]);

  // Path builders
  function pdfPath(dist: { x: number; y: number }[]) {
    return dist.map((p, i) =>
      `${i === 0 ? "M" : "L"}${toSX(p.x).toFixed(1)},${toSY_pdf(p.y).toFixed(1)}`
    ).join(" ");
  }
  function discPath(curve: { x: number; d: number }[]) {
    return curve.map((p, i) =>
      `${i === 0 ? "M" : "L"}${toSX(p.x).toFixed(1)},${toSY_disc(p.d).toFixed(1)}`
    ).join(" ");
  }

  const realPath = pdfPath(realDist);
  const genPath  = pdfPath(genDist);
  const dPath    = discPath(discCurve);

  // Approx KL divergence: how far gen is from real (decreases over training)
  const kl = useMemo(() => {
    return XS.reduce((sum, x) => {
      const p = gauss(x, REAL_MU, REAL_SIGMA) + 1e-9;
      const q = gauss(x, genMu, genSigma) + 1e-9;
      return sum + p * Math.log(p / q);
    }, 0) / N_PTS * 5;
  }, [genMu, genSigma]);

  // Disc accuracy (approx)
  const discAcc = useMemo(() => {
    const correct = XS.filter(x => {
      const d = discriminator(x, epoch);
      const pReal = gauss(x, REAL_MU, REAL_SIGMA);
      const pGen  = gauss(x, genMu, genSigma);
      const label = pReal > pGen ? 1 : 0;
      return (label === 1 && d > 0.5) || (label === 0 && d < 0.5);
    }).length;
    return correct / N_PTS;
  }, [epoch, genMu, genSigma]);

  const stage =
    epoch < 8  ? { label: L.stageFar,         color: "#ff6b6b" }
    : epoch < 24 ? { label: L.stageConverging, color: "#f59e0b" }
    :              { label: L.stageEquilibrium, color: accentColor };

  const totalEpochs = MAX_EPOCH;

  return (
    <VizCard>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <div>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {L.title}
          </span>
          <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>
            {L.epochOf(epoch, totalEpochs, stage.label)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (epoch >= MAX_EPOCH) { setEpoch(0); setTimeout(() => setIsPlaying(true), 50); }
              else setIsPlaying(p => !p);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: `${accentColor}25`,
              color: accentColor,
              border: `1px solid ${accentColor}50`,
            }}
          >
            {isPlaying
              ? <><Pause size={11} /> {L.pause}</>
              : epoch >= MAX_EPOCH
              ? L.replay
              : <><Play size={11} /> {L.train}</>}
          </button>
          <button
            onClick={() => { setEpoch(0); setIsPlaying(false); }}
            className="p-1.5 rounded-lg"
            style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* ── Background grid ── */}
        {[0.25, 0.5, 0.75].map(f => {
          const y = toSY_disc(f); // shared pixel grid lines for both axes
          return (
            <g key={f}>
              <line x1={PAD} y1={y} x2={W - PAD - 14} y2={y}
                stroke={vt.grid} strokeWidth={1} />
              {/* Right axis: D(x) label */}
              <text x={W - PAD - 10} y={y + 4} fontSize={8} fill={vt.ink("#f59e0b")} opacity={0.7}>
                {f}
              </text>
            </g>
          );
        })}

        {/* ── D(x) = 0.5 decision boundary (right axis) ── */}
        <line x1={PAD} y1={toSY_disc(0.5)} x2={W - PAD - 14} y2={toSY_disc(0.5)}
          stroke="#f59e0b" strokeWidth={1} strokeDasharray="4,3" opacity={0.5} />

        {/* ── Real distribution fill + stroke ── */}
        <path
          d={`${realPath} L${toSX(X_RANGE[1]).toFixed(1)},${H - PAD} L${toSX(X_RANGE[0]).toFixed(1)},${H - PAD} Z`}
          fill="#00d4aa" opacity={0.15}
        />
        <path d={realPath} fill="none" stroke="#00d4aa" strokeWidth={2.5} />

        {/* ── Generated distribution fill + stroke (animates) ── */}
        <motion.path
          d={`${genPath} L${toSX(X_RANGE[1]).toFixed(1)},${H - PAD} L${toSX(X_RANGE[0]).toFixed(1)},${H - PAD} Z`}
          fill={accentColor} opacity={0.12}
          animate={{ d: `${genPath} L${toSX(X_RANGE[1]).toFixed(1)},${H - PAD} L${toSX(X_RANGE[0]).toFixed(1)},${H - PAD} Z` }}
          transition={{ duration: 0.35 }}
        />
        <motion.path
          d={genPath} fill="none" stroke={accentColor} strokeWidth={2.5}
          animate={{ d: genPath }}
          transition={{ duration: 0.35 }}
        />

        {/* ── Discriminator D(x) curve — on SAME coordinate space ── */}
        <motion.path
          d={dPath} fill="none" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="5,4" opacity={0.85}
          animate={{ d: dPath }}
          transition={{ duration: 0.35 }}
        />

        {/* ── Right axis label ── */}
        <text x={W - PAD + 4} y={toSY_disc(1) + 4} fontSize={8} fill={vt.ink("#f59e0b")} opacity={0.8}>1</text>
        <text x={W - PAD + 4} y={toSY_disc(0) + 4} fontSize={8} fill={vt.ink("#f59e0b")} opacity={0.8}>0</text>
        <text x={W - PAD + 2} y={(toSY_disc(0.5))} fontSize={7} fill={vt.ink("#f59e0b")} opacity={0.6}
          transform={`rotate(90,${W - PAD + 12},${toSY_disc(0.5)})`}>D(x)</text>

        {/* ── Nash equilibrium indicator ── */}
        {epoch >= 28 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <rect x={toSX(REAL_MU) - 50} y={PAD + 2} width={100} height={18} rx={4}
              fill={`${accentColor}25`} stroke={`${accentColor}50`} strokeWidth={1} />
            <text x={toSX(REAL_MU)} y={PAD + 14} textAnchor="middle" fontSize={8}
              fill={vt.ink(accentColor)} fontWeight="bold">
              {L.nashLabel}
            </text>
          </motion.g>
        )}

        {/* ── Axes ── */}
        <line x1={PAD} y1={H - PAD} x2={W - PAD - 14} y2={H - PAD} stroke={vt.axis} strokeWidth={1.5} />
        <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke={vt.axis} strokeWidth={1.5} />
        {[2, 4, 6, 8].map(v => (
          <text key={v} x={toSX(v)} y={H - PAD + 13}
            textAnchor="middle" fontSize={8} fill={vt.textMuted}>{v}</text>
        ))}

        {/* ── Legend ── */}
        <line x1={PAD + 4} y1={PAD + 12} x2={PAD + 22} y2={PAD + 12}
          stroke="#00d4aa" strokeWidth={2.5} />
        <text x={PAD + 26} y={PAD + 16} fontSize={8} fill={vt.ink("#00d4aa")}>{L.legendReal}</text>
        <line x1={PAD + 4} y1={PAD + 26} x2={PAD + 22} y2={PAD + 26}
          stroke={accentColor} strokeWidth={2.5} />
        <text x={PAD + 26} y={PAD + 30} fontSize={8} fill={vt.ink(accentColor)}>{L.legendGen}</text>
        <line x1={PAD + 4} y1={PAD + 40} x2={PAD + 22} y2={PAD + 40}
          stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="5,4" />
        <text x={PAD + 26} y={PAD + 44} fontSize={8} fill={vt.ink("#f59e0b")}>{L.legendDisc}</text>
      </svg>

      {/* Progress bar */}
      <div className="px-5 py-1.5">
        <div className="w-full h-1 rounded-full overflow-hidden" style={{ backgroundColor: vt.surface }}>
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: stage.color }}
            animate={{ width: `${(epoch / MAX_EPOCH) * 100}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>

      {/* Stats */}
      <StatGrid py="py-2.5" items={[
          { label: L.statEpoch,   value: epoch.toString(),                    color: accentColor },
          { label: L.statGenMu,  value: genMu.toFixed(2),                    color: accentColor },
          { label: L.statKL,     value: kl.toFixed(3),                       color: "#ff6b6b" },
          { label: L.statDiscAcc, value: `${(discAcc * 100).toFixed(0)}%`,   color: "#f59e0b" },
      ]} />
    </VizCard>
  );
}

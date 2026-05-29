"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { learningTopics } from "@/lib/data";
import { useTopicProgress } from "@/hooks/useTopicProgress";
import { useVizTheme } from "@/hooks/useVizTheme";

// ── Complete prerequisite string → topic id mapping ──────────────────────────
const PREREQ_MAP: Record<string, string> = {
  "Python ML Stack":            "python-ml-stack",
  "Linear Algebra":             "linear-algebra",
  "Calculus & Optimization":    "calculus-optimization",
  "Probability & Statistics":   "probability-statistics",
  "Information Theory":         "information-theory",
  "Linear Regression":          "linear-regression",
  "Logistic Regression":        "linear-regression",
  "Model Evaluation":           "model-evaluation",
  "Decision Trees":             "decision-tree-rf",
  "Random Forest":              "decision-tree-rf",
  "SVM":                        "svm-knn-svr",
  "Gradient Boosting":          "gradient-boosting",
  "Clustering":                 "clustering",
  "Naïve Bayes":                "naive-bayes",
  "Neural Networks":            "neural-networks",
  "Deep Learning Optimization": "dl-optimization",
  "CNN Architectures":          "cnn-architectures",
  "Object Detection":           "object-detection",
  "NLP Text Classification":    "nlp-text",
  "RNN / LSTM":                 "rnn-lstm-gru",
  "Feature Importance":         "feature-importance",
};

// ── Colors ────────────────────────────────────────────────────────────────────
const CAT_COLOR: Record<string, string> = {
  foundations:    "#06b6d4",
  regression:     "#6c63ff",
  classification: "#00d4aa",
  ensemble:       "#f59e0b",
  evaluation:     "#ff6b6b",
  unsupervised:   "#8b5cf6",
  applied:        "#22c55e",
  deeplearning:   "#a78bfa",
  vision:         "#ec4899",
  audio:          "#84cc16",
  rl:             "#f43f5e",
};

const CAT_LABEL: Record<string, { en: string; fr: string; ar: string }> = {
  foundations:    { en:"Foundations",    fr:"Fondations",               ar:"الأسس" },
  regression:     { en:"Regression",     fr:"Régression",               ar:"الانحدار" },
  classification: { en:"Classification", fr:"Classification",           ar:"التصنيف" },
  ensemble:       { en:"Ensembles",      fr:"Ensembles",                ar:"المجموعة" },
  evaluation:     { en:"Evaluation",     fr:"Évaluation",               ar:"التقييم" },
  unsupervised:   { en:"Unsupervised",   fr:"Non supervisé",            ar:"غير مُشرف" },
  applied:        { en:"Applied ML",     fr:"ML Appliqué",              ar:"تطبيقي" },
  deeplearning:   { en:"Deep Learning",  fr:"Apprentissage Profond",    ar:"التعلم العميق" },
  vision:         { en:"Vision",         fr:"Vision",                   ar:"رؤية" },
  audio:          { en:"Audio",          fr:"Audio",                    ar:"صوت" },
  rl:             { en:"RL",             fr:"AR",                       ar:"تعلم تعزيزي" },
};

const DIFF_COLOR = { beginner:"#10b981", intermediate:"#f59e0b", advanced:"#f97316" };
const DIFF_RANK  = { beginner: 0, intermediate: 1, advanced: 2 };

// ── Build deduped edge list ───────────────────────────────────────────────────
function buildEdges() {
  const seen = new Set<string>();
  const edges: Array<{ from: string; to: string }> = [];
  learningTopics.forEach(t => {
    t.prerequisites.forEach(prereq => {
      const fromId = PREREQ_MAP[prereq];
      if (!fromId || fromId === t.id) return;
      const key = `${fromId}->${t.id}`;
      if (!seen.has(key)) { seen.add(key); edges.push({ from: fromId, to: t.id }); }
    });
  });
  return edges;
}

// ── Topological layer (longest dependency path from a root) ──────────────────
function computeLayers(): Record<string, number> {
  const memo: Record<string, number> = {};
  function layer(id: string): number {
    if (memo[id] !== undefined) return memo[id];
    const topic = learningTopics.find(t => t.id === id);
    if (!topic || !topic.prerequisites.length) { memo[id] = 0; return 0; }
    let max = -1;
    topic.prerequisites.forEach(prereq => {
      const fromId = PREREQ_MAP[prereq];
      if (fromId && fromId !== id) max = Math.max(max, layer(fromId));
    });
    memo[id] = max + 1;
    return memo[id];
  }
  learningTopics.forEach(t => layer(t.id));
  return memo;
}

// ── Layout constants ──────────────────────────────────────────────────────────
const COL_SPACING  = 130;
const ROW_SPACING  = 54;
const PAD_X        = 56;
const PAD_Y        = 12;
const NODE_R       = 15;
const ZONE_LABEL_H = 28; // height reserved at top of each zone for the label
const ZONE_PAD     = 18; // vertical padding inside each zone (above first / below last node)

// ── DAG layout with horizontal difficulty bands ───────────────────────────────
function buildLayout() {
  const layers = computeLayers();

  // Group ids by layer
  const cols: Record<number, string[]> = {};
  Object.entries(layers).forEach(([id, l]) => {
    cols[l] = cols[l] ?? [];
    cols[l].push(id);
  });

  // Sort within each column: difficulty first, then phase → order
  Object.values(cols).forEach(ids =>
    ids.sort((a, b) => {
      const ta = learningTopics.find(t => t.id === a)!;
      const tb = learningTopics.find(t => t.id === b)!;
      const dr = DIFF_RANK[ta.difficulty] - DIFF_RANK[tb.difficulty];
      return dr !== 0 ? dr : ta.phase !== tb.phase ? ta.phase - tb.phase : ta.order - tb.order;
    })
  );

  // Max nodes per difficulty zone across all columns
  let maxBeg = 1, maxInt = 1, maxAdv = 1;
  Object.values(cols).forEach(ids => {
    const d = ids.map(id => learningTopics.find(t => t.id === id)!.difficulty);
    maxBeg = Math.max(maxBeg, d.filter(x => x === "beginner").length);
    maxInt = Math.max(maxInt, d.filter(x => x === "intermediate").length);
    maxAdv = Math.max(maxAdv, d.filter(x => x === "advanced").length);
  });

  // Zone height = label + padding + node span + padding
  const zoneH = (n: number) => ZONE_LABEL_H + ZONE_PAD + (n - 1) * ROW_SPACING + ZONE_PAD;
  const BEG_H = zoneH(maxBeg);
  const INT_H = zoneH(maxInt);
  const ADV_H = zoneH(maxAdv);

  const BEG_Y = PAD_Y;
  const INT_Y = BEG_Y + BEG_H;
  const ADV_Y = INT_Y + INT_H;
  const SVG_H = ADV_Y + ADV_H + PAD_Y;

  const maxLayer = Math.max(...Object.keys(cols).map(Number));
  const SVG_W    = PAD_X * 2 + maxLayer * COL_SPACING + 24;

  const nodes: Record<string, { x: number; y: number; layer: number }> = {};

  Object.entries(cols).forEach(([lStr, ids]) => {
    const l = Number(lStr);
    const x = PAD_X + l * COL_SPACING;

    const byDiff: Record<string, string[]> = { beginner: [], intermediate: [], advanced: [] };
    ids.forEach(id => { byDiff[learningTopics.find(t => t.id === id)!.difficulty].push(id); });

    const place = (zoneIds: string[], zoneY: number, zoneH: number) => {
      const n       = zoneIds.length;
      const totalH  = (n - 1) * ROW_SPACING;
      // Center nodes in the available space below the label
      const avail   = zoneH - ZONE_LABEL_H - ZONE_PAD * 2;
      const startY  = zoneY + ZONE_LABEL_H + ZONE_PAD + (avail - totalH) / 2;
      zoneIds.forEach((id, row) => {
        nodes[id] = { x, y: startY + row * ROW_SPACING, layer: l };
      });
    };

    place(byDiff.beginner,     BEG_Y, BEG_H);
    place(byDiff.intermediate, INT_Y, INT_H);
    place(byDiff.advanced,     ADV_Y, ADV_H);
  });

  return { nodes, SVG_W, SVG_H, maxLayer, BEG_Y, INT_Y, ADV_Y, BEG_H, INT_H, ADV_H };
}

const { nodes: LAYOUT, SVG_W, SVG_H, maxLayer: MAX_LAYER,
        BEG_Y, INT_Y, ADV_Y, BEG_H, INT_H, ADV_H } = buildLayout();
const EDGES = buildEdges();

function cubicEdge(fx: number, fy: number, tx: number, ty: number) {
  const cx = (fx + tx) / 2;
  return `M${fx},${fy} C${cx},${fy} ${cx},${ty} ${tx},${ty}`;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function PrerequisiteGraph() {
  const vt     = useVizTheme();
  const t      = useTranslations("learning");
  const locale = useLocale();
  const router = useRouter();
  const { getStatus } = useTopicProgress();
  const [hovered, setHovered] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const locStr = locale as "en" | "fr" | "ar";

  function topicLabel(topic: (typeof learningTopics)[0]) {
    if (locale === "fr") return topic.titleFr || topic.title;
    if (locale === "ar") return topic.titleAr || topic.title;
    return topic.title;
  }

  const skillMapLabel  = locale === "fr" ? "Carte des prérequis"   : locale === "ar" ? "خريطة المتطلبات"    : "Skill Prerequisite Map";
  const clickHint      = locale === "fr" ? "— cliquez sur un nœud" : locale === "ar" ? "— انقر على أي نقطة" : "— click any node to open";
  const completedLabel = locale === "fr" ? "complété"              : locale === "ar" ? "مكتمل"              : "completed";

  const diffLabel = {
    beginner:     t("difficulty_beginner"),
    intermediate: t("difficulty_intermediate"),
    advanced:     t("difficulty_advanced"),
  };

  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{ backgroundColor:"var(--bg-card)", borderColor:"var(--border)" }}>

      {/* ── Header / toggle ─────────────────────────────────────────── */}
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        onClick={() => setVisible(v => !v)}
      >
        <div>
          <span className="text-sm font-semibold" style={{ color:"var(--text-primary)" }}>{skillMapLabel}</span>
          <span className="ml-2 text-xs" style={{ color:"var(--text-muted)" }}>{clickHint}</span>
        </div>
        <span className="text-xs font-semibold px-2 py-1 rounded"
          style={{ backgroundColor:"var(--tag-bg)", color:"var(--tag-color)" }}>
          {visible
            ? (locale === "fr" ? "Masquer ▲" : locale === "ar" ? "إخفاء ▲" : "Hide ▲")
            : (locale === "fr" ? "Afficher ▼" : locale === "ar" ? "عرض ▼"   : "Show ▼")}
        </span>
      </button>

      {visible && (
        <div className="border-t" style={{ borderColor:"var(--border)" }}>

          {/* ── Category legend ─────────────────────────────────────── */}
          <div className="flex flex-wrap gap-3 px-5 py-3 text-xs border-b"
            style={{ borderColor:"var(--border)" }}>
            {Object.entries(CAT_COLOR).map(([cat, col]) => (
              <span key={cat} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor:col }} />
                <span style={{ color:"var(--text-muted)" }}>
                  {CAT_LABEL[cat]?.[locStr] ?? cat}
                </span>
              </span>
            ))}
            <span className="ml-auto flex items-center gap-1.5" style={{ color:"var(--text-muted)" }}>
              <span className="w-2.5 h-2.5 rounded-full border-2 inline-block"
                style={{ backgroundColor:"#22c55e", borderColor:"#22c55e" }} />
              {completedLabel}
            </span>
          </div>

          {/* ── Graph — fixed size, scrollable ──────────────────────── */}
          <div className="overflow-auto" style={{ WebkitOverflowScrolling:"touch" }}>
            <svg width={SVG_W} height={SVG_H} className="block" style={{ minWidth: SVG_W }}>
              <defs>
                {/* Fixed-size arrowhead — userSpaceOnUse keeps it visible regardless of strokeWidth */}
                <marker id="pg-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse">
                  <path d="M0,0 L0,8 L8,4 Z" fill="context-stroke" />
                </marker>
              </defs>

              {/* ── Difficulty zone backgrounds ──────────────────────── */}
              <rect x={0} y={BEG_Y} width={SVG_W} height={BEG_H} fill={DIFF_COLOR.beginner}     opacity={0.06} />
              <rect x={0} y={INT_Y} width={SVG_W} height={INT_H} fill={DIFF_COLOR.intermediate} opacity={0.06} />
              <rect x={0} y={ADV_Y} width={SVG_W} height={ADV_H} fill={DIFF_COLOR.advanced}     opacity={0.06} />

              {/* Zone separator lines */}
              <line x1={0} y1={INT_Y} x2={SVG_W} y2={INT_Y} stroke={vt.gridStrong} strokeWidth={1} />
              <line x1={0} y1={ADV_Y} x2={SVG_W} y2={ADV_Y} stroke={vt.gridStrong} strokeWidth={1} />

              {/* Zone labels (left side) */}
              <text x={6} y={BEG_Y + 18} fontSize={9} fontWeight="700" fill={DIFF_COLOR.beginner}     opacity={0.85} textAnchor="start">
                {diffLabel.beginner.toUpperCase()}
              </text>
              <text x={6} y={INT_Y + 18} fontSize={9} fontWeight="700" fill={DIFF_COLOR.intermediate} opacity={0.85} textAnchor="start">
                {diffLabel.intermediate.toUpperCase()}
              </text>
              <text x={6} y={ADV_Y + 18} fontSize={9} fontWeight="700" fill={DIFF_COLOR.advanced}     opacity={0.85} textAnchor="start">
                {diffLabel.advanced.toUpperCase()}
              </text>

              {/* ── Edges ─────────────────────────────────────────────── */}
              {EDGES.map((e, i) => {
                const from = LAYOUT[e.from];
                const to   = LAYOUT[e.to];
                if (!from || !to) return null;
                const isHi  = hovered === e.from || hovered === e.to;
                const col   = CAT_COLOR[learningTopics.find(t => t.id === e.from)?.category ?? "regression"] ?? "#6c63ff";
                return (
                  <path key={i}
                    d={cubicEdge(from.x + NODE_R, from.y, to.x - NODE_R, to.y)}
                    fill="none"
                    stroke={isHi ? col : vt.textMuted}
                    strokeWidth={isHi ? 2 : 1.1}
                    strokeDasharray={isHi ? undefined : "4,4"}
                    markerEnd="url(#pg-arrow)"
                    style={{ transition:"stroke 0.15s, strokeWidth 0.15s" }}
                  />
                );
              })}

              {/* ── Nodes ─────────────────────────────────────────────── */}
              {learningTopics.map(topic => {
                const pos    = LAYOUT[topic.id];
                if (!pos) return null;
                const col    = CAT_COLOR[topic.category] ?? "#6c63ff";
                const status = getStatus(topic.id);
                const isHov  = hovered === topic.id;
                return (
                  <g key={topic.id}
                    onMouseEnter={() => setHovered(topic.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => router.push(`/${locale}/learning/${topic.id}`)}
                    style={{ cursor:"pointer" }}>
                    {isHov && (
                      <circle cx={pos.x} cy={pos.y} r={NODE_R + 6} fill={col} opacity={0.15} />
                    )}
                    <circle
                      cx={pos.x} cy={pos.y}
                      r={isHov ? NODE_R + 2 : NODE_R}
                      fill={col + (status === "completed" ? "ee" : "40")}
                      stroke={col} strokeWidth={status === "completed" ? 2.5 : 1.5}
                      style={{ transition:"r 0.1s, fill 0.15s" }}
                    />
                    {status === "completed" && (
                      <text x={pos.x} y={pos.y + 4} textAnchor="middle" fontSize={10} fill="white" fontWeight="bold">✓</text>
                    )}
                    {status === "reading" && (
                      <circle cx={pos.x + NODE_R - 3} cy={pos.y - NODE_R + 3} r={4} fill="#f97316" />
                    )}
                  </g>
                );
              })}

              {/* ── Tooltip — rendered last so it always floats on top ── */}
              {hovered && (() => {
                const topic = learningTopics.find(t => t.id === hovered);
                const pos   = topic ? LAYOUT[topic.id] : null;
                if (!topic || !pos) return null;
                const col       = CAT_COLOR[topic.category] ?? "#6c63ff";
                const label     = topicLabel(topic);
                const truncated = label.length > 30 ? label.slice(0, 30) + "…" : label;
                const tw        = Math.min(truncated.length * 5.5 + 16, 200);
                const th        = 22;
                // Position above the node, centered horizontally
                let tx = pos.x - tw / 2;
                tx = Math.max(4, Math.min(SVG_W - tw - 4, tx));
                let ty = pos.y - NODE_R - 8 - th; // 8px gap above node top
                if (ty < 4) ty = pos.y + NODE_R + 8; // flip below if too close to top
                return (
                  <g style={{ pointerEvents:"none" }}>
                    <rect x={tx} y={ty} width={tw} height={th} rx={4}
                      fill={vt.surface} stroke={col} strokeWidth={1.2} />
                    <text x={tx + tw / 2} y={ty + 14} fontSize={9.5} fill={col}
                      fontWeight="700" textAnchor="middle">
                      {truncated}
                    </text>
                  </g>
                );
              })()}

            </svg>
          </div>

        </div>
      )}
    </div>
  );
}

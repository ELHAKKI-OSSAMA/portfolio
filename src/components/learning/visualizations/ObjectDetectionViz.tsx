"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVizTheme } from "@/hooks/useVizTheme";
import { useVizLocale } from "@/hooks/useVizLocale";
import { VizCard, VizHeader, StatGrid, TabToggle } from "./shared";

const OD_LABELS = {
  en: {
    title: "Object Detection — Bounding Boxes & IoU",
    tabs: ["IoU", "NMS", "Anchor Grids"] as readonly string[],
    gtLabel: "Ground Truth",
    predLabel: "Prediction",
    iouScore: "IoU Score",
    goodDetection: "✓ Good detection",
    weakOverlap: "✕ Weak overlap",
    legendItems: ["GT box", "Prediction", "Intersection"] as readonly string[],
    nmsTitle: "NMS Steps",
    stepLabel: (i: number) => `Step ${i + 1}`,
    boxesRemaining: (n: number) => `${n} box${n !== 1 ? "es" : ""} remaining`,
    stepCtrl: "Step:",
    anchorTypes: "Anchor types",
    anchorShapeLabels: ["Square", "Wide", "Tall"] as readonly string[],
    yoloStyle: "YOLO v3 style:",
    yoloPredicts: "predict (dx,dy,dw,dh)",
    yoloOffsets: "offsets per anchor",
    anchorsNote: "Each cell predicts offsets from anchors — YOLO v3 style. Hover the highlighted cell to see its 3 anchor boxes of different aspect ratios.",
    nmsLabels: [
      "All candidate boxes",
      "Keep score=0.95, suppress IoU>0.5 (3 boxes removed)",
      "Remaining boxes after first pass",
      "Final result — single best detection",
    ] as readonly string[],
    iouScenarioLabels: ["High IoU ≈ 0.78", "Low IoU ≈ 0.23"] as readonly string[],
    insights: {
      iou: "Intersection over Union (IoU) measures overlap between predicted and ground truth boxes. IoU ≥ 0.5 is typically a 'correct' detection. Higher thresholds demand more precise localisation.",
      nms: "Non-Maximum Suppression eliminates duplicate detections by keeping the highest-confidence box and suppressing overlapping boxes with IoU above a threshold. Essential for clean detection outputs.",
      anchors: "Each grid cell predicts offsets relative to pre-defined anchor boxes of different aspect ratios. YOLO-style networks predict (dx, dy, dw, dh) offsets + objectness + class scores per anchor.",
    },
  },
  fr: {
    title: "Détection d'Objets — Boîtes Englobantes & IoU",
    tabs: ["IoU", "NMS", "Grilles d'Ancres"] as readonly string[],
    gtLabel: "Vérité Terrain",
    predLabel: "Prédiction",
    iouScore: "Score IoU",
    goodDetection: "✓ Bonne détection",
    weakOverlap: "✕ Chevauchement faible",
    legendItems: ["Boîte GT", "Prédiction", "Intersection"] as readonly string[],
    nmsTitle: "Étapes NMS",
    stepLabel: (i: number) => `Étape ${i + 1}`,
    boxesRemaining: (n: number) => `${n} boîte${n > 1 ? "s" : ""} restante${n > 1 ? "s" : ""}`,
    stepCtrl: "Étape :",
    anchorTypes: "Types d'ancres",
    anchorShapeLabels: ["Carré", "Large", "Haut"] as readonly string[],
    yoloStyle: "Style YOLO v3 :",
    yoloPredicts: "prédit (dx,dy,dw,dh)",
    yoloOffsets: "décalages par ancre",
    anchorsNote: "Chaque cellule prédit des décalages par rapport aux ancres — style YOLO v3. Survolez la cellule surlignée pour voir ses 3 boîtes d'ancres de différents rapports d'aspect.",
    nmsLabels: [
      "Toutes les boîtes candidates",
      "Garder score=0.95, supprimer IoU>0.5 (3 boîtes supprimées)",
      "Boîtes restantes après la première passe",
      "Résultat final — seule meilleure détection",
    ] as readonly string[],
    iouScenarioLabels: ["IoU élevé ≈ 0.78", "IoU faible ≈ 0.23"] as readonly string[],
    insights: {
      iou: "L'Intersection sur Union (IoU) mesure le chevauchement entre les boîtes prédites et de vérité terrain. IoU ≥ 0.5 est généralement une 'bonne' détection. Des seuils plus élevés exigent une localisation plus précise.",
      nms: "La Suppression Non-Maximale élimine les détections dupliquées en conservant la boîte avec la plus haute confiance et en supprimant les boîtes qui se chevauchent avec un IoU supérieur au seuil. Essentielle pour des sorties de détection nettes.",
      anchors: "Chaque cellule de grille prédit des décalages par rapport à des boîtes d'ancres prédéfinies de différents rapports d'aspect. Les réseaux de style YOLO prédisent des décalages (dx, dy, dw, dh) + objectness + scores de classe par ancre.",
    },
  },
  ar: {
    title: "اكتشاف الأجسام — المربعات المحيطة وIoU",
    tabs: ["IoU", "NMS", "شبكات الإرساء"] as readonly string[],
    gtLabel: "الحقيقة الأرضية",
    predLabel: "تنبؤ",
    iouScore: "درجة IoU",
    goodDetection: "✓ اكتشاف جيد",
    weakOverlap: "✕ تداخل ضعيف",
    legendItems: ["مربع GT", "تنبؤ", "تقاطع"] as readonly string[],
    nmsTitle: "خطوات NMS",
    stepLabel: (i: number) => `خطوة ${i + 1}`,
    boxesRemaining: (n: number) => `${n} مربع متبقٍ`,
    stepCtrl: "خطوة:",
    anchorTypes: "أنواع الإرساء",
    anchorShapeLabels: ["مربع", "عريض", "طويل"] as readonly string[],
    yoloStyle: "أسلوب YOLO v3:",
    yoloPredicts: "يتنبأ (dx,dy,dw,dh)",
    yoloOffsets: "إزاحات لكل إرساء",
    anchorsNote: "تتنبأ كل خلية شبكة بإزاحات بالنسبة لمربعات الإرساء المحددة مسبقاً. مرّر على الخلية المُبرزة لرؤية 3 مربعات إرساء بنسب عرض مختلفة.",
    nmsLabels: [
      "جميع المربعات المرشحة",
      "الاحتفاظ بالدرجة=0.95، تثبيط IoU>0.5 (تمت إزالة 3 مربعات)",
      "المربعات المتبقية بعد التمرير الأول",
      "النتيجة النهائية — أفضل اكتشاف واحد",
    ] as readonly string[],
    iouScenarioLabels: ["IoU مرتفع ≈ 0.78", "IoU منخفض ≈ 0.23"] as readonly string[],
    insights: {
      iou: "يقيس IoU (تقاطع على اتحاد) التداخل بين المربعات المتنبأة ومربعات الحقيقة الأرضية. IoU ≥ 0.5 هو عادةً اكتشاف 'صحيح'. تتطلب العتبات الأعلى تحديداً مكانياً أدق.",
      nms: "تُزيل قمع الحد الأقصى غير الأقصى الاكتشافات المكررة بالاحتفاظ بالمربع ذي أعلى ثقة وتثبيط المربعات المتداخلة التي تتجاوز IoU حدها. ضرورية لمخرجات اكتشاف نظيفة.",
      anchors: "تتنبأ كل خلية شبكة بإزاحات بالنسبة لمربعات الإرساء المحددة مسبقاً بنسب عرض مختلفة. تتنبأ شبكات أسلوب YOLO بإزاحات (dx, dy, dw, dh) + objectness + درجات الفئة لكل إرساء.",
    },
  },
} as const;

// ── Layout ────────────────────────────────────────────────────────────────────
const W = 520, H = 260;
const IMG_X = 12, IMG_Y = 28, IMG_W = 300, IMG_H = 200;

// ── IoU scenarios ─────────────────────────────────────────────────────────────
interface BoxCoords { x: number; y: number; w: number; h: number }

const IOU_SCENARIOS: Array<{
  gt: BoxCoords;
  pred: BoxCoords;
  label: string;
}> = [
  {
    // High overlap ~0.78
    gt:   { x: 60,  y: 60,  w: 160, h: 120 },
    pred: { x: 80,  y: 75,  w: 160, h: 120 },
    label: "High IoU ≈ 0.78",
  },
  {
    // Low overlap ~0.23
    gt:   { x: 40,  y: 50,  w: 140, h: 110 },
    pred: { x: 130, y: 100, w: 140, h: 110 },
    label: "Low IoU ≈ 0.23",
  },
];

function computeIoU(a: BoxCoords, b: BoxCoords): number {
  const ix1 = Math.max(a.x, b.x);
  const iy1 = Math.max(a.y, b.y);
  const ix2 = Math.min(a.x + a.w, b.x + b.w);
  const iy2 = Math.min(a.y + a.h, b.y + b.h);
  const iw = Math.max(0, ix2 - ix1);
  const ih = Math.max(0, iy2 - iy1);
  const inter = iw * ih;
  const union = a.w * a.h + b.w * b.h - inter;
  return union > 0 ? inter / union : 0;
}

function getIntersection(a: BoxCoords, b: BoxCoords): BoxCoords | null {
  const x = Math.max(a.x, b.x);
  const y = Math.max(a.y, b.y);
  const w = Math.min(a.x + a.w, b.x + b.w) - x;
  const h = Math.min(a.y + a.h, b.y + b.h) - y;
  return w > 0 && h > 0 ? { x, y, w, h } : null;
}

// ── NMS data ─────────────────────────────────────────────────────────────────
interface NMSBox extends BoxCoords {
  score: number;
  id: number;
}

const NMS_BOXES: NMSBox[] = [
  { id: 0, x: 70,  y: 65,  w: 150, h: 110, score: 0.95 },
  { id: 1, x: 80,  y: 72,  w: 148, h: 108, score: 0.87 },
  { id: 2, x: 60,  y: 60,  w: 160, h: 118, score: 0.72 },
  { id: 3, x: 55,  y: 70,  w: 155, h: 105, score: 0.65 },
  { id: 4, x: 40,  y: 55,  w: 145, h: 100, score: 0.41 },
];

const NMS_THRESHOLD = 0.5;

// Pre-compute NMS suppression: which boxes survive after each step
function computeNMSSteps(): Array<{ kept: number[]; suppressed: number[]; label: string }> {
  const steps: Array<{ kept: number[]; suppressed: number[]; label: string }> = [];

  // Step 1: all shown
  steps.push({ kept: NMS_BOXES.map(b => b.id), suppressed: [], label: "All candidate boxes" });

  // Step 2: keep top box (0.95), suppress IoU > 0.5 with it
  const top = NMS_BOXES[0];
  const suppressed: number[] = [];
  for (const b of NMS_BOXES) {
    if (b.id === top.id) continue;
    const iou = computeIoU(top, b);
    if (iou > NMS_THRESHOLD) suppressed.push(b.id);
  }
  const remaining = NMS_BOXES.filter(b => !suppressed.includes(b.id)).map(b => b.id);
  steps.push({ kept: remaining, suppressed, label: `Keep score=0.95, suppress IoU>0.5 (${suppressed.length} boxes removed)` });

  // Step 3: any remaining boxes (besides top)
  const afterFirst = NMS_BOXES.filter(b => b.id === top.id || !suppressed.includes(b.id));
  steps.push({ kept: afterFirst.map(b => b.id), suppressed, label: "Remaining boxes after first pass" });

  // Step 4: final
  steps.push({ kept: [top.id], suppressed: NMS_BOXES.filter(b => b.id !== top.id).map(b => b.id), label: "Final result — single best detection" });

  return steps;
}

const NMS_STEPS = computeNMSSteps();

// ── Anchor grid data ─────────────────────────────────────────────────────────
const ANCHOR_GRID_N = 3;
const CELL_W = IMG_W / ANCHOR_GRID_N;
const CELL_H = IMG_H / ANCHOR_GRID_N;
const HIGHLIGHTED_CELL = { row: 1, col: 1 }; // center cell

const ANCHOR_SHAPES: Array<{ label: string; wRatio: number; hRatio: number; color: string }> = [
  { label: "Square",  wRatio: 0.8, hRatio: 0.8,  color: "#f97316" },
  { label: "Wide",    wRatio: 1.4, hRatio: 0.55, color: "#6c63ff" },
  { label: "Tall",    wRatio: 0.55, hRatio: 1.4, color: "#06b6d4" },
];

type Tab = "iou" | "nms" | "anchors";

const TAB_IDS: Tab[] = ["iou", "nms", "anchors"];

export default function ObjectDetectionViz({ accentColor = "#6c63ff" }: { accentColor?: string }) {
  const vt = useVizTheme();
  const L = useVizLocale(OD_LABELS);
  const [tab, setTab] = useState<Tab>("iou");
  const [iouScenario, setIouScenario] = useState(0);
  const [nmsStep, setNmsStep] = useState(0);

  const scenario = IOU_SCENARIOS[iouScenario];
  const iouVal = computeIoU(scenario.gt, scenario.pred);
  const intersection = getIntersection(scenario.gt, scenario.pred);
  const nmsState = NMS_STEPS[nmsStep];

  return (
    <VizCard>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {L.title}
        </span>
        <div className="flex gap-1">
          {TAB_IDS.map((id, ti) => (
            <button key={id} onClick={() => setTab(id)}
              className="px-3 py-1 rounded-lg text-xs font-semibold"
              style={{
                backgroundColor: tab === id ? `${accentColor}22` : "transparent",
                color: tab === id ? accentColor : vt.textMuted,
                border: `1px solid ${tab === id ? accentColor + "55" : "var(--border)"}`,
              }}>
              {L.tabs[ti]}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full">

            {/* Image area background */}
            <rect x={IMG_X} y={IMG_Y} width={IMG_W} height={IMG_H} rx={6}
              fill={vt.isDark ? "#1e293b" : "#e2e8f0"} stroke={vt.border} strokeWidth={1} />
            <text x={IMG_X + IMG_W / 2} y={IMG_Y + 14} textAnchor="middle" fontSize={8} fill={vt.textFaint}>
              Image (320×200)
            </text>

            {/* ── IoU Tab ── */}
            {tab === "iou" && (
              <g>
                {/* Ground truth (green dashed) */}
                <rect x={IMG_X + scenario.gt.x} y={IMG_Y + scenario.gt.y}
                  width={scenario.gt.w} height={scenario.gt.h}
                  fill="none" stroke="#22c55e" strokeWidth={2} strokeDasharray="6,3" rx={2} />
                <text x={IMG_X + scenario.gt.x + 4} y={IMG_Y + scenario.gt.y - 3}
                  fontSize={8} fill="#22c55e" fontWeight="bold">{L.gtLabel}</text>

                {/* Prediction (red) */}
                <rect x={IMG_X + scenario.pred.x} y={IMG_Y + scenario.pred.y}
                  width={scenario.pred.w} height={scenario.pred.h}
                  fill="none" stroke="#ef4444" strokeWidth={2} rx={2} />
                <text x={IMG_X + scenario.pred.x + 4} y={IMG_Y + scenario.pred.y + scenario.pred.h + 11}
                  fontSize={8} fill="#ef4444" fontWeight="bold">{L.predLabel}</text>

                {/* Intersection (yellow fill) */}
                {intersection && (
                  <rect x={IMG_X + intersection.x} y={IMG_Y + intersection.y}
                    width={intersection.w} height={intersection.h}
                    fill="#fbbf24" fillOpacity={0.35} stroke="#fbbf24" strokeWidth={1} rx={1} />
                )}

                {/* Right panel: IoU info */}
                <rect x={IMG_X + IMG_W + 12} y={IMG_Y} width={W - IMG_X - IMG_W - 20} height={IMG_H} rx={6}
                  fill={vt.surface} stroke={vt.border} strokeWidth={1} />

                <text x={IMG_X + IMG_W + 20} y={IMG_Y + 22} fontSize={10} fill={vt.textMuted} fontWeight="600">{L.iouScore}</text>
                <text x={IMG_X + IMG_W + 20} y={IMG_Y + 56}
                  fontSize={32} fill={iouVal >= 0.5 ? "#22c55e" : "#ef4444"} fontWeight="800" fontFamily="monospace">
                  {iouVal.toFixed(2)}
                </text>
                <text x={IMG_X + IMG_W + 20} y={IMG_Y + 74} fontSize={9}
                  fill={iouVal >= 0.5 ? "#22c55e" : "#ef4444"}>
                  {iouVal >= 0.5 ? L.goodDetection : L.weakOverlap}
                </text>

                {/* Legend */}
                {[
                  { color: "#22c55e", label: L.legendItems[0], dash: true },
                  { color: "#ef4444", label: L.legendItems[1], dash: false },
                  { color: "#fbbf24", label: L.legendItems[2], dash: false },
                ].map((item, i) => (
                  <g key={item.label}>
                    <rect x={IMG_X + IMG_W + 20} y={IMG_Y + 90 + i * 20}
                      width={18} height={10} rx={2}
                      fill={item.dash ? "none" : item.color + "44"}
                      stroke={item.color} strokeWidth={1.5}
                      strokeDasharray={item.dash ? "4,2" : "none"} />
                    <text x={IMG_X + IMG_W + 42} y={IMG_Y + 99 + i * 20}
                      fontSize={8.5} fill={vt.textMuted}>{item.label}</text>
                  </g>
                ))}

                {/* Formula */}
                <text x={IMG_X + IMG_W + 20} y={IMG_Y + 152} fontSize={8} fill={vt.textFaint}>
                  IoU = |A ∩ B| / |A ∪ B|
                </text>
              </g>
            )}

            {/* ── NMS Tab ── */}
            {tab === "nms" && (
              <g>
                {NMS_BOXES.map((box) => {
                  const isKept = nmsState.kept.includes(box.id);
                  const isSuppressed = nmsState.suppressed.includes(box.id);
                  const isTop = box.id === 0;
                  const opacity = isSuppressed ? 0.25 : isKept ? 0.9 : 0.5;
                  const strokeColor = isTop && nmsStep > 0 ? "#22c55e" : "#ef4444";

                  return (
                    <motion.g key={box.id} initial={{ opacity: 0 }} animate={{ opacity }} transition={{ duration: 0.3 }}>
                      <rect x={IMG_X + box.x} y={IMG_Y + box.y}
                        width={box.w} height={box.h}
                        fill="none" stroke={strokeColor} strokeWidth={isTop ? 2.5 : 1.5} rx={3}
                        strokeDasharray={isSuppressed ? "4,3" : "none"} />
                      {/* Confidence label */}
                      <rect x={IMG_X + box.x} y={IMG_Y + box.y - 14} width={34} height={13} rx={2}
                        fill={strokeColor} fillOpacity={isSuppressed ? 0.4 : 0.9} />
                      <text x={IMG_X + box.x + 3} y={IMG_Y + box.y - 4}
                        fontSize={8} fill="white" fontWeight="bold">
                        {box.score.toFixed(2)}
                      </text>
                      {/* Suppression X */}
                      {isSuppressed && (
                        <>
                          <line x1={IMG_X + box.x + box.w * 0.3} y1={IMG_Y + box.y + box.h * 0.3}
                            x2={IMG_X + box.x + box.w * 0.7} y2={IMG_Y + box.y + box.h * 0.7}
                            stroke="#ef4444" strokeWidth={2} opacity={0.7} />
                          <line x1={IMG_X + box.x + box.w * 0.7} y1={IMG_Y + box.y + box.h * 0.3}
                            x2={IMG_X + box.x + box.w * 0.3} y2={IMG_Y + box.y + box.h * 0.7}
                            stroke="#ef4444" strokeWidth={2} opacity={0.7} />
                        </>
                      )}
                    </motion.g>
                  );
                })}

                {/* Right panel: NMS step info */}
                <rect x={IMG_X + IMG_W + 12} y={IMG_Y} width={W - IMG_X - IMG_W - 20} height={IMG_H} rx={6}
                  fill={vt.surface} stroke={vt.border} strokeWidth={1} />

                <text x={IMG_X + IMG_W + 20} y={IMG_Y + 20} fontSize={9} fill={vt.textMuted} fontWeight="600">
                  {L.nmsTitle}
                </text>

                {NMS_STEPS.map((s, i) => (
                  <g key={i}>
                    <rect x={IMG_X + IMG_W + 18} y={IMG_Y + 28 + i * 40} width={W - IMG_X - IMG_W - 28} height={34}
                      rx={4}
                      fill={i === nmsStep ? `${accentColor}22` : "transparent"}
                      stroke={i === nmsStep ? accentColor + "55" : "transparent"}
                      strokeWidth={1}
                      style={{ cursor: "pointer" }}
                      onClick={() => setNmsStep(i)} />
                    <text x={IMG_X + IMG_W + 26} y={IMG_Y + 41 + i * 40}
                      fontSize={8} fill={i === nmsStep ? accentColor : vt.textFaint}
                      fontWeight={i === nmsStep ? "700" : "400"}>
                      {L.stepLabel(i)}
                    </text>
                    <text x={IMG_X + IMG_W + 26} y={IMG_Y + 53 + i * 40}
                      fontSize={7.5} fill={i === nmsStep ? vt.text : vt.textFaint}>
                      {L.boxesRemaining(s.kept.length)}
                    </text>
                  </g>
                ))}
              </g>
            )}

            {/* ── Anchor Grids Tab ── */}
            {tab === "anchors" && (
              <g>
                {/* Grid lines */}
                {Array.from({ length: ANCHOR_GRID_N + 1 }, (_, i) => (
                  <g key={i}>
                    <line x1={IMG_X} y1={IMG_Y + i * CELL_H}
                      x2={IMG_X + IMG_W} y2={IMG_Y + i * CELL_H}
                      stroke={vt.axis} strokeWidth={1} strokeOpacity={0.6} />
                    <line x1={IMG_X + i * CELL_W} y1={IMG_Y}
                      x2={IMG_X + i * CELL_W} y2={IMG_Y + IMG_H}
                      stroke={vt.axis} strokeWidth={1} strokeOpacity={0.6} />
                  </g>
                ))}

                {/* Cell fill + anchor dots */}
                {Array.from({ length: ANCHOR_GRID_N }, (_, row) =>
                  Array.from({ length: ANCHOR_GRID_N }, (_, col) => {
                    const isHL = row === HIGHLIGHTED_CELL.row && col === HIGHLIGHTED_CELL.col;
                    const cx = IMG_X + col * CELL_W + CELL_W / 2;
                    const cy = IMG_Y + row * CELL_H + CELL_H / 2;
                    return (
                      <g key={`${row}-${col}`}>
                        {isHL && (
                          <rect x={IMG_X + col * CELL_W + 1} y={IMG_Y + row * CELL_H + 1}
                            width={CELL_W - 2} height={CELL_H - 2}
                            fill={accentColor + "20"} stroke={accentColor + "66"} strokeWidth={1.5} rx={2} />
                        )}
                        {/* Anchor indicator dot */}
                        <circle cx={cx} cy={cy} r={isHL ? 4 : 3}
                          fill={isHL ? accentColor : vt.textFaint} fillOpacity={isHL ? 0.9 : 0.5} />
                        {isHL && (
                          <text x={cx} y={cy - 10} textAnchor="middle" fontSize={8}
                            fill={vt.ink(accentColor)} fontWeight="bold">
                            cell ({row},{col})
                          </text>
                        )}
                      </g>
                    );
                  })
                )}

                {/* Anchor boxes for highlighted cell */}
                {(() => {
                  const cx = IMG_X + HIGHLIGHTED_CELL.col * CELL_W + CELL_W / 2;
                  const cy = IMG_Y + HIGHLIGHTED_CELL.row * CELL_H + CELL_H / 2;
                  return ANCHOR_SHAPES.map((anchor, i) => {
                    const aw = anchor.wRatio * CELL_W;
                    const ah = anchor.hRatio * CELL_H;
                    return (
                      <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.12 }}>
                        <rect x={cx - aw / 2} y={cy - ah / 2} width={aw} height={ah}
                          fill="none" stroke={anchor.color} strokeWidth={1.5}
                          strokeDasharray="5,3" rx={2} />
                      </motion.g>
                    );
                  });
                })()}

                {/* Right panel: anchor legend */}
                <rect x={IMG_X + IMG_W + 12} y={IMG_Y} width={W - IMG_X - IMG_W - 20} height={IMG_H} rx={6}
                  fill={vt.surface} stroke={vt.border} strokeWidth={1} />

                <text x={IMG_X + IMG_W + 20} y={IMG_Y + 20} fontSize={9} fill={vt.textMuted} fontWeight="600">
                  {L.anchorTypes}
                </text>
                {ANCHOR_SHAPES.map((anchor, i) => (
                  <g key={anchor.label}>
                    {/* Small preview rectangle */}
                    <rect x={IMG_X + IMG_W + 20} y={IMG_Y + 30 + i * 36}
                      width={anchor.wRatio * 20} height={anchor.hRatio * 20}
                      fill="none" stroke={anchor.color} strokeWidth={1.5}
                      strokeDasharray="3,2" rx={1} />
                    <text x={IMG_X + IMG_W + 48} y={IMG_Y + 38 + i * 36}
                      fontSize={9} fill={anchor.color} fontWeight="bold">{L.anchorShapeLabels[i]}</text>
                    <text x={IMG_X + IMG_W + 48} y={IMG_Y + 50 + i * 36}
                      fontSize={7.5} fill={vt.textFaint}>
                      {anchor.wRatio.toFixed(1)}× × {anchor.hRatio.toFixed(1)}×
                    </text>
                  </g>
                ))}

                <text x={IMG_X + IMG_W + 20} y={IMG_Y + 142} fontSize={8} fill={vt.textFaint}>
                  {L.yoloStyle}
                </text>
                <text x={IMG_X + IMG_W + 20} y={IMG_Y + 154} fontSize={7.5} fill={vt.textFaint}>
                  {L.yoloPredicts}
                </text>
                <text x={IMG_X + IMG_W + 20} y={IMG_Y + 166} fontSize={7.5} fill={vt.textFaint}>
                  {L.yoloOffsets}
                </text>

                {/* Grid spec */}
                <text x={IMG_X + IMG_W + 20} y={IMG_Y + 185} fontSize={8} fill={vt.ink(accentColor)}>
                  3×3 grid · 3 anchors/cell
                </text>
                <text x={IMG_X + IMG_W + 20} y={IMG_Y + 196} fontSize={8} fill={vt.textFaint}>
                  = 27 predictions total
                </text>
              </g>
            )}
          </svg>

          {/* Tab-specific controls */}
          {tab === "iou" && (
            <div className="px-5 pb-3 flex gap-2">
              {IOU_SCENARIOS.map((s, i) => (
                <button key={i} onClick={() => setIouScenario(i)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                  style={{
                    backgroundColor: iouScenario === i ? `${accentColor}22` : vt.surface,
                    color: iouScenario === i ? accentColor : vt.textMuted,
                    border: `1px solid ${iouScenario === i ? accentColor + "55" : "var(--border)"}`,
                  }}>
                  {L.iouScenarioLabels[i]}
                </button>
              ))}
            </div>
          )}

          {tab === "nms" && (
            <div className="px-5 pb-3 flex gap-2 items-center">
              <span className="text-xs" style={{ color: vt.textMuted }}>{L.stepCtrl}</span>
              {NMS_STEPS.map((_, i) => (
                <button key={i} onClick={() => setNmsStep(i)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                  style={{
                    backgroundColor: nmsStep === i ? `${accentColor}22` : vt.surface,
                    color: nmsStep === i ? accentColor : vt.textMuted,
                    border: `1px solid ${nmsStep === i ? accentColor + "55" : "var(--border)"}`,
                  }}>
                  {i + 1}
                </button>
              ))}
              <span className="text-xs ml-2" style={{ color: vt.textFaint }}>
                {L.nmsLabels[nmsStep]}
              </span>
            </div>
          )}

          {tab === "anchors" && (
            <div className="px-5 pb-3">
              <p className="text-xs" style={{ color: vt.textFaint }}>
                {L.anchorsNote}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Insight bar */}
      <div className="px-5 py-3 border-t" style={{ borderColor: "var(--border)" }}>
        <p className="text-xs" style={{ color: vt.textMuted }}>
          {L.insights[tab]}
        </p>
      </div>
    </VizCard>
  );
}

"use client";
import { useVizTheme } from "@/hooks/useVizTheme";
import { ARROW_DEFS, Arrow, Box, textOn } from './primitives';
import type { VT } from './primitives';

function TransformerArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 396;
  const ac = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const BW = 170, CX = W / 2, BX = CX - BW / 2;
  const neutralBg = vt.isDark ? "#374151" : "#e2e8f0";
  const purple = vt.isDark ? "#7c3aed" : "#8b5cf6";
  const green  = vt.isDark ? "#059669" : "#34d399";

  // Bottom-to-top layout (higher y = visually lower):
  // y=344 → Token Embedding  (h=40, bottom=384) — OUTSIDE encoder block border (bottom=334)
  // y=270 → MHA              (h=40, bottom=310) — gap 34px above
  // y=222 → Add & Norm ①     (h=30, bottom=252) — gap 18px above
  // y=166 → FFN              (h=38, bottom=204) — gap 18px above
  // y=118 → Add & Norm ②     (h=30, bottom=148) — gap 18px above
  // y= 62 → Linear+Softmax   (h=38, bottom=100) — gap 18px above
  // y= 18 → Output box       (h=26, bottom= 44) — gap 18px above

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-tr", ac)}

      {/* ── Token Embedding (bottom) — placed below encoder block border (border bottom=334) ── */}
      <Box x={BX} y={344} w={BW} h={40}
        label="Token Embedding" sublabel="xₜ + PE(pos)  →  d-dim vector"
        bg={neutralBg} textColor={vt.text} rx={8} />
      {/* Arrow from Token Embed top (344) to MHA bottom (310) — 34px gap */}
      <line x1={CX} y1={344} x2={CX} y2={310} stroke={ac} strokeWidth={1.5} markerEnd={`url(#arr-tr)`} />

      {/* ── Encoder block border ── */}
      <rect x={BX - 28} y={114} width={BW + 56} height={220} rx={10}
        fill={`${accent}07`} stroke={`${accent}30`} strokeWidth={1.5} strokeDasharray="6,3" />
      <text x={BX + BW + 34} y={228} textAnchor="start" fontSize={13}
        fill={vt.ink(accent)} fontWeight="bold">×N</text>

      {/* ── Multi-Head Attention ── */}
      <Box x={BX} y={270} w={BW} h={40}
        label="Multi-Head Self-Attention" sublabel="Attn(Q,K,V)=softmax(QKᵀ/√dₖ)V"
        bg={accent} textColor={textOn(accent)} rx={8} />
      {/* Arrow from MHA top (270) to Add&Norm1 bottom (252) */}
      <line x1={CX} y1={270} x2={CX} y2={252} stroke={ac} strokeWidth={1.5} markerEnd={`url(#arr-tr)`} />

      {/* ── Add & Norm 1 ── */}
      <Box x={BX} y={222} w={BW} h={30}
        label="Add & LayerNorm ①  (x + sublayer)" bg={neutralBg} textColor={vt.text} rx={6} />
      {/* Arrow from Add&Norm1 top (222) to FFN bottom (204) */}
      <line x1={CX} y1={222} x2={CX} y2={204} stroke={ac} strokeWidth={1.5} markerEnd={`url(#arr-tr)`} />

      {/* ── FFN ── */}
      <Box x={BX} y={166} w={BW} h={38}
        label="Feed-Forward Network" sublabel="FFN(x)=max(0,xW₁+b₁)W₂+b₂  d→4d→d"
        bg={purple} textColor="white" rx={8} />
      {/* Arrow from FFN top (166) to Add&Norm2 bottom (148) */}
      <line x1={CX} y1={166} x2={CX} y2={148} stroke={ac} strokeWidth={1.5} markerEnd={`url(#arr-tr)`} />

      {/* ── Add & Norm 2 ── */}
      <Box x={BX} y={118} w={BW} h={30}
        label="Add & LayerNorm ②  (x + sublayer)" bg={neutralBg} textColor={vt.text} rx={6} />
      {/* Arrow from Add&Norm2 top (118) to Linear+Softmax bottom (100) */}
      <line x1={CX} y1={118} x2={CX} y2={100} stroke={ac} strokeWidth={1.5} markerEnd={`url(#arr-tr)`} />

      {/* ── Output head ── */}
      <Box x={BX} y={62} w={BW} h={38}
        label="Linear + Softmax" sublabel="logits → P(vocab) or class probs"
        bg={green} textColor={textOn(green)} rx={8} />
      {/* Arrow from Linear+Softmax top (62) to Output box bottom (44) */}
      <line x1={CX} y1={62} x2={CX} y2={44} stroke={ac} strokeWidth={1.5} markerEnd={`url(#arr-tr)`} />
      <Box x={BX} y={18} w={BW} h={26} label="Output: token probs / class"
        bg={neutralBg} textColor={vt.text} rx={6} />

      {/* ── Residual skip connections (left rail) ── */}
      {/* Skip around MHA: from Token Embed top (344) to Add&Norm1 bottom (252) */}
      <path d={`M ${BX - 8} 344 L ${BX - 22} 344 L ${BX - 22} 252 L ${BX - 8} 252`}
        fill="none" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4,2" />
      {/* Skip around FFN: from Add&Norm1 top (222) to Add&Norm2 bottom (148) */}
      <path d={`M ${BX - 8} 222 L ${BX - 22} 222 L ${BX - 22} 148 L ${BX - 8} 148`}
        fill="none" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4,2" />
      <text x={BX - 30} y={240} fontSize={8} fill={vt.ink("#f59e0b")} fontWeight="bold"
        transform={`rotate(-90,${BX-30},240)`}>residual</text>

      {/* ── BERT annotation ── */}
      <rect x={W - 140} y={268} width={128} height={74} rx={8}
        fill={vt.isDark ? "#1e3a5f30" : "#dbeafe50"} stroke="#3b82f6" strokeWidth={1} strokeDasharray="4,2" />
      <text x={W - 76} y={284} textAnchor="middle" fontSize={9} fill={vt.ink("#3b82f6")} fontWeight="bold">BERT uses encoder</text>
      <text x={W - 76} y={298} textAnchor="middle" fontSize={8} fill={vt.ink("#3b82f6")}>bidirectional attention</text>
      <text x={W - 76} y={312} textAnchor="middle" fontSize={8} fill={vt.ink("#3b82f6")}>[CLS] cls token</text>
      <text x={W - 76} y={326} textAnchor="middle" fontSize={8} fill={vt.ink("#3b82f6")}>MLM + NSP pretrain</text>
      <text x={W - 76} y={340} textAnchor="middle" fontSize={8} fill={vt.ink("#3b82f6")}>fine-tune: add head</text>

      <text x={W/2} y={H - 6} textAnchor="middle" fontSize={8} fill={vt.textMuted}>
        Transformer: O(n²d) attention — Q=XWQ, K=XWK, V=XWV — fully parallelizable, no recurrence
      </text>
    </svg>
  );
}

// 11. LSTM cell — input at top, gates below, output at bottom (no overlap)

function BERTArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 280;
  const ac = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const nb = vt.isDark ? "#334155" : "#e2e8f0";
  const green = vt.isDark ? "#059669" : "#34d399";
  const purple = vt.isDark ? "#7c3aed" : "#8b5cf6";
  const blue = "#3b82f6";

  const tokens = ["[CLS]", "The", "cat", "[MASK]", "[SEP]"];
  const CELL_W = 72, CELL_H = 28, TOK_Y = 196;
  const totalW = tokens.length * CELL_W;
  const startX = (W - totalW) / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-bert", ac)}

      {/* ── Title ── */}
      <text x={W/2} y={16} textAnchor="middle" fontSize={10} fill={vt.ink(accent)} fontWeight="bold">
        BERT: Bidirectional Encoder Representations from Transformers
      </text>

      {/* ── Pre-training task cards (top row) ── */}
      <rect x={6} y={24} width={160} height={36} rx={6}
        fill={vt.isDark ? "#7f1d1d30" : "#fee2e220"} stroke="#ef4444" strokeWidth={1} />
      <text x={86} y={39} textAnchor="middle" fontSize={8.5} fill={vt.ink("#ef4444")} fontWeight="bold">MLM: Masked LM</text>
      <text x={86} y={52} textAnchor="middle" fontSize={7.5} fill={vt.ink("#ef4444")}>predict [MASK] → rich token ctx</text>

      <rect x={W - 166} y={24} width={160} height={36} rx={6}
        fill={`${purple}20`} stroke={purple} strokeWidth={1} />
      <text x={W - 86} y={39} textAnchor="middle" fontSize={8.5} fill={purple} fontWeight="bold">NSP: Next Sentence</text>
      <text x={W - 86} y={52} textAnchor="middle" fontSize={7.5} fill={purple}>Is B the next sentence?</text>

      {/* ── Fine-tune note (centered between cards, no overlap) ── */}
      <text x={W/2} y={40} textAnchor="middle" fontSize={8.5} fill={vt.ink(accent)} fontWeight="bold">
        Fine-tune: add task head on [CLS] output
      </text>

      {/* ── Transformer encoder block ── */}
      <rect x={startX - 10} y={72} width={totalW + 20} height={54} rx={8}
        fill={`${accent}10`} stroke={`${accent}35`} strokeWidth={1.5} strokeDasharray="5,3" />
      <text x={W/2} y={92} textAnchor="middle" fontSize={9} fill={vt.ink(accent)} fontWeight="bold">
        Transformer Encoder × 12 layers (BERT-base)   |   × 24 (BERT-large)
      </text>
      <text x={W/2} y={107} textAnchor="middle" fontSize={8} fill={vt.textMuted}>
        MH-Self-Attention (12 heads, d=768) → Add&amp;Norm → FFN(768→3072→768) → Add&amp;Norm
      </text>
      <text x={W/2} y={119} textAnchor="middle" fontSize={7.5} fill={vt.textMuted}>
        All tokens attend to ALL tokens simultaneously — no left-to-right mask (unlike GPT)
      </text>

      {/* ── Token embedding → encoder arrows ── */}
      {tokens.map((tok, i) => {
        const x = startX + i * CELL_W;
        return (
          <line key={`arr-${tok}`} x1={x + CELL_W/2} y1={TOK_Y} x2={x + CELL_W/2} y2={126}
            stroke={ac} strokeWidth={1} markerEnd="url(#arr-bert)" />
        );
      })}

      {/* ── Input tokens ── */}
      {tokens.map((tok, i) => {
        const x = startX + i * CELL_W;
        const isCLS  = tok === "[CLS]";
        const isMASK = tok === "[MASK]";
        const isSEP  = tok === "[SEP]";
        const bg = isCLS ? accent : isMASK ? "#ef4444" : isSEP ? purple : nb;
        const tc = isCLS || isMASK || isSEP ? textOn(bg) : vt.text;
        return (
          <g key={tok}>
            <rect x={x + 2} y={TOK_Y} width={CELL_W - 4} height={CELL_H} rx={5}
              fill={bg} stroke={isMASK ? "#ef4444" : "transparent"} strokeWidth={1.5} />
            <text x={x + CELL_W/2} y={TOK_Y + CELL_H/2 + 4}
              textAnchor="middle" fontSize={9} fontWeight="bold" fill={tc}>{tok}</text>
          </g>
        );
      })}

      {/* ── Bidirectional arrows between tokens ── */}
      {tokens.slice(0, -1).map((_, i) => {
        const x1 = startX + i * CELL_W + CELL_W - 4;
        const x2 = startX + (i+1) * CELL_W + 4;
        const my = TOK_Y + CELL_H + 10;
        return (
          <line key={i} x1={x1} y1={my} x2={x2} y2={my} stroke={blue} strokeWidth={1}
            markerEnd={`url(#arr-bert)`} markerStart={`url(#arr-bert)`} opacity={0.6} />
        );
      })}
      <text x={W/2} y={TOK_Y + CELL_H + 24} textAnchor="middle" fontSize={8} fill={blue}>
        ← bidirectional: every token sees every other token simultaneously →
      </text>

      {/* ── Token type labels ── */}
      <text x={startX + CELL_W/2} y={TOK_Y - 4} textAnchor="middle" fontSize={7} fill={vt.ink(accent)}>[CLS] cls</text>
      <text x={startX + 3*CELL_W + CELL_W/2} y={TOK_Y - 4} textAnchor="middle" fontSize={7} fill={vt.ink("#ef4444")}>[MASK] ?</text>

      {/* ── Embedding types legend ── */}
      <text x={8} y={H - 18} fontSize={8} fill={vt.textMuted}>Token Emb + Segment Emb + Position Emb → input to encoder</text>
      <text x={W/2} y={H - 6} textAnchor="middle" fontSize={8.5} fill={vt.textMuted}>
        Pre-train (MLM+NSP) → fine-tune: add [CLS] head for classification, NER, QA…
      </text>
    </svg>
  );
}

export { TransformerArch, BERTArch };

"use client";
import { useVizTheme } from "@/hooks/useVizTheme";
import { ARROW_DEFS, Arrow, Box, textOn } from './primitives';
import type { VT } from './primitives';

function GANArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 190;
  const arrowColor = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-gan", arrowColor)}

      {/* Generator path */}
      <Box x={10} y={40} w={74} h={36} label="Noise z" sublabel="z~N(0,I)"
        bg={vt.isDark ? "#334155" : "#e2e8f0"} textColor={vt.text} rx={8} />
      <Arrow x1={84} y1={58} x2={114} y2={58} color={arrowColor} markerId="arr-gan" />
      <Box x={114} y={28} w={108} h={60} label="Generator G(z)" sublabel="NN: z → x̂"
        bg={accent} textColor={textOn(accent)} rx={8} />
      <Arrow x1={222} y1={58} x2={258} y2={58} color={arrowColor} markerId="arr-gan" />
      <text x={240} y={50} textAnchor="middle" fontSize={8} fill={vt.textMuted}>Fake x̂</text>

      {/* Real data */}
      <Box x={10} y={120} w={74} h={36} label="Real Data" sublabel="from p_data"
        bg={vt.isDark ? "#059669" : "#34d399"} textColor={textOn("#34d399")} rx={8} />
      <Arrow x1={84} y1={138} x2={258} y2={100} color={arrowColor} markerId="arr-gan" />
      <text x={172} y={122} textAnchor="middle" fontSize={8} fill={vt.textMuted}>Real x</text>

      {/* Discriminator */}
      <Box x={258} y={40} w={118} h={80} label="Discriminator D(x)" sublabel="NN: x → [0,1]"
        bg={vt.isDark ? "#7c3aed" : "#8b5cf6"} textColor="white" rx={8} />
      <Arrow x1={376} y1={80} x2={416} y2={80} color={arrowColor} markerId="arr-gan" />
      <Box x={416} y={60} w={90} h={40} label="Real/Fake?" sublabel="BCE loss"
        bg={vt.isDark ? "#374151" : "#e2e8f0"} textColor={vt.text} rx={8} />

      {/* Feedback: discriminator loss */}
      <path d="M 461 100 L 461 158 L 312 158 L 312 120"
        fill="none" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="5,3"
        markerEnd="url(#arr-gan)" />
      <text x={386} y={165} textAnchor="middle" fontSize={7} fill={vt.ink("#f59e0b")}>disc gradient ∇_D</text>

      {/* Generator loss feedback */}
      <path d="M 380 52 L 406 52 L 406 20 L 168 20 L 168 28"
        fill="none" stroke="#ff6b6b" strokeWidth={1.5} strokeDasharray="5,3"
        markerEnd="url(#arr-gan)" />
      <text x={284} y={17} textAnchor="middle" fontSize={7} fill={vt.ink("#ff6b6b")}>gen gradient ∇_G (fool D)</text>

      <text x={W/2} y={H - 4} textAnchor="middle" fontSize={9} fill={vt.textMuted}>
        GAN: min_G max_D E[log D(x)] + E[log(1−D(G(z)))]
      </text>
    </svg>
  );
}

// 13. Model Evaluation pipeline

function VAEArch({ accent, vt }: { accent: string; vt: VT }) {
  const W = 540, H = 200;
  const ac = vt.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";
  const nb = vt.isDark ? "#334155" : "#e2e8f0";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ARROW_DEFS("arr-vae", ac)}

      {/* Input */}
      <Box x={6} y={76} w={58} h={44} label="Input x" sublabel="data"
        bg={nb} textColor={vt.text} rx={8} />
      <Arrow x1={64} y1={98} x2={84} y2={98} color={ac} markerId="arr-vae" />

      {/* Encoder */}
      <Box x={84} y={60} w={88} h={76} label="Encoder" sublabel="q_φ(z|x)"
        bg={accent} textColor={textOn(accent)} rx={8} />
      <Arrow x1={172} y1={78} x2={194} y2={74} color={ac} markerId="arr-vae" />
      <Arrow x1={172} y1={118} x2={194} y2={122} color={ac} markerId="arr-vae" />

      {/* μ and σ */}
      <Box x={194} y={56} w={58} h={30} label="μ(x)" sublabel="mean"
        bg={vt.isDark ? "#7c3aed" : "#8b5cf6"} textColor="white" rx={6} />
      <Box x={194} y={100} w={58} h={30} label="σ(x)" sublabel="std dev"
        bg={vt.isDark ? "#7c3aed" : "#8b5cf6"} textColor="white" rx={6} />
      <Arrow x1={252} y1={71} x2={274} y2={90} color={ac} markerId="arr-vae" />
      <Arrow x1={252} y1={115} x2={274} y2={106} color={ac} markerId="arr-vae" />

      {/* Reparameterization */}
      <Box x={274} y={72} w={76} h={52}
        label="z = μ+ε·σ" sublabel="ε~N(0,I) reparam"
        bg={vt.isDark ? "#0891b2" : "#22d3ee"} textColor={textOn("#22d3ee")} rx={8} />
      <Arrow x1={350} y1={98} x2={372} y2={98} color={ac} markerId="arr-vae" />

      {/* Decoder */}
      <Box x={372} y={60} w={88} h={76} label="Decoder" sublabel="p_θ(x|z)"
        bg={accent} textColor={textOn(accent)} rx={8} />
      <Arrow x1={460} y1={98} x2={478} y2={98} color={ac} markerId="arr-vae" />

      {/* Reconstruction */}
      <Box x={478} y={76} w={54} h={44} label="x̂" sublabel="recon"
        bg={vt.isDark ? "#059669" : "#34d399"} textColor={textOn("#059669")} rx={8} />

      {/* Loss */}
      <rect x={60} y={150} width={W - 80} height={30} rx={6}
        fill={vt.surface} stroke={vt.border} strokeWidth={1} />
      <text x={W / 2} y={163} textAnchor="middle" fontSize={9} fill={vt.text} fontFamily="monospace">
        L = E[log p(x|z)] − KL[q(z|x) ‖ p(z)]
      </text>
      <text x={W / 2} y={177} textAnchor="middle" fontSize={8} fill={vt.textMuted}>
        reconstruction loss − KL regularization (forces z → N(0,I))
      </text>
      <text x={W/2} y={H - 4} textAnchor="middle" fontSize={8} fill={vt.textMuted}>
        VAE learns a smooth, continuous latent space — enables interpolation and generation
      </text>
    </svg>
  );
}

// 24. CatBoost — ordered TS + symmetric trees + ordered boosting

export { GANArch, VAEArch };

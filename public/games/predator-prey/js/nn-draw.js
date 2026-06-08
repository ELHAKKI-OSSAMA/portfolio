// ── Neural Net Visualiser ─────────────────────────────────────────────────
// Updated for v3 brains:
//   Prey: 11 inputs  (2×pred: dist+sin+cos, plant: dist+sin+cos, energy, speed)
//   Pred:  9 inputs  (2×prey: dist+sin+cos, prey-count, energy, speed)
//   Both:  2 outputs (turn, speed)
//   Hidden: tanh activations → values in [-1,1], colour reflects sign
const NNDraw = (() => {
  const canvas = document.getElementById('nn-canvas');
  const ctx    = canvas.getContext('2d');
  const PREY_ACCENT = '#00ff88';
  const PRED_ACCENT = '#ff4444';

  const PREY_LABELS = ['p1d','p1s','p1c','p2d','p2s','p2c','pld','pls','plc','nrg','spd'];
  const PRED_LABELS = ['q1d','q1s','q1c','q2d','q2s','q2c','n#','nrg','spd'];
  const OUT_LABELS  = ['trn','spd'];

  function resize() {
    canvas.width  = canvas.parentElement.clientWidth;
    canvas.height = Math.floor(canvas.parentElement.clientHeight / 2);
  }

  function drawNet(agent, accent, xOff, panelW, H, inLabels) {
    if (!agent) return;
    const br = agent.brain;
    const counts = [br.inp, br.hid, br.out];
    const nR = Math.min(6, H / 54);
    const lx = [xOff + panelW * 0.10, xOff + panelW * 0.50, xOff + panelW * 0.90];

    const acts = [
      agent.lastInputs || new Array(br.inp).fill(0),
      (agent.lastActs && agent.lastActs.h) || new Array(br.hid).fill(0),
      (agent.lastActs && agent.lastActs.o) || new Array(br.out).fill(0),
    ];

    // Node positions
    const pos = counts.map((cnt, li) => {
      const spacing = Math.min((H - 50) / cnt, 22);
      const startY  = H / 2 - (cnt - 1) * spacing / 2 + 8;
      return Array.from({ length: cnt }, (_, ni) => ({
        x: lx[li], y: cnt === 1 ? H / 2 : startY + ni * spacing
      }));
    });

    // Connections
    counts.forEach((cnt, li) => {
      if (li === counts.length - 1) return;
      const nc = counts[li + 1];
      for (let ni = 0; ni < cnt; ni++) {
        for (let nj = 0; nj < nc; nj++) {
          const from = pos[li][ni], to = pos[li + 1][nj];
          const wIdx = li === 0 ? ni * br.hid + nj : ni * br.out + nj;
          const w    = li === 0 ? br.w1[wIdx] : br.w2[wIdx];
          const act  = acts[li][ni];
          const alpha = Math.min(0.55, Math.abs(act) * 0.45 + 0.06);
          // Positive weight → accent colour, negative → red tint
          const r = w > 0 ? parseInt(accent.slice(1,3),16) : 220;
          const g = w > 0 ? parseInt(accent.slice(3,5),16) : 60;
          const b = w > 0 ? parseInt(accent.slice(5,7),16) : 60;
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.lineWidth   = 0.5;
          ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y); ctx.stroke();
        }
      }
    });

    // Nodes
    counts.forEach((cnt, li) => {
      for (let ni = 0; ni < cnt; ni++) {
        const { x, y } = pos[li][ni];
        const a = acts[li][ni];
        // tanh outputs in [-1,1]: use absolute value for intensity, sign for hue shift
        const intensity = Math.min(1, Math.abs(a));
        if (intensity > 0.25) {
          ctx.beginPath(); ctx.arc(x, y, nR + 4, 0, Math.PI * 2);
          ctx.fillStyle = accent + '18'; ctx.fill();
        }
        ctx.beginPath(); ctx.arc(x, y, nR, 0, Math.PI * 2);
        const alpha = 0.2 + intensity * 0.8;
        // Hidden layer: blue; input/output: accent
        const bR = li === 1 ? 68  : parseInt(accent.slice(1,3),16);
        const bG = li === 1 ? 170 : parseInt(accent.slice(3,5),16);
        const bB = li === 1 ? 255 : parseInt(accent.slice(5,7),16);
        ctx.fillStyle   = `rgba(${bR},${bG},${bB},${alpha})`;
        ctx.fill();
        ctx.strokeStyle = li === 1 ? '#44aaff' : accent;
        ctx.lineWidth   = 0.8; ctx.stroke();
        ctx.fillStyle   = '#000';
        ctx.font        = `bold ${Math.max(4, nR * 0.62)}px Courier New`;
        ctx.textAlign   = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(a.toFixed(1), x, y);
      }
    });

    // Labels
    ctx.font = '7px Courier New'; ctx.fillStyle = accent + '88';
    ctx.textAlign = 'right';
    pos[0].forEach((p, i) => ctx.fillText(inLabels[i] || ('i'+i), p.x - nR - 2, p.y));
    ctx.textAlign = 'left';
    pos[2].forEach((p, i) => ctx.fillText(OUT_LABELS[i] || ('o'+i), p.x + nR + 2, p.y));
  }

  function draw(bestPrey, bestPred) {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#06060e'; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#111'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(W/2, 0); ctx.lineTo(W/2, H); ctx.stroke();
    ctx.font = 'bold 8px Courier New'; ctx.textAlign = 'center';
    ctx.fillStyle = PREY_ACCENT; ctx.fillText('PREY', W/4, 10);
    ctx.fillStyle = PRED_ACCENT; ctx.fillText('PREDATOR', W*3/4, 10);
    const half = Math.floor(W / 2);
    drawNet(bestPrey, PREY_ACCENT, 0,    half, H, PREY_LABELS);
    drawNet(bestPred, PRED_ACCENT, half, half, H, PRED_LABELS);
  }

  return { resize, draw };
})();

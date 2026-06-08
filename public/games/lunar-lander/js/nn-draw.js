// ── Neural Network Visualiser — v2 (4-layer) ─────────────────────────────────
// Draws: Input(9) → H1(16)·ReLU → H2(10)·tanh → Output(3)
// Shows memory neuron label and live memory value
// ─────────────────────────────────────────────────────────────────────────────

const NNDraw = (() => {
  const canvas = document.getElementById('nn-canvas');
  const ctx    = canvas.getContext('2d');

  const ACCENT       = '#44ccff';
  const LAYER_COLORS = ['#4488ff', '#00cc77', '#8899ff', ACCENT];
  // LAYER_COUNTS auto-reads from LCFG which is now H1=32, H2=16
  const LAYER_COUNTS = [LCFG.INP, LCFG.H1, LCFG.H2, LCFG.OUT];
  const LAYER_LABELS = ['IN+MEM', 'H1·ReLU', 'H2·tanh', 'OUT'];

  const INPUT_LABELS  = ['x', 'y', 'padX', 'vy', 'vx', 'ang', 'va', 'dist', 'mem'];
  const OUTPUT_LABELS = ['↑', '←', '→'];

  function resize() {
    const tb = document.getElementById('top-bar');
    canvas.width  = 220;
    canvas.height = Math.max(1, window.innerHeight - (tb ? tb.offsetHeight : 36));
  }

  function draw(lander) {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#06060e';
    ctx.fillRect(0, 0, W, H);
    if (!lander) return;

    const nR = Math.min(9, H / 80);

    // X positions for 4 layers
    const lx = [W * 0.10, W * 0.37, W * 0.63, W * 0.90];

    // Activations per layer
    const layerActs = [
      [...lander.getInputs(), lander.memory],   // 9 values (8 sensors + memory)
      [...lander.lastActs.h1],                   // H1
      [...lander.lastActs.h2],                   // H2
      [...lander.lastActs.o],                    // OUT
    ];

    // Node positions
    const pos = LAYER_COUNTS.map((cnt, li) => {
      const spacing = Math.min((H - 80) / cnt, 44);
      const totalH  = (cnt - 1) * spacing;
      const startY  = H / 2 - totalH / 2;
      return Array.from({ length: cnt }, (_, ni) => ({
        x: lx[li],
        y: cnt === 1 ? H / 2 : startY + ni * spacing,
      }));
    });

    // ── Edges ────────────────────────────────────────────────────────────────
    LAYER_COUNTS.forEach((cnt, li) => {
      if (li >= LAYER_COUNTS.length - 1) return;
      const nextCnt = LAYER_COUNTS[li + 1];

      // For H1→H2 (potentially 16×10=160 edges) draw every other source node
      const step = li === 1 ? 2 : 1;

      for (let ni = 0; ni < cnt; ni += step) {
        for (let nj = 0; nj < nextCnt; nj++) {
          const from = pos[li][ni], to = pos[li + 1][nj];
          const wArr = li === 0 ? lander.genome.w1
                     : li === 1 ? lander.genome.w2
                     : lander.genome.w3;
          const wIdx = li === 0 ? ni * LCFG.H1 + nj
                     : li === 1 ? ni * LCFG.H2 + nj
                     : ni * LCFG.OUT + nj;
          const w     = wArr[wIdx] || 0;
          const alpha = Math.min(0.55, Math.abs(layerActs[li][ni] || 0) * 0.55 + 0.08);
          ctx.strokeStyle = w > 0
            ? `rgba(0,200,100,${alpha})`
            : `rgba(255,80,80,${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.stroke();
        }
      }
    });

    // ── Nodes ────────────────────────────────────────────────────────────────
    LAYER_COUNTS.forEach((cnt, li) => {
      for (let ni = 0; ni < cnt; ni++) {
        const { x, y } = pos[li][ni];
        const a         = layerActs[li][ni] || 0;
        const intensity = Math.min(1, Math.abs(a));
        const col       = LAYER_COLORS[li];

        // Halo for active nodes
        if (intensity > 0.3) {
          ctx.beginPath();
          ctx.arc(x, y, nR + 4, 0, Math.PI * 2);
          ctx.fillStyle = col + '18';
          ctx.fill();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(x, y, nR, 0, Math.PI * 2);
        const alpha = 0.18 + intensity * 0.82;
        const hex   = Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.fillStyle   = col + hex;
        ctx.fill();
        ctx.strokeStyle = col;
        ctx.lineWidth   = 0.9;
        ctx.stroke();

        // Activation value label (only if node is large enough)
        if (nR >= 5) {
          ctx.fillStyle    = '#fff';
          ctx.font         = `${Math.max(6, nR * 0.65)}px Courier New`;
          ctx.textAlign    = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(a.toFixed(1), x, y);
        }
      }
    });

    // ── Input labels ─────────────────────────────────────────────────────────
    ctx.font      = '7px Courier New';
    ctx.textAlign = 'right';
    pos[0].forEach((p, i) => {
      // Highlight the memory input
      ctx.fillStyle = i === LCFG.INP - 1 ? '#ffcc0088' : '#44aacc66';
      ctx.fillText(INPUT_LABELS[i] || ('in' + i), p.x - nR - 3, p.y);
    });

    // ── Output labels ─────────────────────────────────────────────────────────
    ctx.textAlign = 'left';
    pos[3].forEach((p, i) => {
      ctx.fillStyle = ACCENT;
      ctx.fillText(OUTPUT_LABELS[i] || '?', p.x + nR + 3, p.y);
    });

    // ── Layer labels ──────────────────────────────────────────────────────────
    ctx.font      = '7px Courier New';
    ctx.textAlign = 'center';
    LAYER_LABELS.forEach((lbl, li) => {
      ctx.fillStyle = '#44ccff44';
      ctx.fillText(lbl, lx[li], H - 8);
    });

    // ── Memory readout ────────────────────────────────────────────────────────
    const mem = lander.memory || 0;
    ctx.fillStyle    = '#ffcc0077';
    ctx.font         = 'bold 8px Courier New';
    ctx.textAlign    = 'center';
    ctx.fillText(`MEM: ${mem.toFixed(3)}`, W / 2, 14);

    // ── Species / colour badge ────────────────────────────────────────────────
    ctx.fillStyle = lander.color || ACCENT;
    ctx.font      = 'bold 9px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('BEST  ' + lander.color.toUpperCase(), W / 2, 26);
  }

  return { resize, draw };
})();
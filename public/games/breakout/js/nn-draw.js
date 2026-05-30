// DQN Neural Network Visualization — Breakout
// Architecture: 8 → 128 → 64 → 3
const NNDraw = (()=>{
  const canvas = document.getElementById('nn-canvas');
  const ctx = canvas.getContext('2d');
  const ACCENT = '#ff44cc';

  // State: getState() in main.js
  const INPUT_LABELS = [
    'ball x','ball y','vel x','vel y',
    'pad x','dx/pad','vx>0','vy>0'
  ];
  const OUTPUT_LABELS = ['◄ LEFT','STAY','RIGHT ►'];

  const VIS_H1 = 12; // visible nodes from hidden layer 1 (128)
  const VIS_H2 = 10; // visible nodes from hidden layer 2 (64)

  function resize() {
    canvas.width  = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }

  function draw(agent) {
    resize();
    const W = canvas.width, H = canvas.height;
    ctx.fillStyle = '#06060e';
    ctx.fillRect(0, 0, W, H);

    if (!agent || !agent.lastActs) {
      ctx.fillStyle = '#2a1a2a';
      ctx.font = '9px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText('waiting for first step…', W / 2, H / 2);
      return;
    }

    const acts = agent.lastActs; // {inp, h1, h2, out}
    const H1 = acts.h1.length;  // 128
    const H2 = acts.h2.length;  // 64

    function sampleIdx(total, n) {
      const step = (total - 1) / (n - 1);
      return Array.from({length: n}, (_, i) => Math.round(i * step));
    }
    const h1Idx = sampleIdx(H1, VIS_H1);
    const h2Idx = sampleIdx(H2, VIS_H2);

    const layers = [
      { label: 'INPUT',   acts: acts.inp, idx: null,  color: '#4488ff', count: acts.inp.length },
      { label: 'HIDDEN1', acts: acts.h1,  idx: h1Idx, color: '#00ff88', count: VIS_H1, fullSize: H1 },
      { label: 'HIDDEN2', acts: acts.h2,  idx: h2Idx, color: '#00ff88', count: VIS_H2, fullSize: H2 },
      { label: 'OUTPUT',  acts: acts.out, idx: null,  color: '#ff44cc', count: acts.out.length }
    ];

    const nL = layers.length;
    const MARGIN_TOP = 30, MARGIN_BOT = 20;
    const MARGIN_LR  = 48;
    const lx = layers.map((_, li) => MARGIN_LR + li * (W - MARGIN_LR * 2) / (nL - 1));

    const nR = Math.min(10, (H - MARGIN_TOP - MARGIN_BOT) / (Math.max(acts.inp.length, VIS_H1, VIS_H2, acts.out.length) * 2.4));

    const pos = layers.map((lay, li) => {
      const n = lay.count;
      const spacing = Math.min((H - MARGIN_TOP - MARGIN_BOT - nR * 2) / Math.max(n - 1, 1), nR * 3.4);
      const totalH = (n - 1) * spacing;
      const startY = H / 2 - totalH / 2;
      return Array.from({length: n}, (_, ni) => ({
        x: lx[li],
        y: n === 1 ? H / 2 : startY + ni * spacing
      }));
    });

    // Connections
    for (let li = 0; li < nL - 1; li++) {
      const fromLayer = layers[li];
      const toLayer   = layers[li + 1];
      for (let ni = 0; ni < fromLayer.count; ni++) {
        const fromAct = fromLayer.idx ? fromLayer.acts[fromLayer.idx[ni]] : fromLayer.acts[ni];
        for (let nj = 0; nj < toLayer.count; nj++) {
          const from = pos[li][ni], to = pos[li + 1][nj];
          const alpha = Math.min(0.55, Math.abs(fromAct) * 0.5 + 0.06);
          ctx.strokeStyle = fromAct >= 0
            ? `rgba(0,200,100,${alpha})`
            : `rgba(255,80,80,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.stroke();
        }
      }
    }

    // Nodes
    layers.forEach((lay, li) => {
      Array.from({length: lay.count}).forEach((_, ni) => {
        const rawAct = lay.idx ? lay.acts[lay.idx[ni]] : lay.acts[ni];
        const {x, y} = pos[li][ni];
        const intensity = Math.min(1, Math.abs(rawAct));
        const col = lay.color;

        if (intensity > 0.25) {
          ctx.beginPath();
          ctx.arc(x, y, nR + 4, 0, Math.PI * 2);
          ctx.fillStyle = col + '1a';
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(x, y, nR, 0, Math.PI * 2);
        const alpha = 0.18 + intensity * 0.82;
        if (li === 0)       ctx.fillStyle = `rgba(68,136,255,${alpha})`;
        else if (li < nL-1) ctx.fillStyle = `rgba(0,255,136,${alpha})`;
        else                ctx.fillStyle = `rgba(255,68,204,${alpha})`;
        ctx.fill();
        ctx.strokeStyle = col;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        if (nR >= 7) {
          ctx.fillStyle = '#fff';
          ctx.font = `${Math.max(6, nR * 0.6)}px Courier New`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(rawAct.toFixed(1), x, y);
        }
      });
    });

    // Input labels
    ctx.font = '7px Courier New';
    ctx.fillStyle = '#2a1a2a';
    ctx.textAlign = 'right';
    pos[0].forEach((p, i) => ctx.fillText(INPUT_LABELS[i] || '', p.x - nR - 3, p.y + 2.5));

    // Output labels
    const bestOut = acts.out.indexOf(Math.max(...acts.out));
    ctx.textAlign = 'left';
    pos[nL - 1].forEach((p, i) => {
      ctx.fillStyle = i === bestOut ? '#ff44cc' : '#2a1a2a';
      ctx.font = (i === bestOut ? 'bold ' : '') + '8px Courier New';
      ctx.fillText(OUTPUT_LABELS[i], p.x + nR + 3, p.y + 2.5);
    });

    // Layer labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    layers.forEach((lay, li) => {
      ctx.fillStyle = '#2a1a2a';
      ctx.font = '8px Courier New';
      ctx.fillText(lay.label, lx[li], MARGIN_TOP - 12);
      if (lay.fullSize) {
        ctx.fillStyle = '#1a0a1a';
        ctx.font = '7px Courier New';
        ctx.fillText('(' + lay.fullSize + ')', lx[li], MARGIN_TOP - 3);
      }
    });

    // Title
    const ep = agent.episode || 0;
    ctx.fillStyle = ACCENT + '99';
    ctx.font = 'bold 9px Courier New';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('DQN — Episode ' + ep, W / 2, H - 5);
  }

  return { resize, draw };
})();

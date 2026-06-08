// Snake — Hamiltonian Cycle + Shortcuts AI (renderer)
// The side panels show the REAL algorithm state: the Hamiltonian cycle map,
// the score history, and live AI stats. (No fake neural network.)

const gc = document.getElementById('game-canvas');
const gx = gc.getContext('2d');
const cyc = document.getElementById('cycle-canvas');
const cx  = cyc.getContext('2d');
const rc = document.getElementById('reward-canvas');
const rx = rc.getContext('2d');
const sc = document.getElementById('stats-canvas');
const sx = sc.getContext('2d');

const env = new SnakeGame();
const speedEl = document.getElementById('speed');
let speed = parseInt(speedEl.value) || 1;   // slider position
let episode = 1, bestScore = 0, scoreHist = [], _moveAcc = 0, totalMoves = 0;

document.getElementById('speed-val').textContent = speed + 'x';
speedEl.addEventListener('input', e => {
  speed = parseInt(e.target.value) || 1;
  document.getElementById('speed-val').textContent = speed + 'x';
});

function resize() {
  gc.width  = gc.parentElement.clientWidth;
  gc.height = gc.parentElement.clientHeight;
  cyc.width = cyc.parentElement.clientWidth;  cyc.height = cyc.clientHeight;
  rc.width  = rc.parentElement.clientWidth;   rc.height  = rc.clientHeight;
  sc.width  = sc.parentElement.clientWidth;   sc.height  = sc.clientHeight;
}
window.addEventListener('resize', resize);
resize();

function drawGame() {
  const W = gc.width, H = gc.height;
  const cs = Math.min(W, H) / GRID;
  const ox = (W - cs*GRID)/2, oy = (H - cs*GRID)/2;

  gx.fillStyle = '#06060e'; gx.fillRect(0,0,W,H);
  gx.fillStyle = '#0a0a16'; gx.fillRect(ox,oy,cs*GRID,cs*GRID);

  gx.strokeStyle = '#0d1a0d'; gx.lineWidth = 0.4;
  for (let i = 0; i <= GRID; i++) {
    gx.beginPath(); gx.moveTo(ox+i*cs,oy); gx.lineTo(ox+i*cs,oy+cs*GRID); gx.stroke();
    gx.beginPath(); gx.moveTo(ox,oy+i*cs); gx.lineTo(ox+cs*GRID,oy+i*cs); gx.stroke();
  }

  // AI's live planned path to the apple
  const path = env.plannedPath || [];
  if (path.length) {
    gx.strokeStyle = env.mode === 'food' ? '#00ff8855' : '#ffaa0044';
    gx.lineWidth = 2;
    gx.beginPath();
    const [hx0, hy0] = env.snake[0];
    gx.moveTo(ox+hx0*cs+cs/2, oy+hy0*cs+cs/2);
    path.forEach(([x,y]) => gx.lineTo(ox+x*cs+cs/2, oy+y*cs+cs/2));
    gx.stroke();
  }

  if (env.food) {
    const [fx,fy] = env.food;
    const fgr = gx.createRadialGradient(ox+fx*cs+cs/2,oy+fy*cs+cs/2,1,ox+fx*cs+cs/2,oy+fy*cs+cs/2,cs*0.5);
    fgr.addColorStop(0,'#ff6666'); fgr.addColorStop(1,'#ff222244');
    gx.fillStyle = fgr;
    gx.beginPath(); gx.arc(ox+fx*cs+cs/2,oy+fy*cs+cs/2,cs*0.42,0,Math.PI*2); gx.fill();
  }

  const lastIdx = env.snake.length - 1;
  env.snake.forEach(([sx2,sy],i) => {
    const t = i/env.snake.length;
    gx.fillStyle = i===0 ? '#00ff88'
                 : i===lastIdx ? '#ffcc33'
                 : `rgb(0,${255-Math.floor(t*160)},${Math.floor(80-t*60)})`;
    const pad = cs*0.06;
    gx.fillRect(ox+sx2*cs+pad, oy+sy*cs+pad, cs-pad*2, cs-pad*2);
  });

  gx.fillStyle = '#1a3a1a';
  gx.font = `${Math.min(14,cs*0.8)}px Courier New`;
  gx.textAlign = 'left';
  gx.fillText(`SCORE ${env.score}  LEN ${env.snake.length}`, ox+4, oy-5);
}

// ── REAL panel 1: the Hamiltonian cycle the AI actually follows ──────────────
function drawCycleMap() {
  const W = cyc.width, H = cyc.height;
  cx.fillStyle = '#06060e'; cx.fillRect(0,0,W,H);
  cx.fillStyle = '#1a3a2a'; cx.font = '9px Courier New'; cx.textAlign = 'left';
  cx.fillText('HAMILTONIAN CYCLE', 10, 12);

  const top = 18;
  const cs = Math.min(W - 20, H - top - 8) / GRID;
  const ox = (W - cs*GRID)/2, oy = top + (H - top - 8 - cs*GRID)/2;

  // the closed cycle every cell is visited on
  cx.strokeStyle = '#13351f'; cx.lineWidth = 1;
  cx.beginPath();
  HAM_ORDER.forEach(([x,y],i) => {
    const px = ox+x*cs+cs/2, py = oy+y*cs+cs/2;
    i===0 ? cx.moveTo(px,py) : cx.lineTo(px,py);
  });
  cx.closePath(); cx.stroke();

  // live planned path on top
  const path = env.plannedPath || [];
  if (path.length) {
    cx.strokeStyle = env.mode === 'food' ? '#00ff88' : '#ffaa00';
    cx.lineWidth = 1.6;
    cx.beginPath();
    const [hx0,hy0] = env.snake[0];
    cx.moveTo(ox+hx0*cs+cs/2, oy+hy0*cs+cs/2);
    path.forEach(([x,y]) => cx.lineTo(ox+x*cs+cs/2, oy+y*cs+cs/2));
    cx.stroke();
  }

  // snake body dots + food
  env.snake.forEach(([x,y],i) => {
    cx.fillStyle = i===0 ? '#00ff88' : i===env.snake.length-1 ? '#ffcc33' : '#0c5a30';
    cx.fillRect(ox+x*cs+cs*0.2, oy+y*cs+cs*0.2, cs*0.6, cs*0.6);
  });
  if (env.food) {
    cx.fillStyle = '#ff5555';
    cx.beginPath(); cx.arc(ox+env.food[0]*cs+cs/2, oy+env.food[1]*cs+cs/2, cs*0.3, 0, Math.PI*2); cx.fill();
  }
}

// ── REAL panel 2: score history ─────────────────────────────────────────────
function drawScoreHistory() {
  const W=rc.width, H=rc.height;
  rx.fillStyle='#06060e'; rx.fillRect(0,0,W,H);
  rx.fillStyle='#1a3a2a'; rx.font='9px Courier New'; rx.textAlign='left';
  rx.fillText('SCORE HISTORY',10,12);
  if(scoreHist.length<2){ rx.fillStyle='#1a3a2a'; rx.fillText('(finish an episode…)',10,28); return; }
  const pts=scoreHist.slice(-80);
  const maxV=Math.max(...pts)||1;
  rx.fillStyle='rgba(0,255,136,0.06)';
  rx.beginPath();
  pts.forEach((v,i)=>{
    const x=10+(i/(pts.length-1))*(W-20), y=H-10-(v/maxV)*(H-28);
    i===0?rx.moveTo(x,H-10):rx.lineTo(x,y);
  });
  rx.lineTo(W-10,H-10); rx.closePath(); rx.fill();
  rx.strokeStyle='#00ff8877'; rx.lineWidth=1.5; rx.beginPath();
  pts.forEach((v,i)=>{
    const x=10+(i/(pts.length-1))*(W-20), y=H-10-(v/maxV)*(H-28);
    i===0?rx.moveTo(x,y):rx.lineTo(x,y);
  });
  rx.stroke();
  rx.fillStyle='#00ff88'; rx.font='8px Courier New'; rx.textAlign='right';
  rx.fillText('best:'+bestScore,W-6,12);
}

// ── REAL panel 3: live AI stats ─────────────────────────────────────────────
function drawStats() {
  const W=sc.width, H=sc.height;
  sx.fillStyle='#06060e'; sx.fillRect(0,0,W,H);
  sx.textAlign='left';
  sx.fillStyle='#1a3a2a'; sx.font='9px Courier New';
  sx.fillText('AI STATUS',10,12);

  const fill = (env.snake.length / N * 100);
  const eff  = env.score > 0 ? (env.steps / env.score) : 0; // moves per apple
  const rows = [
    ['mode',       (env.mode||'food').toUpperCase(), env.mode==='food' ? '#00ff88' : '#ffaa00'],
    ['apple dist', (env.plannedPath ? env.plannedPath.length : 0) + ' cells', '#9fdfff'],
    ['length',     env.snake.length + ' / ' + N, '#cfeccf'],
    ['board fill', fill.toFixed(1) + ' %', '#cfeccf'],
    ['shortcuts',  String(env.shortcuts || 0), '#cfeccf'],
    ['moves/apple',eff ? eff.toFixed(1) : '—', '#cfeccf'],
    ['total moves',String(totalMoves), '#cfeccf'],
  ];
  let y = 30;
  for (const [label, val, col] of rows) {
    sx.fillStyle='#3a5a4a'; sx.font='10px Courier New';
    sx.fillText(label, 10, y);
    sx.fillStyle=col; sx.font='bold 11px Courier New'; sx.textAlign='right';
    sx.fillText(val, W-10, y);
    sx.textAlign='left';
    y += 16;
  }
}

function updateUI() {
  document.getElementById('s-ep').textContent    = episode;
  document.getElementById('s-score').textContent = env.score;
  document.getElementById('s-best').textContent  = bestScore;
  document.getElementById('s-eps').textContent   = env.snake.length;   // LENGTH
  document.getElementById('s-steps').textContent = env.steps;          // real game steps
}

function doStep() {
  const { done } = env.step(0);   // AI decides internally; action is ignored
  totalMoves++;
  if (done) {
    if (env.score > bestScore) bestScore = env.score;
    scoreHist.push(env.score);
    episode++;
    env.reset();
  }
}

function loop() {
  requestAnimationFrame(loop);
  if (!_paused) {
    // Accumulator lets x1 run slower than one move/frame.
    _moveAcc += speed / 6;
    while (_moveAcc >= 1) { doStep(); _moveAcc--; }
  }
  drawGame(); drawCycleMap(); drawScoreHistory(); drawStats(); updateUI();
}
requestAnimationFrame(loop);

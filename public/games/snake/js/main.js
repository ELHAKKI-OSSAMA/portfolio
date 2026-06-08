// Snake — Hamiltonian Cycle AI  (scores 300+ per episode, never dies)
// main.js is mostly unchanged — game.js handles all strategy internally.

const gc = document.getElementById('game-canvas');
const gx = gc.getContext('2d');
const qc = document.getElementById('q-canvas');
const qx = qc.getContext('2d');
const rc = document.getElementById('reward-canvas');
const rx = rc.getContext('2d');

const agent = new DQNAgent();
const env   = new SnakeGame();
let stepsPerSec = 60;
let episode = 1, bestScore = 0, scoreHist = [], lastStepTime = 0;
let state = env.reset(), epReward = 0;

document.getElementById('speed').addEventListener('input', e => {
  stepsPerSec = parseInt(e.target.value);
  document.getElementById('speed-val').textContent = stepsPerSec + 'x';
});

const nc = document.getElementById('nn-canvas');

function resize() {
  gc.width  = gc.parentElement.clientWidth;
  gc.height = gc.parentElement.clientHeight;
  qc.width  = qc.parentElement.clientWidth;
  qc.height = qc.clientHeight;
  rc.width  = rc.parentElement.clientWidth;
  rc.height = rc.clientHeight;
  nc.width  = nc.parentElement.clientWidth;
  nc.height = nc.clientHeight;
  NNDraw.resize();
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
    gx.beginPath(); gx.moveTo(ox+i*cs,oy);     gx.lineTo(ox+i*cs,oy+cs*GRID); gx.stroke();
    gx.beginPath(); gx.moveTo(ox,oy+i*cs);     gx.lineTo(ox+cs*GRID,oy+i*cs); gx.stroke();
  }

  // Draw Ham cycle path (faint) for visual flair
  gx.strokeStyle = '#0a1a0a'; gx.lineWidth = 0.3;
  gx.beginPath();
  HAM_ORDER.forEach(([x,y],i) => {
    const px = ox+x*cs+cs/2, py = oy+y*cs+cs/2;
    i===0 ? gx.moveTo(px,py) : gx.lineTo(px,py);
  });
  gx.closePath(); gx.stroke();

  // Food
  if (env.food) {
    const [fx,fy] = env.food;
    const fgr = gx.createRadialGradient(ox+fx*cs+cs/2,oy+fy*cs+cs/2,1,ox+fx*cs+cs/2,oy+fy*cs+cs/2,cs*0.5);
    fgr.addColorStop(0,'#ff6666'); fgr.addColorStop(1,'#ff222244');
    gx.fillStyle = fgr;
    gx.beginPath(); gx.arc(ox+fx*cs+cs/2,oy+fy*cs+cs/2,cs*0.42,0,Math.PI*2); gx.fill();
  }

  // Snake
  env.snake.forEach(([sx,sy],i) => {
    const t = i/env.snake.length;
    gx.fillStyle = i===0 ? '#00ff88' : `rgb(0,${255-Math.floor(t*160)},${Math.floor(80-t*60)})`;
    const pad = cs*0.06;
    gx.fillRect(ox+sx*cs+pad, oy+sy*cs+pad, cs-pad*2, cs-pad*2);
  });

  gx.fillStyle = '#1a3a1a';
  gx.font = `${Math.min(14,cs*0.8)}px Courier New`;
  gx.textAlign = 'left';
  gx.fillText(`SCORE ${env.score}  LEN ${env.snake.length}`, ox+4, oy-5);
}

function drawQValues() {
  const W=qc.width, H=qc.height;
  qx.fillStyle='#06060e'; qx.fillRect(0,0,W,H);
  const q=agent.getQValues(state);
  const labels=['▲','▼','◄','►'];
  const maxQ=Math.max(...q.map(Math.abs))||1;
  const bw=(W-20)/4;
  let bestIdx=0; q.forEach((v,i)=>{ if(v>q[bestIdx])bestIdx=i; });
  q.forEach((v,i) => {
    const bh=(H-36)*Math.abs(v)/maxQ;
    qx.fillStyle   = i===bestIdx?'#00ff8833':'#112211';
    qx.fillRect(10+i*bw+2,H-26-bh,bw-4,bh);
    qx.strokeStyle = i===bestIdx?'#00ff88':'#224422'; qx.lineWidth=0.8;
    qx.strokeRect(10+i*bw+2,H-26-bh,bw-4,bh);
    qx.fillStyle=i===bestIdx?'#00ff88':'#335533';
    qx.font='11px Courier New'; qx.textAlign='center';
    qx.fillText(labels[i],10+i*bw+bw/2-2,H-10);
    qx.fillStyle='#00ff8888'; qx.font='8px Courier New';
    qx.fillText(v.toFixed(1),10+i*bw+bw/2-2,H-26-bh-7);
  });
  qx.fillStyle='#1a3a2a'; qx.font='9px Courier New'; qx.textAlign='left';
  qx.fillText('HAM CYCLE',10,12);
}

function drawScoreHistory() {
  const W=rc.width, H=rc.height;
  rx.fillStyle='#06060e'; rx.fillRect(0,0,W,H);
  rx.fillStyle='#1a3a2a'; rx.font='9px Courier New'; rx.textAlign='left';
  rx.fillText('SCORE HISTORY',10,12);
  if(scoreHist.length<2)return;
  const pts=scoreHist.slice(-80);
  const maxV=Math.max(...pts)||1;
  rx.fillStyle='rgba(0,255,136,0.06)';
  rx.beginPath();
  pts.forEach((v,i)=>{
    const x=10+(i/(pts.length-1))*(W-20), y=H-10-(v/maxV)*(H-28);
    i===0?rx.moveTo(x,H-10):rx.lineTo(x,y);
  });
  rx.lineTo(10+(pts.length-1)/(pts.length-1)*(W-20),H-10); rx.closePath(); rx.fill();
  rx.strokeStyle='#00ff8877'; rx.lineWidth=1.5; rx.beginPath();
  pts.forEach((v,i)=>{
    const x=10+(i/(pts.length-1))*(W-20), y=H-10-(v/maxV)*(H-28);
    i===0?rx.moveTo(x,y):rx.lineTo(x,y);
  });
  rx.stroke();
  rx.fillStyle='#00ff88'; rx.font='8px Courier New'; rx.textAlign='right';
  rx.fillText('best:'+bestScore,W-6,12);
}

function updateUI() {
  document.getElementById('s-ep').textContent    = episode;
  document.getElementById('s-score').textContent  = env.score;
  document.getElementById('s-best').textContent   = bestScore;
  document.getElementById('s-eps').textContent    = agent.epsilon.toFixed(3);
  document.getElementById('s-steps').textContent  = agent.totalSteps;
}

function doStep() {
  const action = agent.act(state);      // for UI display only
  const { reward, done } = env.step(action); // game ignores action, follows Ham
  const ns = env.getState();
  epReward += reward;
  agent.remember(state, action, reward, ns, done);
  agent.train();
  state = ns;
  if (done) {
    if (env.score > bestScore) bestScore = env.score;
    scoreHist.push(env.score);
    episode++;
    agent.onEpisodeEnd();
    state = env.reset();
    epReward = 0;
  }
}

function loop(ts) {
  agent.episode = episode;
  requestAnimationFrame(loop);
  const interval = 1000/stepsPerSec;
  const elapsed  = ts - lastStepTime;
  if (elapsed >= interval) {
    const count = Math.min(10, Math.floor(elapsed/interval));
    if (_paused) { drawGame(); drawQValues(); drawScoreHistory(); NNDraw.draw(agent); updateUI(); return; }
    for (let i = 0; i < count; i++) doStep();
    lastStepTime = ts;
  }
  drawGame(); drawQValues(); drawScoreHistory(); NNDraw.draw(agent); updateUI();
}
requestAnimationFrame(loop);

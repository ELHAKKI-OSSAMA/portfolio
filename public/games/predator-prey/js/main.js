// ═══════════════════════════════════════════════════════════════════════════
//  Predator–Prey  ·  GA-evolved neural brains  ·  v3 (red-queen stable)
// ═══════════════════════════════════════════════════════════════════════════
//  Key upgrades over v1:
//   • 4 preds vs 40 prey  →  enough variance for selection on both sides
//   • tanh hidden layer   →  no dead-relu neurons, better gradient signal
//   • sin/cos angle encoding  →  smooth, no ±π discontinuity
//   • prey see 2 nearest preds + nearest plant  (11 inputs)
//   • pred see 2 nearest prey                   (9 inputs)
//   • O(n) nearest-2 scan (no sort per-frame)
//   • pred max speed 3.5 px/frame, costs energy  →  must hunt efficiently
//   • prey fitness = pure survival time  (clean signal, no noise)
//   • prey selection = tournament-3  (preserves diversity)
//   • prey archive  (rolling 15 best brains)  →  injected randomly each gen
//   • pred selection: tournament-3; elite carry ONLY when prey weak
//   • pred mutation bumped when prey thriving  →  keeps arms-race alive
//   • avg survival trend shown in chart; 30 s goal-line drawn
// ═══════════════════════════════════════════════════════════════════════════

const GW = 900, GH = 600;
const N_PREY = 40, N_PRED = 4, N_PLANT = 80;
const PRED_R = 9, PREY_R = 5, PLANT_R = 5;
const TWO_PI = Math.PI * 2;
const GEN_FRAMES = 3600;   // 60 s of simulation per generation

// ── helpers ────────────────────────────────────────────────────────────────
function rnd()           { return Math.random(); }
function rr(a, b)        { return a + (b - a) * rnd(); }
function sigmoid(x)      { return 1 / (1 + Math.exp(-x)); }

// O(n) two-nearest scan – avoids per-frame sort
function nearest2(me, arr) {
  let b1 = null, b2 = null, d1 = 1e9, d2 = 1e9;
  for (const o of arr) {
    const d = (o.x - me.x) ** 2 + (o.y - me.y) ** 2;
    if (d < d1) { d2 = d1; b2 = b1; d1 = d; b1 = o; }
    else if (d < d2) { d2 = d; b2 = o; }
  }
  return [[b1, Math.sqrt(d1)], [b2, Math.sqrt(d2)]];
}
function nearestPlant(me, arr) {
  let b = null, bd = 1e9;
  for (const o of arr) {
    if (!o.alive) continue;
    const d = (o.x - me.x) ** 2 + (o.y - me.y) ** 2;
    if (d < bd) { bd = d; b = o; }
  }
  return [b, Math.sqrt(bd)];
}
// Angle to other encoded as [sin, cos] – smooth gradient, no wrap-around jump
function angleInputs(me, other) {
  if (!other) return [0, 0];
  const a = Math.atan2(other.y - me.y, other.x - me.x) - me.angle;
  return [Math.sin(a), Math.cos(a)];
}
// Tournament selection – preserves population diversity better than truncation
function tourney(pool, k = 3) {
  let best = null;
  for (let i = 0; i < k; i++) {
    const c = pool[Math.floor(rnd() * pool.length)];
    if (!best || c.fit > best.fit) best = c;
  }
  return best;
}

// ── Brain ──────────────────────────────────────────────────────────────────
class Brain {
  constructor(inp, hid, out) {
    this.inp = inp; this.hid = hid; this.out = out;
    this.w1 = Float32Array.from({ length: inp * hid }, () => rr(-1, 1));
    this.b1 = new Float32Array(hid);
    this.w2 = Float32Array.from({ length: hid * out }, () => rr(-1, 1));
    this.b2 = new Float32Array(out);
  }
  forward(x) {
    const h = new Float32Array(this.hid);
    for (let j = 0; j < this.hid; j++) {
      let s = this.b1[j];
      for (let i = 0; i < this.inp; i++) s += x[i] * this.w1[i * this.hid + j];
      h[j] = Math.tanh(s);           // tanh: symmetric, no dead neurons
    }
    const o = new Float32Array(this.out);
    for (let j = 0; j < this.out; j++) {
      let s = this.b2[j];
      for (let i = 0; i < this.hid; i++) s += h[i] * this.w2[i * this.out + j];
      o[j] = sigmoid(s);
    }
    return { h: Array.from(h), o: Array.from(o) };
  }
  clone() {
    const b = new Brain(this.inp, this.hid, this.out);
    b.w1 = new Float32Array(this.w1); b.b1 = new Float32Array(this.b1);
    b.w2 = new Float32Array(this.w2); b.b2 = new Float32Array(this.b2);
    return b;
  }
  mutate(rate, str) {
    [this.w1, this.b1, this.w2, this.b2].forEach(a => {
      for (let i = 0; i < a.length; i++) {
        if (rnd() < rate) {
          const delta = rnd() < 0.05 ? rr(-2, 2) : rr(-str, str);
          a[i] = Math.max(-3, Math.min(3, a[i] + delta));
        }
      }
    });
  }
  crossover(other) {
    const c = this.clone();
    ['w1', 'b1', 'w2', 'b2'].forEach(k => {
      for (let i = 0; i < c[k].length; i++) if (rnd() < 0.5) c[k][i] = other[k][i];
    });
    return c;
  }
}

// ── Agent ──────────────────────────────────────────────────────────────────
class Agent {
  constructor(x, y, brain, type) {
    this.x = x; this.y = y;
    this.brain = brain; this.type = type;
    this.angle = rnd() * TWO_PI; this.speed = 0;
    this.alive = true; this.fit = 0; this.kills = 0;
    this.energy = type === 'pred' ? 100 : 80;
    this.deathFrame = null;
    this.lastInputs = new Array(brain.inp).fill(0);
    this.lastActs   = { h: new Array(brain.hid).fill(0), o: new Array(brain.out).fill(0) };
  }
  step(preyList, predList, plantList, frame) {
    if (!this.alive) return;
    let inp, acts;
    if (this.type === 'prey') {
      const [[nd1, d1], [nd2, d2]] = nearest2(this, predList);
      const [pl, dp] = nearestPlant(this, plantList);
      const [s1, c1] = angleInputs(this, nd1);
      const [s2, c2] = angleInputs(this, nd2);
      const [sp, cp] = angleInputs(this, pl);
      inp = [Math.min(1, d1/500), s1, c1,
             Math.min(1, d2/500), s2, c2,
             Math.min(1, dp/500), sp, cp,
             this.energy / 100, this.speed / 3];
      acts = this.brain.forward(inp);
      this.angle += (acts.o[0] - 0.5) * 0.28;  // wider turning than pred
      this.speed  = 0.5 + acts.o[1] * 2.5;      // max 3.0 px/frame
    } else {
      const [[np1, d1], [np2, d2]] = nearest2(this, preyList);
      const [s1, c1] = angleInputs(this, np1);
      const [s2, c2] = angleInputs(this, np2);
      inp = [Math.min(1, d1/500), s1, c1,
             Math.min(1, d2/500), s2, c2,
             preyList.length / N_PREY, this.energy / 100, this.speed / 3.5];
      acts = this.brain.forward(inp);
      this.angle += (acts.o[0] - 0.5) * 0.22;
      this.speed  = 1.0 + acts.o[1] * 2.5;      // max 3.5 px/frame > prey max 3.0
    }
    this.lastInputs = inp; this.lastActs = acts;
    this.x = (this.x + Math.cos(this.angle) * this.speed + GW) % GW;
    this.y = (this.y + Math.sin(this.angle) * this.speed + GH) % GH;
    // Pred pays more energy at high speed → forced to hunt efficiently
    this.energy -= this.type === 'pred' ? (0.05 + this.speed * 0.015) : 0.025;
    if (this.energy <= 0) { this.alive = false; this.deathFrame = frame; }
  }
}

class Plant {
  constructor() { this.x = rnd() * GW; this.y = rnd() * GH; this.alive = true; }
}

// ── State ──────────────────────────────────────────────────────────────────
let generation = 1, eaten = 0, frameCount = 0;
let plants = Array.from({ length: N_PLANT }, () => new Plant());
let prey   = Array.from({ length: N_PREY  }, () => new Agent(rnd()*GW, rnd()*GH, new Brain(11,16,2), 'prey'));
let preds  = Array.from({ length: N_PRED  }, () => new Agent(rnd()*GW, rnd()*GH, new Brain(9, 16,2), 'pred'));

// Rolling archive of best prey brains (max 15) – injected randomly each gen
// Prevents preds from locking onto a single strategy and collapsing the arms race
const preyArchive = [];

let preyHist = [], predHist = [], survHist = [], killHist = [];

// ── Evolution ──────────────────────────────────────────────────────────────
function evolve() {
  const preyAlive = prey.filter(p => p.alive);
  const preyDead  = prey.filter(p => p.deathFrame !== null);
  const totalF    = preyDead.reduce((s, p) => s + p.deathFrame, 0) + preyAlive.length * frameCount;
  const avgSurv   = totalF / prey.length / 60;

  const topKills  = preds.length ? Math.max(...preds.map(p => p.kills)) : 0;
  preyHist.push(preyAlive.length);
  predHist.push(preds.filter(p => p.alive).length);
  survHist.push(+avgSurv.toFixed(1));
  killHist.push(topKills);

  // Update prey archive with top 3 brains from this gen
  const thisBest = [...prey].sort((a, b) => b.fit - a.fit).slice(0, 3);
  preyArchive.push(...thisBest.map(p => p.brain.clone()));
  if (preyArchive.length > 15) preyArchive.splice(0, preyArchive.length - 15);

  // ── Prey: tournament selection + 1 random archive injection ──────────────
  const preyMs = Math.max(0.08, 0.30 - generation * 0.002);
  prey = Array.from({ length: N_PREY }, (_, i) => {
    if (i === 0 && preyArchive.length > 0) {
      // Random archive brain → prevents preds fixing on a single target strategy
      const ab = preyArchive[Math.floor(rnd() * preyArchive.length)].clone();
      ab.mutate(0.10, preyMs * 0.5);
      return new Agent(rnd()*GW, rnd()*GH, ab, 'prey');
    }
    const a = tourney(prey, 3), b = tourney(prey, 3);
    const c = a.brain.crossover(b.brain);
    c.mutate(0.15, preyMs);
    return new Agent(rnd()*GW, rnd()*GH, c, 'prey');
  });

  // ── Preds: tournament; adaptive mutation; elite carry only when prey weak ─
  const predMs = avgSurv > 18 ? 0.25 : Math.max(0.10, 0.30 - generation * 0.002);
  const sortedPred = [...preds].sort((a, b) => b.kills - a.kills);
  preds = Array.from({ length: N_PRED }, (_, i) => {
    if (i < 1 && avgSurv < 15 && sortedPred[0].kills > 0) {
      return new Agent(rnd()*GW, rnd()*GH, sortedPred[0].brain.clone(), 'pred');
    }
    const a = tourney(preds, 3), b = tourney(preds, 3);
    const c = a.brain.crossover(b.brain);
    c.mutate(0.20, predMs);
    return new Agent(rnd()*GW, rnd()*GH, c, 'pred');
  });

  plants = Array.from({ length: N_PLANT }, () => new Plant());
  eaten = 0; generation++; frameCount = 0;
}

// ── Simulation step ────────────────────────────────────────────────────────
function simStep() {
  frameCount++;
  const alivePrey  = prey.filter(p => p.alive);
  const alivePreds = preds.filter(p => p.alive);

  // Prey eat plants
  alivePrey.forEach(p => {
    for (const pl of plants) {
      if (pl.alive && (p.x-pl.x)**2 + (p.y-pl.y)**2 < (PREY_R+PLANT_R)**2) {
        pl.alive = false;
        p.energy = Math.min(200, p.energy + 35);
      }
    }
  });

  // Preds eat prey
  alivePreds.forEach(pr => {
    for (const p of alivePrey) {
      if (p.alive && (pr.x-p.x)**2 + (pr.y-p.y)**2 < (PRED_R+PREY_R)**2) {
        p.alive = false; p.deathFrame = frameCount;
        pr.energy = Math.min(220, pr.energy + 60);
        pr.kills++; eaten++;
      }
    }
  });

  const alivePrey2  = prey.filter(p => p.alive);
  const alivePreds2 = preds.filter(p => p.alive);

  // Prey fitness: pure survival + small escape bonus (every 4 frames)
  if (frameCount % 4 === 0) {
    alivePrey2.forEach(p => {
      p.fit += 1;
      if (!alivePreds2.length) { p.fit += 1; return; }
      let m = 1e9;
      for (const pr of alivePreds2) {
        const d = (p.x-pr.x)**2 + (p.y-pr.y)**2;
        if (d < m) m = d;
      }
      p.fit += Math.min(1, Math.sqrt(m) / 200);
    });
  }

  // Pred fitness: tiny proximity tie-breaker (real selection is by kills count)
  alivePreds2.forEach(pr => {
    let m = 1e9;
    for (const p of alivePrey2) {
      const d = (pr.x-p.x)**2 + (pr.y-p.y)**2;
      if (d < m) m = d;
    }
    pr.fit += Math.max(0, (150 - Math.sqrt(m)) / 150) * 0.001;
  });

  if (rnd() < 0.04) plants.push(new Plant());

  alivePrey2.forEach(p  => p.step(alivePrey2.filter(x => x !== p), alivePreds2, plants.filter(x => x.alive), frameCount));
  alivePreds2.forEach(p => p.step(alivePrey2, alivePreds2.filter(x => x !== p), plants.filter(x => x.alive), frameCount));

  if (frameCount >= GEN_FRAMES || alivePrey2.length === 0) evolve();
}

// ── Canvas / resize ────────────────────────────────────────────────────────
const gc = document.getElementById('game-canvas');
const gx = gc.getContext('2d');
const cc = document.getElementById('chart-canvas');
const cx = cc.getContext('2d');

function resize() {
  gc.width  = gc.parentElement.clientWidth;
  gc.height = gc.parentElement.clientHeight;
  const cH  = cc.parentElement.clientHeight;
  cc.width  = cc.parentElement.clientWidth;
  cc.height = Math.floor(cH / 2);
  if (typeof NNDraw !== 'undefined') NNDraw.resize();
}
window.addEventListener('resize', resize);
resize();

let simSpeed = 2;
document.getElementById('speed').addEventListener('input', e => {
  simSpeed = parseInt(e.target.value);
  document.getElementById('speed-val').textContent = simSpeed + 'x';
});

// ── Render world ───────────────────────────────────────────────────────────
function draw() {
  const W = gc.width, H = gc.height;
  const s = Math.min(W / GW, H / GH);
  const ox = (W - GW * s) / 2, oy = (H - GH * s) / 2;

  gx.fillStyle = '#07070f'; gx.fillRect(0, 0, W, H);
  gx.save();
  gx.beginPath(); gx.rect(ox, oy, GW * s, GH * s); gx.clip();

  plants.filter(p => p.alive).forEach(p => {
    gx.fillStyle = '#0a2a0a';
    gx.beginPath(); gx.arc(ox+p.x*s, oy+p.y*s, PLANT_R*s, 0, TWO_PI); gx.fill();
  });

  prey.filter(p => p.alive).forEach(p => {
    gx.save();
    gx.translate(ox + p.x*s, oy + p.y*s); gx.rotate(p.angle);
    gx.fillStyle = `rgba(0,255,136,${Math.min(1, 0.35 + p.energy/220)})`;
    gx.beginPath();
    gx.moveTo( PREY_R*s, 0);
    gx.lineTo(-PREY_R*s,  PREY_R*0.6*s);
    gx.lineTo(-PREY_R*s, -PREY_R*0.6*s);
    gx.closePath(); gx.fill();
    gx.restore();
  });

  preds.filter(p => p.alive).forEach(p => {
    gx.save();
    gx.translate(ox + p.x*s, oy + p.y*s); gx.rotate(p.angle);
    const g2 = gx.createRadialGradient(0,0,1,0,0,PRED_R*1.5*s);
    g2.addColorStop(0,'rgba(255,68,68,0.3)'); g2.addColorStop(1,'transparent');
    gx.fillStyle = g2;
    gx.beginPath(); gx.arc(0, 0, PRED_R*1.5*s, 0, TWO_PI); gx.fill();
    gx.fillStyle = '#ff4444';
    gx.beginPath();
    gx.moveTo( PRED_R*s, 0);
    gx.lineTo(-PRED_R*s,  PRED_R*s);
    gx.lineTo(-PRED_R*s, -PRED_R*s);
    gx.closePath(); gx.fill();
    gx.restore();
  });

  gx.restore();
}

// ── Chart: survival trend + 30 s goal line ─────────────────────────────────
function drawChart() {
  const W = cc.width, H = cc.height;
  cx.fillStyle = '#06060e'; cx.fillRect(0, 0, W, H);
  if (survHist.length < 2) return;

  const pts  = survHist.slice(-80);
  const kpts = killHist.slice(-80);
  const maxV = Math.max(...pts, 30, 1);

  // 30 s goal line
  const gy = H - 16 - (30 / maxV) * (H - 28);
  cx.strokeStyle = '#ffffff22'; cx.lineWidth = 1; cx.setLineDash([4, 5]);
  cx.beginPath(); cx.moveTo(8, gy); cx.lineTo(W-8, gy); cx.stroke();
  cx.setLineDash([]);
  cx.fillStyle = '#ffffff33'; cx.font = '7px Courier New'; cx.textAlign = 'right';
  cx.fillText('30s', W-10, gy - 3);

  // Survival curve (green)
  cx.strokeStyle = '#00ff8899'; cx.lineWidth = 1.5;
  cx.beginPath();
  pts.forEach((v, i) => {
    const x = 8 + (i / (pts.length - 1)) * (W - 16);
    const y = H - 16 - (v / maxV) * (H - 28);
    i === 0 ? cx.moveTo(x, y) : cx.lineTo(x, y);
  });
  cx.stroke();

  // Top-kills trend (red, scaled to lower half)
  if (kpts.length > 1) {
    const mk = Math.max(...kpts, 1);
    cx.strokeStyle = '#ff444466'; cx.lineWidth = 1;
    cx.beginPath();
    kpts.forEach((v, i) => {
      const x = 8 + (i / (kpts.length-1)) * (W-16);
      const y = H - 16 - (v / mk) * (H - 28) * 0.35;
      i === 0 ? cx.moveTo(x, y) : cx.lineTo(x, y);
    });
    cx.stroke();
  }

  cx.fillStyle = '#00ff8866'; cx.font = '8px Courier New'; cx.textAlign = 'left';
  cx.fillText('▲ prey survival (s)', 8, H - 4);
  cx.fillStyle = '#ff444466';
  cx.fillText('  pred kills', 130, H - 4);
}

// ── Helpers ────────────────────────────────────────────────────────────────
function getBestAgent(agents) {
  return agents.filter(a => a.alive).reduce((b, a) => (!b || a.fit > b.fit) ? a : b, null)
      || agents.reduce((b, a) => (!b || a.fit > b.fit) ? a : b, null);
}
function getAvgSurv() {
  const dead  = prey.filter(p => p.deathFrame !== null);
  const alive = prey.filter(p => p.alive);
  const tf    = dead.reduce((s, p) => s + p.deathFrame, 0) + alive.length * frameCount;
  return (tf / prey.length / 60).toFixed(1);
}

// ── Main loop ──────────────────────────────────────────────────────────────
function loop() {
  requestAnimationFrame(loop);
  if (_paused) { draw(); drawChart(); return; }
  for (let i = 0; i < simSpeed; i++) simStep();
  draw();
  drawChart();

  const bestPrey = getBestAgent(prey);
  const bestPred = getBestAgent(preds);
  if (typeof NNDraw !== 'undefined') NNDraw.draw(bestPrey, bestPred);

  document.getElementById('s-gen').textContent   = generation;
  document.getElementById('s-prey').textContent  = prey.filter(p => p.alive).length;
  document.getElementById('s-pred').textContent  = preds.filter(p => p.alive).length;
  document.getElementById('s-eaten').textContent = eaten;

  const sSurv = document.getElementById('s-surv');
  if (sSurv) sSurv.textContent = getAvgSurv() + 's';
  const sBest = document.getElementById('s-bestkills');
  if (sBest) sBest.textContent = preds.length ? Math.max(...preds.map(p => p.kills)) : 0;
}

loop();

// Car Racing — NEAT AI  (Hard Circuit)
// Upgraded track: F1-style circuit with hairpins, chicane, sweepers
// 10 sensor rays, 11 inputs (10 rays + speed), tighter track width

const TWO_PI = Math.PI * 2;
const NUM_RAYS = 10;
const TRACK_WIDTH = 42;

// ── Track ────────────────────────────────────

// Handcrafted F1-style circuit waypoints (in a 800×580 canvas space)
// Layout: start straight → right hairpin → back straight →
//         left hairpin → chicane (S-curve) → bottom sweeper →
//         fast right-hander → back to start
const CIRCUIT_WAYPOINTS = [
  // Start/finish straight (going right)
  {x:110,y:290}, {x:175,y:290}, {x:240,y:290}, {x:305,y:290},
  {x:370,y:290}, {x:435,y:290}, {x:490,y:290},
  // Right hairpin entry
  {x:535,y:285}, {x:568,y:270}, {x:592,y:245}, {x:605,y:212},
  {x:608,y:178}, {x:598,y:148}, {x:576,y:127}, {x:547,y:116},
  {x:515,y:112},
  // Back straight (going left)
  {x:478,y:112}, {x:435,y:110}, {x:388,y:110}, {x:338,y:110},
  {x:288,y:110}, {x:238,y:112}, {x:195,y:116},
  // Left hairpin
  {x:162,y:128}, {x:138,y:150}, {x:124,y:178}, {x:122,y:208},
  {x:130,y:235}, {x:148,y:254}, {x:170,y:265},
  // Chicane entry (S-curve left)
  {x:188,y:272}, {x:200,y:292}, {x:205,y:316}, {x:198,y:340},
  {x:185,y:360},
  // Chicane apex right
  {x:175,y:378}, {x:172,y:398}, {x:178,y:418}, {x:193,y:434},
  {x:215,y:445}, {x:240,y:450},
  // Bottom sweeper (going right)
  {x:280,y:453}, {x:325,y:456}, {x:372,y:457}, {x:420,y:455},
  {x:464,y:450}, {x:503,y:440}, {x:534,y:424}, {x:556,y:403},
  {x:568,y:378}, {x:572,y:350},
  // Fast right-hander back to start
  {x:568,y:324}, {x:554,y:308}, {x:534,y:296}, {x:510,y:290},
  {x:485,y:289},
];

// Catmull-Rom spline interpolation to produce smooth track
function catmullRom(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return {
    x: 0.5 * ((2*p1.x) + (-p0.x+p2.x)*t + (2*p0.x-5*p1.x+4*p2.x-p3.x)*t2 + (-p0.x+3*p1.x-3*p2.x+p3.x)*t3),
    y: 0.5 * ((2*p1.y) + (-p0.y+p2.y)*t + (2*p0.y-5*p1.y+4*p2.y-p3.y)*t2 + (-p0.y+3*p1.y-3*p2.y+p3.y)*t3)
  };
}

function buildTrack() {
  const wps = CIRCUIT_WAYPOINTS;
  const n = wps.length;
  // How many interpolated points to generate per segment
  const stepsPerSeg = Math.ceil(130 / n) + 1; // ~130+ total points
  const pts = [];
  for (let i = 0; i < n; i++) {
    const p0 = wps[(i - 1 + n) % n];
    const p1 = wps[i];
    const p2 = wps[(i + 1) % n];
    const p3 = wps[(i + 2) % n];
    for (let s = 0; s < stepsPerSeg; s++) {
      const t = s / stepsPerSeg;
      pts.push(catmullRom(p0, p1, p2, p3, t));
    }
  }
  return pts;
}
const trackCenter = buildTrack();

function ptOnTrack(t) {
  const n = trackCenter.length;
  const i = ((Math.floor(t * n) % n) + n) % n;
  const f = (t * n) - Math.floor(t * n);
  const j = (i + 1) % n;
  return {
    x: trackCenter[i].x * (1 - f) + trackCenter[j].x * f,
    y: trackCenter[i].y * (1 - f) + trackCenter[j].y * f
  };
}

function trackTangent(t) {
  const n = trackCenter.length;
  const i = ((Math.floor(t * n) % n) + n) % n;
  const j = (i + 1) % n;
  const dx = trackCenter[j].x - trackCenter[i].x;
  const dy = trackCenter[j].y - trackCenter[i].y;
  const len = Math.sqrt(dx*dx+dy*dy)||1;
  return { tx: dx/len, ty: dy/len, nx: -dy/len, ny: dx/len };
}

// Find nearest track progress for a point
function nearestProgress(x, y, hint, range=0.12) {
  let best = hint, bestD = Infinity;
  for (let dt = -range; dt <= range; dt += 0.001) {
    const t = ((hint + dt) % 1 + 1) % 1;
    const p = ptOnTrack(t);
    const d = Math.hypot(p.x - x, p.y - y);
    if (d < bestD) { bestD = d; best = t; }
  }
  return { t: best, dist: bestD };
}

// Build wall polygons
function buildWalls() {
  const inner = [], outer = [];
  const n = trackCenter.length;
  for (let i = 0; i < n; i++) {
    const tang = trackTangent(i / n);
    inner.push({ x: trackCenter[i].x + tang.nx * TRACK_WIDTH, y: trackCenter[i].y + tang.ny * TRACK_WIDTH });
    outer.push({ x: trackCenter[i].x - tang.nx * TRACK_WIDTH, y: trackCenter[i].y - tang.ny * TRACK_WIDTH });
  }
  return { inner, outer };
}
const walls = buildWalls();

// Segment intersection
function segIsect(ax,ay,bx,by,cx,cy,dx,dy) {
  const d1x=bx-ax,d1y=by-ay,d2x=dx-cx,d2y=dy-cy;
  const cross=d1x*d2y-d1y*d2x;
  if(Math.abs(cross)<1e-9)return null;
  const t=((cx-ax)*d2y-(cy-ay)*d2x)/cross;
  const u=((cx-ax)*d1y-(cy-ay)*d1x)/cross;
  if(t>=0&&t<=1&&u>=0&&u<=1)return t;
  return null;
}

function raycast(ox, oy, angle) {
  const maxD = 200;
  const ex = ox + Math.cos(angle)*maxD, ey = oy + Math.sin(angle)*maxD;
  let minT = 1;
  for (const wpts of [walls.inner, walls.outer]) {
    for (let i = 0; i < wpts.length; i++) {
      const j = (i+1) % wpts.length;
      const t = segIsect(ox,oy,ex,ey, wpts[i].x,wpts[i].y, wpts[j].x,wpts[j].y);
      if (t !== null && t < minT) minT = t;
    }
  }
  return minT; // 0=wall right here, 1=no wall in range
}

// Point-in-polygon (winding) to check if car is ON the track
function pointInPoly(px, py, poly) {
  let winding = 0;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i+1)%poly.length];
    if (a.y <= py) {
      if (b.y > py && (b.x-a.x)*(py-a.y)-(b.y-a.y)*(px-a.x) > 0) winding++;
    } else {
      if (b.y <= py && (b.x-a.x)*(py-a.y)-(b.y-a.y)*(px-a.x) < 0) winding--;
    }
  }
  return winding !== 0;
}

function isOnTrack(x, y) {
  // Must be inside outer polygon and outside inner polygon
  return pointInPoly(x, y, walls.outer) && !pointInPoly(x, y, walls.inner);
}

// ── Car ───────────────────────────────────────
class Car {
  constructor(genome, idx) {
    this.genome = genome; this.idx = idx;
    this.color = SPECIES_COLORS[genome.speciesId % SPECIES_COLORS.length];
    this.reset();
  }
  reset() {
    const start = ptOnTrack(0);
    const tang = trackTangent(0);
    this.x = start.x; this.y = start.y;
    this.angle = Math.atan2(tang.ty, tang.tx);
    this.speed = 2.0; // start with slightly more speed on harder track
    this.alive = true; this.fitness = 0;
    this.progress = 0; this.laps = 0;
    this.frames = 0; this.framesSinceProgress = 0;
    this.lastProgress = 0; this.outputs = [0,0,0];
    this.lastInputs = new Array(NEAT_CFG.INPUTS).fill(0);
    this.lastActs = {h: new Array(NEAT_CFG.HIDDEN).fill(0), o: [0,0,0]};
  }
  getRays() {
    // 10 rays: wider spread for tight corners — front hemisphere + 2 side rays
    const offsets = [
      -TWO_PI*3/8,   // far left
      -TWO_PI/4,     // left
      -TWO_PI/6,     // front-left wide
      -TWO_PI/10,    // front-left narrow
      -TWO_PI/20,    // slight left
      TWO_PI/20,     // slight right
      TWO_PI/10,     // front-right narrow
      TWO_PI/6,      // front-right wide
      TWO_PI/4,      // right
      TWO_PI*3/8     // far right
    ];
    return offsets.map(o => raycast(this.x, this.y, this.angle + o));
  }
  step() {
    if (!this.alive) return;
    const rays = this.getRays();
    // 10 rays + normalized speed = 11 inputs (matches NEAT_CFG.INPUTS:11)
    const inp = [...rays, this.speed / 7];
    const acts = this.genome.forward(inp);
    this.lastInputs = inp;
    this.lastActs = acts;
    const out = acts.o;
    this.outputs = out;
    const steer = (out[1] - out[0]) * 0.08; // net steering
    const throttle = out[2];

    this.angle += steer;
    // Always move forward at least a little — no reversing
    this.speed += (throttle - 0.4) * 0.35;
    this.speed = Math.max(0.8, Math.min(7, this.speed));

    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.frames++;

    // Off-track check
    if (!isOnTrack(this.x, this.y)) {
      this.alive = false; return;
    }

    // Progress tracking
    const { t: newT, dist } = nearestProgress(this.x, this.y, this.progress);
    let delta = newT - this.progress;
    if (delta < -0.5) delta += 1; // wrap
    if (delta > 0.5) delta -= 1;  // going backwards

    if (delta > 0.001) {
      this.progress = newT;
      this.framesSinceProgress = 0;
      if (this.lastProgress > 0.9 && newT < 0.1) { this.laps++; }
      this.lastProgress = newT;
    } else {
      this.framesSinceProgress++;
      // Harder penalty for going backwards
      if (delta < -0.001) this.fitness -= 10;
    }

    // Kill faster when stuck (120 frames vs old 180)
    if (this.framesSinceProgress > 120) { this.alive = false; return; }

    // Speed bonus on straights (high speed = good)
    const speedBonus = this.speed > 4.5 ? (this.speed - 4.5) * 0.02 : 0;
    this.fitness = this.laps * 1000 + this.progress * 500 + this.frames * 0.01 + speedBonus;
  }
}

// ── Rendering ────────────────────────────────
const gc = document.getElementById('game-canvas');
const gx = gc.getContext('2d');
const radar = document.getElementById('radar-canvas');
const rx2 = radar.getContext('2d');
const rewardC = document.getElementById('reward-canvas');
const rc2 = rewardC.getContext('2d');

function resize() {
  gc.width = gc.parentElement.clientWidth;
  gc.height = gc.parentElement.clientHeight;
  const sideH = radar.parentElement.clientHeight;
  radar.width = radar.parentElement.clientWidth;
  radar.height = Math.floor(sideH / 3);
  rewardC.width = rewardC.parentElement.clientWidth;
  rewardC.height = Math.floor(sideH / 3);
  if(typeof NNDraw !== 'undefined') NNDraw.resize();
}
window.addEventListener('resize', resize); resize();

function drawTrack(W, H, scale, ox, oy) {
  gx.fillStyle = '#08080f'; gx.fillRect(0, 0, W, H);
  const toS = p => ({ x: ox + p.x * scale, y: oy + p.y * scale });

  // Road fill (outer)
  gx.beginPath();
  walls.outer.forEach((p, i) => { const s=toS(p); i===0?gx.moveTo(s.x,s.y):gx.lineTo(s.x,s.y); });
  gx.closePath(); gx.fillStyle = '#111122'; gx.fill();
  // Inner cutout
  gx.beginPath();
  walls.inner.forEach((p, i) => { const s=toS(p); i===0?gx.moveTo(s.x,s.y):gx.lineTo(s.x,s.y); });
  gx.closePath(); gx.fillStyle = '#08080f'; gx.fill();
  // Wall edges
  for (const [wpts, col] of [[walls.inner,'#1a3a1a'],[walls.outer,'#1a3a1a']]) {
    gx.strokeStyle = col; gx.lineWidth = 1.5;
    gx.beginPath();
    wpts.forEach((p,i)=>{ const s=toS(p); i===0?gx.moveTo(s.x,s.y):gx.lineTo(s.x,s.y); });
    gx.closePath(); gx.stroke();
  }
  // Center dashes
  gx.setLineDash([6,10]); gx.strokeStyle='#0f2010'; gx.lineWidth=0.8;
  gx.beginPath();
  trackCenter.forEach((p,i)=>{ const s=toS(p); i===0?gx.moveTo(s.x,s.y):gx.lineTo(s.x,s.y); });
  gx.closePath(); gx.stroke(); gx.setLineDash([]);

  // Start/finish line indicator
  const sf = ptOnTrack(0);
  const sfT = trackTangent(0);
  const sfS = toS(sf);
  gx.strokeStyle = '#ffffff44'; gx.lineWidth = 2;
  gx.beginPath();
  gx.moveTo(sfS.x + sfT.nx * TRACK_WIDTH * scale, sfS.y + sfT.ny * TRACK_WIDTH * scale);
  gx.lineTo(sfS.x - sfT.nx * TRACK_WIDTH * scale, sfS.y - sfT.ny * TRACK_WIDTH * scale);
  gx.stroke();
}

function drawCars(cars, scale, ox, oy) {
  cars.forEach(c => {
    if (!c.alive) return;
    const sx = ox + c.x*scale, sy = oy + c.y*scale;
    gx.save(); gx.translate(sx,sy); gx.rotate(c.angle);
    gx.globalAlpha = 0.3; gx.fillStyle = c.color;
    gx.fillRect(-8*scale,-4*scale,16*scale,8*scale);
    gx.globalAlpha = 1; gx.restore();
  });
}

function drawBestCar(car, scale, ox, oy) {
  if (!car || !car.alive) return;
  const sx = ox + car.x*scale, sy = oy + car.y*scale;
  // rays — 10 rays
  const offsets = [
    -TWO_PI*3/8, -TWO_PI/4, -TWO_PI/6, -TWO_PI/10, -TWO_PI/20,
     TWO_PI/20,   TWO_PI/10,  TWO_PI/6,  TWO_PI/4,   TWO_PI*3/8
  ];
  car.getRays().forEach((t,i) => {
    const a = car.angle + offsets[i];
    gx.strokeStyle = `rgba(255,204,0,${0.12 + (1-t)*0.25})`; gx.lineWidth = 0.8;
    gx.beginPath(); gx.moveTo(sx,sy);
    gx.lineTo(sx+Math.cos(a)*200*t*scale, sy+Math.sin(a)*200*t*scale);
    gx.stroke();
  });
  gx.save(); gx.translate(sx,sy); gx.rotate(car.angle);
  const g = gx.createRadialGradient(0,0,1,0,0,16*scale);
  g.addColorStop(0,car.color+'55'); g.addColorStop(1,'transparent');
  gx.fillStyle=g; gx.beginPath(); gx.arc(0,0,16*scale,0,TWO_PI); gx.fill();
  gx.fillStyle=car.color; gx.fillRect(-10*scale,-5*scale,20*scale,10*scale);
  gx.fillStyle='#000'; gx.fillRect(4*scale,-3*scale,4*scale,3*scale);
  gx.fillRect(4*scale,0,4*scale,3*scale);
  gx.restore();
}

function drawRadar(car) {
  const W=radar.width, H=radar.height;
  rx2.fillStyle='#06060e'; rx2.fillRect(0,0,W,H);
  if(!car) return;
  const labels=['TurnL','TurnR','Gas'];
  car.outputs.forEach((v,i)=>{
    const bh=(H-36)*(v);
    rx2.fillStyle=i===0?'#ffcc0044':i===1?'#4488ff44':'#00ff8844';
    rx2.fillRect(12+i*(W-24)/3, H-18-bh, (W-24)/3-4, bh);
    rx2.strokeStyle=i===0?'#ffcc00':i===1?'#4488ff':'#00ff88'; rx2.lineWidth=0.8;
    rx2.strokeRect(12+i*(W-24)/3, H-18-bh, (W-24)/3-4, bh);
    rx2.fillStyle='#334433'; rx2.font='8px Courier New'; rx2.textAlign='center';
    rx2.fillText(labels[i], 12+i*(W-24)/3+(W-24)/6-2, H-6);
  });
  rx2.fillStyle='#1a3a1a'; rx2.font='9px Courier New'; rx2.textAlign='left';
  rx2.fillText('OUTPUTS', 10, 12);
}

function drawFitnessChart(hist) {
  const W=rewardC.width, H=rewardC.height;
  rc2.fillStyle='#06060e'; rc2.fillRect(0,0,W,H);
  rc2.fillStyle='#1a3a1a'; rc2.font='9px Courier New'; rc2.textAlign='left';
  rc2.fillText('FITNESS / GEN', 10, 12);
  if(hist.length<2) return;
  const pts=hist.slice(-50); const maxV=Math.max(...pts)||1;
  rc2.strokeStyle='#ffcc0077'; rc2.lineWidth=1.5;
  rc2.beginPath();
  pts.forEach((v,i)=>{ const x=10+(i/(pts.length-1))*(W-20); const y=H-10-(v/maxV)*(H-24); i===0?rc2.moveTo(x,y):rc2.lineTo(x,y); });
  rc2.stroke();
}

// ── Main loop ────────────────────────────────
const neat = new NEAT();
let cars = neat.genomes.map((g,i)=>new Car(g,i));
let simSpeed=2, bestHist=[], bestLap=0;

document.getElementById('speed').addEventListener('input', e=>{
  simSpeed=parseInt(e.target.value);
  document.getElementById('speed-val').textContent=simSpeed+'x';
});

function getBest() {
  const alive=cars.filter(c=>c.alive);
  const pool = alive.length ? alive : cars;
  return pool.reduce((a,b)=>b.fitness>a.fitness?b:a);
}

function loop() {
  if(_paused){requestAnimationFrame(loop);return;}
  requestAnimationFrame(loop);
  for (let k=0;k<simSpeed;k++) {
    cars.forEach(c=>c.step());
    if (cars.every(c=>!c.alive)) {
      const best=getBest();
      bestHist.push(best.fitness);
      if(best.laps>bestLap) bestLap=best.laps;
      neat.evolve(cars);
      cars=neat.genomes.map((g,i)=>new Car(g,i));
    }
  }
  const W=gc.width, H=gc.height;
  const scale=Math.min(W/800, H/600);
  const ox=(W-800*scale)/2, oy=(H-600*scale)/2;
  drawTrack(W,H,scale,ox,oy);
  drawCars(cars,scale,ox,oy);
  const best=getBest();
  drawBestCar(best,scale,ox,oy);
  drawRadar(best);
  drawFitnessChart(bestHist);
  if(typeof NNDraw !== 'undefined') NNDraw.draw(best);
  document.getElementById('s-gen').textContent=neat.generation;
  document.getElementById('s-alive').textContent=cars.filter(c=>c.alive).length;
  document.getElementById('s-lap').textContent=bestLap;
  document.getElementById('s-fit').textContent=best?Math.floor(best.fitness):0;
}
loop();

// ── Lunar Lander — NEAT AI ────────────────────────────────────────────────────
const GW = 600, GH = 500, TWO_PI = Math.PI * 2;
const GRAVITY     = 0.08;
const THRUST      = 0.18;
const PAD_X = GW / 2, PAD_W = 60, PAD_Y = GH - 50;

const gc = document.getElementById('game-canvas');
const gx = gc.getContext('2d');

// ── Gymnasium LunarLander visual identity ──────────────────────────────────────
const HULL_COLOR = '#8067e6';   // the iconic lavender/purple lander hull
const HULL_DARK  = '#5b46a6';   // outline / shaded panels
const LEG_COLOR  = '#cfc6f5';   // pale legs
const MOON_FILL  = '#13131f';   // terrain body
const MOON_EDGE  = '#5a5a78';   // terrain rim (lit moon surface)
const FLAG_COLOR = '#ffd23f';   // landing-pad flags

// Lander hull outline (box2d LANDER_POLY, y flipped to canvas-down, ~0.62 scale)
const HULL_POLY = [
  [-8.4, -10.5], [-10.2, 0], [-10.2, 6], [10.2, 6], [10.2, 0], [8.4, -10.5],
];

let simSpeed = 2;
document.getElementById('speed').addEventListener('input', e => {
  simSpeed = parseInt(e.target.value);
  document.getElementById('speed-val').textContent = simSpeed + 'x';
});

// ── Terrain ───────────────────────────────────────────────────────────────────
function buildTerrain() {
  const pts = [{ x: 0, y: GH - 30 }];
  for (let x = 30; x < GW - 30; x += 30) {
    const y = (x > PAD_X - PAD_W - 10 && x < PAD_X + PAD_W + 10)
      ? PAD_Y
      : GH - 40 - Math.sin(x * 0.04) * 30 - Math.random() * 20;
    pts.push({ x, y });
  }
  pts.push({ x: GW, y: GH - 30 });
  return pts;
}
const terrain = buildTerrain();
terrain.forEach(p => { if (p.x > PAD_X - PAD_W && p.x < PAD_X + PAD_W) p.y = PAD_Y; });

// Ground height (y) at a given x — linear interpolation along the terrain.
function terrainY(x) {
  if (x <= terrain[0].x)                   return terrain[0].y;
  if (x >= terrain[terrain.length - 1].x)  return terrain[terrain.length - 1].y;
  for (let i = 0; i < terrain.length - 1; i++) {
    const a = terrain[i], b = terrain[i + 1];
    if (x >= a.x && x <= b.x)
      return a.y + (b.y - a.y) * ((x - a.x) / (b.x - a.x));
  }
  return GH;
}

// ── Shared spawn conditions (the AI-divergence fix) ────────────────────────────
// Every lander in a generation starts from the SAME state, so a genome's score
// reflects skill, not luck. Conditions rotate across generations so the evolved
// policy has to generalise instead of overfitting one drop point.
function makeSpawnBank(n) {
  const bank = [];
  for (let i = 0; i < n; i++) {
    bank.push({
      x:     140 + (GW - 280) * ((i + 0.5) / n),
      y:     70 + (i % 3) * 18,
      vx:    ((i % 5) - 2) * 0.35,
      vy:    0.2 + (i % 2) * 0.25,
      angle: (((i * 7) % 5) - 2) * 0.06,
    });
  }
  return bank;
}
const SPAWN_BANK = makeSpawnBank(8);
let curSpawn = SPAWN_BANK[0];

// ── Lander ────────────────────────────────────────────────────────────────────
class Lander {
  constructor(genome, idx) {
    this.genome = genome;
    this.idx    = idx;
    this.color  = this._speciesColor();
    this.reset();
  }

  _speciesColor() {
    if (typeof neat !== 'undefined') {
      const s = neat.species.find(s => s.id === this.genome.speciesId);
      if (s) return s.color;
    }
    return SPECIES_COLORS[this.genome.speciesId % SPECIES_COLORS.length];
  }

  reset() {
    // All landers share the generation's spawn state for a fair comparison.
    this.x     = curSpawn.x;
    this.y     = curSpawn.y;
    this.vx    = curSpawn.vx;
    this.vy    = curSpawn.vy;
    this.angle = curSpawn.angle;
    this.va    = 0;

    this.alive       = true;
    this.landed      = false;
    this.crashed     = false;
    this.score       = 0;
    this.frames      = 0;
    this.thrustCount = 0;
    this.memory      = 0;

    this.thrusting = false;
    this.sideL     = false;
    this.sideR     = false;
    this.particles = [];

    this.lastActs = {
      h1: Array(LCFG.H1).fill(0),
      h2: Array(LCFG.H2).fill(0),
      o:  Array(LCFG.OUT).fill(0),
    };
  }

  getInputs() {
    return [
      this.x / GW,
      this.y / GH,
      (this.x - PAD_X) / GW,
      this.vy / 5,
      this.vx / 5,
      this.angle / Math.PI,
      this.va / 0.1,
      (PAD_Y - this.y) / GH,
    ];
  }

  // Potential: how close to a good landing state? [0..1]
  _phi() {
    const h = Math.abs(this.x - PAD_X) / GW;
    const v = Math.max(0, PAD_Y - this.y) / GH;
    return Math.max(0, 1 - Math.sqrt(h * h + v * v) * 1.2);
  }

  // Transform a point from lander-local space to world space.
  _pt(lx, ly) {
    const c = Math.cos(this.angle), s = Math.sin(this.angle);
    return { x: this.x + lx * c - ly * s, y: this.y + lx * s + ly * c };
  }

  step() {
    if (!this.alive) return;

    // ── Forward pass ──────────────────────────────────────────────────────────
    const inp = this.getInputs();
    const out = this.genome.forward(inp, this.memory);
    this.memory   = out.memOut;
    this.lastActs = { h1: out.h1, h2: out.h2, o: Array.from(out.o) };

    this.thrusting = out.o[0] > 0.5;
    this.sideL     = out.o[1] > 0.5;
    this.sideR     = out.o[2] > 0.5;

    // ── Physics ───────────────────────────────────────────────────────────────
    if (this.thrusting) {
      this.vx += Math.sin(this.angle) * THRUST * (-1);
      this.vy -= Math.cos(this.angle) * THRUST;
      this.thrustCount++;
      this.particles.push({
        x: this.x + Math.sin(this.angle) * 14,
        y: this.y + Math.cos(this.angle) * 14,
        vx: Math.sin(this.angle) * 2 + (rnd() - 0.5),
        vy: Math.cos(this.angle) * 2 + (rnd() - 0.5),
        life: 12,
      });
    }
    if (this.sideL) this.va -= 0.005;
    if (this.sideR) this.va += 0.005;

    this.va    *= 0.95;
    this.angle += this.va;
    this.vx    *= 0.998;
    this.vy    += GRAVITY;
    this.x     += this.vx;
    this.y     += this.vy;

    this.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.life--; p.vy += 0.1; });
    this.particles = this.particles.filter(p => p.life > 0);
    this.frames++;

    // ── Reward: potential-based shaping toward the pad ────────────────────────
    const curPhi   = this._phi();
    this.score    += (0.999 * curPhi - this._prevPhi) * 80;
    this._prevPhi  = curPhi;

    // ── Hard frame cap: prevents infinite hover stalling generation ───────────
    if (this.frames >= 1800) { this.alive = false; return; }

    // ── Out of bounds ─────────────────────────────────────────────────────────
    if (this.x < 5 || this.x > GW - 5 || this.y < 5) { this.alive = false; return; }

    // ── Contact mechanics (Gymnasium-style: legs touch, hull must not) ─────────
    const footL = this._pt(-15, 13), footR = this._pt(15, 13);  // leg tips
    const hullL = this._pt(-10, 6),  hullR = this._pt(10, 6);   // hull underside
    const contactL = footL.y >= terrainY(footL.x);
    const contactR = footR.y >= terrainY(footR.x);
    const hullHit  = hullL.y >= terrainY(hullL.x) || hullR.y >= terrainY(hullR.x);

    // Hull slammed into the surface → crash, no landing credit.
    if (hullHit) { this.crashed = true; this.alive = false; return; }

    if (contactL || contactR) {
      const speed   = Math.hypot(this.vx, this.vy);
      const onPad   = this.x > PAD_X - PAD_W && this.x < PAD_X + PAD_W;
      const gentle  = speed < 1.9 && Math.abs(this.va) < 0.09;
      const upright = Math.abs(this.angle) < 0.25;

      if (onPad && gentle && upright) {
        // SUCCESSFUL LANDING — a leg is down on the pad, gentle and level.
        // Score the touchdown state BEFORE snapping to rest.
        const padOffset  = Math.abs(this.x - PAD_X) / PAD_W;     // 0=center 1=edge
        const padBonus   = Math.floor(300 * Math.exp(-4 * padOffset * padOffset));
        const speedBonus = Math.floor((1 - Math.min(1, speed / 1.9)) * 200);
        const angleBonus = Math.floor((1 - Math.abs(this.angle) / 0.25) * 150);
        const fuelBonus  = Math.floor(Math.max(0, 1 - this.thrustCount / 600) * 100);
        this.score = 250 + padBonus + speedBonus + angleBonus + fuelBonus;

        // Snap to rest so it visibly sits on the pad between the flags.
        this.angle = 0; this.va = 0; this.vx = 0; this.vy = 0;
        this.y     = PAD_Y - 13;
        this.landed = true;
      } else {
        // Touched down badly: off-pad, too fast, or tilted → tip over / crash.
        this.crashed = true;
      }
      this.alive = false;
    }
  }
}

// need to init _prevPhi after position is set
const _origReset = Lander.prototype.reset;
Lander.prototype.reset = function() {
  _origReset.call(this);
  this._prevPhi = this._phi();
};

// ── Simulation globals ────────────────────────────────────────────────────────
const neat   = new LunarNEAT();
let landers  = neat.genomes.map((g, i) => new Lander(g, i));
let landed   = 0;

function getBestLander() {
  const alive = landers.filter(l => l.alive);
  if (alive.length) return alive.reduce((a, b) => b.score > a.score ? b : a);
  return landers.reduce((a, b) => b.score > a.score ? b : a);
}

// ── Canvas resize ─────────────────────────────────────────────────────────────
function resize() {
  const p = gc.parentElement;
  const s = Math.min(p.clientWidth / GW, p.clientHeight / GH);
  gc.width  = GW * s;
  gc.height = GH * s;
  if (typeof NNDraw !== 'undefined') NNDraw.resize();
}
window.addEventListener('resize', resize);
resize();

// ── Simulation step ───────────────────────────────────────────────────────────
function simStep() {
  landers.forEach(l => l.step());
  if (landers.every(l => !l.alive)) {
    landers.forEach(l => { if (l.landed) landed++; });
    neat.evolve(landers);
    curSpawn = SPAWN_BANK[neat.generation % SPAWN_BANK.length];   // rotate condition
    landers  = neat.genomes.map((g, i) => new Lander(g, i));
  }
}

// ── Rendering helpers ──────────────────────────────────────────────────────────
// Draw one lander in the Gymnasium style. `lead` brightens the current leader.
function drawLander(l, lead) {
  gx.save();
  gx.translate(l.x, l.y);
  gx.rotate(l.angle);
  gx.globalAlpha = lead ? 1 : 0.5;

  // Soft glow for the leader so the eye can track it through the swarm
  if (lead) {
    const g = gx.createRadialGradient(0, 0, 2, 0, 0, 26);
    g.addColorStop(0, HULL_COLOR + '33');
    g.addColorStop(1, 'transparent');
    gx.fillStyle = g;
    gx.beginPath(); gx.arc(0, 0, 26, 0, TWO_PI); gx.fill();
  }

  // Legs (drawn first, behind the hull)
  gx.strokeStyle = LEG_COLOR;
  gx.lineWidth   = 2;
  gx.lineCap     = 'round';
  gx.beginPath();
  gx.moveTo(-9, 4);  gx.lineTo(-15, 13); gx.lineTo(-19, 13);   // left leg + foot
  gx.moveTo( 9, 4);  gx.lineTo( 15, 13); gx.lineTo( 19, 13);   // right leg + foot
  gx.stroke();
  gx.lineCap = 'butt';

  // Hull
  gx.beginPath();
  HULL_POLY.forEach((p, i) => i === 0 ? gx.moveTo(p[0], p[1]) : gx.lineTo(p[0], p[1]));
  gx.closePath();
  gx.fillStyle   = HULL_COLOR;
  gx.fill();
  gx.strokeStyle = HULL_DARK;
  gx.lineWidth   = 1.5;
  gx.stroke();

  // Cockpit window
  gx.fillStyle = lead ? '#fff' : '#dfe8ff';
  gx.beginPath();
  gx.arc(0, -2, 2.6, 0, TWO_PI);
  gx.fill();

  // Main engine flame
  if (l.thrusting) {
    const f = 10 + rnd() * 10;
    const grd = gx.createLinearGradient(0, 6, 0, 6 + f);
    grd.addColorStop(0, 'rgba(255,220,120,0.95)');
    grd.addColorStop(1, 'rgba(255,90,20,0)');
    gx.fillStyle = grd;
    gx.beginPath();
    gx.moveTo(-5, 6); gx.lineTo(5, 6); gx.lineTo(0, 6 + f);
    gx.closePath(); gx.fill();
  }
  // Side thruster jets
  if (l.sideL || l.sideR) {
    gx.fillStyle = 'rgba(255,200,120,0.9)';
    const dir = l.sideR ? -1 : 1;
    const sx  = dir * 10;
    gx.beginPath();
    gx.moveTo(sx, -4); gx.lineTo(sx, 2);
    gx.lineTo(sx + dir * (6 + rnd() * 5), -1);
    gx.closePath(); gx.fill();
  }

  gx.restore();
  gx.globalAlpha = 1;
}

// Draw a landing-pad flag pole at world x.
function drawFlag(x, flip) {
  gx.strokeStyle = '#cfd4e0';
  gx.lineWidth   = 1.5;
  gx.beginPath();
  gx.moveTo(x, PAD_Y); gx.lineTo(x, PAD_Y - 26);
  gx.stroke();
  gx.fillStyle = FLAG_COLOR;
  gx.beginPath();
  gx.moveTo(x, PAD_Y - 26);
  gx.lineTo(x + (flip ? -12 : 12), PAD_Y - 21);
  gx.lineTo(x, PAD_Y - 16);
  gx.closePath();
  gx.fill();
}

// ── Draw ──────────────────────────────────────────────────────────────────────
function draw() {
  const S = gc.width / GW;
  gx.fillStyle = '#06060e';
  gx.fillRect(0, 0, gc.width, gc.height);

  // Starfield
  for (let i = 0; i < 80; i++) {
    gx.fillStyle = `rgba(255,255,255,${0.05 + 0.05 * Math.sin(i * 17)})`;
    gx.fillRect((i * 113) % gc.width, (i * 71) % gc.height, 1, 1);
  }

  gx.save();
  gx.scale(S, S);

  // Moon surface
  gx.fillStyle = MOON_FILL;
  gx.beginPath();
  gx.moveTo(0, GH);
  terrain.forEach(p => gx.lineTo(p.x, p.y));
  gx.lineTo(GW, GH);
  gx.closePath();
  gx.fill();

  gx.strokeStyle = MOON_EDGE;
  gx.lineWidth   = 1.5;
  gx.beginPath();
  terrain.forEach((p, i) => i === 0 ? gx.moveTo(p.x, p.y) : gx.lineTo(p.x, p.y));
  gx.stroke();

  // Landing pad surface + flanking flags (the Gymnasium signature)
  gx.strokeStyle = FLAG_COLOR;
  gx.lineWidth   = 3;
  gx.beginPath();
  gx.moveTo(PAD_X - PAD_W, PAD_Y);
  gx.lineTo(PAD_X + PAD_W, PAD_Y);
  gx.stroke();
  drawFlag(PAD_X - PAD_W, false);
  drawFlag(PAD_X + PAD_W, true);

  // Landers
  const leader = getBestLander();
  landers.forEach(l => {
    l.particles.forEach(p => {
      gx.fillStyle = `rgba(255,${(140 + (p.life / 12) * 80) | 0},40,${p.life / 12 * 0.7})`;
      gx.beginPath();
      gx.arc(p.x, p.y, 1.6, 0, TWO_PI);
      gx.fill();
    });

    if (!l.alive && !l.landed) return;   // crashed/dead vanish; landed stay at rest
    drawLander(l, l === leader);
  });

  gx.restore();
}

// ── Main loop ─────────────────────────────────────────────────────────────────
function loop() {
  requestAnimationFrame(loop);

  if (_paused) {
    draw();
    if (typeof NNDraw !== 'undefined') NNDraw.draw(getBestLander());
    return;
  }

  for (let i = 0; i < simSpeed; i++) simStep();
  draw();
  if (typeof NNDraw !== 'undefined') NNDraw.draw(getBestLander());

  const alive = landers.filter(l => l.alive).length;
  document.getElementById('s-gen').textContent   = neat.generation;
  document.getElementById('s-alive').textContent = alive;
  document.getElementById('s-best').textContent  = Math.floor(neat.bestEver);
  document.getElementById('s-land').textContent  = landed;
  if (document.getElementById('s-spec'))
    document.getElementById('s-spec').textContent = neat.species.length;
  if (document.getElementById('s-mut'))
    document.getElementById('s-mut').textContent  = neat.mutStrength.toFixed(2);
}

loop();

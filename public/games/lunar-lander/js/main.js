// ── Lunar Lander — NEAT AI ────────────────────────────────────────────────────
const GW = 600, GH = 500, TWO_PI = Math.PI * 2;
const GRAVITY     = 0.08;
const THRUST      = 0.18;
const PAD_X = GW / 2, PAD_W = 60, PAD_Y = GH - 50;

const gc = document.getElementById('game-canvas');
const gx = gc.getContext('2d');

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

function collidesGround(x, y) {
  for (let i = 0; i < terrain.length - 1; i++) {
    const a = terrain[i], b = terrain[i + 1];
    if (x >= a.x && x <= b.x) {
      const ty = a.y + (b.y - a.y) * ((x - a.x) / (b.x - a.x));
      if (y >= ty) return { hit: true, onPad: x > PAD_X - PAD_W && x < PAD_X + PAD_W };
    }
  }
  return { hit: false };
}

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
    this.x     = 100 + rnd() * (GW - 200);
    this.y     = 60  + rnd() * 80;
    this.vx    = rndRange(-1, 1);
    this.vy    = rndRange(0, 1);
    this.angle = rndRange(-0.3, 0.3);
    this.va    = 0;

    this.alive       = true;
    this.landed      = false;
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

    // ── Reward: potential-based shaping + terminal landing bonus ──────────────
    // Potential shaping gives gradient toward pad (max ~80 pts total for
    // non-landers) without creating a hover exploit.
    // Landing always scores 250-1000, well above any shaped non-landing score.
    const curPhi   = this._phi();
    this.score    += (0.999 * curPhi - this._prevPhi) * 80;
    this._prevPhi  = curPhi;

    // ── Hard frame cap: prevents infinite hover stalling generation ───────────
    if (this.frames >= 1800) {
      this.alive = false;
      return;
    }

    // ── Terminal conditions ───────────────────────────────────────────────────
    const col = collidesGround(this.x, this.y);
    const oob = this.x < 5 || this.x > GW - 5 || this.y < 5;

    if (col.hit || oob) {
      if (col.onPad &&
          Math.abs(this.angle) < 0.28 &&
          Math.abs(this.vx)    < 1.4  &&
          Math.abs(this.vy)    < 2.0) {
        const speedBonus = Math.floor((1 - Math.min(1, (Math.abs(this.vx) + Math.abs(this.vy)) / 3.4)) * 300);
        const angleBonus = Math.floor((1 - Math.abs(this.angle) / 0.28) * 200);
        const fuelBonus  = Math.floor(Math.max(0, 1 - this.thrustCount / 600) * 150);
        const timeBonus  = Math.floor(Math.max(0, 1 - this.frames / 1800) * 100);
        this.score   = 250 + speedBonus + angleBonus + fuelBonus + timeBonus;
        this.landed  = true;
      }
      // No partial credit — non-landings keep shaping score only (≤80 pts)
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
    landers = neat.genomes.map((g, i) => new Lander(g, i));
  }
}

// ── Draw ──────────────────────────────────────────────────────────────────────
function draw() {
  const S = gc.width / GW;
  gx.fillStyle = '#06060e';
  gx.fillRect(0, 0, gc.width, gc.height);

  for (let i = 0; i < 80; i++) {
    gx.fillStyle = `rgba(255,255,255,${0.05 + 0.05 * Math.sin(i * 17)})`;
    gx.fillRect((i * 113) % gc.width, (i * 71) % gc.height, 1, 1);
  }

  gx.save();
  gx.scale(S, S);

  gx.fillStyle = '#0d0d1a';
  gx.beginPath();
  gx.moveTo(0, GH);
  terrain.forEach(p => gx.lineTo(p.x, p.y));
  gx.lineTo(GW, GH);
  gx.closePath();
  gx.fill();

  gx.strokeStyle = '#1a1a3a';
  gx.lineWidth   = 1.5;
  gx.beginPath();
  terrain.forEach((p, i) => i === 0 ? gx.moveTo(p.x, p.y) : gx.lineTo(p.x, p.y));
  gx.stroke();

  gx.strokeStyle = '#44ccff66';
  gx.lineWidth   = 2;
  gx.beginPath();
  gx.moveTo(PAD_X - PAD_W, PAD_Y);
  gx.lineTo(PAD_X + PAD_W, PAD_Y);
  gx.stroke();

  gx.strokeStyle = '#44ccff33';
  gx.setLineDash([4, 4]);
  gx.beginPath();
  gx.moveTo(PAD_X, PAD_Y);
  gx.lineTo(PAD_X, PAD_Y - 60);
  gx.stroke();
  gx.setLineDash([]);

  landers.forEach(l => {
    l.particles.forEach(p => {
      gx.fillStyle = `rgba(255,180,60,${p.life / 12 * 0.6})`;
      gx.beginPath();
      gx.arc(p.x, p.y, 2, 0, TWO_PI);
      gx.fill();
    });

    if (!l.alive) return;

    gx.save();
    gx.translate(l.x, l.y);
    gx.rotate(l.angle);

    const g = gx.createRadialGradient(0, 0, 2, 0, 0, 18);
    g.addColorStop(0, l.color + '22');
    g.addColorStop(1, 'transparent');
    gx.fillStyle = g;
    gx.beginPath();
    gx.arc(0, 0, 18, 0, TWO_PI);
    gx.fill();

    gx.fillStyle   = l.color + '88';
    gx.fillRect(-10, -8, 20, 16);
    gx.strokeStyle = l.color;
    gx.lineWidth   = 1;
    gx.strokeRect(-10, -8, 20, 16);

    gx.strokeStyle = l.color + '88';
    gx.beginPath();
    gx.moveTo(-10, 8); gx.lineTo(-14, 14);
    gx.moveTo( 10, 8); gx.lineTo( 14, 14);
    gx.stroke();

    if (l.thrusting) {
      gx.fillStyle = 'rgba(255,140,0,0.8)';
      gx.beginPath();
      gx.moveTo(-5, 8);
      gx.lineTo(5, 8);
      gx.lineTo(0, 8 + 10 + rnd() * 8);
      gx.closePath();
      gx.fill();
    }

    gx.restore();
  });

  const hm_y = GH - 48, hm_h = 8;
  for (let x = 0; x < GW; x += 4) {
    const v = Math.max(0, 1 - Math.abs(x - PAD_X) / (GW * 0.4));
    gx.fillStyle = `rgba(68,204,255,${v * 0.25})`;
    gx.fillRect(x, hm_y, 4, hm_h);
  }

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

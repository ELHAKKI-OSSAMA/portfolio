// Maze Solver — GA + Pheromone Trails (FIXED)
// Fixes:
// - After one maze solve, new maze is generated and evolution continues
// - Speed slider now correctly gates simulation steps per frame
// - Walkers properly reset each generation

const COLS=21, ROWS=21, POP=200, EVAP=0.97, DEPOSIT=0.3;
const TWO_PI = Math.PI*2;
function rnd(){return Math.random();}
function rndRange(a,b){return a+(b-a)*rnd();}

// ── Maze generation (recursive backtracker) ──
function buildMaze() {
  const grid = Array.from({length:ROWS}, () =>
    Array.from({length:COLS}, () => ({walls:{N:true,S:true,E:true,W:true}, visited:false}))
  );
  function carve(r,c) {
    grid[r][c].visited = true;
    const dirs = [['N',-1,0,'S'],['S',1,0,'N'],['E',0,1,'W'],['W',0,-1,'E']].sort(()=>rnd()-0.5);
    for (const [d,dr,dc,op] of dirs) {
      const nr=r+dr, nc=c+dc;
      if (nr>=0&&nr<ROWS&&nc>=0&&nc<COLS&&!grid[nr][nc].visited) {
        grid[r][c].walls[d]=false; grid[nr][nc].walls[op]=false; carve(nr,nc);
      }
    }
  }
  carve(0,0); return grid;
}

let maze = buildMaze();
let pheromones = Array.from({length:ROWS}, ()=>Array(COLS).fill(0));
pheromones[0][0] = 1;

const DIR_LIST = [['N',-1,0],['S',1,0],['E',0,1],['W',0,-1]];
const MAX_STEPS = COLS * ROWS * 2; // generous step budget

// ── Genome: per-step directional bias ──
class Genome {
  constructor() {
    // Compact: just random per-direction weights (shared across steps, not per-step)
    // This allows proper evolution — 16 weights total
    this.w = Float32Array.from({length:16}, ()=>rndRange(-1,1));
    this.fitness = 0;
  }
  // Get direction probabilities at given cell
  getDir(r, c, walls, visitedSet) {
    const scores = DIR_LIST.map(([d,dr,dc], i) => {
      if (walls[d]) return -Infinity;
      const nr=r+dr, nc=c+dc;
      if (nr<0||nr>=ROWS||nc<0||nc>=COLS) return -Infinity;
      // Inputs: relative position to goal, pheromone, visited penalty
      const goalDr = (ROWS-1-nr)/(ROWS-1);
      const goalDc = (COLS-1-nc)/(COLS-1);
      const ph = Math.min(1, pheromones[nr][nc]);
      const vis = visitedSet.has(`${nr},${nc}`) ? -0.5 : 0;
      return this.w[i*4+0]*goalDr + this.w[i*4+1]*goalDc + this.w[i*4+2]*ph + this.w[i*4+3] + vis;
    });
    const valid = scores.map((s,i)=>({s,i})).filter(x=>isFinite(x.s));
    if (!valid.length) return null;
    const maxS = Math.max(...valid.map(x=>x.s));
    const exps = valid.map(x=>({e:Math.exp(x.s-maxS), i:x.i}));
    const sum = exps.reduce((a,x)=>a+x.e, 0)||1;
    let rand = rnd()*sum, cum = 0;
    for (const {e,i} of exps) { cum+=e; if (rand<=cum) return i; }
    return valid[valid.length-1].i;
  }
  clone() { const g=new Genome(); g.w=new Float32Array(this.w); return g; }
  mutate(rate=0.15, str=0.4) {
    for (let i=0;i<this.w.length;i++) if(rnd()<rate) this.w[i]+=rndRange(-str,str);
  }
  crossover(o) {
    const c=this.clone();
    for (let i=0;i<c.w.length;i++) if(rnd()<0.5) c.w[i]=o.w[i];
    return c;
  }
}

// ── Walker ──
class Walker {
  constructor(genome, idx) { this.genome=genome; this.idx=idx; this.reset(); }
  reset() {
    this.r=0; this.c=0; this.alive=true; this.step=0;
    this.path=[{r:0,c:0}];
    this.visited=new Set(['0,0']);
    this.solved=false;
  }
  advance() {
    if (!this.alive || this.step >= MAX_STEPS) { this.alive=false; return; }
    const cell = maze[this.r][this.c];
    const di = this.genome.getDir(this.r, this.c, cell.walls, this.visited);
    if (di===null) { this.alive=false; return; }
    const [,dr,dc] = DIR_LIST[di];
    this.r+=dr; this.c+=dc; this.step++;
    this.path.push({r:this.r, c:this.c});
    this.visited.add(`${this.r},${this.c}`);
    if (this.r===ROWS-1 && this.c===COLS-1) { this.solved=true; this.alive=false; }
  }
  calcFitness() {
    const distToGoal = Math.hypot(this.r-(ROWS-1), this.c-(COLS-1));
    const maxDist = Math.hypot(ROWS-1, COLS-1);
    const proximity = (maxDist - distToGoal) / maxDist;
    const efficiency = this.solved ? (MAX_STEPS - this.path.length) / MAX_STEPS * 0.5 : 0;
    this.genome.fitness = proximity * 100 + this.visited.size * 0.3 + (this.solved ? 1000 : 0) + efficiency * 200;
  }
}

// ── State ──
let generation=1, solvedTotal=0, bestPath=null, replayMode=false, replayFrame=0;
let population = Array.from({length:POP}, (_,i)=>new Walker(new Genome(), i));
let aliveCount = POP;
let genBestDist = 0;

function evolve() {
  population.forEach(w => { while(w.alive && w.step<MAX_STEPS) w.advance(); w.calcFitness(); });

  const solved = population.filter(w=>w.solved);
  if (solved.length > 0) {
    solvedTotal += solved.length;
    // Pick shortest path
    const champ = solved.reduce((a,b)=>a.path.length<b.path.length?a:b);
    bestPath = champ.path.slice();
    replayMode = true; replayFrame = 0;
  }

  // Update pheromones
  for (let r=0;r<ROWS;r++) for (let c=0;c<COLS;c++) pheromones[r][c]*=EVAP;
  population.forEach(w => {
    const bonus = w.solved ? 5 : 1;
    w.path.forEach(p => { pheromones[p.r][p.c] += DEPOSIT * bonus * w.genome.fitness / 1000; });
  });

  population.sort((a,b)=>b.genome.fitness-a.genome.fitness);
  genBestDist = population[0].genome.fitness;

  const topN = Math.max(10, Math.floor(POP*0.2));
  const survivors = population.slice(0, topN);

  const newPop = [];
  newPop.push(survivors[0].genome.clone()); // elitism
  while (newPop.length < POP) {
    const p1 = survivors[Math.floor(rnd()*survivors.length)];
    const p2 = survivors[Math.floor(rnd()*survivors.length)];
    const child = p1.genome.crossover(p2.genome);
    child.mutate();
    newPop.push(child);
  }

  // New maze every 5 generations for variety
  if (generation % 5 === 0) {
    maze = buildMaze();
    pheromones = Array.from({length:ROWS}, ()=>Array(COLS).fill(0));
    pheromones[0][0] = 1;
    bestPath = null;
  }

  population = newPop.map((g,i)=>new Walker(g,i));
  aliveCount = POP;
  generation++;
}

// ── Canvas / rendering ──
const gc = document.getElementById('game-canvas');
const gx = gc.getContext('2d');
let simSpeed = 3;
document.getElementById('speed').addEventListener('input', e => {
  simSpeed = parseInt(e.target.value);
  document.getElementById('speed-val').textContent = simSpeed + 'x';
});

function resize() {
  const p = gc.parentElement;
  const s = Math.min(p.clientWidth, p.clientHeight) - 16;
  gc.width = s; gc.height = s;
}
window.addEventListener('resize', resize); resize();

function draw() {
  const W=gc.width, H=gc.height;
  const cs = Math.min(W/COLS, H/ROWS);
  const ox=(W-cs*COLS)/2, oy=(H-cs*ROWS)/2;

  gx.fillStyle='#07070f'; gx.fillRect(0,0,W,H);

  // Pheromone heatmap
  for (let r=0;r<ROWS;r++) for (let c=0;c<COLS;c++) {
    const v = Math.min(1, pheromones[r][c] * 0.6);
    if (v>0.01) { gx.fillStyle=`rgba(204,119,34,${v*0.55})`; gx.fillRect(ox+c*cs, oy+r*cs, cs, cs); }
  }

  // Maze walls
  gx.strokeStyle='#1a1a2e'; gx.lineWidth=1.5;
  for (let r=0;r<ROWS;r++) for (let c=0;c<COLS;c++) {
    const cell=maze[r][c]; const x=ox+c*cs, y=oy+r*cs;
    if(cell.walls.N){gx.beginPath();gx.moveTo(x,y);gx.lineTo(x+cs,y);gx.stroke();}
    if(cell.walls.S){gx.beginPath();gx.moveTo(x,y+cs);gx.lineTo(x+cs,y+cs);gx.stroke();}
    if(cell.walls.W){gx.beginPath();gx.moveTo(x,y);gx.lineTo(x,y+cs);gx.stroke();}
    if(cell.walls.E){gx.beginPath();gx.moveTo(x+cs,y);gx.lineTo(x+cs,y+cs);gx.stroke();}
  }

  // Start / Goal
  gx.fillStyle='#00ff8844'; gx.fillRect(ox+2, oy+2, cs-4, cs-4);
  gx.fillStyle='#ff444444'; gx.fillRect(ox+(COLS-1)*cs+2, oy+(ROWS-1)*cs+2, cs-4, cs-4);
  gx.font=`bold ${cs*0.55}px Courier New`; gx.textAlign='center'; gx.textBaseline='middle';
  gx.fillStyle='#00ff88'; gx.fillText('S', ox+cs/2, oy+cs/2);
  gx.fillStyle='#ff4444'; gx.fillText('G', ox+(COLS-1)*cs+cs/2, oy+(ROWS-1)*cs+cs/2);

  // Ghost walkers (top 50 alive)
  const aliveWalkers = population.filter(w=>w.alive).slice(0,50);
  aliveWalkers.forEach(w => {
    gx.fillStyle='rgba(204,119,34,0.35)';
    gx.beginPath(); gx.arc(ox+w.c*cs+cs/2, oy+w.r*cs+cs/2, cs*0.25, 0, TWO_PI); gx.fill();
  });

  // Best walker (leader)
  const alive = population.filter(w=>w.alive);
  if (alive.length) {
    const best = alive.reduce((a,b)=>b.genome.fitness>a.genome.fitness?b:a);
    const x=ox+best.c*cs+cs/2, y=oy+best.r*cs+cs/2;
    const g2=gx.createRadialGradient(x,y,1,x,y,cs*0.5);
    g2.addColorStop(0,'rgba(255,200,80,0.6)'); g2.addColorStop(1,'transparent');
    gx.fillStyle=g2; gx.beginPath(); gx.arc(x,y,cs*0.5,0,TWO_PI); gx.fill();
    gx.fillStyle='#ffcc44'; gx.beginPath(); gx.arc(x,y,cs*0.28,0,TWO_PI); gx.fill();
  }

  // Best-path replay
  if (replayMode && bestPath) {
    const end = Math.min(replayFrame, bestPath.length-1);
    gx.strokeStyle='#00ff8899'; gx.lineWidth=cs*0.22;
    gx.beginPath();
    bestPath.slice(0, end+1).forEach((p,i)=>{
      const x=ox+p.c*cs+cs/2, y=oy+p.r*cs+cs/2;
      i===0?gx.moveTo(x,y):gx.lineTo(x,y);
    });
    gx.stroke();
    const p = bestPath[end];
    gx.fillStyle='#00ff88'; gx.beginPath();
    gx.arc(ox+p.c*cs+cs/2, oy+p.r*cs+cs/2, cs*0.32, 0, TWO_PI); gx.fill();
  }
}

// ── Main loop (time-based steps) ──
// simSpeed = steps per frame (each step = one walker advance across all walkers)
function simStep() {
  if (replayMode) {
    replayFrame += 2;
    if (replayFrame >= (bestPath?.length||0) + 30) replayMode = false;
    return;
  }

  let anyAlive = false;
  for (const w of population) { if(w.alive){ w.advance(); anyAlive=true; } }
  aliveCount = population.filter(w=>w.alive).length;
  if (!anyAlive) evolve();
}

function loop() {
  requestAnimationFrame(loop);
  if(_paused){draw();return;}
  // Run simSpeed steps per frame
  for (let i=0; i<simSpeed; i++) simStep();
  draw();
  document.getElementById('s-gen').textContent = generation;
  document.getElementById('s-alive').textContent = aliveCount;
  document.getElementById('s-best').textContent = Math.floor(genBestDist);
  document.getElementById('s-solved').textContent = solvedTotal;
  document.getElementById('s-replay').textContent = replayMode ? '▶ PLAYING' : '-';
}
loop();

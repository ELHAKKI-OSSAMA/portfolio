// Car Racing — NEAT AI  (Multi-track with menu)
const TWO_PI = Math.PI * 2;

// ── Track definitions ─────────────────────────────
// Each track: T=tile size, TW=road half-width, GO=grid origin (centers in 800×600),
// cells=[{c,r}] in circuit order. N=1 E=2 S=4 W=8 bitmask.
const TRACKS = [
  {
    id:'oval', name:'OVAL CLASSIC', emoji:'⭕',
    desc:'Balanced oval circuit — 9×5 grid. The ideal starting point.',
    difficulty:'MEDIUM', color:'#ffcc00',
    T:64, TW:22, GO:{x:112,y:140},
    cells:[
      {c:1,r:1},{c:2,r:1},{c:3,r:1},{c:4,r:1},{c:5,r:1},
      {c:6,r:1},{c:7,r:1},{c:8,r:1},{c:9,r:1},
      {c:9,r:2},{c:9,r:3},{c:9,r:4},{c:9,r:5},
      {c:8,r:5},{c:7,r:5},{c:6,r:5},{c:5,r:5},
      {c:4,r:5},{c:3,r:5},{c:2,r:5},{c:1,r:5},
      {c:1,r:4},{c:1,r:3},{c:1,r:2},
    ]
  },
  {
    id:'speedway', name:'SPEEDWAY', emoji:'⚡',
    desc:'Ultra-long straights, gentle corners. Top speed wins here.',
    difficulty:'EASY', color:'#4488ff',
    T:52, TW:18, GO:{x:62,y:222},
    cells:[
      {c:1,r:1},{c:2,r:1},{c:3,r:1},{c:4,r:1},{c:5,r:1},{c:6,r:1},{c:7,r:1},
      {c:8,r:1},{c:9,r:1},{c:10,r:1},{c:11,r:1},{c:12,r:1},{c:13,r:1},
      {c:13,r:2},{c:13,r:3},
      {c:12,r:3},{c:11,r:3},{c:10,r:3},{c:9,r:3},{c:8,r:3},{c:7,r:3},
      {c:6,r:3},{c:5,r:3},{c:4,r:3},{c:3,r:3},{c:2,r:3},{c:1,r:3},
      {c:1,r:2},
    ]
  },
  {
    id:'s-circuit', name:'S-CIRCUIT', emoji:'🔀',
    desc:'Chicanes & S-bends — left then right then left again. Mixed turns, hardest track.',
    difficulty:'HARD', color:'#ff6644',
    T:58, TW:20, GO:{x:139,y:97},
    // Turn sequence: R,R, L,L, R,R, L, R,L, L,L
    // Two chicane sections force the AI to master direction reversals
    cells:[
      // Top straight going E
      {c:2,r:1},{c:3,r:1},{c:4,r:1},{c:5,r:1},{c:6,r:1},{c:7,r:1},{c:8,r:1},
      // Right side going S, then W (R+R)
      {c:8,r:2},{c:8,r:3},
      {c:7,r:3},{c:6,r:3},{c:5,r:3},
      // First chicane: L-turn S, L-turn E
      {c:5,r:4},{c:5,r:5},
      {c:6,r:5},{c:7,r:5},{c:8,r:5},
      // Right side going S, then W (R+R)
      {c:8,r:6},{c:8,r:7},
      {c:7,r:7},{c:6,r:7},{c:5,r:7},{c:4,r:7},{c:3,r:7},{c:2,r:7},
      // Left side going N, then E (L+R)
      {c:2,r:6},{c:2,r:5},
      {c:3,r:5},{c:4,r:5},
      // Second chicane: L-turn N, L-turn W
      {c:4,r:4},{c:4,r:3},
      {c:3,r:3},{c:2,r:3},
      // Final going N to close
      {c:2,r:2},
    ]
  },
  {
    id:'sprint', name:'SPRINT', emoji:'💨',
    desc:'Two chicane jogs — rapid L/R changes on a short lap. Fast evolution, real challenge.',
    difficulty:'MEDIUM', color:'#00ff88',
    T:70, TW:24, GO:{x:190,y:90},
    // Turn sequence: R, R, L, R, R, L, R, R  (6R + 2L, net 4 CW)
    // Top jog = R→L, bottom jog = L→R
    cells:[
      // Top straight with R→L jog (chicane 1)
      {c:1,r:1},{c:2,r:1},{c:3,r:1},
      {c:3,r:2},{c:4,r:2},{c:5,r:2},{c:6,r:2},
      // Right side going S
      {c:6,r:3},{c:6,r:4},{c:6,r:5},
      // Bottom with L→R jog (chicane 2)
      {c:5,r:5},{c:4,r:5},
      {c:4,r:6},{c:3,r:6},{c:2,r:6},{c:1,r:6},
      // Left side going N
      {c:1,r:5},{c:1,r:4},{c:1,r:3},{c:1,r:2},
    ]
  }
];

// ── Mutable track state (rebuilt on selectTrack) ──
let T, TRACK_WIDTH, GRID_ORIGIN, cellMap, trackCenter, walls, cumDist=[], trackPerimeter=0;

// ── Geometry helpers ──────────────────────────────
function cellCenter(c,r){
  return {x:GRID_ORIGIN.x+(c-1)*T+T/2, y:GRID_ORIGIN.y+(r-1)*T+T/2};
}

function buildCellMap(cells){
  const n=cells.length;
  return cells.map((cell,i)=>{
    const prev=cells[(i-1+n)%n], next=cells[(i+1)%n];
    let mask=0;
    for(const nb of [prev,next]){
      if(nb.c===cell.c   &&nb.r===cell.r-1)mask|=1;
      if(nb.c===cell.c+1 &&nb.r===cell.r  )mask|=2;
      if(nb.c===cell.c   &&nb.r===cell.r+1)mask|=4;
      if(nb.c===cell.c-1 &&nb.r===cell.r  )mask|=8;
    }
    return {...cell,mask};
  });
}

function catmullRom(p0,p1,p2,p3,t){
  const t2=t*t,t3=t2*t;
  return {
    x:0.5*((2*p1.x)+(-p0.x+p2.x)*t+(2*p0.x-5*p1.x+4*p2.x-p3.x)*t2+(-p0.x+3*p1.x-3*p2.x+p3.x)*t3),
    y:0.5*((2*p1.y)+(-p0.y+p2.y)*t+(2*p0.y-5*p1.y+4*p2.y-p3.y)*t2+(-p0.y+3*p1.y-3*p2.y+p3.y)*t3)
  };
}

function buildSpline(wps){
  const n=wps.length, steps=Math.ceil(180/n)+2, pts=[];
  for(let i=0;i<n;i++){
    const p0=wps[(i-1+n)%n],p1=wps[i],p2=wps[(i+1)%n],p3=wps[(i+2)%n];
    for(let s=0;s<steps;s++) pts.push(catmullRom(p0,p1,p2,p3,s/steps));
  }
  return pts;
}

function ptOnTrack(t){
  const n=trackCenter.length;
  const i=((Math.floor(t*n)%n)+n)%n, f=t*n-Math.floor(t*n), j=(i+1)%n;
  return {x:trackCenter[i].x*(1-f)+trackCenter[j].x*f, y:trackCenter[i].y*(1-f)+trackCenter[j].y*f};
}

function trackTangent(t){
  const n=trackCenter.length;
  const i=((Math.floor(t*n)%n)+n)%n, j=(i+1)%n;
  const dx=trackCenter[j].x-trackCenter[i].x, dy=trackCenter[j].y-trackCenter[i].y;
  const len=Math.sqrt(dx*dx+dy*dy)||1;
  return {tx:dx/len,ty:dy/len,nx:-dy/len,ny:dx/len};
}

function nearestProgress(x,y,hint,range=0.12){
  let best=hint,bestD=Infinity;
  for(let dt=-range;dt<=range;dt+=0.001){
    const t=((hint+dt)%1+1)%1, p=ptOnTrack(t), d=Math.hypot(p.x-x,p.y-y);
    if(d<bestD){bestD=d;best=t;}
  }
  return {t:best,dist:bestD};
}

function buildWalls(){
  const inner=[],outer=[],n=trackCenter.length;
  cumDist=[];trackPerimeter=0;
  for(let i=0;i<n;i++){
    cumDist.push(trackPerimeter);
    const tang=trackTangent(i/n);
    inner.push({x:trackCenter[i].x+tang.nx*TRACK_WIDTH, y:trackCenter[i].y+tang.ny*TRACK_WIDTH});
    outer.push({x:trackCenter[i].x-tang.nx*TRACK_WIDTH, y:trackCenter[i].y-tang.ny*TRACK_WIDTH});
    const j=(i+1)%n;
    trackPerimeter+=Math.hypot(trackCenter[j].x-trackCenter[i].x,trackCenter[j].y-trackCenter[i].y);
  }
  return {inner,outer};
}

function segIsect(ax,ay,bx,by,cx,cy,dx,dy){
  const d1x=bx-ax,d1y=by-ay,d2x=dx-cx,d2y=dy-cy;
  const cross=d1x*d2y-d1y*d2x;
  if(Math.abs(cross)<1e-9)return null;
  const t=((cx-ax)*d2y-(cy-ay)*d2x)/cross;
  const u=((cx-ax)*d1y-(cy-ay)*d1x)/cross;
  if(t>=0&&t<=1&&u>=0&&u<=1)return t;
  return null;
}

function raycast(ox,oy,angle){
  const maxD=180, ex=ox+Math.cos(angle)*maxD, ey=oy+Math.sin(angle)*maxD;
  let minT=1;
  for(const wpts of [walls.inner,walls.outer])
    for(let i=0;i<wpts.length;i++){
      const j=(i+1)%wpts.length;
      const t=segIsect(ox,oy,ex,ey,wpts[i].x,wpts[i].y,wpts[j].x,wpts[j].y);
      if(t!==null&&t<minT)minT=t;
    }
  return minT;
}

function pointInPoly(px,py,poly){
  let w=0;
  for(let i=0;i<poly.length;i++){
    const a=poly[i],b=poly[(i+1)%poly.length];
    if(a.y<=py){if(b.y>py&&(b.x-a.x)*(py-a.y)-(b.y-a.y)*(px-a.x)>0)w++;}
    else{if(b.y<=py&&(b.x-a.x)*(py-a.y)-(b.y-a.y)*(px-a.x)<0)w--;}
  }
  return w!==0;
}
function isOnTrack(x,y){return pointInPoly(x,y,walls.outer)&&!pointInPoly(x,y,walls.inner);}

// ── Car ───────────────────────────────────────────
const RAY_OFFSETS=[
  -TWO_PI*3/8,-TWO_PI/4,-TWO_PI/6,-TWO_PI/10,-TWO_PI/20,
   TWO_PI/20,  TWO_PI/10, TWO_PI/6, TWO_PI/4,  TWO_PI*3/8
];

class Car{
  constructor(genome,idx){
    this.genome=genome;this.idx=idx;
    this.color=SPECIES_COLORS[genome.speciesId%SPECIES_COLORS.length];
    this.reset();
  }
  reset(){
    const start=ptOnTrack(0),tang=trackTangent(0);
    this.x=start.x;this.y=start.y;
    this.angle=Math.atan2(tang.ty,tang.tx);
    this.speed=2.0;this.alive=true;this.fitness=0;this.speedBonus=0;
    this.progress=0;this.laps=0;this.frames=0;
    this.framesSinceProgress=0;this.lastProgress=0;
    this.outputs=[0,0,0];
    this.lastInputs=new Array(NEAT_CFG.INPUTS).fill(0);
    this.lastActs={h:new Array(NEAT_CFG.HIDDEN).fill(0),o:[0,0,0]};
  }
  getRays(){return RAY_OFFSETS.map(o=>raycast(this.x,this.y,this.angle+o));}
  step(){
    if(!this.alive)return;
    const rays=this.getRays();
    const inp=[...rays,this.speed/7];
    const acts=this.genome.forward(inp);
    this.lastInputs=inp;this.lastActs=acts;
    const out=acts.o;this.outputs=out;
    const steer=(out[1]-out[0])*0.09,throttle=out[2];
    this.angle+=steer;
    // Easier to accelerate (lower resistance threshold 0.35 vs 0.4)
    this.speed+=(throttle-0.35)*0.35;
    this.speed=Math.max(0.8,Math.min(7,this.speed));
    this.x+=Math.cos(this.angle)*this.speed;
    this.y+=Math.sin(this.angle)*this.speed;
    this.frames++;
    if(!isOnTrack(this.x,this.y)){this.alive=false;return;}
    const {t:newT}=nearestProgress(this.x,this.y,this.progress);
    let delta=newT-this.progress;
    if(delta<-0.5)delta+=1;if(delta>0.5)delta-=1;
    if(delta>0.001){
      this.progress=newT;this.framesSinceProgress=0;
      if(this.lastProgress>0.9&&newT<0.1)this.laps++;
      this.lastProgress=newT;
      // Reward high speed while making forward progress
      this.speedBonus+=Math.max(0,this.speed-1.5)*0.28;
    } else {
      this.framesSinceProgress++;
      if(delta<-0.001)this.speedBonus-=10; // backwards penalty persists
    }
    if(this.framesSinceProgress>150){this.alive=false;return;}
    // Time penalty: slow survival hurts. Fast laps compensate via speedBonus.
    this.fitness=Math.max(0,this.laps*1000+this.progress*500+this.speedBonus-this.frames*0.05);
  }
}

// ── Canvas contexts ────────────────────────────────
const gc=document.getElementById('game-canvas');
const gx=gc.getContext('2d');
const radar=document.getElementById('radar-canvas');
const rx2=radar.getContext('2d');
const rewardC=document.getElementById('reward-canvas');
const rc2=rewardC.getContext('2d');

function resize(){
  gc.width=gc.parentElement.clientWidth;
  gc.height=gc.parentElement.clientHeight;
  const sideH=radar.parentElement.clientHeight;
  radar.width=radar.parentElement.clientWidth;
  radar.height=Math.floor(sideH/3);
  rewardC.width=rewardC.parentElement.clientWidth;
  rewardC.height=Math.floor(sideH/3);
  if(typeof NNDraw!=='undefined')NNDraw.resize();
}
window.addEventListener('resize',resize);

// ── Menu ──────────────────────────────────────────
function drawTrackPreview(canvas,track){
  const ctx=canvas.getContext('2d');
  const W=canvas.width,H=canvas.height;
  ctx.fillStyle='#111820';ctx.fillRect(0,0,W,H);

  const cells=track.cells;
  const minC=Math.min(...cells.map(c=>c.c));
  const maxC=Math.max(...cells.map(c=>c.c));
  const minR=Math.min(...cells.map(c=>c.r));
  const maxR=Math.max(...cells.map(c=>c.r));
  const gridW=(maxC-minC+1)*track.T, gridH=(maxR-minR+1)*track.T;
  const sc=Math.min((W-20)/gridW,(H-20)/gridH)*0.88;
  const ox2=(W-gridW*sc)/2-(minC-1)*track.T*sc;
  const oy2=(H-gridH*sc)/2-(minR-1)*track.T*sc;
  const toP=({c,r})=>({x:ox2+((c-1)*track.T+track.T/2)*sc, y:oy2+((r-1)*track.T+track.T/2)*sc});

  const rw=track.TW*sc*2;

  // Grass patches
  ctx.fillStyle='rgba(35,70,25,0.35)';
  ctx.fillRect(0,0,W*0.5,H*0.5);
  ctx.fillRect(W*0.5,H*0.5,W*0.5,H*0.5);

  // Road body
  ctx.strokeStyle='#1e1e26';ctx.lineWidth=rw;ctx.lineCap='round';ctx.lineJoin='round';
  ctx.beginPath();
  cells.forEach(({c,r},i)=>{const p=toP({c,r});i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y);});
  ctx.closePath();ctx.stroke();

  // Outer curb (slightly thicker outline in red/white alternate hint — just use red stroke)
  ctx.strokeStyle='rgba(180,30,30,0.55)';ctx.lineWidth=rw+3;
  ctx.beginPath();
  cells.forEach(({c,r},i)=>{const p=toP({c,r});i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y);});
  ctx.closePath();ctx.stroke();
  // Re-draw road on top
  ctx.strokeStyle='#1e1e26';ctx.lineWidth=rw;
  ctx.beginPath();
  cells.forEach(({c,r},i)=>{const p=toP({c,r});i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y);});
  ctx.closePath();ctx.stroke();

  // Center dashes
  ctx.save();ctx.setLineDash([sc*3,sc*4]);
  ctx.strokeStyle='rgba(255,255,255,0.3)';ctx.lineWidth=Math.max(1,sc*1.2);ctx.lineCap='butt';
  ctx.beginPath();
  cells.forEach(({c,r},i)=>{const p=toP({c,r});i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y);});
  ctx.closePath();ctx.stroke();ctx.restore();

  // Finish line (at cells[1])
  if(cells.length>2){
    const p0=toP(cells[0]),p1=toP(cells[1]),p2=toP(cells[2]);
    const dx=p2.x-p0.x,dy=p2.y-p0.y,len=Math.hypot(dx,dy)||1;
    const nx=-dy/len,ny=dx/len;
    ctx.strokeStyle='#ffffff';ctx.lineWidth=Math.max(2,rw*0.7);ctx.lineCap='butt';
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(p1.x+nx*rw/2,p1.y+ny*rw/2);
    ctx.lineTo(p1.x-nx*rw/2,p1.y-ny*rw/2);
    ctx.stroke();
  }

  // Track name label
  ctx.fillStyle=track.color+'cc';
  ctx.font=`bold ${Math.max(8,W*0.05)}px Courier New`;
  ctx.textAlign='center';ctx.textBaseline='bottom';
  ctx.fillText(track.name,W/2,H-4);
}

function buildMenu(){
  const container=document.getElementById('track-cards');
  container.innerHTML='';
  TRACKS.forEach(track=>{
    // Compute stats
    const n=track.cells.length;
    const cm=buildCellMap(track.cells);
    const corners=cm.filter(c=>c.mask!==5&&c.mask!==10).length;

    const card=document.createElement('div');
    card.className='track-card';
    card.innerHTML=`
      <canvas class="track-preview" width="240" height="130"></canvas>
      <div class="card-header">
        <span class="track-emoji">${track.emoji}</span>
        <span class="track-name">${track.name}</span>
        <span class="difficulty diff-${track.difficulty}">${track.difficulty}</span>
      </div>
      <div class="track-desc">${track.desc}</div>
      <div class="track-stats">${n} TILES · ${corners} CORNERS</div>
      <div class="play-hint">▶ CLICK TO RACE</div>
    `;
    const previewCanvas=card.querySelector('.track-preview');
    // Draw preview after DOM insert so canvas is sized
    setTimeout(()=>drawTrackPreview(previewCanvas,track),0);
    card.addEventListener('click',()=>selectTrack(track));
    container.appendChild(card);
  });
}

// ── Game state ────────────────────────────────────
let neat=null,cars=null,simSpeed=2,bestHist=[],bestLap=0;
let _gameActive=false,genFrames=0;
const MAX_GEN_FRAMES=3000; // force evolution after this many sim-frames per generation

document.getElementById('speed').addEventListener('input',e=>{
  simSpeed=parseInt(e.target.value);
  document.getElementById('speed-val').textContent=simSpeed+'x';
});

function selectTrack(track){
  // Build track geometry
  T=track.T; TRACK_WIDTH=track.TW; GRID_ORIGIN=track.GO;
  cellMap=buildCellMap(track.cells);
  const wps=track.cells.map(({c,r})=>cellCenter(c,r));
  trackCenter=buildSpline(wps);
  walls=buildWalls();

  // Fresh NEAT
  neat=new NEAT();
  cars=neat.genomes.map((g,i)=>new Car(g,i));
  bestHist=[];bestLap=0;genFrames=0;
  if(typeof _paused!=='undefined')_paused=false;

  // Show game
  document.getElementById('menu').style.display='none';
  document.getElementById('top-bar').style.display='flex';
  document.getElementById('main').style.display='flex';
  resize();
  _gameActive=true;
}

function showMenu(){
  _gameActive=false;
  document.getElementById('menu').style.display='flex';
  document.getElementById('top-bar').style.display='none';
  document.getElementById('main').style.display='none';
}

// ── Smooth road rendering ──────────────────────────
function drawTrack(W,H,scale,ox,oy){
  const toS=p=>({x:ox+p.x*scale,y:oy+p.y*scale});
  const n=trackCenter.length;
  const gStep=T*scale;

  // 1. Grass + patches
  gx.fillStyle='#2b5f24';gx.fillRect(0,0,W,H);
  gx.fillStyle='rgba(30,70,20,0.18)';
  for(const[fx,fy,fw,fh]of[[.05,.06,.32,.28],[.55,.02,.38,.22],[.12,.62,.28,.35],[.62,.55,.34,.4]])
    gx.fillRect(W*fx,H*fy,W*fw,H*fh);

  // Grid overlay
  gx.strokeStyle='rgba(0,0,0,0.07)';gx.lineWidth=0.5;
  const gox=((ox+GRID_ORIGIN.x*scale)%gStep+gStep)%gStep;
  const goy=((oy+GRID_ORIGIN.y*scale)%gStep+gStep)%gStep;
  for(let x=gox-gStep;x<W;x+=gStep){gx.beginPath();gx.moveTo(x,0);gx.lineTo(x,H);gx.stroke();}
  for(let y=goy-gStep;y<H;y+=gStep){gx.beginPath();gx.moveTo(0,y);gx.lineTo(W,y);gx.stroke();}

  // 2. Road surface (outer polygon fill)
  gx.beginPath();
  walls.outer.forEach((p,i)=>{const s=toS(p);i===0?gx.moveTo(s.x,s.y):gx.lineTo(s.x,s.y);});
  gx.closePath();gx.fillStyle='#1c1c22';gx.fill();

  // 3. Inner grass cutout
  gx.beginPath();
  walls.inner.forEach((p,i)=>{const s=toS(p);i===0?gx.moveTo(s.x,s.y):gx.lineTo(s.x,s.y);});
  gx.closePath();gx.fillStyle='#2d6428';gx.fill();

  // 4. Curb stripes — alternating red/white quads along both walls
  const sw=trackPerimeter/28; // 28 stripes per lap
  for(let i=0;i<n;i++){
    const j=(i+1)%n;
    const col=Math.floor(cumDist[i]/sw)%2===0?'#c91e1e':'#e8e8e8';
    const oo=toS(walls.outer[i]),oj=toS(walls.outer[j]);
    const ii2=toS(walls.inner[i]),ij=toS(walls.inner[j]);
    const tc=toS(trackCenter[i]),jtc=toS(trackCenter[j]);
    // outer curb — 22% inward from wall toward centerline
    const ox0=oo.x+(tc.x-oo.x)*.22,oy0=oo.y+(tc.y-oo.y)*.22;
    const ox1=oj.x+(jtc.x-oj.x)*.22,oy1=oj.y+(jtc.y-oj.y)*.22;
    gx.fillStyle=col;
    gx.beginPath();gx.moveTo(oo.x,oo.y);gx.lineTo(oj.x,oj.y);gx.lineTo(ox1,oy1);gx.lineTo(ox0,oy0);gx.closePath();gx.fill();
    // inner curb
    const ix0=ii2.x+(tc.x-ii2.x)*.22,iy0=ii2.y+(tc.y-ii2.y)*.22;
    const ix1=ij.x+(jtc.x-ij.x)*.22,iy1=ij.y+(jtc.y-ij.y)*.22;
    gx.beginPath();gx.moveTo(ii2.x,ii2.y);gx.lineTo(ij.x,ij.y);gx.lineTo(ix1,iy1);gx.lineTo(ix0,iy0);gx.closePath();gx.fill();
  }

  // 5. Center dashes
  gx.save();gx.setLineDash([6*scale,8*scale]);
  gx.strokeStyle='rgba(255,255,255,0.32)';gx.lineWidth=Math.max(1,1.4*scale);
  gx.beginPath();
  trackCenter.forEach((p,i)=>{const s=toS(p);i===0?gx.moveTo(s.x,s.y):gx.lineTo(s.x,s.y);});
  gx.closePath();gx.stroke();gx.restore();

  // 6. Checkered finish line at trackCenter[0]
  const fp=toS(trackCenter[0]),t0=trackTangent(0);
  const fw2=TRACK_WIDTH*scale, flen=7*scale;
  const cols=8,rows=2;
  gx.save();
  gx.beginPath();
  const fc=[
    {x:fp.x-t0.tx*flen-t0.nx*fw2,y:fp.y-t0.ty*flen-t0.ny*fw2},
    {x:fp.x+t0.tx*flen-t0.nx*fw2,y:fp.y+t0.ty*flen-t0.ny*fw2},
    {x:fp.x+t0.tx*flen+t0.nx*fw2,y:fp.y+t0.ty*flen+t0.ny*fw2},
    {x:fp.x-t0.tx*flen+t0.nx*fw2,y:fp.y-t0.ty*flen+t0.ny*fw2},
  ];
  gx.moveTo(fc[0].x,fc[0].y);fc.forEach(p=>gx.lineTo(p.x,p.y));gx.closePath();gx.clip();
  for(let ci=0;ci<cols;ci++)for(let ri=0;ri<rows;ri++){
    const s0=-1+(ci/cols)*2,s1=-1+((ci+1)/cols)*2;
    const r0=-1+(ri/rows)*2,r1=-1+((ri+1)/rows)*2;
    gx.fillStyle=(ci+ri)%2===0?'#ffffff':'#111111';
    gx.beginPath();
    gx.moveTo(fp.x+t0.nx*fw2*s0+t0.tx*flen*r0,fp.y+t0.ny*fw2*s0+t0.ty*flen*r0);
    gx.lineTo(fp.x+t0.nx*fw2*s1+t0.tx*flen*r0,fp.y+t0.ny*fw2*s1+t0.ty*flen*r0);
    gx.lineTo(fp.x+t0.nx*fw2*s1+t0.tx*flen*r1,fp.y+t0.ny*fw2*s1+t0.ty*flen*r1);
    gx.lineTo(fp.x+t0.nx*fw2*s0+t0.tx*flen*r1,fp.y+t0.ny*fw2*s0+t0.ty*flen*r1);
    gx.closePath();gx.fill();
  }
  gx.restore();
  // Red poles flanking start line
  gx.fillStyle='#dd1111';
  gx.beginPath();gx.arc(fp.x-t0.nx*(fw2+5),fp.y-t0.ny*(fw2+5),Math.max(3,4*scale),0,TWO_PI);gx.fill();
  gx.beginPath();gx.arc(fp.x+t0.nx*(fw2+5),fp.y+t0.ny*(fw2+5),Math.max(3,4*scale),0,TWO_PI);gx.fill();

  // 7. Directional sun + fog
  const sun=gx.createLinearGradient(0,0,W*.55,H*.55);
  sun.addColorStop(0,'rgba(255,200,80,0.04)');sun.addColorStop(1,'rgba(20,50,80,0.06)');
  gx.fillStyle=sun;gx.fillRect(0,0,W,H);
  const fog=gx.createRadialGradient(W/2,H/2,Math.min(W,H)*.28,W/2,H/2,Math.max(W,H)*.74);
  fog.addColorStop(0,'rgba(0,0,0,0)');fog.addColorStop(.65,'rgba(5,15,5,0.05)');fog.addColorStop(1,'rgba(5,15,5,0.42)');
  gx.fillStyle=fog;gx.fillRect(0,0,W,H);
}

function drawCars(cars,scale,ox,oy){
  cars.forEach(c=>{
    if(!c.alive)return;
    const sx=ox+c.x*scale,sy=oy+c.y*scale;
    gx.save();gx.translate(sx,sy);gx.rotate(c.angle);
    gx.globalAlpha=0.28;gx.fillStyle=c.color;
    gx.fillRect(-8*scale,-4*scale,16*scale,8*scale);
    gx.globalAlpha=1;gx.restore();
  });
}

function drawBestCar(car,scale,ox,oy){
  if(!car||!car.alive)return;
  const sx=ox+car.x*scale,sy=oy+car.y*scale;
  car.getRays().forEach((t,i)=>{
    const a=car.angle+RAY_OFFSETS[i];
    gx.strokeStyle=`rgba(255,204,0,${0.1+(1-t)*0.28})`;gx.lineWidth=0.8;
    gx.beginPath();gx.moveTo(sx,sy);
    gx.lineTo(sx+Math.cos(a)*180*t*scale,sy+Math.sin(a)*180*t*scale);gx.stroke();
  });
  gx.save();gx.translate(sx,sy);gx.rotate(car.angle);
  const g=gx.createRadialGradient(0,0,1,0,0,16*scale);
  g.addColorStop(0,car.color+'55');g.addColorStop(1,'transparent');
  gx.fillStyle=g;gx.beginPath();gx.arc(0,0,16*scale,0,TWO_PI);gx.fill();
  gx.fillStyle=car.color;gx.fillRect(-10*scale,-5*scale,20*scale,10*scale);
  gx.fillStyle='#000';gx.fillRect(4*scale,-3*scale,4*scale,3*scale);
  gx.fillRect(4*scale,0,4*scale,3*scale);
  gx.restore();
}

function drawRadar(car){
  const W=radar.width,H=radar.height;
  rx2.fillStyle='#06060e';rx2.fillRect(0,0,W,H);
  if(!car)return;
  const labels=['TurnL','TurnR','Gas'];
  car.outputs.forEach((v,i)=>{
    const bh=(H-36)*v;
    rx2.fillStyle=i===0?'#ffcc0044':i===1?'#4488ff44':'#00ff8844';
    rx2.fillRect(12+i*(W-24)/3,H-18-bh,(W-24)/3-4,bh);
    rx2.strokeStyle=i===0?'#ffcc00':i===1?'#4488ff':'#00ff88';rx2.lineWidth=0.8;
    rx2.strokeRect(12+i*(W-24)/3,H-18-bh,(W-24)/3-4,bh);
    rx2.fillStyle='#334433';rx2.font='8px Courier New';rx2.textAlign='center';
    rx2.fillText(labels[i],12+i*(W-24)/3+(W-24)/6-2,H-6);
  });
  rx2.fillStyle='#1a3a1a';rx2.font='9px Courier New';rx2.textAlign='left';rx2.fillText('OUTPUTS',10,12);
}

function drawFitnessChart(hist){
  const W=rewardC.width,H=rewardC.height;
  rc2.fillStyle='#06060e';rc2.fillRect(0,0,W,H);
  rc2.fillStyle='#1a3a1a';rc2.font='9px Courier New';rc2.textAlign='left';rc2.fillText('FITNESS / GEN',10,12);
  if(hist.length<2)return;
  const pts=hist.slice(-50),maxV=Math.max(...pts)||1;
  rc2.strokeStyle='#ffcc0077';rc2.lineWidth=1.5;rc2.beginPath();
  pts.forEach((v,i)=>{
    const x=10+(i/(pts.length-1))*(W-20),y=H-10-(v/maxV)*(H-24);
    i===0?rc2.moveTo(x,y):rc2.lineTo(x,y);
  });
  rc2.stroke();
}

// ── Main loop ─────────────────────────────────────
function getBest(){
  const alive=cars.filter(c=>c.alive);
  const pool=alive.length?alive:cars;
  return pool.reduce((a,b)=>b.fitness>a.fitness?b:a);
}

function loop(){
  requestAnimationFrame(loop);
  if(!_gameActive||!neat)return;
  if(_paused){
    const W=gc.width,H=gc.height,scale=Math.min(W/800,H/600);
    const ox=(W-800*scale)/2,oy=(H-600*scale)/2;
    drawTrack(W,H,scale,ox,oy);
    drawCars(cars,scale,ox,oy);
    drawBestCar(getBest(),scale,ox,oy);
    if(typeof NNDraw!=='undefined')NNDraw.draw(getBest());
    return;
  }
  for(let k=0;k<simSpeed;k++){
    cars.forEach(c=>c.step());
    genFrames++;
    if(cars.every(c=>!c.alive)||genFrames>=MAX_GEN_FRAMES){
      // Kill any still-alive cars so they're scored with current fitness
      cars.forEach(c=>c.alive=false);
      const best=getBest();
      bestHist.push(best.fitness);
      if(best.laps>bestLap)bestLap=best.laps;
      neat.evolve(cars);
      cars=neat.genomes.map((g,i)=>new Car(g,i));
      genFrames=0;
    }
  }
  const W=gc.width,H=gc.height,scale=Math.min(W/800,H/600);
  const ox=(W-800*scale)/2,oy=(H-600*scale)/2;
  drawTrack(W,H,scale,ox,oy);
  drawCars(cars,scale,ox,oy);
  const best=getBest();
  drawBestCar(best,scale,ox,oy);
  drawRadar(best);drawFitnessChart(bestHist);
  if(typeof NNDraw!=='undefined')NNDraw.draw(best);
  document.getElementById('s-gen').textContent=neat.generation;
  document.getElementById('s-alive').textContent=cars.filter(c=>c.alive).length;
  document.getElementById('s-lap').textContent=bestLap;
  document.getElementById('s-fit').textContent=best?Math.floor(best.fitness):0;
}

// ── Boot ──────────────────────────────────────────
buildMenu();
loop();

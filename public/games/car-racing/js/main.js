// Car Racing — NEAT AI  (Tile Track)
const TWO_PI = Math.PI * 2;
const T = 64;            // tile size in logical units
const TRACK_WIDTH = 22;  // road half-width in logical units
const GRID_ORIGIN = { x: 112, y: 140 }; // centers 9×5 oval in 800×600

// ── Grid / Tile layout ────────────────────────────
// Oval circuit: top row (cols 1-9), right col (rows 1-5),
// bottom row (cols 9-1), left col (rows 5-1)
const TRACK_CELLS = [
  {c:1,r:1},{c:2,r:1},{c:3,r:1},{c:4,r:1},{c:5,r:1},
  {c:6,r:1},{c:7,r:1},{c:8,r:1},{c:9,r:1},
  {c:9,r:2},{c:9,r:3},{c:9,r:4},{c:9,r:5},
  {c:8,r:5},{c:7,r:5},{c:6,r:5},{c:5,r:5},
  {c:4,r:5},{c:3,r:5},{c:2,r:5},{c:1,r:5},
  {c:1,r:4},{c:1,r:3},{c:1,r:2},
];

function cellCenter(c, r) {
  return { x: GRID_ORIGIN.x + (c-1)*T + T/2, y: GRID_ORIGIN.y + (r-1)*T + T/2 };
}

// N=1 E=2 S=4 W=8
function buildCellMap() {
  const n = TRACK_CELLS.length;
  return TRACK_CELLS.map((cell, i) => {
    const prev = TRACK_CELLS[(i-1+n)%n], next = TRACK_CELLS[(i+1)%n];
    let mask = 0;
    for (const nb of [prev, next]) {
      if (nb.c===cell.c   && nb.r===cell.r-1) mask|=1; // N
      if (nb.c===cell.c+1 && nb.r===cell.r  ) mask|=2; // E
      if (nb.c===cell.c   && nb.r===cell.r+1) mask|=4; // S
      if (nb.c===cell.c-1 && nb.r===cell.r  ) mask|=8; // W
    }
    return { ...cell, mask };
  });
}
const cellMap = buildCellMap();

// ── Spline Track (physics) ────────────────────────
const CIRCUIT_WAYPOINTS = TRACK_CELLS.map(({c,r}) => cellCenter(c,r));

function catmullRom(p0,p1,p2,p3,t){
  const t2=t*t,t3=t2*t;
  return {
    x:0.5*((2*p1.x)+(-p0.x+p2.x)*t+(2*p0.x-5*p1.x+4*p2.x-p3.x)*t2+(-p0.x+3*p1.x-3*p2.x+p3.x)*t3),
    y:0.5*((2*p1.y)+(-p0.y+p2.y)*t+(2*p0.y-5*p1.y+4*p2.y-p3.y)*t2+(-p0.y+3*p1.y-3*p2.y+p3.y)*t3)
  };
}

function buildTrack(){
  const wps=CIRCUIT_WAYPOINTS, n=wps.length;
  const steps=Math.ceil(180/n)+2;
  const pts=[];
  for(let i=0;i<n;i++){
    const p0=wps[(i-1+n)%n],p1=wps[i],p2=wps[(i+1)%n],p3=wps[(i+2)%n];
    for(let s=0;s<steps;s++) pts.push(catmullRom(p0,p1,p2,p3,s/steps));
  }
  return pts;
}
const trackCenter = buildTrack();

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
    const t=((hint+dt)%1+1)%1;
    const p=ptOnTrack(t);
    const d=Math.hypot(p.x-x,p.y-y);
    if(d<bestD){bestD=d;best=t;}
  }
  return {t:best,dist:bestD};
}

function buildWalls(){
  const inner=[],outer=[],n=trackCenter.length;
  for(let i=0;i<n;i++){
    const tang=trackTangent(i/n);
    inner.push({x:trackCenter[i].x+tang.nx*TRACK_WIDTH, y:trackCenter[i].y+tang.ny*TRACK_WIDTH});
    outer.push({x:trackCenter[i].x-tang.nx*TRACK_WIDTH, y:trackCenter[i].y-tang.ny*TRACK_WIDTH});
  }
  return {inner,outer};
}
const walls=buildWalls();

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

class Car {
  constructor(genome,idx){
    this.genome=genome; this.idx=idx;
    this.color=SPECIES_COLORS[genome.speciesId%SPECIES_COLORS.length];
    this.reset();
  }
  reset(){
    const start=ptOnTrack(0), tang=trackTangent(0);
    this.x=start.x; this.y=start.y;
    this.angle=Math.atan2(tang.ty,tang.tx);
    this.speed=1.5; this.alive=true; this.fitness=0;
    this.progress=0; this.laps=0; this.frames=0;
    this.framesSinceProgress=0; this.lastProgress=0;
    this.outputs=[0,0,0];
    this.lastInputs=new Array(NEAT_CFG.INPUTS).fill(0);
    this.lastActs={h:new Array(NEAT_CFG.HIDDEN).fill(0),o:[0,0,0]};
  }
  getRays(){return RAY_OFFSETS.map(o=>raycast(this.x,this.y,this.angle+o));}
  step(){
    if(!this.alive)return;
    const rays=this.getRays();
    const inp=[...rays, this.speed/6];
    const acts=this.genome.forward(inp);
    this.lastInputs=inp; this.lastActs=acts;
    const out=acts.o; this.outputs=out;
    const steer=(out[1]-out[0])*0.09, throttle=out[2];
    this.angle+=steer;
    this.speed+=( throttle-0.4)*0.3;
    this.speed=Math.max(0.6,Math.min(6,this.speed));
    this.x+=Math.cos(this.angle)*this.speed;
    this.y+=Math.sin(this.angle)*this.speed;
    this.frames++;
    if(!isOnTrack(this.x,this.y)){this.alive=false;return;}
    const {t:newT}=nearestProgress(this.x,this.y,this.progress);
    let delta=newT-this.progress;
    if(delta<-0.5)delta+=1; if(delta>0.5)delta-=1;
    if(delta>0.001){
      this.progress=newT; this.framesSinceProgress=0;
      if(this.lastProgress>0.9&&newT<0.1)this.laps++;
      this.lastProgress=newT;
    } else {
      this.framesSinceProgress++;
      if(delta<-0.001)this.fitness-=8;
    }
    if(this.framesSinceProgress>140){this.alive=false;return;}
    this.fitness=this.laps*1000+this.progress*500+this.frames*0.01;
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
window.addEventListener('resize',resize); resize();

// ── Tile rendering ─────────────────────────────────

function drawStraightTile(cx,cy,ts,rh,isVert,isFinish){
  gx.save();
  if(isVert){gx.translate(cx,cy);gx.rotate(Math.PI/2);gx.translate(-cx,-cy);}

  const curbH=Math.max(3,rh*0.22);
  const stripes=5, sw=ts/stripes;

  // Asphalt
  gx.fillStyle='#1b1b21';
  gx.fillRect(cx-ts/2, cy-rh, ts, rh*2);

  // Directional shadow — south edge slightly darker
  gx.fillStyle='rgba(0,0,0,0.13)';
  gx.fillRect(cx-ts/2, cy+rh*0.45, ts, rh*0.55);

  // Warm NW highlight
  gx.fillStyle='rgba(255,210,120,0.04)';
  gx.fillRect(cx-ts/2, cy-rh, ts, rh*0.55);

  if(isFinish){
    // Checkered black/white pattern across full road
    const ck=Math.max(4, rh*0.38);
    const cols=Math.ceil(ts/ck), rows=Math.ceil(rh*2/ck);
    gx.save();
    gx.beginPath(); gx.rect(cx-ts/2,cy-rh,ts,rh*2); gx.clip();
    for(let ci=0;ci<cols;ci++)
      for(let ri=0;ri<rows;ri++){
        gx.fillStyle=(ci+ri)%2===0?'#ffffff':'#111111';
        gx.fillRect(cx-ts/2+ci*ck, cy-rh+ri*ck, ck, ck);
      }
    gx.restore();
    // Red start poles (top-down view: elongated cylinders outside curb)
    gx.fillStyle='#dd1111';
    gx.beginPath(); gx.ellipse(cx-ts/2+ts*0.08, cy-rh-6, 4, 6, 0, 0, TWO_PI); gx.fill();
    gx.beginPath(); gx.ellipse(cx-ts/2+ts*0.08, cy+rh+6, 4, 6, 0, 0, TWO_PI); gx.fill();
    // thin white start line through pole
    gx.strokeStyle='rgba(255,255,255,0.7)'; gx.lineWidth=1.5;
    gx.beginPath(); gx.moveTo(cx-ts/2+ts*0.08,cy-rh); gx.lineTo(cx-ts/2+ts*0.08,cy+rh); gx.stroke();
  } else {
    // Curb stripes — top
    for(let i=0;i<stripes;i++){
      gx.fillStyle=i%2===0?'#cc1f1f':'#eeeeee';
      gx.fillRect(cx-ts/2+i*sw, cy-rh, sw, curbH);
    }
    // Curb stripes — bottom
    for(let i=0;i<stripes;i++){
      gx.fillStyle=i%2===0?'#cc1f1f':'#eeeeee';
      gx.fillRect(cx-ts/2+i*sw, cy+rh-curbH, sw, curbH);
    }
    // Center dashes
    gx.save();
    gx.setLineDash([ts*0.12, ts*0.14]);
    gx.strokeStyle='rgba(255,255,255,0.42)';
    gx.lineWidth=Math.max(1,ts*0.022);
    gx.beginPath(); gx.moveTo(cx-ts/2,cy); gx.lineTo(cx+ts/2,cy); gx.stroke();
    gx.restore();
  }
  gx.restore();
}

function drawCornerTile(cx,cy,ts,rh,mask){
  const h=ts/2;
  let acx,acy,a0,a1;
  if     (mask===9 ){acx=cx-h;acy=cy-h;a0=0;           a1=Math.PI/2;}    // NW corner (N+W)
  else if(mask===3 ){acx=cx+h;acy=cy-h;a0=Math.PI/2;  a1=Math.PI;}      // NE corner (N+E)
  else if(mask===6 ){acx=cx+h;acy=cy+h;a0=Math.PI;    a1=3*Math.PI/2;}  // SE corner (S+E)
  else if(mask===12){acx=cx-h;acy=cy+h;a0=3*Math.PI/2;a1=TWO_PI;}       // SW corner (S+W)
  else return;

  const R1=Math.max(0,h-rh), R2=h+rh;
  const curbH=Math.max(2,rh*0.22);
  const span=a1-a0;

  // Asphalt annulus sector
  gx.beginPath();
  gx.arc(acx,acy,R2,a0,a1);
  gx.arc(acx,acy,R1,a1,a0,true);
  gx.closePath();
  gx.fillStyle='#1b1b21'; gx.fill();

  // Directional shadow on SE-facing outer arc
  gx.beginPath();
  gx.arc(acx,acy,R2,a0,a1);
  gx.arc(acx,acy,R2-curbH*0.7,a1,a0,true);
  gx.closePath();
  gx.fillStyle='rgba(0,0,0,0.11)'; gx.fill();

  // Warm highlight on NW-facing inner arc
  if(R1>0){
    gx.beginPath();
    gx.arc(acx,acy,R1+Math.min(curbH,R1*0.8),a0,a1);
    gx.arc(acx,acy,R1,a1,a0,true);
    gx.closePath();
    gx.fillStyle='rgba(255,220,120,0.05)'; gx.fill();
  }

  // Outer curb stripes (on outer edge)
  const arcLen=R2*span;
  const numS=Math.max(3,Math.round(arcLen/(T*0.5*0.1)));
  for(let i=0;i<numS;i++){
    const sa=a0+(i/numS)*span, ea=a0+((i+1)/numS)*span;
    gx.beginPath();
    gx.arc(acx,acy,R2,sa,ea);
    gx.arc(acx,acy,R2-curbH,ea,sa,true);
    gx.closePath();
    gx.fillStyle=i%2===0?'#cc1f1f':'#eeeeee'; gx.fill();
  }

  // Inner curb (white tint, single band)
  if(R1>2){
    gx.beginPath();
    gx.arc(acx,acy,R1+Math.min(curbH*0.7,R1),a0,a1);
    gx.arc(acx,acy,R1,a1,a0,true);
    gx.closePath();
    gx.fillStyle='rgba(255,255,255,0.12)'; gx.fill();
  }

  // Center dash arc
  gx.save();
  gx.setLineDash([T*0.5*0.1, T*0.5*0.12]);
  gx.strokeStyle='rgba(255,255,255,0.4)';
  gx.lineWidth=Math.max(1,(T/64)*1.4);
  gx.beginPath(); gx.arc(acx,acy,(R1+R2)/2,a0,a1); gx.stroke();
  gx.restore();
}

function drawTrack(W,H,scale,ox,oy){
  const ts=T*scale, rh=TRACK_WIDTH*scale;

  // === GRASS BACKGROUND ===
  gx.fillStyle='#2b5f24'; gx.fillRect(0,0,W,H);

  // Subtle grass texture variation
  gx.fillStyle='rgba(30,70,20,0.18)';
  const patches=[[0.05,0.06,0.32,0.28],[0.55,0.02,0.38,0.22],[0.12,0.62,0.28,0.35],
                  [0.62,0.55,0.34,0.4],[0.3,0.28,0.18,0.44]];
  for(const [fx,fy,fw,fh] of patches)
    gx.fillRect(W*fx,H*fy,W*fw,H*fh);

  gx.fillStyle='rgba(60,100,30,0.07)';
  const light=[[0.0,0.0,0.55,0.5],[0.45,0.5,0.55,0.5]];
  for(const [fx,fy,fw,fh] of light)
    gx.fillRect(W*fx,H*fy,W*fw,H*fh);

  // Grid overlay aligned to tile grid
  gx.strokeStyle='rgba(0,0,0,0.07)'; gx.lineWidth=0.5;
  const gox=((ox+GRID_ORIGIN.x*scale)%ts+ts)%ts;
  const goy=((oy+GRID_ORIGIN.y*scale)%ts+ts)%ts;
  for(let x=gox-ts;x<W;x+=ts){gx.beginPath();gx.moveTo(x,0);gx.lineTo(x,H);gx.stroke();}
  for(let y=goy-ts;y<H;y+=ts){gx.beginPath();gx.moveTo(0,y);gx.lineTo(W,y);gx.stroke();}

  // Warm directional sun from NW
  const sun=gx.createLinearGradient(0,0,W*0.55,H*0.55);
  sun.addColorStop(0,'rgba(255,200,80,0.05)');
  sun.addColorStop(1,'rgba(20,50,80,0.06)');
  gx.fillStyle=sun; gx.fillRect(0,0,W,H);

  // === TRACK TILES ===
  for(const cell of cellMap){
    const ctr=cellCenter(cell.c,cell.r);
    const scx=ox+ctr.x*scale, scy=oy+ctr.y*scale;
    const isFinish=(cell.c===2&&cell.r===1);
    if(cell.mask===10||cell.mask===5)
      drawStraightTile(scx,scy,ts,rh,cell.mask===5,isFinish);
    else
      drawCornerTile(scx,scy,ts,rh,cell.mask);
  }

  // === FOG VIGNETTE (depth) ===
  const fog=gx.createRadialGradient(W/2,H/2,Math.min(W,H)*0.28,W/2,H/2,Math.max(W,H)*0.74);
  fog.addColorStop(0,'rgba(0,0,0,0)');
  fog.addColorStop(0.6,'rgba(5,15,5,0.06)');
  fog.addColorStop(1,'rgba(5,15,5,0.44)');
  gx.fillStyle=fog; gx.fillRect(0,0,W,H);
}

// ── Car rendering ──────────────────────────────────
function drawCars(cars,scale,ox,oy){
  cars.forEach(c=>{
    if(!c.alive)return;
    const sx=ox+c.x*scale, sy=oy+c.y*scale;
    gx.save(); gx.translate(sx,sy); gx.rotate(c.angle);
    gx.globalAlpha=0.28; gx.fillStyle=c.color;
    gx.fillRect(-8*scale,-4*scale,16*scale,8*scale);
    gx.globalAlpha=1; gx.restore();
  });
}

function drawBestCar(car,scale,ox,oy){
  if(!car||!car.alive)return;
  const sx=ox+car.x*scale, sy=oy+car.y*scale;
  car.getRays().forEach((t,i)=>{
    const a=car.angle+RAY_OFFSETS[i];
    gx.strokeStyle=`rgba(255,204,0,${0.1+(1-t)*0.28})`; gx.lineWidth=0.8;
    gx.beginPath(); gx.moveTo(sx,sy);
    gx.lineTo(sx+Math.cos(a)*180*t*scale, sy+Math.sin(a)*180*t*scale);
    gx.stroke();
  });
  gx.save(); gx.translate(sx,sy); gx.rotate(car.angle);
  const g=gx.createRadialGradient(0,0,1,0,0,16*scale);
  g.addColorStop(0,car.color+'55'); g.addColorStop(1,'transparent');
  gx.fillStyle=g; gx.beginPath(); gx.arc(0,0,16*scale,0,TWO_PI); gx.fill();
  gx.fillStyle=car.color; gx.fillRect(-10*scale,-5*scale,20*scale,10*scale);
  gx.fillStyle='#000'; gx.fillRect(4*scale,-3*scale,4*scale,3*scale);
  gx.fillRect(4*scale,0,4*scale,3*scale);
  gx.restore();
}

// ── Side panels ────────────────────────────────────
function drawRadar(car){
  const W=radar.width,H=radar.height;
  rx2.fillStyle='#06060e'; rx2.fillRect(0,0,W,H);
  if(!car)return;
  const labels=['TurnL','TurnR','Gas'];
  car.outputs.forEach((v,i)=>{
    const bh=(H-36)*v;
    rx2.fillStyle=i===0?'#ffcc0044':i===1?'#4488ff44':'#00ff8844';
    rx2.fillRect(12+i*(W-24)/3,H-18-bh,(W-24)/3-4,bh);
    rx2.strokeStyle=i===0?'#ffcc00':i===1?'#4488ff':'#00ff88'; rx2.lineWidth=0.8;
    rx2.strokeRect(12+i*(W-24)/3,H-18-bh,(W-24)/3-4,bh);
    rx2.fillStyle='#334433'; rx2.font='8px Courier New'; rx2.textAlign='center';
    rx2.fillText(labels[i],12+i*(W-24)/3+(W-24)/6-2,H-6);
  });
  rx2.fillStyle='#1a3a1a'; rx2.font='9px Courier New'; rx2.textAlign='left';
  rx2.fillText('OUTPUTS',10,12);
}

function drawFitnessChart(hist){
  const W=rewardC.width,H=rewardC.height;
  rc2.fillStyle='#06060e'; rc2.fillRect(0,0,W,H);
  rc2.fillStyle='#1a3a1a'; rc2.font='9px Courier New'; rc2.textAlign='left';
  rc2.fillText('FITNESS / GEN',10,12);
  if(hist.length<2)return;
  const pts=hist.slice(-50), maxV=Math.max(...pts)||1;
  rc2.strokeStyle='#ffcc0077'; rc2.lineWidth=1.5; rc2.beginPath();
  pts.forEach((v,i)=>{
    const x=10+(i/(pts.length-1))*(W-20), y=H-10-(v/maxV)*(H-24);
    i===0?rc2.moveTo(x,y):rc2.lineTo(x,y);
  });
  rc2.stroke();
}

// ── Main loop ─────────────────────────────────────
const neat=new NEAT();
let cars=neat.genomes.map((g,i)=>new Car(g,i));
let simSpeed=2, bestHist=[], bestLap=0;

document.getElementById('speed').addEventListener('input',e=>{
  simSpeed=parseInt(e.target.value);
  document.getElementById('speed-val').textContent=simSpeed+'x';
});

function getBest(){
  const alive=cars.filter(c=>c.alive);
  const pool=alive.length?alive:cars;
  return pool.reduce((a,b)=>b.fitness>a.fitness?b:a);
}

function loop(){
  if(_paused){requestAnimationFrame(loop);return;}
  requestAnimationFrame(loop);
  for(let k=0;k<simSpeed;k++){
    cars.forEach(c=>c.step());
    if(cars.every(c=>!c.alive)){
      const best=getBest();
      bestHist.push(best.fitness);
      if(best.laps>bestLap)bestLap=best.laps;
      neat.evolve(cars);
      cars=neat.genomes.map((g,i)=>new Car(g,i));
    }
  }
  const W=gc.width, H=gc.height;
  const scale=Math.min(W/800,H/600);
  const ox=(W-800*scale)/2, oy=(H-600*scale)/2;
  drawTrack(W,H,scale,ox,oy);
  drawCars(cars,scale,ox,oy);
  const best=getBest();
  drawBestCar(best,scale,ox,oy);
  drawRadar(best);
  drawFitnessChart(bestHist);
  if(typeof NNDraw!=='undefined')NNDraw.draw(best);
  document.getElementById('s-gen').textContent=neat.generation;
  document.getElementById('s-alive').textContent=cars.filter(c=>c.alive).length;
  document.getElementById('s-lap').textContent=bestLap;
  document.getElementById('s-fit').textContent=best?Math.floor(best.fitness):0;
}
loop();

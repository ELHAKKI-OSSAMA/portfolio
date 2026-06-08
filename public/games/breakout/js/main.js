// Breakout DQN v3.1 — main.js
// Fixes:
//  • getState() no longer allocates array (bricks.filter removed — uses counter)
//  • resizeCanvases() uses card clientHeight minus label height (20px)
//  • drawQ() uses real agent.lastQ Float32Array directly
//  • Training budget scales with simSpeed so high speeds still learn well
'use strict';

const GW=280,GH=400,ROWS=5,COLS=7,BH=14,BP=4,PW=52,PH=8,BR=5;
const BRICK_COLORS=['#ff44cc','#cc44ff','#4488ff','#44ffcc','#ffcc44'];

const gc=document.getElementById('game-canvas');
const gx=gc.getContext('2d',{alpha:false});
const qc=document.getElementById('q-canvas');
const qx=qc.getContext('2d',{alpha:false});
const ec=document.getElementById('eps-canvas');
const ex=ec.getContext('2d',{alpha:false});
const nc=document.getElementById('nn-canvas');

let simSpeed=4;
document.getElementById('speed').addEventListener('input',e=>{
  simSpeed=parseInt(e.target.value);
  document.getElementById('speed-val').textContent=simSpeed+'x';
});

// ─── Agent — sync on main thread ─────────────────────────────────────────────
const agent=new BreakoutAgent();

// ─── Graduation condition ─────────────────────────────────────────────────────
// Stop training once agent breaks ≥75% of bricks in 4 separate episodes
const TOTAL_BRICKS = ROWS*COLS;           // 35
const GRAD_THRESHOLD = Math.ceil(TOTAL_BRICKS*0.75); // 27
const GRAD_REQUIRED  = 4;
let graduationCount  = 0;
let graduated        = false;
let gradOverlay      = null;

function checkGraduation(bricksDestroyed){
  if(graduated) return;
  if(bricksDestroyed>=GRAD_THRESHOLD){
    graduationCount++;
    // Flash the stat
    const el=document.getElementById('s-grad');
    if(el) el.textContent=graduationCount+'/'+GRAD_REQUIRED;
    if(graduationCount>=GRAD_REQUIRED){
      graduated=true;
      _showGradOverlay();
    }
  }
}

function _showGradOverlay(){
  if(gradOverlay) return;
  // Pause the game so the overlay isn't hiding a running (possibly mid-fail) episode
  _setPaused(true);
  gradOverlay=document.createElement('div');
  Object.assign(gradOverlay.style,{
    position:'fixed',inset:'0',
    background:'rgba(0,0,0,0.88)',
    display:'flex',flexDirection:'column',
    alignItems:'center',justifyContent:'center',
    zIndex:'9998',fontFamily:"'Courier New',monospace",
    pointerEvents:'all',
    gap:'0'
  });
  gradOverlay.innerHTML=`
    <div style="color:#00ff88;font-size:clamp(20px,4vw,40px);letter-spacing:6px;font-weight:bold;text-shadow:0 0 40px #00ff8877;margin-bottom:10px">TRAINING COMPLETE</div>
    <div style="color:#2a4a3a;font-size:11px;letter-spacing:3px;margin-bottom:6px">AGENT BROKE 75%+ BRICKS × ${GRAD_REQUIRED} TIMES</div>
    <div style="color:#1a3a2a;font-size:10px;letter-spacing:2px;margin-bottom:32px">TRAINING STOPPED — POLICY FROZEN</div>
    <button id="grad-continue-btn" style="
      background:transparent;
      border:1px solid #00ff88;
      color:#00ff88;
      font-family:'Courier New',monospace;
      font-size:13px;
      letter-spacing:4px;
      padding:12px 36px;
      cursor:pointer;
      text-transform:uppercase;
      transition:background 0.15s;
    ">▶ CONTINUE WATCHING</button>
  `;
  document.body.appendChild(gradOverlay);

  const btn=document.getElementById('grad-continue-btn');
  btn.addEventListener('mouseenter',()=>{ btn.style.background='rgba(0,255,136,0.1)'; });
  btn.addEventListener('mouseleave',()=>{ btn.style.background='transparent'; });
  btn.addEventListener('click',()=>{
    gradOverlay.remove();
    gradOverlay=null;
    // Reset to a clean episode so agent starts fresh with its frozen policy
    resetGame();
    // Unpause — game resumes from a clean state
    _setPaused(false);
  });
}

// ─── Game state ───────────────────────────────────────────────────────────────
let episode=1,epScore=0,bestScore=0;
let epBricksDestroyed=0;
let padX=GW/2,ballX=GW/2,ballY=GH*0.6;
let bvx=2.5*(Math.random()<0.5?1:-1),bvy=-3;
let ballTrail=[];
let bricks=[];
let aliveBricks=0; // track count without .filter()

function makeBricks(){
  bricks=[];
  const bw=(GW-BP*(COLS+1))/COLS;
  for(let r=0;r<ROWS;r++)
    for(let c=0;c<COLS;c++)
      bricks.push({x:BP+(bw+BP)*c,y:40+r*(BH+BP),w:bw,h:BH,alive:true,row:r,col:c});
  aliveBricks=ROWS*COLS;
}

function predictLanding(){
  let px=ballX,py=ballY,pvx=bvx,pvy=bvy;
  for(let i=0;i<220;i++){
    px+=pvx; py+=pvy;
    if(px-BR<0){px=BR;pvx=Math.abs(pvx);}
    if(px+BR>GW){px=GW-BR;pvx=-Math.abs(pvx);}
    if(py-BR<0){py=BR;pvy=Math.abs(pvy);}
    if(py>=GH-20-BR) return px;  // paddle top
  }
  return px;
}

// Per-column alive counters — updated on brick kill, not recomputed each step
const _colA=new Int32Array(COLS);
const _colT=new Int32Array(COLS);
const _stateBuf=new Float32Array(16);

function rebuildColCounts(){
  _colA.fill(0); _colT.fill(0);
  for(const br of bricks){
    _colT[br.col]++;
    if(br.alive) _colA[br.col]++;
  }
}

function getState(landX){
  let nearY=0;
  for(const br of bricks){
    if(br.alive&&(br.y+br.h)/GH>nearY) nearY=(br.y+br.h)/GH;
  }
  _stateBuf[0]=ballX/GW;     _stateBuf[1]=ballY/GH;
  _stateBuf[2]=bvx/5;        _stateBuf[3]=bvy/5;
  _stateBuf[4]=padX/GW;      _stateBuf[5]=(ballX-padX)/GW;
  _stateBuf[6]=bvx>0?1:0;    _stateBuf[7]=bvy>0?1:0;
  _stateBuf[8] =(_colA[0]+_colA[1])/(_colT[0]+_colT[1]);
  _stateBuf[9] =(_colA[2]+_colA[3])/(_colT[2]+_colT[3]);
  _stateBuf[10]=(_colA[4]+_colA[5])/(_colT[4]+_colT[5]);
  _stateBuf[11]=_colA[6]/_colT[6];
  _stateBuf[12]=nearY;
  _stateBuf[13]=aliveBricks/(ROWS*COLS);
  _stateBuf[14]=landX/GW;
  _stateBuf[15]=(landX-padX)/GW;
  return _stateBuf;
}

function resetBall(){
  ballX=GW/2; ballY=GH*0.6;
  bvx=2.5*(Math.random()<0.5?1:-1); bvy=-3;
  ballTrail=[];
}
function resetGame(){
  makeBricks(); rebuildColCounts();
  resetBall(); padX=GW/2; epScore=0; epBricksDestroyed=0;
}

// ─── Physics + agent ──────────────────────────────────────────────────────────

function gameStep(){
  const landX=predictLanding();
  const s=getState(landX).slice(); // copy — pushed into replay buffer

  const a=agent.act(s);
  const spd=5;
  if(a===0) padX=Math.max(PW/2,padX-spd);
  else if(a===2) padX=Math.min(GW-PW/2,padX+spd);

  ballTrail.push({x:ballX,y:ballY});
  if(ballTrail.length>12) ballTrail.shift();
  ballX+=bvx; ballY+=bvy;

  if(ballX-BR<0){ballX=BR;bvx=Math.abs(bvx);}
  if(ballX+BR>GW){ballX=GW-BR;bvx=-Math.abs(bvx);}
  if(ballY-BR<0){ballY=BR;bvy=Math.abs(bvy);}

  let reward=0,done=false;

  const PAD_TOP=GH-20;
  const PAD_BOT=GH-20+PH;
  const hitPaddle=
    bvy>0 &&                                    // moving downward
    ballY+BR >= PAD_TOP &&                      // reached paddle top
    ballY-BR <= PAD_BOT &&                      // not fully past paddle bottom
    Math.abs(ballX-padX) < PW/2+BR;            // within paddle width

  if(hitPaddle){
    // Eject above paddle surface so ball never sits inside it
    ballY = PAD_TOP - BR - 0.5;
    bvx  += (ballX-padX)/PW*2;
    const sp=Math.sqrt(bvx*bvx+bvy*bvy);
    bvx=bvx/sp*3.5; bvy=-Math.abs(bvy/sp*3.5); // always reflect UP
    reward=0.8+0.6*(1-Math.abs(ballX-padX)/(PW/2));
  } else if(ballY>GH){
    reward=-2; done=true;
  } else {
    // Continuous tracking reward using already-computed landX
    reward=0.002-Math.abs(landX-padX)/GW*0.005;
  }

  for(const br of bricks){
    if(!br.alive) continue;
    if(ballX>br.x&&ballX<br.x+br.w&&ballY-BR<br.y+br.h&&ballY+BR>br.y){
      br.alive=false; bvy*=-1;
      _colA[br.col]--;
      aliveBricks--;
      epBricksDestroyed++;
      reward=1.5+(ROWS-br.row)*0.6;
      epScore+=10*(br.row+1);
      break;
    }
  }

  if(aliveBricks===0){reward=5;done=true;}

  const ns=getState(predictLanding()).slice();
  // Only push & train before graduation — post-graduation buffer pollution
  // corrupts PER priorities since those transitions are never learned from
  if(!graduated){
    agent.push(s,a,reward,ns,done);
    agent.maybeTrain();
  }

  if(done){
    if(epScore>bestScore) bestScore=epScore;
    agent.scoreHist.push(epScore);
    checkGraduation(epBricksDestroyed);
    episode++; agent.episode=episode;
    resetGame();
  }
}

// Training: agent throttles internally (every 8 physics steps) — STOPS when graduated
function runTraining(){
  if(graduated) return;
  // maybeTrain() is already called inside gameStep via agent.maybeTrain()
  // This is kept as a no-op hook for future use
}

// ─── Canvas resize ────────────────────────────────────────────────────────────
function resizeCanvases(){
  gc.width=GW; gc.height=GH;
  function sizeCard(canvas){
    const card=canvas.closest('.side-card')||canvas.parentElement;
    const label=card.querySelector('.card-label');
    const labelH=label?label.offsetHeight:20;
    canvas.width=card.clientWidth||200;
    canvas.height=Math.max(40,(card.clientHeight||120)-labelH);
  }
  sizeCard(qc); sizeCard(ec); sizeCard(nc);
  NNDraw.resize();
}
window.addEventListener('resize',resizeCanvases);
setTimeout(resizeCanvases,60);

// ─── Draw game ────────────────────────────────────────────────────────────────
function drawGame(){
  gx.fillStyle='#06060e'; gx.fillRect(0,0,GW,GH);

  for(const b of bricks){
    if(!b.alive) continue;
    const col=BRICK_COLORS[b.row%BRICK_COLORS.length];
    gx.fillStyle=col+'33'; gx.fillRect(b.x,b.y,b.w,b.h);
    gx.strokeStyle=col; gx.lineWidth=1; gx.strokeRect(b.x,b.y,b.w,b.h);
  }

  if(bvy>0){
    const lx=predictLanding();
    gx.fillStyle='rgba(255,68,204,0.09)';
    gx.fillRect(lx-PW/2,GH-20,PW,PH);
  }

  gx.fillStyle='rgba(255,68,204,0.06)';
  gx.fillRect(padX-PW/2-8,GH-22,PW+16,18);
  gx.fillStyle='#ff44cc';
  gx.beginPath();
  if(gx.roundRect) gx.roundRect(padX-PW/2,GH-20,PW,PH,3);
  else gx.rect(padX-PW/2,GH-20,PW,PH);
  gx.fill();

  for(let i=0;i<ballTrail.length;i++){
    const t=(i+1)/ballTrail.length;
    gx.fillStyle=`rgba(255,68,204,${(t*0.22).toFixed(2)})`;
    gx.beginPath(); gx.arc(ballTrail[i].x,ballTrail[i].y,BR*t,0,Math.PI*2); gx.fill();
  }
  gx.fillStyle='#ff88ee';
  gx.beginPath(); gx.arc(ballX,ballY,BR,0,Math.PI*2); gx.fill();
}

// ─── Draw Q-values ────────────────────────────────────────────────────────────
function drawQ(){
  const W=qc.width,H=qc.height;
  if(W<10||H<10) return;
  qx.fillStyle='#06060e'; qx.fillRect(0,0,W,H);
  const q=agent.lastQ;
  const labels=['◄','●','►'];
  let mx=0;
  for(let i=0;i<3;i++) if(Math.abs(q[i])>mx) mx=Math.abs(q[i]);
  if(!mx) mx=1;
  let best=0; for(let i=1;i<3;i++) if(q[i]>q[best]) best=i;
  const bw=(W-16)/3;
  for(let i=0;i<3;i++){
    const bh=(H-28)*Math.abs(q[i])/mx;
    const x=8+i*bw;
    qx.fillStyle=i===best?'#ff44cc22':'#0d0614';
    qx.fillRect(x,H-20-bh,bw-4,bh);
    qx.strokeStyle=i===best?'#ff44cc':'#1a0a2a';
    qx.lineWidth=0.8; qx.strokeRect(x,H-20-bh,bw-4,bh);
    qx.fillStyle=i===best?'#ff44cc':'#443344';
    qx.font='9px Courier New'; qx.textAlign='center'; qx.textBaseline='alphabetic';
    qx.fillText(labels[i],x+bw/2-2,H-5);
    qx.fillText(q[i].toFixed(2),x+bw/2-2,H-20-bh-4);
  }
  qx.fillStyle='#2a1a2a'; qx.font='9px Courier New'; qx.textAlign='left';
  qx.fillText('Q-VALUES',6,11);
}

// ─── Draw epsilon / score history ─────────────────────────────────────────────
function drawEps(){
  const W=ec.width,H=ec.height;
  if(W<10||H<10) return;
  ex.fillStyle='#06060e'; ex.fillRect(0,0,W,H);

  const eps=agent.epsHist.slice(-120);
  if(eps.length>1){
    ex.strokeStyle='#ff44cc55'; ex.lineWidth=1.2; ex.beginPath();
    for(let i=0;i<eps.length;i++){
      const x=6+(i/(eps.length-1))*(W-12);
      const y=H-6-eps[i]*(H-18);
      i===0?ex.moveTo(x,y):ex.lineTo(x,y);
    }
    ex.stroke();
  }
  const sc=agent.scoreHist.slice(-60);
  if(sc.length>1){
    let mxs=0; for(let i=0;i<sc.length;i++) if(sc[i]>mxs) mxs=sc[i];
    if(!mxs) mxs=1;
    ex.strokeStyle='#44ffcc44'; ex.lineWidth=1.2; ex.beginPath();
    for(let i=0;i<sc.length;i++){
      const x=6+(i/(sc.length-1))*(W-12);
      const y=H-6-(sc[i]/mxs)*(H-18);
      i===0?ex.moveTo(x,y):ex.lineTo(x,y);
    }
    ex.stroke();
  }

  ex.fillStyle='#ff44cc66'; ex.font='7px Courier New'; ex.textAlign='left'; ex.textBaseline='top';
  ex.fillText('ε',6,3);
  ex.fillStyle='#44ffcc66';
  ex.fillText('score',14,3);
}

// ─── DOM stats ────────────────────────────────────────────────────────────────
const elEp   =document.getElementById('s-ep');
const elScore=document.getElementById('s-score');
const elBest =document.getElementById('s-best');
const elEps  =document.getElementById('s-eps');
const elSteps=document.getElementById('s-steps');
const elGrad =document.getElementById('s-grad');

function updateStats(){
  elEp.textContent   =episode;
  elScore.textContent=epScore;
  elBest.textContent =bestScore;
  elEps.textContent  =graduated?'DONE':agent.eps.toFixed(3);
  elSteps.textContent=agent.steps;
  elGrad.textContent =graduationCount+'/'+GRAD_REQUIRED;
  if(graduated) elGrad.style.textShadow='0 0 8px #00ff88';
}

// ─── Init ─────────────────────────────────────────────────────────────────────
resetGame();

// ─── Main loop ────────────────────────────────────────────────────────────────
function loop(){
  requestAnimationFrame(loop);
  if(_paused) return;
  for(let i=0;i<simSpeed;i++) gameStep();
  runTraining();
  drawGame(); drawQ(); drawEps(); NNDraw.draw(agent);
  updateStats();
}
loop();

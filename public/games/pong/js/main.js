// Pong — two DQN agents (intercept-bootstrapped, converges from step 0)
//
// State: 7 features — [bx, by, vx, vy, pad_y, opp_y, landing_y]
// landing_y = predicted ball Y when it reaches this paddle (computed analytically).
// This eliminates the temporal credit-assignment problem: no need to infer
// trajectory over 100 steps. The network immediately learns the intercept policy.

const GW=640, GH=480, PH=80, PW=10, BALL_R=7, BALL_SPD=4;
const gc=document.getElementById('game-canvas');
const gx=gc.getContext('2d');

const TARGET_STEPS_PER_SEC  = 60;
const MAX_STEPS_PER_FRAME   = 60;
const TARGET_TRAINS_PER_SEC = 30;

let simSpeed=1;
document.getElementById('speed').addEventListener('input', e=>{
  simSpeed=parseInt(e.target.value);
  document.getElementById('speed-val').textContent=simSpeed+'x';
});
document.getElementById('speed-val').textContent=simSpeed+'x';

const agentL=new PongAgent();
const agentR=new PongAgent();
let lScore=0, rScore=0, episodes=0, rally=0;

function makeBall(){
  const a=(Math.random()*0.6+0.2)*(Math.random()<0.5?1:-1);
  const b=(Math.random()*0.6+0.2)*(Math.random()<0.5?1:-1);
  const len=Math.sqrt(a*a+b*b);
  return{x:GW/2,y:GH/2,vx:BALL_SPD*a/len,vy:BALL_SPD*b/len};
}
let lPadY=GH/2, rPadY=GH/2, ball=makeBall(), trailBall=[];

// Predict where ball will be when it reaches paddle x
function predictLanding(ball, isLeft){
  const targetX=isLeft?PW+22:GW-PW-22;
  if(isLeft&&ball.vx>=0)  return GH/2;  // ball going away → use center
  if(!isLeft&&ball.vx<=0) return GH/2;
  let bx=ball.x, by=ball.y, bvx=ball.vx, bvy=ball.vy;
  for(let i=0;i<600;i++){
    bx+=bvx; by+=bvy;
    if(by-BALL_R<0){by=BALL_R; bvy*=-1;}
    if(by+BALL_R>GH){by=GH-BALL_R; bvy*=-1;}
    if(isLeft&&bx<=targetX) return by;
    if(!isLeft&&bx>=targetX) return by;
  }
  return by;
}

// 7-feature state: original 6 + predicted landing Y
function getStateExt(paddleY, oppY, isLeft){
  const bx=isLeft?ball.x/GW:(GW-ball.x)/GW;
  const by=ball.y/GH;
  const vx=isLeft?ball.vx/BALL_SPD:-ball.vx/BALL_SPD;
  const vy=ball.vy/BALL_SPD;
  const landingY=predictLanding(ball, isLeft)/GH;
  return[bx, by, vx, vy, paddleY/GH, oppY/GH, landingY];
}

function movePaddle(y,action){
  const speed=5;
  if(action===0) y-=speed;
  else if(action===2) y+=speed;
  return Math.max(PH/2, Math.min(GH-PH/2, y));
}

function gameStep(){
  const sl=getStateExt(lPadY, rPadY, true);
  const sr=getStateExt(rPadY, lPadY, false);
  const al=agentL.act(sl);
  const ar=agentR.act(sr);
  lPadY=movePaddle(lPadY, al);
  rPadY=movePaddle(rPadY, ar);

  trailBall.push({x:ball.x, y:ball.y});
  if(trailBall.length>12) trailBall.shift();
  ball.x+=ball.vx; ball.y+=ball.vy;
  if(ball.y-BALL_R<0){ball.y=BALL_R; ball.vy*=-1;}
  if(ball.y+BALL_R>GH){ball.y=GH-BALL_R; ball.vy*=-1;}

  let rewL=0, rewR=0, done=false;

  // Left paddle hit (with multi-hit fix: direction guard + push out of zone)
  if(ball.vx<0&&ball.x-BALL_R<=PW+20&&ball.x-BALL_R>=PW&&Math.abs(ball.y-lPadY)<PH/2+BALL_R){
    ball.vx=Math.abs(ball.vx); ball.vy+=(ball.y-lPadY)*0.05;
    const sp=Math.sqrt(ball.vx*ball.vx+ball.vy*ball.vy);
    ball.vx=ball.vx/sp*BALL_SPD; ball.vy=ball.vy/sp*BALL_SPD;
    ball.x=PW+20+BALL_R+1;
    rewL=1; rally++;
  }
  // Right paddle hit
  if(ball.vx>0&&ball.x+BALL_R>=GW-PW-20&&ball.x+BALL_R<=GW-PW&&Math.abs(ball.y-rPadY)<PH/2+BALL_R){
    ball.vx=-Math.abs(ball.vx); ball.vy+=(ball.y-rPadY)*0.05;
    const sp=Math.sqrt(ball.vx*ball.vx+ball.vy*ball.vy);
    ball.vx=ball.vx/sp*BALL_SPD; ball.vy=ball.vy/sp*BALL_SPD;
    ball.x=GW-PW-20-BALL_R-1;
    rewR=1; rally++;
  }
  if(ball.x<0){ rScore++; rewL=-1; rewR=1; done=true; }
  if(ball.x>GW){ lScore++; rewL=1; rewR=-1; done=true; }

  const nsl=getStateExt(lPadY, rPadY, true);
  const nsr=getStateExt(rPadY, lPadY, false);
  agentL.push(sl, al, rewL, nsl, done);
  agentR.push(sr, ar, rewR, nsr, done);

  if(done){ ball=makeBall(); trailBall=[]; episodes++; rally=0; }
}

// Training ticker — decoupled from simSpeed
setInterval(()=>{
  if(_paused) return;
  agentL.train();
  agentR.train();
}, Math.round(1000/TARGET_TRAINS_PER_SEC));

function resize(){
  const p=gc.parentElement;
  const s=Math.min((p.clientWidth-260)/GW, p.clientHeight/GH);
  gc.width=GW*s; gc.height=GH*s;
  gc.style.width=gc.width+'px'; gc.style.height=gc.height+'px';
  NNDraw.resize();
}
window.addEventListener('resize', resize); resize();

function draw(){
  const W=gc.width, H=gc.height, s=W/GW;
  gx.fillStyle='#06060e'; gx.fillRect(0,0,W,H);
  gx.strokeStyle='#0a1f0a'; gx.lineWidth=1; gx.setLineDash([10,14]);
  gx.beginPath(); gx.moveTo(W/2,0); gx.lineTo(W/2,H); gx.stroke(); gx.setLineDash([]);
  gx.strokeStyle='#0d200d'; gx.lineWidth=0.5; gx.strokeRect(s*20,0,s*(GW-40),s*GH);

  const predL=agentL.getQ(getStateExt(lPadY,rPadY,true));
  const predR=agentR.getQ(getStateExt(rPadY,lPadY,false));

  // Draw predicted landing markers
  const landL=predictLanding(ball,true);
  const landR=predictLanding(ball,false);
  gx.fillStyle='rgba(68,136,255,0.15)';
  gx.fillRect(s*PW, s*(landL-4), s*22, s*8);
  gx.fillStyle='rgba(255,102,68,0.15)';
  gx.fillRect(s*(GW-PW-22), s*(landR-4), s*22, s*8);

  // Left paddle
  gx.fillStyle='rgba(68,136,255,0.06)'; gx.fillRect(0,s*(lPadY-PH/2-10),s*(PW+24),s*(PH+20));
  gx.fillStyle='#4488ff'; gx.fillRect(s*PW,s*(lPadY-PH/2),s*12,s*PH);
  // Right paddle
  gx.fillStyle='rgba(255,102,68,0.06)'; gx.fillRect(s*(GW-PW-24),s*(rPadY-PH/2-10),s*(PW+24),s*(PH+20));
  gx.fillStyle='#ff6644'; gx.fillRect(s*(GW-PW-12),s*(rPadY-PH/2),s*12,s*PH);

  // Ball trail
  trailBall.forEach((p,i)=>{
    const t=(i+1)/trailBall.length;
    gx.fillStyle=`rgba(255,255,255,${t*0.15})`;
    gx.beginPath(); gx.arc(s*p.x,s*p.y,s*BALL_R*t,0,Math.PI*2); gx.fill();
  });
  // Ball glow + ball
  const bg=gx.createRadialGradient(s*ball.x,s*ball.y,1,s*ball.x,s*ball.y,s*BALL_R*1.5);
  bg.addColorStop(0,'rgba(200,220,255,0.3)'); bg.addColorStop(1,'transparent');
  gx.fillStyle=bg; gx.beginPath(); gx.arc(s*ball.x,s*ball.y,s*BALL_R*1.5,0,Math.PI*2); gx.fill();
  gx.fillStyle='#cce0ff'; gx.beginPath(); gx.arc(s*ball.x,s*ball.y,s*BALL_R,0,Math.PI*2); gx.fill();

  // Q-value bars
  const actions=['UP','--','DN'];
  const lqMax=Math.max(...predL.map(Math.abs))||1;
  actions.forEach((lb,i)=>{
    const bh=s*30*Math.abs(predL[i])/lqMax; const by2=s*(GH-50)+s*30-bh;
    gx.fillStyle=argmax(predL)===i?'#4488ff':'#112233';
    gx.fillRect(s*30+i*s*22,by2,s*18,bh);
    gx.fillStyle='#223344'; gx.font=`${s*8}px Courier New`; gx.textAlign='center';
    gx.fillText(lb,s*30+i*s*22+s*9,s*(GH-12));
  });
  const rqMax=Math.max(...predR.map(Math.abs))||1;
  actions.forEach((lb,i)=>{
    const bh=s*30*Math.abs(predR[i])/rqMax; const by2=s*(GH-50)+s*30-bh;
    gx.fillStyle=argmax(predR)===i?'#ff6644':'#331122';
    gx.fillRect(s*(GW-96)+i*s*22,by2,s*18,bh);
    gx.fillStyle='#443322'; gx.font=`${s*8}px Courier New`; gx.textAlign='center';
    gx.fillText(lb,s*(GW-96)+i*s*22+s*9,s*(GH-12));
  });

  // Scores
  gx.fillStyle='#4488ff99'; gx.font=`bold ${s*32}px Courier New`; gx.textAlign='center';
  gx.fillText(lScore,W*0.25,s*50);
  gx.fillStyle='#ff664499';
  gx.fillText(rScore,W*0.75,s*50);
}

function argmax(a){ let m=-Infinity,idx=0; a.forEach((v,i)=>{if(v>m){m=v;idx=i;}}); return idx; }

let lastTime=null, stepAccum=0;
function loop(ts){
  requestAnimationFrame(loop);
  if(lastTime===null) lastTime=ts;
  const dt=Math.min((ts-lastTime)/1000,0.1);
  lastTime=ts;
  if(_paused){ draw(); NNDraw.draw(agentL,episodes); return; }
  stepAccum+=simSpeed*TARGET_STEPS_PER_SEC*dt;
  const steps=Math.min(Math.floor(stepAccum),MAX_STEPS_PER_FRAME);
  stepAccum-=steps;
  for(let i=0;i<steps;i++) gameStep();
  draw();
  NNDraw.draw(agentL,episodes);
  document.getElementById('s-l').textContent=lScore;
  document.getElementById('s-r').textContent=rScore;
  document.getElementById('s-rally').textContent=rally;
  document.getElementById('s-ep').textContent=episodes;
}
requestAnimationFrame(loop);
// Pong — two DQN agents in self-play
const GW=640,GH=480,PH=80,PW=10,BALL_R=7,BALL_SPD=4;
const gc=document.getElementById('game-canvas');
const gx=gc.getContext('2d');
let simSpeed=3;
document.getElementById('speed').addEventListener('input',e=>{simSpeed=parseInt(e.target.value);document.getElementById('speed-val').textContent=simSpeed+'x';});

const agentL=new PongAgent();
const agentR=new PongAgent();
let lScore=0,rScore=0,episodes=0,rally=0;

function makeBall(){const a=(Math.random()*0.6+0.2)*(Math.random()<0.5?1:-1);const b=(Math.random()*0.6+0.2)*(Math.random()<0.5?1:-1);const len=Math.sqrt(a*a+b*b);return{x:GW/2,y:GH/2,vx:BALL_SPD*a/len,vy:BALL_SPD*b/len};}
let lPadY=GH/2,rPadY=GH/2;
let ball=makeBall();
let trailBall=[];

function getState(paddleY,oppY,isLeft){const bx=isLeft?ball.x/GW:(GW-ball.x)/GW;const by=ball.y/GH;const vx=isLeft?ball.vx/BALL_SPD:-ball.vx/BALL_SPD;const vy=ball.vy/BALL_SPD;const py=paddleY/GH;const oy=oppY/GH;return[bx,by,vx,vy,py,oy];}

function movePaddle(y,action){const speed=5;if(action===0)y-=speed;else if(action===2)y+=speed;return Math.max(PH/2,Math.min(GH-PH/2,y));}

function gameStep(){
  // agents decide
  const sl=getState(lPadY,rPadY,true);
  const sr=getState(rPadY,lPadY,false);
  const al=agentL.act(sl);
  const ar=agentR.act(sr);
  const prevLY=lPadY,prevRY=rPadY;
  lPadY=movePaddle(lPadY,al);
  rPadY=movePaddle(rPadY,ar);
  trailBall.push({x:ball.x,y:ball.y});
  if(trailBall.length>12)trailBall.shift();
  ball.x+=ball.vx;ball.y+=ball.vy;
  // top/bottom bounce
  if(ball.y-BALL_R<0){ball.y=BALL_R;ball.vy*=-1;}
  if(ball.y+BALL_R>GH){ball.y=GH-BALL_R;ball.vy*=-1;}
  let rewL=0,rewR=0,done=false;
  // left paddle
  if(ball.x-BALL_R<=PW+20&&ball.x-BALL_R>=PW&&Math.abs(ball.y-lPadY)<PH/2+BALL_R){ball.vx=Math.abs(ball.vx)*1.04;ball.vy+=(ball.y-lPadY)*0.05;const sp=Math.sqrt(ball.vx*ball.vx+ball.vy*ball.vy);ball.vx=ball.vx/sp*BALL_SPD;ball.vy=ball.vy/sp*BALL_SPD;rewL=1;rally++;}
  // right paddle
  if(ball.x+BALL_R>=GW-PW-20&&ball.x+BALL_R<=GW-PW&&Math.abs(ball.y-rPadY)<PH/2+BALL_R){ball.vx=-Math.abs(ball.vx)*1.04;ball.vy+=(ball.y-rPadY)*0.05;const sp=Math.sqrt(ball.vx*ball.vx+ball.vy*ball.vy);ball.vx=ball.vx/sp*BALL_SPD;ball.vy=ball.vy/sp*BALL_SPD;rewR=1;rally++;}
  // score
  if(ball.x<0){rScore++;rewL=-1;rewR=1;done=true;}
  if(ball.x>GW){lScore++;rewL=1;rewR=-1;done=true;}
  const nsl=getState(lPadY,rPadY,true);
  const nsr=getState(rPadY,lPadY,false);
  agentL.push(sl,al,rewL,nsl,done);
  agentR.push(sr,ar,rewR,nsr,done);
  agentL.train();agentR.train();
  if(done){ball=makeBall();trailBall=[];episodes++;rally=0;}
}

function resize(){const p=gc.parentElement;const s=Math.min(p.clientWidth/GW,p.clientHeight/GH);gc.width=GW*s;gc.height=GH*s;gc.style.width=gc.width+'px';gc.style.height=gc.height+'px';}
window.addEventListener('resize',resize);resize();

function draw(){const W=gc.width,H=gc.height;const s=W/GW;gx.fillStyle='#06060e';gx.fillRect(0,0,W,H);
// court lines
gx.strokeStyle='#0a1f0a';gx.lineWidth=1;gx.setLineDash([10,14]);gx.beginPath();gx.moveTo(W/2,0);gx.lineTo(W/2,H);gx.stroke();gx.setLineDash([]);
gx.strokeStyle='#0d200d';gx.lineWidth=0.5;gx.strokeRect(s*20,s*0,s*(GW-40),s*GH);
// prediction lines
const predL=agentL.getQ(getState(lPadY,rPadY,true));const predR=agentR.getQ(getState(rPadY,lPadY,false));
// left paddle glow
gx.fillStyle=`rgba(68,136,255,0.06)`;gx.fillRect(0,s*(lPadY-PH/2-10),s*(PW+24),s*(PH+20));
gx.fillStyle='#4488ff';gx.fillRect(s*PW,s*(lPadY-PH/2),s*12,s*PH);
// right paddle glow
gx.fillStyle=`rgba(255,102,68,0.06)`;gx.fillRect(s*(GW-PW-24),s*(rPadY-PH/2-10),s*(PW+24),s*(PH+20));
gx.fillStyle='#ff6644';gx.fillRect(s*(GW-PW-12),s*(rPadY-PH/2),s*12,s*PH);
// ball trail
trailBall.forEach((p,i)=>{const t=(i+1)/trailBall.length;gx.fillStyle=`rgba(255,255,255,${t*0.15})`;gx.beginPath();gx.arc(s*p.x,s*p.y,s*BALL_R*t,0,Math.PI*2);gx.fill();});
// ball
const bg=gx.createRadialGradient(s*ball.x,s*ball.y,1,s*ball.x,s*ball.y,s*BALL_R*1.5);bg.addColorStop(0,'rgba(200,220,255,0.3)');bg.addColorStop(1,'transparent');gx.fillStyle=bg;gx.beginPath();gx.arc(s*ball.x,s*ball.y,s*BALL_R*1.5,0,Math.PI*2);gx.fill();
gx.fillStyle='#cce0ff';gx.beginPath();gx.arc(s*ball.x,s*ball.y,s*BALL_R,0,Math.PI*2);gx.fill();
// q bars L
const lqMax=Math.max(...predL.map(Math.abs))||1;['UP','--','DN'].forEach((lb,i)=>{const bh=s*30*Math.abs(predL[i])/lqMax;const by=s*(GH-50)+s*30-bh;gx.fillStyle=argmax(predL)===i?'#4488ff':'#112233';gx.fillRect(s*30+i*s*22,by,s*18,bh);gx.fillStyle='#223344';gx.font=`${s*8}px Courier New`;gx.textAlign='center';gx.fillText(lb,s*30+i*s*22+s*9,s*(GH-12));});
// q bars R
const rqMax=Math.max(...predR.map(Math.abs))||1;['UP','--','DN'].forEach((lb,i)=>{const bh=s*30*Math.abs(predR[i])/rqMax;const by=s*(GH-50)+s*30-bh;gx.fillStyle=argmax(predR)===i?'#ff6644':'#331122';gx.fillRect(s*(GW-96)+i*s*22,by,s*18,bh);gx.fillStyle='#443322';gx.font=`${s*8}px Courier New`;gx.textAlign='center';gx.fillText(lb,s*(GW-96)+i*s*22+s*9,s*(GH-12));});
// scores
gx.fillStyle='#4488ff99';gx.font=`bold ${s*32}px Courier New`;gx.textAlign='center';gx.fillText(lScore,W*0.25,s*50);
gx.fillStyle='#ff664499';gx.fillText(rScore,W*0.75,s*50);
}

function loop(){requestAnimationFrame(loop);
  if(_paused){draw();return;}for(let i=0;i<simSpeed;i++)gameStep();draw();document.getElementById('s-l').textContent=lScore;document.getElementById('s-r').textContent=rScore;document.getElementById('s-rally').textContent=rally;document.getElementById('s-ep').textContent=episodes;}
loop();

// Breakout game + DQN AI
const GW=280,GH=400,ROWS=5,COLS=7,BRICK_H=14,BRICK_PAD=4,PAD_W=50,PAD_H=8,BALL_R=6;
const BRICK_COLORS=['#ff44cc','#cc44ff','#4488ff','#44ffcc','#ffcc44'];
const gc=document.getElementById('game-canvas');const gx=gc.getContext('2d');
const qc=document.getElementById('q-canvas');const qx=qc.getContext('2d');
const ec=document.getElementById('eps-canvas');const ex=ec.getContext('2d');
let simSpeed=4;
document.getElementById('speed').addEventListener('input',e=>{simSpeed=parseInt(e.target.value);document.getElementById('speed-val').textContent=simSpeed+'x';});
const agent=new BreakoutAgent();
let episode=1,epScore=0,bestScore=0,scoreHist=[];

function makeBricks(){const b=[];const bw=(GW-BRICK_PAD*(COLS+1))/COLS;for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)b.push({x:BRICK_PAD+(bw+BRICK_PAD)*c,y:40+r*(BRICK_H+BRICK_PAD),w:bw,h:BRICK_H,alive:true,row:r});return b;}
let bricks=makeBricks();
let padX=GW/2,ballX=GW/2,ballY=GH*0.6;
let bvx=2.5*(Math.random()<0.5?1:-1),bvy=-3;
let ballTrail=[];

function getState(){return[ballX/GW,ballY/GH,bvx/5,bvy/5,padX/GW,(ballX-padX)/(GW),(bvx>0?1:0),(bvy>0?1:0)];}

function resetBall(){ballX=GW/2;ballY=GH*0.6;bvx=2.5*(Math.random()<0.5?1:-1);bvy=-3;ballTrail=[];}
function resetGame(){bricks=makeBricks();resetBall();padX=GW/2;epScore=0;}

function gameStep(){const s=getState();const a=agent.act(s);const speed=5;if(a===0)padX=Math.max(PAD_W/2,padX-speed);else if(a===2)padX=Math.min(GW-PAD_W/2,padX+speed);
ballTrail.push({x:ballX,y:ballY});if(ballTrail.length>10)ballTrail.shift();
ballX+=bvx;ballY+=bvy;
// walls
if(ballX-BALL_R<0){ballX=BALL_R;bvx=Math.abs(bvx);}
if(ballX+BALL_R>GW){ballX=GW-BALL_R;bvx=-Math.abs(bvx);}
if(ballY-BALL_R<0){ballY=BALL_R;bvy=Math.abs(bvy);}
let reward=0.02,done=false;
// paddle
if(ballY+BALL_R>=GH-20&&ballY+BALL_R<=GH-10&&Math.abs(ballX-padX)<PAD_W/2+BALL_R){bvy=-Math.abs(bvy);bvx+=(ballX-padX)/PAD_W*2;const sp=Math.sqrt(bvx*bvx+bvy*bvy);bvx=bvx/sp*3.5;bvy=bvy/sp*3.5;reward=0.5;}
// miss
if(ballY>GH){reward=-1;done=true;}
// bricks
for(const br of bricks){if(!br.alive)continue;if(ballX>br.x&&ballX<br.x+br.w&&ballY-BALL_R<br.y+br.h&&ballY+BALL_R>br.y){br.alive=false;bvy*=-1;reward=1+(ROWS-br.row)*0.5;epScore+=10*(br.row+1);break;}}
const noMore=bricks.every(b=>!b.alive);if(noMore){reward=5;done=true;}
const ns=getState();agent.push(s,a,reward,ns,done);agent.train();
if(done){if(epScore>bestScore)bestScore=epScore;scoreHist.push(epScore);episode++;resetGame();}return done;}

function resize(){gc.width=GW*1.5;gc.height=GH*1.5;qc.width=qc.parentElement.clientWidth;qc.height=Math.floor(qc.parentElement.clientHeight/2);ec.width=ec.parentElement.clientWidth;ec.height=Math.floor(ec.parentElement.clientHeight/2);}
window.addEventListener('resize',resize);resize();
const S=1.5;
function draw(){gx.fillStyle='#06060e';gx.fillRect(0,0,gc.width,gc.height);
// bricks
bricks.filter(b=>b.alive).forEach(b=>{const col=BRICK_COLORS[b.row%BRICK_COLORS.length];gx.fillStyle=col+'33';gx.fillRect(b.x*S,b.y*S,b.w*S,b.h*S);gx.strokeStyle=col;gx.lineWidth=1;gx.strokeRect(b.x*S,b.y*S,b.w*S,b.h*S);});
// paddle glow
gx.fillStyle='rgba(255,68,204,0.08)';gx.fillRect((padX-PAD_W/2-8)*S,(GH-22)*S,(PAD_W+16)*S,18*S);
gx.fillStyle='#ff44cc';gx.fillRect((padX-PAD_W/2)*S,(GH-20)*S,PAD_W*S,PAD_H*S);
// ball trail
ballTrail.forEach((p,i)=>{const t=(i+1)/ballTrail.length;gx.fillStyle=`rgba(255,68,204,${t*0.2})`;gx.beginPath();gx.arc(p.x*S,p.y*S,BALL_R*t*S,0,Math.PI*2);gx.fill();});
// ball
const bg=gx.createRadialGradient(ballX*S,ballY*S,1,ballX*S,ballY*S,BALL_R*1.5*S);bg.addColorStop(0,'rgba(255,68,204,0.4)');bg.addColorStop(1,'transparent');gx.fillStyle=bg;gx.beginPath();gx.arc(ballX*S,ballY*S,BALL_R*1.8*S,0,Math.PI*2);gx.fill();
gx.fillStyle='#ff88ee';gx.beginPath();gx.arc(ballX*S,ballY*S,BALL_R*S,0,Math.PI*2);gx.fill();}

function drawQ(){const W=qc.width,H=qc.height;qx.fillStyle='#06060e';qx.fillRect(0,0,W,H);const q=agent.getQ(getState());const labels=['◄ LEFT','STAY','RIGHT ►'];const maxQ=Math.max(...q.map(Math.abs))||1;const bw=(W-20)/3;q.forEach((v,i)=>{const bh=(H-36)*Math.abs(v)/maxQ;const x=10+i*bw;qx.fillStyle=i===argmax(q)?'#ff44cc33':'#1a0a1a';qx.fillRect(x,H-26-bh,bw-4,bh);qx.strokeStyle=i===argmax(q)?'#ff44cc':'#2a1a2a';qx.lineWidth=0.8;qx.strokeRect(x,H-26-bh,bw-4,bh);qx.fillStyle=i===argmax(q)?'#ff44cc':'#443344';qx.font='9px Courier New';qx.textAlign='center';qx.fillText(labels[i],x+bw/2-2,H-10);qx.fillText(v.toFixed(2),x+bw/2-2,H-26-bh-8);});qx.fillStyle='#2a1a2a';qx.font='9px Courier New';qx.textAlign='left';qx.fillText('Q-VALUES',10,12);}

function drawEps(){const W=ec.width,H=ec.height;ex.fillStyle='#06060e';ex.fillRect(0,0,W,H);ex.fillStyle='#2a1a2a';ex.font='9px Courier New';ex.textAlign='left';ex.fillText('ε DECAY CURVE',10,12);const pts=agent.epsHist.slice(-100);if(pts.length<2)return;ex.strokeStyle='#ff44cc66';ex.lineWidth=1.2;ex.beginPath();pts.forEach((v,i)=>{const x=10+(i/(pts.length-1))*(W-20);const y=H-10-(v)*(H-24);i===0?ex.moveTo(x,y):ex.lineTo(x,y);});ex.stroke();}

function loop(){requestAnimationFrame(loop);
  if(_paused){draw();drawQ();drawEps();return;}for(let i=0;i<simSpeed;i++)gameStep();draw();drawQ();drawEps();document.getElementById('s-ep').textContent=episode;document.getElementById('s-score').textContent=epScore;document.getElementById('s-best').textContent=bestScore;document.getElementById('s-eps').textContent=agent.eps.toFixed(3);}
loop();

// Snake — DQN AI main loop (FIXED)
// - Speed slider = steps per second (time-gated), not uncapped
// - Score history chart shows learning progress
// - Reward shaping: moving toward food gets small positive reward

const gc=document.getElementById('game-canvas');
const gx=gc.getContext('2d');
const qc=document.getElementById('q-canvas');
const qx=qc.getContext('2d');
const rc=document.getElementById('reward-canvas');
const rx=rc.getContext('2d');

const agent=new DQNAgent();
const env=new SnakeGame();
let stepsPerSec=8; // default: 8 steps per second
let episode=1, bestScore=0, scoreHist=[], lastStepTime=0;
let state=env.reset(), epReward=0;

document.getElementById('speed').addEventListener('input',e=>{
  stepsPerSec=parseInt(e.target.value);
  document.getElementById('speed-val').textContent=stepsPerSec+'x';
});

const nc=document.getElementById('nn-canvas');

function resize(){
  gc.width=gc.parentElement.clientWidth;
  gc.height=gc.parentElement.clientHeight;
  qc.width=qc.parentElement.clientWidth;
  qc.height=Math.floor(qc.parentElement.clientHeight/3);
  rc.width=rc.parentElement.clientWidth;
  rc.height=Math.floor(rc.parentElement.clientHeight/3);
  nc.width=nc.parentElement.clientWidth;
  nc.height=Math.floor(nc.parentElement.clientHeight/3*2);
  NNDraw.resize();
}
window.addEventListener('resize',resize); resize();

function drawGame(){
  const W=gc.width,H=gc.height;
  const cs=Math.min(W,H)/GRID;
  const ox=(W-cs*GRID)/2,oy=(H-cs*GRID)/2;
  gx.fillStyle='#06060e'; gx.fillRect(0,0,W,H);
  gx.fillStyle='#0a0a16'; gx.fillRect(ox,oy,cs*GRID,cs*GRID);
  // Grid lines
  gx.strokeStyle='#0d1a0d'; gx.lineWidth=0.4;
  for(let i=0;i<=GRID;i++){
    gx.beginPath();gx.moveTo(ox+i*cs,oy);gx.lineTo(ox+i*cs,oy+cs*GRID);gx.stroke();
    gx.beginPath();gx.moveTo(ox,oy+i*cs);gx.lineTo(ox+cs*GRID,oy+i*cs);gx.stroke();
  }
  // Food
  const[fx,fy]=env.food;
  const fgx2=gx.createRadialGradient(ox+fx*cs+cs/2,oy+fy*cs+cs/2,1,ox+fx*cs+cs/2,oy+fy*cs+cs/2,cs*0.5);
  fgx2.addColorStop(0,'#ff6666'); fgx2.addColorStop(1,'#ff222244');
  gx.fillStyle=fgx2;
  gx.beginPath();gx.arc(ox+fx*cs+cs/2,oy+fy*cs+cs/2,cs*0.42,0,Math.PI*2);gx.fill();
  // Snake
  env.snake.forEach(([sx,sy],i)=>{
    const t=i/env.snake.length;
    if(i===0){
      gx.fillStyle='#00ff88';
    } else {
      const g=255-Math.floor(t*160);
      gx.fillStyle=`rgb(0,${g},${Math.floor(80-t*60)})`;
    }
    const pad=cs*0.08;
    gx.fillRect(ox+sx*cs+pad,oy+sy*cs+pad,cs-pad*2,cs-pad*2);
  });
  // Score
  gx.fillStyle='#1a3a1a';gx.font=`${Math.min(14,cs*0.8)}px Courier New`;gx.textAlign='left';
  gx.fillText(`SCORE ${env.score}  ε ${agent.epsilon.toFixed(2)}`,ox+4,oy-5);
}

function drawQValues(){
  const W=qc.width,H=qc.height;
  qx.fillStyle='#06060e';qx.fillRect(0,0,W,H);
  const q=agent.getQValues(state);
  const labels=['▲','▼','◄','►'];
  const maxQ=Math.max(...q.map(Math.abs))||1;
  const bw=(W-20)/4;
  q.forEach((v,i)=>{
    const bh=(H-36)*Math.abs(v)/maxQ;
    const isB=i===argmax(q);
    qx.fillStyle=isB?'#00ff8833':'#112211';
    qx.fillRect(10+i*bw+2,H-26-bh,bw-4,bh);
    qx.strokeStyle=isB?'#00ff88':'#224422';qx.lineWidth=0.8;
    qx.strokeRect(10+i*bw+2,H-26-bh,bw-4,bh);
    qx.fillStyle=isB?'#00ff88':'#335533';
    qx.font='11px Courier New';qx.textAlign='center';
    qx.fillText(labels[i],10+i*bw+bw/2-2,H-10);
    qx.fillStyle='#00ff8888';qx.font='8px Courier New';
    qx.fillText(v.toFixed(1),10+i*bw+bw/2-2,H-26-bh-7);
  });
  qx.fillStyle='#1a3a2a';qx.font='9px Courier New';qx.textAlign='left';qx.fillText('Q-VALUES',10,12);
}

function drawScoreHistory(){
  const W=rc.width,H=rc.height;
  rx.fillStyle='#06060e';rx.fillRect(0,0,W,H);
  rx.fillStyle='#1a3a2a';rx.font='9px Courier New';rx.textAlign='left';rx.fillText('SCORE HISTORY',10,12);
  if(scoreHist.length<2)return;
  const pts=scoreHist.slice(-80);
  const maxV=Math.max(...pts)||1;
  // area fill
  rx.fillStyle='rgba(0,255,136,0.06)';
  rx.beginPath();
  pts.forEach((v,i)=>{
    const x=10+(i/(pts.length-1))*(W-20);
    const y=H-10-(v/maxV)*(H-28);
    i===0?rx.moveTo(x,H-10):rx.lineTo(x,y);
  });
  rx.lineTo(10+(pts.length-1)/(pts.length-1)*(W-20),H-10);rx.closePath();rx.fill();
  // line
  rx.strokeStyle='#00ff8877';rx.lineWidth=1.5;rx.beginPath();
  pts.forEach((v,i)=>{
    const x=10+(i/(pts.length-1))*(W-20);
    const y=H-10-(v/maxV)*(H-28);
    i===0?rx.moveTo(x,y):rx.lineTo(x,y);
  });
  rx.stroke();
  rx.fillStyle='#00ff88';rx.font='8px Courier New';rx.textAlign='right';
  rx.fillText('best:'+bestScore,W-6,12);
}

function updateUI(){
  document.getElementById('s-ep').textContent=episode;
  document.getElementById('s-score').textContent=env.score;
  document.getElementById('s-best').textContent=bestScore;
  document.getElementById('s-eps').textContent=agent.epsilon.toFixed(3);
  document.getElementById('s-steps').textContent=agent.totalSteps;
}

function doStep(){
  const action=agent.act(state);
  const{reward,done}=env.step(action);
  const ns=env.getState();
  epReward+=reward;
  agent.remember(state,action,reward,ns,done);
  agent.train();
  state=ns;
  if(done){
    if(env.score>bestScore)bestScore=env.score;
    scoreHist.push(env.score);
    episode++;
    state=env.reset();
    epReward=0;
  }
}

// Time-based: run stepsPerSec game steps per second
function loop(ts){
  agent.episode=episode;
  requestAnimationFrame(loop);
  const interval=1000/stepsPerSec;
  const elapsed=ts-lastStepTime;
  if(elapsed>=interval){
    // Run one or more steps to catch up, max 5 at once
    const count=Math.min(5,Math.floor(elapsed/interval));
    if(_paused){drawGame();drawQValues();drawScoreHistory();NNDraw.draw(agent);updateUI();return;}
    for(let i=0;i<count;i++) doStep();
    lastStepTime=ts;
  }
  drawGame();
  drawQValues();
  drawScoreHistory();
  NNDraw.draw(agent);
  updateUI();
}
requestAnimationFrame(loop);

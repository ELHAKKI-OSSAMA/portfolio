const NNDraw=(()=>{
const canvas=document.getElementById('nn-canvas');
const ctx=canvas.getContext('2d');
const ACCENT='#ffcc00';
const DIRS=['UP','DOWN','LEFT','RIGHT'];
const ARROWS={UP:'▲',DOWN:'▼',LEFT:'◄',RIGHT:'►'};
const INP=['max','empty','mono','edge'];

function draw(decision){
  const W=canvas.parentElement.clientWidth;
  const H=canvas.parentElement.clientHeight;
  canvas.width=W;canvas.height=H;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='#06060e';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#2a2a1a';ctx.font='bold 9px Courier New';ctx.textAlign='left';
  ctx.fillText('MCTS POLICY',10,14);
  if(!decision)return;

  const scores=DIRS.map(d=>decision.scores[d]||0);
  const maxS=Math.max(...scores,1);
  const norm=scores.map(s=>s/maxS);

  const nR=6;
  const lx=[W*0.28,W*0.72];
  const netH=H-38;
  const startY=22;
  const inpY=INP.map((_,i)=>startY+netH*(i/3));
  const outY=DIRS.map((_,i)=>startY+netH*(i/3));

  // Connections
  for(let j=0;j<4;j++)for(let i=0;i<4;i++){
    const al=norm[j]*0.5+0.04;
    ctx.strokeStyle=`rgba(255,204,0,${al})`;
    ctx.lineWidth=0.6;ctx.beginPath();ctx.moveTo(lx[0],inpY[i]);ctx.lineTo(lx[1],outY[j]);ctx.stroke();
  }

  // Input nodes
  inpY.forEach((y,i)=>{
    ctx.beginPath();ctx.arc(lx[0],y,nR,0,Math.PI*2);
    ctx.fillStyle='rgba(68,136,255,0.5)';ctx.fill();
    ctx.strokeStyle='#4488ff';ctx.lineWidth=0.8;ctx.stroke();
    ctx.fillStyle='#2a2a4a';ctx.font='7px Courier New';ctx.textAlign='right';
    ctx.fillText(INP[i],lx[0]-nR-3,y+3);
  });

  // Output nodes
  outY.forEach((y,i)=>{
    const isB=DIRS[i]===decision.best;
    ctx.beginPath();ctx.arc(lx[1],y,nR,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,204,0,${0.15+norm[i]*0.85})`;ctx.fill();
    ctx.strokeStyle=isB?ACCENT:'#554400';ctx.lineWidth=isB?1.5:0.7;ctx.stroke();
    if(isB){ctx.fillStyle='#ffcc0020';ctx.fillRect(lx[1]-nR,y-nR,W-lx[1]+nR,nR*2);}
    ctx.fillStyle=isB?ACCENT:'#665530';
    ctx.font=(isB?'bold ':'')+' 8px Courier New';ctx.textAlign='left';
    ctx.fillText(ARROWS[DIRS[i]],lx[1]+nR+4,y+3);
    const bw=Math.floor(norm[i]*(W*0.14));
    ctx.fillStyle=`rgba(255,204,0,${0.25+norm[i]*0.4})`;
    ctx.fillRect(lx[1]+18,y-3,bw,6);
  });

  ctx.fillStyle='#ffcc0055';ctx.font='bold 9px Courier New';ctx.textAlign='center';
  ctx.fillText('BEST: '+(decision.best||'?'),W/2,H-5);
}

return{draw};
})();

const NNDraw=(()=>{
const canvas=document.getElementById('nn-canvas');
const ctx=canvas.getContext('2d');
const ACCENT='#ffcc00';
const LAYER_COLORS=[ACCENT,'#44aaff',ACCENT];
const INPUT_LABELS=['r0','r1','r2','r3','r4','r5','r6','r7','spd'];
const OUTPUT_LABELS=['TurnL','TurnR','Gas'];
function resize(){const tb=document.getElementById('top-bar');const h=Math.max(1,window.innerHeight-(tb?tb.offsetHeight:36));canvas.width=260;canvas.height=Math.floor(h/3);}
function draw(car){
  const W=canvas.width,H=canvas.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='#06060e';
  ctx.fillRect(0,0,W,H);
  if(!car)return;
  const{INPUTS,HIDDEN,OUTPUTS}=NEAT_CFG;
  const layerCounts=[INPUTS,HIDDEN,OUTPUTS];
  const nR=Math.min(9,H/55);
  const lx=[W*0.12,W*0.50,W*0.88];
  const pos=[];
  const layerActs=[
    car.lastInputs||new Array(INPUTS).fill(0),
    (car.lastActs&&car.lastActs.h)||new Array(HIDDEN).fill(0),
    (car.lastActs&&car.lastActs.o)||new Array(OUTPUTS).fill(0)
  ];
  layerCounts.forEach((cnt,li)=>{
    pos.push([]);
    const spacing=Math.min((H-60)/cnt,32);
    const totalH=(cnt-1)*spacing;
    const startY=H/2-totalH/2;
    for(let ni=0;ni<cnt;ni++){
      const y=cnt===1?H/2:startY+ni*spacing;
      pos[li].push({x:lx[li],y});
    }
  });
  // Draw connections
  layerCounts.forEach((cnt,li)=>{
    if(li===layerCounts.length-1)return;
    const nextCnt=layerCounts[li+1];
    for(let ni=0;ni<cnt;ni++){
      for(let nj=0;nj<nextCnt;nj++){
        const from=pos[li][ni],to=pos[li+1][nj];
        const wIdx=li===0?ni*HIDDEN+nj:ni*OUTPUTS+nj;
        const w=li===0?car.genome.w1[wIdx]:car.genome.w2[wIdx];
        const alpha=Math.min(0.65,Math.abs(layerActs[li][ni])*0.55+0.08);
        ctx.strokeStyle=w>0?`rgba(255,204,0,${alpha})`:`rgba(255,80,80,${alpha})`;
        ctx.lineWidth=0.7;
        ctx.beginPath();ctx.moveTo(from.x,from.y);ctx.lineTo(to.x,to.y);ctx.stroke();
      }
    }
  });
  // Draw nodes
  layerCounts.forEach((cnt,li)=>{
    for(let ni=0;ni<cnt;ni++){
      const{x,y}=pos[li][ni];
      const a=layerActs[li][ni];
      const intensity=Math.min(1,Math.abs(a));
      if(intensity>0.25){
        ctx.beginPath();ctx.arc(x,y,nR+4,0,Math.PI*2);
        ctx.fillStyle=LAYER_COLORS[li]+'20';
        ctx.fill();
      }
      ctx.beginPath();ctx.arc(x,y,nR,0,Math.PI*2);
      const alpha=0.2+intensity*0.8;
      if(li===0)ctx.fillStyle=`rgba(255,204,0,${alpha})`;
      else if(li===1)ctx.fillStyle=`rgba(68,170,255,${alpha})`;
      else ctx.fillStyle=`rgba(255,204,0,${alpha})`;
      ctx.fill();
      ctx.strokeStyle=LAYER_COLORS[li];ctx.lineWidth=1;ctx.stroke();
      ctx.fillStyle='#000';
      ctx.font=`bold ${Math.max(6,nR*0.62)}px Courier New`;
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(a.toFixed(1),x,y);
    }
  });
  // Labels
  ctx.font='8px Courier New';ctx.fillStyle='#4a3a00';ctx.textAlign='right';
  pos[0].forEach((p,i)=>ctx.fillText(INPUT_LABELS[i]||('r'+i),p.x-nR-3,p.y));
  ctx.textAlign='left';
  pos[2].forEach((p,i)=>ctx.fillText(OUTPUT_LABELS[i]||('o'+i),p.x+nR+3,p.y));
  // Title
  ctx.fillStyle=ACCENT;ctx.font='bold 9px Courier New';ctx.textAlign='center';
  ctx.fillText('NEURAL NET — BEST CAR',W/2,12);
}
return{resize,draw};
})();

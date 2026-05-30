const NNDraw=(()=>{
const canvas=document.getElementById('nn-canvas');
const ctx=canvas.getContext('2d');
const PREY_ACCENT='#00ff88';
const PRED_ACCENT='#ff4444';
const INPUT_LABELS=['preyD','preyA','predD','predA','pltD','pltA','enrg','spd'];
const OUTPUT_LABELS=['turn','spd'];
function resize(){canvas.width=canvas.parentElement.clientWidth;canvas.height=Math.floor(canvas.parentElement.clientHeight/2);}
function drawNet(agent,accent,xOffset,panelW,H){
  if(!agent)return;
  const brain=agent.brain;
  const INPUTS=brain.inp,HIDDEN=brain.hid,OUTPUTS=brain.out;
  const layerCounts=[INPUTS,HIDDEN,OUTPUTS];
  const nR=Math.min(7,H/48);
  const lx=[xOffset+panelW*0.12,xOffset+panelW*0.50,xOffset+panelW*0.88];
  const pos=[];
  const layerActs=[
    agent.lastInputs||new Array(INPUTS).fill(0),
    (agent.lastActs&&agent.lastActs.h)||new Array(HIDDEN).fill(0),
    (agent.lastActs&&agent.lastActs.o)||new Array(OUTPUTS).fill(0)
  ];
  layerCounts.forEach((cnt,li)=>{
    pos.push([]);
    const spacing=Math.min((H-50)/cnt,28);
    const totalH=(cnt-1)*spacing;
    const startY=H/2-totalH/2+8;
    for(let ni=0;ni<cnt;ni++){
      const y=cnt===1?H/2:startY+ni*spacing;
      pos[li].push({x:lx[li],y});
    }
  });
  // Connections
  layerCounts.forEach((cnt,li)=>{
    if(li===layerCounts.length-1)return;
    const nextCnt=layerCounts[li+1];
    for(let ni=0;ni<cnt;ni++){
      for(let nj=0;nj<nextCnt;nj++){
        const from=pos[li][ni],to=pos[li+1][nj];
        const wIdx=li===0?ni*HIDDEN+nj:ni*OUTPUTS+nj;
        const w=li===0?brain.w1[wIdx]:brain.w2[wIdx];
        const alpha=Math.min(0.6,Math.abs(layerActs[li][ni])*0.5+0.07);
        const r=w>0?parseInt(accent.slice(1,3),16):255;
        const g=w>0?parseInt(accent.slice(3,5),16):80;
        const b=w>0?parseInt(accent.slice(5,7),16):80;
        ctx.strokeStyle=`rgba(${r},${g},${b},${alpha})`;
        ctx.lineWidth=0.6;
        ctx.beginPath();ctx.moveTo(from.x,from.y);ctx.lineTo(to.x,to.y);ctx.stroke();
      }
    }
  });
  // Nodes
  layerCounts.forEach((cnt,li)=>{
    for(let ni=0;ni<cnt;ni++){
      const{x,y}=pos[li][ni];
      const a=layerActs[li][ni];
      const intensity=Math.min(1,Math.abs(a));
      if(intensity>0.25){
        ctx.beginPath();ctx.arc(x,y,nR+4,0,Math.PI*2);
        ctx.fillStyle=accent+'18';ctx.fill();
      }
      ctx.beginPath();ctx.arc(x,y,nR,0,Math.PI*2);
      const alpha=0.2+intensity*0.8;
      const baseR=li===1?68:parseInt(accent.slice(1,3),16);
      const baseG=li===1?170:parseInt(accent.slice(3,5),16);
      const baseB=li===1?255:parseInt(accent.slice(5,7),16);
      ctx.fillStyle=`rgba(${baseR},${baseG},${baseB},${alpha})`;
      ctx.fill();
      ctx.strokeStyle=li===1?'#44aaff':accent;ctx.lineWidth=0.8;ctx.stroke();
      ctx.fillStyle='#000';
      ctx.font=`bold ${Math.max(5,nR*0.65)}px Courier New`;
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(a.toFixed(1),x,y);
    }
  });
  // Input labels
  ctx.font='7px Courier New';ctx.fillStyle=accent+'88';ctx.textAlign='right';
  pos[0].forEach((p,i)=>ctx.fillText(INPUT_LABELS[i]||('i'+i),p.x-nR-2,p.y));
  // Output labels
  ctx.textAlign='left';
  pos[2].forEach((p,i)=>ctx.fillText(OUTPUT_LABELS[i]||('o'+i),p.x+nR+2,p.y));
}
function draw(bestPrey,bestPred){
  const W=canvas.width,H=canvas.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='#06060e';ctx.fillRect(0,0,W,H);
  // Divider
  ctx.strokeStyle='#111';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(W/2,0);ctx.lineTo(W/2,H);ctx.stroke();
  // Titles
  ctx.font='bold 8px Courier New';ctx.textAlign='center';
  ctx.fillStyle=PREY_ACCENT;ctx.fillText('PREY',W/4,10);
  ctx.fillStyle=PRED_ACCENT;ctx.fillText('PREDATOR',W*3/4,10);
  const half=Math.floor(W/2);
  drawNet(bestPrey,PREY_ACCENT,0,half,H);
  drawNet(bestPred,PRED_ACCENT,half,half,H);
}
return{resize,draw};
})();

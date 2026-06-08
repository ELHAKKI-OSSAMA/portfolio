// DQN Neural Network Visualization v3.1
// Fixes:
//  • Uses real activations from agent.lastActs (agent is now sync)
//  • _layout declared properly (was implicit global, strict-mode crash)
//  • Connections batched into single path per layer pair — ~40x fewer draw calls
//  • Node glow only on high-activation nodes (skip low ones for perf)
//  • textBaseline reset after each text block to avoid bleed
'use strict';

const NNDraw = (()=>{
  const canvas = document.getElementById('nn-canvas');
  const ctx    = canvas.getContext('2d', {alpha:false});

  const INPUT_LABELS  = [
    'ball x','ball y','vel x','vel y',
    'pad x','Δx/pad','vx>0','vy>0',
    'col0-1','col2-3','col4-5','col6',
    'nearBrick','density','landX','landΔ'
  ];
  const OUTPUT_LABELS = ['◄ LEFT','STAY','RIGHT ►'];
  const VIS_H1=12, VIS_H2=10; // H1=64, H2=32

  let _W=0, _H=0, _layout=null;

  function resize(){
    canvas.width  = canvas.parentElement.clientWidth  || 200;
    canvas.height = canvas.parentElement.clientHeight - 20 || 160;
    _W=0; // invalidate layout cache
  }

  function buildLayout(W,H){
    const MT=28, MB=18, ML=54, MR=54;
    const nL=4;
    const lx=Array.from({length:nL},(_,li)=>ML+li*(W-ML-MR)/(nL-1));
    const counts=[16, VIS_H1, VIS_H2, 3];
    const nR=Math.min(9,(H-MT-MB)/(Math.max(...counts)*2.5));
    const pos=counts.map((n,li)=>{
      const spc=Math.min((H-MT-MB-nR*2)/Math.max(n-1,1), nR*3.2);
      const totalH=(n-1)*spc;
      const sy=H/2-totalH/2;
      return Array.from({length:n},(_,ni)=>({x:lx[li], y:n===1?H/2:sy+ni*spc}));
    });
    return{lx,nR,pos,MT,nL,counts};
  }

  function draw(agent){
    const W=canvas.width, H=canvas.height;
    ctx.fillStyle='#06060e';
    ctx.fillRect(0,0,W,H);

    if(!agent||!agent.lastActs){
      ctx.fillStyle='#2a1a2a'; ctx.font='9px Courier New';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('waiting for first step…',W/2,H/2);
      return;
    }

    if(W!==_W||H!==_H){ _W=W; _H=H; _layout=buildLayout(W,H); }
    const{lx,nR,pos,MT,nL,counts}=_layout;

    const acts=agent.lastActs;
    const layerActs=[acts.inp, acts.h1, acts.h2, acts.out];
    const colors=['#4488ff','#00ff88','#00ff88','#ff44cc'];
    const labels=['INPUT','H1','H2','OUTPUT'];
    const fullSizes=[null,64,32,null];

    // ── Connections — one batched path per layer transition ───────────────────
    for(let li=0;li<nL-1;li++){
      const fromP=pos[li], toP=pos[li+1];
      const fromA=layerActs[li];
      ctx.lineWidth=0.5;
      // Split into positive/negative paths for colour
      ctx.beginPath();
      ctx.strokeStyle='rgba(0,180,90,0.06)';
      for(let ni=0;ni<fromP.length;ni++){
        const act=fromA[ni]||0;
        if(act<0) continue;
        for(let nj=0;nj<toP.length;nj++){
          ctx.moveTo(fromP[ni].x, fromP[ni].y);
          ctx.lineTo(toP[nj].x,   toP[nj].y);
        }
      }
      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle='rgba(255,60,60,0.05)';
      for(let ni=0;ni<fromP.length;ni++){
        const act=fromA[ni]||0;
        if(act>=0) continue;
        for(let nj=0;nj<toP.length;nj++){
          ctx.moveTo(fromP[ni].x, fromP[ni].y);
          ctx.lineTo(toP[nj].x,   toP[nj].y);
        }
      }
      ctx.stroke();
    }

    // ── Nodes ─────────────────────────────────────────────────────────────────
    for(let li=0;li<nL;li++){
      const col=colors[li];
      const layPos=pos[li];
      const layAct=layerActs[li];
      for(let ni=0;ni<layPos.length;ni++){
        const{x,y}=layPos[ni];
        const raw=layAct[ni]||0;
        const intensity=Math.min(1,Math.abs(raw));

        // Glow — only bother if bright enough
        if(intensity>0.3){
          ctx.beginPath();
          ctx.arc(x,y,nR+3,0,Math.PI*2);
          ctx.fillStyle=col+'18';
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(x,y,nR,0,Math.PI*2);
        const a=(0.15+intensity*0.85).toFixed(2);
        if(li===0)       ctx.fillStyle=`rgba(68,136,255,${a})`;
        else if(li<nL-1) ctx.fillStyle=`rgba(0,255,136,${a})`;
        else             ctx.fillStyle=`rgba(255,68,204,${a})`;
        ctx.fill();
        ctx.strokeStyle=col; ctx.lineWidth=0.8;
        ctx.stroke();

        // Value text inside node if large enough
        if(nR>=7){
          ctx.fillStyle='#fff';
          ctx.font=`${Math.max(5,nR*0.58).toFixed(0)}px Courier New`;
          ctx.textAlign='center'; ctx.textBaseline='middle';
          ctx.fillText(raw.toFixed(1),x,y);
        }
      }
    }

    // ── Input labels ──────────────────────────────────────────────────────────
    ctx.font='7px Courier New'; ctx.fillStyle='#2a1a2a';
    ctx.textAlign='right'; ctx.textBaseline='middle';
    pos[0].forEach((p,i)=>ctx.fillText(INPUT_LABELS[i]||'',p.x-nR-3,p.y));

    // ── Output labels ─────────────────────────────────────────────────────────
    const bestOut=acts.out.indexOf(Math.max(...acts.out));
    ctx.textAlign='left';
    pos[nL-1].forEach((p,i)=>{
      ctx.fillStyle=i===bestOut?'#ff44cc':'#2a1a2a';
      ctx.font=(i===bestOut?'bold ':'')+'8px Courier New';
      ctx.fillText(OUTPUT_LABELS[i],p.x+nR+3,p.y);
    });

    // ── Layer headers ─────────────────────────────────────────────────────────
    ctx.textAlign='center'; ctx.textBaseline='alphabetic';
    for(let li=0;li<nL;li++){
      ctx.fillStyle='#2a1a2a'; ctx.font='8px Courier New';
      ctx.fillText(labels[li],lx[li],MT-12);
      if(fullSizes[li]){
        ctx.fillStyle='#1a0a1a'; ctx.font='7px Courier New';
        ctx.fillText('('+fullSizes[li]+')',lx[li],MT-3);
      }
    }

    // ── Footer ────────────────────────────────────────────────────────────────
    ctx.fillStyle='#ff44cc55'; ctx.font='bold 9px Courier New';
    ctx.textAlign='center'; ctx.textBaseline='alphabetic';
    ctx.fillText('DQN v3 — ep '+(agent.episode||0)+
      '  ε='+(agent.eps||0).toFixed(3), W/2, H-4);
  }

  return{resize,draw};
})();

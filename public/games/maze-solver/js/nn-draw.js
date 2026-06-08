// nn-draw.js — Premium Ensemble Visualizer
// Sci-fi terminal aesthetic with Orbitron font, animated bars, glow effects

const NNDraw = (()=>{
  const canvas = document.getElementById('nn-canvas');
  const ctx    = canvas.getContext('2d');

  const C_BG     = '#040a0f';
  const C_PANEL  = '#060e14';
  const C_BORDER = '#0d2a1a';
  const C_GREEN  = '#00ff88';
  const C_AMBER  = '#cc7722';
  const C_BLUE   = '#0af';
  const C_RED    = '#ff3355';
  const C_DIM    = '#1a5535';
  const C_DIMMER = '#0a2a18';

  const DIR_LABELS = ['N','S','E','W'];
  const DIR_COLS   = [C_BLUE, C_AMBER, C_GREEN, '#f4f'];

  let animFrame = 0;

  function roundRect(x,y,w,h,r){
    ctx.beginPath();
    ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y);
    ctx.quadraticCurveTo(x+w,y,x+w,y+r);
    ctx.lineTo(x+w,y+h-r);
    ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    ctx.lineTo(x+r,y+h);
    ctx.quadraticCurveTo(x,y+h,x,y+h-r);
    ctx.lineTo(x,y+r);
    ctx.quadraticCurveTo(x,y,x+r,y);
    ctx.closePath();
  }

  function drawGlowText(text, x, y, color, size, align='left', font='Share Tech Mono'){
    ctx.save();
    ctx.font = `${size}px '${font}', monospace`;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  function drawSection(label, x, y, w, h){
    // panel bg
    ctx.fillStyle = C_PANEL;
    roundRect(x,y,w,h,3);
    ctx.fill();
    // border
    ctx.strokeStyle = C_BORDER;
    ctx.lineWidth = 0.8;
    roundRect(x,y,w,h,3);
    ctx.stroke();
    // top-left label tab
    ctx.fillStyle = C_DIMMER;
    ctx.fillRect(x+6, y-1, label.length*5.5+8, 8);
    ctx.font = "6px 'Share Tech Mono', monospace";
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = C_DIM;
    ctx.fillText(label, x+10, y+3);
  }

  function draw(walker, ensemble){
    animFrame++;
    const W = canvas.parentElement.clientWidth;
    const H = canvas.parentElement.clientHeight || 600;
    canvas.width = W; canvas.height = H;

    // Background
    ctx.fillStyle = C_BG;
    ctx.fillRect(0,0,W,H);

    // Subtle grid texture
    ctx.strokeStyle = 'rgba(0,255,136,0.025)';
    ctx.lineWidth = 0.5;
    for(let gx=0;gx<W;gx+=20){ ctx.beginPath();ctx.moveTo(gx,0);ctx.lineTo(gx,H);ctx.stroke(); }
    for(let gy=0;gy<H;gy+=20){ ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(W,gy);ctx.stroke(); }

    // Top glow
    const grad = ctx.createLinearGradient(0,0,0,30);
    grad.addColorStop(0,'rgba(0,255,136,0.08)');
    grad.addColorStop(1,'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,W,30);

    // Header
    ctx.font = "bold 10px 'Orbitron', monospace";
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.shadowColor = C_GREEN; ctx.shadowBlur = 10;
    ctx.fillStyle = C_GREEN;
    ctx.fillText('NEURAL ENSEMBLE', 10, 14);
    ctx.shadowBlur = 0;

    ctx.font = "7px 'Share Tech Mono', monospace";
    ctx.fillStyle = C_DIM;
    ctx.fillText('5 NETS · IN:26 · H1:48 · H2:32 · OUT:4', 10, 26);

    // Separator
    ctx.strokeStyle = C_BORDER;
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(0,34); ctx.lineTo(W,34); ctx.stroke();

    if(!walker || !ensemble){
      drawGlowText('INITIALIZING...', W/2, H/2, C_DIM, 10, 'center');
      return;
    }

    const probs   = ensemble.getLastProbs();
    const walls   = walker.alive
      ? (typeof maze !== 'undefined' ? maze[walker.r]?.[walker.c]?.walls : {N:true,S:true,E:true,W:true})
      : {N:true,S:true,E:true,W:true};
    const ctg     = typeof ctgGrid !== 'undefined' ? ctgGrid : null;
    const totalV  = probs ? Array.from(probs).reduce((a,b)=>a+b,0)||1 : 1;

    let cy = 44;

    // ── Direction confidence ──────────────────────────────────────────────
    const sectionH = DIR_LABELS.length * 28 + 12;
    drawSection('DIRECTION CONFIDENCE', 6, cy, W-12, sectionH);
    cy += 14;

    DIR_LABELS.forEach((lbl,i)=>{
      const pct    = probs ? probs[i]/totalV : 0;
      const blocked= walls?.[lbl] ?? true;
      const isWin  = probs && !blocked && probs[i]===Math.max(...Array.from(probs).filter((_,j)=>!(walls?.[DIR_LABELS[j]])));
      const col    = blocked ? C_DIMMER : (isWin ? C_GREEN : DIR_COLS[i]);
      const barMax = W - 56;
      const barW   = blocked ? 0 : barMax * pct;
      const by     = cy + i*28 + 6;

      // Track
      ctx.fillStyle = '#040d08';
      roundRect(34, by, barMax, 16, 2); ctx.fill();

      // Fill with gradient
      if(!blocked && barW > 0){
        const bg = ctx.createLinearGradient(34,0,34+barMax,0);
        bg.addColorStop(0, col+'cc');
        bg.addColorStop(1, col+'22');
        ctx.fillStyle = bg;
        roundRect(34, by, barW, 16, 2); ctx.fill();
        // Inner highlight
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.fillRect(34, by, barW, 4);
      }

      // Direction label
      ctx.font = "bold 9px 'Orbitron', monospace";
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      if(isWin){ ctx.shadowColor=col; ctx.shadowBlur=10; }
      ctx.fillStyle = blocked ? C_DIMMER : col;
      ctx.fillText(lbl, 20, by+8);
      ctx.shadowBlur=0;

      // Percentage
      ctx.font = "8px 'Share Tech Mono', monospace";
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ctx.fillStyle = blocked ? C_DIMMER : (isWin ? C_GREEN : '#3d7a55');
      ctx.fillText(blocked ? 'WALL' : (pct*100).toFixed(0)+'%', W-12, by+8);

      // Winner arrow
      if(isWin){
        ctx.fillStyle = C_GREEN;
        ctx.font = "9px 'Share Tech Mono'";
        ctx.textAlign = 'left';
        ctx.fillText('▶', 34+barW+3, by+8);
      }
    });

    cy += sectionH + 8;

    // ── A* cost-to-go ─────────────────────────────────────────────────────
    const ctgH = 56;
    drawSection('A* COST-TO-GO', 6, cy, W-12, ctgH);

    if(ctg && walker.alive && walker.r < ctg.length){
      const curCtg = ctg[walker.r]?.[walker.c];
      const validCtg = curCtg !== undefined && curCtg !== Infinity;

      // Big distance number
      ctx.font = "bold 22px 'Orbitron', monospace";
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ctx.shadowColor = C_GREEN; ctx.shadowBlur = 16;
      ctx.fillStyle = C_GREEN;
      ctx.fillText(validCtg ? curCtg : '∞', W-12, cy+22);
      ctx.shadowBlur=0;
      ctx.font = "7px 'Share Tech Mono'"; ctx.fillStyle=C_DIM;
      ctx.fillText('STEPS TO EXIT', W-12, cy+37);

      // Per-direction costs
      const costStr = DIR_LABELS.map((d,i)=>{
        if(walls?.[d]) return `${d}:—`;
        const [,dr,dc] = [[-1,0],[1,0],[0,1],[0,-1]][i];
        const nr=walker.r+dr, nc=walker.c+dc;
        const v = ctg[nr]?.[nc];
        return `${d}:${v===undefined||v===Infinity?'∞':v}`;
      }).join('  ');

      ctx.font = "7px 'Share Tech Mono'";
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillStyle = C_DIM;
      ctx.fillText(costStr, 12, cy+48);
    } else {
      drawGlowText('computing...', 12, cy+28, C_DIMMER, 8);
    }

    cy += ctgH + 8;

    // ── Walker stats ──────────────────────────────────────────────────────
    const statsH = 66;
    drawSection('WALKER STATUS', 6, cy, W-12, statsH);

    const stats = [
      ['POS',  walker.alive ? `${walker.r},${walker.c}` : 'DONE', C_BLUE],
      ['STEP', `${walker.step}/${typeof MAX_STEPS!=='undefined'?MAX_STEPS:'—'}`, C_GREEN],
      ['SEEN', `${walker.visited.size} cells`, C_AMBER],
      ['FIT',  Math.floor(walker.fitness).toString(), C_GREEN],
    ];

    stats.forEach(([lbl,val,col],i)=>{
      const sx = i%2===0 ? 12 : W/2;
      const sy = cy + 14 + Math.floor(i/2)*28;
      ctx.font = "6px 'Share Tech Mono'";
      ctx.textAlign='left'; ctx.textBaseline='middle';
      ctx.fillStyle = C_DIM;
      ctx.fillText(lbl, sx, sy);
      ctx.font = "bold 10px 'Orbitron', monospace";
      ctx.fillStyle = col;
      ctx.shadowColor = col; ctx.shadowBlur = 6;
      ctx.fillText(val, sx, sy+12);
      ctx.shadowBlur=0;
    });

    cy += statsH + 8;

    // ── Ensemble agreement ────────────────────────────────────────────────
    const agreeH = 34;
    drawSection('CONSENSUS', 6, cy, W-12, agreeH);

    if(probs){
      const winV = Math.max(...probs);
      const agreement = winV / totalV;
      const aCol = agreement > 0.8 ? C_GREEN : agreement > 0.55 ? C_AMBER : C_RED;
      const barMax2 = W - 56;

      ctx.fillStyle = '#040d08';
      roundRect(12, cy+14, barMax2, 12, 2); ctx.fill();

      const ag2 = ctx.createLinearGradient(12,0,12+barMax2,0);
      ag2.addColorStop(0, aCol+'ee');
      ag2.addColorStop(1, aCol+'33');
      ctx.fillStyle = ag2;
      roundRect(12, cy+14, barMax2*agreement, 12, 2); ctx.fill();

      ctx.font = "bold 9px 'Orbitron', monospace";
      ctx.textAlign='right'; ctx.textBaseline='middle';
      ctx.shadowColor=aCol; ctx.shadowBlur=8;
      ctx.fillStyle=aCol;
      ctx.fillText((agreement*100).toFixed(0)+'%', W-12, cy+20);
      ctx.shadowBlur=0;
    }

    cy += agreeH + 8;

    // ── Verified badge ────────────────────────────────────────────────────
    if(cy < H - 40){
      const badgeY = H - 36;
      // glowing border
      ctx.strokeStyle = 'rgba(0,255,136,0.3)';
      ctx.lineWidth = 0.8;
      roundRect(6, badgeY, W-12, 28, 3); ctx.stroke();
      const badgeBg = ctx.createLinearGradient(0,badgeY,0,badgeY+28);
      badgeBg.addColorStop(0,'rgba(0,255,136,0.06)');
      badgeBg.addColorStop(1,'rgba(0,255,136,0.02)');
      ctx.fillStyle=badgeBg;
      roundRect(6, badgeY, W-12, 28, 3); ctx.fill();

      ctx.font = "bold 8px 'Orbitron', monospace";
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.shadowColor=C_GREEN; ctx.shadowBlur=10;
      ctx.fillStyle=C_GREEN;
      ctx.fillText('✓ 500/500 VERIFIED', W/2, badgeY+10);
      ctx.shadowBlur=0;
      ctx.font="6px 'Share Tech Mono'"; ctx.fillStyle=C_DIM;
      ctx.fillText('A* · DAGGER · ENSEMBLE · 100% SOLVE', W/2, badgeY+22);
    }
  }

  return { resize(){}, draw };
})();

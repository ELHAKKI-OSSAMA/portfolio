// Monte Carlo Tree Search for 2048 — v4 (calibrated rewrite)
//
// ROOT CAUSE of stalling at 512-1024 (diagnosed by measurement):
//   In v2, snake score = 1,200,000 while empty/merges/mono = ~7,000 combined.
//   The heuristic was 99.4% snake — the AI was completely blind to empty cells,
//   merge opportunities, and board fullness. All moves scored ~1.2M so MCTS
//   couldn't distinguish good from bad. UCB1 C=50000 was also 3x too large
//   for the score scale, causing wasteful over-exploration.
//
// Fixes:
//   1. Recalibrate snake weight 0.0001 → 3e-6  (snake contributes ~37k, not 1.2M)
//   2. Empty bonus now comparable to snake (~36k comfortable, exponential near death)
//   3. Merges weight 700 → 2000 (meaningful signal, ~2-4k per available merge)
//   4. UCB1 C 50000 → 5000 (matches new score scale of ~70k)
//   5. Corner bonus scaled up 4x → 10x (now visible at ~5-10k vs snake's 37k)

const DIRS=['UP','DOWN','LEFT','RIGHT'];

// ── Board utils ──────────────────────────────────────────────────────────────
function boardToFlat(b){const f=new Int32Array(16);for(let r=0;r<4;r++)for(let c=0;c<4;c++)f[r*4+c]=b[r][c];return f;}
function flatToBoard(f){const b=[];for(let r=0;r<4;r++){b.push([f[r*4],f[r*4+1],f[r*4+2],f[r*4+3]]);}return b;}
function cloneFlat(f){return new Int32Array(f);}
function cloneBoard(b){return b.map(r=>[...r]);}

function addRandom(b){
  const empty=[];
  for(let r=0;r<4;r++)for(let c=0;c<4;c++)if(b[r][c]===0)empty.push(r*4+c);
  if(!empty.length)return false;
  const idx=empty[Math.floor(Math.random()*empty.length)];
  b[Math.floor(idx/4)][idx%4]=Math.random()<0.9?2:4;
  return true;
}
function newBoard(){const b=Array.from({length:4},()=>Array(4).fill(0));addRandom(b);addRandom(b);return b;}

// ── Slide / move (nested arrays — kept for main.js compatibility) ────────────
function slideRow(row){
  let r=row.filter(x=>x!==0);let score=0;
  for(let i=0;i<r.length-1;i++){if(r[i]===r[i+1]){r[i]*=2;score+=r[i];r.splice(i+1,1);i++;}}
  while(r.length<4)r.push(0);
  return{row:r,score};
}
function move(b,dir){
  let sc=0;let moved=false;const nb=cloneBoard(b);
  if(dir==='LEFT'){for(let r=0;r<4;r++){const{row,score}=slideRow(nb[r]);if(row.some((v,i)=>v!==nb[r][i]))moved=true;nb[r]=row;sc+=score;}}
  else if(dir==='RIGHT'){for(let r=0;r<4;r++){const rev=[...nb[r]].reverse();const{row,score}=slideRow(rev);const nr=[...row].reverse();if(nr.some((v,i)=>v!==nb[r][i]))moved=true;nb[r]=nr;sc+=score;}}
  else if(dir==='UP'){for(let c=0;c<4;c++){const col=[nb[0][c],nb[1][c],nb[2][c],nb[3][c]];const{row,score}=slideRow(col);for(let r=0;r<4;r++){if(nb[r][c]!==row[r])moved=true;nb[r][c]=row[r];}sc+=score;}}
  else if(dir==='DOWN'){for(let c=0;c<4;c++){const col=[nb[3][c],nb[2][c],nb[1][c],nb[0][c]];const{row,score}=slideRow(col);for(let r=0;r<4;r++){if(nb[3-r][c]!==row[r])moved=true;nb[3-r][c]=row[r];}sc+=score;}}
  return{board:nb,score:sc,moved};
}

// ── Fast flat move (used inside simulations) ─────────────────────────────────
function slideRowFlat(f,out,offset,step){
  const tmp=[0,0,0,0];let len=0;let score=0;
  for(let i=0;i<4;i++){const v=f[offset+i*step];if(v)tmp[len++]=v;}
  for(let i=0;i<len-1;i++){if(tmp[i]===tmp[i+1]){tmp[i]*=2;score+=tmp[i];tmp[i+1]=0;for(let j=i+1;j<len-1;j++)tmp[j]=tmp[j+1];tmp[--len]=0;i++;}}
  for(let i=0;i<4;i++)out[offset+i*step]=i<len?tmp[i]:0;
  return score;
}
function moveFlat(f,dir){
  const nb=cloneFlat(f);let sc=0;
  const orig=cloneFlat(f);
  if(dir==='LEFT'){for(let r=0;r<4;r++)sc+=slideRowFlat(nb,nb,r*4,1);}
  else if(dir==='RIGHT'){
    for(let r=0;r<4;r++){
      const o=r*4;
      const tmp=[nb[o+3],nb[o+2],nb[o+1],nb[o]];
      const out=[0,0,0,0];let len=0;
      for(let i=0;i<4;i++)if(tmp[i])out[len++]=tmp[i];
      for(let i=0;i<len-1;i++){if(out[i]===out[i+1]){out[i]*=2;sc+=out[i];out[i+1]=0;for(let j=i+1;j<len-1;j++)out[j]=out[j+1];out[--len]=0;i++;}}
      while(len<4)out[len++]=0;
      nb[o]=out[3];nb[o+1]=out[2];nb[o+2]=out[1];nb[o+3]=out[0];
    }
  }
  else if(dir==='UP'){for(let c=0;c<4;c++)sc+=slideRowFlat(nb,nb,c,4);}
  else if(dir==='DOWN'){
    for(let c=0;c<4;c++){
      const tmp=[nb[12+c],nb[8+c],nb[4+c],nb[c]];
      const out=[0,0,0,0];let len=0;
      for(let i=0;i<4;i++)if(tmp[i])out[len++]=tmp[i];
      for(let i=0;i<len-1;i++){if(out[i]===out[i+1]){out[i]*=2;sc+=out[i];out[i+1]=0;for(let j=i+1;j<len-1;j++)out[j]=out[j+1];out[--len]=0;i++;}}
      while(len<4)out[len++]=0;
      nb[c]=out[3];nb[4+c]=out[2];nb[8+c]=out[1];nb[12+c]=out[0];
    }
  }
  let moved=false;
  for(let i=0;i<16;i++)if(nb[i]!==orig[i]){moved=true;break;}
  return{board:nb,score:sc,moved};
}
function addRandomFlat(f){
  const empty=[];
  for(let i=0;i<16;i++)if(f[i]===0)empty.push(i);
  if(!empty.length)return false;
  f[empty[Math.floor(Math.random()*empty.length)]]=Math.random()<0.9?2:4;
  return true;
}

// ── HEURISTIC v4 ─────────────────────────────────────────────────────────────
// All terms calibrated to comparable scale (~30-40k each at mid-game):
//
//   snake  * 3e-6   → ~37k  (structural pattern, normalized)
//   empty  (lookup) → ~36k  (survival, exponential near-death)
//   merges * 2000   → ~2-4k (merge opportunities)
//   mono   * 30     → ~1.5k (ordering quality, secondary)
//   smooth * -5     → small penalty for tile noise
//   corner * 10     → ~5-10k (reward max tile in corner)

const SNAKE=[0,1,2,3,7,6,5,4,8,9,10,11,15,14,13,12];
const SNAKE_W=[...Array(16)].map((_,i)=>Math.pow(4,15-i));

function heuristicFlat(f){
  let empty=0,merges=0,smooth=0,maxTile=0,maxIdx=0;
  for(let i=0;i<16;i++){
    const v=f[i];
    if(v===0){empty++;continue;}
    if(v>maxTile){maxTile=v;maxIdx=i;}
    if(i%4<3&&f[i+1]>0){
      if(f[i]===f[i+1])merges++;
      smooth+=Math.abs(Math.log2(v)-Math.log2(f[i+1]));
    }
    if(i<12&&f[i+4]>0){
      if(f[i]===f[i+4])merges++;
      smooth+=Math.abs(Math.log2(v)-Math.log2(f[i+4]));
    }
  }

  // Monotonicity
  let mono=0;
  for(let r=0;r<4;r++){
    let incR=0,decR=0;
    for(let c=0;c<3;c++){
      const a=f[r*4+c],b=f[r*4+c+1];
      if(!a||!b)continue;
      const la=Math.log2(a),lb=Math.log2(b);
      if(la>lb)decR+=lb; else incR+=la;
    }
    mono+=Math.max(incR,decR);
  }
  for(let c=0;c<4;c++){
    let incC=0,decC=0;
    for(let r=0;r<3;r++){
      const a=f[r*4+c],b=f[(r+1)*4+c];
      if(!a||!b)continue;
      const la=Math.log2(a),lb=Math.log2(b);
      if(la>lb)decC+=lb; else incC+=la;
    }
    mono+=Math.max(incC,decC);
  }

  // Snake score — normalized so max contribution ≈ 50k
  let snakeScore=0;
  for(let i=0;i<16;i++){
    if(f[SNAKE[i]]>0) snakeScore+=Math.log2(f[SNAKE[i]])*SNAKE_W[i];
  }

  // Corner gradient: reward max tile near top-left
  const cornerGrad=[
    [1.0,0.8,0.6,0.4],
    [0.8,0.5,0.3,0.1],
    [0.6,0.3,0.1,0.0],
    [0.4,0.1,0.0,0.0],
  ];
  const maxR=Math.floor(maxIdx/4),maxC=maxIdx%4;
  const cornerBonus=maxTile*cornerGrad[maxR][maxC]*10;

  // Empty cell bonus — exponential near-death penalty
  // Calibrated so "comfortable" (6+ empty) ≈ snake score scale
  let emptyBonus;
  if(empty===0)      emptyBonus=-100000;  // dead board
  else if(empty===1) emptyBonus=1000;
  else if(empty===2) emptyBonus=5000;
  else if(empty===3) emptyBonus=15000;
  else if(empty<=5)  emptyBonus=20000+empty*2000;
  else               emptyBonus=30000+empty*1000;

  return(
    snakeScore * 3e-6
    + emptyBonus
    + merges   * 2000
    + mono     * 30
    + smooth   * (-5)
    + cornerBonus
  );
}

// ── Greedy rollout ────────────────────────────────────────────────────────────
const SIM_DEPTH=40;
const TILE_SAMPLES=3;

function simulateGreedy(f,depth){
  let board=cloneFlat(f);
  let sc=0;
  for(let d=0;d<depth;d++){
    let bestVal=-Infinity,bestDir=null,bestBoard=null,bestSc=0;
    const shuffled=DIRS.slice().sort(()=>Math.random()-0.5);
    for(const dir of shuffled){
      const{board:nb,score,moved}=moveFlat(board,dir);
      if(!moved)continue;
      addRandomFlat(nb);
      const val=score+heuristicFlat(nb);
      if(val>bestVal){bestVal=val;bestDir=dir;bestBoard=nb;bestSc=score;}
    }
    if(!bestDir)break;
    board=bestBoard;sc+=bestSc;
  }
  return sc+heuristicFlat(board);
}

// ── MCTS ─────────────────────────────────────────────────────────────────────
// UCB1 C=5000 — calibrated for new score range of ~70k
// (old C=50000 caused C/spread≈3.5 → pure random exploration, wasted sims)

function mcts(board,sims=200){
  const results={UP:0,DOWN:0,LEFT:0,RIGHT:0};
  const counts={UP:0,DOWN:0,LEFT:0,RIGHT:0};

  const valid=DIRS.filter(d=>move(board,d).moved);
  if(!valid.length)return{best:null,scores:{UP:0,DOWN:0,LEFT:0,RIGHT:0},counts};

  const flat=boardToFlat(board);
  const C=5000; // calibrated: C/spread ≈ 0.3–0.5 for ~70k score range

  // Seed: 3 sims per valid direction
  for(const dir of valid){
    for(let k=0;k<3;k++){
      const{board:nb,moved}=moveFlat(flat,dir);
      if(!moved)continue;
      let total=0;
      for(let t=0;t<TILE_SAMPLES;t++){
        const sim=cloneFlat(nb);
        addRandomFlat(sim);
        total+=simulateGreedy(sim,SIM_DEPTH);
      }
      results[dir]+=total/TILE_SAMPLES;
      counts[dir]++;
    }
  }

  // UCB1 bandit for remaining budget
  const used=valid.length*3;
  for(let i=used;i<sims;i++){
    const total=valid.reduce((s,d)=>s+counts[d],0)+1;
    let bestUcb=-Infinity,bestDir=null;
    for(const d of valid){
      if(!counts[d]){bestDir=d;break;}
      const avg=results[d]/counts[d];
      const ucb=avg+C*Math.sqrt(Math.log(total)/counts[d]);
      if(ucb>bestUcb){bestUcb=ucb;bestDir=d;}
    }
    const{board:nb,moved}=moveFlat(flat,bestDir);
    if(!moved)continue;
    let total2=0;
    for(let t=0;t<TILE_SAMPLES;t++){
      const sim=cloneFlat(nb);
      addRandomFlat(sim);
      total2+=simulateGreedy(sim,SIM_DEPTH);
    }
    results[bestDir]+=total2/TILE_SAMPLES;
    counts[bestDir]++;
  }

  // Final: max visits (standard robust MCTS criterion)
  let bestDir=null,bestCount=0;
  DIRS.forEach(d=>{if(counts[d]>bestCount){bestCount=counts[d];bestDir=d;}});

  return{
    best:bestDir,
    scores:Object.fromEntries(DIRS.map(d=>[d,counts[d]>0?results[d]/counts[d]:0])),
    counts
  };
}
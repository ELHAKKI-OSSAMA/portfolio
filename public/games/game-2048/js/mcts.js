// Monte Carlo Tree Search for 2048
const DIRS=['UP','DOWN','LEFT','RIGHT'];

function cloneBoard(b){return b.map(r=>[...r]);}
function addRandom(b){const empty=[];for(let r=0;r<4;r++)for(let c=0;c<4;c++)if(b[r][c]===0)empty.push([r,c]);if(!empty.length)return false;const[r,c]=empty[Math.floor(Math.random()*empty.length)];b[r][c]=Math.random()<0.9?2:4;return true;}
function newBoard(){const b=Array.from({length:4},()=>Array(4).fill(0));addRandom(b);addRandom(b);return b;}

function slideRow(row){let r=row.filter(x=>x!==0);let score=0;for(let i=0;i<r.length-1;i++){if(r[i]===r[i+1]){r[i]*=2;score+=r[i];r.splice(i+1,1);i++;}}while(r.length<4)r.push(0);return{row:r,score};}

function move(b,dir){let sc=0;let moved=false;const nb=cloneBoard(b);
if(dir==='LEFT'){for(let r=0;r<4;r++){const{row,score}=slideRow(nb[r]);if(row.join()!==nb[r].join())moved=true;nb[r]=row;sc+=score;}}
else if(dir==='RIGHT'){for(let r=0;r<4;r++){const rev=[...nb[r]].reverse();const{row,score}=slideRow(rev);const nr=[...row].reverse();if(nr.join()!==nb[r].join())moved=true;nb[r]=nr;sc+=score;}}
else if(dir==='UP'){for(let c=0;c<4;c++){const col=[nb[0][c],nb[1][c],nb[2][c],nb[3][c]];const{row,score}=slideRow(col);for(let r=0;r<4;r++){if(nb[r][c]!==row[r])moved=true;nb[r][c]=row[r];}sc+=score;}}
else if(dir==='DOWN'){for(let c=0;c<4;c++){const col=[nb[3][c],nb[2][c],nb[1][c],nb[0][c]];const{row,score}=slideRow(col);for(let r=0;r<4;r++){if(nb[3-r][c]!==row[r])moved=true;nb[3-r][c]=row[r];}sc+=score;}}
return{board:nb,score:sc,moved};}

function heuristic(b){
  let empty=0,merges=0,mono=0,smooth=0,maxTile=0,maxR=0,maxC=0;
  for(let r=0;r<4;r++)for(let c=0;c<4;c++){
    const v=b[r][c];
    if(v===0)empty++;
    if(v>maxTile){maxTile=v;maxR=r;maxC=c;}
    if(c<3&&b[r][c]===b[r][c+1]&&v>0)merges++;
    if(r<3&&b[r][c]===b[r+1][c]&&v>0)merges++;
    // smoothness penalty — penalise large value gaps between neighbours
    if(c<3&&b[r][c]>0&&b[r][c+1]>0)smooth+=Math.abs(Math.log2(b[r][c])-Math.log2(b[r][c+1]));
    if(r<3&&b[r][c]>0&&b[r+1][c]>0)smooth+=Math.abs(Math.log2(b[r][c])-Math.log2(b[r+1][c]));
  }
  // row monotonicity
  for(let r=0;r<4;r++){
    let inc=0,dec=0;
    for(let c=0;c<3;c++){
      if(b[r][c]>b[r][c+1])dec+=b[r][c+1]?Math.log2(b[r][c+1]):0;
      else inc+=b[r][c]?Math.log2(b[r][c]):0;
    }
    mono+=Math.max(inc,dec);
  }
  // column monotonicity
  for(let c=0;c<4;c++){
    let inc=0,dec=0;
    for(let r=0;r<3;r++){
      if(b[r][c]>b[r+1][c])dec+=b[r+1][c]?Math.log2(b[r+1][c]):0;
      else inc+=b[r][c]?Math.log2(b[r][c]):0;
    }
    mono+=Math.max(inc,dec);
  }
  // corner bonus: maxTile in any corner gets a big reward
  const inCorner=(maxR===0||maxR===3)&&(maxC===0||maxC===3);
  const cornerBonus=inCorner?10000:0;
  // snake pattern bonus: reward descending snake (top-left strategy)
  // snake order: row0 L→R, row1 R→L, row2 L→R, row3 R→L
  const snakeOrder=[[0,0],[0,1],[0,2],[0,3],[1,3],[1,2],[1,1],[1,0],[2,0],[2,1],[2,2],[2,3],[3,3],[3,2],[3,1],[3,0]];
  let snakeBonus=0;
  for(let i=0;i<snakeOrder.length-1;i++){
    const[r1,c1]=snakeOrder[i],[r2,c2]=snakeOrder[i+1];
    if(b[r1][c1]>=b[r2][c2])snakeBonus+=b[r1][c1]?Math.log2(b[r1][c1]):0;
  }
  return empty*300+merges*600+mono*80+smooth*(-10)+cornerBonus+snakeBonus*20+Math.log2(maxTile||1)*200;
}

function simulateRandom(b,depth){
  let board=cloneBoard(b);let sc=0;
  for(let d=0;d<depth;d++){
    const valid=DIRS.filter(dir=>move(board,dir).moved);
    if(!valid.length)break;
    const{board:nb,score}=move(board,valid[Math.floor(Math.random()*valid.length)]);
    board=nb;sc+=score;addRandom(board);
  }
  return sc+heuristic(board);
}

function mcts(board,sims=120){
  const results={UP:0,DOWN:0,LEFT:0,RIGHT:0};
  const counts={UP:0,DOWN:0,LEFT:0,RIGHT:0};
  const C=1500; // UCB1 exploration constant

  // Determine which directions are actually valid
  const valid=DIRS.filter(d=>move(board,d).moved);
  if(!valid.length)return{best:null,scores:{UP:0,DOWN:0,LEFT:0,RIGHT:0},counts};

  // Phase 1: seed each valid direction with 2 simulations for initial estimates
  const phase1PerDir=2;
  for(const dir of valid){
    for(let k=0;k<phase1PerDir;k++){
      const{board:nb}=move(board,dir);
      const sim=cloneBoard(nb);addRandom(sim);
      results[dir]+=simulateRandom(sim,10);
      counts[dir]++;
    }
  }

  // Phase 2: UCB1 bandit allocation for remaining sims
  const used=valid.length*phase1PerDir;
  const remaining=Math.max(0,sims-used);
  for(let i=0;i<remaining;i++){
    const total=valid.reduce((s,d)=>s+counts[d],0)+1;
    let best=null,bestUcb=-Infinity;
    for(const d of valid){
      const avg=counts[d]>0?results[d]/counts[d]:0;
      const ucb=avg+C*Math.sqrt(Math.log(total)/counts[d]);
      if(ucb>bestUcb){bestUcb=ucb;best=d;}
    }
    const{board:nb}=move(board,best);
    const sim=cloneBoard(nb);addRandom(sim);
    results[best]+=simulateRandom(sim,10);
    counts[best]++;
  }

  let bestDir=null,bestVal=-Infinity;
  DIRS.forEach(d=>{
    if(counts[d]>0){
      const avg=results[d]/counts[d];
      if(avg>bestVal){bestVal=avg;bestDir=d;}
    }
  });
  return{best:bestDir,scores:Object.fromEntries(DIRS.map(d=>[d,counts[d]>0?results[d]/counts[d]:0])),counts};
}

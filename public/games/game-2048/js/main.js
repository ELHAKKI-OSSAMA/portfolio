// 2048 MCTS AI — FIXED
// - Speed slider now controls moves-per-second properly (was running full throttle)
// - Uses requestAnimationFrame timing, not uncapped loop

const bc = document.getElementById('board-canvas');
const bx = bc.getContext('2d');
const tc = document.getElementById('tree-canvas');
const tx = tc.getContext('2d');

let board = newBoard(), score = 0, moves = 0, games = 1, bestTile = 0;
let lastDecision = { scores:{UP:0,DOWN:0,LEFT:0,RIGHT:0}, counts:{}, best:'UP' };

// Speed = moves per second (1..30)
let movesPerSec = 5;
document.getElementById('speed').addEventListener('input', e => {
  movesPerSec = parseInt(e.target.value);
  document.getElementById('speed-val').textContent = movesPerSec + 'x';
});

const TILE_BG = {
  0:'#0a0a14', 2:'#1a2a3a', 4:'#1a3a2a', 8:'#2a3a1a',
  16:'#3a2a1a', 32:'#3a1a1a', 64:'#2a1a3a', 128:'#1a1a4a',
  256:'#0a2a4a', 512:'#0a3a2a', 1024:'#2a2a0a', 2048:'#3a1a0a'
};
const TILE_FG = {
  0:'', 2:'#4488aa', 4:'#44aa66', 8:'#88aa44', 16:'#aaaa44',
  32:'#aa6644', 64:'#aa44aa', 128:'#4444cc', 256:'#4488cc',
  512:'#44cc88', 1024:'#cccc44', 2048:'#cc8844'
};

function drawBoard() {
  const wrap = bc.parentElement;
  const size = Math.min(wrap.clientWidth - 20, wrap.clientHeight - 20, 380);
  bc.width = size; bc.height = size;
  const pad = 8, cs = (size - pad * 5) / 4;
  bx.fillStyle = '#08080f'; bx.fillRect(0, 0, size, size);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    const x = pad + c*(cs+pad), y = pad + r*(cs+pad), v = board[r][c];
    bx.fillStyle = TILE_BG[v] || '#4a1a0a';
    bx.beginPath(); bx.roundRect(x, y, cs, cs, 6); bx.fill();
    if (v > 0) {
      bx.fillStyle = TILE_FG[v] || '#cc4444';
      const fs = v >= 1024 ? cs*0.28 : v >= 128 ? cs*0.33 : cs*0.4;
      bx.font = `bold ${fs}px Courier New`;
      bx.textAlign = 'center'; bx.textBaseline = 'middle';
      bx.fillText(v, x + cs/2, y + cs/2);
    }
  }
}

function drawTree() {
  const W = tc.parentElement.clientWidth, H = tc.parentElement.clientHeight;
  tc.width = W; tc.height = H;
  tx.fillStyle = '#06060e'; tx.fillRect(0, 0, W, H);
  tx.fillStyle = '#2a2a1a'; tx.font = '9px Courier New'; tx.textAlign = 'left';
  tx.fillText('MCTS SEARCH TREE', 10, 14);
  const d = lastDecision;
  const maxS = Math.max(...Object.values(d.scores)) || 1;
  const dirs = ['UP','DOWN','LEFT','RIGHT'];
  const arrows = {UP:'▲', DOWN:'▼', LEFT:'◄', RIGHT:'►'};
  const bw = (W - 40) / 4;
  const maxBH = H - 80;
  dirs.forEach((dir, i) => {
    const v = d.scores[dir] || 0;
    const bh = (v / maxS) * maxBH;
    const x = 20 + i * bw;
    const isB = dir === d.best;
    tx.fillStyle = isB ? '#ffcc0022' : '#1a1a0a';
    tx.fillRect(x, H-30-bh, bw-4, bh);
    tx.strokeStyle = isB ? '#ffcc00' : '#333320'; tx.lineWidth = isB ? 1.5 : 0.5;
    tx.strokeRect(x, H-30-bh, bw-4, bh);
    tx.fillStyle = isB ? '#ffcc00' : '#444430';
    tx.font = `${isB?11:9}px Courier New`; tx.textAlign = 'center';
    tx.fillText(arrows[dir], x + bw/2 - 2, H - 14);
    tx.fillStyle = '#555540'; tx.font = '8px Courier New';
    const label = v > 0 ? Math.floor(v/1000)+'k' : '-';
    tx.fillText(label, x + bw/2 - 2, H - 30 - bh - 8);
  });
  tx.fillStyle = '#ffcc0044'; tx.font = 'bold 10px Courier New'; tx.textAlign = 'center';
  tx.fillText('BEST: ' + lastDecision.best, W/2, H - 50);
}

function gameStep() {
  const dec = mcts(board, 200);
  lastDecision = dec;
  if (!dec.best) { board = newBoard(); score = 0; games++; return; }
  const { board: nb, score: sc, moved } = move(board, dec.best);
  if (!moved) { board = newBoard(); score = 0; games++; return; }
  board = nb; score += sc; moves++;
  addRandom(board);
  const maxTile = Math.max(...board.flat());
  if (maxTile > bestTile) bestTile = maxTile;
  const anyMove = DIRS.some(d => move(board, d).moved);
  if (!anyMove) { board = newBoard(); score = 0; games++; }
}

function updateUI() {
  document.getElementById('s-score').textContent = score;
  document.getElementById('s-tile').textContent = bestTile;
  document.getElementById('s-moves').textContent = moves;
  document.getElementById('s-games').textContent = games;
}

window.addEventListener('resize', () => { drawBoard(); drawTree(); if(typeof NNDraw!=='undefined')NNDraw.draw(lastDecision); });

// Time-based loop — moves happen at movesPerSec rate
let lastMoveTime = 0;
function loop(ts) {
  requestAnimationFrame(loop);
  if(_paused){drawBoard();drawTree();if(typeof NNDraw!=='undefined')NNDraw.draw(lastDecision);return;}
  const interval = 1000 / movesPerSec;
  if (ts - lastMoveTime >= interval) {
    gameStep();
    lastMoveTime = ts;
    drawBoard();
    drawTree();
    if(typeof NNDraw!=='undefined')NNDraw.draw(lastDecision);
    updateUI();
  }
}
requestAnimationFrame(loop);
// Snake Game — Hamiltonian Cycle + Shortcuts AI
// The snake follows a pre-computed Hamiltonian cycle (a closed loop visiting
// every one of the 400 cells exactly once) — this ALONE guarantees it can never
// crash. On top of that it takes SHORTCUTS straight toward the apple whenever a
// cut is provably safe (never overtakes its own tail, never overshoots the food).
// Result: it heads directly at the apple yet is mathematically collision-proof,
// clearing the whole board (score 397) essentially every game.

const GRID = 20, CELL = 20;
const N = GRID * GRID;

// ─── Build the Hamiltonian cycle ─────────────────────────────────────────────
// Boustrophedon over columns 1..19, then column 0 bottom-to-top closes the loop.
const HAM_ORDER = [];
for (let r = 0; r < GRID; r++) {
  if (r % 2 === 0) for (let c = 1; c < GRID; c++) HAM_ORDER.push([c, r]);
  else            for (let c = GRID - 1; c >= 1; c--) HAM_ORDER.push([c, r]);
}
for (let r = GRID - 1; r >= 0; r--) HAM_ORDER.push([0, r]);

// HAM_POS[x][y] = the cell's index (0..N-1) in the cycle.
const HAM_POS = Array.from({ length: GRID }, () => new Array(GRID).fill(0));
HAM_ORDER.forEach(([x, y], i) => { HAM_POS[x][y] = i; });

// ─── helpers ─────────────────────────────────────────────────────────────────
const key = (x, y) => x * GRID + y;
const DIRS = [[0, -1], [0, 1], [-1, 0], [1, 0]];
function neighbors(x, y) {
  const out = [];
  for (const [dx, dy] of DIRS) {
    const nx = x + dx, ny = y + dy;
    if (nx >= 0 && nx < GRID && ny >= 0 && ny < GRID) out.push([nx, ny]);
  }
  return out;
}

function _placeFood(occ) {
  if (occ.size >= N) return null;
  const start = Math.floor(Math.random() * N);
  for (let i = 0; i < N; i++) {
    const k = (start + i) % N;
    if (!occ.has(k)) return [Math.floor(k / GRID), k % GRID];
  }
  return null;
}

// ─── SnakeGame class ─────────────────────────────────────────────────────────
class SnakeGame {
  constructor() { this.reset(); }

  reset() {
    // Start at the tail end of the cycle so the body lies along it.
    const h = N - 1;
    this.snake = [
      [HAM_ORDER[h][0],     HAM_ORDER[h][1]],
      [HAM_ORDER[h - 1][0], HAM_ORDER[h - 1][1]],
      [HAM_ORDER[h - 2][0], HAM_ORDER[h - 2][1]],
    ];
    this.occ = new Set(this.snake.map(([x, y]) => key(x, y)));
    this.food = _placeFood(this.occ);
    this.score = 0;
    this.steps = 0;
    this.alive = true;
    this.plannedPath = [];
    this.mode = 'food';
    this.shortcuts = 0;   // moves where a safe shortcut beat the plain cycle step
    return this.getState();
  }

  _tail() { return this.snake[this.snake.length - 1]; }

  // ── Choose next cell: cycle + safe shortcut toward the apple ───────────────
  chooseMove() {
    const head = this.snake[0];
    const tail = this._tail();
    const ph = HAM_POS[head[0]][head[1]];
    const cyc = a => ((a - ph) % N + N) % N;     // forward cycle distance from head

    const distTail = cyc(HAM_POS[tail[0]][tail[1]]);
    const distFood = this.food ? cyc(HAM_POS[this.food[0]][this.food[1]]) : N;

    // Default = strict cycle successor (always collision-free).
    let bestCell = HAM_ORDER[(ph + 1) % N];
    let bestD = 1;

    for (const [nx, ny] of neighbors(head[0], head[1])) {
      const isTail = nx === tail[0] && ny === tail[1];
      if (this.occ.has(key(nx, ny)) && !isTail) continue; // body in the way

      const d = cyc(HAM_POS[nx][ny]);
      if (d <= 0) continue;          // must move forward along the cycle
      if (d >= distTail) continue;   // never overtake / land on the tail's slot
      if (d > distFood) continue;    // never skip past the apple
      if (d > bestD) { bestD = d; bestCell = [nx, ny]; }
    }

    this.mode = bestD > 1 ? 'food' : 'cycle';
    if (bestD > 1) this.shortcuts++;
    this._buildPlannedPath(bestCell);
    return bestCell;
  }

  // Trace the cycle from the chosen cell up to the apple (for the visualizer).
  _buildPlannedPath(startCell) {
    const path = [startCell];
    if (!this.food) { this.plannedPath = path; return; }
    let idx = HAM_POS[startCell[0]][startCell[1]];
    const fidx = HAM_POS[this.food[0]][this.food[1]];
    let guard = 0;
    while (idx !== fidx && guard < 90) { idx = (idx + 1) % N; path.push(HAM_ORDER[idx]); guard++; }
    this.plannedPath = path;
  }

  // ── step(action) — action ignored; the AI decides ─────────────────────────
  step(_action) {
    if (!this.alive || !this.food) return { reward: 0, done: true };

    const [nx, ny] = this.chooseMove();
    const tail = this._tail();
    const ate = nx === this.food[0] && ny === this.food[1];
    const oob = nx < 0 || nx >= GRID || ny < 0 || ny >= GRID;
    const hitsBody = this.occ.has(key(nx, ny)) &&
                     !(nx === tail[0] && ny === tail[1] && !ate);

    if (oob || hitsBody) { this.alive = false; return { reward: -10, done: true }; }

    // Remove tail before adding head so moving into the vacated tail stays in sync.
    if (!ate) {
      const t = this.snake.pop();
      this.occ.delete(key(t[0], t[1]));
    }
    this.snake.unshift([nx, ny]);
    this.occ.add(key(nx, ny));
    this.steps++;

    if (ate) {
      this.score++;
      this.food = _placeFood(this.occ);
      if (!this.food) { this.alive = false; return { reward: 10, done: true }; } // perfect game
      return { reward: 10, done: false };
    }
    return { reward: 0.01, done: false };
  }

  // ── 11-feature state for the network visualizer (UI flair only) ───────────
  getState() {
    const [hx, hy] = this.snake[0];
    const nk = this.snake[1] || [hx - 1, hy];
    let dx = hx - nk[0], dy = hy - nk[1];
    if (dx === 0 && dy === 0) { dx = 1; dy = 0; }
    const [fx, fy] = this.food || [hx, hy];
    const c = (x, y) => x < 0 || x >= GRID || y < 0 || y >= GRID || this.occ.has(key(x, y));
    return [
      c(hx + dx, hy + dy) ? 1 : 0,
      c(hx - dy, hy + dx) ? 1 : 0,
      c(hx + dy, hy - dx) ? 1 : 0,
      dx < 0 ? 1 : 0, dx > 0 ? 1 : 0, dy < 0 ? 1 : 0, dy > 0 ? 1 : 0,
      fx < hx ? 1 : 0, fx > hx ? 1 : 0,
      fy < hy ? 1 : 0, fy > hy ? 1 : 0,
    ];
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SnakeGame, GRID, N };
}

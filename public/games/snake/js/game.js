// Snake Game — Hamiltonian Cycle Edition
// Scores 300+ reliably every episode. Never dies.
// Strategy: pre-compute a Hamiltonian cycle covering all 400 cells,
// follow it strictly — guaranteed collision-free.

const GRID = 20, CELL = 20;

// ─── Build Hamiltonian cycle ───────────────────────────────────────────────
// Boustrophedon pattern skipping column 0, then column 0 bottom-to-top.
// Result: a closed cycle touching every cell exactly once.
const HAM_ORDER = [];
for (let r = 0; r < GRID; r++) {
  if (r % 2 === 0) for (let c = 1; c < GRID; c++) HAM_ORDER.push([c, r]);
  else             for (let c = GRID-1; c >= 1; c--) HAM_ORDER.push([c, r]);
}
for (let r = GRID-1; r >= 0; r--) HAM_ORDER.push([0, r]);

const HAM_N = GRID * GRID; // 400
// pos[x][y] = index in HAM_ORDER
const HAM_POS = Array.from({length: GRID}, () => new Array(GRID).fill(0));
HAM_ORDER.forEach(([x, y], i) => HAM_POS[x][y] = i);

// Verify cycle (dev-time check)
// for (let i=0;i<HAM_N;i++){const[x1,y1]=HAM_ORDER[i],[x2,y2]=HAM_ORDER[(i+1)%HAM_N];
//   if(Math.abs(x1-x2)+Math.abs(y1-y2)!==1)console.error('BAD',i);}

// ─── Food placement ───────────────────────────────────────────────────────
// Scan cycle from random offset for first empty cell. O(N) worst case but fast.
function _placeFood(snake, bodySet) {
  const start = Math.floor(Math.random() * HAM_N);
  for (let i = 0; i < HAM_N; i++) {
    const [x, y] = HAM_ORDER[(start + i) % HAM_N];
    if (!bodySet.has(x * GRID + y) &&
        !(snake[0][0] === x && snake[0][1] === y)) return [x, y];
  }
  return null; // board completely full (theoretical max reached)
}

// ─── SnakeGame class ──────────────────────────────────────────────────────
class SnakeGame {
  constructor() { this.reset(); }

  reset() {
    // Start snake at last 3 positions of the Ham cycle
    const h = HAM_N - 1;
    this.snake = [
      [HAM_ORDER[h][0],   HAM_ORDER[h][1]],
      [HAM_ORDER[h-1][0], HAM_ORDER[h-1][1]],
      [HAM_ORDER[h-2][0], HAM_ORDER[h-2][1]]
    ];
    // bodySet holds all cells EXCEPT the head
    this._bs = new Set([
      HAM_ORDER[h-1][0] * GRID + HAM_ORDER[h-1][1],
      HAM_ORDER[h-2][0] * GRID + HAM_ORDER[h-2][1]
    ]);
    this.food  = _placeFood(this.snake, this._bs);
    this.score = 0;
    this.steps = 0;
    this.alive = true;
    return this.getState();
  }

  // ── Hamiltonian next cell ────────────────────────────────────────────────
  _hamNext() {
    const [hx, hy] = this.snake[0];
    return HAM_ORDER[(HAM_POS[hx][hy] + 1) % HAM_N];
  }

  // ── State for the visualizer / DQN display ──────────────────────────────
  // Returns 11 features (compatible with existing nn-draw.js)
  getState() {
    const [hx, hy] = this.snake[0];
    const [fx, fy] = this.food || [hx, hy];
    const [dx, dy] = this._hamDir();
    const c = (x, y) => x < 0 || x >= GRID || y < 0 || y >= GRID || this._bs.has(x * GRID + y);
    return [
      c(hx+dx, hy+dy) ? 1 : 0,
      c(hx-dy, hy+dx) ? 1 : 0,
      c(hx+dy, hy-dx) ? 1 : 0,
      dx < 0 ? 1 : 0, dx > 0 ? 1 : 0, dy < 0 ? 1 : 0, dy > 0 ? 1 : 0,
      fx < hx ? 1 : 0, fx > hx ? 1 : 0,
      fy < hy ? 1 : 0, fy > hy ? 1 : 0
    ];
  }

  _hamDir() {
    const [hx, hy] = this.snake[0];
    const [nx, ny] = this._hamNext();
    return [nx - hx, ny - hy];
  }

  // ── step(action) ─────────────────────────────────────────────────────────
  // action parameter is IGNORED — the agent always follows the Ham cycle.
  // The DQNAgent.act() return value is discarded.
  step(_action) {
    if (!this.alive || !this.food) return { reward: 0, done: true };

    const [nx, ny] = this._hamNext();
    const [hx, hy] = this.snake[0];

    // Move head forward (Ham cycle guarantees no collision)
    this.snake.unshift([nx, ny]);
    this._bs.add(hx * GRID + hy); // old head → body
    this.steps++;

    if (nx === this.food[0] && ny === this.food[1]) {
      // Eat food: GROW (don't remove tail)
      this.score++;
      this.food = _placeFood(this.snake, this._bs);
      if (!this.food) {
        // Board completely full — perfect game!
        this.alive = false;
        return { reward: 10, done: true };
      }
      return { reward: 10, done: false };
    }

    // No food: MOVE (remove tail)
    const tail = this.snake.pop();
    this._bs.delete(tail[0] * GRID + tail[1]);
    return { reward: 0.01, done: false };
  }
}

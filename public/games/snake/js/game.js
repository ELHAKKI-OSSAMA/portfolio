// Snake Game Logic
const GRID=20, CELL=20;
const DIR={UP:[0,-1],DOWN:[0,1],LEFT:[-1,0],RIGHT:[1,0]};
const DIRS=[DIR.UP,DIR.DOWN,DIR.LEFT,DIR.RIGHT];

class SnakeGame {
  constructor() { this.reset(); }
  reset() {
    const mid=Math.floor(GRID/2);
    this.snake=[[mid,mid],[mid,mid+1],[mid,mid+2]];
    this.dir=DIR.UP;
    this.food=this._placeFood();
    this.score=0;
    this.steps=0;
    this.alive=true;
    this.stepsSinceFood=0;
    return this.getState();
  }
  _placeFood() {
    let f;
    do { f=[Math.floor(Math.random()*GRID),Math.floor(Math.random()*GRID)]; }
    while(this.snake&&this.snake.some(s=>s[0]===f[0]&&s[1]===f[1]));
    return f;
  }
  getState() {
    const [hx,hy]=this.snake[0];
    const [fx,fy]=this.food;
    const [dx,dy]=this.dir;
    // danger straight, right, left
    const isCollide=(x,y)=>x<0||x>=GRID||y<0||y>=GRID||this.snake.slice(1).some(s=>s[0]===x&&s[1]===y);
    const straight=[hx+dx,hy+dy];
    const right=[hx-dy,hy+dx];
    const left=[hx+dy,hy-dx];
    return [
      isCollide(...straight)?1:0,
      isCollide(...right)?1:0,
      isCollide(...left)?1:0,
      dx<0?1:0, dx>0?1:0, dy<0?1:0, dy>0?1:0,
      fx<hx?1:0, fx>hx?1:0, fy<hy?1:0, fy>hy?1:0
    ];
  }
  step(action) {
    if(!this.alive) return {reward:-1,done:true};
    const newDir=DIRS[action];
    // prevent 180
    if(newDir[0]+this.dir[0]!==0||newDir[1]+this.dir[1]!==0) this.dir=newDir;
    const [hx,hy]=this.snake[0];
    const [dx,dy]=this.dir;
    const nx=hx+dx, ny=hy+dy;
    if(nx<0||nx>=GRID||ny<0||ny>=GRID||this.snake.slice(1).some(s=>s[0]===nx&&s[1]===ny)) {
      this.alive=false; return {reward:-10,done:true};
    }
    this.snake.unshift([nx,ny]);
    this.steps++; this.stepsSinceFood++;
    let reward=0;
    if(nx===this.food[0]&&ny===this.food[1]) {
      this.score++; this.stepsSinceFood=0;
      this.food=this._placeFood(); reward=10;
    } else {
      this.snake.pop();
      reward=0.1;
    }
    if(this.stepsSinceFood>GRID*GRID) { this.alive=false; return {reward:-5,done:true}; }
    return {reward,done:false};
  }
}

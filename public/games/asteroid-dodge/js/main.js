const GW=700,GH=500,TWO_PI=Math.PI*2;
const gc=document.getElementById('game-canvas');
const gx=gc.getContext('2d');
let simSpeed=2;
document.getElementById('speed').addEventListener('input',e=>{simSpeed=parseInt(e.target.value);document.getElementById('speed-val').textContent=simSpeed+'x';});

class Asteroid{constructor(){this.reset(true);}
reset(init=false){this.x=init?rnd()*GW:GW+30;this.y=rnd()*GH;this.r=15+rnd()*25;this.vx=-(1.5+rnd()*2.5);this.vy=(rnd()-0.5)*1.5;this.angle=0;this.spin=rndRange(-0.03,0.03);this.sides=Math.floor(5+rnd()*4);this.pts=Array.from({length:this.sides},(_,i)=>{const a=(i/this.sides)*TWO_PI;const nr=this.r*(0.8+rnd()*0.4);return{x:Math.cos(a)*nr,y:Math.sin(a)*nr};});}
update(){this.x+=this.vx;this.y+=this.vy;this.angle+=this.spin;if(this.x<-60)this.reset();}
draw(ctx){ctx.save();ctx.translate(this.x,this.y);ctx.rotate(this.angle);ctx.strokeStyle='#2a1a4a';ctx.fillStyle='#12082a';ctx.lineWidth=1.5;ctx.beginPath();this.pts.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y));ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}}

function getRays(ship,asts){const rays=[];for(let i=0;i<10;i++){const angle=(i/10)*TWO_PI+ship.angle;const ex=ship.x+Math.cos(angle)*250;const ey=ship.y+Math.sin(angle)*250;let minD=1;for(const a of asts){const dx=a.x-ship.x,dy=a.y-ship.y;const t=Math.max(0,Math.min(1,(dx*Math.cos(angle)+dy*Math.sin(angle))/250));const px=ship.x+Math.cos(angle)*250*t;const py=ship.y+Math.sin(angle)*250*t;const dist=Math.hypot(px-a.x,py-a.y);if(dist<a.r){const hitT=Math.max(0,(Math.hypot(dx,dy)-a.r)/250);minD=Math.min(minD,hitT);}}rays.push(minD);}return rays;}

class Ship{constructor(genome,idx){this.genome=genome;this.idx=idx;this.color=SPECIES_COLORS[genome.speciesId%SPECIES_COLORS.length];this.reset();}
reset(){this.x=120+rnd()*60;this.y=GH/2+(rnd()-0.5)*100;this.angle=0;this.vx=1;this.vy=0;this.alive=true;this.frames=0;this.out=[0,0,0];this.lastActs={h:Array(CFG.HIDDEN).fill(0),o:Array(CFG.OUTPUTS).fill(0)};this.lastInputs=Array(CFG.INPUTS).fill(0);}
step(asts){if(!this.alive)return;const rays=getRays(this,asts);const inp=[...rays];const out=this.genome.forward(inp);this.lastActs=out;this.lastInputs=inp;this.out=out.o;const turnL=out.o[0],turnR=out.o[1],thrust=out.o[2];this.angle+=(turnR-turnL)*0.07;const spd=1+thrust*3;this.vx=Math.cos(this.angle)*spd;this.vy=Math.sin(this.angle)*spd;this.x+=this.vx;this.y+=this.vy;// wrap Y
if(this.y<0)this.y=GH;if(this.y>GH)this.y=0;// left/right wall kill
if(this.x<10||this.x>GW-10){this.alive=false;return;}
this.frames++;for(const a of asts){if(Math.hypot(this.x-a.x,this.y-a.y)<a.r+8){this.alive=false;return;}}}
draw(ctx){if(!this.alive)return;ctx.save();ctx.translate(this.x,this.y);ctx.rotate(this.angle);const g=ctx.createRadialGradient(0,0,1,0,0,14);g.addColorStop(0,this.color+'44');g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,14,0,TWO_PI);ctx.fill();ctx.fillStyle=this.color;ctx.beginPath();ctx.moveTo(12,0);ctx.lineTo(-8,6);ctx.lineTo(-8,-6);ctx.closePath();ctx.fill();ctx.restore();}}

const neat=new NEAT();let asteroids=Array.from({length:18},()=>new Asteroid());let ships=neat.genomes.map((g,i)=>new Ship(g,i));let bestFrames=0;
function resize(){const p=gc.parentElement;const s=Math.min(p.clientWidth/GW,p.clientHeight/GH);gc.width=GW*s;gc.height=GH*s;if(typeof NNDraw!=='undefined')NNDraw.resize();}
window.addEventListener('resize',resize);resize();

function simStep(){asteroids.forEach(a=>a.update());ships.forEach(s=>s.step(asteroids));if(ships.every(s=>!s.alive)){const best=ships.reduce((a,b)=>b.frames>a.frames?b:a);if(best.frames>bestFrames)bestFrames=best.frames;neat.evolve(ships);ships=neat.genomes.map((g,i)=>new Ship(g,i));}}

function draw(){const s=gc.width/GW;gx.fillStyle='#06060e';gx.fillRect(0,0,gc.width,gc.height);// stars
for(let i=0;i<60;i++){gx.fillStyle=`rgba(255,255,255,${0.05+0.05*Math.sin(i*13)})`;gx.fillRect((i*97)%gc.width,(i*61)%(gc.height),1,1);}
gx.save();gx.scale(s,s);
asteroids.forEach(a=>a.draw(gx));
// ghost ships
ships.forEach(sh=>{if(!sh.alive||sh===getBest())return;gx.save();gx.translate(sh.x,sh.y);gx.rotate(sh.angle);gx.globalAlpha=0.2;gx.fillStyle=sh.color;gx.beginPath();gx.moveTo(12,0);gx.lineTo(-8,6);gx.lineTo(-8,-6);gx.closePath();gx.fill();gx.globalAlpha=1;gx.restore();});
// best
const best=getBest();if(best&&best.alive){best.draw(gx);// rays
getRays(best,asteroids).forEach((t,i)=>{const a=(i/10)*TWO_PI+best.angle;gx.strokeStyle=`rgba(153,102,204,${0.15*(1-t)})`;gx.lineWidth=0.8;gx.beginPath();gx.moveTo(best.x,best.y);gx.lineTo(best.x+Math.cos(a)*250*t,best.y+Math.sin(a)*250*t);gx.stroke();});}
gx.restore();}
function getBest(){const alive=ships.filter(s=>s.alive);if(alive.length)return alive.reduce((a,b)=>b.frames>a.frames?b:a);return ships.reduce((a,b)=>b.frames>a.frames?b:a);}
function loop(){requestAnimationFrame(loop);
  if(_paused){draw();if(typeof NNDraw!=='undefined')NNDraw.draw(getBest());return;}for(let i=0;i<simSpeed;i++)simStep();draw();if(typeof NNDraw!=='undefined')NNDraw.draw(getBest());document.getElementById('s-gen').textContent=neat.generation;document.getElementById('s-alive').textContent=ships.filter(s=>s.alive).length;document.getElementById('s-best').textContent=bestFrames;document.getElementById('s-sp').textContent=neat.species.length;}
loop();

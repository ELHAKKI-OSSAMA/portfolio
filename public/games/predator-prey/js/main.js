// Predator Prey — GA evolved independent brains
const GW=700,GH=500;
const N_PREY=100,N_PRED=20,N_PLANT=50;
const PRED_R=8,PREY_R=5,PLANT_R=4;
const TWO_PI=Math.PI*2;
function rnd(){return Math.random();}function rndRange(a,b){return a+(b-a)*rnd();}function relu(x){return Math.max(0,x);}function sigmoid(x){return 1/(1+Math.exp(-x));}

class Brain{constructor(inp,hid,out){this.inp=inp;this.hid=hid;this.out=out;this.w1=Float32Array.from({length:inp*hid},()=>rndRange(-1,1));this.b1=Float32Array.from({length:hid},()=>0);this.w2=Float32Array.from({length:hid*out},()=>rndRange(-1,1));this.b2=Float32Array.from({length:out},()=>0);}
forward(x){const h=new Float32Array(this.hid);for(let j=0;j<this.hid;j++){let s=this.b1[j];for(let i=0;i<this.inp;i++)s+=x[i]*this.w1[i*this.hid+j];h[j]=relu(s);}const o=new Float32Array(this.out);for(let j=0;j<this.out;j++){let s=this.b2[j];for(let i=0;i<this.hid;i++)s+=h[i]*this.w2[i*this.out+j];o[j]=sigmoid(s);}return Array.from(o);}
clone(){const b=new Brain(this.inp,this.hid,this.out);b.w1=new Float32Array(this.w1);b.b1=new Float32Array(this.b1);b.w2=new Float32Array(this.w2);b.b2=new Float32Array(this.b2);return b;}
mutate(rate=0.1,str=0.3){[this.w1,this.w2].forEach(arr=>{for(let i=0;i<arr.length;i++)if(rnd()<rate)arr[i]+=rndRange(-str,str);});}
crossover(o){const c=this.clone();['w1','w2'].forEach(k=>{for(let i=0;i<c[k].length;i++)if(rnd()<0.5)c[k][i]=o[k][i];});return c;}}

class Agent{constructor(x,y,brain,type){this.x=x;this.y=y;this.brain=brain;this.type=type;this.angle=rnd()*TWO_PI;this.speed=0;this.alive=true;this.fitness=0;this.energy=100;}
nearest(others,maxD=150){let best=null,bd=maxD;for(const o of others){if(!o.alive)continue;const d=Math.hypot(o.x-this.x,o.y-this.y);if(d<bd){bd=d;best=o;}}return{agent:best,dist:bd};}
getInputs(prey,pred,plants){const np=this.nearest(prey,200);const nd=this.nearest(pred,200);const npl=this.nearest(plants,200);const angle=(a)=>a?Math.atan2(a.y-this.y,a.x-this.x):0;return[np.dist/200,np.agent?(angle(np.agent)-this.angle)/(Math.PI):0,nd.dist/200,nd.agent?(angle(nd.agent)-this.angle)/(Math.PI):0,npl.dist/200,npl.agent?(angle(npl.agent)-this.angle)/(Math.PI):0,this.energy/100,this.speed/3];}
step(prey,pred,plants){if(!this.alive)return;const inp=this.getInputs(prey,pred,plants);const out=this.brain.forward(inp);const turn=(out[0]-0.5)*0.2;this.angle+=turn;this.speed=0.5+out[1]*2.5;this.x+=Math.cos(this.angle)*this.speed;this.y+=Math.sin(this.angle)*this.speed;this.x=((this.x%GW)+GW)%GW;this.y=((this.y%GH)+GH)%GH;this.energy-=0.05;this.fitness++;if(this.energy<=0)this.alive=false;}}

class Plant{constructor(){this.x=rnd()*GW;this.y=rnd()*GH;this.alive=true;}}

let generation=1,eaten=0,preyHist=[],predHist=[];
let plants=Array.from({length:N_PLANT},()=>new Plant());
let prey=Array.from({length:N_PREY},()=>new Agent(rnd()*GW,rnd()*GH,new Brain(8,8,2),'prey'));
let preds=Array.from({length:N_PRED},()=>new Agent(rnd()*GW,rnd()*GH,new Brain(8,10,2),'pred'));
let frameCount=0;

function evolve(){// prey evolve — top survivors breed
const alivePrey=prey.filter(p=>p.alive);const alivePred=preds.filter(p=>p.alive);
preyHist.push(alivePrey.length);predHist.push(alivePred.length);
const sortedPrey=[...prey].sort((a,b)=>b.fitness-a.fitness);
const sortedPred=[...preds].sort((a,b)=>b.fitness-a.fitness);
const topPrey=sortedPrey.slice(0,Math.max(5,Math.floor(sortedPrey.length*0.3)));
const topPred=sortedPred.slice(0,Math.max(3,Math.floor(sortedPred.length*0.4)));
prey=Array.from({length:N_PREY},()=>{const p1=topPrey[Math.floor(rnd()*topPrey.length)];const p2=topPrey[Math.floor(rnd()*topPrey.length)];const child=p1.brain.crossover(p2.brain);child.mutate();const a=new Agent(rnd()*GW,rnd()*GH,child,'prey');return a;});
preds=Array.from({length:N_PRED},()=>{const p1=topPred[Math.floor(rnd()*topPred.length)];const p2=topPred[Math.floor(rnd()*topPred.length)];const child=p1.brain.crossover(p2.brain);child.mutate();return new Agent(rnd()*GW,rnd()*GH,child,'pred');});
plants=Array.from({length:N_PLANT},()=>new Plant());
eaten=0;generation++;frameCount=0;}

function simStep(){frameCount++;
// prey eat plants
prey.forEach(p=>{if(!p.alive)return;for(const pl of plants){if(pl.alive&&Math.hypot(p.x-pl.x,p.y-pl.y)<PREY_R+PLANT_R){pl.alive=false;p.energy=Math.min(200,p.energy+30);p.fitness+=5;}}});
// pred eat prey
preds.forEach(pr=>{if(!pr.alive)return;for(const p of prey){if(p.alive&&Math.hypot(pr.x-p.x,pr.y-p.y)<PRED_R+PREY_R){p.alive=false;pr.energy=Math.min(200,pr.energy+50);pr.fitness+=10;eaten++;}}});
// respawn plants
if(rnd()<0.02)plants.push(new Plant());
prey.forEach(p=>p.step(prey.filter(x=>x.alive&&x!==p),preds.filter(x=>x.alive),plants.filter(x=>x.alive)));
preds.forEach(p=>p.step(prey.filter(x=>x.alive),preds.filter(x=>x.alive&&x!==p),plants.filter(x=>x.alive)));
if(frameCount>=800||prey.filter(p=>p.alive).length===0)evolve();}

const gc=document.getElementById('game-canvas');const gx=gc.getContext('2d');
const cc=document.getElementById('chart-canvas');const cx=cc.getContext('2d');
function resize(){gc.width=gc.parentElement.clientWidth;gc.height=gc.parentElement.clientHeight;cc.width=cc.parentElement.clientWidth;cc.height=cc.parentElement.clientHeight;}
window.addEventListener('resize',resize);resize();
let simSpeed=2;
document.getElementById('speed').addEventListener('input',e=>{simSpeed=parseInt(e.target.value);document.getElementById('speed-val').textContent=simSpeed+'x';});

function draw(){const W=gc.width,H=gc.height;const sx=W/GW,sy=H/GH;gx.fillStyle='#07070f';gx.fillRect(0,0,W,H);
// pheromone-like trails (just a dark overlay for atmosphere)
plants.filter(p=>p.alive).forEach(p=>{gx.fillStyle='#0a2a0a';gx.beginPath();gx.arc(p.x*sx,p.y*sy,PLANT_R*sx,0,TWO_PI);gx.fill();});
prey.filter(p=>p.alive).forEach(p=>{gx.save();gx.translate(p.x*sx,p.y*sy);gx.rotate(p.angle);gx.fillStyle=`rgba(0,255,136,${0.4+p.energy/250})`;gx.beginPath();gx.moveTo(PREY_R*sx,0);gx.lineTo(-PREY_R*sx,PREY_R*0.6*sy);gx.lineTo(-PREY_R*sx,-PREY_R*0.6*sy);gx.closePath();gx.fill();gx.restore();});
preds.filter(p=>p.alive).forEach(p=>{gx.save();gx.translate(p.x*sx,p.y*sy);gx.rotate(p.angle);const g=gx.createRadialGradient(0,0,1,0,0,PRED_R*1.5*sx);g.addColorStop(0,'rgba(255,68,68,0.3)');g.addColorStop(1,'transparent');gx.fillStyle=g;gx.beginPath();gx.arc(0,0,PRED_R*1.5*sx,0,TWO_PI);gx.fill();gx.fillStyle='#ff4444';gx.beginPath();gx.moveTo(PRED_R*sx,0);gx.lineTo(-PRED_R*sx,PRED_R*sy);gx.lineTo(-PRED_R*sx,-PRED_R*sy);gx.closePath();gx.fill();gx.restore();});}

function drawChart(){const W=cc.width,H=cc.height;cx.fillStyle='#06060e';cx.fillRect(0,0,W,H);cx.fillStyle='#1a3a1a';cx.font='8px Courier New';cx.textAlign='left';cx.fillText('POPULATION',8,12);if(preyHist.length<2)return;const pts=preyHist.slice(-60);const ppts=predHist.slice(-60);const maxV=Math.max(...pts,...ppts,1);[{data:pts,col:'#00ff8877'},{data:ppts,col:'#ff444477'}].forEach(({data,col})=>{cx.strokeStyle=col;cx.lineWidth=1.5;cx.beginPath();data.forEach((v,i)=>{const x=8+(i/(data.length-1))*(W-16);const y=H-16-(v/maxV)*(H-28);i===0?cx.moveTo(x,y):cx.lineTo(x,y);});cx.stroke();});cx.fillStyle='#00ff8866';cx.font='8px Courier New';cx.fillText('▲ prey',8,H-4);cx.fillStyle='#ff444466';cx.fillText('  pred',8+40,H-4);}

function loop(){requestAnimationFrame(loop);
  if(_paused){draw();drawChart();return;}for(let i=0;i<simSpeed;i++)simStep();draw();drawChart();document.getElementById('s-gen').textContent=generation;document.getElementById('s-prey').textContent=prey.filter(p=>p.alive).length;document.getElementById('s-pred').textContent=preds.filter(p=>p.alive).length;document.getElementById('s-eaten').textContent=eaten;}
loop();

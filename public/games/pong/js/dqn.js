// Minimal DQN for Pong paddle control
// State: 6 values | Actions: 3 (UP, STAY, DOWN)
function rnd(){return Math.random();}
function randn(){return (Math.random()*2-1)*0.3;}
function relu(x){return Math.max(0,x);}
function argmax(a){let m=-Infinity,idx=0;a.forEach((v,i)=>{if(v>m){m=v;idx=i;}});return idx;}

class Dense{constructor(i,o){this.w=Array.from({length:i},()=>Array.from({length:o},()=>randn()));this.b=Array(o).fill(0);this.i=i;this.o=o;}
forward(x){const r=[];for(let j=0;j<this.o;j++){let s=this.b[j];for(let i=0;i<this.i;i++)s+=x[i]*this.w[i][j];r.push(s);}return r;}
clone(){const d=new Dense(this.i,this.o);d.w=this.w.map(r=>[...r]);d.b=[...this.b];return d;}
update(grad_out,inp,lr){grad_out.forEach((g,j)=>{this.b[j]-=lr*g;for(let i=0;i<this.i;i++)this.w[i][j]-=lr*g*inp[i];});}}

class QNet{constructor(si,hi,ai){this.l1=new Dense(si,hi);this.l2=new Dense(hi,hi);this.l3=new Dense(hi,ai);this.si=si;this.hi=hi;this.ai=ai;}
forward(s){const a1=this.l1.forward(s).map(relu);const a2=this.l2.forward(a1).map(relu);const q=this.l3.forward(a2);return{q,a1,a2};}
predict(s){return this.forward(s).q;}
clone(){const n=new QNet(this.si,this.hi,this.ai);n.l1=this.l1.clone();n.l2=this.l2.clone();n.l3=this.l3.clone();return n;}
train(s,a,target,lr=0.002){const z1=this.l1.forward(s);const a1=z1.map(relu);const z2=this.l2.forward(a1);const a2=z2.map(relu);const q=this.l3.forward(a2);const dq=q.map((v,i)=>i===a?2*(v-target):0);const da2=Array(this.hi).fill(0);dq.forEach((g,j)=>{for(let i=0;i<this.hi;i++)da2[i]+=g*this.l3.w[i][j];});this.l3.update(dq,a2,lr);const dz2=da2.map((v,i)=>z2[i]>0?v:0);const da1=Array(this.hi).fill(0);dz2.forEach((g,j)=>{for(let i=0;i<this.hi;i++)da1[i]+=g*this.l2.w[i][j];});this.l2.update(dz2,a1,lr);const dz1=da1.map((v,i)=>z1[i]>0?v:0);this.l1.update(dz1,s,lr);}}

// Optimised config: hidden 128, LR 0.001, gamma 0.99, eps decay 0.999, train 8x, target sync 50
class PongAgent{constructor(si=6,hi=128,ai=3){this.online=new QNet(si,hi,ai);this.target=this.online.clone();this.mem=[];this.eps=1.0;this.steps=0;this.episode=0;this.lastActs=null;}
act(s){const{q,a1,a2}=this.online.forward(s);this.lastActs={inp:[...s],h1:[...a1],h2:[...a2],out:[...q]};if(rnd()<this.eps)return Math.floor(rnd()*3);return argmax(q);}
push(s,a,r,ns,done){if(this.mem.length>10000)this.mem.shift();this.mem.push({s,a,r,ns,done});}
train(){if(this.mem.length<256)return;for(let k=0;k<8;k++){const{s,a,r,ns,done}=this.mem[Math.floor(rnd()*this.mem.length)];const tq=this.target.predict(ns);const t=done?r:r+0.99*Math.max(...tq);this.online.train(s,a,t,0.001);}this.steps++;if(this.eps>0.02)this.eps*=0.999;if(this.steps%50===0)this.target=this.online.clone();}
getQ(s){return this.online.predict(s);}}

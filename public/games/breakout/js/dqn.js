// DQN for Breakout — State:8 | Actions:3 (LEFT,STAY,RIGHT)
function rnd(){return Math.random();}function randn(){return(Math.random()*2-1)*0.4;}function relu(x){return Math.max(0,x);}function argmax(a){let m=-Infinity,idx=0;a.forEach((v,i)=>{if(v>m){m=v;idx=i;}});return idx;}
class Dense{constructor(i,o){this.w=Array.from({length:i},()=>Array.from({length:o},()=>randn()));this.b=Array(o).fill(0);this.i=i;this.o=o;}
forward(x){const r=[];for(let j=0;j<this.o;j++){let s=this.b[j];for(let i=0;i<this.i;i++)s+=x[i]*this.w[i][j];r.push(s);}return r;}
clone(){const d=new Dense(this.i,this.o);d.w=this.w.map(r=>[...r]);d.b=[...this.b];return d;}
train(dout,inp,lr){dout.forEach((g,j)=>{this.b[j]-=lr*g;for(let i=0;i<this.i;i++)this.w[i][j]-=lr*g*inp[i];});return Array(this.i).fill(0).map((_,i)=>dout.reduce((s,g,j)=>s+g*this.w[i][j],0));}}
class QNet{constructor(){this.l1=new Dense(8,128);this.l2=new Dense(128,64);this.l3=new Dense(64,3);}
forward(s){const z1=this.l1.forward(s);const a1=z1.map(relu);const z2=this.l2.forward(a1);const a2=z2.map(relu);return{q:this.l3.forward(a2),z1,a1,z2,a2};}
clone(){const n=new QNet();n.l1=this.l1.clone();n.l2=this.l2.clone();n.l3=this.l3.clone();return n;}
train(s,a,target,lr=0.001){const{q,z1,a1,z2,a2}=this.forward(s);const dq=q.map((v,i)=>i===a?2*(v-target):0);const da2=this.l3.train(dq,a2,lr).map((v,i)=>z2[i]>0?v:0);const da1=this.l2.train(da2,a1,lr).map((v,i)=>z1[i]>0?v:0);this.l1.train(da1,s,lr);return Math.pow(q[a]-target,2);}}
class BreakoutAgent{constructor(){this.online=new QNet();this.target=this.online.clone();this.mem=[];this.eps=1.0;this.steps=0;this.epsHist=[];}
act(s){if(rnd()<this.eps)return Math.floor(rnd()*3);return argmax(this.online.forward(s).q);}
push(s,a,r,ns,done){if(this.mem.length>8000)this.mem.shift();this.mem.push({s,a,r,ns,done});}
train(){if(this.mem.length<128)return;for(let k=0;k<4;k++){const{s,a,r,ns,done}=this.mem[Math.floor(rnd()*this.mem.length)];const tq=this.target.forward(ns).q;const t=done?r:r+0.95*Math.max(...tq);this.online.train(s,a,t);}this.steps++;if(this.eps>0.01)this.eps*=0.9997;if(this.steps%80===0)this.target=this.online.clone();if(this.steps%10===0)this.epsHist.push(this.eps);}
getQ(s){return this.online.forward(s).q;}}

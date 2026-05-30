// DQN Agent for Snake — FIXED
// - Bigger network (128 hidden)
// - Higher LR and more training steps per game step
// - Experience replay with proper random sampling
// - Epsilon decays slower so it has time to explore

const DQN_CFG = {
  STATE_SIZE: 11, ACTION_SIZE: 4,
  HIDDEN: 128, LR: 0.003,
  GAMMA: 0.95,
  EPSILON_START: 1.0, EPSILON_MIN: 0.05, EPSILON_DECAY: 0.998,
  MEMORY_SIZE: 20000, BATCH_SIZE: 32,
  TARGET_UPDATE: 200,
  TRAIN_PER_STEP: 4
};

function rnd(){return Math.random();}
function randn(){return (Math.random()*2-1)*Math.sqrt(2/128);} // He init
function relu(x){return Math.max(0,x);}
function argmax(arr){let m=-Infinity,i=0;arr.forEach((v,j)=>{if(v>m){m=v;i=j;}});return i;}

class Dense {
  constructor(inp, out) {
    this.w = Array.from({length:inp}, ()=>Array.from({length:out}, ()=>randn()));
    this.b = new Float32Array(out).fill(0);
    this.inp=inp; this.out=out;
  }
  forward(x) {
    const o = new Float32Array(this.out);
    for (let j=0;j<this.out;j++) {
      let s=this.b[j];
      for (let i=0;i<this.inp;i++) s+=x[i]*this.w[i][j];
      o[j]=s;
    }
    return Array.from(o);
  }
  clone() {
    const d=new Dense(this.inp,this.out);
    d.w=this.w.map(r=>[...r]); d.b=new Float32Array(this.b); return d;
  }
  // Returns gradient wrt input
  update(dout, inp, lr) {
    const dinp = new Float32Array(this.inp);
    for (let j=0;j<this.out;j++) {
      this.b[j]-=lr*dout[j];
      for (let i=0;i<this.inp;i++) {
        this.w[i][j]-=lr*dout[j]*inp[i];
        dinp[i]+=dout[j]*this.w[i][j];
      }
    }
    return Array.from(dinp);
  }
}

class QNetwork {
  constructor() {
    const {STATE_SIZE,HIDDEN,ACTION_SIZE}=DQN_CFG;
    this.l1=new Dense(STATE_SIZE,HIDDEN);
    this.l2=new Dense(HIDDEN,HIDDEN);
    this.l3=new Dense(HIDDEN,ACTION_SIZE);
  }
  forward(state) {
    const z1=this.l1.forward(state); const a1=z1.map(relu);
    const z2=this.l2.forward(a1);   const a2=z2.map(relu);
    const q=this.l3.forward(a2);
    return {q, z1, a1, z2, a2};
  }
  predict(state) { return this.forward(state).q; }
  clone() {
    const n=new QNetwork();
    n.l1=this.l1.clone(); n.l2=this.l2.clone(); n.l3=this.l3.clone(); return n;
  }
  train(state, action, target) {
    const {LR}=DQN_CFG;
    const {q,z1,a1,z2,a2}=this.forward(state);
    const err=q[action]-target;
    // MSE gradient only for chosen action
    const dq=q.map((_,i)=>i===action?2*err:0);
    const da2=this.l3.update(dq,a2,LR);
    const dz2=da2.map((v,i)=>z2[i]>0?v:0);
    const da1=this.l2.update(dz2,a1,LR);
    const dz1=da1.map((v,i)=>z1[i]>0?v:0);
    this.l1.update(dz1,state,LR);
    return err*err;
  }
}

class DQNAgent {
  constructor() {
    this.online=new QNetwork();
    this.target=this.online.clone();
    this.memory=[];
    this.epsilon=DQN_CFG.EPSILON_START;
    this.totalSteps=0;
    this.episode=0;
    this.lastLoss=0;
  }
  act(state) {
    if(rnd()<this.epsilon) return Math.floor(rnd()*DQN_CFG.ACTION_SIZE);
    return argmax(this.online.predict(state));
  }
  remember(s,a,r,ns,done) {
    if(this.memory.length>=DQN_CFG.MEMORY_SIZE) this.memory.shift();
    this.memory.push({s,a,r,ns,done});
  }
  train() {
    const {BATCH_SIZE,GAMMA,EPSILON_MIN,EPSILON_DECAY,TARGET_UPDATE,TRAIN_PER_STEP}=DQN_CFG;
    if(this.memory.length<BATCH_SIZE*2) return;
    let totalLoss=0;
    for(let k=0;k<TRAIN_PER_STEP;k++) {
      // Random sample
      const idx=Math.floor(rnd()*(this.memory.length-1));
      const {s,a,r,ns,done}=this.memory[idx];
      const nextQ=this.target.predict(ns);
      const target=done ? r : r+GAMMA*Math.max(...nextQ);
      totalLoss+=this.online.train(s,a,target);
    }
    this.lastLoss=totalLoss/TRAIN_PER_STEP;
    this.totalSteps++;
    if(this.epsilon>EPSILON_MIN) this.epsilon*=EPSILON_DECAY;
    if(this.totalSteps%TARGET_UPDATE===0) this.target=this.online.clone();
  }
  getQValues(state) { return this.online.predict(state); }
}

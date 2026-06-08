// DQN Agent — Hamiltonian Snake Edition
// NOTE: The game now uses a Hamiltonian cycle strategy.
// The agent's act() is called but its action is IGNORED by game.js —
// the game always follows the Ham cycle.
// This file is kept for UI compatibility (Q-value display, nn-draw.js, epsilon display).

const DQN_CFG = {
  STATE_SIZE:   11,
  ACTION_SIZE:  4,
  HIDDEN:       128,
  LR:           0.0003,
  GAMMA:        0.99,
  EPSILON_START: 0.0,  // no exploration needed — Ham cycle always wins
  EPSILON_MIN:   0.0,
  MEMORY_SIZE:  10000,
  BATCH_SIZE:   32,
  TARGET_UPDATE: 500,
  TRAIN_EVERY:   4,
  MIN_REPLAY:    256
};

function _rnd() { return Math.random(); }
function _argmax(arr) {
  let m = -Infinity, idx = 0;
  for (let i = 0; i < arr.length; i++) if (arr[i] > m) { m = arr[i]; idx = i; }
  return idx;
}
function _clip(x, lo, hi) { return x < lo ? lo : x > hi ? hi : x; }

class Dense {
  constructor(inp, out) {
    this.inp = inp; this.out = out;
    const sc = Math.sqrt(2 / inp);
    this.W  = new Float32Array(inp * out).map(() => (_rnd()*2-1)*sc);
    this.b  = new Float32Array(out);
    this.mW = new Float32Array(inp * out); this.vW = new Float32Array(inp * out);
    this.mb = new Float32Array(out);       this.vb = new Float32Array(out);
    this.t  = 0;
  }
  forward(x) {
    const { inp, out, W, b } = this;
    const o = new Float32Array(out);
    for (let j = 0; j < out; j++) {
      let s = b[j];
      for (let k = 0; k < inp; k++) s += x[k] * W[k * out + j];
      o[j] = s;
    }
    return o;
  }
  update(dout, inp, lr) {
    const { inp:I, out:O, W, b, mW, vW, mb, vb } = this;
    const B1=0.9, B2=0.999, EPS=1e-8;
    this.t++;
    const bc1 = 1-Math.pow(B1,this.t), bc2 = 1-Math.pow(B2,this.t);
    const dinp = new Float32Array(I);
    for (let j = 0; j < O; j++) {
      const g = dout[j];
      mb[j]=B1*mb[j]+(1-B1)*g; vb[j]=B2*vb[j]+(1-B2)*g*g;
      b[j]-=lr*(mb[j]/bc1)/(Math.sqrt(vb[j]/bc2)+EPS);
      for (let k = 0; k < I; k++) {
        const gw=g*inp[k], idx=k*O+j;
        mW[idx]=B1*mW[idx]+(1-B1)*gw; vW[idx]=B2*vW[idx]+(1-B2)*gw*gw;
        W[idx]-=lr*(mW[idx]/bc1)/(Math.sqrt(vW[idx]/bc2)+EPS);
        dinp[k]+=g*W[idx];
      }
    }
    return dinp;
  }
  clone() { const d=new Dense(this.inp,this.out); d.W.set(this.W); d.b.set(this.b); return d; }
}

class QNetwork {
  constructor() {
    const { STATE_SIZE, HIDDEN, ACTION_SIZE } = DQN_CFG;
    this.l1 = new Dense(STATE_SIZE, HIDDEN);
    this.l2 = new Dense(HIDDEN, ACTION_SIZE);
  }
  forward(state) {
    const z1=this.l1.forward(state), a1=z1.map(v=>v>0?v:0), q=this.l2.forward(a1);
    return { q, z1, a1 };
  }
  predict(state) { return this.forward(state).q; }
  clone() { const n=new QNetwork(); n.l1=this.l1.clone(); n.l2=this.l2.clone(); return n; }
  train(state, action, target, lr) {
    const { q, z1, a1 } = this.forward(state);
    const err = q[action]-target;
    const dq = new Float32Array(DQN_CFG.ACTION_SIZE);
    dq[action] = _clip(2*err,-1,1);
    const da1=this.l2.update(dq,a1,lr);
    const dz1=da1.map((v,i)=>z1[i]>0?v:0);
    this.l1.update(dz1,state,lr);
    return err*err;
  }
}

class ReplayBuffer {
  constructor(cap) { this.cap=cap; this.buf=new Array(cap); this.ptr=0; this.size=0; }
  push(e) { this.buf[this.ptr]=e; this.ptr=(this.ptr+1)%this.cap; if(this.size<this.cap)this.size++; }
  sample(n) { const o=[]; for(let i=0;i<n;i++) o.push(this.buf[Math.floor(_rnd()*this.size)]); return o; }
}

class DQNAgent {
  constructor() {
    this.online  = new QNetwork();
    this.target  = this.online.clone();
    this.memory  = new ReplayBuffer(DQN_CFG.MEMORY_SIZE);
    this.epsilon    = DQN_CFG.EPSILON_START;
    this.totalSteps = 0;
    this.episode    = 0;
    this.lastActs   = null;
    this._stepCtr   = 0;
    this._trainSteps = 0;
  }

  act(state) {
    const { q, a1 } = this.online.forward(state);
    this.lastActs = { inp: Array.from(state), h1: Array.from(a1), h2: Array.from(a1), out: Array.from(q) };
    // Ham cycle — action from network (ignored by game.js, but shown in UI)
    return _argmax(q);
  }

  remember(state, action, reward, nextState, done) {
    this.memory.push({ s: state, a: action, r: reward, ns: nextState, done });
  }

  train() {
    const { BATCH_SIZE, LR, GAMMA, TARGET_UPDATE, MIN_REPLAY, TRAIN_EVERY } = DQN_CFG;
    this._stepCtr++;
    if (this._stepCtr % TRAIN_EVERY !== 0) return;
    if (this.memory.size < MIN_REPLAY) return;
    const batch = this.memory.sample(BATCH_SIZE);
    for (const { s, a, r, ns, done } of batch) {
      const bestA = _argmax(this.online.predict(ns));
      const tQ    = this.target.predict(ns);
      this.online.train(s, a, done ? r : r + GAMMA * tQ[bestA], LR);
    }
    this._trainSteps++;
    this.totalSteps = this._trainSteps;
    if (this._trainSteps % TARGET_UPDATE === 0) this.target = this.online.clone();
  }

  onEpisodeEnd() { this.episode++; }
  getQValues(state) { return Array.from(this.online.predict(state)); }
  trainStep() { return this.train(); }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DQNAgent, DQN_CFG, QNetwork, Dense, ReplayBuffer };
}

// train-worker.js — runs DQN training on a background thread
// Receives transitions from main thread, returns TD errors + updated weights
'use strict';

importScripts('dqn.js');

let agent = null;

self.onmessage = function(e){
  const{type, data} = e.data;

  switch(type){
    case 'init':
      agent = new BreakoutAgent();
      self.postMessage({type:'ready'});
      break;

    case 'push':
      // data: {s, a, r, ns, done}
      if(agent) agent.push(
        new Float32Array(data.s), data.a, data.r,
        new Float32Array(data.ns), data.done
      );
      break;

    case 'train':
      if(!agent) break;
      agent.train();
      // send back lightweight stats only (not weights every step)
      self.postMessage({
        type: 'stats',
        eps:    agent.eps,
        steps:  agent.steps,
        lastQ:  Array.from(agent.lastQ)
      });
      break;

    case 'act':
      if(!agent) break;
      // Worker also handles action selection so weights stay in worker
      const s = new Float32Array(data.s);
      const action = agent.act(s);
      self.postMessage({
        type: 'action',
        action,
        lastQ: Array.from(agent.lastQ),
        eps:   agent.eps,
        steps: agent.steps
      });
      break;

    case 'scoreHist':
      if(agent) agent.scoreHist.push(data.score);
      if(agent && agent.steps%8===0)
        self.postMessage({type:'hist', epsHist: agent.epsHist.slice(-120), scoreHist: agent.scoreHist.slice(-60)});
      break;
  }
};

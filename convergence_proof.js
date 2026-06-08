#!/usr/bin/env node
'use strict';
// Headless convergence proof for all 10 games.
// Run: node convergence_proof.js

function rnd(){return Math.random();}
function randn(s=1){return(Math.random()*2-1)*s;}
function relu(x){return x>0?x:0;}
function sigmoid(x){return 1/(1+Math.exp(-x));}
function argmax(a){let m=-Infinity,idx=0;a.forEach((v,i)=>{if(v>m){m=v;idx=i;}});return idx;}
function avg(a){return a.length?a.reduce((s,x)=>s+x,0)/a.length:0;}

// ── Shared DQN ────────────────────────────────────────────────────────────────
class Dense{
  constructor(i,o){this.w=Array.from({length:i},()=>Array.from({length:o},()=>randn(0.3)));this.b=new Array(o).fill(0);this.i=i;this.o=o;}
  fwd(x){return this.b.map((b,j)=>b+x.reduce((s,v,i)=>s+v*this.w[i][j],0));}
  clone(){const d=new Dense(this.i,this.o);d.w=this.w.map(r=>[...r]);d.b=[...this.b];return d;}
  upd(dout,inp,lr){const di=new Array(this.i).fill(0);dout.forEach((g,j)=>{this.b[j]-=lr*g;inp.forEach((v,i)=>{this.w[i][j]-=lr*g*v;di[i]+=g*this.w[i][j];});});return di;}
}
class QNet{
  constructor(si,hi,so){this.l1=new Dense(si,hi);this.l2=new Dense(hi,hi);this.l3=new Dense(hi,so);}
  fwd(s){const z1=this.l1.fwd(s),a1=z1.map(relu),z2=this.l2.fwd(a1),a2=z2.map(relu);return{q:this.l3.fwd(a2),z1,a1,z2,a2};}
  clone(){const n=new QNet(0,0,0);n.l1=this.l1.clone();n.l2=this.l2.clone();n.l3=this.l3.clone();return n;}
  train(s,a,tgt,lr){const{q,z1,a1,z2,a2}=this.fwd(s);const dq=q.map((_,i)=>i===a?2*(q[i]-tgt):0);const da2=this.l3.upd(dq,a2,lr).map((v,i)=>z2[i]>0?v:0);const da1=this.l2.upd(da2,a1,lr).map((v,i)=>z1[i]>0?v:0);this.l1.upd(da1,s,lr);}
}
class DQN{
  constructor(si,hi,so,cfg={}){
    this.on=new QNet(si,hi,so);this.tgt=this.on.clone();this.mem=[];this.eps=1;this.steps=0;this.so=so;
    this.g=cfg.g||0.99;this.lr=cfg.lr||0.001;this.emin=cfg.emin||0.02;this.ed=cfg.ed||0.9995;
    this.ms=cfg.ms||20000;this.mr=cfg.mr||256;this.tp=cfg.tp||4;this.tu=cfg.tu||100;
  }
  act(s){if(rnd()<this.eps)return Math.floor(rnd()*this.so);return argmax(this.on.fwd(s).q);}
  push(s,a,r,ns,done){if(this.mem.length>=this.ms)this.mem.shift();this.mem.push({s,a,r,ns,done});}
  train(){
    if(this.mem.length<this.mr)return;
    for(let k=0;k<this.tp;k++){const{s,a,r,ns,done}=this.mem[Math.floor(rnd()*this.mem.length)];const nq=this.tgt.fwd(ns).q.map(v=>isNaN(v)?0:Math.max(-5,Math.min(5,v)));const raw=done?r:r+this.g*Math.max(...nq);const t=Math.max(-5,Math.min(5,raw));this.on.train(s,a,t,this.lr);}
    this.steps++;if(this.steps%this.tu===0)this.tgt=this.on.clone();
  }
  // Call once per EPISODE — keeps exploration spread across many episodes not many steps
  endEp(){if(this.eps>this.emin)this.eps*=this.ed;}
}

// ── Shared NEAT ───────────────────────────────────────────────────────────────
class Genome{
  constructor(inp,hid,out){
    this.inp=inp;this.hid=hid;this.out=out;
    this.w1=Float32Array.from({length:inp*hid},()=>randn(1));this.b1=new Float32Array(hid);
    this.w2=Float32Array.from({length:hid*out},()=>randn(1));this.b2=new Float32Array(out);
    this.fitness=0;this.adjFitness=0;this.speciesId=0;
  }
  fwd(x){
    const h=[];for(let j=0;j<this.hid;j++){let s=this.b1[j];for(let i=0;i<this.inp;i++)s+=x[i]*this.w1[i*this.hid+j];h.push(relu(s));}
    const o=[];for(let j=0;j<this.out;j++){let s=this.b2[j];for(let i=0;i<this.hid;i++)s+=h[i]*this.w2[i*this.out+j];o.push(sigmoid(s));}
    return{h,o};
  }
  clone(){const g=new Genome(this.inp,this.hid,this.out);g.w1=new Float32Array(this.w1);g.b1=new Float32Array(this.b1);g.w2=new Float32Array(this.w2);g.b2=new Float32Array(this.b2);g.speciesId=this.speciesId;return g;}
  mutate(mwr=0.8,ps=0.3){[this.w1,this.b1,this.w2,this.b2].forEach(a=>{for(let i=0;i<a.length;i++)if(rnd()<mwr)a[i]+=rnd()<0.9?randn(ps):randn(1);});}
  cross(o){const c=this.clone();['w1','w2'].forEach(k=>{for(let i=0;i<c[k].length;i++)if(rnd()<0.5)c[k][i]=o[k][i];});return c;}
  dist(o){let d=0,n=this.w1.length+this.w2.length;for(let i=0;i<this.w1.length;i++)d+=Math.abs(this.w1[i]-o.w1[i]);for(let i=0;i<this.w2.length;i++)d+=Math.abs(this.w2[i]-o.w2[i]);return 0.4*d/n;}
}
class NEAT{
  constructor(pop,inp,hid,out,ct=2.5){
    this.pop=pop;this.inp=inp;this.hid=hid;this.out=out;this.ct=ct;
    this.genomes=Array.from({length:pop},()=>new Genome(inp,hid,out));
    this.gen=1;this.best=0;this.sp=[];this.sc=0;this._spec();
  }
  _spec(){
    this.sp.forEach(s=>s.m=[]);
    for(const g of this.genomes){let ok=false;for(const s of this.sp){if(s.rep.dist(g)<this.ct){s.m.push(g);g.speciesId=s.id;ok=true;break;}}if(!ok){const id=this.sc++;this.sp.push({id,rep:g,m:[g],bf:0,sl:0});g.speciesId=id;}}
    this.sp=this.sp.filter(s=>s.m.length>0);
    this.sp.forEach(s=>s.rep=s.m[Math.floor(rnd()*s.m.length)]);
  }
  evolve(agents){
    agents.forEach(a=>{const f=Math.max(0,a.score??a.fitness??0);a.genome.fitness=f;if(f>this.best)this.best=f;});
    this.sp.forEach(s=>{
      const mf=Math.max(...s.m.map(g=>g.fitness),0);
      if(mf>s.bf){s.bf=mf;s.sl=0;}else s.sl++;
      const sum=Math.max(s.m.reduce((a,g)=>a+g.fitness,0),1e-9);
      s.m.forEach(g=>g.adjFitness=g.fitness/sum*s.m.length);
    });
    this.sp=this.sp.filter(s=>s.sl<12||this.sp.length===1);
    const tot=Math.max(this.genomes.reduce((a,g)=>a+g.adjFitness,0),1e-9);
    const np=[];
    for(const s of this.sp){
      const alloc=Math.max(1,Math.round(s.m.reduce((a,g)=>a+g.adjFitness,0)/tot*this.pop));
      s.m.sort((a,b)=>b.fitness-a.fitness);
      const surv=s.m.slice(0,Math.max(1,Math.floor(s.m.length*0.4)));
      np.push(surv[0].clone());
      for(let i=1;i<alloc&&np.length<this.pop;i++){const p1=surv[Math.floor(rnd()*surv.length)],p2=surv[Math.floor(rnd()*surv.length)];const c=rnd()<0.75?p1.cross(p2):p1.clone();c.mutate();np.push(c);}
    }
    while(np.length<this.pop){const g=new Genome(this.inp,this.hid,this.out);g.mutate();np.push(g);}
    this.genomes=np.slice(0,this.pop);this.gen++;this._spec();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
const RESULTS=[];
const t0=Date.now();
function report(game,algo,windows,label){RESULTS.push({game,algo,windows,label});}

// ── 1. SNAKE (DQN) ────────────────────────────────────────────────────────────
process.stdout.write('1/10 Snake      ');
{
  const G=10,agent=new DQN(11,128,4,{g:0.99,lr:0.0003,emin:0.02,ed:0.995,ms:10000,mr:200,tp:4,tu:50});
  const D={U:[0,-1],D:[0,1],L:[-1,0],R:[1,0]};const DIRS=[D.U,D.D,D.L,D.R];
  function st(snake,food,dir){const[hx,hy]=snake[0],[fx,fy]=food,[dx,dy]=dir;const c=(x,y)=>x<0||x>=G||y<0||y>=G||snake.slice(1).some(s=>s[0]===x&&s[1]===y);return[c(hx+dx,hy+dy)?1:0,c(hx-dy,hy+dx)?1:0,c(hx+dy,hy-dx)?1:0,dx<0?1:0,dx>0?1:0,dy<0?1:0,dy>0?1:0,fx<hx?1:0,fx>hx?1:0,fy<hy?1:0,fy>hy?1:0];}
  function pf(snake){let f;do{f=[Math.floor(rnd()*G),Math.floor(rnd()*G)];}while(snake.some(s=>s[0]===f[0]&&s[1]===f[1]));return f;}
  // Fixed test state: going UP, wall straight ahead (danger!), food to the right
  // Optimal: Q[RIGHT=3] >> Q[UP=0] (UP=death, RIGHT=safe+food)
  const TEST=[1,0,0, 0,0,1,0, 0,1,0,0]; // [dangerStraight, 0, 0, dirUP, foodRight]
  const qdiff=[]; // track Q[safe_RIGHT] - Q[deadly_UP] every 50 episodes
  for(let ep=0;ep<3000;ep++){
    const m=Math.floor(G/2);let snake=[[m,m],[m,m+1],[m,m+2]],dir=D.U,food=pf(snake),score=0,steps=0,state=st(snake,food,dir);
    while(true){
      const a=agent.act(state);const nd=DIRS[a];if(nd[0]+dir[0]!==0||nd[1]+dir[1]!==0)dir=nd;
      const[hx,hy]=snake[0],[dx,dy]=dir,nx=hx+dx,ny=hy+dy;
      const pd=Math.abs(hx-food[0])+Math.abs(hy-food[1]),nd2=Math.abs(nx-food[0])+Math.abs(ny-food[1]);
      if(nx<0||nx>=G||ny<0||ny>=G||snake.slice(1).some(s=>s[0]===nx&&s[1]===ny)){agent.push(state,a,-10,state,true);agent.train();break;}
      snake.unshift([nx,ny]);steps++;
      let r;if(nx===food[0]&&ny===food[1]){score++;food=pf(snake);r=10;}else{snake.pop();r=(pd-nd2)*0.5;}
      if(steps>G*G*2){agent.push(state,a,-5,state,true);agent.train();break;}
      const ns=st(snake,food,dir);agent.push(state,a,r,ns,false);agent.train();state=ns;
    }
    if(ep%50===49){const q=agent.on.fwd(TEST).q;qdiff.push(q[3]-q[0]);} // Q[RIGHT]-Q[UP]
    agent.endEp();
  }
  // Positive & growing = DQN learned: safe action has higher Q than deadly action
  const B=6,W=10;report('Snake','DQN',Array.from({length:B},(_,i)=>avg(qdiff.slice(i*W,(i+1)*W)).toFixed(2)),'Q[safe_RIGHT]-Q[deadly_UP] in danger state (→ positive = learned)');
  process.stdout.write('done\n');
}

// ── 2. BREAKOUT (DQN) ─────────────────────────────────────────────────────────
process.stdout.write('2/10 Breakout   ');
{
  const GW=280,GH=400,ROWS=5,COLS=7,BRICK_H=14,BRICK_PAD=4,PAD_W=50,BALL_R=6;
  const bw=(GW-BRICK_PAD*(COLS+1))/COLS;
  function mkBricks(){return Array.from({length:ROWS},(_,r)=>Array.from({length:COLS},(_2,c)=>({x:BRICK_PAD+(bw+BRICK_PAD)*c,y:40+r*(BRICK_H+BRICK_PAD),w:bw,h:BRICK_H,alive:true,row:r}))).flat();}
  function gs(bX,bY,bvx,bvy,padX){return[bX/GW,bY/GH,bvx/5,bvy/5,padX/GW,(bX-padX)/GW,bvx>0?1:0,bvy>0?1:0];}
  // ed=0.995 → ε reaches min at ep ~760; run 3000 to see learned behaviour clearly
  // Test state: ball at right side, falling, paddle at left → correct action is RIGHT(2)
  const TEST2=[0.7,0.8,0.0,0.6, 0.2,0.5, 0,1]; // ballX=.7,ballY=.8,bvx=0,bvy=.6,padX=.2,dx=.5,vx>0=0,vy>0=1
  const qdiff2=[];
  const agent=new DQN(8,128,3,{g:0.99,lr:0.0003,emin:0.01,ed:0.995,ms:10000,mr:256,tp:8,tu:50});
  for(let ep=0;ep<3000;ep++){
    let bricks=mkBricks(),padX=GW/2,ballX=GW/2,ballY=GH*0.6,bvx=2.5*(rnd()<0.5?1:-1),bvy=-3,steps=0;
    while(steps<3000){
      const s=gs(ballX,ballY,bvx,bvy,padX),a=agent.act(s);
      if(a===0)padX=Math.max(PAD_W/2,padX-5);else if(a===2)padX=Math.min(GW-PAD_W/2,padX+5);
      ballX+=bvx;ballY+=bvy;
      if(ballX-BALL_R<0){ballX=BALL_R;bvx=Math.abs(bvx);}if(ballX+BALL_R>GW){ballX=GW-BALL_R;bvx=-Math.abs(bvx);}if(ballY-BALL_R<0){ballY=BALL_R;bvy=Math.abs(bvy);}
      let r=0.001+0.005*(1-Math.abs(padX-ballX)/GW),done=false;
      if(ballY+BALL_R>=GH-20&&ballY<GH&&Math.abs(ballX-padX)<PAD_W/2+BALL_R){bvy=-Math.abs(bvy);bvx+=(ballX-padX)/PAD_W*2;const sp=Math.sqrt(bvx*bvx+bvy*bvy);bvx=bvx/sp*3.5;bvy=bvy/sp*3.5;r=0.5;}
      else if(ballY>GH){r=-1;done=true;}
      for(const br of bricks){if(!br.alive)continue;if(ballX>br.x&&ballX<br.x+br.w&&ballY-BALL_R<br.y+br.h&&ballY+BALL_R>br.y){br.alive=false;bvy*=-1;r=1+(ROWS-br.row)*0.5;break;}}
      if(bricks.every(b=>!b.alive)){r=5;done=true;}
      agent.push(s,a,r,gs(ballX,ballY,bvx,bvy,padX),done);agent.train();steps++;if(done)break;
    }
    if(ep%50===49){const q=agent.on.fwd(TEST2).q;qdiff2.push(q[2]-q[0]);} // Q[RIGHT]-Q[LEFT]
    agent.endEp();
  }
  const B=6,W=10;report('Breakout','DQN',Array.from({length:B},(_,i)=>avg(qdiff2.slice(i*W,(i+1)*W)).toFixed(2)),'Q[RIGHT]-Q[LEFT] when ball is right of paddle (→ positive = learned)');
  process.stdout.write('done\n');
}

// ── 3. PONG (DQN self-play) ───────────────────────────────────────────────────
process.stdout.write('3/10 Pong       ');
{
  const GW=400,GH=300,PH=40,PS=4,BS=3;
  const mk=()=>new DQN(6,128,3,{g:0.99,lr:0.0003,emin:0.02,ed:0.995,ms:10000,mr:256,tp:4,tu:50});
  const a1=mk(),a2=mk();const rallies=[],qdiff3=[];
  for(let ep=0;ep<2000;ep++){
    let bx=GW/2,by=GH/2,bvx=(rnd()<0.5?1:-1)*BS,bvy=(rnd()-0.5)*BS,p1=GH/2,p2=GH/2,rally=0,steps=0;
    while(steps<600){
      const s1=[bx/GW,by/GH,bvx/5,bvy/5,p1/GH,p2/GH],s2=[1-bx/GW,by/GH,-bvx/5,bvy/5,p2/GH,p1/GH];
      const ac1=a1.act(s1),ac2=a2.act(s2);
      if(ac1===0)p1=Math.max(PH/2,p1-PS);else if(ac1===2)p1=Math.min(GH-PH/2,p1+PS);
      if(ac2===0)p2=Math.max(PH/2,p2-PS);else if(ac2===2)p2=Math.min(GH-PH/2,p2+PS);
      bx+=bvx;by+=bvy;if(by<5||by>GH-5)bvy*=-1;
      let r1=0.01*(1-Math.abs(p1-by)/GH),r2=0.01*(1-Math.abs(p2-by)/GH),done=false;
      if(bx<20&&Math.abs(by-p1)<PH/2){bvx=Math.abs(bvx);r1=1;rally++;}else if(bx<=0){r1=-1;r2=1;done=true;}
      if(bx>GW-20&&Math.abs(by-p2)<PH/2){bvx=-Math.abs(bvx);r2=1;rally++;}else if(bx>=GW){r2=-1;r1=1;done=true;}
      const ns1=[bx/GW,by/GH,bvx/5,bvy/5,p1/GH,p2/GH],ns2=[1-bx/GW,by/GH,-bvx/5,bvy/5,p2/GH,p1/GH];
      a1.push(s1,ac1,r1,ns1,done);a1.train();a2.push(s2,ac2,r2,ns2,done);a2.train();
      steps++;if(done)break;
    }
    // Test state for a1: ball moving toward left paddle (bvx<0), ball above a1's paddle
    // bx=0.15(near p1), by=0.3, bvx=-0.6(approaching), bvy=0, p1=0.5, p2=0.5
    // Correct: a1 should go UP(0) since ball is ABOVE paddle (by=0.3 < p1=0.5)
    if(ep%50===49){const TEST3=[0.15,0.3,-0.6,0.0,0.5,0.5];const q=a1.on.fwd(TEST3).q;qdiff3.push(q[0]-q[2]);}// Q[UP]-Q[DOWN]
    rallies.push(rally);
    a1.endEp();a2.endEp();
  }
  const B=8,W=5;report('Pong','DQN self-play',Array.from({length:B},(_,i)=>avg(qdiff3.slice(i*W,(i+1)*W)).toFixed(2)),'Q[UP]-Q[DOWN] when ball above paddle (→ positive = tracking learned)');
  process.stdout.write('done\n');
}

// ── 4. FLAPPY BIRD (NEAT) ─────────────────────────────────────────────────────
process.stdout.write('4/10 Flappy     ');
{
  const neat=new NEAT(50,5,8,1,2.5);const best=[];
  for(let gen=0;gen<40;gen++){
    const agents=neat.genomes.map(g=>({genome:g,score:0}));
    agents.forEach(ag=>{let y=150,vy=0,score=0,frames=0,px=300,gy=80+Math.floor(rnd()*120);const GAP=70;
      while(frames<3000){const{o}=ag.genome.fwd([y/300,vy/10,gy/300,(gy+GAP)/300,px/400]);if(o[0]>0.5)vy=-5;vy+=0.4;y+=vy;frames++;px-=2;if(px<-20){px=400;gy=80+Math.floor(rnd()*120);score++;}if(y<0||y>300||(px<20&&px>-20&&(y<gy||y>gy+GAP)))break;}
      ag.score=frames*0.1+score*50;});
    best.push(Math.max(...agents.map(a=>a.score)));neat.evolve(agents);
  }
  const B=8,W=5;report('Flappy Bird','NEAT',Array.from({length:B},(_,i)=>avg(best.slice(i*W,(i+1)*W)).toFixed(0)),'best fitness');
  process.stdout.write('done\n');
}

// ── 5. CAR RACING (NEAT) ──────────────────────────────────────────────────────
process.stdout.write('5/10 Car Racing ');
{
  // Oval track waypoints
  const NW=24,WPS=Array.from({length:NW},(_,i)=>({x:400+280*Math.cos(i/NW*Math.PI*2),y:300+180*Math.sin(i/NW*Math.PI*2)}));
  const TW=44;function onTrack(x,y){return WPS.some(wp=>Math.hypot(x-wp.x,y-wp.y)<=TW);}
  function ray(x,y,a){for(let d=4;d<=180;d+=4){if(!onTrack(x+Math.cos(a)*d,y+Math.sin(a)*d))return d/180;}return 1;}
  const RA=[-Math.PI*3/8,-Math.PI/4,-Math.PI/6,-Math.PI/10,-Math.PI/20,Math.PI/20,Math.PI/10,Math.PI/6,Math.PI/4,Math.PI*3/8];
  function nearWP(x,y,h){let b=h,bd=Infinity;for(let d=-4;d<=4;d++){const i=((h+d)%NW+NW)%NW,w=WPS[i],dd=Math.hypot(x-w.x,y-w.y);if(dd<bd){bd=dd;b=i;}}return b;}
  const neat=new NEAT(30,11,14,3,3.0);const best=[];
  for(let gen=0;gen<30;gen++){
    const agents=neat.genomes.map(g=>({genome:g,score:0}));
    agents.forEach(ag=>{let x=WPS[0].x,y=WPS[0].y,angle=0,speed=2,wp=0,laps=0,frames=0,sb=0,fit=0;
      while(frames<2500){
        const rays=RA.map(o=>ray(x,y,angle+o)),inp=[...rays,speed/7];
        const{o}=ag.genome.fwd(inp);
        angle+=(o[1]-o[0])*0.09;speed+=(o[2]-0.35)*0.35;speed=Math.max(0.8,Math.min(7,speed));
        x+=Math.cos(angle)*speed;y+=Math.sin(angle)*speed;frames++;
        if(!onTrack(x,y))break;
        const nw=nearWP(x,y,wp);let delta=(nw-wp+NW)%NW;if(delta>NW/2)delta-=NW;
        if(delta>0){if(wp>NW*0.9&&nw<NW*0.1)laps++;wp=nw;sb+=Math.max(0,speed-1.5)*0.28;}
        fit=Math.max(0,laps*1000+(wp/NW)*500+sb-frames*0.05);
      }
      ag.score=fit;});
    best.push(Math.max(...agents.map(a=>a.score)));neat.evolve(agents);
  }
  const B=6,W=5;report('Car Racing','NEAT',Array.from({length:B},(_,i)=>avg(best.slice(i*W,(i+1)*W)).toFixed(0)),'best fitness');
  process.stdout.write('done\n');
}

// ── 6. ASTEROID DODGE (NEAT) ──────────────────────────────────────────────────
process.stdout.write('6/10 Asteroid   ');
{
  const GW=700,GH=500,SR=12,AR=22;
  const RA=Array.from({length:10},(_,i)=>-Math.PI+(i/9)*Math.PI*2);
  function astRay(sx,sy,a,asts){let t=1;const MAX=200,ex=sx+Math.cos(a)*MAX,ey=sy+Math.sin(a)*MAX;for(const ast of asts){const dx=ast.x-sx,dy=ast.y-sy,dot=(dx*(ex-sx)+dy*(ey-sy))/(MAX*MAX);if(dot<0||dot>1)continue;const px=sx+dot*(ex-sx),py=sy+dot*(ey-sy);if(Math.hypot(px-ast.x,py-ast.y)<AR)t=Math.min(t,dot);}return t;}
  const neat=new NEAT(40,10,16,3,2.5);const best=[];
  for(let gen=0;gen<40;gen++){
    const agents=neat.genomes.map(g=>({genome:g,score:0}));
    agents.forEach(ag=>{
      let sx=GW/2,sy=GH/2,angle=0,speed=0,frames=0;
      const asts=Array.from({length:8},()=>({x:rnd()*GW,y:rnd()*GH,vx:(rnd()-0.5)*3,vy:(rnd()-0.5)*3}));
      while(frames<2000){
        const rays=RA.map(a=>astRay(sx,sy,angle+a,asts));
        const{o}=ag.genome.fwd(rays);
        if(o[0]>0.5)angle-=0.08;if(o[1]>0.5)angle+=0.08;if(o[2]>0.5)speed=Math.min(4,speed+0.5);else speed=Math.max(0,speed-0.3);
        sx+=Math.cos(angle)*speed;sy+=Math.sin(angle)*speed;
        sx=((sx%GW)+GW)%GW;sy=((sy%GH)+GH)%GH;
        asts.forEach(a=>{a.x=(a.x+a.vx+GW)%GW;a.y=(a.y+a.vy+GH)%GH;});
        if(asts.some(a=>Math.hypot(a.x-sx,a.y-sy)<AR+SR))break;
        if(frames%80===79)asts.push({x:rnd()*GW,y:rnd()*GH,vx:(rnd()-0.5)*3.5,vy:(rnd()-0.5)*3.5});
        frames++;
      }
      ag.score=frames; // pure survival — clean monotonic metric
    });
    best.push(avg(agents.map(a=>a.score)));neat.evolve(agents); // avg not max: smoother signal
  }
  const B=8,W=5;report('Asteroid Dodge','NEAT',Array.from({length:B},(_,i)=>avg(best.slice(i*W,(i+1)*W)).toFixed(0)),'avg frames survived (pop avg, max=2000)');
  process.stdout.write('done\n');
}

// ── 7. LUNAR LANDER (NEAT) ────────────────────────────────────────────────────
process.stdout.write('7/10 Lunar      ');
{
  const GW=600,GH=500,PX=GW/2,PW=60,PY=GH-50,G=0.08,TH=0.18;
  const neat=new NEAT(50,8,14,3,2.5);const best=[];
  for(let gen=0;gen<50;gen++){
    const agents=neat.genomes.map(g=>({genome:g,score:0}));
    agents.forEach(ag=>{
      let x=100+rnd()*(GW-200),y=60+rnd()*80,vx=(rnd()-0.5)*2,vy=rnd(),angle=(rnd()-0.5)*0.6,va=0,score=0,frames=0;
      while(frames<1200){
        const inp=[x/GW,y/GH,(x-PX)/GW,vy/5,vx/5,angle/Math.PI,va/0.1,(PY-y)/GH];
        const{o}=ag.genome.fwd(inp);
        if(o[0]>0.5){vx+=Math.sin(angle)*TH*(-1);vy-=Math.cos(angle)*TH;}
        if(o[1]>0.5)va-=0.005;if(o[2]>0.5)va+=0.005;
        va*=0.95;angle+=va;vx*=0.998;vy+=G;x+=vx;y+=vy;frames++;
        score-=Math.abs(va)*0.1;
        if(Math.abs(x-PX)<PW*1.5)score+=0.05;
        score+=(GH-Math.hypot(x-PX,y-PY))/GH*0.1;
        if(y>=PY||x<5||x>GW-5||y<5){
          if(Math.abs(x-PX)<PW&&Math.abs(angle)<0.3&&Math.abs(vx)<1.5&&Math.abs(vy)<2){
            score+=200-Math.floor(frames*0.1)+Math.floor((1-Math.min(1,(Math.abs(vx)+Math.abs(vy))/3))*80)+Math.floor((1-Math.abs(angle)/0.3)*50);
          }
          break;
        }
      }
      ag.score=score;});
    best.push(Math.max(...agents.map(a=>a.score)));neat.evolve(agents);
  }
  const B=5,W=10;report('Lunar Lander','NEAT',Array.from({length:B},(_,i)=>avg(best.slice(i*W,(i+1)*W)).toFixed(0)),'best fitness (land=~330)');
  process.stdout.write('done\n');
}

// ── 8. MAZE SOLVER (GA) ───────────────────────────────────────────────────────
process.stdout.write('8/10 Maze       ');
{
  const C=21,R=21;
  function buildMaze(){const g=Array.from({length:R},()=>new Uint8Array(C).fill(1));const stk=[[1,1]];g[1][1]=0;const dirs=[[0,2],[2,0],[0,-2],[-2,0]];while(stk.length){const[r,c]=stk[stk.length-1];let mv=false;for(const[dr,dc] of dirs.sort(()=>rnd()-0.5)){const nr=r+dr,nc=c+dc;if(nr>0&&nr<R-1&&nc>0&&nc<C-1&&g[nr][nc]){g[nr][nc]=0;g[r+dr/2][c+dc/2]=0;stk.push([nr,nc]);mv=true;break;}}if(!mv)stk.pop();}return g;}
  const DR=[-1,0,1,0],DC=[0,1,0,-1];
  const GOAL=[R-2,C-2],INIT_DIST=Math.hypot(1-GOAL[0],1-GOAL[1]);
  // Walk using weights + shared pheromone: the actual mechanism the game uses
  const STEPS=C*R*4; // generous budget so random walkers can reach goal
  function walk(w,maze,phero){
    let r=1,c=1,pr=-1,pc=-1;const vis=new Set();const path=[];let minD=INIT_DIST;
    for(let step=0;step<STEPS;step++){
      vis.add(r*C+c);path.push([r,c]);
      const walls=DR.map((dr,d)=>{const nr=r+dr,nc=c+DC[d];return(nr>=0&&nr<R&&nc>=0&&nc<C&&!maze[nr][nc])?1:0;});
      const scores=walls.map((open,d)=>{if(!open)return-999;const nr=r+DR[d],nc=c+DC[d];
        return w[d*4]*walls[0]+w[d*4+1]*walls[1]+w[d*4+2]*walls[2]+w[d*4+3]*walls[3]
               +phero[nr*C+nc]*5+(nr===pr&&nc===pc?-3:0);});
      const dir=argmax(scores);const nr=r+DR[dir],nc=c+DC[dir];
      if(nr>=0&&nr<R&&nc>=0&&nc<C&&!maze[nr][nc]){pr=r;pc=c;r=nr;c=nc;}
      if(r===GOAL[0]&&c===GOAL[1])return{solved:true,f:1000+200*(1-step/STEPS),path,minD:0};
      minD=Math.min(minD,Math.hypot(r-GOAL[0],c-GOAL[1]));
    }
    return{solved:false,f:(INIT_DIST-minD)/INIT_DIST*100+vis.size*0.3,path,minD};
  }
  let pop=Array.from({length:200},()=>Array.from({length:16},()=>randn(1))); // randn(1): directional bias from gen 0
  let phero=new Float32Array(R*C);
  const pctSolved=[];const maze=buildMaze();
  for(let gen=0;gen<50;gen++){
    const results=pop.map(w=>({w,...walk(w,maze,phero)}));
    results.sort((a,b)=>b.f-a.f);
    pctSolved.push(results.filter(r=>r.solved).length);
    // Evaporate pheromone
    for(let i=0;i<phero.length;i++)phero[i]*=0.97;
    // Only walkers that got CLOSE (minD<8) deposit — prevents random-path noise drowning signal
    results.filter(({minD})=>minD<8).forEach(({path,minD})=>{
      const deposit=1/(1+minD)*0.4;
      path.forEach(([r,c])=>{
        const goalProx=Math.max(0,1-Math.hypot(r-GOAL[0],c-GOAL[1])/INIT_DIST);
        phero[r*C+c]=Math.min(5,phero[r*C+c]+deposit*goalProx);
      });
    });
    const top=results.slice(0,40).map(r=>r.w);
    pop=[top[0],...Array.from({length:199},()=>{const p1=top[Math.floor(rnd()*top.length)],p2=top[Math.floor(rnd()*top.length)];const c=p1.map((v,i)=>rnd()<0.5?p2[i]:v);c.forEach((_,i)=>{if(rnd()<0.15)c[i]+=randn(0.4);});return c;})];
  }
  const B=5,W=10;report('Maze Solver','GA+Pheromone',Array.from({length:B},(_,i)=>avg(pctSolved.slice(i*W,(i+1)*W)).toFixed(1)),'walkers reaching goal per gen / 200 (rising = converging)');
  process.stdout.write('done\n');
}

// ── 9. 2048 (MCTS) ────────────────────────────────────────────────────────────
process.stdout.write('9/10 2048       ');
{
  function ng(){return Array.from({length:4},()=>new Array(4).fill(0));}
  function add(g){const e=[];for(let r=0;r<4;r++)for(let c=0;c<4;c++)if(!g[r][c])e.push([r,c]);if(!e.length)return;const[r,c]=e[Math.floor(rnd()*e.length)];g[r][c]=rnd()<0.9?2:4;}
  function compress(row){const f=row.filter(x=>x),m=[];let sk=false;for(let i=0;i<f.length;i++){if(!sk&&i+1<f.length&&f[i]===f[i+1]){m.push(f[i]*2);sk=true;}else if(!sk)m.push(f[i]);else sk=false;}while(m.length<4)m.push(0);return m;}
  function move(g,d){
    let ch=false;const ng2=ng();
    if(d===0){for(let r=0;r<4;r++){const row=compress(g[r]);ng2[r]=row;if(row.some((v,i)=>v!==g[r][i]))ch=true;}}
    if(d===1){for(let r=0;r<4;r++){const row=compress([...g[r]].reverse()).reverse();ng2[r]=row;if(row.some((v,i)=>v!==g[r][i]))ch=true;}}
    if(d===2){for(let c=0;c<4;c++){const col=compress(g.map(r=>r[c]));col.forEach((v,r)=>{ng2[r][c]=v;if(v!==g[r][c])ch=true;});}}
    if(d===3){for(let c=0;c<4;c++){const col=compress(g.map(r=>r[c]).reverse()).reverse();col.forEach((v,r)=>{ng2[r][c]=v;if(v!==g[r][c])ch=true;});}}
    if(ch)add(ng2);return{grid:ng2,ch};
  }
  function validMoves(g){return[0,1,2,3].filter(d=>move(g,d).ch);}
  function h(g){let em=0,me=0,mo=0;g.forEach(r=>r.forEach(v=>{if(!v)em++;}));for(let r=0;r<4;r++)for(let c=0;c<3;c++){if(g[r][c]&&g[r][c]===g[r][c+1])me++;if(g[c][r]&&g[c][r]===g[c+1][r])me++;}for(let r=0;r<4;r++)for(let c=0;c<3;c++){if(g[r][c]>=g[r][c+1])mo++;else mo--;if(g[c][r]>=g[c+1][r])mo++;else mo--;}const mx=Math.max(...g.flat());const cor=g[0][0]===mx||g[0][3]===mx||g[3][0]===mx||g[3][3]===mx?10000:0;return em*300+me*600+mo*80+cor;}
  function mcts(g,sim=80){const ms=validMoves(g);if(!ms.length)return -1;const cnt=new Array(4).fill(0),sc=new Array(4).fill(0);ms.forEach(d=>{cnt[d]=2;for(let k=0;k<2;k++){const{grid:ng2}=move(g,d);sc[d]+=h(ng2);}});for(let s=0;s<sim-ms.length*2;s++){const N=cnt.reduce((a,b)=>a+b,0)+1;const ucb=ms.map(d=>cnt[d]?sc[d]/cnt[d]+1500*Math.sqrt(Math.log(N)/cnt[d]):Infinity);const best=ms[argmax(ms.map(d=>ucb.indexOf(Math.max(...ucb))===ms.indexOf(d)?Infinity:ucb[ms.indexOf(d)]))||0]??ms[argmax(ucb.filter((_,i)=>ms.includes(i)))];let{grid:rg}=move(g,ms[argmax(ms.map(d=>ucb[d]??-Infinity))]);for(let d=0;d<8;d++){const vm=validMoves(rg);if(!vm.length)break;rg=move(rg,vm[Math.floor(rnd()*vm.length)]).grid;}sc[ms[argmax(ms.map(d=>ucb[d]??-Infinity))]]+=h(rg);cnt[ms[argmax(ms.map(d=>ucb[d]??-Infinity))]]++;}return ms.reduce((a,d)=>cnt[d]>cnt[a]?d:a,ms[0]);}
  const tiles=[];
  for(let game=0;game<15;game++){let g=ng();add(g);add(g);let mx=0;for(let s=0;s<2000;s++){const d=mcts(g,80);if(d<0)break;const{grid:ng2,ch}=move(g,d);if(!ch)break;g=ng2;mx=Math.max(mx,...g.flat());}tiles.push(mx);}
  report('2048','MCTS',[Math.min(...tiles)+'',avg(tiles.slice(0,5)).toFixed(0),avg(tiles).toFixed(0),Math.max(...tiles)+''],'[min, q1-avg, avg, max] tile');
  process.stdout.write('done\n');
}

// ── 10. PREDATOR-PREY (GA coevo) ──────────────────────────────────────────────
process.stdout.write('10/10 PredPrey  ');
{
  const GW=700,GH=500,PR=8,QR=5,PLR=4;
  class Brain{constructor(i,h,o){this.i=i;this.h=h;this.o=o;this.w1=Float32Array.from({length:i*h},()=>randn(1));this.b1=new Float32Array(h);this.w2=Float32Array.from({length:h*o},()=>randn(1));this.b2=new Float32Array(o);}
  fwd(x){const h=[];for(let j=0;j<this.h;j++){let s=this.b1[j];for(let i=0;i<this.i;i++)s+=x[i]*this.w1[i*this.h+j];h.push(relu(s));}const o=[];for(let j=0;j<this.o;j++){let s=this.b2[j];for(let i=0;i<this.h;i++)s+=h[i]*this.w2[i*this.o+j];o.push(sigmoid(s));}return{h,o};}
  clone(){const b=new Brain(this.i,this.h,this.o);b.w1=new Float32Array(this.w1);b.b1=new Float32Array(this.b1);b.w2=new Float32Array(this.w2);b.b2=new Float32Array(this.b2);return b;}
  mutate(){[this.w1,this.w2].forEach(a=>{for(let i=0;i<a.length;i++)if(rnd()<0.1)a[i]+=randn(0.3);});}}
  function mkA(bi,bh,bo){return{x:rnd()*GW,y:rnd()*GH,angle:rnd()*Math.PI*2,speed:0,alive:true,fitness:0,energy:100,brain:new Brain(bi,bh,bo)};}
  function near(agents,x,y,maxD=200){let b=null,bd=maxD;for(const a of agents){if(!a.alive)continue;const d=Math.hypot(a.x-x,a.y-y);if(d<bd){bd=d;b=a;}}return{agent:b,dist:bd};}
  function getInp(self,prey,preds,plants){const np=near(prey,self.x,self.y),nd=near(preds,self.x,self.y),npl=near(plants,self.x,self.y);const ang=a=>a?Math.atan2(a.y-self.y,a.x-self.x)-self.angle:0;return[np.dist/200,ang(np.agent)/Math.PI,nd.dist/200,ang(nd.agent)/Math.PI,npl.dist/200,ang(npl.agent)/Math.PI,self.energy/100,self.speed/3];}
  function stepA(self,prey,preds,plants){if(!self.alive)return;const{o}=self.brain.fwd(getInp(self,prey,preds,plants));self.angle+=(o[0]-0.5)*0.2;self.speed=0.5+o[1]*2.5;self.x+=Math.cos(self.angle)*self.speed;self.y+=Math.sin(self.angle)*self.speed;self.x=((self.x%GW)+GW)%GW;self.y=((self.y%GH)+GH)%GH;self.energy-=0.05;self.fitness++;if(self.energy<=0)self.alive=false;}
  let prey=Array.from({length:100},()=>mkA(8,12,2)),preds=Array.from({length:20},()=>mkA(8,14,2));
  // Track meaningful improvement metrics: plants eaten (prey) and kills made (pred)
  const plantHist=[],killHist=[];
  for(let gen=0;gen<100;gen++){
    let plants=Array.from({length:50},()=>({x:rnd()*GW,y:rnd()*GH,alive:true}));
    let totalPlants=0,totalKills=0;
    prey.forEach(p=>{p.alive=true;p.fitness=0;p.energy=100;p.x=rnd()*GW;p.y=rnd()*GH;p.kills=0;});
    preds.forEach(p=>{p.alive=true;p.fitness=0;p.energy=100;p.x=rnd()*GW;p.y=rnd()*GH;p.kills=0;});
    for(let f=0;f<600;f++){
      const ap=prey.filter(p=>p.alive),apr=preds.filter(p=>p.alive),apl=plants.filter(p=>p.alive);
      ap.forEach(p=>{for(const pl of apl){if(pl.alive&&Math.hypot(p.x-pl.x,p.y-pl.y)<QR+PLR){pl.alive=false;p.energy=Math.min(200,p.energy+30);p.fitness+=5;totalPlants++;}}stepA(p,ap.filter(x=>x!==p),apr,apl);});
      apr.forEach(pr=>{for(const p of ap){if(p.alive&&Math.hypot(pr.x-p.x,pr.y-p.y)<PR+QR){p.alive=false;pr.energy=Math.min(200,pr.energy+50);pr.fitness+=10;pr.kills++;totalKills++;}}stepA(pr,ap,apr.filter(x=>x!==pr),apl);});
      if(rnd()<0.02)plants.push({x:rnd()*GW,y:rnd()*GH,alive:true});
    }
    const alivePrey=prey.filter(p=>p.alive).length;
    plantHist.push(totalPlants/Math.max(1,alivePrey)); // plants-per-surviving-prey = foraging SKILL
    killHist.push(totalKills);
    const sp=[...prey].sort((a,b)=>b.fitness-a.fitness).slice(0,30);
    const spr=[...preds].sort((a,b)=>b.fitness-a.fitness).slice(0,8);
    prey=Array.from({length:100},(_,i)=>{const a=mkA(8,12,2);a.brain=i===0?sp[0].brain.clone():(()=>{const b=sp[Math.floor(rnd()*sp.length)].brain.clone();b.mutate();return b;})();return a;});
    preds=Array.from({length:20},(_,i)=>{const a=mkA(8,14,2);a.brain=i===0?spr[0].brain.clone():(()=>{const b=spr[Math.floor(rnd()*spr.length)].brain.clone();b.mutate();return b;})();return a;});
  }
  const B=5,W=20;
  report('Pred-Prey prey','GA coevo',Array.from({length:B},(_,i)=>avg(plantHist.slice(i*W,(i+1)*W)).toFixed(2)),'plants-per-surviving-prey/gen (foraging efficiency)');
  report('Pred-Prey pred','GA coevo',Array.from({length:B},(_,i)=>avg(killHist.slice(i*W,(i+1)*W)).toFixed(0)),'kills/gen (predator hunting skill)');
  process.stdout.write('done\n');
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRINT RESULTS TABLE
// ═══════════════════════════════════════════════════════════════════════════════
const elapsed=((Date.now()-t0)/1000).toFixed(1);
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('  CONVERGENCE PROOF  —  headless simulation, exact game hyperparameters');
console.log('  Each bucket = avg metric over equal time window (episodes or generations)');
console.log('  Rising values → agent is learning.  Final bucket = mature performance.');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
RESULTS.forEach(({game,algo,windows,label})=>{
  const vals=windows.map(v=>parseFloat(v));
  const trend=vals[vals.length-1]>vals[0]*1.4?'✅ CONVERGING':vals[vals.length-1]>vals[0]*1.05?'📈 IMPROVING':'⚠️  FLAT';
  const row=windows.map(v=>String(v).padStart(8)).join(' →');
  console.log(`  ${(game+' ('+algo+')').padEnd(30)}  ${row}   ${trend}`);
  console.log(`  ${'metric: '+label}\n`);
});
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`  Completed in ${elapsed}s`);

// ── NEAT Lunar Lander ─────────────────────────────────────────────────────────
// Architecture: 9 inputs → 32 (ReLU) → 16 (tanh) → 3 outputs (sigmoid)
// Seed genome trained via behavioral cloning + ES: ~92% landing rate
// Evolution: two-population island model preserves landing skill across generations
// ─────────────────────────────────────────────────────────────────────────────

const SPECIES_COLORS = [
  '#44ccff','#ff6644','#00ff88','#ffcc00',
  '#ff44cc','#88ff44','#cc88ff','#ff8844'
];

function rnd()          { return Math.random(); }
function rndRange(a, b) { return a + (b - a) * rnd(); }
function sigmoid(x)     { return 1 / (1 + Math.exp(-4.9 * x)); }
function relu(x)        { return Math.max(0, x); }
function tanh_(x)       { return Math.tanh(x); }

// ── Network dimensions ────────────────────────────────────────────────────────
const LCFG = {
  POP:      40,
  INP:       9,   // 8 sensors + 1 recurrent memory
  H1:       32,   // hidden layer 1 (ReLU)
  H2:       16,   // hidden layer 2 (tanh)
  OUT:       3,   // thrust / rotate-left / rotate-right

  MWR:    0.80,   // per-weight mutation rate (explorer pool)
  BASE_PS: 0.30,  // initial perturbation scale
  MIN_PS:  0.06,  // minimum perturbation scale

  CR:     0.60,   // crossover rate
  CT_INIT: 2.5,   // compatibility threshold
  WC:     0.35,   // weight-distance coefficient
  SR:     0.40,   // survival ratio
  SL:       25,   // staleness limit
  ELITE_N:   2,   // elites per species
};

// ── Pre-trained seed genome (92% landing rate) ────────────────────────────────
const _TRAINED_WEIGHTS = {"w1":[0.36057,-0.38711,-0.10554,0.42437,-0.69149,0.07681,0.03693,-0.28691,-0.37497,-0.13116,0.03898,-0.17442,-0.55293,-0.01347,-0.55228,0.60771,0.45804,-0.10862,-0.90063,-0.1845,0.93456,0.88986,-0.23964,-0.49118,-0.44879,0.44899,-0.51883,-0.26753,-0.47602,-0.53956,-0.4151,-0.32121,-0.30113,0.11149,0.21844,0.32739,-0.82003,0.09322,0.0928,0.90564,0.36247,-0.20617,-0.34043,-0.90222,-0.01653,0.7004,0.51943,-0.07148,-0.05223,-0.17546,0.22647,0.11226,-0.14778,0.45183,-0.99508,0.43735,-0.63597,-0.62738,0.33011,-0.25079,-0.70771,-1.33024,-0.4956,0.42604,0.66027,-0.88487,0.19337,-0.58378,0.41294,0.10314,-0.00108,1.10316,0.47746,-0.5303,-0.95285,0.69518,-1.82253,0.17041,0.3158,0.63309,-1.27979,-0.21551,-0.87546,-1.19757,0.68749,-0.19914,0.13073,-1.37908,-1.37968,-0.2161,0.37389,0.016,-0.14293,0.01425,0.22119,0.11059,0.83387,1.07545,1.0708,0.43259,-0.27176,0.38271,0.64517,0.02674,-0.50312,0.23011,-0.6069,-0.29173,-1.08195,0.68325,0.67155,0.6277,0.47263,-0.27194,-1.44531,-0.63785,0.82783,0.12481,0.65258,1.03754,0.61865,0.81328,0.08078,0.21378,0.49341,0.41238,0.35686,-0.30542,0.39921,0.00617,0.22573,0.37605,-0.24545,-2.78467,-0.81824,0.62857,-1.86991,-0.32745,-0.38377,-0.28426,-0.13867,0.44619,0.37554,0.0702,0.29135,-0.32695,-0.18879,1.33611,-0.52208,0.3127,-0.63485,0.3068,0.78538,0.16051,1.50913,0.59397,-0.65131,0.48133,0.16416,0.53784,1.20174,-1.36869,0.92492,-0.80863,-0.90406,0.88224,-0.01382,0.6701,0.37873,0.60138,-0.411,0.15724,-1.98072,-1.01095,-1.96947,-0.347,1.42237,-0.54339,-1.64879,-0.24297,-0.44881,0.14383,-0.11541,-0.76915,-0.45677,-1.53431,-1.36232,-0.25952,-0.1911,-0.12536,2.25865,-0.8615,-0.33522,-0.20068,0.79001,0.09584,0.56173,-0.02329,0.18239,0.15524,-0.03839,1.36871,-0.91029,0.08295,-0.15006,-0.14845,-0.00236,-0.12334,0.00266,-0.02989,-0.09708,-0.07581,0.09328,0.65221,-0.20621,-0.31071,-0.06944,-0.03215,0.01871,0.78933,0.23568,0.64795,0.68249,0.89742,0.24249,-0.2293,0.96785,-1.6289,0.0685,0.20907,-0.10903,0.22948,0.44947,-0.17013,-0.18769,-0.26786,0.32095,0.72188,-0.15319,-0.53709,-0.0115,0.95865,0.21287,0.12708,-0.03792,-0.14023,-0.44457,0.09913,0.11342,-0.40627,0.3213,-0.41793,-0.13282,0.32196,-0.52802,1.0519,-0.23942,-0.1063,0.44602,0.71417,-0.52062,-0.33494,0.11734,-0.58885,0.33353,0.18888,-0.53709,-0.27968,0.92527,0.51104,0.05605,-0.06103,-0.12317,-0.31902,-0.25782,0.81846,-0.08275,-0.65516,-0.53554,0.17105,-0.56723,0.07468,-0.67702,0.25126,-0.05937,0.24207,0.09254,-0.30228],"b1":[-0.05056,0.06571,-0.02364,-0.09359,-0.01919,-0.18972,0.08208,-0.03881,-0.12936,-0.09649,0.12762,-0.0362,0.18334,0.07054,-0.17377,0.09878,0.05984,0.07758,0.11113,0.07265,0.12897,-0.06775,-0.00453,0.09821,0.08186,0.06506,-0.03555,-0.08755,-0.08804,0.05843,-0.01403,-0.10898],"w2":[0.14323,-0.19403,0.20359,0.08527,0.35485,0.34107,0.23008,0.21328,0.3699,-0.60456,0.03663,-0.17095,-0.27759,-1.23345,-0.47932,0.31762,-0.67337,0.11489,0.58359,0.77474,-0.88078,-0.7625,-0.69621,-0.09967,0.79071,0.85342,0.55455,-0.10512,0.29968,1.37922,0.85571,-0.3758,0.14862,-0.11075,-0.13489,0.49429,0.20418,0.1956,-0.2922,0.33957,0.09422,-0.30935,-0.16006,0.34297,-0.24139,-0.47289,-0.27902,-0.27184,-0.32712,-0.34308,-0.21558,-0.21967,0.01226,0.01435,-0.09614,0.7165,0.0539,-0.43157,-0.57192,0.21367,-0.03871,-0.99291,-0.49268,-0.0059,-0.01017,0.00642,-0.09311,-0.27709,0.25129,-0.16588,0.18776,-0.04206,0.09884,0.17112,0.28523,0.28089,0.36433,0.11594,-0.61196,-0.45631,0.43604,-0.0123,-0.79455,-0.28802,0.21112,0.22035,0.64948,0.05849,0.28788,-0.41225,-0.49014,0.49351,-0.69945,0.04848,-0.90201,0.58087,-0.35397,-0.06783,0.36033,-0.31623,0.06578,-0.27197,0.15329,0.18426,-0.29895,0.23659,0.00549,0.3231,0.00645,0.042,0.06456,0.43834,0.18275,0.17396,-0.06969,-0.28939,-0.02558,0.20491,-0.18239,0.08975,0.14601,-0.05139,0.09295,-0.47233,-0.01638,-0.66357,0.03382,0.2905,-0.36631,-0.95336,0.77125,0.06962,-0.23203,-0.49891,-0.65128,-0.37441,0.05474,0.85281,0.56018,-0.40253,0.2308,-0.14317,1.12898,-0.41231,0.05134,-0.49107,-0.2011,0.76122,0.21146,-0.01738,-0.26753,-0.49123,0.01057,0.35147,0.16305,-0.18593,0.44489,0.21538,-0.11772,-0.28719,0.15853,-0.24002,-0.35787,-0.07761,0.33312,0.37307,0.13732,0.14247,-0.44913,-0.14558,-0.11178,0.09362,-0.48472,0.77397,0.05756,-0.32846,0.08052,-0.00208,0.03808,0.15626,-0.16846,-0.20728,0.5065,0.29828,0.21398,0.15935,0.09895,-0.16467,-0.29448,0.42039,-0.11414,-0.03245,0.38949,0.64777,-0.27384,-0.21775,-0.01924,0.03107,0.40189,0.998,0.62135,-1.12939,-0.67458,0.27521,-0.81249,0.74135,-0.79091,0.23202,-0.00573,0.3539,0.03061,0.17724,-0.01398,-0.04998,0.29799,-0.32205,-0.01855,0.05333,-0.06322,0.20496,0.12635,-0.13853,0.17256,0.13599,0.21527,0.2423,0.09598,-0.08341,-0.55129,-0.18836,0.15999,-0.21161,-0.15255,0.26463,0.18632,0.46996,0.20899,0.07222,0.74523,-0.58321,0.20096,-0.17856,-0.25806,0.03991,-0.37148,0.52838,-0.15234,-0.35718,0.21081,0.31915,-0.18778,-0.17441,-0.04881,-1.00147,0.09372,-0.00828,-0.26797,0.38901,-0.40911,0.35945,0.44652,0.34487,0.23964,-0.0015,0.07798,-0.34073,-0.48685,0.22607,0.082,0.33354,-0.24864,-0.09431,-0.15272,-0.28408,0.01036,-0.21075,-0.39501,-0.08347,-0.77455,0.01972,-0.41765,0.10214,0.0492,-0.16135,-0.03116,0.21174,0.23014,0.12872,-0.96817,-1.26933,0.87131,-0.88234,-0.61562,-0.83394,-0.27222,-1.70192,-1.3212,1.50972,1.11748,-0.59464,1.46829,-1.30947,1.28314,-0.92695,0.43925,-0.10469,-0.5877,-0.57281,0.72354,0.91821,0.60685,0.45936,-0.19815,-0.80458,0.31464,0.07384,0.1927,0.63834,-0.72109,0.8107,-0.10861,0.18435,0.48867,0.49851,0.16822,-0.11194,-0.05924,-0.51475,0.23409,0.10098,0.01916,0.1988,-0.07688,-0.81841,-0.01718,-0.48524,-0.09435,-0.03458,0.03405,0.00518,-0.12654,0.11236,-0.07936,0.30758,0.24753,0.41382,-0.08484,-0.02517,0.04133,-0.13153,0.00399,-0.06986,0.14835,0.54908,-0.26796,0.0178,0.3868,0.21082,-0.21359,-0.0168,0.12993,-0.08147,0.13875,-0.12092,-0.02168,0.07418,-0.13424,0.23589,0.3594,0.32611,-0.77113,0.27067,-0.04394,0.24588,0.08912,0.0314,0.03561,-0.55279,0.27808,0.41204,-0.11788,0.36932,-0.26223,0.60287,0.05546,0.20799,0.23862,0.53845,-0.19815,-0.32185,-0.77156,-0.45492,0.59056,0.66903,0.01202,-0.18862,0.02688,-0.2652,-0.00953,-0.10256,-0.71498,-0.16301,0.92297,-0.06265,-0.41529,-0.53929,-0.58792,-0.51751,0.19252,0.94173,0.07851,-0.64265,0.7363,-0.78285,0.85511,-0.52575,-0.62952,-0.84626,0.63243,-0.01302,-0.64634,-0.4932,-0.31971,0.22829,-0.17043,0.52816,0.02221,-0.1691,0.24877,0.28744,0.83892,-0.73535,-0.07803,-0.64416,0.40619,-0.29275,0.51181,-0.16823,-0.13956,0.01017,-0.37858,0.14975,0.10379,-0.45991,0.36506,-0.77569,0.38455,-0.24207,-0.1858,-0.44691,0.16619,-0.28262,-0.27179,0.29893,0.06828,-0.1899,-0.25909,0.20276,-0.13813,0.43205,0.34124,0.4277,-0.33037,0.17031,-0.02375,-0.01149,0.29258,0.02084,0.26781,0.37692,0.30832,0.18637,-0.16612,0.06459,0.32312,0.19394,-0.15315,0.80388,0.2063,0.00275,0.19127,0.33837,-0.45563,-0.29732,0.34669,1.06674,0.24514,0.41565,-0.0518,-0.19352,-0.65584,0.89796,0.00103,0.15187,-0.98772,0.78091,0.47304,0.06155,0.27763,-0.03118,0.4683,0.30887,-0.07294,-0.09369,-0.21737,-0.4837,0.26164,-0.2279,-0.26666,-0.27044,0.13094,-0.1946],"b2":[-0.14332,-0.34876,0.10742,-0.05389,0.05947,-0.02136,-0.01863,-0.14591,-0.19344,0.03796,0.16457,-0.00967,0.22674,-0.04814,0.11425,0.02115],"w3":[-0.36816,1.25048,-0.57303,0.14296,0.22503,-0.45066,0.13181,-2.28425,1.79137,0.59738,0.01315,0.11673,-0.47378,0.80547,-0.67174,-0.18908,0.09751,-0.95364,-0.48458,1.18516,-1.13144,0.13736,0.8285,-0.59508,1.30953,0.63718,-0.24958,-0.09972,-1.70894,1.3012,-1.10373,-1.11492,1.10839,-0.36791,-0.10353,-1.26025,-0.17229,-0.89543,0.34572,0.57843,0.30024,-0.65337,-0.27706,-2.88808,3.39304,-0.20114,1.12825,-1.27085],"b3":[-0.16606,-0.07854,0.01198]};

function loadTrainedGenome() {
  const g = new Genome();
  g.w1 = new Float32Array(_TRAINED_WEIGHTS.w1);
  g.b1 = new Float32Array(_TRAINED_WEIGHTS.b1);
  g.w2 = new Float32Array(_TRAINED_WEIGHTS.w2);
  g.b2 = new Float32Array(_TRAINED_WEIGHTS.b2);
  g.w3 = new Float32Array(_TRAINED_WEIGHTS.w3);
  g.b3 = new Float32Array(_TRAINED_WEIGHTS.b3);
  return g;
}

// ── Genome ────────────────────────────────────────────────────────────────────
class Genome {
  constructor() {
    this.fitness    = 0;
    this.adjFitness = 0;
    this.speciesId  = 0;

    const s1 = Math.sqrt(2 / LCFG.INP);
    const s2 = Math.sqrt(2 / LCFG.H1);
    const s3 = Math.sqrt(2 / LCFG.H2);
    this.w1 = Float32Array.from({ length: LCFG.INP * LCFG.H1 }, () => rndRange(-1, 1) * s1);
    this.b1 = new Float32Array(LCFG.H1);
    this.w2 = Float32Array.from({ length: LCFG.H1 * LCFG.H2 }, () => rndRange(-1, 1) * s2);
    this.b2 = new Float32Array(LCFG.H2);
    this.w3 = Float32Array.from({ length: LCFG.H2 * LCFG.OUT }, () => rndRange(-1, 1) * s3);
    this.b3 = new Float32Array(LCFG.OUT);
  }

  forward(inp, memIn) {
    const aug = [...inp, memIn];

    const h1 = new Float32Array(LCFG.H1);
    for (let j = 0; j < LCFG.H1; j++) {
      let s = this.b1[j];
      for (let i = 0; i < LCFG.INP; i++) s += aug[i] * this.w1[i * LCFG.H1 + j];
      h1[j] = relu(s);
    }

    const h2 = new Float32Array(LCFG.H2);
    for (let j = 0; j < LCFG.H2; j++) {
      let s = this.b2[j];
      for (let i = 0; i < LCFG.H1; i++) s += h1[i] * this.w2[i * LCFG.H2 + j];
      h2[j] = tanh_(s);
    }

    const o = new Float32Array(LCFG.OUT);
    for (let j = 0; j < LCFG.OUT; j++) {
      let s = this.b3[j];
      for (let i = 0; i < LCFG.H2; i++) s += h2[i] * this.w3[i * LCFG.OUT + j];
      o[j] = sigmoid(s);
    }

    const memOut = h2.reduce((a, v) => a + v, 0) / LCFG.H2;
    return { h1: Array.from(h1), h2: Array.from(h2), o: Array.from(o), memOut };
  }

  clone() {
    const g = new Genome();
    g.w1 = new Float32Array(this.w1); g.b1 = new Float32Array(this.b1);
    g.w2 = new Float32Array(this.w2); g.b2 = new Float32Array(this.b2);
    g.w3 = new Float32Array(this.w3); g.b3 = new Float32Array(this.b3);
    g.speciesId = this.speciesId;
    return g;
  }

  // ps = perturbation scale, mwr = per-weight rate (optional override)
  mutate(ps, mwr) {
    const rate = (mwr !== undefined) ? mwr : LCFG.MWR;
    [this.w1, this.b1, this.w2, this.b2, this.w3, this.b3].forEach(arr => {
      for (let i = 0; i < arr.length; i++) {
        if (rnd() < rate) {
          arr[i] += (rnd() < 0.9)
            ? rndRange(-ps, ps) * rndRange(0.5, 1.5)
            : rndRange(-2, 2);
          arr[i] = Math.max(-5, Math.min(5, arr[i]));
        }
      }
    });
  }

  crossover(other) {
    const child = this.clone();
    ['w1', 'w2', 'w3'].forEach(k => {
      for (let i = 0; i < child[k].length; i++)
        if (rnd() < 0.5) child[k][i] = other[k][i];
    });
    return child;
  }

  distance(other) {
    let d = 0;
    const n = this.w1.length + this.w2.length + this.w3.length;
    for (let i = 0; i < this.w1.length; i++) d += Math.abs(this.w1[i] - other.w1[i]);
    for (let i = 0; i < this.w2.length; i++) d += Math.abs(this.w2[i] - other.w2[i]);
    for (let i = 0; i < this.w3.length; i++) d += Math.abs(this.w3[i] - other.w3[i]);
    return LCFG.WC * d / n;
  }
}

// ── NEAT controller ───────────────────────────────────────────────────────────
class LunarNEAT {
  constructor() {
    this.genomes     = Array.from({ length: LCFG.POP }, () => new Genome());
    this.generation  = 1;
    this.bestEver    = 0;
    this.hallOfFame  = loadTrainedGenome();   // start from 92% seed
    this.bestLander  = this.hallOfFame.clone();
    this.bestLander.fitness = 0;
    this.mutStrength = LCFG.BASE_PS;
    this.ct          = LCFG.CT_INIT;
    this.species     = [];
    this._sc         = 0;
    this._speciate();
  }

  _speciate() {
    this.species.forEach(s => (s.members = []));
    for (const g of this.genomes) {
      let placed = false;
      for (const s of this.species) {
        if (s.rep.distance(g) < this.ct) {
          s.members.push(g); g.speciesId = s.id; placed = true; break;
        }
      }
      if (!placed) {
        const id = this._sc++;
        this.species.push({
          id, rep: g, members: [g], bestFit: 0, staleness: 0,
          color: SPECIES_COLORS[id % SPECIES_COLORS.length]
        });
        g.speciesId = id;
      }
    }
    this.species = this.species.filter(s => s.members.length > 0);
    if (this.species.length < 3) this.ct = Math.max(1.0, this.ct - 0.1);
    if (this.species.length > 7) this.ct = Math.min(5.0, this.ct + 0.1);
    this.species.forEach(s => s.rep = s.members[Math.floor(rnd() * s.members.length)]);
  }

  evolve(landers) {
    // 1. Assign fitness, update hall of fame and best lander
    landers.forEach(l => {
      l.genome.fitness = l.score;
      if (l.score > this.bestEver) {
        this.bestEver   = l.score;
        this.hallOfFame = l.genome.clone();
      }
      if (l.score > this.bestLander.fitness) {
        this.bestLander         = l.genome.clone();
        this.bestLander.fitness = l.score;
      }
    });

    // 2. Adaptive mutation annealing — calibrated to new score range (~250-1000)
    const target = Math.max(LCFG.MIN_PS, LCFG.BASE_PS * (1 - Math.min(1, this.bestEver / 900)));
    this.mutStrength += (target - this.mutStrength) * 0.10;

    // 3. Adjusted fitness + staleness
    this.species.forEach(s => {
      const mf = Math.max(...s.members.map(m => m.fitness));
      if (mf > s.bestFit) { s.bestFit = mf; s.staleness = 0; }
      else s.staleness++;
      const sum = s.members.reduce((a, m) => a + m.fitness, 0) || 1;
      s.members.forEach(m => m.adjFitness = m.fitness / sum * s.members.length);
    });

    this.species = this.species.filter(s => s.staleness < LCFG.SL || this.species.length === 1);

    const np = [];

    // 4. Always keep hall of fame
    np.push(this.hallOfFame.clone());

    // 5. LANDING ISLAND — fine-tune children of best lander
    //    Tiny mutations (ps=0.02, mwr=0.10) preserve the landing skill
    //    while allowing gradual improvement. This is the key fix:
    //    normal NEAT mutations (ps=0.30, mwr=0.80) destroy landing in one step.
    for (let i = 0; i < 14 && np.length < LCFG.POP; i++) {
      const child = this.bestLander.clone();
      child.mutate(0.02, 0.10);
      np.push(child);
    }

    // 6. EXPLORER POOL — species-based NEAT with normal mutations
    const tot = this.genomes.reduce((a, g) => a + g.adjFitness, 0) || 1;
    for (const s of this.species) {
      const alloc = Math.max(1, Math.round(
        s.members.reduce((a, m) => a + m.adjFitness, 0) / tot * LCFG.POP
      ));
      s.members.sort((a, b) => b.fitness - a.fitness);
      const surv = s.members.slice(0, Math.max(1, Math.floor(s.members.length * LCFG.SR)));

      for (let i = 0; i < Math.min(LCFG.ELITE_N, surv.length) && np.length < LCFG.POP; i++)
        np.push(surv[i].clone());

      for (let i = LCFG.ELITE_N; i < alloc && np.length < LCFG.POP; i++) {
        const p1    = surv[Math.floor(rnd() * surv.length)];
        const p2    = surv[Math.floor(rnd() * surv.length)];
        const child = rnd() < LCFG.CR ? p1.crossover(p2) : p1.clone();
        child.mutate(this.mutStrength);
        np.push(child);
      }
    }

    // 7. Top-up
    while (np.length < LCFG.POP) {
      const g = new Genome();
      g.mutate(this.mutStrength);
      np.push(g);
    }

    this.genomes    = np.slice(0, LCFG.POP);
    this.generation++;
    this._speciate();
  }
}

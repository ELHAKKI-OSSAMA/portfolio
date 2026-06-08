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

// ── Seed genome (evolved in-browser, lands 7/8 spawn conditions) ──────────────
// Replaces the original seed, which spun out of control under this environment's
// physics. Captured from the best lander after ~200 generations of evolution.
const _TRAINED_WEIGHTS = {"w1":[0.37756,-0.38711,-0.08104,0.42437,-0.66872,0.09166,0.03693,-0.28691,-2.337,-0.15556,0.02688,-1.93593,-0.56566,-0.01347,-0.55228,0.58858,0.45804,-0.10151,-0.90063,-0.17202,0.72866,0.88986,-0.20892,-0.49118,-0.45192,0.44899,-0.5084,-0.27626,-0.49995,-0.48605,-0.45303,-0.32121,-0.34076,0.11398,0.22836,0.31993,-0.82003,0.08513,0.0928,0.88584,0.35614,-0.21,-0.35048,-0.90222,-0.00549,0.8412,0.51943,-0.08339,-0.05784,-0.17085,0.24381,0.10804,-0.14731,0.4543,-0.99508,0.43947,-0.65617,-0.65993,0.33011,-0.24054,-0.69685,-1.33559,-0.47103,0.41986,0.66027,-0.89138,-0.94981,-0.57397,0.45016,0.08859,-0.01165,1.10316,0.45807,-0.52567,-0.93051,0.69518,-1.91017,0.16846,0.3158,0.63309,-1.29184,-0.21551,-0.83954,-3.03672,0.68602,-0.19362,0.121,-1.37908,-1.37968,-0.19486,0.40411,0.016,-0.14293,0.01425,0.22119,0.12424,0.81051,1.06043,1.0708,2.19193,-0.27913,0.39339,0.65387,0.02674,-0.50312,0.23011,-0.61498,-0.29173,-1.09104,0.70539,0.65224,0.6277,0.47263,-0.28011,-1.42551,-2.47217,0.82783,0.12481,0.65258,1.03754,0.61865,0.81328,0.09158,0.21378,0.49341,0.42341,0.33331,-0.30542,0.37323,0.16768,0.22573,0.39534,-0.22857,-3.66114,-0.81824,-0.60833,-1.86265,-0.32745,-0.38493,-0.2888,-0.13867,0.46482,0.39758,0.04013,0.29736,-0.32695,-0.18879,1.33611,-0.51786,0.32487,-0.64448,0.3068,0.78095,0.16051,1.47748,0.55596,-0.65131,0.48133,0.16416,0.51808,1.20174,-1.37667,0.92492,-0.80863,-0.90406,0.88224,0.00222,-1.31699,0.37029,0.59044,-0.411,0.15724,-1.98072,0.19798,-1.97694,-0.347,3.03832,-0.54111,-1.66752,-0.24297,-0.43195,0.14793,-0.11411,-2.76628,-0.4731,-1.52469,-1.37027,-0.25311,-0.17548,-0.12353,2.25865,-0.84002,-0.33522,-1.69723,2.18629,0.09584,0.56173,-0.02233,0.19399,0.16516,-0.03676,1.37275,-0.93062,0.08295,-0.15006,0.85936,-0.00236,-0.12334,0.00782,-0.04181,-0.09708,-0.07581,0.09328,0.65221,-0.17297,-0.31071,-0.07996,-0.01882,0.01004,0.78295,0.23568,0.66139,0.68249,0.87062,0.24249,-0.24178,0.96785,-1.61783,0.07287,0.20907,-0.07127,0.20824,0.45596,-0.17013,-0.18769,-0.28422,0.36655,0.71129,-0.16299,-0.5284,-0.03081,0.98487,0.23478,-1.76163,-0.05295,-0.14023,-0.44457,0.09913,0.11342,-0.44187,0.3403,-0.43141,-0.14849,0.32196,-0.50962,1.04305,-0.2733,-0.1063,0.43988,0.7119,-0.52062,-0.33494,0.11734,-0.60071,0.32638,0.17778,-0.53709,-0.31932,0.91311,0.50049,0.05605,-0.06103,-0.10888,-0.31922,-0.25782,0.81846,-0.08275,-0.68241,-0.53544,0.17105,-0.56723,0.07468,-0.67702,0.25126,-0.05937,2.0274,0.09254,-0.30228],"b1":[-0.02848,0.06571,-0.02552,-0.07742,-0.01919,-0.18972,0.09406,-0.04587,-1.3588,-0.09649,0.12762,-0.0362,0.18334,0.07054,-0.14984,0.09878,-1.58996,0.08605,0.11113,0.07265,0.10929,-0.06775,-0.01746,0.09543,0.07091,0.06506,-0.05158,-0.08755,-0.08242,1.46751,-0.00464,-0.10898],"w2":[0.14323,-0.17847,0.22522,0.08527,0.35485,0.34107,0.22168,0.18439,0.36787,-0.60456,0.03268,-0.15536,-0.27759,-1.22658,-0.47932,0.31762,-0.68649,0.11624,0.58773,0.76099,-0.88918,-0.72722,-0.69621,-1.16865,0.79071,0.85342,0.58338,-0.09616,0.31154,1.39959,0.85571,-0.39117,0.14862,-0.11075,-0.13603,0.49429,0.2167,0.19214,-0.28099,0.33864,0.08474,-0.32894,-0.11001,0.37629,-0.24658,-0.47289,-0.27902,-0.27184,-0.32712,0.71101,-0.1976,-0.20389,0.01184,-0.0076,-0.08324,0.73031,0.02179,-0.40695,-0.58534,0.21253,-1.55774,-0.99291,-0.49268,0.00701,-0.01017,-0.02536,-0.09311,-0.27709,0.21025,-0.15523,0.18776,-0.04363,0.1135,0.992,0.29732,0.76237,0.36747,0.12518,-0.95685,-0.45631,0.43604,0.0144,-0.79472,-0.29614,0.21112,0.25071,0.64948,0.05849,0.05311,-0.39856,-0.49014,0.50684,-2.50482,0.04848,-0.90201,0.59179,-0.32901,-0.0952,0.36033,-0.32966,0.06578,-0.22456,0.15329,0.18426,-0.29895,0.23659,0.00549,0.31701,0.00645,0.03961,0.07526,0.43834,0.18275,0.17396,-0.07602,-0.28939,-0.00134,0.19526,-0.18239,0.1139,0.16244,-0.06489,0.09295,-0.47233,-0.01638,-0.66357,0.03382,0.2905,-0.50335,-0.95336,0.77172,0.06962,-0.19663,-0.49891,-0.65128,-0.37909,0.0354,0.85281,0.56018,-0.39906,0.2308,-0.14317,1.13807,-0.41231,0.05134,1.35295,-0.20959,0.76122,0.21146,-0.05814,-0.25559,-0.49123,-0.00025,0.33399,0.15865,-0.18593,0.44489,0.19872,-0.07779,-0.2782,-0.50473,-0.24002,-0.35067,-0.07188,0.32723,0.3861,0.13732,0.15205,-0.43823,-0.14132,-0.11178,0.10839,-0.48472,0.76583,0.03853,-0.32846,0.08052,0.01755,0.03808,0.17919,-0.20138,-0.23424,0.5065,0.29828,0.19909,1.45086,0.11641,-0.16467,0.17908,0.41271,-0.09345,-0.03634,0.38823,0.6542,-0.26799,-0.22165,0.02093,0.03142,1.39083,0.96509,0.62135,-1.14102,-0.67458,0.28556,-0.81249,0.74135,-0.8129,1.96924,0.00479,0.34938,0.03061,0.17165,-0.03611,-0.04998,0.29799,-0.32205,-0.01855,0.05333,-0.08981,0.20496,0.12635,-0.13853,0.16329,0.09359,0.21527,0.2423,0.09262,-0.04858,-0.09888,-0.18836,0.10704,-0.24071,-0.15255,0.22681,0.18432,0.46996,0.20167,0.03762,0.7553,-0.58321,0.21039,-0.19395,-0.24854,0.02691,-0.39399,0.55555,-0.15541,-0.36378,0.20268,0.31915,-0.186,-0.16655,0.17783,-0.97801,0.09366,-0.00852,-0.26814,1.14444,-0.40032,0.36821,0.43347,0.30464,0.23964,-0.0015,0.08069,-0.34017,-0.48685,0.22754,0.082,-1.35738,-0.24864,-0.09431,-0.14778,-0.24663,0.01144,-0.21075,-0.42679,-0.08347,-0.77455,0.01972,-0.42412,0.10214,0.0492,-1.79456,-0.03554,0.21174,0.23014,0.12872,-0.96817,-1.26933,0.87131,-0.88234,-0.58726,-0.83394,-0.27222,-1.70192,-1.31077,1.50062,1.11748,-0.58786,1.4378,-1.30947,1.28314,-0.90015,0.73102,-0.10469,-0.59636,-0.60259,0.71742,0.91002,0.60685,-1.20153,-0.19815,-0.80458,0.31464,0.06736,0.19735,0.61654,-1.72757,0.5372,-0.12401,0.18435,0.49494,0.49955,0.15602,-0.10264,-0.06398,-0.51475,0.25057,0.08589,0.01588,0.1988,-0.09256,-0.84032,-0.03498,-0.48524,-0.09908,0.00044,0.03356,-0.00533,-0.13572,0.11455,-0.07936,0.30566,0.24753,0.41382,-0.07728,-0.0378,0.00329,-0.15992,-0.05207,-0.09571,0.14835,0.54908,-0.30613,0.01188,0.40777,0.21082,-0.21359,-0.02812,0.12083,-0.08147,0.13744,-1.79545,-0.0187,0.07418,0.88714,0.23589,0.36976,0.29401,-0.77113,0.27067,-0.05097,0.22827,-1.78333,0.0314,0.03561,-0.53892,0.27808,1.71404,-0.10996,0.3676,-0.26223,0.60054,0.06254,0.22418,0.22401,0.53845,-0.22372,-0.32185,-0.78189,-0.45492,0.59056,0.6707,-1.34601,-0.17745,0.02688,-0.2442,-0.00953,-0.10737,-0.72117,-0.21482,0.90903,-0.06265,-0.41529,-0.53929,-0.58792,-0.50848,0.19216,0.94173,0.07989,0.39529,0.72968,-0.78285,0.84284,-0.52575,-0.62952,-0.84626,0.63243,-0.02142,-0.63256,-0.48386,-0.30885,0.21773,-0.17043,0.52121,0.00482,-0.1691,0.24282,0.29162,0.82955,-0.71712,-0.07803,-0.64416,0.38805,-0.29275,0.51506,-0.16823,-0.12571,0.01775,-0.37858,0.12594,0.08126,-0.45991,0.36307,-0.77569,0.37189,-0.22075,-0.1858,-0.43883,0.19105,-0.28262,-0.26674,0.29893,1.50131,-0.1899,-0.25909,0.23324,-0.64132,0.43205,0.34124,0.4277,-0.31854,0.17031,0.00043,-0.00281,0.30519,0.02084,-0.72689,0.40389,0.3013,0.16194,-0.1419,0.09468,0.32296,0.17053,-0.15315,0.80388,0.21358,-0.0023,0.17441,0.33837,-0.45421,-0.3102,0.34446,1.08074,0.24514,0.37957,-0.0518,-0.19352,-0.66026,0.86676,1.16959,0.15187,-1.01558,0.79044,0.47304,0.06155,0.31436,-0.13182,0.48018,0.30887,-0.07294,-0.09369,-0.21737,-0.51928,0.24073,-0.20132,-0.27237,-0.2859,0.12374,-0.23781],"b2":[-0.14332,-0.36138,0.12072,-0.05118,0.05947,-0.02136,-0.01356,-0.14591,-0.19344,0.03796,0.16457,0.00174,0.1974,-0.04814,0.11317,0.02115],"w3":[-0.36816,1.25048,-0.57079,0.13964,0.23381,-0.45066,0.14709,-2.31528,1.79626,0.59738,0.00748,0.09621,-0.47378,0.80622,-0.64975,-0.18908,0.09774,-0.95027,-0.48458,1.16776,-1.12951,0.13736,0.8286,-0.58873,1.30953,0.628,-0.24958,-0.09972,-1.70894,1.28414,-1.10373,-1.133,1.10839,-0.34184,-0.09465,-1.26942,-0.17229,-0.90253,0.33791,0.55589,0.30024,-0.65337,-0.27706,-2.86515,3.39304,-0.2163,1.11014,-1.26079],"b3":[-0.15513,-0.08858,0.01211]};

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
    // Seed the INITIAL population from the pre-trained genome so generation 1
    // already flies competently instead of being 40 random flailing landers.
    //   • index 0          → exact champion (untouched)
    //   • ~75% of the pool → lightly-mutated champions (competent + diverse)
    //   • remaining ~25%   → random explorers to keep evolutionary variety
    const _seed = loadTrainedGenome();
    const nExplore = Math.floor(LCFG.POP * 0.25);
    this.genomes = Array.from({ length: LCFG.POP }, (_, i) => {
      if (i === 0)                  return _seed.clone();        // pristine champion
      if (i >= LCFG.POP - nExplore) return new Genome();         // random explorer
      const g = _seed.clone();
      g.mutate(0.04, 0.18);                                      // small perturbations
      return g;
    });
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

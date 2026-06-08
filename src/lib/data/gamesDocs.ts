// ─── AI Game documentation (EN / FR / AR) ───────────────────────────────────
// Each entry powers /[locale]/games/[id] — a documented explanation of the AI
// algorithm behind a playable browser game. Optimized for SEO / AEO / LLMO.

export interface GameDoc {
  id: string;
  icon: string;
  accent: string;
  algo: string;                 // short algorithm tag (NEAT, DQN, MCTS, GA)
  title: { en: string; fr: string; ar: string };
  summary: { en: string; fr: string; ar: string };   // meta description / dek
  body: { en: string; fr: string; ar: string };       // markdown
}

const L = (en: string, fr: string, ar: string) => ({ en, fr, ar });

export const gameDocs: GameDoc[] = [
  {
    id: "flappy-bird",
    icon: "🐦",
    accent: "#00ff88",
    algo: "NEAT",
    title: L("Flappy Bird AI — NEAT Neuroevolution", "IA Flappy Bird — Neuroévolution NEAT", "ذكاء Flappy Bird — التطور العصبي NEAT"),
    summary: L(
      "How a population of 50 neural networks learns to play Flappy Bird with NEAT neuroevolution — inputs, fitness, and live visualization.",
      "Comment une population de 50 réseaux de neurones apprend à jouer à Flappy Bird avec la neuroévolution NEAT.",
      "كيف يتعلم 50 شبكة عصبية لعب Flappy Bird باستخدام التطور العصبي NEAT."
    ),
    body: L(
      `## How the AI works\n\nFlappy Bird is solved with **NEAT (NeuroEvolution of Augmenting Topologies)**. Instead of training one network with backpropagation, a population of 50 small neural networks plays simultaneously, and evolution — not gradient descent — improves them.\n\n## Inputs → outputs\n\nEach bird's network reads a few normalized inputs: its vertical position and velocity, plus the horizontal and vertical distance to the next pipe gap. It outputs one value; above a threshold, the bird flaps.\n\n## Evolution loop\n\n- **Fitness**: birds that survive longer and pass more pipes score higher.\n- **Selection + crossover**: the best networks are recombined.\n- **Mutation**: weights change and new nodes/connections are added only when useful, so networks stay compact.\n\n## What you see on screen\n\nThe live network panel shows neurons firing and weighted connections in real time, so you can watch the flying policy emerge generation after generation.`,
      `## Comment fonctionne l'IA\n\nFlappy Bird est résolu avec **NEAT (NeuroEvolution of Augmenting Topologies)**. Au lieu d'entraîner un seul réseau par rétropropagation, une population de 50 petits réseaux joue simultanément et c'est l'évolution — pas la descente de gradient — qui les améliore.\n\n## Entrées → sorties\n\nLe réseau de chaque oiseau lit quelques entrées normalisées : sa position et sa vitesse verticales, ainsi que les distances horizontale et verticale jusqu'au prochain trou. Il renvoie une valeur ; au-dessus d'un seuil, l'oiseau bat des ailes.\n\n## Boucle d'évolution\n\n- **Fitness** : les oiseaux qui survivent plus longtemps marquent plus.\n- **Sélection + croisement** : les meilleurs réseaux sont recombinés.\n- **Mutation** : les poids changent et de nouveaux nœuds/connexions ne sont ajoutés que si utiles.\n\n## Ce que vous voyez\n\nLe panneau réseau affiche en direct les neurones actifs et les connexions pondérées : on observe la stratégie se former au fil des générations.`,
      `## كيف يعمل الذكاء الاصطناعي\n\nيُحَل Flappy Bird باستخدام **NEAT (التطور العصبي للبنى المتنامية)**. فبدلاً من تدريب شبكة واحدة بالانتشار الخلفي، يلعب 50 شبكة عصبية صغيرة في آن واحد، والتطور — لا الانحدار التدرجي — هو ما يحسّنها.\n\n## المدخلات ← المخرجات\n\nتقرأ شبكة كل طائر بضعة مدخلات مُطبَّعة: موضعه وسرعته العموديين، والمسافتين الأفقية والعمودية إلى الفجوة التالية. وتُخرج قيمة واحدة؛ وفوق عتبة معينة يرفرف الطائر.\n\n## حلقة التطور\n\n- **اللياقة**: الطيور التي تعيش أطول وتعبر أنابيب أكثر تحصل على درجات أعلى.\n- **الاختيار والتهجين**: تُدمج أفضل الشبكات.\n- **الطفرة**: تتغير الأوزان وتُضاف عقد/اتصالات جديدة فقط عند الحاجة.\n\n## ما تراه على الشاشة\n\nتعرض لوحة الشبكة الخلايا العصبية النشطة والاتصالات الموزونة لحظياً، فتشاهد السياسة تتشكل جيلاً بعد جيل.`
    ),
  },
  {
    id: "snake",
    icon: "🐍",
    accent: "#4488ff",
    algo: "DQN",
    title: L("Snake AI — Deep Q-Network (DQN)", "IA Snake — Deep Q-Network (DQN)", "ذكاء Snake — شبكة Q العميقة (DQN)"),
    summary: L(
      "How a Deep Q-Network learns to play Snake — states, rewards, replay buffer, and the live Q-value chart.",
      "Comment un Deep Q-Network apprend à jouer à Snake — états, récompenses, replay buffer et graphique Q-value.",
      "كيف تتعلم شبكة Q العميقة لعب Snake — الحالات والمكافآت وذاكرة الإعادة ومخطط Q-value."
    ),
    body: L(
      `## How the AI works\n\nSnake is trained with a **DQN (Deep Q-Network)** — reinforcement learning. The agent learns a function Q(state, action) that estimates the future reward of each move, then picks the action with the highest value.\n\n## State, actions, reward\n\n- **State**: danger in each direction, current heading, and the relative direction to the food.\n- **Actions**: turn left, go straight, turn right.\n- **Reward**: positive for eating, negative for dying, and a small shaping reward for moving toward the food.\n\n## How it learns\n\nExperiences are stored in a **replay buffer** and sampled in mini-batches. An **ε-greedy** policy explores early and exploits later, while a target network stabilizes the updates.\n\n## What you see on screen\n\nThe Q-value chart updates every frame, so you can watch the agent's confidence in each action shift as it learns to chase food and avoid walls.`,
      `## Comment fonctionne l'IA\n\nSnake est entraîné avec un **DQN (Deep Q-Network)** — apprentissage par renforcement. L'agent apprend une fonction Q(état, action) qui estime la récompense future de chaque coup, puis choisit l'action de plus grande valeur.\n\n## État, actions, récompense\n\n- **État** : danger dans chaque direction, cap actuel et direction relative de la nourriture.\n- **Actions** : tourner à gauche, tout droit, tourner à droite.\n- **Récompense** : positive en mangeant, négative en mourant, avec un léger bonus quand l'agent s'approche de la nourriture.\n\n## Comment il apprend\n\nLes expériences sont stockées dans un **replay buffer** et échantillonnées par mini-lots. Une politique **ε-greedy** explore puis exploite, et un réseau cible stabilise les mises à jour.\n\n## Ce que vous voyez\n\nLe graphique Q-value se met à jour à chaque image : on observe la confiance de l'agent évoluer à mesure qu'il apprend.`,
      `## كيف يعمل الذكاء الاصطناعي\n\nيُدرَّب Snake بشبكة **DQN (شبكة Q العميقة)** — تعلّم معزّز. يتعلّم الوكيل دالة Q(الحالة، الفعل) التي تقدّر المكافأة المستقبلية لكل حركة، ثم يختار الفعل الأعلى قيمة.\n\n## الحالة والأفعال والمكافأة\n\n- **الحالة**: الخطر في كل اتجاه، والاتجاه الحالي، واتجاه الطعام النسبي.\n- **الأفعال**: انعطاف يسار، استقامة، انعطاف يمين.\n- **المكافأة**: موجبة عند الأكل، سالبة عند الموت، مع مكافأة صغيرة عند الاقتراب من الطعام.\n\n## كيف يتعلّم\n\nتُخزَّن الخبرات في **ذاكرة إعادة** وتُؤخذ كدفعات صغيرة. وتستكشف سياسة **ε-greedy** مبكراً ثم تستغل، وتثبّت شبكة هدف التحديثات.\n\n## ما تراه على الشاشة\n\nيتحدث مخطط Q-value في كل إطار، فتشاهد ثقة الوكيل في كل فعل تتغيّر أثناء تعلّمه.`
    ),
  },
  {
    id: "car-racing",
    icon: "🏎️",
    accent: "#ffcc00",
    algo: "NEAT",
    title: L("Car Racing AI — NEAT + Raycast Sensors", "IA Course Automobile — NEAT + capteurs raycast", "ذكاء سباق السيارات — NEAT ومستشعرات الأشعة"),
    summary: L(
      "How 30 cars evolve to drive a track using 8 raycast distance sensors and NEAT neuroevolution.",
      "Comment 30 voitures évoluent pour conduire grâce à 8 capteurs raycast et la neuroévolution NEAT.",
      "كيف تتطور 30 سيارة للقيادة باستخدام 8 مستشعرات أشعة والتطور العصبي NEAT."
    ),
    body: L(
      `## How the AI works\n\nThirty cars evolve with **NEAT**. Each car is a neural network that steers and accelerates; the population improves through selection and mutation rather than gradient descent.\n\n## Inputs → outputs\n\n- **Inputs**: 8 **raycast** sensors measuring the distance to the track edges, plus current speed.\n- **Outputs**: steering (left/right) and throttle.\n\n## Evolution loop\n\nCars that drive farther without crashing earn higher fitness. The best are bred and mutated; speciation protects new strategies long enough to mature.\n\n## What you see on screen\n\nThe raycast lines glow from each car in real time, so you can see exactly what the network "senses" before it decides how to steer.`,
      `## Comment fonctionne l'IA\n\nTrente voitures évoluent avec **NEAT**. Chaque voiture est un réseau de neurones qui dirige et accélère ; la population s'améliore par sélection et mutation, pas par descente de gradient.\n\n## Entrées → sorties\n\n- **Entrées** : 8 capteurs **raycast** mesurant la distance aux bords de la piste, plus la vitesse.\n- **Sorties** : direction (gauche/droite) et accélérateur.\n\n## Boucle d'évolution\n\nLes voitures qui roulent plus loin sans s'écraser obtiennent une meilleure fitness. Les meilleures sont croisées et mutées ; la spéciation protège les nouvelles stratégies.\n\n## Ce que vous voyez\n\nLes rayons des capteurs s'illuminent en temps réel : on voit exactement ce que le réseau « perçoit » avant de tourner.`,
      `## كيف يعمل الذكاء الاصطناعي\n\nتتطور ثلاثون سيارة باستخدام **NEAT**. كل سيارة شبكة عصبية توجّه وتُسرّع؛ ويتحسّن المجتمع بالاختيار والطفرة لا بالانحدار التدرجي.\n\n## المدخلات ← المخرجات\n\n- **المدخلات**: 8 مستشعرات **أشعة** تقيس المسافة إلى حواف المضمار، بالإضافة إلى السرعة.\n- **المخرجات**: التوجيه (يسار/يمين) ودواسة الوقود.\n\n## حلقة التطور\n\nالسيارات التي تقطع مسافة أطول دون اصطدام تحصل على لياقة أعلى. تُهجَّن الأفضل وتُطفَّر، ويحمي التخصّص الاستراتيجيات الجديدة.\n\n## ما تراه على الشاشة\n\nتتوهّج خطوط المستشعرات من كل سيارة لحظياً، فترى تماماً ما "تستشعره" الشبكة قبل أن تقرّر التوجيه.`
    ),
  },
  {
    id: "pong",
    icon: "🏓",
    accent: "#4488ff",
    algo: "DQN",
    title: L("Pong AI — DQN Self-Play", "IA Pong — DQN en auto-jeu", "ذكاء Pong — DQN باللعب الذاتي"),
    summary: L(
      "How two Deep Q-Network agents learn Pong through self-play, each training against the other's checkpoint.",
      "Comment deux agents Deep Q-Network apprennent Pong par auto-jeu.",
      "كيف يتعلّم وكيلا شبكة Q العميقة لعبة Pong عبر اللعب الذاتي."
    ),
    body: L(
      `## How the AI works\n\nPong uses **DQN with self-play**. Two agents compete; each one trains against a frozen checkpoint of its opponent, so the difficulty scales up automatically as both improve.\n\n## State, actions, reward\n\n- **State**: paddle and ball positions and the ball's velocity.\n- **Actions**: move the paddle up, down, or stay.\n- **Reward**: +1 for scoring, -1 for conceding.\n\n## Why self-play matters\n\nAgainst a fixed opponent an agent can overfit. Self-play creates an ever-improving curriculum: as one side gets better, the other must too, pushing both toward strong, general play.\n\n## What you see on screen\n\nYou watch two learned policies rally against each other — no hand-coded paddle AI, just two networks that taught themselves the game.`,
      `## Comment fonctionne l'IA\n\nPong utilise un **DQN en auto-jeu**. Deux agents s'affrontent ; chacun s'entraîne contre une copie figée de son adversaire, si bien que la difficulté augmente automatiquement.\n\n## État, actions, récompense\n\n- **État** : positions des raquettes et de la balle, vitesse de la balle.\n- **Actions** : monter, descendre ou rester.\n- **Récompense** : +1 si l'agent marque, -1 s'il encaisse.\n\n## Pourquoi l'auto-jeu\n\nContre un adversaire fixe, un agent peut surapprendre. L'auto-jeu crée un programme qui s'améliore sans cesse : chaque camp pousse l'autre à progresser.\n\n## Ce que vous voyez\n\nDeux politiques apprises s'échangent la balle — aucune IA de raquette codée à la main, juste deux réseaux autodidactes.`,
      `## كيف يعمل الذكاء الاصطناعي\n\nيستخدم Pong شبكة **DQN مع اللعب الذاتي**. يتنافس وكيلان؛ يتدرّب كل منهما ضد نسخة مجمّدة من خصمه، فترتفع الصعوبة تلقائياً.\n\n## الحالة والأفعال والمكافأة\n\n- **الحالة**: مواضع المضارب والكرة وسرعة الكرة.\n- **الأفعال**: تحريك المضرب لأعلى أو لأسفل أو البقاء.\n- **المكافأة**: +1 عند التسجيل، -1 عند استقبال هدف.\n\n## لماذا اللعب الذاتي\n\nأمام خصم ثابت قد يبالغ الوكيل في الملاءمة. أما اللعب الذاتي فيخلق منهجاً يتحسّن باستمرار: كلما تحسّن طرف دفع الآخر للتحسّن.\n\n## ما تراه على الشاشة\n\nتشاهد سياستين متعلّمتين تتبادلان الكرة — دون أي ذكاء مبرمج يدوياً، فقط شبكتان علّمتا نفسيهما.`
    ),
  },
  {
    id: "asteroid-dodge",
    icon: "🚀",
    accent: "#9966cc",
    algo: "NEAT",
    title: L("Asteroid Dodge AI — NEAT + Speciation", "IA Évitement d'Astéroïdes — NEAT + spéciation", "ذكاء تفادي الكويكبات — NEAT والتخصّص"),
    summary: L(
      "How 30 ships evolve to dodge endless asteroids using 10 raycast inputs and NEAT speciation.",
      "Comment 30 vaisseaux évoluent pour esquiver les astéroïdes avec 10 capteurs et la spéciation NEAT.",
      "كيف تتطور 30 سفينة لتفادي الكويكبات باستخدام 10 مدخلات أشعة وتخصّص NEAT."
    ),
    body: L(
      `## How the AI works\n\nThirty ships evolve with **NEAT**. Each is a neural network that thrusts and rotates to survive an endless asteroid field.\n\n## Inputs → outputs\n\n- **Inputs**: 10 **raycast** sensors detecting nearby asteroids around the ship.\n- **Outputs**: rotate left/right and thrust.\n\n## Speciation\n\nNEAT groups similar networks into **species** so promising-but-new structures aren't wiped out before they mature — this preserves diversity and helps escape local optima.\n\n## What you see on screen\n\nThe glowing sensor lines reveal the ship's field of view; longer survival times each generation show the dodging policy improving.`,
      `## Comment fonctionne l'IA\n\nTrente vaisseaux évoluent avec **NEAT**. Chacun est un réseau qui pousse et pivote pour survivre dans un champ d'astéroïdes infini.\n\n## Entrées → sorties\n\n- **Entrées** : 10 capteurs **raycast** détectant les astéroïdes proches.\n- **Sorties** : rotation gauche/droite et poussée.\n\n## Spéciation\n\nNEAT regroupe les réseaux similaires en **espèces** pour que les structures nouvelles mais prometteuses ne soient pas éliminées trop tôt — cela préserve la diversité.\n\n## Ce que vous voyez\n\nLes rayons lumineux montrent le champ de vision du vaisseau ; des survies plus longues à chaque génération traduisent l'amélioration.`,
      `## كيف يعمل الذكاء الاصطناعي\n\nتتطور ثلاثون سفينة باستخدام **NEAT**. كل واحدة شبكة عصبية تدفع وتدور للنجاة في حقل كويكبات لا نهائي.\n\n## المدخلات ← المخرجات\n\n- **المدخلات**: 10 مستشعرات **أشعة** ترصد الكويكبات القريبة حول السفينة.\n- **المخرجات**: الدوران يساراً/يميناً والدفع.\n\n## التخصّص\n\nيجمع NEAT الشبكات المتشابهة في **أنواع** كي لا تُمحى البنى الجديدة الواعدة قبل نضجها — وهذا يحافظ على التنوّع.\n\n## ما تراه على الشاشة\n\nتكشف خطوط المستشعرات المتوهّجة مجال رؤية السفينة؛ وتدل أوقات النجاة الأطول كل جيل على تحسّن سياسة التفادي.`
    ),
  },
  {
    id: "game-2048",
    icon: "🔢",
    accent: "#ffcc00",
    algo: "MCTS",
    title: L("2048 AI — Monte Carlo Tree Search", "IA 2048 — Monte Carlo Tree Search", "ذكاء 2048 — بحث شجرة مونتي كارلو"),
    summary: L(
      "How Monte Carlo Tree Search plays 2048 with simulations per move, scoring each direction live.",
      "Comment MCTS joue à 2048 avec des simulations par coup, en évaluant chaque direction.",
      "كيف يلعب بحث شجرة مونتي كارلو لعبة 2048 بمحاكاة لكل حركة."
    ),
    body: L(
      `## How the AI works\n\n2048 is played with **Monte Carlo Tree Search (MCTS)** — search, not a trained network. Before each move it runs ~80 simulations and keeps the move that leads to the best average outcome.\n\n## The four steps\n\n- **Selection**: walk the tree toward promising moves.\n- **Expansion**: add a new board state.\n- **Simulation**: play random/heuristic moves to the end.\n- **Backpropagation**: push the result back up the tree.\n\n## Why it suits 2048\n\n2048 has random tile spawns, so a planning method that samples many possible futures handles the uncertainty better than a single greedy rule.\n\n## What you see on screen\n\nThe live bar chart shows the estimated score for each of the four moves, so you can watch the search prefer one direction over the others.`,
      `## Comment fonctionne l'IA\n\n2048 est joué avec **Monte Carlo Tree Search (MCTS)** — de la recherche, pas un réseau entraîné. Avant chaque coup, il lance ~80 simulations et garde le coup au meilleur résultat moyen.\n\n## Les quatre étapes\n\n- **Sélection** : descendre l'arbre vers les coups prometteurs.\n- **Expansion** : ajouter un nouvel état de plateau.\n- **Simulation** : jouer jusqu'à la fin (aléatoire/heuristique).\n- **Rétropropagation** : remonter le résultat dans l'arbre.\n\n## Pourquoi pour 2048\n\n2048 fait apparaître des tuiles aléatoires ; échantillonner de nombreux futurs gère mieux l'incertitude qu'une règle gloutonne.\n\n## Ce que vous voyez\n\nLe graphique en barres montre le score estimé de chaque coup : on voit la recherche préférer une direction.`,
      `## كيف يعمل الذكاء الاصطناعي\n\nتُلعب 2048 باستخدام **بحث شجرة مونتي كارلو (MCTS)** — بحث، لا شبكة مدرَّبة. قبل كل حركة يُجري نحو 80 محاكاة ويحتفظ بالحركة ذات أفضل نتيجة متوسطة.\n\n## الخطوات الأربع\n\n- **الاختيار**: السير في الشجرة نحو الحركات الواعدة.\n- **التوسّع**: إضافة حالة لوح جديدة.\n- **المحاكاة**: اللعب حتى النهاية (عشوائي/إرشادي).\n- **النشر الخلفي**: إعادة النتيجة إلى أعلى الشجرة.\n\n## لماذا تناسب 2048\n\nتظهر في 2048 مربعات عشوائية، لذا فإن أخذ عينات من عدة مستقبلات يتعامل مع عدم اليقين أفضل من قاعدة جشعة واحدة.\n\n## ما تراه على الشاشة\n\nيُظهر المخطط الشريطي الدرجة المقدّرة لكل حركة، فتشاهد البحث يفضّل اتجاهاً على الآخر.`
    ),
  },
  {
    id: "breakout",
    icon: "🧱",
    accent: "#ff44cc",
    algo: "DQN",
    title: L("Breakout AI — DQN with ε-greedy", "IA Casse-Briques — DQN ε-greedy", "ذكاء كسر الطوب — DQN بسياسة ε-greedy"),
    summary: L(
      "How a Deep Q-Network learns Breakout — reward shaping, experience replay, and the epsilon-decay curve.",
      "Comment un Deep Q-Network apprend le Casse-Briques — replay d'expérience et courbe epsilon.",
      "كيف تتعلّم شبكة Q العميقة لعبة كسر الطوب — إعادة الخبرة ومنحنى epsilon."
    ),
    body: L(
      `## How the AI works\n\nBreakout is trained with a **DQN**. The agent moves the paddle to keep the ball alive and clear bricks, learning Q-values for each action from experience.\n\n## State, actions, reward\n\n- **State**: paddle position, ball position and velocity.\n- **Actions**: move the paddle left, right, or stay.\n- **Reward**: positive for breaking bricks, negative for losing the ball.\n\n## Exploration vs exploitation\n\nAn **ε-greedy** policy starts almost random (high ε) and gradually exploits the learned policy as ε decays — balancing trying new moves against using what works.\n\n## What you see on screen\n\nThe epsilon-decay curve and live Q-value bars show the shift from exploring to exploiting as the agent gets good at clearing the wall.`,
      `## Comment fonctionne l'IA\n\nLe Casse-Briques est entraîné avec un **DQN**. L'agent déplace la raquette pour garder la balle et casser les briques, en apprenant les Q-values par l'expérience.\n\n## État, actions, récompense\n\n- **État** : position de la raquette, position et vitesse de la balle.\n- **Actions** : gauche, droite ou rester.\n- **Récompense** : positive en cassant des briques, négative en perdant la balle.\n\n## Exploration vs exploitation\n\nUne politique **ε-greedy** démarre quasi aléatoire (ε élevé) puis exploite la politique apprise à mesure que ε décroît.\n\n## Ce que vous voyez\n\nLa courbe epsilon et les barres Q-value montrent le passage de l'exploration à l'exploitation.`,
      `## كيف يعمل الذكاء الاصطناعي\n\nيُدرَّب كسر الطوب بشبكة **DQN**. يحرّك الوكيل المضرب لإبقاء الكرة وكسر الطوب، متعلّماً قيم Q لكل فعل من الخبرة.\n\n## الحالة والأفعال والمكافأة\n\n- **الحالة**: موضع المضرب، وموضع الكرة وسرعتها.\n- **الأفعال**: يسار أو يمين أو البقاء.\n- **المكافأة**: موجبة عند كسر الطوب، سالبة عند فقدان الكرة.\n\n## الاستكشاف مقابل الاستغلال\n\nتبدأ سياسة **ε-greedy** شبه عشوائية (ε مرتفع) ثم تستغل السياسة المتعلَّمة مع تناقص ε.\n\n## ما تراه على الشاشة\n\nيُظهر منحنى epsilon وأشرطة Q-value الانتقال من الاستكشاف إلى الاستغلال.`
    ),
  },
  {
    id: "predator-prey",
    icon: "🌿",
    accent: "#00ff88",
    algo: "GA",
    title: L("Predator–Prey AI — Evolving Neural Brains", "IA Prédateur–Proie — Cerveaux neuronaux évolutifs", "ذكاء المفترس والفريسة — أدمغة عصبية متطوّرة"),
    summary: L(
      "How 100 prey and 20 predators evolve independent neural brains, producing emergent hunting and fleeing tactics.",
      "Comment 100 proies et 20 prédateurs évoluent des cerveaux neuronaux indépendants.",
      "كيف يطوّر 100 فريسة و20 مفترساً أدمغة عصبية مستقلة بتكتيكات ناشئة."
    ),
    body: L(
      `## How the AI works\n\nTwo populations — 100 prey and 20 predators — each evolve their own neural networks with a **genetic algorithm**. There's no shared goal: predators are rewarded for catching, prey for surviving.\n\n## Inputs → outputs\n\n- **Inputs**: relative positions/directions of the nearest few agents.\n- **Outputs**: movement direction and speed.\n\n## Co-evolution\n\nBecause both sides evolve at once, an **arms race** emerges: better hunting pressures prey to flee smarter, which pressures predators to hunt smarter — emergent behavior nobody coded.\n\n## What you see on screen\n\nBy around generation 30, you can watch coordinated hunting and evasive flocking appear on their own.`,
      `## Comment fonctionne l'IA\n\nDeux populations — 100 proies et 20 prédateurs — évoluent chacune leurs réseaux avec un **algorithme génétique**. Pas d'objectif commun : les prédateurs sont récompensés pour les captures, les proies pour la survie.\n\n## Entrées → sorties\n\n- **Entrées** : positions/directions relatives des agents proches.\n- **Sorties** : direction et vitesse de déplacement.\n\n## Co-évolution\n\nComme les deux camps évoluent ensemble, une **course aux armements** émerge : mieux chasser pousse les proies à mieux fuir, et inversement.\n\n## Ce que vous voyez\n\nVers la génération 30, des tactiques de chasse coordonnée et de fuite en banc apparaissent d'elles-mêmes.`,
      `## كيف يعمل الذكاء الاصطناعي\n\nمجتمعان — 100 فريسة و20 مفترساً — يطوّر كلٌّ منهما شبكاته باستخدام **خوارزمية جينية**. لا هدف مشترك: يُكافأ المفترس على الإمساك، والفريسة على النجاة.\n\n## المدخلات ← المخرجات\n\n- **المدخلات**: المواضع/الاتجاهات النسبية لأقرب الوكلاء.\n- **المخرجات**: اتجاه الحركة والسرعة.\n\n## التطوّر المشترك\n\nلأن الطرفين يتطوران معاً، ينشأ **سباق تسلّح**: الصيد الأفضل يدفع الفريسة للهروب بذكاء، والعكس صحيح — سلوك ناشئ لم يبرمجه أحد.\n\n## ما تراه على الشاشة\n\nبحلول الجيل الثلاثين تقريباً، تشاهد صيداً منسّقاً وهروباً جماعياً يظهران تلقائياً.`
    ),
  },
  {
    id: "lunar-lander",
    icon: "🌙",
    accent: "#44ccff",
    algo: "NEAT",
    title: L("Lunar Lander AI — NEAT + Physics", "IA Atterrisseur Lunaire — NEAT + physique", "ذكاء المركبة القمرية — NEAT والفيزياء"),
    summary: L(
      "How 20 landers evolve to touch down softly under gravity and thrust, with a value heatmap of safe zones.",
      "Comment 20 atterrisseurs évoluent pour se poser en douceur, avec une carte thermique des zones sûres.",
      "كيف تتطور 20 مركبة للهبوط بسلاسة تحت الجاذبية والدفع، مع خريطة حرارية للمناطق الآمنة."
    ),
    body: L(
      `## How the AI works\n\nTwenty landers evolve with **NEAT** under a simple physics model (gravity + thrust). Each network must fire engines to land softly on the platform.\n\n## Inputs → outputs\n\n- **Inputs**: position, velocity, angle, and distance to the pad.\n- **Outputs**: main thrust and left/right thrusters.\n\n## Fitness\n\nReward depends on landing softly and on target; crashing or drifting away is penalized — so evolution favors gentle, accurate descents.\n\n## What you see on screen\n\nA value heatmap highlights the safe zones the population has learned, and successful soft landings become more frequent each generation.`,
      `## Comment fonctionne l'IA\n\nVingt atterrisseurs évoluent avec **NEAT** sous un modèle physique simple (gravité + poussée). Chaque réseau doit allumer les moteurs pour se poser en douceur.\n\n## Entrées → sorties\n\n- **Entrées** : position, vitesse, angle et distance à la plateforme.\n- **Sorties** : poussée principale et propulseurs latéraux.\n\n## Fitness\n\nLa récompense dépend d'un atterrissage doux et précis ; s'écraser ou dériver est pénalisé — l'évolution favorise les descentes contrôlées.\n\n## Ce que vous voyez\n\nUne carte thermique met en évidence les zones sûres apprises, et les atterrissages réussis deviennent plus fréquents.`,
      `## كيف يعمل الذكاء الاصطناعي\n\nتتطور عشرون مركبة باستخدام **NEAT** ضمن نموذج فيزيائي بسيط (جاذبية + دفع). على كل شبكة تشغيل المحركات للهبوط بسلاسة على المنصة.\n\n## المدخلات ← المخرجات\n\n- **المدخلات**: الموضع والسرعة والزاوية والمسافة إلى المنصة.\n- **المخرجات**: الدفع الرئيسي والدافعات الجانبية.\n\n## اللياقة\n\nتعتمد المكافأة على الهبوط الناعم والدقيق؛ ويُعاقَب الاصطدام أو الانحراف — فيفضّل التطور الهبوط المتحكَّم.\n\n## ما تراه على الشاشة\n\nتُبرز خريطة حرارية المناطق الآمنة التي تعلّمها المجتمع، وتصبح عمليات الهبوط الناجحة أكثر تكراراً.`
    ),
  },
  {
    id: "maze-solver",
    icon: "🌀",
    accent: "#cc7722",
    algo: "GA",
    title: L("Maze Solver AI — Genetic Algorithm", "IA Résolveur de Labyrinthe — Algorithme génétique", "ذكاء حل المتاهة — خوارزمية جينية"),
    summary: L(
      "How 200 walkers evolve move sequences to solve a random maze, with pheromone trails marking good paths.",
      "Comment 200 marcheurs évoluent des séquences de mouvements pour résoudre un labyrinthe aléatoire.",
      "كيف يطوّر 200 ماشٍ تسلسلات حركة لحل متاهة عشوائية، مع مسارات فيرومون."
    ),
    body: L(
      `## How the AI works\n\nA **genetic algorithm** evolves 200 walkers. Each individual is a fixed sequence of moves (its "genome"); there's no neural network here — just selection on sequences.\n\n## Genome and fitness\n\n- **Genome**: a list of directional moves.\n- **Fitness**: how close the walker gets to the exit (and how quickly).\n\n## Evolution loop\n\nThe closest walkers are selected, their move sequences are **crossed over**, and random **mutations** tweak a few steps — so each generation drifts toward solving paths.\n\n## What you see on screen\n\nPheromone-style trails glow on frequently used cells, revealing the promising routes the population is converging on.`,
      `## Comment fonctionne l'IA\n\nUn **algorithme génétique** fait évoluer 200 marcheurs. Chaque individu est une séquence fixe de mouvements (son « génome ») ; pas de réseau de neurones ici — juste de la sélection sur des séquences.\n\n## Génome et fitness\n\n- **Génome** : une liste de mouvements directionnels.\n- **Fitness** : à quel point le marcheur s'approche de la sortie (et vite).\n\n## Boucle d'évolution\n\nLes marcheurs les plus proches sont sélectionnés, leurs séquences **croisées**, et des **mutations** ajustent quelques pas — chaque génération se rapproche d'une solution.\n\n## Ce que vous voyez\n\nDes traces de phéromones s'illuminent sur les cases souvent empruntées, révélant les routes prometteuses.`,
      `## كيف يعمل الذكاء الاصطناعي\n\nتطوّر **خوارزمية جينية** 200 ماشٍ. كل فرد تسلسل ثابت من الحركات (جينومه)؛ ولا توجد شبكة عصبية هنا — مجرد اختيار على التسلسلات.\n\n## الجينوم واللياقة\n\n- **الجينوم**: قائمة حركات اتجاهية.\n- **اللياقة**: مدى اقتراب الماشي من المخرج (وسرعته).\n\n## حلقة التطور\n\nيُختار أقرب المشاة، وتُهجَّن تسلسلاتهم، وتعدّل **الطفرات** بضع خطوات — فيقترب كل جيل من الحل.\n\n## ما تراه على الشاشة\n\nتتوهّج مسارات شبيهة بالفيرومون على الخلايا كثيرة الاستخدام، كاشفةً الطرق الواعدة التي يتقارب نحوها المجتمع.`
    ),
  },
];

export function getGameDoc(id: string): GameDoc | undefined {
  return gameDocs.find((g) => g.id === id);
}

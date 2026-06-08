import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import GameCard from "./GameCard";
import { buildMetadata, pick } from "@/lib/seo";
import { SITE_URL } from "@/lib/data";
import { BreadcrumbSchema, ItemListSchema } from "@/components/seo/JsonLd";
import HireCTA from "@/components/sections/HireCTA";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/games",
    title: pick(locale, {
      en: "AI Game Lab — Browser Games Powered by Real AI | Ossama Elhakki",
      fr: "Laboratoire de jeux IA — Jeux navigateur animés par de vraies IA | Ossama Elhakki",
      ar: "مختبر ألعاب الذكاء الاصطناعي — ألعاب متصفح تعمل بذكاء حقيقي | أسامة الحقّي",
    }),
    description: pick(locale, {
      en: "10 browser games, each powered by a real AI algorithm — NEAT, Deep Q-Networks, Monte Carlo Tree Search, genetic algorithms, A* pathfinding, and imitation learning. Play instantly, no install needed.",
      fr: "10 jeux navigateur, chacun animé par un véritable algorithme d'IA — NEAT, Deep Q-Networks, MCTS, algorithmes génétiques, recherche A* et apprentissage par imitation. Jouez instantanément, sans installation.",
      ar: "10 ألعاب متصفح، كل منها يعمل بخوارزمية ذكاء اصطناعي حقيقية — NEAT وDeep Q-Networks وMCTS والخوارزميات الجينية وبحث A* والتعلّم بالتقليد. العب فوراً دون تثبيت.",
    }),
    keywords: ["AI games", "NEAT", "DQN", "Monte Carlo Tree Search", "genetic algorithm game", "A* pathfinding", "Hamiltonian cycle", "imitation learning", "reinforcement learning demo"],
  });
}

const GAMES = [
  {
    id: "flappy-bird",
    num: "01",
    icon: "🐦",
    title: "Flappy Bird",
    titleFr: "Oiseau Flappy",
    titleAr: "الطائر الرفرف",
    desc: "50 birds evolve simultaneously. Live neural network fires as they learn to thread pipes.",
    descFr: "50 oiseaux évoluent simultanément. Réseau de neurones en direct pendant qu'ils apprennent.",
    descAr: "50 طائراً يتطور في نفس الوقت. شبكة عصبية حية تُظهر التعلم.",
    tags: ["NEAT", "50 agents", "live NN"],
    accent: "#00ff88",
  },
  {
    id: "snake",
    num: "02",
    icon: "🐍",
    title: "Snake",
    titleFr: "Serpent",
    titleAr: "الثعبان",
    desc: "A* / Hamiltonian-cycle planner plays a perfect game — heads straight for the apple yet never traps itself. Clears the full board every run.",
    descFr: "Planificateur A* / cycle hamiltonien qui joue une partie parfaite — fonce vers la pomme sans jamais se piéger. Remplit tout le plateau à chaque fois.",
    descAr: "مخطّط A* / دورة هاميلتونية يلعب لعبة مثالية — يتّجه مباشرة نحو التفاحة دون أن يحبس نفسه، ويملأ اللوحة كاملة في كل مرة.",
    tags: ["Pathfinding", "Hamiltonian", "perfect play"],
    accent: "#22d3aa",
  },
  {
    id: "car-racing",
    num: "03",
    icon: "🏎️",
    title: "Car Racing",
    titleFr: "Course Automobile",
    titleAr: "سباق السيارات",
    desc: "30 cars evolve to drive an oval track using 10 raycast sensors shown in real time.",
    descFr: "30 voitures évoluent pour conduire une piste ovale grâce à 10 capteurs raycasts.",
    descAr: "30 سيارة تتطور لقيادة مضمار بيضاوي باستخدام 10 مستشعرات.",
    tags: ["NEAT", "30 agents", "raycasts"],
    accent: "#ffcc00",
  },
  {
    id: "pong",
    num: "04",
    icon: "🏓",
    title: "Pong",
    titleFr: "Pong",
    titleAr: "بونج",
    desc: "Two DQN agents in stable self-play — fine-tuning around an analytic intercept policy, anchored so they stay sharp instead of forgetting.",
    descFr: "Deux agents DQN en auto-jeu stable — réglage fin autour d'une politique d'interception analytique, ancrés pour rester performants.",
    descAr: "وكيلان DQN في لعب ذاتي مستقر — ضبط دقيق حول سياسة اعتراض تحليلية، مُثبَّتان كي يبقيا بارعين دون نسيان.",
    tags: ["DQN", "self-play", "2 agents"],
    accent: "#4488ff",
  },
  {
    id: "asteroid-dodge",
    num: "05",
    icon: "🚀",
    title: "Asteroid Dodge",
    titleFr: "Évitement d'Astéroïdes",
    titleAr: "تفادي الكويكبات",
    desc: "100 ships evolve to dodge infinite asteroids using 10 raycast inputs. Sensor lines glow.",
    descFr: "100 vaisseaux évoluent pour esquiver des astéroïdes infinis avec 10 capteurs.",
    descAr: "100 سفينة تتطور لتفادي كويكبات لانهائية باستخدام 10 مدخلات.",
    tags: ["NEAT", "100 agents", "speciation"],
    accent: "#9966cc",
  },
  {
    id: "game-2048",
    num: "06",
    icon: "🔢",
    title: "2048",
    titleFr: "2048",
    titleAr: "2048",
    desc: "Monte Carlo Tree Search plays 2048 with 200 simulations per move. Live bar chart shows move scores.",
    descFr: "MCTS joue à 2048 avec 200 simulations par mouvement. Graphique en direct.",
    descAr: "بحث شجرة مونتي كارلو يلعب 2048 بـ 200 محاكاة لكل حركة.",
    tags: ["MCTS", "heuristics", "search tree"],
    accent: "#ffcc00",
  },
  {
    id: "breakout",
    num: "07",
    icon: "🧱",
    title: "Breakout",
    titleFr: "Casse-Briques",
    titleAr: "كسر الطوب",
    desc: "DQN agent learns to break all bricks. Epsilon decay curve and Q-value bars update live.",
    descFr: "Agent DQN apprend à casser toutes les briques. Courbe epsilon en direct.",
    descAr: "وكيل DQN يتعلم كسر الطوب. منحنى epsilon وأشرطة Q-value تتحدث لحظياً.",
    tags: ["DQN", "ε-greedy", "replay"],
    accent: "#ff44cc",
  },
  {
    id: "predator-prey",
    num: "08",
    icon: "🌿",
    title: "Predator Prey",
    titleFr: "Prédateur–Proie",
    titleAr: "مفترس وفريسة",
    desc: "40 prey and 4 predators evolve independent neural brains. A red-queen arms race produces emergent hunting and fleeing.",
    descFr: "40 proies et 4 prédateurs évoluent indépendamment. Une course « reine rouge » fait émerger chasse et fuite.",
    descAr: "40 فريسة و4 مفترسات يطوّرون شبكات عصبية مستقلة. سباق «الملكة الحمراء» يُنشئ صيداً وهروباً ناشئين.",
    tags: ["GA", "co-evolution", "44 agents"],
    accent: "#00ff88",
  },
  {
    id: "lunar-lander",
    num: "09",
    icon: "🌙",
    title: "Lunar Lander",
    titleFr: "Atterrisseur Lunaire",
    titleAr: "المركبة القمرية",
    desc: "40 landers evolve to touch down on the platform. Value heatmap shows safe zones.",
    descFr: "40 atterrisseurs évoluent pour se poser sur la plateforme. Carte thermique des zones sûres.",
    descAr: "40 مركبة تتطور للهبوط على المنصة. خريطة حرارية تُظهر المناطق الآمنة.",
    tags: ["NEAT", "40 agents", "physics"],
    accent: "#44ccff",
  },
  {
    id: "maze-solver",
    num: "10",
    icon: "🌀",
    title: "Maze Solver",
    titleFr: "Résolveur de Labyrinthe",
    titleAr: "حل المتاهة",
    desc: "A 5-network ensemble trained by A* imitation + DAgger solves any random maze — 100% solve rate. Pheromone trails mark the chosen path.",
    descFr: "Un ensemble de 5 réseaux entraînés par imitation A* + DAgger résout n'importe quel labyrinthe — 100 % de réussite. Les phéromones marquent le chemin.",
    descAr: "مجموعة من 5 شبكات مدرّبة بالتقليد A* + DAgger تحل أي متاهة عشوائية — نسبة نجاح 100%. مسارات الفيرومون تُبيّن المسار المختار.",
    tags: ["Imitation", "A* + DAgger", "NN ensemble"],
    accent: "#cc7722",
  },
];

const ALGO_LEGEND = [
  { color: "#00ff88", label: "NEAT — neuro-evolution" },
  { color: "#4488ff", label: "DQN — deep Q-network" },
  { color: "#9966cc", label: "GA — genetic algorithm" },
  { color: "#ffcc00", label: "MCTS — tree search" },
  { color: "#22d3aa", label: "PATHFINDING — A* / Hamiltonian" },
  { color: "#cc7722", label: "IMITATION — A* + ensemble" },
];

export default async function GamesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const getTitle = (g: typeof GAMES[0]) =>
    locale === "fr" ? g.titleFr : locale === "ar" ? g.titleAr : g.title;
  const getDesc = (g: typeof GAMES[0]) =>
    locale === "fr" ? g.descFr : locale === "ar" ? g.descAr : g.desc;

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ backgroundColor: "var(--bg-main)" }}>
      <BreadcrumbSchema
        items={[
          { name: locale === "fr" ? "Accueil" : locale === "ar" ? "الرئيسية" : "Home", url: `${SITE_URL}/${locale}` },
          { name: locale === "fr" ? "Jeux IA" : locale === "ar" ? "ألعاب الذكاء الاصطناعي" : "AI Games", url: `${SITE_URL}/${locale}/games` },
        ]}
      />
      <ItemListSchema
        name="AI-powered browser games"
        items={GAMES.map((g) => ({ name: getTitle(g), url: `${SITE_URL}/${locale}/games#${g.id}` }))}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium mb-6"
            style={{ borderColor: "#00ff8840", backgroundColor: "#00ff8810", color: "#00ff88" }}
          >
            🎮 {locale === "fr" ? "10 jeux · IA réelle · navigateur" : locale === "ar" ? "10 ألعاب · ذكاء اصطناعي حقيقي · المتصفح" : "10 games · real AI · browser"}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            {locale === "fr" ? "Labo de Jeux IA" : locale === "ar" ? "مختبر ألعاب الذكاء الاصطناعي" : "AI Game Lab"}
          </h1>
          <p className="max-w-2xl mx-auto text-base" style={{ color: "var(--text-secondary)" }}>
            {locale === "fr"
              ? "Chaque jeu utilise un vrai algorithme d'apprentissage automatique. Regardez l'IA apprendre en temps réel — aucune installation requise."
              : locale === "ar"
              ? "كل لعبة تستخدم خوارزمية تعلم آلة حقيقية. شاهد الذكاء الاصطناعي يتعلم في الوقت الفعلي — لا تثبيت مطلوب."
              : "Every game uses a real machine-learning algorithm. Watch the AI learn in real time — no install required."}
          </p>
        </div>

        {/* ── Algorithm legend ── */}
        <div className="flex justify-center gap-4 flex-wrap mb-10 text-xs font-mono">
          {ALGO_LEGEND.map(l => (
            <div key={l.label} className="flex items-center gap-1.5 opacity-60">
              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: l.color }} />
              {l.label}
            </div>
          ))}
        </div>

        {/* ── Game grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {GAMES.map((game) => (
            <GameCard
              key={game.id}
              id={game.id}
              num={game.num}
              icon={game.icon}
              title={getTitle(game)}
              desc={getDesc(game)}
              tags={game.tags}
              accent={game.accent}
              playLabel={locale === "fr" ? "JOUER ↗" : locale === "ar" ? "العب ↗" : "PLAY ↗"}
              docHref={`/${locale}/games/${game.id}`}
              docLabel={locale === "fr" ? "Comment l'IA fonctionne" : locale === "ar" ? "كيف يعمل الذكاء الاصطناعي" : "How the AI works"}
            />
          ))}
        </div>
      </div>
      <HireCTA locale={locale} />
    </div>
  );
}

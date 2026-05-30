import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import GameCard from "./GameCard";

export const metadata: Metadata = {
  title: "AI Game Lab | Ossama Elhakki",
  description: "10 browser games each powered by a real AI algorithm — NEAT, DQN, MCTS, Genetic Algorithms. No install needed.",
};

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
    desc: "DQN agent learns to eat food without hitting walls. Q-value chart updates every frame.",
    descFr: "Agent DQN apprend à manger sans toucher les murs. Graphique Q-value en temps réel.",
    descAr: "وكيل DQN يتعلم الأكل دون ضرب الجدران. مخطط Q-value يتحدث لحظياً.",
    tags: ["DQN", "Q-values", "replay buffer"],
    accent: "#4488ff",
  },
  {
    id: "car-racing",
    num: "03",
    icon: "🏎️",
    title: "Car Racing",
    titleFr: "Course Automobile",
    titleAr: "سباق السيارات",
    desc: "30 cars evolve to drive an oval track using 8 raycast sensors shown in real time.",
    descFr: "30 voitures évoluent pour conduire une piste ovale grâce à 8 capteurs raycasts.",
    descAr: "30 سيارة تتطور لقيادة مضمار بيضاوي باستخدام 8 مستشعرات.",
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
    desc: "Two DQN agents in self-play, each training against the other's last checkpoint.",
    descFr: "Deux agents DQN en auto-jeu, s'entraînant mutuellement.",
    descAr: "وكيلان DQN يتدربان ضد بعضهما البعض.",
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
    desc: "30 ships evolve to dodge infinite asteroids using 10 raycast inputs. Sensor lines glow.",
    descFr: "30 vaisseaux évoluent pour esquiver des astéroïdes infinis avec 10 capteurs.",
    descAr: "30 سفينة تتطور لتفادي كويكبات لانهائية باستخدام 10 مدخلات.",
    tags: ["NEAT", "30 agents", "speciation"],
    accent: "#9966cc",
  },
  {
    id: "game-2048",
    num: "06",
    icon: "🔢",
    title: "2048",
    titleFr: "2048",
    titleAr: "2048",
    desc: "Monte Carlo Tree Search plays 2048 with 80 simulations per move. Live bar chart shows move scores.",
    descFr: "MCTS joue à 2048 avec 80 simulations par mouvement. Graphique en direct.",
    descAr: "بحث شجرة مونتي كارلو يلعب 2048 بـ 80 محاكاة لكل حركة.",
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
    desc: "100 prey and 20 predators evolve independent neural brains. Emergent hunting tactics by gen 30.",
    descFr: "100 proies et 20 prédateurs évoluent indépendamment. Tactiques de chasse émergentes.",
    descAr: "100 فريسة و20 مفترساً يطورون شبكات عصبية مستقلة. تكتيكات صيد ناشئة.",
    tags: ["GA", "NEAT", "120 agents"],
    accent: "#00ff88",
  },
  {
    id: "lunar-lander",
    num: "09",
    icon: "🌙",
    title: "Lunar Lander",
    titleFr: "Atterrisseur Lunaire",
    titleAr: "المركبة القمرية",
    desc: "20 landers evolve to touch down on the platform. Value heatmap shows safe zones.",
    descFr: "20 atterrisseurs évoluent pour se poser sur la plateforme. Carte thermique des zones sûres.",
    descAr: "20 مركبة تتطور للهبوط على المنصة. خريطة حرارية تُظهر المناطق الآمنة.",
    tags: ["NEAT", "20 agents", "physics"],
    accent: "#44ccff",
  },
  {
    id: "maze-solver",
    num: "10",
    icon: "🌀",
    title: "Maze Solver",
    titleFr: "Résolveur de Labyrinthe",
    titleAr: "حل المتاهة",
    desc: "200 walkers evolve move sequences through a random maze. Pheromone trails glow on cells.",
    descFr: "200 marcheurs évoluent dans un labyrinthe aléatoire. Traces de phéromones lumineuses.",
    descAr: "200 ماشٍ يطورون تسلسلات حركة عبر متاهة عشوائية. مسارات فيرومون متوهجة.",
    tags: ["GA", "200 agents", "pheromones"],
    accent: "#cc7722",
  },
];

const ALGO_LEGEND = [
  { color: "#00ff88", label: "NEAT — neuro-evolution" },
  { color: "#4488ff", label: "DQN — deep Q-network" },
  { color: "#9966cc", label: "GA — genetic algorithm" },
  { color: "#ffcc00", label: "MCTS — tree search" },
  { color: "#ff44cc", label: "SELF-PLAY" },
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
            />
          ))}
        </div>
      </div>
    </div>
  );
}

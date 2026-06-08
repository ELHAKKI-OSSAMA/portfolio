import Link from "next/link";
import { ArrowRight, Cpu } from "lucide-react";

const featured = [
  {
    id: "flappy-bird",
    icon: "🐦",
    title: "Flappy Bird",   titleFr: "Oiseau Flappy",       titleAr: "الطائر الرفرف",
    algo: "NEAT",           accent: "#00ff88",
    desc: "50 birds evolve in real time",
    descFr: "50 oiseaux évoluent en direct",  descAr: "50 طائراً يتطور لحظياً",
  },
  {
    id: "snake",
    icon: "🐍",
    title: "Snake",         titleFr: "Serpent",              titleAr: "الثعبان",
    algo: "Pathfinding",    accent: "#22d3aa",
    desc: "Hamiltonian + A* — perfect play",
    descFr: "Hamiltonien + A* — jeu parfait",  descAr: "هاميلتوني + A* — لعب مثالي",
  },
  {
    id: "car-racing",
    icon: "🏎️",
    title: "Car Racing",    titleFr: "Course Automobile",    titleAr: "سباق السيارات",
    algo: "NEAT",           accent: "#ffcc00",
    desc: "30 cars, 10 raycast sensors",
    descFr: "30 voitures, 10 capteurs raycasts", descAr: "30 سيارة، 10 مستشعرات",
  },
  {
    id: "game-2048",
    icon: "🔢",
    title: "2048",          titleFr: "2048",                 titleAr: "2048",
    algo: "MCTS",           accent: "#ff6b6b",
    desc: "200 simulations per move",
    descFr: "200 simulations par mouvement",  descAr: "200 محاكاة لكل حركة",
  },
];

export default function GamesTeaser({ locale }: { locale: string }) {
  const isFr = locale === "fr";
  const isAr = locale === "ar";

  const label   = isFr ? "Jeux IA" : isAr ? "ألعاب الذكاء الاصطناعي" : "AI Game Lab";
  const heading = isFr ? "IA en Action" : isAr ? "الذكاء الاصطناعي في العمل" : "AI in Action";
  const sub     = isFr
    ? "10 jeux navigateur propulsés par de vrais algorithmes d'IA — NEAT, DQN, MCTS et plus."
    : isAr
    ? "10 ألعاب متصفح مدعومة بخوارزميات ذكاء اصطناعي حقيقية — NEAT و DQN و MCTS والمزيد."
    : "10 browser games each powered by a real AI algorithm — NEAT, DQN, MCTS, Genetic Algorithms.";
  const viewAll = isFr ? "Jouer maintenant" : isAr ? "العب الآن" : "Play Now";

  return (
    <section className="section-padding border-t" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Cpu size={16} style={{ color: "var(--primary)" }} />
              <span className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--primary)" }}>
                {label}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
              {heading}
            </h2>
            <p className="mt-2 max-w-xl text-sm" style={{ color: "var(--text-secondary)" }}>
              {sub}
            </p>
          </div>
          <Link
            href={`/${locale}/games`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border font-medium text-sm transition-all group shrink-0"
            style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
          >
            {viewAll}
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((g) => {
            const title = isFr ? g.titleFr : isAr ? g.titleAr : g.title;
            const desc  = isFr ? g.descFr  : isAr ? g.descAr  : g.desc;
            return (
              <Link
                key={g.id}
                href={`/${locale}/games`}
                className="group relative rounded-2xl border overflow-hidden transition-all card-glow"
                style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
              >
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${g.accent}, transparent)` }} />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{g.icon}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${g.accent}20`, color: g.accent }}>
                      {g.algo}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-1 group-hover:text-[var(--primary)] transition-colors"
                    style={{ color: "var(--text-primary)" }}>
                    {title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

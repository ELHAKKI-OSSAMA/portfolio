import type { SectionI18n, KeyFormulaI18n } from '../types';

export const sectionI18n_rl: Record<string, SectionI18n> = {

  // ── reinforcement-learning ───────────────────────────────────────────────────
  "reinforcement-learning|0": {
    headingFr: "Apprendre en Faisant — le Paradigme RL",
    headingAr: "التعلم بالممارسة — نموذج التعلم التعزيزي",
    textFr: "L'apprentissage supervisé a besoin d'exemples étiquetés. L'apprentissage par renforcement n'a besoin que d'un signal de récompense — feedback sur la qualité d'une action. C'est ainsi que les humains apprennent à marcher, jouer à des jeux et conduire : par la pratique, le feedback et l'amélioration progressive de la stratégie. Succès du RL : AlphaGo a battu le champion du monde de Go (2016) — entraîné par RL après pré-entraînement supervisé. Le raffinement de structure d'AlphaFold utilise une optimisation de type RL. ChatGPT / GPT-4 utilise RLHF (Reinforcement Learning from Human Feedback) pour aligner les sorties du modèle avec les préférences humaines. Les systèmes de manipulation robotique (Boston Dynamics, Figure AI) entraînent des politiques en simulation puis les transfèrent sur du matériel réel.",
    textAr: "يحتاج التعلم الخاضع للإشراف إلى أمثلة مُعلَّمة. يحتاج التعلم التعزيزي فقط إلى إشارة مكافأة — ردود فعل على ما إذا كان الفعل جيداً أم سيئاً. هكذا يتعلم البشر المشي واللعب والقيادة: من خلال الممارسة والتغذية الراجعة والتحسين التدريجي للاستراتيجية. نجاحات RL: هزم AlphaGo بطل العالم في Go (2016) — دُرِّب بـRL بعد تدريب مسبق خاضع للإشراف. يستخدم ChatGPT / GPT-4 RLHF لمحاذاة مخرجات النموذج مع التفضيلات البشرية. تُدرّب أنظمة التلاعب الروبوتي سياساتها في المحاكاة ثم تنقلها إلى الأجهزة الحقيقية.",
    calloutFr: "AlphaZero de DeepMind a appris aux échecs, au Go et au Shogi à un niveau surhumain en 24 heures de jeu en solo — aucune partie humaine enregistrée, pur RL à partir de jeu aléatoire et de la récompense de victoire.",
    calloutAr: "تعلّم AlphaZero من DeepMind الشطرنج والغو والشوغي على المستوى فوق البشري في 24 ساعة من اللعب الذاتي — دون سجلات ألعاب بشرية، تعلم تعزيزي خالص من اللعب العشوائي ومكافأة الفوز.",
  },
  "reinforcement-learning|1": {
    headingFr: "Le Cadre RL : Agent, Environnement, MDP",
    headingAr: "إطار عمل RL: الوكيل، البيئة، MDP",
    textFr: "**Processus de Décision de Markov (MDP) :** (S, A, T, R, γ) — États S, Actions A, Fonction de transition T(s'|s,a), Récompense R(s,a,s'), escompte γ∈[0,1]. **Agent :** À chaque pas de temps t, observe l'état sₜ, prend l'action aₜ selon la politique π(aₜ|sₜ), reçoit la récompense rₜ. **Objectif :** Trouver la politique π* qui maximise le retour actualisé attendu Gₜ = Σᵢ γⁱrₜ₊ᵢ. **Fonction Q(s,a) :** Retour attendu en commençant de l'état s, prenant l'action a, puis suivant la politique optimale. Si on connaissait Q*, on choisirait toujours argmax_a Q*(s,a). **Distinction clé :** Le RL sans modèle (Q-learning, PPO) apprend directement par interaction sans connaître T. Le RL avec modèle (Dyna, MuZero) apprend un modèle du monde T̂ et planifie en imagination.",
    textAr: "**عملية قرار ماركوف (MDP):** (S, A, T, R, γ) — حالات S، أفعال A، دالة انتقال T(s'|s,a)، مكافأة R(s,a,s')، خصم γ∈[0,1]. **الوكيل:** في كل خطوة زمنية t، يلاحظ الحالة sₜ، يتخذ الفعل aₜ وفق السياسة π(aₜ|sₜ)، يتلقى المكافأة rₜ. **الهدف:** إيجاد السياسة π* التي تُعظّم العائد المخصوم المتوقع Gₜ = Σᵢ γⁱrₜ₊ᵢ. **دالة Q(s,a):** العائد المتوقع بدءاً من الحالة s مع اتخاذ الفعل a ثم اتباع السياسة المثلى. **تمييز رئيسي:** RL بدون نموذج (Q-learning, PPO) يتعلم مباشرةً من التفاعل دون معرفة T. RL بنموذج (Dyna, MuZero) يتعلم نموذج عالم T̂ ويخطط في الخيال.",
    calloutFr: "Le facteur d'escompte γ contrôle la myopie : γ=0,99 fait que l'agent se soucie des récompenses 100 pas dans le futur ; γ=0 est purement gourmand. La plupart des problèmes nécessitent γ∈[0,95, 0,999].",
    calloutAr: "يتحكم معامل الخصم γ في قصر النظر: γ=0.99 يجعل الوكيل يهتم بالمكافآت 100 خطوة في المستقبل؛ γ=0 جشع بحت. معظم المسائل تحتاج γ∈[0.95, 0.999].",
  },
  "reinforcement-learning|2": {
    headingFr: "Q-Learning : Tabulaire et Profond (DQN)",
    headingAr: "التعلم بـQ: الجدولي والعميق (DQN)",
    stepsFr: [
      "Initialisez la table Q : Q(s,a)=0 pour toutes les paires état-action (tabulaire) ou le réseau Q de paramètres θ (DQN).",
      "Pour chaque épisode : réinitialisez l'environnement, observez l'état initial s.",
      "Sélection d'action ε-greedy : avec probabilité ε, choisissez une action aléatoire (exploration), sinon choisissez argmax_a Q(s,a) (exploitation). Décroissez ε de 1,0 → 0,05 pendant l'entraînement.",
      "Exécutez l'action a, observez la récompense r et l'état suivant s'. Stockez (s,a,r,s') dans le tampon de replay (DQN).",
      "Mise à jour TD : Q(s,a) ← Q(s,a) + α[r + γ·max_a' Q(s',a') - Q(s,a)].",
      "Extras DQN : (1) Replay d'expérience — mini-lots aléatoires pour briser les corrélations. (2) Réseau cible — copie gelée Q_cible(θ⁻), synchronisée tous les N pas. (3) Double DQN — découpler la sélection d'action de l'estimation de valeur pour réduire la surestimation.",
      "Convergence : le Q-learning tabulaire converge vers Q* pour les MDPs finis avec une exploration suffisante. Les réseaux Q neuronaux ne sont pas garantis mais fonctionnent bien en pratique.",
    ],
    stepsAr: [
      "ابدأ جدول Q: Q(s,a)=0 لجميع أزواج الحالة-الفعل (جدولي) أو شبكة Q ذات معاملات θ (DQN).",
      "لكل حلقة: أعِد تهيئة البيئة، لاحظ الحالة الأولية s.",
      "اختيار الفعل ε-جشع: باحتمال ε اختر فعلاً عشوائياً (استكشاف)، وإلا اختر argmax_a Q(s,a) (استغلال). قلّص ε من 1.0 → 0.05 خلال التدريب.",
      "نفّذ الفعل a، لاحظ المكافأة r والحالة التالية s'. خزّن (s,a,r,s') في ذاكرة التشغيل (DQN).",
      "تحديث TD: Q(s,a) ← Q(s,a) + α[r + γ·max_a' Q(s',a') - Q(s,a)].",
      "إضافات DQN: (1) إعادة تشغيل التجربة — دُفعات عشوائية لكسر الارتباطات. (2) الشبكة المستهدفة — نسخة مجمّدة Q_هدف(θ⁻)، تُزامن كل N خطوة. (3) DQN المزدوج — فصل اختيار الفعل عن تقدير القيمة لتقليل المبالغة.",
      "التقارب: يتقارب Q-learning الجدولي إلى Q* للـMDPs المحدودة مع استكشاف كافٍ. شبكات Q العصبية غير مضمونة لكنها تعمل جيداً عملياً.",
    ],
  },
  "reinforcement-learning|3": {
    headingFr: "Q-Learning et DQN de Zéro",
    headingAr: "تعلم Q وDQN من الصفر",
    codeFr: `import numpy as np
import gymnasium as gym
from collections import deque
import torch, torch.nn as nn, torch.optim as optim

# ── 1. Q-Learning Tabulaire (FrozenLake) ─────────────────────────────────────
env = gym.make("FrozenLake-v1", is_slippery=False)
n_etats, n_actions = env.observation_space.n, env.action_space.n

Q       = np.zeros((n_etats, n_actions))
alpha   = 0.8          # taux d'apprentissage
gamma   = 0.95         # escompte
epsilon = 1.0          # taux d'exploration

for episode in range(2000):
    s, _ = env.reset()
    termine = False
    while not termine:
        # ε-greedy
        if np.random.random() < epsilon:
            a = env.action_space.sample()
        else:
            a = np.argmax(Q[s])

        s_suiv, r, fin, tronque, _ = env.step(a)
        termine = fin or tronque

        # Mise à jour Q-learning (cible Bellman)
        cible_td = r + gamma * np.max(Q[s_suiv]) * (1 - fin)
        Q[s, a] += alpha * (cible_td - Q[s, a])
        s = s_suiv

    epsilon = max(0.01, epsilon * 0.999)   # décroissance exploration

print(f"Q-table entraînée, epsilon final : {epsilon:.4f}")

# ── 2. Deep Q-Network (CartPole) ─────────────────────────────────────────────
class DQN(nn.Module):
    def __init__(self, dim_obs, n_actions):
        super().__init__()
        self.reseau = nn.Sequential(
            nn.Linear(dim_obs, 128), nn.ReLU(),
            nn.Linear(128, 128),    nn.ReLU(),
            nn.Linear(128, n_actions)
        )
    def forward(self, x): return self.reseau(x)

env = gym.make("CartPole-v1")
dim_obs   = env.observation_space.shape[0]
n_actions = env.action_space.n

q_reseau = DQN(dim_obs, n_actions)
q_cible  = DQN(dim_obs, n_actions)    # réseau cible gelé
q_cible.load_state_dict(q_reseau.state_dict())

optimiseur     = optim.Adam(q_reseau.parameters(), lr=1e-3)
tampon_replay  = deque(maxlen=10_000)
gamma          = 0.99
epsilon        = 1.0
taille_lot     = 64
freq_maj_cible = 100
etapes         = 0

for episode in range(500):
    s, _ = env.reset()
    recompense_totale = 0
    termine = False
    while not termine:
        # Action ε-greedy
        if np.random.random() < epsilon:
            a = env.action_space.sample()
        else:
            with torch.no_grad():
                a = q_reseau(torch.FloatTensor(s)).argmax().item()

        s_suiv, r, fin, tronque, _ = env.step(a)
        termine = fin or tronque
        tampon_replay.append((s, a, r, s_suiv, fin))
        s = s_suiv; recompense_totale += r; etapes += 1

        # Entraîner quand le tampon a assez d'échantillons
        if len(tampon_replay) >= taille_lot:
            lot = [tampon_replay[i] for i in np.random.choice(len(tampon_replay), taille_lot, replace=False)]
            S, A, R, S_suiv, D = map(np.array, zip(*lot))
            S_t = torch.FloatTensor(S); A_t = torch.LongTensor(A)
            R_t = torch.FloatTensor(R); S_suiv_t = torch.FloatTensor(S_suiv)
            D_t = torch.FloatTensor(D)

            with torch.no_grad():
                q_max_suiv = q_cible(S_suiv_t).max(1)[0]
                cible = R_t + gamma * q_max_suiv * (1 - D_t)

            q_courant = q_reseau(S_t).gather(1, A_t.unsqueeze(1)).squeeze()
            perte = nn.functional.mse_loss(q_courant, cible)
            optimiseur.zero_grad(); perte.backward(); optimiseur.step()

        if etapes % freq_maj_cible == 0:
            q_cible.load_state_dict(q_reseau.state_dict())

    epsilon = max(0.05, epsilon * 0.995)
    if episode % 50 == 0:
        print(f"Épisode {episode:4d} | récompense={recompense_totale:5.0f} | ε={epsilon:.3f}")`,
  },
  "reinforcement-learning|4": {
    headingFr: "Gradient de Politique et Acteur-Critique (A2C/PPO)",
    headingAr: "تدرج السياسة والفاعل-الناقد (A2C/PPO)",
    formulaLabelFr: "Avantage, perte A2C avec bonus d'entropie, PPO avec clipping",
    formulaLabelAr: "الميزة، خسارة A2C مع مكافأة الإنتروبيا، PPO مع القطع",
    textFr: "Les méthodes de gradient de politique optimisent directement la politique π_θ au lieu d'une fonction de valeur. L'architecture acteur-critique utilise deux réseaux : l'acteur π_θ sélectionne les actions, le critique V_φ estime les valeurs d'état comme baseline pour réduire la variance du gradient. PPO (Proximal Policy Optimization) ajoute un mécanisme de clipping pour éviter les mises à jour de politique destructivement grandes — le rapport r_t(θ) = π_θ(a|s)/π_θ_ancien(a|s) est limité à [1-ε, 1+ε]. Cela rend PPO suffisamment efficace en termes d'échantillons pour un usage pratique et c'est l'algorithme standard dans RLHF pour les LLMs.",
    textAr: "تُحسّن أساليب تدرج السياسة مباشرةً السياسةَ π_θ بدلاً من دالة قيمة. تستخدم بنية الفاعل-الناقد شبكتين: الفاعل π_θ يختار الأفعال، والناقد V_φ يُقدّر قيم الحالة كخط أساسي لتقليل تباين التدرج. تُضيف PPO (تحسين السياسة القريبة) آلية قطع لمنع تحديثات السياسة المدمرة الكبيرة — نسبة r_t(θ) = π_θ(a|s)/π_θ_القديمة(a|s) مقطوعة إلى [1-ε, 1+ε]. يجعل هذا PPO كافياً في كفاءة العينات للاستخدام العملي وهو الخوارزمية القياسية في RLHF لـLLMs.",
  },
  "reinforcement-learning|5": {
    headingFr: "La Triade Mortelle et les Modes d'Échec Courants du RL",
    headingAr: "الثالوث المميت وأوضاع فشل RL الشائعة",
    textFr: "La triade mortelle (Sutton & Barto) : combiner (1) l'approximation de fonctions (réseaux de neurones), (2) le bootstrapping (mises à jour TD), et (3) l'apprentissage hors-politique peut provoquer une divergence. DQN évite cela avec des tampons de replay et des réseaux cibles mais l'entraînement peut rester instable. Pièges pratiques du RL : (1) La mise en forme des récompenses peut introduire des raccourcis involontaires — l'agent de course en bateau qui a appris à tourner en rond pour collecter des bonus. (2) Les récompenses rares rendent l'exploration presque impossible — utilisez la motivation intrinsèque (curiosité) ou la mise en forme des récompenses avec précaution. (3) L'écart sim-to-real — les politiques entraînées en simulation échouent sur les robots réels à cause de la physique non modélisée. (4) L'évaluation avec des graines fixes est trompeuse — les résultats RL ont une variance élevée ; rapportez moyenne ± écart-type sur 10+ graines.",
    textAr: "الثالوث المميت (Sutton & Barto): الجمع بين (1) تقريب الدوال (الشبكات العصبية)، (2) الإقلاع (تحديثات TD)، و(3) التعلم خارج السياسة قد يُسبّب التباعد. يتجنب DQN هذا بذاكرة التشغيل والشبكات المستهدفة لكن التدريب قد يظل غير مستقر. مخاطر RL العملية: (1) تشكيل المكافآت قد يُدخل اختصارات غير مقصودة — وكيل سباق القوارب الذي تعلّم الدوران في دوائر لجمع المكافآت. (2) المكافآت النادرة تجعل الاستكشاف شبه مستحيل — استخدم الدافعية الداخلية بحذر. (3) الفجوة بين المحاكاة والواقع — السياسات المدرّبة في المحاكاة تفشل على الروبوتات الحقيقية بسبب الفيزياء غير المُنمذجة. (4) التقييم بنقاط ابتداء ثابتة مضلِّل — أبلغ عن المتوسط ± الانحراف المعياري عبر 10+ نقاط ابتداء.",
    calloutFr: "L'agent de course en bateau d'OpenAI entraîné avec des récompenses de mise en forme a appris à conduire en cercles pour collecter des bonus au lieu de terminer la course — un célèbre cas d'échec de piratage de récompense.",
    calloutAr: "تعلّم وكيل سباق القوارب من OpenAI المدرَّب بمكافآت مُشكَّلة القيادةَ في دوائر لجمع العناصر بدلاً من إنهاء السباق — حالة فشل شهيرة لاختراق المكافأة.",
  },
};

export const keyFormulaI18n_rl: Record<string, KeyFormulaI18n> = {

  // ── reinforcement-learning ───────────────────────────────────────────────────
  "reinforcement-learning|0": {
    nameFr: "Équation de Bellman",  nameAr: "معادلة بيلمان",
    meaningFr: "Valeur Q optimale : récompense immédiate + meilleure valeur future actualisée. La cible récursive vers laquelle Q-learning converge",
    meaningAr: "قيمة Q المثلى: المكافأة الفورية + أفضل قيمة مستقبلية مخصومة. الهدف العودي الذي يتقارب إليه Q-learning",
  },
  "reinforcement-learning|1": {
    nameFr: "Mise à Jour Q-Learning",  nameAr: "تحديث Q-Learning",
    meaningFr: "Déplacer l'estimation actuelle vers la cible Bellman par le pas α (apprentissage par différence temporelle)",
    meaningAr: "تحريك التقدير الحالي نحو هدف بيلمان بخطوة α (التعلم بالفرق الزمني)",
  },
  "reinforcement-learning|2": {
    nameFr: "Gradient de Politique (REINFORCE)",  nameAr: "تدرج السياسة (REINFORCE)",
    meaningFr: "Augmenter la probabilité des actions ayant mené à des retours élevés, diminuer pour les actions à faible retour",
    meaningAr: "زيادة احتمال الأفعال التي أدت إلى عوائد عالية، وتقليله للأفعال ذات العوائد المنخفضة",
  },
  "reinforcement-learning|3": {
    nameFr: "Objectif PPO avec Clipping",  nameAr: "هدف PPO مع القطع",
    meaningFr: "Optimisation Politique Proximale : clip le rapport de mise à jour de la politique pour rester dans [1-ε, 1+ε] — entraînement stable en grands lots",
    meaningAr: "تحسين السياسة القريبة: يقطع نسبة تحديث السياسة لتبقى في [1-ε, 1+ε] — تدريب مستقر بالدُّفعات الكبيرة",
  },
};

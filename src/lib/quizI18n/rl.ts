import type { QuizI18n } from './types';

export const T_rl: Record<string, QuizI18n> = {

  // ── reinforcement-learning ────────────────────────────────────────────────

  "reinforcement-learning|0": {
    questionFr: "Quelle est l'équation de Bellman pour le Q-learning ?",
    questionAr: "ما معادلة بيلمان لـ Q-learning؟",
    optionsFr: [
      "Q(s,a) = r + E[V(s')]",
      "Q(s,a) ← Q(s,a) + α[r + γ·max_a' Q(s',a') - Q(s,a)]",
      "Q(s,a) = log P(a|s)",
      "Q(s,a) = Σπ(a|s)·r(s,a)",
    ],
    optionsAr: [
      "Q(s,a) = r + E[V(s')]",
      "Q(s,a) ← Q(s,a) + α[r + γ·max_a' Q(s',a') - Q(s,a)]",
      "Q(s,a) = log P(a|s)",
      "Q(s,a) = Σπ(a|s)·r(s,a)",
    ],
    explanationFr:
      "La mise à jour de Bellman bootstrap : la cible r + γ·maxQ(s',a') est la meilleure estimation actuelle de la vraie valeur Q. α mélange ancienne et nouvelle estimation ; γ actualise les récompenses futures.",
    explanationAr:
      "تحديث بيلمان يُقوس: الهدف r + γ·maxQ(s',a') هو أفضل تقدير حالي لقيمة Q الحقيقية. α يمزج التقديرين القديم والجديد؛ γ يُخصم المكافآت المستقبلية.",
  },

  "reinforcement-learning|1": {
    questionFr: "Qu'est-ce que le compromis exploration-exploitation ?",
    questionAr: "ما مقايضة الاستكشاف والاستغلال؟",
    optionsFr: [
      "Comment équilibrer temps d'entraînement et d'inférence",
      "Choisir la meilleure action connue (exploiter) ou essayer de nouvelles actions pour en découvrir de meilleures (explorer)",
      "Comment équilibrer biais et variance",
      "Choisir entre apprentissage on-policy et off-policy",
    ],
    optionsAr: [
      "كيفية الموازنة بين وقت التدريب والاستدلال",
      "اختيار أفضل إجراء معروف (استغلال) أو تجربة إجراءات جديدة لاكتشاف ما هو أفضل (استكشاف)",
      "كيفية الموازنة بين التحيز والتباين",
      "الاختيار بين التعلم المتزامن وغير المتزامن",
    ],
    explanationFr:
      "Toujours exploiter la meilleure action actuelle rate de meilleures options non découvertes. Toujours explorer gaspille des récompenses sur de mauvaises actions connues. ε-greedy : exploiter avec prob 1-ε, explorer avec prob ε.",
    explanationAr:
      "الاستغلال الدائم للإجراء الأفضل يُفوّت خيارات أفضل غير مكتشفة. الاستكشاف الدائم يُهدر المكافآت على إجراءات سيئة معروفة. ε-greedy: استغلال باحتمال 1-ε، استكشاف باحتمال ε.",
  },

  "reinforcement-learning|2": {
    questionFr:
      "Quelle innovation clé DQN apporte-t-il au Q-learning pour les réseaux de neurones ?",
    questionAr: "ما الابتكار الرئيسي الذي يُضيفه DQN إلى Q-learning للشبكات العصبية؟",
    optionsFr: [
      "Il utilise un gradient de politique à la place des valeurs Q",
      "Il ajoute un tampon de rejeu d'expérience et un réseau cible pour stabiliser l'entraînement",
      "Il discrétise l'espace d'actions",
      "Il supprime le besoin d'un facteur d'actualisation",
    ],
    optionsAr: [
      "يستخدم تدرج السياسة بدلاً من قيم Q",
      "يُضيف ذاكرة إعادة تشغيل التجارب وشبكة هدف لتثبيت التدريب",
      "يُقطّع فضاء الإجراءات",
      "يُزيل الحاجة إلى عامل الخصم",
    ],
    explanationFr:
      "Le rejeu d'expérience brise la corrélation temporelle dans les transitions consécutives. Le réseau cible fournit des cibles Q-valeur stables en étant en retard sur le réseau en ligne. Ces deux correctifs empêchent la boucle de rétroaction qui rend le Q-learning neuronal instable.",
    explanationAr:
      "تكسر ذاكرة إعادة التشغيل الارتباط الزمني في الانتقالات المتتالية. تُوفّر شبكة الهدف أهدافاً مستقرة لقيم Q بالتأخر خلف الشبكة الآنية. هذان الإصلاحان يمنعان حلقة التغذية الراجعة التي تُجعل Q-learning العصبي غير مستقر.",
  },
};

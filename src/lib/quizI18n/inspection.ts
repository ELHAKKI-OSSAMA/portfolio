import type { QuizI18n } from './types';

export const T_inspection: Record<string, QuizI18n> = {

  // ── feature-importance ────────────────────────────────────────────────────

  "feature-importance|0": {
    questionFr:
      "Quel est l'inconvénient majeur de l'importance basée sur l'impureté (Gini) ?",
    questionAr: "ما العيب الرئيسي لمقياس الأهمية القائم على الشائبة (Gini)؟",
    optionsFr: [
      "Il est lent à calculer",
      "Il est biaisé en faveur des variables à forte cardinalité comme les IDs ou les codes postaux qui offrent de nombreux points de division",
      "Il ne peut pas gérer les valeurs manquantes",
      "Il ne fonctionne qu'avec les modèles linéaires",
    ],
    optionsAr: [
      "حسابه بطيء",
      "منحاز لصالح الميزات ذات الكثير من القيم الفريدة كالمعرّفات والرموز البريدية التي تُوفّر نقاط تقسيم كثيرة",
      "لا يتعامل مع القيم المفقودة",
      "يعمل فقط مع النماذج الخطية",
    ],
    explanationFr:
      "Une variable avec de nombreuses valeurs uniques a plus d'opportunités de créer des divisions pures par chance, gonflant son score d'importance même si elle n'est pas vraiment prédictive.",
    explanationAr:
      "ميزة بقيم فريدة كثيرة لديها فرص أكثر لإنشاء تقسيمات نقية بالصدفة، مما يُضخّم درجة أهميتها حتى لو لم تكن تنبؤية حقاً.",
  },

  "feature-importance|1": {
    questionFr:
      "Comment l'importance par permutation teste-t-elle si une variable est utile ?",
    questionAr: "كيف تختبر أهمية التبديل ما إذا كانت الميزة مفيدة؟",
    optionsFr: [
      "En réentraînant le modèle sans la variable",
      "En mélangeant aléatoirement les valeurs d'une variable et en mesurant la chute du score de validation",
      "En calculant la corrélation entre la variable et la cible",
      "En calculant le gradient de la sortie par rapport à la variable",
    ],
    optionsAr: [
      "بإعادة تدريب النموذج بدون الميزة",
      "بخلط قيم ميزة واحدة عشوائياً وقياس انخفاض درجة التحقق",
      "بحساب الارتباط بين الميزة والهدف",
      "بحساب تدرج المخرجات بالنسبة للميزة",
    ],
    explanationFr:
      "Mélanger une variable brise sa relation avec la cible. Si le score de validation chute significativement, cette variable était importante. Cette méthode est indépendante du modèle et détecte les interactions que SHAP peut manquer.",
    explanationAr:
      "خلط ميزة يكسر علاقتها بالهدف. إذا انخفضت درجة التحقق بشكل ملحوظ، فإن تلك الميزة كانت مهمة. هذه الطريقة مستقلة عن النموذج وتكتشف التفاعلات التي قد يفوتها SHAP.",
  },

  "feature-importance|2": {
    questionFr: "Que signifie une valeur SHAP de +0,3 pour une variable ?",
    questionAr: "ماذا تعني قيمة SHAP +0.3 لميزة معيّنة؟",
    optionsFr: [
      "La valeur de la variable est à 0,3 écarts-types au-dessus de la moyenne",
      "Cette variable a poussé la prédiction du modèle de 0,3 unités au-dessus de la sortie de référence attendue pour cette instance",
      "La variable a une importance globale de 30 %",
      "Le coefficient de la variable est 0,3",
    ],
    optionsAr: [
      "قيمة الميزة أعلى من المتوسط بـ 0.3 انحرافات معيارية",
      "رفعت هذه الميزة تنبؤ النموذج بمقدار 0.3 فوق المتوقع الأساسي لهذه الحالة تحديداً",
      "الميزة لها أهمية عالمية 30%",
      "معامل الميزة هو 0.3",
    ],
    explanationFr:
      "Les valeurs SHAP sont additives : sortie = ligne de base + Σφᵢ. Une valeur de +0,3 signifie que la valeur spécifique de cette variable a augmenté la prédiction de 0,3 pour cette instance particulière (attribution locale).",
    explanationAr:
      "قيم SHAP تجمعية: المخرج = خط الأساس + Σφᵢ. قيمة +0.3 تعني أن القيمة المحددة لهذه الميزة رفعت التنبؤ بمقدار 0.3 لهذه الحالة بالذات (إسناد محلي).",
  },

  // ── partial-dependence ─────────────────────────────────────────────────────

  "partial-dependence|0": {
    questionFr: "Que montre un graphique de dépendance partielle (PDP) ?",
    questionAr: "ما الذي يُظهره مخطط الاعتماد الجزئي (PDP)؟",
    optionsFr: [
      "La distribution de la variable dans le jeu d'entraînement",
      "Le résultat prédit moyen lorsqu'une variable varie tandis que toutes les autres sont marginalisées",
      "La prédiction individuelle pour chaque échantillon d'entraînement",
      "L'interaction entre deux échantillons spécifiques",
    ],
    optionsAr: [
      "توزيع الميزة في مجموعة التدريب",
      "متوسط النتيجة المتوقعة عند تغيير ميزة واحدة بينما تُهمَّش جميع الأخريات",
      "التنبؤ الفردي لكل عينة تدريب",
      "التفاعل بين عينتين محددتين",
    ],
    explanationFr:
      "PDP fait la moyenne des prédictions du modèle sur la distribution des autres variables, montrant l'effet marginal d'une (ou deux) variable(s) sur la sortie — utile pour l'interprétation globale.",
    explanationAr:
      "يُوسّط PDP تنبؤات النموذج على توزيع الميزات الأخرى، مُظهراً التأثير الهامشي لميزة واحدة (أو اثنتين) على المخرج — مفيد للتفسير العالمي.",
  },

  "partial-dependence|1": {
    questionFr:
      "Que montre une courbe ICE (Individual Conditional Expectation) de plus qu'un PDP ?",
    questionAr: "ما الذي تُظهره منحنيات ICE زيادةً على PDP؟",
    optionsFr: [
      "L'effet moyen d'une variable",
      "Une courbe de prédiction par échantillon d'entraînement, révélant des effets hétérogènes que la moyenne PDP masque",
      "L'intervalle de confiance du PDP",
      "Les valeurs SHAP de la variable",
    ],
    optionsAr: [
      "التأثير المتوسط للميزة",
      "منحنى تنبؤ لكل عينة تدريب، يكشف تأثيرات غير متجانسة يخفيها متوسط PDP",
      "فترة الثقة للـ PDP",
      "قيم SHAP للميزة",
    ],
    explanationFr:
      "Si les courbes ICE s'étalent ou se croisent, la moyenne PDP est trompeuse — différents sous-groupes ont des effets opposés. ICE centré (c-ICE) soustrait la valeur la plus à gauche de chaque courbe pour révéler la forme.",
    explanationAr:
      "إذا تشعّبت منحنيات ICE أو تقاطعت، فإن متوسط PDP مُضلِّل — مجموعات فرعية مختلفة لها تأثيرات معاكسة. ICE المتمركز (c-ICE) يطرح أقصى يسار كل منحنى ليكشف الشكل.",
  },

  "partial-dependence|2": {
    questionFr: "Quel problème les graphiques ALE règlent-ils par rapport aux PDP ?",
    questionAr: "ما المشكلة التي تحلها مخططات ALE مقارنةً بـ PDP؟",
    optionsFr: [
      "Les graphiques ALE sont plus rapides à calculer",
      "Les graphiques ALE utilisent des distributions conditionnelles plutôt que marginales, évitant l'extrapolation sur les variables corrélées",
      "Les graphiques ALE fonctionnent pour n'importe quel type de modèle",
      "Les graphiques ALE montrent des effets globaux plutôt que locaux",
    ],
    optionsAr: [
      "مخططات ALE أسرع في الحساب",
      "تستخدم ALE توزيعات شرطية بدلاً من الهامشية، متجنبةً الاستقراء على الميزات المترابطة",
      "تعمل ALE مع أي نوع من النماذج",
      "تُظهر ALE تأثيرات عالمية لا محلية",
    ],
    explanationFr:
      "Les PDP marginalisent sur toutes les valeurs des autres variables, y compris les combinaisons impossibles (ex. âge=5 avec revenu=200 k). ALE conditionne sur des fenêtres de données locales, restant dans la distribution.",
    explanationAr:
      "تُهمّش PDP على جميع قيم الميزات الأخرى بما فيها التوليفات المستحيلة (مثلاً عمر=5 مع دخل=200k). تُقيّد ALE على نوافذ بيانات محلية، مبقيةً ضمن التوزيع.",
  },

};

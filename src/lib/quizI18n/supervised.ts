import type { QuizI18n } from './types';

export const T_supervised: Record<string, QuizI18n> = {

  // ── linear-regression ─────────────────────────────────────────────────────

  "linear-regression|0": {
    questionFr: "Que mesure le R² (coefficient de détermination) ?",
    questionAr: "ماذا يقيس معامل التحديد R² ؟",
    optionsFr: [
      "La corrélation entre deux variables",
      "La proportion de variance de y expliquée par le modèle",
      "L'erreur quadratique moyenne du modèle",
      "Le nombre de prédicteurs significatifs",
    ],
    optionsAr: [
      "الارتباط بين متغيرين",
      "نسبة تباين y التي يفسرها النموذج",
      "متوسط مربع خطأ النموذج",
      "عدد المتنبئات ذات الدلالة الإحصائية",
    ],
    explanationFr:
      "R² = 1 - SS_res/SS_tot. R²=1 signifie une prédiction parfaite ; R²=0 signifie que le modèle ne fait pas mieux que la moyenne ; R²<0 est possible pour de très mauvais modèles.",
    explanationAr:
      "R² = 1 - SS_res/SS_tot. R²=1 يعني تنبؤاً مثالياً؛ R²=0 يعني أن النموذج لا يتفوق على التنبؤ بالمتوسط؛ R²<0 ممكن للنماذج السيئة جداً.",
  },

  "linear-regression|1": {
    questionFr: "Quel est l'effet de la régularisation L1 (Lasso) ?",
    questionAr: "ما تأثير التنظيم L1 (Lasso)؟",
    optionsFr: [
      "Réduit tous les poids proportionnellement vers zéro",
      "Peut réduire certains poids à exactement zéro, produisant des modèles parcimonieux",
      "Empêche le surapprentissage en ajoutant du bruit",
      "Augmente le taux d'apprentissage",
    ],
    optionsAr: [
      "يُقلّص جميع الأوزان بنسبة تناسبية نحو الصفر",
      "يمكنه إلغاء بعض الأوزان تماماً (تعيينها صفراً)، منتجاً نماذج متفرقة",
      "يمنع الإفراط بالتخصيص بإضافة ضوضاء",
      "يزيد معدل التعلم",
    ],
    explanationFr:
      "L1 ajoute λΣ|w| à la perte. La discontinuité en zéro crée une incitation à la parcimonie — les petits poids sont annulés, effectuant une sélection de variables.",
    explanationAr:
      "يُضيف L1 λΣ|w| للخسارة. النقطة غير القابلة للتفاضل عند الصفر تخلق حافزاً للتفرق — الأوزان الصغيرة تُلغى وكأنها اختيار للميزات.",
  },

  "linear-regression|2": {
    questionFr:
      "Dans la régression logistique, que représente la sortie sigmoïde ?",
    questionAr: "في الانحدار اللوجستي، ماذا تمثل مخرجات دالة السيني (sigmoid)؟",
    optionsFr: [
      "L'étiquette de classe (0 ou 1)",
      "La probabilité estimée P(y=1 | x)",
      "La distance par rapport à la frontière de décision",
      "Le log-odds après seuillage",
    ],
    optionsAr: [
      "تسمية الفئة (0 أو 1)",
      "الاحتمالية المقدّرة P(y=1 | x)",
      "المسافة عن حد القرار",
      "نسبة اللوغاريتم بعد التعتيق",
    ],
    explanationFr:
      "σ(w·x+b) mappe le score linéaire sur [0,1], donnant la probabilité estimée de la classe positive. La frontière de décision est là où σ = 0,5, i.e. w·x+b = 0.",
    explanationAr:
      "تُعيّن σ(w·x+b) الدرجة الخطية على [0,1]، مما يعطي الاحتمالية المقدّرة للفئة الموجبة. حد القرار هو حيث σ = 0.5، أي w·x+b = 0.",
  },

  // ── model-evaluation ──────────────────────────────────────────────────────

  "model-evaluation|0": {
    questionFr: "Quand faut-il privilégier le Rappel sur la Précision ?",
    questionAr: "متى يُفضَّل الاسترجاع (Recall) على الدقة (Precision)؟",
    optionsFr: [
      "Quand les faux positifs sont très coûteux (filtre anti-spam)",
      "Quand les faux négatifs sont très coûteux (dépistage du cancer)",
      "Quand le jeu de données est parfaitement équilibré",
      "Quand le modèle produit des probabilités",
    ],
    optionsAr: [
      "عندما تكون الإيجابيات الزائفة مكلفة جداً (فلتر البريد المزعج)",
      "عندما تكون السلبيات الزائفة مكلفة جداً (فحص السرطان)",
      "عندما تكون البيانات متوازنة تماماً",
      "عندما يُخرج النموذج احتماليات",
    ],
    explanationFr:
      "Rappel = TP/(TP+FN). Manquer un cancer (faux négatif) est pire qu'une fausse alarme, donc maximiser le rappel est critique en dépistage médical.",
    explanationAr:
      "الاسترجاع = TP/(TP+FN). تفويت ورم سرطاني (سلبي زائف) أسوأ من إنذار كاذب، لذا تعظيم الاسترجاع حاسم في الفحص الطبي.",
  },

  "model-evaluation|1": {
    questionFr: "Que signifie un score AUC-ROC de 0,5 ?",
    questionAr: "ماذا يعني حصول النموذج على AUC-ROC = 0.5؟",
    optionsFr: [
      "Le modèle a une précision de 50 %",
      "Le modèle ne fait pas mieux qu'une classification aléatoire",
      "Le modèle a 50 % de rappel",
      "Le seuil est fixé à 0,5",
    ],
    optionsAr: [
      "دقة النموذج 50%",
      "النموذج لا يتفوق على التخمين العشوائي",
      "معدل الاسترجاع 50%",
      "العتبة محددة عند 0.5",
    ],
    explanationFr:
      "AUC = 0,5 signifie que la courbe ROC est sur la diagonale — le classement du modèle n'est pas meilleur que le hasard. AUC = 1,0 est une séparation parfaite.",
    explanationAr:
      "AUC = 0.5 يعني أن منحنى ROC يقع على القطر — ترتيب النموذج لا يتفوق على الصدفة. AUC = 1.0 هو فصل مثالي.",
  },

  "model-evaluation|2": {
    questionFr:
      "Pourquoi la K-Fold Stratifiée est-elle préférable à la K-Fold classique pour une classification déséquilibrée ?",
    questionAr: "لماذا يُفضَّل K-Fold المتوازن على K-Fold العادي في التصنيف غير المتوازن؟",
    optionsFr: [
      "Il est plus rapide à calculer",
      "Il garantit que chaque fold a la même proportion de classes que le jeu complet",
      "Il empêche la fuite de données",
      "Il gère automatiquement les valeurs manquantes",
    ],
    optionsAr: [
      "حسابه أسرع",
      "يضمن أن كل مجموعة تحتوي على نفس نسبة الفئات كالبيانات الكاملة",
      "يمنع تسرب البيانات",
      "يتعامل مع القيم المفقودة تلقائياً",
    ],
    explanationFr:
      "Avec un déséquilibre 95/5, un fold classique pourrait n'avoir aucun échantillon de la classe minoritaire, rendant l'évaluation peu fiable. La stratification préserve le ratio dans chaque fold.",
    explanationAr:
      "مع اختلال 95/5، قد لا يحتوي fold العادي على أي عينة من الفئة الأقلية، مما يجعل التقييم غير موثوق. التوازن يحفظ النسبة في كل مجموعة.",
  },

  // ── decision-tree-rf ──────────────────────────────────────────────────────

  "decision-tree-rf|0": {
    questionFr: "Que mesure l'impureté de Gini dans un nœud d'arbre de décision ?",
    questionAr: "ما الذي تقيسه شائبة Gini في عقدة شجرة القرار؟",
    optionsFr: [
      "La profondeur de l'arbre à ce nœud",
      "La probabilité de mal étiqueter un élément choisi aléatoirement selon sa distribution de classes",
      "Le gain d'information de la division",
      "Le nombre d'échantillons dans le nœud",
    ],
    optionsAr: [
      "عمق الشجرة عند تلك العقدة",
      "احتمال تصنيف عنصر عشوائي خطأً وفق توزيع فئاته",
      "مكسب المعلومات من التقسيم",
      "عدد العينات في العقدة",
    ],
    explanationFr:
      "Gini = 1 - Σpᵢ². Un nœud pur (toute une classe) a Gini=0. Les arbres divisent pour minimiser le Gini pondéré des nœuds enfants.",
    explanationAr:
      "Gini = 1 - Σpᵢ². العقدة النقية (كلها فئة واحدة) لها Gini=0. تنقسم الأشجار لتصغير Gini المرجّح لعقد الأبناء.",
  },

  "decision-tree-rf|1": {
    questionFr:
      "Comment la Forêt Aléatoire réduit-elle la variance par rapport à un seul arbre de décision ?",
    questionAr: "كيف تُقلّل الغابة العشوائية من التباين مقارنةً بشجرة قرار واحدة؟",
    optionsFr: [
      "En utilisant des arbres plus profonds",
      "En faisant la moyenne de nombreux arbres entraînés sur des échantillons bootstrap avec des sous-ensembles de variables aléatoires",
      "En élagage plus agressif des arbres",
      "En utilisant Gini plutôt qu'entropie",
    ],
    optionsAr: [
      "باستخدام أشجار أعمق",
      "بالتوسط على أشجار عديدة مدرّبة على عينات bootstrap مع مجموعات فرعية عشوائية من الميزات",
      "بتقليم الأشجار بشكل أكثر عدوانية",
      "باستخدام Gini بدلاً من الإنتروبيا",
    ],
    explanationFr:
      "Chaque arbre est à forte variance (sur-apprend son échantillon bootstrap). La moyenne décorrèle leurs erreurs et la variance de l'ensemble diminue d'un facteur ~1/n_trees.",
    explanationAr:
      "كل شجرة ذات تباين عالٍ (تُفرط في التخصيص على عينتها bootstrap). التوسيط يُلغي الارتباط بين أخطائها وتنخفض تباين المجموعة بعامل ~1/n_trees.",
  },

  "decision-tree-rf|2": {
    questionFr:
      "Qu'est-ce que le score Out-of-Bag (OOB) dans la Forêt Aléatoire ?",
    questionAr: "ما هو مقياس Out-of-Bag (OOB) في الغابة العشوائية؟",
    optionsFr: [
      "La précision sur le jeu d'entraînement",
      "La précision estimée à partir des échantillons exclus du bootstrap de chaque arbre",
      "Le score de profondeur de l'arbre",
      "Le score d'importance des variables",
    ],
    optionsAr: [
      "الدقة على مجموعة التدريب",
      "الدقة المقدّرة باستخدام العينات المستبعدة من bootstrap كل شجرة",
      "مقياس عمق الشجرة",
      "مقياس أهمية الميزات",
    ],
    explanationFr:
      "Chaque échantillon bootstrap exclut ~37 % des données. Ces échantillons exclus peuvent valider l'arbre correspondant, donnant une estimation de validation croisée gratuite.",
    explanationAr:
      "كل عينة bootstrap تستبعد ~37% من البيانات. يمكن لتلك العينات المستبعدة التحقق من الشجرة المقابلة، مما يُعطي تقديراً مجانياً للتحقق المتبادل.",
  },

  // ── gradient-boosting ──────────────────────────────────────────────────────

  "gradient-boosting|0": {
    questionFr:
      "Que modélise chaque nouvel arbre dans le gradient boosting ?",
    questionAr: "ماذا يُنمذج كل شجرة جديدة في gradient boosting؟",
    optionsFr: [
      "La cible originale y",
      "Le gradient négatif de la perte (pseudo-résidus des prédictions précédentes)",
      "Un sous-ensemble aléatoire de variables",
      "Les erreurs quadratiques de l'arbre précédent",
    ],
    optionsAr: [
      "الهدف الأصلي y",
      "التدرج السالب للخسارة (بقايا زائفة من التنبؤات السابقة)",
      "مجموعة فرعية عشوائية من الميزات",
      "مربعات أخطاء الشجرة السابقة",
    ],
    explanationFr:
      "Chaque arbre s'ajuste à la direction du gradient qui réduit le plus la perte. Pour MSE, cela équivaut aux résidus yᵢ - ŷᵢ, mais pour d'autres pertes c'est le gradient négatif.",
    explanationAr:
      "تتناسب كل شجرة مع اتجاه التدرج الذي يُقلّل الخسارة أكثر. بالنسبة لـ MSE يساوي هذا البقايا yᵢ - ŷᵢ، لكن لخسائر أخرى هو التدرج السالب.",
  },

  "gradient-boosting|1": {
    questionFr:
      "Quelle est l'innovation algorithmique clé de XGBoost par rapport au GBM classique ?",
    questionAr: "ما الابتكار الخوارزمي الرئيسي لـ XGBoost مقارنةً بـ GBM الكلاسيكي؟",
    optionsFr: [
      "Il utilise des arbres plus profonds",
      "Il ajoute une régularisation L1/L2 dans l'objectif de score et utilise le développement de Taylor du second ordre",
      "Il entraîne les arbres en parallèle sur toutes les données",
      "Il utilise des sous-ensembles de variables aléatoires comme la Forêt Aléatoire",
    ],
    optionsAr: [
      "يستخدم أشجاراً أعمق",
      "يُضيف تنظيم L1/L2 في هدف تسجيل الأشجار ويستخدم تمديد تايلور من الدرجة الثانية",
      "يُدرّب الأشجار بالتوازي على كامل البيانات",
      "يستخدم مجموعات فرعية عشوائية من الميزات كالغابة العشوائية",
    ],
    explanationFr:
      "Le score d'arbre de XGBoost = (Σgᵢ)²/(Σhᵢ + λ) - γT, où g et h sont les dérivées première et seconde. Le terme de régularisation λ réduit les poids des feuilles, empêchant le surapprentissage.",
    explanationAr:
      "درجة شجرة XGBoost = (Σgᵢ)²/(Σhᵢ + λ) - γT، حيث g وh هما المشتقان الأول والثاني. يُقلّص معامل التنظيم λ أوزان الأوراق، مانعاً الإفراط في التخصيص.",
  },

  "gradient-boosting|2": {
    questionFr:
      "Quel avantage la croissance feuille par feuille de LightGBM a-t-elle sur la croissance niveau par niveau ?",
    questionAr: "ما ميزة النمو ورقة بورقة في LightGBM على النمو مستوى بمستوى؟",
    optionsFr: [
      "Les arbres feuille par feuille sont toujours moins profonds",
      "La croissance feuille par feuille développe la feuille ayant la réduction de perte maximale — convergence plus rapide avec moins de feuilles, mais sujette au surapprentissage sur de petits jeux",
      "La croissance feuille par feuille évite la gestion des valeurs manquantes",
      "La croissance feuille par feuille est plus interprétable",
    ],
    optionsAr: [
      "أشجار ورقة بورقة دائماً أقل عمقاً",
      "ينمو أفضل ورقة عالمياً — تقارب أسرع بأوراق أقل، لكنه عرضة للإفراط على البيانات الصغيرة",
      "يتجنب التعامل مع القيم المفقودة",
      "أكثر قابلية للتفسير",
    ],
    explanationFr:
      "La croissance niveau par niveau développe toutes les feuilles d'un niveau avant d'approfondir. La feuille par feuille choisit la meilleure feuille globalement, obtenant plus de réduction de perte par feuille — mais nécessite un réglage de num_leaves et min_child_samples.",
    explanationAr:
      "يوسّع النمو مستوى بمستوى كل الأوراق في مستوى قبل التعمق. أما ورقة بورقة فيختار أفضل ورقة عالمياً، محققاً تقليلاً أكبر للخسارة لكل ورقة — لكنه يحتاج ضبط num_leaves وmin_child_samples.",
  },

  // ── svm-knn-svr ───────────────────────────────────────────────────────────

  "svm-knn-svr|0": {
    questionFr: "Quel est le rôle des vecteurs de support dans SVM ?",
    questionAr: "ما دور متجهات الدعم في SVM؟",
    optionsFr: [
      "Tous les points d'entraînement correctement classifiés",
      "Les points d'entraînement les plus proches de la frontière de décision qui définissent la marge maximale",
      "Les points ayant les valeurs de variables les plus élevées",
      "Des points d'ancrage aléatoires pour le noyau",
    ],
    optionsAr: [
      "جميع نقاط التدريب المصنّفة بشكل صحيح",
      "نقاط التدريب الأقرب إلى حد القرار والتي تُحدّد الهامش الأقصى",
      "النقاط ذات أعلى قيم ميزات",
      "نقاط ارتكاز عشوائية للنواة",
    ],
    explanationFr:
      "Les vecteurs de support sont les points frontières critiques — la largeur de marge est 2/‖w‖ et est entièrement déterminée par ces points. Supprimer les autres points d'entraînement ne changerait pas l'hyperplan.",
    explanationAr:
      "متجهات الدعم هي النقاط الحدية الحاسمة — عرض الهامش هو 2/‖w‖ ويُحدَّد كلياً بهذه النقاط. حذف بقية نقاط التدريب لن يُغيّر المستوى الفاصل.",
  },

  "svm-knn-svr|1": {
    questionFr: "Quel problème le noyau RBF résout-il dans SVM ?",
    questionAr: "ما المشكلة التي يحلها نواة RBF في SVM؟",
    optionsFr: [
      "Il accélère l'entraînement sur de grands jeux de données",
      "Il mappe implicitement les entrées vers un espace de dimension infinie, permettant des frontières non linéaires dans l'espace original",
      "Il gère les valeurs manquantes",
      "Il normalise automatiquement les variables",
    ],
    optionsAr: [
      "يُسرّع التدريب على البيانات الضخمة",
      "يُعيّن المدخلات ضمنياً إلى فضاء لا نهائي الأبعاد، مما يتيح حدوداً غير خطية في الفضاء الأصلي",
      "يتعامل مع القيم المفقودة",
      "يُطبّع الميزات تلقائياً",
    ],
    explanationFr:
      "L'astuce du noyau calcule K(xᵢ,xⱼ) = φ(xᵢ)·φ(xⱼ) sans calculer explicitement φ. RBF crée des cartes de variables de dimension infinie, permettant une classification non linéaire.",
    explanationAr:
      "تحسب خدعة النواة K(xᵢ,xⱼ) = φ(xᵢ)·φ(xⱼ) دون حساب φ صراحةً. تُنشئ RBF خرائط ميزات لا نهائية الأبعاد، مما يُتيح التصنيف غير الخطي.",
  },

  "svm-knn-svr|2": {
    questionFr:
      "Quel est l'effet principal de la malédiction de la dimensionnalité sur KNN ?",
    questionAr: "ما التأثير الرئيسي للعن الأبعاد على KNN؟",
    optionsFr: [
      "KNN devient plus lent avec plus de variables uniquement",
      "En grande dimension toutes les distances deviennent approximativement égales, rendant les « plus proches voisins » sans signification",
      "KNN nécessite plus de mémoire en grande dimension",
      "KNN produit des étiquettes de classes incorrectes",
    ],
    optionsAr: [
      "يُصبح KNN أبطأ فقط مع المزيد من الميزات",
      "في الأبعاد العالية تُصبح جميع المسافات متقاربة تقريباً، مما يُفقد معنى «أقرب الجيران»",
      "يحتاج KNN ذاكرة أكبر في الأبعاد العالية",
      "يُخرج KNN تسميات فئة خاطئة",
    ],
    explanationFr:
      "À mesure que les dimensions augmentent, le volume de l'espace explose. Les points se regroupent près de la surface de l'hypersphère et les distances par paires convergent vers la même valeur, brisant l'hypothèse basée sur la distance.",
    explanationAr:
      "مع تزايد الأبعاد ينفجر حجم الفضاء. تتجمع النقاط بالقرب من سطح الكرة الفائقة وتتقارب المسافات الزوجية نحو نفس القيمة، مما يُعطل الافتراض القائم على المسافة.",
  },

};

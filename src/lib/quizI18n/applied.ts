import type { QuizI18n } from './types';

export const T_applied: Record<string, QuizI18n> = {

  // ── feature-engineering ───────────────────────────────────────────────────

  "feature-engineering|0": {
    questionFr: "Qu'est-ce que la fuite de données dans un pipeline de prétraitement ?",
    questionAr: "ما المقصود بتسرب البيانات في خط أنابيب المعالجة المسبقة؟",
    optionsFr: [
      "Utiliser trop de variables",
      "Utiliser des informations du jeu de test/validation pendant l'entraînement (ex. ajuster un StandardScaler sur toutes les données)",
      "Normaliser les variables avant l'entraînement",
      "Supprimer les variables corrélées",
    ],
    optionsAr: [
      "استخدام عدد كبير جداً من الميزات",
      "استخدام معلومات من مجموعة الاختبار/التحقق أثناء التدريب (مثلاً تهيئة المقياس على كامل البيانات)",
      "تطبيع الميزات قبل التدريب",
      "حذف الميزات المترابطة",
    ],
    explanationFr:
      "Ajuster un StandardScaler sur l'ensemble des données avant la division permet aux statistiques du jeu de test d'influencer l'entraînement — gonflant les scores de validation. Ajustez toujours les transformateurs uniquement sur les données d'entraînement.",
    explanationAr:
      "تهيئة StandardScaler على كامل البيانات قبل التقسيم تتيح لإحصاءات الاختبار التأثير على التدريب — مما يرفع نتائج التحقق زوراً. هيّئ المحوّلات دائماً على بيانات التدريب فقط.",
  },

  "feature-engineering|1": {
    questionFr:
      "Pourquoi utiliser RobustScaler plutôt que StandardScaler pour des données avec des valeurs aberrantes ?",
    questionAr: "لماذا يُستخدم RobustScaler بدلاً من StandardScaler مع البيانات ذات القيم الشاذة؟",
    optionsFr: [
      "RobustScaler normalise sur [0,1]",
      "RobustScaler utilise la médiane et l'IQR, donc les valeurs aberrantes ne distordent pas la mise à l'échelle",
      "RobustScaler applique automatiquement une transformation logarithmique",
      "RobustScaler fonctionne uniquement pour les variables catégorielles",
    ],
    optionsAr: [
      "RobustScaler يُطبّع على [0,1]",
      "يستخدم RobustScaler الوسيط والنطاق الربيعي IQR، لذا لا تُشوّه القيم الشاذة التحجيم",
      "يُطبّق RobustScaler تحويل اللوغاريتم تلقائياً",
      "يعمل RobustScaler فقط مع الميزات الفئوية",
    ],
    explanationFr:
      "StandardScaler utilise la moyenne et l'écart-type, que les valeurs aberrantes amplifient. RobustScaler se centre sur la médiane et met à l'échelle par l'IQR, le rendant robuste aux valeurs extrêmes.",
    explanationAr:
      "يستخدم StandardScaler المتوسط والانحراف المعياري اللذين تُضخّمهما القيم الشاذة. أما RobustScaler فيتمحور حول الوسيط ويُقيس بالنطاق الربيعي، مما يجعله متيناً أمام القيم المتطرفة.",
  },

  "feature-engineering|2": {
    questionFr:
      "Que fait OneHotEncoder sur une variable catégorielle à 5 valeurs uniques ?",
    questionAr: "ماذا يفعل OneHotEncoder بميزة فئوية تحتوي على 5 قيم فريدة؟",
    optionsFr: [
      "L'encode comme un entier unique de 1 à 5",
      "Crée 5 colonnes binaires, une par catégorie",
      "Remplace les catégories par leur fréquence",
      "Mappe les catégories sur leur moyenne cible",
    ],
    optionsAr: [
      "يُشفّرها كعدد صحيح واحد من 1 إلى 5",
      "ينشئ 5 أعمدة ثنائية، عمود لكل فئة",
      "يستبدل الفئات بتكرارها",
      "يُعيّن الفئات على متوسطها المستهدف",
    ],
    explanationFr:
      "OHE crée k colonnes binaires pour k catégories. Cela évite d'imposer des relations ordinales mais peut causer le piège de la variable factice — utilisez drop='first' pour l'éviter.",
    explanationAr:
      "ينشئ OHE k أعمدة ثنائية لـ k فئة. يتجنب هذا فرض علاقات ترتيبية لكنه قد يسبب مشكلة المتغير الوهمي — استخدم drop='first' لتجنبها.",
  },

  // ── naive-bayes ────────────────────────────────────────────────────────────

  "naive-bayes|0": {
    questionFr: "Quelle est l'hypothèse « naïve » dans Naïve Bayes ?",
    questionAr: "ما الافتراض «الساذج» في Naïve Bayes؟",
    optionsFr: [
      "Toutes les classes sont équiprobables",
      "Les variables sont conditionnellement indépendantes étant donné la classe",
      "L'a priori est toujours uniforme",
      "Le modèle est linéaire",
    ],
    optionsAr: [
      "جميع الفئات متساوية الاحتمال",
      "الميزات مستقلة شرطياً بافتراض الفئة",
      "التوزيع السابق دائماً منتظم",
      "النموذج خطي",
    ],
    explanationFr:
      "P(x₁,x₂,...|y) = ΠP(xᵢ|y). Bien que souvent fausse en pratique, cette hypothèse simplifie massivement le calcul et fonctionne étonnamment bien pour le texte.",
    explanationAr:
      "P(x₁,x₂,...|y) = ΠP(xᵢ|y). رغم أنها غالباً خاطئة عملياً، إلا أن هذا الافتراض يُبسّط الحساب تبسيطاً هائلاً ويعمل بشكل جيد مدهش للنصوص.",
  },

  "naive-bayes|1": {
    questionFr: "Quel problème résout le lissage de Laplace ?",
    questionAr: "ما المشكلة التي يحلها تنعيم Laplace؟",
    optionsFr: [
      "Le surapprentissage quand il y a beaucoup de variables",
      "La probabilité nulle pour des mots non vus dans le vocabulaire d'entraînement",
      "Un entraînement lent sur de grands jeux de données",
      "La gestion des variables continues",
    ],
    optionsAr: [
      "الإفراط في التخصيص عند وجود ميزات كثيرة",
      "احتمالية الصفر للكلمات غير الموجودة في مفردات التدريب",
      "بطء التدريب على البيانات الضخمة",
      "التعامل مع الميزات المستمرة",
    ],
    explanationFr:
      "Sans lissage, un mot absent de la classe c donne P(mot|c)=0, annulant tout le produit. Ajouter α=1 (Laplace) garantit qu'aucun terme n'est exactement nul.",
    explanationAr:
      "بدون تنعيم، كلمة غير موجودة في الفئة c تعطي P(كلمة|c)=0، مما يُلغي حاصل الضرب كله. إضافة α=1 (Laplace) يضمن عدم كون أي حد صفراً.",
  },

  "naive-bayes|2": {
    questionFr:
      "Quelle variante de Naïve Bayes est la mieux adaptée aux comptages bruts de mots pour la classification de texte ?",
    questionAr: "أي نوع من Naïve Bayes يناسب أعداد الكلمات الخام في تصنيف النصوص؟",
    optionsFr: ["GaussianNB", "MultinomialNB", "BernoulliNB", "ComplementNB"],
    optionsAr: ["GaussianNB", "MultinomialNB", "BernoulliNB", "ComplementNB"],
    explanationFr:
      "MultinomialNB modélise les distributions de comptage de mots (fréquences de termes). BernoulliNB utilise la présence/absence binaire. GaussianNB est pour les variables continues.",
    explanationAr:
      "يُنمذج MultinomialNB توزيعات عدد الكلمات (تكرارات المصطلحات). يستخدم BernoulliNB الوجود/الغياب الثنائي. أما GaussianNB فهو للميزات المستمرة.",
  },

  // ── hyperparameter-tuning ──────────────────────────────────────────────────

  "hyperparameter-tuning|0": {
    questionFr:
      "Pourquoi la recherche aléatoire est-elle souvent plus efficace que la recherche par grille ?",
    questionAr: "لماذا تكون البحث العشوائي في الغالب أكثر كفاءة من البحث الشبكي؟",
    optionsFr: [
      "La recherche aléatoire évalue toujours moins de combinaisons",
      "Tous les hyperparamètres ne sont pas également importants — l'échantillonnage aléatoire explore plus de dimensions cruciales par évaluation",
      "La recherche aléatoire trouve l'optimum global",
      "La recherche par grille ne peut pas gérer les paramètres continus",
    ],
    optionsAr: [
      "البحث العشوائي دائماً يُقيّم تركيبات أقل",
      "ليست كل المعاملات الفائقة متساوية الأهمية — العينة العشوائية تستكشف أبعاداً مهمة أكثر لكل تقييم",
      "البحث العشوائي يجد الحل الأمثل العالمي",
      "البحث الشبكي لا يتعامل مع المعاملات المستمرة",
    ],
    explanationFr:
      "Bergstra & Bengio ont montré que si seuls quelques hyperparamètres comptent vraiment, la recherche aléatoire évalue une plage plus large de ces dimensions critiques par budget.",
    explanationAr:
      "أثبت Bergstra و Bengio أنه إذا كان عدد قليل فقط من المعاملات الفائقة مهماً، فإن البحث العشوائي يستكشف نطاقاً أوسع من تلك الأبعاد الحاسمة لكل ميزانية.",
  },

  "hyperparameter-tuning|1": {
    questionFr:
      "Qu'est-ce qui rend l'optimisation bayésienne plus intelligente que la recherche aléatoire ?",
    questionAr: "ما الذي يجعل التحسين البايزي أذكى من البحث العشوائي؟",
    optionsFr: [
      "Elle utilise plus de calcul par essai",
      "Elle construit un modèle substitut de l'objectif et utilise une fonction d'acquisition pour sélectionner le point le plus prometteur suivant",
      "Elle cherche sur une grille plus fine",
      "Elle évalue toutes les combinaisons en parallèle",
    ],
    optionsAr: [
      "تستخدم حسابات أكثر لكل تجربة",
      "تبني نموذجاً بديلاً للهدف وتستخدم دالة اكتساب لاختيار النقطة الواعدة التالية",
      "تبحث على شبكة أدق",
      "تُقيّم جميع التركيبات بالتوازي",
    ],
    explanationFr:
      "L'optimisation bayésienne (TPE/GP) apprend des essais passés : le substitut prédit les régions probablement bonnes, et la fonction d'acquisition équilibre exploration et exploitation.",
    explanationAr:
      "يتعلم التحسين البايزي (TPE/GP) من التجارب السابقة: يتنبأ النموذج البديل بالمناطق الواعدة، وتوازن دالة الاكتساب بين الاستكشاف والاستغلال.",
  },

  "hyperparameter-tuning|2": {
    questionFr:
      "Qu'est-ce que le surapprentissage sur le jeu de validation lors du réglage des hyperparamètres ?",
    questionAr: "ما المقصود بالإفراط في التخصيص على مجموعة التحقق أثناء ضبط المعاملات الفائقة؟",
    optionsFr: [
      "Quand la perte d'entraînement est bien inférieure à la perte de validation",
      "Quand les hyperparamètres choisis performent bien sur le jeu de validation utilisé pour le réglage mais mal sur un jeu de test séparé",
      "Quand le modèle utilise trop d'hyperparamètres",
      "Quand la recherche par grille est utilisée à la place de la recherche aléatoire",
    ],
    optionsAr: [
      "عندما تكون خسارة التدريب أقل بكثير من خسارة التحقق",
      "عندما تؤدي المعاملات الفائقة المختارة أداءً جيداً على مجموعة التحقق المستخدمة للضبط لكن بشكل سيئ على مجموعة اختبار منفصلة",
      "عندما يستخدم النموذج معاملات فائقة كثيرة جداً",
      "عندما يُستخدم البحث الشبكي بدل البحث العشوائي",
    ],
    explanationFr:
      "Chercher sur suffisamment de combinaisons trouvera éventuellement une qui réussit sur votre jeu de validation. Utilisez un jeu de test séparé (jamais utilisé pour le réglage) pour estimer la vraie généralisation.",
    explanationAr:
      "البحث في تركيبات كافية سيجد في نهاية المطاف مجموعة تحظى بحظ جيد على مجموعة التحقق. استخدم مجموعة اختبار منفصلة (لم تُستخدم قط للضبط) لتقدير التعميم الحقيقي.",
  },

  // ── time-series ────────────────────────────────────────────────────────────

  "time-series|0": {
    questionFr:
      "Pourquoi la K-Fold classique est-elle incorrecte pour les séries temporelles ?",
    questionAr: "لماذا يكون K-Fold التقليدي غير صحيح للسلاسل الزمنية؟",
    optionsFr: [
      "Il est trop lent pour les grandes séries temporelles",
      "Il permet aux données futures de s'introduire dans les folds d'entraînement, rendant les scores de validation trop optimistes",
      "Il ne gère pas la saisonnalité",
      "Il nécessite que les données soient stationnaires",
    ],
    optionsAr: [
      "بطيء جداً للسلاسل الزمنية الكبيرة",
      "يسمح لبيانات المستقبل بالتسرب إلى مجموعات التدريب، مما يجعل نتائج التحقق متفائلة بشكل مفرط",
      "لا يتعامل مع الموسمية",
      "يتطلب أن تكون البيانات ثابتة",
    ],
    explanationFr:
      "K-Fold mélange les lignes — un modèle pourrait s'entraîner sur t=100 et valider sur t=50, laissant fuir des informations futures. TimeSeriesSplit s'assure que chaque fenêtre d'entraînement précède sa fenêtre de validation.",
    explanationAr:
      "يخلط K-Fold الصفوف — قد يتدرب نموذج على t=100 ويتحقق على t=50، مُسرِّباً معلومات المستقبل. يضمن TimeSeriesSplit أن كل نافذة تدريب تسبق نافذة التحقق.",
  },

  "time-series|1": {
    questionFr:
      "Qu'est-ce qu'une variable de décalage (lag feature) dans la prévision de séries temporelles ?",
    questionAr: "ما ميزة الإزاحة (lag feature) في التنبؤ بالسلاسل الزمنية؟",
    optionsFr: [
      "Une variable capturant la composante tendancielle",
      "La valeur de la cible à un pas de temps précédent, utilisée comme prédicteur pour le pas actuel",
      "Une variable de Fourier encodant la saisonnalité",
      "La moyenne mobile de la cible",
    ],
    optionsAr: [
      "ميزة تلتقط مكوّن الاتجاه",
      "قيمة الهدف في خطوة زمنية سابقة، تُستخدم كمتنبئ للخطوة الحالية",
      "ميزة فورييه لترميز الموسمية",
      "المتوسط المتحرك للهدف",
    ],
    explanationFr:
      "Le lag-1 de y est yₜ₋₁. Les variables de décalage encodent l'autocorrélation — si les ventes d'hier prédisent celles d'aujourd'hui, ajouter lag(1) comme variable permet au modèle ML de capturer cette structure.",
    explanationAr:
      "lag-1 لـ y هو yₜ₋₁. ميزات الإزاحة تُرمّز الارتباط الذاتي — إذا كانت مبيعات الأمس تتنبأ باليوم، فإن إضافة lag(1) كميزة يتيح للنموذج التقاط هذه البنية.",
  },

  "time-series|2": {
    questionFr: "En quoi décompose STL une série temporelle ?",
    questionAr: "فيم يُحلّل STL السلسلة الزمنية؟",
    optionsFr: [
      "Signal et bruit",
      "Composantes de tendance, de saisonnalité et de résidu",
      "Parties stationnaire et non stationnaire",
      "Motifs à court et long terme",
    ],
    optionsAr: [
      "إشارة وضوضاء",
      "مكوّنات الاتجاه والموسمية والبقايا",
      "أجزاء ثابتة وغير ثابتة",
      "أنماط قصيرة وطويلة المدى",
    ],
    explanationFr:
      "STL = décomposition Saison-Tendance par LOESS. Yₜ = Tₜ (tendance) + Sₜ (saisonnalité) + Rₜ (résidu). Désaisonnaliser ou détendre avant la modélisation peut améliorer la précision.",
    explanationAr:
      "STL = تحليل الموسم-الاتجاه باستخدام LOESS. Yₜ = Tₜ (اتجاه) + Sₜ (موسمية) + Rₜ (بقايا). إزالة الموسمية أو الاتجاه قبل النمذجة يمكن أن يُحسّن الدقة.",
  },

  // ── nlp-text ───────────────────────────────────────────────────────────────

  "nlp-text|0": {
    questionFr: "Que représente le score TF-IDF ?",
    questionAr: "ماذا يمثل مقياس TF-IDF؟",
    optionsFr: [
      "La fréquence d'apparition d'un mot dans tous les documents",
      "La fréquence du mot dans un document, pondérée par sa rareté dans le corpus",
      "La dimension de l'embedding de phrase",
      "Le nombre de documents contenant le mot",
    ],
    optionsAr: [
      "معدل ظهور الكلمة في جميع المستندات",
      "تكرار الكلمة في المستند مرجّحاً بمدى ندرتها عبر المجموعة",
      "بُعد تضمين الجملة",
      "عدد المستندات التي تحتوي على الكلمة",
    ],
    explanationFr:
      "TF-IDF = TF × log(N/df). Les mots fréquents dans un document obtiennent un score élevé (TF), mais les mots communs à tous les documents (comme « le ») sont pénalisés (IDF), mettant en valeur les termes distinctifs.",
    explanationAr:
      "TF-IDF = TF × log(N/df). الكلمات المتكررة داخل المستند تحصل على TF عالٍ، لكن الكلمات الشائعة في جميع المستندات (كـ«و») تُخفَّض بـ IDF، مما يُبرز المصطلحات المميّزة.",
  },

  "nlp-text|1": {
    questionFr:
      "Quelle est la principale limitation des représentations Bag-of-Words (BoW) ?",
    questionAr: "ما القيد الرئيسي لتمثيلات Bag-of-Words (BoW)؟",
    optionsFr: [
      "Elles ne peuvent pas gérer de grands vocabulaires",
      "Elles perdent l'ordre des mots et ignorent la similarité sémantique entre les mots",
      "Elles nécessitent des embeddings pré-entraînés",
      "Elles sont trop lentes pour la classification en temps réel",
    ],
    optionsAr: [
      "لا تتعامل مع المفردات الكبيرة",
      "تفقد ترتيب الكلمات وتتجاهل التشابه الدلالي بينها",
      "تتطلب تضمينات مدرّبة مسبقاً",
      "بطيئة جداً للتصنيف الفوري",
    ],
    explanationFr:
      "« Le chien mord l'homme » et « L'homme mord le chien » ont des vecteurs BoW identiques. Word2Vec/embeddings addressent cela en capturant le sens sémantique, et les transformers capturent le contexte complet.",
    explanationAr:
      "«كلب يعض إنساناً» و«إنسان يعض كلباً» لهما متجهات BoW متطابقة. يعالج Word2Vec/التضمينات هذا بالتقاط المعنى الدلالي، وتلتقط المحوّلات السياق الكامل.",
  },

  "nlp-text|2": {
    questionFr:
      "Pourquoi les sentence-transformers surpassent-ils TF-IDF pour la recherche sémantique ?",
    questionAr: "لماذا يتفوق sentence-transformers على TF-IDF في البحث الدلالي؟",
    optionsFr: [
      "Ils produisent des vecteurs plus courts",
      "Ils encodent le sens sémantique — « voiture » et « automobile » sont proches dans l'espace d'embedding, alors que TF-IDF les traite comme complètement différents",
      "Ils sont plus rapides à calculer",
      "Ils évitent la suppression des mots vides",
    ],
    optionsAr: [
      "تُنتج متجهات أقصر",
      "تُرمّز المعنى الدلالي — «سيارة» و«عربة» قريبتان في فضاء التضمين بينما يعدّهما TF-IDF مختلفتين كلياً",
      "أسرع في الحساب",
      "تتجنب حذف كلمات الوقف",
    ],
    explanationFr:
      "TF-IDF est lexical : les requêtes doivent partager des tokens exacts avec les documents. Les embeddings de phrases sont sémantiques : une requête sur l'« achat de véhicule » peut correspondre à un document sur l'« achat de voiture ».",
    explanationAr:
      "TF-IDF معجمي: يجب على الاستعلامات مشاركة رموز دقيقة مع المستندات. تضمينات الجمل دلالية: استعلام عن «شراء مركبة» يمكنه مطابقة مستند عن «اقتناء سيارة».",
  },

};

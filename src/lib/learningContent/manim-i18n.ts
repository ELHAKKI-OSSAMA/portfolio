// French and Arabic translations for Manim video titles and descriptions.
// Key = video id from manim-videos.ts

export interface ManimVideoI18n {
  titleFr: string;
  descriptionFr: string;
  titleAr: string;
  descriptionAr: string;
}

export const manimI18n: Record<string, ManimVideoI18n> = {

  // ── Linear Regression ────────────────────────────────────────────────────────
  "lr-v1": {
    titleFr: "Qu'est-ce que la Régression Linéaire ?",
    descriptionFr: "Introduction guidée : nuage de points, mauvaises droites vs meilleure droite, prédiction en direct.",
    titleAr: "ما هو الانحدار الخطي؟",
    descriptionAr: "مقدمة هندسية: مخطط انتشار، خطوط سيئة مقابل خط أفضل ملاءمة، تنبؤ مباشر.",
  },
  "lr-v2": {
    titleFr: "L'Équation : ŷ = wx + b",
    descriptionFr: "Curseurs animés de pente et d'ordonnée à l'origine : comment chaque paramètre forme la droite.",
    titleAr: "المعادلة: ŷ = wx + b",
    descriptionAr: "شرائح منحدر ومقطع متحركة: كيف يشكّل كل معامل الخط.",
  },
  "lr-v3": {
    titleFr: "La Fonction de Coût & l'EQM",
    descriptionFr: "Résidus → erreurs au carré → formule EQM → courbe de coût parabolique avec suivi en direct.",
    titleAr: "دالة التكلفة ومتوسط مربع الخطأ",
    descriptionAr: "البواقي ← أخطاء مربعة ← صيغة MSE ← منحنى تكلفة قطعي مع تتبع مباشر.",
  },
  "lr-v4": {
    titleFr: "La Descente de Gradient : Comment les Machines Apprennent",
    descriptionFr: "Tangentes animées, règle de mise à jour, comparaison des taux d'apprentissage et trace de convergence.",
    titleAr: "الانحدار التدريجي: كيف تتعلم الآلات",
    descriptionAr: "مماسات متحركة، قاعدة التحديث، مقارنة معدلات التعلم وتتبع التقارب.",
  },
  "lr-v5": {
    titleFr: "R², RECM & Graphique des Résidus",
    descriptionFr: "Preuve visuelle de R² par SS_tot vs SS_res, RECM/EAM côte à côte, diagnostic des résidus.",
    titleAr: "R² ومتوسط الخطأ الجذري ومخطط البواقي",
    descriptionAr: "إثبات بصري لـ R² عبر SS_tot مقابل SS_res، RMSE/MAE جنباً إلى جنب، تشخيص البواقي.",
  },
  "lr-v6a": {
    titleFr: "Variables Multiples : De la Droite au Plan",
    descriptionFr: "Transition de l'équation : droite à 1 variable → plan à 2 variables → hyperplan à p variables.",
    titleAr: "المتغيرات المتعددة: من الخط إلى المستوى",
    descriptionAr: "انتقال المعادلة: خط متغير واحد ← مستوى متغيرين ← فائق المستوى p متغير.",
  },
  "lr-v6b": {
    titleFr: "Plan de Régression 3D (Caméra Orbitante)",
    descriptionFr: "Nuage 3D : heures d'étude+sommeil vs score ; caméra orbitante révélant le plan ajusté.",
    titleAr: "مستوى الانحدار ثلاثي الأبعاد (كاميرا مدارية)",
    descriptionAr: "مخطط انتشار ثلاثي الأبعاد: ساعات الدراسة+النوم مقابل الدرجة؛ كاميرا مدارية تكشف المستوى المناسب.",
  },
  "lr-v6c": {
    titleFr: "Matrice de Conception & Équations Normales",
    descriptionFr: "Matrice de conception X, solution MCO forme fermée, compromis descente de gradient vs équations normales.",
    titleAr: "مصفوفة التصميم والمعادلات الطبيعية",
    descriptionAr: "مصفوفة التصميم X، حل OLS مغلق الشكل، مقايضة الانحدار التدريجي مقابل المعادلات الطبيعية.",
  },

  // ── Decision Trees & Random Forest ──────────────────────────────────────────
  "dtrf-v1": {
    titleFr: "Qu'est-ce qu'un Arbre de Décision ?",
    descriptionFr: "L'analogie des 20 questions construit l'arbre nœud par nœud avec des divisions colorées.",
    titleAr: "ما هي شجرة القرار؟",
    descriptionAr: "تشبيه 20 سؤالاً يبني الشجرة عقدة بعقدة مع تقسيمات ملونة.",
  },
  "dtrf-v2": {
    titleFr: "Impureté de Gini & Gain d'Information",
    descriptionFr: "Camemberts animés montrant la chute de l'impureté de Gini à chaque division.",
    titleAr: "شائبة جيني وكسب المعلومات",
    descriptionAr: "مخططات دائرية متحركة تُظهر انخفاض شائبة جيني عند كل تقسيم.",
  },
  "dtrf-v3": {
    titleFr: "Surapprentissage & Élagage",
    descriptionFr: "L'arbre profond mémorise le bruit ; l'élagage supprime des branches jusqu'à améliorer la validation.",
    titleAr: "الإفراط في التخصيص والتقليم",
    descriptionAr: "الشجرة العميقة تحفظ الضوضاء؛ التقليم يزيل الفروع حتى يتحسن التحقق.",
  },
  "dtrf-v4": {
    titleFr: "Échantillonnage Bootstrap (Bagging)",
    descriptionFr: "Le rééchantillonnage bootstrap crée des ensembles d'entraînement diversifiés avant chaque arbre.",
    titleAr: "أخذ عينات التمهيد (التجميع)",
    descriptionAr: "إعادة أخذ العينات التمهيدية تُنشئ مجموعات تدريب متنوعة قبل كل شجرة.",
  },
  "dtrf-v5": {
    titleFr: "Forêt Aléatoire : La Sagesse de la Foule",
    descriptionFr: "100 arbres divers votent ; la majorité l'emporte — visualisé comme un ensemble démocratique.",
    titleAr: "الغابة العشوائية: حكمة الحشد",
    descriptionAr: "100 شجرة متنوعة تصوّت؛ الأغلبية تفوز — مُصوَّر كمجموعة ديمقراطية.",
  },
  "dtrf-v6": {
    titleFr: "Importance des Variables des Forêts Aléatoires",
    descriptionFr: "Diminution moyenne de l'impureté agrégée sur tous les arbres ; classement en graphique barre animé.",
    titleAr: "أهمية الميزات في الغابة العشوائية",
    descriptionAr: "متوسط انخفاض الشوائب المجمّع على جميع الأشجار؛ الترتيب كمخطط شريطي متحرك.",
  },

  // ── Python ML Stack ──────────────────────────────────────────────────────────
  "pms-v1": {
    titleFr: "Tableaux NumPy : Le Moteur du ML",
    descriptionFr: "Création de ndarray, règles de broadcasting, opérations vectorisées — pourquoi les boucles sont lentes.",
    titleAr: "مصفوفات NumPy: محرك تعلم الآلة",
    descriptionAr: "إنشاء ndarray، قواعد البث، العمليات المتجهة — لماذا الحلقات بطيئة.",
  },
  "pms-v2": {
    titleFr: "Pandas DataFrames pour le ML",
    descriptionFr: "Anatomie des Series et DataFrame, groupby, gestion des valeurs manquantes et division train/test.",
    titleAr: "إطارات بيانات Pandas لتعلم الآلة",
    descriptionAr: "تشريح السلسلة وإطار البيانات، groupby، التعامل مع القيم المفقودة وتقسيم التدريب/الاختبار.",
  },
  "pms-v3": {
    titleFr: "Visualisations Matplotlib & Seaborn",
    descriptionFr: "Recettes de nuage de points, histogramme, heatmap et pair-plot pour l'analyse exploratoire.",
    titleAr: "تصورات Matplotlib وSeaborn",
    descriptionAr: "وصفات مخطط الانتشار والرسم البياني وخريطة الحرارة ومخطط الأزواج للتحليل الاستكشافي.",
  },
  "pms-v4": {
    titleFr: "Pipeline scikit-learn : La Bonne Méthode",
    descriptionFr: "Transformeurs → Pipeline → GridSearchCV : éviter la fuite de données et optimiser le code de production.",
    titleAr: "خط أنابيب scikit-learn: الطريقة الصحيحة",
    descriptionAr: "المحولات ← خط الأنابيب ← GridSearchCV: تجنب تسرب البيانات ورمز إنتاج نظيف.",
  },
  "pms-v5": {
    titleFr: "Workflow EDA : Des Données Brutes à l'Insight",
    descriptionFr: "Forme → types → valeurs manquantes → distributions → corrélations — parcours EDA complet.",
    titleAr: "سير عمل EDA: من البيانات الخام إلى الرؤية",
    descriptionAr: "الشكل ← الأنواع ← المفقود ← التوزيعات ← الارتباطات — جولة EDA كاملة.",
  },

  // ── Linear Algebra ───────────────────────────────────────────────────────────
  "la-v1": {
    titleFr: "Vecteurs & Produit Scalaire",
    descriptionFr: "Intuition géométrique des vecteurs, magnitude, vecteurs unitaires, produit scalaire comme projection.",
    titleAr: "المتجهات وحاصل الضرب النقطي",
    descriptionAr: "الحدس الهندسي للمتجهات، المقدار، المتجهات الوحدوية، حاصل الضرب النقطي كإسقاط وتشابه جيب التمام.",
  },
  "la-v2": {
    titleFr: "La Multiplication Matricielle Expliquée",
    descriptionFr: "Règle Ligne×Colonne animée pas à pas ; la matrice comme transformation linéaire de l'espace.",
    titleAr: "ضرب المصفوفات موضح",
    descriptionAr: "قاعدة الصف×العمود المتحركة خطوة بخطوة؛ المصفوفة كتحويل خطي للفضاء.",
  },
  "la-v3": {
    titleFr: "Valeurs Propres & Vecteurs Propres",
    descriptionFr: "Av = λv : directions préservées sous transformation ; itération de puissance et équation caractéristique.",
    titleAr: "القيم الذاتية والمتجهات الذاتية",
    descriptionAr: "Av = λv: الاتجاهات المحفوظة تحت التحويل؛ تكرار القوة والمعادلة التميزية.",
  },
  "la-v4": {
    titleFr: "Décomposition en Valeurs Singulières (SVD)",
    descriptionFr: "Décomposition A = UΣVᵀ, valeurs singulières comme poids d'importance, approximation de rang faible.",
    titleAr: "تحليل القيمة المفردة (SVD)",
    descriptionAr: "تحليل A = UΣVᵀ، القيم المفردة كأوزان أهمية، تقريب الرتبة المنخفضة.",
  },
  "la-v5": {
    titleFr: "Déterminant & Intuition Géométrique",
    descriptionFr: "Le déterminant comme mise à l'échelle d'aire/volume signée ; det=0 signifie singulière (pas d'inverse).",
    titleAr: "المحدد والحدس الهندسي",
    descriptionAr: "المحدد كمقياس مساحة/حجم موقّع؛ det=0 يعني مفردة (لا معكوس).",
  },

  // ── Calculus & Optimization ──────────────────────────────────────────────────
  "co-v1": {
    titleFr: "Dérivées : Le Taux de Variation",
    descriptionFr: "Définition par limite de la tangente, règles de puissance et de chaîne, points critiques animés.",
    titleAr: "المشتقات: معدل التغيير",
    descriptionAr: "تعريف الحد للمماس، قواعد القدرة والسلسلة، النقاط الحرجة المتحركة.",
  },
  "co-v2": {
    titleFr: "Dérivées Partielles & Gradients",
    descriptionFr: "Fonctions multivariables, tranches partielles ∂f/∂x, vecteur gradient pointant vers le haut.",
    titleAr: "المشتقات الجزئية والتدرجات",
    descriptionAr: "الدوال متعددة المتغيرات، الشرائح الجزئية ∂f/∂x، متجه التدرج يشير للأعلى.",
  },
  "co-v3": {
    titleFr: "Règle de Chaîne & Rétropropagation",
    descriptionFr: "Dérivées de fonctions composées ; comment la règle de chaîne propage les gradients en arrière.",
    titleAr: "قاعدة السلسلة والانتشار الخلفي",
    descriptionAr: "مشتقات الدوال المركبة؛ كيف تنقل قاعدة السلسلة التدرجات للخلف.",
  },
  "co-v4": {
    titleFr: "Comparaison d'Optimiseurs : SGD, Momentum, Adam",
    descriptionFr: "Chemins de descente sur la surface de perte : GD vs momentum vs Adam sur des points-selles.",
    titleAr: "مقارنة المحسّنات: SGD والزخم وAdam",
    descriptionAr: "مسارات النزول على سطح الخسارة: GD مقابل الزخم مقابل Adam على نقاط السرج.",
  },
  "co-v5": {
    titleFr: "Planification du Taux d'Apprentissage",
    descriptionFr: "Décroissance par étapes, exponentielle, recuit cosinus et warmup — tracés sur l'entraînement.",
    titleAr: "جدولة معدل التعلم",
    descriptionAr: "الإضمحلال التدريجي، الأسي، التبريد التدريجي للجيب التمام والإحماء — مرسومة على التدريب.",
  },

  // ── Probability & Statistics ─────────────────────────────────────────────────
  "ps-v1": {
    titleFr: "Distributions de Probabilité : Normale, Binomiale, Poisson",
    descriptionFr: "FMP vs FDP, courbe en cloche, binomiale comme lancers de pièce, Poisson comme taux rare.",
    titleAr: "توزيعات الاحتمالية: الطبيعي والثنائي وبواسون",
    descriptionAr: "PMF مقابل PDF، منحنى الجرس، الثنائي كقلبات عملة، بواسون كمعدل حدث نادر.",
  },
  "ps-v2": {
    titleFr: "Théorème de Bayes",
    descriptionFr: "P(A|B) = P(B|A)P(A)/P(B) : exemple de test médical, prior/vraisemblance/posterior visualisés.",
    titleAr: "نظرية بايز",
    descriptionAr: "P(A|B) = P(B|A)P(A)/P(B): مثال اختبار طبي، المسبق/الإمكانية/اللاحق مُصوَّر.",
  },
  "ps-v3": {
    titleFr: "Estimation par Maximum de Vraisemblance",
    descriptionFr: "Fonction de vraisemblance animée sur paramètres normaux ; EMV comme recherche de pic ; astuce log-vraisemblance.",
    titleAr: "تقدير الاحتمالية القصوى",
    descriptionAr: "سطح الإمكانية المتحرك على المعاملات الطبيعية؛ MLE كبحث عن القمة؛ حيلة اللوغاريتم.",
  },
  "ps-v4": {
    titleFr: "Tests d'Hypothèse : p-valeurs & Tests",
    descriptionFr: "Hypothèse nulle, test z, test t, seuil p-valeur, erreurs Type I/II expliquées.",
    titleAr: "اختبار الفرضية: القيم p والاختبارات",
    descriptionAr: "الفرضية الصفرية، اختبار z، اختبار t، عتبة القيمة p، أخطاء النوع الأول/الثاني موضحة.",
  },
  "ps-v5": {
    titleFr: "Intervalles de Confiance",
    descriptionFr: "Construction d'IC bootstrap, pièges d'interprétation et relation aux tests d'hypothèse.",
    titleAr: "فترات الثقة",
    descriptionAr: "إنشاء CI التمهيدي، مزالق التفسير والعلاقة باختبارات الفرضية.",
  },

  // ── Information Theory ───────────────────────────────────────────────────────
  "it-v1": {
    titleFr: "Entropie de Shannon : Mesurer l'Incertitude",
    descriptionFr: "H(X) = −Σ p log p : pièce équitable vs biaisée, entropie maximale et impureté des nœuds.",
    titleAr: "إنتروبيا شانون: قياس عدم اليقين",
    descriptionAr: "H(X) = −Σ p log p: عملة عادلة مقابل متحيزة، الإنتروبيا القصوى وشوائب العقدة.",
  },
  "it-v2": {
    titleFr: "Perte d'Entropie Croisée Expliquée",
    descriptionFr: "L'entropie croisée comme coût d'utiliser la mauvaise distribution ; pourquoi c'est la perte standard.",
    titleAr: "خسارة الإنتروبيا المتقاطعة موضحة",
    descriptionAr: "الإنتروبيا المتقاطعة كتكلفة استخدام التوزيع الخاطئ؛ لماذا هي الخسارة القياسية.",
  },
  "it-v3": {
    titleFr: "Divergence KL : Mesurer la Distance entre Distributions",
    descriptionFr: "Asymétrie D_KL(P‖Q), KL direct vs inverse et son rôle dans les VAE et l'entonnoir d'information.",
    titleAr: "تباعد KL: قياس المسافة بين التوزيعات",
    descriptionAr: "عدم التماثل D_KL(P‖Q)، KL الأمامي مقابل العكسي ودوره في VAEs وعنق الزجاجة المعلوماتي.",
  },
  "it-v4": {
    titleFr: "Information Mutuelle & Sélection de Variables",
    descriptionFr: "I(X;Y) comme information partagée ; sélection par MI vs corrélation ; lien avec l'entropie.",
    titleAr: "المعلومات المتبادلة واختيار الميزات",
    descriptionAr: "I(X;Y) كمعلومات مشتركة؛ اختيار MI مقابل الارتباط؛ الصلة بالإنتروبيا.",
  },

  // ── Model Evaluation ─────────────────────────────────────────────────────────
  "me-v1": {
    titleFr: "Matrice de Confusion : Chaque Erreur Visualisée",
    descriptionFr: "Heatmap VP/VN/FP/FN, précision, rappel, F1-score dérivés étape par étape.",
    titleAr: "مصفوفة الارتباك: كل خطأ مُصوَّر",
    descriptionAr: "خريطة حرارة TP/TN/FP/FN، الدقة، الاستدعاء، F1-score مستنتجة خطوة بخطوة.",
  },
  "me-v2": {
    titleFr: "Courbe ROC & AUC",
    descriptionFr: "TPR vs FPR à seuils variables ; AUC comme probabilité de classement correct ; courbe PR comparée.",
    titleAr: "منحنى ROC وAUC",
    descriptionAr: "TPR مقابل FPR عند عتبات متفاوتة؛ AUC كاحتمالية التصنيف الصحيح؛ منحنى PR مقارن.",
  },
  "me-v3": {
    titleFr: "Stratégies de Validation Croisée",
    descriptionFr: "K-fold, stratifié, leave-one-out, division série temporelle — sélection de plis animée.",
    titleAr: "استراتيجيات التحقق المتقاطع",
    descriptionAr: "K-fold، الطبقي، اترك واحداً، تقسيم السلاسل الزمنية — اختيار الطية المتحرك.",
  },
  "me-v4": {
    titleFr: "Gestion des Classes Déséquilibrées",
    descriptionFr: "Suréchantillonnage SMOTE, sous-échantillonnage, ajustement des poids et précision équilibrée.",
    titleAr: "التعامل مع الفئات غير المتوازنة",
    descriptionAr: "الإفراط في أخذ العينات SMOTE، نقص أخذ العينات، ضبط وزن الفئة والدقة المتوازنة.",
  },
  "me-v5": {
    titleFr: "Calibration : Les Probabilités Ont-elles un Sens ?",
    descriptionFr: "Diagramme de fiabilité, score de Brier, mise à l'échelle de Platt et régression isotonique.",
    titleAr: "المعايرة: هل تنطق الاحتمالات بالمعنى؟",
    descriptionAr: "مخطط الموثوقية، درجة Brier، مقياس Platt والانحدار الإيزوتوني.",
  },

  // ── Error Analysis ───────────────────────────────────────────────────────────
  "ea-v1": {
    titleFr: "Compromis Biais–Variance",
    descriptionFr: "Diagrammes cible pour biais et variance ; sous/surapprentissage sur une courbe polynomiale.",
    titleAr: "مقايضة التحيز والتباين",
    descriptionAr: "مخططات هدف للتحيز والتباين؛ الإفراط/نقص التخصيص على منحنى متعدد الحدود.",
  },
  "ea-v2": {
    titleFr: "Courbes d'Apprentissage : Diagnostiquer les Problèmes",
    descriptionFr: "Erreur train vs validation vs taille du jeu de données : détecter biais élevé, variance élevée et optimal.",
    titleAr: "منحنيات التعلم: تشخيص المشاكل",
    descriptionAr: "خطأ التدريب مقابل التحقق مقابل حجم مجموعة البيانات: اكتشاف التحيز العالي والتباين العالي والأمثل.",
  },
  "ea-v3": {
    titleFr: "Régularisation : L1, L2 & Elastic Net",
    descriptionFr: "Géométrie de rétrécissement des poids : boule L2 vs losange L1 ; parcimonie de Lasso ; balance Elastic Net.",
    titleAr: "التنظيم: L1 وL2 والشبكة المرنة",
    descriptionAr: "هندسة تقليص الأوزان: كرة L2 مقابل معين L1؛ تفرق Lasso؛ توازن الشبكة المرنة.",
  },
  "ea-v4": {
    titleFr: "Stratégies de Validation : La Bonne Méthode",
    descriptionFr: "Division train/val/test, VC imbriquée, pièges de fuite de données et meilleures pratiques.",
    titleAr: "استراتيجيات التحقق: الطريقة الصحيحة",
    descriptionAr: "تقسيم التدريب/التحقق/الاختبار، CV المتداخل، مزالق تسرب البيانات وأفضل الممارسات.",
  },

  // ── Feature Engineering ──────────────────────────────────────────────────────
  "fe-v1": {
    titleFr: "Mise à l'Échelle : StandardScaler vs MinMaxScaler",
    descriptionFr: "Pourquoi normaliser ? StandardScaler z-score vs MinMaxScaler [0,1] ; effet sur GD et SVM.",
    titleAr: "التحجيم: StandardScaler مقابل MinMaxScaler",
    descriptionAr: "لماذا التطبيع؟ StandardScaler z-score مقابل MinMaxScaler [0,1]؛ التأثير على GD وSVM.",
  },
  "fe-v2": {
    titleFr: "Encodage des Variables Catégorielles",
    descriptionFr: "Encodage ordinal vs one-hot vs target encoding — quand utiliser chaque stratégie.",
    titleAr: "ترميز المتغيرات الفئوية",
    descriptionAr: "الترميز الترتيبي مقابل one-hot مقابل الترميز الهدفي — متى تستخدم كل استراتيجية.",
  },
  "fe-v3": {
    titleFr: "Imputation des Valeurs Manquantes",
    descriptionFr: "Moyenne/médiane/mode, imputation KNN, imputation itérative — patterns MCAR vs MAR vs MNAR.",
    titleAr: "إسناد القيم المفقودة",
    descriptionAr: "المتوسط/الوسيط/المنوال، إسناد KNN، الإسناد التكراري — أنماط MCAR مقابل MAR مقابل MNAR.",
  },
  "fe-v4": {
    titleFr: "Création de Variables : Interactions & Polynômes",
    descriptionFr: "Variables polynomiales, termes d'interaction, transformations log/racine, extraction de date-heure.",
    titleAr: "إنشاء الميزات: التفاعلات والمتعددات الحدية",
    descriptionAr: "الميزات متعددة الحدود، مصطلحات التفاعل، تحويلات اللوغاريتم/الجذر التربيعي، استخراج التاريخ والوقت.",
  },
  "fe-v5": {
    titleFr: "Conception de Pipeline & Éviter la Fuite de Données",
    descriptionFr: "Pourquoi les normalisateurs ne doivent être ajustés que sur train ; ColumnTransformer ; pipeline sans fuite.",
    titleAr: "تصميم خط الأنابيب وتجنب تسرب البيانات",
    descriptionAr: "لماذا يجب أن تناسب معالجات التحجيم التدريب فقط؛ ColumnTransformer؛ خط أنابيب بدون تسرب.",
  },

  // ── Naïve Bayes ──────────────────────────────────────────────────────────────
  "nb-v1": {
    titleFr: "Classifieur Naïf Bayésien Expliqué",
    descriptionFr: "Hypothèse d'indépendance conditionnelle, posterior = vraisemblance × prior / évidence.",
    titleAr: "مصنّف بايز الساذج موضح",
    descriptionAr: "افتراض الاستقلال المشروط، اللاحق = الإمكانية × المسبق / الدليل.",
  },
  "nb-v2": {
    titleFr: "Naïf Bayésien Gaussien",
    descriptionFr: "Variables continues modélisées comme des gaussiennes ; densité de probabilité conditionnelle visualisée.",
    titleAr: "بايز الساذج الغاوسي",
    descriptionAr: "الميزات المستمرة مُنمذَجة كتوزيعات غاوسية؛ كثافة الاحتمالية المشروطة مُصوَّرة.",
  },
  "nb-v3": {
    titleFr: "Lissage de Laplace : Gérer les Mots Inconnus",
    descriptionFr: "Problème de fréquence zéro en classification de texte ; formule de lissage additif et son effet.",
    titleAr: "تنعيم لابلاس: التعامل مع الكلمات غير المرئية",
    descriptionAr: "مشكلة التردد الصفري في تصنيف النص؛ صيغة التنعيم الجمعي وتأثيره.",
  },
  "nb-v4": {
    titleFr: "TF-IDF + Naïf Bayésien pour la Classification de Texte",
    descriptionFr: "NB multinomial avec poids TF-IDF : parcours filtre anti-spam avec table de vocabulaire.",
    titleAr: "TF-IDF + بايز الساذج لتصنيف النص",
    descriptionAr: "بايز ثنائي الحدود مع أوزان TF-IDF: جولة تصفية البريد المزعج مع جدول المفردات.",
  },

  // ── SVM, KNN & SVR ───────────────────────────────────────────────────────────
  "svm-v1a": {
    titleFr: "SVM : Hyperplan à Marge Maximale",
    descriptionFr: "Frontière de décision, marge, vecteurs de support — pourquoi maximiser la marge améliore la généralisation.",
    titleAr: "SVM: فائق المستوى ذو الهامش الأقصى",
    descriptionAr: "حد القرار، الهامش، متجهات الدعم — لماذا تعظيم الهامش يحسّن التعميم.",
  },
  "svm-v1b": {
    titleFr: "Géométrie de la Marge SVM",
    descriptionFr: "Marge dure vs marge souple (variables d'écart), compromis du paramètre C visualisé.",
    titleAr: "هندسة هامش SVM",
    descriptionAr: "الهامش الصلب مقابل اللين (متغيرات الترخي)، مقايضة معامل C مُصوَّرة.",
  },
  "svm-v2": {
    titleFr: "L'Astuce du Noyau",
    descriptionFr: "Projection des données XOR en 3D avec noyau RBF ; noyau comme produit scalaire implicite.",
    titleAr: "حيلة النواة",
    descriptionAr: "إسقاط بيانات XOR إلى ثلاثية الأبعاد بنواة RBF؛ النواة كحاصل ضرب نقطي ضمني.",
  },
  "svm-v3a": {
    titleFr: "K Plus Proches Voisins (KNN)",
    descriptionFr: "Vote basé sur la distance : animation frontière k=1 vs k=5, choix de k par validation croisée.",
    titleAr: "K أقرب الجيران (KNN)",
    descriptionAr: "التصويت القائم على المسافة: تحريك حد k=1 مقابل k=5، اختيار k بالتحقق المتقاطع.",
  },
  "svm-v3b": {
    titleFr: "Régression par Vecteurs de Support (SVR)",
    descriptionFr: "Perte insensible ε-tube, compromis ε et C, SVR vs régression linéaire sur courbe bruitée.",
    titleAr: "انحدار متجه الدعم (SVR)",
    descriptionAr: "خسارة ε-tube غير الحساسة، مقايضة ε وC، SVR مقابل الانحدار الخطي على منحنى مزعج.",
  },
  "svm-v4": {
    titleFr: "KNN : Métriques de Distance & Vote Pondéré",
    descriptionFr: "Euclidienne vs Manhattan vs Minkowski ; KNN pondéré par distance ; importance de la normalisation.",
    titleAr: "KNN: مقاييس المسافة والتصويت الموزون",
    descriptionAr: "الإقليدية مقابل مانهاتن مقابل مينكوفسكي؛ KNN الموزون بالمسافة؛ أهمية التطبيع.",
  },
  "svm-v5": {
    titleFr: "La Malédiction de la Dimensionnalité",
    descriptionFr: "Pourquoi la distance s'effondre en haute dimension ; volume de l'hypersphère ; impact sur KNN et SVM.",
    titleAr: "لعنة الأبعاد",
    descriptionAr: "لماذا تتراجع المسافة في الأبعاد العالية؛ حجم الكرة الفائقة؛ التأثير على KNN وSVM.",
  },

  // ── Clustering ───────────────────────────────────────────────────────────────
  "clu-v1": {
    titleFr: "Clustering K-Means Pas à Pas",
    descriptionFr: "Init aléatoire, affectation, mise à jour des centroïdes animée jusqu'à convergence ; choix de K.",
    titleAr: "التجميع K-Means خطوة بخطوة",
    descriptionAr: "التهيئة العشوائية، التخصيص، تحديث المركز المتحرك حتى التقارب؛ اختيار K.",
  },
  "clu-v2": {
    titleFr: "Méthode du Coude & Score de Silhouette",
    descriptionFr: "Courbe de coude WCSS et coefficient de silhouette pour choisir le nombre optimal de clusters.",
    titleAr: "طريقة الكوع ودرجة Silhouette",
    descriptionAr: "منحنى كوع WCSS ومعامل silhouette لاختيار العدد الأمثل للمجموعات.",
  },

  // ── PCA ──────────────────────────────────────────────────────────────────────
  "pca-v1": {
    titleFr: "ACP : Analyse en Composantes Principales Expliquée",
    descriptionFr: "Matrice de covariance, vecteurs propres comme nouveaux axes, variance expliquée, projection 2D→1D animée.",
    titleAr: "PCA: تحليل المكونات الرئيسية موضح",
    descriptionAr: "مصفوفة التباين المشترك، المتجهات الذاتية كمحاور جديدة، التباين الموضح، الإسقاط المتحرك من 2D إلى 1D.",
  },

  // ── Anomaly Detection ─────────────────────────────────────────────────────────
  "anom-v1": {
    titleFr: "Détection d'Anomalies : Trouver l'Intrus",
    descriptionFr: "Marquage par z-score, intuition de longueur de chemin d'Isolation Forest, paramètre de contamination.",
    titleAr: "كشف الشذوذ: إيجاد القيمة المتطرفة",
    descriptionAr: "وضع علامات z-score، حدس طول مسار Isolation Forest، معامل التلوث.",
  },

  // ── Gradient Boosting ─────────────────────────────────────────────────────────
  "gb-v1": {
    titleFr: "Gradient Boosting : Apprendre de ses Erreurs",
    descriptionFr: "Ajustement séquentiel des résidus : chaque arbre corrige les erreurs précédentes ; rétrécissement et profondeur.",
    titleAr: "التعزيز التدريجي: التعلم من الأخطاء",
    descriptionAr: "ملاءمة البواقي المتسلسلة: كل شجرة تصحح الأخطاء السابقة؛ التقليص والعمق.",
  },

  // ── Bagging & Stacking ────────────────────────────────────────────────────────
  "ens-v1": {
    titleFr: "Bagging vs Stacking : Deux Stratégies d'Ensemble",
    descriptionFr: "Agrégation bootstrap pour réduire la variance vs empilement par méta-apprenant avec prédictions hors-pli.",
    titleAr: "التجميع مقابل التكديس: استراتيجيتان للمجموعة",
    descriptionAr: "التجميع التمهيدي لتقليل التباين مقابل التكديس بالمتعلم الميتا مع تنبؤات خارج الطية.",
  },

  // ── Multiclass ────────────────────────────────────────────────────────────────
  "mc-v1": {
    titleFr: "Classification Multi-classe : OvA, OvO & Softmax",
    descriptionFr: "Décomposition binaire Un-vs-Tous, vote par paires Un-vs-Un, et sortie Softmax native.",
    titleAr: "التصنيف متعدد الفئات: OvA وOvO وSoftmax",
    descriptionAr: "تحليل ثنائي واحد-مقابل-الكل، التصويت الثنائي واحد-مقابل-واحد، وإخراج Softmax الأصيل.",
  },

  // ── Hyperparameter Tuning ─────────────────────────────────────────────────────
  "ht-v1": {
    titleFr: "Recherche par Grille, Aléatoire & Optimisation Bayésienne",
    descriptionFr: "Comparaison de couverture HP ; efficacité de la recherche aléatoire ; stratégie de modèle surrogate bayésien.",
    titleAr: "البحث الشبكي والعشوائي وتحسين بايز",
    descriptionAr: "مقارنة تغطية HP؛ كفاءة البحث العشوائي؛ استراتيجية النموذج البديل البايزي.",
  },

  // ── Feature Importance ────────────────────────────────────────────────────────
  "fi-v1": {
    titleFr: "Mesurer l'Importance des Variables : MDI, Permutation & SHAP",
    descriptionFr: "Graphique MDI basé sur les arbres, importance par permutation et valeurs SHAP additives.",
    titleAr: "قياس أهمية الميزات: MDI والتبديل وSHAP",
    descriptionAr: "مخطط MDI القائم على الأشجار، أهمية التبديل وقيم SHAP الجمعية.",
  },

  // ── Partial Dependence ────────────────────────────────────────────────────────
  "pdp-v1": {
    titleFr: "Graphiques PDP & ICE : Comment les Variables Affectent la Sortie",
    descriptionFr: "Les PDP marginalisent les autres variables ; les courbes ICE révèlent les effets par instance.",
    titleAr: "مخططات PDP وICE: كيف تؤثر الميزات على المخرج",
    descriptionAr: "يُهمّش PDP الميزات الأخرى؛ منحنيات ICE تكشف التأثيرات لكل مثيل.",
  },

  // ── Time Series ───────────────────────────────────────────────────────────────
  "ts-v1": {
    titleFr: "Séries Temporelles : Tendance, Saisonnalité & Stationnarité",
    descriptionFr: "Décomposition additive, test de stationnarité ADF, différenciation et stratégie de transformation log.",
    titleAr: "السلاسل الزمنية: الاتجاه والموسمية والثبات",
    descriptionAr: "التحليل الجمعي، اختبار ثبات ADF، التفاضل واستراتيجية التحويل اللوغاريتمي.",
  },

  // ── Neural Networks ───────────────────────────────────────────────────────────
  "nn-v1": {
    titleFr: "Le Perceptron : La Naissance des Réseaux de Neurones",
    descriptionFr: "Perceptron de Rosenblatt 1958 : poids, biais, activation en escalier et frontière de décision linéaire.",
    titleAr: "المستقبل: ولادة الشبكات العصبية",
    descriptionAr: "مستقبل روزنبلات 1958: الأوزان، التحيز، تنشيط الخطوة وحد القرار الخطي.",
  },
  "nn-v2": {
    titleFr: "Propagation Avant dans un MLP",
    descriptionFr: "Les données circulent couche par couche : sommes pondérées, fonctions d'activation, trace de calcul complète.",
    titleAr: "التمرير الأمامي في MLP",
    descriptionAr: "البيانات تتدفق طبقة بطبقة: المجاميع الموزونة، دوال التنشيط، تتبع الحساب الكامل.",
  },
  "nn-v3": {
    titleFr: "Rétropropagation : Apprendre en Allant en Arrière",
    descriptionFr: "Règle de chaîne déroulée : flux de gradient de la perte vers les poids et règle de mise à jour.",
    titleAr: "الانتشار الخلفي: التعلم بالذهاب للخلف",
    descriptionAr: "قاعدة السلسلة المكشوفة: تدفق التدرج من الخسارة إلى الأوزان وقاعدة التحديث.",
  },
  "nn-v4": {
    titleFr: "Fonctions d'Activation : Exploration Approfondie",
    descriptionFr: "Sigmoid, Tanh, ReLU, Leaky ReLU, GELU comparées — gradient vanissant expliqué.",
    titleAr: "دوال التنشيط: غوص عميق",
    descriptionAr: "Sigmoid وTanh وReLU وLeaky ReLU وGELU مقارنة — التدرج المتلاشي موضح.",
  },
  "nn-v5": {
    titleFr: "Architectures de Réseaux : Profondeur, Largeur & Connexions Résiduelles",
    descriptionFr: "Peu profond vs profond, théorème d'approximation universelle et connexions résiduelles style ResNet.",
    titleAr: "معماريات الشبكة: العمق والعرض والوصلات المتبقية",
    descriptionAr: "الضحل مقابل العميق، نظرية التقريب العالمي ووصلات ResNet المتبقية.",
  },

  // ── Deep Learning Optimization ────────────────────────────────────────────────
  "dlopt-v1": {
    titleFr: "SGD, Mini-Lot & Momentum",
    descriptionFr: "Types de lots comparés, animation de descente de paysage de perte et momentum comme balle qui roule.",
    titleAr: "SGD والدفعة الصغيرة والزخم",
    descriptionAr: "أنواع الدفعات مقارنة، تحريك النزول على مشهد الخسارة والزخم ككرة متدحرجة.",
  },
  "dlopt-v2": {
    titleFr: "Optimiseur Adam : Taux d'Apprentissage Adaptatifs",
    descriptionFr: "Mise à l'échelle par paramètre RMSProp + momentum = Adam. Équations et comparaison de convergence.",
    titleAr: "محسّن Adam: معدلات التعلم التكيفية",
    descriptionAr: "تحجيم لكل معامل RMSProp + زخم = Adam. المعادلات ومقارنة التقارب.",
  },
  "dlopt-v3": {
    titleFr: "Planification du Taux d'Apprentissage",
    descriptionFr: "Décroissance par étapes, recuit cosinus, warmup — tracés et comparés sur l'entraînement.",
    titleAr: "جدولة معدل التعلم",
    descriptionAr: "الإضمحلال التدريجي، التبريد التدريجي للجيب التمام، الإحماء — مرسومة ومقارنة على التدريب.",
  },
  "dlopt-v4": {
    titleFr: "Régularisation : Dropout & Batch Normalization",
    descriptionFr: "Pénalités L1/L2, animation de silenciation de neurones dropout, BatchNorm normalisant par couche.",
    titleAr: "التنظيم: Dropout وتطبيع الدفعات",
    descriptionAr: "عقوبات L1/L2، تحريك إسكات نيورون Dropout، BatchNorm يُطبّع لكل طبقة.",
  },

  // ── CNN Architectures ─────────────────────────────────────────────────────────
  "cnn-v1": {
    titleFr: "L'Opération de Convolution",
    descriptionFr: "Noyau 3×3 glissant sur image 5×5 : multiplication élément par élément, somme, stride, padding expliqués.",
    titleAr: "عملية الالتفاف",
    descriptionAr: "نواة 3×3 تنزلق على صورة 5×5: الضرب عنصراً بعنصر، المجموع، الخطوة، الحشو موضح.",
  },
  "cnn-v2": {
    titleFr: "Couches de Pooling & Sous-échantillonnage Spatial",
    descriptionFr: "Max pooling animé sur grille 4×4 ; pooling moyen vs max ; Global Average Pooling.",
    titleAr: "طبقات التجميع والتقليص المكاني",
    descriptionAr: "التجميع الأقصى متحرك على شبكة 4×4؛ تجميع المتوسط مقابل الأقصى؛ التجميع المتوسط العالمي.",
  },
  "cnn-v3": {
    titleFr: "Architectures CNN Classiques : LeNet à ResNet",
    descriptionFr: "Évolution architecturale : LeNet → AlexNet → VGGNet → connexions résiduelles ResNet.",
    titleAr: "معماريات CNN الكلاسيكية: من LeNet إلى ResNet",
    descriptionAr: "تطور المعمارية: LeNet ← AlexNet ← VGGNet ← وصلات ResNet المتبقية.",
  },

  // ── RNN, LSTM & GRU ──────────────────────────────────────────────────────────
  "rnn-v1": {
    titleFr: "Réseaux de Neurones Récurrents : Séquences & Mémoire",
    descriptionFr: "RNN déplié sur 5 pas de temps, équation d'état caché, gradient vanissant dans le temps.",
    titleAr: "الشبكات العصبية المتكررة: التسلسلات والذاكرة",
    descriptionAr: "RNN مكشوف على 5 خطوات زمنية، معادلة الحالة المخفية، التدرج المتلاشي عبر الزمن.",
  },
  "rnn-v2": {
    titleFr: "LSTM : Mémoire à Court et Long Terme",
    descriptionFr: "Convoyeur d'état cellulaire, portes oubli/entrée/sortie, équations LSTM complètes animées pas à pas.",
    titleAr: "LSTM: الذاكرة الطويلة قصيرة المدى",
    descriptionAr: "ناقل حالة الخلية، بوابات النسيان/الإدخال/الإخراج، معادلات LSTM الكاملة المتحركة خطوة بخطوة.",
  },
  "rnn-v3": {
    titleFr: "GRU : Unité Récurrente à Portes",
    descriptionFr: "Conception à 2 portes du GRU vs 3 portes du LSTM ; équations mise à jour/réinitialisation ; rapidité vs précision.",
    titleAr: "GRU: الوحدة المتكررة ذات البوابات",
    descriptionAr: "تصميم GRU ذي البوابتين مقابل 3 بوابات LSTM؛ معادلات التحديث/الإعادة؛ السرعة مقابل الدقة.",
  },

  // ── Object Detection ──────────────────────────────────────────────────────────
  "od-v1": {
    titleFr: "Détection d'Objets : IoU, Ancres & NMS",
    descriptionFr: "Classification vs détection, mesure IoU, ancres a priori, Suppression Non-Maximale.",
    titleAr: "كشف الكائنات: IoU والمراسي وNMS",
    descriptionAr: "التصنيف مقابل الكشف، قياس IoU، المراسي المسبقة، قمع غير الحد الأقصى.",
  },

  // ── Image Segmentation ────────────────────────────────────────────────────────
  "seg-v1": {
    titleFr: "Segmentation Sémantique & d'Instances + U-Net",
    descriptionFr: "Trois types de segmentation comparés ; encodeur-décodeur U-Net avec connexions résiduelles animé.",
    titleAr: "التجزئة الدلالية والمثيلية + U-Net",
    descriptionAr: "ثلاثة أنواع تجزئة مقارنة؛ مشفر-فك تشفير U-Net مع وصلات القفز المتحركة.",
  },

  // ── NLP ───────────────────────────────────────────────────────────────────────
  "nlp-v1": {
    titleFr: "Pipeline de Prétraitement de Texte",
    descriptionFr: "Tokenisation, mise en minuscules, mots vides, racinisation vs lemmatisation — le pipeline complet.",
    titleAr: "خط أنابيب معالجة النص المسبقة",
    descriptionAr: "الترميز، التصغير، الكلمات التوقفية، التجذير مقابل الترقيم — الخط الكامل.",
  },
  "nlp-v2": {
    titleFr: "TF-IDF & Embeddings de Mots",
    descriptionFr: "Sac de mots → pondération TF-IDF → espace sémantique Word2Vec avec roi−homme+femme≈reine.",
    titleAr: "TF-IDF وتضمينات الكلمات",
    descriptionAr: "حقيبة الكلمات ← ترجيح TF-IDF ← فضاء Word2Vec الدلالي مع king−man+woman≈queen.",
  },

  // ── Transformers ──────────────────────────────────────────────────────────────
  "trf-v1": {
    titleFr: "Le Mécanisme d'Attention",
    descriptionFr: "Analogie de recherche Requête-Clé-Valeur, formule du produit scalaire mis à l'échelle, poids d'attention.",
    titleAr: "آلية الانتباه",
    descriptionAr: "تشبيه استرداد الاستعلام-المفتاح-القيمة، صيغة حاصل الضرب النقطي المقيّس، أوزان الانتباه.",
  },
  "trf-v2": {
    titleFr: "L'Architecture Transformer",
    descriptionFr: "Encodage positionnel, attention multi-têtes, disposition des blocs encodeur — Vaswani et al. 2017.",
    titleAr: "معمارية المحول",
    descriptionAr: "الترميز الموضعي، انتباه متعدد الرؤوس، تخطيط كتلة التشفير — فاسواني وآخرون 2017.",
  },
  "trf-v3": {
    titleFr: "BERT vs GPT : Encodeurs vs Décodeurs",
    descriptionFr: "BERT bidirectionnel (LM masqué) vs GPT causal (prochain token) ; comparison table and use-cases.",
    titleAr: "BERT مقابل GPT: المشفرات مقابل فك التشفير",
    descriptionAr: "BERT ثنائي الاتجاه (LM مقنّع) مقابل GPT السببي (الرمز التالي)؛ جدول مقارنة وحالات الاستخدام.",
  },

  // ── Audio & Speech ────────────────────────────────────────────────────────────
  "aud-v1": {
    titleFr: "Représentations Audio : Formes d'Onde, Spectrogrammes & MFCC",
    descriptionFr: "Forme d'onde brute → STFT → spectrogramme → banque de filtres Mel → MFCC : pipeline audio complet.",
    titleAr: "تمثيلات الصوت: الموجات والمطياف وMFCC",
    descriptionAr: "الموجة الخام ← STFT ← المطياف ← بنك مرشح Mel ← MFCC: خط أنابيب صوتي كامل.",
  },

  // ── Generative Models ─────────────────────────────────────────────────────────
  "gen-v1": {
    titleFr: "Auto-Encodeurs Variationnels (VAE)",
    descriptionFr: "Encodeur → distribution latente (μ, σ) → astuce de reparamétrisation → décodeur. Perte ELBO.",
    titleAr: "المشفرات التلقائية المتغيرة (VAE)",
    descriptionAr: "المشفر ← التوزيع الكامن (μ, σ) ← حيلة إعادة التمثيل ← فك التشفير. خسارة ELBO.",
  },
  "gen-v2": {
    titleFr: "Réseaux Adversariaux Génératifs (GANs)",
    descriptionFr: "Jeu minimax Générateur vs Discriminateur, dynamiques d'entraînement, défis d'effondrement de mode.",
    titleAr: "الشبكات التوليدية التنافسية (GANs)",
    descriptionAr: "لعبة minimax المولّد مقابل المميّز، ديناميكيات التدريب، تحديات انهيار النمط.",
  },

  // ── Reinforcement Learning ────────────────────────────────────────────────────
  "rl-v1": {
    titleFr: "PDM : Le Cadre de l'Apprentissage par Renforcement",
    descriptionFr: "Boucle agent-environnement, concepts état/action/récompense/politique, facteur d'actualisation et retour.",
    titleAr: "MDP: إطار التعلم بالتعزيز",
    descriptionAr: "حلقة الوكيل-البيئة، مفاهيم الحالة/الفعل/المكافأة/السياسة، عامل الخصم والعودة.",
  },
  "rl-v2": {
    titleFr: "Q-Learning & l'Équation de Bellman",
    descriptionFr: "Valeurs Q, équation récursive de Bellman, règle de mise à jour TD, exploration ε-greedy avec décroissance.",
    titleAr: "Q-Learning ومعادلة بيلمان",
    descriptionAr: "قيم Q، معادلة بيلمان التكرارية، قاعدة تحديث TD، استكشاف ε-greedy مع الإضمحلال.",
  },
  "rl-v3": {
    titleFr: "Gradient de Politique & Acteur-Critique",
    descriptionFr: "Estimateur de gradient REINFORCE, réduction de variance par ligne de base, cadre Acteur-Critique.",
    titleAr: "تدرج السياسة والفاعل-الناقد",
    descriptionAr: "مقدّر تدرج REINFORCE، تقليل التباين بالخط الأساسي، إطار الفاعل-الناقد.",
  },

};

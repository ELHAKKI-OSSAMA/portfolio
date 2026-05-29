import type { QuizI18n } from './types';

export const T_foundations: Record<string, QuizI18n> = {

  // ── python-ml-stack ────────────────────────────────────────────────────────

  "python-ml-stack|0": {
    questionFr: "Que permet le broadcasting NumPy ?",
    questionAr: "ما الذي يتيحه broadcasting في NumPy؟",
    optionsFr: [
      "Exécuter Python sur plusieurs CPU",
      "Effectuer des opérations sur des tableaux de formes différentes sans boucles explicites",
      "Importer des données CSV automatiquement",
      "Visualiser des tableaux sous forme d'images",
    ],
    optionsAr: [
      "تشغيل Python على عدة وحدات معالجة مركزية",
      "إجراء عمليات على مصفوفات بأشكال مختلفة دون حلقات صريحة",
      "استيراد بيانات CSV تلقائياً",
      "عرض المصفوفات على شكل صور",
    ],
    explanationFr:
      "Le broadcasting permet à NumPy d'étirer les petits tableaux pour correspondre aux grands lors d'opérations arithmétiques — ex. ajouter un vecteur (3,) à une matrice (4,3) sans boucle for.",
    explanationAr:
      "يتيح broadcasting لـ NumPy توسيع المصفوفات الصغيرة لتناسب الكبيرة أثناء العمليات الحسابية — مثلاً إضافة متجه (3,) إلى مصفوفة (4,3) دون حلقة for.",
  },

  "python-ml-stack|1": {
    questionFr: "Quelle méthode pandas supprime les lignes avec des valeurs manquantes ?",
    questionAr: "أي دالة في pandas تحذف الصفوف التي تحتوي على قيم مفقودة؟",
    optionsFr: ["df.fillna()", "df.dropna()", "df.replace()", "df.isnull()"],
    optionsAr: ["df.fillna()", "df.dropna()", "df.replace()", "df.isnull()"],
    explanationFr:
      "dropna() supprime les lignes (ou colonnes) contenant des NaN. fillna() les remplace par une valeur.",
    explanationAr:
      "تحذف dropna() الصفوف (أو الأعمدة) التي تحتوي على NaN، بينما تملأها fillna() بقيمة بديلة.",
  },

  "python-ml-stack|2": {
    questionFr:
      "Quel est l'avantage principal de NumPy par rapport aux listes Python classiques ?",
    questionAr: "ما الميزة الأداء الرئيسية لـ NumPy مقارنةً بقوائم Python العادية؟",
    optionsFr: [
      "Les tableaux NumPy sont immuables",
      "Les opérations s'exécutent sur de la mémoire C contiguë avec SIMD, sans surcharge Python",
      "NumPy parallélise automatiquement sur les threads",
      "NumPy supporte nativement les chaînes de caractères",
    ],
    optionsAr: [
      "مصفوفات NumPy غير قابلة للتعديل",
      "تعمل العمليات على ذاكرة C متجاورة بـ SIMD دون overhead لمفسر Python",
      "NumPy يوازن تلقائياً عبر الخيوط",
      "NumPy يدعم النصوص بشكل مدمج",
    ],
    explanationFr:
      "NumPy stocke les données en mémoire typée contiguë et délègue les calculs aux routines BLAS/LAPACK, évitant l'overhead Python par élément.",
    explanationAr:
      "تخزّن NumPy البيانات في ذاكرة مكتوبة ومتجاورة وتفوّض الحسابات لروتينات BLAS/LAPACK، متجنبةً تكلفة المفسر لكل عنصر.",
  },

  // ── linear-algebra ─────────────────────────────────────────────────────────

  "linear-algebra|0": {
    questionFr: "Que signifie dire que deux vecteurs sont orthogonaux ?",
    questionAr: "ماذا يعني أن يكون متجهان متعامدان؟",
    optionsFr: [
      "Ils ont la même magnitude",
      "Leur produit scalaire est nul",
      "Ils pointent dans la même direction",
      "L'un est un multiple scalaire de l'autre",
    ],
    optionsAr: [
      "لهما نفس المقدار",
      "حاصل ضربهما النقطي يساوي صفراً",
      "يشيران إلى نفس الاتجاه",
      "أحدهما مضاعف قياسي للآخر",
    ],
    explanationFr:
      "Les vecteurs orthogonaux sont perpendiculaires : u·v = 0. En ML, cela signifie que les features ne sont pas corrélées dans un espace transformé.",
    explanationAr:
      "المتجهات المتعامدة هي متجهات متعامدة هندسياً: u·v = 0. في تعلّم الآلة، يعني هذا أن الميزات غير مترابطة في الفضاء المحوَّل.",
  },

  "linear-algebra|1": {
    questionFr:
      "Que nous apprennent les valeurs propres sur une transformation linéaire ?",
    questionAr: "ما الذي تخبرنا به القيم الذاتية عن التحويل الخطي؟",
    optionsFr: [
      "Le nombre de dimensions après transformation",
      "De combien les vecteurs propres sont mis à l'échelle (étirés/comprimés) par la matrice",
      "L'angle de rotation de la transformation",
      "Le déterminant de la matrice",
    ],
    optionsAr: [
      "عدد الأبعاد بعد التحويل",
      "مقدار قياس (تمدد/ضغط) المتجهات الذاتية بواسطة المصفوفة",
      "زاوية دوران التحويل",
      "محدد المصفوفة",
    ],
    explanationFr:
      "Av = λv — un vecteur propre v est uniquement mis à l'échelle par λ, sans rotation. Les grandes valeurs propres indiquent des directions de forte variance, au cœur d'ACP.",
    explanationAr:
      "Av = λv — المتجه الذاتي v لا يُقاس إلا بـ λ دون دوران. القيم الذاتية الكبيرة تشير إلى اتجاهات ذات تباين عالٍ، وهو جوهر PCA.",
  },

  "linear-algebra|2": {
    questionFr: "Qu'est-ce que le rang d'une matrice ?",
    questionAr: "ما هو رتبة المصفوفة؟",
    optionsFr: [
      "Son déterminant",
      "Le nombre de lignes",
      "Le nombre de lignes ou colonnes linéairement indépendantes",
      "La trace (somme des éléments diagonaux)",
    ],
    optionsAr: [
      "محددها",
      "عدد الصفوف",
      "عدد الصفوف أو الأعمدة المستقلة خطياً",
      "الأثر (مجموع العناصر القطرية)",
    ],
    explanationFr:
      "Rang = dimension de l'espace colonne. Une matrice plein rang n'a pas de features redondantes ; une matrice de rang déficient est singulière (non inversible).",
    explanationAr:
      "الرتبة = بُعد فضاء الأعمدة. المصفوفة ذات الرتبة الكاملة لا تحتوي على ميزات متكررة؛ المصفوفة ناقصة الرتبة شاذة (غير قابلة للعكس).",
  },

  // ── calculus-optimization ──────────────────────────────────────────────────

  "calculus-optimization|0": {
    questionFr:
      "Pourquoi la règle de la chaîne est-elle indispensable pour l'entraînement des réseaux de neurones ?",
    questionAr: "لماذا تُعدّ قاعدة السلسلة ضرورية لتدريب الشبكات العصبية؟",
    optionsFr: [
      "Elle accélère les calculs de la passe avant",
      "Elle permet de calculer ∂L/∂w pour n'importe quel poids en multipliant les gradients locaux couche par couche",
      "Elle empêche la disparition des gradients",
      "Elle initialise correctement les poids",
    ],
    optionsAr: [
      "تُسرّع حسابات التمرير الأمامي",
      "تتيح حساب ∂L/∂w لأي وزن بضرب التدرجات المحلية طبقة بطبقة",
      "تمنع اختفاء التدرجات",
      "تُهيئ الأوزان بشكل صحيح",
    ],
    explanationFr:
      "La rétropropagation est simplement la règle de la chaîne appliquée récursivement : ∂L/∂w = (∂L/∂a)(∂a/∂z)(∂z/∂w). Le gradient de chaque couche est un produit de gradients en aval.",
    explanationAr:
      "الانتشار الخلفي هو تطبيق قاعدة السلسلة بشكل متكرر: ∂L/∂w = (∂L/∂a)(∂a/∂z)(∂z/∂w). تدرج كل طبقة هو حاصل ضرب التدرجات النازلة.",
  },

  "calculus-optimization|1": {
    questionFr:
      "Que se passe-t-il si on utilise un taux d'apprentissage trop grand ?",
    questionAr: "ماذا يحدث عند استخدام معدل تعلم كبير جداً؟",
    optionsFr: [
      "L'entraînement ralentit à cause de petits pas",
      "Le modèle converge vers un minimum local sous-optimal",
      "Les mises à jour dépassent le minimum et la perte oscille ou diverge",
      "Les gradients s'annulent",
    ],
    optionsAr: [
      "يتباطأ التدريب بسبب الخطوات الصغيرة",
      "يتقارب النموذج نحو حد أدنى محلي دون المستوى الأمثل",
      "تتجاوز التحديثات الحد الأدنى وتتذبذب الخسارة أو تتباعد",
      "تتلاشى التدرجات إلى الصفر",
    ],
    explanationFr:
      "Un η trop grand provoque des mises à jour qui sautent par-dessus le minimum. La perte peut osciller ou exploser au lieu de diminuer régulièrement.",
    explanationAr:
      "يتسبب η الكبير في تحديثات تتخطى الحد الأدنى. قد تتذبذب الخسارة أو تنفجر بدلاً من الانخفاض المطّرد.",
  },

  "calculus-optimization|2": {
    questionFr: "Quel avantage Adam offre-t-il par rapport au SGD classique ?",
    questionAr: "ما الميزة التي يوفرها Adam مقارنةً بـ SGD العادي؟",
    optionsFr: [
      "Adam ne nécessite pas de taux d'apprentissage",
      "Adam adapte le taux d'apprentissage par paramètre via des estimations de premier et second moment",
      "Adam évite tous les minima locaux",
      "Adam est toujours plus rapide en temps réel",
    ],
    optionsAr: [
      "Adam لا يحتاج إلى معدل تعلم",
      "يُكيّف Adam معدل التعلم لكل معلمة باستخدام تقديرات المرتبة الأولى والثانية",
      "Adam يتجنب جميع الحدود الدنيا المحلية",
      "Adam دائماً أسرع في الوقت الفعلي",
    ],
    explanationFr:
      "Adam conserve des estimations courantes de la moyenne du gradient (m) et de la variance non centrée (v), puis met à l'échelle la mise à jour de chaque poids par 1/√v — un pas adaptatif par paramètre.",
    explanationAr:
      "يحتفظ Adam بتقديرات متجددة لمتوسط التدرج (m) والتباين غير المتمركز (v)، ثم يُقيس تحديث كل معلمة بـ 1/√v — خطوة تكيفية لكل معلمة.",
  },

  // ── probability-statistics ─────────────────────────────────────────────────

  "probability-statistics|0": {
    questionFr:
      "Qu'optimise l'estimation du maximum de vraisemblance (MLE) ?",
    questionAr: "ما الذي يُحسّنه تقدير الاحتمالية القصوى (MLE)؟",
    optionsFr: [
      "La probabilité a priori des paramètres",
      "La probabilité des données observées étant donné les paramètres",
      "La probabilité a posteriori des paramètres",
      "La divergence KL entre distributions",
    ],
    optionsAr: [
      "الاحتمالية السابقة للمعلمات",
      "احتمالية البيانات الملاحظة بافتراض المعلمات",
      "الاحتمالية اللاحقة للمعلمات",
      "تباعد KL بين التوزيعات",
    ],
    explanationFr:
      "MLE trouve θ* = argmax P(données | θ). Pour un bruit gaussien, cela revient à minimiser MSE ; pour des sorties de Bernoulli, c'est l'entropie croisée.",
    explanationAr:
      "يجد MLE θ* = argmax P(البيانات | θ). بالنسبة للضوضاء الغاوسية يُكافئ تصغير MSE؛ وبالنسبة لمخرجات برنولي يُكافئ الإنتروبيا التقاطعية.",
  },

  "probability-statistics|1": {
    questionFr: "Que représente une p-value ?",
    questionAr: "ماذا تمثل القيمة الاحتمالية p-value؟",
    optionsFr: [
      "La probabilité que l'hypothèse nulle soit vraie",
      "La probabilité d'observer des données au moins aussi extrêmes, en supposant H₀ vraie",
      "La taille d'effet de l'expérience",
      "Le niveau de confiance du résultat",
    ],
    optionsAr: [
      "احتمال صحة الفرضية الصفرية",
      "احتمال رؤية بيانات متطرفة بنفس القدر أو أكثر بافتراض صحة H₀",
      "حجم تأثير التجربة",
      "مستوى الثقة في النتيجة",
    ],
    explanationFr:
      "Une p-value faible (< 0,05) signifie que les données seraient peu probables sous H₀, justifiant de la rejeter — mais ce n'est PAS la probabilité que H₀ soit vraie.",
    explanationAr:
      "قيمة p صغيرة (< 0.05) تعني أن البيانات ستكون مستبعدة في ظل H₀، مما يدعم رفضها — لكنها لا تمثل احتمال صحة H₀ ذاتها.",
  },

  "probability-statistics|2": {
    questionFr:
      "Pourquoi le théorème central limite est-il important pour l'évaluation en ML ?",
    questionAr: "لماذا يهم نظرية الحد المركزي في تقييم نماذج تعلم الآلة؟",
    optionsFr: [
      "Il garantit la convergence du modèle",
      "Il justifie l'utilisation d'intervalles de confiance normaux pour les moyennes d'échantillons quelle que soit la distribution",
      "Il prouve que la descente de gradient fonctionne",
      "Il garantit que la perte d'entraînement atteint zéro",
    ],
    optionsAr: [
      "يضمن تقاربَ النموذج",
      "يُبرر استخدام فترات الثقة الغاوسية لمتوسطات العينات بصرف النظر عن التوزيع",
      "يثبت أن نزول التدرج يعمل",
      "يضمن وصول خسارة التدريب إلى الصفر",
    ],
    explanationFr:
      "Le TCL stipule que les moyennes d'échantillons convergent vers une distribution normale quand n augmente. Cela justifie les erreurs standard et les tests t lors de la comparaison de performances.",
    explanationAr:
      "تنص نظرية الحد المركزي على أن متوسطات العينات تتقارب نحو التوزيع الطبيعي مع نمو n، مما يُبرر تقديرات الخطأ المعياري وإجراء اختبارات t عند مقارنة أداء النماذج.",
  },

  // ── information-theory ─────────────────────────────────────────────────────

  "information-theory|0": {
    questionFr:
      "Que signifie une entropie élevée dans une distribution de probabilité ?",
    questionAr: "ماذا يعني ارتفاع الإنتروبيا في توزيع احتمالي؟",
    optionsFr: [
      "La distribution est très concentrée (faible incertitude)",
      "La distribution est presque uniforme (forte incertitude)",
      "La distribution possède plusieurs modes",
      "La distribution a une forte variance",
    ],
    optionsAr: [
      "التوزيع مُركّز جداً (عدم يقين منخفض)",
      "التوزيع شبه منتظم (عدم يقين عالٍ)",
      "التوزيع متعدد القمم",
      "التوزيع ذو تباين عالٍ",
    ],
    explanationFr:
      "H(X) = -Σ p log p est maximisée quand tous les résultats sont équiprobables. Une distribution concentrée a une faible entropie — un résultat domine.",
    explanationAr:
      "H(X) = -Σ p log p تبلغ أقصاها عندما تكون جميع النتائج متساوية الاحتمال. التوزيع المتمركز له إنتروبيا منخفضة — نتيجة واحدة تهيمن.",
  },

  "information-theory|1": {
    questionFr:
      "Pourquoi l'entropie croisée est-elle utilisée comme fonction de perte pour la classification ?",
    questionAr: "لماذا تُستخدم الإنتروبيا التقاطعية كدالة خسارة للتصنيف؟",
    optionsFr: [
      "Elle est toujours convexe",
      "Elle mesure le nombre moyen de bits nécessaires pour encoder l'étiquette vraie sous la distribution prédite par le modèle",
      "Elle pénalise les grands poids (régularisation)",
      "Elle est plus rapide à calculer que MSE",
    ],
    optionsAr: [
      "هي دائماً محدبة",
      "تقيس متوسط عدد البتات اللازمة لتشفير التصنيف الحقيقي وفق التوزيع المتوقع",
      "تعاقب الأوزان الكبيرة (تنظيم)",
      "حسابها أسرع من MSE",
    ],
    explanationFr:
      "L'entropie croisée H(p,q) = -Σ p log q pénalise logarithmiquement les prédictions erronées avec forte confiance. La minimiser équivaut à maximiser la log-vraisemblance.",
    explanationAr:
      "الإنتروبيا التقاطعية H(p,q) = -Σ p log q تعاقب التنبؤات الخاطئة الواثقة لوغاريثمياً. تصغيرها يعادل تعظيم اللوغاريتم الأرجح.",
  },

  "information-theory|2": {
    questionFr:
      "La divergence KL D_KL(P||Q) est nulle lorsque :",
    questionAr: "يُساوي تباعد KL الصفر D_KL(P||Q) = 0 عندما:",
    optionsFr: [
      "P et Q ont la même moyenne",
      "P et Q sont des distributions identiques",
      "P a une entropie inférieure à Q",
      "Q est la distribution uniforme",
    ],
    optionsAr: [
      "P و Q لهما نفس المتوسط",
      "P و Q توزيعان متطابقان",
      "إنتروبيا P أقل من Q",
      "Q هو التوزيع المنتظم",
    ],
    explanationFr:
      "D_KL(P||Q) = Σ P log(P/Q) = 0 si et seulement si P = Q partout. Il est non négatif et asymétrique, donc ce n'est pas une distance au sens strict.",
    explanationAr:
      "D_KL(P||Q) = Σ P log(P/Q) = 0 إذا وفقط إذا كان P = Q في كل مكان. وهو غير سالب وغير متماثل، مما يجعله تباعداً لا مسافة حقيقية.",
  },

};

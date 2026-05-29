import type { SectionI18n, KeyFormulaI18n } from '../types';

export const sectionI18n_unsupervised: Record<string, SectionI18n> = {

  // ── clustering ───────────────────────────────────────────────────────────────
  "clustering|0": {
    headingFr: "Pourquoi Regrouper des Données Non Étiquetées ?",
    headingAr: "لماذا تجميع البيانات غير المصنفة؟",
    textFr: "La plupart des données du monde réel arrivent sans étiquettes — transactions clients, séquences génomiques, articles de presse, lectures de capteurs. Le clustering vous permet de découvrir une structure naturelle qu'aucun humain n'a annotée. Spotify segmente les auditeurs pour construire Discover Weekly. Les compagnies d'assurance regroupent les sinistres pour détecter les fraudes organisées. Les biologistes groupent les profils d'expression génique pour trouver des sous-types de maladies. L'objectif est toujours le même : trouver des groupes où les membres sont plus similaires entre eux qu'aux membres des autres groupes.",
    textAr: "معظم البيانات الحقيقية تصل بلا تسميات — معاملات العملاء، التسلسلات الجينومية، المقالات الإخبارية، قراءات المستشعرات. يتيح لك التجميع اكتشاف البنية الطبيعية التي لم يُعلِّم عليها أحد. تُجزِّئ Spotify المستمعين لبناء Discover Weekly. تُجمِّع شركات التأمين المطالبات لكشف حلقات الاحتيال. يُجمِّع علماء الأحياء ملفات التعبير الجيني للعثور على أنواع فرعية من الأمراض. الهدف دائماً واحد: إيجاد مجموعات يكون أفرادها أكثر تشابهاً مع بعضهم مقارنةً بأفراد المجموعات الأخرى.",
    calloutFr: "K-Means a été publié en 1967 et reste l'un des algorithmes les plus utilisés dans les systèmes ML en production. Sa simplicité est sa force.",
    calloutAr: "نُشر K-Means عام 1967 وما زال أحد أكثر الخوارزميات استخداماً في أنظمة التعلم الآلي الإنتاجية. بساطته هي قوته.",
  },
  "clustering|1": {
    headingFr: "K-Means : La Négociation Itérative",
    headingAr: "K-Means: التفاوض التكراري",
    textFr: "Imaginez poser K drapeaux aléatoirement sur une carte. Chaque personne marche vers son drapeau le plus proche. Chaque drapeau se déplace ensuite vers la position moyenne de toutes les personnes qui l'ont rejoint. On répète jusqu'à ce que personne ne change de drapeau. Cet algorithme de Lloyd converge vers un minimum local — il n'est pas garanti de trouver l'optimum global, c'est pourquoi l'initialisation K-Means++ (écarter les centroïdes initiaux) améliore dramatiquement les résultats en pratique.",
    textAr: "تخيّل وضع K أعلام عشوائياً على خريطة. كل شخص يمشي نحو أقرب علم. ثم ينتقل كل علم إلى متوسط موضع كل من سار إليه. تتكرر العملية حتى لا يغير أحد علمه. تتقارب خوارزمية لويد هذه نحو حد أدنى محلي — غير مضمونة للعثور على الحل الأمثل العالمي، لذا تُحسّن تهيئة K-Means++ (إبعاد المراكز الأولية) النتائج بشكل كبير.",
    calloutFr: "K-Means converge toujours mais peut converger vers un mauvais minimum local. Toujours exécuter avec plusieurs initialisations aléatoires (n_init=10 dans scikit-learn) et garder le meilleur.",
    calloutAr: "يتقارب K-Means دائماً لكنه قد يتقارب نحو حد أدنى محلي سيئ. دائماً شغّله مع تهيئات عشوائية متعددة (n_init=10 في scikit-learn) واحتفظ بالأفضل.",
  },
  "clustering|2": {
    headingFr: "L'Objectif de K-Means",
    headingAr: "هدف K-Means",
    textFr: "K-Means minimise la somme des distances euclidiennes au carré de chaque point à son centroïde assigné. L'étape E assigne chaque point à son centroïde le plus proche ; l'étape M déplace chaque centroïde vers la moyenne de ses points assignés. Chaque étape diminue monotoniquement l'objectif, garantissant la convergence.",
    textAr: "يُقلِّل K-Means مجموع المسافات الإقليدية المربعة من كل نقطة إلى مركزها المعيَّن. تُعيِّن خطوة E كل نقطة لأقرب مركز؛ تُحرِّك خطوة M كل مركز نحو متوسط نقاطه. كل خطوة تُقلِّل الهدف بشكل رتيب مضمونةً التقارب.",
    formulaLabelFr: "WCSS — somme des distances intra-cluster au carré",
    formulaLabelAr: "WCSS — مجموع مربعات المسافات داخل التجمع",
  },
  "clustering|3": {
    headingFr: "Choisir K : La Méthode du Coude & Silhouette",
    headingAr: "اختيار K: طريقة الكوع والصورة الظلية",
    textFr: "K est un hyperparamètre — vous devez le choisir. La méthode du coude trace l'inertie vs K : l'inertie décroît toujours, mais le taux de décroissance fait un coude au « bon » K. Plus rigoureusement, le score de silhouette mesure à quel point chaque point correspond à son propre cluster vs le cluster le plus proche suivant. s=1 = séparation parfaite, s=0 = clusters qui se chevauchent, s<0 = le point est dans le mauvais cluster. La silhouette moyenne sur tous les points donne une métrique scalaire de qualité.",
    textAr: "K هو معامل فائق — يجب عليك اختياره. تُخطِّط طريقة الكوع القصور الذاتي مقابل K: دائماً يتناقص لكن معدل التناقص يُشكِّل كوعاً عند K الصحيح. بشكل أدق، يقيس درجة الصورة الظلية مدى ملاءمة كل نقطة لتجمعها الخاص مقارنةً بأقرب تجمع مجاور. s=1 = فصل تام، s=0 = تجمعات متداخلة، s<0 = النقطة في التجمع الخاطئ.",
    stepsFr: [
      "Essayer K = 2 à 10, tracer l'inertie — chercher le 'coude'",
      "Calculer le score de silhouette pour chaque K — le pic = meilleur K",
      "Utiliser la statistique d'écart (comparer aux données aléatoires) pour sélectionner K rigoureusement",
      "La connaissance du domaine prime souvent : si vous savez qu'il y a 5 segments clients, utiliser K=5",
    ],
    stepsAr: [
      "تجريب K = 2 إلى 10، رسم القصور الذاتي — البحث عن 'الكوع'",
      "حساب درجة الصورة الظلية لكل K — الذروة = أفضل K",
      "استخدام إحصائية الفجوة (مقارنة ببيانات عشوائية) لاختيار K بدقة",
      "غالباً تتغلب معرفة المجال: إذا كنت تعلم أن هناك 5 شرائح عملاء، استخدم K=5",
    ],
  },
  "clustering|4": {
    headingFr: "K-Means vs DBSCAN vs Hiérarchique",
    headingAr: "K-Means مقابل DBSCAN مقابل الهرمي",
    textFr: "K-Means suppose des clusters sphériques de taille égale et nécessite K à l'avance. Il échoue sur les données en forme de croissant ou à densité variable. DBSCAN trouve des clusters de forme arbitraire et identifie automatiquement les anomalies — points qui ne font partie d'aucun cluster. Il ne nécessite que ε (rayon de voisinage) et MinPts (points minimum pour former un noyau). Le clustering hiérarchique construit un dendrogramme qu'on coupe à n'importe quel niveau pour obtenir K clusters, donnant la structure complète en une seule passe.",
    textAr: "يفترض K-Means تجمعات كروية بأحجام متساوية ويتطلب K مسبقاً. يفشل على البيانات ذات الشكل الهلالي أو الكثافة المتغيرة. يجد DBSCAN تجمعات ذات أشكال عشوائية ويُحدِّد الشذوذات تلقائياً — النقاط غير المنتمية لأي تجمع. يتطلب فقط ε (نصف قطر الجوار) وMinPts. يبني التجميع الهرمي دينروغراماً يمكن قطعه على أي مستوى للحصول على K تجمعات.",
    calloutFr: "Utiliser DBSCAN quand vous attendez du bruit/des anomalies ou des clusters non sphériques. K-Means quand les clusters sont grossièrement sphériques et K connu. Hiérarchique pour explorer plusieurs granularités simultanément.",
    calloutAr: "استخدم DBSCAN عند توقع ضوضاء/شذوذات أو تجمعات غير كروية. K-Means عندما تكون التجمعات كروية تقريباً وK معروف. الهرمي لاستكشاف تدرجات متعددة في آنٍ واحد.",
  },
  "clustering|5": {
    headingFr: "DBSCAN Étape par Étape",
    headingAr: "DBSCAN خطوة بخطوة",
    stepsFr: [
      "Pour chaque point p non visité, trouver tous les points dans le rayon ε (ε-voisinage)",
      "Si |N_ε(p)| ≥ MinPts → p est un point noyau ; démarrer un nouveau cluster",
      "Expansion du cluster : ajouter tous les points accessibles en densité (voisins de points noyaux)",
      "Si |N_ε(p)| < MinPts et p est accessible depuis un noyau → p est un point de bordure",
      "Si p n'est accessible depuis aucun noyau → p est du bruit (anomalie, étiqueté -1)",
      "Répéter jusqu'à ce que tous les points soient visités — O(n log n) avec index spatial",
    ],
    stepsAr: [
      "لكل نقطة p غير مزارة، إيجاد جميع النقاط ضمن نصف القطر ε (ε-جوار)",
      "إذا |N_ε(p)| ≥ MinPts → p نقطة نواة؛ بدء تجمع جديد",
      "توسيع التجمع: إضافة جميع النقاط القابلة للوصول بالكثافة (جيران النقاط النواة)",
      "إذا |N_ε(p)| < MinPts وp قابلة للوصول من نواة → p نقطة حدودية",
      "إذا p غير قابلة للوصول من أي نواة → p ضوضاء (شذوذ، مُعلَّمة -1)",
      "التكرار حتى زيارة جميع النقاط — O(n log n) مع الفهرس المكاني",
    ],
  },
  "clustering|6": {
    headingFr: "Implémentation scikit-learn",
    headingAr: "تنفيذ scikit-learn",
    codeFr: `from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import make_blobs
import numpy as np

# ── Données d'exemple ──────────────────────────────────────────────────
X, _ = make_blobs(n_samples=300, centers=4, cluster_std=0.8, random_state=42)

# ── K-Means avec sélection de K via silhouette ────────────────────
X_normalise = StandardScaler().fit_transform(X)

meilleur_k, meilleur_score = 2, -1
for k in range(2, 11):
    km = KMeans(n_clusters=k, init='k-means++', n_init=10, random_state=42)
    etiquettes = km.fit_predict(X_normalise)
    score = silhouette_score(X_normalise, etiquettes)
    if score > meilleur_score:
        meilleur_k, meilleur_score = k, score

km_final = KMeans(n_clusters=meilleur_k, init='k-means++', n_init=10, random_state=42)
etiq_km = km_final.fit_predict(X_normalise)
print(f"K={meilleur_k}, silhouette={meilleur_score:.3f}, inertie={km_final.inertia_:.1f}")

# ── DBSCAN — détecte automatiquement clusters et anomalies ────────
db = DBSCAN(eps=0.5, min_samples=5)
etiq_db = db.fit_predict(X_normalise)
n_clusters = len(set(etiq_db)) - (1 if -1 in etiq_db else 0)
n_bruit    = list(etiq_db).count(-1)
print(f"DBSCAN: {n_clusters} clusters, {n_bruit} points de bruit")

# ── Agglomératif — pas de K nécessaire à l'avance ─────────────────
from scipy.cluster.hierarchy import dendrogram, linkage
Z = linkage(X_normalise, method='ward')
# Couper à K=3
agg = AgglomerativeClustering(n_clusters=3, linkage='ward')
etiq_agg = agg.fit_predict(X_normalise)`,
  },
  "clustering|7": {
    headingFr: "Pièges Courants du Regroupement",
    headingAr: "مزالق التجميع الشائعة",
    textFr: "Le clustering sans mise à l'échelle est l'erreur n°1 : les caractéristiques à grande échelle dominent la métrique de distance. Toujours mettre à l'échelle avant de regrouper. Deuxième piège : traiter les étiquettes de cluster comme vérité absolue — les clusters sont des hypothèses, pas des faits. Valider avec des experts du domaine et des métriques externes (si des étiquettes existent, utiliser l'Adjusted Rand Index). Troisième : supposer que les clusters sont significatifs — toujours vérifier en examinant les profils des clusters.",
    textAr: "التجميع بدون توسيع هو الخطأ رقم 1: الميزات ذات الأحجام الكبيرة تُهيمن على مقياس المسافة. دائماً وسِّع قبل التجميع. الخطأ الثاني: التعامل مع تسميات التجمع كحقيقة مطلقة — التجمعات فرضيات لا حقائق. تحقق مع خبراء المجال ومقاييس خارجية (إذا وُجدت تسميات، استخدم Adjusted Rand Index). الثالث: افتراض أن التجمعات ذات معنى — تحقق دائماً بفحص ملفات التجمعات.",
    calloutFr: "Les étiquettes de cluster sont des entiers arbitraires qui changent entre les exécutions. Ne jamais coder en dur 'cluster 0 = clients haute valeur' — toujours caractériser les clusters par leurs distributions de caractéristiques.",
    calloutAr: "تسميات التجمعات أعداد صحيحة عشوائية تتغير بين التشغيلات. لا تُثبِّت أبداً 'التجمع 0 = عملاء ذوو قيمة عالية' — دائماً صِف التجمعات بتوزيعات ميزاتها.",
  },

  // ── pca ──────────────────────────────────────────────────────────────────────
  "pca|0": {
    headingFr: "La Malédiction de la Dimensionnalité",
    headingAr: "لعنة الأبعاد",
    textFr: "Avec 1000 caractéristiques, chaque paire de points est presque équidistante (phénomène de « concentration de la mesure »). Les algorithmes basés sur la distance s'effondrent. Visualiser des données haute dimension est impossible. L'entraînement est lent et les modèles sur-apprennent. L'ACP résout cela en trouvant un sous-espace de faible dimension capturant la plupart de la variance — supprimant le bruit, décorrélant les caractéristiques et permettant la visualisation. Une image de 10 000 pixels peut souvent être compressée en 50 composantes ACP avec moins de 5% d'erreur de reconstruction.",
    textAr: "مع 1000 ميزة، كل زوج من النقاط يكون شبه متساوي المسافة (ظاهرة 'تركيز القياس'). تنهار الخوارزميات القائمة على المسافة. تصوير البيانات عالية الأبعاد مستحيل. يستغرق التدريب وقتاً طويلاً والنماذج تُفرط في التعلم. تحل ACP هذا بإيجاد فضاء جزئي منخفض الأبعاد يلتقط معظم التباين — يُزيل الضوضاء ويُزيل ترابط الميزات ويُتيح التصور. صورة بـ10,000 بكسل غالباً تُضغط إلى 50 مكوناً ACP مع أقل من 5% خطأ إعادة بناء.",
    calloutFr: "Le célèbre résultat de l'« espace des visages » : les images de visages humains vivent dans un sous-espace ~50-dimensionnel dans un espace de 50 000 pixels. L'ACP trouve ce sous-espace.",
    calloutAr: "نتيجة 'فضاء الوجوه' الشهيرة: صور الوجوه البشرية تعيش في فضاء جزئي بـ~50 بُعداً ضمن فضاء من 50,000 بكسل. تجد ACP هذا الفضاء الجزئي.",
  },
  "pca|1": {
    headingFr: "La Vue Géométrique",
    headingAr: "المنظور الهندسي",
    textFr: "Imaginez un nuage de points qui ressemble à une ellipse étirée. L'ACP trouve le plus long axe de l'ellipse (CP1 — direction de variance maximale), puis le prochain axe perpendiculaire le plus long (CP2), et ainsi de suite. En projetant sur les premiers composantes principales, on garde les dimensions les plus « étalées » et on rejette les dimensions serrées (qui sont typiquement du bruit). Les composantes principales sont les vecteurs propres de la matrice de covariance des données, ordonnés par leurs valeurs propres (= variance dans chaque direction).",
    textAr: "تخيّل سحابة من النقاط تبدو كإهليلج ممتد. تجد ACP أطول محور للإهليلج (CP1 — اتجاه الحد الأقصى للتباين)، ثم المحور العمودي الأطول التالي (CP2)، وهكذا. بالإسقاط على المكونات الرئيسية الأولى، نحتفظ بالأبعاد الأكثر 'انتشاراً' ونتجاهل المتضامة (عادةً ضوضاء). المكونات الرئيسية هي المتجهات الذاتية لمصفوفة تباين البيانات، مرتبةً بقيمها الذاتية (= التباين في كل اتجاه).",
  },
  "pca|2": {
    headingFr: "Décomposition Propre de la Matrice de Covariance",
    headingAr: "التحلل الذاتي لمصفوفة التباين",
    textFr: "Centrer les données : X̃ = X - μ. Calculer la matrice de covariance p×p Σ = (1/n)X̃ᵀX̃. Décomposer en valeurs propres : Σ = VΛVᵀ où V est orthonormale et Λ est diagonale avec valeurs propres λ₁≥λ₂≥…≥λₚ. Le premier vecteur propre v₁ est la direction de variance maximale. En pratique, scikit-learn utilise la SVD directement sur X̃ (plus stable numériquement que calculer Σ explicitement).",
    textAr: "توسيط البيانات: X̃ = X - μ. حساب مصفوفة التباين p×p Σ = (1/n)X̃ᵀX̃. التحليل الطيفي: Σ = VΛVᵀ حيث V متعامدة معيارية وΛ قطرية بقيم ذاتية λ₁≥λ₂≥…≥λₚ. المتجه الذاتي الأول v₁ هو اتجاه أقصى تباين. عملياً، يستخدم scikit-learn SVD مباشرةً على X̃ (أكثر استقراراً عددياً).",
    formulaLabelFr: "Équation des vecteurs propres — vₖ est une composante principale",
    formulaLabelAr: "معادلة المتجهات الذاتية — vₖ مكوّن رئيسي",
  },
  "pca|3": {
    headingFr: "Choisir le Nombre de Composantes",
    headingAr: "اختيار عدد المكونات",
    textFr: "Tracer le ratio de variance expliquée cumulée. La courbe monte rapidement au début puis s'aplatit. Choisir k là où on atteint 90–95% de variance cumulée — c'est le « coude ». Alternativement, utiliser l'ACP comme prétraitement pour un modèle en aval : ajuster k comme hyperparamètre avec validation croisée. Pour la visualisation, toujours utiliser k=2 ou k=3 indépendamment de la variance expliquée.",
    textAr: "ارسم نسبة التباين التراكمي المُفسَّر. ترتفع المنحنى بسرعة أولاً ثم تتسطح. اختر k حيث تصل إلى 90-95% تباين تراكمي — هذا هو 'الكوع'. بديلاً، استخدم ACP كمعالجة مسبقة لنموذج لاحق: اضبط k كمعامل فائق بالتحقق المتقاطع. للتصور، استخدم دائماً k=2 أو k=3 بصرف النظر عن التباين المُفسَّر.",
    stepsFr: [
      "Calculer explained_variance_ratio_ pour chaque composante",
      "Tracer la somme cumulée — trouver k où cumsum ≥ 0,95",
      "Pour le blanchiment (décorrélation + variance unitaire) : définir whiten=True",
      "Pour les grands ensembles de données : utiliser IncrementalPCA (mini-batch) ou TruncatedSVD (sparse)",
      "Ne jamais appliquer l'ACP avant la division train/test — ajuster uniquement sur les données d'entraînement",
    ],
    stepsAr: [
      "حساب explained_variance_ratio_ لكل مكوّن",
      "رسم المجموع التراكمي — إيجاد k حيث cumsum ≥ 0.95",
      "للتبييض (إزالة الترابط + تباين وحدوي): تعيين whiten=True",
      "للمجموعات الكبيرة: استخدام IncrementalPCA (ميني-دفعة) أو TruncatedSVD (متفرق)",
      "لا تطبق ACP قبل تقسيم التدريب/الاختبار — اضبط على بيانات التدريب فقط",
    ],
  },
  "pca|4": {
    headingFr: "Algorithme ACP",
    headingAr: "خوارزمية ACP",
    stepsFr: [
      "Centrer les données : X̃ = X - mean(X, axis=0)",
      "Calculer la SVD : X̃ = UΣVᵀ (équivalent : décomposer X̃ᵀX̃ en valeurs propres)",
      "Trier les vecteurs propres par valeurs propres décroissantes",
      "Sélectionner les k premiers vecteurs propres : V_k = V[:, :k]",
      "Projeter : Z = X̃ @ V_k → représentation k-dimensionnelle",
      "Reconstruire : X̂ = Z @ V_k.T + mean → mesurer l'erreur de reconstruction",
    ],
    stepsAr: [
      "توسيط البيانات: X̃ = X - mean(X, axis=0)",
      "حساب SVD: X̃ = UΣVᵀ (مكافئ: التحليل الطيفي لـX̃ᵀX̃)",
      "ترتيب المتجهات الذاتية بالقيم الذاتية تنازلياً",
      "اختيار أعلى k متجهات ذاتية: V_k = V[:, :k]",
      "الإسقاط: Z = X̃ @ V_k → تمثيل k-بُعدي",
      "إعادة البناء: X̂ = Z @ V_k.T + mean → قياس خطأ إعادة البناء",
    ],
  },
  "pca|5": {
    headingFr: "ACP avec scikit-learn",
    headingAr: "ACP مع scikit-learn",
    codeFr: `from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
import numpy as np
import matplotlib.pyplot as plt

# ── Données d'exemple ──────────────────────────────────────────────────
X_brut, y = make_classification(n_samples=400, n_features=20,
                                  n_informative=8, random_state=42)
X_train, X_test, _, _ = train_test_split(X_brut, y, test_size=0.2, random_state=42)

# ── Ajuster l'ACP ──────────────────────────────────────────────────
normaliseur = StandardScaler()
X_normalise = normaliseur.fit_transform(X_train)

# ACP complète d'abord pour inspecter la variance
acp_complete = PCA().fit(X_normalise)
var_cumulee = np.cumsum(acp_complete.explained_variance_ratio_)
k = np.argmax(var_cumulee >= 0.95) + 1
print(f"{k} composantes expliquent ≥95% de la variance")

# ACP finale avec k choisi
acp = PCA(n_components=k, random_state=42)
X_acp = acp.fit_transform(X_normalise)          # ajuster sur train uniquement
X_test_acp = acp.transform(normaliseur.transform(X_test))

# ── Erreur de reconstruction ───────────────────────────────────────
X_reconstruit = acp.inverse_transform(X_acp)
erreur_rec = np.mean((X_normalise - X_reconstruit)**2)
print(f"MSE de reconstruction : {erreur_rec:.4f}")

# ── Visualisation 2D ───────────────────────────────────────────────
acp2 = PCA(n_components=2)
X_2d = acp2.fit_transform(X_normalise)
plt.scatter(X_2d[:,0], X_2d[:,1], c=y, cmap='viridis', alpha=0.7)
plt.xlabel(f"CP1 ({acp2.explained_variance_ratio_[0]:.1%})")
plt.ylabel(f"CP2 ({acp2.explained_variance_ratio_[1]:.1%})")`,
  },
  "pca|6": {
    headingFr: "Pièges de l'ACP",
    headingAr: "مزالق ACP",
    textFr: "L'ACP est une méthode linéaire — elle ne peut pas capturer des variétés non linéaires. Utiliser t-SNE ou UMAP pour la réduction de dimension non linéaire lors de la visualisation de structures complexes. Aussi : l'ACP maximise la variance, pas la discrimination — pour la classification, l'Analyse Discriminante Linéaire (ADL) donne souvent une meilleure séparation car elle maximise la variance inter-classes vs intra-classes. Enfin : les composantes principales sont souvent ininterprétables. Si vous avez besoin de caractéristiques interprétables, préférer l'ACP Sparse ou la sélection de caractéristiques.",
    textAr: "ACP طريقة خطية — لا تلتقط التشعبات غير الخطية. استخدم t-SNE أو UMAP لتقليل الأبعاد غير الخطي عند تصور البنى المعقدة. أيضاً: تُعظِّم ACP التباين لا التمييز — للتصنيف، غالباً تعطي التحليل التمييزي الخطي (LDA) فصلاً أفضل. أخيراً: المكونات الرئيسية غالباً غير قابلة للتفسير. إذا احتجت ميزات قابلة للتفسير، فضِّل ACP المتفرقة أو اختيار الميزات.",
    calloutFr: "Ne jamais ajuster l'ACP sur l'ensemble de données complet — ajuster sur les données d'entraînement uniquement et appliquer la même transformation aux données de test. Ajuster sur l'ensemble complet fait fuiter les statistiques de test dans l'entraînement.",
    calloutAr: "لا تضبط ACP على مجموعة البيانات الكاملة — اضبط على بيانات التدريب فقط وطبّق نفس التحويل على بيانات الاختبار. الضبط على المجموعة الكاملة يُسرِّب إحصائيات الاختبار إلى التدريب.",
  },

  // ── anomaly ──────────────────────────────────────────────────────────────────
  "anomaly|0": {
    headingFr: "Pourquoi la Détection d'Anomalies Est Importante",
    headingAr: "لماذا تهم اكتشاف الشذوذات",
    textFr: "La fraude par carte de crédit coûte 32 milliards de dollars par an. Les attaques d'intrusion réseau causent des billions de dommages. Les pannes d'équipements industriels coûtent 50 milliards de dollars par an. La détection d'anomalies est la première ligne de défense critique dans tous ces systèmes. Le défi central : vous avez rarement des exemples étiquetés d'anomalies (elles sont rares par définition), donc la plupart de la détection d'anomalies est non supervisée — vous apprenez seulement ce que « normal » signifie, puis vous signalez les déviations.",
    textAr: "تكلف الاحتيال ببطاقات الائتمان 32 مليار دولار سنوياً. تتسبب هجمات اختراق الشبكة في أضرار بالتريليونات. تكلف أعطال المعدات الصناعية 50 مليار دولار سنوياً. اكتشاف الشذوذات هو خط الدفاع الأول الحاسم في كل هذه الأنظمة. التحدي الأساسي: نادراً ما تمتلك أمثلة مصنّفة للشذوذات (نادرة بطبيعتها)، لذا معظم الاكتشاف غير خاضع للإشراف — تتعلم فقط ما يعنيه 'الطبيعي' ثم تُعلِّم الانحرافات.",
    calloutFr: "En diagnostic médical, un faux négatif (manquer un cancer) est catastrophique ; en détection de fraude, les faux positifs (bloquer de vrais clients) détruisent les revenus. Choisir le bon seuil est une décision métier.",
    calloutAr: "في التشخيص الطبي، السلبي الكاذب (إغفال السرطان) كارثي؛ في اكتشاف الاحتيال، الإيجابيات الكاذبة (حجب عملاء حقيقيين) تدمر الإيرادات. اختيار العتبة الصحيحة قرار تجاري.",
  },
  "anomaly|1": {
    headingFr: "Le Point de Vue Statistique",
    headingAr: "المنظور الإحصائي",
    textFr: "L'intuition la plus simple : les données normales se concentrent dans des régions de haute densité. Les anomalies vivent dans des régions de faible densité. Le Z-Score signale les points à plus de k écarts-types de la moyenne — mais suppose des distributions gaussiennes. Les clôtures IQR sont non paramétriques : elles signalent les points en dehors de 1,5×IQR des quartiles, les rendant robustes aux données non gaussiennes. Les deux sont univariés — ils vérifient chaque caractéristique indépendamment et manquent les anomalies multivariées (une température de 20°C est normale ; une pression de 5 bars est normale ; mais température=20 ET pression=5 ensemble peut être anormal).",
    textAr: "أبسط حدس: البيانات الطبيعية تتمركز في مناطق عالية الكثافة. الشذوذات تعيش في مناطق منخفضة الكثافة. يُعلِّم Z-Score النقاط أبعد من k انحرافات معيارية من المتوسط — لكنه يفترض توزيعات غاوسية. مصطلحات IQR غير معلمية: تُعلِّم النقاط خارج 1.5×IQR من الأرباع، مما يجعلها متينة للبيانات غير الغاوسية. كلاهما أحادي المتغير — يفحص كل ميزة مستقلةً ويُفوِّت الشذوذات متعددة المتغيرات.",
  },
  "anomaly|2": {
    headingFr: "Méthodes Statistiques vs Algorithmiques",
    headingAr: "الأساليب الإحصائية مقابل الخوارزمية",
    textFr: "Le Z-Score et l'IQR sont rapides et interprétables mais supposent l'indépendance et la normalité des caractéristiques. Isolation Forest construit des arbres aléatoires et mesure à quelle vitesse chaque point peut être isolé — les anomalies s'isolent vite car elles sont dans des régions creuses. LOF compare la densité locale de chaque point à celle de ses voisins : si vos voisins sont bien plus denses que vous, vous êtes une anomalie. One-Class SVM trouve la sphère minimale englobant les points normaux. La détection d'anomalies par autoencodeur entraîne un réseau neuronal à reconstruire des données normales — une erreur de reconstruction élevée signale une anomalie.",
    textAr: "Z-Score وIQR سريعان وقابلان للتفسير لكنهما يفترضان استقلالية الميزات وتوزيعها الغاوسي. تبني Isolation Forest أشجاراً عشوائية وتقيس سرعة عزل كل نقطة — تنعزل الشذوذات بسرعة لأنها في مناطق متفرقة. يقارن LOF الكثافة المحلية لكل نقطة بكثافة جيرانها. يجد One-Class SVM الكرة الدنيا المحيطة بالنقاط الطبيعية. يُدرِّب الاكتشاف بالترميز التلقائي شبكةً عصبية على إعادة بناء البيانات الطبيعية — خطأ إعادة بناء عالٍ يُشير إلى شذوذ.",
    calloutFr: "Isolation Forest passe à l'échelle avec des millions de points et gère bien les données haute dimension. LOF est meilleur pour les données groupées à densités variables. Les autoencodeurs excellents pour la détection d'anomalies dans les images et les séries temporelles.",
    calloutAr: "تتوسع Isolation Forest لملايين النقاط وتتعامل جيداً مع البيانات عالية الأبعاد. LOF أفضل للبيانات المجمّعة ذات الكثافات المتغيرة. تتميز شبكات الترميز التلقائي في اكتشاف الشذوذات في الصور والسلاسل الزمنية.",
  },
  "anomaly|3": {
    headingFr: "Algorithme de la Forêt d'Isolation",
    headingAr: "خوارزمية غابة العزل",
    stepsFr: [
      "Construire un ensemble d'arbres d'isolation (arbres binaires aléatoires)",
      "Pour chaque arbre : sélectionner aléatoirement une caractéristique, puis une valeur de division aléatoire",
      "Récurser jusqu'à ce que chaque point soit isolé (seul dans une feuille)",
      "Score d'anomalie = longueur de chemin moyenne à travers tous les arbres",
      "Chemin court → point isolé rapidement → anomalie",
      "Les points normaux nécessitent plus de divisions → chemin moyen plus long",
    ],
    stepsAr: [
      "بناء مجموعة من أشجار العزل (أشجار ثنائية عشوائية)",
      "لكل شجرة: اختيار ميزة عشوائية ثم قيمة تقسيم عشوائية",
      "التكرار حتى عزل كل نقطة (منفردة في ورقة)",
      "درجة الشذوذ = متوسط طول المسار عبر جميع الأشجار",
      "مسار قصير → نقطة تنعزل بسرعة → شذوذ",
      "النقاط الطبيعية تحتاج تقسيمات أكثر → متوسط مسار أطول",
    ],
  },
  "anomaly|4": {
    headingFr: "Détection d'Anomalies avec scikit-learn",
    headingAr: "اكتشاف الشذوذات مع scikit-learn",
    codeFr: `from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor
from sklearn.svm import OneClassSVM
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import make_classification
import numpy as np

# ── Données d'exemple (5 % d'anomalies) ───────────────────────────────
X_normal, _ = make_classification(n_samples=475, n_features=10, random_state=42)
X_anom  = np.random.randn(25, 10) * 4    # 25 anomalies évidentes
X = np.vstack([X_normal, X_anom])
y_vrai = np.array([0]*475 + [1]*25)       # 0=normal, 1=anomalie

X_normalise = StandardScaler().fit_transform(X)

# ── Isolation Forest ───────────────────────────────────────────────
foret = IsolationForest(
    n_estimators=200,
    contamination=0.05,   # fraction attendue d'anomalies
    random_state=42
)
etiq_foret = foret.fit_predict(X_normalise)  # 1=normal, -1=anomalie
scores_foret = foret.score_samples(X_normalise)  # plus bas = plus anormal

# ── Facteur d'Anomalie Locale (LOF) ────────────────────────────────
lof = LocalOutlierFactor(n_neighbors=20, contamination=0.05)
etiq_lof = lof.fit_predict(X_normalise)

# ── Z-Score (univarié, par caractéristique) ─────────────────────────
from scipy import stats
z_scores = np.abs(stats.zscore(X))
masque_anomalies = (z_scores > 3).any(axis=1)

# ── Évaluer avec des étiquettes connues ────────────────────────────
from sklearn.metrics import roc_auc_score, average_precision_score
# Convertir : 1=normal → 0, -1=anomalie → 1
y_pred = (etiq_foret == -1).astype(int)
print(f"AUC-ROC : {roc_auc_score(y_vrai, -scores_foret):.3f}")
print(f"AP :      {average_precision_score(y_vrai, -scores_foret):.3f}")`,
  },
  "anomaly|5": {
    headingFr: "Pièges de la Détection d'Anomalies",
    headingAr: "مزالق اكتشاف الشذوذات",
    textFr: "Le paramètre contamination dans Isolation Forest et LOF contrôle directement le seuil de décision. Si vous définissez contamination=0.05 mais que votre taux réel d'anomalies est 0,1%, vous étiquetterez incorrectement de nombreux points normaux comme anomalies. Calibrer toujours avec la connaissance du domaine. Deuxième piège : la haute dimensionnalité brise le Z-Score et les méthodes basées sur la distance. Appliquer l'ACP en premier quand les caractéristiques > 20. Troisième : la dérive de concept — « normal » change avec le temps. Ré-entraîner ou utiliser la détection d'anomalies en ligne pour les données en flux.",
    textAr: "يتحكم معامل contamination في Isolation Forest وLOF مباشرةً في عتبة القرار. إذا عيّنت contamination=0.05 لكن معدل شذوذاتك الفعلي 0.1%، ستُصنِّف خطأً نقاطاً طبيعية كثيرة كشذوذات. دائماً احسِم مع معرفة المجال. الخطأ الثاني: الأبعاد العالية تكسر Z-Score والأساليب القائمة على المسافة. طبّق ACP أولاً عند الميزات > 20. الثالث: انجراف المفهوم — يتغير 'الطبيعي' مع الزمن. أعِد التدريب أو استخدم الاكتشاف الآني للبيانات المتدفقة.",
    calloutFr: "Ne jamais évaluer la détection d'anomalies avec la précision — le déséquilibre des classes la rend sans signification. Utiliser Précision@k, AUC-PR (aire sous la courbe précision-rappel), ou F1 au seuil choisi.",
    calloutAr: "لا تقيّم اكتشاف الشذوذات بالدقة أبداً — عدم توازن الفئات يجعلها بلا معنى. استخدم Precision@k أو AUC-PR (المساحة تحت منحنى الدقة-الاستدعاء) أو F1 عند العتبة المختارة.",
  },

};

export const keyFormulaI18n_unsupervised: Record<string, KeyFormulaI18n> = {

  // ── clustering ───────────────────────────────────────────────────────────────
  "clustering|0": {
    nameFr: "Objectif K-Means",        nameAr: "هدف K-Means",
    meaningFr: "Minimiser la somme totale des distances au carré intra-cluster aux centroïdes",
    meaningAr: "تقليل مجموع مربعات المسافات الكلية داخل التجمعات إلى المراكز",
  },
  "clustering|1": {
    nameFr: "Point Noyau DBSCAN",      nameAr: "نقطة النواة DBSCAN",
    meaningFr: "Un point est noyau s'il a ≥ MinPts voisins dans le rayon ε",
    meaningAr: "النقطة نواة إذا كان لها ≥ MinPts جاراً ضمن نصف القطر ε",
  },
  "clustering|2": {
    nameFr: "Score de Silhouette",     nameAr: "درجة الصورة الظلية",
    meaningFr: "a = distance intra-cluster, b = distance au cluster le plus proche — plage [-1, 1], 1 = parfait",
    meaningAr: "a = المسافة داخل التجمع، b = المسافة للتجمع الأقرب — المدى [-1, 1]، 1 = مثالي",
  },
  "clustering|3": {
    nameFr: "Inertie",                 nameAr: "القصور الذاتي",
    meaningFr: "Somme des distances au carré de chaque point à son centroïde le plus proche — l'objectif K-Means",
    meaningAr: "مجموع مربعات المسافات من كل نقطة إلى أقرب مركز — هدف K-Means",
  },

  // ── pca ──────────────────────────────────────────────────────────────────────
  "pca|0": {
    nameFr: "Décomposition Propre de Covariance", nameAr: "التحلل الذاتي للتباين المشترك",
    meaningFr: "La matrice de covariance se décompose en vecteurs propres V et valeurs propres Λ",
    meaningAr: "تتحلل مصفوفة التباين المشترك إلى متجهات ذاتية V وقيم ذاتية Λ",
  },
  "pca|1": {
    nameFr: "Projection ACP",          nameAr: "إسقاط ACP",
    meaningFr: "Projeter les données centrées sur les k premiers vecteurs propres — représentation k-dimensionnelle",
    meaningAr: "إسقاط البيانات الموسَّطة على أعلى k متجهات ذاتية — تمثيل k-بُعدي",
  },
  "pca|2": {
    nameFr: "Variance Expliquée",      nameAr: "التباين المُفسَّر",
    meaningFr: "Fraction de la variance totale capturée par la composante principale k",
    meaningAr: "نسبة التباين الكلي الملتقَط بالمكوّن الرئيسي k",
  },
  "pca|3": {
    nameFr: "Reconstruction ACP",      nameAr: "إعادة بناء ACP",
    meaningFr: "Reconstruire l'approximation de x depuis le code z de faible dimension — mesure la perte d'information",
    meaningAr: "إعادة بناء تقريب x من الرمز z منخفض الأبعاد — يقيس فقدان المعلومات",
  },

  // ── anomaly ──────────────────────────────────────────────────────────────────
  "anomaly|0": {
    nameFr: "Z-Score",                 nameAr: "Z-Score",
    meaningFr: "Écarts-types par rapport à la moyenne — |z| > 3 est conventionnellement anormal",
    meaningAr: "انحرافات معيارية عن المتوسط — |z| > 3 يُعدّ شذوذاً بالاتفاق",
  },
  "anomaly|1": {
    nameFr: "Clôture IQR",             nameAr: "سياج IQR",
    meaningFr: "Clôtures de Tukey — les points en dehors de cet intervalle sont des anomalies (IQR = Q3-Q1)",
    meaningAr: "مصطلحات توكي — النقاط خارج هذا النطاق شذوذات (IQR = Q3-Q1)",
  },
  "anomaly|2": {
    nameFr: "Score d'Isolation",       nameAr: "درجة العزل",
    meaningFr: "Isolation Forest : les anomalies ont des longueurs de chemin moyennes plus courtes h(x)",
    meaningAr: "Isolation Forest: الشذوذات لها أطوال مسار متوسطة أقصر h(x)",
  },
  "anomaly|3": {
    nameFr: "Score LOF",               nameAr: "درجة LOF",
    meaningFr: "Facteur d'Anomalie Locale : rapport de densité locale aux densités des voisins",
    meaningAr: "عامل الشذوذ المحلي: نسبة الكثافة المحلية إلى كثافات الجيران",
  },

};

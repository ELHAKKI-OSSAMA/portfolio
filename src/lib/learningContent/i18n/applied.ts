import type { SectionI18n, KeyFormulaI18n } from '../types';

export const sectionI18n_applied: Record<string, SectionI18n> = {

  // ── feature-engineering ──────────────────────────────────────────────────────
  "feature-engineering|0": {
    headingFr: "Pourquoi l'Ingénierie des Caractéristiques Gagne les Compétitions",
    headingAr: "لماذا هندسة الميزات تفوز بالمسابقات",
    textFr: "Andrew Ng a dit : « Trouver de bonnes caractéristiques est difficile, prend du temps et nécessite des connaissances d'experts. Le ML appliqué c'est fondamentalement de l'ingénierie de caractéristiques. » Dans les compétitions Kaggle, les solutions les mieux classées ont systématiquement une meilleure ingénierie de caractéristiques qu'une meilleure architecture de modèle. Un modèle linéaire avec des caractéristiques brillantes bat un réseau profond avec des caractéristiques brutes dans la plupart des problèmes de données tabulaires. Les caractéristiques encodent la connaissance humaine du domaine — elles sont le pont entre la mesure brute et la structure mathématique qu'un modèle peut exploiter.",
    textAr: "قال Andrew Ng: 'إيجاد الميزات صعب ومستهلك للوقت ويتطلب معرفة خبراء. التعلم الآلي التطبيقي هو في الأساس هندسة ميزات.' في مسابقات Kaggle، الحلول الأعلى ترتيباً تمتلك باستمرار هندسة ميزات أفضل من هندسة نماذج أفضل. نموذج خطي بميزات رائعة يتفوق على شبكة عميقة بميزات خام في معظم مسائل البيانات الجدولية. الميزات تُرمِّز المعرفة البشرية بالمجال — هي الجسر بين القياس الخام والبنية الرياضية التي يمكن للنموذج استغلالها.",
    calloutFr: "Dans le Netflix Prize (1 M$), les caractéristiques de l'équipe gagnante incluaient des motifs temporels complexes, des signaux de rétroaction implicite et des interactions de métadonnées de films — pas la sophistication du modèle.",
    calloutAr: "في Netflix Prize (مليون دولار)، تضمنت ميزات الفريق الفائز أنماطاً زمنية معقدة وإشارات ملاحظات ضمنية للمستخدمين وتفاعلات بيانات الأفلام الوصفية — ليس تعقيد النموذج.",
  },
  "feature-engineering|1": {
    headingFr: "La Mentalité Pipeline",
    headingAr: "عقلية خط الأنابيب",
    textFr: "Pensez à l'ingénierie de caractéristiques comme une séquence de transformations : Données brutes → Imputation (remplir les valeurs manquantes) → Encodage (convertir les catégories en nombres) → Mise à l'échelle (mettre les caractéristiques sur des échelles comparables) → Sélection (supprimer les caractéristiques bruitées/redondantes). Chaque étape doit être ajustée uniquement sur les données d'entraînement et appliquée de façon cohérente aux données de test — utiliser les Pipelines scikit-learn pour garantir cela. Un Pipeline est aussi sérialisable, donc votre prétraitement est toujours groupé avec votre modèle pour le déploiement.",
    textAr: "فكّر في هندسة الميزات كسلسلة تحويلات: بيانات خام ← إحلال (ملء القيم الناقصة) ← ترميز (تحويل الفئات لأعداد) ← توسيع (وضع الميزات على مقاييس مقارنة) ← اختيار (حذف الميزات الصاخبة/المتكررة). يجب ضبط كل خطوة على بيانات التدريب فحسب وتطبيقها بشكل متسق على بيانات الاختبار — استخدم Pipelines من scikit-learn لضمان ذلك. الـPipeline قابل للتسلسل أيضاً، لذا معالجتك المسبقة مجمَّعة دائماً مع نموذجك للنشر.",
    calloutFr: "La fuite de données est le bug le plus dangereux en ML : si vos données de test influencent n'importe quelle étape de prétraitement, votre évaluation est un garbage optimiste. Les Pipelines empêchent cela par conception.",
    calloutAr: "تسريب البيانات هو أخطر ثغرة في التعلم الآلي: إذا أثّرت بيانات الاختبار في أي خطوة معالجة مسبقة، فتقييمك محسوب بشكل متفائل خاطئ. تمنع Pipelines ذلك بالتصميم.",
  },
  "feature-engineering|2": {
    headingFr: "Le Pipeline en 5 Étapes",
    headingAr: "خط الأنابيب من 5 مراحل",
    stepsFr: [
      "Imputation : SimpleImputer (moyenne/médiane/mode/constante) ou IterativeImputer (MICE multivarié)",
      "Encodage : OrdinalEncoder pour les catégories ordonnées, OneHotEncoder pour les nominales (drop='first' pour éviter le piège des variables fictives)",
      "Mise à l'échelle : StandardScaler pour les données gaussiennes, RobustScaler quand des anomalies existent, MinMaxScaler pour les entrées bornées",
      "Création de caractéristiques : PolynomialFeatures (x², x·y interactions), décomposition de dates (jour/mois/jour de la semaine), transformées du domaine (log, sqrt)",
      "Sélection : VarianceThreshold, SelectKBest (info mutuelle / chi²), SelectFromModel (importances des arbres), RFECV",
    ],
    stepsAr: [
      "الإحلال: SimpleImputer (متوسط/وسيط/منوال/ثابت) أو IterativeImputer (MICE متعدد المتغيرات)",
      "الترميز: OrdinalEncoder للفئات المرتبة، OneHotEncoder للاسمية (drop='first' لتجنب فخ المتغيرات الوهمية)",
      "التوسيع: StandardScaler للبيانات شبه الغاوسية، RobustScaler عند وجود شواذ، MinMaxScaler للمدخلات المحدودة",
      "إنشاء الميزات: PolynomialFeatures (x²، تفاعلات x·y)، تحليل التواريخ (يوم/شهر/يوم الأسبوع)، تحويلات المجال (log، sqrt)",
      "الاختيار: VarianceThreshold، SelectKBest (معلومات مشتركة / chi²)، SelectFromModel (أهميات الأشجار)، RFECV",
    ],
  },
  "feature-engineering|3": {
    headingFr: "Stratégies d'Encodage Catégoriel",
    headingAr: "استراتيجيات ترميز البيانات الفئوية",
    textFr: "L'encodage One-Hot crée une colonne binaire par catégorie — parfait pour les catégories non ordonnées à peu de valeurs. Avec les catégorielles à haute cardinalité (villes, codes postaux, IDs de produits), OHE explose la dimensionnalité. Utiliser l'Encodage par Cible à la place : remplacer chaque catégorie par la valeur cible moyenne de cette catégorie. Mais l'encodage par cible fuit si pas fait avec des plis de validation croisée. Pour les caractéristiques ordinales (Faible/Moyen/Élevé), toujours utiliser OrdinalEncoder avec l'ordre de catégorie explicite.",
    textAr: "يُنشئ ترميز One-Hot عموداً ثنائياً لكل فئة — مثالي للفئات غير المرتبة ذات القيم القليلة. مع الفئويات عالية الكثافة (المدن، الرموز البريدية، معرفات المنتجات)، يُضخِّم OHE الأبعاد. استخدم Target Encoding بدلاً: استبدل كل فئة بمتوسط قيمة الهدف لتلك الفئة. لكن Target encoding يُسرِّب إذا لم يُنجَز بأطواق تحقق متقاطع. للميزات الترتيبية (منخفض/متوسط/مرتفع)، دائماً استخدم OrdinalEncoder مع ترتيب فئات صريح.",
    calloutFr: "Haute cardinalité + OHE = catastrophe. 10 000 codes postaux → 10 000 colonnes, la plupart presque vides. Utiliser l'encodage par cible, les couches d'embedding ou le feature hashing à la place.",
    calloutAr: "كثافة عالية + OHE = كارثة. 10,000 رمز بريدي → 10,000 عمود، معظمها شبه فارغة. استخدم Target encoding أو طبقات التضمين أو Feature hashing بدلاً.",
  },
  "feature-engineering|4": {
    headingFr: "Choix de Mise à l'Échelle et Leurs Effets",
    headingAr: "خيارات التوسيع وتأثيراتها",
    textFr: "StandardScaler : suppose une distribution gaussienne, rend mean=0 et std=1. Requis pour les SVM, les modèles linéaires régularisés (Lasso/Ridge), l'ACP, KNN, les réseaux de neurones. Pas nécessaire pour les modèles basés sur les arbres (Random Forest, XGBoost — les arbres n'utilisent que l'ordre des caractéristiques, pas la magnitude). MinMaxScaler : nécessaire quand l'algorithme requiert des entrées bornées. RobustScaler : utiliser quand des anomalies sont présentes — met à l'échelle en utilisant la médiane et l'IQR, le rendant robuste aux valeurs extrêmes.",
    textAr: "StandardScaler: يفترض التوزيع الغاوسي، يجعل mean=0 وstd=1. مطلوب لـSVMs والنماذج الخطية المنظَّمة (Lasso/Ridge) وACP وKNN والشبكات العصبية. غير مطلوب للنماذج القائمة على الأشجار (Random Forest، XGBoost — تستخدم فقط ترتيب الميزات لا حجمها). MinMaxScaler: مطلوب عندما يحتاج الخوارزم مدخلات محدودة. RobustScaler: استخدمه عند وجود شواذ — يُعيّر بالوسيط وIQR مما يجعله متيناً للقيم المتطرفة.",
    formulaLabelFr: "RobustScaler — centrage médian avec mise à l'échelle IQR",
    formulaLabelAr: "RobustScaler — توسيط الوسيط مع تعيير IQR",
  },
  "feature-engineering|5": {
    headingFr: "Pipeline sklearn — Exemple Complet",
    headingAr: "خط أنابيب sklearn — مثال كامل",
    codeFr: `from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import (StandardScaler, OneHotEncoder,
                                   RobustScaler, PolynomialFeatures)
from sklearn.impute import SimpleImputer
from sklearn.feature_selection import SelectFromModel
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import cross_val_score, train_test_split
import pandas as pd
import numpy as np

# ── DataFrame d'exemple ────────────────────────────────────────────────
np.random.seed(42)
n = 300
df = pd.DataFrame({
    'age':        np.random.randint(18, 70, n).astype(float),
    'revenu':     np.random.exponential(40000, n),
    'score':      np.random.uniform(300, 850, n),
    'ville':      np.random.choice(['Paris', 'Lyon', 'Toulouse'], n),
    'profession': np.random.choice(['ingénieur', 'enseignant', 'médecin'], n),
    'cible':      np.random.randint(0, 2, n),
})
df.loc[np.random.choice(n, 20, replace=False), 'age'] = np.nan
df.loc[np.random.choice(n, 15, replace=False), 'ville'] = np.nan
X_train = df.drop('cible', axis=1)
y_train = df['cible']

# ── Définir les groupes de colonnes ───────────────────────────────
col_num = ['age', 'revenu', 'score']
col_cat = ['ville', 'profession']

# ── Prétraitement des colonnes numériques ─────────────────────────
transform_num = Pipeline([
    ('imputation', SimpleImputer(strategy='median')),
    ('echelle',    RobustScaler()),
])

# ── Prétraitement des colonnes catégorielles ─────────────────────
transform_cat = Pipeline([
    ('imputation', SimpleImputer(strategy='most_frequent')),
    ('encodage',   OneHotEncoder(handle_unknown='ignore', drop='first')),
])

# ── Combiner avec ColumnTransformer ───────────────────────────────
preprocesseur = ColumnTransformer([
    ('num', transform_num, col_num),
    ('cat', transform_cat, col_cat),
])

# ── Pipeline complet : prétraitement → sélection → modèle ─────────
pipeline = Pipeline([
    ('prep',     preprocesseur),
    ('poly',     PolynomialFeatures(degree=2, interaction_only=True, include_bias=False)),
    ('selection', SelectFromModel(RandomForestClassifier(n_estimators=50), threshold='median')),
    ('clf',       GradientBoostingClassifier(n_estimators=200, learning_rate=0.05)),
])

# Entraîner / évaluer — prétraitement toujours ajusté sur train uniquement
pipeline.fit(X_train, y_train)
scores = cross_val_score(pipeline, X_train, y_train, cv=5, scoring='roc_auc')
print(f"CV AUC : {scores.mean():.3f} ± {scores.std():.3f}")`,
  },
  "feature-engineering|6": {
    headingFr: "Pièges du Prétraitement",
    headingAr: "مزالق المعالجة المسبقة",
    textFr: "Ajuster les normalisateurs sur l'ensemble de données complet (avant la division) est une fuite de données — les statistiques de test contaminent l'entraînement. Toujours ajuster dans un Pipeline ou sur X_train uniquement. Deuxième : OneHotEncoder sur les données de test peut rencontrer des catégories non vues → utiliser handle_unknown='ignore'. Troisième : imputer avec la moyenne avant la division fuit la moyenne du test dans l'entraînement. Quatrième : les caractéristiques polynomiales explosent la mémoire — 100 caractéristiques × degré=2 → 5 050 colonnes. Utiliser interaction_only=True et la sélection de caractéristiques en aval. Cinquième : l'encodage par cible sans validation croisée fuit les informations cibles.",
    textAr: "ضبط المُعيِّرات على مجموعة البيانات الكاملة (قبل التقسيم) تسريب بيانات — إحصائيات الاختبار تلوث التدريب. دائماً اضبط داخل Pipeline أو على X_train فحسب. الثاني: قد يرى OneHotEncoder فئات غير مرئية في بيانات الاختبار ← استخدم handle_unknown='ignore'. الثالث: الإحلال بالمتوسط قبل التقسيم يُسرِّب متوسط الاختبار للتدريب. الرابع: الميزات متعددة الحدود تُفجِّر الذاكرة — 100 ميزة × degree=2 ← 5,050 عموداً. استخدم interaction_only=True مع اختيار الميزات لاحقاً. الخامس: Target encoding بلا تحقق متقاطع يُسرِّب معلومات الهدف.",
    calloutFr: "L'objet Pipeline dans scikit-learn n'est pas seulement pratique — il est requis pour une validation croisée correcte. Tout prétraitement qui 'apprend' des données (normalisateurs, encodeurs, imputeurs) doit être dans le pipeline.",
    calloutAr: "كائن Pipeline في scikit-learn ليس مجرد وسيلة راحة — هو مطلوب للتحقق المتقاطع الصحيح. أي معالجة مسبقة 'تتعلم' من البيانات (مُعيِّرات، مشفِّرات، مُحِلّات) يجب أن تكون داخل الـpipeline.",
  },

  // ── hyperparameter-tuning ────────────────────────────────────────────────────
  "hyperparameter-tuning|0": {
    headingFr: "Pourquoi les Hyperparamètres Importent",
    headingAr: "لماذا تهم المعاملات الفائقة",
    textFr: "Une forêt aléatoire avec max_depth=5 peut scorer 0,72 AUC. Le même algorithme avec max_depth=12, min_samples_leaf=3, max_features='sqrt' score 0,89 AUC. Cet écart de 17 points est pur réglage des hyperparamètres — l'algorithme n'a pas changé, les données non plus. Les hyperparamètres sont des paramètres non appris à partir des données ; ils contrôlent le processus d'apprentissage lui-même. Les choisir correctement fait souvent la différence entre un modèle médiocre et un modèle prêt pour la production.",
    textAr: "غابة عشوائية مع max_depth=5 قد تسجل 0.72 AUC. نفس الخوارزم مع max_depth=12 وmin_samples_leaf=3 وmax_features='sqrt' يسجل 0.89 AUC. هذا الفارق البالغ 17 نقطة هو ضبط معاملات فائقة خالص — لم يتغير الخوارزم ولا البيانات. المعاملات الفائقة هي معاملات لا تُتعلَّم من البيانات؛ تتحكم في عملية التعلم نفسها. اختيارها جيداً غالباً هو الفرق بين نموذج متوسط ونموذج جاهز للإنتاج.",
    calloutFr: "Le taux d'apprentissage est le seul hyperparamètre le plus important dans la plupart des modèles basés sur le gradient. Trop élevé = divergence. Trop bas = convergence lente. Le régler en premier.",
    calloutAr: "معدل التعلم هو أهم معامل فائق مفرد في معظم النماذج القائمة على التدرج. مرتفع جداً = تباعد. منخفض جداً = تقارب بطيء أو حدود دنيا محلية. اضبطه أولاً.",
  },
  "hyperparameter-tuning|1": {
    headingFr: "Grille vs Aléatoire vs Bayésien",
    headingAr: "شبكة مقابل عشوائي مقابل بايزي",
    textFr: "La Recherche par Grille évalue chaque combinaison dans le produit cartésien des valeurs de paramètres — correcte mais exponentiellement coûteuse. La Recherche Aléatoire échantillonne n_iter combinaisons aléatoires — étonnamment efficace car la plupart des espaces d'hyperparamètres n'ont que quelques dimensions qui comptent vraiment ; l'échantillonnage aléatoire les couvre mieux que les grilles. L'Optimisation Bayésienne maintient un modèle probabiliste de la surface d'objectif (Processus Gaussien ou TPE) et suggère séquentiellement des configurations qui maximisent l'amélioration attendue — elle apprend des évaluations précédentes et se concentre sur les régions prometteuses.",
    textAr: "تقيّم بحث الشبكة كل تركيبة في الجداء الديكارتي لقيم المعاملات — صحيح لكن مكلف أُسّياً. يأخذ البحث العشوائي n_iter تركيبات عشوائية — فعّال بشكل مفاجئ لأن معظم فضاءات المعاملات الفائقة لها بُعد فعلي قليل؛ العينات العشوائية تُغطيها بشكل أفضل من الشبكات. يحتفظ التحسين البايزي بنموذج احتمالي للسطح الهدف ويقترح تسلسلياً تهيئات تُعظِّم التحسين المتوقع — يتعلم من التقييمات السابقة ويتمركز حول المناطق الواعدة.",
    calloutFr: "La Recherche Aléatoire avec n_iter=60 surpasse typiquement la Recherche par Grille avec 5× plus d'évaluations. L'Optimisation Bayésienne surpasse les deux quand les évaluations sont coûteuses.",
    calloutAr: "البحث العشوائي مع n_iter=60 يتفوق عادةً على بحث الشبكة مع 5× تقييمات أكثر. التحسين البايزي يتفوق على كليهما عند تكلف التقييمات (مثل تدريب شبكة عصبية كبيرة).",
  },
  "hyperparameter-tuning|2": {
    headingFr: "Boucle d'Optimisation Bayésienne",
    headingAr: "حلقة التحسين البايزي",
    stepsFr: [
      "Ajuster un modèle de substitution (Processus Gaussien) aux observations précédentes (θ, score)",
      "Utiliser la fonction d'acquisition (Amélioration Attendue, UCB) pour sélectionner le prochain θ",
      "AE : explorer où l'incertitude est élevée OU où le gain attendu est élevé",
      "Évaluer l'objectif réel : entraîner le modèle avec θ, calculer le score de VC",
      "Ajouter la nouvelle observation au jeu de données, ré-ajuster le substitut",
      "Répéter jusqu'à épuisement du budget — retourner le meilleur θ trouvé",
    ],
    stepsAr: [
      "ضبط نموذج بديل (عملية غاوسية) على الملاحظات السابقة (θ، الدرجة)",
      "استخدام دالة الاكتساب (التحسين المتوقع، UCB) لاختيار θ التالي",
      "TE: استكشاف حيث عدم اليقين مرتفع أو حيث الكسب المتوقع مرتفع",
      "تقييم الهدف الفعلي: تدريب النموذج مع θ، حساب درجة التحقق المتقاطع",
      "إضافة الملاحظة الجديدة لمجموعة البيانات، إعادة ضبط النموذج البديل",
      "التكرار حتى نفاد الميزانية — إرجاع أفضل θ وُجد",
    ],
  },
  "hyperparameter-tuning|3": {
    headingFr: "Recherche par Réduction de Moitié : Vitesse Sans Sacrifice",
    headingAr: "البحث بالتنصيف: السرعة بلا تضحية",
    textFr: "HalvingGridSearchCV et HalvingRandomSearchCV implémentent la réduction successive de moitié : commencer avec tous les candidats mais des ressources minimales, garder la fraction η supérieure, doubler les ressources, répéter. Une grille de 1024 candidats avec 4 tours de réduction ne nécessite que 1024×1 + 512×2 + 256×4 + 128×8 = 4096 évaluations totales, contre 1024×toutes pour GridSearchCV standard. Cela donne une accélération 10–100× pour les grandes grilles avec une perte de qualité négligeable.",
    textAr: "تُنفِّذ HalvingGridSearchCV وHalvingRandomSearchCV التنصيف المتتالي: البدء بجميع المرشحين لكن موارد دنيا، الاحتفاظ بالكسر η الأعلى، مضاعفة الموارد، التكرار. شبكة من 1024 مرشحاً مع 4 جولات تنصيف تحتاج فقط 4096 تقييماً إجمالياً مقابل 1024×كل شيء لـGridSearchCV القياسي. هذا يعطي تسريعاً 10-100× لشبكات كبيرة مع فقدان جودة ضئيل.",
    calloutFr: "Pour les réseaux de neurones, utiliser Keras Tuner ou Optuna plutôt que la recherche de sklearn — ils supportent les essais parallèles asynchrones, l'intégration d'arrêt anticipé et les espaces de recherche spécifiques aux réseaux.",
    calloutAr: "للشبكات العصبية، استخدم Keras Tuner أو Optuna بدلاً من بحث sklearn — يدعمان التجارب المتوازية غير المتزامنة وتكامل التوقف المبكر وفضاءات البحث الخاصة بالشبكات.",
  },
  "hyperparameter-tuning|4": {
    headingFr: "Les Trois Méthodes dans scikit-learn",
    headingAr: "الأساليب الثلاثة في scikit-learn",
    codeFr: `from sklearn.model_selection import (GridSearchCV, RandomizedSearchCV,
                                       cross_val_score, train_test_split)
from sklearn.experimental import enable_halving_search_cv  # noqa
from sklearn.model_selection import HalvingRandomSearchCV
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.datasets import make_classification
from scipy.stats import uniform, randint
import optuna  # pour l'optimisation bayésienne

# ── Données d'exemple ──────────────────────────────────────────────────
X, y = make_classification(n_samples=600, n_features=10, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

# ── Espace de paramètres ───────────────────────────────────────────
grille_params = {
    'n_estimators':     [100, 200, 400],
    'max_depth':        [3, 5, 7, 9],
    'learning_rate':    [0.01, 0.05, 0.1, 0.2],
    'subsample':        [0.7, 0.8, 1.0],
    'min_samples_leaf': [1, 3, 5],
}

# ── 1. Recherche par Grille (exhaustive, coûteuse) ─────────────────
grille = GridSearchCV(GradientBoostingClassifier(), grille_params,
                      cv=5, scoring='roc_auc', n_jobs=-1)
grille.fit(X_train, y_train)
print(f"Grille meilleur : {grille.best_score_:.4f}  {grille.best_params_}")

# ── 2. Recherche Aléatoire (rapide, presque aussi bonne) ───────────
dist_params = {
    'n_estimators':     randint(50, 500),
    'max_depth':        randint(2, 12),
    'learning_rate':    uniform(0.005, 0.3),
    'subsample':        uniform(0.6, 0.4),
}
aleatoire = RandomizedSearchCV(GradientBoostingClassifier(), dist_params,
                               n_iter=60, cv=5, scoring='roc_auc',
                               n_jobs=-1, random_state=42)
aleatoire.fit(X_train, y_train)
print(f"Aléatoire meilleur : {aleatoire.best_score_:.4f}  {aleatoire.best_params_}")

# ── 3. Optuna (Bayésien, meilleure qualité) ────────────────────────
def objectif(essai):
    params = {
        'n_estimators':  essai.suggest_int('n_estimators', 50, 500),
        'max_depth':     essai.suggest_int('max_depth', 2, 12),
        'learning_rate': essai.suggest_float('learning_rate', 1e-3, 0.3, log=True),
        'subsample':     essai.suggest_float('subsample', 0.5, 1.0),
    }
    modele = GradientBoostingClassifier(**params)
    return cross_val_score(modele, X_train, y_train, cv=3, scoring='roc_auc').mean()

etude = optuna.create_study(direction='maximize')
etude.optimize(objectif, n_trials=100, n_jobs=4)
print(f"Optuna meilleur : {etude.best_value:.4f}  {etude.best_params}")`,
  },
  "hyperparameter-tuning|5": {
    headingFr: "Pièges du Réglage des Hyperparamètres",
    headingAr: "مزالق ضبط المعاملات الفائقة",
    textFr: "Le réglage sur l'ensemble de test gonfle les estimations de performance — toujours régler en utilisant uniquement la validation croisée sur les données d'entraînement. Deuxième : la validation croisée imbriquée est nécessaire pour une estimation non biaisée quand la sélection de modèle et le réglage des hyperparamètres sont tous deux appliqués. Troisième : la « malédiction du vainqueur » — avec 1000 configurations aléatoires, la meilleure sera optimiste par hasard. Utiliser un ensemble de retenue pour vérifier. Quatrième : ne pas tout régler simultanément — fixer le taux d'apprentissage d'abord, puis la régularisation, puis l'architecture.",
    textAr: "الضبط على مجموعة الاختبار يُضخِّم تقديرات الأداء — دائماً اضبط باستخدام التحقق المتقاطع على بيانات التدريب فحسب. الثاني: التحقق المتقاطع المتداخل ضروري للتقدير غير المنحاز عند تطبيق اختيار النموذج وضبط المعاملات معاً. الثالث: 'لعنة الفائز' — مع 1000 تهيئة عشوائية، أفضلها ستكون متفائلة بالصدفة. استخدم مجموعة محتجزة للتحقق. الرابع: لا تضبط كل شيء معاً — ثبّت معدل التعلم أولاً ثم التنظيم ثم البنية.",
    calloutFr: "L'overfitting sur l'ensemble de validation est réel. Avec suffisamment d'essais d'hyperparamètres, vous trouverez une configuration qui score bien accidentellement sur vos plis VC mais généralise mal. Toujours faire une évaluation finale sur un vrai ensemble de test retenu.",
    calloutAr: "الإفراط في التعلم على مجموعة التحقق حقيقي. مع ما يكفي من تجارب المعاملات، ستجد تهيئةً تُسجِّل جيداً عرضاً على أطواق التحقق لكن تُعمِّم بشكل سيئ. دائماً أجرِ تقييماً نهائياً على مجموعة اختبار محتجزة حقاً.",
  },

  // ── naive-bayes ──────────────────────────────────────────────────────────────
  "naive-bayes|0": {
    headingFr: "Pourquoi Apprendre Naïve Bayes ?",
    headingAr: "لماذا نتعلم بايز الساذج؟",
    textFr: "Naïve Bayes classifie les emails de spam mieux que beaucoup de modèles complexes, s'exécute en microsecondes, nécessite presque aucune donnée d'entraînement, gère gracieusement les caractéristiques manquantes et produit des probabilités calibrées. Le filtre anti-spam original de Gmail utilisait Naïve Bayes. C'est la référence pour les problèmes de classification de texte. Le comprendre donne une intuition profonde sur les classificateurs probabilistes et pourquoi une hypothèse « naïve » (indépendance conditionnelle) peut quand même produire des modèles utiles en pratique.",
    textAr: "يُصنِّف Naïve Bayes رسائل البريد المزعج بشكل أفضل من كثير من النماذج المعقدة، يعمل في ميكروثوانٍ، يحتاج بيانات تدريب قليلة جداً، يتعامل بلطف مع الميزات الناقصة، ويُنتج احتمالات مُعايَرة. كان فلتر البريد المزعج الأصلي في Gmail يستخدم Naïve Bayes. هو المرجع القياسي لمسائل تصنيف النصوص. فهمه يمنح حدساً عميقاً حول المصنِّفات الاحتمالية ولماذا فرضية 'الساذج' (الاستقلالية الشرطية) يمكنها رغم ذلك إنتاج نماذج مفيدة.",
    calloutFr: "Malgré l'hypothèse d'indépendance 'naïve' presque toujours fausse en pratique, Naïve Bayes atteint systématiquement une précision de classification proche de l'optimal dans les tâches de classification de texte et de documents.",
    calloutAr: "رغم أن فرضية الاستقلالية 'الساذجة' خاطئة تقريباً دائماً في الواقع، يحقق Naïve Bayes باستمرار دقة تصنيف قريبة من المثالي في مهام تصنيف النصوص والوثائق.",
  },
  "naive-bayes|1": {
    headingFr: "L'Intuition Probabiliste",
    headingAr: "الحدس الاحتمالي",
    textFr: "Supposez que vous voulez classer un email comme Spam ou Légitime. Vous avez vu 1000 emails : 300 étaient du spam. Le mot 'Viagra' apparaît dans 250 des 300 emails spam et seulement 1 des 700 emails légitimes. Le mot 'réunion' apparaît dans 5 spam et 400 légitimes. Pour un nouvel email contenant les deux mots, Naïve Bayes multiplie : P(spam) × P(Viagra|spam) × P(réunion|spam). Ce produit est le posterior non normalisé — comparez-le à P(légitime) × P(Viagra|légitime) × P(réunion|légitime). Le plus grand l'emporte. L'hypothèse 'naïve' rend cette multiplication valide.",
    textAr: "افترض أنك تريد تصنيف بريد إلكتروني كـ'مزعج' أو 'طبيعي'. رأيت 1000 بريد: 300 كانت مزعجة. كلمة 'فياغرا' تظهر في 250 من 300 رسائل مزعجة وفقط 1 من 700 طبيعية. كلمة 'اجتماع' تظهر في 5 مزعجة و400 طبيعية. لبريد جديد يحتوي الكلمتين، يضرب Naïve Bayes: P(مزعج) × P(فياغرا|مزعج) × P(اجتماع|مزعج). هذا الناتج هو الاحتمال الخلفي غير المُطبَّع — قارنه بـP(طبيعي) × P(فياغرا|طبيعي) × P(اجتماع|طبيعي). الأكبر يفوز. الفرضية 'الساذجة' تجعل هذا الضرب صالحاً.",
  },
  "naive-bayes|2": {
    headingFr: "Dérivation de la Règle de Décision",
    headingAr: "اشتقاق قاعدة القرار",
    textFr: "Par le théorème de Bayes : P(C|x) ∝ P(x|C)P(C). L'hypothèse naïve factorise P(x|C) = ∏ P(xⱼ|C). Puisque P(x) est constant entre les classes, on n'a besoin que du numérateur. En prenant les logs (pour la stabilité numérique — les produits de petites probabilités dépassent) : log P(C|x) = log P(C) + Σⱼ log P(xⱼ|C). Pour NB Gaussien, P(xⱼ|C) est une gaussienne avec moyenne et variance estimées par classe. Pour NB Multinomial (texte), P(xⱼ|C) est la fréquence lissée du mot dans la classe C.",
    textAr: "بنظرية بايز: P(C|x) ∝ P(x|C)P(C). الفرضية الساذجة تُفكِّك P(x|C) = ∏ P(xⱼ|C). بما أن P(x) ثابت بين الفئات، نحتاج فقط البسط. بأخذ اللوغاريتم (للاستقرار العددي — ضرب احتمالات صغيرة يُفيض): log P(C|x) = log P(C) + Σⱼ log P(xⱼ|C). في NB الغاوسي، P(xⱼ|C) غاوسية بمتوسط وتباين مُقدَّرَين لكل فئة. في NB متعدد الحدود (النصوص)، P(xⱼ|C) هي تكرار الكلمة المُملَّس في الفئة C.",
    formulaLabelFr: "Règle de décision MAP dans l'espace logarithmique",
    formulaLabelAr: "قاعدة قرار MAP في الفضاء اللوغاريتمي",
  },
  "naive-bayes|3": {
    headingFr: "Lissage de Laplace : Éviter les Probabilités Nulles",
    headingAr: "تمهيد لابلاس: تجنب الاحتمالات الصفرية",
    textFr: "Si un mot n'apparaît jamais dans les emails spam d'entraînement, P(mot|spam)=0 et le produit entier devient 0 — un seul mot non vu fait ignorer toutes les autres preuves. Le lissage de Laplace ajoute α (habituellement 1) à tous les comptes de mots : P(xⱼ|C) = (compte(xⱼ,C) + α) / (compte(C) + α × |V|) où |V| est la taille du vocabulaire. Cela garantit qu'aucune probabilité n'est exactement 0. α plus grand = plus de lissage = plus proche d'une distribution uniforme.",
    textAr: "إذا لم تظهر كلمة قط في رسائل التدريب المزعجة، فإن P(كلمة|مزعج)=0 ويُصبح كامل الناتج صفراً — كلمة واحدة غير مرئية تجعل المصنِّف يتجاهل كل الأدلة الأخرى. يُضيف تمهيد لابلاس α (عادةً 1) لجميع أعداد الكلمات: P(xⱼ|C) = (عدد(xⱼ,C) + α) / (عدد(C) + α × |V|) حيث |V| حجم المفردات. هذا يضمن ألا يكون أي احتمال صفراً تماماً. α أكبر = تمهيد أكثر = أقرب للتوزيع المنتظم.",
    calloutFr: "Le lissage de Laplace est une forme de régularisation L1 dans le simplexe de probabilité. Il empêche le sur-apprentissage sur les mots rares et est crucial pour NB Multinomial sur les données textuelles.",
    calloutAr: "تمهيد لابلاس شكل من أشكال تنظيم L1 في السمبلكس الاحتمالي. يمنع الإفراط في التعلم على الكلمات النادرة وهو حاسم لـNB متعدد الحدود على بيانات النصوص.",
  },
  "naive-bayes|4": {
    headingFr: "Quelle Variante de Naïve Bayes Utiliser ?",
    headingAr: "أي متغير من بايز الساذج تستخدم؟",
    textFr: "GaussianNB : caractéristiques continues supposées gaussiennes par classe. Bon pour les données de capteurs, les mesures médicales. MultinomialNB : caractéristiques de comptage entier (comptes de mots, TF-IDF×N). Standard pour la classification de documents. BernoulliNB : caractéristiques binaires (présence/absence de mots). Bon pour les textes courts. ComplementNB : traite le biais de MultinomialNB sur les données déséquilibrées — souvent le meilleur pour la classification de texte.",
    textAr: "GaussianNB: ميزات مستمرة مفترض أنها غاوسية لكل فئة. جيد لبيانات المستشعرات والقياسات الطبية. MultinomialNB: ميزات أعداد صحيحة (أعداد الكلمات، TF-IDF×N). قياسي لتصنيف الوثائق. BernoulliNB: ميزات ثنائية (وجود/غياب الكلمات). جيد للنصوص القصيرة. ComplementNB: يعالج تحيز MultinomialNB على البيانات غير المتوازنة — غالباً الأفضل لتصنيف النصوص.",
    stepsFr: [
      "Caractéristiques continues → GaussianNB",
      "Comptage de mots / caractéristiques TF-IDF → MultinomialNB (nécessite des valeurs non négatives)",
      "Caractéristiques binaires (mot présent/absent) → BernoulliNB",
      "Classification de texte déséquilibrée → ComplementNB",
      "Types mixtes → utiliser ColumnTransformer + différent NB par type de colonne",
    ],
    stepsAr: [
      "ميزات مستمرة → GaussianNB",
      "أعداد كلمات / ميزات TF-IDF → MultinomialNB (تتطلب قيماً غير سالبة)",
      "ميزات ثنائية (كلمة موجودة/غائبة) → BernoulliNB",
      "تصنيف نصوص غير متوازن → ComplementNB",
      "أنواع مختلطة → استخدام ColumnTransformer + NB مختلف لكل نوع عمود",
    ],
  },
  "naive-bayes|5": {
    headingFr: "Classification de Texte avec Naïve Bayes",
    headingAr: "تصنيف النصوص مع بايز الساذج",
    codeFr: `from sklearn.naive_bayes import MultinomialNB, ComplementNB, GaussianNB
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.calibration import CalibratedClassifierCV
import numpy as np

# ── Données texte d'exemple ────────────────────────────────────────────
X_texte = [
    "acheter des pilules pas chères maintenant",  "devenir riche rapidement",
    "argent gratuit cliquer ici",                 "réunion à 15h demain",
    "rapport trimestriel en pièce jointe",        "déjeuner d'équipe vendredi",
    "gagner un prix inscrivez-vous maintenant",   "offre limitée agissez vite",
    "opportunité d'investissement",               "délai projet semaine prochaine",
    "révision budgétaire planifiée",              "veuillez examiner le document",
] * 20   # 240 exemples
y = np.array(([1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0] * 20))  # 1=spam, 0=ham
X_train, X_test, y_train, y_test = train_test_split(
    X_texte, y, test_size=0.2, random_state=42)

# ── Classification de texte (détection de spam) ───────────────────
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(
        ngram_range=(1,2),       # unigrammes + bigrammes
        max_features=50_000,
        sublinear_tf=True,       # log(1+tf)
        min_df=3,
    )),
    ('clf', ComplementNB(alpha=0.1)),  # meilleur pour le texte
])

scores = cross_val_score(pipeline, X_texte, y, cv=5, scoring='f1_macro')
print(f"F1 : {scores.mean():.3f} ± {scores.std():.3f}")

# ── Probabilités calibrées ─────────────────────────────────────────
# Les probabilités NB sont souvent mal calibrées (trop confiantes)
# Utiliser la calibration isotonique pour de meilleures estimations
pipeline_cal = CalibratedClassifierCV(pipeline, cv=5, method='isotonic')
pipeline_cal.fit(X_train, y_train)
probas = pipeline_cal.predict_proba(X_test)

# ── Caractéristiques continues : GaussianNB ────────────────────────
from sklearn.preprocessing import StandardScaler
gnb = Pipeline([
    ('echelle', StandardScaler()),
    ('clf',     GaussianNB(var_smoothing=1e-9)),
])
gnb.fit(X_train, y_train)
print(f"Précision GaussianNB : {gnb.score(X_test, y_test):.3f}")

# ── Inspecter les paramètres appris ────────────────────────────────
nb = gnb.named_steps['clf']
print("A priori des classes :", nb.class_prior_)
print("Moyennes des caractéristiques par classe :", nb.theta_)`,
  },
  "naive-bayes|6": {
    headingFr: "Pièges de Naïve Bayes",
    headingAr: "مزالق بايز الساذج",
    textFr: "L'hypothèse d'indépendance signifie que les caractéristiques corrélées sont comptées en double. Si 'Viagra' et 'pilule' co-occurrent toujours dans le spam, leurs preuves combinées sont comptées deux fois, conduisant à des posteriors trop confiants. C'est pourquoi les probabilités NB sont généralement mal calibrées même quand les classifications sont correctes — toujours utiliser CalibratedClassifierCV pour les sorties de probabilité. Aussi : MultinomialNB nécessite des caractéristiques non négatives.",
    textAr: "فرضية الاستقلالية تعني أن الميزات المترابطة تُحتسب مرتين. إذا كانت 'فياغرا' و'حبة' تتزامنان دائماً في البريد المزعج، فدليلهما المشترك يُحتسب مرتين مما يؤدي لاحتمالات خلفية مفرطة الثقة. لهذا تكون احتمالات NB عموماً سيئة التعيير حتى حين تكون التصنيفات صحيحة — دائماً استخدم CalibratedClassifierCV للمخرجات الاحتمالية. أيضاً: MultinomialNB يتطلب ميزات غير سالبة.",
    calloutFr: "Naïve Bayes est une excellente référence et souvent difficile à battre sur les petits ensembles de données textuelles. Si elle score 85% et votre modèle complexe 87%, demandez : le gain de 2% vaut-il 10× la complexité et le temps d'entraînement ?",
    calloutAr: "Naïve Bayes خط أساس ممتاز وغالباً يصعب التفوق عليه في مجموعات النصوص الصغيرة. إذا سجّل 85% ونموذجك المعقد 87%، فاسأل: هل يستحق الكسب بنسبة 2% تعقيداً أعلى 10× وزمن تدريب أطول؟",
  },

  // ── time-series ──────────────────────────────────────────────────────────────
  "time-series|0": {
    headingFr: "Les Séries Temporelles Sont Partout",
    headingAr: "السلاسل الزمنية في كل مكان",
    textFr: "Cours boursiers, demande d'électricité, charge CPU des serveurs, trafic web, cas de COVID, météo, ventes — toutes sont des séries temporelles. La différence fondamentale avec le ML standard : les observations sont ordonnées et corrélées. Utiliser les données de demain pour prédire hier viole la causalité. Utiliser une division train/test standard (mélange aléatoire) contamine votre évaluation car les données de test apparaissent dans la période d'entraînement. Les séries temporelles nécessitent une validation croisée temporelle et un ingénierie de caractéristiques temporelles.",
    textAr: "أسعار الأسهم، الطلب على الكهرباء، حمل CPU للخوادم، حركة المرور على الويب، حالات COVID، الطقس، المبيعات — كلها سلاسل زمنية. الاختلاف الجوهري عن التعلم الآلي القياسي: الملاحظات مرتبة ومترابطة. استخدام بيانات الغد للتنبؤ بالأمس ينتهك السببية. التقسيم العشوائي للتدريب/الاختبار يُلوِّث تقييمك لأن بيانات الاختبار تظهر في فترة التدريب. تتطلب السلاسل الزمنية تحققاً متقاطعاً زمنياً وهندسة ميزات زمنية.",
    calloutFr: "Prophet (Meta) et ARIMA sont les standards industriels pour la prévision. Mais le gradient boosting avec des caractéristiques de décalage soigneuses et la validation croisée TimeSeriesSplit surpasse souvent les deux sur les séries temporelles tabulaires.",
    calloutAr: "Prophet (Meta) وARIMA معايير صناعية للتنبؤ. لكن gradient boosting مع ميزات التأخر الدقيقة وتحقق متقاطع TimeSeriesSplit غالباً يتفوق على كليهما في السلاسل الزمنية الجدولية.",
  },
  "time-series|1": {
    headingFr: "Décomposition : Séparer le Signal du Bruit",
    headingAr: "التحليل: فصل الإشارة عن الضوضاء",
    textFr: "La plupart des séries temporelles du monde réel ont trois composantes : Tendance (la direction à long terme — les ventes augmentant sur des années), Saisonnalité (les motifs répétitifs — ventes plus élevées en décembre), et Résidus (bruit aléatoire après la suppression de la tendance et de la saisonnalité). La décomposition additive fonctionne quand l'amplitude saisonnière est constante ; multiplicative quand elle croît avec la tendance. STL (décomposition Saisonnalité-Tendance utilisant LOESS) est l'approche moderne robuste — gère plusieurs périodes de saisonnalité et les anomalies.",
    textAr: "معظم السلاسل الزمنية الحقيقية لها ثلاثة مكونات: الاتجاه (الاتجاه طويل الأمد — ارتفاع المبيعات على مر السنين)، الموسمية (الأنماط المتكررة — مبيعات أعلى في ديسمبر)، والبواقي (ضوضاء عشوائية بعد إزالة الاتجاه والموسمية). التحليل الإضافي يعمل عند ثبات سعة الموسمية؛ التضاعفي عندما تنمو مع الاتجاه. يُعدّ STL (التحليل الموسمي-الاتجاهي باستخدام LOESS) النهج الحديث المتين — يتعامل مع فترات موسمية متعددة والشذوذات.",
  },
  "time-series|2": {
    headingFr: "Créer des Caractéristiques à partir du Temps",
    headingAr: "إنشاء ميزات من الزمن",
    textFr: "Les séries temporelles peuvent être traitées comme du ML supervisé en créant des caractéristiques de décalage et des statistiques glissantes. Caractéristiques de décalage : y_{t-1}, y_{t-2}, ..., y_{t-p} capturent l'autocorrélation. Statistiques glissantes : rolling_mean(window=7), rolling_std, rolling_max capturent la tendance et la volatilité récentes. Caractéristiques calendaires : heure_du_jour, jour_semaine, mois, est_vacances capturent la saisonnalité. Caractéristiques de Fourier : sin(2πt/période), cos(2πt/période) encodent les motifs saisonniers doux.",
    textAr: "يمكن التعامل مع السلاسل الزمنية كتعلم آلي خاضع للإشراف بإنشاء ميزات التأخر والإحصائيات المتدحرجة. ميزات التأخر: y_{t-1}، y_{t-2}، ...، y_{t-p} تلتقط الارتباط الذاتي. الإحصائيات المتدحرجة: rolling_mean(window=7)، rolling_std، rolling_max تلتقط الاتجاه الأخير والتذبذب. ميزات التقويم: ساعة_اليوم، يوم_الأسبوع، الشهر، هل_عطلة تلتقط الموسمية. ميزات فورييه: sin(2πt/الفترة)، cos(2πt/الفترة) تُرمِّز الأنماط الموسمية السلسة.",
    stepsFr: [
      "Créer les décalages : df['lag_1'] = df['y'].shift(1)",
      "Statistiques glissantes : df['roll_mean_7'] = df['y'].rolling(7).mean()",
      "Caractéristiques calendaires : df['jour_semaine'] = df.index.dayofweek",
      "Saisonnalité de Fourier : paires sin/cos pour chaque période saisonnière",
      "Toujours utiliser TimeSeriesSplit — ne jamais mélanger les séries temporelles pour la VC",
      "Écart entre train/validation : ajouter gap= pour éviter la fuite par autocorrélation",
    ],
    stepsAr: [
      "إنشاء التأخرات: df['lag_1'] = df['y'].shift(1)",
      "الإحصائيات المتدحرجة: df['roll_mean_7'] = df['y'].rolling(7).mean()",
      "ميزات التقويم: df['يوم_الأسبوع'] = df.index.dayofweek",
      "الموسمية بفورييه: أزواج sin/cos لكل فترة موسمية",
      "دائماً استخدم TimeSeriesSplit — لا تخلط السلاسل الزمنية للتحقق المتقاطع أبداً",
      "فجوة بين التدريب/التحقق: أضف gap= لتجنب التسريب بالارتباط الذاتي",
    ],
  },
  "time-series|3": {
    headingFr: "TimeSeriesSplit : Validation Croisée Correcte",
    headingAr: "TimeSeriesSplit: التحقق المتقاطع الصحيح",
    stepsFr: [
      "Pli 1 : Train=[t₁…t₃₀₀], Val=[t₃₀₁…t₄₀₀]",
      "Pli 2 : Train=[t₁…t₄₀₀], Val=[t₄₀₁…t₅₀₀]",
      "Pli 3 : Train=[t₁…t₅₀₀], Val=[t₅₀₁…t₆₀₀]",
      "La fenêtre d'entraînement se termine toujours avant la validation — pas de fuite du futur",
      "Option : gap=k entre la fin du train et le début de la val (évite la fuite par autocorrélation)",
      "Option : max_train_size=N pour une fenêtre glissante (seulement les N derniers points en train)",
    ],
    stepsAr: [
      "الطوق 1: تدريب=[t₁…t₃₀₀]، تحقق=[t₃₀₁…t₄₀₀]",
      "الطوق 2: تدريب=[t₁…t₄₀₀]، تحقق=[t₄₀₁…t₅₀₀]",
      "الطوق 3: تدريب=[t₁…t₅₀₀]، تحقق=[t₅₀₁…t₆₀₀]",
      "نافذة التدريب تنتهي دائماً قبل التحقق — لا تسريب من المستقبل",
      "خيار: gap=k بين نهاية التدريب وبداية التحقق (يتجنب التسريب بالارتباط الذاتي)",
      "خيار: max_train_size=N لنافذة متدحرجة (فقط آخر N نقطة في التدريب)",
    ],
  },
  "time-series|4": {
    headingFr: "Prévision avec sklearn + LightGBM",
    headingAr: "التنبؤ مع sklearn + LightGBM",
    codeFr: `import pandas as pd
import numpy as np
import lightgbm as lgb
from sklearn.model_selection import TimeSeriesSplit
from sklearn.metrics import mean_absolute_error

# ── Série temporelle journalière d'exemple ────────────────────────────
dates = pd.date_range('2022-01-01', periods=365, freq='D')
np.random.seed(42)
tendance    = np.linspace(100, 200, 365)
saisonnalite = 20 * np.sin(2 * np.pi * np.arange(365) / 7)
bruit = np.random.randn(365) * 5
df = pd.DataFrame({'ventes': tendance + saisonnalite + bruit}, index=dates)

def creer_caracteristiques(df, col_cible, decalages, fenetres):
    """Créer des caractéristiques de décalage et glissantes pour la prévision supervisée."""
    df = df.copy()
    for lag in decalages:
        df[f'lag_{lag}'] = df[col_cible].shift(lag)
    for f in fenetres:
        df[f'roll_mean_{f}'] = df[col_cible].shift(1).rolling(f).mean()
        df[f'roll_std_{f}']  = df[col_cible].shift(1).rolling(f).std()
    # Caractéristiques calendaires
    df['jour_semaine']  = df.index.dayofweek
    df['mois']          = df.index.month
    df['est_weekend']   = df['jour_semaine'] >= 5
    # Saisonnalité de Fourier (hebdomadaire=7, annuelle=365)
    for k in range(1, 3):
        df[f'sin_sem_{k}'] = np.sin(2*np.pi*k * df.index.dayofyear / 7)
        df[f'cos_sem_{k}'] = np.cos(2*np.pi*k * df.index.dayofyear / 7)
    return df.dropna()

df_feat = creer_caracteristiques(df, 'ventes', decalages=[1,2,3,7,14,28], fenetres=[7,14,28])
X = df_feat.drop('ventes', axis=1)
y = df_feat['ventes']

# ── Validation croisée TimeSeriesSplit ────────────────────────────
tscv = TimeSeriesSplit(n_splits=5, gap=7)  # gap de 7 jours
eam_scores = []

for idx_train, idx_val in tscv.split(X):
    X_tr, X_val = X.iloc[idx_train], X.iloc[idx_val]
    y_tr, y_val = y.iloc[idx_train], y.iloc[idx_val]

    modele = lgb.LGBMRegressor(n_estimators=500, learning_rate=0.05,
                                num_leaves=31, min_child_samples=20)
    modele.fit(X_tr, y_tr,
               eval_set=[(X_val, y_val)],
               callbacks=[lgb.early_stopping(50, verbose=False)])
    eam_scores.append(mean_absolute_error(y_val, modele.predict(X_val)))

print(f"CV EAM : {np.mean(eam_scores):.2f} ± {np.std(eam_scores):.2f}")`,
  },
  "time-series|5": {
    headingFr: "Pièges des Séries Temporelles",
    headingAr: "مزالق السلاسل الزمنية",
    textFr: "Utiliser une division train/test aléatoire sur les données de séries temporelles est l'erreur n°1 — votre modèle s'entraîne sur les données futures, résultant en une évaluation follement optimiste. Toujours utiliser TimeSeriesSplit ou une division temporelle unique. Deuxième : ne pas ajouter d'écart entre les fenêtres train et validation — l'autocorrélation rend le dernier point d'entraînement et le premier point de validation hautement corrélés. Troisième : fuite de caractéristiques — utiliser une moyenne glissante de y sans décalage approprié signifie que les valeurs futures contaminent les caractéristiques actuelles. Toujours shift(1) avant le rolling.",
    textAr: "استخدام تقسيم عشوائي للتدريب/الاختبار على بيانات السلاسل الزمنية هو الخطأ رقم 1 — يتدرب نموذجك على البيانات المستقبلية مما يُنتج تقييماً متفائلاً للغاية. دائماً استخدم TimeSeriesSplit أو تقسيماً زمنياً وحيداً. الثاني: عدم إضافة فجوة بين نوافذ التدريب والتحقق — الارتباط الذاتي يجعل آخر نقطة تدريب وأول نقطة تحقق مترابطتين بشدة. الثالث: تسريب الميزات — استخدام متوسط متدحرج لـy بلا إزاحة مناسبة يعني أن القيم المستقبلية تُلوِّث الميزات الحالية. دائماً shift(1) قبل rolling.",
    calloutFr: "Pour la prévision en production, ré-entraîner votre modèle au fur et à mesure de l'arrivée de nouvelles données. Les modèles précis il y a 6 mois peuvent avoir dérivé avec l'évolution de la distribution de la série temporelle.",
    calloutAr: "للتنبؤ في الإنتاج، أعِد تدريب نموذجك مع وصول بيانات جديدة. النماذج التي كانت دقيقة قبل 6 أشهر قد تكون انجرفت مع تغيّر توزيع السلسلة الزمنية.",
  },

  // ── nlp-text ─────────────────────────────────────────────────────────────────
  "nlp-text|0": {
    headingFr: "La Révolution du NLP",
    headingAr: "ثورة معالجة اللغات الطبيعية",
    textFr: "En 2017, GPT-3 n'existait pas. En 2023, les LLMs écrivent du code, réussissent des examens médicaux et résument des documents juridiques. La fondation de tout le NLP — des filtres anti-spam bag-of-words aux LLMs transformeurs — est la même : représenter le texte numériquement pour que les modèles puissent le traiter. Comprendre le pipeline NLP classique (tokeniser → vectoriser → modèle → évaluer) vous donne le modèle mental pour comprendre pourquoi les transformeurs modernes fonctionnent et en quoi ils diffèrent.",
    textAr: "في 2017، لم يكن GPT-3 موجوداً. في 2023، تكتب نماذج LLM الكود وتجتاز الامتحانات الطبية وتُلخِّص الوثائق القانونية. أساس كل معالجة للغات الطبيعية — من فلاتر البريد المزعج bag-of-words إلى LLMs المحولات — واحد: تمثيل النص عددياً حتى تتمكن النماذج من معالجته. فهم خط أنابيب NLP الكلاسيكي (تجزئة ← تجهيز ← نموذج ← تقييم) يمنحك النموذج الذهني لفهم سبب نجاح المحولات الحديثة.",
    calloutFr: "Le rapport technique GPT-4 montre que le modèle entraîné sur 100× plus de texte que GPT-3 bénéficie encore du prétraitement NLP classique (tokenisation, déduplication, filtrage de la qualité des données). Les fondamentaux comptent à l'échelle.",
    calloutAr: "يُظهر التقرير التقني لـGPT-4 أن النموذج المدرَّب على 100× بيانات أكثر من GPT-3 لا يزال يستفيد من المعالجة المسبقة الكلاسيكية لـNLP (التجزئة، إزالة التكرار، تصفية جودة البيانات). الأساسيات مهمة على نطاق واسع.",
  },
  "nlp-text|1": {
    headingFr: "Le Pipeline NLP : 5 Étapes",
    headingAr: "خط أنابيب NLP: 5 مراحل",
    textFr: "Le texte brut n'est que des octets Unicode — sans signification pour un modèle. Le pipeline NLP le convertit en nombres : Tokenisation (diviser le texte en tokens — mots, sous-mots ou caractères), Construction du vocabulaire (assigner un entier ID à chaque token unique), Vectorisation (convertir les IDs de tokens en représentations numériques denses — one-hot, TF-IDF, ou word embeddings), Entraînement du modèle (classer, regrouper, générer ou récupérer), Évaluation (précision, F1, BLEU, perplexité selon la tâche).",
    textAr: "النص الخام مجرد بايتات Unicode — بلا معنى لنموذج. يحوّله خط أنابيب NLP إلى أرقام: التجزئة (تقسيم النص إلى رموز — كلمات أو أجزاء كلمات أو أحرف)، بناء المفردات (تعيين معرف صحيح لكل رمز فريد)، التجهيز (تحويل معرفات الرموز لتمثيلات عددية كثيفة — one-hot أو TF-IDF أو تضمينات كلمات)، تدريب النموذج (تصنيف أو تجميع أو توليد أو استرجاع)، التقييم (الدقة، F1، BLEU، الحيرة حسب المهمة).",
  },
  "nlp-text|2": {
    headingFr: "TF-IDF : Le Vectoriseur Classique",
    headingAr: "TF-IDF: المتجهي الكلاسيكي",
    textFr: "Fréquence du Terme (TF) : à quelle fréquence le mot t apparaît-il dans le document d ? Fréquence du Document (DF) : combien de documents contiennent t ? IDF inverse : log(N/DFt) — les mots qui apparaissent dans chaque document (le, est, de) obtiennent un IDF presque nul. Les mots spécifiques à quelques documents obtiennent un IDF élevé. TF-IDF = TF × IDF. Le résultat est une matrice creuse de forme (n_docs × vocab_size) où chaque entrée reflète combien ce mot est caractéristique de ce document.",
    textAr: "تكرار المصطلح (TF): كم مرة تظهر الكلمة t في الوثيقة d؟ تكرار الوثيقة (DF): كم وثيقة تحتوي t؟ IDF العكسي: log(N/DFt) — الكلمات التي تظهر في كل وثيقة (الـ، من، في) تحصل على IDF قريب من الصفر. الكلمات الخاصة بوثائق قليلة تحصل على IDF مرتفع. TF-IDF = TF × IDF. النتيجة مصفوفة متفرقة بشكل (n_docs × حجم_المفردات) حيث تعكس كل خلية مدى خصوصية تلك الكلمة لتلك الوثيقة.",
    formulaLabelFr: "IDF lissé (+1 évite la division par zéro)",
    formulaLabelAr: "IDF مُلسَّن (+1 يمنع القسمة على صفر)",
  },
  "nlp-text|3": {
    headingFr: "Du Sac de Mots aux Embeddings de Mots",
    headingAr: "من حقيبة الكلمات إلى التضمينات الكلمية",
    textFr: "TF-IDF traite chaque mot comme indépendant — 'banque' et 'établissement financier' sont complètement non liés. Les word embeddings (Word2Vec, GloVe, FastText) apprennent des représentations vectorielles denses où les mots similaires sont proches dans l'espace vectoriel : roi - homme + femme ≈ reine. Ces vecteurs de 300 dimensions capturent des relations sémantiques que TF-IDF ne peut pas. Les transformeurs de phrases modernes (SBERT, all-MiniLM-L6-v2) produisent des vecteurs de longueur fixe pour des phrases entières, permettant la recherche sémantique, le clustering et la classification zéro-shot.",
    textAr: "يتعامل TF-IDF مع كل كلمة كمستقلة — 'بنك' و'مؤسسة مالية' غير مرتبطتان تماماً. تتعلم تضمينات الكلمات (Word2Vec، GloVe، FastText) تمثيلات متجهية كثيفة حيث الكلمات المتشابهة قريبة في الفضاء المتجهي: ملك - رجل + امرأة ≈ ملكة. تلتقط هذه المتجهات الـ300-بُعدية علاقات دلالية لا يستطيع TF-IDF التقاطها. تُنتج محولات الجمل الحديثة (SBERT، all-MiniLM-L6-v2) متجهات بطول ثابت لجمل كاملة تُتيح البحث الدلالي والتجميع والتصنيف الصفري.",
    calloutFr: "Pour la classification de texte en production en 2025 : commencer par TF-IDF + LogisticRegression comme référence, essayer ensuite les embeddings sentence-transformers + classificateur, puis affiner un BERT/DistilBERT pré-entraîné si la qualité est insuffisante.",
    calloutAr: "لتصنيف النصوص في الإنتاج في 2025: ابدأ بـTF-IDF + LogisticRegression كخط أساس، ثم جرّب تضمينات sentence-transformers + مصنِّف، ثم اضبط BERT/DistilBERT مدرَّباً مسبقاً إذا كانت الجودة لا تزال غير كافية.",
  },
  "nlp-text|4": {
    headingFr: "Pipeline de Classification de Texte",
    headingAr: "خط أنابيب تصنيف النصوص",
    stepsFr: [
      "Mise en minuscules, suppression de la ponctuation, suppression optionnelle des mots vides",
      "Tokenisation : word_tokenize ou sous-mot (BPE/WordPiece pour les transformeurs)",
      "Vectorisation : CountVectorizer → TfidfVectorizer → word2vec → embeddings BERT",
      "Modèle : MultinomialNB (référence rapide), LogisticRegression (linéaire fort), SVM, BERT affiné",
      "Évaluation : macro-F1 pour les classes équilibrées, F1-pondéré pour les déséquilibrées, AUC-ROC",
      "Analyse d'erreurs : inspecter les échantillons mal classifiés → améliorer les caractéristiques ou l'étiquetage",
    ],
    stepsAr: [
      "التحويل لأحرف صغيرة، إزالة علامات الترقيم، إزالة كلمات التوقف اختيارياً",
      "التجزئة: word_tokenize أو جزء كلمة (BPE/WordPiece للمحولات)",
      "التجهيز: CountVectorizer ← TfidfVectorizer ← word2vec ← تضمينات BERT",
      "النموذج: MultinomialNB (خط أساس سريع)، LogisticRegression (خطي قوي)، SVM، BERT المضبوط",
      "التقييم: macro-F1 للفئات المتوازنة، weighted-F1 للغير متوازنة، AUC-ROC",
      "تحليل الأخطاء: فحص العينات المُصنَّفة خطأً ← تحسين الميزات أو التسمية",
    ],
  },
  "nlp-text|5": {
    headingFr: "Pipeline de Classification NLP Complet",
    headingAr: "خط أنابيب تصنيف NLP الكامل",
    codeFr: `from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import ComplementNB
from sklearn.svm import LinearSVC
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.metrics import classification_report
import numpy as np

# ── Données texte d'exemple ────────────────────────────────────────────
corpus = [
    "algorithmes apprentissage automatique python science données",
    "réseau neuronal deep learning pytorch tensorflow",
    "traitement langage naturel classification texte bert",
    "vision par ordinateur reconnaissance image convolutif",
    "apprentissage par renforcement récompense politique agent",
    "prétraitement données ingénierie caractéristiques pipeline",
] * 40   # 240 exemples, 6 classes
X_texte = corpus
y = np.array(list(range(6)) * 40)
X_train, X_test, y_train, y_test = train_test_split(
    X_texte, y, test_size=0.2, stratify=y, random_state=42)
idx_train = np.arange(len(X_train))
idx_test  = np.arange(len(X_test))

# ── Référence : TF-IDF + Régression Logistique ────────────────────
pipeline_lr = Pipeline([
    ('tfidf', TfidfVectorizer(
        ngram_range=(1,2),
        max_features=100_000,
        sublinear_tf=True,          # log(1+tf) amortit les hautes fréquences
        strip_accents='unicode',
        analyzer='word',
        token_pattern=r'\\w{2,}',  # ignorer les tokens d'un caractère
        min_df=2,                   # ignorer les mots très rares
    )),
    ('clf', LogisticRegression(C=1.0, max_iter=1000, class_weight='balanced')),
])

# ── Alternative : TF-IDF + LinearSVC (rapide, excellent pour le texte) ──
pipeline_svm = Pipeline([
    ('tfidf', TfidfVectorizer(ngram_range=(1,2), max_features=100_000, sublinear_tf=True)),
    ('clf',   LinearSVC(C=0.5, class_weight='balanced', max_iter=2000)),
])

# ── Évaluer les deux avec validation croisée ─────────────────────
for nom, pipeline in [('LR', pipeline_lr), ('SVM', pipeline_svm)]:
    scores = cross_val_score(pipeline, X_texte, y, cv=5, scoring='f1_macro', n_jobs=-1)
    print(f"{nom}: macro-F1 = {scores.mean():.3f} ± {scores.std():.3f}")

# ── Approche moderne : embeddings de phrases ─────────────────────
from sentence_transformers import SentenceTransformer
from sklearn.linear_model import LogisticRegression

encodeur = SentenceTransformer('all-MiniLM-L6-v2')
X_emb = encodeur.encode(X_texte, batch_size=256, show_progress_bar=True)
clf = LogisticRegression(max_iter=1000).fit(X_emb[idx_train], y[idx_train])
print(f"Précision Sentence-BERT : {clf.score(X_emb[idx_test], y[idx_test]):.3f}")`,
  },
  "nlp-text|6": {
    headingFr: "Pièges du Pipeline NLP",
    headingAr: "مزالق خط أنابيب NLP",
    textFr: "Ajuster TfidfVectorizer sur l'ensemble de données complet fuit le vocabulaire de test dans l'entraînement — les valeurs IDF sont calculées avec les fréquences de documents de test. Toujours ajuster dans un Pipeline appliqué uniquement aux données d'entraînement. Deuxième : utiliser max_features sans min_df — les mots très rares sont bruiteux mais inclus. Définir min_df=2 ou min_df=0,001. Troisième : ignorer le déséquilibre des classes — une classe majoritaire à 95% rend la précision inutile ; utiliser macro-F1 et class_weight='balanced'. Quatrième : ne pas stemmer/lemmatiser pour les petits ensembles de données — 'courir', 'courant', 'couru' devraient mapper vers la même caractéristique.",
    textAr: "ضبط TfidfVectorizer على مجموعة البيانات الكاملة يُسرِّب مفردات الاختبار للتدريب — قيم IDF تُحسب مع تكرارات وثائق الاختبار. دائماً اضبط داخل Pipeline مُطبَّق على بيانات التدريب فحسب. الثاني: استخدام max_features بلا min_df — الكلمات النادرة جداً صاخبة لكن مُدرَجة. عيِّن min_df=2 أو min_df=0.001. الثالث: تجاهل عدم توازن الفئات — فئة أغلبية بنسبة 95% تجعل الدقة عديمة الفائدة؛ استخدم macro-F1 وclass_weight='balanced'. الرابع: عدم التجذير/التأصيل للمجموعات الصغيرة — 'يركض'، 'ركض'، 'راكض' يجب أن تُعيَّن لنفس الميزة.",
    calloutFr: "Pour le texte non anglais, utiliser des tokeniseurs spécifiques à la langue et des modèles multilingues pré-entraînés (mBERT, XLM-RoBERTa) plutôt que des pipelines centrés sur l'anglais. De nombreuses bibliothèques NLP utilisent silencieusement le comportement anglophone par défaut.",
    calloutAr: "للنصوص غير الإنجليزية، استخدم مجزِّئات خاصة باللغة ونماذج متعددة اللغات مدرَّبة مسبقاً (mBERT، XLM-RoBERTa) بدلاً من خطوط الأنابيب المتمركزة حول الإنجليزية. كثير من مكتبات NLP تستخدم بصمت سلوك الإنجليزية افتراضياً.",
  },

};

export const keyFormulaI18n_applied: Record<string, KeyFormulaI18n> = {

  // ── feature-engineering ──────────────────────────────────────────────────────
  "feature-engineering|0": {
    nameFr: "StandardScaler",          nameAr: "StandardScaler",
    meaningFr: "Moyenne nulle, variance unitaire — sensible aux valeurs aberrantes",
    meaningAr: "متوسط صفري، تباين وحدوي — حساس للشواذ",
  },
  "feature-engineering|1": {
    nameFr: "MinMaxScaler",            nameAr: "MinMaxScaler",
    meaningFr: "Mise à l'échelle vers [0,1] — préserve la sparsité, sensible aux valeurs aberrantes",
    meaningAr: "القياس إلى [0,1] — يحافظ على التفرق، حساس للشواذ",
  },
  "feature-engineering|2": {
    nameFr: "RobustScaler",            nameAr: "RobustScaler",
    meaningFr: "Mise à l'échelle utilisant médiane et IQR — robuste aux valeurs aberrantes",
    meaningAr: "القياس باستخدام الوسيط وIQR — متين للشواذ",
  },
  "feature-engineering|3": {
    nameFr: "Transformation Logarithmique", nameAr: "التحويل اللوغاريتمي",
    meaningFr: "Compresse les distributions asymétriques — utile pour les revenus, les comptes de population",
    meaningAr: "يضغط التوزيعات المائلة — مفيد للدخول وأعداد السكان",
  },

  // ── hyperparameter-tuning ────────────────────────────────────────────────────
  "hyperparameter-tuning|0": {
    nameFr: "Recherche par Grille",    nameAr: "بحث الشبكة",
    meaningFr: "Recherche exhaustive sur toutes les combinaisons de la grille prédéfinie",
    meaningAr: "بحث شامل على جميع التركيبات في الشبكة المحددة مسبقاً",
  },
  "hyperparameter-tuning|1": {
    nameFr: "Réduction Successive de Moitié", nameAr: "التنصيف المتتالي",
    meaningFr: "Éliminer progressivement les mauvais candidats, allouer plus de ressources aux prometteurs",
    meaningAr: "استبعاد المرشحين الضعفاء تدريجياً مع تخصيص موارد أكثر للواعدين",
  },
  "hyperparameter-tuning|2": {
    nameFr: "Amélioration Attendue",   nameAr: "التحسين المتوقع",
    meaningFr: "Fonction d'acquisition de l'Optimisation Bayésienne — équilibre exploration vs exploitation",
    meaningAr: "دالة الاكتساب للتحسين البايزي — توازن الاستكشاف مقابل الاستغلال",
  },

  // ── naive-bayes ──────────────────────────────────────────────────────────────
  "naive-bayes|0": {
    nameFr: "Théorème de Bayes",       nameAr: "نظرية بايز",
    meaningFr: "Posterior = Vraisemblance × A priori / Evidence",
    meaningAr: "الاحتمال الخلفي = الاحتمالية × المسبق / الدليل",
  },
  "naive-bayes|1": {
    nameFr: "Hypothèse Naïve",         nameAr: "الفرضية الساذجة",
    meaningFr: "Les caractéristiques sont conditionnellement indépendantes étant donné la classe — la partie 'naïve'",
    meaningAr: "الميزات مستقلة شرطياً بإعطاء الفئة — الجزء 'الساذج'",
  },
  "naive-bayes|2": {
    nameFr: "Décision MAP",            nameAr: "قرار MAP",
    meaningFr: "Maximum a posteriori — supprimer P(x) puisqu'il est identique pour toutes les classes",
    meaningAr: "الأعظمية الخلفية — تجاهل P(x) لأنه متساوٍ لجميع الفئات",
  },
  "naive-bayes|3": {
    nameFr: "Vraisemblance Gaussienne", nameAr: "الاحتمالية الغاوسية",
    meaningFr: "NB Gaussien suppose que chaque caractéristique est normalement distribuée dans chaque classe",
    meaningAr: "يفترض NB الغاوسي أن كل ميزة موزَّعة توزيعاً طبيعياً داخل كل فئة",
  },

  // ── time-series ──────────────────────────────────────────────────────────────
  "time-series|0": {
    nameFr: "Décomposition",           nameAr: "التحليل",
    meaningFr: "Additif : tendance + saisonnalité + résidus. Multiplicatif : T × S × R quand les amplitudes s'adaptent",
    meaningAr: "إضافي: اتجاه + موسمية + بواقي. تضاعفي: T × S × R عند نمو السعات مع الاتجاه",
  },
  "time-series|1": {
    nameFr: "Modèle AR(p)",            nameAr: "نموذج AR(p)",
    meaningFr: "Autorégressif : la valeur actuelle est une combinaison linéaire de p valeurs passées",
    meaningAr: "الانحدار الذاتي: القيمة الحالية مزيج خطي من p قيم سابقة",
  },
  "time-series|2": {
    nameFr: "Fonction d'Autocorrélation", nameAr: "دالة الارتباط الذاتي (ACF)",
    meaningFr: "FCA — à quel point la série est-elle corrélée avec son décalage de k pas ?",
    meaningAr: "ACF — مدى ارتباط السلسلة مع تأخرها بمقدار k خطوة؟",
  },
  "time-series|3": {
    nameFr: "MAPE",                    nameAr: "MAPE",
    meaningFr: "Erreur Absolue Moyenne en Pourcentage — métrique de prévision sans échelle",
    meaningAr: "متوسط الخطأ المطلق النسبي — مقياس توقع مستقل عن المقياس",
  },

  // ── nlp-text ─────────────────────────────────────────────────────────────────
  "nlp-text|0": {
    nameFr: "TF-IDF",                  nameAr: "TF-IDF",
    meaningFr: "Fréquence du terme × inverse de la fréquence du document — élevé quand le mot est fréquent dans le doc mais rare globalement",
    meaningAr: "تكرار المصطلح × عكس تكرار الوثيقة — مرتفع عند تكرار الكلمة في الوثيقة لكن ندرتها عالمياً",
  },
  "nlp-text|1": {
    nameFr: "Similarité Cosinus",      nameAr: "تشابه جيب التمام",
    meaningFr: "Mesure de similarité des documents indépendante de la longueur du document",
    meaningAr: "مقياس تشابه الوثائق مستقل عن طول الوثيقة",
  },
  "nlp-text|2": {
    nameFr: "Perplexité",              nameAr: "الحيرة",
    meaningFr: "Qualité du modèle de langage — perplexité plus faible = meilleure prédiction du prochain mot",
    meaningAr: "جودة نموذج اللغة — حيرة أقل = تنبؤ أفضل بالكلمة التالية",
  },

};

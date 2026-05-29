import type { SectionI18n, KeyFormulaI18n } from '../types';

export const sectionI18n_foundations: Record<string, SectionI18n> = {

  // ── python-ml-stack ──────────────────────────────────────────────────────────
  "python-ml-stack|0": {
    headingFr: "Pourquoi Cette Pile Avant Tout",
    headingAr: "لماذا هذه الأدوات قبل كل شيء",
    textFr: "Chaque framework ML — scikit-learn, PyTorch, TensorFlow, JAX — repose sur les tableaux NumPy. Comprendre comment les tableaux fonctionnent en mémoire (disposition C contiguë, dtype, strides) est la différence entre écrire des boucles Python en O(n²) et des opérations NumPy vectorisées en O(n) qui s'exécutent à la vitesse du C. Pandas vous donne des DataFrames étiquetés pour les données réelles désordonnées, et Matplotlib/Seaborn vous permettent de voir ce qui se passe avant de modéliser. L'écosystème ML tout entier parle NumPy — le maîtriser, c'est maîtriser la lingua franca.",
    textAr: "كل إطار عمل للتعلم الآلي — scikit-learn وPyTorch وTensorFlow وJAX — يعتمد على مصفوفات NumPy. فهم كيفية عمل المصفوفات في الذاكرة هو الفرق بين كتابة حلقات Python بتعقيد O(n²) وعمليات NumPy المتجهة بتعقيد O(n) التي تعمل بسرعة لغة C. يمنحك Pandas إطارات البيانات للبيانات الفوضوية الحقيقية، وتتيح لك Matplotlib/Seaborn رؤية ما يحدث قبل النمذجة. النظام البيئي بأكمله يتحدث NumPy — إتقانه يعني إتقان اللغة المشتركة.",
    calloutFr: "Une boucle Python sur 10 millions de nombres prend ~4 secondes. np.sum() prend ~8ms — 500× plus rapide. C'est crucial lors du calcul des gradients sur un réseau de neurones.",
    calloutAr: "حلقة Python على 10 ملايين رقم تستغرق ~4 ثوانٍ. np.sum() تستغرق ~8ms — أسرع 500 مرة. هذا يهم عند حساب التدرجات في شبكة عصبية.",
  },
  "python-ml-stack|1": {
    headingFr: "Essentiels NumPy — Ce Dont Vous Avez Vraiment Besoin",
    headingAr: "أساسيات NumPy — ما تحتاجه فعلاً",
    stepsFr: [
      "Création de tableaux : np.array(), np.zeros(), np.ones(), np.linspace(), np.arange(), np.random.randn()",
      "Manipulation de forme : .reshape(), .T (transposé), np.concatenate(), np.stack(), np.squeeze()",
      "Maths vectorisées : +, -, *, / diffusent élément par élément ; np.dot() / @ pour la multiplication matricielle",
      "Indexation : arr[2:5], arr[arr > 0] (masque booléen), arr[:, 0] (tranche colonne)",
      "Agrégations : .sum(), .mean(), .std(), .max(), .argmax() — tous acceptent le paramètre axis=",
      "Règle de diffusion : aligner les formes par la droite, les dimensions doivent correspondre ou être 1",
    ],
    stepsAr: [
      "إنشاء المصفوفات: np.array(), np.zeros(), np.ones(), np.linspace(), np.arange(), np.random.randn()",
      "معالجة الأشكال: .reshape(), .T (نقل)، np.concatenate()، np.stack()، np.squeeze()",
      "العمليات الرياضية المتجهة: +، -، *، / تعمل عنصراً بعنصر؛ np.dot() / @ لضرب المصفوفات",
      "الفهرسة: arr[2:5]، arr[arr > 0] (قناع منطقي)، arr[:, 0] (شريحة عمود)",
      "التجميعات: .sum()، .mean()، .std()، .max()، .argmax() — تقبل جميعها معامل axis=",
      "قاعدة البث: محاذاة الأشكال من اليمين، يجب تطابق الأبعاد أو أن تكون 1",
    ],
  },
  "python-ml-stack|2": {
    headingFr: "NumPy, Pandas & Matplotlib — Workflow Complet",
    headingAr: "NumPy, Pandas & Matplotlib — سير العمل الكامل",
    codeFr: `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# ── NumPy : tableaux, broadcasting, opérations vectorisées ───────────────────
X = np.random.randn(1000, 5)          # 1000 échantillons, 5 variables
y = 2*X[:,0] - X[:,1] + 0.5*np.random.randn(1000)

print(X.shape, X.dtype)               # (1000, 5) float64
print(X.mean(axis=0).round(3))        # moyennes par variable ≈ 0
print(X.std(axis=0).round(3))         # écarts-types par variable ≈ 1

# Broadcasting : soustraire la moyenne et diviser par l'écart-type (StandardScaler manuel)
X_scaled = (X - X.mean(axis=0)) / X.std(axis=0)

# Multiplication matricielle : X @ W où W est 5×2
W = np.random.randn(5, 2)
Z = X_scaled @ W                       # forme (1000, 2)

# Indexation booléenne
high_income = X[X[:,0] > 1.0]         # lignes où la variable 0 > 1σ
print(f"Lignes à revenu élevé : {len(high_income)}")

# ── Pandas : DataFrames, EDA ─────────────────────────────────────────────────
df = pd.DataFrame(X, columns=[f"var_{i}" for i in range(5)])
df["cible"] = y

# EDA rapide
print(df.describe().round(2))          # count, mean, std, quartiles
print(df.isnull().sum())               # vérifier les valeurs manquantes
print(df.dtypes)

# Exemple de groupby
df["groupe"] = np.where(df["var_0"] > 0, "élevé", "faible")
print(df.groupby("groupe")["cible"].agg(["mean","std"]).round(3))

# Corrélations
corr = df.drop(columns="groupe").corr()
print(corr["cible"].sort_values(ascending=False).round(3))

# ── Matplotlib / Seaborn : visualisation ─────────────────────────────────────
fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# 1. Distribution de la cible
axes[0].hist(df["cible"], bins=50, color="#6c63ff", alpha=0.8, edgecolor="white")
axes[0].set_title("Distribution de la cible")
axes[0].set_xlabel("y")

# 2. Nuage de points + droite de régression
axes[1].scatter(df["var_0"], df["cible"], alpha=0.3, s=10, color="#06b6d4")
m, b = np.polyfit(df["var_0"], df["cible"], 1)
x_line = np.linspace(-3, 3, 100)
axes[1].plot(x_line, m*x_line + b, color="#ff6b6b", lw=2, label=f"pente={m:.2f}")
axes[1].set_title("Variable 0 vs Cible")
axes[1].legend()

# 3. Carte de chaleur des corrélations
sns.heatmap(corr, annot=True, fmt=".2f", cmap="coolwarm",
            center=0, ax=axes[2], cbar=False)
axes[2].set_title("Matrice de corrélation")

plt.tight_layout()`,
  },
  "python-ml-stack|3": {
    headingFr: "Les Bugs NumPy Les Plus Courants",
    headingAr: "أكثر أخطاء NumPy شيوعاً",
    textFr: "1) Incompatibilité de forme : (100,) ≠ (100,1). Vérifiez toujours .shape avant les opérations matricielles. 2) Division entière : attention avec les tableaux dtype=int. 3) Copie vs vues : arr[0:5] retourne une VUE — le modifier modifie l'original. Utilisez .copy() pour être sûr. 4) En-place vs hors-place : X *= 2 modifie X sur place ; Y = X * 2 crée un nouveau tableau. 5) Propagation des NaN : np.mean([1,2,np.nan]) = NaN. Utilisez np.nanmean() pour des agrégations sûres.",
    textAr: "1) عدم تطابق الأشكال: (100,) ≠ (100,1). تحقق دائماً من .shape قبل عمليات المصفوفة. 2) القسمة الصحيحة: انتبه مع مصفوفات dtype=int. 3) النسخ مقابل العروض: arr[0:5] تُعيد عرضاً — تعديله يُعدّل الأصل. استخدم .copy() للأمان. 4) في المكان مقابل خارجه: X *= 2 تُعدّل X في مكانها؛ Y = X * 2 تُنشئ مصفوفة جديدة. 5) انتشار NaN: np.mean([1,2,np.nan]) = NaN. استخدم np.nanmean() للتجميعات الآمنة.",
    calloutFr: "np.shares_memory(a, b) vous indique si deux tableaux partagent des données sous-jacentes — crucial à savoir quand vous 'copiez' des tranches.",
    calloutAr: "np.shares_memory(a, b) يخبرك إذا كانت مصفوفتان تشتركان في البيانات الأساسية — معلومة حيوية عند 'نسخ' الشرائح.",
  },

  // ── linear-algebra ───────────────────────────────────────────────────────────
  "linear-algebra|0": {
    headingFr: "Pourquoi l'Algèbre Linéaire EST le Machine Learning",
    headingAr: "لماذا الجبر الخطي هو تعلم الآلة",
    textFr: "Une couche de réseau de neurones, c'est y = Wx + b — une multiplication matricielle. La descente de gradient nécessite le calcul du gradient, qui est une matrice Jacobienne. L'ACP trouve les vecteurs propres principaux de la matrice de covariance. L'attention dans les Transformers est Q·Kᵀ·V — trois multiplications matricielles. Chaque passe avant, chaque rétropropagation, chaque étape d'optimisation est de l'algèbre linéaire.",
    textAr: "طبقة الشبكة العصبية هي y = Wx + b — ضرب مصفوفات. الانحدار التدرجي يتطلب حساب التدرج، وهو مصفوفة جاكوبية. ACP تجد المتجهات الذاتية الرئيسية لمصفوفة التباين. الانتباه في المحولات هو Q·Kᵀ·V — ثلاثة ضروب مصفوفات. كل تمرير أمامي وخلفي وكل خطوة تحسين هي جبر خطي.",
    calloutFr: "Le produit scalaire a·b = ‖a‖‖b‖cos(θ) est la base de la similarité cosinus (NLP), de l'astuce du noyau (SVM) et des mécanismes d'attention (Transformers).",
    calloutAr: "الضرب النقطي a·b = ‖a‖‖b‖cos(θ) هو أساس تشابه جيب التمام (NLP) وحيلة النواة (SVM) وآليات الانتباه (المحولات).",
  },
  "linear-algebra|1": {
    headingFr: "Les Matrices comme Transformateurs d'Espace",
    headingAr: "المصفوفات كمحولات للفضاء",
    textFr: "Chaque matrice m×n A représente une transformation linéaire de ℝⁿ vers ℝᵐ. Multiplier un vecteur v par A l'étire, le fait tourner, le réfléchit ou le projette. Le déterminant vous indique le facteur de mise à l'échelle du volume : |det(A)| = 2 signifie que chaque région double en surface. det = 0 signifie que la matrice effondre l'espace sur une dimension inférieure.",
    textAr: "كل مصفوفة A بحجم m×n تمثل تحويلاً خطياً من ℝⁿ إلى ℝᵐ. ضرب متجه v بـA يمده أو يدوره أو يعكسه أو يسقطه. المحدد يخبرك بعامل تضخيم الحجم: |det(A)| = 2 يعني مضاعفة كل منطقة. det = 0 يعني انهيار الفضاء إلى بُعد أقل.",
    calloutFr: "Visualisez toute matrice 2×2 en regardant où va le carré unité [0,1]×[0,1]. Les quatre coins vont en (0,0), la première colonne, la deuxième colonne, et leur somme.",
    calloutAr: "تخيل أي مصفوفة 2×2 بمشاهدة إلى أين يذهب المربع الوحدوي [0,1]×[0,1]. الزوايا الأربع تذهب إلى (0,0) والعمود الأول والثاني ومجموعهما.",
  },
  "linear-algebra|2": {
    headingFr: "Décomposition Propre Étape par Étape",
    headingAr: "التحلل الذاتي خطوة بخطوة",
    stepsFr: [
      "Trouver les valeurs propres : résoudre det(A - λI) = 0 (polynôme caractéristique). Pour 2×2 : λ = (tr(A) ± √(tr²-4det)) / 2.",
      "Pour chaque valeur propre λᵢ : résoudre (A - λᵢI)v = 0 pour trouver le vecteur propre vᵢ. Normaliser : ‖vᵢ‖ = 1.",
      "Empiler les vecteurs propres comme colonnes de Q : A = QΛQ⁻¹ où Λ = diag(λ₁, λ₂, …)",
      "Pour les matrices symétriques (matrices de covariance) : Q est orthogonale (Q⁻¹ = Qᵀ), valeurs propres réelles.",
      "Aⁿ = QΛⁿQ⁻¹ — les grandes valeurs propres dominent l'application répétée (ex. : itération de puissance).",
      "ACP : calculer la covariance C = XᵀX/n, décomposer en vecteurs propres, prendre les k premiers comme matrice de projection.",
    ],
    stepsAr: [
      "إيجاد القيم الذاتية: حل det(A - λI) = 0 (كثيرة الحدود المميزة). للمصفوفات 2×2: λ = (tr(A) ± √(tr²-4det)) / 2.",
      "لكل قيمة ذاتية λᵢ: حل (A - λᵢI)v = 0 لإيجاد المتجه الذاتي vᵢ. التطبيع: ‖vᵢ‖ = 1.",
      "تكديس المتجهات الذاتية كأعمدة في Q: A = QΛQ⁻¹ حيث Λ = diag(λ₁, λ₂, …)",
      "للمصفوفات المتماثلة (مصفوفات التباين): Q متعامدة (Q⁻¹ = Qᵀ)، والقيم الذاتية حقيقية.",
      "Aⁿ = QΛⁿQ⁻¹ — القيم الذاتية الكبيرة تهيمن على التطبيق المتكرر (مثال: الضرب القوي).",
      "ACP: احسب التباين C = XᵀX/n، حلل إلى قيم ذاتية، خذ أعلى k متجه كمصفوفة إسقاط.",
    ],
  },
  "linear-algebra|3": {
    headingFr: "Algèbre Linéaire avec NumPy",
    headingAr: "الجبر الخطي مع NumPy",
    codeFr: `import numpy as np

# ── Vecteurs et produits scalaires ────────────────────────────────────────────
a = np.array([3., 4.])
b = np.array([1., 0.])

print(f"a·b = {np.dot(a, b):.2f}")             # 3.0
print(f"‖a‖ = {np.linalg.norm(a):.2f}")        # 5.0
print(f"cos(θ) = {np.dot(a,b)/(np.linalg.norm(a)*np.linalg.norm(b)):.3f}")  # 0.6

# Similarité cosinus (NLP / recommandation)
def cosine_sim(u, v):
    return np.dot(u, v) / (np.linalg.norm(u) * np.linalg.norm(v))

# ── Opérations matricielles ───────────────────────────────────────────────────
A = np.array([[2., 1.],
              [0., 3.]])

B = np.array([[1., 0.],
              [2., 1.]])

print("A @ B =")
print(A @ B)                     # multiplication matricielle (composition)
print(f"det(A) = {np.linalg.det(A):.2f}")   # 6.0 — facteur d'échelle volumique
print(f"rang(A) = {np.linalg.matrix_rank(A)}")   # 2 — rang plein

A_inv = np.linalg.inv(A)
print("A @ A_inv ≈ I :", np.allclose(A @ A_inv, np.eye(2)))

# ── Décomposition propre ──────────────────────────────────────────────────────
val_propres, vect_propres = np.linalg.eig(A)
print(f"Valeurs propres : {val_propres}")          # [2. 3.]
print(f"Vecteurs propres (colonnes) :\\n{vect_propres.round(3)}")

# Vérification : A @ v = λ * v
for i in range(len(val_propres)):
    v = vect_propres[:, i]
    lam = val_propres[i]
    print(f"λ{i+1}={lam:.2f}, A@v = {A@v.round(3)}, λ*v = {(lam*v).round(3)}")

# Reconstruction de A depuis la décomposition propre
Q = vect_propres
Lambda = np.diag(val_propres)
A_reconstruit = Q @ Lambda @ np.linalg.inv(Q)
print("Erreur de reconstruction :", np.linalg.norm(A - A_reconstruit))

# ── Décomposition en Valeurs Singulières (DVS) ────────────────────────────────
M = np.random.randn(4, 3)               # matrice rectangulaire 4×3
U, S, Vt = np.linalg.svd(M, full_matrices=False)
print(f"U : {U.shape}, S : {S.shape}, Vt : {Vt.shape}")

# Approximation de rang faible (garder les k valeurs singulières principales)
k = 2
M_approx = U[:, :k] @ np.diag(S[:k]) @ Vt[:k, :]
print(f"Erreur approx rang-{k} : {np.linalg.norm(M - M_approx):.4f}")

# ── ACP depuis zéro ───────────────────────────────────────────────────────────
X = np.random.randn(200, 5)
X -= X.mean(axis=0)                     # centrer
C = (X.T @ X) / (len(X) - 1)           # matrice de covariance
val_propres, vect_propres = np.linalg.eigh(C)   # eigh pour matrices symétriques
idx = np.argsort(val_propres)[::-1]     # trier par ordre décroissant
CP = vect_propres[:, idx[:2]]           # 2 premières composantes principales
X_proj = X @ CP                         # projection en 2D
print(f"Variance expliquée : {val_propres[idx[:2]] / val_propres.sum() * 100}")`,
  },
  "linear-algebra|4": {
    headingFr: "Stabilité Numérique et Mauvais Conditionnement",
    headingAr: "الاستقرار العددي وسوء التكييف",
    textFr: "Le numéro de condition κ(A) = σ_max/σ_min mesure la sensibilité aux perturbations. Numéro de condition élevé → mal conditionné → les erreurs numériques s'amplifient. La descente de gradient converge lentement sur des paysages de perte mal conditionnés — c'est pourquoi la mise à l'échelle des caractéristiques est importante. N'inversez jamais directement une matrice avec np.linalg.inv(A) si vous résolvez Ax=b — utilisez np.linalg.solve(A,b) qui est plus rapide et plus stable.",
    textAr: "رقم الحالة κ(A) = σ_max/σ_min يقيس الحساسية للاضطرابات. رقم حالة مرتفع → سيئ التكييف → تتضخم الأخطاء العددية. الانحدار التدرجي يتقارب ببطء على أسطح الخسارة سيئة التكييف — لهذا يهم تحجيم الميزات. لا تعكس مصفوفة مباشرة بـnp.linalg.inv(A) إذا كنت تحل Ax=b — استخدم np.linalg.solve(A,b) الأسرع والأكثر استقراراً.",
    calloutFr: "np.linalg.cond(A) vous donne le numéro de condition. κ > 10⁶ signifie des problèmes — les solutions auront ~6 chiffres significatifs de moins que prévu.",
    calloutAr: "np.linalg.cond(A) يعطيك رقم الحالة. κ > 10⁶ يعني مشاكل — ستحتوي الحلول على ~6 أرقام دقيقة أقل مما تتوقع.",
  },

  // ── calculus-optimization ────────────────────────────────────────────────────
  "calculus-optimization|0": {
    headingFr: "L'Optimisation Fait Apprendre les Modèles",
    headingAr: "التحسين هو ما يجعل النماذج تتعلم",
    textFr: "Entraîner un modèle ML est un problème d'optimisation : trouver les paramètres θ qui minimisent la fonction de perte L(θ). La descente de gradient est l'algorithme de base qui résout cela pour des problèmes avec des millions de paramètres où les solutions en forme fermée n'existent pas. La règle de la chaîne permet de calculer les gradients à travers des compositions arbitrairement profondes de fonctions — c'est la rétropropagation.",
    textAr: "تدريب نموذج التعلم الآلي هو مشكلة تحسين: إيجاد المعاملات θ التي تقلل دالة الخسارة L(θ). الانحدار التدرجي هو الخوارزمية الأساسية التي تحل هذا لمشاكل بملايين المعاملات حيث لا توجد حلول بصيغة مغلقة. قاعدة السلسلة تجعل حساب التدرجات عبر تركيبات عميقة من الدوال ممكناً — هذا هو الانتشار الخلفي.",
    calloutFr: "Un modèle GPT a ~175 milliards de paramètres. La descente de gradient met à jour TOUS simultanément en une seule passe arrière grâce à la règle de la chaîne.",
    calloutAr: "نموذج GPT يحتوي على ~175 مليار معامل. الانحدار التدرجي يُحدّث جميعها في آنٍ واحد في تمرير خلفي واحد بفضل قاعدة السلسلة.",
  },
  "calculus-optimization|1": {
    headingFr: "Le Gradient comme Direction dans l'Espace des Paramètres",
    headingAr: "التدرج كاتجاه في فضاء المعاملات",
    textFr: "Imaginez la fonction de perte comme un paysage vallonné et vos paramètres comme votre position. Le gradient ∇L(θ) est une flèche pointant vers le haut. Aller dans la direction OPPOSÉE (−η∇L) descend — vers une perte plus faible. Le taux d'apprentissage η contrôle la taille du pas : trop grand et vous rebondissez (divergence), trop petit et l'entraînement prend une éternité. Adam résout cela en maintenant un taux d'apprentissage séparé pour chaque paramètre basé sur son historique de gradients.",
    textAr: "تخيل دالة الخسارة كمنظر تلالي وموقعك هو معاملاتك. التدرج ∇L(θ) سهم يشير إلى الأعلى. التحرك في الاتجاه المعاكس (−η∇L) ينزل — نحو خسارة أقل. معدل التعلم η يتحكم في حجم الخطوة: كبير جداً فترتد (التشتت)، صغير جداً فيستغرق التدريب أبداً. يحل Adam هذا بالحفاظ على معدل تعلم منفصل لكل معامل بناءً على تاريخ تدرجاته.",
    calloutFr: "Intuition pour la règle de la chaîne : si le changement de température affecte la pression, et que la pression affecte le volume, comment la température affecte-t-elle le volume ? Multipliez les sensibilités individuelles.",
    calloutAr: "الحدس لقاعدة السلسلة: إذا كان تغيير درجة الحرارة يؤثر على الضغط، والضغط يؤثر على الحجم، فكيف تؤثر درجة الحرارة على الحجم؟ اضرب الحساسيات الفردية.",
  },
  "calculus-optimization|2": {
    headingFr: "Optimiseur Adam — Étape par Étape",
    headingAr: "محسِّن آدم — خطوة بخطوة",
    stepsFr: [
      "Initialiser : θ, m₀=0 (1er moment), v₀=0 (2e moment), t=0, β₁=0.9, β₂=0.999, ε=1e-8",
      "Calculer le gradient : g_t = ∇_θ L(θ_{t-1})",
      "Mettre à jour le 1er moment biaisé (momentum) : m_t = β₁·m_{t-1} + (1-β₁)·g_t",
      "Mettre à jour le 2e moment biaisé (échelle adaptative) : v_t = β₂·v_{t-1} + (1-β₂)·g_t²",
      "Correction du biais : m̂_t = m_t/(1-β₁ᵗ), v̂_t = v_t/(1-β₂ᵗ)",
      "Mise à jour des paramètres : θ_t = θ_{t-1} - η·m̂_t / (√v̂_t + ε)",
      "Intuition : m̂_t est une moyenne mobile des gradients (momentum). √v̂_t normalise par la magnitude — les variables à grands gradients reçoivent des taux d'apprentissage plus petits.",
    ],
    stepsAr: [
      "التهيئة: θ، m₀=0 (العزم الأول)، v₀=0 (العزم الثاني)، t=0، β₁=0.9، β₂=0.999، ε=1e-8",
      "حساب التدرج: g_t = ∇_θ L(θ_{t-1})",
      "تحديث العزم الأول المتحيز (الزخم): m_t = β₁·m_{t-1} + (1-β₁)·g_t",
      "تحديث العزم الثاني المتحيز (المقياس التكيفي): v_t = β₂·v_{t-1} + (1-β₂)·g_t²",
      "تصحيح التحيز: m̂_t = m_t/(1-β₁ᵗ)، v̂_t = v_t/(1-β₂ᵗ)",
      "تحديث المعاملات: θ_t = θ_{t-1} - η·m̂_t / (√v̂_t + ε)",
      "الحدس: m̂_t متوسط متحرك للتدرجات (زخم). √v̂_t يُطبّع حسب الحجم — المتغيرات ذات التدرجات الكبيرة تحصل على معدلات تعلم أصغر.",
    ],
  },
  "calculus-optimization|3": {
    headingFr: "Descente de Gradient de Zéro",
    headingAr: "الانحدار التدرجي من الصفر",
    codeFr: `import numpy as np
import matplotlib.pyplot as plt

# ── Dérivées numériques (éducatif) ────────────────────────────────────────────
def gradient_numerique(f, x, h=1e-5):
    """Approximation par différence centrale : (f(x+h) - f(x-h)) / 2h"""
    grad = np.zeros_like(x, dtype=float)
    for i in range(len(x)):
        x_plus  = x.copy(); x_plus[i]  += h
        x_minus = x.copy(); x_minus[i] -= h
        grad[i] = (f(x_plus) - f(x_minus)) / (2 * h)
    return grad

# ── 1. Descente de gradient sur une quadratique simple ────────────────────────
def perte(theta):
    return (theta[0] - 3)**2 + (theta[1] + 1)**2  # minimum en (3,-1)

def grad_perte(theta):
    return np.array([2*(theta[0]-3), 2*(theta[1]+1)])

theta = np.array([0., 0.])
lr = 0.1
historique = [theta.copy()]

for etape in range(50):
    g = grad_perte(theta)
    theta -= lr * g
    historique.append(theta.copy())
    if np.linalg.norm(g) < 1e-6:
        print(f"Convergé à l'étape {etape}")
        break

print(f"θ final : {theta.round(4)}")  # ≈ [3, -1]

# ── 2. Optimiseur Adam ────────────────────────────────────────────────────────
def adam(fn_grad, theta_init, lr=0.01, n_etapes=100, b1=0.9, b2=0.999, eps=1e-8):
    theta = theta_init.copy().astype(float)
    m, v = np.zeros_like(theta), np.zeros_like(theta)
    historique = [theta.copy()]
    for t in range(1, n_etapes+1):
        g = fn_grad(theta)
        m = b1*m + (1-b1)*g
        v = b2*v + (1-b2)*g**2
        m_hat = m / (1 - b1**t)
        v_hat = v / (1 - b2**t)
        theta -= lr * m_hat / (np.sqrt(v_hat) + eps)
        historique.append(theta.copy())
    return theta, historique

theta_adam, hist_adam = adam(grad_perte, np.array([0., 0.]), lr=0.1)
print(f"θ Adam : {theta_adam.round(4)}")

# ── 3. Règle de la chaîne en action (rétropropagation manuelle) ───────────────
# f(x) = (2x + 1)^2. df/dx = 2 * (2x+1) * 2 = 4*(2x+1)
x = 3.0
# Passe avant
u = 2*x + 1    # u = 7
f = u**2       # f = 49

# Passe arrière (règle de la chaîne)
df_du = 2*u    # = 14
du_dx = 2      # constante
df_dx = df_du * du_dx   # = 28
print(f"df/dx en x=3 : {df_dx}")  # analytique : 4*(2*3+1) = 28 ✓

# ── 4. Sensibilité au taux d'apprentissage ────────────────────────────────────
fig, axes = plt.subplots(1, 3, figsize=(12,3))
for ax, lr_val in zip(axes, [0.01, 0.1, 0.9]):
    theta = np.array([0.])
    pertes = []
    for _ in range(100):
        g = 2*(theta[0] - 5)
        theta[0] -= lr_val * g
        pertes.append((theta[0]-5)**2)
    ax.semilogy(pertes)
    ax.set_title(f"lr = {lr_val}")
    ax.set_xlabel("Étapes")
    ax.set_ylabel("Perte")
plt.tight_layout()
plt.show()  # lr=0.01 : lent, lr=0.1 : parfait, lr=0.9 : oscille`,
  },
  "calculus-optimization|4": {
    headingFr: "Minima Locaux vs Points Selles — Ce qui Ralentit Vraiment l'Entraînement",
    headingAr: "الحد الأدنى المحلي مقابل نقاط السرج — ما يبطئ التدريب فعلاً",
    textFr: "Dans les paysages de perte de haute dimension (les réseaux modernes ont des millions de paramètres), les vrais minima locaux sont rares — la plupart des points 'bloqués' sont des points selles. La descente de gradient avec bruit (SGD) échappe naturellement aux points selles. Les problèmes pratiques plus importants sont : (1) Gradients explosifs dans les réseaux profonds — utilisez le clipping. (2) Gradients évanescents dans les RNN — utilisez LSTM/GRU. (3) Mauvais conditionnement — utilisez la normalisation par lots ou l'initialisation des poids.",
    textAr: "في أسطح الخسارة عالية الأبعاد، الحدود الدنيا المحلية الحقيقية نادرة — معظم النقاط 'العالقة' هي نقاط سرج. الانحدار التدرجي مع الضوضاء (SGD) يهرب من نقاط السرج بشكل طبيعي. المشاكل العملية الأكبر هي: (1) انفجار التدرجات في الشبكات العميقة — استخدم قص التدرج. (2) اختفاء التدرجات في الشبكات التكررية — استخدم LSTM/GRU. (3) سوء التكييف — استخدم تطبيع الدُفعات أو تهيئة الأوزان.",
    calloutFr: "Pour les problèmes convexes (régression linéaire, régression logistique, SVM), la descente de gradient est garantie de trouver le minimum global. Pour les réseaux de neurones, elle trouve un 'bon' bassin.",
    calloutAr: "للمشاكل المحدبة (الانحدار الخطي، اللوجستي، SVM)، الانحدار التدرجي مضمون للعثور على الحد الأدنى العالمي. للشبكات العصبية، يجد حوضاً 'جيداً بما يكفي'.",
  },

  // ── probability-statistics ───────────────────────────────────────────────────
  "probability-statistics|0": {
    headingFr: "L'Incertitude Est Partout en ML",
    headingAr: "الشك في كل مكان في تعلم الآلة",
    textFr: "Le machine learning est fondamentalement une question de prédictions dans l'incertitude. La classification produit des probabilités (pas seulement des étiquettes). Les modèles bayésiens maintiennent des distributions complètes sur les paramètres. Sans théorie des probabilités, vous ne pouvez pas raisonner sur : si un modèle est faussement confiant, si votre découpage train/test donne une estimation fiable, ou si deux modèles sont réellement différents.",
    textAr: "التعلم الآلي يتعلق في جوهره بالتنبؤ في ظل عدم اليقين. التصنيف يُخرج احتمالات (ليس فقط تسميات). النماذج البايزية تحافظ على توزيعات كاملة على المعاملات. بدون نظرية الاحتمالات، لا يمكنك التفكير في: هل النموذج واثق بشكل خاطئ، هل تقسيم التدريب/الاختبار يعطي تقديراً موثوقاً، أو هل النموذجان مختلفان فعلاً.",
    calloutFr: "La log loss (entropie croisée) est la log-vraisemblance négative d'une distribution de Bernoulli. Minimiser l'entropie croisée, c'est faire de l'estimation du maximum de vraisemblance.",
    calloutAr: "خسارة السجل (الإنتروبيا التقاطعية) هي اللوغاريتم السلبي للاحتمالية لتوزيع برنولي. تقليل الإنتروبيا التقاطعية هو تقدير الاحتمالية الأعظمية. إنهما نفس الشيء.",
  },
  "probability-statistics|1": {
    headingFr: "Les Distributions — Les Plus Importantes",
    headingAr: "التوزيعات — الأهم منها",
    textFr: "**Normale (Gaussienne) :** En cloche, symétrique. Omniprésente par le TCL. Paramétrée par μ (localisation) et σ (dispersion). **Binomiale :** Nombre de succès en n essais binaires avec probabilité p. **Poisson :** Nombre d'événements dans un intervalle fixe. **Bernoulli :** Essai binaire unique. **Student-t :** Comme la Normale mais avec des queues plus lourdes — pour les tests sur petits échantillons. Comprendre quelle distribution utiliser pour votre problème est une compétence essentielle.",
    textAr: "**عادية (غاوسية):** على شكل جرس، متماثلة. في كل مكان بفضل نظرية الحد المركزي. محددة بـμ (الموقع) وσ (الانتشار). **ثنائية الحدود:** عدد النجاحات في n تجربة ثنائية باحتمالية p. **بواسون:** عدد الأحداث في فترة زمنية ثابتة. **برنولي:** تجربة ثنائية واحدة. **ستيودنت-t:** كالعادية لكن بذيول أثقل — لاختبارات العينات الصغيرة. فهم أي توزيع يناسب مشكلتك مهارة أساسية.",
    calloutFr: "Si X₁, X₂, …, Xₙ sont i.i.d. avec moyenne μ et variance finie σ², alors √n(X̄-μ)/σ → N(0,1). C'est pourquoi presque tout est gaussien après avoir fait la moyenne de suffisamment d'échantillons.",
    calloutAr: "إذا كانت X₁, X₂, …, Xₙ مستقلة متماثلة التوزيع بمتوسط μ وتباين محدود σ²، فإن √n(X̄-μ)/σ → N(0,1). هذا سبب أن كل شيء تقريباً يصبح غاوسياً بعد معدل كافٍ من العينات.",
  },
  "probability-statistics|2": {
    headingFr: "Estimation du Maximum de Vraisemblance (EMV)",
    headingAr: "تقدير الاحتمالية الأعظمية",
    stepsFr: [
      "Choisir un modèle de probabilité p(x|θ) pour vos données (ex. : Normale, Binomiale).",
      "Écrire la vraisemblance : L(θ) = ∏ᵢ p(xᵢ|θ) — probabilité des données observées sous θ.",
      "Prendre le log : ℓ(θ) = Σᵢ log p(xᵢ|θ) — la log-vraisemblance est plus facile à optimiser (somme vs produit).",
      "Dériver ∂ℓ/∂θ, égaler à zéro, résoudre pour θ̂_EMV.",
      "Pour la Normale : θ̂_EMV = (μ̂=x̄, σ̂²=Σ(xᵢ-x̄)²/n) — moyenne et variance biaisée empiriques.",
      "Pour la régression logistique : pas de forme fermée → utiliser la descente de gradient sur la log-perte = -ℓ(θ).",
    ],
    stepsAr: [
      "اختر نموذجاً احتمالياً p(x|θ) لبياناتك (مثال: عادي، ثنائي الحدود).",
      "اكتب دالة الاحتمالية: L(θ) = ∏ᵢ p(xᵢ|θ) — احتمالية البيانات المرصودة تحت θ.",
      "خذ اللوغاريتم: ℓ(θ) = Σᵢ log p(xᵢ|θ) — لوغاريتم الاحتمالية أسهل في التحسين (مجموع بدلاً من حاصل ضرب).",
      "اشتق ∂ℓ/∂θ، ساوِه صفراً، حل للحصول على θ̂_AGA.",
      "للتوزيع العادي: θ̂_AGA = (μ̂=x̄، σ̂²=Σ(xᵢ-x̄)²/n) — المتوسط والتباين المتحيز التجريبي.",
      "للانحدار اللوجستي: لا صيغة مغلقة → استخدم الانحدار التدرجي على خسارة السجل = -ℓ(θ).",
    ],
  },
  "probability-statistics|3": {
    headingFr: "Probabilité avec SciPy & NumPy",
    headingAr: "الاحتمالية مع SciPy و NumPy",
    codeFr: `import numpy as np
from scipy import stats
import matplotlib.pyplot as plt

# ── Distribution normale ───────────────────────────────────────────────────────
mu, sigma = 170, 10          # tailles en cm
dist_norm = stats.norm(mu, sigma)

x = np.linspace(135, 205, 500)
pdf = dist_norm.pdf(x)

# Probabilités
p_grand = 1 - dist_norm.cdf(190)                     # P(X > 190)
p_intervalle = dist_norm.cdf(180) - dist_norm.cdf(160)  # P(160 < X < 180)
print(f"P(taille > 190cm) = {p_grand:.4f}")
print(f"P(160 < taille < 180) = {p_intervalle:.4f}")

# Règle 68-95-99.7
for k in [1, 2, 3]:
    p = dist_norm.cdf(mu + k*sigma) - dist_norm.cdf(mu - k*sigma)
    print(f"P(μ ± {k}σ) = {p:.4f}")  # ≈ 0.68, 0.95, 0.997

# ── EMV — ajustement d'une distribution normale ──────────────────────────────
donnees = np.random.normal(170, 10, size=100)
mu_mle, sigma_mle = donnees.mean(), donnees.std()
print(f"\\nAjustement EMV : μ̂={mu_mle:.2f}, σ̂={sigma_mle:.2f}")

mu_fit, sigma_fit = stats.norm.fit(donnees)
print(f"Ajustement SciPy : μ={mu_fit:.2f}, σ={sigma_fit:.2f}")

# ── Théorème de Bayes ────────────────────────────────────────────────────────
# Test de maladie : prévalence 1%, sensibilité 99%, spécificité 95%
p_maladie = 0.01
p_pos_sachant_maladie = 0.99     # sensibilité
p_neg_sachant_sain = 0.95        # spécificité → P(pos|sain) = 0.05

p_sain = 1 - p_maladie
p_pos_sachant_sain = 1 - p_neg_sachant_sain

# P(positif) = P(pos|maladie)*P(maladie) + P(pos|sain)*P(sain)
p_pos = p_pos_sachant_maladie * p_maladie + p_pos_sachant_sain * p_sain

# Bayes : P(maladie | test positif)
p_maladie_sachant_pos = (p_pos_sachant_maladie * p_maladie) / p_pos
print(f"\\nP(maladie | test positif) = {p_maladie_sachant_pos:.4f}")  # ~16.4% !
# Contre-intuitif : malgré 99% de précision, seulement 16% de chance avec +
# dû au faible taux de base (prior) — biais du taux de base

# ── Test d'hypothèse ─────────────────────────────────────────────────────────
groupe_a = np.random.normal(5.0, 1.5, 50)
groupe_b = np.random.normal(5.5, 1.5, 50)

t_stat, p_valeur = stats.ttest_ind(groupe_a, groupe_b)
print(f"\\nt-test : t={t_stat:.3f}, p={p_valeur:.4f}")
print("Significatif à α=0.05 :", p_valeur < 0.05)

# Intervalle de confiance bootstrap (sans hypothèse de distribution)
np.random.seed(42)
moyennes_boot = [np.random.choice(groupe_a, size=len(groupe_a), replace=True).mean()
                 for _ in range(10000)]
ic_bas, ic_haut = np.percentile(moyennes_boot, [2.5, 97.5])
print(f"IC 95% groupe A : [{ic_bas:.3f}, {ic_haut:.3f}]")`,
  },
  "probability-statistics|4": {
    headingFr: "Les p-valeurs Ne Sont Pas Ce Que Vous Croyez",
    headingAr: "قيم p ليست ما تعتقد",
    textFr: "Une p-valeur < 0.05 ne signifie PAS 'il y a 95% de chances que l'effet soit réel.' Elle signifie : 'si l'hypothèse nulle était vraie, nous verrions des données aussi extrêmes moins de 5% du temps.' Pièges spécifiques au ML : (1) Comparaisons multiples : si vous testez 20 configurations et rapportez la meilleure, corrigez avec Bonferroni. (2) Confondre la signification statistique avec la signification pratique. (3) Data dredging : tester de nombreuses divisions jusqu'à en trouver une où votre modèle 'bat significativement' la ligne de base.",
    textAr: "قيمة p < 0.05 لا تعني 'هناك احتمال 95% أن التأثير حقيقي.' تعني: 'لو كانت الفرضية الصفرية صحيحة، سنرى بيانات بهذا التطرف أقل من 5% من الوقت.' مزالق خاصة بالتعلم الآلي: (1) المقارنات المتعددة: إذا اختبرت 20 تكويناً وأبلغت عن الأفضل، صحح بـBonferroni. (2) الخلط بين الأهمية الإحصائية والأهمية العملية. (3) تنقيب البيانات: اختبار انقسامات عديدة حتى تجد واحدة 'يتفوق' فيها نموذجك على خط الأساس.",
    calloutFr: "La taille de l'effet (d de Cohen = (μ₁-μ₂)/σ) vous indique si une différence est pratiquement importante. Un p=0.0001 avec d=0.02 est statistiquement significatif mais pratiquement sans intérêt.",
    calloutAr: "حجم التأثير (d لكوهين = (μ₁-μ₂)/σ) يخبرك إذا كان الفرق مهماً عملياً. p=0.0001 مع d=0.02 مهم إحصائياً لكن لا معنى له عملياً.",
  },

  // ── information-theory ───────────────────────────────────────────────────────
  "information-theory|0": {
    headingFr: "Pourquoi la Théorie de l'Information Sous-tend les Fonctions de Perte ML",
    headingAr: "لماذا نظرية المعلومات تدعم دوال الخسارة في تعلم الآلة",
    textFr: "Quand vous entraînez un classifieur avec la perte d'entropie croisée, vous minimisez le nombre de 'bits' nécessaires pour communiquer les étiquettes réelles avec la distribution prédite du modèle. Quand un VAE minimise l'ELBO, le terme de régularisation est une divergence KL. Quand vous mesurez une division d'arbre de décision avec le gain d'information, vous calculez la réduction d'entropie. La connexion à la théorie de l'information n'est pas un accident.",
    textAr: "عندما تدرب مصنفاً بخسارة الإنتروبيا التقاطعية، تقلل عدد 'البتات' اللازمة للتعبير عن التسميات الحقيقية باستخدام توزيع النموذج المتنبأ به. عندما يقلل VAE الـELBO، حد التنظيم هو تباين KL. عندما تقيس انقسام شجرة القرار بمكسب المعلومات، تحسب تقليص الإنتروبيا. الرابط بنظرية المعلومات ليس صدفة.",
    calloutFr: "Entropie croisée H(p,q) = Entropie H(p) + KL(p‖q). Puisque H(p) est fixe, minimiser l'entropie croisée revient à minimiser la divergence KL de q vers p.",
    calloutAr: "الإنتروبيا التقاطعية H(p,q) = الإنتروبيا H(p) + KL(p‖q). بما أن H(p) ثابتة، تقليل الإنتروبيا التقاطعية يساوي تقليل تباين KL من q إلى p.",
  },
  "information-theory|1": {
    headingFr: "Entropie : Mesurer la Surprise",
    headingAr: "الإنتروبيا: قياس المفاجأة",
    textFr: "Pensez à l'entropie comme la surprise moyenne dans une distribution de probabilité. Une pièce équilibrée (50/50) a une entropie H = 1 bit — vous gagnez exactement 1 bit d'information à chaque lancer. Une pièce biaisée (99/1) a une entropie quasi nulle — vous êtes rarement surpris. Application ML : les prédictions d'un modèle bien calibré sur les frontières de classe ont une entropie élevée (incertain), et ses prédictions sur des exemples clairs ont une entropie quasi nulle (confiant).",
    textAr: "فكر في الإنتروبيا كالمفاجأة المتوسطة في توزيع احتمالي. عملة معدنية متوازنة (50/50) لها إنتروبيا H = 1 بت — تكسب بت واحد بالضبط من المعلومات في كل قلب. عملة متحيزة (99/1) لها إنتروبيا شبه صفرية — نادراً ما تفاجأ. تطبيق التعلم الآلي: تنبؤات النموذج المعاير جيداً على حدود الفئات لها إنتروبيا عالية (غير متأكد)، وتنبؤاته على الأمثلة الواضحة لها إنتروبيا شبه صفرية (واثق).",
    calloutFr: "Principe d'entropie maximale : étant donné des contraintes, choisissez la distribution qui maximise l'entropie. Cela donne la distribution Normale pour les contraintes moyenne+variance.",
    calloutAr: "مبدأ الإنتروبيا الأعظمية: بالنظر إلى القيود، اختر التوزيع الذي يعظم الإنتروبيا. هذا يعطي التوزيع الطبيعي لقيود المتوسط والتباين.",
  },
  "information-theory|2": {
    headingFr: "Entropie, Entropie Croisée & Divergence KL en Pratique",
    headingAr: "الإنتروبيا، الإنتروبيا التقاطعية وتباين KL عملياً",
    codeFr: `import numpy as np
from scipy.special import xlogy    # gère 0 * log(0) = 0 proprement
from scipy.stats import entropy as scipy_entropy
import matplotlib.pyplot as plt

def entropie(p: np.ndarray, base: float = 2) -> float:
    """Entropie de Shannon H(p) en bits (base=2) ou nats (base=e)"""
    p = np.asarray(p, dtype=float)
    p = p[p > 0]                  # 0 * log(0) = 0 par convention
    return -np.sum(p * np.log(p) / np.log(base))

def entropie_croisee(p: np.ndarray, q: np.ndarray, eps: float = 1e-12) -> float:
    """H(p, q) = -sum p * log(q)"""
    p, q = np.asarray(p, dtype=float), np.asarray(q, dtype=float)
    return -np.sum(p * np.log(q + eps))

def divergence_kl(p: np.ndarray, q: np.ndarray, eps: float = 1e-12) -> float:
    """KL(p||q) — NON symétrique"""
    p, q = np.asarray(p, dtype=float), np.asarray(q, dtype=float)
    masque = p > 0
    return np.sum(p[masque] * np.log((p[masque] + eps) / (q[masque] + eps)))

# ── 1. Entropie de diverses distributions ─────────────────────────────────────
print("Exemples d'entropie (bits) :")
print(f"  Pièce équitable [0.5, 0.5]:       {entropie([0.5, 0.5]):.4f}")   # 1.0 bit
print(f"  Pièce biaisée [0.99, 0.01]:       {entropie([0.99, 0.01]):.4f}") # ≈ 0.08 bits
print(f"  Uniforme 8 classes :              {entropie([1/8]*8):.4f}")       # 3.0 bits
print(f"  Certain [1.0, 0.0] :              {entropie([1.0, 0.0]):.4f}")    # 0.0 bits

# ── 2. Perte d'entropie croisée (classification) ─────────────────────────────
# Vérité terrain (one-hot) : chat
p_vrai = np.array([1., 0., 0.])        # chat
q_bon       = np.array([0.8, 0.1, 0.1])    # confiant et correct
q_mauvais   = np.array([0.1, 0.8, 0.1])    # confiant et incorrect
q_incertain = np.array([0.4, 0.3, 0.3])    # incertain mais penche vers le bon

print("\\nPertes d'entropie croisée :")
print(f"  Bonne prédiction :    {entropie_croisee(p_vrai, q_bon):.4f}")
print(f"  Mauvaise prédiction : {entropie_croisee(p_vrai, q_mauvais):.4f}")
print(f"  Incertain mais ok :   {entropie_croisee(p_vrai, q_incertain):.4f}")

# H(p,q) = H(p) + KL(p||q). Comme H(p)=0 pour one-hot : EC = KL(p||q)
print(f"  KL(p_vrai||q_bon) = {divergence_kl(p_vrai, q_bon):.4f}")

# ── 3. Divergence KL : asymétrie ─────────────────────────────────────────────
p = np.array([0.6, 0.3, 0.1])
q = np.array([0.3, 0.5, 0.2])
print(f"\\nKL(p||q) = {divergence_kl(p,q):.4f}")
print(f"KL(q||p) = {divergence_kl(q,p):.4f}")  # différent — pas une distance

# ── 4. Gain d'information dans les arbres de décision ────────────────────────
def gain_information(parent, gauche, droite):
    n = len(parent)
    n_g, n_d = len(gauche), len(droite)
    h_p = scipy_entropy(np.bincount(parent) / n, base=2)
    h_g = scipy_entropy(np.bincount(gauche) / n_g, base=2) if n_g > 0 else 0
    h_d = scipy_entropy(np.bincount(droite) / n_d, base=2) if n_d > 0 else 0
    return h_p - (n_g/n * h_g + n_d/n * h_d)

# 10 échantillons : 6 classe-0, 4 classe-1
parent = np.array([0,0,0,0,0,0,1,1,1,1])
gauche = np.array([0,0,0,0,1])
droite = np.array([0,0,1,1,1])
print(f"\\nGain d'information : {gain_information(parent, gauche, droite):.4f} bits")`,
  },
  "information-theory|3": {
    headingFr: "Divergence KL dans le ML Moderne",
    headingAr: "تباين KL في تعلم الآلة الحديث",
    textFr: "La divergence KL apparaît partout dans le ML moderne : (1) Perte VAE = perte de reconstruction + KL(q(z|x) ‖ p(z)). (2) RL politique — TRPO/PPO contraignent le KL entre ancienne et nouvelle politique. (3) Distillation de connaissances — minimiser le KL entre les sorties de l'étudiant et du professeur. (4) RLHF — pénalité KL pour éviter que le modèle s'éloigne trop du modèle de base.",
    textAr: "يظهر تباين KL في كل مكان في التعلم الآلي الحديث: (1) خسارة VAE = خسارة إعادة البناء + KL(q(z|x) ‖ p(z)). (2) RL السياسة — TRPO/PPO تقيد KL بين السياسة القديمة والجديدة. (3) تقطير المعرفة — تقليل KL بين مخرجات الطالب والمعلم. (4) RLHF — عقوبة KL تمنع النموذج من الانحراف بعيداً عن النموذج الأساسي.",
    calloutFr: "KL directe (mode-covering) vs KL inverse (mode-seeking) est un choix de conception fondamental dans les modèles génératifs — les VAEs utilisent la directe, les GANs utilisent implicitement l'inverse.",
    calloutAr: "KL الأمامي (تغطية الأوضاع) مقابل KL العكسي (البحث عن الأوضاع) خيار تصميم أساسي في النماذج التوليدية — تستخدم VAEs الأمامي، وتستخدم GANs العكسي ضمنياً.",
  },

};

export const keyFormulaI18n_foundations: Record<string, KeyFormulaI18n> = {

  // ── python-ml-stack ──────────────────────────────────────────────────────────
  "python-ml-stack|0": {
    nameFr: "Moyenne Vectorisée",  nameAr: "المتوسط المتجّه",
    meaningFr: "np.mean(X) — NumPy calcule cela en C, des ordres de grandeur plus rapide qu'une boucle Python",
    meaningAr: "np.mean(X) — تحسب NumPy هذا بلغة C، أسرع بمراتب من حلقة Python",
  },
  "python-ml-stack|1": {
    nameFr: "Broadcasting",         nameAr: "البث",
    meaningFr: "NumPy étire le petit tableau selon la dimension manquante — évite les boucles explicites",
    meaningAr: "تمدد NumPy المصفوفة الصغيرة على البُعد الناقص — تتجنب الحلقات الصريحة",
  },
  "python-ml-stack|2": {
    nameFr: "Corrélation de Pearson", nameAr: "ارتباط بيرسون",
    meaningFr: "np.corrcoef(X,Y) — mesure la dépendance linéaire entre deux variables",
    meaningAr: "np.corrcoef(X,Y) — يقيس الاعتماد الخطي بين ميزتين",
  },

  // ── calculus-optimization ────────────────────────────────────────────────────
  "calculus-optimization|0": {
    nameFr: "Gradient",              nameAr: "التدرج",
    meaningFr: "Vecteur des dérivées partielles — pointe dans la direction de la montée la plus raide",
    meaningAr: "متجه المشتقات الجزئية — يشير إلى اتجاه أشد صعود",
  },
  "calculus-optimization|1": {
    nameFr: "Règle de la Chaîne",    nameAr: "قاعدة السلسلة",
    meaningFr: "La colonne vertébrale de la rétropropagation — composer les dérivées à travers les couches",
    meaningAr: "العمود الفقري للانتشار الخلفي — تركيب المشتقات عبر الطبقات",
  },
  "calculus-optimization|2": {
    nameFr: "Descente de Gradient",  nameAr: "الانحدار التدرجي",
    meaningFr: "Se déplacer itérativement dans le sens opposé au gradient pour minimiser la perte L",
    meaningAr: "التحرك بشكل متكرر عكس التدرج لتقليل الخسارة L",
  },
  "calculus-optimization|3": {
    nameFr: "Mise à Jour Adam",      nameAr: "تحديث آدم",
    meaningFr: "Descente de gradient avec taux d'apprentissage adaptatifs par paramètre (moments 1 et 2 corrigés du biais)",
    meaningAr: "انحدار تدرجي مع معدلات تعلم تكيفية لكل معامل (العزمات الأولى والثانية المصحَّحة)",
  },

  // ── information-theory ───────────────────────────────────────────────────────
  "information-theory|0": {
    nameFr: "Entropie",              nameAr: "الإنتروبيا",
    meaningFr: "Surprise moyenne en bits — maximale quand tous les résultats sont équiprobables, nulle si déterministe",
    meaningAr: "متوسط 'المفاجأة' بالبتات — أقصى قيمة عند تساوي الاحتمالات، صفر عند اليقين",
  },
  "information-theory|1": {
    nameFr: "Perte d'Entropie Croisée", nameAr: "خسارة الإنتروبيا التقاطعية",
    meaningFr: "Bits attendus pour encoder des échantillons de p avec un code conçu pour q — la perte de classification",
    meaningAr: "البتات المتوقعة لترميز عينات من p باستخدام رمز مصمم لـ q — خسارة التصنيف",
  },
  "information-theory|2": {
    nameFr: "Divergence KL",         nameAr: "تباين KL",
    meaningFr: "Bits supplémentaires pour encoder p avec un code optimisé pour q. Toujours ≥ 0, nul ssi p=q",
    meaningAr: "بتات إضافية لترميز p بكود مُحسَّن لـ q. دائماً ≥ 0، يساوي 0 فقط إذا p=q",
  },
  "information-theory|3": {
    nameFr: "Information Mutuelle",  nameAr: "المعلومات المشتركة",
    meaningFr: "Combien la connaissance de Y réduit l'incertitude sur X — sélection de variables et apprentissage de représentation",
    meaningAr: "كم يُقلل معرفة Y من الغموض حول X — يُستخدم في اختيار الميزات وتعلم التمثيل",
  },

  // ── probability-statistics ───────────────────────────────────────────────────
  "probability-statistics|0": {
    nameFr: "Théorème de Bayes",      nameAr: "نظرية بايز",
    meaningFr: "Mettre à jour la croyance a priori P(H) avec une preuve E pour obtenir le posterior P(H|E)",
    meaningAr: "تحديث الاعتقاد المسبق P(H) بالدليل E للحصول على الاحتمال اللاحق P(H|E)",
  },
  "probability-statistics|1": {
    nameFr: "EMV",                    nameAr: "تقدير الاحتمالية الأعظمية",
    meaningFr: "Trouver les paramètres rendant les données observées les plus probables — équivalent à minimiser le NLL",
    meaningAr: "إيجاد المعاملات التي تجعل البيانات المرصودة أكثر احتمالاً — معادلة لتقليل NLL",
  },
  "probability-statistics|2": {
    nameFr: "Densité de Probabilité Normale", nameAr: "دالة كثافة الاحتمال العادية",
    meaningFr: "Courbe en cloche — entièrement spécifiée par la moyenne μ et l'écart-type σ",
    meaningAr: "منحنى الجرس — محدد تماماً بالمتوسط μ والانحراف المعياري σ",
  },
  "probability-statistics|3": {
    nameFr: "Théorème Central Limite", nameAr: "نظرية الحد المركزي",
    meaningFr: "La somme de n variables i.i.d. converge vers la Normale quand n→∞ — pourquoi la distribution normale est partout",
    meaningAr: "مجموع n متغير مستقل متماثل يتقارب نحو العادي عند n→∞ — سبب انتشار التوزيع العادي",
  },

  // ── linear-algebra ───────────────────────────────────────────────────────────
  "linear-algebra|0": {
    nameFr: "Produit Scalaire",    nameAr: "الضرب النقطي",
    meaningFr: "Mesure l'alignement de deux vecteurs — zéro signifie orthogonal, maximal quand parallèles",
    meaningAr: "يقيس مدى توافق متجهين — صفر يعني عمودية، أقصى قيمة عند التوازي",
  },
  "linear-algebra|1": {
    nameFr: "Multiplication de Matrices", nameAr: "ضرب المصفوفات",
    meaningFr: "Composition de deux transformations linéaires — appliquer B d'abord, puis A",
    meaningAr: "تركيب تحويلين خطيين — تطبيق B أولاً ثم A",
  },
  "linear-algebra|2": {
    nameFr: "Décomposition en Valeurs Propres", nameAr: "التحليل الطيفي",
    meaningFr: "Les vecteurs propres v restent sur leur espace sous A ; λ est le facteur d'échelle",
    meaningAr: "المتجهات الذاتية v تبقى على امتدادها تحت A؛ λ هو عامل التكبير",
  },
  "linear-algebra|3": {
    nameFr: "Décomposition en Valeurs Singulières (DVS)", nameAr: "تحليل القيم المفردة (SVD)",
    meaningFr: "Toute matrice se décompose en rotation × échelle × rotation — utilisé dans ACP, LSA, systèmes de recommandation",
    meaningAr: "أي مصفوفة تتحلل إلى دوران × مقياس × دوران — يُستخدم في ACP وLSA وأنظمة التوصية",
  },

};

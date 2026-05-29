import type { SectionI18n, KeyFormulaI18n } from '../types';

export const sectionI18n_inspection: Record<string, SectionI18n> = {

  // ── feature-importance ───────────────────────────────────────────────────────
  "feature-importance|0": {
    headingFr: "Pourquoi l'Importance des Caractéristiques Est Indispensable",
    headingAr: "لماذا أهمية الميزات غير قابلة للتفاوض",
    textFr: "Les modèles ML sont souvent des boîtes noires — ils produisent des sorties mais cachent leur raisonnement. Les méthodes d'importance des caractéristiques lèvent ce voile. Elles répondent à : sur quelles entrées le modèle s'appuie-t-il le plus ? Cela importe pour trois raisons : (1) Débogage : si votre modèle s'appuie fortement sur 'bruit_aléatoire', vous avez un problème de fuite de données. (2) Confiance : les régulateurs, les médecins et les agents de crédit doivent comprendre les décisions du modèle — l'article 22 du RGPD impose l'explicabilité pour les décisions automatisées. (3) Sélection de caractéristiques : les scores d'importance guident la réduction de dimensionnalité. Supprimer les caractéristiques sans importance réduit le coût d'inférence et prévient le surapprentissage.",
    textAr: "نماذج التعلم الآلي غالباً ما تكون صناديق سوداء — تنتج مخرجات لكنها تخفي منطقها. تكشف أساليب أهمية الميزات عن هذا الغموض. تجيب على: ما المدخلات التي يعتمد عليها النموذج أكثر؟ يهم هذا لثلاثة أسباب: (1) التصحيح: إذا كان نموذجك يعتمد بشدة على 'bruit_aléatoire' فلديك مشكلة تسرب بيانات. (2) الثقة: يجب أن يفهم المنظمون والأطباء ومسؤولو الائتمان قرارات النموذج — تفرض المادة 22 من GDPR قابلية التفسير للقرارات الآلية. (3) اختيار الميزات: تُوجّه درجات الأهمية تخفيض الأبعاد. حذف الميزات غير المهمة يقلل تكلفة الاستدلال ويمنع الإفراط في التخصيص.",
    calloutFr: "Un modèle de scoring de crédit qui s'appuie fortement sur le code_postal pourrait être équitable sur les données d'entraînement mais servir de proxy pour la race — l'analyse d'importance révèle cela avant le déploiement.",
    calloutAr: "نموذج تسجيل الائتمان الذي يعتمد بشدة على الرمز_البريدي قد يبدو عادلاً على بيانات التدريب لكنه يُعدّ وكيلاً للعرق — تحليل الأهمية يكشف ذلك قبل النشر.",
  },
  "feature-importance|1": {
    headingFr: "Deux Philosophies : Que Signifie 'Important' ?",
    headingAr: "فلسفتان: ماذا يعني 'المهم'؟",
    textFr: "Il y a fondamentalement deux écoles : (A) L'importance structurelle demande « combien cette caractéristique a-t-elle aidé à construire le modèle ? » — l'importance d'impureté des arbres est l'exemple canonique, calculée à partir des statistiques de division lors de l'entraînement. Elle est rapide mais a un biais connu : elle gonfle l'importance des caractéristiques continues à haute cardinalité comme le code_postal. (B) L'importance fonctionnelle demande « de combien les prédictions du modèle se dégradent-elles si je casse cette caractéristique ? » — l'importance par permutation mélange chaque caractéristique indépendamment et mesure la baisse de précision. Elle est agnostique au modèle et attribue correctement une importance quasi nulle aux caractéristiques de bruit aléatoire. Les deux approches sont souvent en désaccord — et ce désaccord est informatif.",
    textAr: "هناك مدرستان أساسيتان: (أ) الأهمية البنيوية تسأل «كم ساعدت هذه الميزة في بناء النموذج؟» — أهمية شوائب الأشجار هي المثال النموذجي، تُحسب من إحصاءات التقسيم خلال التدريب. إنها سريعة لكن لديها تحيز معروف: تُضخّم أهمية الميزات ذات الأساس الكبير كالرمز_البريدي. (ب) الأهمية الوظيفية تسأل «كم تتدهور تنبؤات النموذج إذا كسرت هذه الميزة؟» — تخلط أهمية التبديل كل ميزة باستقلالية وتقيس الانخفاض في الدقة. إنها مستقلة عن النموذج وتُسند أهمية قريبة من الصفر للميزات العشوائية. غالباً ما يختلف المقربتان — وهذا الاختلاف مفيد.",
    calloutFr: "Si l'importance par impureté dit que code_postal est important mais que l'importance par permutation dit quasi nulle, le modèle a appris des corrélations fallacieuses de la cardinalité plutôt que du signal.",
    calloutAr: "إذا قالت أهمية الشوائب أن الرمز_البريدي مهم لكن أهمية التبديل تقول شبه صفر، فالنموذج تعلّم ارتباطات زائفة من الأساس بدلاً من الإشارة.",
  },
  "feature-importance|2": {
    headingFr: "Importance par Permutation : Étape par Étape",
    headingAr: "أهمية التبديل: خطوة بخطوة",
    stepsFr: [
      "Entraînez votre modèle sur (X_train, y_train). Calculez la métrique de base (ex. précision) sur X_val.",
      "Pour la caractéristique j dans {1, …, p} : mélangez la colonne j dans X_val (remplacez par une permutation aléatoire), calculez la métrique sur les données mélangées, restaurez la colonne j.",
      "Importance de j = métrique de base − métrique mélangée. Une forte baisse = caractéristique importante.",
      "Répétez K fois (par défaut K=5 dans sklearn) et faites la moyenne pour réduire la variance des mélanges aléatoires.",
      "Triez les caractéristiques par score d'importance. Les caractéristiques avec des scores négatifs (le modèle s'améliore quand elles sont mélangées) indiquent des caractéristiques nuisibles ou avec fuite.",
    ],
    stepsAr: [
      "درّب نموذجك على (X_train, y_train). احسب المقياس الأساسي (مثل الدقة) على X_val.",
      "لكل ميزة j في {1، …، p}: اخلط العمود j في X_val (استبدله بتبديل عشوائي)، احسب المقياس على البيانات المخلوطة، أعد العمود j.",
      "أهمية j = المقياس الأساسي − المقياس المخلوط. انخفاض كبير = ميزة مهمة.",
      "كرر K مرات (افتراضياً K=5 في sklearn) وحسب المتوسط لتقليل التباين من الخلطات العشوائية.",
      "رتّب الميزات حسب درجة الأهمية. الميزات ذات الدرجات السالبة (يتحسن النموذج عند خلطها) تشير إلى ميزات ضارة أو مسرِّبة للبيانات.",
    ],
  },
  "feature-importance|3": {
    headingFr: "Importance des Caractéristiques : Permutation & Impureté",
    headingAr: "أهمية الميزات: التبديل والشوائب",
    codeFr: `from sklearn.ensemble import RandomForestClassifier
from sklearn.inspection import permutation_importance
from sklearn.model_selection import train_test_split
import pandas as pd
import numpy as np

# ── Jeu de données tabulaire synthétique ──────────────────────────────────────
np.random.seed(42)
n = 1000
X = pd.DataFrame({
    "revenu":          np.random.normal(50, 15, n),
    "age":             np.random.randint(18, 70, n),
    "score_credit":    np.random.normal(650, 80, n),
    "montant_pret":    np.random.normal(20, 8, n),
    "anciennete":      np.random.exponential(5, n),
    "nb_comptes":      np.random.poisson(3, n),
    "bruit_aleatoire": np.random.randn(n),           # vraiment inutile
    "code_postal":     np.random.randint(0, 10000, n), # bruit haute cardinalité
})
y = (
    0.4 * (X["revenu"] > 55)
    + 0.3 * (X["score_credit"] > 660)
    + 0.2 * (X["age"] > 35)
    + 0.1 * np.random.rand(n)
) > 0.5

X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)

# ── 1. Entraîner la forêt aléatoire ───────────────────────────────────────────
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)

# ── 2. Importance par impureté (Gini) — rapide, intégrée ─────────────────────
imp_impurete = pd.Series(rf.feature_importances_, index=X.columns)
print("Importance par impureté :")
print(imp_impurete.sort_values(ascending=False).round(3))
# ATTENTION : code_postal (haute cardinalité) peut sembler gonflé ici

# ── 3. Importance par permutation — agnostique, honnête ──────────────────────
perm = permutation_importance(
    rf, X_val, y_val,
    n_repeats=10,       # mélanger 10 fois, prendre moyenne ± écart-type
    scoring="accuracy",
    random_state=42,
    n_jobs=-1
)
imp_perm = pd.DataFrame({
    "moyenne":     perm.importances_mean,
    "ecart_type":  perm.importances_std,
}, index=X.columns).sort_values("moyenne", ascending=False)

print("\\nImportance par permutation :")
print(imp_perm.round(3))
# bruit_aleatoire et code_postal seront proches de zéro ou négatifs

# ── 4. Comparer les deux méthodes ─────────────────────────────────────────────
comparaison = pd.DataFrame({
    "impurete":    imp_impurete,
    "permutation": perm.importances_mean,
}).sort_values("permutation", ascending=False)
print("\\nComparaison (triée par permutation) :")
print(comparaison.round(3))

# ── 5. Sélection via l'importance par permutation ────────────────────────────
selectionnees = imp_perm[imp_perm["moyenne"] > 0.01].index.tolist()
print(f"\\nCaractéristiques sélectionnées ({len(selectionnees)}) : {selectionnees}")`,
  },
  "feature-importance|4": {
    headingFr: "SHAP : Attribution Unifiée des Caractéristiques",
    headingAr: "SHAP: إسناد الميزات الموحد",
    formulaLabelFr: "SHAP garantit : Σϕⱼ = f(x) − E[f(X)] ; TreeSHAP en O(TLD²)",
    formulaLabelAr: "ضمانات SHAP: Σϕⱼ = f(x) − E[f(X)] ؛ TreeSHAP بتعقيد O(TLD²)",
    textFr: "SHAP (SHapley Additive exPlanations) unifie LIME, l'importance des caractéristiques et les mécanismes d'attention sous un cadre axiomatique unique. Chaque prédiction est décomposée en une somme de contributions par caractéristique (ϕ_j) plus une valeur de base. Contrairement à l'importance par permutation (globale), SHAP est local — il explique les prédictions individuelles. TreeSHAP calcule les valeurs Shapley exactes pour les ensembles d'arbres en temps polynomial via un algorithme basé sur les chemins, le rendant pratique pour les forêts aléatoires et XGBoost en production.",
    textAr: "تُوحّد SHAP (SHapley Additive exPlanations) تقنيات LIME وأهمية الميزات وآليات الانتباه تحت إطار بديهي واحد. يُحلَّل كل تنبؤ إلى مجموع مساهمات لكل ميزة (ϕ_j) زائد قيمة أساسية. بخلاف أهمية التبديل الإجمالية، تعمل SHAP محلياً — تشرح التنبؤات الفردية. تحسب TreeSHAP قيم Shapley الدقيقة لمجموعات الأشجار في وقت متعدد الحدود باستخدام خوارزمية مبنية على المسارات، مما يجعلها عملية للغابات العشوائية وXGBoost في الإنتاج.",
  },
  "feature-importance|5": {
    headingFr: "Les Caractéristiques Corrélées Divisent l'Importance Injustement",
    headingAr: "الميزات المرتبطة تقسم الأهمية بشكل غير عادل",
    textFr: "Quand deux caractéristiques sont très corrélées (ex. revenu et score_credit), l'importance par permutation sous-estime les deux. Mélanger le revenu laisse score_credit intact, donc le modèle récupère la plupart du signal. L'importance conjointe réelle est partagée entre elles, mais chaque importance individuelle semble faible. Solution : utilisez l'importance par suppression de colonne ou SHAP avec regroupement conscient des corrélations. Sachez aussi que l'importance par permutation dépend du jeu de validation — les scores changent avec des divisions différentes.",
    textAr: "عندما تكون ميزتان مرتبطتان ارتباطاً وثيقاً (مثل الدخل ودرجة الائتمان)، تُقلّل أهمية التبديل من تقدير كلتيهما. خلط الدخل يترك درجة الائتمان سليمة، فيسترد النموذج معظم الإشارة. الأهمية المشتركة الحقيقية مقسّمة بينهما لكن كل أهمية فردية تبدو صغيرة. الحل: استخدم أهمية حذف العمود أو SHAP مع التجميع الواعي بالارتباطات. انتبه أيضاً أن أهمية التبديل تعتمد على مجموعة التحقق — تتغير الدرجات مع تقسيمات مختلفة.",
    calloutFr: "N'interprétez jamais une importance par permutation quasi nulle comme 'inutile' pour des caractéristiques corrélées sans vérifier d'abord les corrélations deux à deux.",
    calloutAr: "لا تفسّر أبداً أهمية التبديل شبه الصفرية على أنها 'عديمة الفائدة' للميزات المرتبطة دون التحقق أولاً من الارتباطات الزوجية.",
  },

  // ── partial-dependence ────────────────────────────────────────────────────────
  "partial-dependence|0": {
    headingFr: "Au-Delà de 'Quelles Caractéristiques Comptent' — Comment Comptent-Elles ?",
    headingAr: "ما وراء 'أي الميزات تهم' — كيف تهم؟",
    textFr: "L'importance des caractéristiques vous dit que le revenu est la caractéristique la plus prédictive, mais elle ne dit rien sur la forme de cette relation. La prédiction augmente-t-elle linéairement avec le revenu ? Atteint-elle un plateau au-dessus de 80 k€ ? Y a-t-il un effet de seuil à 40 k€ ? Les Graphiques de Dépendance Partielle (PDPs) répondent à ces questions visuellement. Ils sont le pendant 'graphique d'effet' aux scores d'importance. Ensemble ils forment un tableau complet : l'importance indique l'ampleur, les PDPs indiquent la direction et la forme. Utilisés avec les courbes ICE, ils révèlent aussi si le PDP moyen est un résumé fiable ou une moyenne trompeuse d'effets hétérogènes.",
    textAr: "تُخبرك أهمية الميزات أن الدخل هو الميزة الأكثر تنبؤاً، لكنها لا تقول شيئاً عن شكل تلك العلاقة. هل يزداد التنبؤ خطياً مع الدخل؟ هل يستقر فوق 80 ألف يورو؟ هل هناك تأثير عتبة عند 40 ألف؟ تُجيب مخططات الاعتماد الجزئي (PDPs) على هذه الأسئلة بصرياً. إنها المقابل 'مخطط التأثير' لدرجات الأهمية. معاً يُشكّلان صورة كاملة: الأهمية تُخبرك بالحجم، وPDPs تُخبرك بالاتجاه والشكل. مع منحنيات ICE تكشف أيضاً ما إذا كان متوسط PDP ملخصاً موثوقاً أم متوسطاً مضلِّلاً لتأثيرات متباينة.",
    calloutFr: "Un PDP montrant une relation plate pour une caractéristique très importante est un signal d'alerte — cela signifie souvent que la marginalisation cache des effets d'interaction visibles seulement dans les courbes ICE.",
    calloutAr: "PDP يُظهر علاقة مسطحة لميزة عالية الأهمية هو علامة تحذير — غالباً يعني أن التهميش يخفي تأثيرات تفاعلية مرئية فقط في منحنيات ICE.",
  },
  "partial-dependence|1": {
    headingFr: "L'Interprétation Monte Carlo",
    headingAr: "تفسير مونتي كارلو",
    textFr: "L'estimation PDP fonctionne par simulation Monte Carlo : pour une valeur donnée x_j = v, remplacez la j-ième colonne de votre jeu de données entier par v, faites passer tous les n échantillons dans le modèle, et faites la moyenne des prédictions. Répétez pour chaque v sur une grille. Le résultat est la courbe de réponse moyenne du modèle. L'hypothèse clé est l'indépendance des caractéristiques — la marginalisation prétend que x_j peut prendre la valeur v tandis que toutes les autres caractéristiques conservent leur distribution conjointe d'origine. Quand les caractéristiques sont corrélées (ex. revenu et âge), cela crée une extrapolation dans des régions improbables. Les graphiques ALE corrigent cela en conditionnant sur la distribution réelle des données.",
    textAr: "يعمل تقدير PDP بمحاكاة مونتي كارلو: لقيمة معطاة x_j = v، استبدل العمود j في مجموعة البيانات بأكملها بـ v، مرّر جميع عينات n عبر النموذج، وحسب متوسط التنبؤات. كرر لكل v على شبكة. النتيجة هي منحنى استجابة النموذج المتوسط. الافتراض الرئيسي هو استقلالية الميزات — يتظاهر التهميش بأن x_j يمكنه أخذ القيمة v بينما تحتفظ جميع الميزات الأخرى بتوزيعها المشترك الأصلي. عندما تكون الميزات مرتبطة تخلق هذا استقراءً في مناطق غير معقولة. تُصلح مخططات ALE هذا بالاشتراط على توزيع البيانات الفعلي.",
    calloutFr: "Les courbes ICE sont l'équivalent au niveau individuel : au lieu de faire la moyenne, tracez la courbe de chaque échantillon séparément. Si les courbes ICE s'éventent ou se croisent, la moyenne PDP est trompeuse — il y a des effets d'interaction.",
    calloutAr: "منحنيات ICE هي المكافئ على المستوى الفردي: بدلاً من حساب المتوسط ارسم منحنى كل عينة بشكل منفصل. إذا تباعدت أو تقاطعت منحنيات ICE فمتوسط PDP مضلِّل — هناك تأثيرات تفاعلية.",
  },
  "partial-dependence|2": {
    headingFr: "Calcul PDP + ICE : Étape par Étape",
    headingAr: "حساب PDP + ICE: خطوة بخطوة",
    stepsFr: [
      "Choisissez la caractéristique j et une grille de valeurs G = {v₁, v₂, …, vₖ} (par défaut : 100 points entre le 5e–95e percentile).",
      "Pour chaque valeur de grille v ∈ G : définissez X_j = v pour tous les n échantillons (créez n copies), calculez f(X_j=v, X_{-j}) pour tous les n échantillons, enregistrez la moyenne comme PDP(v) et toutes les n valeurs comme courbes ICE.",
      "Tracez PDP(v) comme ligne moyenne. Tracez chaque courbe ICE comme ligne légère de la même couleur.",
      "Centrez éventuellement les courbes ICE (c-ICE) : soustrayez la valeur de chaque courbe à v_min pour que toutes les courbes commencent à 0 — élimine le bruit d'intercept.",
      "Pour les PDPs 2D (graphiques d'interaction) : fixez deux caractéristiques j1, j2 sur une grille, marginalisez sur toutes les autres — produit une carte de chaleur montrant l'effet conjoint.",
    ],
    stepsAr: [
      "اختر الميزة j وشبكة من القيم G = {v₁, v₂, …, vₖ} (افتراضياً: 100 نقطة بين النسيلة 5-95).",
      "لكل قيمة شبكة v ∈ G: اضبط X_j = v لجميع عينات التدريب الـ n (أنشئ n نسخة)، احسب f(X_j=v, X_{-j}) لجميع عينات n، سجّل المتوسط كـ PDP(v) وجميع القيم كمنحنيات ICE.",
      "ارسم PDP(v) كخط متوسط. ارسم كل منحنى ICE كخط خافت بنفس اللون.",
      "اختيارياً مرّكز منحنيات ICE (c-ICE): اطرح قيمة كل منحنى عند v_min حتى تبدأ جميع المنحنيات عند 0 — يُزيل ضوضاء التقاطع.",
      "لـPDPs ثنائية الأبعاد (مخططات التفاعل): ثبّت ميزتين j1, j2 على شبكة، هَمِّش على جميع الأخرى — ينتج خريطة حرارية تُظهر التأثير المشترك.",
    ],
  },
  "partial-dependence|3": {
    headingFr: "PDP + ICE avec l'API d'Inspection scikit-learn",
    headingAr: "PDP + ICE مع واجهة الفحص في scikit-learn",
    codeFr: `from sklearn.ensemble import GradientBoostingClassifier
from sklearn.inspection import PartialDependenceDisplay
from sklearn.model_selection import train_test_split
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# ── Jeu de données ─────────────────────────────────────────────────────────────
np.random.seed(0)
n = 2000
X = pd.DataFrame({
    "revenu":       np.random.normal(50, 15, n).clip(15, 120),
    "age":          np.random.randint(18, 70, n).astype(float),
    "score_credit": np.random.normal(650, 80, n).clip(300, 850),
})
y = (0.5*(X["revenu"]>55) + 0.3*(X["score_credit"]>660) + 0.2*(X["age"]>40)) > 0.5

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# ── Entraîner le modèle ────────────────────────────────────────────────────────
clf = GradientBoostingClassifier(n_estimators=200, max_depth=4, random_state=42)
clf.fit(X_train, y_train)

# ── 1. PDP standard pour 3 caractéristiques ──────────────────────────────────
fig, axes = plt.subplots(1, 3, figsize=(15, 4))
PartialDependenceDisplay.from_estimator(
    clf, X_train,
    features=["revenu", "age", "score_credit"],
    kind="average",           # "average" = PDP uniquement
    grid_resolution=50,
    ax=axes,
)
plt.suptitle("Graphiques de Dépendance Partielle (PDP)")
plt.tight_layout(); plt.show()

# ── 2. PDP + ICE superposés ───────────────────────────────────────────────────
fig, axes = plt.subplots(1, 3, figsize=(15, 4))
PartialDependenceDisplay.from_estimator(
    clf, X_train,
    features=["revenu", "age", "score_credit"],
    kind="both",              # "both" = PDP (gras) + ICE (léger)
    subsample=100,
    alpha=0.3,
    ax=axes,
)
plt.suptitle("PDP + Courbes ICE — la divergence révèle les interactions")
plt.tight_layout(); plt.show()

# ── 3. ICE centré (c-ICE) ────────────────────────────────────────────────────
fig, axes = plt.subplots(1, 3, figsize=(15, 4))
PartialDependenceDisplay.from_estimator(
    clf, X_train,
    features=["revenu", "age", "score_credit"],
    kind="individual",        # ICE uniquement
    centered=True,            # ancrer chaque courbe à sa valeur la plus à gauche
    subsample=150,
    alpha=0.2,
    ax=axes,
)
plt.suptitle("ICE centré (c-ICE) — formes d'interaction visibles")
plt.tight_layout(); plt.show()

# ── 4. PDP 2D d'interaction (carte de chaleur) ─────────────────────────────
fig, ax = plt.subplots(figsize=(6, 5))
PartialDependenceDisplay.from_estimator(
    clf, X_train,
    features=[("revenu", "score_credit")],  # tuple = PDP 2D
    ax=ax,
)
plt.title("PDP 2D : interaction revenu × score_credit")
plt.tight_layout(); plt.show()

# ── 5. Calcul manuel du PDP (éducatif) ───────────────────────────────────────
grille = np.linspace(X_train["revenu"].quantile(0.05),
                     X_train["revenu"].quantile(0.95), 50)
valeurs_pdp = []
for v in grille:
    X_mod = X_train.copy()
    X_mod["revenu"] = v
    valeurs_pdp.append(clf.predict_proba(X_mod)[:, 1].mean())

plt.figure(figsize=(6, 3))
plt.plot(grille, valeurs_pdp, lw=2, color="#8b5cf6")
plt.xlabel("revenu"); plt.ylabel("P(défaut=1) prédit moyen")
plt.title("PDP manuel — effet du revenu")
plt.tight_layout(); plt.show()`,
  },
  "partial-dependence|4": {
    headingFr: "Graphiques ALE : Corriger l'Extrapolation de PDP",
    headingAr: "مخططات ALE: إصلاح مشكلة الاستقراء في PDP",
    formulaLabelFr: "ALE — intègre les effets locaux de dérivée",
    formulaLabelAr: "ALE — تكامل التأثيرات المحلية للمشتقة",
    textFr: "Les graphiques ALE (Accumulated Local Effects) conditionnent sur le voisinage de x_j = v plutôt que de marginaliser sur l'ensemble des données. Cela respecte la distribution réelle des données et évite l'extrapolation dans des régions impossibles (ex. personnes de 20 ans avec 150k€ de revenu). La formulation basée sur les dérivées calcule l'effet local d'un petit déplacement de x_j, puis intègre ces effets locaux — donnant une version fidèle à la distribution du PDP. Pour les caractéristiques non corrélées, PDP et ALE produisent des graphiques quasi identiques. Pour les caractéristiques corrélées, ALE est strictement plus fiable.",
    textAr: "تُشترط مخططات ALE (التأثيرات المحلية المتراكمة) على جوار x_j = v بدلاً من التهميش عبر مجموعة البيانات الكاملة. يحترم هذا التوزيع الفعلي للبيانات ويتجنب الاستقراء في مناطق مستحيلة (مثل أشخاص عمرهم 20 عاماً بدخل 150 ألف يورو). تُحسب الصيغة المبنية على المشتقات التأثير المحلي لتحريك x_j بمقدار صغير ثم تدمج تلك التأثيرات المحلية — منتجةً نسخة وفية للتوزيع من PDP. للميزات غير المرتبطة تُنتج PDP وALE مخططات شبه متطابقة. للميزات المرتبطة ALE أكثر موثوقية بصرامة.",
  },
  "partial-dependence|5": {
    headingFr: "Quand PDP Ment : Le Problème de l'Effet Hétérogène",
    headingAr: "عندما يكذب PDP: مشكلة التأثير المتباين",
    textFr: "Un PDP peut montrer une ligne parfaitement plate pour le revenu tandis que les courbes ICE individuelles varient de fortement positif à fortement négatif — si les effets de signes opposés s'annulent dans la moyenne. Cela se produit quand il y a de forts effets d'interaction (ex. le revenu importe beaucoup pour les jeunes emprunteurs mais pas pour les plus âgés). Vérifiez toujours les courbes ICE à côté des PDPs. De plus, les PDPs sont coûteux pour les grands jeux de données : n × k évaluations de modèle par caractéristique. Utilisez subsample=200 pour limiter le calcul des courbes ICE. Enfin, les PDPs n'ont pas d'intervalles de confiance par défaut — utilisez des PDPs bootstrappés pour obtenir des bandes d'incertitude.",
    textAr: "يمكن أن يُظهر PDP خطاً مسطحاً تماماً للدخل بينما تتراوح منحنيات ICE الفردية من موجب قوي إلى سالب قوي — إذا ألغت التأثيرات ذات الإشارات المتعاكسة بعضها في المتوسط. يحدث هذا عند وجود تأثيرات تفاعلية قوية. تحقق دائماً من منحنيات ICE إلى جانب PDPs. أيضاً PDPs مُكلفة حسابياً للبيانات الكبيرة: تقييمات n × k للنموذج لكل ميزة. استخدم subsample=200 للحد من حساب منحنيات ICE. أخيراً لا تحتوي PDPs على فترات ثقة افتراضياً — استخدم PDPs متحيزة باستخدام bootstrap للحصول على نطاقات عدم اليقين.",
    calloutFr: "Si le PDP montre une ligne plate mais que l'importance par permutation dit que la caractéristique est critique, vérifiez les courbes ICE — vous avez probablement un effet d'interaction masqué.",
    calloutAr: "إذا أظهر PDP خطاً مسطحاً لكن أهمية التبديل تقول إن الميزة حرجة، تحقق من منحنيات ICE — على الأرجح لديك تأثير تفاعلي مخفي.",
  },

};

export const keyFormulaI18n_inspection: Record<string, KeyFormulaI18n> = {

  // ── feature-importance ───────────────────────────────────────────────────────
  "feature-importance|0": {
    nameFr: "Importance par Permutation",   nameAr: "أهمية التبديل",
    meaningFr: "Chute de précision quand la caractéristique j est mélangée aléatoirement — agnostique au modèle, fonctionne après l'entraînement",
    meaningAr: "انخفاض الدقة عند خلط الميزة j عشوائياً — مستقل عن النموذج، يعمل بعد التدريب",
  },
  "feature-importance|1": {
    nameFr: "Importance par Impureté de Gini",  nameAr: "أهمية شوائب جيني",
    meaningFr: "Diminution pondérée de l'impureté à travers tous les splits sur la caractéristique j — rapide mais biaisée vers la cardinalité",
    meaningAr: "تناقص الشوائب الموزون عبر جميع تقسيمات الميزة j — سريع لكن متحيز نحو الأساس",
  },
  "feature-importance|2": {
    nameFr: "SHAP (noyau)",  nameAr: "SHAP (النواة)",
    meaningFr: "Valeur de Shapley : contribution marginale moyenne de chaque caractéristique sur toutes les coalitions de caractéristiques",
    meaningAr: "قيمة Shapley: المساهمة الهامشية المتوسطة لكل ميزة عبر جميع تحالفات الميزات",
  },
  "feature-importance|3": {
    nameFr: "Importance par Suppression de Colonne",  nameAr: "أهمية حذف العمود",
    meaningFr: "Étalon-or mais coûteux — réentraîner une fois par caractéristique",
    meaningAr: "المعيار الذهبي لكنه مكلف — إعادة تدريب مرة واحدة لكل ميزة",
  },

  // ── partial-dependence ────────────────────────────────────────────────────────
  "partial-dependence|0": {
    nameFr: "Fonction de Dépendance Partielle",  nameAr: "دالة الاعتماد الجزئي",
    meaningFr: "Sortie moyenne du modèle sur toutes les valeurs des caractéristiques complémentaires — marginalise les interactions",
    meaningAr: "متوسط مخرج النموذج عبر جميع قيم الميزات التكميلية — يهمّش التفاعلات",
  },
  "partial-dependence|1": {
    nameFr: "Courbe ICE (individuelle)",  nameAr: "منحنى ICE (فردي)",
    meaningFr: "Prédiction pour l'échantillon i quand la caractéristique j varie — garde toutes les autres caractéristiques à leurs valeurs réelles",
    meaningAr: "التنبؤ للعينة i بينما تتغير الميزة j — يُبقي جميع الميزات الأخرى عند قيمها الفعلية",
  },
  "partial-dependence|2": {
    nameFr: "c-ICE (centré)",  nameAr: "c-ICE (مرتكز)",
    meaningFr: "Courbe ICE ancrée au point de référence x_j0 — supprime les différences d'intercept, met en évidence la forme des interactions",
    meaningAr: "منحنى ICE مُرسَّخ عند نقطة المرجع x_j0 — يُزيل فروق التقاطع ويُبرز شكل التفاعلات",
  },
  "partial-dependence|3": {
    nameFr: "Relation PDP–ICE",  nameAr: "العلاقة PDP–ICE",
    meaningFr: "PDP est exactement la moyenne ponctuelle de toutes les courbes ICE",
    meaningAr: "PDP هو تماماً المتوسط النقطي لجميع منحنيات ICE",
  },

};

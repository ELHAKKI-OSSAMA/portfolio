import type { SectionI18n, KeyFormulaI18n } from '../types';

export const sectionI18n_supervised: Record<string, SectionI18n> = {

  // ── linear-regression ────────────────────────────────────────────────────────
  "linear-regression|0": {
    headingFr: "Pourquoi Est-ce Important ?",
    headingAr: "لماذا يهم هذا؟",
    textFr: "La régression est la base de tout système de prédiction. Votre score de crédit, les prévisions météo, l'estimation du prix d'une maison, le moteur de recommandation — tout commence ici. Avant les réseaux de neurones, avant les ensembles, il y avait la droite. Comprendre profondément la régression signifie comprendre ce que 'l'apprentissage' signifie mathématiquement.",
    textAr: "الانحدار هو أساس كل نظام تنبؤ. درجة الائتمان، توقعات الطقس، تقدير سعر المنزل، محرك التوصية — كلها تبدأ هنا. قبل الشبكات العصبية، قبل المجموعات، كانت الخط. فهم الانحدار بعمق يعني فهم ما يعنيه 'التعلم' رياضياً.",
    calloutFr: "La régression linéaire a remporté un prix Nobel (économie, 1978). Elle précède les ordinateurs de 200 ans — Gauss l'utilisait pour prédire les orbites planétaires.",
    calloutAr: "فاز الانحدار الخطي بجائزة نوبل (الاقتصاد، 1978). يسبق الحواسيب بـ200 عام — استخدمه غاوس للتنبؤ بمدارات الكواكب.",
  },
  "linear-regression|1": {
    headingFr: "L'Intuition Géométrique",
    headingAr: "الحدس الهندسي",
    textFr: "Imaginez lancer des fléchettes sur un mur. Chaque fléchette atterrit à une position (x, y). Vous voulez trouver la droite qui passe le plus près de toutes les fléchettes simultanément. 'Le plus près' signifie minimiser les distances verticales (résidus) de chaque fléchette à votre droite. Les résidus au carré transforment cela en un paysage en forme de bol — et le fond du bol est la solution MCO.",
    textAr: "تخيل رمي السهام على حائط. كل سهم يهبط في موضع (x, y). تريد إيجاد الخط الذي يمر بأقرب ما يمكن من جميع السهام في آنٍ واحد. 'الأقرب' يعني تقليل المسافات الرأسية (البواقي) من كل سهم إلى خطك. البواقي المربعة تحول هذا إلى منظر على شكل وعاء — وقاع الوعاء هو حل المربعات الصغرى.",
  },
  "linear-regression|2": {
    headingFr: "Les Mathématiques des Moindres Carrés",
    headingAr: "رياضيات المربعات الصغرى",
    textFr: "Nous modélisons la relation comme ŷ = Xβ + ε où ε ~ N(0, σ²). Minimiser la somme des résidus au carré a une belle solution en forme fermée appelée l'Équation Normale. Cela fonctionne parce que la surface de perte est un paraboloïde — un bol parfait avec exactement un minimum.",
    textAr: "نصمم العلاقة كـ ŷ = Xβ + ε حيث ε ~ N(0, σ²). تقليل مجموع البواقي المربعة له حل جميل بصيغة مغلقة يسمى المعادلة الطبيعية. يعمل هذا لأن سطح الخسارة مكافئ مكافئ — وعاء مثالي بحد أدنى واحد بالضبط.",
    formulaLabelFr: "Équation Normale (MCO)",
    formulaLabelAr: "المعادلة الطبيعية (MCO)",
  },
  "linear-regression|3": {
    headingFr: "Pourquoi Maximiser la Vraisemblance = Minimiser les Erreurs Carrées",
    headingAr: "لماذا تعظيم الاحتمالية = تصغير الأخطاء المربعة",
    textFr: "Cette connexion est profonde. Si nous supposons un bruit gaussien ε ~ N(0, σ²), alors la vraisemblance de l'observation y sachant x est proportionnelle à exp(-(y - Xβ)²/2σ²). Prendre le log et nier donne exactement la somme des résidus au carré. MCO et EMV sont la même chose sous un bruit gaussien.",
    textAr: "هذا الترابط عميق. إذا افترضنا ضوضاء غاوسية ε ~ N(0, σ²)، فاحتمال مشاهدة y بمعلومية x يتناسب مع exp(-(y - Xβ)²/2σ²). أخذ اللوغاريتم والنفي يعطينا بالضبط مجموع البواقي المربعة. MCO وMLE نفس الشيء تحت الضوضاء الغاوسية.",
    calloutFr: "Le bruit gaussien est pourquoi les valeurs aberrantes font si mal — les erreurs carrées pénalisent les grands résidus quadratiquement. Utilisez la perte de Huber pour la robustesse.",
    calloutAr: "افتراض الضوضاء الغاوسية هو سبب تأثير القيم الشاذة بشدة — الأخطاء المربعة تعاقب البواقي الكبيرة تربيعياً. استخدم خسارة هوبر للمتانة.",
  },
  "linear-regression|4": {
    headingFr: "Descente de Gradient : Apprendre Étape par Étape",
    headingAr: "الانحدار التدرجي: التعلم خطوة بخطوة",
    textFr: "Quand XᵀX n'est pas inversible (multicolinéarité) ou que le jeu de données est trop grand pour l'Équation Normale, nous utilisons la descente de gradient. Commencez n'importe où sur la surface de perte, mesurez la pente, faites un petit pas vers le bas. Répétez jusqu'à la convergence.",
    textAr: "عندما لا تكون XᵀX قابلة للعكس (التعددية الخطية) أو كان مجموعة البيانات كبيرة جداً للمعادلة الطبيعية، نستخدم الانحدار التدرجي. ابدأ في أي مكان على سطح الخسارة، قس الميل، اخطُ خطوة صغيرة للأسفل. كرر حتى التقارب.",
    stepsFr: [
      "Initialiser les poids β = 0 (ou petites valeurs aléatoires)",
      "Calculer la prédiction : ŷ = Xβ",
      "Calculer les résidus : ε = y - ŷ",
      "Calculer le gradient : ∇L = -(2/n) Xᵀε",
      "Mise à jour : β ← β - α · ∇L",
      "Répéter jusqu'à ||∇L|| < tolérance",
    ],
    stepsAr: [
      "تهيئة الأوزان β = 0 (أو قيم عشوائية صغيرة)",
      "حساب التنبؤ: ŷ = Xβ",
      "حساب البواقي: ε = y - ŷ",
      "حساب التدرج: ∇L = -(2/n) Xᵀε",
      "التحديث: β ← β - α · ∇L",
      "التكرار حتى ||∇L|| < التسامح",
    ],
  },
  "linear-regression|5": {
    headingFr: "Régression Logistique : Le Saut Binaire",
    headingAr: "الانحدار اللوجستي: القفزة الثنائية",
    textFr: "Pour les résultats binaires, nous avons besoin de sorties dans (0,1). Nous passons la combinaison linéaire à travers la fonction sigmoïde σ(z) = 1/(1+e⁻ᶻ), qui applique ℝ → (0,1). La fonction de perte passe de MSE à l'Entropie Croisée Binaire (log loss).",
    textAr: "للنتائج الثنائية نحتاج مخرجات في النطاق (0,1). نمرر التركيبة الخطية عبر دالة السيغمويد σ(z) = 1/(1+e⁻ᶻ) التي تضع ℝ → (0,1). تتغير دالة الخسارة من MSE إلى الإنتروبيا التقاطعية الثنائية (خسارة اللوغاريتم).",
    formulaLabelFr: "Perte d'Entropie Croisée Binaire",
    formulaLabelAr: "خسارة الإنتروبيا التقاطعية الثنائية",
  },
  "linear-regression|6": {
    headingFr: "De Zéro avec NumPy",
    headingAr: "من الصفر مع NumPy",
    codeFr: `import numpy as np
from sklearn.datasets import make_regression

# ── Données d'exemple ──────────────────────────────────────────────────
X_brut, y = make_regression(n_samples=200, n_features=5, noise=10, random_state=42)
X = np.c_[np.ones(len(X_brut)), X_brut]   # ajouter colonne de biais
lam = 0.1                                   # intensité de la régularisation Ridge

class RegLineaire:
    def __init__(self, lr=0.01, n_iter=1000):
        self.lr, self.n_iter = lr, n_iter

    def ajuster(self, X, y):
        n, p = X.shape
        self.beta = np.zeros(p)
        for _ in range(self.n_iter):
            y_pred = X @ self.beta
            residus = y - y_pred
            grad = -(2/n) * X.T @ residus
            self.beta -= self.lr * grad
        return self

    def predire(self, X):
        return X @ self.beta

# Démo
modele = RegLineaire(lr=0.01, n_iter=1000).ajuster(X, y)
print("Bêta GD :", modele.beta[:3].round(2))

# Forme fermée (Équation Normale) :
beta_mco = np.linalg.solve(X.T @ X, X.T @ y)
# Ridge (régularisation L2) :
p = X.shape[1]
beta_ridge = np.linalg.solve(X.T @ X + lam * np.eye(p), X.T @ y)
print("Bêta MCO :  ", beta_mco[:3].round(2))
print("Bêta Ridge :", beta_ridge[:3].round(2))`,
  },
  "linear-regression|7": {
    headingFr: "Pièges Critiques",
    headingAr: "المزالق الحرجة",
    textFr: "Quatre erreurs qui tuent les modèles de régression en production :",
    textAr: "أربعة أخطاء تُدمّر نماذج الانحدار في الإنتاج:",
    stepsFr: [
      "Multicolinéarité — Des caractéristiques corrélées rendent (XᵀX) quasi-singulière. VIF > 10 est un signal d'alarme. Solution : régularisation Ridge ou ACP.",
      "Caractéristiques non mises à l'échelle — La descente de gradient converge 100× plus lentement si les caractéristiques ont des échelles différentes. Appliquez toujours StandardScaler d'abord.",
      "Hétéroscédasticité — Variance des résidus non constante. Visualisez les résidus vs valeurs ajustées.",
      "Extrapolation — Les modèles linéaires sont dangereusement confiants hors de la plage d'entraînement. N'extrapolez jamais sans connaissance du domaine.",
    ],
    stepsAr: [
      "التعددية الخطية — الميزات المرتبطة تجعل (XᵀX) شبه منفردة. VIF > 10 إنذار. الحل: تنظيم Ridge أو ACP.",
      "الميزات غير الموسّعة — الانحدار التدرجي يتقارب أبطأ 100× إذا كانت الميزات بمقاييس مختلفة. طبّق دائماً StandardScaler أولاً.",
      "عدم تجانس التباين — تباين البواقي غير ثابت. تخيّل البواقي مقابل القيم المجهّزة.",
      "الاستقراء — النماذج الخطية واثقة بشكل خطير خارج نطاق التدريب. لا تستقرئ أبداً بدون معرفة النطاق.",
    ],
  },

  // ── decision-tree-rf ─────────────────────────────────────────────────────────
  "decision-tree-rf|0": {
    headingFr: "Le Modèle le Plus Simple et Puissant",
    headingAr: "النموذج الأبسط والأقوى",
    textFr: "Les arbres de décision imitent le raisonnement humain : 'Si âge > 40 ET fumeur ET cholestérol > 200 → risque élevé'. Ils sont interprétables, ne nécessitent pas de mise à l'échelle des caractéristiques, gèrent les types mixtes et capturent les relations non linéaires. Seuls, ils sur-ajustent beaucoup — mais comme bloc de construction pour la Forêt Aléatoire, XGBoost et LightGBM, ils constituent la structure de modèle la plus importante en ML tabulaire.",
    textAr: "أشجار القرار تحاكي التفكير البشري: 'إذا كان العمر > 40 والتدخين والكوليسترول > 200 → خطر مرتفع'. إنها قابلة للتفسير، لا تتطلب تحجيم الميزات، تتعامل مع الأنواع المختلطة، وتلتقط العلاقات غير الخطية. بمفردها تُفرط في الملاءمة — لكن كلبنة بناء للغابة العشوائية وXGBoost وLightGBM، إنها أهم بنية نموذج في التعلم الآلي الجدولي.",
  },
  "decision-tree-rf|1": {
    headingFr: "Partitionnement Binaire Récursif",
    headingAr: "التقسيم الثنائي التكراري",
    textFr: "Un arbre de décision partitionne l'espace des caractéristiques en régions rectangulaires. À chaque étape, il demande : 'Quel seuil de caractéristique unique sépare le mieux les classes ?' Il mesure 'le mieux' en utilisant l'impureté (Gini ou entropie). Le processus récurse sur chaque sous-région jusqu'à atteindre un critère d'arrêt.",
    textAr: "تُقسّم شجرة القرار فضاء الميزات إلى مناطق مستطيلة. في كل خطوة تسأل: 'أي حد أحادي للميزة يفصل الفئات بشكل أفضل؟' تقيس 'الأفضل' باستخدام الشوائب (جيني أو إنتروبيا). تتكرر العملية على كل منطقة فرعية حتى الوصول إلى معيار التوقف.",
    calloutFr: "Un arbre de décision de profondeur 20 avec des divisions binaires peut représenter 2²⁰ ≈ 1 million de régions différentes. C'est pourquoi ils sur-ajustent si catastrophiquement sur des données brutes.",
    calloutAr: "شجرة قرار بعمق 20 مع انقسامات ثنائية يمكنها تمثيل 2²⁰ ≈ مليون منطقة مختلفة. هذا سبب إفراطها الكارثي في الملاءمة على البيانات الخام.",
  },
  "decision-tree-rf|2": {
    headingFr: "Gini vs Entropie : Les Critères de Division",
    headingAr: "جيني مقابل الإنتروبيا: معايير التقسيم",
    textFr: "Les deux mesurent l'impureté — plus c'est bas, mieux c'est. Le Gini est plus rapide à calculer (sans log). L'entropie est légèrement plus sensible aux probabilités de classe proches de 0,5. En pratique, ils produisent des arbres presque identiques.",
    textAr: "كلاهما يقيس الشوائب — الأقل أفضل. جيني أسرع في الحساب (بدون لوغاريتم). الإنتروبيا أكثر حساسية قليلاً لاحتمالات الفئات القريبة من 0.5. عملياً، ينتجان أشجاراً متقاربة.",
    formulaLabelFr: "Gini pour la classification binaire",
    formulaLabelAr: "جيني للتصنيف الثنائي",
  },
  "decision-tree-rf|3": {
    headingFr: "Pourquoi la Forêt Aléatoire Fonctionne : Décomposition Biais-Variance",
    headingAr: "لماذا تعمل الغابة العشوائية: تحليل التحيز والتباين",
    textFr: "Un arbre profond unique a un faible biais mais une variance catastrophiquement élevée — il mémorise le bruit d'entraînement. La Forêt Aléatoire exploite deux astuces : (1) L'échantillonnage bootstrap fait croître chaque arbre sur un sous-ensemble aléatoire différent de données. (2) Les sous-ensembles aléatoires de caractéristiques (√p caractéristiques par division) décorrèlent les arbres. Faire la moyenne d'estimateurs décorrélés à haute variance réduit la variance sans augmenter le biais.",
    textAr: "شجرة عميقة واحدة لها تحيز منخفض لكن تباين كارثياً مرتفع — تحفظ ضوضاء التدريب. الغابة العشوائية تستغل حيلتين: (1) أخذ عينات bootstrap يُنمّي كل شجرة على مجموعة فرعية عشوائية مختلفة. (2) المجموعات الفرعية العشوائية للميزات (√p ميزة لكل انقسام) تزيل الارتباط بين الأشجار. معدل المقدّرات غير المترابطة ذات التباين المرتفع يقلل التباين دون زيادة التحيز.",
    calloutFr: "Le 'aléatoire' dans la Forêt Aléatoire fait référence à la sélection aléatoire des caractéristiques à chaque division, pas seulement au bootstrap. C'est l'insight clé de Breiman (2001).",
    calloutAr: "'العشوائي' في الغابة العشوائية يشير إلى اختيار الميزات العشوائي في كل انقسام، ليس فقط bootstrap. هذه هي رؤية بريمان الرئيسية من عام 2001.",
  },
  "decision-tree-rf|4": {
    headingFr: "Algorithme d'Entraînement de la Forêt Aléatoire",
    headingAr: "خوارزمية تدريب الغابة العشوائية",
    stepsFr: [
      "Pour t = 1 à T (nombre d'arbres) :",
      "  Échantillon bootstrap Dₜ des données d'entraînement (n échantillons avec remplacement)",
      "  Faire croître l'arbre de décision hₜ sur Dₜ :",
      "    À chaque nœud, sélectionner aléatoirement m = √p caractéristiques",
      "    Trouver la meilleure division parmi ces m caractéristiques (Gini/entropie le plus bas)",
      "    Développer jusqu'à max_depth ou min_samples_leaf atteint",
      "Prédiction finale : vote majoritaire (classification) ou moyenne (régression)",
      "Estimation OOB : pour chaque échantillon, prédire en utilisant seulement les arbres qui ne l'ont pas vu",
    ],
    stepsAr: [
      "لكل t من 1 إلى T (عدد الأشجار):",
      "  أخذ عينة bootstrap Dₜ من بيانات التدريب (n عينة مع الإرجاع)",
      "  نمو شجرة القرار hₜ على Dₜ:",
      "    في كل عقدة، اختيار m = √p ميزة عشوائياً",
      "    إيجاد أفضل انقسام من بين تلك الميزات m (أدنى جيني/إنتروبيا)",
      "    توسيع حتى الوصول لـmax_depth أو min_samples_leaf",
      "التنبؤ النهائي: تصويت الأغلبية (تصنيف) أو المتوسط (انحدار)",
      "تقدير OOB: لكل عينة، تنبؤ بالأشجار التي لم تشاهدها فقط",
    ],
  },
  "decision-tree-rf|5": {
    headingFr: "Modèle de Production",
    headingAr: "نمط الإنتاج",
    codeFr: `from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.datasets import make_classification
import pandas as pd
import shap

# ── Données d'exemple ──────────────────────────────────────────────────
X_brut, y = make_classification(n_samples=500, n_features=10,
                                  n_informative=5, random_state=42)
feature_names = [f"var_{i}" for i in range(X_brut.shape[1])]
X_train, X_test, y_train, y_test = train_test_split(
    X_brut, y, test_size=0.2, random_state=42)

# Entraînement
rf = RandomForestClassifier(
    n_estimators=500,
    max_features='sqrt',        # Sous-ensembles de caractéristiques aléatoires
    max_depth=None,             # Entièrement développé (élagué par min_samples_leaf)
    min_samples_leaf=1,
    oob_score=True,             # Estimation de validation gratuite
    random_state=42,
    n_jobs=-1
)
rf.fit(X_train, y_train)
print(f"Score OOB : {rf.oob_score_:.4f}")

# Importance des caractéristiques (Diminution Moyenne de l'Impureté)
importances = pd.Series(rf.feature_importances_, index=feature_names)
importances.nlargest(20).sort_values().plot(kind='barh')

# SHAP pour l'importance correcte des caractéristiques
explainer = shap.TreeExplainer(rf)
shap_values = explainer.shap_values(X_test)`,
  },
  "decision-tree-rf|6": {
    headingFr: "Pièges de la Forêt Aléatoire",
    headingAr: "مزالق الغابة العشوائية",
    stepsFr: [
      "L'importance des caractéristiques MDI est biaisée vers les caractéristiques à haute cardinalité. Utilisez l'importance par permutation ou SHAP.",
      "Mémoire : 500 arbres profonds peuvent utiliser 2–10 Go. Définissez max_depth=15–20 en production.",
      "Inférence lente : prédire sur 500 arbres en série est lent. Considérez n_estimators=100 pour le déploiement.",
      "Déséquilibre des classes : utilisez class_weight='balanced' ou bootstrap stratifié.",
    ],
    stepsAr: [
      "أهمية ميزات MDI متحيزة نحو الميزات ذات الكثافة العالية. استخدم أهمية التبديل أو SHAP بدلاً منها.",
      "الذاكرة: 500 شجرة عميقة قد تستخدم 2-10 جيجابايت. اضبط max_depth=15-20 في الإنتاج.",
      "بطء الاستدلال: التنبؤ عبر 500 شجرة بالتسلسل بطيء. فكر في n_estimators=100 للخدمة.",
      "عدم توازن الفئات: استخدم class_weight='balanced' أو bootstrap طبقي.",
    ],
  },

  // ── gradient-boosting ────────────────────────────────────────────────────────
  "gradient-boosting|0": {
    headingFr: "Pourquoi le Gradient Boosting Domine les Données Tabulaires",
    headingAr: "لماذا يهيمن تعزيز التدرج على البيانات الجدولية",
    textFr: "Depuis 2014, les méthodes de gradient boosting (XGBoost, LightGBM, CatBoost) ont remporté la majorité des compétitions Kaggle sur les données structurées. Ce sont les meilleurs algorithmes pour le ML tabulaire : ils gèrent les types mixtes nativement, ne nécessitent pas de mise à l'échelle, capturent les interactions non linéaires complexes, et viennent avec une régularisation intégrée.",
    textAr: "منذ عام 2014، فازت أساليب تعزيز التدرج (XGBoost, LightGBM, CatBoost) بغالبية مسابقات Kaggle على البيانات المنظمة. إنها أفضل خوارزمية للتعلم الآلي الجدولي: تتعامل مع الأنواع المختلطة أصلياً، لا تتطلب تحجيماً، تلتقط التفاعلات غير الخطية المعقدة، وتأتي مع تنظيم مدمج.",
  },
  "gradient-boosting|1": {
    headingFr: "L'Idée Centrale : Ajuster les Erreurs",
    headingAr: "الفكرة الأساسية: تعلم الأخطاء",
    textFr: "Supposez que votre modèle actuel prédit les prix des maisons et se trompe de 50k€ sur la maison A. Au lieu de ré-entraîner depuis zéro, entraînez un nouvel arbre pour prédire exactement cette erreur de 50k€. Ajoutez-le à votre modèle. Maintenant vous vous trompez moins. Répétez. Chaque nouvel arbre cible les erreurs résiduelles de tous les arbres précédents combinés.",
    textAr: "افترض أن نموذجك الحالي يتنبأ بأسعار المنازل ويُخطئ بـ50,000 درس في المنزل أ. بدلاً من إعادة التدريب من الصفر، درّب شجرة صغيرة جديدة للتنبؤ بتلك الـ50,000 تحديداً. أضفها إلى نموذجك. الآن أنت تُخطئ بأقل. كرر. كل شجرة جديدة تستهدف أخطاء البقايا لجميع الأشجار السابقة مجتمعة.",
    calloutFr: "Le 'gradient' dans le gradient boosting se réfère à la descente de gradient fonctionnel, pas à la descente de gradient paramétrique. Nous optimisons dans l'espace des fonctions, pas des poids.",
    calloutAr: "'التدرج' في تعزيز التدرج يشير إلى الانحدار التدرجي الدالي، ليس الانحدار التدرجي المعاملي. نُحسّن في فضاء الدوال، ليس الأوزان.",
  },
  "gradient-boosting|2": {
    headingFr: "Gradient Boosting comme Descente de Gradient dans l'Espace Fonctionnel",
    headingAr: "تعزيز التدرج كانحدار تدرجي في فضاء الدوال",
    textFr: "À l'étape m, nous ajustons un arbre hₘ au gradient négatif de la perte par rapport à la prédiction actuelle F_{m-1}(x). Pour la perte ECM L = ½(y − F(x))², le gradient négatif est exactement le résidu r = y − F(x). Pour d'autres pertes (log loss, MAE), nous obtenons différents 'pseudo-résidus' — d'où la généralité du cadre.",
    textAr: "في الخطوة m، نُلائم شجرة hₘ على التدرج السلبي للخسارة بالنسبة للتنبؤ الحالي F_{m-1}(x). لخسارة MSE ، التدرج السلبي هو بالضبط البقية r = y − F(x). لخسائر أخرى (log loss، MAE)، نحصل على 'شبه بواقٍ' مختلفة — ومن هنا عمومية الإطار.",
    formulaLabelFr: "Règle de mise à jour (ν = rétrécissement / taux d'apprentissage)",
    formulaLabelAr: "قاعدة التحديث (ν = معامل التقليص / معدل التعلم)",
  },
  "gradient-boosting|3": {
    headingFr: "XGBoost : Optimisation du Second Ordre",
    headingAr: "XGBoost: تحسين الرتبة الثانية",
    textFr: "Le GBM original de Friedman n'utilise que des gradients de premier ordre (résidus). XGBoost utilise à la fois le premier (G) et le second (H) ordre du développement de Taylor de la perte, lui donnant de meilleures informations sur la courbure — comme la méthode de Newton vs la descente de gradient.",
    textAr: "GBM الأصلي لفريدمان يستخدم فقط تدرجات الرتبة الأولى (البواقي). XGBoost يستخدم كلاً من الرتبة الأولى (G) والثانية (H) من توسيع تايلور للخسارة، مما يمنحه معلومات انحناء أفضل — كطريقة نيوتن مقابل الانحدار التدرجي.",
    formulaLabelFr: "Objectif régularisé XGBoost (développé de Taylor)",
    formulaLabelAr: "دالة الهدف المنظَّمة لـXGBoost (توسيع تايلور)",
  },
  "gradient-boosting|4": {
    headingFr: "XGBoost vs LightGBM vs CatBoost",
    headingAr: "XGBoost مقابل LightGBM مقابل CatBoost",
    stepsFr: [
      "XGBoost : Croissance en largeur + optimisation de second ordre. Plus lent mais mature. Meilleur pour les petits/moyens jeux de données.",
      "LightGBM : Croissance feuille par feuille + histogrammes. 10–20× plus rapide à l'entraînement. Meilleur pour les grands jeux de données.",
      "CatBoost : Boosting ordonné pour éviter les fuites de cibles. Gestion native des catégorielles. Meilleur avec beaucoup de caractéristiques catégorielles.",
      "Règle empirique : Commencez avec LightGBM. Utilisez CatBoost avec beaucoup de catégorielles. XGBoost pour les petits jeux où la vitesse ne compte pas.",
    ],
    stepsAr: [
      "XGBoost: نمو على مستوى الطبقة + تحسين الرتبة الثانية. أبطأ لكن ناضج. الأفضل لمجموعات البيانات الصغيرة/المتوسطة.",
      "LightGBM: نمو على مستوى الأوراق + التجزئة بالمدرّج. أسرع 10-20× في التدريب. الأفضل لمجموعات البيانات الكبيرة.",
      "CatBoost: boost مرتب لتجنب تسرب الهدف. معالجة أصلية للفئوية. الأفضل مع كثير من الميزات الفئوية.",
      "قاعدة عامة: ابدأ بـLightGBM. استخدم CatBoost مع فئويات ثقيلة. XGBoost لمجموعات البيانات الصغيرة حيث السرعة لا تهم.",
    ],
  },
  "gradient-boosting|5": {
    headingFr: "Croissance Feuille par Feuille de LightGBM",
    headingAr: "نمو LightGBM من الأوراق",
    stepsFr: [
      "Initialiser F₀(x) = log(p/(1-p)) pour la classification binaire",
      "Pour m = 1 à M :",
      "  Calculer les pseudo-résidus rᵢ = -∂L/∂F(xᵢ)|_{F=F_{m-1}}",
      "  Trouver la meilleure feuille à diviser (globalement, pas niveau par niveau)",
      "  Calculer les valeurs des feuilles : γⱼ = ΣᵢGᵢ / (ΣᵢHᵢ + λ)",
      "  Mise à jour : F_m(x) = F_{m-1}(x) + ν · γ_{feuille(x)}",
      "  Ajouter un arrêt anticipé si la perte de validation cesse de s'améliorer",
    ],
    stepsAr: [
      "تهيئة F₀(x) = log(p/(1-p)) للتصنيف الثنائي",
      "لـm من 1 إلى M:",
      "  حساب شبه البواقي rᵢ = -∂L/∂F(xᵢ)|_{F=F_{m-1}}",
      "  إيجاد أفضل ورقة للتقسيم (عالمياً، ليس مستوى بمستوى)",
      "  حساب قيم الأوراق: γⱼ = ΣᵢGᵢ / (ΣᵢHᵢ + λ)",
      "  التحديث: F_m(x) = F_{m-1}(x) + ν · γ_{ورقة(x)}",
      "  إضافة توقف مبكر إذا توقف تحسن خسارة التحقق",
    ],
  },
  "gradient-boosting|6": {
    headingFr: "LightGBM en Production avec Optuna",
    headingAr: "LightGBM في الإنتاج مع Optuna",
    codeFr: `import lightgbm as lgb
import optuna
import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split

# ── Données d'exemple ──────────────────────────────────────────────────
X, y = make_classification(n_samples=1000, n_features=20,
                            n_informative=10, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)
dtrain = lgb.Dataset(X_train, label=y_train)

def objectif(trial):
    params = {
        'objective': 'binary',
        'metric': 'auc',
        'learning_rate': trial.suggest_float('lr', 0.01, 0.3, log=True),
        'num_leaves': trial.suggest_int('num_leaves', 20, 300),
        'max_depth': trial.suggest_int('max_depth', 3, 12),
        'min_data_in_leaf': trial.suggest_int('min_child', 10, 100),
        'feature_fraction': trial.suggest_float('feat_frac', 0.4, 1.0),
        'bagging_fraction': trial.suggest_float('bag_frac', 0.4, 1.0),
        'lambda_l1': trial.suggest_float('l1', 1e-8, 10.0, log=True),
        'lambda_l2': trial.suggest_float('l2', 1e-8, 10.0, log=True),
        'verbose': -1,
    }
    cv_resultats = lgb.cv(
        params, dtrain, nfold=5,
        num_boost_round=500,
        early_stopping_rounds=50,
        stratified=True
    )
    return max(cv_resultats['valid auc-mean'])

etude = optuna.create_study(direction='maximize')
etude.optimize(objectif, n_trials=100)`,
  },

  // ── svm-knn-svr ──────────────────────────────────────────────────────────────
  "svm-knn-svr|0": {
    headingFr: "L'Idée Clé : Marge Maximale",
    headingAr: "الفكرة الرئيسية: الهامش الأقصى",
    textFr: "Imaginez la classification binaire avec un hyperplan séparateur. Une infinité d'hyperplans peuvent séparer les classes — mais lequel généralise le mieux ? Les SVMs répondent : celui avec la marge maximale — la plus grande 'rue' possible entre les deux classes. Les points sur la frontière de la marge sont les vecteurs de support. Seuls ces points déterminent la frontière ; les autres peuvent être supprimés sans la modifier.",
    textAr: "تخيل التصنيف الثنائي بمستوى فاصل. يمكن لعدد لا نهائي من المستويات الفاصلة أن تفصل الفئات — لكن أيها يعمم بشكل أفضل؟ تجيب SVMs: ذلك الذي يملك الهامش الأقصى — أكبر 'شارع' ممكن بين الفئتين. النقاط على حدود الهامش هي متجهات الدعم. فقط هذه النقاط تحدد الحدود؛ يمكن إزالة الباقي دون تغييرها.",
  },
  "svm-knn-svr|1": {
    headingFr: "L'Astuce du Noyau : Dimensions Infinies Gratuitement",
    headingAr: "حيلة النواة: أبعاد لانهائية مجاناً",
    textFr: "De nombreux jeux de données ne sont pas linéairement séparables dans leur espace d'origine. L'astuce du noyau mappe implicitement les données vers un espace de dimension plus élevée où elles SONT linéairement séparables — sans jamais calculer le mapping explicitement. K(x,x') = φ(x)·φ(x') calcule le produit scalaire dans l'espace haute dimension directement. Le noyau RBF mappe vers un espace de Hilbert de dimension infinie, rendant les SVMs incroyablement puissants.",
    textAr: "العديد من مجموعات البيانات ليست قابلة للفصل الخطي في فضائها الأصلي. حيلة النواة تُعيّن البيانات ضمنياً إلى فضاء عالي الأبعاد حيث تكون قابلة للفصل — دون حساب التعيين صراحة. K(x,x') = φ(x)·φ(x') تحسب الضرب النقطي في الفضاء عالي الأبعاد مباشرة. نواة RBF تعيّن إلى فضاء هيلبرت لانهائي الأبعاد، مما يجعل SVMs قوية بشكل استثنائي.",
    calloutFr: "Les SVMs sont le seul algorithme qui peut provablement fonctionner dans des espaces de caractéristiques de dimension infinie (RKHS). Aucun autre algorithme n'a cette propriété.",
    calloutAr: "SVMs هي الخوارزمية الوحيدة التي يمكنها إثبات العمل في فضاءات الميزات لانهائية الأبعاد (RKHS). لا توجد خوارزمية أخرى لديها هذه الخاصية.",
  },
  "svm-knn-svr|2": {
    headingFr: "Marge Souple : Gérer le Bruit avec du Slack",
    headingAr: "الهامش اللين: التعامل مع الضوضاء بالترخيص",
    textFr: "Pour les données bruitées, le SVM à marge dure (nécessitant une séparation parfaite) ne fonctionnera pas. Le SVM à marge souple introduit des variables de relâchement ξᵢ ≥ 0 permettant quelques erreurs de classification, pénalisées par l'hyperparamètre C. Grand C = marge étroite, faible tolérance aux erreurs (peut sur-ajuster). Petit C = marge large, haute tolérance (peut sous-ajuster).",
    textAr: "بالنسبة للبيانات الصاخبة، لن يعمل SVM ذو الهامش الصلب الذي يتطلب فصلاً مثالياً. يُقدم SVM ذو الهامش اللين متغيرات الترخيص ξᵢ ≥ 0 للسماح ببعض الأخطاء، معاقَبة بالمعامل الفائق C. C كبير = هامش ضيق، تحمل منخفض للأخطاء (قد يُفرط في الملاءمة). C صغير = هامش واسع، تحمل عالٍ (قد يُقصّر في الملاءمة).",
    formulaLabelFr: "Objectif primal SVM à marge souple",
    formulaLabelAr: "هدف SVM الأولي بهامش لين",
  },
  "svm-knn-svr|3": {
    headingFr: "SVM en Production",
    headingAr: "SVM في بيئة الإنتاج",
    codeFr: `from sklearn.svm import SVC, SVR
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.model_selection import GridSearchCV, train_test_split
from sklearn.datasets import make_classification

# ── Données d'exemple ──────────────────────────────────────────────────
X, y = make_classification(n_samples=300, n_features=10, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

# CRITIQUE : SVM nécessite une mise à l'échelle des caractéristiques
pipeline_svm = Pipeline([
    ('normaliseur', StandardScaler()),
    ('svm', SVC(kernel='rbf', probability=True))
])

# Optimiser C et gamma
grille_params = {
    'svm__C': [0.01, 0.1, 1, 10, 100],
    'svm__gamma': ['scale', 'auto', 0.001, 0.01, 0.1]
}
recherche_grille = GridSearchCV(
    pipeline_svm, grille_params,
    cv=5, scoring='roc_auc', n_jobs=-1
)
recherche_grille.fit(X_train, y_train)
print(f"Meilleur AUC : {recherche_grille.best_score_:.4f}")
print(f"Meilleurs paramètres : {recherche_grille.best_params_}")

# SVR pour la régression
svr = Pipeline([
    ('normaliseur', StandardScaler()),
    ('svr', SVR(kernel='rbf', C=100, epsilon=0.1))
])`,
  },
  "svm-knn-svr|4": {
    headingFr: "Pièges du SVM",
    headingAr: "مزالق SVM",
    stepsFr: [
      "Pas de mise à l'échelle = résultats catastrophiques. SVM est l'algorithme le plus sensible à l'échelle. StandardScaler n'est pas optionnel.",
      "Lent sur grandes données : SVM est O(n²) à O(n³) en entraînement. Utilisez SGDClassifier (perte charnière) pour n > 50K.",
      "Réglage C : trop grand C = sur-ajustement ; trop petit = sous-ajustement. Toujours valider croisement sur grille log.",
      "KNN malédiction dimensionnalité : métriques de distance deviennent insignifiantes en haute dimension. Utilisez PCA d'abord, ou passez à ball-tree/KD-tree avec k=√n.",
    ],
    stepsAr: [
      "غياب التحجيم = نتائج كارثية. SVM هو الخوارزمية الأكثر حساسية للتحجيم. StandardScaler ليس اختيارياً.",
      "بطء على البيانات الكبيرة: تدريب SVM بـO(n²) إلى O(n³). استخدم SGDClassifier (خسارة المفصل) لـn > 50K.",
      "ضبط C: C كبير جداً = إفراط في الملاءمة؛ صغير جداً = قصور. دائماً التحقق التقاطعي على شبكة لوغاريتمية.",
      "لعنة البُعد في KNN: مقاييس المسافة تفقد معناها في الأبعاد العالية. استخدم PCA أولاً، أو انتقل إلى ball-tree/KD-tree مع k=√n.",
    ],
  },

  // ── model-evaluation ─────────────────────────────────────────────────────────
  "model-evaluation|0": {
    headingFr: "Quand la Précision Tue",
    headingAr: "عندما تقتل الدقة",
    textFr: "Imaginez prédire le cancer (prévalence 0,1%). Un modèle qui prédit 'pas de cancer' pour tout le monde obtient 99,9% de précision — et tue des patients. En détection de fraude (0,5% de fraude), une haute précision est sans signification. Le choix de la métrique est une décision métier, pas technique. Se tromper peut signifier déployer un modèle qui optimise pour la mauvaise chose entièrement.",
    textAr: "تخيل التنبؤ بالسرطان (انتشار 0.1%). نموذج يتنبأ بـ'لا سرطان' للجميع يحقق دقة 99.9% — ويقتل المرضى. في اكتشاف الاحتيال (0.5% احتيال)، الدقة العالية بلا معنى. اختيار المقياس قرار تجاري ليس تقنياً. الخطأ فيه قد يعني نشر نموذج يُحسّن الهدف الخاطئ تماماً.",
    calloutFr: "En 2021, l'algorithme de recrutement d'Amazon avait 98,4% de précision — mais discriminait systématiquement les femmes parce que la précision était la métrique optimisée.",
    calloutAr: "في 2021، كان خوارزمية التوظيف في أمازون بدقة 98.4% — لكنها تُميّز ضد المرأة بشكل منهجي لأن الدقة كانت المقياس الوحيد المُحسَّن.",
  },
  "model-evaluation|1": {
    headingFr: "La Matrice de Confusion comme Tableau Complet",
    headingAr: "مصفوفة الالتباس كصورة كاملة",
    textFr: "Chaque prédiction tombe dans l'une des quatre catégories : Vrai Positif (positif correctement prédit), Faux Positif (prédit positif, réellement négatif), Vrai Négatif (négatif correctement prédit), Faux Négatif (prédit négatif, réellement positif). FP = Erreur de Type I (fausse alarme). FN = Erreur de Type II (manqué). Lequel compte plus dépend entièrement de l'application.",
    textAr: "كل تنبؤ يقع في إحدى أربع فئات: إيجابي حقيقي (إيجابي صحيح)، إيجابي كاذب (تنبؤ إيجابي، فعلياً سلبي)، سلبي حقيقي (سلبي صحيح)، سلبي كاذب (تنبؤ سلبي، فعلياً إيجابي). FP = خطأ النوع الأول (إنذار كاذب). FN = خطأ النوع الثاني (تفويت). أيهما أكثر أهمية يعتمد كلياً على التطبيق.",
  },
  "model-evaluation|2": {
    headingFr: "Courbe ROC : Évaluation Indépendante du Seuil",
    headingAr: "منحنى ROC: تقييم مستقل عن العتبة",
    textFr: "Un classifieur produit un score, pas seulement une prédiction binaire. La courbe ROC montre tous les compromis possibles en balayant le seuil de 0 à 1 : traçant TPR (rappel) vs FPR. AUC = 0,5 signifie devinette aléatoire, AUC = 1,0 est parfait. L'AUC a une belle interprétation probabiliste : P(score(positif) > score(négatif)).",
    textAr: "المصنف يُخرج نتيجة، ليس فقط تنبؤ ثنائي. منحنى ROC يُظهر جميع المقايضات الممكنة بمسح العتبة من 0 إلى 1: رسم TPR (الاستدعاء) مقابل FPR. AUC = 0.5 يعني التخمين العشوائي، AUC = 1.0 مثالي. للـAUC تفسير احتمالي جميل: P(نتيجة(إيجابي) > نتيجة(سلبي)).",
    formulaLabelFr: "Taux de vrais et faux positifs",
    formulaLabelAr: "معدلات الإيجابية الحقيقية والكاذبة",
  },
  "model-evaluation|3": {
    headingFr: "K-Fold Stratifié : La Bonne Façon de Valider",
    headingAr: "K-Fold الطبقي: الطريقة الصحيحة للتحقق",
    textFr: "La validation hold-out gaspille des données et a une variance élevée. La validation croisée K-Fold utilise toutes les données. Le K-Fold Stratifié assure que chaque pli a la même distribution de classes que le jeu de données complet. Le TimeSeriesSplit empêche les fuites de données : les données futures n'informent jamais les prédictions passées.",
    textAr: "التحقق بالاحتجاز يهدر البيانات ولديه تباين مرتفع. التحقق المتقاطع K-Fold يستخدم جميع البيانات. K-Fold الطبقي يضمن أن كل طية لها نفس توزيع الفئات. TimeSeriesSplit يمنع تسرب البيانات: البيانات المستقبلية لا تُعلم التنبؤات الماضية أبداً.",
    stepsFr: [
      "StratifiedKFold : maintient les proportions de classes dans chaque pli",
      "TimeSeriesSplit : toutes les données d'entraînement viennent avant les données de validation dans le temps",
      "GroupKFold : assure que tous les échantillons du même groupe (patient, utilisateur) sont dans le même pli",
      "RepeatedStratifiedKFold : répéter K-Fold N fois avec des graines aléatoires différentes → estimation de variance plus faible",
    ],
    stepsAr: [
      "StratifiedKFold: يحافظ على نسب الفئات في كل طية",
      "TimeSeriesSplit: جميع بيانات التدريب تأتي قبل بيانات التحقق زمنياً",
      "GroupKFold: يضمن أن جميع عينات المجموعة (مريض، مستخدم) في نفس الطية",
      "RepeatedStratifiedKFold: تكرار K-Fold N مرة ببذور عشوائية مختلفة → تقدير تباين أقل",
    ],
  },
  "model-evaluation|4": {
    headingFr: "Pipeline d'Évaluation Complet",
    headingAr: "خط أنابيب التقييم الكامل",
    codeFr: `from sklearn.metrics import (
    classification_report, roc_auc_score, f1_score,
    average_precision_score, matthews_corrcoef,
    confusion_matrix
)
from sklearn.model_selection import StratifiedKFold, train_test_split
from sklearn.datasets import make_classification
from sklearn.ensemble import GradientBoostingClassifier
import numpy as np

# ── Données d'exemple + modèle ─────────────────────────────────────────
X, y = make_classification(n_samples=1000, n_features=10, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)
modele = GradientBoostingClassifier(n_estimators=100, random_state=42)

skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
probs_hors_plis = np.zeros(len(y_train))

for pli, (idx_tr, idx_val) in enumerate(skf.split(X_train, y_train)):
    modele.fit(X_train[idx_tr], y_train[idx_tr])
    probs_hors_plis[idx_val] = modele.predict_proba(X_train[idx_val])[:, 1]
    print(f"Pli {pli+1} AUC : {roc_auc_score(y_train[idx_val], probs_hors_plis[idx_val]):.4f}")

# Évaluation complète hors-pli
print(f"\\nAUC hors-pli : {roc_auc_score(y_train, probs_hors_plis):.4f}")
print(f"AUC-PR hors-pli : {average_precision_score(y_train, probs_hors_plis):.4f}")
print(f"MCC : {matthews_corrcoef(y_train, probs_hors_plis > 0.5):.4f}")

# Seuil optimal par F1
seuils = np.linspace(0.01, 0.99, 200)
f1s = [f1_score(y_train, probs_hors_plis > t) for t in seuils]
seuil_optimal = seuils[np.argmax(f1s)]
print(f"Seuil optimal : {seuil_optimal:.3f}, F1 : {max(f1s):.4f}")`,
  },
  "model-evaluation|5": {
    headingFr: "Métriques de Régression : Quand MSE Ne Suffit Pas",
    headingAr: "مقاييس الانحدار: عندما لا يكفي MSE",
    textFr: "La classification a la précision, F1, AUC. La régression a toute une famille de métriques — chacune sensible à différents types d'erreurs. Choisir la mauvaise peut masquer des défaillances catastrophiques du modèle.",
    textAr: "التصنيف لديه الدقة وF1 وAUC. الانحدار لديه عائلة كاملة من المقاييس — كلٌّ منها حساس لأنواع مختلفة من الأخطاء. اختيار الخاطئ قد يُخفي إخفاقات كارثية في النموذج.",
    stepsFr: [
      "EAM (Erreur Absolue Moyenne) : Σ|yᵢ−ŷᵢ|/n — robuste aux valeurs aberrantes, mêmes unités que la cible, intuitif. Plus bas est mieux.",
      "ECM (Erreur Carrée Moyenne) : Σ(yᵢ−ŷᵢ)²/n — pénalise fortement les grandes erreurs. Différentiable partout. Plus bas est mieux.",
      "RECM : √ECM — mêmes unités que la cible, pénalise les grandes erreurs. Métrique de régression la plus courante sur Kaggle.",
      "R² (coefficient de détermination) : 1 − ECM/Var(y) — fraction de variance expliquée. 1=parfait, 0=prédit la moyenne, <0=pire que la moyenne.",
      "MAPE : Σ|yᵢ−ŷᵢ|/yᵢ/n — erreur en pourcentage. Intuitif pour les affaires. Indéfini quand yᵢ=0, biaisé vers les petites valeurs.",
      "REML (RMSE log-échelle) : √Σ(log(ŷ+1)−log(y+1))²/n — robuste aux valeurs aberrantes, pénalise les sous-prédictions. Pour données de comptage.",
      "Perte Huber : quadratique pour petites erreurs, linéaire pour grandes — meilleur de EAM+ECM, robuste ET différentiable.",
    ],
    stepsAr: [
      "MAE (متوسط الخطأ المطلق): Σ|yᵢ−ŷᵢ|/n — متين للشواذ، بوحدات الهدف، سهل الفهم. أقل يعني أفضل.",
      "MSE (متوسط الخطأ المربع): Σ(yᵢ−ŷᵢ)²/n — يعاقب الأخطاء الكبيرة بشدة. قابل للاشتقاق في كل مكان. أقل يعني أفضل.",
      "RMSE: √MSE — بوحدات الهدف، يعاقب الأخطاء الكبيرة. المقياس الأكثر شيوعاً للانحدار في Kaggle.",
      "R² (معامل التحديد): 1 − MSE/Var(y) — نسبة التباين المُفسَّر. 1=مثالي، 0=يتنبأ بالمتوسط، <0=أسوأ من المتوسط.",
      "MAPE: Σ|yᵢ−ŷᵢ|/yᵢ/n — خطأ نسبي مئوي. سهل للأعمال. غير معرَّف عند yᵢ=0، متحيز للقيم الصغيرة.",
      "RMSLE (RMSE اللوغاريتمي): √Σ(log(ŷ+1)−log(y+1))²/n — متين للشواذ، يعاقب التنبؤات المنخفضة. لبيانات العد.",
      "خسارة هوبر: تربيعية للأخطاء الصغيرة، خطية للكبيرة — أفضل من MAE+MSE، متين وقابل للاشتقاق.",
    ],
  },
  "model-evaluation|6": {
    headingFr: "Métriques de Classement et Calibration",
    headingAr: "مقاييس الترتيب والمعايرة",
    textFr: "Au-delà de la précision de la prédiction ponctuelle, les modèles doivent parfois classer correctement (recommandation, recherche) ou produire des probabilités bien calibrées (risque médical, finance).",
    textAr: "بعيداً عن دقة التنبؤ النقطي، يجب على النماذج أحياناً الترتيب بشكل صحيح (توصية، بحث) أو إنتاج احتمالات معايَرة جيداً (مخاطر طبية، تمويل).",
    stepsFr: [
      "Spearman ρ : corrélation de rangs entre prédit et réel — mesure la relation monotone, pas la magnitude.",
      "NDCG (Gain Cumulatif Actualisé Normalisé) : pertinence gradée, actualisée par position. Utilisé en recherche/recommandation.",
      "Calibration (ECE) : Erreur de Calibration Attendue — les prédictions à confiance 80% se réalisent-elles 80% du temps ?",
      "Score de Brier : ECM sur les probabilités pour la classification binaire — plus bas est mieux. Bon pour les prévisions probabilistes.",
      "Log-Loss (Entropie Croisée) : −Σyᵢ·log(pᵢ)+(1−yᵢ)·log(1−pᵢ) — pénalise fortement les prédictions erronées confiantes.",
    ],
    stepsAr: [
      "Spearman ρ: ارتباط رتب بين المتنبَّأ والفعلي — يقيس العلاقة المتزايدة، ليس الحجم.",
      "NDCG (مكسب تراكمي مُخصَّم مُعيَّر): أهمية متدرجة، مخصَّمة بالموضع. يُستخدم في البحث/التوصية.",
      "المعايرة (ECE): خطأ المعايرة المتوقع — هل تتحقق التنبؤات بثقة 80% في 80% من الأوقات؟",
      "درجة بريير: MSE على الاحتمالات للتصنيف الثنائي — أقل يعني أفضل. جيد للتنبؤات الاحتمالية.",
      "Log-Loss (الإنتروبيا التقاطعية): −Σyᵢ·log(pᵢ)+(1−yᵢ)·log(1−pᵢ) — يعاقب بشدة التنبؤات الخاطئة الواثقة.",
    ],
  },
  "model-evaluation|7": {
    headingFr: "Le Choix de Métrique est une Décision Métier",
    headingAr: "اختيار المقياس قرار أعمال",
    calloutFr: "Règle : choisissez la métrique qui correspond au coût des erreurs dans votre application. RMSE pour les prix des maisons. MAE pour les temps de livraison. MAPE quand l'erreur relative compte. AUC quand l'équilibre des classes change. F1 quand FP et FN ont tous deux des coûts. MCC pour la métrique unique la plus équilibrée sur des données déséquilibrées.",
    calloutAr: "قاعدة: اختر المقياس الذي يتطابق مع تكلفة الأخطاء في تطبيقك. RMSE لأسعار المنازل. MAE لأوقات التسليم. MAPE عندما يهم الخطأ النسبي. AUC عند تغير توازن الفئات. F1 عندما لكل من FP وFN تكاليف. MCC كأفضل مقياس مفرد للبيانات غير المتوازنة.",
  },

};

export const keyFormulaI18n_supervised: Record<string, KeyFormulaI18n> = {

  // ── model-evaluation ─────────────────────────────────────────────────────────
  "model-evaluation|0": {
    nameFr: "Score F1",                nameAr: "درجة F1",
    meaningFr: "Moyenne harmonique de la précision et du rappel — pénalise les mauvais scores dans les deux sens",
    meaningAr: "المتوسط التوافقي للدقة والاستدعاء — يعاقب الأداء السيئ في كلا الاتجاهين",
  },
  "model-evaluation|1": {
    nameFr: "AUC-ROC",                 nameAr: "AUC-ROC",
    meaningFr: "Probabilité qu'un positif aléatoire soit mieux classé qu'un négatif aléatoire — indépendant du seuil",
    meaningAr: "احتمال أن يُرتَّب الإيجابي العشوائي أعلى من السلبي العشوائي — مستقل عن العتبة",
  },
  "model-evaluation|2": {
    nameFr: "MCC",                     nameAr: "MCC",
    meaningFr: "Coefficient de corrélation de Matthews — meilleure métrique unique pour les données déséquilibrées",
    meaningAr: "معامل ارتباط ماثيوز — أفضل مقياس مفرد للبيانات غير المتوازنة",
  },
  "model-evaluation|3": {
    nameFr: "RECM",                    nameAr: "RMSE",
    meaningFr: "Racine de l'erreur carrée moyenne — pénalise les grandes erreurs, mêmes unités que la cible",
    meaningAr: "جذر متوسط الخطأ المربع — يعاقب الأخطاء الكبيرة، بوحدات الهدف",
  },
  "model-evaluation|4": {
    nameFr: "Score R²",                nameAr: "درجة R²",
    meaningFr: "Fraction de la variance expliquée ; 1=parfait, 0=prédit la moyenne, <0=pire que la moyenne",
    meaningAr: "نسبة التباين المُفسَّر؛ 1=مثالي، 0=يتنبأ بالمتوسط، <0=أسوأ من المتوسط",
  },
  "model-evaluation|5": {
    nameFr: "EAM",                     nameAr: "MAE",
    meaningFr: "Erreur Absolue Moyenne — robuste aux valeurs aberrantes, interprétable dans les unités de la cible",
    meaningAr: "متوسط الخطأ المطلق — متين للشواذ، قابل للتفسير بوحدات الهدف",
  },

  // ── svm-knn-svr ──────────────────────────────────────────────────────────────
  "svm-knn-svr|0": {
    nameFr: "Objectif SVM",            nameAr: "هدف SVM",
    meaningFr: "Maximiser la marge 2/||w|| sous contrainte de bonne classification — plus grande marge = meilleure généralisation",
    meaningAr: "تعظيم الهامش 2/||w|| مع التصنيف الصحيح — هامش أكبر = تعميم أفضل",
  },
  "svm-knn-svr|1": {
    nameFr: "Dual (Noyau)",            nameAr: "الثنائي (النواة)",
    meaningFr: "Astuce du noyau : remplacer x·x par K(x,x) pour des frontières non linéaires — O(n²) en mémoire, pas en espace de caractéristiques",
    meaningAr: "حيلة النواة: استبدال x·x بـK(x,x) للحدود غير الخطية — O(n²) في الذاكرة، ليس في فضاء الميزات",
  },
  "svm-knn-svr|2": {
    nameFr: "Noyau RBF",               nameAr: "نواة RBF",
    meaningFr: "Fonction à Base Radiale — application de Gauss de dimension infinie ; γ contrôle la largeur du noyau",
    meaningAr: "دالة القاعدة الشعاعية — تعيين غاوسي لانهائي الأبعاد؛ γ يتحكم في عرض النواة",
  },

  // ── gradient-boosting ────────────────────────────────────────────────────────
  "gradient-boosting|0": {
    nameFr: "Ensemble de Boosting",    nameAr: "مجموعة تعزيز",
    meaningFr: "Prédiction finale = somme de M apprenants faibles, chacun pondéré par γ — chaque arbre corrige les erreurs des précédents",
    meaningAr: "التنبؤ النهائي = مجموع M متعلم ضعيف، مرجَّح بـγ — كل شجرة تصحح أخطاء السابقة",
  },
  "gradient-boosting|1": {
    nameFr: "Pseudo-Résidus",          nameAr: "شبه البواقي",
    meaningFr: "Gradient négatif de la perte — ce que le prochain arbre doit apprendre pour réduire l'erreur",
    meaningAr: "التدرج السلبي للخسارة — ما يجب على الشجرة التالية تعلمه لتقليل الخطأ",
  },
  "gradient-boosting|2": {
    nameFr: "Score d'Arbre XGBoost",   nameAr: "نقاط شجرة XGBoost",
    meaningFr: "Gain d'une division (G = somme des dérivées premières, H = somme des dérivées secondes) — maximiser ce score choisit le meilleur split",
    meaningAr: "مكسب تقسيم (G = مجموع المشتقات الأولى، H = مجموع المشتقات الثانية) — تعظيم هذا يختار أفضل تقسيم",
  },
  "gradient-boosting|3": {
    nameFr: "Gain de Division",        nameAr: "مكسب التقسيم",
    meaningFr: "Amélioration de l'objectif en divisant une feuille en deux — utilisé pour l'élagage et le critère d'arrêt",
    meaningAr: "تحسين الهدف من تقسيم ورقة إلى اثنتين — يُستخدم للتشذيب ومعيار التوقف",
  },

  // ── decision-tree-rf ─────────────────────────────────────────────────────────
  "decision-tree-rf|0": {
    nameFr: "Impureté de Gini",        nameAr: "شائبة جيني",
    meaningFr: "Probabilité de mal classer un échantillon aléatoire. Zéro = pureté parfaite",
    meaningAr: "احتمال التصنيف الخاطئ لعينة عشوائية. صفر = نقاء تام",
  },
  "decision-tree-rf|1": {
    nameFr: "Gain d'Information",      nameAr: "مكسب المعلومات",
    meaningFr: "Réduction d'entropie obtenue par une division — choisir la division qui maximise ce gain",
    meaningAr: "تخفيض الإنتروبيا الناتج عن تقسيم — اختيار التقسيم الذي يُعظّم هذا المكسب",
  },
  "decision-tree-rf|2": {
    nameFr: "Entropie",                nameAr: "الإنتروبيا",
    meaningFr: "Mesure du désordre / de l'imprévisibilité dans un nœud — nulle si pur, maximale si uniforme",
    meaningAr: "مقياس الفوضى / عدم القدرة على التنبؤ في عقدة — صفر إذا نقية، أقصى إذا موحدة",
  },
  "decision-tree-rf|3": {
    nameFr: "Erreur OOB",              nameAr: "خطأ OOB",
    meaningFr: "Estimation de validation gratuite à partir d'échantillons absent de chaque bootstrap — pas besoin d'ensemble de validation séparé",
    meaningAr: "تقدير تحقق مجاني من العينات الغائبة عن كل bootstrap — لا حاجة لمجموعة تحقق منفصلة",
  },

  // ── linear-regression ────────────────────────────────────────────────────────
  "linear-regression|0": {
    nameFr: "Solution MCO",            nameAr: "حل MCO",
    meaningFr: "Solution en forme fermée minimisant les résidus au carré — s'applique quand XᵀX est inversible",
    meaningAr: "الحل بصيغة مغلقة الذي يُقلل البواقي المربعة — يُطبَّق عندما تكون XᵀX قابلة للعكس",
  },
  "linear-regression|1": {
    nameFr: "Perte ECM",               nameAr: "خسارة MSE",
    meaningFr: "Erreur quadratique moyenne — l'objectif à minimiser ; pénalise les grands résidus quadratiquement",
    meaningAr: "متوسط الخطأ التربيعي — الهدف المُقلَّل؛ يعاقب البواقي الكبيرة تربيعياً",
  },
  "linear-regression|2": {
    nameFr: "Mise à Jour Gradient",    nameAr: "تحديث التدرج",
    meaningFr: "Règle de mise à jour de la descente de gradient — α est le taux d'apprentissage qui contrôle la taille du pas",
    meaningAr: "قاعدة تحديث الانحدار التدرجي — α هو معدل التعلم الذي يتحكم في حجم الخطوة",
  },
  "linear-regression|3": {
    nameFr: "Sigmoïde",                nameAr: "السيغمويد",
    meaningFr: "Applique n'importe quel nombre réel dans (0,1) pour une interprétation probabiliste en régression logistique",
    meaningAr: "تضغط أي رقم حقيقي إلى (0,1) للتفسير الاحتمالي في الانحدار اللوجستي",
  },

};

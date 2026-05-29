import type { SectionI18n, KeyFormulaI18n } from '../types';

export const sectionI18n_evaluation: Record<string, SectionI18n> = {

  // ── error-analysis ───────────────────────────────────────────────────────────
  "error-analysis|0": {
    headingFr: "Diagnostiquer Ce qui Ne Va Pas avec Votre Modèle",
    headingAr: "تشخيص ما يعيب نموذجك",
    textFr: "Quand un modèle performe mal, il n'y a que deux causes fondamentales : il fait de mauvaises hypothèses structurelles (biais/sous-ajustement) ou il est trop sensible aux données d'entraînement spécifiques (variance/sur-ajustement). Ces causes ont des correctifs opposés — plus de données aide la variance mais pas le biais ; plus de capacité aide le biais mais pas la variance. Diagnostiquer le problème avant d'appliquer des correctifs est la compétence la plus importante en ML appliqué.",
    textAr: "عندما يؤدي نموذج بشكل سيئ، هناك فقط سببان أساسيان: يضع افتراضات هيكلية خاطئة (تحيز/تقصير في الملاءمة) أو يكون حساساً جداً لبيانات التدريب المحددة (تباين/إفراط في الملاءمة). هذان لهما حلول معاكسة — المزيد من البيانات يساعد التباين لكن ليس التحيز؛ المزيد من السعة يساعد التحيز لكن ليس التباين.",
  },
  "error-analysis|1": {
    headingFr: "L'Analogie du Jeu de Fléchettes",
    headingAr: "تشبيه لوحة الدارت",
    textFr: "Imaginez lancer 100 fléchettes sur une cible (la vraie fonction). Biais élevé = les fléchettes s'accumulent loin du centre (mauvais modèle). Variance élevée = les fléchettes se dispersent (prédictions inconsistantes). Biais faible + variance faible = les fléchettes se groupent sur le centre. Un polynôme de degré 1 a un biais élevé. Un polynôme de degré 20 a une variance élevée. Le degré 3-5 peut être la zone optimale.",
    textAr: "تخيل رمي 100 سهم على هدف (الدالة الحقيقية). تحيز عالٍ = السهام تتجمع بعيداً عن المركز (نموذج خاطئ). تباين عالٍ = السهام تتشتت (تنبؤات غير متسقة). تحيز منخفض + تباين منخفض = السهام تتجمع على المركز. كثير الحد 1 تحيز عالٍ. كثير الحد 20 تباين عالٍ.",
    calloutFr: "L'erreur irréductible (σ²) est le bruit inhérent aux données — erreur de mesure, variables non observées. Aucun modèle ne peut la battre. Connaître σ² fixe le plafond de performance.",
    calloutAr: "الخطأ الذي لا يمكن تقليله (σ²) هو الضوضاء المتأصلة في البيانات — خطأ القياس، المتغيرات غير المرصودة. لا يمكن لأي نموذج التغلب عليه.",
  },
  "error-analysis|2": {
    headingFr: "La Décomposition Mathématique",
    headingAr: "التحليل الرياضي",
    textFr: "L'erreur de test attendue pour tout estimateur se décompose en trois termes additifs. L'erreur irréductible σ² est une propriété du processus générateur de données, pas du modèle. Le compromis : à mesure que la complexité augmente, le biais diminue mais la variance augmente. La régularisation (L1/L2) ajoute explicitement un terme de biais pour réduire la variance.",
    textAr: "خطأ الاختبار المتوقع لأي مُقدِّر يتحلل إلى ثلاثة مصطلحات جمعية. الخطأ الذي لا يمكن تقليله σ² خاصية لعملية توليد البيانات، ليس النموذج. مع زيادة التعقيد، ينخفض التحيز لكن يزداد التباين. التنظيم يضيف صراحةً مصطلح تحيز لتقليل التباين.",
    formulaLabelFr: "Décomposition Biais-Variance-Bruit",
    formulaLabelAr: "تحليل التحيز-التباين-الضوضاء",
  },
  "error-analysis|3": {
    headingFr: "Courbes d'Apprentissage : Lire le Diagnostic",
    headingAr: "منحنيات التعلم: قراءة التشخيص",
    textFr: "Tracez l'erreur d'entraînement et l'erreur de validation en fonction de la taille de l'ensemble d'entraînement. Signature de biais élevé : les deux courbes plafonnent à une erreur élevée — plus de données n'aidera pas. Signature de variance élevée : grand écart entre erreur d'entraînement (basse) et de validation (haute) — plus de données aidera ; essayez aussi dropout/régularisation.",
    textAr: "ارسم خطأ التدريب وخطأ التحقق مقابل حجم مجموعة التدريب. سمة التحيز العالي: كلا المنحنيين يستقران عند خطأ مرتفع — المزيد من البيانات لن يُفيد. سمة التباين العالي: فجوة كبيرة بين خطأ التدريب والتحقق — المزيد من البيانات سيُفيد.",
  },
  "error-analysis|4": {
    headingFr: "Protocole Systématique d'Analyse des Erreurs",
    headingAr: "بروتوكول تحليل الأخطاء المنهجي",
    stepsFr: [
      "Établir une référence : un modèle naïf (classe majoritaire, prédiction moyenne) fixe le plancher",
      "Performance au niveau humain : borne supérieure de la précision réalisable (plancher d'erreur irréductible)",
      "Biais évitable = erreur_entraîn. - erreur_humaine : corriger avec un modèle plus grand, plus de caractéristiques",
      "Variance = erreur_val. - erreur_entraîn. : corriger avec plus de données, dropout, régularisation",
      "Décalage des données = distribution val. ≠ distribution entraîn. : corriger avec l'adaptation de domaine",
      "Analyse des erreurs : inspecter 100 erreurs de validation, étiqueter par catégorie → corriger la plus grande",
    ],
    stepsAr: [
      "إنشاء خط أساس: نموذج ساذج (الفئة الغالبة، التنبؤ بالمتوسط) يحدد الحد الأدنى",
      "الأداء على المستوى البشري: الحد الأعلى للدقة القابلة للتحقيق (أرضية الخطأ الذي لا يمكن تقليله)",
      "التحيز القابل للتجنب = خطأ_التدريب - خطأ_بشري: إصلاح بنموذج أكبر، مزيد من الميزات",
      "التباين = خطأ_التحقق - خطأ_التدريب: إصلاح بمزيد من البيانات، dropout، التنظيم",
      "عدم تطابق البيانات = توزيع_التحقق ≠ توزيع_التدريب: إصلاح بالتكيف مع النطاق",
      "تحليل الأخطاء: فحص 100 خطأ تحقق يدوياً، تصنيف حسب الفئة → إصلاح أكبر فئة",
    ],
  },
  "error-analysis|5": {
    headingFr: "Diagnostic par Courbe d'Apprentissage",
    headingAr: "تشخيص منحنى التعلم",
    codeFr: `from sklearn.model_selection import learning_curve, train_test_split
from sklearn.datasets import make_classification
from sklearn.ensemble import GradientBoostingClassifier
import matplotlib.pyplot as plt
import numpy as np

# ── Données d'exemple + modèle ─────────────────────────────────────────
X, y = make_classification(n_samples=800, n_features=10, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)
modele = GradientBoostingClassifier(n_estimators=100, random_state=42)

tailles_entr, scores_entr, scores_val = learning_curve(
    estimator=modele,
    X=X_train, y=y_train,
    train_sizes=np.linspace(0.1, 1.0, 10),
    cv=5, scoring='roc_auc',
    n_jobs=-1, shuffle=True
)

moy_entr = scores_entr.mean(axis=1)
et_entr  = scores_entr.std(axis=1)
moy_val  = scores_val.mean(axis=1)
et_val   = scores_val.std(axis=1)

# Diagnostic :
ecart  = moy_entr[-1] - moy_val[-1]
niveau = moy_val[-1]

if niveau < 0.7:
    print("BIAIS ÉLEVÉ : augmenter la complexité ou ajouter des caractéristiques")
elif ecart > 0.1:
    print("VARIANCE ÉLEVÉE : ajouter des données, régularisation, ou réduire la complexité")
else:
    print("Bonne généralisation — optimiser les hyperparamètres")`,
  },

};

export const keyFormulaI18n_evaluation: Record<string, KeyFormulaI18n> = {

  // ── error-analysis ───────────────────────────────────────────────────────────
  "error-analysis|0": {
    nameFr: "Décomposition de l'Erreur", nameAr: "تحليل الخطأ",
    meaningFr: "L'erreur totale attendue ne peut pas descendre en dessous du bruit irréductible σ² — plancher de performance",
    meaningAr: "الخطأ الكلي المتوقع لا يمكن أن ينخفض تحت الضوضاء التي لا يمكن تقليلها σ² — سقف الأداء",
  },
  "error-analysis|1": {
    nameFr: "Biais",                     nameAr: "التحيز",
    meaningFr: "À quel point la prédiction moyenne s'éloigne de la vérité — mauvaise hypothèse structurelle du modèle",
    meaningAr: "مدى بُعد متوسط التنبؤ عن الحقيقة — افتراض هيكلي خاطئ في النموذج",
  },
  "error-analysis|2": {
    nameFr: "Variance",                  nameAr: "التباين",
    meaningFr: "De combien les prédictions fluctuent selon différents ensembles d'entraînement — sensibilité au bruit des données",
    meaningAr: "مقدار تذبذب التنبؤات عبر مجموعات تدريب مختلفة — حساسية النموذج لضوضاء البيانات",
  },

};

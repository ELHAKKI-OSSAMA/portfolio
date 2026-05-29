import type { QuizI18n } from './types';

export const T_evaluation: Record<string, QuizI18n> = {

  // ── error-analysis ─────────────────────────────────────────────────────────

  "error-analysis|0": {
    questionFr: "Un modèle avec un biais élevé et une variance faible est :",
    questionAr: "نموذج ذو تحيز عالٍ وتباين منخفض هو:",
    optionsFr: [
      "En surapprentissage sur les données d'entraînement",
      "En sous-apprentissage — trop simple pour capturer le vrai schéma",
      "Correctement ajusté",
      "Sensible à la taille du jeu d'entraînement",
    ],
    optionsAr: [
      "يُفرط في التخصيص على بيانات التدريب",
      "يُقصّر في التعلم — بسيط جداً لالتقاط النمط الحقيقي",
      "مُعاير بشكل صحيح",
      "حساس لحجم مجموعة التدريب",
    ],
    explanationFr:
      "Un biais élevé signifie que les hypothèses du modèle sont trop rigides. Il commet des erreurs systématiques sur les données d'entraînement et de test — sous-apprentissage classique.",
    explanationAr:
      "التحيز العالي يعني أن افتراضات النموذج صارمة جداً. يرتكب أخطاء منهجية على كلٍّ من بيانات التدريب والاختبار — إنه قصور تعلم كلاسيكي.",
  },

  "error-analysis|1": {
    questionFr:
      "Si la précision en entraînement est de 99 % et en validation de 65 %, le problème principal est :",
    questionAr: "إذا كانت دقة التدريب 99% والتحقق 65%، فإن المشكلة الأساسية هي:",
    optionsFr: [
      "Biais élevé",
      "Variance élevée (surapprentissage)",
      "Fuite de données",
      "Déséquilibre des classes",
    ],
    optionsAr: [
      "تحيز عالٍ",
      "تباين عالٍ (إفراط في التخصيص)",
      "تسرب البيانات",
      "اختلال الفئات",
    ],
    explanationFr:
      "Un grand écart entraînement-validation indique que le modèle a mémorisé les données d'entraînement sans généraliser — variance élevée. Solutions : plus de données, régularisation, ou modèle plus simple.",
    explanationAr:
      "الفجوة الكبيرة بين التدريب والتحقق تدل على أن النموذج حفظ بيانات التدريب دون تعميم — تباين عالٍ. الحلول: مزيد من البيانات، أو التنظيم، أو نموذج أبسط.",
  },

  "error-analysis|2": {
    questionFr: "Que montrent les courbes d'apprentissage ?",
    questionAr: "ما الذي تُظهره منحنيات التعلم؟",
    optionsFr: [
      "Comment la perte varie avec différents taux d'apprentissage",
      "La performance sur l'entraînement et la validation en fonction de la taille du jeu d'entraînement",
      "La précision du modèle par classe",
      "La magnitude du gradient au fil des époques",
    ],
    optionsAr: [
      "كيف تتغير الخسارة بمعدلات تعلم مختلفة",
      "أداء التدريب والتحقق بدلالة حجم مجموعة التدريب",
      "دقة النموذج لكل فئة",
      "حجم التدرج عبر العصور",
    ],
    explanationFr:
      "Les courbes d'apprentissage tracent le score en fonction de n_train. Biais élevé : les deux courbes plafonnent bas avec un petit écart. Variance élevée : grand écart qui se réduit quand n_train augmente.",
    explanationAr:
      "تعرض منحنيات التعلم الأداء مقابل n_train. التحيز العالي: تتسطح كلا المنحنيين بمستوى منخفض مع فجوة صغيرة. التباين العالي: فجوة كبيرة تضيق كلما زاد n_train.",
  },

};

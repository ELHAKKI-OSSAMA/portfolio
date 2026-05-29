import type { QuizI18n } from './types';

export const T_audio: Record<string, QuizI18n> = {

  // ── audio-ml ───────────────────────────────────────────────────────────────

  "audio-ml|0": {
    questionFr: "Que représente un spectrogramme Mel ?",
    questionAr: "ما الذي يمثله مخطط طيف Mel؟",
    optionsFr: [
      "La forme d'onde brute compressée en 2D",
      "Énergie temps × fréquence Mel — un spectrogramme de puissance logarithmique mappé sur une échelle de fréquence perceptuellement uniforme",
      "Une séquence de coefficients MFCC dans le temps",
      "La transformée de Fourier de l'autocorrélation",
    ],
    optionsAr: [
      "الموجة الخام مضغوطة في بُعدين",
      "طاقة الوقت × تردد Mel — مخطط طيف قوة لوغاريتمي مُعيَّن على مقياس تردد منتظم إدراكياً",
      "تسلسل معاملات MFCC عبر الزمن",
      "تحويل فورييه للارتباط الذاتي",
    ],
    explanationFr:
      "STFT donne la puissance temps-fréquence ; le mappage vers l'échelle Mel compresse les hautes fréquences (où les humains sont moins sensibles) et étend les basses, donnant des caractéristiques mieux adaptées aux tâches audio.",
    explanationAr:
      "تُعطي STFT قوة الوقت-التردد؛ التعيين على مقياس Mel يضغط الترددات العالية (حيث يكون الإنسان أقل حساسية) ويوسّع المنخفضة، مُنتجاً ميزات أنسب لمهام الصوت.",
  },

  "audio-ml|1": {
    questionFr:
      "Quel problème la perte CTC (Connectionist Temporal Classification) résout-elle ?",
    questionAr: "ما المشكلة التي تحلها خسارة CTC؟",
    optionsFr: [
      "L'entraînement des CNN audio sur des jeux de données déséquilibrés",
      "L'alignement de séquences audio de longueur variable avec du texte de longueur variable sans nécessiter d'étiquettes au niveau des trames",
      "La génération de spectrogrammes à partir de texte",
      "La suppression du bruit dans les signaux audio",
    ],
    optionsAr: [
      "تدريب CNNs الصوت على البيانات غير المتوازنة",
      "محاذاة تسلسلات صوت متغيرة الطول مع نص متغير الطول دون الحاجة لتسميات على مستوى الإطار",
      "توليد مخططات الطيف من النص",
      "إزالة الضوضاء من الإشارات الصوتية",
    ],
    explanationFr:
      "Étiqueter chaque trame audio manuellement est impraticable. CTC marginalise sur tous les alignements possibles entre la séquence de sortie et le texte cible, apprenant l'alignement implicitement.",
    explanationAr:
      "تصنيف كل إطار صوتي يدوياً أمر غير عملي. تُهمّش CTC على جميع المحاذاة الممكنة بين تسلسل المخرجات والنص المستهدف، متعلّمةً المحاذاة ضمنياً.",
  },

  "audio-ml|2": {
    questionFr: "Que fait SpecAugment pendant l'entraînement audio ?",
    questionAr: "ما الذي يفعله SpecAugment أثناء تدريب الصوت؟",
    optionsFr: [
      "Ajoute de la réverbération aux échantillons d'entraînement",
      "Masque aléatoirement des blocs contigus de pas de temps et de canaux de fréquence dans le spectrogramme — une forme d'augmentation de données",
      "Applique un changement de hauteur aux formes d'onde",
      "Normalise le spectrogramme à zéro moyenne",
    ],
    optionsAr: [
      "يُضيف صدى للعينات التدريبية",
      "يُقنّع بشكل عشوائي كتلاً متتالية من الخطوات الزمنية والقنوات الترددية في مخطط الطيف — شكل من أشكال تعزيز البيانات",
      "يُطبّق تحويل الطبقة الصوتية على الموجات",
      "يُطبّع مخطط الطيف إلى متوسط صفري",
    ],
    explanationFr:
      "SpecAugment masque T trames de temps consécutives et F bandes de fréquence consécutives, forçant le modèle à utiliser les informations restantes. Cela régularise sans données supplémentaires.",
    explanationAr:
      "يُقنّع SpecAugment T إطارات زمنية متتالية وF نطاقات ترددية متتالية، مُجبِراً النموذج على استخدام المعلومات المتبقية. هذا تنظيم دون بيانات إضافية.",
  },

};

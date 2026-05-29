import type { QuizI18n } from './types';

export const T_vision: Record<string, QuizI18n> = {

  // ── object-detection ──────────────────────────────────────────────────────

  "object-detection|0": {
    questionFr:
      "Que mesure l'IoU (Intersection sur Union) dans la détection d'objets ?",
    questionAr: "ما الذي يقيسه IoU (تقاطع على اتحاد) في كشف الأجسام؟",
    optionsFr: [
      "La qualité moyenne des boîtes englobantes prédites",
      "Le chevauchement entre une boîte prédite et la boîte de vérité terrain : |A∩B|/|A∪B|",
      "Le score de confiance d'une détection",
      "La différence de rapport d'aspect entre les boîtes prédites et vraies",
    ],
    optionsAr: [
      "متوسط جودة الصناديق الحدودية المتوقعة",
      "التداخل بين صندوق متوقع وصندوق الحقيقة الأرضية: |A∩B|/|A∪B|",
      "درجة ثقة الكشف",
      "فرق نسبة العرض إلى الارتفاع بين الصناديق المتوقعة والحقيقية",
    ],
    explanationFr:
      "IoU = aire d'intersection / aire d'union. IoU=1 est un chevauchement parfait ; IoU=0 est l'absence de chevauchement. Une détection est généralement considérée correcte si IoU > 0,5 (standard PASCAL VOC).",
    explanationAr:
      "IoU = مساحة التقاطع / مساحة الاتحاد. IoU=1 تداخل مثالي؛ IoU=0 لا تداخل. عادةً تُعدّ الكشوفات صحيحة إذا كان IoU > 0.5 (معيار PASCAL VOC).",
  },

  "object-detection|1": {
    questionFr:
      "Que fait la suppression des non-maximums (NMS) dans YOLO/Faster-RCNN ?",
    questionAr: "ما الذي يفعله قمع اللاحد الأقصى (NMS) في YOLO/Faster-RCNN؟",
    optionsFr: [
      "Filtre les détections à faible confiance",
      "Supprime les boîtes englobantes en double pour le même objet, ne conservant que celle avec la plus haute confiance",
      "Normalise les coordonnées des boîtes englobantes",
      "Applique le softmax aux scores de classes",
    ],
    optionsAr: [
      "يُصفّي الكشوفات ذات الثقة المنخفضة",
      "يُزيل الصناديق الحدودية المكررة لنفس الجسم، محتفظاً بالأعلى ثقةً فقط",
      "يُطبّع إحداثيات الصناديق الحدودية",
      "يُطبّق softmax على درجات الفئات",
    ],
    explanationFr:
      "Les détecteurs produisent de nombreuses boîtes qui se chevauchent. NMS conserve la boîte avec le score le plus élevé et supprime toutes les boîtes qui se chevauchent avec IoU > seuil (ex. 0,45), donnant une détection propre par objet.",
    explanationAr:
      "تُنتج الكاشفات صناديق متداخلة كثيرة. يحتفظ NMS بالصندوق الأعلى درجةً ويُزيل جميع الصناديق المتداخلة مع IoU > العتبة (مثلاً 0.45)، مُعطياً كشفاً واحداً نظيفاً لكل جسم.",
  },

  "object-detection|2": {
    questionFr:
      "Quelle est la principale différence entre les détecteurs à une étape (YOLO) et à deux étapes (Faster-RCNN) ?",
    questionAr: "ما الفرق الرئيسي بين الكاشفات أحادية المرحلة (YOLO) وثنائية المرحلة (Faster-RCNN)؟",
    optionsFr: [
      "YOLO détecte plus de classes ; Faster-RCNN en détecte moins",
      "YOLO est plus rapide mais généralement moins précis sur les petits objets ; Faster-RCNN est plus lent mais plus précis grâce à un réseau de propositions de régions séparé",
      "YOLO nécessite plus de données d'entraînement",
      "Faster-RCNN ne fonctionne que sur des images carrées",
    ],
    optionsAr: [
      "YOLO يكشف فئات أكثر؛ Faster-RCNN أقل",
      "YOLO أسرع لكنه أقل دقة على الأجسام الصغيرة؛ Faster-RCNN أبطأ لكن أدق باستخدام شبكة اقتراح منفصلة",
      "YOLO يحتاج بيانات تدريب أكثر",
      "Faster-RCNN يعمل فقط على الصور المربعة",
    ],
    explanationFr:
      "Deux étapes : proposer des régions → classer. Une étape : prédire boîtes et classes en une seule passe. YOLO atteint le temps réel ; Faster-RCNN excelle sur les petits objets denses.",
    explanationAr:
      "مرحلتان: اقتراح مناطق → تصنيف. مرحلة واحدة: التنبؤ بالصناديق والفئات في تمريرة واحدة. يُحقق YOLO الزمن الفعلي؛ Faster-RCNN يتميز في كشف الأجسام الصغيرة الكثيفة.",
  },

  // ── image-segmentation ────────────────────────────────────────────────────

  "image-segmentation|0": {
    questionFr:
      "Quelle est la différence entre la segmentation sémantique et la segmentation d'instances ?",
    questionAr: "ما الفرق بين التجزئة الدلالية وتجزئة الأمثلة؟",
    optionsFr: [
      "La sémantique est plus rapide ; l'instance est plus précise",
      "La sémantique attribue une classe à chaque pixel ; l'instance distingue en plus les objets séparés de même classe",
      "La sémantique fonctionne sur les vidéos ; l'instance sur les images",
      "La sémantique utilise des boîtes englobantes ; l'instance utilise des masques de pixels",
    ],
    optionsAr: [
      "الدلالية أسرع؛ التجزئة أدق",
      "الدلالية تُعيّن فئة لكل بكسل؛ التجزئة تُميّز أيضاً الأجسام المنفصلة من نفس الفئة",
      "الدلالية للفيديو؛ التجزئة للصور",
      "الدلالية تستخدم صناديق حدودية؛ التجزئة تستخدم أقنعة بكسل",
    ],
    explanationFr:
      "Sémantique : deux voitures → même couleur. Instance : deux voitures → couleurs différentes. La segmentation panoptique combine les deux.",
    explanationAr:
      "الدلالية: سيارتان → نفس اللون. التجزئة: سيارتان → لونان مختلفان. التجزئة الشاملة تجمع الاثنتين.",
  },

  "image-segmentation|1": {
    questionFr:
      "Qu'est-ce que la perte Dice et quand est-elle préférée à l'entropie croisée ?",
    questionAr: "ما خسارة Dice ومتى تُفضَّل على الإنتروبيا التقاطعية؟",
    optionsFr: [
      "Dice mesure la précision des pixels",
      "Perte Dice = 1 - 2|A∩B|/(|A|+|B|), optimisant directement le coefficient de chevauchement — préférée pour les classes très déséquilibrées (ex. petite tumeur vs arrière-plan)",
      "Dice est utilisée pour la régression de boîtes englobantes",
      "Dice est l'entropie croisée moyennée sur les classes",
    ],
    optionsAr: [
      "Dice تقيس دقة البكسل",
      "خسارة Dice = 1 - 2|A∩B|/(|A|+|B|)، تُحسّن مباشرةً معامل التداخل — مفضّلة للاختلال الشديد في الفئات (مثلاً ورم صغير مقابل الخلفية)",
      "Dice للانحدار على الصناديق الحدودية",
      "Dice هي الإنتروبيا التقاطعية المتوسطة على الفئات",
    ],
    explanationFr:
      "Avec 99 % de pixels de fond, l'entropie croisée atteint 99 % de précision en prédisant partout le fond. Dice optimise directement le chevauchement, pénalisant l'échec à trouver la petite région avant-plan.",
    explanationAr:
      "مع 99% بكسلات خلفية، تُحقق الإنتروبيا التقاطعية 99% دقة بالتنبؤ بالخلفية في كل مكان. تُحسّن Dice التداخل مباشرةً، معاقِبةً فشل إيجاد منطقة المقدمة الصغيرة.",
  },

  "image-segmentation|2": {
    questionFr:
      "Quel rôle jouent les connexions résiduelles dans UNet ?",
    questionAr: "ما دور الاتصالات المتخطية في UNet؟",
    optionsFr: [
      "Elles empêchent le surapprentissage en ajoutant des chemins de dropout",
      "Elles concaténent les cartes de caractéristiques de l'encodeur aux couches du décodeur, combinant informations spatiales précises et contexte sémantique profond",
      "Elles permettent la circulation des gradients entre couches non adjacentes",
      "Elles doublent la résolution à chaque étape du décodeur",
    ],
    optionsAr: [
      "تمنع الإفراط بإضافة مسارات dropout",
      "تُدمج خرائط ميزات المشفّر بطبقات فك الشفرة، جامعةً المعلومات المكانية الدقيقة مع السياق الدلالي العميق",
      "تتيح تدفق التدرجات بين الطبقات غير المتجاورة",
      "تضاعف الدقة عند كل خطوة فك شفرة",
    ],
    explanationFr:
      "Les caractéristiques profondes de l'encodeur ont une richesse sémantique mais une localisation grossière. Les caractéristiques peu profondes ont des détails spatiaux fins mais peu de sémantique. Les connexions résiduelles fusionnent les deux à chaque échelle.",
    explanationAr:
      "ميزات المشفّر العميقة غنية دلالياً لكنها خشنة المكانة. الميزات الضحلة دقيقة مكانياً لكنها فقيرة دلالياً. تدمج الاتصالات المتخطية كليهما في كل مقياس.",
  },

};

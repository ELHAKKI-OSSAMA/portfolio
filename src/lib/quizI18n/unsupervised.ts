import type { QuizI18n } from './types';

export const T_unsupervised: Record<string, QuizI18n> = {

  // ── clustering ─────────────────────────────────────────────────────────────

  "clustering|0": {
    questionFr: "À quoi sert la méthode du coude dans K-Means ?",
    questionAr: "لماذا تُستخدم طريقة الكوع في K-Means؟",
    optionsFr: [
      "Détecter les valeurs aberrantes dans les données",
      "Choisir le nombre optimal de clusters k en trouvant où l'inertie cesse de diminuer brusquement",
      "Visualiser les clusters haute dimension",
      "Élaguer l'arbre K-Means",
    ],
    optionsAr: [
      "اكتشاف القيم الشاذة في البيانات",
      "اختيار العدد الأمثل k للعناقيد بإيجاد نقطة توقف الانخفاض الحاد في الجمود",
      "تصور العناقيد عالية الأبعاد",
      "تقليم شجرة K-Means",
    ],
    explanationFr:
      "L'inertie diminue de manière monotone avec k. Le « coude » — là où ajouter un autre cluster donne des rendements décroissants — suggère un bon k. Le score de silhouette est une alternative plus rigoureuse.",
    explanationAr:
      "ينخفض الجمود بصورة رتيبة مع k. نقطة «الكوع» — حيث تُصبح إضافة عنقود آخر ذات عائد متناقص — تُشير إلى k مناسب. مقياس الصورة الظلية يوفر بديلاً أكثر صرامة.",
  },

  "clustering|1": {
    questionFr:
      "Pourquoi DBSCAN est-il meilleur que K-Means pour les clusters non sphériques ?",
    questionAr: "لماذا يتفوق DBSCAN على K-Means في العناقيد غير الكروية؟",
    optionsFr: [
      "DBSCAN converge plus vite",
      "DBSCAN regroupe les points par densité, formant des clusters de forme arbitraire sans nécessiter k à l'avance",
      "DBSCAN gère mieux les données haute dimension",
      "DBSCAN produit toujours le même résultat",
    ],
    optionsAr: [
      "DBSCAN يتقارب أسرع",
      "يُجمّع DBSCAN النقاط بالكثافة، مُشكّلاً عناقيد بأشكال عشوائية دون الحاجة لتحديد k مسبقاً",
      "يتعامل DBSCAN بشكل أفضل مع البيانات عالية الأبعاد",
      "يُنتج DBSCAN دائماً نفس النتيجة",
    ],
    explanationFr:
      "K-Means suppose des clusters convexes de taille approximativement égale et nécessite k à l'avance. DBSCAN étiquette les régions denses quelle que soit leur forme et marque les points épars comme bruit.",
    explanationAr:
      "يفترض K-Means عناقيد محدبة متقاربة الحجم ويتطلب k مسبقاً. يُصنّف DBSCAN المناطق الكثيفة بصرف النظر عن الشكل ويُعلّم النقاط المتفرقة كضوضاء.",
  },

  "clustering|2": {
    questionFr: "Dans DBSCAN, qu'est-ce qu'un « point noyau » ?",
    questionAr: "ما «نقطة النواة» في DBSCAN؟",
    optionsFr: [
      "Le centroïde d'un cluster",
      "Un point ayant au moins MinPts voisins dans le rayon ε",
      "Un point à la frontière entre deux clusters",
      "Le point le plus éloigné de tous les autres",
    ],
    optionsAr: [
      "مركز ثقل العنقود",
      "نقطة لها على الأقل MinPts جار ضمن نصف قطر ε",
      "نقطة على الحدود بين عنقودين",
      "النقطة الأبعد عن جميع النقاط الأخرى",
    ],
    explanationFr:
      "Les points noyaux ont une densité locale suffisante (≥ MinPts dans ε) pour ancrer un cluster. Les points frontières sont dans ε d'un point noyau mais pas assez denses eux-mêmes. Les autres sont du bruit.",
    explanationAr:
      "نقاط النواة لها كثافة محلية كافية (≥ MinPts ضمن ε) لترسيخ عنقود. نقاط الحدود تقع ضمن ε من نقطة نواة لكنها لا تملك كثافة كافية. ما تبقى ضوضاء.",
  },

  // ── pca ────────────────────────────────────────────────────────────────────

  "pca|0": {
    questionFr: "Que représente la première composante principale ?",
    questionAr: "ماذا تمثل المكوّن الرئيسي الأول؟",
    optionsFr: [
      "La variable ayant la moyenne la plus élevée",
      "La direction de variance maximale dans les données",
      "La paire de variables la plus corrélée",
      "La première colonne de la matrice de données",
    ],
    optionsAr: [
      "الميزة ذات أعلى متوسط",
      "اتجاه التباين الأقصى في البيانات",
      "أكثر زوج ميزات ارتباطاً",
      "العمود الأول في مصفوفة البيانات",
    ],
    explanationFr:
      "PC1 est le vecteur propre de la matrice de covariance correspondant à la plus grande valeur propre — la direction le long de laquelle les données varient le plus.",
    explanationAr:
      "PC1 هو المتجه الذاتي لمصفوفة التباين المشترك المقابل لأكبر قيمة ذاتية — الاتجاه الذي تتباين فيه البيانات بأكبر قدر.",
  },

  "pca|1": {
    questionFr:
      "Si vous gardez 2 composantes sur 100 et qu'elles expliquent 85 % de la variance, qu'avez-vous écarté ?",
    questionAr: "إذا احتفظت بمكوّنين من 100 ويفسران 85% من التباين، فماذا أسقطت؟",
    optionsFr: [
      "85 % de l'information",
      "15 % de la variance (principalement du bruit)",
      "Toute la structure non linéaire",
      "Les 2 variables les plus importantes",
    ],
    optionsAr: [
      "85% من المعلومات",
      "15% من التباين (غالباً ضوضاء)",
      "كل البنية غير الخطية",
      "أهم ميزتين",
    ],
    explanationFr:
      "Les 98 composantes écartées contiennent 15 % de la variance — souvent du bruit. Les 85 % retenus capturent la structure dominante à une compression de 50×.",
    explanationAr:
      "تحتوي المكوّنات الـ98 المُسقطة على 15% من التباين — غالباً ضوضاء. يلتقط الـ85% المحتجز البنية السائدة بضغط 50×.",
  },

  "pca|2": {
    questionFr:
      "Pourquoi faut-il centrer (soustraire la moyenne) avant d'appliquer PCA ?",
    questionAr: "لماذا يجب تمركز البيانات (طرح المتوسط) قبل تطبيق PCA؟",
    optionsFr: [
      "Pour s'assurer que toutes les valeurs sont positives",
      "Afin que la matrice de covariance soit calculée correctement autour de zéro et non d'une moyenne décalée",
      "Pour accélérer la décomposition en valeurs propres",
      "PCA ne fonctionne que sur des données standardisées",
    ],
    optionsAr: [
      "للتأكد من أن جميع القيم موجبة",
      "حتى تُحسب مصفوفة التباين المشترك بشكل صحيح حول الصفر لا حول متوسط مُزاح",
      "لتسريع التحليل الطيفي",
      "PCA يعمل فقط على بيانات مُقيّسة",
    ],
    explanationFr:
      "Sans centrage, la première composante pointerait vers la moyenne des données plutôt que vers la direction de variance maximale. Le centrage garantit que PCA capture la variance, pas le décalage.",
    explanationAr:
      "بدون التمركز سيشير المكوّن الأول نحو متوسط البيانات لا نحو اتجاه التباين الأقصى. يضمن التمركز أن PCA يلتقط التباين لا الإزاحة.",
  },

  // ── anomaly ────────────────────────────────────────────────────────────────

  "anomaly|0": {
    questionFr: "Comment Isolation Forest détecte-t-il les anomalies ?",
    questionAr: "كيف يكتشف Isolation Forest الشذوذات؟",
    optionsFr: [
      "En mesurant la distance de chaque point au centroïde le plus proche",
      "En isolant les points par des coupes aléatoires — les anomalies nécessitent moins de coupes pour être isolées",
      "En ajustant une gaussienne et en signalant les points à faible probabilité",
      "En regroupant et en étiquetant les petits clusters comme anomalies",
    ],
    optionsAr: [
      "بقياس مسافة كل نقطة من أقرب مركز ثقل",
      "بعزل النقاط باستخدام تقسيمات عشوائية — الشذوذات تحتاج تقسيمات أقل للعزل",
      "بتناسب توزيع غاوسي وتعليم النقاط ذات الاحتمالية المنخفضة",
      "بالتجميع وتعليم العناقيد الصغيرة كشذوذات",
    ],
    explanationFr:
      "Les anomalies sont éparses et « différentes », donc les coupes aléatoires les isolent rapidement (chemin court). Les points normaux, regroupés ensemble, nécessitent de nombreuses coupes.",
    explanationAr:
      "الشذوذات متفرقة و«مختلفة»، لذا تعزلها التقسيمات العشوائية بسرعة (مسار قصير). النقاط الطبيعية المتجمعة تحتاج تقسيمات كثيرة.",
  },

  "anomaly|1": {
    questionFr:
      "Que représente le paramètre contamination dans Isolation Forest ?",
    questionAr: "ماذا يمثل معامل contamination في Isolation Forest؟",
    optionsFr: [
      "La quantité de bruit ajoutée aux données",
      "La proportion attendue de valeurs aberrantes dans le jeu de données",
      "Le nombre d'arbres dans la forêt",
      "La graine aléatoire pour la reproductibilité",
    ],
    optionsAr: [
      "كمية الضوضاء المضافة للبيانات",
      "النسبة المتوقعة من القيم الشاذة في مجموعة البيانات",
      "عدد الأشجار في الغابة",
      "البذرة العشوائية لقابلية التكرار",
    ],
    explanationFr:
      "Contamination fixe le seuil du score d'anomalie. Si vous attendez 5 % de valeurs aberrantes, fixez contamination=0,05 et le modèle étiquette les 5 % ayant les scores d'anomalie les plus bas.",
    explanationAr:
      "يُحدّد contamination عتبة درجة الشذوذ. إذا توقعت 5% قيم شاذة، اضبط contamination=0.05 وسيُصنّف النموذج الـ5% ذات أدنى درجات الشذوذ كقيم شاذة.",
  },

  "anomaly|2": {
    questionFr:
      "Quand préférerez-vous LOF à Isolation Forest ?",
    questionAr: "متى تُفضّل LOF على Isolation Forest؟",
    optionsFr: [
      "Sur de très grands jeux de données (millions de lignes)",
      "Quand les anomalies sont définies localement — un point n'est anormal que par rapport à la densité de son voisinage",
      "Quand l'interprétabilité est importante",
      "Sur des données d'images haute dimension",
    ],
    optionsAr: [
      "على البيانات الضخمة جداً (ملايين الصفوف)",
      "عندما تُعرَّف الشذوذات محلياً — نقطة شاذة فقط بالنسبة لكثافة جوارها",
      "عندما تكون قابلية التفسير مهمة",
      "على بيانات الصور عالية الأبعاد",
    ],
    explanationFr:
      "LOF compare la densité locale de chaque point à ses voisins. Un point dans une région peu dense entouré de clusters denses est localement anormal, même s'il ne l'est pas globalement.",
    explanationAr:
      "يُقارن LOF الكثافة المحلية لكل نقطة بجيرانها. نقطة في منطقة متفرقة محاطة بعناقيد كثيفة تُعدّ شاذة محلياً حتى لو لم تكن كذلك عالمياً.",
  },

};

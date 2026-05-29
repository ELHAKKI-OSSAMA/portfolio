import type { QuizI18n } from './types';

export const T_advanced: Record<string, QuizI18n> = {

  // ── bagging-stacking ───────────────────────────────────────────────────────

  "bagging-stacking|0": {
    questionFr: "Pourquoi le bagging réduit-il la variance ?",
    questionAr: "لماذا يُقلّل bagging من التباين؟",
    optionsFr: [
      "Il utilise des modèles de base plus simples",
      "La moyenne de nombreux modèles entraînés sur différents échantillons bootstrap annule les erreurs individuelles de surapprentissage",
      "Il pénalise les grands poids entre les modèles",
      "Il réduit le nombre de variables utilisées",
    ],
    optionsAr: [
      "يستخدم نماذج أساسية أبسط",
      "التوسيط على نماذج عديدة مدرّبة على عينات bootstrap مختلفة يُلغي أخطاء الإفراط الفردية",
      "يعاقب الأوزان الكبيرة عبر النماذج",
      "يُقلّل عدد الميزات المستخدمة",
    ],
    explanationFr:
      "Chaque modèle bootstrapé sur-apprend différemment. Quand leurs erreurs sont décorrélées, la moyenne réduit la variance d'un facteur ~1/B. Le biais reste le même — c'est de la réduction de variance pure.",
    explanationAr:
      "كل نموذج مبني على bootstrap يُفرط في التخصيص بطريقة مختلفة. عندما تكون أخطاؤها غير مترابطة، يُقلّل التوسيط التباين بعامل ~1/B. يظل التحيز كما هو — هذا تقليل تباين خالص.",
  },

  "bagging-stacking|1": {
    questionFr: "Dans le stacking, sur quoi est entraîné le méta-apprenant ?",
    questionAr: "في stacking، على ماذا يُدرَّب المتعلم الفوقي (meta-learner)؟",
    optionsFr: [
      "Les variables d'entraînement originales",
      "Les prédictions hors-pli (OOF) des modèles de base sur le jeu d'entraînement",
      "Les prédictions des modèles de base sur le jeu de test",
      "La moyenne des poids des modèles de base",
    ],
    optionsAr: [
      "الميزات الأصلية للتدريب",
      "تنبؤات Out-of-Fold (OOF) من النماذج الأساسية على مجموعة التدريب",
      "تنبؤات النماذج الأساسية على مجموعة الاختبار",
      "متوسط أوزان النماذج الأساسية",
    ],
    explanationFr:
      "Pour éviter la fuite, les modèles de base génèrent des prédictions par validation croisée (OOF). Le méta-apprenant apprend alors à quels modèles de base faire confiance selon les entrées.",
    explanationAr:
      "لتجنب التسرب، تُنشئ النماذج الأساسية تنبؤات عبر التحقق المتبادل (OOF). يتعلم المتعلم الفوقي بعدها الوثوق بأي النماذج الأساسية لمدخلات مختلفة.",
  },

  "bagging-stacking|2": {
    questionFr:
      "Le boosting réduit quelle composante du compromis biais-variance ?",
    questionAr: "أي مكون من مقايضة التحيز-التباين يُقلّله boosting؟",
    optionsFr: [
      "Variance — en faisant la moyenne de nombreux modèles",
      "Biais — en corrigeant itérativement les erreurs résiduelles des modèles précédents",
      "Biais et variance de manière égale",
      "Aucun — il n'augmente que la complexité du modèle",
    ],
    optionsAr: [
      "التباين — بالتوسيط على نماذج عديدة",
      "التحيز — بتصحيح أخطاء البقايا بشكل متكرر من النماذج السابقة",
      "كلٌّ من التحيز والتباين بالتساوي",
      "لا شيء — فهو يزيد تعقيد النموذج فقط",
    ],
    explanationFr:
      "Chaque étape de boosting corrige les erreurs systématiques des étapes précédentes, réduisant le biais vers zéro. Cependant, trop d'étapes peut augmenter la variance (surapprentissage).",
    explanationAr:
      "يُصحّح كل مرحلة من boosting الأخطاء المنهجية للمراحل السابقة، مما يدفع التحيز نحو الصفر. لكن كثرة المراحل قد تزيد التباين (إفراط في التخصيص).",
  },

  // ── ova-ovo ────────────────────────────────────────────────────────────────

  "ova-ovo|0": {
    questionFr:
      "Combien de classificateurs binaires One-vs-All (OvA) entraîne-t-il pour un problème à 5 classes ?",
    questionAr: "كم عدد المصنّفات الثنائية التي يُدرّبها One-vs-All (OvA) لمشكلة من 5 فئات؟",
    optionsFr: ["10", "5", "4", "25"],
    optionsAr: ["10", "5", "4", "25"],
    explanationFr:
      "OvA entraîne k classificateurs pour k classes — chacun distingue une classe de toutes les autres. OvO entraîne k(k-1)/2 = 10 classificateurs. OvA est plus courant en raison de son coût d'entraînement inférieur.",
    explanationAr:
      "يُدرّب OvA مصنّفاً لكل فئة — يميز فئة واحدة عن جميع الأخريات. أما OvO فيُدرّب k(k-1)/2 = 10 مصنّفات. OvA أكثر شيوعاً لتكلفته الأقل.",
  },

  "ova-ovo|1": {
    questionFr:
      "Pourquoi OvA produit-il des probabilités mal calibrées ?",
    questionAr: "لماذا يُنتج OvA احتماليات سيئة المعايرة؟",
    optionsFr: [
      "Il utilise des sorties sigmoïdes",
      "Chaque classificateur binaire est entraîné sur un jeu déséquilibré (1 classe contre toutes), biaisant les probabilités prédites",
      "OvA ne produit pas de probabilités",
      "OvA utilise un softmax qui somme à >1",
    ],
    optionsAr: [
      "يستخدم مخرجات sigmoid",
      "كل مصنّف ثنائي يُدرَّب على بيانات مختلة (فئة 1 ضد الكل)، مما يُحيّز الاحتماليات المتوقعة",
      "OvA لا يُخرج احتماليات",
      "OvA يستخدم softmax الذي يجمع إلى >1",
    ],
    explanationFr:
      "OvA entraîne classe 1 contre 7 classes — un déséquilibre 1:7. Les estimations de probabilité du classificateur sont biaisées. Les probabilités OvA brutes entre classes ne somment pas à 1 et nécessitent une calibration.",
    explanationAr:
      "يُدرّب OvA الفئة 1 مقابل 7 فئات — اختلال 1:7. تقديرات احتمالية المصنّف منحازة. الاحتماليات الخام لـ OvA عبر الفئات لا تجمع إلى 1 وتحتاج معايرة.",
  },

  "ova-ovo|2": {
    questionFr:
      "Quand le Softmax a-t-il un avantage sur OvA/OvO ?",
    questionAr: "متى يتفوق Softmax على OvA/OvO؟",
    optionsFr: [
      "Lors de l'entraînement d'une forêt aléatoire",
      "Lors de l'entraînement d'un réseau de neurones de bout en bout — Softmax donne une distribution de probabilité correcte sur toutes les classes simultanément",
      "Quand le problème n'a que 2 classes",
      "Lors de l'utilisation de SVMs",
    ],
    optionsAr: [
      "عند تدريب غابة عشوائية",
      "عند تدريب شبكة عصبية كاملة — يُعطي Softmax توزيعاً احتمالياً صحيحاً على جميع الفئات في آنٍ واحد",
      "عندما تكون المشكلة ثنائية الفئة فقط",
      "عند استخدام SVMs",
    ],
    explanationFr:
      "Softmax normalise tous les scores de classes en une distribution correcte en une passe, et tout le réseau est entraîné conjointement. OvA/OvO décomposent un problème multi-classes en problèmes binaires indépendants.",
    explanationAr:
      "يُطبّع Softmax جميع درجات الفئات في توزيع صحيح بتمريرة واحدة، ويُدرَّب الشبكة بالكامل معاً. OvA/OvO يُفككان المشكلة متعددة الفئات إلى مشاكل ثنائية مستقلة.",
  },

  // ── transformers-attention ────────────────────────────────────────────────

  "transformers-attention|0": {
    questionFr:
      "Dans l'attention produit scalaire normalisée, pourquoi divise-t-on par √d_k ?",
    questionAr: "في الانتباه بالضرب النقطي المُقيَّس، لماذا نقسم على √d_k؟",
    optionsFr: [
      "Pour normaliser la sortie sur [0,1]",
      "Un grand d_k rend les produits scalaires grands, poussant le softmax vers la saturation (gradients quasi nuls). La mise à l'échelle par √d_k stabilise la variance",
      "Pour imposer un ordre positionnel",
      "Pour que les scores d'attention somment à un avant le softmax",
    ],
    optionsAr: [
      "لتطبيع المخرجات على [0,1]",
      "d_k الكبير يجعل الضرب النقطي كبيراً، دافعاً softmax نحو التشبع (تدرجات شبه صفرية). التقييس بـ √d_k يُثبّت التباين",
      "لفرض الترتيب الموضعي",
      "لكي تجمع درجات الانتباه إلى واحد قبل softmax",
    ],
    explanationFr:
      "Les valeurs Q·Kᵀ croissent en magnitude avec la dimension. Diviser par √d_k maintient les logits pré-softmax dans une plage raisonnable, évitant la région à gradient quasi nul du softmax.",
    explanationAr:
      "تنمو قيم Q·Kᵀ بالحجم مع الأبعاد. القسمة على √d_k تُبقي اللوغتيات قبل softmax في نطاق معقول، متجنبةً منطقة التدرج شبه الصفري لـ softmax.",
  },

  "transformers-attention|1": {
    questionFr:
      "Que gagne l'attention multi-têtes par rapport à l'attention à une seule tête ?",
    questionAr: "ما الذي يكسبه الانتباه متعدد الرؤوس مقارنةً بالرأس الواحد؟",
    optionsFr: [
      "Un calcul plus rapide pour les longues séquences",
      "Plusieurs têtes peuvent porter attention à différentes positions et types de relations simultanément, puis leurs perspectives sont concaténées",
      "Des informations positionnelles exactes sans encodage positionnel",
      "Un nombre de paramètres réduit",
    ],
    optionsAr: [
      "حساب أسرع للتسلسلات الطويلة",
      "يمكن لعدة رؤوس الانتباه إلى مواضع وأنواع علاقات مختلفة في آنٍ واحد، ثم تُدمج منظوراتها",
      "معلومات موضعية دقيقة بدون ترميز موضعي",
      "عدد معلمات أقل",
    ],
    explanationFr:
      "La tête 1 peut capturer les dépendances syntaxiques ; tête 2 la coréférence ; tête 3 le contexte local. Concaténer h têtes et projeter donne des représentations plus riches qu'une seule tête.",
    explanationAr:
      "الرأس 1 قد يلتقط التبعيات النحوية؛ الرأس 2 الإحالة المشتركة؛ الرأس 3 السياق المحلي. دمج h رؤوس وإسقاطها يُعطي تمثيلات أغنى من أي رأس منفرد.",
  },

  "transformers-attention|2": {
    questionFr:
      "Quelle est la différence architecturale clé entre BERT et GPT ?",
    questionAr: "ما الاختلاف المعماري الرئيسي بين BERT وGPT؟",
    optionsFr: [
      "BERT utilise des couches convolutives ; GPT utilise la récurrence",
      "BERT est encodeur uniquement avec une attention bidirectionnelle (lit le contexte complet) ; GPT est décodeur uniquement avec un masquage causal (gauche à droite)",
      "BERT est plus grand que GPT",
      "GPT utilise des embeddings positionnels absolus ; BERT utilise des relatifs",
    ],
    optionsAr: [
      "BERT يستخدم طبقات التفاف؛ GPT يستخدم التكرار",
      "BERT مشفّر فقط بانتباه ثنائي الاتجاه (يقرأ السياق كاملاً)؛ GPT فاكّ شفرة فقط بقناع سببي (من اليسار لليمين)",
      "BERT أكبر من GPT",
      "GPT يستخدم تضمينات موضعية مطلقة؛ BERT نسبية",
    ],
    explanationFr:
      "L'attention bidirectionnelle de BERT laisse chaque token porter attention au passé ET au futur — idéal pour la compréhension. Le masque causal de GPT ne laisse chaque token voir que les tokens précédents — idéal pour la génération.",
    explanationAr:
      "انتباه BERT الثنائي يدع كل رمز يُركّز على الماضي والمستقبل — مثالي للفهم. قناع GPT السببي يسمح لكل رمز برؤية الرموز السابقة فقط — مثالي للتوليد.",
  },

  // ── generative-models ─────────────────────────────────────────────────────

  "generative-models|0": {
    questionFr: "Qu'est-ce que l'astuce de reparamétrisation dans les VAE ?",
    questionAr: "ما حيلة إعادة المعاملة (reparametrisation trick) في VAE؟",
    optionsFr: [
      "Remplacer l'encodeur par une fonction déterministe",
      "Échantillonner z = μ + σ·ε (ε ~ N(0,1)) pour que les gradients puissent circuler à travers l'étape d'échantillonnage via μ et σ",
      "Appliquer la normalisation par lot à l'espace latent",
      "Discrétiser l'espace latent",
    ],
    optionsAr: [
      "استبدال المشفّر بدالة محددة",
      "أخذ عينة z = μ + σ·ε (ε ~ N(0,1)) حتى يمكن للتدرجات التدفق عبر خطوة أخذ العينة عبر μ وσ",
      "تطبيق تطبيع الدُّفعة على الفضاء الكامن",
      "تقطيع الفضاء الكامن",
    ],
    explanationFr:
      "Échantillonner z ~ N(μ,σ²) est non différentiable. Écrire z = μ + σ·ε déplace l'aléatoire vers ε (sans paramètres), de sorte que ∂z/∂μ et ∂z/∂σ sont bien définis et la rétropropagation fonctionne.",
    explanationAr:
      "أخذ عينة z ~ N(μ,σ²) غير قابل للتفاضل. كتابة z = μ + σ·ε ينقل العشوائية إلى ε (بلا معلمات)، مما يجعل ∂z/∂μ و∂z/∂σ محدّدَين وتعمل الانتشار الخلفي.",
  },

  "generative-models|1": {
    questionFr: "Qu'est-ce que l'effondrement de mode dans les GAN ?",
    questionAr: "ما انهيار النمط (mode collapse) في الشبكات التوليدية التنافسية؟",
    optionsFr: [
      "Le discriminateur gagne toujours",
      "Le générateur apprend à produire seulement quelques types de sorties (modes) au lieu de la distribution complète des données",
      "Le gradient du générateur devient nul",
      "Les deux réseaux convergent trop tôt vers un point fixe",
    ],
    optionsAr: [
      "المميّز يفوز دائماً",
      "يتعلم المولّد إنتاج بضعة أنواع فقط من المخرجات بدلاً من التوزيع الكامل للبيانات",
      "يُصبح تدرج المولّد صفراً",
      "تتقارب كلتا الشبكتين مبكراً نحو نقطة ثابتة",
    ],
    explanationFr:
      "Un générateur de GAN peut « tricher » en produisant une poignée d'images qui trompent régulièrement le discriminateur, ignorant la majeure partie de la distribution des données. Des techniques comme la discrimination par mini-lot et la perte de Wasserstein aident.",
    explanationAr:
      "يمكن للمولّد «الغش» بإنتاج حفنة من الصور التي تخدع المميّز باستمرار، متجاهلاً معظم توزيع البيانات. تقنيات كالتمييز بالدُّفعة الصغيرة وخسارة Wasserstein تُساعد.",
  },

  "generative-models|2": {
    questionFr:
      "Dans un VAE, que fait le terme de divergence KL dans l'ELBO ?",
    questionAr: "في VAE، ما الذي يفرضه حد تباعد KL في ELBO؟",
    optionsFr: [
      "La qualité de reconstruction",
      "Que la distribution postérieure q(z|x) reste proche du prior N(0,I) — régularisant l'espace latent",
      "La perte du discriminateur",
      "Que le décodeur est déterministe",
    ],
    optionsAr: [
      "جودة إعادة البناء",
      "بقاء التوزيع اللاحق q(z|x) قريباً من السابق N(0,I) — تنظيم الفضاء الكامن",
      "خسارة المميّز",
      "أن فاكّ الشفرة محدد",
    ],
    explanationFr:
      "ELBO = E[log p(x|z)] - D_KL(q(z|x)||p(z)). Sans le terme KL, l'encodeur s'effondrerait vers un delta (aucune incertitude). Le KL force un espace latent lisse et régulier permettant l'interpolation.",
    explanationAr:
      "ELBO = E[log p(x|z)] - D_KL(q(z|x)||p(z)). بدون حد KL سينهار المشفّر إلى دلتا (لا عدم يقين). يفرض KL فضاءً كامناً سلساً ومنتظماً يُتيح الاستيفاء.",
  },

};

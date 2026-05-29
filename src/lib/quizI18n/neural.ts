import type { QuizI18n } from './types';

export const T_neural: Record<string, QuizI18n> = {

  // ── neural-networks ───────────────────────────────────────────────────────

  "neural-networks|0": {
    questionFr:
      "Pourquoi l'activation ReLU aide-t-elle avec le problème de disparition des gradients ?",
    questionAr: "لماذا تُساعد دالة التنشيط ReLU في مشكلة اختفاء التدرجات؟",
    optionsFr: [
      "Les sorties de ReLU sont toujours entre 0 et 1",
      "Le gradient de ReLU est 1 pour les entrées positives, sans saturation vers zéro comme sigmoid/tanh",
      "ReLU est gratuit en calcul",
      "ReLU normalise les activations",
    ],
    optionsAr: [
      "مخرجات ReLU دائماً بين 0 و1",
      "تدرج ReLU يساوي 1 للمدخلات الموجبة دون تشبّع نحو الصفر كما في sigmoid/tanh",
      "ReLU لا يكلّف حسابياً",
      "ReLU يُطبّع التنشيطات",
    ],
    explanationFr:
      "Sigmoid/tanh saturent : aux valeurs extrêmes leurs gradients → 0, tuant le signal dans les réseaux profonds. ReLU(x) = max(0,x) a un gradient de 1 pour x>0, laissant les gradients circuler librement.",
    explanationAr:
      "تتشبع sigmoid/tanh: عند القيم المتطرفة تدرجاتها → 0، مما يقتل الإشارة في الشبكات العميقة. ReLU(x) = max(0,x) له تدرج 1 لـ x>0، مما يدع التدرجات تتدفق بحرية.",
  },

  "neural-networks|1": {
    questionFr:
      "Que garantit la stratégie d'initialisation Xavier ?",
    questionAr: "ما الذي تضمنه استراتيجية تهيئة Xavier؟",
    optionsFr: [
      "Les poids démarrent à zéro pour briser la symétrie",
      "La variance des activations reste approximativement constante d'une couche à l'autre, évitant explosion ou disparition à l'initialisation",
      "Tous les poids sont positifs au départ",
      "Les poids sont initialisés à partir d'une distribution uniforme",
    ],
    optionsAr: [
      "تبدأ الأوزان بالصفر لكسر التماثل",
      "يبقى تباين التنشيطات ثابتاً تقريباً عبر الطبقات، مانعاً الانفجار أو الاختفاء عند التهيئة",
      "جميع الأوزان موجبة في البداية",
      "تُهيَّأ الأوزان من توزيع منتظم",
    ],
    explanationFr:
      "Initialisation Xavier/Glorot : w ~ U(-√(6/(n_in+n_out)), √(6/(n_in+n_out))). Cela maintient la variance du signal stable en avant et en arrière à l'initialisation — crucial pour les réseaux profonds.",
    explanationAr:
      "تهيئة Xavier/Glorot: w ~ U(-√(6/(n_in+n_out)), √(6/(n_in+n_out))). تُبقي تباين الإشارة ثابتاً للأمام والخلف عند التهيئة — أمر حاسم للشبكات العميقة.",
  },

  "neural-networks|2": {
    questionFr:
      "Qu'est-ce que la brisure de symétrie des poids, et pourquoi l'initialisation aléatoire la corrige-t-elle ?",
    questionAr: "ما كسر تماثل الأوزان، ولماذا تُصلحه التهيئة العشوائية؟",
    optionsFr: [
      "Les poids deviennent égaux pendant l'entraînement à cause de fonctions d'activation identiques",
      "Si tous les poids démarrent égaux, tous les neurones d'une couche reçoivent des gradients identiques et apprennent les mêmes caractéristiques — l'initialisation aléatoire fait diverger les neurones",
      "Les poids croissent trop sans initialisation aléatoire",
      "La régularisation crée une symétrie que l'initialisation aléatoire empêche",
    ],
    optionsAr: [
      "تتساوى الأوزان أثناء التدريب بسبب دوال تنشيط متطابقة",
      "إذا بدأت جميع الأوزان متساوية، تتلقى جميع النيورونات في طبقة تدرجات متطابقة وتتعلم نفس الميزات — التهيئة العشوائية تجعل النيورونات تتباعد",
      "تنمو الأوزان كثيراً بدون تهيئة عشوائية",
      "التنظيم يخلق تماثلاً تمنعه التهيئة العشوائية",
    ],
    explanationFr:
      "Des poids identiques → des gradients identiques → des mises à jour identiques pour toujours. Même une couche de neurones identiques ne peut représenter des caractéristiques différentes. Les petites valeurs aléatoires brisent la symétrie.",
    explanationAr:
      "أوزان متطابقة → تدرجات متطابقة → تحديثات متطابقة إلى الأبد. حتى طبقة واحدة من النيورونات المتطابقة لا تستطيع تمثيل ميزات مختلفة. القيم العشوائية الصغيرة تكسر التماثل.",
  },

  // ── dl-optimization ───────────────────────────────────────────────────────

  "dl-optimization|0": {
    questionFr: "Quel est le rôle du momentum dans SGD avec Momentum ?",
    questionAr: "ما دور الزخم في SGD مع Momentum؟",
    optionsFr: [
      "Il réduit le taux d'apprentissage au fil du temps",
      "Il accumule un vecteur de vitesse dans les directions de gradient persistantes, accélérant dans les ravines et amortissant les oscillations",
      "Il écrête les gradients à une norme maximale",
      "Il découple la décroissance des poids du taux d'apprentissage",
    ],
    optionsAr: [
      "يُقلّل معدل التعلم بمرور الوقت",
      "يتراكم متجه سرعة في اتجاهات التدرج المستمرة، مُسرِّعاً عبر الأخاديد ومُخفّفاً التذبذبات",
      "يقصّ التدرجات عند حد معياري أقصى",
      "يُفصل اضمحلال الوزن عن معدل التعلم",
    ],
    explanationFr:
      "vₜ = βvₜ₋₁ + (1-β)∇L ; w -= η·vₜ. Dans un paysage en forme de bol, la balle accumule de la vitesse en descendant et oscille moins sur les parois raides.",
    explanationAr:
      "vₜ = βvₜ₋₁ + (1-β)∇L؛ w -= η·vₜ. في منظر خسارة على شكل وعاء، تتراكم الكرة سرعةً أسفل المنحدر وتتذبذب أقل على الجدران الشديدة الانحدار.",
  },

  "dl-optimization|1": {
    questionFr:
      "Pourquoi la normalisation par lot (Batch Normalization) permet-elle des taux d'apprentissage plus élevés ?",
    questionAr: "لماذا تتيح التطبيع بالدُّفعة (Batch Normalization) معدلات تعلم أعلى؟",
    optionsFr: [
      "Elle réduit le nombre de paramètres",
      "Elle recentre et remet à l'échelle chaque mini-lot, réduisant la covariance interne et rendant les gradients plus prévisibles",
      "Elle ajoute du bruit de régularisation aux poids",
      "Elle remplace le besoin de dropout",
    ],
    optionsAr: [
      "تُقلّل عدد المعلمات",
      "تُعيد تمركز وتقييس كل دُفعة صغيرة، مُقلّلةً تحول التوزيع الداخلي وجاعلةً التدرجات أكثر قابلية للتنبؤ",
      "تُضيف ضوضاء تنظيم للأوزان",
      "تحلّ محل الحاجة إلى dropout",
    ],
    explanationFr:
      "Sans BN, une mise à jour de poids dans une couche déplace la distribution d'entrée de la suivante. BN re-normalise les entrées de chaque couche, rendant l'entraînement plus stable à un grand taux d'apprentissage.",
    explanationAr:
      "بدون BN، يُغيّر تحديث أوزان طبقة ما توزيع مدخلات الطبقة التالية. تُعيد BN تطبيع مدخلات كل طبقة، مما يُجعل التدريب أكثر استقراراً بمعدل تعلم أكبر.",
  },

  "dl-optimization|2": {
    questionFr: "Quelle est la différence entre Adam et AdamW ?",
    questionAr: "ما الفرق بين Adam وAdamW؟",
    optionsFr: [
      "AdamW utilise un β₁ différent",
      "AdamW découple la décroissance des poids de la mise à jour du gradient adaptatif, en l'appliquant directement aux poids plutôt qu'à l'intérieur des estimations de moment d'Adam",
      "AdamW n'a pas de terme de momentum",
      "AdamW est uniquement pour les transformers",
    ],
    optionsAr: [
      "يستخدم AdamW β₁ مختلفاً",
      "يُفصل AdamW اضمحلال الوزن عن تحديث التدرج التكيفي، مُطبّقاً إياه مباشرةً على الأوزان لا داخل تقديرات لحظات Adam",
      "لا يحتوي AdamW على مصطلح الزخم",
      "AdamW مخصص للـ transformers فقط",
    ],
    explanationFr:
      "Adam avec régularisation L2 applique la décroissance des poids via le gradient, ce qui interagit avec la mise à l'échelle adaptative. AdamW applique λw directement, comme prévu.",
    explanationAr:
      "Adam مع تنظيم L2 يُطبّق اضمحلال الوزن عبر التدرج، مما يتفاعل مع التقييس التكيفي. AdamW يُطبّق λw مباشرةً كما هو مقصود.",
  },

  // ── cnn-architectures ─────────────────────────────────────────────────────

  "cnn-architectures|0": {
    questionFr: "Qu'est-ce que le champ récepteur d'un neurone dans un CNN ?",
    questionAr: "ما المجال الاستقبالي للنيورون في شبكة CNN؟",
    optionsFr: [
      "La taille du noyau convolutif",
      "La région de l'image d'entrée qui influence l'activation de ce neurone",
      "Le nombre de cartes de caractéristiques en sortie",
      "La résolution spatiale de la carte de caractéristiques",
    ],
    optionsAr: [
      "حجم نواة التطابق",
      "المنطقة من الصورة المدخلة التي تؤثر على تنشيط ذلك النيورون",
      "عدد خرائط الميزات في المخرج",
      "الدقة المكانية لخريطة الميزات",
    ],
    explanationFr:
      "Les couches plus profondes ont un champ récepteur plus grand — chaque neurone « voit » une plus grande partie de l'entrée. Empiler des convolutions 3×3 est préféré à un grand noyau unique car cela donne le même champ récepteur avec moins de paramètres.",
    explanationAr:
      "الطبقات الأعمق لها مجال استقبالي أكبر — كل نيورون «يرى» جزءاً أكبر من الإدخال. تُفضَّل مكدّسات الالتفاف 3×3 على نواة كبيرة واحدة لأنها تُعطي نفس المجال الاستقبالي بمعلمات أقل.",
  },

  "cnn-architectures|1": {
    questionFr:
      "Quel problème les connexions résiduelles de ResNet résolvent-elles ?",
    questionAr: "ما المشكلة التي تحلها الاتصالات المتخطية في ResNet؟",
    optionsFr: [
      "Elles empêchent le surapprentissage en régularisant les poids",
      "Elles permettent aux gradients de circuler directement via le raccourci, évitant la disparition des gradients dans les réseaux très profonds",
      "Elles réduisent le nombre de paramètres",
      "Elles augmentent le champ récepteur",
    ],
    optionsAr: [
      "تمنع الإفراط في التخصيص بتنظيم الأوزان",
      "تتيح للتدرجات التدفق مباشرةً عبر مسار الاختصار، متجنبةً اختفاء التدرجات في الشبكات العميقة جداً",
      "تُقلّل عدد المعلمات",
      "تزيد المجال الاستقبالي",
    ],
    explanationFr:
      "Le résidu : ∂L/∂x = ∂L/∂y · (1 + ∂F/∂x). Le « +1 » garantit que les gradients sont toujours au moins aussi grands que le signal en amont, permettant l'entraînement de réseaux de 100+ couches.",
    explanationAr:
      "البقية: ∂L/∂x = ∂L/∂y · (1 + ∂F/∂x). الـ«+1» يضمن أن التدرجات أكبر دائماً أو تساوي على الأقل الإشارة الواردة، مما يُتيح تدريب شبكات بأكثر من 100 طبقة.",
  },

  "cnn-architectures|2": {
    questionFr:
      "En quoi ViT (Vision Transformer) diffère-t-il fondamentalement d'un CNN ?",
    questionAr: "كيف يختلف ViT (Vision Transformer) جوهرياً عن CNN؟",
    optionsFr: [
      "ViT utilise des noyaux plus grands que CNN",
      "ViT divise l'image en patches et applique une auto-attention pure — sans convolutions nulle part",
      "ViT ne fonctionne que sur de petites images",
      "ViT utilise la récurrence pour traiter les lignes d'image",
    ],
    optionsAr: [
      "يستخدم ViT نوى أكبر من CNN",
      "يُقسّم ViT الصورة إلى رقع ويُطبّق الانتباه الذاتي الخالص — دون أي التفافات",
      "يعمل ViT فقط على الصور الصغيرة",
      "يستخدم ViT التكرار لمعالجة صفوف الصورة",
    ],
    explanationFr:
      "ViT aplatit des patches de 16×16 pixels en tokens et les fait passer par des blocs d'encodeur transformer standard. Il n'y a pas de biais inductifs (équivariance à la translation, localité) — il apprend la structure spatiale à partir des données.",
    explanationAr:
      "يُسطّح ViT رقعاً من 16×16 بكسل إلى رموز ويُمرّرها عبر كتل ترميز transformer قياسية. لا توجد تحيزات استقرائية (تكافؤ الترجمة، المحلية) — يتعلم البنية المكانية من البيانات.",
  },

  // ── rnn-lstm-gru ──────────────────────────────────────────────────────────

  "rnn-lstm-gru|0": {
    questionFr:
      "Qu'est-ce qui cause le problème de disparition des gradients dans les RNN classiques ?",
    questionAr: "ما الذي يتسبب في مشكلة اختفاء التدرجات في RNN الكلاسيكية؟",
    optionsFr: [
      "L'état caché est trop grand",
      "La rétropropagation dans le temps multiplie la même matrice de poids t fois — si le rayon spectral < 1, les gradients diminuent jusqu'à zéro sur de longues séquences",
      "L'activation sigmoïde est utilisée dans la couche de sortie",
      "Les RNN manquent de connexions résiduelles",
    ],
    optionsAr: [
      "الحالة المخفية كبيرة جداً",
      "تضرب BPTT نفس مصفوفة الأوزان t مرة — إذا كان نصف القطر الطيفي < 1، تتلاشى التدرجات إلى الصفر على التسلسلات الطويلة",
      "تُستخدم دالة sigmoid في طبقة المخرجات",
      "تفتقر RNN إلى الاتصالات المتخطية",
    ],
    explanationFr:
      "BPTT déroule le RNN : ∂L/∂h₀ = ∏(∂hₜ/∂hₜ₋₁). La multiplication répétée d'une matrice de rayon spectral <1 → décroissance exponentielle. Les LSTM résolvent cela avec l'autoroute de l'état cellulaire.",
    explanationAr:
      "تُكشّف BPTT الـ RNN: ∂L/∂h₀ = ∏(∂hₜ/∂hₜ₋₁). الضرب المتكرر لمصفوفة بنصف قطر طيفي <1 → تحلل أسي. تحل LSTM هذا بطريق حالة الخلية.",
  },

  "rnn-lstm-gru|1": {
    questionFr: "Quel est le but de la porte d'oubli dans LSTM ?",
    questionAr: "ما غرض بوابة النسيان في LSTM؟",
    optionsFr: [
      "Réinitialiser l'état caché au début de chaque séquence",
      "Décider quelle part de l'état cellulaire précédent conserver ou effacer selon l'entrée et l'état caché actuels",
      "Contrôler la sortie de la porte",
      "Ajouter de nouvelles informations à l'état cellulaire",
    ],
    optionsAr: [
      "إعادة تعيين الحالة المخفية في بداية كل تسلسل",
      "تحديد مقدار ما يجب الاحتفاظ به أو مسحه من حالة الخلية السابقة بناءً على الإدخال والحالة المخفية الحاليين",
      "التحكم في مقدار ما تُخرجه البوابة",
      "إضافة معلومات جديدة إلى حالة الخلية",
    ],
    explanationFr:
      "fₜ = σ(Wf·[hₜ₋₁, xₜ] + bf). Des valeurs proches de 0 oublient le passé ; proches de 1, elles le préservent. Ce gating appris permet de maintenir des dépendances à long terme tout en oubliant le contexte non pertinent.",
    explanationAr:
      "fₜ = σ(Wf·[hₜ₋₁, xₜ] + bf). القيم القريبة من 0 تنسى الماضي؛ القريبة من 1 تحفظه. هذا التحكم المتعلَّم يتيح الحفاظ على التبعيات بعيدة المدى مع نسيان السياق غير ذي الصلة.",
  },

  "rnn-lstm-gru|2": {
    questionFr: "Quelle simplification clé le GRU apporte-t-il par rapport à LSTM ?",
    questionAr: "ما التبسيط الرئيسي الذي يُجريه GRU مقارنةً بـ LSTM؟",
    optionsFr: [
      "GRU n'utilise qu'une seule porte",
      "GRU fusionne les portes d'oubli et d'entrée en une seule porte de mise à jour et élimine l'état cellulaire séparé",
      "GRU n'a pas d'état caché",
      "GRU utilise l'attention à la place du gating",
    ],
    optionsAr: [
      "يستخدم GRU بوابة واحدة فقط",
      "يدمج GRU بوابتَي النسيان والإدخال في بوابة تحديث واحدة ويحذف حالة الخلية المنفصلة",
      "لا توجد حالة مخفية في GRU",
      "يستخدم GRU الانتباه بدلاً من التحكم",
    ],
    explanationFr:
      "GRU a une porte de réinitialisation r et une porte de mise à jour z mais pas d'état cellulaire. Cela donne ~2/3 des paramètres de LSTM avec des performances comparables sur de nombreuses tâches.",
    explanationAr:
      "يمتلك GRU بوابة إعادة تعيين r وبوابة تحديث z دون حالة خلية. يُعطي هذا ~2/3 معلمات LSTM بأداء مقارب على مهام كثيرة.",
  },

};

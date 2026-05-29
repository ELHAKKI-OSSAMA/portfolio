import type { SectionI18n, KeyFormulaI18n } from '../types';

export const sectionI18n_neural: Record<string, SectionI18n> = {

  // ── neural-networks ──────────────────────────────────────────────────────────
  "neural-networks|0": {
    headingFr: "Le Théorème d'Approximation Universelle",
    headingAr: "نظرية التقريب الشامل",
    textFr: "Cybenko (1989) a prouvé qu'une seule couche cachée avec suffisamment de neurones peut approximer n'importe quelle fonction continue à une précision arbitraire. Mais 'suffisamment' peut signifier des milliards de neurones pour des fonctions complexes. Les réseaux profonds (nombreuses couches, moins de neurones par couche) atteignent la même approximation avec exponentiellement moins de paramètres — ils apprennent des représentations hiérarchiques.",
    textAr: "أثبت سيبينكو (1989) أن طبقة خفية واحدة بعدد كافٍ من الخلايا العصبية يمكنها تقريب أي دالة مستمرة بأي دقة. لكن 'كافٍ' قد يعني مليارات الخلايا للدوال المعقدة. الشبكات العميقة (طبقات عديدة، خلايا أقل لكل طبقة) تحقق نفس التقريب بمعاملات أقل أسياً — إنها تتعلم تمثيلات هرمية.",
    calloutFr: "Un réseau profond avec L couches et n neurones par couche peut représenter des fonctions qui nécessitent O(2ⁿ) neurones dans un réseau à couche unique. La profondeur est de la compression.",
    calloutAr: "شبكة عميقة بـL طبقة وn خلية لكل طبقة يمكنها تمثيل دوال تتطلب O(2ⁿ) خلية في شبكة أحادية الطبقة. العمق هو ضغط.",
  },
  "neural-networks|1": {
    headingFr: "Ce que Calculent Vraiment les Neurones",
    headingAr: "ما تحسبه الخلايا العصبية فعلاً",
    textFr: "Chaque neurone calcule une somme pondérée de ses entrées (un hyperplan), puis applique une non-linéarité. Un seul neurone avec sigmoïde crée une frontière de décision douce. Plusieurs neurones dans une couche créent plusieurs hyperplans. Les couches profondes composent ces hyperplans, créant des frontières de décision de plus en plus complexes — des courbes, puis des courbes de courbes, puis des variétés.",
    textAr: "كل خلية عصبية تحسب مجموعاً موزوناً لمدخلاتها (مستوٍ فائق)، ثم تُطبّق عدم الخطية. خلية واحدة بسيغمويد تُنشئ حداً للقرار ناعماً. خلايا متعددة في طبقة تُنشئ مستويات فائقة متعددة. الطبقات العميقة تُركّب هذه المستويات، مُنشِئةً حدوداً للقرار أكثر تعقيداً — منحنيات، ثم منحنيات للمنحنيات، ثم متعددات.",
  },
  "neural-networks|2": {
    headingFr: "Rétropropagation : La Règle de la Chaîne à Grande Échelle",
    headingAr: "الانتشار الخلفي: قاعدة السلسلة على نطاق واسع",
    textFr: "L'entraînement nécessite le calcul de ∂L/∂W pour chaque poids. Le calcul direct est infaisable — un réseau avec 100M paramètres aurait besoin de 100M passes avant séparées. La rétropropagation exploite la règle de la chaîne pour calculer tous les gradients en une seule passe arrière, au même coût qu'une passe avant. C'est l'algorithme qui a rendu le deep learning possible.",
    textAr: "التدريب يتطلب حساب ∂L/∂W لكل وزن. الحساب المباشر غير ممكن — شبكة بـ100M معامل ستحتاج 100M تمرير أمامي منفصل. الانتشار الخلفي يستغل قاعدة السلسلة لحساب جميع التدرجات في تمرير خلفي واحد، بنفس تكلفة التمرير الأمامي. هذه الخوارزمية هي التي جعلت التعلم العميق ممكناً.",
    formulaLabelFr: "Règle de la chaîne appliquée à un seul poids",
    formulaLabelAr: "قاعدة السلسلة مُطبَّقة على وزن واحد",
  },
  "neural-networks|3": {
    headingFr: "Le Problème du Gradient Évanescent",
    headingAr: "مشكلة اختفاء التدرج",
    textFr: "Lors de la rétropropagation, les gradients sont multipliés à chaque couche. Pour la sigmoïde, σ'(z) ≤ 0,25 partout. Après 10 couches, le gradient est multiplié par 0,25¹⁰ ≈ 0,000001. Le gradient disparaît essentiellement — les premières couches cessent d'apprendre. ReLU corrige cela : sa dérivée est 1 pour z > 0, donc les gradients ne diminuent pas.",
    textAr: "أثناء الانتشار الخلفي، تُضرب التدرجات في كل طبقة. للسيغمويد، σ'(z) ≤ 0.25 في كل مكان. بعد 10 طبقات، التدرج مضروب بـ0.25¹⁰ ≈ 0.000001. يختفي التدرج أساساً — الطبقات الأولى تتوقف عن التعلم. ReLU يُصلح هذا: مشتقته 1 لـz > 0، فالتدرجات لا تتقلص.",
    formulaLabelFr: "ReLU et sa dérivée (résout le gradient évanescent)",
    formulaLabelAr: "ReLU ومشتقها (تحل مشكلة اختفاء التدرج)",
  },
  "neural-networks|4": {
    headingFr: "Boucle d'Entraînement SGD par Mini-Lots",
    headingAr: "حلقة تدريب SGD بالدُفعات الصغيرة",
    stepsFr: [
      "Initialiser les poids : He init pour ReLU (W ~ N(0, √(2/fan_in)))",
      "Pour chaque époque, mélanger les données d'entraînement",
      "Pour chaque mini-lot de taille B :",
      "  Passe avant : calculer les activations a[1]...a[L] et la perte L",
      "  Passe arrière : calculer δ[L] puis propager en arrière",
      "  Mise à jour : W[l] ← W[l] - α · ∂L/∂W[l]",
      "  Mise à jour : b[l] ← b[l] - α · ∂L/∂b[l]",
      "Appliquer un planificateur de taux d'apprentissage",
    ],
    stepsAr: [
      "تهيئة الأوزان: He init لـReLU (W ~ N(0, √(2/fan_in)))",
      "لكل حقبة، خلط بيانات التدريب",
      "لكل دُفعة صغيرة من الحجم B:",
      "  التمرير الأمامي: حساب التنشيطات a[1]...a[L] والخسارة L",
      "  التمرير الخلفي: حساب δ[L] ثم الانتشار للخلف",
      "  التحديث: W[l] ← W[l] - α · ∂L/∂W[l]",
      "  التحديث: b[l] ← b[l] - α · ∂L/∂b[l]",
      "تطبيق جدول معدل التعلم",
    ],
  },
  "neural-networks|5": {
    headingFr: "PyTorch : Construction et Entraînement",
    headingAr: "PyTorch: البناء والتدريب",
    codeFr: `import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import TensorDataset, DataLoader

# ── Données d'exemple ──────────────────────────────────────────────────
X_donnees = torch.randn(1000, 128)
y_donnees = torch.randint(0, 2, (1000,)).float()
chargeur_donnees = DataLoader(TensorDataset(X_donnees, y_donnees),
                               batch_size=64, shuffle=True)

class MLP(nn.Module):
    def __init__(self, dim_entree, dims_cachees, dim_sortie, dropout=0.3):
        super().__init__()
        couches = []
        dims = [dim_entree] + dims_cachees
        for i in range(len(dims_cachees)):
            couches += [
                nn.Linear(dims[i], dims[i+1]),
                nn.BatchNorm1d(dims[i+1]),
                nn.ReLU(),
                nn.Dropout(dropout)
            ]
        couches.append(nn.Linear(dims_cachees[-1], dim_sortie))
        self.reseau = nn.Sequential(*couches)

    def forward(self, x):
        return self.reseau(x)

modele = MLP(dim_entree=128, dims_cachees=[256, 128, 64], dim_sortie=1)
optimiseur = optim.AdamW(modele.parameters(), lr=1e-3, weight_decay=1e-4)
planificateur = optim.lr_scheduler.CosineAnnealingLR(optimiseur, T_max=100)

# Étape d'entraînement
for x_lot, y_lot in chargeur_donnees:
    optimiseur.zero_grad()
    logits = modele(x_lot).squeeze()
    perte = nn.BCEWithLogitsLoss()(logits, y_lot.float())
    perte.backward()
    nn.utils.clip_grad_norm_(modele.parameters(), 1.0)
    optimiseur.step()
    planificateur.step()`,
  },
  "neural-networks|6": {
    headingFr: "Pièges Critiques",
    headingAr: "المزالق الحرجة",
    stepsFr: [
      "Neurones ReLU morts : si les poids d'un neurone poussent z < 0 pour toutes les entrées, il ne s'active jamais. Utilisez LeakyReLU ou l'initialisation He correcte.",
      "Gradients explosifs : clip_grad_norm_(modele.parameters(), 1.0) doit toujours être dans votre boucle d'entraînement.",
      "Pas de BatchNorm : le décalage de covariate rend les réseaux profonds instables. Toujours BatchNorm entre les couches linéaires et d'activation.",
      "Taux d'apprentissage : trop élevé → la perte diverge ; trop faible → l'entraînement prend 100× plus longtemps. Utilisez lr_find ou commencez à 1e-3 avec AdamW.",
    ],
    stepsAr: [
      "خلايا ReLU الميتة: إذا كانت أوزان الخلية تدفع z < 0 لجميع المدخلات، فلن تنشط أبداً. استخدم LeakyReLU أو التهيئة الصحيحة لـHe.",
      "الانفجار التدرجي: clip_grad_norm_(model.parameters(), 1.0) يجب أن يكون دائماً في حلقة التدريب.",
      "بدون BatchNorm: يجعل التحول في التباين الشبكات العميقة غير مستقرة. دائماً BatchNorm بين الطبقات الخطية وطبقات التنشيط.",
      "معدل التعلم: مرتفع جداً → تتباعد الخسارة؛ منخفض جداً → يستغرق التدريب وقتاً أطول 100×. استخدم lr_find أو ابدأ بـ1e-3 مع AdamW.",
    ],
  },

  // ── cnn-architectures ────────────────────────────────────────────────────────
  "cnn-architectures|0": {
    headingFr: "Pourquoi la Structure Spatiale Importe",
    headingAr: "لماذا تهم البنية المكانية",
    textFr: "Aplatir une image 224×224 en vecteur perd toutes les relations spatiales — le pixel (0,0) n'a pas de relation spéciale avec (0,1) dans un réseau dense. Les CNN exploitent l'invariance par translation : le filtre qui détecte un bord horizontal fonctionne de la même façon que le bord soit en haut ou en bas de l'image. Ce partage des poids réduit drastiquement les paramètres et donne aux CNN leur biais inductif pour la vision.",
    textAr: "تسطيح صورة 224×224 إلى متجه يفقد جميع العلاقات المكانية — البكسل (0,0) ليس له علاقة خاصة بـ(0,1) في شبكة كثيفة. تستغل CNNs ثبات الترجمة: الفلتر الذي يكتشف حافة أفقية يعمل بنفس الطريقة سواء كانت الحافة في أعلى أو أسفل الصورة. هذا التشارك في الأوزان يقلل المعاملات بشكل جذري ويمنح CNNs تحيزها الاستنتاجي للرؤية.",
  },
  "cnn-architectures|1": {
    headingFr: "Hiérarchie des Caractéristiques : Des Bords aux Objets",
    headingAr: "تسلسل الميزات: من الحواف إلى الأشياء",
    textFr: "Détecteurs couche 1 : bords orientés et blobs de couleur (filtres de type Gabor). Couche 2 : textures construites à partir de combinaisons de bords. Couche 3 : parties d'objets (roues, yeux, fenêtres). Couches finales : objets complets. Cette hiérarchie a été visualisée par Zeiler & Fergus (2013) avec des DeconvNets — on peut littéralement voir ce que chaque couche 'voit'.",
    textAr: "كاشفات الطبقة 1: حواف موجهة وبقع لونية (فلاتر شبيهة بـGabor). الطبقة 2: قوام مبني من تركيبات الحواف. الطبقة 3: أجزاء الأجسام (عجلات، عيون، نوافذ). الطبقات الأخيرة: أجسام كاملة. هذا التسلسل وصّفه Zeiler و Fergus (2013) بـDeconvNets — يمكن رؤية ما 'تراه' كل طبقة بالحرف.",
    calloutFr: "Dans un CNN profond de 3 couches, chaque neurone de sortie a un champ récepteur de (k-1)·3+1 pixels — ex: trois couches 3×3 donnent un champ effectif 7×7, identique à une 7×7 mais avec moins de paramètres et plus de non-linéarités.",
    calloutAr: "في CNN عميق بـ3 طبقات، كل خلية عصبية للمخرج لها حقل استقبال (k-1)·3+1 بكسل — مثال: ثلاث طبقات 3×3 تعطي حقلاً فعالاً 7×7، مطابق لـ7×7 لكن بمعاملات أقل وغير خطيات أكثر.",
  },
  "cnn-architectures|2": {
    headingFr: "L'Opération de Convolution",
    headingAr: "عملية الالتفاف",
    textFr: "Une convolution 2D fait glisser un noyau K×K sur l'entrée en calculant un produit scalaire à chaque position. Avec C_en canaux d'entrée et C_out canaux de sortie, on a C_en × C_out × K² paramètres — bien moins qu'une couche entièrement connectée (H·L·C_en × H·L·C_out paramètres).",
    textAr: "الالتفاف ثنائي الأبعاد يُمرر نواة K×K على المدخل محسوباً الضرب النقطي في كل موضع. مع C_in قنوات إدخال وC_out قنوات إخراج، لدينا C_in × C_out × K² معاملاً — أقل بكثير من طبقة متصلة بالكامل (H·W·C_in × H·W·C_out معاملاً).",
    formulaLabelFr: "Sortie de convolution et nombre de paramètres",
    formulaLabelAr: "مخرج الالتفاف وعدد المعاملات",
  },
  "cnn-architectures|3": {
    headingFr: "ResNet : Résoudre le Problème de Dégradation",
    headingAr: "ResNet: حل مشكلة التدهور",
    textFr: "Ajouter plus de couches à un CNN simple ne devrait jamais nuire (mappage identité). Pourtant, les réseaux très profonds simples s'entraînaient moins bien. He et al. (2015) ont trouvé le coupable : la difficulté d'optimisation, pas le sur-ajustement. Les connexions résiduelles permettent au réseau d'apprendre les résidus F(x) = H(x) - x au lieu de H(x) directement. Si l'identité est le mappage optimal, le réseau pousse F(x) → 0. Cela rend l'entraînement de 100+ couches faisable.",
    textAr: "إضافة المزيد من الطبقات إلى CNN عادي لا يجب أن يضر (تعيين الهوية). لكن الشبكات العميقة جداً تدرّبت بشكل أسوأ. وجد He وآخرون (2015) السبب: صعوبة التحسين لا الإفراط. الاتصالات المتبقية تتيح للشبكة تعلم البواقي F(x) = H(x) - x بدلاً من H(x) مباشرة. إذا كانت الهوية هي التعيين الأمثل، تدفع الشبكة F(x) → 0. هذا يجعل تدريب 100+ طبقة ممكناً.",
    formulaLabelFr: "Bloc résiduel : sortie = résidu appris + raccourci identité",
    formulaLabelAr: "الكتلة المتبقية: المخرج = الباقي المتعلَّم + اختصار الهوية",
  },
  "cnn-architectures|4": {
    headingFr: "Recette d'Entraînement Moderne (ResNet / EfficientNet)",
    headingAr: "وصفة التدريب الحديثة (ResNet / EfficientNet)",
    stepsFr: [
      "Augmentation : RandomHorizontalFlip, RandomCrop, ColorJitter, MixUp/CutMix",
      "Architecture : utiliser des poids pré-entraînés (ImageNet) — toujours mieux que l'initialisation aléatoire",
      "Planning de dégel : geler le backbone, entraîner la tête pendant 5 époques, puis dégeler tout",
      "Taux d'apprentissage : décroissance LR par couche (couches plus profondes = LR × 0.1 par bloc)",
      "Régularisation : Dropout avant le FC final, weight decay 1e-4, label smoothing 0.1",
      "Optimiseur : AdamW + CosineAnnealing avec échauffement",
    ],
    stepsAr: [
      "التوسيع: RandomHorizontalFlip، RandomCrop، ColorJitter، MixUp/CutMix",
      "البنية: استخدام الأوزان المُدرَّبة مسبقاً (ImageNet) — دائماً أفضل من التهيئة العشوائية",
      "جدول إلغاء التجميد: تجميد العمود الفقري، تدريب الرأس لـ5 حقب، ثم إلغاء تجميد الكل",
      "معدل التعلم: تضاؤل LR حسب الطبقة (الطبقات الأعمق = LR × 0.1 لكل كتلة)",
      "التنظيم: Dropout قبل FC الأخير، weight decay 1e-4، label smoothing 0.1",
      "المحسِّن: AdamW + CosineAnnealing مع إحماء",
    ],
  },
  "cnn-architectures|5": {
    headingFr: "Fine-tuning d'EfficientNet pour Classification Personnalisée",
    headingAr: "ضبط EfficientNet للتصنيف المخصص",
    codeFr: `import timm
import torch.nn as nn
import torch.optim as optim

# ── Configuration ──────────────────────────────────────────────────────
nb_classes = 10   # ex. jeu de données 10 classes

# Charger EfficientNet-B4 pré-entraîné
modele = timm.create_model(
    'efficientnet_b4',
    pretrained=True,
    num_classes=0         # Supprimer la tête de classification
)

# Geler le backbone initialement
for param in modele.parameters():
    param.requires_grad = False

# Tête personnalisée
classificateur = nn.Sequential(
    nn.AdaptiveAvgPool2d(1),
    nn.Flatten(),
    nn.BatchNorm1d(modele.num_features),
    nn.Dropout(0.4),
    nn.Linear(modele.num_features, nb_classes)
)

# Étape 1 : entraîner seulement la tête (LR élevé)
optimiseur = optim.AdamW(classificateur.parameters(), lr=1e-3)
# ... entraîner pendant 5 époques

# Étape 2 : dégeler + affiner tout (LR faible)
for param in modele.parameters():
    param.requires_grad = True
optimiseur = optim.AdamW([
    {'params': modele.parameters(), 'lr': 1e-5},
    {'params': classificateur.parameters(), 'lr': 1e-4}
])`,
  },

  // ── rnn-lstm-gru ─────────────────────────────────────────────────────────────
  "rnn-lstm-gru|0": {
    headingFr: "Pourquoi les Séquences Sont Difficiles",
    headingAr: "لماذا التسلسلات صعبة",
    textFr: "Le langage, les séries temporelles, l'audio, l'ADN — tous ont des dépendances temporelles. 'Il a dit qu'il viendrait' — 'il' et 'viendrait' sont séparés de 5 mots mais étroitement liés. Un réseau de propagation vers l'avant traite chaque pas de temps indépendamment. Les RNN partagent les paramètres à travers le temps et maintiennent un état caché qui résume les entrées passées — permettant un contexte illimité. Le défi : rendre cette mémoire sélective et à longue portée.",
    textAr: "اللغة، السلاسل الزمنية، الصوت، الحمض النووي — كل هذه لها تبعيات زمنية. 'قال إنه سيأتي' — 'هو' و'سيأتي' مفصولان بـ5 كلمات لكنهما مرتبطان ارتباطاً وثيقاً. الشبكة الأمامية تعالج كل خطوة زمنية بشكل مستقل. تتشارك RNNs المعاملات عبر الزمن وتحافظ على حالة خفية تلخص المدخلات السابقة — مما يتيح سياقاً غير محدود.",
  },
  "rnn-lstm-gru|1": {
    headingFr: "Le Gradient Évanescent dans le Temps",
    headingAr: "اختفاء التدرج عبر الزمن",
    textFr: "Dans BPTT (Backpropagation Through Time), les gradients sont multipliés par la matrice de poids W à chaque pas de temps. Si la plus grande valeur propre de W est < 1, les gradients s'évanouissent exponentiellement. Pour une séquence de 100 pas de temps, un gradient du pas 1 est multiplié par W¹⁰⁰. Les LSTM résolvent cela avec l'état cellulaire — une 'autoroute' qui transporte l'information avec uniquement des mises à jour additives (non multiplicatives).",
    textAr: "في BPTT (الانتشار الخلفي عبر الزمن)، تُضرب التدرجات بمصفوفة الأوزان W في كل خطوة زمنية. إذا كانت أكبر قيمة ذاتية لـW < 1، تتناقص التدرجات أسياً. لتسلسل من 100 خطوة، يُضرب التدرج من الخطوة 1 بـW¹⁰⁰. تحل LSTMs هذا بالحالة الخلوية — 'طريق سريع' يحمل المعلومات بتحديثات جمعية فقط (لا ضربية).",
    calloutFr: "Les gradients LSTM circulent à travers c_t = f_t ⊙ c_{t-1} + i_t ⊙ c̃_t. La porte d'oubli f_t empêche les gradients de c de s'évanouir — ce sont des additions conditionnées, pas des multiplications matricielles.",
    calloutAr: "تتدفق تدرجات LSTM عبر c_t = f_t ⊙ c_{t-1} + i_t ⊙ c̃_t. بوابة النسيان f_t تمنع تدرجات c من الاختفاء — إنها جمعيات مشروطة، لا ضروب مصفوفية.",
  },
  "rnn-lstm-gru|2": {
    headingFr: "Équations des Portes LSTM",
    headingAr: "معادلات بوابات LSTM",
    textFr: "Quatre calculs de portes déterminent ce qu'il faut oublier, apprendre et produire à chaque étape. Toutes les portes utilisent sigmoid (sortie 0-1 = 'combien laisser passer'). L'état cellulaire candidat utilise tanh (sortie -1 à 1 = contenu réel).",
    textAr: "أربعة حسابات للبوابات تحدد ما يجب نسيانه وتعلمه وإنتاجه في كل خطوة. جميع البوابات تستخدم sigmoid (مخرج 0-1 = 'كم تسمح بالمرور'). حالة الخلية المرشحة تستخدم tanh (مخرج -1 إلى 1 = المحتوى الفعلي).",
    formulaLabelFr: "LSTM : portes Oubli (f), Entrée (i), Candidat cellulaire (c̃), Sortie (o)",
    formulaLabelAr: "LSTM: بوابات النسيان (f)، الإدخال (i)، المرشح الخلوي (c̃)، الإخراج (o)",
  },
  "rnn-lstm-gru|3": {
    headingFr: "LSTM pour la Prévision de Séries Temporelles",
    headingAr: "LSTM لتوقع السلاسل الزمنية",
    codeFr: `import torch
import torch.nn as nn
from torch.utils.data import TensorDataset, DataLoader

# ── Données séquentielles d'exemple ────────────────────────────────────
# Forme : (n_échantillons, longueur_seq, caractéristiques)
X_seq = torch.randn(500, 20, 10)
y_seq = torch.randn(500)
chargeur_donnees = DataLoader(TensorDataset(X_seq, y_seq),
                               batch_size=32, shuffle=True)

class PrevisionLSTM(nn.Module):
    def __init__(self, dim_entree, dim_cachee, nb_couches, dim_sortie, dropout=0.2):
        super().__init__()
        self.lstm = nn.LSTM(
            dim_entree, dim_cachee, nb_couches,
            batch_first=True, dropout=dropout,
            bidirectional=False
        )
        self.fc = nn.Linear(dim_cachee, dim_sortie)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x, h0=None, c0=None):
        # x : (lot, longueur_seq, caracteristiques)
        sortie, (hn, cn) = self.lstm(x, (h0, c0) if h0 is not None else None)
        # Utiliser la sortie du dernier pas de temps
        return self.fc(self.dropout(sortie[:, -1, :]))

# Entraînement avec teacher forcing + scheduled sampling
modele = PrevisionLSTM(dim_entree=10, dim_cachee=128, nb_couches=2, dim_sortie=1)
optimiseur = torch.optim.Adam(modele.parameters(), lr=1e-3)

# L'écrêtage des gradients est ESSENTIEL pour l'entraînement RNN
for x, y in chargeur_donnees:
    pred = modele(x)
    perte = nn.MSELoss()(pred.squeeze(), y)
    optimiseur.zero_grad()
    perte.backward()
    nn.utils.clip_grad_norm_(modele.parameters(), max_norm=1.0)
    optimiseur.step()`,
  },

};

export const keyFormulaI18n_neural: Record<string, KeyFormulaI18n> = {

  // ── neural-networks ──────────────────────────────────────────────────────────
  "neural-networks|0": {
    nameFr: "Passage Avant",           nameAr: "المرور الأمامي",
    meaningFr: "Transformation linéaire à la couche l — z = Wa + b",
    meaningAr: "التحويل الخطي في الطبقة l — z = Wa + b",
  },
  "neural-networks|1": {
    nameFr: "Activation",              nameAr: "التنشيط",
    meaningFr: "Activation non linéaire appliquée élément par élément — donne au réseau son pouvoir expressif",
    meaningAr: "تنشيط غير خطي مُطبَّق عنصراً بعنصر — يمنح الشبكة قدرتها التعبيرية",
  },
  "neural-networks|2": {
    nameFr: "Delta de Rétropropagation", nameAr: "دلتا الانتشار الخلفي",
    meaningFr: "Signal d'erreur propagé en arrière à travers la couche l — produit de Hadamard avec la dérivée de l'activation",
    meaningAr: "إشارة الخطأ المنتشرة للخلف عبر الطبقة l — ضرب هادامار مع مشتقة التنشيط",
  },
  "neural-networks|3": {
    nameFr: "Gradient du Poids",       nameAr: "تدرج الوزن",
    meaningFr: "Gradient de la perte par rapport aux poids de la couche l — utilisé pour la mise à jour SGD/Adam",
    meaningAr: "تدرج الخسارة بالنسبة لأوزان الطبقة l — يُستخدم لتحديث SGD/Adam",
  },

  // ── cnn-architectures ────────────────────────────────────────────────────────
  "cnn-architectures|0": {
    nameFr: "Convolution",             nameAr: "الالتفاف",
    meaningFr: "Glisser un noyau K sur l'entrée I, calculant des produits scalaires — détecte des motifs locaux",
    meaningAr: "تمرير نواة K على المدخل I بحساب الضرب النقطي — تكتشف الأنماط المحلية",
  },
  "cnn-architectures|1": {
    nameFr: "Taille de Sortie",        nameAr: "حجم الخرج",
    meaningFr: "H=hauteur, k=taille du noyau, p=rembourrage, s=foulée — détermine la résolution spatiale de sortie",
    meaningAr: "H=الارتفاع، k=حجم النواة، p=الحشو، s=الخطوة — يحدد الدقة المكانية للخرج",
  },
  "cnn-architectures|2": {
    nameFr: "Connexion Sautée ResNet", nameAr: "الاتصال القافز ResNet",
    meaningFr: "Connexion résiduelle : ajoute l'entrée directement à la sortie — résout le gradient évanescent en profondeur",
    meaningAr: "الاتصال المتبقي: يُضيف المدخل مباشرةً للخرج — يحل مشكلة التدرج المتلاشي في العمق",
  },

  // ── rnn-lstm-gru ─────────────────────────────────────────────────────────────
  "rnn-lstm-gru|0": {
    nameFr: "État Caché RNN",          nameAr: "الحالة الخفية RNN",
    meaningFr: "Combine la mémoire précédente avec l'entrée actuelle — souffre de l'oubli catastrophique sur de longues séquences",
    meaningAr: "يجمع الذاكرة السابقة مع المدخل الحالي — يعاني من النسيان الكارثي في التسلسلات الطويلة",
  },
  "rnn-lstm-gru|1": {
    nameFr: "État de Cellule LSTM",    nameAr: "حالة خلية LSTM",
    meaningFr: "État de cellule mis à jour par la porte d'oubli et la porte d'entrée — la 'autoroute à gradient'",
    meaningAr: "حالة الخلية مُحدَّثة بوابة النسيان ووابة الإدخال — 'الطريق السريع للتدرج'",
  },
  "rnn-lstm-gru|2": {
    nameFr: "Sortie LSTM",             nameAr: "خرج LSTM",
    meaningFr: "La porte de sortie contrôle ce qui est exposé depuis l'état de cellule — sélection sélective de mémoire",
    meaningAr: "تتحكم وابة الخرج في ما يُكشَف من حالة الخلية — اختيار انتقائي للذاكرة",
  },
  "rnn-lstm-gru|3": {
    nameFr: "Mise à Jour GRU",         nameAr: "تحديث GRU",
    meaningFr: "Une seule porte de mise à jour interpole l'ancien et le nouvel état caché — plus simple que LSTM, souvent aussi bon",
    meaningAr: "بوابة تحديث وحيدة تُقحِّم الحالة الخفية القديمة والجديدة — أبسط من LSTM، غالباً بنفس الجودة",
  },

};

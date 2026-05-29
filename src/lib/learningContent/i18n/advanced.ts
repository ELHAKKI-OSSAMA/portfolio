import type { SectionI18n, KeyFormulaI18n } from '../types';

export const sectionI18n_advanced: Record<string, SectionI18n> = {

  // ── transformers-attention ───────────────────────────────────────────────────
  "transformers-attention|0": {
    headingFr: "Le Problème des RNN que les Transformers ont Résolu",
    headingAr: "المشكلة في الشبكات التكررية التي حلّها المحوّل",
    textFr: "Les RNN traitent les séquences jeton par jeton — pour comprendre la relation entre le mot 1 et le mot 500, l'information doit traverser 499 états intermédiaires, chacun pouvant la corrompre (gradient évanescent). Les Transformers résolvent cela en permettant à n'importe quelle position d'assister directement à n'importe quelle autre en une seule étape. Ce chemin direct, combiné au calcul parallèle, explique pourquoi les Transformers ont remplacé les RNN pour presque tout.",
    textAr: "تعالج RNNs التسلسلات رمزاً بعد رمز — لفهم العلاقة بين الكلمة 1 والكلمة 500، يجب أن تتدفق المعلومات عبر 499 حالة وسيطة. تحل المحولات هذا بالسماح لأي موضع بالانتباه مباشرةً لأي موضع آخر في خطوة واحدة. هذا المسار المباشر مع الحساب المتوازي هو سبب استبدال RNNs بالمحولات في كل شيء تقريباً.",
  },
  "transformers-attention|1": {
    headingFr: "L'Attention comme Requête Douce de Base de Données",
    headingAr: "الانتباه كاستعلام ناعم لقاعدة البيانات",
    textFr: "Pensez à l'attention comme un magasin clé-valeur différentiable. Vous avez une Requête (ce que vous cherchez), des Clés (descripteurs de chaque mémoire) et des Valeurs (le contenu réel). L'attention calcule la similarité entre la Requête et toutes les Clés, applique softmax pour obtenir une distribution de probabilité, puis renvoie une somme pondérée des Valeurs. Le mot 'banque' dans 'bord de rivière' assistera fortement à 'rivière' et récupérera sa représentation contextuelle.",
    textAr: "فكر في الانتباه كمخزن قيمة-مفتاح قابل للتفاضل. لديك استعلام (ما تبحث عنه)، مفاتيح (واصفات كل ذاكرة)، وقيم (المحتوى الفعلي). يحسب الانتباه التشابه بين الاستعلام وجميع المفاتيح، يُطبّق softmax، ثم يُعيد مجموعاً موزوناً للقيم.",
    calloutFr: "La mise à l'échelle par √d_k empêche les produits scalaires de devenir grands (ce qui rendrait le softmax extrêmement pointu, tuant le flux de gradient à travers la distribution).",
    calloutAr: "التحجيم بـ√d_k يمنع الضروب النقطية من الكبر (مما يجعل softmax حاداً جداً، مما يقتل تدفق التدرج عبر التوزيع).",
  },
  "transformers-attention|2": {
    headingFr: "Attention Multi-Têtes : Pourquoi Plusieurs Têtes ?",
    headingAr: "الانتباه متعدد الرؤوس: لماذا رؤوس متعددة؟",
    textFr: "Une seule tête d'attention ne peut assister que selon un critère (ex: accord syntaxique sujet-verbe). Les têtes multiples apprennent différents schémas d'attention simultanément : tête 1 syntaxe, tête 2 sémantique, tête 3 coréférence. Chaque tête projette Q, K, V dans un sous-espace de plus faible dimension, calcule l'attention, puis toutes les têtes sont concaténées et projetées en retour.",
    textAr: "رأس انتباه واحد يمكنه الانتباه وفق معيار واحد فقط (مثل التوافق النحوي). الرؤوس المتعددة تتعلم أنماط انتباه مختلفة في آنٍ واحد: الرأس 1 للنحو، الرأس 2 للدلالة، الرأس 3 للإحالة. كل رأس يُسقط Q وK وV إلى فضاء فرعي أقل بُعداً.",
    formulaLabelFr: "Chaque tête utilise ses propres matrices de projection apprises",
    formulaLabelAr: "كل رأس يستخدم مصفوفات إسقاطه المتعلَّمة الخاصة",
  },
  "transformers-attention|3": {
    headingFr: "BERT vs GPT : Encodeur vs Décodeur",
    headingAr: "BERT مقابل GPT: المشفر مقابل المفكك",
    textFr: "BERT utilise une attention bidirectionnelle — chaque jeton assiste à tous les autres. Idéal pour la compréhension (classification, NER, QA) mais ne peut pas générer du texte de gauche à droite. GPT utilise une attention masquée (causale) — chaque jeton n'assiste qu'aux jetons précédents. Cela permet la génération autoregresssive. Le masque est une matrice triangulaire inférieure de valeurs -inf ajoutées avant softmax.",
    textAr: "BERT يستخدم انتباهاً ثنائي الاتجاه — كل رمز ينتبه لجميع الرموز الأخرى. مثالي للفهم (التصنيف، NER) لكن لا يستطيع توليد النص من اليسار لليمين. GPT يستخدم انتباهاً مقنعاً (سببياً) — كل رمز ينتبه للرموز السابقة فقط. يُتيح التوليد الذاتي التراجعي.",
    formulaLabelFr: "Masque causal (empêche d'assister aux jetons futurs)",
    formulaLabelAr: "القناع السببي (يمنع الانتباه للرموز المستقبلية)",
  },
  "transformers-attention|4": {
    headingFr: "Bloc Encodeur du Transformer",
    headingAr: "كتلة مشفر المحوّل",
    stepsFr: [
      "Embeddings d'entrée E = embed_jeton + encodage_positionnel",
      "Auto-Attention Multi-Têtes : Q=EW_Q, K=EW_K, V=EW_V",
      "Attention(Q,K,V) = softmax(QKᵀ/√d_k)V",
      "Ajouter & Normaliser : x₁ = NormCouche(E + Attention(E))",
      "Réseau de propagation avant : FFN(x₁) = ReLU(x₁W₁ + b₁)W₂ + b₂",
      "Ajouter & Normaliser : x₂ = NormCouche(x₁ + FFN(x₁))",
      "Répéter pour L couches",
    ],
    stepsAr: [
      "تضمينات الإدخال E = تضمين_رمز + ترميز_موضعي",
      "الانتباه الذاتي متعدد الرؤوس: Q=EW_Q، K=EW_K، V=EW_V",
      "Attention(Q,K,V) = softmax(QKᵀ/√d_k)V",
      "إضافة وتطبيع: x₁ = NormLayer(E + Attention(E))",
      "شبكة التغذية الأمامية: FFN(x₁) = ReLU(x₁W₁ + b₁)W₂ + b₂",
      "إضافة وتطبيع: x₂ = NormLayer(x₁ + FFN(x₁))",
      "تكرار لـL طبقة",
    ],
  },
  "transformers-attention|5": {
    headingFr: "Attention Produit Scalaire Mis à l'Échelle de Zéro",
    headingAr: "انتباه الضرب النقطي المعياري من الصفر",
    codeFr: `import torch
import torch.nn.functional as F
import math

def attention_produit_scalaire(Q, K, V, masque=None):
    """
    Q, K, V : (lot, tetes, longueur_seq, d_k)
    """
    d_k = Q.shape[-1]
    # Scores d'attention
    scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)
    # Masque causal (style GPT)
    if masque is not None:
        scores = scores.masked_fill(masque == 0, float('-inf'))
    # Softmax sur la dimension des clés
    poids_attn = F.softmax(scores, dim=-1)
    # Somme pondérée des valeurs
    return torch.matmul(poids_attn, V), poids_attn

class AttentionMultiTetes(torch.nn.Module):
    def __init__(self, d_modele, n_tetes):
        super().__init__()
        self.d_k = d_modele // n_tetes
        self.n_tetes = n_tetes
        self.W_q = torch.nn.Linear(d_modele, d_modele)
        self.W_k = torch.nn.Linear(d_modele, d_modele)
        self.W_v = torch.nn.Linear(d_modele, d_modele)
        self.W_o = torch.nn.Linear(d_modele, d_modele)

    def forward(self, Q, K, V, masque=None):
        B, T, D = Q.shape
        # Projeter + diviser en têtes
        Q = self.W_q(Q).view(B, T, self.n_tetes, self.d_k).transpose(1, 2)
        K = self.W_k(K).view(B, T, self.n_tetes, self.d_k).transpose(1, 2)
        V = self.W_v(V).view(B, T, self.n_tetes, self.d_k).transpose(1, 2)
        x, poids = attention_produit_scalaire(Q, K, V, masque)
        # Concaténer les têtes + projeter
        x = x.transpose(1, 2).contiguous().view(B, T, D)
        return self.W_o(x), poids`,
  },

  // ── generative-models ────────────────────────────────────────────────────────
  "generative-models|0": {
    headingFr: "De la Discrimination à la Génération",
    headingAr: "من التصنيف إلى التوليد",
    textFr: "Tous les modèles précédents sont discriminatifs : P(y|x). Les modèles génératifs apprennent P(x) — la distribution complète des données. Une fois la distribution apprise, vous pouvez échantillonner de nouveaux points, interpoler entre exemples, détecter des anomalies et faire de la génération conditionnelle. C'est ainsi que fonctionnent Stable Diffusion, GPT et DALL-E en leur cœur.",
    textAr: "جميع النماذج السابقة تمييزية: P(y|x). النماذج التوليدية تتعلم P(x) — التوزيع الكامل للبيانات. بمجرد تعلم التوزيع، يمكنك أخذ عينات من نقاط جديدة، والاستيفاء بين الأمثلة، وكشف الشذوذات. هكذا يعمل Stable Diffusion وGPT وDALL-E في جوهرها.",
  },
  "generative-models|1": {
    headingFr: "VAE : La Compression Probabiliste",
    headingAr: "VAE: الضغط الاحتمالي",
    textFr: "Les autoencodeurs compriment les données en un code latent puis reconstruisent. Mais l'espace latent est déconnecté — les images similaires ne sont pas proches. Les VAE corrigent cela en encodant des distributions (μ, σ) au lieu de points, et en pénalisant la déviation de N(0,I) via la divergence KL. Cela force un espace latent lisse et continu où l'interpolation et l'échantillonnage ont un sens sémantique.",
    textAr: "تضغط المشفرات التلقائية البيانات إلى رمز كامن ثم تعيد بناءها. لكن الفضاء الكامن منفصل — الصور المتشابهة ليست قريبة من بعضها. تُصلح VAEs هذا بترميز التوزيعات (μ، σ) بدلاً من النقاط، وتعاقب الانحراف عن N(0,I) عبر تباين KL. هذا يُجبر على فضاء كامن سلس ومستمر.",
    calloutFr: "L'astuce de reparamétrisation z = μ + σ⊙ε est l'idée clé qui rend l'entraînement VAE possible. Sans elle, l'échantillonnage est une opération non différentiable — aucun gradient ne peut circuler.",
    calloutAr: "خدعة إعادة التحديد z = μ + σ⊙ε هي الفكرة الأساسية التي تجعل تدريب VAE ممكناً. بدونها، أخذ العينات عملية غير قابلة للتفاضل — لا يمكن تدفق أي تدرجات.",
  },
  "generative-models|2": {
    headingFr: "L'ELBO : Borne Inférieure de l'Évidence",
    headingAr: "ELBO: الحد الأدنى لأدلة البيانات",
    textFr: "Nous voulons maximiser log p(x). C'est intraitable directement. À la place, nous maximisons l'ELBO : qualité de reconstruction (comment bien nous décodons) moins divergence KL du prior (combien l'encodeur s'écarte du gaussien standard). β-VAE ajoute un poids β au terme KL pour des représentations disentangled.",
    textAr: "نريد تعظيم log p(x). هذا غير قابل للحساب مباشرةً. بدلاً من ذلك، نُعظّم ELBO: جودة إعادة البناء (كم نُفكك جيداً) ناقص تباين KL من التوزيع المسبق. تُضيف β-VAE وزناً β لمصطلح KL للتمثيلات المفككة.",
    formulaLabelFr: "ELBO — l'objectif maximisé dans l'entraînement VAE",
    formulaLabelAr: "ELBO — الهدف المُعظَّم في تدريب VAE",
  },
  "generative-models|3": {
    headingFr: "Entraînement GAN : Le Jeu Adversarial",
    headingAr: "تدريب GAN: اللعبة العدائية",
    textFr: "Le générateur G prend du bruit z ~ N(0,I) et produit de faux échantillons G(z). Le discriminateur D essaie de distinguer les vrais échantillons des faux. Ils jouent un jeu minimax : D maximise log D(réel) + log(1 - D(G(z))) ; G minimise log(1 - D(G(z))). À l'équilibre de Nash, G produit des échantillons indiscernables des données réelles.",
    textAr: "المولد G يأخذ ضوضاء z ~ N(0,I) ويُنتج عينات مزيفة G(z). المميّز D يحاول التمييز بين العينات الحقيقية والمزيفة. يلعبان لعبة minimax: D يُعظّم log D(حقيقي) + log(1 - D(G(z)))؛ G يُصغّر log(1 - D(G(z))). عند توازن Nash، يُنتج G عينات لا تُميَّز عن البيانات الحقيقية.",
    calloutFr: "Effondrement de mode : le générateur trouve un seul point qui trompe toujours le discriminateur. Remède : Wasserstein GAN (WGAN-GP) avec pénalité de gradient, normalisation spectrale, ou minibatch discrimination.",
    calloutAr: "انهيار الأنماط: يجد المولد نقطة واحدة (أو قليلاً) تخدع المميّز دائماً. الحل: Wasserstein GAN (WGAN-GP) مع غرامة التدرج، أو التطبيع الطيفي.",
  },
  "generative-models|4": {
    headingFr: "Implémentation DCGAN",
    headingAr: "تنفيذ DCGAN",
    codeFr: `import torch
import torch.nn as nn

class Generateur(nn.Module):
    def __init__(self, dim_latente=100, canaux_img=3):
        super().__init__()
        self.reseau = nn.Sequential(
            # Projeter et remodeler le bruit
            nn.Linear(dim_latente, 512 * 4 * 4),
            nn.Unflatten(1, (512, 4, 4)),
            # Blocs de suréchantillonnage
            *self._bloc(512, 256), *self._bloc(256, 128),
            *self._bloc(128, 64),  *self._bloc(64, 32),
            nn.ConvTranspose2d(32, canaux_img, 4, 2, 1),
            nn.Tanh()
        )
    def _bloc(self, entree_c, sortie_c):
        return [nn.ConvTranspose2d(entree_c, sortie_c, 4, 2, 1, bias=False),
                nn.BatchNorm2d(sortie_c), nn.ReLU(True)]
    def forward(self, z): return self.reseau(z)

# Entraînement WGAN-GP (plus stable que GAN vanilla)
def penalite_gradient(D, reel, faux, device):
    alpha = torch.rand(reel.size(0), 1, 1, 1).to(device)
    interpole = alpha * reel + (1 - alpha) * faux
    interpole.requires_grad_(True)
    d_interp = D(interpole)
    gradients = torch.autograd.grad(d_interp, interpole,
                grad_outputs=torch.ones_like(d_interp),
                create_graph=True)[0]
    return ((gradients.norm(2, dim=1) - 1) ** 2).mean()`,
  },

  // ── bagging-stacking ─────────────────────────────────────────────────────────
  "bagging-stacking|0": {
    headingFr: "Pourquoi les Ensembles Gagnent Kaggle",
    headingAr: "لماذا تفوز المجموعات في Kaggle",
    textFr: "La meilleure solution de presque chaque compétition Kaggle utilise l'ensemblage. Les modèles individuels ont des erreurs irréductibles — certains échantillons sont difficiles pour les modèles arborescents, d'autres pour les réseaux de neurones. En combinant des prédictions de modèles divers, les erreurs s'annulent. Le résultat bat systématiquement tout modèle individuel — souvent de 1-3% d'AUC.",
    textAr: "تستخدم أفضل حل في كل مسابقة Kaggle تقريباً المجموعات. النماذج الفردية لها أخطاء لا يمكن تقليلها — بعض العينات صعبة على نماذج الأشجار، وأخرى على الشبكات العصبية. بدمج تنبؤات النماذج المتنوعة، تتلاشى الأخطاء. النتيجة تتفوق باستمرار على أي نموذج منفرد.",
  },
  "bagging-stacking|1": {
    headingFr: "Les Trois Paradigmes d'Ensemble",
    headingAr: "نماذج المجموعة الثلاثة",
    textFr: "Bagging (Bootstrap AGGregating) : entraîner K modèles sur K sous-ensembles aléatoires → moyenne/vote. Réduit la variance. La forêt aléatoire est du bagging. Boosting : entraîner K modèles séquentiellement, chacun corrigeant les erreurs du précédent → combinaison pondérée. Réduit le biais. XGBoost est du boosting. Stacking : entraîner K modèles de base divers, utiliser leurs prédictions comme caractéristiques pour un méta-apprenant.",
    textAr: "Bagging (التجميع بالتشغيل التمهيدي): تدريب K نموذج على K مجموعة فرعية عشوائية → متوسط/تصويت. يقلل التباين. الغابة العشوائية هي bagging. Boosting: تدريب K نموذج بشكل تسلسلي، كل منها يُصلح أخطاء السابق → تركيبة موزونة. يقلل التحيز. XGBoost هو boosting. Stacking: تدريب K نموذج أساسي متنوع، واستخدام تنبؤاتها كميزات لمتعلم فوقي.",
    calloutFr: "Idée clé : les ensembles fonctionnent parce que les modèles sont divers. Un ensemble bagging de modèles identiques a exactement les mêmes performances qu'un seul modèle. Diversité = décorrélation = réduction de variance.",
    calloutAr: "الفكرة الأساسية: المجموعات تعمل لأن النماذج متنوعة. مجموعة bagging من نماذج متطابقة لها نفس أداء نموذج واحد بالضبط. التنوع = عدم الترابط = تخفيض التباين.",
  },
  "bagging-stacking|2": {
    headingFr: "Empilement avec Prédictions Hors-Pli",
    headingAr: "التكديس بالتنبؤات الخارجية",
    stepsFr: [
      "Définir K modèles de base divers (LightGBM, XGBoost, CatBoost, réseau de neurones, etc.)",
      "Pour chaque modèle de base, exécuter une validation croisée 5-plis",
      "Collecter les prédictions hors-pli (OOF) — forme une colonne dans la matrice de méta-caractéristiques",
      "Empiler K colonnes pour former la matrice de méta-caractéristiques Ñ ∈ ℝ^{n×K}",
      "Entraîner le méta-apprenant (Régression Logistique ou LightGBM) sur Ñ avec la cible y",
      "Pour le test : moyenner les prédictions des modèles de base sur les plis, alimenter le méta-apprenant",
    ],
    stepsAr: [
      "تعريف K نموذج أساسي متنوع (LightGBM، XGBoost، CatBoost، شبكة عصبية، إلخ)",
      "لكل نموذج أساسي، تشغيل التحقق المتقاطع بـ5 أضعاف",
      "جمع التنبؤات خارج الضعف (OOF) — تُشكل عموداً في مصفوفة الميزات الفوقية",
      "تكديس K عمود لتشكيل مصفوفة الميزات الفوقية Ñ ∈ ℝ^{n×K}",
      "تدريب المتعلم الفوقي (الانحدار اللوجستي أو LightGBM) على Ñ مع الهدف y",
      "للاختبار: متوسط تنبؤات النماذج الأساسية عبر الأضعاف، إطعام المتعلم الفوقي",
    ],
  },
  "bagging-stacking|3": {
    headingFr: "Implémentation de l'Empilement en Production",
    headingAr: "تنفيذ التكديس في الإنتاج",
    codeFr: `import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import roc_auc_score

def empilement_oof(modeles, X_entr, y_entr, X_test, n_plis=5):
    """Renvoie les prédictions OOF + prédictions test pour tous les modèles."""
    skf = StratifiedKFold(n_splits=n_plis, shuffle=True, random_state=42)
    preds_oof  = np.zeros((len(X_entr), len(modeles)))
    preds_test = np.zeros((len(X_test), len(modeles)))

    for idx_m, modele in enumerate(modeles):
        preds_test_plis = np.zeros((len(X_test), n_plis))
        for idx_p, (tr, val) in enumerate(skf.split(X_entr, y_entr)):
            modele.fit(X_entr[tr], y_entr[tr])
            preds_oof[val, idx_m] = modele.predict_proba(X_entr[val])[:,1]
            preds_test_plis[:, idx_p] = modele.predict_proba(X_test)[:,1]
        preds_test[:, idx_m] = preds_test_plis.mean(axis=1)
        print(f"Modèle {idx_m} AUC OOF: {roc_auc_score(y_entr, preds_oof[:,idx_m]):.4f}")

    # Méta-apprenant sur les prédictions OOF
    meta = LogisticRegression(C=0.1)
    meta.fit(preds_oof, y_entr)
    preds_finales = meta.predict_proba(preds_test)[:,1]
    return preds_finales, meta.coef_`,
  },

  // ── ova-ovo ──────────────────────────────────────────────────────────────────
  "ova-ovo|0": {
    headingFr: "Le Problème Multi-Classes",
    headingAr: "مشكلة التصنيف المتعدد",
    textFr: "De nombreux problèmes réels ont plus de 2 classes : reconnaissance de chiffres (10 classes), classification d'espèces (centaines), catégorisation de produits (milliers). Certains algorithmes (régression logistique, SVM) sont intrinsèquement binaires. Deux stratégies les étendent : OvA entraîne K classificateurs, chacun séparant la classe k de toutes les autres. OvO entraîne K(K-1)/2 classificateurs pour chaque paire. Les réseaux de neurones avec Softmax résolvent le multi-classes nativement.",
    textAr: "كثير من المشاكل الحقيقية لها أكثر من فئتين: التعرف على الأرقام (10 فئات)، تصنيف الأنواع (مئات)، تصنيف المنتجات (آلاف). بعض الخوارزميات (الانحدار اللوجستي، SVMs) ثنائية بطبعها. استراتيجيتان تمتدانهما: OvA تُدرب K مصنِّفاً، كل منها يفصل الفئة k عن الباقي. OvO تُدرب K(K-1)/2 مصنِّفاً لكل زوج.",
  },
  "ova-ovo|1": {
    headingFr: "OvA vs OvO vs Softmax",
    headingAr: "واحد مقابل الكل، واحد مقابل واحد، وSoftmax",
    stepsFr: [
      "OvA : K classificateurs, chacun utilise toutes les données. Entraînement rapide. Déséquilibré (1 positif vs K-1 négatifs). Bon pour K grand.",
      "OvO : K(K-1)/2 classificateurs, chacun utilisant seulement 2 classes. Équilibré mais lent pour K grand (100 classes = 4950 classificateurs).",
      "Softmax (LR multinomiale) : modèle unique, K sorties, entraîné avec entropie croisée. Le plus efficace. Natif aux réseaux de neurones.",
      "Convention SVM : OvO est le défaut dans sklearn (historiquement légèrement meilleur). Pour les réseaux de neurones, toujours Softmax.",
    ],
    stepsAr: [
      "OvA: K مصنِّفاً، كل منها يستخدم جميع البيانات. تدريب سريع. غير متوازن (إيجابي واحد مقابل K-1 سلبية). جيد لـK الكبير.",
      "OvO: K(K-1)/2 مصنِّفاً، كل منها يستخدم فئتين فقط. متوازن لكن بطيء لـK الكبير (100 فئة = 4950 مصنِّفاً).",
      "Softmax (LR متعدد الحدود): نموذج واحد، K مخرجاً، مُدرَّب بإنتروبيا تقاطعية. الأكثر كفاءة. أصيل لشبكات الخلايا العصبية.",
      "اصطلاح SVM: OvO هو الافتراضي في sklearn (تاريخياً أداؤه أفضل قليلاً). لشبكات الخلايا العصبية، دائماً Softmax.",
    ],
  },
  "ova-ovo|2": {
    headingFr: "Classification Multi-classes avec Softmax",
    headingAr: "التصنيف متعدد الفئات بـSoftmax",
    codeFr: `import torch
import torch.nn as nn
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.multiclass import OneVsRestClassifier, OneVsOneClassifier
from sklearn.svm import SVC

# ── Données d'exemple ──────────────────────────────────────────────────
X_np, y_np = make_classification(n_samples=300, n_features=8,
                                   n_classes=3, n_informative=6, random_state=42)
X_train_np, X_test_np, y_train_np, _ = train_test_split(
    X_np, y_np, test_size=0.2, random_state=42)

# ── Multiclasse PyTorch ────────────────────────────────────────────────
K = 3; lot = 16

class ReseauSimple(nn.Module):
    def __init__(self): super().__init__(); self.fc = nn.Linear(8, K)
    def forward(self, x): return self.fc(x)

modele = ReseauSimple()
x = torch.randn(lot, 8)
y = torch.randint(0, K, (lot,))
poids_classes = torch.tensor([1.0, 2.0, 1.5])   # pondérer les classes rares

# Softmax + Entropie Croisée (combinées pour la stabilité numérique)
critere = nn.CrossEntropyLoss(
    weight=poids_classes,    # Pour les classes déséquilibrées
    label_smoothing=0.1      # Évite les prédictions trop confiantes
)

# Le modèle produit des logits bruts (pas de softmax dans forward)
logits = modele(x)            # Forme : (lot, K)
perte = critere(logits, y)   # y contient les indices de classe
print(f"Perte CE multi-classes : {perte.item():.4f}")

# Prédictions
probs = torch.softmax(logits, dim=-1)
preds = probs.argmax(dim=-1)

# Sklearn : stratégie OvR (OvA)
ovr = OneVsRestClassifier(SVC(kernel='rbf', probability=True))
ovo = OneVsOneClassifier(SVC(kernel='rbf'))
ovr.fit(X_train_np, y_train_np)
print(f"Précision OvR : {ovr.score(X_test_np, _):.3f}")`,
  },

  // ── dl-optimization ──────────────────────────────────────────────────────────
  "dl-optimization|0": {
    headingFr: "Un Bon Modèle avec une Mauvaise Optimisation Ne Vaut Rien",
    headingAr: "نموذج جيد مع تحسين سيئ لا قيمة له",
    textFr: "Le même réseau avec SGD vanille, une bonne initialisation et un planning adapté peut surpasser un réseau plus grand entraîné négligemment. Les astuces d'optimisation font la différence entre « ça marche dans l'article » et « ça marche sur ton GPU en production ». L'histoire : les premiers DNN échouaient à cause des gradients évanescents et de la mauvaise initialisation. La percée ImageNet 2012 (AlexNet) utilisait ReLU + dropout + weight decay. Les ResNets (2015) ont ajouté des connexions sautées pour résoudre le flux de gradients à profondeur 100+. Les transformeurs modernes s'entraînent de façon stable à profondeur 1000+ avec une normalisation soignée, un warmup du taux d'apprentissage et un écrêtage du gradient. Chaque astuce a résolu un mode d'échec concret.",
    textAr: "نفس الشبكة مع SGD البسيط والتهيئة الجيدة والجدولة المناسبة يمكنها التفوق على شبكة أكبر مدربة باهمال. خدع التحسين هي الفرق بين 'يعمل في الورقة' و'يعمل على GPU في الإنتاج'. التاريخ: فشلت شبكات الأعماق المبكرة بسبب التدرجات المتلاشية والتهيئة السيئة. اختراق ImageNet 2012 (AlexNet) استخدم ReLU + dropout + weight decay. أضافت ResNets (2015) اتصالات قافزة لحل تدفق التدرج عند عمق 100+. تتدرب المحولات الحديثة بثبات عند عمق 1000+ مع تطبيع دقيق وإحماء معدل التعلم وقطع التدرج. كل خدعة حلّت نمط فشل محدد.",
    calloutFr: "Le taux d'apprentissage est le paramètre le plus important. Un taux 10× mal choisi fait souvent la différence entre un modèle qui s'entraîne et un qui diverge — avant même d'essayer autre chose.",
    calloutAr: "معدل التعلم هو المعامل الأهم. معدل تعلم خاطئ بمقدار 10× غالباً يصنع الفرق بين نموذج يتدرب وآخر يتباعد — قبل تجربة أي شيء آخر.",
  },
  "dl-optimization|1": {
    headingFr: "Pourquoi Chaque Astuce Existe",
    headingAr: "لماذا توجد كل حيلة",
    textFr: "**Momentum (μ=0,9) :** La descente de gradient sur un bassin de perte allongé zigzague selon la dimension étroite. Le momentum amortit ces oscillations en moyennant les gradients dans le temps — transformant un zigzag lent en courbe douce vers le minimum. **Adam :** Différents paramètres ont des magnitudes de gradient très différentes. Adam normalise chaque paramètre par sa magnitude historique de gradient — les caractéristiques rares obtiennent des taux d'apprentissage effectifs plus grands. **Batch Normalization :** Le décalage de covariance interne force les couches suivantes à se réajuster à chaque mise à jour des poids. BatchNorm recentre les activations à chaque couche, stabilisant l'entraînement et permettant des taux d'apprentissage 10× plus élevés. **Dropout (p=0,5) :** Met aléatoirement à zéro la moitié des activations pendant l'entraînement — force le réseau à apprendre des représentations redondantes, empêchant la co-adaptation des neurones.",
    textAr: "**الزخم (μ=0.9):** ينزلق الانحدار التدرجي على وعاء خسارة مستطيل بتعرج عبر البعد الضيق. يخمّد الزخم هذه التذبذبات بمتوسطة التدرجات عبر الزمن — محولاً تعرجاً بطيئاً إلى منحنى سلس نحو الحد الأدنى. **آدم:** لدى معاملات مختلفة قيم تدرج مختلفة جداً. يُطبِّع آدم كل معامل بحجم تدرجه التاريخي — الميزات النادرة تحصل على معدلات تعلم فعلية أكبر. **Batch Normalization:** يُرغم التحول في التوزيع الداخلي الطبقات اللاحقة على التعديل المستمر. يُعيد BatchNorm توسيط التنشيطات في كل طبقة مستقرةً التدريب ومتيحةً معدلات تعلم أعلى 10×. **Dropout (p=0.5):** يُصفِّر نصف التنشيطات عشوائياً أثناء التدريب — يُجبر الشبكة على تعلم تمثيلات زائدة مانعاً التكيف المشترك للخلايا.",
    calloutFr: "La taille du batch et le taux d'apprentissage sont couplés : doubler la taille du batch a un effet similaire à diviser le taux d'apprentissage par deux. Règle de mise à l'échelle linéaire (Goyal et al. 2017) : mettre à l'échelle lr proportionnellement à la taille du batch, ajouter 5 époques de warmup.",
    calloutAr: "حجم الدفعة ومعدل التعلم مرتبطان: مضاعفة حجم الدفعة له أثر مشابه لتقسيم معدل التعلم على اثنين. قاعدة التوسع الخطي (Goyal et al. 2017): ضبط lr بالتناسب مع حجم الدفعة، إضافة 5 إبوكات إحماء.",
  },
  "dl-optimization|2": {
    headingFr: "Recette d'Entraînement Moderne pour le Deep Learning",
    headingAr: "وصفة التدريب الحديثة للتعلم العميق",
    stepsFr: [
      "Initialiser les poids : He init pour les couches ReLU (σ=√(2/fan_in)), Xavier pour tanh/sigmoid (σ=√(2/(fan_in+fan_out))).",
      "Choisir l'optimiseur : Adam (β₁=0,9, β₂=0,999, ε=1e-8, lr=3e-4) pour la plupart des tâches. SGD+momentum pour le fine-tuning ImageNet.",
      "Ajouter un warmup du taux d'apprentissage : monter linéairement de 0 à lr cible sur 5% des étapes totales — évite les grandes étapes de gradient avant la stabilisation du modèle.",
      "Cosine annealing (ou ReduceLROnPlateau) : décroître lr en douceur jusqu'à 1e-6. OneCycleLR est une forte alternative.",
      "Écrêtage du gradient (max_norm=1,0) : limiter la norme du gradient avant la mise à jour — essentiel pour RNN, Transformeurs. torch.nn.utils.clip_grad_norm_().",
      "Régularisation : Weight decay (L2, λ=1e-4 à 1e-2). Dropout (p=0,1–0,5). Label smoothing (ε=0,1) pour la classification.",
      "Précision mixte (torch.cuda.amp) : float16 pour le passage avant, float32 pour la perte — 2× de vitesse, 2× d'efficacité mémoire sur les GPU modernes.",
    ],
    stepsAr: [
      "تهيئة الأوزان: He init لطبقات ReLU (σ=√(2/fan_in))، Xavier لـtanh/sigmoid (σ=√(2/(fan_in+fan_out))).",
      "اختيار المحسِّن: Adam (β₁=0.9، β₂=0.999، ε=1e-8، lr=3e-4) لمعظم المهام. SGD+زخم للضبط الدقيق على ImageNet.",
      "إضافة إحماء معدل التعلم: رفع خطي من 0 إلى lr المستهدف على 5% من الخطوات الكلية — يمنع خطوات التدرج الكبيرة قبل استقرار النموذج.",
      "التبريد بالجيب التمام (أو ReduceLROnPlateau): تقليل lr بسلاسة إلى 1e-6. OneCycleLR بديل قوي.",
      "قطع التدرج (max_norm=1.0): تحديد معيار التدرج قبل التحديث — ضروري لـRNN والمحولات. torch.nn.utils.clip_grad_norm_().",
      "التنظيم: تضاؤل الأوزان (L2، λ=1e-4 إلى 1e-2). Dropout (p=0.1–0.5). تمهيد التسميات (ε=0.1) للتصنيف.",
      "الدقة المختلطة (torch.cuda.amp): float16 للمرور الأمامي، float32 للخسارة — سرعة مضاعفة وكفاءة ذاكرة مضاعفة على GPU الحديثة.",
    ],
  },
  "dl-optimization|3": {
    headingFr: "Boucle d'Entraînement PyTorch Moderne",
    headingAr: "حلقة التدريب الحديثة في PyTorch",
    codeFr: `import torch
import torch.nn as nn
import torch.optim as optim
from torch.cuda.amp import GradScaler, autocast
from torch.utils.data import TensorDataset, DataLoader

# ── Modèle minimal + chargeur pour la démo ────────────────────────────
class MonModele(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(nn.Linear(16, 64), nn.ReLU(), nn.Linear(64, 10))
    def forward(self, x): return self.net(x)

X_donnees = torch.randn(512, 16)
y_donnees = torch.randint(0, 10, (512,))
chargeur_donnees = DataLoader(TensorDataset(X_donnees, y_donnees),
                               batch_size=32, shuffle=True)

def entrainer_une_epoque(modele, chargeur, optimiseur, reechelonneur, planificateur, peripherique, norme_max=1.0):
    modele.train()
    perte_totale = 0.0
    for idx_lot, (X, y) in enumerate(chargeur):
        X, y = X.to(peripherique), y.to(peripherique)
        optimiseur.zero_grad(set_to_none=True)   # plus rapide que zero_grad()

        # ── Passage avant en précision mixte ─────────────────────────────────
        with autocast():
            logits = modele(X)
            perte  = nn.functional.cross_entropy(logits, y, label_smoothing=0.1)

        # ── Rétropropagation avec écrêtage du gradient ───────────────────────
        reechelonneur.scale(perte).backward()
        reechelonneur.unscale_(optimiseur)
        torch.nn.utils.clip_grad_norm_(modele.parameters(), norme_max)
        reechelonneur.step(optimiseur)
        reechelonneur.update()
        planificateur.step()                     # par lot pour OneCycleLR

        perte_totale += perte.item()

    return perte_totale / len(chargeur)

# ── Configuration ─────────────────────────────────────────────────────────────
peripherique = torch.device("cuda" if torch.cuda.is_available() else "cpu")
modele       = MonModele().to(peripherique)

# AdamW (Adam avec weight decay découplé — mieux qu'Adam+L2)
optimiseur = optim.AdamW(modele.parameters(), lr=3e-4, weight_decay=1e-2)

# OneCycle LR : warmup + cosine anneal en un seul planning
planificateur = optim.lr_scheduler.OneCycleLR(
    optimiseur,
    max_lr=3e-4,
    total_steps=100 * len(chargeur_donnees),    # époques × étapes_par_époque
    pct_start=0.05,                              # 5% de warmup
    anneal_strategy="cos",
)

reechelonneur = GradScaler()                     # pour la précision mixte

# ── Comparaison des optimiseurs ───────────────────────────────────────────────
# SGD + Momentum (fort pour le fine-tuning de CNN pré-entraînés)
sgd = optim.SGD(modele.parameters(), lr=0.01, momentum=0.9, weight_decay=1e-4, nesterov=True)

# Adam (par défaut pour la plupart des tâches)
adam = optim.Adam(modele.parameters(), lr=3e-4, betas=(0.9, 0.999))

# AdamW (weight decay correctement découplé — recommandé par les meilleures pratiques)
adamw = optim.AdamW(modele.parameters(), lr=3e-4, weight_decay=0.01)

# ── Exemple de Batch Normalization ────────────────────────────────────────────
class BlocConv(nn.Module):
    def __init__(self, can_entree, can_sortie):
        super().__init__()
        self.bloc = nn.Sequential(
            nn.Conv2d(can_entree, can_sortie, 3, padding=1, bias=False),
            nn.BatchNorm2d(can_sortie),   # bias=False car BN a son propre β
            nn.ReLU(inplace=True),
        )
    def forward(self, x): return self.bloc(x)

# ── Layer Normalization (les Transformeurs préfèrent LayerNorm) ───────────────
class BlocTransformateur(nn.Module):
    def __init__(self, d_modele, n_tetes):
        super().__init__()
        self.attn    = nn.MultiheadAttention(d_modele, n_tetes, batch_first=True)
        self.ff      = nn.Sequential(nn.Linear(d_modele, d_modele*4), nn.GELU(), nn.Linear(d_modele*4, d_modele))
        self.norme1  = nn.LayerNorm(d_modele)    # pré-norme (plus stable que post-norme)
        self.norme2  = nn.LayerNorm(d_modele)
        self.abandon = nn.Dropout(0.1)
    def forward(self, x):
        # Architecture pré-norme (utilisée dans GPT-2+, meilleur flux de gradient)
        x = x + self.abandon(self.attn(self.norme1(x), self.norme1(x), self.norme1(x))[0])
        x = x + self.abandon(self.ff(self.norme2(x)))
        return x

# ── Chercheur de taux d'apprentissage ─────────────────────────────────────────
from torch_lr_finder import LRFinder
chercheur = LRFinder(modele, optimiseur, nn.CrossEntropyLoss(), device=peripherique)
chercheur.range_test(chargeur_donnees, end_lr=10, num_iter=100)
chercheur.plot()   # chercher la descente la plus raide — c'est votre max_lr`,
  },
  "dl-optimization|4": {
    headingFr: "Modes d'Échec Cachés de BatchNorm",
    headingAr: "أوضاع فشل BatchNorm الخفية",
    textFr: "BatchNorm est puissant mais présente plusieurs modes d'échec subtils : (1) **Petites tailles de batch :** BatchNorm calcule des statistiques sur le batch — avec batch_size < 8, les estimations sont trop bruitées. Utiliser GroupNorm (group_size=32) ou LayerNorm à la place. (2) **model.eval() est critique :** En mode éval, BatchNorm utilise les statistiques courantes calculées pendant l'entraînement. Oublier d'appeler model.eval() avant l'inférence cause des prédictions très différentes. (3) **Fine-tuning sur des distributions différentes :** Si vous affinez un modèle pré-entraîné, la moyenne/variance courante peut ne pas correspondre à vos données. Envisager de définir track_running_stats=False ou utiliser un faible taux d'apprentissage pour les couches BN. (4) **RNN :** BatchNorm ne fonctionne pas avec des séquences de longueur variable — utiliser LayerNorm à la place.",
    textAr: "BatchNorm قوي لكنه يمتلك عدة أوضاع فشل خفية: (1) **أحجام دفعات صغيرة:** يحسب BatchNorm إحصائيات على الدفعة — مع batch_size < 8 تكون التقديرات صاخبة جداً. استخدم GroupNorm (group_size=32) أو LayerNorm بدلاً. (2) **model.eval() حيوي:** في وضع التقييم يستخدم BatchNorm الإحصائيات الجارية المحسوبة أثناء التدريب. نسيان استدعاء model.eval() قبل الاستدلال يسبب تنبؤات مختلفة تماماً. (3) **الضبط الدقيق على توزيعات مختلفة:** قد لا تتطابق المتوسط/التباين الجاريان مع بياناتك. فكر في track_running_stats=False أو معدل تعلم منخفض لطبقات BN. (4) **RNNs:** لا يعمل BatchNorm مع التسلسلات ذات الأطوال المتغيرة — استخدم LayerNorm بدلاً.",
    calloutFr: "La deuxième erreur la plus fréquente en PyTorch (après les mauvaises dimensions de tenseur) est d'oublier model.eval() — BatchNorm et Dropout se comportent différemment en mode train et eval.",
    calloutAr: "الخطأ الثاني الأكثر شيوعاً في PyTorch (بعد أبعاد التنسور الخاطئة) هو نسيان model.eval() — يتصرف BatchNorm وDropout بشكل مختلف في وضعي التدريب والتقييم.",
  },

};

export const keyFormulaI18n_advanced: Record<string, KeyFormulaI18n> = {

  // ── transformers-attention ────────────────────────────────────────────────────
  "transformers-attention|0": {
    nameFr: "Produit Scalaire Mis à l'Échelle", nameAr: "الضرب النقطي المقيَّس",
    meaningFr: "Attention centrale : dans quelle mesure chaque requête s'attache à chaque clé — mise à l'échelle par √d_k pour la stabilité",
    meaningAr: "الانتباه الأساسي: مدى ارتباط كل استعلام بكل مفتاح — القياس بـ√d_k للاستقرار",
  },
  "transformers-attention|1": {
    nameFr: "Multi-Tête",              nameAr: "متعدد الرؤوس",
    meaningFr: "H fonctions d'attention parallèles jointes et projetées — chaque tête capture un aspect différent des relations",
    meaningAr: "H دوال انتباه متوازية مدمجة ومُسقَطة — كل رأس يلتقط جانباً مختلفاً من العلاقات",
  },
  "transformers-attention|2": {
    nameFr: "Encodage Positionnel",    nameAr: "الترميز الموضعي",
    meaningFr: "Injecte les informations de position du token (sans récurrence) — motifs sin/cos à différentes fréquences",
    meaningAr: "يُضخِّ معلومات موضع الرمز (بلا تكرار) — أنماط sin/cos بترددات مختلفة",
  },
  "transformers-attention|3": {
    nameFr: "Sous-couche FFN",         nameAr: "الطبقة الفرعية FFN",
    meaningFr: "Feed-forward positionnel après chaque bloc d'attention — projette dans une dimension plus grande puis réduit",
    meaningAr: "التغذية الأمامية الموضعية بعد كل كتلة انتباه — تُسقِط لبُعد أكبر ثم تُقلِّص",
  },

  // ── generative-models ────────────────────────────────────────────────────────
  "generative-models|0": {
    nameFr: "ELBO (VAE)",              nameAr: "ELBO (VAE)",
    meaningFr: "Terme de reconstruction − divergence KL (régularise l'espace latent) — l'objectif maximisé dans l'entraînement VAE",
    meaningAr: "مصطلح إعادة البناء − تباين KL (يُنظِّم الفضاء الكامن) — الهدف المُعظَّم في تدريب VAE",
  },
  "generative-models|1": {
    nameFr: "Reparamétrisation",       nameAr: "إعادة المعاملة",
    meaningFr: "Permet aux gradients de passer à travers l'opération d'échantillonnage — astuce nécessaire pour la rétropropagation dans les VAE",
    meaningAr: "يسمح للتدرجات بالتدفق عبر عملية أخذ العينات — الحيلة الضرورية للانتشار الخلفي في VAEs",
  },
  "generative-models|2": {
    nameFr: "Objectif GAN",            nameAr: "هدف GAN",
    meaningFr: "Le générateur trompe le discriminateur ; le discriminateur détecte les faux — jeu minimax adversariel",
    meaningAr: "يُخدِع المولِّد المُمييِّز؛ يكشف المُمييِّز المزيفات — لعبة minimax تعارضية",
  },

  // ── bagging-stacking ─────────────────────────────────────────────────────────
  "bagging-stacking|0": {
    nameFr: "Biais-Variance de l'Ensemble", nameAr: "التحيز-التباين للمجموعة",
    meaningFr: "La variance de l'ensemble se réduit en abaissant la corrélation ρ entre les modèles — diversité = réduction de la variance",
    meaningAr: "تباين المجموعة يتقلص بتخفيض الارتباط ρ بين النماذج — التنوع = تقليل التباين",
  },
  "bagging-stacking|1": {
    nameFr: "Poids AdaBoost",          nameAr: "وزن AdaBoost",
    meaningFr: "Poids plus élevé pour les apprenants faibles plus précis — les apprenants faibles avec une erreur faible dominent l'ensemble",
    meaningAr: "وزن أعلى للمتعلمين الضعفاء الأكثر دقة — المتعلمون ذوو الخطأ المنخفض يهيمنون على المجموعة",
  },
  "bagging-stacking|2": {
    nameFr: "Méta-Entrée de l'Empilement", nameAr: "مدخلات ميتا التكديس",
    meaningFr: "Prédictions hors-du-pli des modèles de base alimentent le méta-apprenant — la seule entrée correcte pour l'empilement",
    meaningAr: "تنبؤات النماذج الأساسية خارج الطوق تُغذِّي المتعلم الميتا — المدخل الصحيح الوحيد للتكديس",
  },

  // ── ova-ovo ──────────────────────────────────────────────────────────────────
  "ova-ovo|0": {
    nameFr: "Classificateurs OvA",     nameAr: "مصنِّفات OvA",
    meaningFr: "K classificateurs binaires, un par classe contre toutes les autres — nécessite K fois le temps d'entraînement",
    meaningAr: "K مصنِّفات ثنائية، واحد لكل فئة ضد جميع الأخرى — يستلزم K مرات وقت التدريب",
  },
  "ova-ovo|1": {
    nameFr: "Classificateurs OvO",     nameAr: "مصنِّفات OvO",
    meaningFr: "Un classificateur binaire par paire de classes — K(K-1)/2 modèles, chacun entraîné sur 2 classes",
    meaningAr: "مصنِّف ثنائي واحد لكل زوج من الفئات — K(K-1)/2 نموذجاً، كل منها يتدرب على فئتين",
  },
  "ova-ovo|2": {
    nameFr: "Softmax",                 nameAr: "دالة Softmax",
    meaningFr: "Normalise K logits en distribution de probabilité — la sortie naturelle pour la classification multi-classes",
    meaningAr: "تُطبِّع K لوجيتس إلى توزيع احتمالي — الخرج الطبيعي للتصنيف متعدد الفئات",
  },

  // ── dl-optimization ──────────────────────────────────────────────────────────
  "dl-optimization|0": {
    nameFr: "SGD + Momentum",          nameAr: "SGD + الزخم",
    meaningFr: "Accumuler la vitesse dans la direction du gradient — échappe aux minima peu profonds et amortit les oscillations",
    meaningAr: "تراكم السرعة في اتجاه التدرج — يخرج من الحدود الدنيا الضحلة ويُخمِّد التذبذبات",
  },
  "dl-optimization|1": {
    nameFr: "Adam",                    nameAr: "آدم",
    meaningFr: "Taux d'apprentissage adaptatif par paramètre : m̂_t = moyenne du gradient corrigée, v̂_t = variance du gradient",
    meaningAr: "معدل تعلم تكيفي لكل معامل: m̂_t = متوسط التدرج المصحَّح، v̂_t = تباين التدرج",
  },
  "dl-optimization|2": {
    nameFr: "Normalisation par Lot",   nameAr: "تطبيع الدفعة",
    meaningFr: "Normalise les activations par mini-lot ; γ,β apprenables restaurent le pouvoir représentationnel",
    meaningAr: "يُطبِّع التنشيطات لكل ميني-دفعة؛ γ,β قابلة للتعلم تستعيد القدرة التمثيلية",
  },
  "dl-optimization|3": {
    nameFr: "Planning LR en Cosinus",  nameAr: "جدولة lr بالجيب التمام",
    meaningFr: "Décroissance douce du taux d'apprentissage de ηmax à ηmin sur T étapes — meilleure que la décroissance par palier",
    meaningAr: "تناقص سلس لمعدل التعلم من ηmax إلى ηmin على T خطوة — أفضل من الانخفاض بالخطوات",
  },

};

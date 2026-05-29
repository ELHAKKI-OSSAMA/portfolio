import type { SectionI18n, KeyFormulaI18n } from '../types';

export const sectionI18n_audio: Record<string, SectionI18n> = {

  // ── audio-ml ─────────────────────────────────────────────────────────────────
  "audio-ml|0": {
    headingFr: "Pourquoi le ML Audio Est Plus Difficile que le ML Image",
    headingAr: "لماذا تعلم الآلة الصوتي أصعب من تعلم الصور",
    textFr: "L'audio présente des défis uniques : (1) Structure temporelle — le sens dépend de l'ordre et du timing, pas seulement du contenu (la parole est une séquence). (2) Longueur variable — un énoncé peut durer 0,1s ou 60s ; les images peuvent être rembourrées proprement, le rembourrage audio change le silence perçu. (3) Non-stationnarité — les propriétés statistiques changent au fil du temps (hauteur, vitesse, accent). (4) Variation non pertinente — même contenu prononcé plus vite, plus fort, avec un accent différent, un micro différent, du bruit de fond — tout doit produire la même sortie. (5) Pas de structure spatiale directe — contrairement aux images, les échantillons audio bruts sont des séries temporelles 1D à 16 000–44 100 Hz. La transformation spectrogramme convertit l'audio en une représentation 2D semblable à une image que les CNN peuvent traiter.",
    textAr: "يطرح الصوت تحديات فريدة: (1) البنية الزمنية — المعنى يعتمد على الترتيب والتوقيت لا المحتوى فقط. (2) الطول المتغير — يمكن أن يكون الكلام 0.1 ثانية أو 60 ثانية؛ حشو الصوت يغير الصمت المدرك. (3) اللاثبات — الخصائص الإحصائية تتغير مع الوقت (النغمة، السرعة، اللهجة). (4) التباين غير ذي الصلة — نفس المحتوى بصوت أسرع أو لهجة مختلفة أو ضجيج خلفية يجب أن ينتج نفس المخرج. (5) لا بنية مكانية مباشرة — عينات الصوت الخام سلاسل زمنية أحادية الأبعاد بـ16,000-44,100 هرتز. يحوّل تحويل المطياف الصوت إلى تمثيل ثنائي الأبعاد يشبه الصورة يمكن لشبكات CNN معالجته.",
    calloutFr: "Siri, Google Assistant, Alexa et Whisper convertissent tous la parole en spectrogrammes (ou bancs de filtres Mel appris) avant d'appliquer les réseaux de neurones — les formes d'onde brutes ne sont presque jamais alimentées directement.",
    calloutAr: "تُحوّل Siri وGoogle Assistant وAlexa وWhisper جميعاً الكلام إلى مطياف (أو بنوك فلتر ميل متعلّمة) قبل تطبيق الشبكات العصبية — الموجات الخام نادراً ما تُغذّى مباشرةً.",
  },
  "audio-ml|1": {
    headingFr: "Le Pipeline de Traitement Audio",
    headingAr: "خط أنابيب معالجة الصوت",
    textFr: "**Forme d'onde brute :** x(t) — une série temporelle 1D de valeurs de pression sonore échantillonnées à 16kHz (16 000 échantillons/seconde pour la parole). **Spectrogramme :** Appliquez la Transformée de Fourier à Court Terme (STFT) avec une fenêtre glissante (~25ms, pas ~10ms) → matrice du contenu fréquentiel au fil du temps. Régions brillantes = fréquences présentes à ce moment. **Spectrogramme Mel :** Appliquez un banc de filtres triangulaires (échelle Mel) pour réduire l'axe des fréquences à 80–128 canaux Mel — correspond à la perception auditive humaine. **MFCC :** Appliquez log + Transformée en Cosinus Discrète (DCT) pour décorrélr les énergies → 13–40 coefficients compacts par trame. Les MFCC étaient la référence pendant des décennies ; le Deep Learning moderne utilise directement les spectrogrammes log-mel comme entrée CNN.",
    textAr: "**الموجة الخام:** x(t) — سلسلة زمنية أحادية الأبعاد لقيم ضغط الصوت بـ16 كيلوهرتز. **المطياف:** طبّق التحويل الفورييه القصير المدى (STFT) مع نافذة متزلجة (~25ms، خطوة ~10ms) → مصفوفة المحتوى الترددي عبر الزمن. المناطق المضيئة = الترددات الموجودة. **مطياف ميل:** طبّق بنك فلتر مثلثي (مقياس ميل) لتقليص محور الترددات إلى 80-128 نطاقاً ميلياً — يتوافق مع الإدراك السمعي البشري. **MFCC:** طبّق log + تحويل جيب تمام منفصل (DCT) لإزالة الترابط بين طاقات بنك الفلتر → 13-40 معامل مضغوط لكل إطار. التعلم العميق الحديث غالباً يتجاوز MFCC ويستخدم مطياف log-mel مباشرةً.",
    calloutFr: "Un clip d'1 seconde à 16kHz = 16 000 échantillons bruts. Après STFT avec fenêtres 25ms/pas 10ms = ~100 trames × 80 canaux Mel = 8 000 valeurs. Compression de 50% en conservant tout le contenu perceptif.",
    calloutAr: "مقطع مدته 1 ثانية بـ16 كيلوهرتز = 16,000 عينة خام. بعد STFT بنوافذ 25ms/خطوة 10ms = ~100 إطار × 80 نطاق ميل = 8,000 قيمة. ضغط 50% مع الاحتفاظ بكل المحتوى الإدراكي.",
  },
  "audio-ml|2": {
    headingFr: "Pipeline de Reconnaissance Vocale (style Whisper)",
    headingAr: "خط أنابيب التعرف على الكلام",
    stepsFr: [
      "Prétraitement : rééchantillonner à 16kHz, normaliser l'amplitude, rembourrer/couper à une longueur fixe.",
      "Spectrogramme Log-Mel : appliquer STFT (fenêtre=25ms, pas=10ms, n_fft=400), appliquer 80 bancs de filtres Mel, prendre le log.",
      "Encodeur : Conv 2D striée → encodeur Transformer avec embeddings positionnels absolus — encode le contexte audio.",
      "Décodeur : décodeur Transformer autorégressif conditionné sur la sortie de l'encodeur. Entraîné avec le forçage enseignant sur les transcriptions.",
      "Perte CTC ou entropie croisée entre la séquence de tokens prédite et la transcription de référence.",
      "Inférence : la recherche en faisceau (largeur 5) décode la séquence de tokens la plus probable. Repondération optionnelle par modèle de langage.",
      "Post-traitement : appliquer la restauration de la ponctuation, la normalisation inverse du texte (convertir '3 dollars' → '3 $').",
    ],
    stepsAr: [
      "المعالجة المسبقة: إعادة أخذ العينات إلى 16 كيلوهرتز، تطبيع السعة، الحشو/القص إلى طول ثابت.",
      "مطياف Log-Mel: تطبيق STFT (نافذة=25ms، خطوة=10ms، n_fft=400)، تطبيق 80 بنكاً لفلترة ميل، أخذ اللوغاريتم.",
      "المشفّر: Conv ثنائية الأبعاد ذات خطوة → مشفّر Transformer مع تضمينات موضعية مطلقة — يُشفّر السياق الصوتي.",
      "المفكّك: مفكّك Transformer تلقائي الانحدار مُعلَّق على مخرج المشفّر. يُدرَّب بالإجبار التعليمي على النصوص المنقولة.",
      "خسارة CTC أو الإنتروبيا المتقاطعة بين تسلسل الرموز المتنبأ والنص الحقيقي.",
      "الاستدلال: بحث الشعاع (عرض 5) يفك تشفير أرجح تسلسل رموز. إعادة تسجيل اختيارية بنموذج لغوي.",
      "ما بعد المعالجة: تطبيق استعادة علامات الترقيم، تطبيع النص العكسي (تحويل 'ثلاثة دولارات' → '3$').",
    ],
  },
  "audio-ml|3": {
    headingFr: "Caractéristiques Audio avec librosa + OpenAI Whisper",
    headingAr: "ميزات الصوت مع librosa + OpenAI Whisper",
    codeFr: `import librosa
import numpy as np
import matplotlib.pyplot as plt

# ── 1. Charger l'audio ────────────────────────────────────────────────────────
y_audio, taux_ech = librosa.load("parole.wav", sr=16000)   # rééchantillonner à 16kHz
print(f"Durée : {len(y_audio)/taux_ech:.2f}s, Fréquence d'échantillonnage : {taux_ech}Hz")

# ── 2. Forme d'onde vers spectrogramme ───────────────────────────────────────
D = librosa.stft(y_audio, n_fft=400, hop_length=160, win_length=400)
spectrogramme = np.abs(D)**2               # spectrogramme de puissance (magnitude²)
S_db = librosa.power_to_db(spectrogramme, ref=np.max)  # échelle décibel

# ── 3. Spectrogramme Mel ──────────────────────────────────────────────────────
S_mel = librosa.feature.melspectrogram(
    y=y_audio, sr=taux_ech,
    n_fft=400,
    hop_length=160,        # pas de 10ms à 16kHz
    win_length=400,        # fenêtre de 25ms à 16kHz
    n_mels=80,             # 80 canaux Mel (standard Whisper)
    fmin=50, fmax=8000,    # filtrer entre 50Hz et 8kHz
)
log_mel = librosa.power_to_db(S_mel, ref=np.max)
print(f"Forme log-mel : {log_mel.shape}")   # (80, T)

# ── 4. MFCC ──────────────────────────────────────────────────────────────────
mfcc = librosa.feature.mfcc(y=y_audio, sr=taux_ech, n_mfcc=13, n_mels=80)
delta_mfcc  = librosa.feature.delta(mfcc)           # vélocité : variation temporelle
delta2_mfcc = librosa.feature.delta(mfcc, order=2)  # accélération

caracteristiques = np.vstack([mfcc, delta_mfcc, delta2_mfcc])  # vecteur 39-dim
print(f"Forme MFCC + deltas : {caracteristiques.shape}")  # (39, T)

# ── 5. Classification audio avec CNN ─────────────────────────────────────────
import torch, torch.nn as nn

class CNNAudio(nn.Module):
    def __init__(self, n_classes: int):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(1, 32, kernel_size=3, padding=1), nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, kernel_size=3, padding=1), nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(64, 128, kernel_size=3, padding=1), nn.ReLU(),
            nn.AdaptiveAvgPool2d((4, 4)),    # pooling global moyen vers taille fixe
        )
        self.fc = nn.Sequential(
            nn.Linear(128*4*4, 256), nn.ReLU(), nn.Dropout(0.4),
            nn.Linear(256, n_classes),
        )
    def forward(self, x):
        # x : (B, 1, n_mels, T) — log-mel comme 'image' mono-canal
        return self.fc(self.conv(x).flatten(1))

modele_cnn = CNNAudio(n_classes=10)   # ex. UrbanSound8K : 10 classes sonores
x = torch.randn(8, 1, 80, 128)       # lot de 8 clips, 80 mels, 128 trames
print(modele_cnn(x).shape)            # (8, 10)

# ── 6. OpenAI Whisper (parole vers texte) ────────────────────────────────────
# pip install openai-whisper
import whisper
modele_whisper = whisper.load_model("base")           # 74M paramètres
resultat       = modele_whisper.transcribe("parole.wav")
print(resultat["text"])                               # transcription complète
print(resultat["language"])                           # langue détectée

# Horodatages par mot
res_ts = modele_whisper.transcribe("parole.wav", word_timestamps=True)
for seg in res_ts["segments"]:
    print(f"[{seg['start']:.2f}s → {seg['end']:.2f}s] {seg['text']}")`,
  },
  "audio-ml|4": {
    headingFr: "L'Augmentation des Données Est Critique pour l'Audio",
    headingAr: "زيادة البيانات حيوية للصوت",
    textFr: "Les modèles audio surapprendraient facilement car un seul locuteur peut sonner complètement différent selon les conditions d'enregistrement. Augmentations clés : (1) **SpecAugment** (Google, 2019) — masquer aléatoirement des bandes de fréquences et des pas de temps dans le spectrogramme log-mel. Simple mais extrêmement efficace — utilisé dans Whisper. (2) **Étirement temporel** — changer le tempo sans changer la hauteur (librosa.effects.time_stretch). (3) **Décalage de hauteur** — changer la hauteur sans changer le tempo. (4) **Mélange de bruit de fond** — ajouter du bruit de foule, de la musique, de la circulation à différents niveaux SNR. (5) **Convolution de réponse impulsionnelle de salle (RIR)** — simuler différents environnements acoustiques. Sans augmentation, un modèle entraîné sur de la parole en studio échoue complètement sur des appels téléphoniques.",
    textAr: "تُفرط نماذج الصوت في التخصيص بسهولة لأن متحدثاً واحداً يمكن أن يبدو مختلفاً تماماً عبر ظروف التسجيل. التعزيزات الرئيسية: (1) **SpecAugment** (Google, 2019) — إخفاء نطاقات ترددية وخطوات زمنية عشوائياً في مطياف log-mel. بسيط لكن فعّال للغاية — مستخدم في Whisper. (2) **تمديد الوقت** — تغيير الإيقاع دون تغيير النغمة. (3) **تحويل النغمة** — تغيير النغمة دون تغيير الإيقاع. (4) **خلط ضجيج الخلفية** — إضافة ضجيج الأصوات والموسيقى والمرور بمستويات SNR متنوعة. (5) **تلافي استجابة الغرفة النبضية (RIR)** — محاكاة بيئات صوتية مختلفة. بدون تعزيز يفشل النموذج المدرَّب على كلام ذو جودة استوديو فشلاً تاماً على المكالمات الهاتفية.",
    calloutFr: "SpecAugment seul a amélioré le taux d'erreur de mots (WER) du modèle LAS de 13,9% relatif sur LibriSpeech — sans doute la meilleure technique d'augmentation unique dans l'histoire de la reconnaissance automatique de la parole.",
    calloutAr: "أدّى SpecAugment وحده إلى تحسين معدل خطأ الكلمات (WER) لنموذج LAS بنسبة 13.9% نسبياً على LibriSpeech — ربما أفضل تقنية تعزيز منفردة في تاريخ التعرف التلقائي على الكلام.",
  },

};

export const keyFormulaI18n_audio: Record<string, KeyFormulaI18n> = {

  // ── audio-ml ─────────────────────────────────────────────────────────────────
  "audio-ml|0": {
    nameFr: "Transformée de Fourier à Court Terme",  nameAr: "تحويل فورييه القصير المدى",
    meaningFr: "Calculer le contenu fréquentiel dans une fenêtre glissante — produit le spectrogramme",
    meaningAr: "حساب المحتوى الترددي داخل نافذة متزلجة — ينتج المطياف",
  },
  "audio-ml|1": {
    nameFr: "Échelle Mel",  nameAr: "مقياس ميل",
    meaningFr: "Mappe la fréquence linéaire sur l'échelle perceptive — les humains entendent la hauteur de manière logarithmique, surtout aux hautes fréquences",
    meaningAr: "تعيين التردد الخطي على مقياس إدراكي — البشر يسمعون النغمة بشكل لوغاريتمي خاصة عند الترددات العالية",
  },
  "audio-ml|2": {
    nameFr: "MFCC",  nameAr: "MFCC",
    meaningFr: "Transformée en Cosinus Discrète des énergies log du banc de filtres Mel — caractéristiques audio compactes et décorrélées",
    meaningAr: "تحويل جيب تمام منفصل لطاقات بنك فلتر ميل اللوغاريتمي — ميزات صوتية مضغوطة وغير مرتبطة",
  },
  "audio-ml|3": {
    nameFr: "Perte CTC",  nameAr: "خسارة CTC",
    meaningFr: "Classification Temporelle Connexionniste — permet un entraînement sans alignement entre les trames d'entrée et les tokens de sortie",
    meaningAr: "التصنيف الزمني الاتصالي — يتيح تدريباً بدون محاذاة بين إطارات الإدخال ورموز الإخراج",
  },

};

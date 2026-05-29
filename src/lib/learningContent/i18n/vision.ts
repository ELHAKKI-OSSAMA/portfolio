import type { SectionI18n, KeyFormulaI18n } from '../types';

export const sectionI18n_vision: Record<string, SectionI18n> = {

  // ── object-detection ─────────────────────────────────────────────────────────
  "object-detection|0": {
    headingFr: "Au-Delà de la Classification : Où et Quoi ?",
    headingAr: "ما وراء التصنيف: أين وماذا؟",
    textFr: "La classification d'images répond à « y a-t-il un chat ? ». La détection répond à « où sont les chats, et y a-t-il aussi des chiens ? ». Ce passage d'une seule étiquette à un nombre variable de sorties (classe, boîte englobante) est ce qui fait de la détection d'objets la tâche centrale en conduite autonome, imagerie médicale, caisse de commerce et surveillance. Chaque voiture autonome exécute un détecteur en temps réel traitant 30+ images par seconde. L'évolution des classificateurs à fenêtre glissante (DPM, 2010) → détecteurs à deux étapes (RCNN, 2014 ; Faster-RCNN, 2015) → détecteurs à une étape (YOLO v1, 2016 → v8, 2023) est l'un des domaines les plus dynamiques de la vision par ordinateur.",
    textAr: "تُجيب تصنيف الصور على «هل يوجد قط؟». الكشف يُجيب على «أين القطط، وهل يوجد أيضاً كلاب؟». هذا التحول من علامة واحدة إلى عدد متغير من المخرجات (فئة، صندوق حدود) هو ما يجعل الكشف عن الأجسام المهمة المحورية في القيادة الذاتية والتصوير الطبي وتسجيل التجزئة والمراقبة. كل سيارة ذاتية القيادة تشغّل كاشفاً في الوقت الفعلي يعالج أكثر من 30 إطاراً في الثانية. التطور من مصنّفات النافذة المنزلقة (DPM, 2010) → كاشفات مرحلتين (RCNN, 2014؛ Faster-RCNN, 2015) → كاشفات مرحلة واحدة (YOLO v1, 2016 → v8, 2023) هو أحد أسرع المجالات تطوراً في رؤية الحاسوب.",
    calloutFr: "L'Autopilot de Tesla fait passer 8 caméras par un réseau de détection personnalisé à 36 FPS sur une puce à 72 TOPS. L'intégralité du modèle doit tenir dans un budget de latence serré tout en détectant des objets à 200m.",
    calloutAr: "يمرر Tesla Autopilot 8 كاميرات عبر شبكة كشف مخصصة بـ36 إطاراً/ثانية على شريحة 72 TOPS. يجب أن يتناسب النموذج بأكمله في ميزانية زمن استجابة ضيقة مع الكشف عن أجسام على بعد 200 متر.",
  },
  "object-detection|1": {
    headingFr: "Deux Étapes vs Une Étape : Le Compromis Fondamental",
    headingAr: "مرحلتان مقابل مرحلة واحدة: المقايضة الأساسية",
    textFr: "**Détecteurs à deux étapes (Faster-RCNN) :** Étape 1 — le Réseau de Propositions de Régions (RPN) suggère ~300 régions candidates pouvant contenir des objets. Étape 2 — une tête de classification + régression affine chaque proposition. Avantage : haute précision. Inconvénient : lent (étapes séquentielles). **Détecteurs à une étape (YOLO, SSD) :** Divisez l'image en une grille. Chaque cellule prédit directement les décalages de boîte englobante, le score d'objectivité et les probabilités de classe en un seul passage avant. Avantage : rapide (capable de temps réel). Inconvénient : plus difficile à entraîner, rate les petits objets qui se chevauchent. **Basé sur ancrage vs sans ancrage :** YOLO v1-v3 utilisait des boîtes d'ancrage. YOLO v8 / FCOS / CenterNet sont sans ancrage — prédisent directement centre + largeur/hauteur de la boîte, plus simple et souvent meilleur.",
    textAr: "**كاشفات مرحلتين (Faster-RCNN):** المرحلة 1 — شبكة اقتراح المناطق (RPN) تقترح ~300 منطقة مرشحة. المرحلة 2 — رأس تصنيف + انحدار يُحسّن كل اقتراح. الميزة: دقة عالية. العيب: بطيء. **كاشفات مرحلة واحدة (YOLO، SSD):** قسّم الصورة إلى شبكة. كل خلية تتنبأ مباشرةً بإزاحات الصندوق ودرجة الموضوعية واحتمالات الفئة في مرور أمامي واحد. الميزة: سريع. العيب: أصعب في التدريب ويفوّت الأجسام الصغيرة المتداخلة. **مبني على المراسي مقابل بدون مراسي:** YOLO v1-v3 استخدم صناديق مراسي. YOLO v8 / FCOS / CenterNet بدون مراسي — يتنبأ مباشرةً بمركز + عرض/ارتفاع الصندوق، أبسط وغالباً أفضل.",
    calloutFr: "YOLO = 'You Only Look Once.' L'idée : au lieu d'exécuter un classificateur à des milliers de positions de fenêtre glissante, prédire toutes les boîtes simultanément en un seul passage du réseau.",
    calloutAr: "YOLO = 'You Only Look Once.' الفكرة: بدلاً من تشغيل مصنّف في آلاف مواضع النافذة المنزلقة، التنبؤ بجميع الصناديق في وقت واحد في مرور واحد للشبكة.",
  },
  "object-detection|2": {
    headingFr: "Pipeline d'Inférence YOLO",
    headingAr: "خط أنابيب استدلال YOLO",
    stepsFr: [
      "Divisez l'image d'entrée en une grille S×S (ex. 13×13 pour une entrée de 416px dans YOLO v2).",
      "Pour chaque cellule : prédisez B boîtes englobantes (chacune : x, y, l, h relatifs à la cellule, + score d'objectivité) et C probabilités de classe.",
      "Coordonnées de boîte : x, y sont des décalages depuis le centre de la cellule (0–1), l/h sont des décalages d'échelle logarithmique depuis les tailles d'ancrage.",
      "Objectivité × probabilité de classe = score de confiance spécifique à la classe pour chaque boîte.",
      "Appliquez la Suppression Non Maximale (NMS) : pour chaque classe, triez les boîtes par confiance, conservez la plus haute, supprimez les boîtes avec IoU > 0,5 avec la boîte conservée, répétez.",
      "Sortie finale : liste de longueur variable de tuples (classe, confiance, x1, y1, x2, y2).",
    ],
    stepsAr: [
      "قسّم صورة الإدخال إلى شبكة S×S (مثل 13×13 لإدخال 416 بكسل في YOLO v2).",
      "لكل خلية: تنبّأ بـ B صندوقاً حدودياً (كل منها: x, y, w, h نسبة إلى الخلية + درجة موضوعية) وC احتمالاً للفئة.",
      "إحداثيات الصندوق: x, y هي إزاحات من مركز الخلية (0-1)، w/h هي إزاحات مقياس لوغاريتمي من أحجام المراسي.",
      "الموضوعية × احتمال الفئة = درجة ثقة خاصة بالفئة لكل صندوق.",
      "طبّق الإخماد غير الأقصى (NMS): لكل فئة رتّب الصناديق حسب الثقة، احتفظ بالأعلى ثقةً، اخمد الصناديق بـIoU > 0.5 مع الصندوق المحتفظ به، كرر.",
      "المخرج النهائي: قائمة بطول متغير من الصفوف (فئة، ثقة، x1, y1, x2, y2).",
    ],
  },
  "object-detection|3": {
    headingFr: "Détection d'Objets avec YOLOv8 (Ultralytics)",
    headingAr: "اكتشاف الأجسام مع YOLOv8",
    codeFr: `# pip install ultralytics
from ultralytics import YOLO
import numpy as np
import cv2

# ── 1. Charger YOLO v8 préentraîné ────────────────────────────────────────────
modele = YOLO("yolov8n.pt")   # modèle nano (3,2M params, le plus rapide)
# Autres tailles : yolov8s.pt, yolov8m.pt, yolov8l.pt, yolov8x.pt

# ── 2. Inférence sur une seule image ─────────────────────────────────────────
resultats = modele("chemin/vers/image.jpg", conf=0.25, iou=0.5)

for r in resultats:
    boites = r.boxes
    for boite in boites:
        x1, y1, x2, y2 = boite.xyxy[0].tolist()  # coordonnées absolues en pixels
        conf  = boite.conf[0].item()              # score de confiance
        cls   = int(boite.cls[0].item())          # indice de classe
        label = modele.names[cls]
        print(f"{label} : {conf:.2f} à ({x1:.0f},{y1:.0f},{x2:.0f},{y2:.0f})")

# ── 3. Affinage sur un jeu de données personnalisé ────────────────────────────
# Format du jeu de données : format texte YOLO
# data.yaml :
#   train: /chemin/vers/images_entrainement
#   val:   /chemin/vers/images_validation
#   nc: 3
#   names: ['chat', 'chien', 'voiture']

modele = YOLO("yolov8s.pt")     # démarrer depuis préentraîné ImageNet
resultats = modele.train(
    data="data.yaml",
    epochs=50,
    imgsz=640,
    batch=16,
    lr0=0.01,                   # taux d'apprentissage initial
    lrf=0.01,                   # fraction du lr final
    augment=True,               # mosaïque, retournement, échelle
    device=0,                   # GPU 0
)
print(f"mAP50 : {resultats.metrics.mAP50:.4f}")

# ── 4. Calcul de l'IoU depuis zéro ───────────────────────────────────────────
def iou(boite1, boite2):
    """boite = [x1, y1, x2, y2]"""
    x1 = max(boite1[0], boite2[0]); y1 = max(boite1[1], boite2[1])
    x2 = min(boite1[2], boite2[2]); y2 = min(boite1[3], boite2[3])
    inter = max(0, x2-x1) * max(0, y2-y1)
    aire1 = (boite1[2]-boite1[0]) * (boite1[3]-boite1[1])
    aire2 = (boite2[2]-boite2[0]) * (boite2[3]-boite2[1])
    return inter / (aire1 + aire2 - inter + 1e-6)

verite_terrain = [100, 50, 250, 200]
prediction     = [110, 60, 260, 210]
print(f"\\nIoU = {iou(verite_terrain, prediction):.4f}")

# ── 5. NMS manuel ─────────────────────────────────────────────────────────────
def nms(boites, scores, seuil_iou=0.5):
    """boites : (N,4) xyxy, scores : (N,)"""
    ordre  = np.argsort(scores)[::-1]
    garder = []
    while len(ordre) > 0:
        i = ordre[0]
        garder.append(i)
        ious = np.array([iou(boites[i], boites[j]) for j in ordre[1:]])
        ordre = ordre[1:][ious < seuil_iou]
    return garder

boites_test  = np.array([[100,50,250,200],[105,55,255,205],[200,100,350,250]])
scores_test  = np.array([0.95, 0.87, 0.72])
gardees      = nms(boites_test, scores_test)
print(f"Boîtes conservées : {gardees}")  # [0, 2] — boîte 1 supprimée`,
  },
  "object-detection|4": {
    headingFr: "mAP et le Piège du Seuil IoU",
    headingAr: "mAP وفخ عتبة IoU",
    textFr: "mAP@0,5 (seuil IoU 0,5) et mAP@0,5:0,95 (moyenne sur les seuils IoU de 0,5 à 0,95 par pas de 0,05) racontent des histoires très différentes. Un modèle avec un excellent mAP@0,5 mais un mauvais mAP@0,5:0,95 localise les objets de manière lâche — acceptable pour les tâches grossières, mauvais pour la saisie robotique. De plus, mAP traite toutes les classes de manière égale, ce qui cache les mauvaises performances sur les classes rares. Pour les jeux de données déséquilibrés, reportez l'AP par classe séparément. Pièges courants : (1) Oublier de normaliser les coordonnées de boîte par la taille de l'image. (2) Utiliser un seuil de confiance trop bas pendant NMS — gardez conf_threshold ≈ 0,25 lors de l'inférence. (3) Surapprentissage sur les petits jeux de données — utilisez toujours une augmentation forte.",
    textAr: "mAP@0.5 وmAP@0.5:0.95 تحكيان قصصاً مختلفة جداً. نموذج بـmAP@0.5 ممتاز لكن mAP@0.5:0.95 ضعيف يُحدّد مواقع الأجسام بشكل فضفاض — مقبول للمهام الخشنة، سيئ للإمساك الروبوتي. أيضاً تعامل mAP جميع الفئات بالتساوي مما يُخفي الأداء السيئ على الفئات النادرة. للمجموعات غير المتوازنة أبلغ عن AP لكل فئة منفصلاً. مخاطر شائعة: (1) نسيان تطبيع إحداثيات الصندوق بحجم الصورة. (2) استخدام عتبة ثقة منخفضة جداً أثناء NMS — احتفظ بـconf_threshold ≈ 0.25 أثناء الاستدلال. (3) الإفراط في التخصيص على المجموعات الصغيرة — استخدم دائماً تعزيزاً قوياً.",
    calloutFr: "Une amélioration de 1% de mAP sur le benchmark COCO représente des mois de recherche — le contexte importe pour comparer les modèles dans votre domaine.",
    calloutAr: "تحسين بنسبة 1% في mAP على معيار COCO (80 فئة، 330 ألف صورة) يمثل أشهراً من البحث — السياق مهم عند مقارنة النماذج في مجالك.",
  },

  // ── image-segmentation ───────────────────────────────────────────────────────
  "image-segmentation|0": {
    headingFr: "Segmentation : Compréhension au Niveau des Pixels",
    headingAr: "التجزئة: الفهم على مستوى البكسل",
    textFr: "La détection d'objets donne des boîtes englobantes — des approximations grossières. La segmentation donne des masques au niveau du pixel. Cela importe pour : l'imagerie médicale (délimiter précisément le bord d'une tumeur pour la planification de la radiothérapie), la conduite autonome (distinguer la surface praticable du trottoir à chaque pixel), l'imagerie satellitaire (calculer la superficie cultivée à 1m² près), le mode portrait (séparer la personne de l'arrière-plan pour l'effet bokeh). Trois niveaux : **Segmentation sémantique** — étiqueter chaque pixel avec une classe (sans distinction d'instance). **Segmentation d'instance** — détecter et masquer des instances d'objets individuels (Mask R-CNN). **Segmentation panoptique** — combinée : choses (instances) + matière (régions amorphes comme le ciel/la route).",
    textAr: "يُعطي الكشف عن الأجسام صناديق حدودية — تقريبات خشنة. تُعطي التجزئة أقنعة دقيقة على مستوى البكسل. يهم هذا لـ: التصوير الطبي (تحديد حدود ورم بدقة لتخطيط العلاج الإشعاعي)، القيادة الذاتية (التمييز بين السطح القابل للقيادة والرصيف عند كل بكسل)، صور الأقمار الاصطناعية (حساب مساحة المحاصيل بدقة م²)، وضع البورتريه (فصل الشخص عن الخلفية). ثلاثة مستويات: **التجزئة الدلالية** — وضع علامة على كل بكسل بفئة. **تجزئة المثيل** — كشف وإخفاء مثيلات أجسام فردية (Mask R-CNN). **التجزئة الشاملة** — مدمجة: أشياء (مثيلات) + مواد (مناطق غير محددة).",
    calloutFr: "Un radiologue délimitant manuellement une tumeur prend 30–60 minutes par scan. Un modèle IA le fait en < 1 seconde — le goulot d'étranglement passe à la vérification de la sortie IA, pas à sa production.",
    calloutAr: "يستغرق الطبيب الشعاعي تحديد حدود الورم يدوياً 30-60 دقيقة لكل مسح. نموذج الذكاء الاصطناعي يفعل ذلك في < 1 ثانية — يتحول عنق الزجاجة إلى التحقق من المخرجات لا إنتاجها.",
  },
  "image-segmentation|1": {
    headingFr: "Architecture Encodeur–Décodeur (UNet)",
    headingAr: "هندسة المشفر-المفكك (UNet)",
    textFr: "UNet est l'architecture de segmentation canonique. L'encodeur (chemin contractant) est un CNN qui sous-échantillonne progressivement la carte de caractéristiques — apprenant « quoi » est dans l'image, perdant « où ». Le décodeur (chemin expansif) suréchantillonne progressivement jusqu'à la résolution d'origine via des convolutions transposées — récupérant « où ». L'innovation clé : les connexions de saut qui concaténent directement les cartes de caractéristiques de l'encodeur à chaque résolution à leur homologue dans le décodeur. Ces connexions permettent au modèle de combiner les caractéristiques sémantiques de haut niveau (des couches profondes) avec les détails spatiaux de bas niveau (des couches superficielles) — essentiels pour des frontières précises et nettes.",
    textAr: "UNet هو بنية التجزئة النموذجية. المشفّر (المسار المنقبض) هو شبكة CNN تُقلّل خريطة الميزات تدريجياً — تتعلم 'ماذا' في الصورة وتفقد 'أين'. المفكّك (المسار الموسّع) يُوسّع تدريجياً إلى الدقة الأصلية باستخدام التلافيف المنقولة — يسترد 'أين'. الابتكار الرئيسي: اتصالات التخطي التي تدمج مباشرةً خرائط ميزات المشفّر مع نظيراتها في المفكّك. تُتيح هذه الاتصالات للنموذج الجمع بين الميزات الدلالية عالية المستوى مع التفاصيل المكانية منخفضة المستوى — أساسية للحدود الدقيقة والواضحة.",
    calloutFr: "UNet a été conçu pour la segmentation biomédicale en 2015 avec très peu d'images d'entraînement (~30). L'efficacité des données vient des connexions de saut et de l'augmentation intensive des données.",
    calloutAr: "صُمِّمت UNet للتجزئة الطبية الحيوية عام 2015 مع صور تدريب قليلة جداً (~30). كفاءة البيانات تأتي من اتصالات التخطي وزيادة البيانات المكثفة.",
  },
  "image-segmentation|2": {
    headingFr: "Segmentation avec torchvision et Albumentations",
    headingAr: "التجزئة مع torchvision وAlbumentations",
    codeFr: `import torch
import torch.nn as nn
import torchvision.models as models
from torchvision.models.segmentation import DeepLabV3_ResNet101_Weights

# ── 1. Segmentation sémantique préentraînée (DeepLabV3) ──────────────────────
modele = models.segmentation.deeplabv3_resnet101(
    weights=DeepLabV3_ResNet101_Weights.DEFAULT
)
modele.eval()

from PIL import Image
import torchvision.transforms.functional as F
import numpy as np

img = Image.open("rue.jpg").convert("RGB")
img_t = F.to_tensor(img).unsqueeze(0)   # (1, 3, H, L)
img_t = F.normalize(img_t, mean=[0.485,0.456,0.406], std=[0.229,0.224,0.225])

with torch.no_grad():
    sortie = modele(img_t)["out"]         # (1, 21, H, L) — 21 classes PASCAL VOC
masque_pred = sortie.argmax(dim=1)[0]    # (H, L) étiquettes de classes

# ── 2. UNet minimal ────────────────────────────────────────────────────────────
class DoubleConv(nn.Module):
    def __init__(self, entree, sortie):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(entree, sortie, 3, padding=1, bias=False),
            nn.BatchNorm2d(sortie), nn.ReLU(inplace=True),
            nn.Conv2d(sortie, sortie, 3, padding=1, bias=False),
            nn.BatchNorm2d(sortie), nn.ReLU(inplace=True),
        )
    def forward(self, x): return self.conv(x)

class UNet(nn.Module):
    def __init__(self, canaux_entree=3, n_classes=2, canaux_base=64):
        super().__init__()
        cb = canaux_base
        # Encodeur
        self.enc1 = DoubleConv(canaux_entree, cb)
        self.enc2 = DoubleConv(cb, cb*2)
        self.enc3 = DoubleConv(cb*2, cb*4)
        self.pool = nn.MaxPool2d(2)
        # Goulot d'étranglement
        self.goulot = DoubleConv(cb*4, cb*8)
        # Décodeur
        self.up3  = nn.ConvTranspose2d(cb*8, cb*4, 2, stride=2)
        self.dec3 = DoubleConv(cb*8, cb*4)   # cb*8 à cause de la connexion de saut
        self.up2  = nn.ConvTranspose2d(cb*4, cb*2, 2, stride=2)
        self.dec2 = DoubleConv(cb*4, cb*2)
        self.up1  = nn.ConvTranspose2d(cb*2, cb, 2, stride=2)
        self.dec1 = DoubleConv(cb*2, cb)
        # Sortie
        self.sortie_conv = nn.Conv2d(cb, n_classes, 1)

    def forward(self, x):
        e1 = self.enc1(x)
        e2 = self.enc2(self.pool(e1))
        e3 = self.enc3(self.pool(e2))
        g  = self.goulot(self.pool(e3))
        d3 = self.dec3(torch.cat([self.up3(g),  e3], dim=1))
        d2 = self.dec2(torch.cat([self.up2(d3), e2], dim=1))
        d1 = self.dec1(torch.cat([self.up1(d2), e1], dim=1))
        return self.sortie_conv(d1)

unet = UNet(n_classes=2)
x = torch.randn(2, 3, 256, 256)
sortie = unet(x)
print(f"Sortie UNet : {sortie.shape}")   # (2, 2, 256, 256)

# ── 3. Perte Dice ─────────────────────────────────────────────────────────────
def perte_dice(pred, cible, eps=1e-6):
    """pred : (B, C, H, L) softmax, cible : (B, H, L) entier long"""
    pred_soft = torch.softmax(pred, dim=1)
    cible_oh  = torch.zeros_like(pred_soft)
    cible_oh.scatter_(1, cible.unsqueeze(1), 1)
    inter = (pred_soft * cible_oh).sum(dim=(2,3))
    union = pred_soft.sum(dim=(2,3)) + cible_oh.sum(dim=(2,3))
    return 1 - (2*inter + eps) / (union + eps)

pred   = torch.randn(2, 2, 64, 64)
cible  = torch.randint(0, 2, (2, 64, 64))
perte  = perte_dice(pred, cible).mean()
print(f"Perte Dice : {perte.item():.4f}")`,
  },
  "image-segmentation|3": {
    headingFr: "Le Déséquilibre des Classes Détruit les Modèles de Segmentation",
    headingAr: "عدم توازن الفئات يدمر نماذج التجزئة",
    textFr: "Dans la plupart des tâches de segmentation, la classe d'arrière-plan domine — une scène de conduite pourrait être à 95% ciel+route et 5% piétons. L'entropie croisée traite tous les pixels de manière égale, donc le modèle apprend à prédire 'arrière-plan' partout et obtient 95% de précision en ratant tous les piétons. Solutions : (1) Entropie croisée pondérée — pondérer la perte inversement par la fréquence de classe. (2) Perte Dice — naturellement insensible au déséquilibre car elle mesure le rapport d'intersection, pas le nombre de pixels. (3) Focal loss (de RetinaNet) — réduit le poids des pixels bien classifiés pour que l'entraînement se concentre sur les exemples difficiles. En pratique, combinez : perte_totale = entropie_croisée + perte_dice fonctionne mieux pour l'imagerie médicale.",
    textAr: "في معظم مهام التجزئة تهيمن فئة الخلفية — قد تكون مشهد القيادة 95% سماء+طريق و5% مشاة. تعامل الإنتروبيا المتقاطعة جميع البكسلات بالتساوي فيتعلم النموذج التنبؤ بـ'خلفية' في كل مكان ويحصل على دقة 95% مع تفويت كل المشاة. الحلول: (1) الإنتروبيا المتقاطعة الموزونة — وزّن الخسارة عكسياً بتكرار الفئة. (2) خسارة Dice — غير حساسة طبيعياً للاختلال لأنها تقيس نسبة التقاطع. (3) Focal loss (من RetinaNet) — تُقلّل وزن البكسلات المصنّفة جيداً حتى يركز التدريب على الأمثلة الصعبة. من الناحية العملية الجمع بين الإنتروبيا المتقاطعة وخسارة Dice يعمل بشكل أفضل في التصوير الطبي.",
    calloutFr: "Vérifiez toujours l'IoU par classe dans vos métriques de validation — la précision globale cache les mauvaises performances sur les classes petites/rares qui sont souvent les plus importantes.",
    calloutAr: "تحقق دائماً من IoU لكل فئة في مقاييس التحقق — الدقة الإجمالية تُخفي الأداء السيئ على الفئات الصغيرة/النادرة التي غالباً ما تكون الأكثر أهمية.",
  },

};

export const keyFormulaI18n_vision: Record<string, KeyFormulaI18n> = {

  // ── object-detection ─────────────────────────────────────────────────────────
  "object-detection|0": {
    nameFr: "IoU",  nameAr: "IoU",
    meaningFr: "Intersection sur Union — mesure de qualité de la boîte englobante ; IoU > 0,5 est conventionnellement une détection correcte",
    meaningAr: "التقاطع على الاتحاد — مقياس جودة الصندوق الحدودي؛ IoU > 0.5 هو كشف صحيح اصطلاحاً",
  },
  "object-detection|1": {
    nameFr: "mAP",  nameAr: "mAP",
    meaningFr: "Précision Moyenne Moyenne — aire sous la courbe Précision-Rappel, moyennée sur toutes les classes",
    meaningAr: "متوسط متوسط الدقة — المساحة تحت منحنى الدقة-الاستدعاء، متوسطة عبر جميع الفئات",
  },
  "object-detection|2": {
    nameFr: "Perte YOLO",  nameAr: "خسارة YOLO",
    meaningFr: "Somme pondérée : régression de boîte + confiance d'objectivité + probabilités de classe",
    meaningAr: "مجموع موزون: انحدار الصندوق + ثقة الموضوعية + احتمالات الفئة",
  },
  "object-detection|3": {
    nameFr: "NMS",  nameAr: "NMS",
    meaningFr: "Garder uniquement la boîte la plus confiante quand plusieurs boîtes se chevauchent fortement sur le même objet",
    meaningAr: "الاحتفاظ فقط بالصندوق الأعلى ثقةً عندما تتداخل عدة صناديق بشكل كبير على نفس الجسم",
  },

  // ── image-segmentation ───────────────────────────────────────────────────────
  "image-segmentation|0": {
    nameFr: "Perte Dice",  nameAr: "خسارة Dice",
    meaningFr: "Mesure le chevauchement entre les masques prédits et de référence — robuste au déséquilibre des classes",
    meaningAr: "تقيس التداخل بين الأقنعة المتنبأة والحقيقية — مقاومة لعدم توازن الفئات",
  },
  "image-segmentation|1": {
    nameFr: "mIoU",  nameAr: "mIoU",
    meaningFr: "Intersection sur Union Moyenne par classe — métrique standard de segmentation",
    meaningAr: "متوسط التقاطع على الاتحاد لكل فئة — مقياس التجزئة القياسي",
  },
  "image-segmentation|2": {
    nameFr: "Connexion de Saut",  nameAr: "اتصال التخطي",
    meaningFr: "La connexion résiduelle UNet fusionne les caractéristiques de l'encodeur avec celles du décodeur — récupère les détails spatiaux perdus lors du sous-échantillonnage",
    meaningAr: "الاتصال المتبقي في UNet يدمج ميزات المشفّر مع ميزات المفكّك — يسترد التفاصيل المكانية المفقودة خلال التقليص",
  },

};

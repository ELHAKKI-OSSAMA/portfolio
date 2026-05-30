import type { TopicContent } from './types';

export const visionContent: Record<string, TopicContent> = {

  "object-detection": {
    id: "object-detection",
    tagline: "From image classification to locating and labelling every object in the scene",
    taglineFr: "De la classification d'images à la localisation et l'étiquetage de chaque objet dans la scène",
    taglineAr: "من تصنيف الصور إلى تحديد وتسمية كل كائن في المشهد",
    accentColor: "#ec4899",
    visualization: "object-detection",
    keyFormulas: [
      { name: "IoU", latex: "\\text{IoU} = \\frac{|B_{\\text{pred}} \\cap B_{\\text{gt}}|}{|B_{\\text{pred}} \\cup B_{\\text{gt}}|}",  meaning: "Intersection over Union — measure of bounding box quality; IoU > 0.5 is conventionally a correct detection" },
      { name: "mAP", latex: "\\text{mAP} = \\frac{1}{|C|}\\sum_{c\\in C} \\text{AP}_c = \\frac{1}{|C|}\\sum_c \\int_0^1 p(r)\\,dr", meaning: "Mean Average Precision — area under Precision-Recall curve, averaged over all classes" },
      { name: "YOLO Loss", latex: "L = \\lambda_{\\text{coord}}\\sum_{\\text{obj}} (\\Delta x^2+\\Delta y^2+\\Delta w^2+\\Delta h^2) + L_{\\text{obj}} + L_{\\text{cls}}", meaning: "Weighted sum: box regression + objectness confidence + class probabilities" },
      { name: "NMS", latex: "\\text{keep} = \\{b^* \\mid \\nexists\\, b' :\\, \\text{conf}(b') > \\text{conf}(b^*)\\;\\text{and}\\;\\text{IoU}(b^*,b') > \\tau\\}", meaning: "Keep only the most confident box when multiple boxes heavily overlap the same object" },
    ],
    sections: [
      {
        type: "motivation",
        heading: "Beyond Classification: Where and What?",
        text: "Image classification answers 'is there a cat?' Detection answers 'where are the cats, and are there also dogs?' This shift from a single label to a variable number of (class, bounding-box) outputs is what makes object detection the core task in autonomous driving, medical imaging, retail checkout, and surveillance. Every self-driving car runs a real-time detector processing 30+ frames per second. The evolution from sliding-window classifiers (DPM, 2010) → two-stage detectors (RCNN, 2014; Faster-RCNN, 2015) → single-stage detectors (YOLO v1, 2016 → v8, 2023) is one of the fastest-moving areas in computer vision.",
        callout: "Tesla's Autopilot runs 8 cameras through a custom detection network at 36 FPS on a 72 TOPS custom chip. The entire model must fit in a tight latency budget while detecting objects 200m away.",
      },
      {
        type: "intuition",
        heading: "Two-Stage vs One-Stage: The Fundamental Trade-off",
        text: "**Two-stage detectors (Faster-RCNN):** Stage 1 — Region Proposal Network (RPN) suggests ~300 candidate regions that might contain objects. Stage 2 — a classification + regression head refines each proposal. Pro: high accuracy (easier to classify a cropped region). Con: slow (sequential stages). **One-stage detectors (YOLO, SSD):** Divide the image into a grid. Each cell directly predicts bounding box offsets, objectness score, and class probabilities in a single forward pass. Pro: fast (real-time capable). Con: harder to train, misses small/overlapping objects. **Anchor-based vs anchor-free:** YOLO v1-v3 used anchor boxes (predefined aspect ratios). YOLO v8 / FCOS / CenterNet are anchor-free — predict box center + width/height directly, simpler and often better.",
        callout: "YOLO = 'You Only Look Once.' The insight: instead of running a classifier at thousands of sliding window positions, predict all boxes simultaneously in one pass of the network.",
      },
      {
        type: "algorithm",
        heading: "YOLO Inference Pipeline",
        steps: [
          "Divide input image into an S×S grid (e.g., 13×13 for 416px input in YOLO v2).",
          "For each cell: predict B bounding boxes (each: x, y, w, h relative to cell, + objectness score) and C class probabilities.",
          "Box coordinates: x, y are offsets from cell center (0–1), w/h are log-scale offsets from anchor sizes.",
          "Objectness × class probability = class-specific confidence score for each box.",
          "Apply Non-Maximum Suppression (NMS): for each class, sort boxes by confidence, keep highest-confidence box, suppress boxes with IoU > 0.5 with the kept box, repeat.",
          "Final output: variable-length list of (class, confidence, x1, y1, x2, y2) tuples.",
        ],
      },
      {
        type: "code",
        heading: "Object Detection with YOLOv8 (Ultralytics)",
        language: "python",
        code: `# pip install ultralytics
from ultralytics import YOLO
import numpy as np
import cv2

# ── 1. Load pretrained YOLO v8 ────────────────────────────────────────────────
model = YOLO("yolov8n.pt")   # nano model (3.2M params, fastest)
# Other sizes: yolov8s.pt, yolov8m.pt, yolov8l.pt, yolov8x.pt

# ── 2. Inference on a single image ────────────────────────────────────────────
results = model("path/to/image.jpg", conf=0.25, iou=0.5)

for r in results:
    boxes = r.boxes                  # Boxes object
    for box in boxes:
        x1, y1, x2, y2 = box.xyxy[0].tolist()  # absolute pixel coords
        conf  = box.conf[0].item()              # confidence score
        cls   = int(box.cls[0].item())          # class index
        label = model.names[cls]
        print(f"{label}: {conf:.2f} at ({x1:.0f},{y1:.0f},{x2:.0f},{y2:.0f})")

# ── 3. Fine-tuning on custom dataset ─────────────────────────────────────────
# Dataset format: YOLO txt format
# data.yaml:
#   train: /path/to/train/images
#   val:   /path/to/val/images
#   nc: 3                       # number of classes
#   names: ['cat', 'dog', 'car']

model = YOLO("yolov8s.pt")     # start from ImageNet pretrained
results = model.train(
    data="data.yaml",
    epochs=50,
    imgsz=640,
    batch=16,
    lr0=0.01,                   # initial learning rate
    lrf=0.01,                   # final lr fraction
    augment=True,               # mosaic, flip, scale augmentation
    device=0,                   # GPU 0
)
print(f"mAP50: {results.metrics.mAP50:.4f}")

# ── 4. IoU calculation from scratch ──────────────────────────────────────────
def iou(box1, box2):
    """box = [x1, y1, x2, y2]"""
    x1 = max(box1[0], box2[0]); y1 = max(box1[1], box2[1])
    x2 = min(box1[2], box2[2]); y2 = min(box1[3], box2[3])
    inter = max(0, x2-x1) * max(0, y2-y1)
    area1 = (box1[2]-box1[0]) * (box1[3]-box1[1])
    area2 = (box2[2]-box2[0]) * (box2[3]-box2[1])
    return inter / (area1 + area2 - inter + 1e-6)

gt   = [100, 50, 250, 200]
pred = [110, 60, 260, 210]
print(f"\\nIoU = {iou(gt, pred):.4f}")

# ── 5. Manual NMS ─────────────────────────────────────────────────────────────
def nms(boxes, scores, iou_threshold=0.5):
    """Boxes: (N,4) xyxy, Scores: (N,)"""
    order = np.argsort(scores)[::-1]
    keep  = []
    while len(order) > 0:
        i = order[0]
        keep.append(i)
        ious = np.array([iou(boxes[i], boxes[j]) for j in order[1:]])
        order = order[1:][ious < iou_threshold]
    return keep

boxes  = np.array([[100,50,250,200],[105,55,255,205],[200,100,350,250]])
scores = np.array([0.95, 0.87, 0.72])
kept   = nms(boxes, scores)
print(f"Kept boxes: {kept}")  # [0, 2] — box 1 suppressed (overlaps with 0)`,
      },
      {
        type: "pitfall",
        heading: "mAP and the IoU Threshold Trap",
        text: "mAP@0.5 (IoU threshold 0.5) and mAP@0.5:0.95 (average over IoU thresholds from 0.5 to 0.95 in 0.05 steps) tell very different stories. A model with great mAP@0.5 but poor mAP@0.5:0.95 localises objects loosely — fine for coarse tasks, bad for robotic grasping. Also: mAP treats all classes equally, which hides poor performance on rare classes. For imbalanced datasets (e.g., rare traffic signs), report per-class AP separately. Common training pitfalls: (1) Forgetting to normalize bounding box coordinates to image size. (2) Using confidence threshold too low during NMS — keep conf_threshold ≈ 0.25 during inference. (3) Overfitting on small datasets — always use strong augmentation (mosaic, random crop, color jitter).",
        callout: "A 1% mAP improvement on COCO benchmark (an 80-class, 330k image dataset) represents months of research — context matters when comparing models in your domain.",
      },
    ],
  },

  "image-segmentation": {
    id: "image-segmentation",
    tagline: "Classify every single pixel — semantic masks, instance boundaries, and panoptic understanding",
    taglineFr: "Classer chaque pixel — masques sémantiques, contours d'instances et compréhension panoptique",
    taglineAr: "تصنيف كل بكسل — أقنعة دلالية وحدود المثيلات والفهم الشامل",
    accentColor: "#ec4899",
    visualization: "segmentation",
    keyFormulas: [
      { name: "Dice Loss", latex: "\\mathcal{L}_{\\text{Dice}} = 1 - \\frac{2|P \\cap G|}{|P| + |G|}", meaning: "Measures overlap between predicted and ground-truth masks — robust to class imbalance" },
      { name: "mIoU", latex: "\\text{mIoU} = \\frac{1}{C}\\sum_{c=1}^C \\frac{\\text{TP}_c}{\\text{TP}_c + \\text{FP}_c + \\text{FN}_c}", meaning: "Mean Intersection over Union per class — standard segmentation metric" },
      { name: "Skip Connection", latex: "y_l = F(x_l, W_l) + x_l", meaning: "UNet residual connection merges encoder features with decoder features — recovers spatial details lost in downsampling" },
    ],
    sections: [
      {
        type: "motivation",
        heading: "Segmentation: Pixel-Level Understanding",
        text: "Object detection gives bounding boxes — rough approximations. Segmentation gives pixel-perfect masks. This matters for: medical imaging (delineate a tumour boundary precisely for radiotherapy planning), autonomous driving (distinguish drivable surface from sidewalk at every pixel), satellite imagery (calculate crop area to 1m² precision), portrait mode (separate person from background for bokeh effect). Three levels: **Semantic segmentation** — label each pixel with a class (no instance distinction). **Instance segmentation** — detect and mask individual object instances (Mask R-CNN). **Panoptic segmentation** — combined: things (instances) + stuff (amorphous regions like sky/road).",
        callout: "A radiologist delineating a tumour by hand takes 30–60 minutes per scan. An AI segmentation model does it in < 1 second — the bottleneck shifts to verifying AI output, not producing it.",
      },
      {
        type: "intuition",
        heading: "Encoder–Decoder Architecture (UNet)",
        text: "UNet is the canonical segmentation architecture. The encoder (contracting path) is a CNN that progressively downsamples the feature map — learning 'what' is in the image, losing 'where'. The decoder (expanding path) progressively upsamples back to the original resolution using transposed convolutions or bilinear upsampling — recovering 'where'. The key innovation: skip connections that directly concatenate encoder feature maps at each resolution to their decoder counterpart. These skip connections let the model combine high-level semantic features (from deep encoder layers) with low-level spatial detail (from shallow encoder layers) — essential for sharp, accurate boundaries.",
        callout: "UNet was designed for biomedical segmentation in 2015 with very few training images (~30). The architecture's data efficiency comes from skip connections and heavy data augmentation.",
      },
      {
        type: "code",
        heading: "Segmentation with torchvision and Albumentations",
        language: "python",
        code: `import torch
import torch.nn as nn
import torchvision.models as models
from torchvision.models.segmentation import DeepLabV3_ResNet101_Weights

# ── 1. Pretrained semantic segmentation (DeepLabV3) ───────────────────────────
model = models.segmentation.deeplabv3_resnet101(
    weights=DeepLabV3_ResNet101_Weights.DEFAULT
)
model.eval()

# Inference
from PIL import Image
import torchvision.transforms.functional as F
import numpy as np

img = Image.open("street.jpg").convert("RGB")
img_t = F.to_tensor(img).unsqueeze(0)   # (1, 3, H, W)
img_t = F.normalize(img_t, mean=[0.485,0.456,0.406], std=[0.229,0.224,0.225])

with torch.no_grad():
    output = model(img_t)["out"]         # (1, 21, H, W) — 21 PASCAL VOC classes
pred_mask = output.argmax(dim=1)[0]     # (H, W) class labels

# ── 2. Minimal UNet ────────────────────────────────────────────────────────────
class DoubleConv(nn.Module):
    def __init__(self, in_ch, out_ch):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(in_ch, out_ch, 3, padding=1, bias=False),
            nn.BatchNorm2d(out_ch), nn.ReLU(inplace=True),
            nn.Conv2d(out_ch, out_ch, 3, padding=1, bias=False),
            nn.BatchNorm2d(out_ch), nn.ReLU(inplace=True),
        )
    def forward(self, x): return self.conv(x)

class UNet(nn.Module):
    def __init__(self, in_channels=3, n_classes=2, base_channels=64):
        super().__init__()
        bc = base_channels
        # Encoder
        self.enc1 = DoubleConv(in_channels, bc)
        self.enc2 = DoubleConv(bc, bc*2)
        self.enc3 = DoubleConv(bc*2, bc*4)
        self.pool = nn.MaxPool2d(2)
        # Bottleneck
        self.bottleneck = DoubleConv(bc*4, bc*8)
        # Decoder
        self.up3  = nn.ConvTranspose2d(bc*8, bc*4, 2, stride=2)
        self.dec3 = DoubleConv(bc*8, bc*4)   # bc*8 because of skip connection
        self.up2  = nn.ConvTranspose2d(bc*4, bc*2, 2, stride=2)
        self.dec2 = DoubleConv(bc*4, bc*2)
        self.up1  = nn.ConvTranspose2d(bc*2, bc, 2, stride=2)
        self.dec1 = DoubleConv(bc*2, bc)
        # Output
        self.out  = nn.Conv2d(bc, n_classes, 1)

    def forward(self, x):
        e1 = self.enc1(x)
        e2 = self.enc2(self.pool(e1))
        e3 = self.enc3(self.pool(e2))
        b  = self.bottleneck(self.pool(e3))
        d3 = self.dec3(torch.cat([self.up3(b),  e3], dim=1))
        d2 = self.dec2(torch.cat([self.up2(d3), e2], dim=1))
        d1 = self.dec1(torch.cat([self.up1(d2), e1], dim=1))
        return self.out(d1)

unet = UNet(n_classes=2)
x = torch.randn(2, 3, 256, 256)
out = unet(x)
print(f"UNet output: {out.shape}")   # (2, 2, 256, 256)

# ── 3. Dice loss ──────────────────────────────────────────────────────────────
def dice_loss(pred, target, eps=1e-6):
    """pred: (B, C, H, W) softmax, target: (B, H, W) long"""
    pred_soft = torch.softmax(pred, dim=1)
    target_oh = torch.zeros_like(pred_soft)
    target_oh.scatter_(1, target.unsqueeze(1), 1)
    inter = (pred_soft * target_oh).sum(dim=(2,3))
    union = pred_soft.sum(dim=(2,3)) + target_oh.sum(dim=(2,3))
    return 1 - (2*inter + eps) / (union + eps)

pred   = torch.randn(2, 2, 64, 64)
target = torch.randint(0, 2, (2, 64, 64))
loss   = dice_loss(pred, target).mean()
print(f"Dice loss: {loss.item():.4f}")`,
      },
      {
        type: "pitfall",
        heading: "Class Imbalance Kills Segmentation Models",
        text: "In most segmentation tasks the background class dominates — a self-driving scene might be 95% sky+road and 5% pedestrians. Cross-entropy treats all pixels equally, so the model learns to predict 'background' everywhere and gets 95% accuracy while missing every pedestrian. Solutions: (1) Weighted cross-entropy — weight the loss inversely by class frequency. (2) Dice loss — naturally insensitive to imbalance because it measures overlap ratio, not pixel count. (3) Focal loss (from RetinaNet) — downweights well-classified pixels so training focuses on hard examples. In practice, combine: total_loss = cross_entropy + dice_loss works best for medical imaging.",
        callout: "Always check the IoU per class in your validation metrics — global accuracy hides bad performance on small/rare classes that are often the ones that matter most.",
      },
    ],
  },

};

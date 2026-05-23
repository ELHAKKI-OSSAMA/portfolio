import { GITHUB_URL } from '../personal';
import type { Project } from './types';

export const projectsPart1: Project[] = [
  // ── FEATURED ──────────────────────────────────────────────────────────────
  {
    id: "ieee-fraud",
    title: "IEEE-CIS Fraud Detection",
    description: "Full ML pipeline on 590K transactions, 433 features. LightGBM AUC 0.9648 — stacking ensemble LGB+XGB+CatBoost+RF with advanced feature engineering on Vesta behavioral features.",
    longDescription: `Built a production-grade fraud detection pipeline on one of Kaggle's hardest datasets — 590K transactions, 433 features, 3.5% fraud rate. Applied StratifiedKFold CV with 6 models and a stacking meta-learner.

**Feature Engineering:**
- Time-based features: hour of day, day of week, TransactionDT cycles
- Card behavioral fingerprints: mean/std/count of TransactionAmt per card group
- Email domain matching flag (P_emaildomain == R_emaildomain)
- M-column boolean aggregations (M1–M9 T/F/missing counts)
- Dropped 12 columns with >90% missing values

**Model Results:**
| Model | OOF AUC |
|-------|---------|
| LightGBM | **0.9648** |
| XGBoost | 0.9631 |
| CatBoost | 0.9529 |
| Stacking (LR meta) | 0.9565 |
| Random Forest | 0.9032 |
| Decision Tree | 0.8583 |

**Key insight:** LightGBM's native handling of missing values and categorical features gave it a decisive edge. Card-level behavioral aggregations were the single highest-impact feature group.`,
    category: ["fraud"],
    tags: ["LightGBM", "XGBoost", "CatBoost", "Stacking", "Feature Engineering", "StratifiedKFold"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: true,
    metrics: "AUC: 0.9648",
    dataset: "590,540 transactions, 433 features, 3.5% fraud rate",
    results: [
      { label: "LightGBM AUC", value: "0.9648" },
      { label: "Stacking AUC", value: "0.9565" },
      { label: "Baseline (LR)", value: "0.8506" },
      { label: "Features", value: "459 (after FE)" },
    ],
    techStack: ["Python", "LightGBM", "XGBoost", "CatBoost", "Scikit-learn", "Pandas", "NumPy"],
    approach: "Stacking ensemble with StratifiedKFold cross-validation and behavioral feature engineering",
  },
  {
    id: "ai-image-gen",
    title: "AI Image Generation Platform (Ofoto)",
    description: "Production deployment of Stable Diffusion (Automatic1111 + ControlNet) with FastAPI backend, Vue.js frontend — 500+ concurrent requests, 99.9% uptime, -35% latency, -40% release time.",
    longDescription: `End-to-end production deployment of an AI image-generation platform at Ofoto. The challenge: handle 500+ concurrent Stable Diffusion inference requests with consistent quality and sub-10s response times.

**Architecture:**
\`\`\`
Client (Vue.js) → Nginx (SSL + Load Balancing) → FastAPI (async queuing)
→ Stable Diffusion Engine (Automatic1111 + ControlNet)
→ Docker containers (GPU-accelerated)
\`\`\`

**Key Engineering Decisions:**
1. **Async request queuing** with FastAPI background tasks — never blocks main thread
2. **Nginx keepalive connections** — dramatically reduced overhead at high load
3. **Docker multi-stage build** with CUDA 11.8 for GPU access
4. **Health check endpoints** for container orchestration and zero-downtime deploys
5. **ControlNet integration** for image-conditioned generation (pose, depth, canny)

**Results:**
| Metric | Before | After |
|--------|--------|-------|
| Avg latency | 12.4s | 8.1s |
| Concurrent requests | 50 | 500+ |
| Service uptime | 94% | 99.9% |
| Release cycle | 5 days | 3 days |`,
    category: ["genai", "deployment"],
    tags: ["Stable Diffusion", "ControlNet", "FastAPI", "Vue.js", "Docker", "Nginx", "GPU"],
    githubUrl: GITHUB_URL,
    featured: true,
    metrics: "99.9% uptime, -35% latency",
    results: [
      { label: "Uptime", value: "99.9%" },
      { label: "Latency reduction", value: "-35%" },
      { label: "Concurrent requests", value: "500+" },
      { label: "Release time reduction", value: "-40%" },
    ],
    techStack: ["Python", "FastAPI", "Stable Diffusion", "ControlNet", "Vue.js", "Docker", "Nginx", "CUDA"],
    approach: "Async FastAPI + containerized Stable Diffusion engine behind Nginx load balancer",
  },
  {
    id: "whatsapp-agent",
    title: "WhatsApp AI Sales Agent",
    description: "Production AI sales agent on WhatsApp Business. Classifies messages (Sales/Support/Off-topic), queries Supabase product DB, uses Ollama/Llama3.1 locally, bilingual FR/AR, conversation memory. -90% manual processing time.",
    longDescription: `Built a fully automated AI sales agent for a Moroccan e-commerce client that was spending 6+ hours/day answering repetitive WhatsApp product questions.

**Architecture:**
\`\`\`
WhatsApp Business API → n8n Webhook
→ Text Classifier (LLM intent detection)
  ├── SALES → AI Agent (Llama3.1 + db_product tool)
  ├── SUPPORT → Support Agent
  └── OFF_TOPIC → Auto-rejection message
→ Supabase (product DB + conversation memory)
→ WhatsApp Business API (reply)
\`\`\`

**Why Local LLM (Ollama)?**
- No conversation data leaves the server (privacy)
- Zero API costs for high-volume messaging
- Full model behavior control

**System prompt design (anti-hallucination):**
> "NEVER answer product questions without calling db_product first. ONLY present data returned by the tool. If product not found → honestly inform the customer."

**n8n Nodes:** Webhook → Text Classifier → AI Agent → Supabase → HTTP Request (WhatsApp)

**Results:**
- -90% manual processing time for product queries
- 95%+ accurate message classification (Sales/Support/Off-topic)
- Bilingual FR/AR responses auto-matching customer language
- Conversation memory prevents repeated questions`,
    category: ["agents"],
    tags: ["n8n", "LLM", "WhatsApp", "Ollama", "Llama3.1", "Supabase", "Automation"],
    githubUrl: GITHUB_URL,
    featured: true,
    metrics: "-90% processing time",
    results: [
      { label: "Processing time reduction", value: "-90%" },
      { label: "Classification accuracy", value: "95%+" },
      { label: "Languages supported", value: "FR / AR" },
      { label: "n8n nodes", value: "41" },
    ],
    techStack: ["n8n", "Ollama", "Llama3.1", "Supabase", "WhatsApp Business API", "JavaScript"],
    approach: "Intent classification → specialized AI agent routing with database-grounded responses",
  },
  {
    id: "cancer-segmentation",
    title: "Breast Cancer Ultrasound Segmentation",
    description: "Medical image segmentation with 8 architectures tested (FCN → EfficientNet-UNet). Best: EfficientNet-UNet with Dice 0.7964, IoU 0.6754 on 780 breast ultrasound images (benign/malignant/normal).",
    longDescription: `Comprehensive benchmark of 8 segmentation architectures on the Breast Ultrasound Images dataset (780 samples: 437 benign, 210 malignant, 133 normal).

**Models tested:**
| Architecture | Type | Dice | IoU |
|---|---|---|---|
| FCN | Normal | 0.5104 | 0.3469 |
| SimpleUNet (31M) | Normal | 0.7202 | 0.5666 |
| SegNet (7M) | Normal | 0.6661 | 0.4907 |
| Attention UNet (31M) | Advanced | 0.7329 | 0.5868 |
| TransUNet (124M) | Advanced | 0.6794 | 0.5165 |
| ResNet34-UNet (24M) | Advanced | 0.8026 | 0.6759 |
| **EfficientNet-UNet (20M)** | **Advanced** | **0.7964** | **0.6754** |
| DeepLabV3+ (27M) | Advanced | — | — |

**Training details:** 30 epochs, 256×256 px, Albumentations augmentation (flip, rotation, brightness), combined BCE+Dice loss.

**Best model (EfficientNet-UNet):** EfficientNet-B4 pretrained encoder + UNet decoder. Saved as BEST_EfficientNet_UNet.pth.

**Key finding:** Pretrained EfficientNet encoder provides rich feature representations that outperform even larger models like ResNet34-UNet on this dataset size.`,
    category: ["medical", "cv"],
    tags: ["U-Net", "EfficientNet", "Segmentation", "PyTorch", "Medical Imaging", "TorchMetrics"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: true,
    metrics: "Dice: 0.7964 | IoU: 0.6754",
    dataset: "780 breast ultrasound images (437 benign, 210 malignant, 133 normal)",
    results: [
      { label: "Best Dice (EfficientNet-UNet)", value: "0.7964" },
      { label: "Best IoU", value: "0.6754" },
      { label: "Architectures tested", value: "8" },
      { label: "Dataset size", value: "780 images" },
    ],
    techStack: ["Python", "PyTorch", "segmentation_models_pytorch", "timm", "Albumentations", "CUDA Tesla T4"],
    approach: "Systematic benchmark of 8 architectures from FCN to ViT-based TransUNet",
  },
  {
    id: "ethereum-fraud",
    title: "Ethereum Blockchain Fraud Detection",
    description: "Blockchain fraud detection on 9,841 Ethereum addresses. XGBoost+LightGBM+CatBoost+Stacking ensemble with Optuna HPO and SHAP explainability. AUC 0.9973, F1 0.9658 at optimal threshold.",
    longDescription: `Two-stage pipeline (Baseline + Advanced) to detect fraudulent Ethereum addresses from on-chain behavioral features.

**Dataset:** 9,841 addresses, 51 features including ERC20 transaction patterns, sent/received amounts, unique addresses, timing patterns.

**Stage 1 — Baseline:**
| Model | AUC | F1 (Fraud) |
|-------|-----|------------|
| Logistic Regression | 0.8419 | 0.0386 |
| Random Forest | **0.9973** | 0.9566 |

**Stage 2 — Advanced pipeline:**
1. Feature engineering (56 features after engineering)
2. SMOTE oversampling (11,070 samples, 50% fraud rate)
3. Optuna HPO for XGBoost (40 trials) → Best AUC: **0.9992**
4. Train XGBoost + LightGBM + CatBoost ensemble
5. Threshold tuning to maximize F1

**Final Results:**
| Model | AUC | F1 (Fraud) |
|-------|-----|------------|
| XGBoost | 0.9971 | 0.9659 |
| LightGBM | 0.9972 | 0.9569 |
| CatBoost | 0.9969 | 0.9584 |
| **Stacking** | **0.9973** | — |

**Best threshold: 0.85 → F1: 0.9658**

**SHAP analysis:** Top fraud indicators — ERC20 transaction patterns, unique address count, total ether sent ratios.`,
    category: ["fraud"],
    tags: ["XGBoost", "LightGBM", "CatBoost", "SMOTE", "Optuna", "SHAP", "Blockchain"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: true,
    metrics: "AUC: 0.9973 | F1: 0.9658",
    dataset: "9,841 Ethereum addresses, 51 on-chain behavioral features",
    results: [
      { label: "Stacking AUC", value: "0.9973" },
      { label: "F1 Score (Fraud)", value: "0.9658" },
      { label: "Optimal threshold", value: "0.85" },
      { label: "Optuna best AUC", value: "0.9992" },
    ],
    techStack: ["Python", "XGBoost", "LightGBM", "CatBoost", "Optuna", "SHAP", "SMOTE (imbalanced-learn)"],
    approach: "Baseline → Advanced pipeline with SMOTE + Optuna HPO + stacking ensemble + threshold tuning",
  },
  {
    id: "nmt",
    title: "English → French Neural Machine Translation",
    description: "Memory-safe NMT handling a 6 GB dataset without RAM crashes. Seq2Seq from scratch + HuggingFace mBART/Helsinki-NLP fine-tuning. Fixed 5 critical bugs from upstream implementations.",
    longDescription: `Memory-safe NMT notebook that handles a 6 GB parallel corpus without crashing on Kaggle's 33 GB RAM limit.

**Strategy:** Chunked reading → sample → delete raw data → train on subset → clear between models.

**5 critical bugs fixed from upstream implementations:**
1. \`train_step\` → GradientTape consumed twice → None gradients crash
2. \`Encoder/Decoder.call()\` → missing \`training=\` kwarg → TypeError
3. \`as_target_tokenizer()\` → removed in transformers≥4.36 → AttributeError
4. \`evaluation_strategy\` → renamed \`eval_strategy\` in transformers≥4.36
5. int16 array overflow in tokenizer

**Models implemented:**
- Custom Seq2Seq (LSTM encoder-decoder with Bahdanau attention)
- HuggingFace mBART fine-tuning
- Helsinki-NLP/opus-mt-en-fr fine-tuning
- MarianMT fine-tuning

**Tech:** TensorFlow 2.19, PyTorch 2.9 (CUDA), HuggingFace Transformers 4.36+`,
    category: ["nlp"],
    tags: ["Seq2Seq", "BERT", "mBART", "MarianMT", "HuggingFace", "NMT", "TensorFlow", "PyTorch"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: true,
    dataset: "6 GB English-French parallel corpus",
    techStack: ["Python", "TensorFlow", "PyTorch", "HuggingFace Transformers", "mBART", "Helsinki-NLP"],
    approach: "Memory-safe chunked loading with custom Seq2Seq + pretrained HuggingFace model fine-tuning",
  },

  // ── MORE PROJECTS ──────────────────────────────────────────────────────────
  {
    id: "twitter-sentiment",
    title: "Twitter Sentiment Analysis",
    description: "5-model NLP pipeline on 74K tweets: LR+TF-IDF (96.1% accuracy) → LSTM → Bi-LSTM → CNN → BERT fine-tuning. 4-class classification: Positive, Negative, Neutral, Irrelevant.",
    longDescription: `End-to-end NLP pipeline benchmarking 5 architectures on the Twitter Entity Sentiment dataset (74,682 training tweets, 4 classes).

**Models & Results:**
| Model | Accuracy |
|-------|----------|
| **LR + TF-IDF** | **96.1%** |
| LSTM | — |
| Bi-LSTM | — |
| CNN (text) | — |
| BERT fine-tuned | — |

**Pipeline:** Tweet cleaning → tokenization → TF-IDF/BoW/embeddings → model training → threshold-optimized classification.

**Key finding:** LR+TF-IDF achieves 96.1% accuracy on this dataset — competitive with much heavier deep learning models, demonstrating the importance of feature quality over model complexity for well-formatted text.`,
    category: ["nlp"],
    tags: ["BERT", "LSTM", "Bi-LSTM", "TF-IDF", "Sentiment", "Twitter", "Text Classification"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: false,
    metrics: "96.1% accuracy",
    dataset: "74,682 Twitter tweets, 4-class (Positive/Negative/Neutral/Irrelevant)",
    results: [
      { label: "LR+TF-IDF Accuracy", value: "96.1%" },
      { label: "Dataset size", value: "74,682 tweets" },
      { label: "Classes", value: "4" },
      { label: "Models tested", value: "5" },
    ],
    techStack: ["Python", "Scikit-learn", "TensorFlow", "PyTorch", "HuggingFace BERT", "NLTK"],
    approach: "Benchmark from classical ML (TF-IDF) to deep learning (BERT) on tweet sentiment",
  },
  {
    id: "fake-news",
    title: "Fake News Detection",
    description: "Multi-model NLP pipeline on 44,898 news articles (21K real + 23K fake). Logistic Regression, Naive Bayes, Random Forest, XGBoost, LightGBM, LinearSVC, BERT. Full TF-IDF + Voting Ensemble.",
    longDescription: `Comprehensive fake news detection pipeline benchmarking 8+ models on a balanced dataset of 44,898 articles.

**Dataset:** 21,417 real + 23,481 fake news articles with title, text, subject, date features.

**Models covered:**
- Baseline: Logistic Regression, Naive Bayes
- Tree-based: Decision Tree, Random Forest, Extra Trees
- Boosting: XGBoost, LightGBM, Gradient Boosting
- SVM: LinearSVC
- Advanced NLP: TF-IDF + Voting Ensemble, stacked BERT features

**Feature engineering:** Title + text concatenation, TF-IDF (unigrams + bigrams), subject encoding, temporal features from publication date.

**Key insight:** LinearSVC with TF-IDF achieves near-BERT performance at 100x lower inference cost on this task.`,
    category: ["nlp"],
    tags: ["NLP", "BERT", "LinearSVC", "TF-IDF", "XGBoost", "LightGBM", "Text Classification"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: false,
    dataset: "44,898 articles (21K real + 23K fake)",
    techStack: ["Python", "Scikit-learn", "XGBoost", "LightGBM", "HuggingFace", "NLTK"],
    approach: "8-model benchmark from Naive Bayes to BERT on news text classification",
  },
  {
    id: "human-activity",
    title: "Human Activity Recognition (HAR)",
    description: "6-activity classification from Samsung Galaxy S II sensor data. SVM achieves 96.1% accuracy on 561 time/frequency-domain features. Benchmark of 7 models including XGBoost (CV: 99.05%) and LightGBM.",
    longDescription: `End-to-end ML pipeline on the UCI HAR dataset — accelerometer and gyroscope signals from 30 subjects performing 6 activities.

**Dataset:** 7,352 train / 2,947 test samples, 561 pre-extracted features, 6 classes.

**Activities:** Walking, Walking Upstairs, Walking Downstairs, Sitting, Standing, Laying.

**Full model benchmark:**
| Model | Test Accuracy |
|-------|--------------|
| **SVM (Linear)** | **96.1%** |
| Logistic Regression | 95.5% |
| SVM (RBF) | 95.5% |
| Stacking (RF+XGB+LGBM→LR) | 95.2% |
| XGBoost | 94.1% |
| LightGBM | 94.0% |
| Random Forest | 92.7% |

**Cross-validation (5-fold):**
- XGBoost: **99.05% ± 0.10%**
- LightGBM: **99.25% ± 0.04%**

**PCA analysis:** 102 components explain 95% variance.

**Top error source:** Sitting/Standing confusion (55 + 18 misclassifications) — sensors capture similar postures.`,
    category: ["cv"],
    tags: ["SVM", "XGBoost", "LightGBM", "PCA", "Sensor Data", "Time Series", "UCI HAR"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: false,
    metrics: "96.1% accuracy (SVM)",
    dataset: "UCI HAR: 7,352 train samples, 561 features, 6 activities, 30 subjects",
    results: [
      { label: "SVM (Linear) accuracy", value: "96.1%" },
      { label: "XGBoost 5-fold CV", value: "99.05%" },
      { label: "LightGBM 5-fold CV", value: "99.25%" },
      { label: "PCA components (95%)", value: "102" },
    ],
    techStack: ["Python", "Scikit-learn", "XGBoost", "LightGBM", "PCA", "Pandas", "NumPy"],
    approach: "Extensive model benchmark with PCA dimensionality reduction on sensor-derived features",
  },
  {
    id: "telco-churn",
    title: "Telco Customer Churn Prediction",
    description: "End-to-end churn pipeline on 7,043 customers: classic models (LR/DT/RF/SVM/KNN) → XGBoost/LightGBM/CatBoost → Voting/Stacking ensemble → Optuna HPO → SHAP interpretability.",
    category: ["fraud"],
    tags: ["XGBoost", "LightGBM", "CatBoost", "Optuna", "SHAP", "Churn", "Customer Analytics"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: false,
    dataset: "7,043 telecom customers, 21 features",
    techStack: ["Python", "XGBoost", "LightGBM", "CatBoost", "Optuna", "SHAP", "Scikit-learn"],
    approach: "7-model benchmark → Optuna-tuned ensemble → SHAP feature importance analysis",
  },
  {
    id: "vehicle-fraud",
    title: "Vehicle Insurance Claim Fraud",
    description: "End-to-end fraud detection for 15,420 insurance claims (6% fraud rate). SMOTE balancing, XGBoost AUC 0.9847 (5-fold CV), SHAP analysis. Top features: Fault, Deductible, BasePolicy.",
    longDescription: `Complete ML pipeline for vehicle insurance fraud detection with a severe class imbalance challenge (6% fraud rate).

**Dataset:** 15,420 rows, 33 features (vehicle make, accident area, policy type, deductible, etc.).

**Class imbalance solution:** SMOTE oversampling (6% → 50% fraud in training).

**Model pipeline:**
| Model | ROC-AUC | Precision | Recall |
|-------|---------|-----------|--------|
| Logistic Regression | 0.7651 | — | — |
| AdaBoost | 0.7804 | — | — |
| Random Forest | 0.7962 | — | — |
| XGBoost | 0.8141 | — | — |
| Voting (XGB+LGB+CB) | 0.8194 | — | — |

**After RandomizedSearchCV (40 iter, 5-fold):**
- XGBoost CV AUC: **0.9847**
- Best params: subsample=0.7, max_depth=7, n_estimators=500

**SHAP top features:** Fault (37.9%), Deductible (12.9%), BasePolicy (12.2%), VehicleCategory, PoliceReportFiled.`,
    category: ["fraud"],
    tags: ["XGBoost", "SMOTE", "SHAP", "Insurance", "RandomizedSearchCV", "CatBoost"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: false,
    metrics: "AUC: 0.9847 (5-fold CV)",
    dataset: "15,420 insurance claims, 33 features, 6% fraud rate",
    results: [
      { label: "XGBoost CV AUC", value: "0.9847" },
      { label: "Voting ensemble AUC", value: "0.8194" },
      { label: "Fraud rate", value: "5.99%" },
      { label: "Top SHAP feature", value: "Fault (37.9%)" },
    ],
    techStack: ["Python", "XGBoost", "LightGBM", "CatBoost", "SMOTE", "SHAP", "Scikit-learn"],
    approach: "SMOTE oversampling → model benchmark → RandomizedSearchCV HPO → SHAP analysis",
  },
  {
    id: "face-recognition",
    title: "Face Recognition Person Search System",
    description: "Zero-shot face recognition pipeline using pretrained ResNet embeddings. Identifies query persons from LFW dataset (5,749 people, 13K+ images) with cosine similarity matching and bounding box visualization.",
    category: ["cv"],
    tags: ["Face Recognition", "ResNet", "Embeddings", "LFW", "Cosine Similarity", "DeepFace"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: false,
    dataset: "LFW (Labeled Faces in the Wild): 5,749 identities, 13K+ images",
    techStack: ["Python", "PyTorch", "face_recognition", "ResNet", "OpenCV"],
    approach: "Pretrained ResNet face embeddings + cosine similarity search — no training required",
  },
  {
    id: "facial-emotion",
    title: "Facial Emotion Recognition",
    description: "CNN-based 7-class emotion classification (angry/disgust/fear/happy/neutral/sad/surprise) from facial images with data augmentation and transfer learning.",
    category: ["cv"],
    tags: ["CNN", "Emotion Recognition", "Computer Vision", "Transfer Learning", "Data Augmentation"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: false,
    techStack: ["Python", "TensorFlow/Keras", "OpenCV", "CNN"],
    approach: "Transfer learning on FER dataset with custom CNN head for 7-class emotion classification",
  },
  {
    id: "yolo-parking",
    title: "YOLOv8 Smart Parking Detection",
    description: "Real-time parking slot occupancy detection (free/not_free) with YOLOv8 on a custom annotated dataset. Trained on Kaggle GPU with CVAT XML → YOLO label conversion.",
    category: ["cv"],
    tags: ["YOLOv8", "Object Detection", "CVAT", "Real-time", "Custom Dataset"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: false,
    dataset: "30 custom-annotated parking images (22 train / 4 val / 4 test)",
    techStack: ["Python", "YOLOv8 (Ultralytics)", "CVAT", "CUDA Tesla T4"],
    approach: "Custom CVAT XML annotation → YOLO format → YOLOv8 fine-tuning",
  },
  {
    id: "cancer-detection",
    title: "Cancer Detection with YOLOv8 (n/s/m)",
    description: "Object detection for cancer localization. Benchmarked YOLOv8 Nano (3.2M), Small (11.2M), and Medium (25.9M) on 1,968 training images. Best mAP50: 0.6849 (Nano). Exported to ONNX.",
    longDescription: `Comprehensive YOLOv8 benchmark for cancer detection from medical images.

**Dataset:** 1,968 train / 185 val / 94 test images (1 class: cancer). Average 1.10 bboxes per image.

**Model comparison on validation set:**
| Model | Params | mAP50 | mAP50-95 | Precision | Recall |
|-------|--------|-------|----------|-----------|--------|
| YOLOv8n | 3.2M | **0.6849** | 0.2606 | 0.7498 | 0.6134 |
| YOLOv8s | 11.2M | 0.6815 | 0.2475 | 0.7483 | 0.6237 |
| YOLOv8m | 25.9M | 0.6741 | 0.2569 | 0.7581 | 0.5722 |

**Key finding:** YOLOv8n (nano) achieves the highest mAP50 despite being the smallest model — suggesting limited dataset size makes regularization from smaller capacity beneficial. Exported best model to ONNX format.`,
    category: ["medical", "cv"],
    tags: ["YOLOv8", "Object Detection", "Medical Imaging", "ONNX", "Cancer", "Ultralytics"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: false,
    metrics: "mAP50: 0.6849",
    dataset: "1,968 cancer images, 1 class",
    results: [
      { label: "YOLOv8n mAP50", value: "0.6849" },
      { label: "YOLOv8n Precision", value: "0.7498" },
      { label: "YOLOv8n Recall", value: "0.6134" },
      { label: "Export format", value: "ONNX" },
    ],
    techStack: ["Python", "YOLOv8 (Ultralytics)", "ONNX", "CUDA Tesla T4"],
    approach: "3-variant YOLOv8 benchmark (n/s/m) with ONNX export for deployment",
  },
  {
    id: "yolo-animals",
    title: "YOLOv8 Animals Detection",
    description: "Multi-class animal detection with YOLOv8n optimized for edge deployment. Fine-tuned on animal dataset with multi-class NMS and confidence calibration.",
    category: ["cv"],
    tags: ["YOLOv8", "Object Detection", "Multi-class", "Edge Deployment"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: false,
    techStack: ["Python", "YOLOv8 (Ultralytics)", "CUDA"],
    approach: "YOLOv8n fine-tuning for lightweight multi-class animal detection",
  },
  {
    id: "plant-disease",
    title: "Plant Disease Classification",
    description: "Agricultural AI with PlantVillage dataset: Simple CNN + Deeper CNN → MobileNetV2 → EfficientNetB3 → ResNet50 → Ensemble (avg 3 TL models). 15 disease classes across peppers and potatoes.",
    longDescription: `Plant disease detection pipeline benchmarking classical and transfer learning models on the PlantVillage dataset.

**Classes:** 15 (Pepper/Potato diseases + healthy). 80/10/10 train/val/test split.

**Models:**
| Model | Type |
|-------|------|
| Simple CNN | Normal |
| Deeper CNN + BatchNorm | Normal |
| MobileNetV2 (fine-tuned) | Advanced |
| EfficientNetB3 (fine-tuned) | Advanced |
| ResNet50 (fine-tuned) | Advanced |
| Ensemble (avg 3 TL) | Advanced |

**Fixes applied:** Generator reset bug fixed (ensemble collapse), proper held-out test split, dual-GPU training (TF 2.19 mixed precision float16).`,
    category: ["cv"],
    tags: ["EfficientNetB3", "MobileNetV2", "ResNet50", "Ensemble", "Agriculture", "Transfer Learning"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: false,
    dataset: "PlantVillage: 15 classes (peppers, potatoes), 80/10/10 split",
    techStack: ["Python", "TensorFlow 2.19", "Keras", "EfficientNetB3", "MobileNetV2", "ResNet50"],
    approach: "Transfer learning ensemble of 3 pretrained models on agricultural disease images",
  },
  {
    id: "butterfly-classification",
    title: "Butterfly Species Classification",
    description: "Multi-model CNN benchmark for 75 butterfly species classification. 5,199 training + 1,300 validation samples. Custom CNN → Transfer learning comparison with full class-level accuracy analysis.",
    category: ["cv"],
    tags: ["CNN", "Transfer Learning", "Species Classification", "Data Augmentation", "Multi-class"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: false,
    dataset: "5,199 training / 1,300 validation samples, 75 butterfly species",
    techStack: ["Python", "TensorFlow/Keras", "CNN", "Data Augmentation"],
    approach: "Multi-model CNN benchmark for fine-grained 75-class species classification",
  },
  {
    id: "chest-ct",
    title: "Chest CT Scan Cancer Classification",
    description: "4-class lung cancer classification (adenocarcinoma/large cell/squamous/normal). EfficientNetV2S with mixed precision fp16 on Kaggle GPU. 195+115+148 training images per class.",
    longDescription: `Chest CT scan classification for 4 lung cancer types using EfficientNetV2S backbone.

**Classes:**
- adenocarcinoma_left.lower.lobe_T2_N0_M0_Ib (195 images)
- large.cell.carcinoma_left.hilum_T2_N2_M0_IIIa (115 images)
- normal (148 images)
- squamous cell carcinoma

**Model:** EfficientNetV2S with mixed precision float16 training.

**Improvements over baseline:**
- Enhanced augmentation: vertical flip + stronger color jitter
- Class-weighted loss for imbalanced classes
- Proper held-out test split (80/10/10)
- Full EDA: pixel intensity distributions, class counts`,
    category: ["medical"],
    tags: ["EfficientNetV2S", "CT Scan", "Cancer", "Mixed Precision", "Transfer Learning", "TensorFlow"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: false,
    dataset: "Chest CT-Scan Images: 4 classes (3 cancer types + normal)",
    techStack: ["Python", "TensorFlow 2.19", "EfficientNetV2S", "Mixed Precision (float16)", "Keras"],
    approach: "EfficientNetV2S with float16 mixed precision and class-weighted loss",
  },
  {
    id: "taco-segmentation",
    title: "TACO Trash Dataset Detection & Segmentation",
    description: "Instance segmentation of litter and trash for environmental AI applications. YOLOv8-based detection and segmentation pipeline on the TACO (Trash Annotations in Context) dataset.",
    category: ["cv"],
    tags: ["Segmentation", "YOLOv8", "Environmental AI", "Instance Segmentation", "Object Detection"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: false,
    techStack: ["Python", "YOLOv8", "COCO format", "CUDA"],
    approach: "YOLOv8 instance segmentation for multi-class trash detection",
  },
  {
    id: "sign-language",
    title: "Sign Language Digits Classification",
    description: "CNN classifier for sign language digit recognition (0-9). Includes saved model checkpoint (my_cnn_model.h5) for deployment. Trained on sign language digit images dataset.",
    category: ["cv"],
    tags: ["CNN", "Sign Language", "Accessibility", "Image Classification", "Keras"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: false,
    techStack: ["Python", "Keras/TensorFlow", "CNN"],
    approach: "Custom CNN trained for 10-class sign language digit recognition with H5 export",
  },
];

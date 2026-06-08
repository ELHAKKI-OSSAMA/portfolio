import { GITHUB_URL } from '../personal';
import type { Project } from './types';

export const projectsPart1: Project[] = [
  // ── FEATURED ──────────────────────────────────────────────────────────────
  {
    id: "ieee-fraud",
    title: "IEEE-CIS Fraud Detection",
    titleFr: "Détection de Fraude IEEE-CIS",
    titleAr: "كشف احتيال IEEE-CIS",
    description: "Full ML pipeline on 590K transactions, 433 features. LightGBM AUC 0.9648 — stacking ensemble LGB+XGB+CatBoost+RF with advanced feature engineering on Vesta behavioral features.",
    descriptionFr: "Pipeline ML complet sur 590K transactions, 433 caractéristiques. LightGBM AUC 0.9648 — ensemble de stacking LGB+XGB+CatBoost+RF avec ingénierie de caractéristiques comportementales avancées.",
    descriptionAr: "خط أنابيب ML كامل على 590K معاملة، 433 ميزة. LightGBM AUC 0.9648 — مجموعة تكدس LGB+XGB+CatBoost+RF مع هندسة ميزات سلوكية متقدمة.",
    longDescription: `Production-grade fraud detection on one of Kaggle's hardest tabular datasets — 590,540 transactions, 433 features, 3.5% fraud rate.

**Dataset**
- 590,540 transaction records joined with 144,233 identity records
- 433 features: Vesta-engineered V1–V339 + card/email/device/M-columns
- Fraud rate: **3.5%** — requires careful stratified CV and threshold tuning
- 12 columns with >90% missing values → dropped

**Feature Engineering**
| Group | Features |
|-------|---------|
| Time | Hour of day, day of week, TransactionDT periodic cycles |
| Card behavioral | Mean/std/count of TransactionAmt per card1–card6 group |
| Email match | P_emaildomain == R_emaildomain flag |
| M-columns | Aggregate T/F/missing counts across M1–M9 |
| Amount | log(TransactionAmt), cents component, round-amount flag |

**Model Results — 2-Fold Stratified CV**
| Model | OOF AUC |
|-------|---------|
| Logistic Regression | 0.8506 |
| Decision Tree | 0.8583 |
| Random Forest | 0.9032 |
| CatBoost | 0.9529 |
| XGBoost | 0.9631 |
| **LightGBM** | **0.9648** |
| Weighted Blend | 0.9478 |
| Stacking (LR meta) | 0.9565 |

**Key Insights**
- LightGBM's native missing-value handling edges out XGBoost on V-columns with 40%+ missing
- Card-level behavioral aggregations (mean/std TransactionAmt per card group) are the highest-impact feature group
- Email domain matching (P vs R) boosts recall on cross-domain transactions
- Stacking meta-learner doesn't surpass LightGBM alone — base models too correlated`,
    longDescriptionFr: `Détection de fraude de niveau production sur l'un des datasets tabulaires les plus difficiles de Kaggle — 590 540 transactions, 433 caractéristiques, taux de fraude 3,5%.

**Données**
- 590 540 enregistrements joints à 144 233 enregistrements d'identité
- 433 caractéristiques : V1–V339 (Vesta) + colonnes carte/email/appareil/M
- Taux de fraude : **3,5%** — nécessite une CV stratifiée et un réglage de seuil
- 12 colonnes avec >90% de valeurs manquantes → supprimées

**Ingénierie des caractéristiques**
| Groupe | Caractéristiques |
|-------|---------|
| Temps | Heure, jour de semaine, cycles TransactionDT |
| Carte comportementale | Moy/écart-type/compte TransactionAmt par groupe carte |
| Correspondance email | P_emaildomain == R_emaildomain |
| Colonnes M | Agrégats T/F/manquant sur M1–M9 |
| Montant | log(TransactionAmt), centimes, montant rond |

**Résultats des modèles — 2-Fold Stratified CV**
| Modèle | OOF AUC |
|-------|---------|
| Logistic Regression | 0.8506 |
| Decision Tree | 0.8583 |
| Random Forest | 0.9032 |
| CatBoost | 0.9529 |
| XGBoost | 0.9631 |
| **LightGBM** | **0.9648** |
| Weighted Blend | 0.9478 |
| Stacking (LR meta) | 0.9565 |

**Points clés**
- LightGBM gère nativement les valeurs manquantes, avantage décisif sur XGBoost pour les colonnes V à >40% de manquants
- Les agrégations comportementales au niveau carte (moy/écart-type TransactionAmt) constituent le groupe de caractéristiques à plus fort impact
- La correspondance des domaines email (P vs R) améliore le rappel sur les transactions inter-domaines
- Le méta-learner de stacking ne surpasse pas LightGBM seul — les modèles de base sont trop corrélés`,
    longDescriptionAr: `كشف احتيال بمستوى إنتاجي على أحد أصعب مجموعات البيانات الجدولية في كاغل — 590,540 معاملة، 433 ميزة، نسبة احتيال 3.5%.

**مجموعة البيانات**
- 590,540 سجل معاملة مرتبط بـ 144,233 سجل هوية
- 433 ميزة: V1–V339 (Vesta) + أعمدة البطاقة/البريد/الجهاز/M
- نسبة الاحتيال: **3.5%** — تستلزم CV طبقياً وضبط العتبة
- 12 عموداً بأكثر من 90% قيم مفقودة → محذوفة

**هندسة الميزات**
| المجموعة | الميزات |
|-------|---------|
| الوقت | ساعة اليوم، يوم الأسبوع، دورات TransactionDT |
| سلوك البطاقة | متوسط/انحراف/عدد TransactionAmt لكل مجموعة |
| تطابق البريد | P_emaildomain == R_emaildomain |
| أعمدة M | تجميعات T/F/مفقود عبر M1–M9 |
| المبلغ | log(TransactionAmt)، السنت، المبلغ المقرب |

**نتائج النماذج — 2-Fold Stratified CV**
| النموذج | OOF AUC |
|-------|---------|
| Logistic Regression | 0.8506 |
| Decision Tree | 0.8583 |
| Random Forest | 0.9032 |
| CatBoost | 0.9529 |
| XGBoost | 0.9631 |
| **LightGBM** | **0.9648** |
| Weighted Blend | 0.9478 |
| Stacking (LR meta) | 0.9565 |

**رؤى رئيسية**
- معالجة LightGBM النيتفة للقيم المفقودة تمنحها أفضلية على XGBoost في أعمدة V بأكثر من 40% مفقودات
- تجميعات السلوك على مستوى البطاقة (متوسط/انحراف TransactionAmt) هي الميزة الأكثر تأثيراً
- تطابق نطاقات البريد الإلكتروني (P مقابل R) يحسّن الاسترجاع في المعاملات عبر النطاقات
- المتعلم الفوقي في التكديس لا يتجاوز LightGBM وحده — النماذج الأساسية مترابطة جداً`,
    category: ["fraud"],
    tags: ["LightGBM", "XGBoost", "CatBoost", "Stacking", "Feature Engineering", "StratifiedKFold"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/ieee-cis-fraud-detection",
    featured: true,
    metrics: "AUC: 0.9648",
    dataset: "590,540 transactions, 433 features, 3.5% fraud rate",
    datasetFr: "590 540 transactions, 433 caractéristiques, 3,5% de fraude",
    datasetAr: "590,540 معاملة، 433 ميزة، نسبة احتيال 3.5%",
    results: [
      { label: "LightGBM AUC", value: "0.9648" },
      { label: "Stacking AUC", value: "0.9565" },
      { label: "Baseline (LR)", value: "0.8506" },
      { label: "Features (after FE)", value: "459" },
    ],
    techStack: ["Python", "LightGBM", "XGBoost", "CatBoost", "Scikit-learn", "Pandas", "NumPy"],
    approach: "Stacking ensemble with StratifiedKFold cross-validation and behavioral feature engineering",
    approachFr: "Ensemble de stacking avec validation croisée StratifiedKFold et ingénierie de caractéristiques comportementales",
    approachAr: "مجموعة تكدس مع التحقق المتقاطع StratifiedKFold وهندسة الميزات السلوكية",
  },
  {
    id: "ai-image-gen",
    title: "AI Image Generation Platform (Ofoto)",
    titleFr: "Plateforme de Génération d'Images IA (Ofoto)",
    titleAr: "منصة توليد الصور بالذكاء الاصطناعي (Ofoto)",
    description: "Production deployment of Stable Diffusion (Automatic1111 + ControlNet) with FastAPI backend, Vue.js frontend — 500+ concurrent requests, 99.9% uptime, -35% latency, -40% release time.",
    descriptionFr: "Déploiement en production de Stable Diffusion (Automatic1111 + ControlNet) avec backend FastAPI, frontend Vue.js — 500+ requêtes simultanées, 99,9% disponibilité, -35% latence, -40% temps de release.",
    descriptionAr: "نشر إنتاجي لـ Stable Diffusion (Automatic1111 + ControlNet) مع خلفية FastAPI وواجهة Vue.js — 500+ طلب متزامن، 99.9% وقت تشغيل، -35% زمن استجابة، -40% وقت الإصدار.",
    longDescription: `End-to-end production deployment of an AI image-generation platform at Ofoto. Challenge: handle 500+ concurrent Stable Diffusion inference requests with consistent quality and sub-10s response times.

**Architecture**
\`\`\`
Client (Vue.js) → Nginx (SSL + Load Balancing)
→ FastAPI (async queuing + background tasks)
→ Stable Diffusion Engine (Automatic1111 + ControlNet)
→ Docker containers (GPU-accelerated, CUDA 11.8)
\`\`\`

**Key Engineering Decisions**
1. **Async request queuing** with FastAPI background tasks — never blocks main thread
2. **Nginx keepalive connections** — dramatically reduces overhead under high load
3. **Docker multi-stage build** with CUDA 11.8 for reproducible GPU access
4. **Health-check endpoints** for container orchestration and zero-downtime deploys
5. **ControlNet integration** for image-conditioned generation (pose, depth, canny edges)

**Results**
| Metric | Before | After |
|--------|--------|-------|
| Avg latency | 12.4s | 8.1s (-35%) |
| Concurrent requests | 50 | 500+ |
| Service uptime | 94% | 99.9% |
| Release cycle | 5 days | 3 days (-40%) |`,
    longDescriptionFr: `Déploiement de bout en bout d'une plateforme de génération d'images IA chez Ofoto. Le défi : gérer 500+ requêtes Stable Diffusion simultanées avec une qualité constante et des temps de réponse inférieurs à 10 secondes.

**Architecture**
\`\`\`
Client (Vue.js) → Nginx (SSL + Load Balancing)
→ FastAPI (file d'attente async + tâches en arrière-plan)
→ Moteur Stable Diffusion (Automatic1111 + ControlNet)
→ Conteneurs Docker (accélération GPU, CUDA 11.8)
\`\`\`

**Décisions d'ingénierie clés**
1. **File d'attente async** avec FastAPI background tasks — ne bloque jamais le thread principal
2. **Connexions keepalive Nginx** — réduit drastiquement la surcharge à forte charge
3. **Build Docker multi-étapes** avec CUDA 11.8 pour un accès GPU reproductible
4. **Endpoints de vérification de santé** pour l'orchestration et les déploiements sans interruption
5. **Intégration ControlNet** pour la génération conditionnée par image (pose, profondeur, contours)

**Résultats**
| Métrique | Avant | Après |
|--------|--------|-------|
| Latence moyenne | 12,4s | 8,1s (-35%) |
| Requêtes simultanées | 50 | 500+ |
| Disponibilité | 94% | 99,9% |
| Cycle de release | 5 jours | 3 jours (-40%) |`,
    longDescriptionAr: `نشر شامل لمنصة توليد صور الذكاء الاصطناعي في شركة Ofoto. التحدي: معالجة 500+ طلب Stable Diffusion متزامن بجودة ثابتة وأوقات استجابة أقل من 10 ثوانٍ.

**البنية**
\`\`\`
Client (Vue.js) → Nginx (SSL + Load Balancing)
→ FastAPI (قائمة انتظار غير متزامنة + مهام خلفية)
→ محرك Stable Diffusion (Automatic1111 + ControlNet)
→ حاويات Docker (GPU، CUDA 11.8)
\`\`\`

**القرارات الهندسية الرئيسية**
1. **قائمة انتظار غير متزامنة** مع مهام FastAPI الخلفية — لا تحجب الخيط الرئيسي أبداً
2. **اتصالات Nginx keepalive** — تقلل التكلفة الزائدة بشكل كبير عند الحمل العالي
3. **بناء Docker متعدد المراحل** مع CUDA 11.8 للوصول القابل للتكرار إلى GPU
4. **نقاط فحص الصحة** لتنسيق الحاويات والنشر بدون انقطاع
5. **تكامل ControlNet** للتوليد المشروط بالصور (الوضع، العمق، الحواف)

**النتائج**
| المقياس | قبل | بعد |
|--------|--------|-------|
| متوسط زمن الاستجابة | 12.4s | 8.1s (-35%) |
| الطلبات المتزامنة | 50 | 500+ |
| وقت التشغيل | 94% | 99.9% |
| دورة الإصدار | 5 أيام | 3 أيام (-40%) |`,
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
    approachFr: "FastAPI asynchrone + moteur Stable Diffusion conteneurisé derrière un load balancer Nginx",
    approachAr: "FastAPI غير متزامن + محرك Stable Diffusion في حاوية خلف موازن تحميل Nginx",
  },
  {
    id: "whatsapp-agent",
    title: "WhatsApp AI Sales Agent",
    titleFr: "Agent Commercial IA sur WhatsApp",
    titleAr: "وكيل مبيعات ذكي على واتساب",
    description: "Production AI sales agent on WhatsApp Business. Classifies messages (Sales/Support/Off-topic), queries Supabase product DB, uses Ollama/Llama3.1 locally, bilingual FR/AR, conversation memory. -90% manual processing time.",
    descriptionFr: "Agent IA de vente sur WhatsApp Business. Classifie les messages (Vente/Support/Hors-sujet), interroge la BD Supabase, utilise Ollama/Llama3.1 localement, bilingue FR/AR, mémoire conversationnelle. -90% du temps de traitement manuel.",
    descriptionAr: "وكيل مبيعات ذكاء اصطناعي على واتساب للأعمال. يصنف الرسائل (مبيعات/دعم/خارج الموضوع)، يستعلم من قاعدة بيانات Supabase، يستخدم Ollama/Llama3.1 محلياً، ثنائي اللغة FR/AR، ذاكرة محادثة. -90% من وقت المعالجة اليدوية.",
    longDescription: `Fully automated AI sales agent for a Moroccan e-commerce client spending 6+ hours/day on repetitive WhatsApp product queries.

**Architecture**
\`\`\`
WhatsApp Business API → n8n Webhook
→ Text Classifier (LLM intent detection)
  ├── SALES → AI Agent (Llama3.1 + db_product tool)
  ├── SUPPORT → Support Agent
  └── OFF_TOPIC → Auto-rejection message
→ Supabase (product DB + conversation memory)
→ WhatsApp Business API (reply)
\`\`\`

**Why Ollama (Local LLM)?**
- No customer data leaves the server (GDPR/privacy compliance)
- Zero API costs for high-volume messaging
- Full control over model behavior and prompt templates

**Anti-Hallucination System Prompt**
> "NEVER answer product questions without calling db_product first. ONLY present data returned by the tool. If product not found → honestly inform the customer."

**Results**
| Metric | Value |
|--------|-------|
| Manual processing time reduction | **-90%** |
| Message classification accuracy | **95%+** |
| Languages supported | FR / AR (auto-detected) |
| n8n workflow nodes | 41 |`,
    longDescriptionFr: `Agent de vente IA entièrement automatisé pour un client e-commerce marocain qui passait 6+ heures/jour sur des requêtes WhatsApp répétitives.

**Architecture**
\`\`\`
WhatsApp Business API → Webhook n8n
→ Classificateur de texte (détection d'intention LLM)
  ├── VENTE → Agent IA (Llama3.1 + outil db_product)
  ├── SUPPORT → Agent Support
  └── HORS_SUJET → Message de rejet automatique
→ Supabase (BD produits + mémoire conversationnelle)
→ WhatsApp Business API (réponse)
\`\`\`

**Pourquoi Ollama (LLM local) ?**
- Les données client ne quittent pas le serveur (conformité RGPD/vie privée)
- Zéro coût d'API pour les messages à fort volume
- Contrôle total sur le comportement du modèle et les templates de prompts

**Prompt système anti-hallucination**
> "Ne jamais répondre aux questions sur les produits sans appeler db_product en premier. Présenter UNIQUEMENT les données retournées par l'outil. Si le produit n'est pas trouvé → informer honnêtement le client."

**Résultats**
| Métrique | Valeur |
|--------|-------|
| Réduction du temps de traitement manuel | **-90%** |
| Précision de classification des messages | **95%+** |
| Langues supportées | FR / AR (auto-détecté) |
| Nœuds n8n | 41 |`,
    longDescriptionAr: `وكيل مبيعات ذكاء اصطناعي مؤتمت بالكامل لعميل تجارة إلكترونية مغربي كان يقضي 6+ ساعات يومياً في الرد على استفسارات WhatsApp المتكررة.

**البنية**
\`\`\`
WhatsApp Business API → n8n Webhook
→ مصنّف النص (كشف النية بواسطة LLM)
  ├── مبيعات → وكيل ذكاء اصطناعي (Llama3.1 + أداة db_product)
  ├── دعم → وكيل الدعم
  └── خارج الموضوع → رسالة رفض تلقائية
→ Supabase (قاعدة بيانات المنتجات + ذاكرة المحادثة)
→ WhatsApp Business API (الرد)
\`\`\`

**لماذا Ollama (LLM محلي)؟**
- لا تغادر بيانات العميل الخادم (امتثال لـ GDPR/الخصوصية)
- تكلفة API صفر للرسائل ذات الحجم الكبير
- تحكم كامل في سلوك النموذج وقوالب الموجهات

**موجه النظام لمنع الهلوسة**
> "لا تجب أبداً على أسئلة المنتجات دون استدعاء db_product أولاً. اعرض فقط البيانات التي أعادها الأداة. إذا لم يُعثر على المنتج → أخبر العميل بصدق."

**النتائج**
| المقياس | القيمة |
|--------|-------|
| تقليل وقت المعالجة اليدوية | **-90%** |
| دقة تصنيف الرسائل | **95%+** |
| اللغات المدعومة | FR / AR (كشف تلقائي) |
| عقد n8n | 41 |`,
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
    approachFr: "Classification d'intention → routage vers un agent IA spécialisé avec réponses ancrées dans la base de données",
    approachAr: "تصنيف النية → توجيه لوكيل ذكاء اصطناعي متخصص مع إجابات مستندة لقاعدة البيانات",
  },
  {
    id: "cancer-segmentation",
    title: "Breast Cancer Ultrasound Segmentation",
    titleFr: "Segmentation d'Échographies du Cancer du Sein",
    titleAr: "تجزئة صور الموجات فوق الصوتية لسرطان الثدي",
    description: "9-architecture segmentation benchmark on 780 BUSI images. DeepLabV3+ tops with Dice 0.7863, IoU 0.6483. FCN → SimpleUNet → SegNet → Attention-UNet → TransUNet → ResNet34-UNet → EfficientNet-UNet → DeepLabV3+ → Swin-UNet.",
    descriptionFr: "Benchmark de 9 architectures de segmentation sur 780 images BUSI. DeepLabV3+ en tête avec Dice 0,7863, IoU 0,6483. FCN → SimpleUNet → SegNet → Attention-UNet → TransUNet → ResNet34-UNet → EfficientNet-UNet → DeepLabV3+ → Swin-UNet.",
    descriptionAr: "معيار قياسي لـ 9 بنى تجزئة على 780 صورة BUSI. DeepLabV3+ في المقدمة بـ Dice 0.7863، IoU 0.6483. FCN → SimpleUNet → SegNet → Attention-UNet → TransUNet → ResNet34-UNet → EfficientNet-UNet → DeepLabV3+ → Swin-UNet.",
    longDescription: `Comprehensive benchmark of 9 segmentation architectures on the Breast Ultrasound Images (BUSI) dataset.

**Dataset**
- 780 images: **437 benign / 210 malignant / 133 normal** (class-stratified)
- Split: 585 train / 117 val / 78 test
- Preprocessing: 256×256 resize, Albumentations augmentation (elastic, brightness/contrast, horizontal flip)
- Loss: 50/50 BCE + Dice combined

**Full Architecture Benchmark**
| Model | Params | Dice | IoU | Type |
|-------|--------|------|-----|------|
| FCN | — | 0.4822 | — | Semantic baseline |
| SimpleUNet | 31M | 0.7030 | 0.5424 | Standard encoder-decoder |
| SegNet | 7M | 0.6725 | — | Pooling-index decoder |
| Attention UNet | 31M | 0.6964 | — | Attention gates on skip |
| TransUNet | 124M | 0.6663 | — | ViT encoder + CNN decoder |
| EfficientNet-UNet | 20M | 0.7241 | 0.5683 | EfficientNet-B4 encoder |
| ResNet34-UNet | 24M | 0.7837 | 0.6440 | Pretrained ResNet encoder |
| **DeepLabV3+** | **27M** | **0.7863** | **0.6483** | **ASPP multi-scale** |
| Swin-UNet | High | — | — | Transformer-based |

**Training Setup**
- 30 epochs, AdamW + cosine annealing LR
- Mixed precision (AMP), early stopping
- Metrics: Dice, IoU, F1, Precision, Recall (TorchMetrics)

**Why DeepLabV3+ Wins**
Atrous Spatial Pyramid Pooling (ASPP) with output_stride=16 extracts multi-scale context without spatial collapse — critical for breast tumors that range from 2mm to 30mm. This prevents the spatial resolution loss that hurts standard encoders on small lesions.`,
    longDescriptionFr: `Benchmark complet de 9 architectures de segmentation sur le dataset BUSI (Breast Ultrasound Images).

**Données**
- 780 images : **437 bénignes / 210 malignes / 133 normales** (stratification par classe)
- Division : 585 entraînement / 117 validation / 78 test
- Prétraitement : redimensionnement 256×256, augmentation Albumentations (élastique, luminosité, flip horizontal)
- Perte : 50/50 BCE + Dice combinées

**Benchmark des architectures**
| Modèle | Params | Dice | IoU | Type |
|-------|--------|------|-----|------|
| FCN | — | 0.4822 | — | Baseline sémantique |
| SimpleUNet | 31M | 0.7030 | 0.5424 | Encodeur-décodeur standard |
| SegNet | 7M | 0.6725 | — | Décodeur pooling-index |
| Attention UNet | 31M | 0.6964 | — | Portes d'attention sur skip |
| TransUNet | 124M | 0.6663 | — | Encodeur ViT + décodeur CNN |
| EfficientNet-UNet | 20M | 0.7241 | 0.5683 | Encodeur EfficientNet-B4 |
| ResNet34-UNet | 24M | 0.7837 | 0.6440 | Encodeur ResNet préentraîné |
| **DeepLabV3+** | **27M** | **0.7863** | **0.6483** | **ASPP multi-échelle** |
| Swin-UNet | Élevé | — | — | Basé transformeur |

**Configuration d'entraînement**
- 30 époques, AdamW + cosine annealing LR
- Précision mixte (AMP), arrêt anticipé
- Métriques : Dice, IoU, F1, Précision, Rappel (TorchMetrics)

**Pourquoi DeepLabV3+ gagne**
L'ASPP (Atrous Spatial Pyramid Pooling) avec output_stride=16 extrait le contexte multi-échelle sans effondrement spatial — crucial pour les tumeurs mammaires allant de 2mm à 30mm. Cela évite la perte de résolution spatiale qui affecte les encodeurs standard sur les petites lésions.`,
    longDescriptionAr: `معيار قياسي شامل لـ 9 بنى تجزئة على مجموعة بيانات BUSI (صور الموجات فوق الصوتية للثدي).

**مجموعة البيانات**
- 780 صورة: **437 حميدة / 210 خبيثة / 133 طبيعية** (طبقية حسب الفئة)
- التقسيم: 585 تدريب / 117 تحقق / 78 اختبار
- المعالجة المسبقة: تغيير الحجم 256×256، تضخيم Albumentations (مرونة، إضاءة، قلب أفقي)
- الخسارة: 50/50 BCE + Dice مدمجتان

**معيار البنى**
| النموذج | المعاملات | Dice | IoU | النوع |
|-------|--------|------|-----|------|
| FCN | — | 0.4822 | — | خط أساس دلالي |
| SimpleUNet | 31M | 0.7030 | 0.5424 | مشفر-فك تشفير معياري |
| SegNet | 7M | 0.6725 | — | فك تشفير pooling-index |
| Attention UNet | 31M | 0.6964 | — | بوابات انتباه على skip |
| TransUNet | 124M | 0.6663 | — | مشفر ViT + فك تشفير CNN |
| EfficientNet-UNet | 20M | 0.7241 | 0.5683 | مشفر EfficientNet-B4 |
| ResNet34-UNet | 24M | 0.7837 | 0.6440 | مشفر ResNet مدرب مسبقاً |
| **DeepLabV3+** | **27M** | **0.7863** | **0.6483** | **ASPP متعدد المقاييس** |
| Swin-UNet | مرتفع | — | — | قائم على المحول |

**إعداد التدريب**
- 30 حقبة، AdamW + cosine annealing LR
- دقة مختلطة (AMP)، توقف مبكر
- المقاييس: Dice، IoU، F1، الدقة، الاسترجاع (TorchMetrics)

**لماذا يتفوق DeepLabV3+**
يستخرج ASPP (Atrous Spatial Pyramid Pooling) بـ output_stride=16 السياق متعدد المقاييس دون انهيار مكاني — أمر بالغ الأهمية للأورام الثديية التي تتراوح بين 2-30 ملم. هذا يمنع فقدان الدقة المكانية الذي يضر المشفرات القياسية على الآفات الصغيرة.`,
    category: ["medical", "cv"],
    tags: ["U-Net", "DeepLabV3+", "ASPP", "Segmentation", "PyTorch", "Medical Imaging"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/breast-cancer-ultrasound-segmentation",
    featured: true,
    metrics: "Dice: 0.7863 | IoU: 0.6483",
    dataset: "780 breast ultrasound images (437 benign, 210 malignant, 133 normal)",
    datasetFr: "780 images d'échographie mammaire (437 bénignes, 210 malignes, 133 normales)",
    datasetAr: "780 صورة موجات فوق صوتية للثدي (437 حميدة، 210 خبيثة، 133 طبيعية)",
    results: [
      { label: "Best Dice (DeepLabV3+)", value: "0.7863" },
      { label: "Best IoU", value: "0.6483" },
      { label: "Architectures tested", value: "9" },
      { label: "Dataset size", value: "780 images" },
    ],
    techStack: ["Python", "PyTorch", "segmentation_models_pytorch", "timm", "Albumentations", "CUDA Tesla T4"],
    approach: "9-architecture benchmark: classical encoders → transformer (TransUNet) → ASPP (DeepLabV3+)",
    approachFr: "Benchmark de 9 architectures : encodeurs classiques → transformeur (TransUNet) → ASPP (DeepLabV3+)",
    approachAr: "معيار قياسي لـ 9 بنى: مشفرات كلاسيكية → محول (TransUNet) → ASPP (DeepLabV3+)",
  },
  {
    id: "ethereum-fraud",
    title: "Ethereum Blockchain Fraud Detection",
    titleFr: "Détection de Fraude sur la Blockchain Ethereum",
    titleAr: "كشف الاحتيال على بلوكشين إيثيريوم",
    description: "Blockchain fraud detection on 9,841 Ethereum addresses. XGBoost+LightGBM+CatBoost+Stacking with Optuna HPO (40 trials) and SHAP. AUC 0.9973, F1 0.9658 at optimal threshold 0.85.",
    descriptionFr: "Détection de fraude blockchain sur 9 841 adresses Ethereum. XGBoost+LightGBM+CatBoost+Stacking avec Optuna HPO (40 essais) et SHAP. AUC 0,9973, F1 0,9658 au seuil optimal 0,85.",
    descriptionAr: "كشف احتيال بلوكشين على 9,841 عنوان إيثيريوم. XGBoost+LightGBM+CatBoost+Stacking مع Optuna HPO (40 تجربة) وSHAP. AUC 0.9973، F1 0.9658 عند العتبة المثلى 0.85.",
    longDescription: `Two-stage pipeline detecting fraudulent Ethereum addresses from on-chain behavioral features.

**Dataset**
- 9,841 addresses: 7,662 legitimate (77.9%) + 2,179 fraud (22.1%)
- 51 features: ERC20 transaction patterns, sent/received amounts, unique addresses, timing
- 829 missing values in ERC20 features → median imputation

**Feature Engineering**
- Sent/received ratio, transaction frequency, average value per transaction
- ERC20 activity aggregation (unique tokens, transaction velocity)
- Log transforms on skewed amount distributions (56 features after engineering)

**Stage 1 — Baseline**
| Model | AUC | Notes |
|-------|-----|-------|
| Logistic Regression | 0.8419 | Weak on behavioral patterns |
| Random Forest | 0.9973 | Already excellent |

**Stage 2 — Advanced Pipeline**
1. SMOTE oversampling → 50/50 balance (11,070 training samples)
2. Optuna HPO — XGBoost, 40 trials → Best CV AUC: **0.9992**
   - Best: n_estimators=395, max_depth=3, lr=0.14, subsample=0.85
3. Train XGBoost + LightGBM + CatBoost
4. Stacking meta-learner (Logistic Regression)
5. Threshold tuning → maximize F1

**Final Results**
| Model | AUC | F1 (Fraud) |
|-------|-----|------------|
| XGBoost | 0.9971 | 0.9659 |
| LightGBM | 0.9972 | 0.9569 |
| CatBoost | 0.9969 | 0.9584 |
| **Stacking** | **0.9973** | — |

**Optimal threshold: 0.85 → F1: 0.9658**

**SHAP Top Fraud Indicators**
ERC20 sent count, unique address diversity, total ether received, timing irregularity, ERC20 token diversity`,
    longDescriptionFr: `Pipeline en deux étapes pour détecter les adresses Ethereum frauduleuses à partir de caractéristiques comportementales on-chain.

**Données**
- 9 841 adresses : 7 662 légitimes (77,9%) + 2 179 fraudes (22,1%)
- 51 caractéristiques : patterns ERC20, montants envoyés/reçus, adresses uniques, timing
- 829 valeurs manquantes dans les caractéristiques ERC20 → imputation par médiane

**Ingénierie des caractéristiques**
- Ratio envoi/réception, fréquence des transactions, valeur moyenne par transaction
- Agrégation d'activité ERC20 (tokens uniques, vélocité des transactions)
- Transformations log sur les distributions de montants asymétriques (56 caractéristiques après ingénierie)

**Étape 1 — Baseline**
| Modèle | AUC | Notes |
|-------|-----|-------|
| Logistic Regression | 0.8419 | Faible sur les patterns comportementaux |
| Random Forest | 0.9973 | Déjà excellent |

**Étape 2 — Pipeline avancé**
1. Surééchantillonnage SMOTE → équilibre 50/50 (11 070 échantillons d'entraînement)
2. Optuna HPO — XGBoost, 40 essais → Meilleur CV AUC : **0.9992**
3. Entraînement XGBoost + LightGBM + CatBoost
4. Méta-learner de stacking (Logistic Regression)
5. Réglage de seuil → maximiser F1

**Résultats finaux**
| Modèle | AUC | F1 (Fraude) |
|-------|-----|------------|
| XGBoost | 0.9971 | 0.9659 |
| LightGBM | 0.9972 | 0.9569 |
| CatBoost | 0.9969 | 0.9584 |
| **Stacking** | **0.9973** | — |

**Seuil optimal : 0,85 → F1 : 0,9658**

**Principaux indicateurs SHAP de fraude**
Nombre d'envois ERC20, diversité d'adresses uniques, total ether reçu, irrégularité temporelle, diversité de tokens ERC20`,
    longDescriptionAr: `خط أنابيب ثنائي المرحلة للكشف عن عناوين إيثيريوم الاحتيالية من الميزات السلوكية على السلسلة.

**مجموعة البيانات**
- 9,841 عنوان: 7,662 شرعي (77.9%) + 2,179 احتيال (22.1%)
- 51 ميزة: أنماط ERC20، المبالغ المرسلة/المستقبلة، العناوين الفريدة، التوقيت
- 829 قيمة مفقودة في ميزات ERC20 → إسناد بالوسيط

**هندسة الميزات**
- نسبة الإرسال/الاستقبال، تكرار المعاملات، متوسط القيمة لكل معاملة
- تجميع نشاط ERC20 (رموز فريدة، سرعة المعاملات)
- تحويلات log على توزيعات المبالغ المنحرفة (56 ميزة بعد الهندسة)

**المرحلة 1 — خط الأساس**
| النموذج | AUC | ملاحظات |
|-------|-----|-------|
| Logistic Regression | 0.8419 | ضعيف في الأنماط السلوكية |
| Random Forest | 0.9973 | ممتاز بالفعل |

**المرحلة 2 — خط الأنابيب المتقدم**
1. فرط العينات بـ SMOTE → توازن 50/50 (11,070 عينة تدريبية)
2. Optuna HPO — XGBoost، 40 تجربة → أفضل CV AUC: **0.9992**
3. تدريب XGBoost + LightGBM + CatBoost
4. متعلم فوقي للتكديس (Logistic Regression)
5. ضبط العتبة → تعظيم F1

**النتائج النهائية**
| النموذج | AUC | F1 (احتيال) |
|-------|-----|------------|
| XGBoost | 0.9971 | 0.9659 |
| LightGBM | 0.9972 | 0.9569 |
| CatBoost | 0.9969 | 0.9584 |
| **Stacking** | **0.9973** | — |

**العتبة المثلى: 0.85 → F1: 0.9658**

**أبرز مؤشرات SHAP للاحتيال**
عدد إرسال ERC20، تنوع العناوين الفريدة، إجمالي الإيثيريوم المستقبَل، عدم انتظام التوقيت، تنوع رموز ERC20`,
    category: ["fraud"],
    tags: ["XGBoost", "LightGBM", "CatBoost", "SMOTE", "Optuna", "SHAP", "Blockchain"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/ethereum-fraud-detection",
    featured: true,
    metrics: "AUC: 0.9973 | F1: 0.9658",
    dataset: "9,841 Ethereum addresses, 51 on-chain behavioral features",
    datasetFr: "9 841 adresses Ethereum, 51 caractéristiques comportementales on-chain",
    datasetAr: "9,841 عنوان إيثيريوم، 51 ميزة سلوكية على السلسلة",
    results: [
      { label: "Stacking AUC", value: "0.9973" },
      { label: "F1 Score (Fraud)", value: "0.9658" },
      { label: "Optimal threshold", value: "0.85" },
      { label: "Optuna best AUC", value: "0.9992" },
    ],
    techStack: ["Python", "XGBoost", "LightGBM", "CatBoost", "Optuna", "SHAP", "SMOTE (imbalanced-learn)"],
    approach: "Baseline → SMOTE + Optuna HPO + stacking ensemble + threshold tuning",
    approachFr: "Baseline → SMOTE + Optuna HPO + ensemble de stacking + ajustement de seuil",
    approachAr: "خط أساسي → SMOTE + Optuna HPO + مجموعة تكدس + ضبط العتبة",
  },
  {
    id: "nmt",
    title: "English → French Neural Machine Translation",
    titleFr: "Traduction Automatique Neuronale Anglais → Français",
    titleAr: "ترجمة آلية عصبية من الإنجليزية إلى الفرنسية",
    description: "Memory-safe NMT on a 6 GB dataset without RAM crashes. Custom Seq2Seq + HuggingFace mBART/Helsinki-NLP fine-tuning. Fixed 5 critical upstream bugs (GradientTape, tokenizer overflow, deprecated API).",
    descriptionFr: "NMT économe en mémoire sur un dataset de 6 Go sans crash RAM. Seq2Seq personnalisé + fine-tuning HuggingFace mBART/Helsinki-NLP. Correction de 5 bugs critiques en amont (GradientTape, overflow tokenizer, API dépréciée).",
    descriptionAr: "ترجمة آلية عصبية فعّالة في الذاكرة على مجموعة بيانات 6 جيجابايت دون تعطل RAM. Seq2Seq مخصص + ضبط دقيق لـ HuggingFace mBART/Helsinki-NLP. إصلاح 5 أخطاء حرجة (GradientTape، تجاوز tokenizer، API منتهية الصلاحية).",
    longDescription: `Memory-safe NMT that handles a 6 GB parallel corpus on Kaggle's 33 GB RAM limit without crashing.

**Memory Strategy**
Chunked reading → sample → delete raw data → train on subset → clear between models.

**5 Critical Bugs Fixed From Upstream Notebooks**
| Bug | Root Cause | Fix Applied |
|-----|-----------|------------|
| None gradients crash | GradientTape consumed twice in train_step | Restructure tape scope |
| TypeError on call | Encoder/Decoder.call() missing training= kwarg | Add explicit kwarg |
| AttributeError | as_target_tokenizer() removed in transformers≥4.36 | Use context manager API |
| Deprecated argument | evaluation_strategy renamed eval_strategy | Update arg name |
| Integer overflow | int16 array in tokenizer exceeded max value | Cast to int32 |

**Models Implemented**
| Model | Framework | Approach |
|-------|-----------|---------|
| Custom Seq2Seq | TF 2.19 | LSTM encoder-decoder + Bahdanau attention |
| mBART | PyTorch 2.9 | facebook/mbart-large-cc25 fine-tuning |
| Helsinki-NLP | PyTorch 2.9 | opus-mt-en-fr fine-tuning |
| MarianMT | PyTorch 2.9 | Alternative MarianMT strategy |

**Key Insight**
Pretrained multilingual models (mBART trained on 25 languages) dramatically outperform from-scratch Seq2Seq. The LSTM baseline validates the pipeline architecture; pretrained models show the transfer learning gap.`,
    longDescriptionFr: `NMT économe en mémoire qui gère un corpus parallèle de 6 Go dans la limite de 33 Go RAM de Kaggle sans crash.

**Stratégie mémoire**
Lecture fragmentée → échantillonnage → suppression des données brutes → entraînement sur sous-ensemble → purge entre les modèles.

**5 bugs critiques corrigés**
| Bug | Cause racine | Correctif appliqué |
|-----|-----------|------------|
| Crash gradients nuls | GradientTape consommé deux fois | Restructurer la portée tape |
| TypeError à l'appel | Encoder/Decoder.call() manque l'argument training= | Ajouter le kwarg explicite |
| AttributeError | as_target_tokenizer() supprimé dans transformers≥4.36 | Utiliser l'API context manager |
| Argument déprécié | evaluation_strategy renommé eval_strategy | Mettre à jour le nom |
| Débordement entier | tableau int16 dans le tokenizer dépassait la valeur max | Convertir en int32 |

**Modèles implémentés**
| Modèle | Framework | Approche |
|-------|-----------|---------|
| Seq2Seq personnalisé | TF 2.19 | LSTM encodeur-décodeur + attention Bahdanau |
| mBART | PyTorch 2.9 | Fine-tuning facebook/mbart-large-cc25 |
| Helsinki-NLP | PyTorch 2.9 | Fine-tuning opus-mt-en-fr |
| MarianMT | PyTorch 2.9 | Stratégie MarianMT alternative |

**Point clé**
Les modèles multilingues préentraînés (mBART entraîné sur 25 langues) surpassent largement le Seq2Seq from scratch. Le baseline LSTM valide l'architecture du pipeline ; les modèles préentraînés montrent l'écart dû au transfer learning.`,
    longDescriptionAr: `ترجمة آلية عصبية موفرة للذاكرة تتعامل مع مجموعة بيانات موازية بحجم 6 جيجابايت ضمن حد ذاكرة 33 جيجابايت في كاغل دون تعطل.

**استراتيجية الذاكرة**
قراءة مجزأة → أخذ عينات → حذف البيانات الخام → تدريب على مجموعة فرعية → مسح بين النماذج.

**5 أخطاء حرجة تم إصلاحها**
| الخطأ | السبب الجذري | الإصلاح المطبق |
|-----|-----------|------------|
| تعطل الأوزان الصفرية | GradientTape مستهلك مرتين | إعادة هيكلة نطاق tape |
| TypeError عند الاستدعاء | Encoder/Decoder.call() يفتقد إلى وسيط training= | إضافة الـ kwarg الصريح |
| AttributeError | as_target_tokenizer() محذوف في transformers≥4.36 | استخدام API context manager |
| وسيط منتهي الصلاحية | evaluation_strategy أُعيد تسميته إلى eval_strategy | تحديث اسم الوسيط |
| تجاوز العدد الصحيح | مصفوفة int16 في المُجزئ تجاوزت القيمة القصوى | التحويل إلى int32 |

**النماذج المنفذة**
| النموذج | الإطار | الأسلوب |
|-------|-----------|---------|
| Seq2Seq مخصص | TF 2.19 | LSTM مشفر-فك تشفير + انتباه Bahdanau |
| mBART | PyTorch 2.9 | ضبط دقيق لـ facebook/mbart-large-cc25 |
| Helsinki-NLP | PyTorch 2.9 | ضبط دقيق لـ opus-mt-en-fr |
| MarianMT | PyTorch 2.9 | استراتيجية MarianMT البديلة |

**رؤية رئيسية**
النماذج متعددة اللغات المدربة مسبقاً (mBART المدرب على 25 لغة) تتفوق بشكل كبير على Seq2Seq من الصفر. خط الأساس LSTM يتحقق من بنية خط الأنابيب؛ النماذج المدربة مسبقاً تُظهر فجوة نقل التعلم.`,
    category: ["nlp"],
    tags: ["Seq2Seq", "mBART", "MarianMT", "HuggingFace", "NMT", "TensorFlow", "PyTorch"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/english-french-neural-machine-translation",
    featured: true,
    dataset: "6 GB English-French parallel corpus",
    datasetFr: "Corpus parallèle anglais-français de 6 Go",
    datasetAr: "مجموعة بيانات موازية إنجليزي-فرنسي بحجم 6 جيجابايت",
    techStack: ["Python", "TensorFlow 2.19", "PyTorch 2.9", "HuggingFace Transformers 4.36+", "mBART"],
    approach: "Memory-safe chunked loading + custom Seq2Seq baseline + HuggingFace pretrained fine-tuning",
    approachFr: "Chargement fragmenté économe en mémoire + Seq2Seq de base personnalisé + fine-tuning HuggingFace préentraîné",
    approachAr: "تحميل مجزأ موفر للذاكرة + Seq2Seq أساسي مخصص + ضبط دقيق لنماذج HuggingFace المدربة مسبقاً",
  },

  // ── MORE PROJECTS ──────────────────────────────────────────────────────────
  {
    id: "twitter-sentiment",
    title: "Twitter Sentiment Analysis",
    titleFr: "Analyse de Sentiment Twitter",
    titleAr: "تحليل مشاعر تويتر",
    description: "6-model NLP pipeline on 74K tweets. DistilBERT fine-tuning achieves 96.6% accuracy. LR+TF-IDF baseline at 85%. LSTM/Bi-LSTM/CNN reach 87–88%. 4-class: Positive, Negative, Neutral, Irrelevant.",
    descriptionFr: "Pipeline NLP de 6 modèles sur 74K tweets. DistilBERT atteint 96,6% de précision. LR+TF-IDF à 85%. LSTM/Bi-LSTM/CNN atteignent 87–88%. 4 classes : Positif, Négatif, Neutre, Non pertinent.",
    descriptionAr: "خط أنابيب NLP بـ 6 نماذج على 74K تغريدة. DistilBERT يحقق دقة 96.6%. LR+TF-IDF عند 85%. LSTM/Bi-LSTM/CNN يصلون 87-88%. 4 فئات: إيجابي، سلبي، محايد، غير ذي صلة.",
    longDescription: `End-to-end NLP benchmark on the Twitter Entity Sentiment dataset.

**Dataset**
- 74,682 training tweets + 1,000 validation, 4 sentiment classes
- Preprocessing: lowercase, URL/mention/hashtag removal, stopwords, lemmatization

**All 6 Models Compared**
| Model | Accuracy | Notes |
|-------|----------|-------|
| LR + BoW | 83% | Count vectorizer baseline |
| LR + TF-IDF | 85% | Sublinear_tf, 50K features, bigrams |
| LSTM | 87% | 128→64 units, SpatialDropout(0.2) |
| Bi-LSTM | 88% | Bidirectional, 128-d embeddings |
| CNN (text) | 88% | Conv1D 256→128 + GlobalMaxPooling |
| **DistilBERT** | **96.6%** | **3 epochs, lr=2e-5, warmup scheduler** |

**BERT Fine-tuning Details**
- Model: DistilBERT-base-uncased
- Batch size: 32, 3 epochs, linear warmup scheduler
- AdamW with weight decay
- Convergence: rapid — most gain in epoch 1

**Key Findings**
- Classical ML (85%) is competitive with LSTM/CNN (87–88%) at 100× less compute
- Deep learning models plateau around 87–88%; only transformer architecture breaks through to 96.6%
- DistilBERT's pre-trained contextual embeddings handle tweet slang/abbreviations that TF-IDF misses`,
    longDescriptionFr: `Benchmark NLP de bout en bout sur le dataset Twitter Entity Sentiment.

**Données**
- 74 682 tweets d'entraînement + 1 000 de validation, 4 classes de sentiment
- Prétraitement : minuscules, suppression des URLs/mentions/hashtags, stopwords, lemmatisation

**6 modèles comparés**
| Modèle | Précision | Notes |
|-------|----------|-------|
| LR + BoW | 83% | Baseline compteur de vecteurs |
| LR + TF-IDF | 85% | Sublinear_tf, 50K features, bigrammes |
| LSTM | 87% | Unités 128→64, SpatialDropout(0.2) |
| Bi-LSTM | 88% | Bidirectionnel, embeddings 128-d |
| CNN (texte) | 88% | Conv1D 256→128 + GlobalMaxPooling |
| **DistilBERT** | **96,6%** | **3 époques, lr=2e-5, warmup scheduler** |

**Détails du fine-tuning BERT**
- Modèle : DistilBERT-base-uncased
- Batch : 32, 3 époques, scheduler de warmup linéaire
- AdamW avec weight decay
- Convergence : rapide — la majorité des gains se fait à l'époque 1

**Points clés**
- Le ML classique (85%) est compétitif avec LSTM/CNN (87–88%) à 100× moins de calcul
- Les modèles deep learning plafonnent à 87–88% ; seule l'architecture transformer franchit la barre des 96,6%
- Les embeddings contextuels préentraînés de DistilBERT gèrent l'argot et les abréviations Twitter que TF-IDF manque`,
    longDescriptionAr: `معيار NLP شامل على مجموعة بيانات تحليل مشاعر تويتر.

**مجموعة البيانات**
- 74,682 تغريدة تدريبية + 1,000 تحقق، 4 فئات مشاعر
- المعالجة المسبقة: تحويل للأحرف الصغيرة، إزالة URLs/الإشارات/الوسوم، كلمات التوقف، الترقيم

**مقارنة 6 نماذج**
| النموذج | الدقة | ملاحظات |
|-------|----------|-------|
| LR + BoW | 83% | خط أساس عداد الكلمات |
| LR + TF-IDF | 85% | sublinear_tf، 50K ميزة، ثنائيات |
| LSTM | 87% | وحدات 128→64، SpatialDropout(0.2) |
| Bi-LSTM | 88% | ثنائي الاتجاه، تضمينات 128-d |
| CNN (نصي) | 88% | Conv1D 256→128 + GlobalMaxPooling |
| **DistilBERT** | **96.6%** | **3 حقب، lr=2e-5، warmup scheduler** |

**تفاصيل الضبط الدقيق لـ BERT**
- النموذج: DistilBERT-base-uncased
- الدفعة: 32، 3 حقب، جدولة warmup خطية
- AdamW مع تناقص الأوزان
- التقارب: سريع — معظم المكاسب في الحقبة 1

**رؤى رئيسية**
- ML الكلاسيكي (85%) منافس لـ LSTM/CNN (87-88%) بحساب أقل 100 مرة
- نماذج التعلم العميق تسقف عند 87-88%؛ بنية المحول فقط تكسر حاجز 96.6%
- تضمينات DistilBERT السياقية المدربة مسبقاً تتعامل مع العامية والاختصارات التي يفوتها TF-IDF`,
    category: ["nlp"],
    tags: ["DistilBERT", "LSTM", "Bi-LSTM", "TF-IDF", "Sentiment", "Twitter", "Text Classification"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/twitter-sentiment-analysis",
    featured: false,
    metrics: "96.6% accuracy (DistilBERT)",
    dataset: "74,682 Twitter tweets, 4-class sentiment",
    datasetFr: "74 682 tweets Twitter, 4 classes de sentiment",
    datasetAr: "74,682 تغريدة تويتر، 4 فئات مشاعر",
    results: [
      { label: "DistilBERT Accuracy", value: "96.6%" },
      { label: "LR+TF-IDF Accuracy", value: "85%" },
      { label: "LSTM/CNN", value: "87–88%" },
      { label: "Models tested", value: "6" },
    ],
    techStack: ["Python", "Scikit-learn", "TensorFlow", "HuggingFace DistilBERT", "NLTK"],
    approach: "Classical ML → deep learning → transformer fine-tuning on tweet sentiment",
    approachFr: "ML classique → deep learning → fine-tuning transformeur sur sentiment Twitter",
    approachAr: "تعلم آلة كلاسيكي → تعلم عميق → ضبط دقيق للمحول على مشاعر تويتر",
  },
  {
    id: "fake-news",
    title: "Fake News Detection",
    titleFr: "Détection de Fausses Nouvelles",
    titleAr: "كشف الأخبار المزيفة",
    description: "13-model NLP pipeline on 44,898 news articles. Soft Voting Ensemble & Stacking both achieve 99.86% accuracy, AUC=1.0. Only 2 errors on the full test set. DistilBERT matches at 99.87% on 6K subset.",
    descriptionFr: "Pipeline NLP de 13 modèles sur 44 898 articles. Soft Voting Ensemble & Stacking atteignent 99,86% de précision, AUC=1,0. Seulement 2 erreurs sur l'ensemble de test complet. DistilBERT à 99,87% sur 6K sous-ensemble.",
    descriptionAr: "خط أنابيب NLP بـ 13 نموذجاً على 44,898 مقالة. Soft Voting Ensemble والتكدس يحققان 99.86% دقة، AUC=1.0. خطأين فقط على مجموعة الاختبار الكاملة. DistilBERT بـ 99.87% على مجموعة فرعية 6K.",
    longDescription: `Comprehensive fake news detection benchmarking classical ML and transformers on a balanced 44,898-article dataset.

**Dataset**
- 21,417 real + 23,481 fake news articles
- 70/15/15 stratified train/val/test split
- Features: TF-IDF word n-grams (1–2, 50K features) + char n-grams (3–5, 30K features) combined

**Full 13-Model Benchmark**
| Model | Accuracy | AUC |
|-------|----------|-----|
| Complement NB | 96.52% | 0.9936 |
| Logistic Regression | 99.65% | 0.9999 |
| **Linear SVC** | **99.81%** | **1.0000** |
| SGD Classifier | 99.72% | 1.0000 |
| Decision Tree | 99.63% | 0.9950 |
| Random Forest | 99.70% | 0.9998 |
| Extra Trees | 99.37% | 0.9997 |
| XGBoost | 99.83% | 0.9997 |
| LightGBM | 99.81% | 0.9996 |
| **Soft Voting** | **99.86%** | **1.0000** |
| **Stacking** | **99.86%** | **1.0000** |
| BiLSTM | 98.5% | — |
| **DistilBERT** | **99.87%** | **0.9999** |

**Error Analysis**
Full test set: **1 false positive + 1 false negative**. The dataset has strong source signals — Reuters/AP wire service language vs conspiracy-style language — that combined TF-IDF captures almost perfectly.

**Why Combined TF-IDF Beats Standalone**
Word n-grams capture semantic content; character n-grams capture writing style artifacts (punctuation abuse, ALL-CAPS, unusual spacin g). Combining both gives >99.8% across all reasonable models.

**DistilBERT Finding**
Fine-tuned on only 6K articles (subset) → 99.87% accuracy. Demonstrates transformers generalize better under limited labeled data than classical models trained on full dataset.`,
    longDescriptionFr: `Benchmark complet de détection de fausses nouvelles sur un dataset de 44 898 articles.

**Données**
- 21 417 vraies + 23 481 fausses nouvelles — division stratifiée 70/15/15
- Caractéristiques : TF-IDF mots n-grammes (1–2, 50K) + caractères n-grammes (3–5, 30K) combinés

**Benchmark 13 modèles**
| Modèle | Précision | AUC |
|-------|----------|-----|
| Complement NB | 96,52% | 0,9936 |
| Logistic Regression | 99,65% | 0,9999 |
| Linear SVC | 99,81% | 1,0000 |
| XGBoost | 99,83% | 0,9997 |
| **Soft Voting** | **99,86%** | **1,0000** |
| **Stacking** | **99,86%** | **1,0000** |
| **DistilBERT** | **99,87%** | **0,9999** |

**Analyse des erreurs**
Ensemble de test complet : **1 faux positif + 1 faux négatif**. Le dataset a des signaux de source forts que le TF-IDF combiné capture presque parfaitement.

**Pourquoi le TF-IDF combiné est supérieur**
Les n-grammes de mots capturent le contenu sémantique ; les n-grammes de caractères capturent les artefacts de style (abus de ponctuation, MAJUSCULES). La combinaison donne >99,8% sur tous les modèles.

**Résultat DistilBERT**
Fine-tuné sur 6K articles seulement → 99,87%. Les transformeurs généralisent mieux avec peu de données étiquetées que les modèles classiques entraînés sur le dataset complet.`,
    longDescriptionAr: `معيار شامل للكشف عن الأخبار المزيفة على 44,898 مقالة.

**مجموعة البيانات**
- 21,417 حقيقية + 23,481 مزيفة — تقسيم طبقي 70/15/15
- الميزات: TF-IDF كلمات n-gram (1-2، 50K) + أحرف n-gram (3-5، 30K) مدمجة

**معيار 13 نموذجاً**
| النموذج | الدقة | AUC |
|-------|----------|-----|
| Complement NB | 96.52% | 0.9936 |
| Logistic Regression | 99.65% | 0.9999 |
| Linear SVC | 99.81% | 1.0000 |
| XGBoost | 99.83% | 0.9997 |
| **Soft Voting** | **99.86%** | **1.0000** |
| **Stacking** | **99.86%** | **1.0000** |
| **DistilBERT** | **99.87%** | **0.9999** |

**تحليل الأخطاء**
مجموعة اختبار كاملة: **خطأ إيجابي + خطأ سلبي واحد فقط**. المجموعة تحتوي على إشارات مصدر قوية يلتقطها TF-IDF المدمج بشكل شبه مثالي.

**لماذا TF-IDF المدمج أفضل**
n-gram الكلمات يلتقط الدلالة؛ n-gram الأحرف يلتقط أسلوب الكتابة (الأحرف الكبيرة، علامات الترقيم المفرطة). الدمج يعطي >99.8% عبر جميع النماذج.

**نتيجة DistilBERT**
ضبط دقيق على 6K مقالة فقط → 99.87%. يثبت أن المحولات تعمم بشكل أفضل مع بيانات محدودة مقارنة بالنماذج الكلاسيكية على المجموعة الكاملة.`,
    category: ["nlp"],
    tags: ["LinearSVC", "TF-IDF", "XGBoost", "LightGBM", "DistilBERT", "Voting Ensemble", "Stacking"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/fake-news-detection",
    featured: false,
    metrics: "99.86% accuracy | AUC: 1.0000",
    dataset: "44,898 articles (21K real + 23K fake), 70/15/15 split",
    datasetFr: "44 898 articles (21K réels + 23K faux), division 70/15/15",
    datasetAr: "44,898 مقالة (21K حقيقية + 23K مزيفة)، تقسيم 70/15/15",
    results: [
      { label: "Voting/Stacking Acc", value: "99.86%" },
      { label: "Linear SVC AUC", value: "1.0000" },
      { label: "DistilBERT Accuracy", value: "99.87%" },
      { label: "Total test errors", value: "2" },
    ],
    techStack: ["Python", "Scikit-learn", "XGBoost", "LightGBM", "HuggingFace DistilBERT", "NLTK"],
    approach: "Combined TF-IDF (word + char n-grams) → 13-model benchmark → transformer fine-tuning",
    approachFr: "TF-IDF combiné (n-grammes mots + caractères) → benchmark de 13 modèles → fine-tuning transformeur",
    approachAr: "TF-IDF مدمج (n-gramات كلمات + أحرف) → معيار 13 نموذجاً → ضبط دقيق للمحول",
  },
  {
    id: "human-activity",
    title: "Human Activity Recognition (HAR)",
    titleFr: "Reconnaissance d'Activité Humaine (HAR)",
    titleAr: "التعرف على النشاط البشري (HAR)",
    description: "14-model benchmark on 9,299 UCI sensor readings. SVM Linear tops at 96.1%. t-SNE shows clean activity clusters. PCA retains 95% variance at ~95 components. Sitting/Standing confusion is the primary error source.",
    descriptionFr: "Benchmark de 14 modèles sur 9 299 lectures de capteurs UCI. SVM linéaire en tête à 96,1%. t-SNE montre des clusters d'activité nets. PCA retient 95% de variance à ~95 composantes. Confusion Assis/Debout est la principale source d'erreurs.",
    descriptionAr: "معيار 14 نموذجاً على 9,299 قراءة من حساسات UCI. SVM الخطي يتصدر بـ 96.1%. t-SNE يُظهر مجموعات نشاط واضحة. PCA يحتفظ بـ 95% من التباين عند ~95 مكوناً. الخلط بين الجلوس/الوقوف هو المصدر الرئيسي للأخطاء.",
    longDescription: `End-to-end ML pipeline on UCI HAR — accelerometer + gyroscope from 30 subjects, 6 activities.

**Dataset**
- 9,299 samples (7,352 train / 2,947 test), 30 subjects (21 train / 9 test)
- 561 pre-extracted features: time-domain + frequency-domain statistics
- 6 activities: Walking, Walking Upstairs, Walking Downstairs, Sitting, Standing, Laying

**Dimensionality Analysis**
- **t-SNE** on 3K subset: clear non-linear cluster separation even at 2D
- **PCA**: 95% variance at ~95 components (from 561)
- Top features by F-statistic: tBodyAcc-mean-X, tGravityAcc-mean-X, angle(X,gravityMean)

**All 14 Models**
| Model | Test Accuracy |
|-------|--------------|
| Naive Bayes | 77.03% |
| KNN (k=5) | 88.02% |
| Decision Tree | 87.07% |
| Bagging | 89.11% |
| Random Forest | 92.74% |
| Extra Trees | 94.06% |
| Gradient Boosting | 93.18% |
| XGBoost | 94.10% |
| LightGBM | 93.99% |
| CatBoost | 91.62% |
| Stacking (RF+XGB+LGB→LR) | 95.18% |
| Logistic Regression | 95.42% |
| SVM RBF | 95.49% |
| **SVM Linear** | **96.10%** |

**Error Analysis** (115 errors / 2,947 = 3.9%)
- SITTING → STANDING: 55 errors
- STANDING → SITTING: 18 errors
- Cause: accelerometer posture features nearly identical for sitting vs standing — only fine gyroscope signals distinguish them

**Why SVM Linear Wins**
The 561 features are domain-expert-engineered statistics designed to be linearly separable. SVM with linear kernel exploits this directly. Tree-based models add unnecessary complexity for already linearly-separable data.`,
    longDescriptionFr: `Pipeline ML de bout en bout sur UCI HAR — accéléromètre + gyroscope de 30 sujets, 6 activités.

**Données**
- 9 299 échantillons (7 352 entraînement / 2 947 test), 30 sujets (21 train / 9 test)
- 561 caractéristiques pré-extraites : statistiques temporelles + fréquentielles
- 6 activités : Marche, Montée, Descente, Assis, Debout, Allongé

**Analyse de dimensionnalité**
- **t-SNE** sur 3K : séparation claire des clusters même en 2D
- **PCA** : 95% de variance à ~95 composantes (sur 561)
- Top caractéristiques par F-stat : tBodyAcc-mean-X, tGravityAcc-mean-X, angle(X,gravityMean)

**14 modèles**
| Modèle | Précision test |
|-------|--------------|
| Naive Bayes | 77,03% |
| KNN (k=5) | 88,02% |
| Decision Tree | 87,07% |
| Random Forest | 92,74% |
| XGBoost | 94,10% |
| LightGBM | 93,99% |
| Stacking (RF+XGB+LGB→LR) | 95,18% |
| Logistic Regression | 95,42% |
| SVM RBF | 95,49% |
| **SVM Linéaire** | **96,10%** |

**Analyse des erreurs** (115 erreurs / 2 947 = 3,9%)
- ASSIS → DEBOUT : 55 erreurs
- DEBOUT → ASSIS : 18 erreurs
- Cause : les caractéristiques de posture de l'accéléromètre sont quasi-identiques — seuls les fins signaux du gyroscope distinguent les deux postures

**Pourquoi SVM linéaire gagne**
Les 561 caractéristiques sont des statistiques conçues par des experts pour être linéairement séparables. Le SVM à noyau linéaire exploite cela directement. Les modèles basés sur les arbres ajoutent une complexité inutile.`,
    longDescriptionAr: `خط أنابيب ML شامل على UCI HAR — مقياس التسارع + الجيروسكوب من 30 مشاركاً، 6 أنشطة.

**مجموعة البيانات**
- 9,299 عينة (7,352 تدريب / 2,947 اختبار)، 30 مشاركاً
- 561 ميزة مستخرجة مسبقاً: إحصاءات زمنية + ترددية
- 6 أنشطة: المشي، صعود السلالم، نزول السلالم، الجلوس، الوقوف، الاستلقاء

**تحليل الأبعاد**
- **t-SNE** على 3K: فصل واضح للمجموعات حتى في بُعدين
- **PCA**: 95% من التباين عند ~95 مكوناً (من 561)
- أعلى الميزات بـ F-stat: tBodyAcc-mean-X، tGravityAcc-mean-X

**14 نموذجاً**
| النموذج | دقة الاختبار |
|-------|--------------|
| Naive Bayes | 77.03% |
| KNN (k=5) | 88.02% |
| Random Forest | 92.74% |
| XGBoost | 94.10% |
| Stacking (RF+XGB+LGB→LR) | 95.18% |
| Logistic Regression | 95.42% |
| SVM RBF | 95.49% |
| **SVM الخطي** | **96.10%** |

**تحليل الأخطاء** (115 خطأ / 2,947 = 3.9%)
- جالس → واقف: 55 خطأ
- واقف → جالس: 18 خطأ
- السبب: ميزات وضع مقياس التسارع متطابقة تقريباً — إشارات الجيروسكوب الدقيقة فقط تميّزهما

**لماذا يتفوق SVM الخطي**
الـ 561 ميزة هي إحصاءات مصممة بمعرفة خبراء لتكون قابلة للفصل الخطي. SVM بنواة خطية يستغل ذلك مباشرة. نماذج الأشجار تضيف تعقيداً غير ضروري.`,
    category: ["cv"],
    tags: ["SVM", "XGBoost", "LightGBM", "PCA", "t-SNE", "Sensor Data", "UCI HAR"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/human-activity-recognition",
    featured: false,
    metrics: "96.1% accuracy (SVM Linear)",
    dataset: "UCI HAR: 9,299 samples, 561 features, 6 activities, 30 subjects",
    datasetFr: "UCI HAR : 9 299 échantillons, 561 caractéristiques, 6 activités, 30 sujets",
    datasetAr: "UCI HAR: 9,299 عينة، 561 ميزة، 6 أنشطة، 30 مشاركاً",
    results: [
      { label: "SVM Linear accuracy", value: "96.10%" },
      { label: "Stacking accuracy", value: "95.18%" },
      { label: "XGBoost accuracy", value: "94.10%" },
      { label: "PCA components (95%)", value: "~95" },
    ],
    techStack: ["Python", "Scikit-learn", "XGBoost", "LightGBM", "PCA", "t-SNE", "Pandas"],
    approach: "14-model benchmark with PCA + t-SNE analysis on expert-engineered sensor features",
    approachFr: "Benchmark de 14 modèles avec analyse PCA + t-SNE sur caractéristiques de capteurs",
    approachAr: "معيار 14 نموذجاً مع تحليل PCA + t-SNE على ميزات الحساسات",
  },
  {
    id: "telco-churn",
    title: "Telco Customer Churn Prediction",
    titleFr: "Prédiction de Résiliation Client Télécom",
    titleAr: "التنبؤ بانسحاب عملاء الاتصالات",
    description: "3-phase churn pipeline on 7,043 customers. Optuna-tuned XGBoost: AUC 0.8484, F1 0.5947. Phase 1: 5 baselines → Phase 2: boosting ensembles → Phase 3: 100-trial Optuna + SHAP. Tenure & contract type dominate.",
    descriptionFr: "Pipeline churn en 3 phases sur 7 043 clients. XGBoost optimisé Optuna : AUC 0,8484, F1 0,5947. Phase 1 : 5 baselines → Phase 2 : ensembles de boosting → Phase 3 : 100 essais Optuna + SHAP. Durée d'abonnement & type de contrat dominent.",
    descriptionAr: "خط أنابيب تمييع بـ 3 مراحل على 7,043 عميل. XGBoost محسّن بـ Optuna: AUC 0.8484، F1 0.5947. المرحلة 1: 5 خطوط أساسية → المرحلة 2: مجموعات تعزيزية → المرحلة 3: 100 تجربة Optuna + SHAP. مدة العقد ونوعه يهيمنان.",
    longDescription: `3-phase ML pipeline for customer churn on Telco Customer dataset.

**Dataset**
- 7,043 customers, 21 features (demographics, services, account, charges)
- Churn rate: **26.54%** — moderate imbalance, stratified 80/20 split
- Preprocessing: label encoding (binary), one-hot encoding (multi-class), StandardScaler

**Phase 1 — Baseline Classifiers**
| Model | Accuracy | AUC |
|-------|----------|-----|
| Logistic Regression | 81.1% | 0.842 |
| Decision Tree | 78.8% | 0.735 |
| KNN | 78.3% | 0.818 |
| SVM | 79.2% | 0.844 |
| Random Forest | 80.4% | 0.843 |

**Phase 2 — Boosting Ensembles**
| Model | Accuracy | AUC |
|-------|----------|-----|
| XGBoost | 80.0% | 0.840 |
| LightGBM | 80.0% | 0.813 |
| CatBoost | 79.3% | 0.817 |
| Soft Voting | 80.3% | 0.819 |
| Stacking | 79.8% | 0.834 |

**Phase 3 — Optuna HPO (XGBoost, 100 trials)**
- **AUC: 0.8484**, Accuracy: 80.55%, F1 (churn): 0.5947
- Best: n_estimators=500, max_depth=5, lr=0.05, subsample=0.8

**SHAP Top Churn Drivers**
1. **Tenure** (↓ churn with longer tenure)
2. **Contract type** (month-to-month = highest risk)
3. **Monthly charges** (higher charges → more churn)
4. **Tech support** (absence = higher churn)
5. **Internet service** (Fiber optic users churn more)`,
    longDescriptionFr: `Pipeline churn en 3 phases sur le dataset Telco Customer.

**Données**
- 7 043 clients, 21 caractéristiques (démographie, services, compte, charges)
- Taux de churn : **26,54%** — déséquilibre modéré, division stratifiée 80/20

**Phase 1 — Classificateurs de base**
| Modèle | Précision | AUC |
|-------|----------|-----|
| Logistic Regression | 81,1% | 0,842 |
| Decision Tree | 78,8% | 0,735 |
| SVM | 79,2% | 0,844 |
| Random Forest | 80,4% | 0,843 |

**Phase 2 — Ensembles de boosting**
| Modèle | Précision | AUC |
|-------|----------|-----|
| XGBoost | 80,0% | 0,840 |
| LightGBM | 80,0% | 0,813 |
| CatBoost | 79,3% | 0,817 |
| Stacking | 79,8% | 0,834 |

**Phase 3 — Optuna HPO (XGBoost, 100 essais)**
- **AUC : 0,8484**, Précision : 80,55%, F1 (churn) : 0,5947
- Meilleur : n_estimators=500, max_depth=5, lr=0,05, subsample=0,8

**Principaux facteurs de churn (SHAP)**
1. **Durée d'abonnement** (↓ churn avec ancienneté plus longue)
2. **Type de contrat** (mensuel = risque le plus élevé)
3. **Charges mensuelles** (charges plus élevées → plus de churn)
4. **Support technique** (absence = churn plus élevé)
5. **Service Internet** (les utilisateurs fibre churntent plus)`,
    longDescriptionAr: `خط أنابيب تمييع من 3 مراحل على مجموعة بيانات Telco Customer.

**مجموعة البيانات**
- 7,043 عميل، 21 ميزة (ديموغرافيا، خدمات، حساب، رسوم)
- نسبة الانسحاب: **26.54%** — عدم توازن معتدل، تقسيم طبقي 80/20

**المرحلة 1 — مصنفات أساسية**
| النموذج | الدقة | AUC |
|-------|----------|-----|
| Logistic Regression | 81.1% | 0.842 |
| Decision Tree | 78.8% | 0.735 |
| SVM | 79.2% | 0.844 |
| Random Forest | 80.4% | 0.843 |

**المرحلة 2 — مجموعات التعزيز**
| النموذج | الدقة | AUC |
|-------|----------|-----|
| XGBoost | 80.0% | 0.840 |
| LightGBM | 80.0% | 0.813 |
| CatBoost | 79.3% | 0.817 |
| Stacking | 79.8% | 0.834 |

**المرحلة 3 — Optuna HPO (XGBoost، 100 تجربة)**
- **AUC: 0.8484**، الدقة: 80.55%، F1 (انسحاب): 0.5947
- الأفضل: n_estimators=500، max_depth=5، lr=0.05، subsample=0.8

**أبرز عوامل الانسحاب (SHAP)**
1. **مدة الاشتراك** (↓ انسحاب مع طول المدة)
2. **نوع العقد** (شهري = أعلى خطورة)
3. **الرسوم الشهرية** (رسوم أعلى → انسحاب أكثر)
4. **الدعم التقني** (غيابه = انسحاب أعلى)
5. **خدمة الإنترنت** (مستخدمو الألياف ينسحبون أكثر)`,
    category: ["fraud"],
    tags: ["XGBoost", "LightGBM", "CatBoost", "Optuna", "SHAP", "Churn", "Customer Analytics"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/telco-customer-churn",
    featured: false,
    metrics: "AUC: 0.8484 (Optuna XGBoost)",
    dataset: "7,043 telecom customers, 21 features, 26.5% churn rate",
    datasetFr: "7 043 clients télécom, 21 caractéristiques, 26,5% de taux de résiliation",
    datasetAr: "7,043 عميل اتصالات، 21 ميزة، معدل انسحاب 26.5%",
    results: [
      { label: "XGBoost Optuna AUC", value: "0.8484" },
      { label: "XGBoost Optuna F1", value: "0.5947" },
      { label: "Best baseline AUC", value: "0.844 (SVM)" },
      { label: "Optuna trials", value: "100" },
    ],
    techStack: ["Python", "XGBoost", "LightGBM", "CatBoost", "Optuna", "SHAP", "Scikit-learn"],
    approach: "Baseline → ensemble → 100-trial Optuna HPO → SHAP interpretability",
    approachFr: "Baseline → ensemble → 100 essais Optuna HPO → interprétabilité SHAP",
    approachAr: "خط أساسي → مجموعة → 100 تجربة Optuna HPO → تفسيرية SHAP",
  },
  {
    id: "vehicle-fraud",
    title: "Vehicle Insurance Claim Fraud",
    titleFr: "Fraude aux Réclamations d'Assurance Véhicule",
    titleAr: "احتيال مطالبات تأمين السيارات",
    description: "16-model fraud pipeline for 15,420 claims (5.99% fraud). AdaBoost maximizes recall (89.2%). RandomizedSearchCV XGBoost: CV AUC 0.9847. SHAP: Fault (37.9%) is the dominant fraud indicator.",
    descriptionFr: "Pipeline de fraude de 16 modèles pour 15 420 réclamations (5,99% de fraude). AdaBoost maximise le rappel (89,2%). XGBoost RandomizedSearchCV : CV AUC 0,9847. SHAP : Fault (37,9%) est le principal indicateur de fraude.",
    descriptionAr: "خط أنابيب احتيال بـ 16 نموذجاً لـ 15,420 مطالبة (5.99% احتيال). AdaBoost يعظم الاسترجاع (89.2%). XGBoost RandomizedSearchCV: CV AUC 0.9847. SHAP: الخطأ (37.9%) هو المؤشر الرئيسي للاحتيال.",
    longDescription: `Complete fraud detection pipeline for vehicle insurance with severe class imbalance (5.99% fraud rate).

**Dataset**
- 15,420 claims: 14,497 legitimate + 923 fraud (5.99%)
- 33 features: vehicle details, accident area, policy type, deductible, police report, agent type
- Engineered: Claim_Delay, Policy_Claim_Gap, VehicleAge_Price_Ratio, High_Risk_Score

**Imbalance Strategy**
- SMOTE oversampling on training set (6% → 50% fraud)
- class_weight='balanced' for all estimators
- Evaluation: Recall and Avg Precision (not accuracy — misleading at 6%)

**16-Model Leaderboard (sorted by Recall)**
| Model | AUC | Recall | Precision |
|-------|-----|--------|-----------|
| Naive Bayes | 0.62 | 0.789 | Low |
| **AdaBoost** | **0.780** | **0.892** | **Best recall** |
| Logistic Reg | 0.765 | 0.778 | Moderate |
| Decision Tree | 0.731 | 0.703 | — |
| Random Forest | 0.796 | 0.662 | — |
| XGBoost | 0.814 | 0.638 | — |
| **Voting (XGB+LGB+CB)** | **0.819** | 0.641 | **Best AUC** |

**RandomizedSearchCV — XGBoost (40 iterations, 5-fold)**
- CV AUC: **0.9847**
- Best: subsample=0.7, max_depth=7, n_estimators=500, lr=0.05

**SHAP Feature Importance (XGBoost)**
| Feature | Contribution |
|---------|-------------|
| Fault | 37.9% |
| Deductible | 12.9% |
| BasePolicy | 12.2% |
| VehicleCategory | 8.1% |
| PoliceReportFiled | 6.4% |

**5-Fold CV Stability**
RF: 0.8619 ± 0.0010 | XGB: 0.8529 ± 0.0023 | LGB: 0.8505 ± 0.0016`,
    longDescriptionFr: `Pipeline complet de détection de fraude pour l'assurance véhicule avec déséquilibre de classe sévère (5,99% de fraude).

**Données**
- 15 420 sinistres : 14 497 légitimes + 923 fraudes (5,99%)
- 33 caractéristiques : détails du véhicule, zone d'accident, type de police, franchise, rapport de police
- Caractéristiques construites : Claim_Delay, Policy_Claim_Gap, VehicleAge_Price_Ratio

**Stratégie d'équilibrage**
- Surééchantillonnage SMOTE sur l'ensemble d'entraînement (6% → 50% fraude)
- class_weight='balanced' pour tous les estimateurs
- Évaluation : Rappel et Précision Moyenne (pas la précision — trompeuse à 6%)

**Classement 16 modèles (par rappel)**
| Modèle | AUC | Rappel | Précision |
|-------|-----|--------|-----------|
| Naive Bayes | 0,62 | 0,789 | Faible |
| **AdaBoost** | **0,780** | **0,892** | **Meilleur rappel** |
| Random Forest | 0,796 | 0,662 | — |
| XGBoost | 0,814 | 0,638 | — |
| **Voting (XGB+LGB+CB)** | **0,819** | 0,641 | **Meilleur AUC** |

**RandomizedSearchCV — XGBoost (40 itérations, 5-fold)**
- CV AUC : **0,9847**
- Meilleur : subsample=0,7, max_depth=7, n_estimators=500

**Importance des features SHAP**
| Caractéristique | Contribution |
|---------|-------------|
| Fault | 37,9% |
| Deductible | 12,9% |
| BasePolicy | 12,2% |
| VehicleCategory | 8,1% |

**Stabilité 5-Fold CV**
RF: 0,8619 ± 0,0010 | XGB: 0,8529 ± 0,0023 | LGB: 0,8505 ± 0,0016`,
    longDescriptionAr: `خط أنابيب كامل للكشف عن احتيال تأمين السيارات مع عدم توازن شديد في الفئات (5.99% احتيال).

**مجموعة البيانات**
- 15,420 مطالبة: 14,497 شرعية + 923 احتيال (5.99%)
- 33 ميزة: تفاصيل السيارة، منطقة الحادث، نوع البوليصة، الخصم
- ميزات مهندسة: Claim_Delay، Policy_Claim_Gap، VehicleAge_Price_Ratio

**استراتيجية التوازن**
- فرط العينات بـ SMOTE (6% → 50% احتيال)
- class_weight='balanced' لجميع المقدِّرات
- التقييم: الاسترجاع والدقة المتوسطة (لا الدقة — مضللة عند 6%)

**ترتيب 16 نموذجاً (حسب الاسترجاع)**
| النموذج | AUC | الاسترجاع |
|-------|-----|--------|
| Naive Bayes | 0.62 | 0.789 |
| **AdaBoost** | **0.780** | **0.892** |
| Random Forest | 0.796 | 0.662 |
| XGBoost | 0.814 | 0.638 |
| **Voting (XGB+LGB+CB)** | **0.819** | 0.641 |

**RandomizedSearchCV — XGBoost (40 تكرار، 5-fold)**
- CV AUC: **0.9847**
- الأفضل: subsample=0.7، max_depth=7، n_estimators=500

**أهمية الميزات SHAP**
| الميزة | المساهمة |
|---------|-------------|
| Fault | 37.9% |
| Deductible | 12.9% |
| BasePolicy | 12.2% |
| VehicleCategory | 8.1% |

**استقرار 5-Fold CV**
RF: 0.8619 ± 0.0010 | XGB: 0.8529 ± 0.0023 | LGB: 0.8505 ± 0.0016`,
    category: ["fraud"],
    tags: ["XGBoost", "SMOTE", "SHAP", "Insurance", "RandomizedSearchCV", "AdaBoost"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/vehicle-insurance-claim-fraud-detection",
    featured: false,
    metrics: "AUC: 0.9847 (CV) | Recall: 89.2% (AdaBoost)",
    dataset: "15,420 insurance claims, 33 features, 5.99% fraud",
    datasetFr: "15 420 réclamations d'assurance, 33 caractéristiques, 5,99% de fraude",
    datasetAr: "15,420 مطالبة تأمينية، 33 ميزة، 5.99% احتيال",
    results: [
      { label: "XGBoost CV AUC", value: "0.9847" },
      { label: "AdaBoost Recall", value: "89.2%" },
      { label: "Voting Ensemble AUC", value: "0.819" },
      { label: "Top SHAP feature", value: "Fault (37.9%)" },
    ],
    techStack: ["Python", "XGBoost", "LightGBM", "CatBoost", "SMOTE", "SHAP", "Scikit-learn"],
    approach: "SMOTE → 16-model benchmark → RandomizedSearchCV HPO → SHAP analysis",
    approachFr: "SMOTE → benchmark de 16 modèles → HPO RandomizedSearchCV → analyse SHAP",
    approachAr: "SMOTE → معيار 16 نموذجاً → HPO RandomizedSearchCV → تحليل SHAP",
  },
  {
    id: "face-recognition",
    title: "Face Recognition Person Search",
    titleFr: "Recherche de Personnes par Reconnaissance Faciale",
    titleAr: "البحث عن الأشخاص بالتعرف على الوجه",
    description: "Zero-shot face recognition with pretrained dlib ResNet-50 (VGGFace2) embeddings. Searches 13,233 LFW images via 128-d Euclidean distance. 18/19 correct matches at tolerance 0.55. No training required.",
    descriptionFr: "Reconnaissance faciale zero-shot avec embeddings ResNet-50 (VGGFace2) préentraînés. Recherche de 13 233 images LFW via distance euclidienne 128D. 18/19 correspondances correctes au seuil 0,55. Aucun entraînement requis.",
    descriptionAr: "تعرف على الوجه بدون تدريب باستخدام تضمينات ResNet-50 (VGGFace2) المدربة مسبقاً. البحث في 13,233 صورة LFW عبر المسافة الإقليدية 128D. 18/19 تطابقات صحيحة عند الحد 0.55. لا يتطلب تدريباً.",
    longDescription: `Zero-shot face recognition — pretrained dlib ResNet-50 (VGGFace2) with Euclidean distance search.

**Dataset**
- LFW (Labeled Faces in the Wild): 13,233 images, 5,749 identities
- Deep-funneled pre-aligned variant
- Query selection: identities with ≥10 photos (random seed 42)

**3-Step Pipeline**
1. Auto-select query person (≥10 photos available)
2. Extract 128-d ResNet-50 embedding for anchor image
3. Search entire person folder: Euclidean distance → threshold @ 0.55

**Results (Query: Abdullah_Gul)**
| Metric | Value |
|--------|-------|
| Photos available | 19 |
| Matched correctly | 18 / 19 (94.7% recall) |
| Distance range | 0.000 → 0.493 |
| Threshold | 0.55 |
| Inference mode | HOG (CPU, fast) |

**Why Zero-Shot Works**
ResNet-50 trained on VGGFace2 (3M+ face images, 9K identities) learns a face embedding space where the same person clusters tightly regardless of lighting, pose, or aging. The metric learning objective ensures inter-identity distances are larger than intra-identity distances — even for identities never seen during training.

**Enhancement (Optional)**
Average embeddings from multiple query photos → more robust anchor representation. Reduces sensitivity to a single pose/lighting condition.`,
    longDescriptionFr: `Reconnaissance faciale zero-shot — ResNet-50 (VGGFace2) préentraîné avec recherche par distance euclidienne.

**Données**
- LFW (Labeled Faces in the Wild) : 13 233 images, 5 749 identités
- Variante deep-funneled pré-alignée
- Sélection de la requête : identités avec ≥10 photos (graine aléatoire 42)

**Pipeline en 3 étapes**
1. Sélection automatique de la personne requête (≥10 photos disponibles)
2. Extraction d'un embedding ResNet-50 128-d pour l'image d'ancrage
3. Recherche dans tout le dossier de la personne : distance euclidienne → seuil @ 0,55

**Résultats (Requête : Abdullah_Gul)**
| Métrique | Valeur |
|--------|-------|
| Photos disponibles | 19 |
| Correctement appariées | 18 / 19 (rappel 94,7%) |
| Plage de distance | 0,000 → 0,493 |
| Seuil | 0,55 |
| Mode d'inférence | HOG (CPU, rapide) |

**Pourquoi le zero-shot fonctionne**
ResNet-50 entraîné sur VGGFace2 (3M+ images de visages, 9K identités) apprend un espace d'embedding facial où la même personne se regroupe étroitement indépendamment de l'éclairage, de la pose ou du vieillissement. L'objectif de metric learning garantit que les distances inter-identités sont plus grandes que les distances intra-identités — même pour les identités jamais vues à l'entraînement.

**Amélioration (optionnel)**
Moyenne des embeddings de plusieurs photos requête → représentation d'ancrage plus robuste. Réduit la sensibilité à une seule pose/condition d'éclairage.`,
    longDescriptionAr: `تعرف على الوجه بدون تدريب — ResNet-50 (VGGFace2) مدرب مسبقاً مع بحث بالمسافة الإقليدية.

**مجموعة البيانات**
- LFW (Labeled Faces in the Wild): 13,233 صورة، 5,749 هوية
- نسخة deep-funneled محاذاة مسبقاً
- اختيار الاستعلام: هويات بـ ≥10 صور (بذرة عشوائية 42)

**خط أنابيب من 3 خطوات**
1. اختيار الشخص المستعلَم تلقائياً (≥10 صور متاحة)
2. استخراج تضمين ResNet-50 بـ 128-d لصورة المرساة
3. البحث في مجلد الشخص كاملاً: مسافة إقليدية → عتبة @ 0.55

**النتائج (الاستعلام: Abdullah_Gul)**
| المقياس | القيمة |
|--------|-------|
| الصور المتاحة | 19 |
| تطابق صحيح | 18 / 19 (استرجاع 94.7%) |
| نطاق المسافة | 0.000 → 0.493 |
| العتبة | 0.55 |
| وضع الاستدلال | HOG (CPU، سريع) |

**لماذا يعمل الأسلوب بدون تدريب**
ResNet-50 المدرب على VGGFace2 (3M+ صورة وجه، 9K هوية) يتعلم فضاء تضمين وجه حيث يتجمع نفس الشخص بإحكام بغض النظر عن الإضاءة أو الوضع أو التقدم في العمر. هدف metric learning يضمن أن المسافات بين الهويات أكبر من المسافات داخل نفس الهوية.

**تحسين (اختياري)**
متوسط التضمينات من صور استعلام متعددة → تمثيل مرساة أكثر قوة. يقلل الحساسية لوضع واحد أو ظرف إضاءة.`,
    category: ["cv"],
    tags: ["Face Recognition", "dlib", "ResNet-50", "VGGFace2", "LFW", "Zero-shot", "Metric Learning"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/face-recognition-person-search-system",
    featured: false,
    metrics: "18/19 matches — 94.7% recall at threshold 0.55",
    dataset: "LFW: 13,233 images, 5,749 identities (deep-funneled)",
    datasetFr: "LFW : 13 233 images, 5 749 identités (variante deep-funneled)",
    datasetAr: "LFW: 13,233 صورة، 5,749 هوية (نسخة deep-funneled)",
    results: [
      { label: "Recall (query folder)", value: "94.7% (18/19)" },
      { label: "Embedding dimension", value: "128-d" },
      { label: "Threshold", value: "0.55" },
      { label: "Training required", value: "None" },
    ],
    techStack: ["Python", "dlib (ResNet-50)", "face_recognition", "OpenCV", "LFW dataset"],
    approach: "Pretrained VGGFace2 embeddings + Euclidean distance search — zero-shot",
    approachFr: "Embeddings VGGFace2 préentraînés + recherche par distance euclidienne — zero-shot",
    approachAr: "تضمينات VGGFace2 المدربة مسبقاً + بحث بالمسافة الإقليدية — بدون تدريب",
  },
  {
    id: "facial-emotion",
    title: "Facial Emotion Recognition",
    titleFr: "Reconnaissance des Émotions Faciales",
    titleAr: "التعرف على المشاعر من الوجه",
    description: "7-class emotion recognition on RAF-DB (12,271 images). Ensemble of ResNet50+ViT-Small+EfficientNetB3 achieves 86.57%. 2-phase transfer learning. GradCAM confirms focus on mouth/brow/eye regions per emotion.",
    descriptionFr: "Reconnaissance de 7 émotions sur RAF-DB (12 271 images). Ensemble ResNet50+ViT-Small+EfficientNetB3 atteint 86,57%. Apprentissage par transfert en 2 phases. GradCAM confirme la focalisation sur bouche/sourcils/yeux.",
    descriptionAr: "تعرف على 7 مشاعر على RAF-DB (12,271 صورة). مجموعة ResNet50+ViT-Small+EfficientNetB3 تحقق 86.57%. نقل تعلم بمرحلتين. GradCAM يؤكد التركيز على مناطق الفم والحاجب والعين لكل مشعر.",
    longDescription: `Multi-model facial emotion pipeline on RAF-DB — a challenging real-world dataset with 17× class imbalance.

**Dataset (RAF-DB)**
- 12,271 train + 3,068 test, 7 emotion classes
- Pre-aligned 100×100 RGB, ImageNet normalization
- **Class imbalance 17×**: Happiness (4,772) vs Fear (281)
- Imbalance handling: WeightedRandomSampler + label smoothing 0.1

| Class | Train | Test |
|-------|-------|------|
| Happiness | 4,772 | 1,185 |
| Neutral | 2,524 | 680 |
| Sadness | 1,982 | 478 |
| Anger | 705 | 162 |
| Disgust | 717 | 160 |
| Surprise | 1,290 | 329 |
| Fear | 281 | 74 |

**All Models Compared**
| Model | Val Accuracy |
|-------|-------------|
| HOG + SVM | 70.66% |
| SimpleCNN (2.78M params) | 71.64% |
| DeepCNN + ResBlocks (0.78M) | 75.10% |
| EfficientNetB3 | 73.21% |
| ViT-Small | 84.03% |
| **ResNet50** | **84.84%** |
| **Ensemble (top 3 TL)** | **86.57%** |

**2-Phase Transfer Learning**
1. **Warmup** (5–8 epochs): frozen backbone, train head only
2. **Fine-tune** (20 epochs): full network, cosine annealing LR

**GradCAM Findings**
- Happiness: mouth corners and cheek areas
- Anger: inner brow and lip region
- Fear: wide eye opening + raised brows
- Disgust: nose wrinkle + upper lip
- Misclassifications: Fear↔Sad (similar brow drop), Disgust↔Angry (similar lip tension)`,
    longDescriptionFr: `Pipeline de reconnaissance des émotions faciales multi-modèles sur RAF-DB — un dataset réel difficile avec un déséquilibre de classe 17×.

**Données (RAF-DB)**
- 12 271 entraînement + 3 068 test, 7 classes d'émotions
- RGB 100×100 pré-aligné, normalisation ImageNet
- **Déséquilibre de classe 17×** : Joie (4 772) vs Peur (281)
- Gestion du déséquilibre : WeightedRandomSampler + label smoothing 0,1

**Tous les modèles comparés**
| Modèle | Précision Val |
|-------|-------------|
| HOG + SVM | 70,66% |
| SimpleCNN (2,78M params) | 71,64% |
| DeepCNN + ResBlocks | 75,10% |
| EfficientNetB3 | 73,21% |
| ViT-Small | 84,03% |
| **ResNet50** | **84,84%** |
| **Ensemble (top 3 TL)** | **86,57%** |

**Apprentissage par transfert en 2 phases**
1. **Préchauffage** (5–8 époques) : backbone gelé, entraîner uniquement la tête
2. **Fine-tuning** (20 époques) : réseau complet, cosine annealing LR

**Résultats GradCAM**
- Joie : coins de la bouche et joues
- Colère : front intérieur et lèvres
- Peur : yeux grands ouverts + sourcils levés
- Dégoût : plissement du nez + lèvre supérieure
- Erreurs de classification : Peur↔Tristesse (chute de sourcils similaire), Dégoût↔Colère (tension labiale similaire)`,
    longDescriptionAr: `خط أنابيب متعدد النماذج للتعرف على المشاعر على RAF-DB — مجموعة بيانات واقعية صعبة بعدم توازن فئوي 17×.

**البيانات (RAF-DB)**
- 12,271 تدريب + 3,068 اختبار، 7 فئات مشاعر
- RGB 100×100 محاذى مسبقاً، تطبيع ImageNet
- **عدم توازن 17×**: سعادة (4,772) مقابل خوف (281)
- معالجة عدم التوازن: WeightedRandomSampler + label smoothing 0.1

**مقارنة جميع النماذج**
| النموذج | دقة التحقق |
|-------|-------------|
| HOG + SVM | 70.66% |
| SimpleCNN | 71.64% |
| DeepCNN + ResBlocks | 75.10% |
| EfficientNetB3 | 73.21% |
| ViT-Small | 84.03% |
| **ResNet50** | **84.84%** |
| **المجموعة (أفضل 3 TL)** | **86.57%** |

**نقل التعلم بمرحلتين**
1. **إحماء** (5-8 حقب): عمود فقري مجمّد، تدريب الرأس فقط
2. **ضبط دقيق** (20 حقبة): شبكة كاملة، cosine annealing LR

**نتائج GradCAM**
- السعادة: زوايا الفم والخدين
- الغضب: منطقة الحاجب الداخلي والشفتين
- الخوف: فتح العيون واسعاً + رفع الحواجب
- الاشمئزاز: تجعد الأنف + الشفة العليا
- أخطاء التصنيف: الخوف↔الحزن (انخفاض الحاجب متشابه)، الاشمئزاز↔الغضب (شد الشفاه متشابه)`,
    category: ["cv"],
    tags: ["ResNet50", "ViT-Small", "EfficientNetB3", "GradCAM", "RAF-DB", "Emotion", "Ensemble"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/facial-emotion-recognition",
    featured: false,
    metrics: "86.57% accuracy (ensemble)",
    dataset: "RAF-DB: 15,339 images, 7 emotions, 17× class imbalance",
    datasetFr: "RAF-DB : 15 339 images, 7 émotions, déséquilibre 17×",
    datasetAr: "RAF-DB: 15,339 صورة، 7 مشاعر، عدم توازن 17×",
    results: [
      { label: "Ensemble Accuracy", value: "86.57%" },
      { label: "ResNet50 Accuracy", value: "84.84%" },
      { label: "ViT-Small Accuracy", value: "84.03%" },
      { label: "HOG+SVM Baseline", value: "70.66%" },
    ],
    techStack: ["Python", "PyTorch", "ResNet50", "ViT-Small", "EfficientNetB3", "GradCAM"],
    approach: "HOG+SVM → custom CNNs → 2-phase transfer learning → soft ensemble + GradCAM",
    approachFr: "HOG+SVM → CNN personnalisés → TL en 2 phases → ensemble doux + GradCAM",
    approachAr: "HOG+SVM → شبكات CNN مخصصة → نقل تعلم بمرحلتين → مجموعة ناعمة + GradCAM",
  },
  {
    id: "yolo-parking",
    title: "YOLOv8 Smart Parking Detection",
    titleFr: "Détection de Stationnement Intelligent YOLOv8",
    titleAr: "كشف مواقف السيارات الذكية بـ YOLOv8",
    description: "Binary parking occupancy (free vs not-free) with YOLOv8n. Test mAP50=0.942, mAP50-95=0.798. Early stopped at epoch 74. 30 CVAT-annotated images (22/4/4). Inference: 9 free + 21 occupied per lot @ 41.2ms.",
    descriptionFr: "Occupation des places de stationnement (libre vs occupée) avec YOLOv8n. Test mAP50=0,942, mAP50-95=0,798. Arrêt anticipé à l'époque 74. 30 images annotées CVAT (22/4/4). Inférence : 9 libres + 21 occupées par lot @ 41,2ms.",
    descriptionAr: "كشف إشغال مواقف السيارات (حر مقابل محجوز) بـ YOLOv8n. Test mAP50=0.942، mAP50-95=0.798. توقف مبكر عند الحقبة 74. 30 صورة مُعلَّمة بـ CVAT (22/4/4). استدلال: 9 مجانية + 21 محجوزة لكل موقف @ 41.2ms.",
    longDescription: `Parking space occupancy detection using YOLOv8n on a custom CVAT-annotated dataset.

**Dataset & Annotation**
- 30 parking lot images with CVAT polygon annotations
- 2 classes: free_parking_space / not_free_parking_space
- Train: 22 / Val: 4 / Test: 4 (stratified by class ratio)
- Annotations converted from CVAT XML polygons to YOLO normalized bboxes

**CVAT XML → YOLO Conversion**
\`\`\`python
# For each polygon in CVAT XML:
x_min, y_min = min(pts_x), min(pts_y)
x_max, y_max = max(pts_x), max(pts_y)
cx = ((x_min + x_max) / 2) / img_width    # normalized center x
cy = ((y_min + y_max) / 2) / img_height   # normalized center y
w  = (x_max - x_min) / img_width
h  = (y_max - y_min) / img_height
\`\`\`

**Training Config**
| Parameter | Value |
|-----------|-------|
| Model | YOLOv8n (3.01M params, 73 layers, 8.1 GFLOPs) |
| Max epochs | 100 |
| Early stopping | patience=10 → **stopped at epoch 74** |
| Batch size | 16 |
| Image size | 640 |
| Optimizer | AdamW |

**Validation Results (best model, 4 images)**
| Metric | Value |
|--------|-------|
| mAP50 | **0.994** |
| mAP50-95 | **0.880** |
| Precision | 0.982 |
| Recall | 0.989 |

**Test Set Results (4 images, 110 instances)**
| Class | Precision | Recall | mAP50 | mAP50-95 |
|-------|-----------|--------|-------|----------|
| Free spaces | 0.959 | 0.709 | 0.918 | 0.782 |
| Not-free spaces | 0.894 | 0.935 | 0.967 | 0.814 |
| **Overall** | **0.926** | **0.822** | **0.942** | **0.798** |

**Inference Demo (single 352×640 image)**
- Detected: **9 free** + **21 not-free** parking spaces
- Speed: 2.2ms preprocess + **41.2ms inference** + 1.4ms postprocess @ confidence=0.25

**Application**
Real-time parking management: camera → YOLOv8n → occupancy counts → display board update. Despite only 30 training images, pretrained COCO weights transfer the object detection priors effectively to this domain-specific binary classification task.`,
    longDescriptionFr: `Détection d'occupation des places de stationnement avec YOLOv8n sur un dataset CVAT annoté.

**Données & Annotation**
- 30 images de parking avec annotations polygonales CVAT
- 2 classes : free_parking_space / not_free_parking_space
- Entraînement : 22 / Val : 4 / Test : 4 (stratifié par ratio de classe)
- Annotations converties de polygones CVAT XML en bbox YOLO normalisées

**Conversion CVAT XML → YOLO**
\`\`\`python
cx = ((x_min + x_max) / 2) / img_width    # centre x normalisé
cy = ((y_min + y_max) / 2) / img_height   # centre y normalisé
w  = (x_max - x_min) / img_width
h  = (y_max - y_min) / img_height
\`\`\`

**Configuration d'entraînement**
| Paramètre | Valeur |
|-----------|-------|
| Modèle | YOLOv8n (3,01M params, 73 couches) |
| Époques max | 100 |
| Arrêt anticipé | patience=10 → **arrêté à l'époque 74** |
| Taille d'image | 640 |

**Résultats de validation**
| Métrique | Valeur |
|--------|-------|
| mAP50 | **0,994** |
| mAP50-95 | **0,880** |
| Précision | 0,982 |
| Rappel | 0,989 |

**Résultats test (4 images, 110 instances)**
mAP50 global : **0,942** | mAP50-95 : **0,798**

**Application**
Gestion de parking en temps réel : caméra → YOLOv8n → comptes d'occupation → mise à jour du panneau d'affichage. Malgré seulement 30 images d'entraînement, les poids COCO préentraînés transfèrent efficacement les priors de détection d'objets.`,
    longDescriptionAr: `كشف إشغال مواقف السيارات بـ YOLOv8n على مجموعة بيانات CVAT مُعلَّمة.

**البيانات والتعليقات**
- 30 صورة موقف سيارات مع تعليقات مضلعات CVAT
- فئتان: free_parking_space / not_free_parking_space
- تدريب: 22 / تحقق: 4 / اختبار: 4 (طبقي حسب نسبة الفئة)
- التعليقات محوّلة من مضلعات CVAT XML إلى صناديق حدود YOLO

**تحويل CVAT XML → YOLO**
\`\`\`python
cx = ((x_min + x_max) / 2) / img_width    # مركز x مُطبَّع
cy = ((y_min + y_max) / 2) / img_height   # مركز y مُطبَّع
w  = (x_max - x_min) / img_width
h  = (y_max - y_min) / img_height
\`\`\`

**إعداد التدريب**
| المعامل | القيمة |
|-----------|-------|
| النموذج | YOLOv8n (3.01M معامل، 73 طبقة) |
| الحقب القصوى | 100 |
| التوقف المبكر | patience=10 → **توقف عند الحقبة 74** |
| حجم الصورة | 640 |

**نتائج التحقق**
| المقياس | القيمة |
|--------|-------|
| mAP50 | **0.994** |
| mAP50-95 | **0.880** |
| الدقة | 0.982 |
| الاسترجاع | 0.989 |

**نتائج الاختبار (4 صور، 110 عينة)**
mAP50 الإجمالي: **0.942** | mAP50-95: **0.798**

**التطبيق**
إدارة مواقف السيارات في الوقت الفعلي: كاميرا → YOLOv8n → أعداد الإشغال → تحديث لوحة العرض. رغم 30 صورة تدريبية فقط، تنقل أوزان COCO المدربة مسبقاً المعرفة المسبقة للكشف عن الأجسام بفاعلية.`,
    category: ["cv"],
    tags: ["YOLOv8", "Object Detection", "CVAT", "Parking", "Real-time", "Custom Dataset"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/yolov8-parking-detection",
    featured: false,
    metrics: "Test mAP50: 0.942 | Val mAP50: 0.994",
    dataset: "30 CVAT-annotated parking lot images (22/4/4 split)",
    datasetFr: "30 images de parking annotées CVAT (division 22/4/4)",
    datasetAr: "30 صورة موقف سيارات مُعلَّمة بـ CVAT (تقسيم 22/4/4)",
    results: [
      { label: "Test mAP50", value: "0.942" },
      { label: "Val mAP50", value: "0.994" },
      { label: "Test mAP50-95", value: "0.798" },
      { label: "Inference speed", value: "41.2ms / image" },
    ],
    techStack: ["Python", "YOLOv8n (Ultralytics)", "CVAT XML", "AdamW", "Tesla T4 GPU"],
    approach: "CVAT polygon → YOLO bbox → YOLOv8n fine-tuning (early stopped ep 74)",
    approachFr: "Polygones CVAT → bbox YOLO → fine-tuning YOLOv8n (arrêt anticipé époque 74)",
    approachAr: "مضلعات CVAT → مربعات YOLO → ضبط دقيق YOLOv8n (توقف مبكر الحقبة 74)",
  },
  {
    id: "cancer-detection",
    title: "Cancer Detection — YOLOv8 (n/s/m)",
    titleFr: "Détection du Cancer — YOLOv8 (n/s/m)",
    titleAr: "كشف السرطان — YOLOv8 (n/s/m)",
    description: "3-variant YOLOv8 benchmark for cancer localization. YOLOv8m: test mAP50=0.6782, Precision=0.7633, F1=0.6941. 1,968 training images. Exported ONNX (49.8 MB) + TorchScript (99.1 MB).",
    descriptionFr: "Benchmark de 3 variantes YOLOv8 pour la localisation du cancer. YOLOv8m : test mAP50=0,6782, Précision=0,7633, F1=0,6941. 1 968 images d'entraînement. Export ONNX (49,8 Mo) + TorchScript (99,1 Mo).",
    descriptionAr: "معيار 3 متغيرات YOLOv8 للكشف عن السرطان. YOLOv8m: test mAP50=0.6782، Precision=0.7633، F1=0.6941. 1,968 صورة تدريبية. تصدير ONNX (49.8 MB) + TorchScript (99.1 MB).",
    longDescription: `YOLOv8 benchmark for cancer detection in histopathology/medical images.

**Dataset**
- 1,968 train / 185 val / 94 test images — single class: cancer
- Average 1.10 bounding boxes per image
- Lesion size distribution: left-skewed (many small, few large)

**3-Model Comparison (Test Set)**
| Model | mAP50 | mAP50-95 | Precision | Recall | F1 |
|-------|-------|----------|-----------|--------|----|
| YOLOv8n (3.2M) | 0.6191 | — | — | — | — |
| YOLOv8s (11.2M) | 0.5879 | — | — | — | — |
| **YOLOv8m (25.9M)** | **0.6782** | **0.2305** | **0.7633** | **0.6364** | **0.6941** |

**Validation Set** (for reference)
YOLOv8n val mAP50=0.6849 (slightly higher than m on val — may have overfit val distribution)

**Training Config**
50 epochs, auto-batch, FP16 mixed precision, mosaic augmentation, AdamW, patience=10

**Deployment Exports**
| Format | Size |
|--------|------|
| ONNX (FP16) | 49.8 MB |
| TorchScript | 99.1 MB |

**Key Finding**
On the test set, the larger YOLOv8m outperforms nano and small despite the small dataset. The COCO pretrained weights transfer relevant object detection priors even for medical images, and the larger capacity better captures subtle cancer features.`,
    longDescriptionFr: `Benchmark YOLOv8 pour la détection du cancer dans des images médicales.

**Données**
- 1 968 entraînement / 185 validation / 94 test — 1 classe : cancer
- Distribution des tailles de lésions : asymétrique à gauche (beaucoup de petites, peu de grandes)

**Comparaison 3 modèles (ensemble de test)**
| Modèle | mAP50 | mAP50-95 | Précision | Rappel | F1 |
|-------|-------|----------|-----------|--------|----|
| YOLOv8n (3,2M) | 0,6191 | — | — | — | — |
| YOLOv8s (11,2M) | 0,5879 | — | — | — | — |
| **YOLOv8m (25,9M)** | **0,6782** | **0,2305** | **0,7633** | **0,6364** | **0,6941** |

**Configuration d'entraînement**
50 époques, batch automatique, précision mixte FP16, augmentation mosaïque, AdamW, patience=10

**Exports pour déploiement**
| Format | Taille |
|--------|------|
| ONNX (FP16) | 49,8 Mo |
| TorchScript | 99,1 Mo |

**Résultat clé**
Sur l'ensemble de test, YOLOv8m surpasse nano et small malgré le petit dataset. Les poids COCO préentraînés transfèrent des connaissances de détection pertinentes même pour les images médicales.`,
    longDescriptionAr: `معيار YOLOv8 للكشف عن السرطان في صور طبية.

**مجموعة البيانات**
- 1,968 تدريب / 185 تحقق / 94 اختبار — فئة واحدة: سرطان
- توزيع حجم الآفات: منحرف يسار (كثير صغيرة، قليل كبيرة)

**مقارنة 3 نماذج (مجموعة الاختبار)**
| النموذج | mAP50 | mAP50-95 | الدقة | الاسترجاع | F1 |
|-------|-------|----------|-----------|--------|----|
| YOLOv8n (3.2M) | 0.6191 | — | — | — | — |
| YOLOv8s (11.2M) | 0.5879 | — | — | — | — |
| **YOLOv8m (25.9M)** | **0.6782** | **0.2305** | **0.7633** | **0.6364** | **0.6941** |

**إعداد التدريب**
50 حقبة، دفعة تلقائية، دقة مختلطة FP16، تضخيم فسيفساء، AdamW، patience=10

**تصديرات النشر**
| الصيغة | الحجم |
|--------|------|
| ONNX (FP16) | 49.8 MB |
| TorchScript | 99.1 MB |

**نتيجة رئيسية**
على مجموعة الاختبار، YOLOv8m يتفوق على nano وsmall رغم صغر مجموعة البيانات. تنقل أوزان COCO المدربة مسبقاً معرفة الكشف ذات الصلة حتى للصور الطبية.`,
    category: ["medical", "cv"],
    tags: ["YOLOv8", "Object Detection", "Medical Imaging", "ONNX", "Cancer", "Ultralytics"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/cancer-detection",
    featured: false,
    metrics: "mAP50: 0.6782 (YOLOv8m test)",
    dataset: "1,968 cancer images, 1 class, ~1.1 bbox/image",
    datasetFr: "1 968 images de cancer, 1 classe, ~1,1 bbox/image",
    datasetAr: "1,968 صورة سرطانية، فئة واحدة، ~1.1 مربع/صورة",
    results: [
      { label: "YOLOv8m mAP50 (test)", value: "0.6782" },
      { label: "YOLOv8m Precision", value: "0.7633" },
      { label: "YOLOv8m F1", value: "0.6941" },
      { label: "ONNX export size", value: "49.8 MB" },
    ],
    techStack: ["Python", "YOLOv8 (Ultralytics)", "ONNX", "TorchScript", "CUDA Tesla T4"],
    approach: "3-variant YOLOv8 benchmark with ONNX + TorchScript export for deployment",
    approachFr: "Benchmark de 3 variantes YOLOv8 avec export ONNX + TorchScript pour le déploiement",
    approachAr: "معيار 3 متغيرات YOLOv8 مع تصدير ONNX + TorchScript للنشر",
  },
  {
    id: "yolo-animals",
    title: "YOLOv8 Animals Detection",
    titleFr: "Détection d'Animaux YOLOv8",
    titleAr: "كشف الحيوانات بـ YOLOv8",
    description: "80-class animal detection with YOLOv8n. mAP@0.5=0.668, mAP@0.5:0.95=0.560. Best: Tiger (0.967), Sparrow (0.953). Challenging: Squid (0.009). ONNX (12.3 MB). 29,071 images across 80 species.",
    descriptionFr: "Détection d'animaux en 80 classes avec YOLOv8n. mAP@0,5=0,668, mAP@0,5:0,95=0,560. Meilleur : Tigre (0,967), Moineau (0,953). Difficile : Calmar (0,009). ONNX (12,3 Mo). 29 071 images pour 80 espèces.",
    descriptionAr: "كشف الحيوانات بـ 80 فئة مع YOLOv8n. mAP@0.5=0.668. الأفضل: النمر (0.967)، عصفور (0.953). الأصعب: الحبار (0.009). ONNX (12.3 MB). 29,071 صورة لـ 80 نوعاً.",
    longDescription: `80-class animal detection pipeline using YOLOv8n.

**Dataset**
- 22,566 annotated images: 18,053 train / 4,513 val + 6,505 test
- 80 animal species: Bear → Zebra (alphabetically)
- CVAT XML → YOLO normalized format (multi-threaded, 4 CPU workers)
- Class imbalance: 2 images (rare species) to 100+ (common species)

**Training**
YOLOv8n (3.15M params, 73 layers) — 50 epochs, batch=16, imgsz=640, AdamW (lr=1e-3), patience=10

**Overall Performance**
| Metric | Value |
|--------|-------|
| mAP@0.5 | **0.6681** |
| mAP@0.5:0.95 | **0.5596** |
| Precision | 0.6706 |
| Recall | 0.6478 |
| Inference speed | 3.0ms / image |

**Per-Class Highlights**
| Best Species | mAP@0.5 | Worst Species | mAP@0.5 |
|-------------|---------|---------------|---------|
| Tiger | 0.967 | Squid | 0.009 |
| Sparrow | 0.953 | Seahorse | 0.000 |
| Rhinoceros | 0.940 | Hamster | 0.230 |
| Hedgehog | 0.942 | | |

Performance variance is almost entirely driven by training sample count. The 3.0ms inference speed makes this viable for real-time wildlife monitoring applications.

**Deployment**: ONNX export (12.3 MB) for edge devices.`,
    longDescriptionFr: `Pipeline de détection d'animaux à 80 classes avec YOLOv8n.

**Jeu de données**
- 22 566 images annotées : 18 053 entraînement / 4 513 val + 6 505 test
- 80 espèces animales : Ours → Zèbre (alphabétiquement)
- XML CVAT → format YOLO normalisé (multi-thread, 4 workers CPU)
- Déséquilibre de classes : 2 images (espèces rares) à 100+ (espèces communes)

**Entraînement**
YOLOv8n (3,15M paramètres, 73 couches) — 50 époques, batch=16, imgsz=640, AdamW (lr=1e-3), patience=10

**Performance Globale**
| Métrique | Valeur |
|--------|-------|
| mAP@0,5 | **0,6681** |
| mAP@0,5:0,95 | **0,5596** |
| Précision | 0,6706 |
| Rappel | 0,6478 |
| Vitesse d'inférence | 3,0ms / image |

**Points Forts par Classe**
| Meilleures Espèces | mAP@0,5 | Pires Espèces | mAP@0,5 |
|-------------|---------|---------------|---------|
| Tigre | 0,967 | Calmar | 0,009 |
| Moineau | 0,953 | Hippocampe | 0,000 |
| Rhinocéros | 0,940 | Hamster | 0,230 |
| Hérisson | 0,942 | | |

La variance de performance est presque entièrement due au nombre d'échantillons d'entraînement. La vitesse de 3,0ms rend ce système viable pour la surveillance de la faune en temps réel.

**Déploiement** : Export ONNX (12,3 Mo) pour appareils edge.`,
    longDescriptionAr: `خط أنابيب كشف الحيوانات بـ 80 فئة باستخدام YOLOv8n.

**مجموعة البيانات**
- 22,566 صورة موسومة: 18,053 تدريب / 4,513 تحقق + 6,505 اختبار
- 80 نوعاً حيوانياً: دب → حمار وحشي (أبجدياً)
- XML CVAT → تنسيق YOLO المعياري (متعدد الخيوط، 4 معالجات)
- عدم توازن الفئات: من 2 صور (أنواع نادرة) إلى 100+ (أنواع شائعة)

**التدريب**
YOLOv8n (3.15M معامل، 73 طبقة) — 50 حقبة، batch=16، imgsz=640، AdamW (lr=1e-3)، patience=10

**الأداء الإجمالي**
| المقياس | القيمة |
|--------|-------|
| mAP@0.5 | **0.6681** |
| mAP@0.5:0.95 | **0.5596** |
| الدقة | 0.6706 |
| الاسترجاع | 0.6478 |
| سرعة الاستدلال | 3.0ms / صورة |

**أبرز النتائج لكل فئة**
| أفضل الأنواع | mAP@0.5 | أصعب الأنواع | mAP@0.5 |
|-------------|---------|---------------|---------|
| النمر | 0.967 | الحبار | 0.009 |
| العصفور | 0.953 | فرس البحر | 0.000 |
| وحيد القرن | 0.940 | الهامستر | 0.230 |
| القنفذ | 0.942 | | |

تعتمد تباينات الأداء بشكل شبه كامل على عدد عينات التدريب. سرعة 3.0ms تجعله صالحاً لمراقبة الحياة البرية في الوقت الفعلي.

**النشر**: تصدير ONNX (12.3 MB) للأجهزة الطرفية.`,
    category: ["cv"],
    tags: ["YOLOv8", "Object Detection", "80-class", "Wildlife", "ONNX", "Edge Deployment"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/yolov8n-animals-detection",
    featured: false,
    metrics: "mAP@0.5: 0.668 | Tiger: 0.967",
    dataset: "22,566 images, 80 species, CVAT annotated",
    datasetFr: "22 566 images, 80 espèces, annoté avec CVAT",
    datasetAr: "22,566 صورة، 80 نوعاً، مُعلَّمة بـ CVAT",
    results: [
      { label: "mAP@0.5 (overall)", value: "0.6681" },
      { label: "Best class (Tiger)", value: "0.967" },
      { label: "mAP@0.5:0.95", value: "0.5596" },
      { label: "Inference speed", value: "3.0ms / image" },
    ],
    techStack: ["Python", "YOLOv8 (Ultralytics)", "ONNX", "CVAT", "AdamW"],
    approach: "CVAT→YOLO conversion → YOLOv8n fine-tuning → ONNX export for edge deployment",
    approachFr: "Conversion CVAT→YOLO → fine-tuning YOLOv8n → export ONNX pour déploiement edge",
    approachAr: "تحويل CVAT→YOLO → ضبط دقيق YOLOv8n → تصدير ONNX للأجهزة الطرفية",
  },
  {
    id: "plant-disease",
    title: "Plant Disease Classification",
    titleFr: "Classification des Maladies des Plantes",
    titleAr: "تصنيف أمراض النباتات",
    description: "15-class PlantVillage benchmark. MobileNetV2 individual best: 92.86%. Ensemble (MobileNetV2+EfficientNetB3+ResNet50) test: 83.43%. 42.5× class imbalance. Fixed generator-reset bug that caused ensemble collapse.",
    descriptionFr: "Benchmark PlantVillage à 15 classes. MobileNetV2 meilleur individuel : 92,86%. Ensemble (MobileNetV2+EfficientNetB3+ResNet50) test : 83,43%. Déséquilibre 42,5×. Correction d'un bug de réinitialisation du générateur qui causait l'effondrement de l'ensemble.",
    descriptionAr: "معيار PlantVillage بـ 15 فئة. MobileNetV2 الأفضل فردياً: 92.86%. المجموعة (MobileNetV2+EfficientNetB3+ResNet50) على الاختبار: 83.43%. عدم توازن 42.5×. إصلاح خطأ إعادة ضبط المولّد الذي سبّب انهيار المجموعة.",
    longDescription: `Plant disease detection on PlantVillage — 15 disease classes across pepper and potato plants.

**Dataset**
- ~55,000 images, 15 classes, 80/10/10 train/val/test split
- **Class imbalance: 42.5×** (Tomato_YellowLeafCurlVirus vs Potato_healthy)
- Imbalance strategy: class weights + label smoothing 0.1

**All 6 Models**
| Model | Val Accuracy |
|-------|-------------|
| SimpleCNN | 70.01% |
| DeepCNN + BatchNorm | 78.41% |
| EfficientNetB3 (2-phase TL) | 79.93% |
| ResNet50 (2-phase TL) | 87.72% |
| **MobileNetV2 (2-phase TL)** | **92.86%** |
| Ensemble (3 TL avg) | 82.40% val / **83.43% test** |

**2-Phase Transfer Learning**
1. Warmup (8 epochs): frozen backbone
2. Fine-tune (3 epochs): CosineDecayRestarts LR, mixed precision float16

**Bug Fixed: Generator Reset**
The ensemble collapsed to ~7% accuracy (random chance) because data generators were not reset between inference passes. Each generator remembered its last position, returning misaligned batches to each model. Fix: re-initialize generators before each model's predict() call.

**Why Ensemble < MobileNetV2?**
Soft averaging MobileNetV2 (92.86%) with EfficientNetB3 (79.93%) dilutes MobileNetV2's superior predictions. The ensemble provides better test generalization (83.43%) but lower val accuracy.`,
    longDescriptionFr: `Détection de maladies végétales sur PlantVillage — 15 classes de maladies sur poivrons et plants de pommes de terre.

**Jeu de données**
- ~55 000 images, 15 classes, découpage 80/10/10 entraînement/validation/test
- **Déséquilibre de classes : 42,5×** (Tomato_YellowLeafCurlVirus vs Potato_healthy)
- Stratégie : poids de classes + label smoothing 0,1

**Les 6 Modèles**
| Modèle | Précision Val |
|-------|-------------|
| SimpleCNN | 70,01% |
| DeepCNN + BatchNorm | 78,41% |
| EfficientNetB3 (TL 2 phases) | 79,93% |
| ResNet50 (TL 2 phases) | 87,72% |
| **MobileNetV2 (TL 2 phases)** | **92,86%** |
| Ensemble (3 TL moy.) | 82,40% val / **83,43% test** |

**Transfer Learning en 2 Phases**
1. Préchauffage (8 époques) : backbone gelé
2. Fine-tuning (3 époques) : CosineDecayRestarts LR, précision mixte float16

**Bug Corrigé : Réinitialisation du Générateur**
L'ensemble s'est effondré à ~7% de précision parce que les générateurs n'étaient pas réinitialisés entre les passes d'inférence. Correction : réinitialiser les générateurs avant chaque appel predict().

**Pourquoi l'Ensemble < MobileNetV2 ?**
La moyenne douce de MobileNetV2 (92,86%) avec EfficientNetB3 (79,93%) dilue les prédictions supérieures. L'ensemble offre une meilleure généralisation test (83,43%) mais une précision val plus faible.`,
    longDescriptionAr: `كشف أمراض النباتات على PlantVillage — 15 فئة أمراض لنباتات الفلفل والبطاطس.

**مجموعة البيانات**
- ~55,000 صورة، 15 فئة، تقسيم 80/10/10 تدريب/تحقق/اختبار
- **عدم توازن الفئات: 42.5×** (Tomato_YellowLeafCurlVirus مقابل Potato_healthy)
- الاستراتيجية: أوزان الفئات + label smoothing 0.1

**النماذج الـ 6**
| النموذج | دقة التحقق |
|-------|-------------|
| SimpleCNN | 70.01% |
| DeepCNN + BatchNorm | 78.41% |
| EfficientNetB3 (نقل تعلم 2 مرحلة) | 79.93% |
| ResNet50 (نقل تعلم 2 مرحلة) | 87.72% |
| **MobileNetV2 (نقل تعلم 2 مرحلة)** | **92.86%** |
| المجموعة (متوسط 3 نماذج) | 82.40% تحقق / **83.43% اختبار** |

**نقل التعلم بمرحلتين**
1. إحماء (8 حقب): نواة مجمدة
2. ضبط دقيق (3 حقب): CosineDecayRestarts LR، دقة مختلطة float16

**خطأ مُصلَح: إعادة ضبط المولّد**
انهارت المجموعة إلى ~7% دقة لأن مولدات البيانات لم تُعاد تهيئتها بين مرات الاستدلال. الإصلاح: إعادة تهيئة المولدات قبل كل استدعاء predict().

**لماذا المجموعة < MobileNetV2؟**
متوسط MobileNetV2 (92.86%) مع EfficientNetB3 (79.93%) يخفف التنبؤات المتفوقة. المجموعة تتيح تعميماً أفضل على الاختبار (83.43%) لكن دقة تحقق أقل.`,
    category: ["cv"],
    tags: ["MobileNetV2", "EfficientNetB3", "ResNet50", "Ensemble", "Agriculture", "Transfer Learning"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/plant-disease-classification",
    featured: false,
    metrics: "92.86% (MobileNetV2) | 83.43% (ensemble test)",
    dataset: "PlantVillage: ~55K images, 15 classes, 42.5× imbalance",
    datasetFr: "PlantVillage : ~55K images, 15 classes, déséquilibre 42,5×",
    datasetAr: "PlantVillage: ~55K صورة، 15 فئة، عدم توازن 42.5×",
    results: [
      { label: "MobileNetV2 Val Acc", value: "92.86%" },
      { label: "Ensemble Test Acc", value: "83.43%" },
      { label: "ResNet50 Val Acc", value: "87.72%" },
      { label: "SimpleCNN Val Acc", value: "70.01%" },
    ],
    techStack: ["Python", "TensorFlow 2.19", "MobileNetV2", "EfficientNetB3", "ResNet50", "Keras"],
    approach: "2-phase TL (warmup + fine-tune) → soft ensemble with class-weighted loss",
    approachFr: "TL en 2 phases (préchauffage + fine-tuning) → ensemble doux avec perte pondérée par classe",
    approachAr: "نقل تعلم بمرحلتين (إحماء + ضبط دقيق) → مجموعة ناعمة مع خسارة مرجحة بالفئة",
  },
  {
    id: "butterfly-classification",
    title: "Butterfly Species Classification",
    titleFr: "Classification d'Espèces de Papillons",
    titleAr: "تصنيف أنواع الفراشات",
    description: "4-phase multi-model pipeline for 75-species classification. Vanilla CNN → pretrained TL → hybrid parallel/sequential → multi-loss auxiliary heads. Grad-CAM confirms wing-pattern focus. t-SNE shows inter-species clustering.",
    descriptionFr: "Pipeline multi-modèle en 4 phases pour la classification de 75 espèces. CNN vanille → TL préentraîné → architecture hybride parallèle/séquentielle → têtes auxiliaires multi-perte. Grad-CAM confirme la focalisation sur les motifs d'ailes.",
    descriptionAr: "خط أنابيب متعدد النماذج من 4 مراحل لتصنيف 75 نوعاً. CNN أساسي → TL مدرب مسبقاً → بنية هجينة متوازية/تسلسلية → رؤوس مساعدة متعددة الخسائر. Grad-CAM يؤكد التركيز على أنماط الأجنحة.",
    longDescription: `Advanced 4-phase training strategy for fine-grained 75-class butterfly species classification.

**Dataset**
- 5,199 training + 1,300 validation images, 75 species
- Natural backgrounds, varying lighting, occlusion
- Augmentation: rotation ±30°, flip, zoom 0.2, brightness/contrast ±20%

**4-Phase Progressive Training**
| Phase | Architecture | Key Feature |
|-------|-------------|------------|
| 1 | Vanilla CNN | Standard conv blocks, augmentation baseline |
| 2 | Pretrained CNNs | VGG16/ResNet frozen → fine-tuned |
| 3 | Hybrid parallel/sequential | Multi-scale parallel branches merged |
| 4 | Multi-loss auxiliary | Auxiliary heads at intermediate layers |

**Multi-Loss Training**
Auxiliary classification heads at intermediate layers provide gradient signals deeper into the network. For 75-class fine-grained recognition, this reduces the vanishing gradient problem and forces intermediate features to be semantically meaningful.

**Hybrid Architecture**
Parallel branches capture features at different receptive field sizes simultaneously — critical since butterfly wing patterns exist at both fine (vein structure) and coarse (color patch) scales.

**Interpretability**
- **Grad-CAM**: Model correctly focuses on wing patterns and coloration, not background
- **t-SNE**: 2D feature space shows clear inter-species clustering despite visual similarity

**Fine-Grained Challenge**
75-class butterfly ID is hard because: (1) high intra-class variation (same species at different angles), (2) high inter-class similarity (similar wing patterns), (3) natural backgrounds. The multi-scale + multi-loss strategy directly addresses all three.`,
    longDescriptionFr: `Stratégie d'entraînement progressive en 4 phases pour la classification fine-grained de 75 espèces de papillons.

**Jeu de données**
- 5 199 images entraînement + 1 300 validation, 75 espèces
- Arrière-plans naturels, éclairage variable, occlusion
- Augmentation : rotation ±30°, flip, zoom 0,2, luminosité/contraste ±20%

**Entraînement Progressif en 4 Phases**
| Phase | Architecture | Caractéristique Clé |
|-------|-------------|------------|
| 1 | CNN Vanille | Blocs conv standards, baseline augmentation |
| 2 | CNN Préentraînés | VGG16/ResNet gelé → fine-tuné |
| 3 | Hybride parallèle/séquentiel | Branches multi-échelles fusionnées |
| 4 | Perte multi-auxiliaire | Têtes auxiliaires aux couches intermédiaires |

**Entraînement Multi-Perte**
Les têtes auxiliaires fournissent des signaux de gradient plus profondément dans le réseau. Pour 75 classes, cela réduit le gradient évanescent et force les features intermédiaires à être sémantiquement significatives.

**Architecture Hybride**
Les branches parallèles capturent des features à différentes tailles de champs récepteurs — crucial car les motifs d'ailes existent à la fois à des échelles fines (nervures) et grossières (patches de couleur).

**Interprétabilité**
- **Grad-CAM** : Le modèle se concentre correctement sur les motifs d'ailes, pas sur l'arrière-plan
- **t-SNE** : Clustering inter-espèces clair malgré la similarité visuelle

**Défi Fine-Grained**
Identifier 75 espèces est difficile à cause : (1) forte variation intra-classe, (2) forte similarité inter-classes, (3) arrière-plans naturels. La stratégie multi-échelles + multi-perte adresse les trois directement.`,
    longDescriptionAr: `استراتيجية تدريب تقدمي من 4 مراحل لتصنيف دقيق لـ 75 نوعاً من الفراشات.

**مجموعة البيانات**
- 5,199 صورة تدريب + 1,300 تحقق، 75 نوعاً
- خلفيات طبيعية، إضاءة متنوعة، انسداد جزئي
- تضخيم: دوران ±30°، قلب، تكبير 0.2، سطوع/تباين ±20%

**التدريب التقدمي من 4 مراحل**
| المرحلة | البنية | الميزة الرئيسية |
|-------|-------------|------------|
| 1 | CNN أساسي | كتل conv قياسية، خط أساس التضخيم |
| 2 | شبكات مدربة مسبقاً | VGG16/ResNet مجمد → ضبط دقيق |
| 3 | هجين متوازي/تسلسلي | فروع متعددة المقاييس مدموجة |
| 4 | خسارة متعددة مساعدة | رؤوس مساعدة في الطبقات المتوسطة |

**التدريب متعدد الخسائر**
تُوفّر الرؤوس المساعدة إشارات تدرج أعمق في الشبكة، مما يقلل من تلاشي التدرج ويجبر الميزات المتوسطة على أن تكون ذات معنى دلالي.

**البنية الهجينة**
تلتقط الفروع المتوازية ميزات بأحجام مجالات استقبال مختلفة في آنٍ واحد — حيوي لأن أنماط الأجنحة موجودة على مقاييس دقيقة (عروق) وخشنة (بقع ألوان) معاً.

**قابلية التفسير**
- **Grad-CAM**: النموذج يركز على أنماط الأجنحة، لا على الخلفية
- **t-SNE**: تجميع واضح بين الأنواع رغم التشابه البصري

**تحدي التصنيف الدقيق**
صعب بسبب: (1) تباين كبير داخل الفئة، (2) تشابه كبير بين الفئات، (3) خلفيات طبيعية. الاستراتيجية متعددة المقاييس + متعددة الخسائر تعالج الثلاثة مباشرة.`,
    category: ["cv"],
    tags: ["CNN", "Transfer Learning", "Multi-loss", "Grad-CAM", "t-SNE", "Species Classification"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/butterfly-species-classification-using-multi-model",
    featured: false,
    dataset: "5,199 train / 1,300 val, 75 butterfly species",
    datasetFr: "5 199 train / 1 300 val, 75 espèces de papillons",
    datasetAr: "5,199 تدريب / 1,300 تحقق، 75 نوعاً من الفراشات",
    techStack: ["Python", "TensorFlow/Keras", "VGG16", "ResNet", "GradCAM", "t-SNE"],
    approach: "4-phase: vanilla CNN → pretrained TL → hybrid parallel → multi-loss auxiliary heads",
    approachFr: "4 phases : CNN vanille → TL préentraîné → hybride parallèle → têtes auxiliaires multi-perte",
    approachAr: "4 مراحل: CNN أساسي → TL مدرب مسبقاً → هجين متوازي → رؤوس مساعدة متعددة الخسائر",
  },
  {
    id: "chest-ct",
    title: "Chest CT Scan Cancer Classification",
    titleFr: "Classification du Cancer sur Scanner CT Thoracique",
    titleAr: "تصنيف سرطان صورة CT للصدر",
    description: "4-class lung cancer classification on 613 CT images. MobileNetV2 best: 66.03% test accuracy. 16 models: HOG+8 classical + custom CNNs + TL. MC-Dropout uncertainty flags cases for radiologist review.",
    descriptionFr: "Classification du cancer pulmonaire en 4 classes sur 613 images CT. MobileNetV2 meilleur : 66,03% de précision test. 16 modèles : HOG+8 classiques + CNN personnalisés + TL. MC-Dropout signale les cas incertains pour révision par radiologue.",
    descriptionAr: "تصنيف سرطان الرئة بـ 4 فئات على 613 صورة CT. MobileNetV2 الأفضل: 66.03% دقة اختبار. 16 نموذجاً: HOG+8 كلاسيكية + شبكات CNN مخصصة + TL. MC-Dropout يُعلّم الحالات غير المؤكدة لمراجعة الطبيب.",
    longDescription: `Multi-method pipeline for 4-class chest CT cancer classification.

**Dataset**
- 613 train / 72 val / 315 test CT scan slices
- 4 classes: adenocarcinoma (195), large cell carcinoma (115), normal (148), squamous cell (155)
- Small dataset — primary constraint limiting deep model performance

**Phase 1 — Classical ML (HOG + 8 models)**
- HOG: 9 orientations, 8×8 pixels/cell, 64×64 grayscale
- PCA: 95% variance at 100 components
- Best: Extra Trees (56.83%), SVM-RBF (55.56%)

**Phase 2 — Custom CNNs**
All performed poorly (28–34%) — 613 images insufficient for training CNNs from scratch.

**Phase 3 — Transfer Learning**
| Model | Test Accuracy |
|-------|--------------|
| EfficientNetV2S | 22.86% |
| ResNet50 | 55.24% |
| Ensemble (MV2 + ResNet50) | 62.54% |
| VGG16 | 64.76% |
| **MobileNetV2** | **66.03%** |

2-phase training: frozen base (10–12 ep) → fine-tune (15–25 ep), label smoothing 0.1, focal loss γ=2

**MC-Dropout Uncertainty Quantification**
30 forward passes with dropout active → confidence distribution. High-variance predictions → flagged for radiologist review. This is critical: medical AI should express uncertainty rather than force a prediction when the evidence is weak.

**Why MobileNetV2 Wins**
Lightweight architecture reduces overfitting on 613 examples. Heavier models (ResNet50, VGG16) overfit despite 2-phase training.`,
    longDescriptionFr: `Pipeline multi-méthodes pour la classification CT thoracique en 4 classes de cancer.

**Jeu de données**
- 613 entraînement / 72 val / 315 test tranches de scanner CT
- 4 classes : adénocarcinome (195), carcinome à grandes cellules (115), normal (148), carcinome épidermoïde (155)
- Petit dataset — contrainte principale limitant les modèles profonds

**Phase 1 — ML Classique (HOG + 8 modèles)**
- HOG : 9 orientations, 8×8 pixels/cellule, niveaux de gris 64×64
- PCA : 95% de variance à 100 composantes
- Meilleur : Extra Trees (56,83%), SVM-RBF (55,56%)

**Phase 2 — CNN Personnalisés**
Tous ont mal performé (28–34%) — 613 images insuffisantes pour entraîner des CNNs de zéro.

**Phase 3 — Transfer Learning**
| Modèle | Précision Test |
|-------|--------------|
| EfficientNetV2S | 22,86% |
| ResNet50 | 55,24% |
| Ensemble (MV2 + ResNet50) | 62,54% |
| VGG16 | 64,76% |
| **MobileNetV2** | **66,03%** |

Entraînement 2 phases : base gelée (10–12 ép.) → fine-tuning (15–25 ép.), label smoothing 0,1, perte focale γ=2

**Quantification d'Incertitude MC-Dropout**
30 passes forward avec dropout actif → distribution de confiance. Prédictions à forte variance → signalées pour révision radiologique. L'IA médicale doit exprimer l'incertitude plutôt que forcer une prédiction sur des données probantes faibles.

**Pourquoi MobileNetV2 Gagne**
L'architecture légère réduit le surapprentissage sur 613 exemples. Les modèles plus lourds surapprennent malgré l'entraînement en 2 phases.`,
    longDescriptionAr: `خط أنابيب متعدد الأساليب لتصنيف 4 فئات من سرطان صور CT الصدر.

**مجموعة البيانات**
- 613 تدريب / 72 تحقق / 315 اختبار شرائح صور CT
- 4 فئات: سرطان الغدة (195)، سرطان الخلايا الكبيرة (115)، طبيعي (148)، سرطان الخلايا الحرشفية (155)
- مجموعة بيانات صغيرة — القيد الرئيسي لأداء النماذج العميقة

**المرحلة 1 — ML الكلاسيكي (HOG + 8 نماذج)**
- HOG: 9 اتجاهات، 8×8 بكسل/خلية، رمادي 64×64
- PCA: 95% تباين عند 100 مكون
- الأفضل: Extra Trees (56.83%)، SVM-RBF (55.56%)

**المرحلة 2 — شبكات CNN مخصصة**
جميعها أداء ضعيف (28-34%) — 613 صورة غير كافية لتدريب من الصفر.

**المرحلة 3 — نقل التعلم**
| النموذج | دقة الاختبار |
|-------|--------------|
| EfficientNetV2S | 22.86% |
| ResNet50 | 55.24% |
| المجموعة (MV2 + ResNet50) | 62.54% |
| VGG16 | 64.76% |
| **MobileNetV2** | **66.03%** |

تدريب مرحلتين: قاعدة مجمدة (10-12 حقبة) → ضبط دقيق (15-25 حقبة)، label smoothing 0.1، خسارة بؤرية γ=2

**قياس عدم اليقين MC-Dropout**
30 تمريرة للأمام مع Dropout → توزيع الثقة. التنبؤات عالية التباين مُعلَّمة لمراجعة الطبيب. الذكاء الاصطناعي الطبي يجب أن يُعبّر عن عدم اليقين بدلاً من إجبار تنبؤ على أدلة ضعيفة.

**لماذا يفوز MobileNetV2**
البنية الخفيفة تقلل التحيز الزائد على 613 مثالاً. النماذج الأثقل تُفرط في التحيز رغم التدريب بمرحلتين.`,
    category: ["medical"],
    tags: ["MobileNetV2", "CT Scan", "Cancer", "MC-Dropout", "HOG", "TensorFlow", "Uncertainty"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/chest-ct-scan-cancer-classification",
    featured: false,
    metrics: "66.03% test accuracy (MobileNetV2)",
    dataset: "613 train / 315 test CT slices — 4 lung cancer types",
    datasetFr: "613 train / 315 test tranches CT — 4 types de cancer pulmonaire",
    datasetAr: "613 تدريب / 315 اختبار شرائح CT — 4 أنواع سرطان رئوي",
    results: [
      { label: "MobileNetV2 test acc", value: "66.03%" },
      { label: "VGG16 test acc", value: "64.76%" },
      { label: "Best classical", value: "56.83% (Extra Trees)" },
      { label: "MC-Dropout passes", value: "30" },
    ],
    techStack: ["Python", "TensorFlow 2.19", "MobileNetV2", "VGG16", "MC-Dropout", "HOG", "PCA"],
    approach: "HOG+classical → custom CNNs → 2-phase TL → MC-Dropout uncertainty",
    approachFr: "HOG+classique → CNN personnalisés → TL en 2 phases → incertitude MC-Dropout",
    approachAr: "HOG+كلاسيكي → شبكات CNN مخصصة → نقل تعلم بمرحلتين → عدم يقين MC-Dropout",
  },
  {
    id: "taco-segmentation",
    title: "TACO Trash Detection & Segmentation",
    titleFr: "Détection et Segmentation de Déchets TACO",
    titleAr: "كشف وتجزئة النفايات TACO",
    description: "5-model benchmark on 1,500 trash images (4,784 annotations, 60 categories). RT-DETR-L best: mAP50=0.2778, Precision=0.4833. Faster R-CNN loss converges 0.76→0.11. YOLOv8n/s/l + RT-DETR + Faster R-CNN.",
    descriptionFr: "Benchmark de 5 modèles sur 1 500 images de déchets (4 784 annotations, 60 catégories). RT-DETR-L meilleur : mAP50=0,2778, Précision=0,4833. Perte Faster R-CNN converge de 0,76→0,11. YOLOv8n/s/l + RT-DETR + Faster R-CNN.",
    descriptionAr: "معيار 5 نماذج على 1,500 صورة نفايات (4,784 تعليق، 60 فئة). RT-DETR-L الأفضل: mAP50=0.2778، Precision=0.4833. خسارة Faster R-CNN تتقارب من 0.76→0.11. YOLOv8n/s/l + RT-DETR + Faster R-CNN.",
    longDescription: `Waste detection and segmentation benchmark on TACO — one of the most challenging real-world trash datasets.

**Dataset**
- 1,500 images: 1,200 train / 300 val
- 4,784 bounding box annotations across **60 waste categories**
- Categories: plastics (bottles, bags, wrappers), metals (cans, foil), organics, hazardous, glass, cardboard
- COCO JSON format

**5-Model Comparison**
| Model | mAP50 | mAP50-95 | Precision | Recall |
|-------|-------|----------|-----------|--------|
| YOLOv8n | 0.123 | 0.097 | 0.457 | 0.137 |
| YOLOv8s | 0.167 | 0.139 | 0.355 | 0.174 |
| YOLOv8l | 0.196 | 0.162 | 0.330 | 0.232 |
| **RT-DETR-L** | **0.278** | **0.233** | **0.483** | **0.313** |
| Faster R-CNN | (loss 0.11) | — | — | — |

**Why Low mAP?**
60 classes × ~20 images/class average. Intra-class variation is extreme (crumpled vs intact bottles). RT-DETR's transformer attention better handles irregular trash shapes.

**Faster R-CNN Training**
SGD + StepLR, 15 epochs: loss 0.7608 → 0.1141 (85% reduction). ResNet50-FPN v2 backbone for multi-scale features.

**RT-DETR-L Advantage**
Transformer-based end-to-end detector — no anchor boxes, no NMS. Handles overlapping objects and irregular shapes that confuse YOLO's anchor-based approach.`,
    longDescriptionFr: `Benchmark de détection et segmentation de déchets sur TACO — l'un des datasets de déchets réels les plus difficiles.

**Jeu de données**
- 1 500 images : 1 200 entraînement / 300 val
- 4 784 annotations de boîtes englobantes sur **60 catégories de déchets**
- Catégories : plastiques (bouteilles, sacs, emballages), métaux (canettes, feuilles), organiques, dangereux, verre, carton
- Format COCO JSON

**Comparaison des 5 Modèles**
| Modèle | mAP50 | mAP50-95 | Précision | Rappel |
|-------|-------|----------|-----------|--------|
| YOLOv8n | 0,123 | 0,097 | 0,457 | 0,137 |
| YOLOv8s | 0,167 | 0,139 | 0,355 | 0,174 |
| YOLOv8l | 0,196 | 0,162 | 0,330 | 0,232 |
| **RT-DETR-L** | **0,278** | **0,233** | **0,483** | **0,313** |
| Faster R-CNN | (perte 0,11) | — | — | — |

**Pourquoi un mAP Faible ?**
60 classes × ~20 images/classe en moyenne. La variation intra-classe est extrême. L'attention transformer de RT-DETR gère mieux les formes irrégulières des déchets.

**Entraînement Faster R-CNN**
SGD + StepLR, 15 époques : perte 0,7608 → 0,1141 (réduction 85%). Backbone ResNet50-FPN v2 pour les features multi-échelles.

**Avantage RT-DETR-L**
Détecteur de bout en bout basé transformer — pas de boîtes d'ancrage, pas de NMS. Gère les objets se chevauchant et les formes irrégulières qui confondent l'approche YOLO.`,
    longDescriptionAr: `معيار كشف وتجزئة النفايات على TACO — أحد أصعب مجموعات بيانات النفايات الواقعية.

**مجموعة البيانات**
- 1,500 صورة: 1,200 تدريب / 300 تحقق
- 4,784 تعليق صندوق إحاطة عبر **60 فئة نفايات**
- الفئات: بلاستيك (زجاجات، أكياس، أغلفة)، معادن (علب، ورق قصدير)، عضوية، خطرة، زجاج، كرتون
- تنسيق COCO JSON

**مقارنة النماذج الـ 5**
| النموذج | mAP50 | mAP50-95 | الدقة | الاسترجاع |
|-------|-------|----------|-----------|--------|
| YOLOv8n | 0.123 | 0.097 | 0.457 | 0.137 |
| YOLOv8s | 0.167 | 0.139 | 0.355 | 0.174 |
| YOLOv8l | 0.196 | 0.162 | 0.330 | 0.232 |
| **RT-DETR-L** | **0.278** | **0.233** | **0.483** | **0.313** |
| Faster R-CNN | (خسارة 0.11) | — | — | — |

**لماذا mAP منخفض؟**
60 فئة × ~20 صورة/فئة في المتوسط. التباين داخل الفئة شديد. انتباه المحول في RT-DETR يتعامل بشكل أفضل مع أشكال النفايات غير المنتظمة.

**تدريب Faster R-CNN**
SGD + StepLR، 15 حقبة: خسارة 0.7608 → 0.1141 (تخفيض 85%). نواة ResNet50-FPN v2 للميزات متعددة المقاييس.

**ميزة RT-DETR-L**
كاشف من النهاية إلى النهاية قائم على المحول — لا صناديق إرساء، لا NMS. يتعامل مع الأجسام المتداخلة والأشكال غير المنتظمة التي تربك نهج YOLO.`,
    category: ["cv"],
    tags: ["RT-DETR", "YOLOv8", "Faster R-CNN", "TACO", "Environmental AI", "60-class"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/taco-trash-dataset-d-tection-segmentation",
    featured: false,
    metrics: "RT-DETR-L mAP50: 0.2778",
    dataset: "TACO: 1,500 images, 4,784 annotations, 60 categories",
    datasetFr: "TACO : 1 500 images, 4 784 annotations, 60 catégories",
    datasetAr: "TACO: 1,500 صورة، 4,784 تعليق، 60 فئة",
    results: [
      { label: "RT-DETR-L mAP50", value: "0.2778" },
      { label: "RT-DETR-L Precision", value: "0.4833" },
      { label: "YOLOv8l mAP50", value: "0.196" },
      { label: "Faster R-CNN loss", value: "0.76 → 0.11" },
    ],
    techStack: ["Python", "YOLOv8 (Ultralytics)", "RT-DETR", "Faster R-CNN", "ResNet50-FPN"],
    approach: "5-model benchmark: 3 YOLO variants + RT-DETR transformer + Faster R-CNN region-based",
    approachFr: "Benchmark 5 modèles : 3 variantes YOLO + transformeur RT-DETR + Faster R-CNN à région",
    approachAr: "معيار 5 نماذج: 3 متغيرات YOLO + محول RT-DETR + Faster R-CNN المبني على المناطق",
  },
  {
    id: "sign-language",
    title: "Sign Language Digits Classification",
    titleFr: "Classification des Chiffres en Langue des Signes",
    titleAr: "تصنيف أرقام لغة الإشارة",
    description: "CNN for sign language digit recognition (0–9) on 2,062 balanced images. 96.13% validation accuracy at epoch 23, train F1=0.98. 3-layer CNN with BatchNorm + Dropout. Exported to H5 for deployment.",
    descriptionFr: "CNN pour la reconnaissance de chiffres en langue des signes (0–9) sur 2 062 images équilibrées. 96,13% de précision de validation à l'époque 23, F1 entraînement=0,98. CNN à 3 couches avec BatchNorm + Dropout. Exporté en H5 pour déploiement.",
    descriptionAr: "شبكة CNN للتعرف على أرقام لغة الإشارة (0-9) على 2,062 صورة متوازنة. دقة تحقق 96.13% عند الحقبة 23، F1 التدريب=0.98. CNN بـ 3 طبقات مع BatchNorm + Dropout. تصدير H5 للنشر.",
    longDescription: `Sign language digit recognition — from raw images to a deployment-ready H5 model.

**Dataset**
- 2,062 grayscale 64×64 images: 10 classes (digits 0–9)
- Train: 1,649 (163±17 per class) / Val: 413 (40±7 per class)
- Well-balanced — no class weighting or augmentation needed

**CNN Architecture**
\`\`\`
Conv2D(32, 3×3) → BatchNorm → ReLU → MaxPool(2×2)
Conv2D(64, 3×3) → BatchNorm → ReLU → MaxPool(2×2)
Conv2D(128, 3×3) → BatchNorm → ReLU → MaxPool(2×2)
Dense(128) → Dropout(0.3) → Dense(10, softmax)
\`\`\`

**Training**
- Optimizer: Adam (lr=1e-3)
- Loss: categorical crossentropy
- Early stopping: triggered at epoch 23 (val_acc ≥ 95% target)

**Results**
| Epoch | Train Acc | Val Acc | Val Loss |
|-------|-----------|---------|----------|
| 10 | 89% | 88% | 0.45 |
| 20 | 97% | 95% | 0.22 |
| **23** | **98%** | **96.13%** | **0.165** |

- Weighted F1 (train): 0.98 | Weighted F1 (val): 0.96
- Near-perfect per-class accuracy for all 10 digits
- Exported: **my_cnn_model.h5**

**Deployment Path**
Hand segmentation → 64×64 crop → CNN predict → digit output. The simple architecture ensures fast inference even on CPU.`,
    longDescriptionFr: `Reconnaissance de chiffres en langue des signes — des images brutes à un modèle H5 prêt pour le déploiement.

**Jeu de données**
- 2 062 images en niveaux de gris 64×64 : 10 classes (chiffres 0–9)
- Entraînement : 1 649 (163±17 par classe) / Val : 413 (40±7 par classe)
- Bien équilibré — pas de pondération de classes ni d'augmentation nécessaire

**Architecture CNN**
\`\`\`
Conv2D(32, 3×3) → BatchNorm → ReLU → MaxPool(2×2)
Conv2D(64, 3×3) → BatchNorm → ReLU → MaxPool(2×2)
Conv2D(128, 3×3) → BatchNorm → ReLU → MaxPool(2×2)
Dense(128) → Dropout(0,3) → Dense(10, softmax)
\`\`\`

**Entraînement**
- Optimiseur : Adam (lr=1e-3) | Perte : entropie croisée catégorielle
- Arrêt anticipé : déclenché à l'époque 23 (cible val_acc ≥ 95%)

**Résultats**
| Époque | Précision Train | Précision Val | Perte Val |
|-------|-----------|---------|----------|
| 10 | 89% | 88% | 0,45 |
| 20 | 97% | 95% | 0,22 |
| **23** | **98%** | **96,13%** | **0,165** |

- F1 pondéré (entraînement) : 0,98 | F1 pondéré (val) : 0,96
- Exporté : **my_cnn_model.h5**

**Chemin de Déploiement**
Segmentation de la main → crop 64×64 → prédiction CNN → sortie chiffre. L'architecture simple garantit une inférence rapide même sur CPU.`,
    longDescriptionAr: `التعرف على أرقام لغة الإشارة — من الصور الخام إلى نموذج H5 جاهز للنشر.

**مجموعة البيانات**
- 2,062 صورة رمادية 64×64: 10 فئات (أرقام 0-9)
- تدريب: 1,649 (163±17 لكل فئة) / تحقق: 413 (40±7 لكل فئة)
- متوازن جيداً — لا حاجة لأوزان الفئات أو التضخيم

**بنية CNN**
\`\`\`
Conv2D(32، 3×3) → BatchNorm → ReLU → MaxPool(2×2)
Conv2D(64، 3×3) → BatchNorm → ReLU → MaxPool(2×2)
Conv2D(128، 3×3) → BatchNorm → ReLU → MaxPool(2×2)
Dense(128) → Dropout(0.3) → Dense(10، softmax)
\`\`\`

**التدريب**
- المحسّن: Adam (lr=1e-3) | الخسارة: انتروبيا متقاطعة فئوية
- توقف مبكر: عند الحقبة 23 (هدف val_acc ≥ 95%)

**النتائج**
| الحقبة | دقة التدريب | دقة التحقق | خسارة التحقق |
|-------|-----------|---------|----------|
| 10 | 89% | 88% | 0.45 |
| 20 | 97% | 95% | 0.22 |
| **23** | **98%** | **96.13%** | **0.165** |

- F1 مرجح (تدريب): 0.98 | F1 مرجح (تحقق): 0.96
- تصدير: **my_cnn_model.h5**

**مسار النشر**
تجزئة اليد → اقتصاص 64×64 → تنبؤ CNN → مخرج الرقم. البنية البسيطة تضمن استدلالاً سريعاً حتى على المعالج.`,
    category: ["cv"],
    tags: ["CNN", "Sign Language", "Accessibility", "BatchNorm", "Keras", "H5 Export"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/sign-language-digits-classification",
    featured: false,
    metrics: "96.13% validation accuracy",
    dataset: "2,062 grayscale 64×64 images — 10 balanced digit classes",
    datasetFr: "2 062 images en niveaux de gris 64×64 — 10 classes de chiffres équilibrées",
    datasetAr: "2,062 صورة رمادية 64×64 — 10 فئات أرقام متوازنة",
    results: [
      { label: "Validation accuracy", value: "96.13%" },
      { label: "Training accuracy", value: "98%" },
      { label: "Validation F1", value: "0.96" },
      { label: "Epochs to converge", value: "23" },
    ],
    techStack: ["Python", "Keras/TensorFlow", "CNN", "BatchNorm", "H5 export"],
    approach: "3-block CNN with BatchNorm + Dropout → early stopping → H5 deployment export",
    approachFr: "CNN à 3 blocs avec BatchNorm + Dropout → arrêt anticipé → export H5 pour déploiement",
    approachAr: "CNN بـ 3 كتل مع BatchNorm + Dropout → توقف مبكر → تصدير H5 للنشر",
  },
  {
    id: "breast-cancer-classification",
    title: "Breast Cancer Classification (Wisconsin)",
    titleFr: "Classification du Cancer du Sein (Wisconsin)",
    titleAr: "تصنيف سرطان الثدي (ويسكونسن)",
    description: "14-model benchmark on Wisconsin dataset (569 samples). Voting Ensemble: 99.12% accuracy. CatBoost: AUC 0.9990. Extra Trees: 98.25%. Tuned RF + SVM via RandomizedSearchCV/GridSearchCV. SHAP: concave_points_worst dominates.",
    descriptionFr: "Benchmark de 14 modèles sur le dataset Wisconsin (569 échantillons). Voting Ensemble : 99,12% de précision. CatBoost : AUC 0,9990. Extra Trees : 98,25%. RF + SVM ajustés via RandomizedSearchCV/GridSearchCV. SHAP : concave_points_worst domine.",
    descriptionAr: "معيار 14 نموذجاً على مجموعة بيانات ويسكونسن (569 عينة). Voting Ensemble: 99.12% دقة. CatBoost: AUC 0.9990. Extra Trees: 98.25%. RF + SVM مضبوطان عبر RandomizedSearchCV/GridSearchCV. SHAP: concave_points_worst يهيمن.",
    longDescription: `Comprehensive ML pipeline for breast cancer binary classification on the Wisconsin Diagnostic dataset.

**Dataset**
- 569 samples: 357 benign (62.7%) + 212 malignant (37.3%)
- 30 features: 10 measurements × 3 statistics (mean, SE, worst)
  - radius, texture, perimeter, area, smoothness, compactness, concavity, concave points, symmetry, fractal dimension
- No missing values. Stratified 80/20 split (455 train / 114 test)
- 6 engineered features: density proxies, shape ratios, worst/mean progression

**Full 14-Model Benchmark**
| Model | Accuracy | AUC-ROC |
|-------|----------|---------|
| Naive Bayes | 92.11% | 0.9891 |
| Decision Tree | 92.11% | 0.9448 |
| KNN (k=5) | 95.61% | 0.9823 |
| Gradient Boosting | 95.61% | 0.9970 |
| LDA | 96.49% | 0.9970 |
| Logistic Regression | 96.49% | 0.9960 |
| XGBoost | 96.49% | 0.9954 |
| LightGBM | 96.49% | 0.9970 |
| **CatBoost** | 96.49% | **0.9990** |
| AdaBoost | 97.37% | 0.9861 |
| SVM (RBF) | 97.37% | 0.9947 |
| Random Forest | 97.37% | 0.9944 |
| Stacking | 97.37% | 0.9950 |
| **Extra Trees** | **98.25%** | 0.9987 |
| Tuned SVM | 98.25% | 0.9960 |
| **Voting Ensemble** | **99.12%** | 0.9950 |

**Hyperparameter Tuning**
- **RF** (RandomizedSearchCV, 40 trials): n_estimators=500, no depth limit, log2 features
- **SVM** (GridSearchCV): C=10, gamma=0.01, RBF kernel → 98.25% accuracy

**SHAP Top Malignancy Indicators**
1. \`concave_points_worst\` — dominant discriminator
2. \`perimeter_worst\` — boundary irregularity
3. \`area_worst\` — worst-cell size
4. \`radius_worst\` — largest cell radius

**Clinical Focus**
Optimized for recall (sensitivity) — a missed malignant diagnosis (false negative) is far more dangerous than a false positive in clinical screening.`,
    longDescriptionFr: `Pipeline ML complet pour la classification binaire du cancer du sein sur le dataset Wisconsin Diagnostic.

**Jeu de données**
- 569 échantillons : 357 bénins (62,7%) + 212 malins (37,3%)
- 30 features : 10 mesures × 3 statistiques (moyenne, ET, pire)
- Aucune valeur manquante. Découpage stratifié 80/20 (455 entraînement / 114 test)
- 6 features engineerées : proxies de densité, ratios de forme, progression pire/moyenne

**Benchmark Complet 14 Modèles**
| Modèle | Précision | AUC-ROC |
|-------|----------|---------|
| Naïve Bayes | 92,11% | 0,9891 |
| Decision Tree | 92,11% | 0,9448 |
| KNN (k=5) | 95,61% | 0,9823 |
| Gradient Boosting | 95,61% | 0,9970 |
| LDA | 96,49% | 0,9970 |
| Régression Logistique | 96,49% | 0,9960 |
| XGBoost | 96,49% | 0,9954 |
| LightGBM | 96,49% | 0,9970 |
| **CatBoost** | 96,49% | **0,9990** |
| AdaBoost | 97,37% | 0,9861 |
| SVM (RBF) | 97,37% | 0,9947 |
| Random Forest | 97,37% | 0,9944 |
| Stacking | 97,37% | 0,9950 |
| **Extra Trees** | **98,25%** | 0,9987 |
| SVM ajusté | 98,25% | 0,9960 |
| **Voting Ensemble** | **99,12%** | 0,9950 |

**Réglage des Hyperparamètres**
- **RF** (RandomizedSearchCV, 40 essais) : n_estimators=500, features log2
- **SVM** (GridSearchCV) : C=10, gamma=0,01, noyau RBF → 98,25%

**Top Indicateurs SHAP de Malignité**
1. \`concave_points_worst\` — discriminateur dominant
2. \`perimeter_worst\` — irrégularité des contours
3. \`area_worst\` — taille de la pire cellule
4. \`radius_worst\` — rayon de la plus grande cellule

**Focus Clinique**
Optimisé pour le rappel — un diagnostic malin manqué est bien plus dangereux qu'un faux positif en dépistage clinique.`,
    longDescriptionAr: `خط أنابيب ML شامل لتصنيف ثنائي لسرطان الثدي على مجموعة بيانات ويسكونسن التشخيصية.

**مجموعة البيانات**
- 569 عينة: 357 حميدة (62.7%) + 212 خبيثة (37.3%)
- 30 ميزة: 10 قياسات × 3 إحصاءات (متوسط، انحراف معياري، الأسوأ)
- لا قيم مفقودة. تقسيم طبقي 80/20 (455 تدريب / 114 اختبار)
- 6 ميزات مهندَسة: وكلاء الكثافة، نسب الشكل، تطور الأسوأ/المتوسط

**معيار 14 نموذجاً الكامل**
| النموذج | الدقة | AUC-ROC |
|-------|----------|---------|
| Naive Bayes | 92.11% | 0.9891 |
| Decision Tree | 92.11% | 0.9448 |
| KNN (k=5) | 95.61% | 0.9823 |
| Gradient Boosting | 95.61% | 0.9970 |
| LDA | 96.49% | 0.9970 |
| الانحدار اللوجستي | 96.49% | 0.9960 |
| XGBoost | 96.49% | 0.9954 |
| LightGBM | 96.49% | 0.9970 |
| **CatBoost** | 96.49% | **0.9990** |
| AdaBoost | 97.37% | 0.9861 |
| SVM (RBF) | 97.37% | 0.9947 |
| Random Forest | 97.37% | 0.9944 |
| Stacking | 97.37% | 0.9950 |
| **Extra Trees** | **98.25%** | 0.9987 |
| SVM مضبوط | 98.25% | 0.9960 |
| **Voting Ensemble** | **99.12%** | 0.9950 |

**ضبط المعاملات الفائقة**
- **RF** (RandomizedSearchCV، 40 تجربة): n_estimators=500، ميزات log2
- **SVM** (GridSearchCV): C=10، gamma=0.01، نواة RBF → 98.25%

**أبرز مؤشرات الخباثة في SHAP**
1. \`concave_points_worst\` — المميز الرئيسي
2. \`perimeter_worst\` — عدم انتظام الحدود
3. \`area_worst\` — حجم أسوأ خلية
4. \`radius_worst\` — نصف قطر أكبر خلية

**التركيز السريري**
محسَّن للاسترجاع (الحساسية) — تشخيص فائت لخباثة أخطر بكثير من إيجابي كاذب في الفحص السريري.`,
    category: ["medical"],
    tags: ["CatBoost", "XGBoost", "LightGBM", "SHAP", "SVM", "Extra Trees", "Healthcare"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/breast-cancer-classification",
    featured: false,
    metrics: "99.12% (Voting) | AUC: 0.9990 (CatBoost)",
    dataset: "Wisconsin Breast Cancer: 569 samples, 30 features, 2 classes",
    datasetFr: "Cancer du sein Wisconsin : 569 échantillons, 30 caractéristiques, 2 classes",
    datasetAr: "سرطان الثدي ويسكونسن: 569 عينة، 30 ميزة، فئتان",
    results: [
      { label: "Voting Ensemble Acc", value: "99.12%" },
      { label: "CatBoost AUC-ROC", value: "0.9990" },
      { label: "Extra Trees / Tuned SVM", value: "98.25%" },
      { label: "Models benchmarked", value: "14" },
    ],
    techStack: ["Python", "CatBoost", "XGBoost", "LightGBM", "Scikit-learn", "SHAP"],
    approach: "14-model benchmark → RandomizedSearchCV/GridSearchCV HPO → SHAP interpretability",
    approachFr: "Benchmark de 14 modèles → HPO RandomizedSearchCV/GridSearchCV → interprétabilité SHAP",
    approachAr: "معيار 14 نموذجاً → HPO RandomizedSearchCV/GridSearchCV → تفسيرية SHAP",
  },
];

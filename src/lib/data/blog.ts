// ─── Blog Posts ────────────────────────────────────────────────────────────────
export interface BlogPost {
  slug: string;
  title: string;
  titleFr: string;
  titleAr: string;
  excerpt: string;
  excerptFr: string;
  excerptAr: string;
  content: string;
  category: string;
  tags: string[];
  date: string;
  readTime: string;
  featured: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "lightgbm-fraud-detection-auc-0964",
    title: "Achieving AUC 0.9648 on IEEE-CIS Fraud Detection with LightGBM Stacking",
    titleFr: "AUC 0,9648 sur IEEE-CIS Fraud Detection avec LightGBM Stacking",
    titleAr: "تحقيق AUC 0.9648 على كشف الاحتيال IEEE-CIS مع LightGBM",
    excerpt: "A complete walkthrough of how I built a stacking ensemble that achieved AUC 0.9648 on the IEEE-CIS fraud detection dataset — feature engineering, model selection, and meta-learner design.",
    excerptFr: "Guide complet pour construire un ensemble stacking atteignant AUC 0,9648 sur le dataset IEEE-CIS — feature engineering, sélection de modèles et méta-apprenant.",
    excerptAr: "دليل شامل لبناء مجموعة نماذج حققت AUC 0.9648 على مجموعة بيانات IEEE-CIS للكشف عن الاحتيال.",
    content: `## The Problem

The IEEE-CIS Fraud Detection challenge on Kaggle presents one of the most complex real-world fraud datasets: 590,540 training transactions with 433 features, only 3.5% fraud rate (severe class imbalance), and a mix of categorical and numerical Vesta features.

## Key Feature Engineering

The most impactful features I engineered:

**Time-based features:**
- Hour of day, day of week, week number — fraud patterns are time-dependent
- TransactionDT_hours for temporal drift analysis

**Card aggregation features:**
- Mean, std, count of TransactionAmt per card1/card2/card3/card5
- These create "behavioral fingerprints" per card

**Email domain features:**
- same_email_domain flag (P_emaildomain == R_emaildomain)
- Domain-level aggregation for fraud rates

**M-column boolean features:**
- Count of T/F/missing values across M1-M9 columns

## Model Pipeline

I trained 6 models with StratifiedKFold (n=2 for memory constraints):

| Model | OOF AUC |
|-------|---------|
| LightGBM | **0.9648** |
| XGBoost | 0.9631 |
| CatBoost | 0.9529 |
| Random Forest | 0.9032 |
| Decision Tree | 0.8583 |
| Logistic Regression | 0.8506 |

## Stacking Ensemble

The meta-learner (Logistic Regression on LGB+XGB+CB+RF OOF predictions) achieved **AUC 0.9565** — slightly below LightGBM alone, showing LGB already captured most signal.

**Key insight:** LightGBM's native handling of missing values (-999 fill) and categorical features gave it a decisive edge on this dataset.

## Lessons Learned

1. **Don't drop V-columns** — they contain Vesta's proprietary fraud signals
2. **Time-based CV** is more realistic than StratifiedKFold for fraud (avoids temporal leakage)
3. **Class weights** matter more than oversampling on 590K+ rows
4. **Card-level aggregations** are the single highest-impact feature group

[View the full notebook on Kaggle →](https://www.kaggle.com/ossamaelhakk/code)`,
    category: "Machine Learning",
    tags: ["LightGBM", "Fraud Detection", "Stacking Ensemble", "Feature Engineering", "Kaggle"],
    date: "2025-04-15",
    readTime: "8 min",
    featured: true,
  },
  {
    slug: "building-whatsapp-ai-sales-agent-n8n",
    title: "Building a Production WhatsApp AI Sales Agent with n8n and Ollama",
    titleFr: "Construire un Agent Commercial IA WhatsApp avec n8n et Ollama",
    titleAr: "بناء وكيل مبيعات ذكاء اصطناعي على واتساب مع n8n وOllama",
    excerpt: "How I built a production-grade AI sales agent integrated with WhatsApp Business using n8n workflows, Ollama (local Llama 3.1), PostgreSQL, and conversation memory — reducing manual processing time by 90%.",
    excerptFr: "Comment j'ai construit un agent IA de vente en production intégré à WhatsApp Business avec n8n, Ollama (Llama 3.1 local), PostgreSQL et mémoire conversationnelle.",
    excerptAr: "كيف بنيت وكيل مبيعات ذكاء اصطناعي متكاملاً مع واتساب بيزنس باستخدام n8n وOllama وPostgreSQL وذاكرة المحادثة.",
    content: `## The Business Problem

A Moroccan e-commerce client was spending 6+ hours/day manually answering the same product questions on WhatsApp. The solution: an AI agent that handles Sales, Support, and Off-topic classification automatically.

## Architecture

\`\`\`
WhatsApp Business API
        ↓
  n8n Webhook receiver
        ↓
  Message Classifier (LLM)
    ├── SALES → AI Sales Agent (Llama 3.1 + db_product tool)
    ├── SUPPORT → Support Agent
    └── OFF_TOPIC → Standard rejection message
        ↓
  Conversation Memory (Supabase)
        ↓
  WhatsApp reply
\`\`\`

## Why Local LLM (Ollama)?

Privacy is critical for business conversations. Using Ollama with Llama 3.1:8b on-premise means:
- No conversation data sent to external APIs
- Zero API costs for high-volume messaging
- Full control over the model and its behavior

## The System Prompt Pattern

The key to making the agent reliable is **strict database-first rules**:

\`\`\`
NEVER answer product questions without calling db_product first.
ONLY present information returned by the tool.
If product not found → honestly inform the customer.
\`\`\`

This eliminates hallucination entirely for product information.

## Results

- **-90% manual processing time** for product queries
- **95%+ accurate** message classification (Sales/Support/Off-topic)
- **Bilingual FR/AR** responses matching customer language
- **Conversation memory** prevents asking the same questions twice

## Key n8n Nodes Used

1. **Webhook** — receives WhatsApp messages
2. **Text Classifier** — LLM-based intent classification
3. **AI Agent** — LangChain-compatible agent with tool calling
4. **Supabase** — product DB + memory storage
5. **HTTP Request** — WhatsApp Business API for sending replies`,
    category: "AI Agents",
    tags: ["n8n", "WhatsApp", "Ollama", "Llama 3.1", "AI Agents", "LLM", "Automation"],
    date: "2025-03-20",
    readTime: "10 min",
    featured: true,
  },
  {
    slug: "stable-diffusion-production-fastapi-docker",
    title: "Deploying Stable Diffusion to Production: FastAPI + Docker + Nginx at Ofoto",
    titleFr: "Déployer Stable Diffusion en Production : FastAPI + Docker + Nginx chez Ofoto",
    titleAr: "نشر Stable Diffusion في بيئة الإنتاج: FastAPI + Docker + Nginx في Ofoto",
    excerpt: "Lessons from deploying a Stable Diffusion (Automatic1111 + ControlNet) application handling 500+ concurrent requests in production — cutting latency by 35% and achieving 99.9% uptime.",
    excerptFr: "Retour d'expérience sur le déploiement de Stable Diffusion gérant 500+ requêtes simultanées en production.",
    excerptAr: "دروس من نشر Stable Diffusion للإنتاج: 500+ طلب متزامن، تقليل التأخير 35%، توفر 99.9%.",
    content: `## The Challenge

Deploying AI image generation at scale is fundamentally different from running it on a local GPU. At Ofoto, we needed to handle 500+ concurrent image generation requests with consistent quality and speed.

## Stack

- **Backend:** FastAPI (Python) — async request handling
- **AI Engine:** Automatic1111 + ControlNet — Stable Diffusion inference
- **Frontend:** Vue.js — responsive UI for image generation
- **Containerization:** Docker + Docker Compose
- **Reverse Proxy:** Nginx — load balancing, SSL, routing

## Key Architecture Decisions

### 1. Request Queue with FastAPI Background Tasks

\`\`\`python
@app.post("/generate")
async def generate_image(request: GenerationRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())
    background_tasks.add_task(run_generation, job_id, request)
    return {"job_id": job_id, "status": "queued"}
\`\`\`

### 2. Nginx Load Balancing

\`\`\`nginx
upstream fastapi_backend {
    server backend_1:8000 weight=1;
    server backend_2:8000 weight=1;
    keepalive 32;
}
\`\`\`

### 3. Docker Multi-stage for GPU Access

\`\`\`dockerfile
FROM nvidia/cuda:11.8-runtime-ubuntu22.04
RUN pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
\`\`\`

## Performance Results

| Metric | Before | After |
|--------|--------|-------|
| Avg latency | 12.4s | 8.1s (-35%) |
| Concurrent requests | 50 | 500+ |
| Uptime | 94% | 99.9% |
| Release time | 5 days | 3 days (-40%) |

## Lessons

1. **Never block the main FastAPI thread** with GPU inference — always use background tasks
2. **Nginx keepalive** connections dramatically reduce overhead at high load
3. **Health check endpoints** are essential for Docker container orchestration`,
    category: "MLOps",
    tags: ["Stable Diffusion", "FastAPI", "Docker", "Nginx", "MLOps", "Production"],
    date: "2025-02-10",
    readTime: "12 min",
    featured: true,
  },
  {
    slug: "ethereum-fraud-auc-9973-optuna-shap",
    title: "Ethereum Fraud Detection: AUC 0.9973 with Optuna + XGBoost + SHAP",
    titleFr: "Détection de Fraude Ethereum : AUC 0,9973 avec Optuna + XGBoost + SHAP",
    titleAr: "كشف احتيال إيثيريوم: AUC 0.9973 مع Optuna وXGBoost وSHAP",
    excerpt: "How I built a two-stage fraud detection pipeline (Baseline → Advanced) achieving AUC 0.9973 on Ethereum blockchain data — Optuna HPO, SMOTE, stacking ensemble, threshold tuning, and SHAP explainability.",
    excerptFr: "Comment j'ai construit un pipeline de détection en 2 étapes atteignant AUC 0,9973 sur les données blockchain Ethereum — Optuna, SMOTE, stacking et SHAP.",
    excerptAr: "كيف بنيت خط أنابيب كشف الاحتيال بمرحلتين محققاً AUC 0.9973 على بيانات بلوكتشين إيثيريوم.",
    content: `## Why Blockchain Fraud Detection Is Hard

Ethereum fraud detection differs from traditional financial fraud in key ways:
- Features are behavioral on-chain metrics (not transaction amounts)
- Strong class imbalance (~20% fraud rate in raw data)
- Many ERC20-related features have 8.4% missingness

## Two-Stage Pipeline

**Stage 1 — Baseline:** Logistic Regression (AUC 0.8419) → Random Forest (AUC 0.9973, F1 0.9566). The RF already achieves excellent results.

**Stage 2 — Advanced pipeline:**
1. Feature engineering: 51 → 56 features
2. SMOTE oversampling: 9,841 → 11,070 samples (50% fraud)
3. Optuna HPO (40 trials, AUC objective): Best XGB AUC = **0.9992** on validation
4. Train XGBoost + LightGBM + CatBoost

## Threshold Tuning

Default threshold (0.5) is suboptimal for imbalanced fraud detection. I searched for the threshold that maximizes F1:

**Best threshold: 0.85 → F1: 0.9658**

This is critical — with threshold 0.5, F1 drops to ~0.95 even with perfect AUC.

## SHAP Explainability

Top fraud indicators (from SHAP values):
1. ERC20 total Ether received patterns
2. Unique sent address count
3. Total Ether sent ratios
4. ERC20 unique received addresses

SHAP allows us to explain individual predictions to compliance teams — essential for production fraud systems.

## Final Comparison

| Model | AUC | F1 (Fraud) |
|-------|-----|------------|
| Stacking | **0.9973** | — |
| XGBoost | 0.9971 | **0.9659** |
| LightGBM | 0.9972 | 0.9569 |
| CatBoost | 0.9969 | 0.9584 |

[Full notebook on Kaggle →](https://www.kaggle.com/ossamaelhakk/code)`,
    category: "Machine Learning",
    tags: ["XGBoost", "Optuna", "SHAP", "SMOTE", "Blockchain", "Fraud Detection", "Ensemble"],
    date: "2025-05-01",
    readTime: "9 min",
    featured: true,
  },
  {
    slug: "n8n-data-pipeline-automation-90-percent",
    title: "How I Reduced Manual Data Processing Time by 90% with n8n",
    titleFr: "Comment j'ai réduit le temps de traitement manuel de 90% avec n8n",
    titleAr: "كيف خفضت وقت معالجة البيانات اليدوية بنسبة 90% مع n8n",
    excerpt: "A practical guide to designing automated data pipelines with n8n — from Google Drive PDF OCR to multi-agent RAG orchestration with Pinecone and Cohere embeddings.",
    excerptFr: "Guide pratique pour concevoir des pipelines automatisés avec n8n — de l'OCR PDF Google Drive à l'orchestration multi-agents RAG avec Pinecone et Cohere.",
    excerptAr: "دليل عملي لتصميم خطوط أنابيب آلية مع n8n — من OCR PDF إلى تنسيق RAG متعدد الوكلاء مع Pinecone وCohere.",
    content: `## The Automation Problem

Manual data processing is the invisible tax on every data team. Recurring tasks — extracting data from PDFs, syncing databases, generating reports — consume hours that should go to analysis and modeling.

## n8n vs. Traditional Scripting

| Aspect | Python Script | n8n Workflow |
|--------|--------------|-------------|
| Visual debugging | ❌ | ✅ |
| Non-technical users | ❌ | ✅ |
| Error recovery | Manual | Built-in retry |
| Scheduling | Cron job | Visual scheduler |
| API integrations | Code needed | 400+ built-in nodes |

## Pipeline 1: Google Drive PDF OCR

**Problem:** 50+ PDFs/week uploaded to Drive needed text extraction and database insertion.

**n8n Solution:**
\`\`\`
Google Drive Trigger (new file)
    → Download file
    → HTTP Request (OCR API)
    → Information Extractor (LLM)
    → Google Sheets append
    → Gmail notification
\`\`\`

Time saved: **4 hours/week → 0 manual hours**.

## Pipeline 2: RAG with Pinecone + Cohere

For document Q&A at scale:
\`\`\`
Google Drive Trigger
    → PDF download + chunking (Recursive TextSplitter)
    → Cohere Embeddings
    → Pinecone upsert
    → AI Agent (Ollama LLM + Pinecone search tool)
    → Chat response
\`\`\`

## Pipeline 3: Multi-Agent Research (TavilyFinder)

Parent workflow → TavilyFinder sub-agent → Ollama synthesis → email delivery.

## Key n8n Patterns

**Error handling:** Error Trigger node → Slack/Gmail alert.
**Pagination:** Loop Over Items for multi-page API responses.
**Data transformation:** Code node (JS/Python) for complex transformations.

## Results Across All Pipelines

- PDF processing: -100% manual time
- Sales agent: -90% response time
- RAG queries: instant vs hours of manual search
- **Overall: 90% reduction in manual processing**`,
    category: "Automation",
    tags: ["n8n", "Automation", "RAG", "Pinecone", "Cohere", "LLM", "Workflow"],
    date: "2024-12-18",
    readTime: "7 min",
    featured: false,
  },
];

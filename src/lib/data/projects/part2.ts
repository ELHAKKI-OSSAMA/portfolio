import { GITHUB_URL } from '../personal';
import type { Project } from './types';

export const projectsPart2: Project[] = [
  {
    id: "book-recommender",
    title: "Book Recommender Systems — Full Taxonomy",
    description: "Complete recommender system benchmark on BookCrossing (1.1M ratings): User-CF, Item-CF, SVD/NMF/ALS, Content-Based, Hybrid (Weighted + Switching), NCF, AutoRec, GRU4Rec (session-based).",
    longDescription: `Comprehensive implementation of all major recommender paradigms on the Book-Crossing dataset.

**Dataset:** 271,360 books, 278,858 users, 1,149,780 ratings. Filtered: 118,699 explicit ratings, 7,027 users, 9,438 books.

**Architectures implemented:**
\`\`\`
Recommender Systems
├── 1. Collaborative Filtering
│   ├── User-based CF (cosine similarity)
│   ├── Item-based CF
│   └── Matrix Factorization (SVD, NMF, ALS)
├── 2. Content-Based Filtering
├── 3. Hybrid (Weighted + Switching)
└── 4. Deep Learning
    ├── NCF (Neural Collaborative Filtering)
    ├── AutoRec
    └── GRU4Rec (Session-based)
\`\`\`

**User-CF RMSE:** 1.6645 | **P@10:** 0.6629 | **R@10:** 0.6910`,
    category: ["nlp"],
    tags: ["Collaborative Filtering", "SVD", "NCF", "GRU4Rec", "Matrix Factorization", "Recommender"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: false,
    dataset: "BookCrossing: 1,149,780 ratings, 271,360 books, 278,858 users",
    techStack: ["Python", "PyTorch", "Surprise (SVD/NMF)", "Scipy (ALS)", "scikit-learn", "CUDA"],
    approach: "Full taxonomy — classical CF → matrix factorization → deep learning (NCF/AutoRec/GRU4Rec)",
  },
  {
    id: "energy-forecast",
    title: "Hourly Energy Consumption Forecasting",
    description: "Multi-model time series benchmark on PJM hourly energy data: Naive → Moving Average → Linear Regression → Random Forest → XGBoost → LightGBM → LSTM → Facebook Prophet.",
    category: ["timeseries"],
    tags: ["LSTM", "Prophet", "XGBoost", "LightGBM", "Time Series", "Energy Forecasting"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: false,
    dataset: "PJM Hourly Energy Consumption (multi-year)",
    techStack: ["Python", "XGBoost", "LightGBM", "TensorFlow/LSTM", "Prophet", "Pandas", "statsmodels"],
    approach: "8-model benchmark from naive baselines to deep learning on electricity demand",
  },
  {
    id: "stock-prediction",
    title: "EURUSD Next Candle Prediction (Delta-Target)",
    description: "V3 delta-target approach: predict Δclose instead of price (stationary, bounded ±0.05). 4,211 daily candles (2010–2026), 39 engineered features, RobustScaler. More reliable than raw price prediction.",
    longDescription: `Third iteration of EURUSD price prediction with a key architectural change: predict the daily price *change* (delta) instead of the absolute price.

**Why delta-target?**
- Values are bounded (±0.05 for EURUSD daily)
- Stationary signal — easier to learn
- No temporal data leakage
- Reconstruction: predicted_close = close_i + predicted_delta

**Dataset:** 4,211 EURUSD 1D candles (2010-01-01 to 2026-03-06), 39 engineered features.

**Feature engineering:** RSI, MACD, ATR, Bollinger Bands, upper/lower shadows, body size, gap, all normalized with RobustScaler per feature.

**Top feature correlation with ΔClose:** upper_shadow (0.618), lower_shadow.

**Models:** LSTM, GRU, Transformer, classical ML — compared on RMSE and directional accuracy.`,
    category: ["timeseries"],
    tags: ["LSTM", "GRU", "Forex", "Finance", "Delta-Target", "RobustScaler", "Feature Engineering"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: false,
    dataset: "4,211 EURUSD 1D candles (2010–2026), 39 features",
    techStack: ["Python", "yfinance", "TensorFlow/Keras", "LSTM", "GRU", "RobustScaler", "Pandas"],
    approach: "Delta-target stationary prediction with RobustScaler normalization",
  },
  {
    id: "covid-prediction",
    title: "COVID-19 Outbreak Prediction",
    description: "Fixed SEIR epidemiological model + ML + LSTM + Transformers on 188 days (Jan–Jul 2020). Key fix: target = daily new cases (stationary) with proper walk-forward TimeSeriesSplit CV — eliminates data leakage.",
    longDescription: `COVID-19 daily new cases prediction fixing critical data leakage from v1 (training on cumulative series).

**Key fixes vs v1:**
| Issue | Fix |
|-------|-----|
| ML trained on cumulative counts → leakage | Target = daily new cases (stationary) |
| SEIR incubation ~1 day (biologically wrong) | Constrained bounds + better init |
| No walk-forward validation | TimeSeriesSplit CV for all ML models |
| Transformers undertrained | More epochs + cosine LR |

**Models compared:**
- SEIR epidemic model (constrained optimization)
- Classical ML: ARIMA, Gradient Boosting, XGBoost
- Deep learning: LSTM, Transformer

**Dataset:** 188 days (2020-01-22 to 2020-07-27), daily confirmed/deaths/recovered/active.`,
    category: ["timeseries"],
    tags: ["SEIR", "LSTM", "Transformer", "Epidemiology", "TimeSeriesSplit", "Walk-forward"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: false,
    dataset: "188 days COVID-19 global data (Jan–Jul 2020)",
    techStack: ["Python", "Scikit-learn", "TensorFlow", "scipy (SEIR optimization)", "statsmodels"],
    approach: "Stationary daily-delta target with SEIR + ML + LSTM ensemble and walk-forward CV",
  },
  {
    id: "weather-pattern",
    title: "Weather Pattern Detection",
    description: "Multi-paradigm ML on 96,453 hourly weather records: K-Means (best K=3, sil. score) → DBSCAN → Isolation Forest (1,930 anomalies) → Supervised (RF/XGB/LGB) → LSTM Autoencoder.",
    category: ["timeseries"],
    tags: ["K-Means", "DBSCAN", "Isolation Forest", "LSTM Autoencoder", "Clustering", "Anomaly Detection"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: false,
    dataset: "96,453 hourly weather records (temperature, humidity, wind, pressure, precipitation)",
    techStack: ["Python", "Scikit-learn", "TensorFlow/LSTM", "XGBoost", "LightGBM"],
    approach: "Unsupervised (clustering + anomaly detection) → supervised classification → deep LSTM autoencoder",
  },
  {
    id: "supply-chain",
    title: "DataCo Smart Supply Chain ML",
    description: "Leakage-free ML on 180,519 supply chain records. Binary classification (late delivery risk) + regression (order profit). XGBoost vs LightGBM 3.2.0. Rigorous leakage audit on post-fulfillment columns.",
    longDescription: `Advanced ML analysis on DataCo's supply chain dataset with a critical fix: eliminating data leakage from post-fulfillment columns present in most published solutions.

**Dataset:** 180,519 orders, 53 raw features.

**Leakage audit:** Removed shipping_delay (actual − scheduled), Days for shipping (real), Benefit per order — all unavailable at prediction time.

**Two prediction tasks:**
1. **Binary classification:** Late delivery risk (precision/recall/AUC)
2. **Regression:** Order profit prediction (RMSE/MAE)

**Models:** XGBoost 3.2.0, LightGBM 4.6.0 — latest versions with hardware tree method.

**Data files:** 180,519 orders + description metadata + 469,977 access log events.`,
    category: ["timeseries"],
    tags: ["XGBoost", "LightGBM", "Supply Chain", "Leakage-Free", "Classification", "Regression"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: false,
    dataset: "DataCo SCMS: 180,519 records, 53 features",
    techStack: ["Python", "XGBoost 3.2.0", "LightGBM 4.6.0", "Pandas", "Scikit-learn"],
    approach: "Leakage-audited pipeline with dual task (binary classification + regression)",
  },
  {
    id: "linkedin-jobs",
    title: "LinkedIn Job Postings ML Pipeline",
    description: "Full ML pipeline on 123,849 LinkedIn postings (2023–2024): salary prediction, skills demand analysis, NLP on descriptions, company-level features. Joined 7 CSV files across companies/jobs/mappings.",
    longDescription: `End-to-end ML pipeline on a large LinkedIn dataset (123,849 job postings) with rich relational data.

**Files joined:**
| File | Size |
|------|------|
| postings.csv | 123,849 rows |
| companies.csv | 24,473 companies |
| salaries.csv | 40,785 entries (32.9% coverage) |
| job_skills.csv | 213,768 entries |

**Tasks:**
1. **Salary prediction** (regression on 40,785 entries with pay period normalization)
2. **Skills demand analysis** (NLP on 213K skill-job pairs)
3. **Salary coverage:** 32.9% (yearly 23K, hourly 16K, monthly 539, weekly 180)

**Feature engineering:** Pay period normalization (hourly→yearly), text TF-IDF on job descriptions, company size encoding.`,
    category: ["nlp"],
    tags: ["NLP", "Salary Prediction", "Labor Market", "Text Mining", "XGBoost", "Feature Engineering"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: false,
    dataset: "123,849 LinkedIn job postings, 7 relational CSV files",
    techStack: ["Python", "Pandas", "Scikit-learn", "XGBoost", "NLTK", "TF-IDF"],
    approach: "Multi-file join → NLP feature extraction → salary regression + skills demand analysis",
  },
  {
    id: "game-ai",
    title: "Advanced Game Playing Model (DRL)",
    description: "Deep Reinforcement Learning with DQN + Double DQN + Dueling DQN + Prioritized Experience Replay on CartPole-v1 and LunarLander-v2. Architecture: Value + Advantage streams with LayerNorm.",
    longDescription: `State-of-the-art Deep Q-Network implementation with modern RL improvements.

**Architecture — Dueling DQN:**
\`\`\`
DuelingDQN:
  feature_layer: Linear(4,256) → LayerNorm → ReLU
  value_stream: Linear(256,128) → ReLU → Linear(128,1)
  advantage_stream: Linear(256,128) → ReLU → Linear(128,n_actions)
  Q(s,a) = V(s) + (A(s,a) - mean(A(s,a)))
\`\`\`

**Techniques implemented:**
| Technique | Purpose |
|-----------|---------|
| DQN | Q-learning with replay buffer |
| Double DQN | Reduce overestimation bias |
| Dueling DQN | Separate value and advantage |
| PER | Prioritized Experience Replay |

**Environments:** CartPole-v1 (4D state, 2 actions) + LunarLander-v2 (8D state, 4 actions).

**Tech:** PyTorch 2.10, Gymnasium 1.2.0, CUDA.`,
    category: ["rl"],
    tags: ["DQN", "Double DQN", "Dueling DQN", "PER", "CartPole", "LunarLander", "Gymnasium"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: false,
    dataset: "CartPole-v1 + LunarLander-v2 (OpenAI Gymnasium)",
    techStack: ["Python", "PyTorch 2.10", "Gymnasium 1.2.0", "CUDA", "NumPy"],
    approach: "DQN → Double DQN → Dueling DQN → PER progressive improvement benchmark",
  },
  {
    id: "network-security",
    title: "Network Security Anomaly Detection",
    description: "Anomaly detection for embedded system network traffic — IoT cybersecurity threat identification. Unsupervised + supervised ML to flag network intrusions in constrained IoT environments.",
    category: ["fraud"],
    tags: ["Cybersecurity", "Anomaly Detection", "IoT", "Embedded Systems", "Network Security"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: false,
    techStack: ["Python", "Scikit-learn", "Isolation Forest", "XGBoost", "PCA"],
    approach: "Unsupervised anomaly detection + supervised classification on network traffic features",
  },
  {
    id: "poetry-gen",
    title: "Poetry Generation (GPT-style LM)",
    description: "GPT-style language model trained on Poetry Foundation dataset for creative poem generation. Character/word-level next-token prediction with beam search and temperature sampling.",
    category: ["nlp", "genai"],
    tags: ["Language Model", "GPT", "Text Generation", "Creative AI", "Beam Search", "Temperature Sampling"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: false,
    dataset: "Poetry Foundation dataset",
    techStack: ["Python", "PyTorch", "Transformer decoder", "Tokenization"],
    approach: "Auto-regressive language model fine-tuned on curated poetry corpus",
  },
  {
    id: "handwritten-recognition",
    title: "Handwritten Name Recognition",
    description: "OCR pipeline for handwritten name recognition combining CNN feature extraction with RNN/CTC sequence decoding for end-to-end text recognition from unconstrained handwriting.",
    category: ["cv", "nlp"],
    tags: ["OCR", "CNN", "RNN", "CTC Loss", "Handwriting", "Sequence Recognition"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: false,
    techStack: ["Python", "TensorFlow/Keras", "CNN", "LSTM", "CTC Loss"],
    approach: "CNN feature extraction + LSTM sequence decoder with CTC loss for handwriting OCR",
  },
  {
    id: "food-delivery",
    title: "Food Delivery Time Prediction",
    description: "Regression pipeline predicting food delivery times from order features (distance, traffic, weather, rider rating, vehicle type). Multiple ML models benchmarked with RMSE optimization.",
    category: ["timeseries"],
    tags: ["Regression", "Logistics", "XGBoost", "Feature Engineering", "RMSE Optimization"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: false,
    techStack: ["Python", "XGBoost", "LightGBM", "Scikit-learn", "Pandas"],
    approach: "Feature-rich regression benchmark for delivery time optimization",
  },
  {
    id: "power-consumption",
    title: "Household Power Consumption Forecasting",
    description: "Time series forecasting for household electrical power demand (Global_active_power) using LSTM, ARIMA, and Prophet. Data: 2M+ measurements at 1-minute resolution from UCI ML Repository.",
    category: ["timeseries"],
    tags: ["LSTM", "ARIMA", "Prophet", "Power Forecasting", "Time Series", "UCI Dataset"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: false,
    dataset: "UCI Household Power: 2M+ measurements, 1-min resolution, 7 electrical features",
    techStack: ["Python", "TensorFlow/LSTM", "statsmodels (ARIMA)", "Prophet", "Pandas"],
    approach: "Multi-model time series benchmark on high-frequency electricity consumption data",
  },
  {
    id: "product-demand",
    title: "Historical Product Demand Forecasting",
    description: "Demand forecasting pipeline for multiple product categories. Feature engineering with lag features, rolling statistics, and seasonal decomposition. XGBoost + LightGBM + LSTM comparison.",
    category: ["timeseries"],
    tags: ["Demand Forecasting", "XGBoost", "LSTM", "Lag Features", "Rolling Statistics", "Seasonality"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: false,
    techStack: ["Python", "XGBoost", "LightGBM", "TensorFlow/LSTM", "statsmodels"],
    approach: "Lag + rolling feature engineering for multi-product demand time series",
  },
  {
    id: "speech-commands",
    title: "Synthetic Speech Commands Classification",
    description: "Audio classification CNN for speech command recognition. Mel-spectrogram feature extraction, data augmentation (time shift, pitch shift, noise), CNN classifier on spectrograms.",
    category: ["nlp"],
    tags: ["Audio", "CNN", "Mel-Spectrogram", "Speech Recognition", "librosa", "Data Augmentation"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: false,
    techStack: ["Python", "librosa", "TensorFlow/Keras", "CNN", "Mel-Spectrogram"],
    approach: "Mel-spectrogram → CNN image classifier approach for audio command recognition",
  },
  {
    id: "line-detection",
    title: "Line Detection (Computer Vision)",
    description: "Computer vision pipeline for geometric line detection using Canny edge detection, Hough transform, and deep learning approaches. Applied to road lane and structural analysis.",
    category: ["cv"],
    tags: ["Computer Vision", "Hough Transform", "Canny Edge", "Lane Detection", "OpenCV"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: false,
    techStack: ["Python", "OpenCV", "NumPy", "Hough Transform", "Canny"],
    approach: "Classical CV (Canny + Hough) + deep learning comparison for line detection",
  },
  {
    id: "anime-gan",
    title: "Anime Face Generation (DCGAN)",
    description: "DCGAN trained 100 epochs on Tesla T4 GPU on 43K anime images. Generator: ConvTranspose2d stack (100→512→256→128→64→3). Training stability: β₁=0.5, label smoothing, StepLR. Slerp latent interpolation.",
    longDescription: `DCGAN trained from scratch on 43,102 anime face images (64×64 px) on Kaggle Tesla T4 GPU.

**Architecture:**
- Generator: Latent(100) → ConvTranspose2d × 4 → 3×64×64 (Tanh)
- Discriminator: Conv2d × 4 → Sigmoid

**Training stability tricks:**
1. Weight init: Normal(0, 0.02) for Conv, Normal(1, 0.02) for BatchNorm
2. Adam with β₁=0.5 (critical for GAN stability)
3. LR scheduler: StepLR ×0.5 at epoch 50
4. Label smoothing: Real=0.9 (prevents discriminator overconfidence)

**Slerp interpolation:** Spherical linear interpolation between latent vectors for smooth image transitions. Linear interpolation produces muddy in-betweens; slerp respects the latent space geometry.

**Results:** 100 epochs, ~58s/epoch. 200 generated samples. Common failure modes avoided: mode collapse and checkerboard artifacts.`,
    category: ["genai"],
    tags: ["DCGAN", "GAN", "PyTorch", "Generative AI", "Slerp", "GPU Training", "Tesla T4"],
    kaggleUrl: "https://www.kaggle.com/ossamaelhakk/code",
    featured: false,
    metrics: "100 epochs, 43K images",
    dataset: "43,102 anime face images (64×64 px)",
    techStack: ["Python", "PyTorch", "DCGAN", "CUDA Tesla T4", "Adam optimizer"],
    approach: "DCGAN with slerp latent interpolation and training stability techniques",
  },

  // ── AGENTS & AUTOMATION ──────────────────────────────────────────────────
  {
    id: "recommendation-engine",
    title: "E-commerce Recommendation Engine (n8n)",
    description: "Complete recommendation system backend with n8n + PostgreSQL. 4 recommendation modes: trending, co-purchase, personalized, repurchase. Webhook API, daily cleanup scheduler, upsert logic.",
    longDescription: `Production recommendation engine built entirely with n8n workflows and PostgreSQL — no custom server required.

**4 Recommendation modes:**
1. **Trending** — most purchased products in rolling window
2. **Co-purchase** — items frequently bought together (market basket analysis)
3. **Personalized** — based on individual customer order history
4. **Repurchase** — items customer has bought before, likely to buy again

**Architecture (74 nodes):**
\`\`\`
Webhook: Import Orders → PostgreSQL (validate client → insert)
Webhook: Generate Recs → (fetch orders → compute algorithms → upsert to DB)
Webhook: Get Recs → PostgreSQL (fetch by mode + client)
Webhook: Customer Recs → (personalized + repurchase merge)
ScheduleTrigger: Daily Cleanup → PostgreSQL (purge old orders)
\`\`\`

**v2 improvements:** Cleaner upsert logic, better error handling, scheduler-based daily refresh.`,
    category: ["agents", "backend"],
    tags: ["n8n", "PostgreSQL", "Webhooks", "Recommendation", "Market Basket", "Automation"],
    featured: false,
    dataset: "Custom e-commerce order data via REST API",
    techStack: ["n8n", "PostgreSQL", "JavaScript (Code nodes)", "REST webhooks"],
    approach: "4-algorithm recommendation engine with upsert logic, daily cleanup, and webhook API",
  },
  {
    id: "rag-multiagent",
    title: "RAG Multi-Agent System (n8n + Pinecone)",
    description: "109-node n8n orchestration: Google Drive PDF ingestion → Pinecone vector store → Cohere embeddings → AI Agent → Airtop web scraping → Apify actors. Full RAG pipeline with Ollama LLM.",
    longDescription: `Massive 109-node n8n workflow combining RAG, web scraping, OCR, and multi-agent orchestration.

**Sub-workflows:**
1. **Google Drive PDF OCR:** Drive trigger → download → OCR API → extract fields → Sheets append
2. **RAG pipeline:** PDF → chunking (Recursive Character TextSplitter) → Cohere embeddings → Pinecone upsert → AI Agent query
3. **Web scraping:** Airtop browser automation (navigate → click → type → extract)
4. **Competitive research:** Apify actors → dataset retrieval → AI synthesis
5. **Chat interface:** n8n chat trigger → AI Agent with memory buffer → multi-tool calling

**Technologies:** Pinecone (vector store), Cohere (embeddings), Ollama (local LLM), Airtop (headless browser), Apify (web scraping), Google Drive, Google Sheets, Gmail.`,
    category: ["agents"],
    tags: ["RAG", "Pinecone", "n8n", "Cohere", "Ollama", "Airtop", "Apify", "Vector Store", "LLM"],
    featured: false,
    techStack: ["n8n", "Pinecone", "Cohere Embeddings", "Ollama", "Airtop", "Apify", "Google Workspace"],
    approach: "Multi-agent RAG with vector search, web scraping automation, and multi-tool LLM agents",
  },
  {
    id: "microservices",
    title: "Microservices Architecture (Spring Boot)",
    description: "Production microservices with Spring Boot, Apache Kafka event streaming, OAuth2/Keycloak authentication, gRPC inter-service communication, API gateway, Docker containerization.",
    category: ["backend", "deployment"],
    tags: ["Spring Boot", "Kafka", "Keycloak", "gRPC", "Docker", "Java", "Microservices"],
    githubUrl: "https://github.com/ELHAKKI-OSSAMA/DEveloppement-d-un-micro-service-v2",
    featured: false,
    techStack: ["Java", "Spring Boot", "Apache Kafka", "OAuth2/Keycloak", "gRPC", "Docker", "PostgreSQL"],
    approach: "Event-driven microservices with Kafka, secured by Keycloak OAuth2, with gRPC for sync calls",
  },
];

import { GITHUB_URL } from '../personal';
import type { Project } from './types';

export const projectsPart2: Project[] = [
  {
    id: "book-recommender",
    title: "Book Recommender Systems — Full Taxonomy",
    titleFr: "Systèmes de Recommandation de Livres — Taxonomie Complète",
    titleAr: "أنظمة توصية الكتب — تصنيف شامل",
    description: "Complete recommender system taxonomy on BookCrossing (1.1M ratings): User-CF, Item-CF, SVD/NMF/ALS, Content-Based, Hybrid, NCF, AutoRec, GRU4Rec. User-CF RMSE 1.6645, P@10 0.6629, R@10 0.6910.",
    descriptionFr: "Taxonomie complète des systèmes de recommandation sur BookCrossing (1,1M d'évaluations) : User-CF, Item-CF, SVD/NMF/ALS, basé contenu, hybride, NCF, AutoRec, GRU4Rec. User-CF RMSE 1,6645, P@10 0,6629, R@10 0,6910.",
    descriptionAr: "تصنيف شامل لأنظمة التوصية على BookCrossing (1.1M تقييم): User-CF، Item-CF، SVD/NMF/ALS، قائم على المحتوى، هجين، NCF، AutoRec، GRU4Rec. User-CF RMSE 1.6645.",
    longDescription: `Comprehensive implementation of all major recommender paradigms on the Book-Crossing dataset.

**Dataset**
- Raw: 271,360 books, 278,858 users, 1,149,780 ratings
- Filtered (explicit ≥ 1): 118,699 ratings, 7,027 users, 9,438 books
- Rating scale: 1–10 (explicit) + implicit feedback (page views)

**Full Taxonomy**
\`\`\`
Recommender Systems
├── 1. Collaborative Filtering
│   ├── User-based CF (cosine similarity, K=20)
│   ├── Item-based CF
│   └── Matrix Factorization: SVD / NMF / ALS
├── 2. Content-Based Filtering
│   └── TF-IDF on book metadata (title, author, genre)
├── 3. Hybrid
│   ├── Weighted combination (CF + CB)
│   └── Switching (CB for cold-start users)
└── 4. Deep Learning
    ├── NCF (Neural Collaborative Filtering)
    ├── AutoRec (Autoencoder CF)
    └── GRU4Rec (Session-based sequential)
\`\`\`

**Key Results (User-CF)**
| Metric | Value |
|--------|-------|
| RMSE | 1.6645 |
| Precision@10 | 0.6629 |
| Recall@10 | 0.6910 |

**Cold-Start Handling**
New users (<5 ratings) fall back to Content-Based or popularity-based recommendations. Hybrid switching strategy avoids CF failure on cold-start.

**Key Insight**
GRU4Rec (session-based) is the most practically valuable architecture — it handles anonymous users and captures short-term intent without needing a user history, which is the real-world default for most e-commerce sessions.`,
    longDescriptionFr: `Implémentation complète de tous les grands paradigmes de systèmes de recommandation sur le dataset Book-Crossing.

**Jeu de données**
- Brut : 271 360 livres, 278 858 utilisateurs, 1 149 780 évaluations
- Filtré (explicite ≥ 1) : 118 699 évaluations, 7 027 utilisateurs, 9 438 livres
- Échelle d'évaluation : 1–10 (explicite) + feedback implicite (vues de pages)

**Taxonomie Complète**
\`\`\`
Systèmes de Recommandation
├── 1. Filtrage Collaboratif
│   ├── CF basé utilisateur (similarité cosinus, K=20)
│   ├── CF basé items
│   └── Factorisation matricielle : SVD / NMF / ALS
├── 2. Filtrage Basé Contenu
│   └── TF-IDF sur métadonnées livre (titre, auteur, genre)
├── 3. Hybride
│   ├── Combinaison pondérée (CF + CB)
│   └── Commutation (CB pour utilisateurs cold-start)
└── 4. Deep Learning
    ├── NCF (Filtrage Collaboratif Neuronal)
    ├── AutoRec (CF Autoencoder)
    └── GRU4Rec (séquentiel basé session)
\`\`\`

**Résultats Clés (User-CF)**
| Métrique | Valeur |
|--------|-------|
| RMSE | 1,6645 |
| Precision@10 | 0,6629 |
| Recall@10 | 0,6910 |

**Gestion du Démarrage à Froid**
Les nouveaux utilisateurs (<5 évaluations) basculent vers les recommandations basées contenu ou sur la popularité. La stratégie de commutation hybride évite l'échec du CF sur le cold-start.

**Insight Clé**
GRU4Rec (basé session) est l'architecture la plus utile en pratique — il gère les utilisateurs anonymes et capture l'intention à court terme sans nécessiter d'historique, ce qui est la réalité pour la plupart des sessions e-commerce.`,
    longDescriptionAr: `تطبيق شامل لجميع نماذج أنظمة التوصية الرئيسية على مجموعة بيانات Book-Crossing.

**مجموعة البيانات**
- خام: 271,360 كتاباً، 278,858 مستخدماً، 1,149,780 تقييماً
- مُصفَّى (صريح ≥ 1): 118,699 تقييم، 7,027 مستخدم، 9,438 كتاب
- مقياس التقييم: 1-10 (صريح) + تغذية راجعة ضمنية

**التصنيف الكامل**
\`\`\`
أنظمة التوصية
├── 1. التصفية التعاونية
│   ├── CF القائم على المستخدم (تشابه كوسينوس، K=20)
│   ├── CF القائم على العناصر
│   └── تحليل المصفوفة: SVD / NMF / ALS
├── 2. التصفية القائمة على المحتوى
│   └── TF-IDF على بيانات الكتاب
├── 3. هجين (pondéré + commutation)
└── 4. التعلم العميق
    ├── NCF (التصفية التعاونية العصبية)
    ├── AutoRec
    └── GRU4Rec (تسلسلي قائم على الجلسة)
\`\`\`

**النتائج الرئيسية (User-CF)**
| المقياس | القيمة |
|--------|-------|
| RMSE | 1.6645 |
| Precision@10 | 0.6629 |
| Recall@10 | 0.6910 |

**الاستنتاج الرئيسي**
GRU4Rec القائم على الجلسة هو الأكثر قيمةً عملياً — يتعامل مع المستخدمين المجهولين ويلتقط النية قصيرة الأمد دون تاريخ، وهو الواقع الافتراضي لمعظم جلسات التجارة الإلكترونية.`,
    category: ["nlp"],
    tags: ["Collaborative Filtering", "SVD", "NCF", "GRU4Rec", "Matrix Factorization", "Recommender Systems"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/book-recommender-systems-full-taxonomy",
    featured: false,
    dataset: "BookCrossing: 1,149,780 ratings, 271,360 books, 278,858 users",
    datasetFr: "BookCrossing : 1 149 780 évaluations, 271 360 livres, 278 858 utilisateurs",
    datasetAr: "BookCrossing: 1,149,780 تقييم، 271,360 كتاباً، 278,858 مستخدماً",
    results: [
      { label: "User-CF RMSE", value: "1.6645" },
      { label: "Precision@10", value: "0.6629" },
      { label: "Recall@10", value: "0.6910" },
      { label: "Architectures", value: "8 (CF → DL)" },
    ],
    techStack: ["Python", "PyTorch", "Surprise (SVD/NMF)", "Scipy (ALS)", "scikit-learn"],
    approach: "Full taxonomy: User-CF → Item-CF → MF → Content-Based → Hybrid → NCF/AutoRec/GRU4Rec",
    approachFr: "Taxonomie complète : User-CF → Item-CF → MF → Basé contenu → Hybride → NCF/AutoRec/GRU4Rec",
    approachAr: "تصنيف كامل: User-CF → Item-CF → MF → قائم على المحتوى → هجين → NCF/AutoRec/GRU4Rec",
  },
  {
    id: "energy-forecast",
    title: "Hourly Energy Consumption Forecasting",
    titleFr: "Prévision de la Consommation d'Énergie Horaire",
    titleAr: "التنبؤ باستهلاك الطاقة بالساعة",
    description: "10-model benchmark on 145,366 PJM hourly records (2002–2018). LightGBM best: MAE=210.8 MW, RMSE=285.4 MW, MAPE=0.66%. Prophet fails (MAPE=10.25%). BiLSTM MAPE=2.17%. 26 lag/rolling/cyclical features.",
    descriptionFr: "Benchmark de 10 modèles sur 145 366 enregistrements horaires PJM (2002–2018). LightGBM meilleur : MAE=210,8 MW, RMSE=285,4 MW, MAPE=0,66%. Prophet échoue (MAPE=10,25%). BiLSTM MAPE=2,17%. 26 caractéristiques lag/rolling/cycliques.",
    descriptionAr: "معيار 10 نماذج على 145,366 سجلاً ساعياً لـ PJM (2002-2018). LightGBM الأفضل: MAE=210.8 MW، RMSE=285.4 MW، MAPE=0.66%. Prophet يفشل (MAPE=10.25%). BiLSTM MAPE=2.17%. 26 ميزة lag/rolling/دورية.",
    longDescription: `10-model time series benchmark for PJM hourly energy demand.

**Dataset**
- PJME: 145,366 hourly records, 2002-01-01 to 2018-08-03
- Range: 14,544–62,009 MW. Train: 85% / Test: last ~1 year (8,760 rows)

**Feature Engineering (26 features)**
| Category | Features |
|----------|---------|
| Lag | lag_1h, lag_24h, lag_168h (1 week) |
| Rolling stats | mean_24h, std_24h, mean_168h, std_168h |
| Cyclical | sin/cos(hour), sin/cos(DOW), sin/cos(month) |
| Calendar | is_weekend, is_holiday |

**All 10 Models**
| Model | MAE (MW) | RMSE (MW) | MAPE |
|-------|----------|-----------|------|
| Naive (last value) | 5,205 | 5,908 | 16.5% |
| Seasonal Naive (1W) | 3,588 | 4,856 | 11.2% |
| Moving Average | 2,874 | 3,643 | 9.2% |
| Linear Regression | 380 | 519 | 1.2% |
| Random Forest | 348 | 465 | 1.1% |
| Prophet | 3,248 | 4,231 | 10.3% |
| BiLSTM | 699 | 917 | 2.2% |
| XGBoost | 222 | 300 | 0.70% |
| **LightGBM** | **211** | **285** | **0.66%** |

**Key Insights**
- Tree models with lag features MAPE < 1% vs Prophet's 10%+
- Prophet cannot leverage the strong lag-24h autocorrelation
- BiLSTM underperforms XGBoost despite more parameters — engineered lags encode temporal structure better than learned recurrence
- Top LightGBM features: lag_1h, hour_cos, hour (immediate past + time-of-day)`,
    longDescriptionFr: `Benchmark de 10 modèles pour la prévision horaire de la demande en énergie PJM.

**Jeu de données**
- PJME : 145 366 enregistrements horaires, 2002-01-01 au 2018-08-03
- Plage : 14 544–62 009 MW. Entraînement : 85% / Test : dernière ~1 an (8 760 lignes)

**Feature Engineering (26 caractéristiques)**
| Catégorie | Caractéristiques |
|----------|---------|
| Lag | lag_1h, lag_24h, lag_168h (1 semaine) |
| Stats rolling | mean_24h, std_24h, mean_168h, std_168h |
| Cycliques | sin/cos(heure), sin/cos(JdS), sin/cos(mois) |
| Calendrier | is_weekend, is_holiday |

**Les 10 Modèles**
| Modèle | MAE (MW) | RMSE (MW) | MAPE |
|-------|----------|-----------|------|
| Naïf (dernière valeur) | 5 205 | 5 908 | 16,5% |
| Naïf Saisonnier (1S) | 3 588 | 4 856 | 11,2% |
| Moyenne Mobile | 2 874 | 3 643 | 9,2% |
| Régression Linéaire | 380 | 519 | 1,2% |
| Random Forest | 348 | 465 | 1,1% |
| Prophet | 3 248 | 4 231 | 10,3% |
| BiLSTM | 699 | 917 | 2,2% |
| XGBoost | 222 | 300 | 0,70% |
| **LightGBM** | **211** | **285** | **0,66%** |

**Insights Clés**
- Modèles arborescents avec features lag : MAPE < 1% vs 10%+ pour Prophet
- Prophet ne peut exploiter la forte autocorrélation lag-24h
- BiLSTM sous-performe XGBoost malgré plus de paramètres — les lags engineerés encodent mieux la structure temporelle
- Top features LightGBM : lag_1h, hour_cos, hour (passé immédiat + heure du jour)`,
    longDescriptionAr: `معيار 10 نماذج للتنبؤ بالطلب على الطاقة الساعي لـ PJM.

**مجموعة البيانات**
- PJME: 145,366 سجلاً ساعياً، 2002-01-01 إلى 2018-08-03
- النطاق: 14,544-62,009 MW. التدريب: 85% / الاختبار: ~سنة أخيرة (8,760 صفاً)

**هندسة الميزات (26 ميزة)**
| الفئة | الميزات |
|----------|---------|
| Lag | lag_1h، lag_24h، lag_168h (أسبوع) |
| إحصاءات متحركة | mean_24h، std_24h، mean_168h، std_168h |
| دورية | sin/cos(ساعة)، sin/cos(يوم)، sin/cos(شهر) |
| تقويم | is_weekend، is_holiday |

**النماذج الـ 10**
| النموذج | MAE (MW) | RMSE (MW) | MAPE |
|-------|----------|-----------|------|
| ساذج (آخر قيمة) | 5,205 | 5,908 | 16.5% |
| ساذج موسمي (أسبوع) | 3,588 | 4,856 | 11.2% |
| متوسط متحرك | 2,874 | 3,643 | 9.2% |
| الانحدار الخطي | 380 | 519 | 1.2% |
| Random Forest | 348 | 465 | 1.1% |
| Prophet | 3,248 | 4,231 | 10.3% |
| BiLSTM | 699 | 917 | 2.2% |
| XGBoost | 222 | 300 | 0.70% |
| **LightGBM** | **211** | **285** | **0.66%** |

**استنتاجات رئيسية**
- نماذج الأشجار مع ميزات lag: MAPE < 1% مقابل 10%+ لـ Prophet
- Prophet لا يستطيع استغلال الارتباط الذاتي القوي lag-24h
- BiLSTM يُضعف XGBoost رغم معاملات أكثر — lags المهندَسة تُرمّز البنية الزمنية بشكل أفضل
- أبرز ميزات LightGBM: lag_1h، hour_cos، hour`,
    category: ["timeseries"],
    tags: ["LightGBM", "XGBoost", "BiLSTM", "Prophet", "Lag Features", "Energy Forecasting"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/hourly-energy-consumption-forecasting",
    featured: false,
    metrics: "LightGBM RMSE: 285.4 MW | MAPE: 0.66%",
    dataset: "PJME: 145,366 hourly records (2002–2018)",
    datasetFr: "PJME : 145 366 enregistrements horaires (2002–2018)",
    datasetAr: "PJME: 145,366 سجلاً ساعياً (2002-2018)",
    results: [
      { label: "LightGBM MAE", value: "210.8 MW" },
      { label: "LightGBM MAPE", value: "0.66%" },
      { label: "Prophet MAPE", value: "10.25%" },
      { label: "BiLSTM MAPE", value: "2.17%" },
    ],
    techStack: ["Python", "LightGBM", "XGBoost", "TensorFlow/BiLSTM", "Prophet", "statsmodels"],
    approach: "26 lag/rolling/cyclical features → 10-model benchmark from naive baselines to BiLSTM",
    approachFr: "26 caractéristiques lag/rolling/cycliques → benchmark de 10 modèles des baselines naïves au BiLSTM",
    approachAr: "26 ميزة lag/rolling/دورية → معيار 10 نماذج من الخطوط الأساسية البسيطة إلى BiLSTM",
  },
  {
    id: "stock-prediction",
    title: "EURUSD Forecasting — 30+ Models (Quantum · GNN · Diffusion · GA)",
    titleFr: "Prévision EURUSD — 30+ Modèles (Quantique · GNN · Diffusion · AG)",
    titleAr: "التنبؤ بـ EURUSD — أكثر من 30 نموذجاً (كمومي · GNN · انتشار · خوارزمية جينية)",
    description: "Most comprehensive EURUSD benchmark: 30+ models including Quantum ML (QSVM/QNN/QAE/VQC), Genetic Algorithms (7 variants + Neural Chromosomes), GNN, Neural SDE, Diffusion DDPM, Informer, PatchTST, TFT. Delta-target methodology. NSGA-2 multi-objective optimization.",
    descriptionFr: "Benchmark EURUSD le plus complet : 30+ modèles dont ML Quantique (QSVM/QNN/QAE/VQC), Algorithmes Génétiques (7 variantes + Chromosomes Neuronaux), GNN, Neural SDE, Diffusion DDPM, Informer, PatchTST, TFT. Méthodologie delta-target. Optimisation multi-objectif NSGA-2.",
    descriptionAr: "أشمل معيار لـ EURUSD: أكثر من 30 نموذجاً تشمل ML الكمومي (QSVM/QNN/QAE/VQC)، خوارزميات جينية (7 متغيرات + كروموسومات عصبية)، GNN، Neural SDE، Diffusion DDPM. منهجية delta-target. تحسين متعدد الأهداف NSGA-2.",
    longDescription: `The most comprehensive Forex forecasting benchmark, covering every modern ML paradigm from classical time series to quantum computing.

**Delta-Target Methodology**
Predict Δclose (daily price change) not absolute price — eliminates non-stationarity and prevents trend leakage.
\`\`\`
pred_close(t+1) = close(t) + pred_Δclose
\`\`\`
Δclose ∈ [−0.05, +0.05] for EURUSD daily. Near-stationary. RobustScaler per-feature.

**Dataset**
4,211 EURUSD 1D candles (2010-01-01 → 2026-03-06), 39 engineered features.
Top correlator: upper_shadow (+0.618 with Δclose).

**30+ Models Across 8 Paradigms**

**1. Classical Statistical**
ARIMA(2,1,2), SARIMA(1,1,1)(1,1,1)5, GARCH(1,1)

**2. Financial/Stochastic**
Black-Scholes GBM Monte Carlo, Heston Stochastic Volatility Model

**3. Machine Learning**
ROCKET+Ridge, XGBoost+CatBoost (Optuna-tuned), Stacking (Inv-RMSE weighted)

**4. Deep Sequence**
BiLSTM+Attention, BiGRU+Attention, CNN 1D-Conv, Informer, Autoformer, PatchTST, TFT (Temporal Fusion Transformer), TST Transformer

**5. Graph Neural Networks**
GNN with Feature-Correlation Graph (edges = Pearson correlation between features)

**6. Generative / Probabilistic**
Neural SDE (stochastic differential equation), Diffusion Model DDPM (denoising)

**7. Quantum ML (4 architectures)**
| Model | Approach |
|-------|---------|
| QNN VQC | Variational Quantum Circuit |
| QSVM | Quantum Kernel SVM |
| QBM / VQNN | Ising-VQC Boltzmann Machine |
| QAE | Quantum Amplitude Estimation |

**8. Evolutionary / Genetic Algorithms (8 variants)**
| GA Variant | Key Feature |
|-----------|------------|
| Basic GA | Tournament + 1-point + uniform |
| Classic GA | Roulette + uniform + Gaussian |
| Advanced GA | BLX-α + Polynomial + Niching + Context |
| Lamarckian GA | GA + gradient fine-tune (Lamarckian inheritance) |
| Neural Chromo MLP | NN as chromosome (predict Δclose) |
| Neural Chromo Transformer | Transformer chromosome |
| Neural Chromo Context | preds + market features + attention overlay |
| NSGA-2 | Multi-objective (RMSE vs model complexity) Pareto front |

**Grand Leaderboard (top performers)**
Stacking ensemble (Inv-RMSE weighted) consistently tops the leaderboard. Quantum models approach classical ML performance on this dataset size. Neural Chromosomes show promise as a genetic representation.

**Honest Assessment**
EURUSD daily is near-efficient — even optimal models achieve directional accuracy of 52–56%. The value of this project is the framework, not the Sharpe ratio.`,
    longDescriptionFr: `Le benchmark de prévision Forex le plus complet, couvrant tous les paradigmes ML modernes, de la série temporelle classique à l'informatique quantique.

**Méthodologie Delta-Target**
Prédire Δclose (changement de prix journalier) et non le prix absolu — élimine la non-stationnarité et prévient la fuite de tendance.
\`\`\`
close_prédit(t+1) = close(t) + Δclose_prédit
\`\`\`
Δclose ∈ [−0,05 ; +0,05] pour l'EURUSD journalier. Quasi-stationnaire. RobustScaler par feature.

**Jeu de données**
4 211 bougies EURUSD 1J (2010-01-01 → 2026-03-06), 39 features engineerées.
Meilleur corrélateur : upper_shadow (+0,618 avec Δclose).

**30+ Modèles sur 8 Paradigmes**

**1. Statistiques Classiques**
ARIMA(2,1,2), SARIMA(1,1,1)(1,1,1)5, GARCH(1,1)

**2. Financier/Stochastique**
Black-Scholes GBM Monte Carlo, Modèle de Volatilité Stochastique Heston

**3. Machine Learning**
ROCKET+Ridge, XGBoost+CatBoost (optimisé Optuna), Stacking (pondéré inv-RMSE)

**4. Séquences Profondes**
BiLSTM+Attention, BiGRU+Attention, CNN 1D-Conv, Informer, Autoformer, PatchTST, TFT (Temporal Fusion Transformer), TST Transformer

**5. Réseaux de Neurones Graphiques**
GNN avec graphe de corrélation de features (arêtes = corrélation de Pearson entre features)

**6. Génératif / Probabiliste**
Neural SDE (équation différentielle stochastique), Modèle de Diffusion DDPM

**7. ML Quantique (4 architectures)**
| Modèle | Approche |
|-------|---------|
| QNN VQC | Circuit Quantique Variationnel |
| QSVM | SVM noyau quantique |
| QBM / VQNN | Machine de Boltzmann Ising-VQC |
| QAE | Estimation d'Amplitude Quantique |

**8. Algorithmes Évolutifs / Génétiques (8 variantes)**
| Variante AG | Caractéristique Clé |
|-----------|------------|
| AG Basic | Tournoi + 1-point + uniforme |
| AG Classique | Roulette + uniforme + Gaussien |
| AG Avancé | BLX-α + Polynomial + Niches + Contexte |
| AG Lamarckien | AG + affinage gradient (héritage lamarckien) |
| Chromo Neural MLP | NN comme chromosome (prédit Δclose) |
| Chromo Neural Transformer | Chromosome Transformer |
| Chromo Neural Contexte | prédictions + features marché + attention |
| NSGA-2 | Multi-objectif (RMSE vs complexité) front Pareto |

**Bilan (meilleures performances)**
L'ensemble stacking (pondéré inv-RMSE) domine systématiquement. Les modèles quantiques approchent les performances ML classiques. Les chromosomes neuronaux sont prometteurs.

**Évaluation Honnête**
L'EURUSD journalier est quasi-efficient — même les meilleurs modèles atteignent 52–56% de précision directionnelle. La valeur de ce projet est le cadre, pas le ratio de Sharpe.`,
    longDescriptionAr: `أشمل معيار للتنبؤ بالفوركس، يغطي جميع نماذج ML الحديثة من السلاسل الزمنية الكلاسيكية إلى الحوسبة الكمومية.

**منهجية Delta-Target**
التنبؤ بـ Δclose (تغيير السعر اليومي) لا السعر المطلق — يُزيل عدم الاستقرارية ويمنع تسرب الاتجاه.

**مجموعة البيانات**
4,211 شمعة EURUSD يومية (2010-01-01 → 2026-03-06)، 39 ميزة مهندَسة.

**30+ نموذج عبر 8 نماذج**

**1. إحصاء كلاسيكي:** ARIMA، SARIMA، GARCH

**2. مالي/عشوائي:** Black-Scholes GBM، Heston

**3. تعلم آلة:** ROCKET+Ridge، XGBoost+CatBoost، Stacking

**4. تسلسلات عميقة:** BiLSTM+Attention، BiGRU، CNN، Informer، PatchTST، TFT، Transformer

**5. شبكات عصبية رسومية:** GNN مع رسم بياني لارتباط الميزات

**6. توليدي/احتمالي:** Neural SDE، نموذج الانتشار DDPM

**7. ML الكمومي (4 بنى)**
QNN VQC، QSVM، QBM/VQNN، QAE

**8. خوارزميات تطورية/جينية (8 متغيرات)**
أساسي، كلاسيكي، متقدم، لاماركي، كروموسوم عصبي MLP، محول، سياق، NSGA-2

**التقييم الصادق**
EURUSD اليومي شبه فعّال — حتى أفضل النماذج تحقق 52-56% دقة اتجاهية. قيمة هذا المشروع هي الإطار، ليس نسبة شارب.`,
    category: ["timeseries"],
    tags: ["Genetic Algorithms", "Quantum ML", "GNN", "Diffusion DDPM", "Neural SDE", "NSGA-2", "Informer", "PatchTST", "TFT", "EURUSD"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/stock-prediction",
    featured: false,
    metrics: "30+ models | Quantum · GA · GNN · Diffusion",
    dataset: "4,211 EURUSD 1D candles (2010–2026), 39 features",
    datasetFr: "4 211 bougies quotidiennes EURUSD (2010–2026), 39 caractéristiques",
    datasetAr: "4,211 شمعة يومية EURUSD (2010-2026)، 39 ميزة",
    results: [
      { label: "Models benchmarked", value: "30+" },
      { label: "GA variants", value: "8" },
      { label: "Quantum architectures", value: "4" },
      { label: "Top correlator", value: "upper_shadow (0.618)" },
    ],
    techStack: ["Python", "PyTorch", "Qiskit", "NetworkX (GNN)", "Denoising Diffusion", "NSGA-2", "Neural Chromosomes", "TFT", "Informer"],
    approach: "Delta-target + 30+ models spanning classical TS, quantum ML, GNNs, diffusion, and 8 GA variants",
    approachFr: "Delta-target + 30+ modèles couvrant TS classique, ML quantique, GNN, diffusion et 8 variantes AG",
    approachAr: "Delta-target + أكثر من 30 نموذجاً تغطي TS الكلاسيكي، ML الكمومي، GNNs، الانتشار، و8 متغيرات جينية",
  },
  {
    id: "covid-prediction",
    title: "COVID-19 Outbreak Prediction",
    titleFr: "Prédiction de l'Épidémie de COVID-19",
    titleAr: "التنبؤ بتفشي كوفيد-19",
    description: "Leakage-free pipeline on 188 daily records (Jan–Jul 2020). Target = daily new cases (stationary). Walk-forward TimeSeriesSplit CV. SEIR model + ARIMA + XGBoost + LSTM + Transformer. Fixes cumulative-count leakage from v1.",
    descriptionFr: "Pipeline sans fuite sur 188 enregistrements quotidiens (Jan–Jul 2020). Cible = nouveaux cas quotidiens (stationnaire). CV Walk-forward TimeSeriesSplit. Modèle SEIR + ARIMA + XGBoost + LSTM + Transformer. Corrige la fuite sur les données cumulées.",
    descriptionAr: "خط أنابيب بدون تسرب على 188 سجلاً يومياً (يناير-يوليو 2020). الهدف = الحالات اليومية الجديدة (ثابتة). CV Walk-forward TimeSeriesSplit. نموذج SEIR + ARIMA + XGBoost + LSTM + Transformer. يصحح تسرب البيانات التراكمية.",
    longDescription: `COVID-19 daily case forecasting with critical fixes to the data leakage in most published solutions.

**4 Critical Fixes vs v1**
| Issue | Fix |
|-------|-----|
| ML trained on cumulative counts (future trend leakage) | Target = daily new cases (stationary) |
| SEIR incubation ~1 day (biologically impossible) | Constrained: incubation 5–14 days |
| Random train/test split (future data in training) | Walk-forward TimeSeriesSplit CV |
| Transformers undertrained (2 epochs) | More epochs + cosine LR |

**Dataset**
- 188 daily records: 2020-01-22 → 2020-07-27
- Features: confirmed, deaths, recovered, active (global aggregate)

**Models Compared**
| Model | Type |
|-------|------|
| SEIR | Compartmental epidemiological model (scipy optimization) |
| ARIMA | Auto (p,d,q), AIC criterion |
| Gradient Boosting | Walk-forward, lag features |
| XGBoost | Optuna-tuned |
| LSTM | Stateful, sequence-to-one |
| Transformer | Encoder-only, positional encoding |

**SEIR Model**
4 compartments: S→E→I→R. scipy.optimize with bounds: β∈[0.1,1.0], σ∈[1/14,1/5], γ∈[1/14,1/7]. Initial conditions from early outbreak data.

**Walk-Forward CV**
Expanding window — each fold trains on all prior data and predicts one step ahead. The only correct evaluation for time series; random splits would leak future case counts into training.`,
    longDescriptionFr: `Prédiction des nouveaux cas quotidiens de COVID-19 avec corrections critiques de la fuite de données présente dans la plupart des solutions publiées.

**4 Corrections Critiques vs v1**
| Problème | Correction |
|-------|-----|
| ML entraîné sur comptages cumulatifs (fuite tendance future) | Cible = nouveaux cas quotidiens (stationnaire) |
| Incubation SEIR ~1 jour (biologiquement impossible) | Contrainte : incubation 5–14 jours |
| Découpage aléatoire entraînement/test (données futures dans l'entraînement) | Walk-forward TimeSeriesSplit CV |
| Transformers sous-entraînés (2 époques) | Plus d'époques + cosine LR |

**Jeu de données**
- 188 enregistrements quotidiens : 2020-01-22 → 2020-07-27
- Features : confirmés, décès, rétablis, actifs (agrégat mondial)

**Modèles Comparés**
| Modèle | Type |
|-------|------|
| SEIR | Modèle épidémiologique compartimental (optimisation scipy) |
| ARIMA | Auto (p,d,q), critère AIC |
| Gradient Boosting | Walk-forward, features lag |
| XGBoost | Optimisé Optuna |
| LSTM | Stateful, séquence-à-un |
| Transformer | Encodeur seul, encodage positionnel |

**Modèle SEIR**
4 compartiments : S→E→I→R. scipy.optimize avec bornes : β∈[0,1 ; 1,0], σ∈[1/14 ; 1/5], γ∈[1/14 ; 1/7]. Conditions initiales depuis les données du début de l'épidémie.

**CV Walk-Forward**
Fenêtre expansive — chaque pli s'entraîne sur toutes les données antérieures et prédit un pas en avant. La seule évaluation correcte pour les séries temporelles ; les découpages aléatoires feraient fuir les comptages futurs vers l'entraînement.`,
    longDescriptionAr: `التنبؤ بالحالات اليومية الجديدة لكوفيد-19 مع إصلاحات حيوية لتسرب البيانات الموجود في معظم الحلول المنشورة.

**4 إصلاحات حيوية مقارنة بـ v1**
| المشكلة | الإصلاح |
|-------|-----|
| ML مدرب على أعداد تراكمية (تسرب) | الهدف = الحالات اليومية الجديدة (ثابت) |
| حضانة SEIR ~يوم واحد (مستحيل بيولوجياً) | قيود: حضانة 5-14 يوماً |
| تقسيم عشوائي (بيانات مستقبلية في التدريب) | Walk-forward TimeSeriesSplit CV |
| Transformers قليل التدريب | حقب أكثر + cosine LR |

**مجموعة البيانات**
- 188 سجلاً يومياً: 2020-01-22 → 2020-07-27
- الميزات: مؤكد، وفيات، متعافٍ، نشط (إجمالي عالمي)

**النماذج المقارنة**
SEIR (تحسين scipy)، ARIMA، Gradient Boosting، XGBoost (Optuna)، LSTM، Transformer

**نموذج SEIR**
4 مقسّمات: S→E→I→R. بقيود: β∈[0.1,1.0]، σ∈[1/14,1/5]، γ∈[1/14,1/7].

**CV Walk-Forward**
نافذة توسعية — كل طية تتدرب على جميع البيانات السابقة وتتنبأ بخطوة واحدة للأمام. التقييم الوحيد الصحيح للسلاسل الزمنية.`,
    category: ["timeseries"],
    tags: ["SEIR", "LSTM", "Transformer", "Epidemiology", "Walk-forward", "ARIMA", "TimeSeriesSplit"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/covid-19-outbreak-prediction",
    featured: false,
    dataset: "188 days COVID-19 global data (Jan–Jul 2020)",
    datasetFr: "188 jours de données COVID-19 mondiales (Jan–Jul 2020)",
    datasetAr: "188 يوماً من بيانات كوفيد-19 العالمية (يناير-يوليو 2020)",
    techStack: ["Python", "Scikit-learn", "TensorFlow", "scipy (SEIR)", "statsmodels"],
    approach: "Stationary daily-delta + walk-forward CV + SEIR + ARIMA + LSTM + Transformer",
    approachFr: "Delta quotidien stationnaire + CV walk-forward + SEIR + ARIMA + LSTM + Transformer",
    approachAr: "دلتا يومي ثابت + CV walk-forward + SEIR + ARIMA + LSTM + Transformer",
  },
  {
    id: "weather-pattern",
    title: "Weather Pattern Detection",
    titleFr: "Détection de Motifs Météorologiques",
    titleAr: "كشف أنماط الطقس",
    description: "9-method pipeline on 96,453 hourly records. K-Means (sil=0.45, K=3), DBSCAN, Isolation Forest (1,930 anomalies), LightGBM macro F1=0.74, 1D-CNN 94.85%, LSTM Autoencoder, Prophet (16 anomaly days).",
    descriptionFr: "Pipeline à 9 méthodes sur 96 453 enregistrements horaires. K-Means (sil=0,45, K=3), DBSCAN, Isolation Forest (1 930 anomalies), LightGBM macro F1=0,74, 1D-CNN 94,85%, LSTM Autoencoder, Prophet (16 jours d'anomalies).",
    descriptionAr: "خط أنابيب بـ 9 طرق على 96,453 سجلاً ساعياً. K-Means (sil=0.45، K=3)، DBSCAN، Isolation Forest (1,930 شذوذاً)، LightGBM macro F1=0.74، 1D-CNN 94.85%، LSTM Autoencoder، Prophet (16 يوماً شاذاً).",
    longDescription: `Multi-paradigm analysis of 96,453 hourly weather records.

**Dataset**
- 96,453 hourly records: temperature, apparent temperature, humidity, wind speed, wind bearing, visibility, pressure
- Precipitation type: 88.4% rain, 11.1% snow, 0.5% none (severe imbalance)

**Clustering (Phase 1)**
| Method | Result |
|--------|--------|
| K-Means | K=3, Silhouette=0.45, Davies-Bouldin=1.10 |
| DBSCAN | 2 clusters + 1,107 noise (10K sample) |
| GMM | Model selection via BIC/AIC |

3 weather regimes: warm/clear, cold/overcast, transition.

**Anomaly Detection (Phase 2)**
| Method | Anomalies |
|--------|----------|
| Isolation Forest | 1,930 (2.0%) |
| LSTM Autoencoder | 90 sequences (threshold: reconstruction > 0.0061) |
| STL + residuals | Anomaly flags on residual component |

All 3 methods agree on the ~2% anomaly rate.

**Classification (Phase 3 — Precipitation Type)**
| Model | Macro F1 |
|-------|---------|
| Random Forest | 0.51 |
| XGBoost | 0.70 |
| **LightGBM** | **0.74** |
| **1D-CNN (season)** | **94.85% accuracy** |

**Forecasting (Phase 4)**
Prophet on temperature: 16 anomaly days detected via CI exceedance in 180-day test.

**Key Insight**
The 0.5% "none" precipitation class makes macro F1 misleading. High accuracy (98%+) masks poor recall on the rare dry class. Real-world weather AI requires uncertainty quantification beyond accuracy metrics.`,
    longDescriptionFr: `Analyse multi-paradigme de 96 453 enregistrements météorologiques horaires.

**Jeu de données**
- 96 453 enregistrements horaires : température, température apparente, humidité, vitesse du vent, direction du vent, visibilité, pression
- Type de précipitation : 88,4% pluie, 11,1% neige, 0,5% aucune (déséquilibre sévère)

**Clustering (Phase 1)**
| Méthode | Résultat |
|--------|--------|
| K-Means | K=3, Silhouette=0,45, Davies-Bouldin=1,10 |
| DBSCAN | 2 clusters + 1 107 bruit (échantillon 10K) |
| GMM | Sélection de modèle par BIC/AIC |

3 régimes météo : chaud/clair, froid/nuageux, transition.

**Détection d'Anomalies (Phase 2)**
| Méthode | Anomalies |
|--------|----------|
| Isolation Forest | 1 930 (2,0%) |
| LSTM Autoencoder | 90 séquences (seuil : reconstruction > 0,0061) |
| STL + résidus | Flags d'anomalie sur la composante résiduelle |

Les 3 méthodes concordent sur un taux d'anomalie de ~2%.

**Classification (Phase 3 — Type de Précipitation)**
| Modèle | Macro F1 |
|-------|---------|
| Random Forest | 0,51 |
| XGBoost | 0,70 |
| **LightGBM** | **0,74** |
| **1D-CNN (saison)** | **94,85% de précision** |

**Prévision (Phase 4)**
Prophet sur la température : 16 jours d'anomalies détectés par dépassement de l'IC sur 180 jours de test.

**Insight Clé**
La classe "aucune précipitation" à 0,5% rend le Macro F1 trompeur. Une haute précision (98%+) masque un mauvais rappel sur la classe rare. L'IA météo réelle nécessite une quantification d'incertitude au-delà des métriques de précision.`,
    longDescriptionAr: `تحليل متعدد النماذج لـ 96,453 سجلاً طقسياً ساعياً.

**مجموعة البيانات**
- 96,453 سجلاً ساعياً: درجة الحرارة، الرطوبة، سرعة الرياح، الضغط، الرؤية
- نوع الهطول: 88.4% مطر، 11.1% ثلج، 0.5% لا شيء (عدم توازن حاد)

**التجميع (المرحلة 1)**
K-Means: K=3، Silhouette=0.45 | DBSCAN: مجموعتان + 1,107 ضجيج | GMM: اختيار النموذج بـ BIC/AIC
3 أنظمة طقسية: دافئ/صافٍ، بارد/غائم، انتقالي.

**كشف الشذوذ (المرحلة 2)**
Isolation Forest: 1,930 (2.0%) | LSTM Autoencoder: 90 تسلسلاً | STL + بواقٍ

**التصنيف (المرحلة 3)**
LightGBM Macro F1: **0.74** | 1D-CNN: **94.85%** دقة

**التنبؤ (المرحلة 4)**
Prophet: 16 يوماً شاذاً على 180 يوم اختبار.

**الاستنتاج الرئيسي**
فئة "بلا هطول" بنسبة 0.5% تجعل Macro F1 مضللاً. الدقة العالية (98%+) تخفي استرجاعاً ضعيفاً للفئة النادرة.`,
    category: ["timeseries"],
    tags: ["K-Means", "DBSCAN", "Isolation Forest", "LightGBM", "1D-CNN", "LSTM Autoencoder", "Prophet"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/weather-pattern-detection",
    featured: false,
    metrics: "LightGBM macro F1: 0.74 | 1D-CNN: 94.85% | IF: 1,930 anomalies",
    dataset: "96,453 hourly weather records — 7 meteorological features",
    datasetFr: "96 453 enregistrements météorologiques horaires — 7 caractéristiques météorologiques",
    datasetAr: "96,453 سجلاً طقسياً ساعياً — 7 مميزات جوية",
    results: [
      { label: "K-Means Silhouette", value: "0.45 (K=3)" },
      { label: "Isolation Forest", value: "1,930 anomalies (2%)" },
      { label: "LightGBM macro F1", value: "0.74" },
      { label: "1D-CNN accuracy", value: "94.85%" },
    ],
    techStack: ["Python", "Scikit-learn", "TensorFlow/LSTM", "XGBoost", "LightGBM", "Prophet"],
    approach: "Clustering → anomaly detection → supervised classification → 1D-CNN → Prophet forecasting",
    approachFr: "Clustering → détection d'anomalies → classification supervisée → 1D-CNN → prévision Prophet",
    approachAr: "التجميع → كشف الشذوذ → تصنيف مُشرف → 1D-CNN → توقع Prophet",
  },
  {
    id: "supply-chain",
    title: "DataCo Smart Supply Chain ML",
    titleFr: "ML sur la Chaîne d'Approvisionnement DataCo",
    titleAr: "تعلم آلة على سلسلة إمداد DataCo",
    description: "Leakage-free ML on 180,519 orders. LightGBM AUC 0.8563 (late delivery). Gradient Boosting R²=0.9996 (profit regression). Removed post-fulfillment columns that inflate to AUC=1.0 in most published solutions.",
    descriptionFr: "ML sans fuite sur 180 519 commandes. LightGBM AUC 0,8563 (livraison tardive). Gradient Boosting R²=0,9996 (régression profit). Suppression des colonnes post-exécution qui gonflent à AUC=1,0 dans la plupart des solutions publiées.",
    descriptionAr: "ML بدون تسرب على 180,519 طلباً. LightGBM AUC 0.8563 (التسليم المتأخر). Gradient Boosting R²=0.9996 (انحدار الربح). إزالة الأعمدة التي تظهر بعد التنفيذ والتي ترفع AUC=1.0 في معظم الحلول المنشورة.",
    longDescription: `Advanced ML on DataCo supply chain with critical leakage fix.

**Dataset**
- 180,519 orders, 53 raw features → 44 after leakage audit

**Leakage Audit — Removed Columns**
| Column | Why Removed |
|--------|------------|
| Days for shipping (real) | Actual outcome — not at prediction time |
| Delivery Status | Direct label encoding of target |
| Benefit per order | Post-fulfillment computation |
| Sales per customer | Aggregated post-delivery |

Without leakage: AUC ~0.86. With leakage: AUC = 1.0 (most published results — invalid).

**Task 1: Late Delivery Classification**
| Model | Accuracy | AUC |
|-------|----------|-----|
| Logistic Regression | 72.2% | 0.790 |
| Random Forest | 73.8% | 0.871 |
| XGBoost | 74.5% | 0.859 |
| **LightGBM** | **74.5%** | **0.856** |

5-fold CV: RF 0.862±0.001 | XGB 0.853±0.002 | LGB 0.851±0.002

**Task 2: Order Profit Regression**
| Model | RMSE | R² |
|-------|------|----|
| Ridge/Linear | 56.5 | 0.706 |
| XGBoost | 3.60 | 0.9988 |
| LightGBM | 4.52 | 0.9981 |
| **Gradient Boosting** | **2.04** | **0.9996** |

**Engineered Features** (order-placement time only)
order_month, day_of_week, hour, quarter, discount_rate, price_band`,
    longDescriptionFr: `ML avancé sur la chaîne d'approvisionnement DataCo avec correction critique de fuite.

**Jeu de données**
- 180 519 commandes, 53 features brutes → 44 après audit de fuite

**Audit de Fuite — Colonnes Supprimées**
| Colonne | Raison de Suppression |
|--------|------------|
| Days for shipping (real) | Résultat réel — non disponible au moment de la prédiction |
| Delivery Status | Encodage direct du label cible |
| Benefit per order | Calcul post-exécution |
| Sales per customer | Agrégé post-livraison |

Sans fuite : AUC ~0,86. Avec fuite : AUC = 1,0 (plupart des résultats publiés — invalide).

**Tâche 1 : Classification Livraison Tardive**
| Modèle | Précision | AUC |
|-------|----------|-----|
| Régression Logistique | 72,2% | 0,790 |
| Random Forest | 73,8% | 0,871 |
| XGBoost | 74,5% | 0,859 |
| **LightGBM** | **74,5%** | **0,856** |

CV 5 plis : RF 0,862±0,001 | XGB 0,853±0,002 | LGB 0,851±0,002

**Tâche 2 : Régression Profit Commande**
| Modèle | RMSE | R² |
|-------|------|----|
| Ridge/Linéaire | 56,5 | 0,706 |
| XGBoost | 3,60 | 0,9988 |
| LightGBM | 4,52 | 0,9981 |
| **Gradient Boosting** | **2,04** | **0,9996** |

**Features Engineerées** (uniquement au moment de la commande)
order_month, day_of_week, hour, quarter, discount_rate, price_band`,
    longDescriptionAr: `تحليل ML متقدم على سلسلة إمداد DataCo مع إصلاح حيوي لتسرب البيانات.

**مجموعة البيانات**
- 180,519 طلباً، 53 ميزة خام → 44 بعد مراجعة التسرب

**مراجعة التسرب — الأعمدة المحذوفة**
| العمود | سبب الحذف |
|--------|------------|
| أيام الشحن (الفعلي) | نتيجة فعلية — غير متاحة وقت التنبؤ |
| حالة التسليم | تشفير مباشر للهدف |
| الفائدة لكل طلب | حساب ما بعد التنفيذ |
| مبيعات لكل عميل | مجمّع بعد التسليم |

بدون تسرب: AUC ~0.86. مع تسرب: AUC = 1.0 (معظم النتائج المنشورة — غير صالحة).

**المهمة 1: تصنيف التسليم المتأخر**
LightGBM الأفضل: دقة **74.5%**، AUC **0.856**. CV 5 أضعاف: 0.851±0.002

**المهمة 2: انحدار ربح الطلب**
Gradient Boosting الأفضل: RMSE **2.04**، R² **0.9996**

**الميزات المهندَسة** (وقت الطلب فقط)
order_month، day_of_week، hour، quarter، discount_rate، price_band`,
    category: ["timeseries"],
    tags: ["XGBoost", "LightGBM", "Supply Chain", "Leakage-Free", "Classification", "Regression"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/dataco-smart-supply-chain-advanced-ml-analysis",
    featured: false,
    metrics: "Classification AUC: 0.8563 | Regression R²: 0.9996",
    dataset: "DataCo SCMS: 180,519 records (leakage-audited)",
    datasetFr: "DataCo SCMS : 180 519 enregistrements (après audit de fuite)",
    datasetAr: "DataCo SCMS: 180,519 سجلاً (بعد مراجعة التسرب)",
    results: [
      { label: "LightGBM AUC (class)", value: "0.8563" },
      { label: "GB R² (regression)", value: "0.9996" },
      { label: "GB RMSE (profit $)", value: "2.04" },
      { label: "5-fold CV RF AUC", value: "0.862 ± 0.001" },
    ],
    techStack: ["Python", "XGBoost 3.2.0", "LightGBM 4.6.0", "Gradient Boosting", "Pandas"],
    approach: "Leakage audit → dual-task (classification + regression) → 5-fold CV validation",
    approachFr: "Audit de fuite → double tâche (classification + régression) → validation CV à 5 plis",
    approachAr: "مراجعة التسرب → مهمة مزدوجة (تصنيف + انحدار) → تحقق CV بـ 5 أضعاف",
  },
  {
    id: "linkedin-jobs",
    title: "LinkedIn Job Postings ML Pipeline",
    titleFr: "Pipeline ML sur Offres d'Emploi LinkedIn",
    titleAr: "خط أنابيب ML على إعلانات وظائف LinkedIn",
    description: "Full ML pipeline on 123,849 LinkedIn postings (2023–2024). Salary prediction, skills demand analysis (213K pairs), NLP on descriptions. 7 CSV files joined. Pay-period normalization (hourly→yearly).",
    descriptionFr: "Pipeline ML complet sur 123 849 offres LinkedIn (2023–2024). Prédiction de salaire, analyse de demande de compétences (213K paires), NLP sur descriptions. 7 fichiers CSV joints. Normalisation des périodes de paye (horaire→annuel).",
    descriptionAr: "خط أنابيب ML كامل على 123,849 إعلان وظيفي من LinkedIn (2023-2024). التنبؤ بالراتب، تحليل الطلب على المهارات (213K زوجاً)، NLP على الأوصاف. 7 ملفات CSV مرتبطة. تطبيع فترات الدفع (ساعي→سنوي).",
    longDescription: `End-to-end ML pipeline on a large LinkedIn dataset with rich relational structure.

**Dataset (7 files joined)**
| File | Rows | Info |
|------|------|------|
| postings.csv | 123,849 | Title, company, description, location |
| companies.csv | 24,473 | Size, industry, followers |
| salaries.csv | 40,785 | Ranges (32.9% posting coverage) |
| job_skills.csv | 213,768 | Skill→job mappings |

**Salary Coverage — Pay Period Normalization**
- Yearly: 23K (direct)
- Hourly: 16K (× 2,080 → yearly)
- Monthly: 539 (× 12)
- Weekly: 180 (× 52)

**Task 1: Salary Prediction (Regression)**
Features: pay-period normalization, TF-IDF on descriptions, company size, seniority from title.
Key predictors: job title, company size, location, required skills, seniority.

**Task 2: Skills Demand Analysis**
213,768 skill-job pairs → frequency + TF-IDF weighting.
Top in-demand: Python, SQL, Communication, Project Management, Machine Learning.
Fast-growing 2023–2024: LLMs, Prompt Engineering, Vector Databases.

**Task 3: Market Insights**
- 85%+ postings concentrated in US/Europe top cities
- Data Science premium: 3–4× vs Operations base salary
- Remote premium: +$12K average for fully remote roles

**Key Caveat**
Only 32.9% of postings have salary data — selection bias makes model non-representative of full market.`,
    longDescriptionFr: `Pipeline ML bout-en-bout sur un grand dataset LinkedIn avec une structure relationnelle riche.

**Jeu de données (7 fichiers joints)**
| Fichier | Lignes | Info |
|------|------|------|
| postings.csv | 123 849 | Titre, entreprise, description, lieu |
| companies.csv | 24 473 | Taille, industrie, abonnés |
| salaries.csv | 40 785 | Fourchettes (32,9% de couverture des offres) |
| job_skills.csv | 213 768 | Correspondances compétence→emploi |

**Normalisation des Périodes de Paye**
- Annuel : 23K (direct)
- Horaire : 16K (× 2 080 → annuel)
- Mensuel : 539 (× 12)
- Hebdomadaire : 180 (× 52)

**Tâche 1 : Prédiction de Salaire (Régression)**
Features : normalisation période de paye, TF-IDF sur descriptions, taille entreprise, séniorité depuis le titre.
Principaux prédicteurs : titre de poste, taille entreprise, lieu, compétences requises, séniorité.

**Tâche 2 : Analyse de la Demande en Compétences**
213 768 paires compétence-emploi → fréquence + pondération TF-IDF.
Les plus demandées : Python, SQL, Communication, Gestion de Projet, Machine Learning.
En forte croissance 2023–2024 : LLMs, Prompt Engineering, Bases de Données Vectorielles.

**Tâche 3 : Insights Marché**
- Plus de 85% des offres concentrées dans les grandes villes US/Europe
- Prime Data Science : 3–4× vs salaire de base Opérations
- Prime télétravail : +12 000 $ en moyenne pour les postes totalement à distance

**Mise en Garde Importante**
Seulement 32,9% des offres ont des données salariales — le biais de sélection rend le modèle non représentatif du marché global.`,
    longDescriptionAr: `خط أنابيب ML من النهاية إلى النهاية على مجموعة بيانات LinkedIn كبيرة مع بنية علائقية غنية.

**مجموعة البيانات (7 ملفات مرتبطة)**
| الملف | الصفوف | المعلومات |
|------|------|------|
| postings.csv | 123,849 | العنوان، الشركة، الوصف، الموقع |
| companies.csv | 24,473 | الحجم، الصناعة، المتابعون |
| salaries.csv | 40,785 | النطاقات (تغطية 32.9%) |
| job_skills.csv | 213,768 | تعيينات المهارة→الوظيفة |

**تطبيع فترات الدفع**
سنوي: 23K | ساعي: 16K (×2,080) | شهري: 539 (×12) | أسبوعي: 180 (×52)

**المهمة 1: التنبؤ بالراتب** — TF-IDF + حجم الشركة + الأقدمية من العنوان

**المهمة 2: تحليل الطلب على المهارات** — 213,768 زوج → الأعلى طلباً: Python، SQL، التواصل، إدارة المشاريع، ML

**المهمة 3: رؤى السوق** — 85%+ الوظائف في أكبر مدن US/أوروبا. علاوة Data Science: 3-4× مقارنة بالعمليات.

**تحذير مهم**
32.9% فقط من الوظائف لديها بيانات راتب — تحيز الاختيار يجعل النموذج غير تمثيلي للسوق الكامل.`,
    category: ["nlp"],
    tags: ["NLP", "Salary Prediction", "XGBoost", "LightGBM", "Labor Market", "TF-IDF"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/linkedin-job-postings-2023-2024-full-ml-pipelin",
    featured: false,
    dataset: "123,849 LinkedIn job postings, 7 relational CSV files",
    datasetFr: "123 849 offres d'emploi LinkedIn, 7 fichiers CSV relationnels",
    datasetAr: "123,849 إعلان وظيفي من LinkedIn، 7 ملفات CSV ترابطية",
    techStack: ["Python", "Pandas", "Scikit-learn", "XGBoost", "LightGBM", "TF-IDF", "NLTK"],
    approach: "7-file join → NLP feature extraction → salary regression + skills demand analysis",
    approachFr: "Jointure 7 fichiers → extraction de caractéristiques NLP → régression salariale + analyse de demande de compétences",
    approachAr: "دمج 7 ملفات → استخراج ميزات NLP → انحدار الراتب + تحليل الطلب على المهارات",
  },
  {
    id: "game-ai",
    title: "Advanced Game Playing — Deep RL",
    titleFr: "Jeux Avancés — Deep RL",
    titleAr: "ألعاب متقدمة — التعلم التعزيزي العميق",
    description: "Double Dueling DQN + PER (SumTree). CartPole-v1 solved ep 300 (MA-100=441.1, best eval 497.2/500). LunarLander-v3 solved ep 207 (MA-100=202). 134,275-param network with LayerNorm.",
    descriptionFr: "Double Dueling DQN + PER (SumTree). CartPole-v1 résolu à l'épisode 300 (MA-100=441,1, meilleure éval 497,2/500). LunarLander-v3 résolu à l'épisode 207 (MA-100=202). Réseau de 134 275 paramètres avec LayerNorm.",
    descriptionAr: "Double Dueling DQN + PER (SumTree). CartPole-v1 محلول في الحلقة 300 (MA-100=441.1، أفضل تقييم 497.2/500). LunarLander-v3 محلول في الحلقة 207 (MA-100=202). شبكة بـ 134,275 معامل مع LayerNorm.",
    longDescription: `State-of-the-art Deep Q-Network combining all 4 modern DRL improvements.

**Dueling DQN Architecture (134,275 params)**
\`\`\`
Input → Linear(256) → LayerNorm → ReLU
→ Value stream:     Linear(256→128) → ReLU → Linear(128→1)      = V(s)
→ Advantage stream: Linear(256→128) → ReLU → Linear(128→n_act)  = A(s,a)
→ Q(s,a) = V(s) + (A(s,a) − mean(A(s,a)))
\`\`\`

**4 Techniques Combined**
| Technique | What It Fixes |
|-----------|-------------|
| Double DQN | Q-target overestimation bias |
| Dueling DQN | Separate V(s) and A(s,a) estimation |
| PER (SumTree) | Sample high-TD-error transitions more often |
| Soft target updates τ=0.005 | Stable Q-target convergence |

**Results**
| Environment | Metric | Value |
|-------------|--------|-------|
| CartPole-v1 | Solved at episode | **300** |
| CartPole-v1 | MA-100 reward | 441.1 / 500 |
| CartPole-v1 | Best eval (20 ep) | **497.2 ± 12.2** |
| LunarLander-v3 | Solved at episode | **207** |
| LunarLander-v3 | MA-100 reward | 202 (threshold: 200) |

**PER SumTree**
Binary segment tree: O(log n) priority sampling and updates. β anneals 0.4→1.0 over training to correct importance-sampling bias.

**Hyperparameters**
lr=1e-4, γ=0.99, τ=0.005, buffer=100K, batch=64, ε: 1.0→0.01`,
    longDescriptionFr: `Deep Q-Network à la pointe combinant les 4 améliorations DRL modernes.

**Architecture Dueling DQN (134 275 paramètres)**
\`\`\`
Entrée → Linear(256) → LayerNorm → ReLU
→ Flux valeur :     Linear(256→128) → ReLU → Linear(128→1)      = V(s)
→ Flux avantage : Linear(256→128) → ReLU → Linear(128→n_act)  = A(s,a)
→ Q(s,a) = V(s) + (A(s,a) − moyenne(A(s,a)))
\`\`\`

**4 Techniques Combinées**
| Technique | Ce qu'elle corrige |
|-----------|-------------|
| Double DQN | Biais de surestimation des Q-cibles |
| Dueling DQN | Estimation séparée V(s) et A(s,a) |
| PER (SumTree) | Échantillonner plus souvent les transitions à fort TD-error |
| Mises à jour douces τ=0,005 | Convergence stable des Q-cibles |

**Résultats**
| Environnement | Métrique | Valeur |
|-------------|--------|-------|
| CartPole-v1 | Résolu à l'épisode | **300** |
| CartPole-v1 | Récompense MA-100 | 441,1 / 500 |
| CartPole-v1 | Meilleure éval (20 ep) | **497,2 ± 12,2** |
| LunarLander-v3 | Résolu à l'épisode | **207** |
| LunarLander-v3 | Récompense MA-100 | 202 (seuil : 200) |

**PER SumTree**
Arbre binaire de segments : échantillonnage et mises à jour de priorité en O(log n). β passe de 0,4 à 1,0 pendant l'entraînement pour corriger le biais d'importance-sampling.

**Hyperparamètres**
lr=1e-4, γ=0,99, τ=0,005, buffer=100K, batch=64, ε : 1,0→0,01`,
    longDescriptionAr: `شبكة Q العميقة المتقدمة الجامعة لجميع التحسينات الأربعة الحديثة لـ DRL.

**بنية Dueling DQN (134,275 معامل)**
\`\`\`
مدخل → Linear(256) → LayerNorm → ReLU
→ تدفق القيمة:    Linear(256→128) → ReLU → Linear(128→1)      = V(s)
→ تدفق الميزة: Linear(256→128) → ReLU → Linear(128→n_act)  = A(s,a)
→ Q(s,a) = V(s) + (A(s,a) − متوسط(A(s,a)))
\`\`\`

**التقنيات الأربع المدمجة**
| التقنية | ما تُصلحه |
|-----------|-------------|
| Double DQN | تحيز المبالغة في تقدير Q-target |
| Dueling DQN | تقدير منفصل لـ V(s) و A(s,a) |
| PER (SumTree) | أخذ عينات من الانتقالات عالية TD-error أكثر |
| تحديثات ناعمة τ=0.005 | تقارب مستقر لـ Q-target |

**النتائج**
| البيئة | المقياس | القيمة |
|-------------|--------|-------|
| CartPole-v1 | حُلَّ في الحلقة | **300** |
| CartPole-v1 | MA-100 | 441.1 / 500 |
| CartPole-v1 | أفضل تقييم | **497.2 ± 12.2** |
| LunarLander-v3 | حُلَّ في الحلقة | **207** |
| LunarLander-v3 | MA-100 | 202 (عتبة: 200) |

**PER SumTree**
شجرة مقاطع ثنائية: أخذ عينات وتحديثات الأولوية بـ O(log n). β تنتقل من 0.4 إلى 1.0 خلال التدريب.

**المعاملات الفائقة**
lr=1e-4، γ=0.99، τ=0.005، buffer=100K، batch=64، ε: 1.0→0.01`,
    category: ["rl"],
    tags: ["Double DQN", "Dueling DQN", "PER", "SumTree", "CartPole", "LunarLander", "Gymnasium"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/advanced-game-playing-model",
    featured: false,
    metrics: "CartPole solved ep 300 | LunarLander solved ep 207",
    dataset: "CartPole-v1 + LunarLander-v3 (OpenAI Gymnasium)",
    datasetFr: "CartPole-v1 + LunarLander-v3 (OpenAI Gymnasium)",
    datasetAr: "CartPole-v1 + LunarLander-v3 (OpenAI Gymnasium)",
    results: [
      { label: "CartPole solved", value: "Episode 300" },
      { label: "CartPole best eval", value: "497.2 / 500" },
      { label: "LunarLander solved", value: "Episode 207" },
      { label: "Network params", value: "134,275" },
    ],
    techStack: ["Python", "PyTorch 2.10", "Gymnasium 1.2.0", "CUDA", "NumPy"],
    approach: "Double + Dueling DQN + PER SumTree + soft target updates — all 4 improvements",
    approachFr: "Double + Dueling DQN + PER SumTree + mises à jour douces des cibles — les 4 améliorations",
    approachAr: "Double + Dueling DQN + PER SumTree + تحديثات ناعمة للأهداف — جميع التحسينات الأربعة",
  },
  {
    id: "network-security",
    title: "IoT Network Security Anomaly Detection",
    titleFr: "Détection d'Anomalies Réseau IoT",
    titleAr: "كشف شذوذات أمن شبكات إنترنت الأشياء",
    description: "Embedded system intrusion detection with extreme imbalance (10% anomalies). BiLSTM+Attention: PR-AUC=0.186, Recall=33.3%. 5× augmentation (Gaussian/MixUp/masking). MC-Dropout uncertainty. Focal loss.",
    descriptionFr: "Détection d'intrusion sur systèmes embarqués avec déséquilibre extrême (10% anomalies). BiLSTM+Attention : PR-AUC=0,186, Rappel=33,3%. Augmentation 5× (Gaussien/MixUp/masquage). Incertitude MC-Dropout. Perte focale.",
    descriptionAr: "كشف اختراق الأنظمة المدمجة مع عدم توازن شديد (10% شذوذ). BiLSTM+Attention: PR-AUC=0.186، Recall=33.3%. تضخيم 5× (Gaussian/MixUp/masking). عدم يقين MC-Dropout. خسارة بؤرية.",
    longDescription: `Anomaly detection for IoT network intrusion with extreme class imbalance.

**Dataset**
- 1,000 records, 14 features, **90% normal / 10% anomaly** (100 anomaly examples)
- Features: packet size, inter-arrival time, spectral entropy, TCP flags, traffic intensity

**Pipeline**
1. Random Forest feature selection → 14 key features
2. ADASYN oversampling (100 → 614 minority samples)
3. **5× data augmentation** → 6,220 total training samples:
   - Gaussian noise injection
   - Feature masking (cutout)
   - MixUp (interpolate between samples)
   - Class-conditional noise
4. Focal loss (γ=2.0, α=0.25) + cosine LR decay

**Architecture Comparison**
| Model | PR-AUC | F1 | Recall |
|-------|--------|-----|--------|
| Random Forest | 0.140 | 0.21 | 0.28 |
| XGBoost | 0.160 | 0.22 | 0.31 |
| Residual DNN | 0.172 | 0.22 | 0.30 |
| Dilated CNN | 0.165 | 0.21 | 0.29 |
| **BiLSTM+Attention** | **0.186** | **0.238** | **0.333** |

5-fold CV BiLSTM: PR-AUC = 0.1456 ± 0.0302

**MC-Dropout Uncertainty**
30 forward passes → mean + std per prediction. High-std samples flagged for manual review.

**Honest Assessment**
PR-AUC 0.186 is modest. 100 anomaly examples are genuinely insufficient. In production, active learning or semi-supervised approaches would be more effective than supervised models on this dataset size.`,
    longDescriptionFr: `Détection d'anomalies pour les intrusions réseau IoT avec déséquilibre de classes extrême.

**Jeu de données**
- 1 000 enregistrements, 14 features, **90% normal / 10% anomalie** (100 exemples d'anomalie)
- Features : taille de paquet, temps inter-arrivée, entropie spectrale, drapeaux TCP, intensité du trafic

**Pipeline**
1. Sélection de features par Random Forest → 14 features clés
2. Sur-échantillonnage ADASYN (100 → 614 échantillons minoritaires)
3. **Augmentation de données 5×** → 6 220 échantillons d'entraînement au total :
   - Injection de bruit gaussien
   - Masquage de features (cutout)
   - MixUp (interpolation entre échantillons)
   - Bruit conditionnel par classe
4. Perte focale (γ=2,0, α=0,25) + décroissance LR cosinus

**Comparaison des Architectures**
| Modèle | PR-AUC | F1 | Rappel |
|-------|--------|-----|--------|
| Random Forest | 0,140 | 0,21 | 0,28 |
| XGBoost | 0,160 | 0,22 | 0,31 |
| DNN Résiduel | 0,172 | 0,22 | 0,30 |
| CNN Dilaté | 0,165 | 0,21 | 0,29 |
| **BiLSTM+Attention** | **0,186** | **0,238** | **0,333** |

CV 5 plis BiLSTM : PR-AUC = 0,1456 ± 0,0302

**Incertitude MC-Dropout**
30 passes forward → moyenne + écart-type par prédiction. Les échantillons à fort écart-type sont marqués pour révision manuelle.

**Évaluation Honnête**
PR-AUC 0,186 est modeste. 100 exemples d'anomalie sont insuffisants. En production, l'apprentissage actif ou les approches semi-supervisées seraient plus efficaces sur cette taille de dataset.`,
    longDescriptionAr: `كشف الشذوذات لاختراق شبكات إنترنت الأشياء مع عدم توازن حاد في الفئات.

**مجموعة البيانات**
- 1,000 سجل، 14 ميزة، **90% طبيعي / 10% شذوذ** (100 مثال شذوذ)
- الميزات: حجم الحزمة، وقت الوصول، الانتروبيا الطيفية، أعلام TCP

**خط الأنابيب**
1. اختيار ميزات بـ Random Forest → 14 ميزة رئيسية
2. ADASYN (100 → 614 عينة أقلية)
3. **تضخيم بيانات 5×** → 6,220 عينة إجمالية:
   - ضجيج غاوسي، حجب الميزات، MixUp، ضجيج مشروط بالفئة
4. خسارة بؤرية (γ=2.0، α=0.25) + تحلل LR كوسينوسي

**مقارنة البنى**
| النموذج | PR-AUC | F1 | الاسترجاع |
|-------|--------|-----|--------|
| Random Forest | 0.140 | 0.21 | 0.28 |
| XGBoost | 0.160 | 0.22 | 0.31 |
| DNN متبقي | 0.172 | 0.22 | 0.30 |
| CNN مُوسَّع | 0.165 | 0.21 | 0.29 |
| **BiLSTM+Attention** | **0.186** | **0.238** | **0.333** |

**عدم يقين MC-Dropout**
30 تمريرة للأمام → متوسط + انحراف معياري. العينات عالية الانحراف مُعلَّمة للمراجعة.

**تقييم صادق**
PR-AUC 0.186 متواضع. 100 مثال شذوذ غير كافٍ حقاً. في الإنتاج، التعلم النشط أو الأساليب شبه المُشرفة أكثر فعالية.`,
    category: ["fraud"],
    tags: ["BiLSTM", "Anomaly Detection", "IoT", "Focal Loss", "MC-Dropout", "ADASYN", "Cybersecurity"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/embedded-system-network-security-anomaly-detecti",
    featured: false,
    metrics: "BiLSTM PR-AUC: 0.186 | Recall: 33.3%",
    dataset: "1,000 IoT network records — 90/10 imbalance",
    datasetFr: "1 000 enregistrements réseau IoT — déséquilibre 90/10",
    datasetAr: "1,000 سجل شبكة إنترنت الأشياء — عدم توازن 90/10",
    results: [
      { label: "BiLSTM PR-AUC", value: "0.186" },
      { label: "BiLSTM Recall", value: "33.3%" },
      { label: "Augmented samples", value: "6,220 (5×)" },
      { label: "MC-Dropout passes", value: "30" },
    ],
    techStack: ["Python", "PyTorch", "BiLSTM+Attention", "ADASYN", "Focal Loss", "MC-Dropout"],
    approach: "ADASYN + 5× augmentation → focal loss DL → MC-Dropout uncertainty",
    approachFr: "ADASYN + augmentation 5× → perte focale DL → incertitude MC-Dropout",
    approachAr: "ADASYN + تضخيم 5× → خسارة بؤرية DL → عدم يقين MC-Dropout",
  },
  {
    id: "poetry-gen",
    title: "Poetry Generation — BERT / GPT-2 / T5 Fine-tuned",
    titleFr: "Génération de Poésie — BERT / GPT-2 / T5 Fine-tuné",
    titleAr: "توليد الشعر — BERT / GPT-2 / T5 مضبوط دقيقاً",
    description: "Fine-tuned BERT, GPT-2, and T5 on the Poetry Foundation corpus for creative poem generation. 10 saved checkpoints. Vocabulary diversity analysis per poet. Beam search + temperature sampling. Model dashboard comparing all 3 architectures.",
    descriptionFr: "Fine-tuning de BERT, GPT-2 et T5 sur le corpus Poetry Foundation pour la génération créative de poèmes. 10 checkpoints sauvegardés. Analyse de diversité lexicale par poète. Beam search + sampling par température. Dashboard comparant les 3 architectures.",
    descriptionAr: "ضبط دقيق لـ BERT وGPT-2 وT5 على مجموعة شعرية للتوليد الإبداعي. 10 نقاط تفتيش محفوظة. تحليل تنوع المفردات لكل شاعر. Beam search + عينات درجة الحرارة. لوحة تقارن جميع المعماريات الـ 3.",
    longDescription: `Multi-model poetry generation pipeline fine-tuning three transformer architectures on the Poetry Foundation corpus.

**Dataset — Poetry Foundation**
- Hundreds of poets across multiple eras and styles
- Variable-length poems (50–500 tokens typical)
- Preprocessing: special tokens [POEM_START] / [POEM_END], tokenizer per model

**Three Transformer Architectures Fine-tuned**
| Model | Type | Checkpoints | Approach |
|-------|------|-------------|---------|
| **BERT** | Encoder (masked LM) | 3 (ep 2103, 4206, 6309) | Masked token prediction → fill-in-the-blank generation |
| **GPT-2** | Decoder (causal LM) | 3 (step 500, 1000, 1206) | Left-to-right auto-regressive generation |
| **T5** | Encoder-Decoder (seq2seq) | 4 (step 188–752) | Prompt-conditioned generation ("Write a poem about: ...") |

**All 10 checkpoints saved** with full weights (model.safetensors), tokenizer, and training state.

**Generation Strategies (GPT-2 / T5)**
| Strategy | Output Style |
|----------|-------------|
| Greedy decoding | Deterministic, often repetitive |
| Beam search (k=4) | More coherent, structured |
| Temperature sampling (T=0.7) | Creative but controlled |
| Top-k sampling (k=50) | Best balance of quality + diversity |

**Vocabulary Analysis**
Word frequency distribution and per-poet vocabulary coverage — experimental/modernist poets show highest unique token diversity. Shakespeare-style formal diction concentrates into fewer high-frequency tokens.

**Generated Output**
- GPT-2 fine-tuning produces most fluid free verse
- T5 conditional generation handles style/topic prompts best
- BERT masked generation useful for poetic constraint satisfaction (fill specific positions)
- Lower temperature → classical-sounding meter; higher → surreal imagery`,
    longDescriptionFr: `Pipeline de génération de poésie multi-modèles fine-tunant trois architectures transformer sur le corpus Poetry Foundation.

**Jeu de données — Poetry Foundation**
- Des centaines de poètes couvrant plusieurs époques et styles
- Poèmes de longueur variable (50–500 tokens typiquement)
- Prétraitement : tokens spéciaux [POEM_START] / [POEM_END], tokenizer par modèle

**Trois Architectures Transformer Fine-tunées**
| Modèle | Type | Checkpoints | Approche |
|-------|------|-------------|---------|
| **BERT** | Encodeur (LM masqué) | 3 (ép. 2103, 4206, 6309) | Prédiction de token masqué → génération par remplissage |
| **GPT-2** | Décodeur (LM causal) | 3 (étape 500, 1000, 1206) | Génération auto-régressive gauche→droite |
| **T5** | Encodeur-Décodeur (seq2seq) | 4 (étape 188–752) | Génération conditionnée par prompt |

**Les 10 checkpoints sauvegardés** avec poids complets (model.safetensors), tokenizer et état d'entraînement.

**Stratégies de Génération (GPT-2 / T5)**
| Stratégie | Style de Sortie |
|----------|-------------|
| Décodage glouton | Déterministe, souvent répétitif |
| Beam search (k=4) | Plus cohérent, structuré |
| Sampling par température (T=0,7) | Créatif mais contrôlé |
| Sampling top-k (k=50) | Meilleur équilibre qualité + diversité |

**Analyse du Vocabulaire**
Distribution des fréquences de mots par poète — les poètes expérimentaux/modernistes montrent la plus haute diversité de tokens uniques. La diction formelle shakespearienne se concentre dans moins de tokens à haute fréquence.

**Sorties Générées**
- Le fine-tuning GPT-2 produit les vers libres les plus fluides
- La génération conditionnelle T5 gère mieux les prompts style/sujet
- La génération masquée BERT est utile pour la satisfaction de contraintes poétiques
- Température basse → mètre de style classique ; haute → imagerie surréaliste`,
    longDescriptionAr: `خط أنابيب توليد الشعر متعدد النماذج الذي يضبط بدقة ثلاث بنى محول على مجموعة Poetry Foundation.

**مجموعة البيانات**
مئات الشعراء عبر حقب وأساليب متعددة. رموز خاصة [POEM_START] / [POEM_END]. مُجزِّء خاص لكل نموذج.

**ثلاث بنى محول مضبوطة بدقة**
| النموذج | النوع | نقاط التفتيش | الأسلوب |
|-------|------|-------------|---------|
| **BERT** | مشفِّر (LM مقنّع) | 3 | التنبؤ بالرمز المقنّع → توليد بالملء |
| **GPT-2** | مفكِّك (LM سببي) | 3 | توليد ذاتي التراجع يسار→يمين |
| **T5** | مشفِّر-مفكِّك (seq2seq) | 4 | توليد مشروط بالتوجيه |

**10 نقاط تفتيش محفوظة** مع أوزان كاملة، مُجزِّء وحالة تدريب.

**استراتيجيات التوليد**
| الاستراتيجية | أسلوب المخرجات |
|----------|-------------|
| فك تشفير جشع | حتمي، متكرر أحياناً |
| Beam search (k=4) | أكثر تماسكاً |
| أخذ عينات بدرجة الحرارة (T=0.7) | إبداعي ومُتحكَّم به |
| أخذ عينات top-k (k=50) | أفضل توازن جودة + تنوع |

GPT-2 يُنتج أفضل شعر حر. T5 يتعامل أفضل مع التوجيهات الموضوعية. درجة حرارة منخفضة → وزن كلاسيكي؛ مرتفعة → صور سريالية.`,
    category: ["nlp", "genai"],
    tags: ["GPT-2", "BERT", "T5", "Fine-tuning", "Poetry", "HuggingFace", "Beam Search", "Language Model"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/poetry-generation-poetry-foundation-dataset",
    featured: false,
    dataset: "Poetry Foundation: 10K+ poems, diverse eras and styles",
    datasetFr: "Poetry Foundation : plus de 10 000 poèmes, diverses époques et styles",
    datasetAr: "مؤسسة الشعر: أكثر من 10,000 قصيدة، حقب وأساليب متنوعة",
    results: [
      { label: "Models fine-tuned", value: "3 (BERT/GPT-2/T5)" },
      { label: "Saved checkpoints", value: "10" },
      { label: "Generation approach", value: "Beam + temperature" },
      { label: "T5 conditioning", value: "Prompt-based" },
    ],
    techStack: ["Python", "PyTorch", "HuggingFace Transformers", "GPT-2", "BERT", "T5", "Tokenizers"],
    approach: "Fine-tune BERT (masked LM) + GPT-2 (causal) + T5 (seq2seq) on Poetry Foundation corpus",
    approachFr: "Fine-tuning BERT (LM masqué) + GPT-2 (causal) + T5 (seq2seq) sur le corpus Poetry Foundation",
    approachAr: "ضبط دقيق لـ BERT (LM مقنّع) + GPT-2 (سببي) + T5 (seq2seq) على مجموعة الشعر",
  },
  {
    id: "handwritten-recognition",
    title: "Handwritten Name Recognition",
    titleFr: "Reconnaissance de Noms Manuscrits",
    titleAr: "التعرف على الأسماء المكتوبة بخط اليد",
    description: "OCR benchmark on 66K images. TrOCR (ViT+GPT-2, 334M) best: CER=0.0481, 80% exact-match. CRNN-ResNet34: CER=0.0502. AMP + torch.compile + gradient accumulation optimizations.",
    descriptionFr: "Benchmark OCR sur 66K images. TrOCR (ViT+GPT-2, 334M) meilleur : CER=0,0481, 80% de correspondance exacte. CRNN-ResNet34 : CER=0,0502. Optimisations AMP + torch.compile + accumulation de gradients.",
    descriptionAr: "معيار OCR على 66K صورة. TrOCR (ViT+GPT-2، 334M) الأفضل: CER=0.0481، 80% تطابق تام. CRNN-ResNet34: CER=0.0502. تحسينات AMP + torch.compile + تراكم التدرجات.",
    longDescription: `Multi-model OCR comparison for unconstrained handwritten name recognition.

**Dataset**
- 66K train / 8.2K val / 41K test images (64×256 grayscale)
- 44-character vocabulary (alphanumeric + special chars)
- 20% subset used for experiments

**Architecture Comparison**
| Model | CER ↓ | Exact Match | Speed |
|-------|-------|-------------|-------|
| CRNN-EfficientNet | 0.1235 | — | Fastest |
| CRNN-ResNet18 | — | — | ~105s/ep |
| CRNN-ResNet34 | **0.0502** | — | ~251s/ep |
| **TrOCR** | **0.0481** | **80%** | 34.9 min total |

**CRNN** (CNN + BiLSTM + CTC)
\`\`\`
ResNet34 backbone → BiLSTM(2×256) → CTC Loss
→ Greedy / Beam search (4 beams) decoding
\`\`\`

**TrOCR** (ViT + GPT-2, 334M params)
Fine-tuned via HuggingFace Trainer, 10 epochs, 20% data subset.

**Training Optimizations**
| Technique | Impact |
|-----------|--------|
| Mixed precision (AMP) | 2× speedup, -50% memory |
| torch.compile | +30% speedup |
| Gradient accumulation (4 steps) | -75% effective batch memory |
| Image caching (1GB memmap) | 3× data loading speed |

**CER vs Exact Match**
CER=0.0481 translates to 80% exact-match accuracy — the full name must match character-for-character. Even a single wrong character counts as failure, which is why exact match is much lower than CER suggests.`,
    longDescriptionFr: `Comparaison multi-modèles OCR pour la reconnaissance de noms manuscrits non contraints.

**Jeu de données**
- 66K entraînement / 8,2K validation / 41K test (niveaux de gris 64×256)
- Vocabulaire de 44 caractères (alphanumérique + caractères spéciaux)
- Sous-ensemble de 20% utilisé pour les expériences

**Comparaison des Architectures**
| Modèle | CER ↓ | Correspondance Exacte | Vitesse |
|-------|-------|-------------|-------|
| CRNN-EfficientNet | 0,1235 | — | Plus rapide |
| CRNN-ResNet18 | — | — | ~105s/ép. |
| CRNN-ResNet34 | **0,0502** | — | ~251s/ép. |
| **TrOCR** | **0,0481** | **80%** | 34,9 min total |

**CRNN** (CNN + BiLSTM + CTC)
\`\`\`
Backbone ResNet34 → BiLSTM(2×256) → Perte CTC
→ Décodage glouton / Beam search (4 faisceaux)
\`\`\`

**TrOCR** (ViT + GPT-2, 334M paramètres)
Fine-tuné via HuggingFace Trainer, 10 époques, sous-ensemble 20%.

**Optimisations d'Entraînement**
| Technique | Impact |
|-----------|--------|
| Précision mixte (AMP) | 2× accélération, -50% mémoire |
| torch.compile | +30% accélération |
| Accumulation de gradients (4 étapes) | -75% mémoire de batch effective |
| Cache d'images (memmap 1 Go) | 3× vitesse de chargement |

**CER vs Correspondance Exacte**
CER=0,0481 traduit par 80% de précision de correspondance exacte — le nom complet doit correspondre caractère par caractère. Même un seul caractère erroné compte comme un échec, raison pour laquelle la correspondance exacte est bien inférieure à ce que suggère le CER.`,
    longDescriptionAr: `مقارنة متعددة النماذج للتعرف الضوئي على الأسماء المكتوبة بخط اليد غير المقيّد.

**مجموعة البيانات**
- 66K تدريب / 8.2K تحقق / 41K اختبار (رمادي 64×256)
- مفردات 44 حرفاً (أبجدي رقمي + رموز خاصة)
- 20% من البيانات مستخدمة في التجارب

**مقارنة البنى**
| النموذج | CER ↓ | تطابق تام | السرعة |
|-------|-------|-------------|-------|
| CRNN-EfficientNet | 0.1235 | — | الأسرع |
| CRNN-ResNet18 | — | — | ~105ث/حقبة |
| CRNN-ResNet34 | **0.0502** | — | ~251ث/حقبة |
| **TrOCR** | **0.0481** | **80%** | 34.9 دقيقة |

**CRNN** (CNN + BiLSTM + CTC)
نواة ResNet34 → BiLSTM(2×256) → خسارة CTC → فك تشفير جشع / Beam search (4 حزم)

**TrOCR** (ViT + GPT-2، 334M معامل)
ضبط دقيق عبر HuggingFace Trainer، 10 حقب، 20% من البيانات.

**تحسينات التدريب**
AMP: تسريع 2×، -50% ذاكرة | torch.compile: +30% | تراكم التدرجات: -75% ذاكرة | تخزين الصور مؤقتاً: 3× سرعة تحميل

**CER مقابل التطابق التام**
CER=0.0481 يُترجم إلى 80% دقة تطابق تام — الاسم الكامل يجب أن يتطابق حرفاً بحرف. حتى حرف خاطئ واحد يُعدّ فشلاً.`,
    category: ["cv", "nlp"],
    tags: ["TrOCR", "CRNN", "CTC Loss", "BiLSTM", "ResNet34", "OCR", "HuggingFace"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/handwritten-name-recognition",
    featured: false,
    metrics: "TrOCR CER=0.0481 | 80% exact-match",
    dataset: "66K handwriting images, 64×256px, 44-char vocabulary",
    datasetFr: "66K images d'écriture manuscrite, 64×256px, vocabulaire de 44 caractères",
    datasetAr: "66K صورة خط يد، 64×256 بكسل، مفردات من 44 حرفاً",
    results: [
      { label: "TrOCR CER", value: "0.0481" },
      { label: "Exact-Match Accuracy", value: "80%" },
      { label: "CRNN-ResNet34 CER", value: "0.0502" },
      { label: "TrOCR params", value: "334M" },
    ],
    techStack: ["Python", "PyTorch", "TrOCR (HuggingFace)", "CRNN", "ResNet34", "BiLSTM", "CTC"],
    approach: "CRNN variants (CNN+BiLSTM+CTC) vs TrOCR (ViT+GPT2) with AMP + torch.compile",
    approachFr: "Variantes CRNN (CNN+BiLSTM+CTC) vs TrOCR (ViT+GPT2) avec AMP + torch.compile",
    approachAr: "متغيرات CRNN (CNN+BiLSTM+CTC) مقابل TrOCR (ViT+GPT2) مع AMP + torch.compile",
  },
  {
    id: "food-delivery",
    title: "Food Delivery Time Prediction",
    titleFr: "Prédiction du Temps de Livraison Alimentaire",
    titleAr: "التنبؤ بوقت توصيل الطعام",
    description: "16-model regression benchmark. Linear Regression surprisingly wins: RMSE=8.76 min, R²=0.829. Tuned XGBoost: RMSE=9.19. Distance & traffic dominate. Interaction features (distance×traffic) capture non-linearities for linear models.",
    descriptionFr: "Benchmark de régression sur 16 modèles. La Régression Linéaire gagne étonnamment : RMSE=8,76 min, R²=0,829. XGBoost ajusté : RMSE=9,19. Distance & trafic dominent. Caractéristiques d'interaction capturent les non-linéarités.",
    descriptionAr: "معيار انحدار بـ 16 نموذجاً. الانحدار الخطي يفوز بشكل مفاجئ: RMSE=8.76 دقيقة، R²=0.829. XGBoost مضبوط: RMSE=9.19. المسافة والحركة المرورية تهيمنان. ميزات التفاعل تلتقط اللاخطية للنماذج الخطية.",
    longDescription: `Comprehensive regression benchmark for food delivery time prediction.

**Dataset**
- 1,000 orders: distance, weather, traffic, time of day, vehicle type, preparation time, courier experience
- 30 missing values (3%) → mode/median imputation
- Target: Delivery_Time_min

**Feature Engineering**
- Ordinal: traffic (Low→High=0,1,2), time of day (Morning→Night=0,1,2,3)
- One-hot: weather (5 conditions), vehicle (4 types)
- Interaction: distance×traffic_encoded, courier_experience×distance

**16-Model Results**
| Model | RMSE (min) | R² |
|-------|------------|-----|
| **Linear Regression** | **8.76** | **0.829** |
| Ridge / Lasso | 8.76 | 0.829 |
| SVR (RBF) | 9.12 | 0.816 |
| Random Forest | 9.09 | 0.817 |
| LightGBM | 9.09 | 0.817 |
| CatBoost | 9.16 | 0.813 |
| XGBoost | 9.20 | 0.811 |
| XGBoost (tuned) | 9.19 | 0.812 |
| Decision Tree | 12.93 | 0.600 |

**Surprising Finding**
Linear Regression wins on this dataset. With proper interaction features, linear regression captures most variance. The engineered terms already encode non-linearities — leaving little for tree models to discover beyond what's explicitly modeled.

**Top SHAP Features (XGBoost)**
1. Distance (km) — direct physical constraint
2. Traffic level — multiplier on distance
3. Preparation time — delays accumulate
4. Courier experience — navigation efficiency`,
    longDescriptionFr: `Benchmark de régression complet pour la prédiction du temps de livraison alimentaire.

**Jeu de données**
- 1 000 commandes : distance, météo, trafic, heure du jour, type de véhicule, temps de préparation, expérience du coursier
- 30 valeurs manquantes (3%) → imputation mode/médiane
- Cible : Delivery_Time_min

**Feature Engineering**
- Ordinal : trafic (Faible→Élevé=0,1,2), heure du jour (Matin→Nuit=0,1,2,3)
- One-hot : météo (5 conditions), véhicule (4 types)
- Interaction : distance×trafic_encodé, expérience_coursier×distance

**Résultats 16 Modèles**
| Modèle | RMSE (min) | R² |
|-------|------------|-----|
| **Régression Linéaire** | **8,76** | **0,829** |
| Ridge / Lasso | 8,76 | 0,829 |
| SVR (RBF) | 9,12 | 0,816 |
| Random Forest | 9,09 | 0,817 |
| LightGBM | 9,09 | 0,817 |
| CatBoost | 9,16 | 0,813 |
| XGBoost | 9,20 | 0,811 |
| XGBoost (ajusté) | 9,19 | 0,812 |
| Decision Tree | 12,93 | 0,600 |

**Découverte Surprenante**
La Régression Linéaire gagne sur ce dataset. Avec des features d'interaction adéquates, elle capture la majeure partie de la variance. Les termes engineerés encodent déjà les non-linéarités — laissant peu à découvrir pour les modèles arborescents.

**Top Features SHAP (XGBoost)**
1. Distance (km) — contrainte physique directe
2. Niveau de trafic — multiplicateur de la distance
3. Temps de préparation — les délais s'accumulent
4. Expérience du coursier — efficacité de navigation`,
    longDescriptionAr: `معيار انحدار شامل للتنبؤ بوقت توصيل الطعام.

**مجموعة البيانات**
- 1,000 طلب: مسافة، طقس، حركة مرور، وقت اليوم، نوع المركبة، وقت التحضير، خبرة الموصّل
- 30 قيمة مفقودة (3%) → استيفاء النمط/الوسيط
- الهدف: Delivery_Time_min

**هندسة الميزات**
ترتيبي: مرور (منخفض→مرتفع=0,1,2)، وقت اليوم (صباح→ليل=0,1,2,3)
One-hot: طقس (5 حالات)، مركبة (4 أنواع)
تفاعل: مسافة×مرور_مُشفَّر، خبرة_موصّل×مسافة

**نتائج 16 نموذجاً**
| النموذج | RMSE (دقيقة) | R² |
|-------|------------|-----|
| **الانحدار الخطي** | **8.76** | **0.829** |
| Ridge / Lasso | 8.76 | 0.829 |
| Random Forest | 9.09 | 0.817 |
| LightGBM | 9.09 | 0.817 |
| XGBoost (مضبوط) | 9.19 | 0.812 |

**اكتشاف مفاجئ**
الانحدار الخطي يفوز على هذه البيانات. مع ميزات التفاعل المناسبة، يلتقط معظم التباين. الحدود المهندَسة تُرمِّز بالفعل اللاخطية.

**أبرز ميزات SHAP (XGBoost)**
1. المسافة (km) 2. مستوى المرور 3. وقت التحضير 4. خبرة الموصّل`,
    category: ["timeseries"],
    tags: ["Regression", "XGBoost", "LightGBM", "Feature Engineering", "Food Delivery", "RMSE"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/food-delivery-time-prediction",
    featured: false,
    metrics: "Linear Regression RMSE: 8.76 min | R²: 0.829",
    dataset: "1,000 food delivery orders — 9 features",
    datasetFr: "1 000 commandes de livraison alimentaire — 9 caractéristiques",
    datasetAr: "1,000 طلب توصيل طعام — 9 ميزات",
    results: [
      { label: "Best RMSE (Linear Reg)", value: "8.76 min" },
      { label: "Best R²", value: "0.829" },
      { label: "Tuned XGBoost RMSE", value: "9.19 min" },
      { label: "Models benchmarked", value: "16" },
    ],
    techStack: ["Python", "XGBoost", "LightGBM", "CatBoost", "Scikit-learn"],
    approach: "Interaction feature engineering → 16-model benchmark → RandomizedSearchCV HPO",
    approachFr: "Ingénierie de caractéristiques d'interaction → benchmark de 16 modèles → HPO RandomizedSearchCV",
    approachAr: "هندسة ميزات التفاعل → معيار 16 نموذجاً → HPO RandomizedSearchCV",
  },
  {
    id: "power-consumption",
    title: "Household Power Consumption Forecasting",
    titleFr: "Prévision de la Consommation Électrique des Ménages",
    titleAr: "التنبؤ باستهلاك الكهرباء المنزلية",
    description: "Multi-model time series on 2.9M UCI records (2006–2010). ARIMA, SARIMA, Prophet, LSTM on Global_active_power. STL reveals daily+weekly patterns. Ensemble with inverse-RMSE weighting across all models.",
    descriptionFr: "Séries temporelles multi-modèles sur 2,9M enregistrements UCI (2006–2010). ARIMA, SARIMA, Prophet, LSTM sur Global_active_power. STL révèle des motifs quotidiens+hebdomadaires. Ensemble avec pondération inverse-RMSE.",
    descriptionAr: "سلاسل زمنية متعددة النماذج على 2.9M سجل UCI (2006-2010). ARIMA، SARIMA، Prophet، LSTM على Global_active_power. STL يكشف أنماطاً يومية وأسبوعية. مجموعة مع ترجيح inverse-RMSE.",
    longDescription: `Time series forecasting for household electricity on the UCI dataset.

**Dataset**
- 2,075,259 measurements (Dec 2006 → Nov 2010), 1-minute resolution → resampled hourly
- 1.25% missing values → linear interpolation
- Target: Global_active_power (kW)

**Time Series Analysis**
- ADF test: stationary after differencing
- STL decomposition: daily pattern (morning/evening peaks) + weekly cycle (weekend dips)
- ACF/PACF: clear lag-24h and lag-168h autocorrelations

**Models Evaluated**
| Model | Strengths |
|-------|----------|
| ARIMA | Auto p,d,q selection, AIC |
| SARIMA | Seasonal period=24h |
| Prophet | Trend + yearly + weekly + daily seasonality |
| LSTM (encoder-decoder) | 24-step ahead sequential prediction |
| Ensemble | Inverse-RMSE weighted combination |

**Key Insight**
The seasonal component explains ~60% of variance. People follow routines — a "same time yesterday" baseline is hard to beat. Advanced models target the irregular residual component (vacations, guests, appliance failures).

**STL Decomposition Findings**
Trend: slowly declining over 4 years (efficiency improvements). Seasonal: strong daily (double peak: 7–9am + 6–9pm) + weekly (weekends 15% lower). Residual: 1.25% anomalies correlate with holidays.`,
    longDescriptionFr: `Prévision de séries temporelles pour la consommation électrique des ménages sur le dataset UCI.

**Jeu de données**
- 2 075 259 mesures (déc. 2006 → nov. 2010), résolution 1 minute → rééchantillonné horaire
- 1,25% de valeurs manquantes → interpolation linéaire
- Cible : Global_active_power (kW)

**Analyse des Séries Temporelles**
- Test ADF : stationnaire après différenciation
- Décomposition STL : motif quotidien (pics matin/soir) + cycle hebdomadaire (creux week-end)
- ACF/PACF : autocorrélations claires à lag-24h et lag-168h

**Modèles Évalués**
| Modèle | Points Forts |
|-------|----------|
| ARIMA | Sélection auto p,d,q, AIC |
| SARIMA | Période saisonnière=24h |
| Prophet | Tendance + saisonnalités annuelle + hebdomadaire + quotidienne |
| LSTM (encodeur-décodeur) | Prédiction séquentielle 24 pas en avant |
| Ensemble | Combinaison pondérée inverse-RMSE |

**Insight Clé**
La composante saisonnière explique ~60% de la variance. Les gens suivent des routines — une baseline "même heure hier" est difficile à battre. Les modèles avancés ciblent la composante résiduelle irrégulière (vacances, invités, pannes d'appareils).

**Résultats de la Décomposition STL**
Tendance : légèrement déclinante sur 4 ans (améliorations d'efficacité). Saisonnier : double pic quotidien fort (7–9h + 18–21h) + hebdomadaire (week-ends 15% plus bas). Résiduel : 1,25% d'anomalies corrélées aux jours fériés.`,
    longDescriptionAr: `تنبؤ بالسلاسل الزمنية لاستهلاك الكهرباء المنزلية على مجموعة UCI.

**مجموعة البيانات**
- 2,075,259 قياساً (ديسمبر 2006 → نوفمبر 2010)، دقة دقيقة → إعادة أخذ عينات ساعي
- 1.25% قيم مفقودة → استيفاء خطي
- الهدف: Global_active_power (kW)

**تحليل السلاسل الزمنية**
- اختبار ADF: ثابت بعد التفريق
- تحلل STL: نمط يومي (ذروات صباح/مساء) + دورة أسبوعية (انخفاض عطلة نهاية الأسبوع)
- ACF/PACF: ارتباطات ذاتية واضحة عند lag-24h و lag-168h

**النماذج المُقيَّمة**
| النموذج | نقاط القوة |
|-------|----------|
| ARIMA | اختيار auto p,d,q، AIC |
| SARIMA | فترة موسمية=24h |
| Prophet | اتجاه + موسميات سنوية + أسبوعية + يومية |
| LSTM (مشفِّر-مفكِّك) | تنبؤ تسلسلي 24 خطوة للأمام |
| مجموعة | تركيبة مرجحة بـ inverse-RMSE |

**الاستنتاج الرئيسي**
المكوّن الموسمي يُفسِّر ~60% من التباين. الناس يتبعون روتيناً — baseline "نفس الوقت أمس" صعبة التجاوز. التحلل STL: ذروتان يوميتان قويتان (7-9ص + 6-9م) + عطلة نهاية الأسبوع أقل 15%. البواقي: 1.25% شذوذات مرتبطة بالإجازات.`,
    category: ["timeseries"],
    tags: ["LSTM", "ARIMA", "SARIMA", "Prophet", "STL Decomposition", "Power Forecasting", "UCI"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/household-power-consumption",
    featured: false,
    dataset: "UCI Household Power: 2.9M measurements, 1-min resolution, 4 years",
    datasetFr: "UCI Household Power : 2,9M mesures, résolution 1 min, 4 ans",
    datasetAr: "UCI Household Power: 2.9M قياس، دقة 1 دقيقة، 4 سنوات",
    techStack: ["Python", "TensorFlow/LSTM", "statsmodels", "Prophet", "Pandas"],
    approach: "STL decomposition → stationarity → ARIMA/SARIMA/Prophet/LSTM → ensemble",
    approachFr: "Décomposition STL → stationnarité → ARIMA/SARIMA/Prophet/LSTM → ensemble",
    approachAr: "تحليل STL → الاستقرارية → ARIMA/SARIMA/Prophet/LSTM → مجموعة",
  },
  {
    id: "product-demand",
    title: "Historical Product Demand Forecasting",
    titleFr: "Prévision Historique de la Demande de Produits",
    titleAr: "التنبؤ التاريخي بطلب المنتجات",
    description: "19-model benchmark: classical TS → ML → DL → ensemble. CatBoost R²=0.7125 (best). ML crushes classical TS (SMAPE 115–130% vs 35–40% for TS, but R² negative for TS). Walk-forward CV with Optuna.",
    descriptionFr: "Benchmark de 19 modèles : TS classique → ML → DL → ensemble. CatBoost R²=0,7125 (meilleur). ML écrase TS classique (SMAPE 115–130% vs 35–40% pour TS, mais R² négatif pour TS). CV walk-forward avec Optuna.",
    descriptionAr: "معيار 19 نموذجاً: TS كلاسيكي → ML → DL → مجموعة. CatBoost R²=0.7125 (الأفضل). ML يتفوق على TS الكلاسيكي (SMAPE 115-130% مقابل 35-40% لـ TS، لكن R² سالب لـ TS). CV walk-forward مع Optuna.",
    longDescription: `Comprehensive demand forecasting benchmark — 19 models on DataCo supply chain.

**Dataset**
- 215K+ rows, 36 features after engineering
- Walk-forward cross-validation (expanding window)
- ADF test: stationary (p<0.0001)

**All 19 Models — Key Results**
| Model | MAE | SMAPE | R² |
|-------|-----|-------|-----|
| Naive (last value) | 1,145K | 99.4% | -3.09 |
| Classical TS (best: Theta) | 536K | 35.0% | -0.07 |
| Prophet | 523K | 34.8% | +0.11 |
| **CatBoost** | **9.5K** | **121.3%** | **+0.713** |
| XGBoost (Optuna) | 9.4K | 115.2% | +0.707 |
| Ridge Regression | 9.4K | 133.6% | +0.707 |
| Quantile Reg (P50) | **8.5K** | 75.3% | +0.700 |
| LSTM | 554K | 36.2% | -0.08 |
| TFT | 602K | 38.0% | -0.28 |
| N-BEATS | 652K | 39.2% | -0.66 |

**The ML vs Classical TS Paradox**
- Classical TS: correct *scale* (SMAPE 35%), wrong *patterns* (R²<0)
- ML: correct *patterns* (R²=0.71), large absolute errors (SMAPE 115%)
- Root cause: ML predicts per-product with lag features → tiny absolute error on most products, fails on aggregate scale
- Quantile Regression P50 best balances: MAE=8.5K, SMAPE=75.3%, R²=0.70

**Why Deep Learning Fails Here**
LSTM/TFT/N-BEATS all R²<0 — worse than Prophet. Demand data has discrete product-category structure that trees model perfectly; sequential dependencies that LSTM exploits are weak here.`,
    longDescriptionFr: `Benchmark complet de prévision de la demande — 19 modèles sur la chaîne d'approvisionnement DataCo.

**Jeu de données**
- Plus de 215K lignes, 36 features après engineering
- Validation croisée walk-forward (fenêtre expansive)
- Test ADF : stationnaire (p<0,0001)

**Les 19 Modèles — Résultats Clés**
| Modèle | MAE | SMAPE | R² |
|-------|-----|-------|-----|
| Naïf (dernière valeur) | 1 145K | 99,4% | -3,09 |
| TS Classique (meilleur : Theta) | 536K | 35,0% | -0,07 |
| Prophet | 523K | 34,8% | +0,11 |
| **CatBoost** | **9,5K** | **121,3%** | **+0,713** |
| XGBoost (Optuna) | 9,4K | 115,2% | +0,707 |
| Régression Ridge | 9,4K | 133,6% | +0,707 |
| Régression Quantile (P50) | **8,5K** | 75,3% | +0,700 |
| LSTM | 554K | 36,2% | -0,08 |
| TFT | 602K | 38,0% | -0,28 |
| N-BEATS | 652K | 39,2% | -0,66 |

**Le Paradoxe ML vs TS Classique**
- TS Classique : bonne *échelle* (SMAPE 35%), mauvais *motifs* (R²<0)
- ML : bons *motifs* (R²=0,71), grandes erreurs absolues (SMAPE 115%)
- Cause racine : le ML prédit par produit avec features lag → petite erreur absolue sur la plupart, échoue sur l'échelle agrégée
- La Régression Quantile P50 équilibre mieux : MAE=8,5K, SMAPE=75,3%, R²=0,70

**Pourquoi le Deep Learning Échoue Ici**
LSTM/TFT/N-BEATS tous R²<0 — pire que Prophet. Les données de demande ont une structure discrète produit-catégorie que les arbres modélisent parfaitement ; les dépendances séquentielles exploitées par LSTM sont faibles ici.`,
    longDescriptionAr: `معيار شامل للتنبؤ بالطلب — 19 نموذجاً على سلسلة إمداد DataCo.

**مجموعة البيانات**
- أكثر من 215K صف، 36 ميزة بعد الهندسة
- CV walk-forward (نافذة توسعية)
- اختبار ADF: ثابت (p<0.0001)

**النماذج الـ 19 — النتائج الرئيسية**
| النموذج | MAE | SMAPE | R² |
|-------|-----|-------|-----|
| ساذج (آخر قيمة) | 1,145K | 99.4% | -3.09 |
| TS كلاسيكي (Theta) | 536K | 35.0% | -0.07 |
| Prophet | 523K | 34.8% | +0.11 |
| **CatBoost** | **9.5K** | **121.3%** | **+0.713** |
| XGBoost (Optuna) | 9.4K | 115.2% | +0.707 |
| الانحدار الكمي (P50) | **8.5K** | 75.3% | +0.700 |
| LSTM | 554K | 36.2% | -0.08 |

**مفارقة ML مقابل TS الكلاسيكي**
TS الكلاسيكي: مقياس صحيح (SMAPE 35%)، أنماط خاطئة (R²<0). ML: أنماط صحيحة (R²=0.71)، أخطاء مطلقة كبيرة (SMAPE 115%). الانحدار الكمي P50 يوازن أفضل.

**لماذا يفشل التعلم العميق هنا**
LSTM/TFT/N-BEATS جميعاً R²<0 — أسوأ من Prophet. بيانات الطلب لها بنية منفصلة يُنمذجها الأشجار بشكل مثالي.`,
    category: ["timeseries"],
    tags: ["CatBoost", "XGBoost", "LightGBM", "LSTM", "TFT", "N-BEATS", "Walk-Forward", "Demand Forecasting"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/historical-product-demand-forecasting",
    featured: false,
    metrics: "CatBoost R²=0.7125 | Quantile Reg MAE=8,511",
    dataset: "DataCo SCMS: 215K+ rows, 36 features, walk-forward CV",
    datasetFr: "DataCo SCMS : plus de 215K lignes, 36 caractéristiques, CV walk-forward",
    datasetAr: "DataCo SCMS: أكثر من 215K صف، 36 ميزة، CV walk-forward",
    results: [
      { label: "CatBoost R²", value: "0.7125" },
      { label: "Quantile Reg MAE", value: "8,511" },
      { label: "Classical TS best R²", value: "0.11 (Prophet)" },
      { label: "Models benchmarked", value: "19" },
    ],
    techStack: ["Python", "CatBoost", "XGBoost", "LightGBM", "PyTorch Lightning", "N-BEATS", "TFT", "Optuna"],
    approach: "Walk-forward CV → 19 models: TS baselines → ML → DL (LSTM/TFT/N-BEATS) → ensemble",
    approachFr: "CV walk-forward → 19 modèles : TS baselines → ML → DL (LSTM/TFT/N-BEATS) → ensemble",
    approachAr: "CV walk-forward → 19 نموذجاً: خطوط أساسية TS → ML → DL (LSTM/TFT/N-BEATS) → مجموعة",
  },
  {
    id: "speech-commands",
    title: "Synthetic Speech Commands Classification",
    titleFr: "Classification de Commandes Vocales Synthétiques",
    titleAr: "تصنيف أوامر الكلام الاصطناعية",
    description: "30-class audio CNN achieves perfect 100% test accuracy on 41,849 samples. Mel-spectrogram (64 bins) + SpecAugment. 1.25M-param 4-block CNN. Val accuracy reaches 100% at epoch 8. Label smoothing 0.1.",
    descriptionFr: "CNN audio à 30 classes atteint 100% de précision test sur 41 849 échantillons. Mel-spectrogram (64 bins) + SpecAugment. CNN à 4 blocs, 1,25M paramètres. Précision val atteint 100% à l'époque 8. Label smoothing 0,1.",
    descriptionAr: "CNN صوتي بـ 30 فئة يحقق دقة اختبار 100% على 41,849 عينة. Mel-spectrogram (64 bin) + SpecAugment. CNN بـ 4 كتل، 1.25M معامل. دقة التحقق تبلغ 100% في الحقبة 8. Label smoothing 0.1.",
    longDescription: `30-class audio command classification achieving perfect test accuracy on synthetic data.

**Dataset**
- 41,849 .wav files: 30 command classes (bed, bird, cat ... yes, zero)
- Clean + noisy variants, 16kHz, 1.0s fixed duration
- Train: 31,386 / Val: 6,277 / Test: 4,186 (stratified)

**Feature Extraction**
\`\`\`
1. Load .wav → normalize to 1.0s (pad/trim)
2. Mel-spectrogram: 64 bins, n_fft=512, hop=160
3. Normalize per-sample to [0, 1]
4. SpecAugment: FreqMask(k=15) + TimeMask(k=35)
\`\`\`

**CNN Architecture (1,246,142 params)**
4 ConvBlocks [32→64→128→256 channels] → GAP → Dense(512) → Dropout(0.3) → Dense(30)

**Training**
30 epochs, Adam(lr=1e-3), CrossEntropy + label_smoothing=0.1, CosineAnnealingLR, patience=10

**Results**
| Epoch | Val Accuracy |
|-------|-------------|
| 5 | 98.5% |
| **8** | **100.0%** |
| 30 | 100.0% |

Test accuracy: **100.00%** | Per-class F1: **1.00 for all 30 commands**

**Why Perfect Accuracy?**
Synthetic speech (text-to-speech) has highly consistent acoustic properties. Unlike real speech (accents, prosody, background noise), synthetic commands cluster tightly in mel-spectrogram space — this is a favorable but unrealistic evaluation condition.`,
    longDescriptionFr: `Classification de commandes audio à 30 classes atteignant une précision parfaite sur données synthétiques.

**Jeu de données**
- 41 849 fichiers .wav : 30 classes de commandes (bed, bird, cat... yes, zero)
- Variantes propres + bruitées, 16kHz, durée fixe 1,0s
- Entraînement : 31 386 / Validation : 6 277 / Test : 4 186 (stratifié)

**Extraction de Features**
\`\`\`
1. Charger .wav → normaliser à 1,0s (rembourrage/découpage)
2. Mel-spectrogram : 64 bins, n_fft=512, hop=160
3. Normaliser par échantillon à [0, 1]
4. SpecAugment : FreqMask(k=15) + TimeMask(k=35)
\`\`\`

**Architecture CNN (1 246 142 paramètres)**
4 ConvBlocks [32→64→128→256 canaux] → GAP → Dense(512) → Dropout(0,3) → Dense(30)

**Entraînement**
30 époques, Adam(lr=1e-3), CrossEntropy + label_smoothing=0,1, CosineAnnealingLR, patience=10

**Résultats**
| Époque | Précision Val |
|-------|-------------|
| 5 | 98,5% |
| **8** | **100,0%** |
| 30 | 100,0% |

Précision test : **100,00%** | F1 par classe : **1,00 pour toutes les 30 commandes**

**Pourquoi une Précision Parfaite ?**
La parole synthétique a des propriétés acoustiques très consistantes. Contrairement à la parole réelle (accents, prosodie, bruit de fond), les commandes synthétiques se regroupent étroitement dans l'espace mel-spectrogram — c'est une condition d'évaluation favorable mais irréaliste.`,
    longDescriptionAr: `تصنيف أوامر الصوت بـ 30 فئة يحقق دقة مثالية على البيانات الاصطناعية.

**مجموعة البيانات**
- 41,849 ملف .wav: 30 فئة أوامر (bed، bird، cat... yes، zero)
- متغيرات نظيفة + مشوشة، 16kHz، مدة ثابتة 1.0 ثانية
- تدريب: 31,386 / تحقق: 6,277 / اختبار: 4,186 (طبقي)

**استخراج الميزات**
\`\`\`
1. تحميل .wav → تطبيع إلى 1.0 ثانية
2. Mel-spectrogram: 64 bin، n_fft=512، hop=160
3. تطبيع لكل عينة إلى [0, 1]
4. SpecAugment: FreqMask(k=15) + TimeMask(k=35)
\`\`\`

**بنية CNN (1,246,142 معامل)**
4 ConvBlocks [32→64→128→256 قناة] → GAP → Dense(512) → Dropout(0.3) → Dense(30)

**التدريب**
30 حقبة، Adam(lr=1e-3)، CrossEntropy + label_smoothing=0.1، CosineAnnealingLR

**النتائج**
الحقبة 8: دقة تحقق **100.0%** | دقة الاختبار: **100.00%** | F1=1.00 لجميع الفئات

**لماذا الدقة المثالية؟**
الكلام الاصطناعي له خصائص صوتية متسقة جداً. على عكس الكلام الحقيقي، تتجمع الأوامر الاصطناعية بإحكام في فضاء mel-spectrogram — شرط تقييم مُفضِّل لكن غير واقعي.`,
    category: ["nlp"],
    tags: ["Audio CNN", "Mel-Spectrogram", "SpecAugment", "Speech Recognition", "30-class", "librosa"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/synthetic-speech-commands-classification",
    featured: false,
    metrics: "100% test accuracy | F1=1.00 all 30 classes",
    dataset: "41,849 synthetic .wav files, 30 command classes",
    datasetFr: "41 849 fichiers .wav synthétiques, 30 classes de commandes",
    datasetAr: "41,849 ملف .wav اصطناعياً، 30 فئة أوامر",
    results: [
      { label: "Test accuracy", value: "100.00%" },
      { label: "All-class F1", value: "1.00" },
      { label: "100% val achieved", value: "Epoch 8" },
      { label: "Model params", value: "1,246,142" },
    ],
    techStack: ["Python", "PyTorch", "librosa", "4-block CNN", "Mel-Spectrogram", "SpecAugment"],
    approach: "Mel-spectrogram + SpecAugment → 4-block CNN + label smoothing + cosine LR",
    approachFr: "Mel-spectrogram + SpecAugment → CNN à 4 blocs + label smoothing + LR cosinus",
    approachAr: "Mel-spectrogram + SpecAugment → CNN بـ 4 كتل + label smoothing + LR كوسينوس",
  },
  {
    id: "line-detection",
    title: "Line Detection (Computer Vision)",
    titleFr: "Détection de Lignes (Vision par Ordinateur)",
    titleAr: "كشف الخطوط (رؤية الحاسوب)",
    description: "Classical CV benchmark: Standard Hough (2.53ms, 22 lines), Probabilistic Hough (4.29ms, 47 segments), LSD (23.98ms, 422 segments). Hough 6–10× faster. Udacity dashcam + synthetic images. HSV+ROI pipeline.",
    descriptionFr: "Benchmark de CV classique : Hough Standard (2,53ms, 22 lignes), Hough Probabiliste (4,29ms, 47 segments), LSD (23,98ms, 422 segments). Hough 6–10× plus rapide. Images dashcam Udacity + images synthétiques. Pipeline HSV+ROI.",
    descriptionAr: "معيار رؤية الحاسوب الكلاسيكية: Hough القياسي (2.53ms، 22 خطاً)، Hough الاحتمالي (4.29ms، 47 مقطعاً)، LSD (23.98ms، 422 مقطعاً). Hough أسرع 6-10 مرات. صور كاميرا Udacity + صور اصطناعية. خط أنابيب HSV+ROI.",
    longDescription: `Classical computer vision benchmark for lane and structural line detection.

**Full Pipeline**
\`\`\`
1. HSV color thresholding (separate white/yellow lane channels)
2. ROI masking (triangular polygon, removes sky/hood)
3. Edge detection: Canny(kernel=3, low=190, high=250)
4. Line detection (3 algorithms benchmarked)
5. Post-processing: slope filter, merge, average parallel lines
6. Overlay on original image [RED lines + BLUE ROI boundary]
\`\`\`

**Datasets**
- Synthetic: geometric images (horizontal/vertical/diagonal/vanishing point)
- Real: Udacity Self-Driving Car dashcam (960×540, solidWhiteRight.mp4, solidYellowLeft.mp4)

**Algorithm Benchmark (50 runs each)**
| Algorithm | Speed (synthetic) | Speed (real) | Output |
|-----------|------------------|--------------|--------|
| **Standard Hough** | **2.53ms ± 0.09** | **3.73ms ± 0.14** | 22/19 infinite lines |
| Probabilistic Hough | 3.47ms ± 0.65 | 4.29ms ± 0.18 | 55/47 segments |
| LSD | 16.60ms ± 1.12 | 23.98ms ± 0.75 | 29/422 sub-pixel segments |

**Speed-Accuracy Trade-off**
- Standard Hough: fastest (2.5ms), clean infinite lines — ideal for highway lane detection
- Probabilistic Hough: slight overhead, returns positioned segments — better for curved roads
- LSD: 6–10× slower but sub-pixel accuracy, parameter-free — better for structural analysis

**Real-Time Analysis**
Standard Hough at 3.7ms/frame → **270+ FPS** — vastly exceeds camera frame rates. LSD at 24ms → 42 FPS — still real-time capable.

**Canny Optimization**
Parameters kernel=3, low=190, high=250 suppress road texture noise while preserving solid and dashed lane markings on the Udacity dataset.`,
    longDescriptionFr: `Benchmark de vision par ordinateur classique pour la détection de voies de circulation et de lignes structurelles.

**Pipeline Complet**
\`\`\`
1. Seuillage de couleur HSV (sépare canaux blanc/jaune de voie)
2. Masquage ROI (polygone triangulaire, retire ciel/capot)
3. Détection de bords : Canny(kernel=3, low=190, high=250)
4. Détection de lignes (3 algorithmes comparés)
5. Post-traitement : filtre de pente, fusion, moyenne des lignes parallèles
6. Superposition sur l'image originale [lignes ROUGES + frontière ROI BLEUE]
\`\`\`

**Jeux de données**
- Synthétique : images géométriques (horizontal/vertical/diagonal/point de fuite)
- Réel : dashcam Udacity Self-Driving Car (960×540, solidWhiteRight.mp4, solidYellowLeft.mp4)

**Benchmark des Algorithmes (50 exécutions chacun)**
| Algorithme | Vitesse (synthétique) | Vitesse (réel) | Sortie |
|-----------|------------------|--------------|--------|
| **Hough Standard** | **2,53ms ± 0,09** | **3,73ms ± 0,14** | 22/19 lignes infinies |
| Hough Probabiliste | 3,47ms ± 0,65 | 4,29ms ± 0,18 | 55/47 segments |
| LSD | 16,60ms ± 1,12 | 23,98ms ± 0,75 | 29/422 segments sous-pixel |

**Compromis Vitesse-Précision**
- Hough Standard : le plus rapide (2,5ms), lignes infinies propres — idéal pour la détection de voies sur autoroute
- Hough Probabiliste : légère surcharge, retourne des segments positionnés — meilleur pour les routes courbes
- LSD : 6–10× plus lent mais précision sous-pixel, sans paramètre — meilleur pour l'analyse structurelle

**Analyse Temps Réel**
Hough Standard à 3,7ms/image → **270+ FPS** — dépasse largement les cadences des caméras. LSD à 24ms → 42 FPS — encore en temps réel.

**Optimisation Canny**
Paramètres kernel=3, low=190, high=250 suppriment le bruit de texture routière tout en préservant les marquages de voie continus et discontinus sur le dataset Udacity.`,
    longDescriptionAr: `معيار رؤية الحاسوب الكلاسيكية لكشف المسارات والخطوط الهيكلية.

**خط الأنابيب الكامل**
\`\`\`
1. عتبة الألوان HSV (فصل قنوات المسار الأبيض/الأصفر)
2. قناع ROI (مضلع مثلثي، يزيل السماء/الغطاء)
3. كشف الحواف: Canny(kernel=3، low=190، high=250)
4. كشف الخطوط (3 خوارزميات مقارنة)
5. ما بعد المعالجة: فلتر الميل، دمج، متوسط الخطوط المتوازية
6. تراكب على الصورة الأصلية [خطوط حمراء + حدود ROI زرقاء]
\`\`\`

**مجموعات البيانات**
اصطناعية: صور هندسية | حقيقية: كاميرا Udacity للسيارة ذاتية القيادة

**معيار الخوارزميات (50 تشغيل لكل منها)**
| الخوارزمية | السرعة (اصطناعي) | السرعة (حقيقي) | المخرجات |
|-----------|------------------|--------------|--------|
| **Hough القياسي** | **2.53ms ± 0.09** | **3.73ms ± 0.14** | 22/19 خط لا نهائي |
| Hough الاحتمالي | 3.47ms ± 0.65 | 4.29ms ± 0.18 | 55/47 قطعة |
| LSD | 16.60ms ± 1.12 | 23.98ms ± 0.75 | 29/422 قطعة تحت البكسل |

**Hough القياسي بـ 3.7ms/إطار → 270+ FPS** (يتجاوز معدلات الكاميرا بكثير). LSD بـ 24ms → 42 FPS (لا يزال في الوقت الفعلي).

**تحسين Canny**
kernel=3، low=190، high=250 يُزيلان ضجيج نسيج الطريق مع الحفاظ على علامات المسار على بيانات Udacity.`,
    category: ["cv"],
    tags: ["Hough Transform", "LSD", "Canny Edge", "Lane Detection", "OpenCV", "Classical CV"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/line-detection",
    featured: false,
    metrics: "Standard Hough: 2.53ms/frame (270+ FPS)",
    dataset: "Udacity dashcam frames + synthetic geometric images",
    datasetFr: "Images dashcam Udacity + images géométriques synthétiques",
    datasetAr: "إطارات كاميرا Udacity + صور هندسية اصطناعية",
    results: [
      { label: "Standard Hough speed", value: "2.53ms ± 0.09ms" },
      { label: "Probabilistic Hough", value: "4.29ms ± 0.18ms" },
      { label: "LSD (sub-pixel)", value: "23.98ms ± 0.75ms" },
      { label: "Hough vs LSD ratio", value: "6–10× faster" },
    ],
    techStack: ["Python", "OpenCV", "NumPy", "Hough Transform", "LSD", "Canny"],
    approach: "HSV masking + ROI + 3-algorithm benchmark (Standard / Probabilistic Hough / LSD)",
    approachFr: "Masquage HSV + ROI + benchmark 3 algorithmes (Standard / Hough Probabiliste / LSD)",
    approachAr: "قناع HSV + ROI + معيار 3 خوارزميات (Standard / Hough الاحتمالي / LSD)",
  },
  {
    id: "anime-gan",
    title: "Anime Face Generation (DCGAN)",
    titleFr: "Génération de Visages Anime (DCGAN)",
    titleAr: "توليد وجوه أنمي (DCGAN)",
    description: "DCGAN trained 100 epochs on Tesla T4 on 43K anime images. ConvTranspose2d stack (100→512→256→128→64→3). β₁=0.5, label smoothing, StepLR. Slerp latent interpolation for smooth transitions.",
    descriptionFr: "DCGAN entraîné 100 époques sur Tesla T4 sur 43K images anime. Pile ConvTranspose2d (100→512→256→128→64→3). β₁=0,5, lissage des étiquettes, StepLR. Interpolation latente slerp pour des transitions fluides.",
    descriptionAr: "DCGAN مدرب لـ 100 حقبة على Tesla T4 على 43K صورة أنمي. مكدس ConvTranspose2d (100→512→256→128→64→3). β₁=0.5، تمهيد التسميات، StepLR. استيفاء slerp للانتقالات السلسة.",
    longDescription: `DCGAN trained from scratch on 43,102 anime face images (64×64 px).

**Architecture**
\`\`\`
Generator: z(100) → ConvTranspose2d×4 [512→256→128→64→3] → Tanh
Discriminator: Conv2d×4 [64→128→256→512] → Sigmoid
\`\`\`

**4 Training Stability Techniques**
| Technique | Why It Matters |
|-----------|----------------|
| Adam β₁=0.5 (not 0.9) | Prevents momentum oscillations in adversarial training |
| Weight init N(0,0.02) Conv, N(1,0.02) BN | Avoids discriminator lock-in at initialization |
| StepLR ×0.5 at epoch 50 | Prevents LR divergence in late training |
| Label smoothing Real→0.9 | Softens discriminator targets, prevents overconfidence |

**Training Results**
- 100 epochs, ~58s/epoch on Tesla T4
- 200 generated samples
- Avoided mode collapse and checkerboard artifacts

**Slerp Interpolation**
\`\`\`python
def slerp(z1, z2, t):
    omega = arccos(clip(dot(z1/||z1||, z2/||z2||), -1, 1))
    return sin((1-t)*omega)/sin(omega)*z1 + sin(t*omega)/sin(omega)*z2
\`\`\`
Slerp respects the hyperspherical geometry of the latent space. Linear interpolation passes through low-density regions and produces muddy in-betweens. Slerp stays on the manifold.`,
    longDescriptionFr: `DCGAN entraîné de zéro sur 43 102 images de visages anime (64×64 px).

**Architecture**
\`\`\`
Générateur : z(100) → ConvTranspose2d×4 [512→256→128→64→3] → Tanh
Discriminateur : Conv2d×4 [64→128→256→512] → Sigmoid
\`\`\`

**4 Techniques de Stabilité d'Entraînement**
| Technique | Pourquoi c'est Important |
|-----------|----------------|
| Adam β₁=0,5 (pas 0,9) | Évite les oscillations de momentum dans l'entraînement adversarial |
| Init poids N(0;0,02) Conv, N(1;0,02) BN | Évite le blocage du discriminateur à l'initialisation |
| StepLR ×0,5 à l'époque 50 | Évite la divergence du LR en fin d'entraînement |
| Lissage des étiquettes Réel→0,9 | Adoucit les cibles du discriminateur, évite la surconfiance |

**Résultats d'Entraînement**
- 100 époques, ~58s/époque sur Tesla T4
- 200 échantillons générés
- Effondrement de mode et artefacts en damier évités

**Interpolation Slerp**
\`\`\`python
def slerp(z1, z2, t):
    omega = arccos(clip(dot(z1/||z1||, z2/||z2||), -1, 1))
    return sin((1-t)*omega)/sin(omega)*z1 + sin(t*omega)/sin(omega)*z2
\`\`\`
La slerp respecte la géométrie hypersphérique de l'espace latent. L'interpolation linéaire traverse des régions de faible densité et produit des résultats flous. La slerp reste sur la variété.`,
    longDescriptionAr: `DCGAN مدرب من الصفر على 43,102 صورة وجوه أنمي (64×64 بكسل).

**البنية**
\`\`\`
المولّد: z(100) → ConvTranspose2d×4 [512→256→128→64→3] → Tanh
المُميِّز: Conv2d×4 [64→128→256→512] → Sigmoid
\`\`\`

**4 تقنيات استقرار التدريب**
| التقنية | لماذا مهمة |
|-----------|----------------|
| Adam β₁=0.5 (لا 0.9) | تتجنب تذبذبات الزخم في التدريب التنافسي |
| تهيئة الأوزان N(0,0.02) Conv، N(1,0.02) BN | تتجنب قفل المُميِّز عند التهيئة |
| StepLR ×0.5 عند الحقبة 50 | تمنع تباعد LR في التدريب المتأخر |
| تمهيد التسميات حقيقي→0.9 | يُليِّن أهداف المُميِّز، يمنع الإفراط بالثقة |

**نتائج التدريب**
- 100 حقبة، ~58 ثانية/حقبة على Tesla T4
- 200 عينة مولّدة
- تجنّب انهيار النمط وعيوب رقعة الشطرنج

**استيفاء Slerp**
\`\`\`python
def slerp(z1, z2, t):
    omega = arccos(clip(dot(z1/||z1||, z2/||z2||), -1, 1))
    return sin((1-t)*omega)/sin(omega)*z1 + sin(t*omega)/sin(omega)*z2
\`\`\`
Slerp يحترم الهندسة الكروية للفضاء الكامن. الاستيفاء الخطي يمر عبر مناطق منخفضة الكثافة وينتج نتائج ضبابية. Slerp يبقى على المتشعّب.`,
    category: ["genai"],
    tags: ["DCGAN", "GAN", "PyTorch", "Generative AI", "Slerp", "ConvTranspose2d", "Tesla T4"],
    kaggleUrl: "https://www.kaggle.com/code/ossamaelhakk/code",
    featured: false,
    metrics: "Stable generation after 100 epochs on 43K images",
    dataset: "43,102 anime face images (64×64 px)",
    datasetFr: "43 102 images de visages anime (64×64 px)",
    datasetAr: "43,102 صورة وجوه أنمي (64×64 بكسل)",
    results: [
      { label: "Training epochs", value: "100" },
      { label: "Time per epoch", value: "~58s (T4)" },
      { label: "Generated samples", value: "200" },
      { label: "Latent dimension", value: "100" },
    ],
    techStack: ["Python", "PyTorch", "DCGAN", "ConvTranspose2d", "CUDA Tesla T4"],
    approach: "DCGAN + slerp interpolation + 4 stability techniques (β₁=0.5, label smooth, StepLR, init)",
    approachFr: "DCGAN + interpolation slerp + 4 techniques de stabilité (β₁=0,5, label smooth, StepLR, init)",
    approachAr: "DCGAN + استيفاء slerp + 4 تقنيات استقرار (β₁=0.5، label smooth، StepLR، تهيئة)",
  },

  // ── AGENTS & AUTOMATION ──────────────────────────────────────────────────
  {
    id: "recommendation-engine",
    title: "E-commerce Recommendation Engine (n8n)",
    titleFr: "Moteur de Recommandation E-commerce (n8n)",
    titleAr: "محرك توصيات التجارة الإلكترونية (n8n)",
    description: "Production recommendation backend: n8n + PostgreSQL, 4 modes (trending/co-purchase/personalized/repurchase), 74 nodes, webhook API, daily scheduler. No custom server required.",
    descriptionFr: "Backend de recommandation en production : n8n + PostgreSQL, 4 modes (tendances/co-achat/personnalisé/réachat), 74 nœuds, API webhook, planificateur quotidien. Aucun serveur personnalisé requis.",
    descriptionAr: "خلفية توصيات إنتاجية: n8n + PostgreSQL، 4 أوضاع (رائج/شراء مشترك/مخصص/إعادة شراء)، 74 عقدة، API webhook، جدولة يومية. لا حاجة لخادم مخصص.",
    longDescription: `Production recommendation engine built entirely with n8n + PostgreSQL — no Python server, no ML infrastructure.

**4 Recommendation Algorithms**
| Mode | Algorithm | Use Case |
|------|-----------|---------|
| Trending | Most purchased in rolling 7-day window | Homepage |
| Co-purchase | Market basket analysis | "Frequently bought with" |
| Personalized | Customer history → top unordered | Returning customers |
| Repurchase | Previously bought consumables | Replenishment emails |

**Architecture (74 nodes)**
\`\`\`
POST /import-orders → validate client → upsert to PostgreSQL
POST /generate-recs → fetch orders → run algorithms → upsert results
GET  /get-recs      → fetch by mode + client_id
GET  /customer-recs → personalized + repurchase merged
ScheduleTrigger (daily) → purge orders > 90 days
\`\`\`

**Market Basket SQL Pattern**
For each order pair (A,B) bought by same customer: increment co_purchase_count(A,B). Query returns items with highest count for current product.

**Why n8n Over Python?**
Typical recommendation backends require: model serving, Python env, monitoring, retraining. This delivers 4 recommendation modes with pure SQL + webhooks, deployable in hours, maintainable without code.`,
    longDescriptionFr: `Moteur de recommandation production entièrement construit avec n8n + PostgreSQL — pas de serveur Python, pas d'infrastructure ML.

**4 Algorithmes de Recommandation**
| Mode | Algorithme | Cas d'Usage |
|------|-----------|---------|
| Tendances | Produits les plus achetés sur fenêtre glissante 7 jours | Page d'accueil |
| Co-achat | Analyse du panier de marché | "Fréquemment acheté ensemble" |
| Personnalisé | Historique client → top non commandé | Clients récurrents |
| Rachat | Consommables précédemment achetés | E-mails de réapprovisionnement |

**Architecture (74 nœuds)**
\`\`\`
POST /import-orders → valider client → upsert vers PostgreSQL
POST /generate-recs → récupérer commandes → exécuter algorithmes → upsert résultats
GET  /get-recs      → récupérer par mode + client_id
GET  /customer-recs → personnalisé + rachat fusionnés
ScheduleTrigger (quotidien) → purger commandes > 90 jours
\`\`\`

**Motif SQL Panier de Marché**
Pour chaque paire de commandes (A,B) achetés par le même client : incrémenter co_purchase_count(A,B). La requête retourne les articles avec le plus grand compte pour le produit courant.

**Pourquoi n8n Plutôt que Python ?**
Les backends de recommandation typiques nécessitent : service de modèle, env Python, monitoring, réentraînement. Celui-ci délivre 4 modes de recommandation avec SQL + webhooks purs, déployable en quelques heures, maintenable sans code.`,
    longDescriptionAr: `محرك توصيات إنتاجي مبني بالكامل بـ n8n + PostgreSQL — لا خادم Python، لا بنية تحتية ML.

**4 خوارزميات توصية**
| الوضع | الخوارزمية | حالة الاستخدام |
|------|-----------|---------|
| الرائج | الأكثر شراءً في نافذة 7 أيام | الصفحة الرئيسية |
| الشراء المشترك | تحليل سلة السوق | "يُشترى معاً في الغالب" |
| مخصص | تاريخ العميل → أعلى غير مطلوب | العملاء العائدون |
| إعادة الشراء | مواد استهلاكية سبق شراؤها | بريد التجديد |

**البنية (74 عقدة)**
\`\`\`
POST /import-orders → التحقق من العميل → upsert في PostgreSQL
POST /generate-recs → جلب الطلبات → تشغيل الخوارزميات → upsert النتائج
GET  /get-recs      → جلب حسب الوضع + client_id
GET  /customer-recs → دمج المخصص + إعادة الشراء
ScheduleTrigger (يومي) → حذف الطلبات > 90 يوماً
\`\`\`

**نمط SQL لسلة السوق**
لكل زوج طلبات (A,B) اشتراهما نفس العميل: زيادة co_purchase_count(A,B).

**لماذا n8n بدلاً من Python؟**
يوفر 4 أوضاع توصية بـ SQL + webhooks خالصة، قابل للنشر خلال ساعات، قابل للصيانة بدون كود.`,
    category: ["agents", "backend"],
    tags: ["n8n", "PostgreSQL", "Market Basket", "Recommendation", "Webhooks", "Automation"],
    featured: false,
    dataset: "Custom e-commerce order data via REST API",
    datasetFr: "Données de commandes e-commerce personnalisées via API REST",
    datasetAr: "بيانات طلبات التجارة الإلكترونية المخصصة عبر REST API",
    results: [
      { label: "Recommendation modes", value: "4" },
      { label: "n8n nodes", value: "74" },
      { label: "Server required", value: "None" },
      { label: "Daily cleanup", value: "Automated" },
    ],
    techStack: ["n8n", "PostgreSQL", "JavaScript (Code nodes)", "REST webhooks"],
    approach: "4-algorithm recommendation engine with upsert, daily scheduler, webhook API",
    approachFr: "Moteur de recommandation à 4 algorithmes avec upsert, planificateur quotidien, API webhook",
    approachAr: "محرك توصيات بـ 4 خوارزميات مع upsert، جدولة يومية، API webhook",
  },
  {
    id: "rag-multiagent",
    title: "RAG Multi-Agent System (n8n + Pinecone)",
    titleFr: "Système Multi-Agents RAG (n8n + Pinecone)",
    titleAr: "نظام متعدد الوكلاء RAG (n8n + Pinecone)",
    description: "109-node n8n: Google Drive PDF → Pinecone vector store → Cohere embeddings → Ollama AI Agent → Airtop browser scraping → Apify actors. 5 sub-workflows. Full RAG + conversation memory.",
    descriptionFr: "n8n à 109 nœuds : PDF Google Drive → store vectoriel Pinecone → embeddings Cohere → Agent IA Ollama → scraping Airtop → acteurs Apify. 5 sous-workflows. RAG complet + mémoire conversationnelle.",
    descriptionAr: "n8n بـ 109 عقدة: PDF Google Drive → مخزن متجه Pinecone → تضمينات Cohere → وكيل ذكاء اصطناعي Ollama → تجريف Airtop → ممثلو Apify. 5 سير عمل فرعية. RAG كامل + ذاكرة محادثة.",
    longDescription: `Massive 109-node n8n multi-agent system combining RAG, web scraping, and AI orchestration.

**5 Sub-Workflows**

**1. Google Drive PDF OCR**
Drive trigger → download → OCR API → field extraction → Google Sheets append

**2. RAG Pipeline**
PDF → Recursive CharTextSplitter (1K chars, 200 overlap) → Cohere embed-english-v3.0 → Pinecone upsert → AI Agent query

**3. Airtop Web Scraping**
Headless browser: navigate → wait → click → type → extract → structured output (JS-rendered pages)

**4. Competitive Research (Apify)**
Apify actors (Amazon/LinkedIn scrapers) → dataset → Ollama synthesis → structured report

**5. Chat Interface**
n8n Chat → Ollama Llama3.1 AI Agent → conversation memory → multi-tool calling (vector search + scraper + DB)

**Technology Stack**
| Service | Role |
|---------|------|
| Pinecone | Vector store (1536-d) |
| Cohere | Embeddings (embed-english-v3.0) |
| Ollama | Local LLM (Llama3.1, zero API cost) |
| Airtop | Headless browser for JS-rendered pages |
| Apify | Web scraping actors |
| Google Workspace | Drive + Sheets + Gmail |

**Why 109 Nodes?**
Each workflow has error handling branches, conditional routing, and validation steps. Explicit flow makes the system auditable and production-reliable.`,
    longDescriptionFr: `Système multi-agents n8n massif de 109 nœuds combinant RAG, scraping web et orchestration IA.

**5 Sous-Workflows**

**1. OCR Google Drive PDF**
Déclencheur Drive → téléchargement → API OCR → extraction de champs → ajout Google Sheets

**2. Pipeline RAG**
PDF → Recursive CharTextSplitter (1K chars, 200 chevauchement) → Cohere embed-english-v3.0 → upsert Pinecone → requête Agent IA

**3. Scraping Web Airtop**
Navigateur headless : naviguer → attendre → cliquer → saisir → extraire → sortie structurée (pages rendues JS)

**4. Recherche Concurrentielle (Apify)**
Acteurs Apify (scrapers Amazon/LinkedIn) → dataset → synthèse Ollama → rapport structuré

**5. Interface de Chat**
Chat n8n → Agent IA Ollama Llama3.1 → mémoire conversationnelle → appel multi-outils (recherche vectorielle + scraper + BDD)

**Stack Technologique**
| Service | Rôle |
|---------|------|
| Pinecone | Vector store (1 536 dimensions) |
| Cohere | Embeddings (embed-english-v3.0) |
| Ollama | LLM local (Llama3.1, zéro coût API) |
| Airtop | Navigateur headless pour pages rendues JS |
| Apify | Acteurs de scraping web |
| Google Workspace | Drive + Sheets + Gmail |

**Pourquoi 109 Nœuds ?**
Chaque workflow a des branches de gestion d'erreurs, du routage conditionnel et des étapes de validation. Le flux explicite rend le système auditable et fiable en production.`,
    longDescriptionAr: `نظام متعدد الوكلاء ضخم من 109 عقدة يجمع RAG، تجريف الويب، وتنسيق الذكاء الاصطناعي.

**5 سير عمل فرعية**

**1. OCR لملفات PDF من Google Drive**
مشغّل Drive → تنزيل → API OCR → استخراج الحقول → إلحاق Google Sheets

**2. خط أنابيب RAG**
PDF → Recursive CharTextSplitter (1K حرف، 200 تداخل) → Cohere embed-english-v3.0 → upsert Pinecone → استعلام وكيل AI

**3. تجريف الويب بـ Airtop**
متصفح headless: تصفح → انتظار → نقر → كتابة → استخراج → مخرجات منظمة (صفحات JS-rendered)

**4. البحث التنافسي (Apify)**
ممثلو Apify (Amazon/LinkedIn) → مجموعة بيانات → تركيب Ollama → تقرير منظم

**5. واجهة المحادثة**
محادثة n8n → وكيل Ollama Llama3.1 AI → ذاكرة محادثة → استدعاء متعدد الأدوات

**مكدس التقنيات**
| الخدمة | الدور |
|---------|------|
| Pinecone | مخزن متجه (1,536 بُعد) |
| Cohere | تضمينات (embed-english-v3.0) |
| Ollama | LLM محلي (Llama3.1، تكلفة API صفر) |
| Airtop | متصفح headless للصفحات JS-rendered |
| Apify | ممثلو تجريف الويب |

**لماذا 109 عقدة؟**
كل سير عمل له فروع معالجة أخطاء، توجيه شرطي، وخطوات تحقق. التدفق الصريح يجعل النظام قابلاً للمراجعة وموثوقاً في الإنتاج.`,
    category: ["agents"],
    tags: ["RAG", "Pinecone", "n8n", "Cohere", "Ollama", "Airtop", "Apify", "Vector Store"],
    featured: false,
    results: [
      { label: "n8n nodes", value: "109" },
      { label: "Sub-workflows", value: "5" },
      { label: "Vector store", value: "Pinecone" },
      { label: "LLM", value: "Ollama Llama3.1" },
    ],
    techStack: ["n8n", "Pinecone", "Cohere", "Ollama", "Airtop", "Apify", "Google Workspace"],
    approach: "Multi-agent RAG: PDF ingestion + vector search + web scraping + multi-tool LLM",
    approachFr: "RAG multi-agents : ingestion PDF + recherche vectorielle + scraping web + LLM multi-outils",
    approachAr: "RAG متعدد الوكلاء: استيعاب PDF + بحث متجه + تجريف الويب + LLM متعدد الأدوات",
  },
  {
    id: "microservices",
    title: "Microservices Architecture (Spring Boot)",
    titleFr: "Architecture Microservices (Spring Boot)",
    titleAr: "بنية الخدمات الدقيقة (Spring Boot)",
    description: "Production microservices: Spring Boot, Apache Kafka event streaming, OAuth2/Keycloak auth, gRPC inter-service calls, API gateway, Docker. Event-driven design with per-service PostgreSQL isolation.",
    descriptionFr: "Microservices de production : Spring Boot, streaming d'événements Apache Kafka, auth OAuth2/Keycloak, appels inter-services gRPC, passerelle API, Docker. Conception orientée événements avec isolation PostgreSQL par service.",
    descriptionAr: "خدمات دقيقة إنتاجية: Spring Boot، دفق أحداث Apache Kafka، مصادقة OAuth2/Keycloak، استدعاءات gRPC بين الخدمات، بوابة API، Docker. تصميم قائم على الأحداث مع عزل PostgreSQL لكل خدمة.",
    longDescription: `Production microservices system with event-driven architecture.

**Service Topology**
\`\`\`
Client → Spring Cloud Gateway (API gateway)
  → Keycloak (OAuth2/OIDC auth)
  → Service A ←→ Kafka ←→ Service B
  → Service C --gRPC--> Service D
  → PostgreSQL (per-service DB isolation)
\`\`\`

**Key Decisions**
| Problem | Solution | Rationale |
|---------|---------|-----------|
| Async communication | Apache Kafka | Decoupling + durability + replay |
| Sync internal calls | gRPC | Typed contracts + 5–10× faster than REST |
| Authentication | Keycloak OAuth2 | Centralized, industry-standard |
| Service routing | Spring Cloud Gateway | Filter chains + circuit breaking |

**Kafka Events**
OrderCreated, PaymentProcessed, InventoryUpdated — 7-day retention enables service replay after failures.

**gRPC vs REST**
- Internal (service→service): gRPC (binary, typed, fast)
- External (browser→gateway): REST/JSON (compatibility, debuggability)

**Keycloak OAuth2**
JWT tokens with service-level scopes. Service accounts for machine-to-machine auth. Token introspection at gateway — no per-service auth logic.`,
    longDescriptionFr: `Système de microservices production avec architecture orientée événements.

**Topologie des Services**
\`\`\`
Client → Spring Cloud Gateway (passerelle API)
  → Keycloak (auth OAuth2/OIDC)
  → Service A ←→ Kafka ←→ Service B
  → Service C --gRPC--> Service D
  → PostgreSQL (isolation BDD par service)
\`\`\`

**Décisions Clés**
| Problème | Solution | Justification |
|---------|---------|-----------|
| Communication async | Apache Kafka | Découplage + durabilité + replay |
| Appels sync internes | gRPC | Contrats typés + 5–10× plus rapide que REST |
| Authentification | Keycloak OAuth2 | Centralisé, standard industriel |
| Routage des services | Spring Cloud Gateway | Chaînes de filtres + circuit breaking |

**Événements Kafka**
OrderCreated, PaymentProcessed, InventoryUpdated — rétention 7 jours permettant aux services de rejouer après défaillances.

**gRPC vs REST**
- Interne (service→service) : gRPC (binaire, typé, rapide)
- Externe (navigateur→passerelle) : REST/JSON (compatibilité, debuggabilité)

**Keycloak OAuth2**
Tokens JWT avec périmètres au niveau service. Comptes de service pour l'auth machine-à-machine. Introspection des tokens à la passerelle — pas de logique d'auth par service.`,
    longDescriptionAr: `نظام خدمات دقيقة إنتاجي مع بنية قائمة على الأحداث.

**طوبولوجيا الخدمات**
\`\`\`
العميل → Spring Cloud Gateway (بوابة API)
  → Keycloak (مصادقة OAuth2/OIDC)
  → الخدمة A ←→ Kafka ←→ الخدمة B
  → الخدمة C --gRPC--> الخدمة D
  → PostgreSQL (عزل قاعدة بيانات لكل خدمة)
\`\`\`

**القرارات الرئيسية**
| المشكلة | الحل | المبرر |
|---------|---------|-----------|
| تواصل غير متزامن | Apache Kafka | فصل + متانة + إعادة التشغيل |
| استدعاءات متزامنة داخلية | gRPC | عقود مكتوبة + 5-10× أسرع من REST |
| المصادقة | Keycloak OAuth2 | مركزي، معيار الصناعة |
| توجيه الخدمات | Spring Cloud Gateway | سلاسل فلاتر + كسر الدائرة |

**أحداث Kafka**
OrderCreated، PaymentProcessed، InventoryUpdated — احتفاظ 7 أيام يُتيح إعادة تشغيل الخدمات بعد الأعطال.

**gRPC مقابل REST**
- داخلي (خدمة→خدمة): gRPC (ثنائي، مكتوب، سريع)
- خارجي (متصفح→بوابة): REST/JSON (توافق، قابلية التصحيح)

**Keycloak OAuth2**
رموز JWT بنطاقات مستوى الخدمة. حسابات خدمة للمصادقة بين الآلات. فحص الرموز عند البوابة — لا منطق مصادقة لكل خدمة.`,
    category: ["backend", "deployment"],
    tags: ["Spring Boot", "Kafka", "Keycloak", "gRPC", "Docker", "Java", "Microservices"],
    githubUrl: "https://github.com/ELHAKKI-OSSAMA/DEveloppement-d-un-micro-service-v2",
    featured: false,
    techStack: ["Java", "Spring Boot", "Apache Kafka", "Keycloak", "gRPC", "Docker", "PostgreSQL"],
    approach: "Event-driven Kafka + Keycloak OAuth2 + gRPC sync calls + Spring Cloud Gateway",
    approachFr: "Kafka orienté événements + OAuth2 Keycloak + appels sync gRPC + Spring Cloud Gateway",
    approachAr: "Kafka قائم على الأحداث + OAuth2 Keycloak + استدعاءات gRPC متزامنة + Spring Cloud Gateway",
  },
];

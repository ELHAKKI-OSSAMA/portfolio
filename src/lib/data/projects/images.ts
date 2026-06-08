export interface ProjectImage {
  src: string;
  caption: string;
}

export const projectImages: Record<string, ProjectImage[]> = {
  // ── FEATURED ──────────────────────────────────────────────────────────────
  "ieee-fraud": [
    { src: "/projects/ieee-fraud/cell_007_img00.png", caption: "Class distribution — 3.5% fraud rate (20K vs 570K transactions)" },
    { src: "/projects/ieee-fraud/cell_009_img02.png", caption: "Transaction amount (log scale) + fraud rate by ProductCD" },
    { src: "/projects/ieee-fraud/cell_026_img04.png", caption: "LightGBM feature importance — top 30 features ranked" },
    { src: "/projects/ieee-fraud/cell_032_img05.png", caption: "Model OOF AUC-ROC comparison — all 6 models" },
    { src: "/projects/ieee-fraud/cell_035_img06.png", caption: "Final model rankings with confusion metrics" },
    { src: "/projects/ieee-fraud/cell_038_img07.png", caption: "Submission fraud probability distribution" },
  ],

  // ── Replaced with dedicated kaggle_output images (cleaner than notebook cells) ──
  "cancer-segmentation": [
    { src: "/projects/cancer-segmentation/eda_distribution.png",  caption: "Dataset distribution — 437 benign / 210 malignant / 133 normal + tumor coverage" },
    { src: "/projects/cancer-segmentation/sample_images.png",     caption: "Sample ultrasound images with ground-truth segmentation masks (all 3 classes)" },
    { src: "/projects/cancer-segmentation/training_curves.png",   caption: "Training loss & Dice/IoU curves — all 9 architectures over 30 epochs" },
    { src: "/projects/cancer-segmentation/model_comparison.png",  caption: "Benchmark — Dice, IoU, F1, Precision, Recall across 9 models" },
    { src: "/projects/cancer-segmentation/radar_chart.png",       caption: "Radar chart — multi-metric performance comparison across architectures" },
    { src: "/projects/cancer-segmentation/overlays.png",          caption: "Segmentation overlay predictions — DeepLabV3+ (best) vs ground truth" },
    { src: "/projects/cancer-segmentation/visual_predictions.png", caption: "Side-by-side: input → ground truth → predictions for top 4 models" },
  ],

  "ethereum-fraud": [
    { src: "/projects/ethereum-fraud/cell_006_img00.png", caption: "Class distribution (22.1% fraud) + feature correlation heatmap" },
    { src: "/projects/ethereum-fraud/cell_013_img01.png", caption: "Random Forest baseline — confusion matrix + ROC + feature importance" },
    { src: "/projects/ethereum-fraud/cell_025_img02.png", caption: "F1 vs decision threshold — optimal threshold selection curve" },
    { src: "/projects/ethereum-fraud/cell_027_img03.png", caption: "Stacking ensemble — confusion matrix + ROC & precision-recall curves" },
    { src: "/projects/ethereum-fraud/cell_029_img04.png", caption: "SHAP bar chart — XGBoost top fraud indicators" },
    { src: "/projects/ethereum-fraud/cell_031_img06.png", caption: "Final model AUC comparison (XGB / LGB / CatBoost / Stacking)" },
  ],

  "nmt": [
    { src: "/projects/nmt/eda.png",            caption: "EDA — sentence length distributions, vocabulary stats, EN/FR corpus overview" },
    { src: "/projects/nmt/results.png",        caption: "BLEU score comparison across all 4 models" },
    { src: "/projects/nmt/cell_016_img01.png", caption: "Custom Seq2Seq training loss (LSTM encoder-decoder + Bahdanau attention)" },
    { src: "/projects/nmt/cell_020_img02.png", caption: "mBART fine-tuning loss curve" },
  ],

  // ── Twitter: replaced with dedicated per-model confusion matrices ──
  "twitter-sentiment": [
    { src: "/projects/twitter-sentiment/class_distribution.png", caption: "Sentiment class distribution — train & val (4 classes, 74K tweets)" },
    { src: "/projects/twitter-sentiment/cm_lr_tfidf.png",        caption: "Confusion matrix — LR + TF-IDF (85% accuracy, fastest model)" },
    { src: "/projects/twitter-sentiment/history_lstm.png",       caption: "LSTM training history — accuracy & loss over 15 epochs" },
    { src: "/projects/twitter-sentiment/history_bert.png",       caption: "BERT training — rapid convergence to 96.6% in 4 epochs" },
    { src: "/projects/twitter-sentiment/cm_bert.png",            caption: "Confusion matrix — DistilBERT (96.6% — best model)" },
    { src: "/projects/twitter-sentiment/model_comparison.png",   caption: "All 6 models ranked by validation accuracy" },
  ],

  "fake-news": [
    { src: "/projects/fake-news/cell_008_img00.png", caption: "Class balance + text length distributions (real vs fake)" },
    { src: "/projects/fake-news/cell_029_img01.png", caption: "F1 vs decision threshold — optimal cutoff selection" },
    { src: "/projects/fake-news/cell_035_img02.png", caption: "ROC curves — LR / SVM / RF / XGB / LGB / Voting / Stacking" },
    { src: "/projects/fake-news/cell_036_img03.png", caption: "Model accuracy & AUC comparison bar chart" },
    { src: "/projects/fake-news/cell_039_img04.png", caption: "Confusion matrix — Soft Voting Ensemble (99.86% accuracy)" },
    { src: "/projects/fake-news/cell_041_img05.png", caption: "Precision / Recall / F1 breakdown — Stacking ensemble" },
  ],

  "human-activity": [
    { src: "/projects/human-activity/cell_007_img00.png", caption: "Activity class distribution — train vs test (6 classes)" },
    { src: "/projects/human-activity/cell_010_img03.png", caption: "t-SNE 2D visualization — non-linear activity separability" },
    { src: "/projects/human-activity/cell_012_img05.png", caption: "Subject distribution — 21 train subjects vs 9 test subjects" },
    { src: "/projects/human-activity/cell_029_img07.png", caption: "All models ranked by accuracy — SVM tops at 96.1%" },
    { src: "/projects/human-activity/cell_031_img08.png", caption: "Scree + cumulative variance — 95% at ~95 PCA components" },
    { src: "/projects/human-activity/cell_035_img11.png", caption: "5-fold CV score distributions — XGBoost 99.05%" },
  ],

  "telco-churn": [
    { src: "/projects/telco-churn/cell_006_img00.png", caption: "Churn rate distribution — 26.54% churners" },
    { src: "/projects/telco-churn/cell_007_img01.png", caption: "Tenure / monthly charges / total charges distributions by churn" },
    { src: "/projects/telco-churn/cell_023_img04.png", caption: "SHAP bar plot — top churn drivers (XGBoost Optuna)" },
    { src: "/projects/telco-churn/cell_027_img06.png", caption: "ROC curves — top 5 models" },
    { src: "/projects/telco-churn/cell_029_img08.png", caption: "Confusion matrix + report — XGBoost Optuna (AUC 0.8484)" },
  ],

  "vehicle-fraud": [
    { src: "/projects/vehicle-fraud/cell_008_img00.png", caption: "Class imbalance — 14,497 legitimate vs 923 fraud (5.99%)" },
    { src: "/projects/vehicle-fraud/cell_011_img03.png", caption: "Numerical feature distributions stratified by fraud status" },
    { src: "/projects/vehicle-fraud/cell_030_img04.png", caption: "Model leaderboard — AUC, Avg Precision, F1, Recall (16 models)" },
    { src: "/projects/vehicle-fraud/cell_034_img07.png", caption: "F1 / Precision / Recall vs threshold — AdaBoost tuning" },
    { src: "/projects/vehicle-fraud/cell_037_img09.png", caption: "SHAP bar + beeswarm — Fault dominates (37.9%)" },
    { src: "/projects/vehicle-fraud/cell_039_img12.png", caption: "5-fold CV AUC distribution — RF / XGB / LGB / CatBoost" },
  ],

  // ── Face recognition: replaced cells with actual search result images ──
  "face-recognition": [
    { src: "/projects/face-recognition/cell_008_img00.png",          caption: "Sample LFW face images — diverse poses, lighting, aging" },
    { src: "/projects/face-recognition/cell_010_img01.png",          caption: "Query person (Abdullah_Gul) — 128-d ResNet-50 embedding extracted" },
    { src: "/projects/face-recognition/match_Abdullah_Gul_0001.jpg", caption: "Top match #1 — Euclidean distance to anchor embedding" },
    { src: "/projects/face-recognition/match_Abdullah_Gul_0002.jpg", caption: "Top match #2 — correct identity retrieved from 13K images" },
    { src: "/projects/face-recognition/match_Abdullah_Gul_0003.jpg", caption: "Top match #3 — different pose, same identity confirmed" },
    { src: "/projects/face-recognition/match_Abdullah_Gul_0004.jpg", caption: "Top match #4 — 18/19 images correctly retrieved (94.7% recall)" },
  ],

  "facial-emotion": [
    { src: "/projects/facial-emotion/cell_008_img00.png", caption: "Class distribution — 4,772 Happy vs 281 Fear (17× imbalance)" },
    { src: "/projects/facial-emotion/cell_009_img01.png", caption: "Sample RAF-DB images — 5 examples per emotion class" },
    { src: "/projects/facial-emotion/cell_026_img05.png", caption: "ResNet50 accuracy curves — 2-phase training (warmup + fine-tune)" },
    { src: "/projects/facial-emotion/cell_031_img07.png", caption: "EfficientNetB3 training curves — 2-phase (val acc 0.7321)" },
    { src: "/projects/facial-emotion/cell_035_img09.png", caption: "ViT-Small training — warmup + fine-tune (val acc 0.8403)" },
    { src: "/projects/facial-emotion/cell_041_img13.png", caption: "GradCAM attention maps — discriminative facial regions per emotion" },
  ],

  // ── Cancer detection: replaced cells with yolov8m_cancer dedicated run ──
  "cancer-detection": [
    { src: "/projects/cancer-detection/class_distribution.png",       caption: "Dataset distribution — 2,145 / 194 / 99 annotations (train/val/test)" },
    { src: "/projects/cancer-detection/bbox_distribution.png",        caption: "Bounding box size distribution — many small lesions (left-skewed)" },
    { src: "/projects/cancer-detection/metrics_comparison.png",       caption: "YOLOv8 n/s/m comparison — mAP50, mAP50-95, Precision, Recall, F1" },
    { src: "/projects/cancer-detection/BoxPR_curve.png",              caption: "Precision-Recall curve — YOLOv8m (best model, test mAP50=0.6782)" },
    { src: "/projects/cancer-detection/confusion_matrix_normalized.png", caption: "Normalized confusion matrix — cancer detection on test set" },
    { src: "/projects/cancer-detection/training_results.png",         caption: "YOLOv8m training curves — box/cls/dfl loss + mAP over epochs" },
    { src: "/projects/cancer-detection/gt_vs_pred.png",               caption: "Ground truth vs YOLOv8m predictions — side-by-side comparison" },
  ],

  "yolo-animals": [
    { src: "/projects/yolo-animals/BoxPR_curve.png",    caption: "Precision-Recall curve — 80 classes, overall mAP@0.5=0.668" },
    { src: "/projects/yolo-animals/image0.jpg",         caption: "Detection inference — YOLOv8n multi-class animal bounding boxes" },
    { src: "/projects/yolo-animals/image1.jpg",         caption: "Detection inference — high-confidence animal detections" },
    { src: "/projects/yolo-animals/image2.jpg",         caption: "Detection inference — diverse species predictions" },
    { src: "/projects/yolo-animals/cell_011_img00.png", caption: "Inference result — Tiger (0.967) and other high-confidence detections" },
  ],

  "plant-disease": [
    { src: "/projects/plant-disease/cell_006_img00.png", caption: "Class distribution — severe 42.5× imbalance across 15 disease classes" },
    { src: "/projects/plant-disease/cell_007_img01.png", caption: "Sample leaf images — 20 from different disease categories" },
    { src: "/projects/plant-disease/cell_024_img04.png", caption: "MobileNetV2 2-phase training — head warmup + fine-tune curves" },
    { src: "/projects/plant-disease/cell_033_img07.png", caption: "All 6 models ranked by validation accuracy (ensemble highest)" },
    { src: "/projects/plant-disease/cell_036_img08.png", caption: "Normalized 15×15 confusion matrix — ensemble model" },
    { src: "/projects/plant-disease/cell_037_img09.png", caption: "Per-class F1 scores — classes needing most improvement" },
  ],

  "butterfly-classification": [
    { src: "/projects/butterfly-classification/cell_004_img00.png", caption: "Augmentation pipeline — rotation, flip, zoom, brightness" },
    { src: "/projects/butterfly-classification/cell_009_img03.png", caption: "Vanilla CNN architecture — layers and parameter counts" },
    { src: "/projects/butterfly-classification/cell_021_img09.png", caption: "Multi-loss auxiliary head — main + auxiliary loss curves" },
    { src: "/projects/butterfly-classification/cell_027_img11.png", caption: "Ensemble predictions combining all 4 training phases" },
    { src: "/projects/butterfly-classification/cell_084_img29.png", caption: "Per-species performance summary and confusion analysis" },
  ],

  "chest-ct": [
    { src: "/projects/chest-ct/cell_005_img00.png",  caption: "Dataset — 613/72/315 train/val/test + class distribution" },
    { src: "/projects/chest-ct/cell_007_img02.png",  caption: "Sample CT scan slices — tissue diversity across 4 cancer types" },
    { src: "/projects/chest-ct/cell_019_img06.png",  caption: "Model leaderboard — all 16 methods sorted by test accuracy" },
    { src: "/projects/chest-ct/cell_025_img10.png",  caption: "Confusion matrix — MobileNetV2 (best, test acc = 0.6603)" },
    { src: "/projects/chest-ct/cell_026_img11.png",  caption: "EfficientNetV2S training curves" },
    { src: "/projects/chest-ct/cell_031_img13.png",  caption: "Normalized confusion matrices — top 4 models side-by-side" },
  ],

  // ── TACO: replaced cells with dedicated multi-model comparison plots ──
  "taco-segmentation": [
    { src: "/projects/taco-segmentation/cell_005_img00.png",   caption: "Dataset — 1,500 images, 4,784 annotations, 60 waste categories" },
    { src: "/projects/taco-segmentation/cell_006_img01.png",   caption: "Sample annotated trash images with bounding box overlays" },
    { src: "/projects/taco-segmentation/model_comparison.png", caption: "5-model mAP50 comparison — RT-DETR-L wins (0.2778)" },
    { src: "/projects/taco-segmentation/frcnn_loss_curve.png", caption: "Faster R-CNN training loss — 0.7608 → 0.1141 over 15 epochs" },
    { src: "/projects/taco-segmentation/rtdetr_BoxPR_curve.png", caption: "RT-DETR-L Precision-Recall curve — best architecture for trash detection" },
    { src: "/projects/taco-segmentation/predictions.png",      caption: "Detection predictions on test images — bounding boxes + classes" },
  ],

  "sign-language": [
    { src: "/projects/sign-language/cell_007_img00.png", caption: "Load 2,062 images — normalize + class distribution analysis" },
    { src: "/projects/sign-language/cell_008_img01.png", caption: "3×3 sample grid — hand gestures for digits 0–9" },
    { src: "/projects/sign-language/cell_012_img02.png", caption: "Training stopped at epoch 23 — val acc = 96.13%, loss = 0.165" },
    { src: "/projects/sign-language/cell_013_img03.png", caption: "Confusion matrices — train and validation sets" },
    { src: "/projects/sign-language/cell_013_img04.png", caption: "Per-digit F1 scores" },
  ],

  "breast-cancer-classification": [
    { src: "/projects/breast-cancer-classification/cell_006_img00.png", caption: "Class distribution — 37% malignant (212) vs 63% benign (357)" },
    { src: "/projects/breast-cancer-classification/cell_008_img02.png", caption: "Feature correlation heatmap — 30 diagnostic features" },
    { src: "/projects/breast-cancer-classification/cell_009_img03.png", caption: "Box plots — top 6 most discriminating features by diagnosis" },
    { src: "/projects/breast-cancer-classification/cell_038_img05.png", caption: "Model comparison — accuracy, F1, recall, AUC for all 14 models" },
    { src: "/projects/breast-cancer-classification/cell_040_img07.png", caption: "Confusion matrices — CatBoost / Tuned SVM / Extra Trees" },
    { src: "/projects/breast-cancer-classification/cell_044_img09.png", caption: "Feature importance (tuned RF) — concave_points_worst dominates" },
  ],

  // ── Time series ──
  "book-recommender": [
    { src: "/projects/book-recommender/results_comparison.png", caption: "Algorithm comparison — RMSE / Precision@10 / Recall@10 across all paradigms" },
    { src: "/projects/book-recommender/cell_006_img00.png",     caption: "BookCrossing rating distribution + dataset overview" },
  ],

  // ── Energy forecast: replaced cells with dedicated clean plots ──
  "energy-forecast": [
    { src: "/projects/energy-forecast/eda_overview.png",          caption: "6-panel EDA — time series, distribution, hourly/DOW/monthly/yearly patterns" },
    { src: "/projects/energy-forecast/model_comparison.png",      caption: "All 10 models — MAE / RMSE / MAPE comparison (LightGBM wins at 0.66%)" },
    { src: "/projects/energy-forecast/predictions_comparison.png", caption: "Forecast vs actual — XGBoost, LightGBM, Prophet side-by-side" },
    { src: "/projects/energy-forecast/cell_012_img02.png",        caption: "Feature correlation heatmap — 26 engineered lag/rolling/cyclical features" },
  ],

  // ── Stock prediction: now featuring advanced models from kaggle_output ──
  "stock-prediction": [
    { src: "/projects/stock-prediction/overview.png",          caption: "Project overview — delta-target methodology, 4,211 EURUSD candles" },
    { src: "/projects/stock-prediction/correlation_delta.png", caption: "Feature correlation with Δclose — upper_shadow leads (0.618)" },
    { src: "/projects/stock-prediction/grand_leaderboard.png", caption: "Grand leaderboard — all 30+ models ranked by RMSE & directional accuracy" },
    { src: "/projects/stock-prediction/nsga2_pareto.png",      caption: "NSGA-2 Pareto front — multi-objective optimization (RMSE vs complexity)" },
    { src: "/projects/stock-prediction/ga_final_comparison.png", caption: "Genetic algorithm variants — Basic vs Advanced vs Neural Chromosome" },
    { src: "/projects/stock-prediction/pred_bilstm_attention.png", caption: "BiLSTM + Attention predictions vs actual Δclose" },
    { src: "/projects/stock-prediction/pred_diffusion_ddpm.png",   caption: "Diffusion Model (DDPM) probabilistic forecasting" },
    { src: "/projects/stock-prediction/pred_gnn.png",              caption: "GNN (Feature-Correlation Graph) — graph-based price forecasting" },
  ],

  "covid-prediction": [
    { src: "/projects/covid-prediction/cell_010_img00.png", caption: "Daily new cases time series — Jan to Jul 2020" },
    { src: "/projects/covid-prediction/cell_013_img01.png", caption: "SEIR epidemic model fit to observed data" },
    { src: "/projects/covid-prediction/cell_017_img04.png", caption: "Walk-forward TimeSeriesSplit CV folds" },
    { src: "/projects/covid-prediction/cell_023_img10.png", caption: "ARIMA forecast with confidence intervals" },
    { src: "/projects/covid-prediction/cell_031_img17.png", caption: "LSTM multi-step predictions" },
    { src: "/projects/covid-prediction/cell_052_img27.png", caption: "Model RMSE comparison — SEIR / ML / LSTM / Transformer" },
  ],

  "weather-pattern": [
    { src: "/projects/weather-pattern/cell_006_img00.png", caption: "Feature correlation — temperature, humidity, wind, pressure, visibility" },
    { src: "/projects/weather-pattern/cell_009_img02.png", caption: "K-Means 2D PCA + cluster profiles heatmap (best K=3)" },
    { src: "/projects/weather-pattern/cell_014_img05.png", caption: "STL decomposition — trend, seasonal, residual + anomaly flags" },
    { src: "/projects/weather-pattern/cell_019_img09.png", caption: "Random Forest precipitation — confusion matrix + feature importance" },
    { src: "/projects/weather-pattern/cell_026_img11.png", caption: "LightGBM classification — 98% macro F1 on precipitation type" },
    { src: "/projects/weather-pattern/cell_034_img14.png", caption: "Prophet forecast — actual vs predicted with 16 anomaly days" },
  ],

  "supply-chain": [
    { src: "/projects/supply-chain/cell_009_img00.png", caption: "Data loading — 180K orders, 54.8% late deliveries, class balance" },
    { src: "/projects/supply-chain/cell_010_img01.png", caption: "Leakage audit — removed post-fulfillment columns (shipping_delay, benefit)" },
    { src: "/projects/supply-chain/cell_026_img03.png", caption: "Late delivery rate by Shipping Mode + Order Count by Market" },
    { src: "/projects/supply-chain/cell_027_img04.png", caption: "Order profit distribution (clipped ±500) + descriptive statistics" },
    { src: "/projects/supply-chain/cell_032_img05.png", caption: "Classification comparison — LR / DT / RF / XGB / LGB / CatBoost / Voting" },
    { src: "/projects/supply-chain/cell_034_img06.png", caption: "Confusion matrix + report — LightGBM (best, AUC = 0.8563)" },
  ],

  "linkedin-jobs": [
    { src: "/projects/linkedin-jobs/cell_006_img00.png", caption: "Job postings distribution by industry sector" },
    { src: "/projects/linkedin-jobs/cell_008_img02.png", caption: "Top 50 most in-demand skills (213K skill-job pairs)" },
    { src: "/projects/linkedin-jobs/cell_011_img04.png", caption: "Salary distribution by pay period (yearly / hourly / monthly)" },
    { src: "/projects/linkedin-jobs/cell_028_img06.png", caption: "Salary prediction — XGBoost vs LightGBM performance" },
    { src: "/projects/linkedin-jobs/cell_036_img11.png", caption: "Top salary-driving features (job title, company size, location)" },
    { src: "/projects/linkedin-jobs/cell_040_img14.png", caption: "Geographic job distribution — top hiring cities" },
  ],

  // ── Game AI: replaced notebook cells with dedicated training plots ──
  "game-ai": [
    { src: "/projects/game-ai/cartpole_training.png",       caption: "CartPole-v1 training curve — MA-100 reaches 441.1, solved at episode 300" },
    { src: "/projects/game-ai/lunarlander_training.png",    caption: "LunarLander-v3 training curve — solved at episode 207 (MA-100=202)" },
    { src: "/projects/game-ai/comparison_dqn_variants.png", caption: "DQN variant comparison — DQN vs Double vs Dueling vs PER" },
    { src: "/projects/game-ai/qvalue_cartpole.png",         caption: "Q-value analysis — CartPole-v1 value landscape over training" },
    { src: "/projects/game-ai/qvalue_lunarlander.png",      caption: "Q-value analysis — LunarLander-v3 state-action values" },
    { src: "/projects/game-ai/evaluation_distributions.png", caption: "Evaluation reward distributions — best model across 20 test episodes" },
  ],

  "network-security": [
    { src: "/projects/network-security/cell_006_img00.png", caption: "Traffic dataset — 1,000 packets, 14 features, 90/10 imbalance" },
    { src: "/projects/network-security/cell_007_img01.png", caption: "Class imbalance — 90% normal, 10% anomalies" },
    { src: "/projects/network-security/cell_016_img02.png", caption: "DL architectures — Residual DNN, Dilated CNN, BiLSTM+Attention" },
    { src: "/projects/network-security/cell_021_img04.png", caption: "5× data augmentation — Gaussian, masking, MixUp, class-conditional" },
    { src: "/projects/network-security/cell_022_img07.png", caption: "Augmented dataset — 6,220 samples from 1,244 original (5×)" },
    { src: "/projects/network-security/cell_023_img08.png", caption: "MC-Dropout uncertainty estimation — model confidence per sample" },
  ],

  // ── Poetry gen: updated with model dashboard + real BERT/GPT2/T5 context ──
  "poetry-gen": [
    { src: "/projects/poetry-gen/model_dashboard.png",  caption: "Model dashboard — BERT / GPT-2 / T5 fine-tuning comparison on Poetry Foundation" },
    { src: "/projects/poetry-gen/cell_006_img00.png",   caption: "Word frequency distribution — Poetry Foundation corpus" },
    { src: "/projects/poetry-gen/cell_006_img01.png",   caption: "Vocabulary coverage by top poets" },
    { src: "/projects/poetry-gen/cell_016_img02.png",   caption: "Training perplexity curve — convergence across transformer variants" },
    { src: "/projects/poetry-gen/cell_040_img03.png",   caption: "Generated poem samples — temperature sampling vs beam search" },
  ],

  "handwritten-recognition": [
    { src: "/projects/handwritten-recognition/cell_022_img00.png", caption: "CRNN architecture variants — ResNet18/34/EfficientNet + BiLSTM" },
    { src: "/projects/handwritten-recognition/cell_022_img01.png", caption: "TrOCR dataset preparation + HuggingFace fine-tuning setup" },
    { src: "/projects/handwritten-recognition/cell_024_img02.png", caption: "Training with AMP + gradient accumulation" },
    { src: "/projects/handwritten-recognition/cell_026_img03.png", caption: "TrOCR CER=0.0481 vs CRNN-ResNet34 CER=0.0502 (best two models)" },
  ],

  "food-delivery": [
    { src: "/projects/food-delivery/cell_008_img00.png", caption: "EDA — delivery time distribution (target variable)" },
    { src: "/projects/food-delivery/cell_009_img01.png", caption: "Boxplots — delivery time by weather / traffic / vehicle type" },
    { src: "/projects/food-delivery/cell_010_img02.png", caption: "Correlation heatmap — numeric features" },
    { src: "/projects/food-delivery/cell_025_img03.png", caption: "16-model comparison — RMSE & R² rankings" },
    { src: "/projects/food-delivery/cell_029_img04.png", caption: "Feature importance — tuned XGBoost" },
    { src: "/projects/food-delivery/cell_031_img05.png", caption: "Residual analysis + prediction error distribution" },
  ],

  "power-consumption": [
    { src: "/projects/power-consumption/cell_008_img00.png", caption: "UCI household power consumption (2.9M records, 2006–2010)" },
    { src: "/projects/power-consumption/cell_015_img02.png", caption: "STL seasonal decomposition — trend, seasonal, residual" },
    { src: "/projects/power-consumption/cell_021_img05.png", caption: "Stationarity test (ADF) + ARIMA parameter selection" },
    { src: "/projects/power-consumption/cell_028_img07.png", caption: "Prophet forecast — trend + yearly + weekly seasonality" },
    { src: "/projects/power-consumption/cell_036_img11.png", caption: "LSTM encoder-decoder — multi-step predictions" },
    { src: "/projects/power-consumption/cell_048_img19.png", caption: "Model comparison — MAE / RMSE / MAPE across all approaches" },
  ],

  // ── Product demand: replaced cells with dedicated SHAP + forecast plots ──
  "product-demand": [
    { src: "/projects/product-demand/eda_overview.png",           caption: "EDA overview — demand patterns, seasonality, product categories" },
    { src: "/projects/product-demand/model_comparison.png",       caption: "19-model leaderboard — ML vs classical TS vs deep learning" },
    { src: "/projects/product-demand/shap_beeswarm.png",          caption: "SHAP beeswarm — individual feature impact on CatBoost predictions" },
    { src: "/projects/product-demand/shap_bar.png",               caption: "SHAP feature importance bar — top demand drivers" },
    { src: "/projects/product-demand/walkforward_cv.png",         caption: "Walk-forward CV folds — expanding window validation strategy" },
    { src: "/projects/product-demand/conformal_prediction.png",   caption: "Conformal prediction intervals — calibrated uncertainty bounds" },
    { src: "/projects/product-demand/quantile_regression.png",    caption: "Quantile regression P10/P50/P90 — probabilistic demand forecast" },
    { src: "/projects/product-demand/transformer_comparison.png", caption: "Deep learning comparison — LSTM vs TFT vs N-BEATS (all underperform ML)" },
  ],

  "speech-commands": [
    { src: "/projects/speech-commands/cell_007_img00.png", caption: "Dataset — 41,849 audio files, 30 command classes, clean + noisy" },
    { src: "/projects/speech-commands/cell_008_img01.png", caption: "Mel-spectrogram examples — 64 mel bins + SpecAugment visualization" },
    { src: "/projects/speech-commands/cell_017_img02.png", caption: "Training — validation accuracy reaches 1.0000 at epoch 8" },
    { src: "/projects/speech-commands/cell_020_img03.png", caption: "Confusion matrix — perfect F1=1.00 across all 30 commands" },
    { src: "/projects/speech-commands/cell_022_img04.png", caption: "Per-class accuracy — 100% for all 30 speech commands" },
  ],

  "line-detection": [
    { src: "/projects/line-detection/cell_005_img00.png", caption: "Synthetic test image — horizontal / vertical / diagonal lines" },
    { src: "/projects/line-detection/cell_009_img02.png", caption: "Canny edge detection — kernel=3, low=190, high=250" },
    { src: "/projects/line-detection/cell_013_img04.png", caption: "Standard Hough Transform — 2.53ms ± 0.09ms, 22 lines" },
    { src: "/projects/line-detection/cell_021_img13.png", caption: "Probabilistic Hough on dashcam image — 47 segments (4.29ms)" },
    { src: "/projects/line-detection/cell_029_img21.png", caption: "LSD (Line Segment Detector) — 23.98ms, 422 segments (sub-pixel)" },
    { src: "/projects/line-detection/cell_034_img25.png", caption: "Speed benchmark — Standard/Probabilistic Hough 6–10× faster than LSD" },
  ],

  "yolo-parking": [
    { src: "/projects/yolo-parking/test_image_0.png",               caption: "Raw parking lot image — 30 CVAT-annotated images, 2 classes" },
    { src: "/projects/yolo-parking/val_batch0_pred.jpg",            caption: "Validation batch predictions — YOLOv8n bounding boxes" },
    { src: "/projects/yolo-parking/inference_result.jpg",           caption: "Inference demo — 9 free + 21 not-free spaces @ 41.2ms" },
    { src: "/projects/yolo-parking/confusion_matrix_normalized.png", caption: "Normalized confusion matrix — test mAP50=0.942, mAP50-95=0.798" },
    { src: "/projects/yolo-parking/BoxPR_curve.png",                caption: "Precision-Recall curve — val mAP50=0.994" },
    { src: "/projects/yolo-parking/BoxF1_curve.png",                caption: "F1-score vs confidence threshold — early stopped at epoch 74" },
  ],
};

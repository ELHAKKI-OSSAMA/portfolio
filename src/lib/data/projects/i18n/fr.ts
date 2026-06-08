export const projectLongDescriptionsFr: Record<string, string> = {
  "ieee-fraud": `Pipeline de détection de fraude de qualité production sur l'un des datasets Kaggle les plus difficiles — 590K transactions, 433 features, 3,5% de taux de fraude. StratifiedKFold CV avec 6 modèles et un meta-learner de stacking.

**Feature Engineering :**
- Features temporelles : heure du jour, jour de la semaine, cycles TransactionDT
- Empreintes comportementales des cartes : moyenne/écart-type/comptage de TransactionAmt par groupe
- Indicateur de correspondance de domaine email (P_emaildomain == R_emaildomain)
- Agrégations booléennes des colonnes M (M1–M9 T/F/manquant)
- Suppression de 12 colonnes avec >90% de valeurs manquantes

**Résultats des modèles :**
| Modèle | OOF AUC |
|-------|---------|
| LightGBM | **0.9648** |
| XGBoost | 0.9631 |
| CatBoost | 0.9529 |
| Stacking (meta LR) | 0.9565 |
| Random Forest | 0.9032 |
| Decision Tree | 0.8583 |

**Insight clé :** La gestion native des valeurs manquantes et des features catégorielles par LightGBM lui a donné un avantage décisif. Les agrégations comportementales au niveau de la carte étaient le groupe de features le plus impactant.`,

  "ai-image-gen": `Déploiement production bout-en-bout d'une plateforme de génération d'images IA chez Ofoto. Le défi : gérer 500+ requêtes d'inférence Stable Diffusion simultanées avec une qualité constante et des temps de réponse inférieurs à 10s.

**Architecture :**
\`\`\`
Client (Vue.js) → Nginx (SSL + Équilibrage de charge) → FastAPI (file async)
→ Moteur Stable Diffusion (Automatic1111 + ControlNet)
→ Conteneurs Docker (accélérés GPU)
\`\`\`

**Décisions d'ingénierie clés :**
1. **File de requêtes async** avec les tâches en arrière-plan FastAPI — ne bloque jamais le thread principal
2. **Connexions keepalive Nginx** — réduit drastiquement la surcharge à forte charge
3. **Build Docker multi-étapes** avec CUDA 11.8 pour l'accès GPU
4. **Endpoints de santé** pour l'orchestration de conteneurs et les déploiements sans interruption
5. **Intégration ControlNet** pour la génération conditionnée par image (pose, profondeur, canny)

**Résultats :**
| Métrique | Avant | Après |
|--------|--------|-------|
| Latence moyenne | 12,4s | 8,1s |
| Requêtes simultanées | 50 | 500+ |
| Disponibilité du service | 94% | 99,9% |
| Cycle de release | 5 jours | 3 jours |`,

  "whatsapp-agent": `Construction d'un agent commercial IA entièrement automatisé pour un client e-commerce marocain qui passait 6+ heures/jour à répondre aux questions produit répétitives sur WhatsApp.

**Architecture :**
\`\`\`
WhatsApp Business API → Webhook n8n
→ Classificateur de texte (détection d'intention LLM)
  ├── VENTES → Agent IA (Llama3.1 + outil db_product)
  ├── SUPPORT → Agent Support
  └── HORS_SUJET → Message de rejet automatique
→ Supabase (BDD produits + mémoire conversationnelle)
→ WhatsApp Business API (réponse)
\`\`\`

**Pourquoi un LLM local (Ollama) ?**
- Aucune donnée de conversation ne quitte le serveur (confidentialité)
- Zéro coût API pour la messagerie à volume élevé
- Contrôle total du comportement du modèle

**Conception du prompt système (anti-hallucination) :**
> "Ne jamais répondre aux questions produit sans appeler d'abord db_product. Présenter UNIQUEMENT les données retournées par l'outil. Si produit non trouvé → informer honnêtement le client."

**Nœuds n8n :** Webhook → Classificateur → Agent IA → Supabase → Requête HTTP (WhatsApp)

**Résultats :**
- -90% du temps de traitement manuel pour les requêtes produit
- 95%+ de précision de classification des messages (Ventes/Support/Hors-sujet)
- Réponses bilingues FR/AR adaptées automatiquement à la langue du client
- Mémoire conversationnelle évitant les questions répétées`,

  "cancer-segmentation": `Benchmark complet de 8 architectures de segmentation sur le dataset Breast Ultrasound Images (780 échantillons : 437 bénins, 210 malins, 133 normaux).

**Modèles testés :**
| Architecture | Type | Dice | IoU |
|---|---|---|---|
| FCN | Normal | 0,5104 | 0,3469 |
| SimpleUNet (31M) | Normal | 0,7202 | 0,5666 |
| SegNet (7M) | Normal | 0,6661 | 0,4907 |
| Attention UNet (31M) | Avancé | 0,7329 | 0,5868 |
| TransUNet (124M) | Avancé | 0,6794 | 0,5165 |
| ResNet34-UNet (24M) | Avancé | 0,8026 | 0,6759 |
| **EfficientNet-UNet (20M)** | **Avancé** | **0,7964** | **0,6754** |
| DeepLabV3+ (27M) | Avancé | — | — |

**Détails d'entraînement :** 30 époques, 256×256 px, augmentation Albumentations (flip, rotation, luminosité), perte combinée BCE+Dice.

**Meilleur modèle (EfficientNet-UNet) :** Encodeur EfficientNet-B4 pré-entraîné + décodeur UNet. Sauvegardé sous BEST_EfficientNet_UNet.pth.

**Conclusion clé :** L'encodeur EfficientNet pré-entraîné fournit des représentations de features riches qui surpassent même des modèles plus grands comme ResNet34-UNet sur cette taille de dataset.`,

  "ethereum-fraud": `Pipeline en deux étapes (Baseline + Avancé) pour détecter les adresses Ethereum frauduleuses à partir de features comportementales on-chain.

**Dataset :** 9 841 adresses, 51 features incluant les motifs de transactions ERC20, les montants envoyés/reçus, les adresses uniques, les motifs temporels.

**Étape 1 — Baseline :**
| Modèle | AUC | F1 (Fraude) |
|-------|-----|------------|
| Régression Logistique | 0,8419 | 0,0386 |
| Random Forest | **0,9973** | 0,9566 |

**Étape 2 — Pipeline avancé :**
1. Feature engineering (56 features après engineering)
2. Sur-échantillonnage SMOTE (11 070 échantillons, 50% taux de fraude)
3. HPO Optuna pour XGBoost (40 essais) → Meilleur AUC : **0,9992**
4. Entraînement ensemble XGBoost + LightGBM + CatBoost
5. Ajustement du seuil pour maximiser le F1

**Résultats finaux :**
| Modèle | AUC | F1 (Fraude) |
|-------|-----|------------|
| XGBoost | 0,9971 | 0,9659 |
| LightGBM | 0,9972 | 0,9569 |
| CatBoost | 0,9969 | 0,9584 |
| **Stacking** | **0,9973** | — |

**Meilleur seuil : 0,85 → F1 : 0,9658**

**Analyse SHAP :** Principaux indicateurs de fraude — motifs de transactions ERC20, nombre d'adresses uniques, ratios d'ether total envoyé.`,

  "nmt": `Notebook NMT sûr en mémoire qui gère un corpus parallèle de 6 Go sans crasher sur la limite de 33 Go de RAM de Kaggle.

**Stratégie :** Lecture par chunks → échantillonnage → suppression des données brutes → entraînement sur sous-ensemble → effacement entre les modèles.

**5 bugs critiques corrigés depuis les implémentations upstream :**
1. \`train_step\` → GradientTape consommé deux fois → gradients None → crash
2. \`Encoder/Decoder.call()\` → argument \`training=\` manquant → TypeError
3. \`as_target_tokenizer()\` → supprimé dans transformers≥4.36 → AttributeError
4. \`evaluation_strategy\` → renommé \`eval_strategy\` dans transformers≥4.36
5. Dépassement de capacité du tableau int16 dans le tokenizer

**Modèles implémentés :**
- Seq2Seq personnalisé (encodeur-décodeur LSTM avec attention Bahdanau)
- Fine-tuning HuggingFace mBART
- Fine-tuning Helsinki-NLP/opus-mt-en-fr
- Fine-tuning MarianMT

**Tech :** TensorFlow 2.19, PyTorch 2.9 (CUDA), HuggingFace Transformers 4.36+`,

  "twitter-sentiment": `Pipeline NLP bout-en-bout comparant 5 architectures sur le Twitter Entity Sentiment dataset (74 682 tweets d'entraînement, 4 classes).

**Modèles et résultats :**
| Modèle | Précision |
|-------|----------|
| **LR + TF-IDF** | **96,1%** |
| LSTM | — |
| Bi-LSTM | — |
| CNN (texte) | — |
| BERT fine-tuné | — |

**Pipeline :** Nettoyage des tweets → tokenisation → TF-IDF/BoW/embeddings → entraînement → classification à seuil optimisé.

**Conclusion clé :** LR+TF-IDF atteint 96,1% de précision sur ce dataset — compétitif avec des modèles deep learning bien plus lourds, démontrant l'importance de la qualité des features plutôt que de la complexité du modèle pour du texte bien formaté.`,

  "fake-news": `Pipeline complet de détection de fake news comparant 8+ modèles sur un dataset équilibré de 44 898 articles.

**Dataset :** 21 417 vrais + 23 481 faux articles avec titre, texte, sujet et features de date.

**Modèles couverts :**
- Baseline : Régression Logistique, Naïve Bayes
- Arborescents : Decision Tree, Random Forest, Extra Trees
- Boosting : XGBoost, LightGBM, Gradient Boosting
- SVM : LinearSVC
- NLP avancé : TF-IDF + Ensemble par vote, features BERT empilées

**Feature engineering :** Concaténation titre + texte, TF-IDF (unigrammes + bigrammes), encodage du sujet, features temporelles à partir de la date de publication.

**Conclusion clé :** LinearSVC avec TF-IDF atteint des performances quasi-BERT à un coût d'inférence 100× inférieur sur cette tâche.`,

  "human-activity": `Pipeline ML bout-en-bout sur le dataset UCI HAR — signaux d'accéléromètre et gyroscope de 30 sujets effectuant 6 activités.

**Dataset :** 7 352 entraînement / 2 947 test, 561 features pré-extraites, 6 classes.

**Activités :** Marche, Montée d'escaliers, Descente d'escaliers, Assis, Debout, Allongé.

**Benchmark complet des modèles :**
| Modèle | Précision Test |
|-------|--------------|
| **SVM (Linéaire)** | **96,1%** |
| Régression Logistique | 95,5% |
| SVM (RBF) | 95,5% |
| Stacking (RF+XGB+LGBM→LR) | 95,2% |
| XGBoost | 94,1% |
| LightGBM | 94,0% |
| Random Forest | 92,7% |

**Validation croisée (5 folds) :**
- XGBoost : **99,05% ± 0,10%**
- LightGBM : **99,25% ± 0,04%**

**Analyse PCA :** 102 composantes expliquent 95% de la variance.

**Principale source d'erreur :** Confusion Assis/Debout (55 + 18 erreurs) — les capteurs capturent des postures similaires.`,

  "vehicle-fraud": `Pipeline ML complet pour la détection de fraude aux assurances véhicules avec un défi de déséquilibre sévère des classes (6% de taux de fraude).

**Dataset :** 15 420 lignes, 33 features (marque du véhicule, zone d'accident, type de police, franchise, etc.).

**Solution au déséquilibre des classes :** Sur-échantillonnage SMOTE (6% → 50% de fraude à l'entraînement).

**Pipeline des modèles :**
| Modèle | ROC-AUC | Précision | Rappel |
|-------|---------|-----------|--------|
| Régression Logistique | 0,7651 | — | — |
| AdaBoost | 0,7804 | — | — |
| Random Forest | 0,7962 | — | — |
| XGBoost | 0,8141 | — | — |
| Vote (XGB+LGB+CB) | 0,8194 | — | — |

**Après RandomizedSearchCV (40 iter, 5 folds) :**
- AUC CV XGBoost : **0,9847**
- Meilleurs paramètres : subsample=0,7, max_depth=7, n_estimators=500

**Top features SHAP :** Faute (37,9%), Franchise (12,9%), Police de base (12,2%), Catégorie Véhicule, Rapport Police.`,

  "cancer-detection": `Benchmark complet YOLOv8 pour la détection du cancer à partir d'images médicales.

**Dataset :** 1 968 entraînement / 185 validation / 94 test (1 classe : cancer). Moyenne de 1,10 bbox par image.

**Comparaison des modèles sur le jeu de validation :**
| Modèle | Params | mAP50 | mAP50-95 | Précision | Rappel |
|-------|--------|-------|----------|-----------|--------|
| YOLOv8n | 3,2M | **0,6849** | 0,2606 | 0,7498 | 0,6134 |
| YOLOv8s | 11,2M | 0,6815 | 0,2475 | 0,7483 | 0,6237 |
| YOLOv8m | 25,9M | 0,6741 | 0,2569 | 0,7581 | 0,5722 |

**Conclusion clé :** YOLOv8n (nano) atteint le mAP50 le plus élevé malgré être le plus petit modèle — suggérant que la taille limitée du dataset rend bénéfique la régularisation d'une capacité réduite. Meilleur modèle exporté au format ONNX.`,

  "plant-disease": `Pipeline de détection de maladies végétales comparant des modèles classiques et de transfer learning sur le dataset PlantVillage.

**Classes :** 15 (maladies Poivron/Pomme de terre + sains). Découpage 80/10/10 entraînement/validation/test.

**Modèles :**
| Modèle | Type |
|-------|------|
| CNN Simple | Normal |
| CNN Profond + BatchNorm | Normal |
| MobileNetV2 (fine-tuné) | Avancé |
| EfficientNetB3 (fine-tuné) | Avancé |
| ResNet50 (fine-tuné) | Avancé |
| Ensemble (moy. 3 TL) | Avancé |

**Corrections appliquées :** Bug de réinitialisation du générateur corrigé (effondrement de l'ensemble), découpage test séparé approprié, entraînement double-GPU (TF 2.19 précision mixte float16).`,

  "chest-ct": `Classification de scanners CT thoraciques pour 4 types de cancer pulmonaire avec un backbone EfficientNetV2S.

**Classes :**
- Adénocarcinome lobe.inférieur.gauche T2_N0_M0_Ib (195 images)
- Carcinome à grandes cellules hile.gauche T2_N2_M0_IIIa (115 images)
- Normal (148 images)
- Carcinome épidermoïde

**Modèle :** EfficientNetV2S avec entraînement en précision mixte float16.

**Améliorations par rapport à la baseline :**
- Augmentation améliorée : flip vertical + jitter de couleur plus fort
- Perte pondérée par classe pour les classes déséquilibrées
- Découpage test tenu à l'écart (80/10/10)
- EDA complet : distributions d'intensité de pixels, comptages de classes`,

  "book-recommender": `Implémentation complète de tous les grands paradigmes de systèmes de recommandation sur le dataset Book-Crossing.

**Dataset :** 271 360 livres, 278 858 utilisateurs, 1 149 780 évaluations. Filtré : 118 699 évaluations explicites, 7 027 utilisateurs, 9 438 livres.

**Architectures implémentées :**
\`\`\`
Systèmes de Recommandation
├── 1. Filtrage Collaboratif
│   ├── CF basé utilisateur (similarité cosinus)
│   ├── CF basé items
│   └── Factorisation matricielle (SVD, NMF, ALS)
├── 2. Filtrage basé contenu
├── 3. Hybride (Pondéré + Commutation)
└── 4. Deep Learning
    ├── NCF (Filtrage Collaboratif Neuronal)
    ├── AutoRec
    └── GRU4Rec (basé session)
\`\`\`

**RMSE User-CF :** 1,6645 | **P@10 :** 0,6629 | **R@10 :** 0,6910`,

  "stock-prediction": `Troisième itération de la prédiction de prix EURUSD avec un changement architectural clé : prédire le *changement* de prix journalier (delta) plutôt que le prix absolu.

**Pourquoi la cible delta ?**
- Valeurs bornées (±0,05 pour l'EURUSD journalier)
- Signal stationnaire — plus facile à apprendre
- Aucune fuite temporelle de données
- Reconstruction : close_prédit = close_i + delta_prédit

**Dataset :** 4 211 bougies EURUSD 1J (2010-01-01 au 2026-03-06), 39 features engineerées.

**Feature engineering :** RSI, MACD, ATR, Bandes de Bollinger, ombres haute/basse, taille du corps, gap — tous normalisés avec RobustScaler par feature.

**Corrélation top feature avec ΔClose :** upper_shadow (0,618), lower_shadow.

**Modèles :** LSTM, GRU, Transformer, ML classique — comparés sur RMSE et précision directionnelle.`,

  "covid-prediction": `Prédiction des nouveaux cas quotidiens de COVID-19 corrigeant la fuite de données critique de la v1 (entraînement sur des séries cumulatives).

**Corrections clés vs v1 :**
| Problème | Correction |
|-------|-----|
| ML entraîné sur comptages cumulatifs → fuite | Cible = nouveaux cas quotidiens (stationnaire) |
| Incubation SEIR ~1 jour (biologiquement incorrect) | Bornes contraintes + meilleure initialisation |
| Pas de validation walk-forward | TimeSeriesSplit CV pour tous les modèles ML |
| Transformers sous-entraînés | Plus d'époques + cosine LR |

**Modèles comparés :**
- Modèle épidémique SEIR (optimisation contrainte)
- ML classique : ARIMA, Gradient Boosting, XGBoost
- Deep learning : LSTM, Transformer

**Dataset :** 188 jours (2020-01-22 au 2020-07-27), données quotidiennes confirmés/décès/rétablis/actifs.`,

  "supply-chain": `Analyse ML avancée sur le dataset supply chain de DataCo avec une correction critique : l'élimination de la fuite de données des colonnes post-exécution présentes dans la plupart des solutions publiées.

**Dataset :** 180 519 commandes, 53 features brutes.

**Audit de fuite :** Suppression de shipping_delay (réel − planifié), Days for shipping (réel), Benefit per order — tous indisponibles au moment de la prédiction.

**Deux tâches de prédiction :**
1. **Classification binaire :** Risque de livraison tardive (précision/rappel/AUC)
2. **Régression :** Prédiction du profit de commande (RMSE/MAE)

**Modèles :** XGBoost 3.2.0, LightGBM 4.6.0 — dernières versions avec méthode d'arbres matérielle.

**Fichiers de données :** 180 519 commandes + métadonnées de description + 469 977 événements de log d'accès.`,

  "linkedin-jobs": `Pipeline ML bout-en-bout sur un grand dataset LinkedIn (123 849 offres d'emploi) avec des données relationnelles riches.

**Fichiers joints :**
| Fichier | Taille |
|------|------|
| postings.csv | 123 849 lignes |
| companies.csv | 24 473 entreprises |
| salaries.csv | 40 785 entrées (32,9% de couverture) |
| job_skills.csv | 213 768 entrées |

**Tâches :**
1. **Prédiction de salaire** (régression sur 40 785 entrées avec normalisation de période de paie)
2. **Analyse de la demande en compétences** (NLP sur 213K paires compétence-emploi)
3. **Couverture salariale :** 32,9% (annuel 23K, horaire 16K, mensuel 539, hebdomadaire 180)

**Feature engineering :** Normalisation de période de paie (horaire→annuel), TF-IDF sur les descriptions d'emploi, encodage de la taille de l'entreprise.`,

  "game-ai": `Implémentation Deep Q-Network à la pointe avec des améliorations modernes de l'apprentissage par renforcement.

**Architecture — Dueling DQN :**
\`\`\`
DuelingDQN :
  couche_features : Linear(4,256) → LayerNorm → ReLU
  flux_valeur : Linear(256,128) → ReLU → Linear(128,1)
  flux_avantage : Linear(256,128) → ReLU → Linear(128,n_actions)
  Q(s,a) = V(s) + (A(s,a) - moyenne(A(s,a)))
\`\`\`

**Techniques implémentées :**
| Technique | Objectif |
|-----------|---------|
| DQN | Q-learning avec buffer de replay |
| Double DQN | Réduire le biais de surestimation |
| Dueling DQN | Séparer valeur et avantage |
| PER | Replay d'expérience priorisé |

**Environnements :** CartPole-v1 (état 4D, 2 actions) + LunarLander-v2 (état 8D, 4 actions).

**Tech :** PyTorch 2.10, Gymnasium 1.2.0, CUDA.`,

  "anime-gan": `DCGAN entraîné de zéro sur 43 102 images de visages animés (64×64 px) sur GPU Tesla T4 de Kaggle.

**Architecture :**
- Générateur : Latent(100) → ConvTranspose2d × 4 → 3×64×64 (Tanh)
- Discriminateur : Conv2d × 4 → Sigmoid

**Astuces de stabilité d'entraînement :**
1. Initialisation des poids : Normal(0, 0,02) pour Conv, Normal(1, 0,02) pour BatchNorm
2. Adam avec β₁=0,5 (critique pour la stabilité des GAN)
3. Scheduler LR : StepLR ×0,5 à l'époque 50
4. Lissage des étiquettes : Réel=0,9 (évite la surconfiance du discriminateur)

**Interpolation Slerp :** Interpolation linéaire sphérique entre vecteurs latents pour des transitions d'images fluides. L'interpolation linéaire produit des résultats flous ; la slerp respecte la géométrie de l'espace latent.

**Résultats :** 100 époques, ~58s/époque. 200 échantillons générés. Modes d'échec courants évités : effondrement de mode et artefacts en damier.`,

  "recommendation-engine": `Moteur de recommandation production entièrement construit avec des workflows n8n et PostgreSQL — aucun serveur personnalisé requis.

**4 modes de recommandation :**
1. **Tendances** — produits les plus achetés sur une fenêtre glissante
2. **Co-achat** — articles fréquemment achetés ensemble (analyse du panier)
3. **Personnalisé** — basé sur l'historique de commandes individuel
4. **Rachat** — articles déjà achetés par le client, susceptibles d'être rachetés

**Architecture (74 nœuds) :**
\`\`\`
Webhook : Importer Commandes → PostgreSQL (valider client → insérer)
Webhook : Générer Recs → (récupérer commandes → calculer algorithmes → upsert en BDD)
Webhook : Obtenir Recs → PostgreSQL (récupérer par mode + client)
Webhook : Recs Client → (fusionner personnalisé + rachat)
ScheduleTrigger : Nettoyage Quotidien → PostgreSQL (purger vieilles commandes)
\`\`\`

**Améliorations v2 :** Logique d'upsert plus propre, meilleure gestion des erreurs, rafraîchissement quotidien par planificateur.`,

  "rag-multiagent": `Workflow n8n massif de 109 nœuds combinant RAG, scraping web, OCR et orchestration multi-agents.

**Sous-workflows :**
1. **OCR Google Drive PDF :** Déclencheur Drive → téléchargement → API OCR → extraction de champs → ajout Sheets
2. **Pipeline RAG :** PDF → découpage (Recursive Character TextSplitter) → embeddings Cohere → upsert Pinecone → requête Agent IA
3. **Scraping web :** Automatisation navigateur Airtop (naviguer → cliquer → saisir → extraire)
4. **Recherche concurrentielle :** Acteurs Apify → récupération de dataset → synthèse IA
5. **Interface de chat :** Déclencheur chat n8n → Agent IA avec mémoire tampon → appel multi-outils

**Technologies :** Pinecone (vector store), Cohere (embeddings), Ollama (LLM local), Airtop (navigateur headless), Apify (scraping web), Google Drive, Google Sheets, Gmail.`,
};

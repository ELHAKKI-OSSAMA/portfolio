export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export type QuizBank = Record<string, QuizQuestion[]>;

export const quizData: QuizBank = {
  "python-ml-stack": [
    {
      question: "What does NumPy broadcasting allow you to do?",
      options: ["Run Python on multiple CPUs", "Perform operations on arrays of different shapes without explicit loops", "Import data from CSV files automatically", "Visualize arrays as images"],
      correct: 1,
      explanation: "Broadcasting lets NumPy stretch smaller arrays to match larger ones during arithmetic — e.g. adding a (3,) vector to a (4,3) matrix without a for loop."
    },
    {
      question: "Which pandas method removes rows with missing values?",
      options: ["df.fillna()", "df.dropna()", "df.replace()", "df.isnull()"],
      correct: 1,
      explanation: "dropna() removes rows (or columns) containing NaN. fillna() fills them with a value instead."
    },
    {
      question: "What is the key performance advantage of NumPy over plain Python lists?",
      options: ["NumPy arrays are immutable", "Operations run on contiguous C-backed memory using SIMD, skipping Python object overhead", "NumPy auto-parallelises across threads", "NumPy arrays support strings natively"],
      correct: 1,
      explanation: "NumPy stores data in contiguous typed memory and delegates math to BLAS/LAPACK routines, avoiding the per-element Python interpreter overhead."
    },
  ],

  "linear-algebra": [
    {
      question: "What does it mean for two vectors to be orthogonal?",
      options: ["They have the same magnitude", "Their dot product equals zero", "They point in the same direction", "One is a scalar multiple of the other"],
      correct: 1,
      explanation: "Orthogonal vectors are perpendicular: u·v = 0. In ML this means features are uncorrelated in a transformed space."
    },
    {
      question: "What do eigenvalues tell you about a linear transformation?",
      options: ["The number of dimensions after transformation", "How much eigenvectors are scaled (stretched/compressed) by the matrix", "The rotation angle of the transformation", "The determinant of the matrix"],
      correct: 1,
      explanation: "Av = λv — an eigenvector v is only scaled by λ, not rotated. Large eigenvalues indicate directions of high variance, which is the heart of PCA."
    },
    {
      question: "What is the rank of a matrix?",
      options: ["Its determinant", "The number of rows", "The number of linearly independent rows or columns", "The trace (sum of diagonal elements)"],
      correct: 2,
      explanation: "Rank = the dimension of the column space. A full-rank matrix has no redundant features; a rank-deficient matrix is singular (non-invertible)."
    },
  ],

  "calculus-optimization": [
    {
      question: "Why is the chain rule essential for neural network training?",
      options: ["It speeds up forward pass computations", "It lets us compute ∂L/∂w for any weight by multiplying local gradients layer by layer", "It prevents vanishing gradients", "It initialises weights correctly"],
      correct: 1,
      explanation: "Backpropagation is just the chain rule applied recursively: ∂L/∂w = (∂L/∂a)(∂a/∂z)(∂z/∂w). Each layer's gradient is a product of downstream gradients."
    },
    {
      question: "What happens when you use a learning rate that is too large?",
      options: ["Training slows down due to small steps", "The model converges to a suboptimal local minimum", "Updates overshoot the minimum and loss oscillates or diverges", "Gradients vanish to zero"],
      correct: 2,
      explanation: "Large η causes parameter updates that leap over the minimum. The loss may oscillate or blow up rather than decreasing steadily."
    },
    {
      question: "What advantage does Adam have over vanilla SGD?",
      options: ["Adam requires no learning rate", "Adam adapts the learning rate per-parameter using first and second moment estimates", "Adam avoids all local minima", "Adam is always faster in wall-clock time"],
      correct: 1,
      explanation: "Adam keeps running estimates of the gradient mean (m) and uncentred variance (v), then rescales each weight's update by 1/√v — effectively giving each parameter its own adaptive step size."
    },
  ],

  "probability-statistics": [
    {
      question: "What does Maximum Likelihood Estimation (MLE) optimise?",
      options: ["The prior probability of the parameters", "The probability of the observed data given the parameters", "The posterior probability of the parameters", "The KL divergence between distributions"],
      correct: 1,
      explanation: "MLE finds θ* = argmax P(data | θ). For Gaussian noise this reduces to minimising MSE; for Bernoulli outputs it reduces to cross-entropy."
    },
    {
      question: "What does a p-value represent?",
      options: ["The probability that the null hypothesis is true", "The probability of observing data at least as extreme as this, assuming H₀ is true", "The effect size of the experiment", "The confidence level of the result"],
      correct: 1,
      explanation: "A small p-value (< 0.05) means the data would be unlikely under H₀, giving evidence to reject it — but it does NOT give the probability H₀ is true."
    },
    {
      question: "Why does the Central Limit Theorem matter for ML evaluation?",
      options: ["It guarantees model convergence", "It justifies using normal-based confidence intervals for sample means regardless of the data distribution", "It proves gradient descent works", "It ensures training loss reaches zero"],
      correct: 1,
      explanation: "CLT says sample means converge to a normal distribution as n grows. This justifies standard error estimates and t-tests when comparing model performance across folds."
    },
  ],

  "information-theory": [
    {
      question: "What does high entropy in a probability distribution mean?",
      options: ["The distribution is highly peaked (low uncertainty)", "The distribution is nearly uniform (high uncertainty)", "The distribution has many modes", "The distribution has high variance"],
      correct: 1,
      explanation: "H(X) = -Σ p log p is maximised when all outcomes are equally likely. A peaked distribution has low entropy — one outcome dominates."
    },
    {
      question: "Why is cross-entropy used as a loss function for classification?",
      options: ["It is always convex", "It measures the average number of bits needed to encode the true label under the model's predicted distribution", "It penalises large weights (regularisation)", "It is faster to compute than MSE"],
      correct: 1,
      explanation: "Cross-entropy H(p,q) = -Σ p log q penalises confident wrong predictions logarithmically. Minimising it is equivalent to maximising log-likelihood under a categorical distribution."
    },
    {
      question: "KL divergence D_KL(P||Q) equals zero when:",
      options: ["P and Q have the same mean", "P and Q are identical distributions", "P has lower entropy than Q", "Q is the uniform distribution"],
      correct: 1,
      explanation: "D_KL(P||Q) = Σ P log(P/Q) = 0 iff P = Q everywhere. It is non-negative and asymmetric, making it a divergence rather than a true distance."
    },
  ],

  "linear-regression": [
    {
      question: "What does R² (coefficient of determination) measure?",
      options: ["The correlation between two features", "The proportion of variance in y explained by the model", "The model's mean squared error", "The number of significant predictors"],
      correct: 1,
      explanation: "R² = 1 - SS_res/SS_tot. R²=1 means perfect prediction; R²=0 means the model does no better than predicting the mean; R²<0 is possible for very bad models."
    },
    {
      question: "What is the effect of L1 (Lasso) regularisation?",
      options: ["Shrinks all weights proportionally toward zero", "Can shrink some weights to exactly zero, producing sparse models", "Prevents overfitting by adding noise", "Increases the learning rate"],
      correct: 1,
      explanation: "L1 adds λΣ|w| to the loss. The non-differentiable kink at zero creates a 'sparsity incentive' — small weights get zeroed out, effectively selecting features."
    },
    {
      question: "In logistic regression, what does the sigmoid output represent?",
      options: ["The class label (0 or 1)", "The estimated probability P(y=1 | x)", "The decision boundary distance", "The log-odds after thresholding"],
      correct: 1,
      explanation: "σ(w·x+b) maps the linear score to [0,1], giving the estimated probability of the positive class. The decision boundary is where σ = 0.5, i.e. w·x+b = 0."
    },
  ],

  "model-evaluation": [
    {
      question: "When should you prefer Recall over Precision?",
      options: ["When false positives are very costly (spam filter)", "When false negatives are very costly (cancer screening)", "When the dataset is perfectly balanced", "When the model outputs probabilities"],
      correct: 1,
      explanation: "Recall = TP/(TP+FN). Missing a cancer (false negative) is worse than a false alarm, so maximising recall is critical in medical screening."
    },
    {
      question: "What does the AUC-ROC score of 0.5 mean?",
      options: ["The model is 50% accurate", "The model is no better than random guessing", "The model has 50% recall", "The threshold is set at 0.5"],
      correct: 1,
      explanation: "AUC = 0.5 means the ROC curve lies on the diagonal — the model's ranking is no better than random. AUC = 1.0 is perfect separation."
    },
    {
      question: "Why is Stratified K-Fold preferred over regular K-Fold for imbalanced classification?",
      options: ["It is faster to compute", "It ensures each fold has the same class proportion as the full dataset", "It prevents data leakage", "It handles missing values automatically"],
      correct: 1,
      explanation: "With 95/5 class imbalance, a regular fold might have zero minority samples, making evaluation unreliable. Stratification preserves the ratio in every fold."
    },
  ],

  "error-analysis": [
    {
      question: "A model with high bias and low variance is:",
      options: ["Overfitting the training data", "Underfitting — too simple to capture the true pattern", "Correctly fitted", "Sensitive to training set size"],
      correct: 1,
      explanation: "High bias means the model's assumptions are too rigid. It makes systematic errors on both train and test sets — classic underfitting."
    },
    {
      question: "If train accuracy is 99% and validation accuracy is 65%, the primary problem is:",
      options: ["High bias", "High variance (overfitting)", "Data leakage", "Class imbalance"],
      correct: 1,
      explanation: "A large train-val gap indicates the model memorised training data but doesn't generalise — high variance. Solutions: more data, regularisation, or a simpler model."
    },
    {
      question: "What do learning curves show?",
      options: ["How loss changes with different learning rates", "Train and validation performance as a function of training set size", "The model's accuracy per class", "Gradient magnitude over epochs"],
      correct: 1,
      explanation: "Learning curves plot score vs n_train. High bias: both curves plateau low with a small gap. High variance: large gap that closes as n_train increases."
    },
  ],

  "feature-engineering": [
    {
      question: "What is data leakage in a preprocessing pipeline?",
      options: ["Using too many features", "Using information from the test/validation set during training (e.g. fitting a scaler on all data)", "Normalising features before training", "Dropping correlated features"],
      correct: 1,
      explanation: "Fitting a StandardScaler on the entire dataset before splitting lets test-set statistics influence training — inflating validation scores. Always fit transformers only on train data."
    },
    {
      question: "Why use RobustScaler instead of StandardScaler for data with outliers?",
      options: ["RobustScaler normalises to [0,1]", "RobustScaler uses median and IQR, so outliers don't distort the scaling", "RobustScaler applies log transformation automatically", "RobustScaler works only for categorical features"],
      correct: 1,
      explanation: "StandardScaler uses mean and std, which outliers inflate. RobustScaler centres on the median and scales by IQR, making it robust to extreme values."
    },
    {
      question: "What does OneHotEncoder do to a categorical feature with 5 unique values?",
      options: ["Encodes it as a single integer 1–5", "Creates 5 binary columns, one per category", "Replaces categories with their frequency", "Maps categories to their target mean"],
      correct: 1,
      explanation: "OHE creates k binary columns for k categories. This avoids implying ordinal relationships but can cause the dummy variable trap — use drop='first' to avoid it."
    },
  ],

  "naive-bayes": [
    {
      question: "What is the 'naïve' assumption in Naïve Bayes?",
      options: ["All classes are equally likely", "Features are conditionally independent given the class", "The prior is always uniform", "The model is linear"],
      correct: 1,
      explanation: "P(x₁,x₂,...|y) = ΠP(xᵢ|y). Despite being often wrong in practice, this assumption massively simplifies computation and works surprisingly well for text."
    },
    {
      question: "What problem does Laplace smoothing solve?",
      options: ["Overfitting when there are many features", "Zero probability for unseen words in the training vocabulary", "Slow training on large datasets", "Handling continuous features"],
      correct: 1,
      explanation: "Without smoothing, a word not seen in class c gives P(word|c)=0, zeroing the entire product. Adding α=1 (Laplace) ensures no term is exactly zero."
    },
    {
      question: "Which Naïve Bayes variant is best suited for raw word counts in text classification?",
      options: ["GaussianNB", "MultinomialNB", "BernoulliNB", "ComplementNB"],
      correct: 1,
      explanation: "MultinomialNB models word count distributions (term frequencies). BernoulliNB uses binary presence/absence. GaussianNB is for continuous features."
    },
  ],

  "decision-tree-rf": [
    {
      question: "What does Gini impurity measure at a decision tree split?",
      options: ["The depth of the tree at that node", "The probability of mislabelling a randomly chosen element if labelled by its class distribution", "The information gain from the split", "The number of samples in the node"],
      correct: 1,
      explanation: "Gini = 1 - Σpᵢ². A pure node (all one class) has Gini=0. Trees split to minimise the weighted Gini of child nodes."
    },
    {
      question: "How does Random Forest reduce variance compared to a single decision tree?",
      options: ["By using deeper trees", "By averaging many trees trained on bootstrapped samples with random feature subsets", "By pruning trees more aggressively", "By using Gini instead of entropy"],
      correct: 1,
      explanation: "Each tree is high-variance (overfits its bootstrap sample). Averaging de-correlates their errors, and the ensemble variance shrinks by factor ~1/n_trees when trees are uncorrelated."
    },
    {
      question: "What is the Out-of-Bag (OOB) score in Random Forest?",
      options: ["Accuracy on the training set", "Accuracy estimated using samples left out of each tree's bootstrap", "The tree's depth score", "The feature importance score"],
      correct: 1,
      explanation: "Each bootstrap sample excludes ~37% of data. Those excluded samples can validate the corresponding tree, giving a free cross-validation estimate without a separate test set."
    },
  ],

  "svm-knn-svr": [
    {
      question: "What is the support vectors' role in SVM?",
      options: ["All training points that are correctly classified", "The training points closest to the decision boundary that define the maximum margin", "The points with highest feature values", "Random anchor points for the kernel"],
      correct: 1,
      explanation: "Support vectors are the critical boundary points — the margin width is 2/||w|| and is determined entirely by these points. Removing other training points wouldn't change the hyperplane."
    },
    {
      question: "What problem does the RBF kernel solve in SVM?",
      options: ["It speeds up training on large datasets", "It implicitly maps inputs to infinite-dimensional space, allowing non-linear boundaries in original space", "It handles missing values", "It normalises features automatically"],
      correct: 1,
      explanation: "The kernel trick computes K(xᵢ,xⱼ) = φ(xᵢ)·φ(xⱼ) without explicitly computing φ. RBF creates infinite-dimensional feature maps, enabling non-linear classification."
    },
    {
      question: "What is the curse of dimensionality's main effect on KNN?",
      options: ["KNN gets slower with more features only", "In high dimensions all points become roughly equidistant, making 'nearest' neighbours meaningless", "KNN requires more memory in high dimensions", "KNN outputs incorrect class labels"],
      correct: 1,
      explanation: "As dimensions grow, the volume of space explodes. Points cluster near the hypersphere surface and pairwise distances concentrate around the same value, breaking the distance-based assumption."
    },
  ],

  "clustering": [
    {
      question: "What is the Elbow Method used for in K-Means?",
      options: ["Detecting outliers in data", "Choosing the optimal number of clusters k by finding where inertia stops decreasing sharply", "Visualising high-dimensional clusters", "Pruning the K-Means tree"],
      correct: 1,
      explanation: "Inertia decreases monotonically with k. The 'elbow' — where adding another cluster yields diminishing returns — suggests a good k. The silhouette score provides a more rigorous alternative."
    },
    {
      question: "What makes DBSCAN better than K-Means for non-spherical clusters?",
      options: ["DBSCAN converges faster", "DBSCAN groups points by density, forming clusters of arbitrary shape without requiring k to be specified", "DBSCAN handles high-dimensional data better", "DBSCAN always produces the same result"],
      correct: 1,
      explanation: "K-Means assumes convex, roughly equal-size clusters and requires k upfront. DBSCAN labels dense regions regardless of shape and marks sparse outlier points as noise."
    },
    {
      question: "In DBSCAN, what is a 'core point'?",
      options: ["The centroid of a cluster", "A point with at least MinPts neighbours within radius ε", "A point on the boundary between two clusters", "The point furthest from all other points"],
      correct: 1,
      explanation: "Core points have enough local density (≥ MinPts within ε) to anchor a cluster. Border points are within ε of a core point but not dense enough themselves. Points in neither category are noise."
    },
  ],

  "pca": [
    {
      question: "What does the first principal component represent?",
      options: ["The feature with the highest mean", "The direction of maximum variance in the data", "The most correlated pair of features", "The first column of the data matrix"],
      correct: 1,
      explanation: "PC1 is the eigenvector of the covariance matrix corresponding to the largest eigenvalue — the direction along which the data varies most."
    },
    {
      question: "If you keep 2 components from a 100-dimensional dataset and they explain 85% of variance, what did you discard?",
      options: ["85% of the information", "15% of the variance (mostly noise)", "All non-linear structure", "The 2 most important features"],
      correct: 1,
      explanation: "The discarded 98 components contain 15% of variance — often noise. The 85% retained captures the dominant structure at 50× compression."
    },
    {
      question: "Why must you centre (subtract mean) before applying PCA?",
      options: ["To ensure all values are positive", "So the covariance matrix is computed correctly around zero, not an offset mean", "To speed up the eigendecomposition", "PCA only works on standardised data"],
      correct: 1,
      explanation: "Without centring, the first PC would point toward the data mean rather than the direction of maximum spread. Centring ensures PCA captures variance, not offset."
    },
  ],

  "anomaly": [
    {
      question: "How does Isolation Forest detect anomalies?",
      options: ["By measuring each point's distance to the nearest centroid", "By isolating points using random splits — anomalies need fewer splits to isolate", "By fitting a Gaussian and flagging low-probability points", "By clustering and labelling small clusters as anomalies"],
      correct: 1,
      explanation: "Anomalies are sparse and 'different', so random axis-parallel cuts isolate them quickly (short path length). Normal points, clustered together, require many splits."
    },
    {
      question: "What is the contamination parameter in Isolation Forest?",
      options: ["The amount of noise added to the data", "The expected proportion of outliers in the dataset", "The number of trees in the forest", "The random seed for reproducibility"],
      correct: 1,
      explanation: "Contamination sets the threshold for the anomaly score. If you expect 5% outliers, set contamination=0.05 and the model labels the 5% with lowest anomaly scores as outliers."
    },
    {
      question: "When would you prefer LOF over Isolation Forest?",
      options: ["On very large datasets (millions of rows)", "When anomalies are defined locally — a point is only anomalous relative to its neighbourhood density", "When interpretability is important", "On high-dimensional image data"],
      correct: 1,
      explanation: "LOF (Local Outlier Factor) compares each point's local density to its neighbours. A point in a sparse region surrounded by dense clusters is anomalous locally, even if not globally."
    },
  ],

  "gradient-boosting": [
    {
      question: "What does each new tree in gradient boosting model?",
      options: ["The original target y", "The negative gradient of the loss (pseudo-residuals from previous predictions)", "A random subset of features", "The squared errors of the previous tree"],
      correct: 1,
      explanation: "Each tree fits the gradient direction that reduces loss most. For MSE this equals the residuals yᵢ - ŷᵢ, but for other losses (log-loss, etc.) it's the negative gradient."
    },
    {
      question: "What is XGBoost's key algorithmic innovation over vanilla GBM?",
      options: ["It uses deeper trees", "It adds L1/L2 regularisation in the tree scoring objective and uses second-order Taylor expansion", "It trains trees in parallel across all data", "It uses random feature subsets like Random Forest"],
      correct: 1,
      explanation: "XGBoost's tree score = (Σgᵢ)²/( Σhᵢ + λ) - γT, where g and h are first and second derivatives. The regularisation term λ shrinks leaf weights, preventing overfitting."
    },
    {
      question: "What advantage does LightGBM's leaf-wise growth have over level-wise growth?",
      options: ["Leaf-wise trees are always shallower", "Leaf-wise grows the leaf with maximum loss reduction — faster convergence with fewer leaves, though prone to overfitting on small datasets", "Leaf-wise avoids missing value handling", "Leaf-wise is more interpretable"],
      correct: 1,
      explanation: "Level-wise (depth-first) grows all leaves at a level before going deeper. Leaf-wise picks the single best leaf globally, getting more loss reduction per leaf and converging faster — but needs num_leaves and min_child_samples tuning."
    },
  ],

  "bagging-stacking": [
    {
      question: "Why does bagging reduce variance?",
      options: ["It uses simpler base models", "Averaging many models trained on different bootstrap samples cancels out individual overfitting errors", "It penalises large weights across models", "It reduces the number of features used"],
      correct: 1,
      explanation: "Each bootstrapped model overfits differently. When their errors are uncorrelated, averaging reduces variance by factor ~1/B. The bias stays the same — this is pure variance reduction."
    },
    {
      question: "In stacking, what is the meta-learner trained on?",
      options: ["The original training features", "Out-of-fold predictions from base models on the training set", "The test set predictions from base models", "The average of base model weights"],
      correct: 1,
      explanation: "To avoid leakage, base models generate predictions using cross-validation (OOF). The meta-learner then learns which base models to trust for different inputs."
    },
    {
      question: "Boosting reduces which component of the bias-variance tradeoff?",
      options: ["Variance — by averaging many models", "Bias — by iteratively correcting residual errors from previous models", "Both bias and variance equally", "Neither — it only increases model complexity"],
      correct: 1,
      explanation: "Each boosted stage corrects the systematic mistakes of previous stages, driving bias toward zero. However, running too many stages can increase variance (overfitting)."
    },
  ],

  "ova-ovo": [
    {
      question: "How many binary classifiers does One-vs-All (OvA) train for a 5-class problem?",
      options: ["10", "5", "4", "25"],
      correct: 1,
      explanation: "OvA trains k classifiers for k classes — each distinguishes one class from all others. OvO trains k(k-1)/2 = 10 classifiers, one per pair. OvA is more common due to lower training cost."
    },
    {
      question: "Why might OvA produce poorly calibrated probabilities?",
      options: ["It uses sigmoid outputs", "Each binary classifier is trained on an imbalanced dataset (1 class vs all others), biasing predicted probabilities", "OvA doesn't output probabilities", "OvA uses softmax which sums to >1"],
      correct: 1,
      explanation: "OvA trains class 1 vs 7 classes — a 1:7 imbalance. The classifier's probability estimates are skewed. The raw OvA probabilities across classes won't sum to 1 and need calibration."
    },
    {
      question: "When does Softmax output have an advantage over OvA/OvO?",
      options: ["When training a random forest", "When training a neural network end-to-end — Softmax gives a proper probability distribution over all classes simultaneously", "When the problem has only 2 classes", "When using SVMs"],
      correct: 1,
      explanation: "Softmax normalises all class scores into a proper distribution in one pass, and the whole network is trained jointly. OvA/OvO decompose one multi-class problem into independent binary problems."
    },
  ],

  "hyperparameter-tuning": [
    {
      question: "Why is Random Search often more efficient than Grid Search?",
      options: ["Random Search always evaluates fewer combinations", "Not all hyperparameters matter equally — random sampling explores more of the important dimensions per evaluation", "Random Search finds the global optimum", "Grid Search can't handle continuous parameters"],
      correct: 1,
      explanation: "Bergstra & Bengio showed that if only a few hyperparameters truly matter, random search evaluates a wider range of those critical dimensions per budget than grid search wastes on unimportant ones."
    },
    {
      question: "What makes Bayesian optimisation smarter than random search?",
      options: ["It uses more compute per trial", "It builds a surrogate model of the objective and uses an acquisition function to select the next most promising point", "It searches on a finer grid", "It evaluates all combinations in parallel"],
      correct: 1,
      explanation: "Bayesian optimisation (TPE/GP) learns from past trials: the surrogate predicts likely good regions, and the acquisition function (e.g. Expected Improvement) balances exploration vs exploitation."
    },
    {
      question: "What is overfitting to the validation set during hyperparameter tuning?",
      options: ["When train loss is much lower than val loss", "When the chosen hyperparameters perform well on the validation set used for tuning but poorly on a held-out test set", "When the model uses too many hyperparameters", "When grid search is used instead of random search"],
      correct: 1,
      explanation: "Searching over enough hyperparameter combinations will eventually find a set that 'gets lucky' on your validation set. Use a separate test set (never used for tuning) to estimate true generalisation."
    },
  ],

  "feature-importance": [
    {
      question: "What is a key disadvantage of impurity (Gini) based feature importance?",
      options: ["It is slow to compute", "It is biased toward high-cardinality features like IDs or zip codes that offer many split points", "It cannot handle missing values", "It only works with linear models"],
      correct: 1,
      explanation: "A feature with many unique values has more opportunities to create pure splits by chance, inflating its importance score even if it's not genuinely predictive."
    },
    {
      question: "How does permutation importance test whether a feature matters?",
      options: ["By retraining the model without the feature", "By randomly shuffling one feature's values and measuring the drop in validation score", "By computing the correlation between the feature and target", "By computing the gradient of the output with respect to the feature"],
      correct: 1,
      explanation: "Shuffling a feature breaks its relationship with the target. If validation score drops significantly, that feature was important. This is model-agnostic and catches interactions that SHAP may miss."
    },
    {
      question: "What does a SHAP value of +0.3 for a feature mean?",
      options: ["The feature's value is 0.3 standard deviations above average", "This feature pushed the model's prediction 0.3 units above the baseline expected output for this instance", "The feature has 30% importance globally", "The feature's coefficient is 0.3"],
      correct: 1,
      explanation: "SHAP values are additive: output = baseline + Σφᵢ. A value of +0.3 means this feature's specific value raised the prediction by 0.3 for this particular instance (local attribution)."
    },
  ],

  "partial-dependence": [
    {
      question: "What does a Partial Dependence Plot (PDP) show?",
      options: ["The feature's distribution in the training set", "The average predicted outcome as one feature varies while all others are marginalised out", "The individual prediction for each training sample", "The interaction between two specific samples"],
      correct: 1,
      explanation: "PDP averages model predictions over the data distribution of other features, showing the marginal effect of one (or two) features on the output — useful for global interpretation."
    },
    {
      question: "What does an ICE (Individual Conditional Expectation) curve show over a PDP?",
      options: ["The average effect of a feature", "One prediction line per training sample, revealing heterogeneous effects that the PDP average hides", "The confidence interval of the PDP", "The feature's SHAP values"],
      correct: 1,
      explanation: "If ICE curves fan out or cross, the PDP average is misleading — different subgroups have opposite effects. Centred ICE (c-ICE) subtracts each curve's leftmost value to reveal shape."
    },
    {
      question: "What problem do ALE plots fix compared to PDPs?",
      options: ["ALE plots are faster to compute", "ALE plots use conditional rather than marginal distributions, avoiding extrapolation on correlated features", "ALE plots work for any model type", "ALE plots show global rather than local effects"],
      correct: 1,
      explanation: "PDPs marginalise over all values of other features, including impossible combinations (e.g. age=5 with income=200k). ALE conditions on local data windows, staying in-distribution."
    },
  ],

  "time-series": [
    {
      question: "Why is standard K-Fold cross-validation wrong for time series?",
      options: ["It is too slow for large time series", "It allows future data to leak into training folds, making validation scores over-optimistic", "It does not handle seasonality", "It requires data to be stationary"],
      correct: 1,
      explanation: "K-Fold shuffles rows — a model might train on t=100 and validate on t=50, leaking future information. TimeSeriesSplit ensures each training window precedes its validation window."
    },
    {
      question: "What is a lag feature in time series forecasting?",
      options: ["A feature capturing the trend component", "The value of the target at a previous time step, used as a predictor for the current step", "A Fourier feature encoding seasonality", "The rolling mean of the target"],
      correct: 1,
      explanation: "Lag-1 of y is yₜ₋₁. Lag features encode autocorrelation — if yesterday's sales predict today's, adding lag(1) as a feature lets ML models capture this structure."
    },
    {
      question: "What does STL decomposition separate a time series into?",
      options: ["Signal and noise", "Trend, seasonal, and residual components", "Stationary and non-stationary parts", "Short-term and long-term patterns"],
      correct: 1,
      explanation: "STL = Seasonal-Trend decomposition using LOESS. Yₜ = Tₜ (trend) + Sₜ (seasonality) + Rₜ (residual). Deseasonalising or detrending before modelling can improve accuracy."
    },
  ],

  "neural-networks": [
    {
      question: "Why does the ReLU activation help with the vanishing gradient problem?",
      options: ["ReLU outputs are always between 0 and 1", "ReLU's gradient is 1 for positive inputs, not saturating to zero like sigmoid/tanh", "ReLU is computationally free", "ReLU normalises activations"],
      correct: 1,
      explanation: "Sigmoid/tanh saturate: at extreme values their gradients → 0, killing the signal through deep networks. ReLU(x) = max(0,x) has gradient 1 for x>0, letting gradients flow freely."
    },
    {
      question: "What does the Xavier initialisation strategy ensure?",
      options: ["Weights start at zero to break symmetry", "Variance of activations stays roughly constant across layers, preventing explosion or vanishing at initialisation", "All weights are positive at the start", "Weights are initialised from a uniform distribution"],
      correct: 1,
      explanation: "Xavier/Glorot init: w ~ U(-√(6/(n_in+n_out)), √(6/(n_in+n_out))). This keeps signal variance stable forward and backward at initialisation — crucial for deep networks."
    },
    {
      question: "What is weight symmetry breaking, and why does random initialisation fix it?",
      options: ["Weights become equal during training due to identical activation functions", "If all weights start equal (e.g. 0), all neurons in a layer receive identical gradients and learn the same features — random init makes neurons diverge and learn distinct patterns", "Weights grow too large without random initialisation", "Regularisation creates symmetry that random init prevents"],
      correct: 1,
      explanation: "Identical weights → identical gradients → identical updates forever. Even one layer of identical neurons can't represent different features. Small random values break symmetry."
    },
  ],

  "dl-optimization": [
    {
      question: "What is the role of momentum in SGD with Momentum?",
      options: ["It scales the learning rate down over time", "It accumulates a velocity vector in directions of persistent gradient, accelerating through ravines and dampening oscillations", "It clips gradients to a maximum norm", "It decouples weight decay from the learning rate"],
      correct: 1,
      explanation: "vₜ = βvₜ₋₁ + (1-β)∇L; w -= η·vₜ. In a bowl-shaped loss landscape, the ball accumulates speed downhill and oscillates less on the steep walls."
    },
    {
      question: "Why does Batch Normalisation allow higher learning rates?",
      options: ["It reduces the number of parameters", "It re-centres and re-scales each mini-batch, reducing internal covariate shift so gradients behave more predictably", "It adds regularisation noise to weights", "It replaces the need for dropout"],
      correct: 1,
      explanation: "Without BN, a weight update in one layer shifts the input distribution to the next, forcing it to compensate. BN re-normalises each layer's inputs, making training more stable at large lr."
    },
    {
      question: "What is the difference between Adam and AdamW?",
      options: ["AdamW uses a different β₁", "AdamW decouples weight decay from the adaptive gradient update, applying it directly to weights rather than inside the Adam moment estimates", "AdamW has no momentum term", "AdamW is only for transformers"],
      correct: 1,
      explanation: "Adam with L2 regularisation applies weight decay through the gradient, which interacts with the adaptive scaling — high-gradient parameters get less decay. AdamW applies λw decay directly, as intended."
    },
  ],

  "cnn-architectures": [
    {
      question: "What is the receptive field of a neuron in a CNN?",
      options: ["The size of the convolutional kernel", "The region of the input image that influences that neuron's activation", "The number of output feature maps", "The spatial resolution of the feature map"],
      correct: 1,
      explanation: "Deeper layers see a larger receptive field — each neuron 'looks at' a bigger patch of the input. Stacking 3×3 convolutions is preferred over one large kernel because it gives the same receptive field with fewer parameters."
    },
    {
      question: "What problem do ResNet's skip connections solve?",
      options: ["They prevent overfitting by regularising weights", "They allow gradients to flow directly through the shortcut path, avoiding vanishing gradients in very deep networks", "They reduce the number of parameters", "They increase the receptive field"],
      correct: 1,
      explanation: "The residual: ∂L/∂x = ∂L/∂y · (1 + ∂F/∂x). The '+1' ensures gradients are always at least as large as the upstream signal, enabling training of 100+ layer networks."
    },
    {
      question: "How does ViT (Vision Transformer) differ fundamentally from a CNN?",
      options: ["ViT uses larger kernels than CNN", "ViT splits the image into patches and applies pure self-attention — no convolutions anywhere", "ViT only works on small images", "ViT uses recurrence to process image rows"],
      correct: 1,
      explanation: "ViT flattens 16×16 pixel patches into tokens and feeds them through standard transformer encoder blocks. There are no inductive biases (translation equivariance, locality) — it learns spatial structure from data."
    },
  ],

  "rnn-lstm-gru": [
    {
      question: "What causes the vanishing gradient problem in vanilla RNNs?",
      options: ["The hidden state is too large", "Backpropagation through time multiplies the same weight matrix t times — if spectral radius < 1, gradients shrink to zero over long sequences", "The sigmoid activation is used in the output layer", "RNNs lack skip connections"],
      correct: 1,
      explanation: "BPTT unrolls the RNN: ∂L/∂h₀ = ∏(∂hₜ/∂hₜ₋₁). Repeated multiplication of a matrix with spectral radius <1 → exponential decay. LSTMs solve this with the cell state highway."
    },
    {
      question: "What is the purpose of the LSTM forget gate?",
      options: ["To reset the hidden state at the start of each sequence", "To decide how much of the previous cell state to keep or erase based on current input and hidden state", "To control how much the output is gated", "To add new information to the cell state"],
      correct: 1,
      explanation: "fₜ = σ(Wf·[hₜ₋₁, xₜ] + bf). Values near 0 forget the past; near 1 preserve it. This learned gating lets the network maintain long-range dependencies while forgetting irrelevant context."
    },
    {
      question: "What is the key simplification GRU makes over LSTM?",
      options: ["GRU uses only one gate", "GRU merges forget and input gates into a single update gate and eliminates the separate cell state", "GRU has no hidden state", "GRU uses attention instead of gating"],
      correct: 1,
      explanation: "GRU has reset gate r and update gate z but no cell state. This gives ~2/3 the parameters of LSTM with comparable performance on many tasks, training faster with less memory."
    },
  ],

  "object-detection": [
    {
      question: "What does IoU (Intersection over Union) measure in object detection?",
      options: ["How well bounding boxes are predicted on average", "The overlap between a predicted box and the ground truth box: |A∩B|/|A∪B|", "The confidence score of a detection", "The aspect ratio difference between predicted and true boxes"],
      correct: 1,
      explanation: "IoU = area of intersection / area of union. IoU=1 is perfect overlap; IoU=0 is no overlap. A detection is typically counted as correct if IoU > 0.5 (PASCAL VOC standard)."
    },
    {
      question: "What does Non-Maximum Suppression (NMS) do in YOLO/Faster-RCNN?",
      options: ["Filters out detections with low confidence", "Removes duplicate bounding boxes for the same object, keeping only the highest-confidence one", "Normalises bounding box coordinates", "Applies the softmax to class scores"],
      correct: 1,
      explanation: "Detectors produce many overlapping boxes. NMS keeps the highest-score box and suppresses all overlapping boxes with IoU > threshold (e.g. 0.45), giving one clean detection per object."
    },
    {
      question: "What is the main trade-off between one-stage (YOLO) and two-stage (Faster-RCNN) detectors?",
      options: ["YOLO detects more classes; Faster-RCNN detects fewer", "YOLO is faster but generally less accurate on small objects; Faster-RCNN is slower but more accurate using a separate region proposal network", "YOLO requires more training data", "Faster-RCNN only works on square images"],
      correct: 1,
      explanation: "Two-stage: propose regions → classify. One-stage: predict boxes and classes in a single forward pass. YOLO achieves real-time FPS; Faster-RCNN excels at detecting small, dense objects."
    },
  ],

  "image-segmentation": [
    {
      question: "What is the difference between semantic and instance segmentation?",
      options: ["Semantic is faster; instance is more accurate", "Semantic assigns a class to each pixel; instance additionally distinguishes separate objects of the same class", "Semantic works on videos; instance on images", "Semantic uses bounding boxes; instance uses pixel masks"],
      correct: 1,
      explanation: "Semantic: two cars → same colour. Instance: two cars → different colours. Panoptic segmentation combines both: 'stuff' classes semantically + 'thing' classes with instances."
    },
    {
      question: "What is the Dice loss and when is it preferred over cross-entropy?",
      options: ["Dice measures pixel accuracy", "Dice loss = 1 - 2|A∩B|/(|A|+|B|), directly optimising the overlap coefficient — preferred for severe class imbalance (e.g. tiny tumour vs background)", "Dice is used for bounding box regression", "Dice is cross-entropy averaged over classes"],
      correct: 1,
      explanation: "With 99% background pixels, cross-entropy achieves 99% accuracy by predicting background everywhere. Dice optimises overlap directly, penalising failure to find the small foreground region."
    },
    {
      question: "What role do skip connections play in UNet?",
      options: ["They prevent overfitting by adding dropout paths", "They concatenate encoder feature maps to decoder layers, combining precise spatial information with deep semantic context", "They allow gradient flow between non-adjacent layers", "They double the resolution at each decoder step"],
      correct: 1,
      explanation: "Deep encoder features have semantic richness but coarse location. Shallow encoder features have fine spatial detail but little semantics. Skip connections fuse both at each scale."
    },
  ],

  "nlp-text": [
    {
      question: "What does TF-IDF score represent?",
      options: ["How often a word appears in all documents", "The word's frequency in a document, weighted down by how common it is across the corpus", "The sentence embedding dimension", "The number of documents containing the word"],
      correct: 1,
      explanation: "TF-IDF = TF × log(N/df). Frequent words within a document score high (TF), but common words across all documents (like 'the') are discounted (IDF), highlighting distinctive terms."
    },
    {
      question: "What is the main limitation of Bag-of-Words (BoW) representations?",
      options: ["They cannot handle large vocabularies", "They lose word order and ignore semantic similarity between words", "They require pre-trained embeddings", "They are too slow for real-time classification"],
      correct: 1,
      explanation: "'Dog bites man' and 'Man bites dog' have identical BoW vectors. Word2Vec/embeddings address this by capturing semantic meaning, and transformers capture full context."
    },
    {
      question: "Why do sentence-transformers outperform TF-IDF for semantic search?",
      options: ["They produce shorter vectors", "They encode semantic meaning — 'car' and 'automobile' are close in embedding space, while TF-IDF treats them as completely different", "They are faster to compute", "They avoid stop word removal"],
      correct: 1,
      explanation: "TF-IDF is lexical: queries must share exact tokens with documents. Sentence embeddings are semantic: a query about 'vehicle purchase' can match a document about 'car buying' via cosine similarity."
    },
  ],

  "transformers-attention": [
    {
      question: "In scaled dot-product attention, why divide by √d_k?",
      options: ["To normalise the output to [0,1]", "Large d_k makes dot products large, pushing softmax into saturation (near-zero gradients). Scaling by √d_k keeps the variance stable", "To enforce positional ordering", "To make attention scores sum to one before softmax"],
      correct: 1,
      explanation: "Q·Kᵀ values grow in magnitude with dimension. Dividing by √d_k keeps the pre-softmax logits in a reasonable range, avoiding the near-zero gradient region of softmax."
    },
    {
      question: "What does multi-head attention gain over single-head attention?",
      options: ["Faster computation for long sequences", "Multiple heads can attend to different positions and relationship types simultaneously, then their perspectives are concatenated", "Exact positional information without positional encoding", "Reduced parameter count"],
      correct: 1,
      explanation: "Head 1 might capture syntactic dependencies; head 2 coreference; head 3 local context. Concatenating h heads and projecting gives richer representations than any single head."
    },
    {
      question: "What is the key architectural difference between BERT and GPT?",
      options: ["BERT uses convolutional layers; GPT uses recurrence", "BERT is encoder-only with bidirectional attention (reads full context); GPT is decoder-only with causal masking (left-to-right)", "BERT is larger than GPT", "GPT uses absolute positional embeddings; BERT uses relative"],
      correct: 1,
      explanation: "BERT's bidirectional attention lets each token attend to past AND future — ideal for understanding. GPT's causal mask allows each token to see only prior tokens — ideal for generation."
    },
  ],

  "audio-ml": [
    {
      question: "What does a Mel spectrogram represent?",
      options: ["The raw waveform compressed to 2D", "Time × Mel-frequency energy — a log-power spectrogram mapped to a perceptually uniform frequency scale", "A sequence of MFCC coefficients over time", "The Fourier transform of the autocorrelation"],
      correct: 1,
      explanation: "STFT gives time-frequency power; mapping to the Mel scale compresses high frequencies (where humans are less sensitive) and expands low frequencies, giving features better suited for audio tasks."
    },
    {
      question: "What problem does CTC (Connectionist Temporal Classification) loss solve?",
      options: ["Training audio CNNs on imbalanced datasets", "Aligning variable-length audio sequences to variable-length text without requiring frame-level labels", "Generating spectrograms from text", "Removing noise from audio signals"],
      correct: 1,
      explanation: "Labelling every audio frame manually is impractical. CTC marginalises over all possible alignments between the output sequence and target text, learning alignment implicitly."
    },
    {
      question: "What does SpecAugment do during audio training?",
      options: ["Adds reverb to training samples", "Randomly masks contiguous blocks of time steps and frequency channels in the spectrogram — a form of data augmentation", "Applies pitch shifting to waveforms", "Normalises the spectrogram to zero mean"],
      correct: 1,
      explanation: "SpecAugment masks T consecutive time frames and F consecutive frequency bands, forcing the model to use remaining information. This regularises without requiring additional data."
    },
  ],

  "generative-models": [
    {
      question: "What is the reparameterisation trick in VAEs?",
      options: ["Replacing the encoder with a deterministic function", "Sampling z = μ + σ·ε (ε ~ N(0,1)) so gradients can flow through the sampling step via μ and σ", "Applying batch normalisation to the latent space", "Discretising the latent space"],
      correct: 1,
      explanation: "Sampling z ~ N(μ,σ²) is non-differentiable. Writing z = μ + σ·ε shifts the randomness to ε (no parameters), so ∂z/∂μ and ∂z/∂σ are well-defined and backprop works."
    },
    {
      question: "What is mode collapse in GANs?",
      options: ["The discriminator always wins", "The generator learns to produce only a few types of outputs (modes) instead of the full data distribution", "The gradient of the generator becomes zero", "Both networks converge to a fixed point too early"],
      correct: 1,
      explanation: "A GAN generator can 'cheat' by outputting a handful of images that reliably fool the discriminator, ignoring most of the data distribution. Techniques like mini-batch discrimination and Wasserstein loss help."
    },
    {
      question: "In a VAE, what does the KL divergence term in the ELBO enforce?",
      options: ["Reconstruction quality", "That the posterior q(z|x) stays close to the prior N(0,I) — regularising the latent space", "The discriminator loss", "That the decoder is deterministic"],
      correct: 1,
      explanation: "ELBO = E[log p(x|z)] - D_KL(q(z|x)||p(z)). Without the KL term the encoder would collapse to a delta (no uncertainty). The KL forces a smooth, regular latent space enabling interpolation."
    },
  ],

  "reinforcement-learning": [
    {
      question: "What is the Bellman equation for Q-learning?",
      options: ["Q(s,a) = r + E[V(s')]", "Q(s,a) ← Q(s,a) + α[r + γ·max_a' Q(s',a') - Q(s,a)]", "Q(s,a) = log P(a|s)", "Q(s,a) = Σπ(a|s)·r(s,a)"],
      correct: 1,
      explanation: "The Bellman update bootstraps: the target r + γ·maxQ(s',a') is the current best estimate of the true Q value. α blends old and new estimates; γ discounts future rewards."
    },
    {
      question: "What is the exploration-exploitation trade-off?",
      options: ["How to balance training and inference time", "Whether to take the best known action (exploit) or try new actions to discover better ones (explore)", "How to balance bias and variance", "Whether to use on-policy or off-policy learning"],
      correct: 1,
      explanation: "Always exploiting the current best action misses better undiscovered options. Always exploring wastes reward on known bad actions. ε-greedy: exploit with prob 1-ε, explore with prob ε."
    },
    {
      question: "What key innovation does DQN add to Q-learning for neural networks?",
      options: ["It uses a policy gradient instead of Q-values", "It adds an experience replay buffer and a target network to stabilise training", "It discretises the action space", "It removes the need for a discount factor"],
      correct: 1,
      explanation: "Experience replay breaks temporal correlation in consecutive transitions. The target network provides stable Q-value targets by lagging behind the online network. Both fixes prevent the feedback loop that makes plain neural Q-learning unstable."
    },
  ],
};

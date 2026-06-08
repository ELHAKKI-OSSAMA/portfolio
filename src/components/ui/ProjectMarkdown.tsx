"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

interface Props {
  content: string;
  accentColor?: string;
  locale?: string;
}

// Translate bold section headers that appear across all projects
const FR: Record<string, string> = {
  "**Dataset**": "**Données**",
  "**Dataset & Annotation**": "**Données & Annotation**",
  "**Feature Engineering**": "**Ingénierie des caractéristiques**",
  "**Key Insights**": "**Points clés**",
  "**Key Insight**": "**Point clé**",
  "**Key Finding**": "**Résultat clé**",
  "**Key Findings**": "**Résultats clés**",
  "**Final Results**": "**Résultats finaux**",
  "**Training Setup**": "**Configuration d'entraînement**",
  "**Training Config**": "**Configuration d'entraînement**",
  "**Training Results**": "**Résultats d'entraînement**",
  "**Architecture**": "**Architecture**",
  "**Deployment**": "**Déploiement**",
  "**Application**": "**Application**",
  "**Honest Assessment**": "**Évaluation honnête**",
  "**Error Analysis**": "**Analyse des erreurs**",
  "**Imbalance Strategy**": "**Stratégie d'équilibrage**",
  "**2-Phase Transfer Learning**": "**Apprentissage par transfert en 2 phases**",
  "**GradCAM Findings**": "**Résultats GradCAM**",
  "**Why Zero-Shot Works**": "**Pourquoi le zero-shot fonctionne**",
  "**Enhancement (Optional)**": "**Amélioration (optionnel)**",
  "**Hyperparameters**": "**Hyperparamètres**",
  "**Memory Strategy**": "**Stratégie mémoire**",
  "**Models Implemented**": "**Modèles implémentés**",
  "**Models Compared**": "**Modèles comparés**",
  "**All 6 Models Compared**": "**6 modèles comparés**",
  "**All 10 Models**": "**10 modèles**",
  "**All 14 Models**": "**14 modèles**",
  "**All 19 Models — Key Results**": "**19 modèles — Résultats clés**",
  "**4 Techniques Combined**": "**4 techniques combinées**",
  "**4 Training Stability Techniques**": "**4 techniques de stabilité**",
  "**BERT Fine-tuning Details**": "**Détails du fine-tuning BERT**",
  "**Cold-Start Handling**": "**Gestion du démarrage à froid**",
  "**Generation Strategies (GPT-2 / T5)**": "**Stratégies de génération**",
  "**Vocabulary Analysis**": "**Analyse du vocabulaire**",
  "**Generated Output**": "**Sorties générées**",
  "**Surprising Finding**": "**Résultat surprenant**",
  "**Speed-Accuracy Trade-off**": "**Compromis vitesse-précision**",
  "**Real-Time Analysis**": "**Analyse en temps réel**",
  "**Full Pipeline**": "**Pipeline complet**",
  "**Datasets**": "**Jeux de données**",
  "**Canny Optimization**": "**Optimisation Canny**",
  "**Slerp Interpolation**": "**Interpolation Slerp**",
  "**4 Recommendation Algorithms**": "**4 algorithmes de recommandation**",
  "**Why n8n Over Python?**": "**Pourquoi n8n plutôt que Python ?**",
  "**Market Basket SQL Pattern**": "**Modèle SQL Market Basket**",
  "**5 Sub-Workflows**": "**5 sous-workflows**",
  "**Technology Stack**": "**Stack technologique**",
  "**Why 109 Nodes?**": "**Pourquoi 109 nœuds ?**",
  "**Service Topology**": "**Topologie des services**",
  "**Key Decisions**": "**Décisions clés**",
  "**Delta-Target Methodology**": "**Méthodologie Delta-Target**",
  "**Per-Class Highlights**": "**Points forts par classe**",
  "**Clustering (Phase 1)**": "**Clustering (Phase 1)**",
  "**Anomaly Detection (Phase 2)**": "**Détection d'anomalies (Phase 2)**",
  "**Classification (Phase 3 — Precipitation Type)**": "**Classification (Phase 3 — Précipitations)**",
  "**Forecasting (Phase 4)**": "**Prévision (Phase 4)**",
  "**Leakage Audit — Removed Columns**": "**Audit de fuite — Colonnes supprimées**",
  "**Walk-Forward CV**": "**CV Walk-Forward**",
  "**STL Decomposition Findings**": "**Résultats de la décomposition STL**",
  "**Time Series Analysis**": "**Analyse des séries temporelles**",
  "**Models Evaluated**": "**Modèles évalués**",
  "**Engineered Features**": "**Caractéristiques construites**",
  "**5 Critical Bugs Fixed From Upstream Notebooks**": "**5 bugs critiques corrigés**",
  "**Why DeepLabV3+ Wins**": "**Pourquoi DeepLabV3+ gagne**",
  "**Why SVM Linear Wins**": "**Pourquoi SVM linéaire gagne**",
  "**Why MobileNetV2 Wins**": "**Pourquoi MobileNetV2 gagne**",
  "**Why Low mAP?**": "**Pourquoi un faible mAP ?**",
  "**Why Ensemble < MobileNetV2?**": "**Pourquoi l'Ensemble < MobileNetV2 ?**",
  "**Why Combined TF-IDF Beats Standalone**": "**Pourquoi le TF-IDF combiné est supérieur**",
  "**Why Ollama (Local LLM)?**": "**Pourquoi Ollama (LLM local) ?**",
  "**Anti-Hallucination System Prompt**": "**Prompt anti-hallucination**",
  "**CNN Architecture**": "**Architecture CNN**",
  "**Dueling DQN Architecture**": "**Architecture Dueling DQN**",
  "**PER SumTree**": "**PER SumTree**",
  "**CRNN**": "**CRNN**",
  "**CER vs Exact Match**": "**CER vs correspondance exacte**",
  "**The ML vs Classical TS Paradox**": "**Le paradoxe ML vs TS classique**",
  "**Why Deep Learning Fails Here**": "**Pourquoi le deep learning échoue ici**",
  "**Why Perfect Accuracy?**": "**Pourquoi une précision parfaite ?**",
  "**Feature Extraction**": "**Extraction des caractéristiques**",
  "**SHAP Top Fraud Indicators**": "**Principaux indicateurs SHAP de fraude**",
  "**SHAP Feature Importance (XGBoost)**": "**Importance des features SHAP (XGBoost)**",
  "**SHAP Top Churn Drivers**": "**Principaux facteurs SHAP de résiliation**",
  "**MC-Dropout Uncertainty**": "**Incertitude MC-Dropout**",
  "**MC-Dropout Uncertainty Quantification**": "**Quantification de l'incertitude MC-Dropout**",
  "**3-Step Pipeline**": "**Pipeline en 3 étapes**",
  "**Dimensionality Analysis**": "**Analyse de dimensionnalité**",
  "**Phase 1 — Baseline Classifiers**": "**Phase 1 — Classificateurs de base**",
  "**Phase 2 — Boosting Ensembles**": "**Phase 2 — Ensembles de boosting**",
  "**Phase 3 — Optuna HPO**": "**Phase 3 — Optuna HPO**",
  "**Phase 1 — Classical ML (HOG + 8 models)**": "**Phase 1 — ML classique (HOG + 8 modèles)**",
  "**Phase 2 — Custom CNNs**": "**Phase 2 — CNN personnalisés**",
  "**Phase 3 — Transfer Learning**": "**Phase 3 — Apprentissage par transfert**",
  "**Stage 1 — Baseline**": "**Étape 1 — Baseline**",
  "**Stage 2 — Advanced Pipeline**": "**Étape 2 — Pipeline avancé**",
  "**4-Phase Progressive Training**": "**Entraînement progressif en 4 phases**",
  "**Multi-Loss Training**": "**Entraînement multi-perte**",
  "**Hybrid Architecture**": "**Architecture hybride**",
  "**Interpretability**": "**Interprétabilité**",
  "**Fine-Grained Challenge**": "**Défi à grain fin**",
  "**Why EURUSD daily is near-efficient**": "**Pourquoi l'EURUSD quotidien est quasi-efficient**",
  "**Grand Leaderboard (top performers)**": "**Classement général (meilleurs modèles)**",
  "**4 Critical Fixes vs v1**": "**4 correctifs critiques vs v1**",
  "**SEIR Model**": "**Modèle SEIR**",
  "**Validation Results (best model, 4 images)**": "**Résultats de validation (meilleur modèle, 4 images)**",
  "**Test Set Results (4 images, 110 instances)**": "**Résultats sur l'ensemble de test**",
  "**Inference Demo (single 352×640 image)**": "**Démo d'inférence**",
  "**CVAT XML → YOLO Conversion**": "**Conversion CVAT XML → YOLO**",
  "**3-Model Comparison (Test Set)**": "**Comparaison de 3 modèles (ensemble de test)**",
  "**Validation Set**": "**Ensemble de validation**",
  "**Deployment Exports**": "**Exports pour déploiement**",
  "**Bug Fixed: Generator Reset**": "**Bug corrigé : Réinitialisation du générateur**",
  "**DistilBERT Finding**": "**Résultat DistilBERT**",
  "**Task 2: Skills Demand Analysis**": "**Tâche 2 : Analyse de la demande de compétences**",
  "**Task 3: Market Insights**": "**Tâche 3 : Insights marché**",
  "**Key Caveat**": "**Mise en garde clé**",
  "**Results (Query: Abdullah_Gul)**": "**Résultats (Requête : Abdullah_Gul)**",
  "**Dataset (RAF-DB)**": "**Données (RAF-DB)**",
  "**All Models Compared**": "**Tous les modèles comparés**",
  "**3 weather regimes**": "**3 régimes météo**",
};

const AR: Record<string, string> = {
  "**Dataset**": "**مجموعة البيانات**",
  "**Dataset & Annotation**": "**البيانات والتعليقات**",
  "**Feature Engineering**": "**هندسة الميزات**",
  "**Key Insights**": "**رؤى رئيسية**",
  "**Key Insight**": "**رؤية رئيسية**",
  "**Key Finding**": "**نتيجة رئيسية**",
  "**Key Findings**": "**نتائج رئيسية**",
  "**Final Results**": "**النتائج النهائية**",
  "**Training Setup**": "**إعداد التدريب**",
  "**Training Config**": "**إعداد التدريب**",
  "**Training Results**": "**نتائج التدريب**",
  "**Architecture**": "**البنية**",
  "**Deployment**": "**النشر**",
  "**Application**": "**التطبيق**",
  "**Honest Assessment**": "**تقييم صادق**",
  "**Error Analysis**": "**تحليل الأخطاء**",
  "**Imbalance Strategy**": "**استراتيجية التوازن**",
  "**2-Phase Transfer Learning**": "**نقل التعلم بمرحلتين**",
  "**GradCAM Findings**": "**نتائج GradCAM**",
  "**Why Zero-Shot Works**": "**لماذا يعمل الأسلوب بدون تدريب**",
  "**Enhancement (Optional)**": "**تحسين (اختياري)**",
  "**Hyperparameters**": "**المعاملات الفائقة**",
  "**Memory Strategy**": "**استراتيجية الذاكرة**",
  "**Models Implemented**": "**النماذج المنفذة**",
  "**Models Compared**": "**النماذج المقارنة**",
  "**All 6 Models Compared**": "**مقارنة 6 نماذج**",
  "**All 10 Models**": "**10 نماذج**",
  "**All 14 Models**": "**14 نموذجاً**",
  "**All 19 Models — Key Results**": "**19 نموذجاً — النتائج الرئيسية**",
  "**4 Techniques Combined**": "**4 تقنيات مدمجة**",
  "**4 Training Stability Techniques**": "**4 تقنيات استقرار التدريب**",
  "**BERT Fine-tuning Details**": "**تفاصيل الضبط الدقيق لـ BERT**",
  "**Cold-Start Handling**": "**معالجة مشكلة البدء البارد**",
  "**Surprising Finding**": "**نتيجة مفاجئة**",
  "**Speed-Accuracy Trade-off**": "**مقايضة السرعة والدقة**",
  "**Real-Time Analysis**": "**تحليل الوقت الفعلي**",
  "**Full Pipeline**": "**خط الأنابيب الكامل**",
  "**Datasets**": "**مجموعات البيانات**",
  "**Canny Optimization**": "**تحسين Canny**",
  "**Slerp Interpolation**": "**استيفاء Slerp**",
  "**Why n8n Over Python?**": "**لماذا n8n بدلاً من Python؟**",
  "**Market Basket SQL Pattern**": "**نمط SQL لسلة السوق**",
  "**5 Sub-Workflows**": "**5 سير عمل فرعية**",
  "**Technology Stack**": "**المكدس التقني**",
  "**Why 109 Nodes?**": "**لماذا 109 عقدة؟**",
  "**Service Topology**": "**طوبولوجيا الخدمات**",
  "**Key Decisions**": "**القرارات الرئيسية**",
  "**Delta-Target Methodology**": "**منهجية Delta-Target**",
  "**Per-Class Highlights**": "**أبرز النتائج لكل فئة**",
  "**Clustering (Phase 1)**": "**التجميع (المرحلة 1)**",
  "**Anomaly Detection (Phase 2)**": "**كشف الشذوذ (المرحلة 2)**",
  "**Classification (Phase 3 — Precipitation Type)**": "**التصنيف (المرحلة 3 — نوع التساقط)**",
  "**Forecasting (Phase 4)**": "**التنبؤ (المرحلة 4)**",
  "**Leakage Audit — Removed Columns**": "**مراجعة التسرب — الأعمدة المحذوفة**",
  "**Walk-Forward CV**": "**CV Walk-Forward**",
  "**STL Decomposition Findings**": "**نتائج تحليل STL**",
  "**Time Series Analysis**": "**تحليل السلاسل الزمنية**",
  "**Models Evaluated**": "**النماذج المقيّمة**",
  "**Engineered Features**": "**الميزات المهندسة**",
  "**5 Critical Bugs Fixed From Upstream Notebooks**": "**5 أخطاء حرجة تم إصلاحها**",
  "**Why DeepLabV3+ Wins**": "**لماذا يتفوق DeepLabV3+**",
  "**Why SVM Linear Wins**": "**لماذا يتفوق SVM الخطي**",
  "**Why MobileNetV2 Wins**": "**لماذا يتفوق MobileNetV2**",
  "**Why Low mAP?**": "**لماذا mAP منخفض؟**",
  "**Why Ensemble < MobileNetV2?**": "**لماذا المجموعة < MobileNetV2؟**",
  "**Why Combined TF-IDF Beats Standalone**": "**لماذا TF-IDF المدمج أفضل**",
  "**Why Ollama (Local LLM)?**": "**لماذا Ollama (LLM محلي)؟**",
  "**Anti-Hallucination System Prompt**": "**موجه النظام لمنع الهلوسة**",
  "**CNN Architecture**": "**بنية CNN**",
  "**Dueling DQN Architecture**": "**بنية Dueling DQN**",
  "**CER vs Exact Match**": "**CER مقابل التطابق التام**",
  "**The ML vs Classical TS Paradox**": "**مفارقة ML مقابل TS الكلاسيكي**",
  "**Why Deep Learning Fails Here**": "**لماذا يفشل التعلم العميق هنا**",
  "**Why Perfect Accuracy?**": "**لماذا دقة مثالية؟**",
  "**Feature Extraction**": "**استخراج الميزات**",
  "**SHAP Top Fraud Indicators**": "**أبرز مؤشرات الاحتيال SHAP**",
  "**SHAP Feature Importance (XGBoost)**": "**أهمية الميزات SHAP (XGBoost)**",
  "**SHAP Top Churn Drivers**": "**أبرز عوامل الانسحاب SHAP**",
  "**MC-Dropout Uncertainty**": "**عدم يقين MC-Dropout**",
  "**MC-Dropout Uncertainty Quantification**": "**قياس عدم اليقين MC-Dropout**",
  "**3-Step Pipeline**": "**خط أنابيب من 3 خطوات**",
  "**Dimensionality Analysis**": "**تحليل الأبعاد**",
  "**Phase 1 — Baseline Classifiers**": "**المرحلة 1 — مصنفات أساسية**",
  "**Phase 2 — Boosting Ensembles**": "**المرحلة 2 — مجموعات التعزيز**",
  "**Phase 3 — Optuna HPO**": "**المرحلة 3 — Optuna HPO**",
  "**Phase 1 — Classical ML (HOG + 8 models)**": "**المرحلة 1 — ML كلاسيكي**",
  "**Phase 2 — Custom CNNs**": "**المرحلة 2 — شبكات CNN مخصصة**",
  "**Phase 3 — Transfer Learning**": "**المرحلة 3 — نقل التعلم**",
  "**Stage 1 — Baseline**": "**المرحلة 1 — خط الأساس**",
  "**Stage 2 — Advanced Pipeline**": "**المرحلة 2 — خط الأنابيب المتقدم**",
  "**4-Phase Progressive Training**": "**تدريب تدريجي من 4 مراحل**",
  "**Multi-Loss Training**": "**التدريب متعدد الخسائر**",
  "**Hybrid Architecture**": "**البنية الهجينة**",
  "**Interpretability**": "**التفسيرية**",
  "**Fine-Grained Challenge**": "**التحدي الدقيق**",
  "**Grand Leaderboard (top performers)**": "**لوحة المتصدرين (أفضل النماذج)**",
  "**4 Critical Fixes vs v1**": "**4 إصلاحات حرجة مقارنة بالإصدار 1**",
  "**SEIR Model**": "**نموذج SEIR**",
  "**Validation Results (best model, 4 images)**": "**نتائج التحقق (أفضل نموذج)**",
  "**CVAT XML → YOLO Conversion**": "**تحويل CVAT XML → YOLO**",
  "**3-Model Comparison (Test Set)**": "**مقارنة 3 نماذج (مجموعة الاختبار)**",
  "**Deployment Exports**": "**تصديرات النشر**",
  "**Bug Fixed: Generator Reset**": "**إصلاح خطأ: إعادة ضبط المولّد**",
  "**DistilBERT Finding**": "**نتيجة DistilBERT**",
  "**Task 2: Skills Demand Analysis**": "**المهمة 2: تحليل الطلب على المهارات**",
  "**Task 3: Market Insights**": "**المهمة 3: رؤى السوق**",
  "**Key Caveat**": "**تحفظ رئيسي**",
  "**Dataset (RAF-DB)**": "**البيانات (RAF-DB)**",
  "**All Models Compared**": "**مقارنة جميع النماذج**",
  "**Full Taxonomy**": "**التصنيف الكامل**",
  "**Results**": "**النتائج**",
};

function localizeContent(content: string, locale: string): string {
  if (locale === "en" || !locale) return content;
  const map = locale === "fr" ? FR : locale === "ar" ? AR : null;
  if (!map) return content;
  let result = content;
  for (const [from, to] of Object.entries(map)) {
    result = result.replaceAll(from, to);
  }
  return result;
}

export default function ProjectMarkdown({ content, accentColor = "#6c63ff", locale = "en" }: Props) {
  const localized = localizeContent(content, locale);
  const isRtl = locale === "ar";

  return (
    <div className="project-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1
              className="text-2xl font-bold mt-8 mb-4 first:mt-0"
              style={{ color: "var(--text-primary)" }}
            >
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2
              className="text-xl font-bold mt-6 mb-3 first:mt-0"
              style={{ color: "var(--text-primary)" }}
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              className="text-lg font-semibold mt-5 mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p
              className="mb-4 leading-relaxed text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold" style={{ color: "var(--text-primary)" }}>
              {children}
            </strong>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 space-y-1.5 ms-4">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 space-y-1.5 ms-4 list-decimal">{children}</ol>
          ),
          li: ({ children }) => (
            <li
              className="flex items-start gap-2 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              <span style={{ color: accentColor }} className="mt-1 flex-shrink-0 text-xs">{isRtl ? "◂" : "▸"}</span>
              <span>{children}</span>
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote
              className="border-s-4 ps-4 py-1 mb-4 italic rounded-e text-sm"
              style={{
                borderColor: accentColor,
                backgroundColor: `${accentColor}10`,
                color: "var(--text-secondary)",
              }}
            >
              {children}
            </blockquote>
          ),
          code: (({ node: _node, children, className, ...props }) => {
            const isInline = !className;
            return isInline ? (
              <code
                className="px-1.5 py-0.5 rounded text-xs font-mono"
                style={{
                  backgroundColor: `${accentColor}15`,
                  color: accentColor,
                }}
                {...props}
              >
                {children}
              </code>
            ) : (
              <code
                dir="ltr"
                className={`block p-4 rounded-xl text-xs font-mono overflow-x-auto mb-4 leading-relaxed ${className || ""}`}
                style={{
                  backgroundColor: "var(--bg-elevated, #0d1117)",
                  color: "#e6edf3",
                  border: "1px solid var(--border)",
                }}
                {...props}
              >
                {children}
              </code>
            );
          }) as Components["code"],
          pre: ({ children }) => (
            <pre dir="ltr" className="mb-4 overflow-x-auto rounded-xl">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-6 rounded-xl border" dir="ltr" style={{ borderColor: "var(--border)" }}>
              <table className="w-full text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead
              style={{
                backgroundColor: `${accentColor}15`,
              }}
            >
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th
              className="px-4 py-2.5 text-left text-xs font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td
              className="px-4 py-2.5 text-xs border-t"
              style={{ color: "var(--text-secondary)", borderColor: "var(--border)" }}
            >
              {children}
            </td>
          ),
          hr: () => (
            <hr className="my-6" style={{ borderColor: "var(--border)" }} />
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-opacity hover:opacity-70"
              style={{ color: accentColor }}
            >
              {children}
            </a>
          ),
        }}
      >
        {localized}
      </ReactMarkdown>
    </div>
  );
}

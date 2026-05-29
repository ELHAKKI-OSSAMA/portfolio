@AGENTS.md

# ML Learning Portfolio — Developer Guide

## Project Overview
This is an interactive ML learning portfolio (Next.js 15 App Router, TypeScript, Tailwind CSS, Framer Motion).
The `/learning` section teaches ML concepts through animated visualizations tied to scikit-learn documentation.

---

## Architecture

### Topic pipeline
```
learningTopics.ts          ← catalogue (id, title, difficulty, category, prereqs)
     ↓
topicContents (index.ts)   ← rich pedagogical content (sections, formulas, code)
     |── supervised.ts     ← linear-regression, decision-tree-rf, gradient-boosting, svm-knn-svr
     |── evaluation.ts     ← model-evaluation, error-analysis
     |── neural.ts         ← neural-networks, cnn-architectures, rnn-lstm-gru
     |── advanced.ts       ← transformers-attention, generative-models, bagging-stacking, ova-ovo
     |── unsupervised.ts   ← clustering, pca, anomaly          (added from sklearn docs)
     └── applied.ts        ← feature-engineering, hyperparameter-tuning, naive-bayes,
                              time-series, nlp-text              (added from sklearn docs)
     ↓
TopicDetailClient.tsx      ← renders sections + picks visualization by topic id
     ↓
visualizations/*.tsx       ← client-only interactive SVG/canvas components (ssr:false)
```

### Category values (learningTopics.ts)
`regression` | `classification` | `ensemble` | `evaluation` | `unsupervised` | `applied`

### Section types (types.ts `SectionType`)
`motivation` | `intuition` | `math` | `algorithm` | `code` | `insight` | `pitfall` | `comparison` | `deepdive`

---

## Framer Motion + SVG — Critical Rule

**NEVER put `x`, `y`, `width`, `height`, `cx`, `cy`, `r` inside `initial`/`animate` on motion.* SVG elements.**

Framer Motion intercepts these as CSS motion values:
- `y` → `transform: translateY(Npx)` which stacks on top of the SVG `y` attribute → double offset
- `height` → `height: Npx` (invalid SVG attribute) — element invisible

**Correct pattern:**
```tsx
// motion.g owns ONLY opacity/scale/rotate
<motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
  {/* plain SVG element owns ALL geometry */}
  <rect x={cx} y={cy} width={w} height={h} rx={4} fill={color} />
</motion.g>
```

**Exception — `motion.g animate={{ x, y }}`** is safe for position animation because `<g>` has no
conflicting SVG `x`/`y` attributes; Framer Motion applies CSS `translateX/Y` cleanly.

---

## Visualization Component Conventions

- File: `src/components/learning/visualizations/<Name>Viz.tsx`
- Props: `{ accentColor?: string }` — inherits topic accent from TopicDetailClient
- Always `"use client"` + `useVizTheme()` for dark/light mode tokens
- Register in `TopicDetailClient.tsx`: dynamic import (ssr:false) + switch case

### useVizTheme() tokens
```ts
vt.surface      // card background for SVG insets
vt.grid         // faint grid lines
vt.gridStrong   // zero-line / axis emphasis
vt.axis         // axis stroke
vt.border       // border color string
vt.bg           // page background (used for strokeWidth halos)
vt.text         // primary text
vt.textMuted    // secondary text
vt.textFaint    // disabled / minor labels
```

---

## scikit-learn Source Material
Raw scikit-learn user guide RST files live at:
`C:\Users\Extremepc.ma\Downloads\scikit learn\data information user guide\`

Key files that fed the content in unsupervised.ts and applied.ts:
- `Unsupervised learning/clustering.rst.txt`       → clustering topic
- `Unsupervised learning/decomposition.rst.txt`    → pca topic
- `Unsupervised learning/outlier_detection.rst.txt`→ anomaly topic
- `Dataset transformations/preprocessing.rst.txt`  → feature-engineering topic
- `Model selection and evaluation/grid_search.rst.txt` → hyperparameter-tuning topic
- `Supervised learning/naive_bayes.rst.txt`        → naive-bayes topic
- `Common pitfalls and recommended practices/common_pitfalls.rst.txt` → pitfall sections

Topics NOT yet added (good candidates for future expansion):
- Supervised learning/ensemble.rst.txt  → Random Forests deep-dive
- Supervised learning/svm.rst.txt       → SVM kernel theory
- Model selection and evaluation/cross_validation.rst.txt
- Dataset transformations/compose.rst.txt → Pipeline/ColumnTransformer
- Inspection/partial_dependence.rst.txt → feature importance / XAI
- Inspection/permutation_importance.rst.txt

---

## Adding a New Topic — Checklist

1. **Content** — add entry to appropriate `src/lib/learningContent/*.ts`
2. **Topic catalogue** — add to `src/lib/data/learningTopics.ts`
3. **Visualization** (optional) — create `src/components/learning/visualizations/<Name>Viz.tsx`
4. **Wire viz** — add `dynamic` import + `case` in `TopicDetailClient.tsx`
5. **Copy to main project** — dev server runs from `C:\Users\Extremepc.ma\Desktop\ossama-portfolio\`
   (worktree path has a separate checkout; changes here don't auto-appear in the browser)

---

## Color Theme per Category
| Category       | Accent        |
|---------------|---------------|
| regression    | `#6c63ff`     |
| classification| `#ff6b6b`     |
| ensemble      | `#f97316`     |
| evaluation    | `#06b6d4`     |
| unsupervised  | `#8b5cf6`     |
| applied       | `#22c55e`     |


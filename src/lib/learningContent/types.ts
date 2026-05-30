// ─── Full Pedagogical Content for Learning Topics ─────────────────────────────
// Structured following the scientific pedagogy: Motivation → Intuition → Math → Algorithm → Code → Pitfalls

export type SectionType =
  | "motivation"
  | "intuition"
  | "math"
  | "algorithm"
  | "code"
  | "insight"
  | "pitfall"
  | "comparison"
  | "deepdive";

export interface ContentSection {
  type: SectionType;
  heading: string;
  text?: string;
  formula?: string;          // LaTeX string for KaTeX
  formulaLabel?: string;
  steps?: string[];
  code?: string;
  language?: string;
  callout?: string;
}

export interface KeyFormula {
  name: string;
  latex: string;
  meaning: string;
}

export interface TopicContent {
  id: string;
  tagline: string;
  taglineFr?: string;
  taglineAr?: string;
  accentColor: string;
  visualization: string;
  keyFormulas: KeyFormula[];
  sections: ContentSection[];
}

// ── i18n overlay types ────────────────────────────────────────────────────────
export interface SectionI18n {
  headingFr?: string;
  headingAr?: string;
  textFr?: string;
  textAr?: string;
  calloutFr?: string;
  calloutAr?: string;
  stepsFr?: string[];
  stepsAr?: string[];
  // formula label (the short title shown below the LaTeX block)
  formulaLabelFr?: string;
  formulaLabelAr?: string;
  // code — French only (Arabic keeps English code)
  codeFr?: string;
}

export interface KeyFormulaI18n {
  nameFr?: string;
  nameAr?: string;
  meaningFr?: string;
  meaningAr?: string;
}


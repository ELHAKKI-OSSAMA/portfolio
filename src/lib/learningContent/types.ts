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
  accentColor: string;
  visualization: string;
  keyFormulas: KeyFormula[];
  sections: ContentSection[];
}


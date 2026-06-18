// Single source of truth for category accent colors. These maps were previously
// duplicated (and had drifted — the learning topic page only defined 4 of the 11
// categories) across projects/learning pages and the learning card config.

/** Project category → accent hex (used by the projects list + detail pages). */
export const projectCategoryColors: Record<string, string> = {
  fraud:      "#ff6b6b",
  cv:         "#6c63ff",
  nlp:        "#00d4aa",
  medical:    "#f59e0b",
  timeseries: "#8b5cf6",
  genai:      "#ec4899",
  agents:     "#06b6d4",
  rl:         "#10b981",
  backend:    "#64748b",
  deployment: "#f97316",
};

/** Learning category → accent hex (used by the learning hub cards + topic pages). */
export const learningCategoryColors: Record<string, string> = {
  foundations:    "#06b6d4",
  regression:     "#6c63ff",
  classification: "#00d4aa",
  ensemble:       "#f59e0b",
  evaluation:     "#ff6b6b",
  unsupervised:   "#8b5cf6",
  applied:        "#22c55e",
  deeplearning:   "#a78bfa",
  vision:         "#ec4899",
  audio:          "#84cc16",
  rl:             "#f43f5e",
};

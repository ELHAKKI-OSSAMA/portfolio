// ─── Projects ──────────────────────────────────────────────────────────────────


export type ProjectCategory =
  | "fraud" | "cv" | "nlp" | "medical" | "timeseries"
  | "genai" | "agents" | "rl" | "backend" | "deployment";

export interface ProjectResult {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: ProjectCategory[];
  tags: string[];
  kaggleUrl?: string;
  githubUrl?: string;
  featured: boolean;
  metrics?: string;
  dataset?: string;
  results?: ProjectResult[];
  techStack?: string[];
  approach?: string;
}

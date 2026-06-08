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
  titleFr?: string;
  titleAr?: string;
  description: string;
  descriptionFr?: string;
  descriptionAr?: string;
  longDescription?: string;
  longDescriptionFr?: string;
  longDescriptionAr?: string;
  category: ProjectCategory[];
  tags: string[];
  kaggleUrl?: string;
  githubUrl?: string;
  featured: boolean;
  metrics?: string;
  dataset?: string;
  datasetFr?: string;
  datasetAr?: string;
  results?: ProjectResult[];
  techStack?: string[];
  approach?: string;
  approachFr?: string;
  approachAr?: string;
}

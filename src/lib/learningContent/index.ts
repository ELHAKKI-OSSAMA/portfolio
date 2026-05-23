// ─── Re-export types + merged topicContents ─────────────────────────────────
// Keeps all existing imports (from '@/lib/learningContent') working unchanged.
export type { SectionType, ContentSection, KeyFormula, TopicContent } from './types';

import type { TopicContent } from './types';
import { supervisedContent }  from './supervised';
import { evaluationContent }  from './evaluation';
import { neuralContent }      from './neural';
import { advancedContent }    from './advanced';

export const topicContents: Record<string, TopicContent> = {
  ...supervisedContent,
  ...evaluationContent,
  ...neuralContent,
  ...advancedContent,
};

// ─── Re-export types + merged topicContents ─────────────────────────────────
// Keeps all existing imports (from '@/lib/learningContent') working unchanged.
export type { SectionType, ContentSection, KeyFormula, TopicContent } from './types';

import type { TopicContent } from './types';
import { supervisedContent }    from './supervised';
import { evaluationContent }    from './evaluation';
import { neuralContent }        from './neural';
import { advancedContent }      from './advanced';
import { unsupervisedContent }  from './unsupervised';
import { appliedContent }       from './applied';
import { inspectionContent }    from './inspection';
import { foundationsContent }   from './foundations';
import { visionContent }        from './vision';
import { audioContent }         from './audio';
import { rlContent }            from './rl';
import { deeplearningContent }  from './deeplearning';

export const topicContents: Record<string, TopicContent> = {
  ...foundationsContent,
  ...supervisedContent,
  ...evaluationContent,
  ...neuralContent,
  ...advancedContent,
  ...deeplearningContent,
  ...unsupervisedContent,
  ...appliedContent,
  ...inspectionContent,
  ...visionContent,
  ...audioContent,
  ...rlContent,
};

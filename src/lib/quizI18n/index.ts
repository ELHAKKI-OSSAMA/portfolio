import type { QuizI18n } from './types';
export type { QuizI18n };

import { T_foundations } from './foundations';
import { T_supervised } from './supervised';
import { T_evaluation } from './evaluation';
import { T_neural } from './neural';
import { T_advanced } from './advanced';
import { T_unsupervised } from './unsupervised';
import { T_applied } from './applied';
import { T_inspection } from './inspection';
import { T_vision } from './vision';
import { T_audio } from './audio';
import { T_rl } from './rl';

export const T: Record<string, QuizI18n> = {
  ...T_foundations,
  ...T_supervised,
  ...T_evaluation,
  ...T_neural,
  ...T_advanced,
  ...T_unsupervised,
  ...T_applied,
  ...T_inspection,
  ...T_vision,
  ...T_audio,
  ...T_rl,
};

export function getQuizI18n(topicId: string, qIndex: number): QuizI18n | undefined {
  return T[`${topicId}|${qIndex}`];
}

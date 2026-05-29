import type { SectionI18n, KeyFormulaI18n } from '../types';

import { sectionI18n_foundations, keyFormulaI18n_foundations } from './foundations';
import { sectionI18n_supervised, keyFormulaI18n_supervised } from './supervised';
import { sectionI18n_evaluation, keyFormulaI18n_evaluation } from './evaluation';
import { sectionI18n_neural, keyFormulaI18n_neural } from './neural';
import { sectionI18n_advanced, keyFormulaI18n_advanced } from './advanced';
import { sectionI18n_unsupervised, keyFormulaI18n_unsupervised } from './unsupervised';
import { sectionI18n_applied, keyFormulaI18n_applied } from './applied';
import { sectionI18n_inspection, keyFormulaI18n_inspection } from './inspection';
import { sectionI18n_vision, keyFormulaI18n_vision } from './vision';
import { sectionI18n_audio, keyFormulaI18n_audio } from './audio';
import { sectionI18n_rl, keyFormulaI18n_rl } from './rl';

export const sectionI18n: Record<string, SectionI18n> = {
  ...sectionI18n_foundations,
  ...sectionI18n_supervised,
  ...sectionI18n_evaluation,
  ...sectionI18n_neural,
  ...sectionI18n_advanced,
  ...sectionI18n_unsupervised,
  ...sectionI18n_applied,
  ...sectionI18n_inspection,
  ...sectionI18n_vision,
  ...sectionI18n_audio,
  ...sectionI18n_rl,
};

export const keyFormulaI18n: Record<string, KeyFormulaI18n> = {
  ...keyFormulaI18n_foundations,
  ...keyFormulaI18n_supervised,
  ...keyFormulaI18n_evaluation,
  ...keyFormulaI18n_neural,
  ...keyFormulaI18n_advanced,
  ...keyFormulaI18n_unsupervised,
  ...keyFormulaI18n_applied,
  ...keyFormulaI18n_inspection,
  ...keyFormulaI18n_vision,
  ...keyFormulaI18n_audio,
  ...keyFormulaI18n_rl,
};

export function getSectionI18n(topicId: string, sectionIndex: number): SectionI18n | undefined {
  return sectionI18n[`${topicId}|${sectionIndex}`];
}

export function getKeyFormulaI18n(topicId: string, formulaIndex: number): KeyFormulaI18n | undefined {
  return keyFormulaI18n[`${topicId}|${formulaIndex}`];
}

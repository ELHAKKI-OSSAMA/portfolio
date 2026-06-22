export type { ProjectCategory, ProjectResult, Project } from './types';
import type { Project } from './types';
import { projectsPart1 } from './part1';
import { projectsPart2 } from './part2';
import { projectsPart3 } from './part3';

export const projects: Project[] = [...projectsPart1, ...projectsPart2, ...projectsPart3];

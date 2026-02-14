import { GameType, AgeGroup } from '../backend';
import { FrontendDifficulty } from './difficulty';

export type { GameType, AgeGroup };

export interface MathQuestion {
  question: string;
  answer: number;
  operand1: number;
  operand2: number;
  operation: string;
}

export interface RoundState {
  questions: MathQuestion[];
  currentIndex: number;
  correctCount: number;
  incorrectCount: number;
  startTime: number;
  answers: (number | null)[];
}

export interface RoundResult {
  correct: number;
  total: number;
  timeSpent: number;
  stars: number;
  gameType: GameType;
  ageGroup: AgeGroup;
  difficulty?: FrontendDifficulty;
}

export type FeedbackState = 'idle' | 'correct' | 'incorrect';

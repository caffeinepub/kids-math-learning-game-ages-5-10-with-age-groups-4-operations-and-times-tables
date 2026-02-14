import { FrontendDifficulty, getDifficultyMultiplier } from './difficulty';

export interface TimesTableData {
  table: number;
  rows: Array<{ multiplier: number; result: number; equation: string }>;
}

export function generateTimesTable(table: number): TimesTableData {
  const rows = Array.from({ length: 12 }, (_, i) => {
    const multiplier = i + 1;
    return {
      multiplier,
      result: table * multiplier,
      equation: `${table} × ${multiplier} = ${table * multiplier}`
    };
  });

  return { table, rows };
}

export function generateTimesTableQuestion(tables: number[]): { question: string; answer: number } {
  const table = tables[Math.floor(Math.random() * tables.length)];
  const multiplier = Math.floor(Math.random() * 12) + 1;
  return {
    question: `${table} × ${multiplier}`,
    answer: table * multiplier
  };
}

export function generateTimesTableQuestions(
  tables: number[], 
  count: number = 10, 
  difficulty?: FrontendDifficulty
): Array<{ question: string; answer: number }> {
  const actualCount = difficulty ? getDifficultyMultiplier(difficulty).questionCount : count;
  return Array.from({ length: actualCount }, () => generateTimesTableQuestion(tables));
}

export const AVAILABLE_TABLES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

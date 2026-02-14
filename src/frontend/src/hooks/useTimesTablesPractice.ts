import { useState } from 'react';
import { FrontendDifficulty } from '../game/difficulty';

interface PracticeState {
  selectedTables: number[];
  score: number;
  attempts: number;
  difficulty: FrontendDifficulty;
}

const STORAGE_KEY = 'kids-math-times-tables';

export function useTimesTablesPractice() {
  const [state, setState] = useState<PracticeState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { selectedTables: [2], score: 0, attempts: 0, difficulty: 'medium' };
  });

  const setSelectedTables = (tables: number[]) => {
    const newState = { ...state, selectedTables: tables };
    setState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };

  const setDifficulty = (difficulty: FrontendDifficulty) => {
    const newState = { ...state, difficulty };
    setState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };

  const updateScore = (correct: number, total: number) => {
    const newState = {
      ...state,
      score: state.score + correct,
      attempts: state.attempts + total
    };
    setState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };

  return {
    selectedTables: state.selectedTables,
    score: state.score,
    attempts: state.attempts,
    difficulty: state.difficulty,
    setSelectedTables,
    setDifficulty,
    updateScore
  };
}

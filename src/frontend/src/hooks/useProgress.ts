import { useState, useEffect } from 'react';
import { useInternetIdentity } from './useInternetIdentity';
import { useGetProgressSummary } from './useQueries';
import { AgeGroupKey } from '../state/ageGroup';
import { GameType } from '../backend';

interface LocalProgress {
  [key: string]: {
    attempts: number;
    bestScore: number;
    stars: number;
  };
}

const STORAGE_KEY = 'kids-math-progress';

function getProgressKey(ageGroup: AgeGroupKey, gameType: string): string {
  return `${ageGroup}-${gameType}`;
}

export function useProgress() {
  const { identity } = useInternetIdentity();
  const { data: backendProgress } = useGetProgressSummary();
  const [localProgress, setLocalProgress] = useState<LocalProgress>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  });

  const updateLocalProgress = (ageGroup: AgeGroupKey, gameType: string, correct: number, total: number, stars: number) => {
    const key = getProgressKey(ageGroup, gameType);
    const current = localProgress[key] || { attempts: 0, bestScore: 0, stars: 0 };
    
    const newProgress = {
      ...localProgress,
      [key]: {
        attempts: current.attempts + 1,
        bestScore: Math.max(current.bestScore, correct),
        stars: Math.max(current.stars, stars)
      }
    };

    setLocalProgress(newProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
  };

  const getProgress = (ageGroup: AgeGroupKey, gameType: string) => {
    const key = getProgressKey(ageGroup, gameType);
    return localProgress[key] || { attempts: 0, bestScore: 0, stars: 0 };
  };

  return {
    updateLocalProgress,
    getProgress,
    backendProgress,
    isAuthenticated: !!identity
  };
}

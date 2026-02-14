import { useState, useEffect } from 'react';
import { StickerReward, selectStickerReward } from '../rewards/stickers';
import { useInternetIdentity } from './useInternetIdentity';
import { Difficulty } from '../backend';
import { mapToBackendDifficulty } from '../game/difficulty';

const STORAGE_KEY = 'kids-math-stickers';

interface StickerStorage {
  earned: StickerReward[];
  completionCount: number;
}

export function useStickerRewards() {
  const { identity } = useInternetIdentity();
  const [storage, setStorage] = useState<StickerStorage>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { earned: [], completionCount: 0 };
  });

  const awardSticker = (): StickerReward => {
    const newSticker = selectStickerReward(storage.completionCount);
    const newStorage = {
      earned: [...storage.earned, newSticker],
      completionCount: storage.completionCount + 1
    };
    setStorage(newStorage);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStorage));
    return newSticker;
  };

  const getEarnedStickers = (): StickerReward[] => {
    return storage.earned;
  };

  return {
    awardSticker,
    getEarnedStickers,
    totalStickers: storage.earned.length
  };
}

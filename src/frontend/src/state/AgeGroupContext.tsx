import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AgeGroupKey } from './ageGroup';

interface AgeGroupContextType {
  selectedAgeGroup: AgeGroupKey | null;
  setSelectedAgeGroup: (ageGroup: AgeGroupKey) => void;
}

const AgeGroupContext = createContext<AgeGroupContextType | undefined>(undefined);

const STORAGE_KEY = 'kids-math-age-group';

export function AgeGroupProvider({ children }: { children: ReactNode }) {
  const [selectedAgeGroup, setSelectedAgeGroupState] = useState<AgeGroupKey | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored as AgeGroupKey | null;
  });

  const setSelectedAgeGroup = (ageGroup: AgeGroupKey) => {
    setSelectedAgeGroupState(ageGroup);
    localStorage.setItem(STORAGE_KEY, ageGroup);
  };

  return (
    <AgeGroupContext.Provider value={{ selectedAgeGroup, setSelectedAgeGroup }}>
      {children}
    </AgeGroupContext.Provider>
  );
}

export function useAgeGroup() {
  const context = useContext(AgeGroupContext);
  if (!context) {
    throw new Error('useAgeGroup must be used within AgeGroupProvider');
  }
  return context;
}

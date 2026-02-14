import React from 'react';
import { useAgeGroup } from '../../state/AgeGroupContext';
import { getAgeGroupInfo } from '../../state/ageGroup';
import { Badge } from '../ui/badge';

export default function SelectedAgeBadge() {
  const { selectedAgeGroup } = useAgeGroup();

  if (!selectedAgeGroup) return null;

  const info = getAgeGroupInfo(selectedAgeGroup);

  return (
    <div className="fixed top-20 right-4 z-40">
      <Badge variant="secondary" className="text-lg px-4 py-2 shadow-kid">
        {info.emoji} {info.label}
      </Badge>
    </div>
  );
}

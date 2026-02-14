import { AgeGroup } from '../backend';

export type AgeGroupKey = 'fiveSix' | 'sevenEight' | 'nineTen';

export interface AgeGroupInfo {
  key: AgeGroupKey;
  label: string;
  ageRange: string;
  description: string;
  emoji: string;
}

export const AGE_GROUPS: AgeGroupInfo[] = [
  {
    key: 'fiveSix',
    label: 'Beginner',
    ageRange: '5-6 years',
    description: 'Just starting out!',
    emoji: '🌟'
  },
  {
    key: 'sevenEight',
    label: 'Explorer',
    ageRange: '7-8 years',
    description: 'Learning more!',
    emoji: '🚀'
  },
  {
    key: 'nineTen',
    label: 'Champion',
    ageRange: '9-10 years',
    description: 'Math master!',
    emoji: '🏆'
  }
];

export function getAgeGroupInfo(key: AgeGroupKey): AgeGroupInfo {
  return AGE_GROUPS.find(ag => ag.key === key) || AGE_GROUPS[0];
}

export function ageGroupToBackend(key: AgeGroupKey): AgeGroup {
  return AgeGroup[key];
}

export function backendToAgeGroup(ag: AgeGroup): AgeGroupKey {
  const key = Object.keys(AgeGroup).find(k => AgeGroup[k as keyof typeof AgeGroup] === ag);
  return (key as AgeGroupKey) || 'fiveSix';
}

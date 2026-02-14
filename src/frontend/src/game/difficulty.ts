// Frontend difficulty definitions with 4 options
export type FrontendDifficulty = 'easy' | 'medium' | 'hard' | 'mathWizard';

export const DIFFICULTY_OPTIONS: Array<{
  value: FrontendDifficulty;
  label: string;
  emoji: string;
  description: string;
}> = [
  { value: 'easy', label: 'Easy', emoji: '🌱', description: 'Perfect for beginners!' },
  { value: 'medium', label: 'Medium', emoji: '⭐', description: 'Ready for a challenge!' },
  { value: 'hard', label: 'Hard', emoji: '🔥', description: 'For math champions!' },
  { value: 'mathWizard', label: 'Math Wizard', emoji: '🧙‍♂️', description: 'Ultimate challenge!' }
];

// Map frontend difficulty to backend Difficulty for authenticated submissions
export function mapToBackendDifficulty(frontendDifficulty: FrontendDifficulty): 'easy' | 'medium' | 'hard' {
  if (frontendDifficulty === 'mathWizard') {
    return 'hard'; // Map Math Wizard to hard for backend
  }
  return frontendDifficulty;
}

export function getDifficultyMultiplier(difficulty: FrontendDifficulty): {
  questionCount: number;
  rangeMultiplier: number;
} {
  switch (difficulty) {
    case 'easy':
      return { questionCount: 8, rangeMultiplier: 0.7 };
    case 'medium':
      return { questionCount: 10, rangeMultiplier: 1.0 };
    case 'hard':
      return { questionCount: 12, rangeMultiplier: 1.3 };
    case 'mathWizard':
      return { questionCount: 15, rangeMultiplier: 1.6 };
  }
}

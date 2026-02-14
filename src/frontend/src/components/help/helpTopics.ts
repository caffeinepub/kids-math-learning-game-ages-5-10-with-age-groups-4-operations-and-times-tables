export interface HelpTopic {
  id: string;
  title: string;
  videoFile: string;
  fallbackText: string;
  emoji: string;
}

export const HELP_TOPICS: HelpTopic[] = [
  {
    id: 'addition',
    title: 'Addition',
    videoFile: '/videos/addition.mp4',
    fallbackText: 'Addition means putting numbers together! When you add 2 + 3, you start with 2 and count up 3 more: 3, 4, 5. So 2 + 3 = 5! Try counting on your fingers to help you add.',
    emoji: '➕'
  },
  {
    id: 'subtraction',
    title: 'Subtraction',
    videoFile: '/videos/subtraction.mp4',
    fallbackText: 'Subtraction means taking away! When you subtract 5 - 2, you start with 5 and take away 2: 4, 3. So 5 - 2 = 3! Imagine you have 5 cookies and eat 2 - how many are left?',
    emoji: '➖'
  },
  {
    id: 'multiplication',
    title: 'Multiplication',
    videoFile: '/videos/multiplication.mp4',
    fallbackText: 'Multiplication is like adding the same number many times! 3 × 4 means "3 groups of 4" or 4 + 4 + 4 = 12. It\'s a faster way to add!',
    emoji: '✖️'
  },
  {
    id: 'division',
    title: 'Division',
    videoFile: '/videos/division.mp4',
    fallbackText: 'Division means sharing equally! If you have 12 cookies and want to share them with 3 friends, you divide: 12 ÷ 3 = 4. Each friend gets 4 cookies!',
    emoji: '➗'
  },
  {
    id: 'times-tables',
    title: 'Times Tables',
    videoFile: '/videos/times-tables.mp4',
    fallbackText: 'Times tables help you learn multiplication faster! The 2 times table is: 2×1=2, 2×2=4, 2×3=6, and so on. Practice them and you\'ll become a multiplication master!',
    emoji: '📊'
  }
];

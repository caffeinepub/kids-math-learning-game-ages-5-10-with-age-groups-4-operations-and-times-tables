import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface FeedbackBannerProps {
  type: 'correct' | 'incorrect' | null;
  message?: string;
}

export default function FeedbackBanner({ type, message }: FeedbackBannerProps) {
  if (!type) return null;

  const isCorrect = type === 'correct';

  const defaultMessages = {
    correct: [
      'Amazing! You got it! 🌟',
      'Perfect! Keep going! 🎉',
      'Fantastic work! ⭐',
      'You\'re a math star! 🌟',
      'Brilliant! Well done! 🎊'
    ],
    incorrect: [
      'Not quite! Try again! 💪',
      'Almost there! Give it another go! 🤔',
      'Keep trying! You can do it! 💫',
      'Nice try! Let\'s try once more! 🌈'
    ]
  };

  const randomMessage = isCorrect 
    ? defaultMessages.correct[Math.floor(Math.random() * defaultMessages.correct.length)]
    : defaultMessages.incorrect[Math.floor(Math.random() * defaultMessages.incorrect.length)];

  return (
    <Alert 
      className={`animate-bounce-in border-4 ${
        isCorrect 
          ? 'bg-success/20 border-success text-success-foreground' 
          : 'bg-warning/20 border-warning text-warning-foreground'
      }`}
    >
      <div className="flex items-center gap-4">
        {isCorrect ? (
          <CheckCircle className="w-8 h-8" />
        ) : (
          <XCircle className="w-8 h-8" />
        )}
        <AlertDescription className="text-2xl font-bold">
          {message || randomMessage}
        </AlertDescription>
      </div>
    </Alert>
  );
}

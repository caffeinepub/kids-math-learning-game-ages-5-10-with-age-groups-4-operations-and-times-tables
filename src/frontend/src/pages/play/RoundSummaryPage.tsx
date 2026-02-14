import React, { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import StarsRow from '../../components/progress/StarsRow';
import Mascot from '../../components/mascot/Mascot';
import PageShell from '../../components/layout/PageShell';
import PageHeader from '../../components/layout/PageHeader';
import { useAgeGroup } from '../../state/AgeGroupContext';
import { useProgress } from '../../hooks/useProgress';
import { useSubmitResult, useAddEarnedReward } from '../../hooks/useQueries';
import { useStickerRewards } from '../../hooks/useStickerRewards';
import { RoundResult } from '../../game/types';
import { backendToAgeGroup } from '../../state/ageGroup';
import { GameType, Difficulty } from '../../backend';
import { DIFFICULTY_OPTIONS, mapToBackendDifficulty } from '../../game/difficulty';
import { StickerReward } from '../../rewards/stickers';

const RESULT_STORAGE_KEY = 'math-game-result';

export default function RoundSummaryPage() {
  const navigate = useNavigate();
  const { selectedAgeGroup } = useAgeGroup();
  const { updateLocalProgress, isAuthenticated } = useProgress();
  const submitResult = useSubmitResult();
  const addEarnedReward = useAddEarnedReward();
  const { awardSticker } = useStickerRewards();
  const [result, setResult] = useState<RoundResult | null>(null);
  const [awardedSticker, setAwardedSticker] = useState<StickerReward | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const storedResult = sessionStorage.getItem(RESULT_STORAGE_KEY);
    if (storedResult) {
      const parsedResult = JSON.parse(storedResult) as RoundResult;
      setResult(parsedResult);
      sessionStorage.removeItem(RESULT_STORAGE_KEY);

      // Award sticker for completing the round
      const newSticker = awardSticker();
      setAwardedSticker(newSticker);
    }
  }, []);

  useEffect(() => {
    if (result && selectedAgeGroup) {
      const gameTypeKey = Object.keys(GameType).find(k => GameType[k as keyof typeof GameType] === result.gameType) || 'addition';
      updateLocalProgress(selectedAgeGroup, gameTypeKey, result.correct, result.total, result.stars);

      if (isAuthenticated && awardedSticker) {
        const backendDifficulty = result.difficulty 
          ? mapToBackendDifficulty(result.difficulty) 
          : 'medium';
        
        submitResult.mutate({
          gameType: result.gameType,
          ageGroup: result.ageGroup,
          correct: result.correct,
          total: result.total,
          stars: result.stars,
          difficulty: Difficulty[backendDifficulty]
        });

        // Save sticker to backend
        addEarnedReward.mutate({
          difficulty: Difficulty[backendDifficulty],
          reward: awardedSticker.id
        });
      }
    }
  }, [result, selectedAgeGroup, isAuthenticated, awardedSticker]);

  if (!result) {
    return (
      <PageShell>
        <div className="text-center text-2xl font-normal">Loading results...</div>
      </PageShell>
    );
  }

  const incorrectCount = result.total - result.correct;
  const percentage = Math.round((result.correct / result.total) * 100);
  const timeInSeconds = result.timeSpent;
  const difficultyOption = result.difficulty 
    ? DIFFICULTY_OPTIONS.find(opt => opt.value === result.difficulty)
    : null;

  return (
    <PageShell maxWidth="5xl">
      <PageHeader
        title="Round Complete!"
        subtitle="Great job! Here's how you did:"
        emoji="🎉"
        mascot={<Mascot state="cheer" className="w-56 h-56" />}
      />

      {difficultyOption && (
        <div className="text-center mb-6">
          <Badge variant="secondary" className="text-2xl px-6 py-3">
            {difficultyOption.emoji} {difficultyOption.label}
          </Badge>
        </div>
      )}

      <Card className="border-4 border-primary/20 shadow-kid bg-card">
        <CardHeader>
          <CardTitle className="text-4xl md:text-5xl text-center">Your Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-10 py-8">
          <div className="text-center">
            <StarsRow stars={result.stars} size="lg" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-success/10 rounded-3xl p-8 border-2 border-success">
              <p className="text-7xl font-bold text-success mb-3">{result.correct}</p>
              <p className="text-xl md:text-2xl font-normal">Correct</p>
            </div>
            <div className="bg-destructive/10 rounded-3xl p-8 border-2 border-destructive">
              <p className="text-7xl font-bold text-destructive mb-3">{incorrectCount}</p>
              <p className="text-xl md:text-2xl font-normal">Incorrect</p>
            </div>
            <div className="bg-accent/10 rounded-3xl p-8 border-2 border-accent">
              <p className="text-6xl font-bold text-accent mb-3">{percentage}%</p>
              <p className="text-xl md:text-2xl font-normal">Score</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-2xl md:text-3xl font-normal">
              Time: {timeInSeconds} seconds
            </p>
          </div>
        </CardContent>
      </Card>

      {awardedSticker && (
        <Card className="border-4 border-secondary/20 shadow-kid bg-gradient-to-br from-secondary/10 to-accent/10">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl text-center">
              🎁 You Earned a Sticker!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6 py-6">
            {!imageError ? (
              <img
                src={awardedSticker.imagePath}
                alt={awardedSticker.name}
                className="w-32 h-32 mx-auto animate-bounce-in"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="text-8xl animate-bounce-in">{awardedSticker.emoji}</div>
            )}
            <p className="text-2xl md:text-3xl font-bold">
              {awardedSticker.name}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-6 justify-center">
        <Button 
          size="lg" 
          onClick={() => navigate({ to: '/activity-select' })}
          className="text-2xl md:text-3xl h-16 px-10"
        >
          Play Again
        </Button>
        <Button 
          size="lg" 
          variant="outline"
          onClick={() => navigate({ to: '/' })}
          className="text-2xl md:text-3xl h-16 px-10"
        >
          Home
        </Button>
      </div>
    </PageShell>
  );
}

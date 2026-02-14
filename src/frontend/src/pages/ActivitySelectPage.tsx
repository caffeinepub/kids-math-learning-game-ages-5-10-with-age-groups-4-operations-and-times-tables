import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useAgeGroup } from '../state/AgeGroupContext';
import { useProgress } from '../hooks/useProgress';
import { GameType } from '../backend';
import StarsRow from '../components/progress/StarsRow';
import Mascot from '../components/mascot/Mascot';
import PageShell from '../components/layout/PageShell';
import PageHeader from '../components/layout/PageHeader';
import DifficultySelector from '../components/game/DifficultySelector';
import { Plus, Minus, X, Divide } from 'lucide-react';
import { FrontendDifficulty } from '../game/difficulty';

const DIFFICULTY_STORAGE_KEY = 'math-game-selected-difficulty';

export default function ActivitySelectPage() {
  const navigate = useNavigate();
  const { selectedAgeGroup } = useAgeGroup();
  const { getProgress } = useProgress();
  const [selectedDifficulty, setSelectedDifficulty] = useState<FrontendDifficulty>('medium');

  const activities = [
    {
      type: 'addition',
      title: 'Addition',
      description: 'Add numbers together!',
      icon: Plus,
      color: 'bg-primary',
      emoji: '➕'
    },
    {
      type: 'subtraction',
      title: 'Subtraction',
      description: 'Take numbers away!',
      icon: Minus,
      color: 'bg-accent',
      emoji: '➖'
    },
    {
      type: 'multiplication',
      title: 'Multiplication',
      description: 'Multiply numbers!',
      icon: X,
      color: 'bg-secondary',
      emoji: '✖️'
    },
    {
      type: 'division',
      title: 'Division',
      description: 'Share numbers equally!',
      icon: Divide,
      color: 'bg-warning',
      emoji: '➗'
    }
  ];

  const handleStartActivity = (activityType: string) => {
    // Store selected difficulty in sessionStorage for the round
    sessionStorage.setItem(DIFFICULTY_STORAGE_KEY, selectedDifficulty);
    navigate({ to: `/play/${activityType}` });
  };

  return (
    <PageShell maxWidth="6xl">
      <PageHeader
        title="Choose Your Challenge!"
        subtitle="What do you want to practice today?"
        emoji="🎯"
        mascot={<Mascot state="cheer" className="w-48 h-48" />}
      />

      <DifficultySelector value={selectedDifficulty} onChange={setSelectedDifficulty} className="mb-10" />

      <div className="grid md:grid-cols-2 gap-8">
        {activities.map((activity) => {
          const Icon = activity.icon;
          const progress = selectedAgeGroup ? getProgress(selectedAgeGroup, activity.type) : null;

          return (
            <Card
              key={activity.type}
              className="border-4 border-primary/20 shadow-kid hover:shadow-xl transition-all cursor-pointer hover:scale-105"
              onClick={() => handleStartActivity(activity.type)}
            >
              <CardHeader className="space-y-6">
                <div className={`${activity.color} w-24 h-24 rounded-3xl flex items-center justify-center mx-auto`}>
                  <span className="text-6xl">{activity.emoji}</span>
                </div>
                <CardTitle className="text-4xl md:text-5xl text-center text-foreground">{activity.title}</CardTitle>
                <CardDescription className="text-xl md:text-2xl text-center text-foreground">
                  {activity.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {progress && progress.attempts > 0 && (
                  <div className="space-y-4">
                    <StarsRow stars={progress.stars} size="md" />
                    <p className="text-center text-lg md:text-xl text-foreground">
                      Best: {progress.bestScore} | Played: {progress.attempts} times
                    </p>
                  </div>
                )}
                <Button 
                  size="lg" 
                  className="w-full text-2xl md:text-3xl h-16"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartActivity(activity.type);
                  }}
                >
                  Start Playing!
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}

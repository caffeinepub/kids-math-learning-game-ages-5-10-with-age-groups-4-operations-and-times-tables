import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { useAgeGroup } from '../state/AgeGroupContext';
import { useProgress } from '../hooks/useProgress';
import { useGetProgressSummary } from '../hooks/useQueries';
import { useStickerRewards } from '../hooks/useStickerRewards';
import StarsRow from '../components/progress/StarsRow';
import Mascot from '../components/mascot/Mascot';
import PageShell from '../components/layout/PageShell';
import PageHeader from '../components/layout/PageHeader';
import { GameType } from '../backend';

export default function ProgressPage() {
  const { selectedAgeGroup } = useAgeGroup();
  const { getProgress } = useProgress();
  const { data: backendProgress } = useGetProgressSummary();
  const { getEarnedStickers } = useStickerRewards();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const activities = [
    { type: 'addition', title: 'Addition', emoji: '➕' },
    { type: 'subtraction', title: 'Subtraction', emoji: '➖' },
    { type: 'multiplication', title: 'Multiplication', emoji: '✖️' },
    { type: 'division', title: 'Division', emoji: '➗' }
  ];

  const totalStars = selectedAgeGroup
    ? activities.reduce((sum, activity) => sum + getProgress(selectedAgeGroup, activity.type).stars, 0)
    : 0;

  const earnedStickers = getEarnedStickers();

  const handleImageError = (stickerId: string) => {
    setImageErrors(prev => ({ ...prev, [stickerId]: true }));
  };

  return (
    <PageShell maxWidth="5xl">
      <PageHeader
        title="Your Progress"
        subtitle="Look at all your amazing achievements!"
        emoji="🏆"
        mascot={<Mascot state="cheer" className="w-48 h-48" />}
      />

      {selectedAgeGroup ? (
        <div className="space-y-10">
          <Card className="border-4 border-primary/20 shadow-kid">
            <CardHeader>
              <CardTitle className="text-4xl md:text-5xl text-center text-foreground">Total Stars Earned</CardTitle>
            </CardHeader>
            <CardContent className="py-8">
              <div className="text-center space-y-6">
                <p className="text-8xl md:text-9xl font-bold text-secondary">{totalStars}</p>
                <StarsRow stars={Math.min(totalStars, 3)} size="lg" />
              </div>
            </CardContent>
          </Card>

          {earnedStickers.length > 0 && (
            <Card className="border-4 border-secondary/20 shadow-kid">
              <CardHeader>
                <CardTitle className="text-4xl md:text-5xl text-center text-foreground">
                  🎁 Sticker Collection
                </CardTitle>
              </CardHeader>
              <CardContent className="py-8">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
                  {earnedStickers.map((sticker, index) => (
                    <div
                      key={`${sticker.id}-${index}`}
                      className="flex flex-col items-center justify-center bg-muted rounded-3xl p-4 border-2 border-primary/20 hover:scale-110 transition-transform"
                    >
                      {!imageErrors[`${sticker.id}-${index}`] ? (
                        <img
                          src={sticker.imagePath}
                          alt={sticker.name}
                          className="w-20 h-20"
                          onError={() => handleImageError(`${sticker.id}-${index}`)}
                        />
                      ) : (
                        <div className="text-5xl">{sticker.emoji}</div>
                      )}
                      <p className="text-xs text-center mt-2 text-foreground font-medium">
                        {sticker.name}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-center text-xl md:text-2xl text-foreground mt-6">
                  Total Stickers: {earnedStickers.length}
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {activities.map((activity) => {
              const progress = getProgress(selectedAgeGroup, activity.type);
              return (
                <Card key={activity.type} className="border-4 border-primary/20 shadow-kid">
                  <CardHeader>
                    <CardTitle className="text-3xl md:text-4xl flex items-center gap-4 text-foreground">
                      <span className="text-5xl">{activity.emoji}</span>
                      {activity.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <StarsRow stars={progress.stars} size="md" />
                    <div className="grid grid-cols-2 gap-6 text-center">
                      <div className="bg-success/10 rounded-2xl p-6 border-2 border-success">
                        <p className="text-5xl font-bold text-success">{progress.bestScore}</p>
                        <p className="text-base text-foreground mt-2">Best Score</p>
                      </div>
                      <div className="bg-accent/10 rounded-2xl p-6 border-2 border-accent">
                        <p className="text-5xl font-bold text-accent">{progress.attempts}</p>
                        <p className="text-base text-foreground mt-2">Times Played</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {backendProgress && backendProgress.length > 0 && (
            <Card className="border-4 border-accent/20 shadow-kid">
              <CardHeader>
                <CardTitle className="text-3xl md:text-4xl text-foreground">Cloud Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xl md:text-2xl text-foreground">
                  Your progress is saved to the cloud! 🌟
                </p>
                <div className="space-y-3">
                  {backendProgress.map((summary, index) => (
                    <div key={index} className="bg-muted rounded-2xl p-6">
                      <p className="text-lg md:text-xl text-foreground">
                        Total Score: {Number(summary.score)} | Attempts: {Number(summary.attempts)} | Stars: {Number(summary.stars)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card className="border-4 border-warning shadow-kid">
          <CardContent className="pt-8 text-center">
            <p className="text-2xl md:text-3xl text-foreground">Please select your age group first!</p>
          </CardContent>
        </Card>
      )}
    </PageShell>
  );
}

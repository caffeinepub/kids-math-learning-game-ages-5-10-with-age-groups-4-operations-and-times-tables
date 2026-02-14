import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useAgeGroup } from '../../state/AgeGroupContext';
import { ageGroupToBackend } from '../../state/ageGroup';
import { GameType } from '../../backend';
import { generateQuestions } from '../../game/questionGenerator';
import { createRound, answerQuestion, nextQuestion, isRoundComplete, createRoundResult } from '../../game/roundEngine';
import { RoundState, FeedbackState, RoundResult } from '../../game/types';
import AnswerPad from '../../components/game/AnswerPad';
import FeedbackBanner from '../../components/game/FeedbackBanner';
import Mascot from '../../components/mascot/Mascot';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { FrontendDifficulty, getDifficultyMultiplier, DIFFICULTY_OPTIONS } from '../../game/difficulty';

const RESULT_STORAGE_KEY = 'math-game-result';
const DIFFICULTY_STORAGE_KEY = 'math-game-selected-difficulty';

export default function PlayRoundPage() {
  const navigate = useNavigate();
  const params = useParams({ from: '/play/$gameType' });
  const { selectedAgeGroup } = useAgeGroup();
  const [roundState, setRoundState] = useState<RoundState | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>('idle');
  const [isProcessing, setIsProcessing] = useState(false);
  const [difficulty, setDifficulty] = useState<FrontendDifficulty>('medium');

  const gameType = GameType[params.gameType as keyof typeof GameType];

  useEffect(() => {
    if (selectedAgeGroup && gameType) {
      // Read difficulty from sessionStorage
      const storedDifficulty = sessionStorage.getItem(DIFFICULTY_STORAGE_KEY) as FrontendDifficulty | null;
      const selectedDifficulty = storedDifficulty || 'medium';
      setDifficulty(selectedDifficulty);

      const { questionCount } = getDifficultyMultiplier(selectedDifficulty);
      const questions = generateQuestions(gameType, selectedAgeGroup, questionCount, selectedDifficulty);
      setRoundState(createRound(questions));
    }
  }, [selectedAgeGroup, gameType]);

  const handleAnswer = (answer: number) => {
    if (!roundState || isProcessing) return;

    setIsProcessing(true);
    const currentQuestion = roundState.questions[roundState.currentIndex];
    const isCorrect = answer === currentQuestion.answer;

    setFeedback(isCorrect ? 'correct' : 'incorrect');

    setTimeout(() => {
      const newState = answerQuestion(roundState, answer);
      
      if (isCorrect) {
        const nextState = nextQuestion(newState);
        
        if (isRoundComplete(nextState)) {
          const result = createRoundResult(nextState, gameType, ageGroupToBackend(selectedAgeGroup!));
          // Include difficulty in the result
          const resultWithDifficulty: RoundResult = { ...result, difficulty };
          sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(resultWithDifficulty));
          navigate({ to: '/round-summary' });
        } else {
          setRoundState(nextState);
          setFeedback('idle');
          setIsProcessing(false);
        }
      } else {
        setRoundState(newState);
        setFeedback('idle');
        setIsProcessing(false);
      }
    }, 1500);
  };

  if (!roundState) {
    return <div className="text-center text-2xl">Loading...</div>;
  }

  const currentQuestion = roundState.questions[roundState.currentIndex];
  const progress = ((roundState.currentIndex + 1) / roundState.questions.length) * 100;
  const difficultyOption = DIFFICULTY_OPTIONS.find(opt => opt.value === difficulty);

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <span className="text-2xl md:text-3xl font-bold text-foreground">
            Question {roundState.currentIndex + 1} of {roundState.questions.length}
          </span>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-xl px-4 py-2">
              {difficultyOption?.emoji} {difficultyOption?.label}
            </Badge>
            <span className="text-2xl md:text-3xl font-bold text-success">
              ✓ {roundState.correctCount}
            </span>
          </div>
        </div>
        <Progress value={progress} className="h-6" />
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-8">
          <Card className="border-4 border-primary/20 shadow-kid">
            <CardHeader>
              <CardTitle className="text-center text-6xl md:text-8xl font-bold text-primary py-6">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-2xl md:text-3xl text-foreground">
                What's the answer?
              </p>
            </CardContent>
          </Card>

          {feedback !== 'idle' && (
            <div>
              <FeedbackBanner type={feedback} />
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center">
          <Mascot 
            state={feedback === 'correct' ? 'cheer' : feedback === 'incorrect' ? 'encourage' : 'idle'} 
            className="w-56 h-56"
          />
        </div>
      </div>

      <AnswerPad onSubmit={handleAnswer} disabled={isProcessing} />

      <div className="text-center">
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate({ to: '/activity-select' })}
          className="text-xl md:text-2xl h-14 px-8"
        >
          Exit Game
        </Button>
      </div>
    </div>
  );
}

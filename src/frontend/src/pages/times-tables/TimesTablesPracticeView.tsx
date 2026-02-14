import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Checkbox } from '../../components/ui/checkbox';
import { Label } from '../../components/ui/label';
import { generateTimesTableQuestions, AVAILABLE_TABLES } from '../../game/timesTables';
import { useTimesTablesPractice } from '../../hooks/useTimesTablesPractice';
import { useUpdatePracticeStats } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import AnswerPad from '../../components/game/AnswerPad';
import FeedbackBanner from '../../components/game/FeedbackBanner';
import StarsRow from '../../components/progress/StarsRow';
import DifficultySelector from '../../components/game/DifficultySelector';
import { FeedbackState } from '../../game/types';
import { DIFFICULTY_OPTIONS } from '../../game/difficulty';

export default function TimesTablesPracticeView() {
  const { selectedTables, difficulty, setSelectedTables, setDifficulty, updateScore } = useTimesTablesPractice();
  const { identity } = useInternetIdentity();
  const updatePracticeStats = useUpdatePracticeStats();

  const [isPlaying, setIsPlaying] = useState(false);
  const [questions, setQuestions] = useState<Array<{ question: string; answer: number }>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState>('idle');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTableToggle = (table: number) => {
    if (selectedTables.includes(table)) {
      setSelectedTables(selectedTables.filter(t => t !== table));
    } else {
      setSelectedTables([...selectedTables, table]);
    }
  };

  const handleStartPractice = () => {
    if (selectedTables.length === 0) return;
    const newQuestions = generateTimesTableQuestions(selectedTables, 10, difficulty);
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setCorrectCount(0);
    setIsPlaying(true);
    setFeedback('idle');
  };

  const handleAnswer = (answer: number) => {
    if (isProcessing) return;

    setIsProcessing(true);
    const currentQuestion = questions[currentIndex];
    const isCorrect = answer === currentQuestion.answer;

    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex + 1 >= questions.length) {
        const finalCorrect = isCorrect ? correctCount + 1 : correctCount;
        updateScore(finalCorrect, questions.length);

        if (identity) {
          selectedTables.forEach(table => {
            updatePracticeStats.mutate({
              table,
              correct: finalCorrect,
              attempts: questions.length
            });
          });
        }

        setIsPlaying(false);
      } else {
        setCurrentIndex(prev => prev + 1);
        setFeedback('idle');
      }
      setIsProcessing(false);
    }, 1500);
  };

  if (isPlaying) {
    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;
    const difficultyOption = DIFFICULTY_OPTIONS.find(opt => opt.value === difficulty);

    return (
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <span className="text-2xl md:text-3xl font-bold text-foreground">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-xl px-4 py-2">
                {difficultyOption?.emoji} {difficultyOption?.label}
              </Badge>
              <span className="text-2xl md:text-3xl font-bold text-success">
                ✓ {correctCount}
              </span>
            </div>
          </div>
        </div>

        <Card className="border-4 border-primary/20 shadow-kid">
          <CardHeader>
            <CardTitle className="text-center text-7xl md:text-8xl font-bold text-primary py-6">
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

        <AnswerPad onSubmit={handleAnswer} disabled={isProcessing} />
      </div>
    );
  }

  if (questions.length > 0 && !isPlaying) {
    const percentage = Math.round((correctCount / questions.length) * 100);
    const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : percentage >= 50 ? 1 : 0;
    const difficultyOption = DIFFICULTY_OPTIONS.find(opt => opt.value === difficulty);

    return (
      <div className="max-w-4xl mx-auto space-y-10">
        <Card className="border-4 border-primary/20 shadow-kid">
          <CardHeader>
            <CardTitle className="text-4xl md:text-5xl text-center text-foreground">Practice Complete! 🎉</CardTitle>
            {difficultyOption && (
              <div className="text-center pt-4">
                <Badge variant="secondary" className="text-xl px-4 py-2">
                  {difficultyOption.emoji} {difficultyOption.label}
                </Badge>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-8 py-6">
            <div className="text-center">
              <StarsRow stars={stars} size="lg" />
            </div>

            <div className="grid grid-cols-2 gap-8 text-center">
              <div className="bg-success/10 rounded-3xl p-8 border-2 border-success">
                <p className="text-7xl font-bold text-success mb-3">{correctCount}</p>
                <p className="text-xl md:text-2xl text-foreground">Correct</p>
              </div>
              <div className="bg-accent/10 rounded-3xl p-8 border-2 border-accent">
                <p className="text-6xl font-bold text-accent mb-3">{percentage}%</p>
                <p className="text-xl md:text-2xl text-foreground">Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-6 justify-center">
          <Button size="lg" onClick={handleStartPractice} className="text-2xl md:text-3xl px-10 h-16">
            Practice Again
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => setQuestions([])}
            className="text-2xl md:text-3xl px-10 h-16"
          >
            Change Settings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <DifficultySelector value={difficulty} onChange={setDifficulty} />

      <Card className="border-4 border-primary/20 shadow-kid">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl text-foreground">Select Times Tables to Practice</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-6">
            {AVAILABLE_TABLES.map((table) => (
              <div key={table} className="flex items-center space-x-4 bg-muted rounded-2xl p-5">
                <Checkbox
                  id={`table-${table}`}
                  checked={selectedTables.includes(table)}
                  onCheckedChange={() => handleTableToggle(table)}
                />
                <Label
                  htmlFor={`table-${table}`}
                  className="text-2xl md:text-3xl font-bold cursor-pointer text-foreground"
                >
                  {table}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center space-y-6">
        <Button
          size="lg"
          onClick={handleStartPractice}
          disabled={selectedTables.length === 0}
          className="text-2xl md:text-3xl px-12 h-16"
        >
          Start Practice
        </Button>
        {selectedTables.length === 0 && (
          <p className="text-xl md:text-2xl text-foreground">
            Please select at least one times table!
          </p>
        )}
      </div>
    </div>
  );
}

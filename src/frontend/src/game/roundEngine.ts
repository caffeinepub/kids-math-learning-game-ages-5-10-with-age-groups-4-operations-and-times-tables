import { MathQuestion, RoundState, RoundResult } from './types';
import { GameType, AgeGroup } from '../backend';

export function createRound(questions: MathQuestion[]): RoundState {
  return {
    questions,
    currentIndex: 0,
    correctCount: 0,
    incorrectCount: 0,
    startTime: Date.now(),
    answers: Array(questions.length).fill(null)
  };
}

export function answerQuestion(state: RoundState, answer: number): RoundState {
  const currentQuestion = state.questions[state.currentIndex];
  const isCorrect = answer === currentQuestion.answer;

  const newAnswers = [...state.answers];
  newAnswers[state.currentIndex] = answer;

  return {
    ...state,
    correctCount: isCorrect ? state.correctCount + 1 : state.correctCount,
    incorrectCount: isCorrect ? state.incorrectCount : state.incorrectCount + 1,
    answers: newAnswers
  };
}

export function nextQuestion(state: RoundState): RoundState {
  return {
    ...state,
    currentIndex: state.currentIndex + 1
  };
}

export function isRoundComplete(state: RoundState): boolean {
  return state.currentIndex >= state.questions.length;
}

export function createRoundResult(state: RoundState, gameType: GameType, ageGroup: AgeGroup): RoundResult {
  const timeSpent = Math.floor((Date.now() - state.startTime) / 1000);
  const percentage = (state.correctCount / state.questions.length) * 100;
  
  let stars = 0;
  if (percentage >= 90) stars = 3;
  else if (percentage >= 70) stars = 2;
  else if (percentage >= 50) stars = 1;

  return {
    correct: state.correctCount,
    total: state.questions.length,
    timeSpent,
    stars,
    gameType,
    ageGroup
  };
}

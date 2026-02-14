import { GameType } from '../backend';
import { AgeGroupKey } from '../state/ageGroup';
import { MathQuestion } from './types';
import { FrontendDifficulty, getDifficultyMultiplier } from './difficulty';

interface NumberRange {
  min: number;
  max: number;
}

function getNumberRange(ageGroup: AgeGroupKey, operation: GameType, difficulty?: FrontendDifficulty): NumberRange {
  const baseRanges: Record<AgeGroupKey, Record<string, NumberRange>> = {
    fiveSix: {
      addition: { min: 1, max: 10 },
      subtraction: { min: 1, max: 10 },
      multiplication: { min: 1, max: 5 },
      division: { min: 1, max: 5 }
    },
    sevenEight: {
      addition: { min: 1, max: 20 },
      subtraction: { min: 1, max: 20 },
      multiplication: { min: 1, max: 10 },
      division: { min: 1, max: 10 }
    },
    nineTen: {
      addition: { min: 1, max: 50 },
      subtraction: { min: 1, max: 50 },
      multiplication: { min: 1, max: 12 },
      division: { min: 1, max: 12 }
    }
  };

  const operationKey = Object.keys(GameType).find(k => GameType[k as keyof typeof GameType] === operation) || 'addition';
  const baseRange = baseRanges[ageGroup][operationKey] || baseRanges.fiveSix.addition;

  // Apply difficulty multiplier if provided
  if (difficulty) {
    const { rangeMultiplier } = getDifficultyMultiplier(difficulty);
    const adjustedMax = Math.max(baseRange.min + 1, Math.round(baseRange.max * rangeMultiplier));
    return { min: baseRange.min, max: adjustedMax };
  }

  return baseRange;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateAddition(range: NumberRange): MathQuestion {
  const a = randomInt(range.min, range.max);
  const b = randomInt(range.min, range.max);
  return {
    question: `${a} + ${b}`,
    answer: a + b,
    operand1: a,
    operand2: b,
    operation: '+'
  };
}

function generateSubtraction(range: NumberRange): MathQuestion {
  const a = randomInt(range.min, range.max);
  const b = randomInt(range.min, a); // Ensure non-negative result
  return {
    question: `${a} - ${b}`,
    answer: a - b,
    operand1: a,
    operand2: b,
    operation: '-'
  };
}

function generateMultiplication(range: NumberRange): MathQuestion {
  const a = randomInt(range.min, range.max);
  const b = randomInt(range.min, range.max);
  return {
    question: `${a} × ${b}`,
    answer: a * b,
    operand1: a,
    operand2: b,
    operation: '×'
  };
}

function generateDivision(range: NumberRange): MathQuestion {
  // Generate division with integer results
  const divisor = randomInt(range.min, range.max);
  const quotient = randomInt(range.min, range.max);
  const dividend = divisor * quotient;
  return {
    question: `${dividend} ÷ ${divisor}`,
    answer: quotient,
    operand1: dividend,
    operand2: divisor,
    operation: '÷'
  };
}

export function generateQuestion(gameType: GameType, ageGroup: AgeGroupKey, difficulty?: FrontendDifficulty): MathQuestion {
  const range = getNumberRange(ageGroup, gameType, difficulty);

  switch (gameType) {
    case GameType.addition:
      return generateAddition(range);
    case GameType.subtraction:
      return generateSubtraction(range);
    case GameType.multiplication:
      return generateMultiplication(range);
    case GameType.division:
      return generateDivision(range);
    default:
      return generateAddition(range);
  }
}

export function generateQuestions(gameType: GameType, ageGroup: AgeGroupKey, count: number = 10, difficulty?: FrontendDifficulty): MathQuestion[] {
  return Array.from({ length: count }, () => generateQuestion(gameType, ageGroup, difficulty));
}

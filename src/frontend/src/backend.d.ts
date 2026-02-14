import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TimesTableSummary {
    timeSpent: bigint;
    totalQuestions: bigint;
    starsEarned: bigint;
    tableSpeed: Array<[bigint, bigint]>;
    tableCorrect: bigint;
}
export interface PracticeUpdate {
    correct: bigint;
    timeBonus?: bigint;
    incorrect: bigint;
    starsEarned?: bigint;
    currentStreak: bigint;
}
export interface GameResult {
    total: bigint;
    timeSpent: bigint;
    difficulty: Difficulty;
    correct: bigint;
    gameType: GameType;
    ageGroup: AgeGroup;
}
export interface ProgressSummary {
    attempts: bigint;
    history: Array<GameResult>;
    score: bigint;
    stars: bigint;
}
export interface UserProfile {
    name: string;
    preferredAgeGroup?: AgeGroup;
}
export enum AgeGroup {
    sevenEight = "sevenEight",
    nineTen = "nineTen",
    fiveSix = "fiveSix"
}
export enum Difficulty {
    easy = "easy",
    hard = "hard",
    medium = "medium"
}
export enum GameType {
    subtraction = "subtraction",
    division = "division",
    addition = "addition",
    multiplication = "multiplication"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addEarnedReward(difficulty: Difficulty, reward: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCompletedLevels(difficulty: Difficulty): Promise<bigint | null>;
    getEarnedRewards(difficulty: Difficulty): Promise<Array<string> | null>;
    getProgressSummary(): Promise<Array<ProgressSummary>>;
    getTimesTableSummary(): Promise<TimesTableSummary | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserStats(userId: Principal): Promise<[bigint, bigint]>;
    isCallerAdmin(): Promise<boolean>;
    recordLevelCompletion(difficulty: Difficulty, levelNumber: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitResult(gameType: GameType, ageGroup: AgeGroup, correct: bigint, total: bigint, stars: bigint, difficulty: Difficulty): Promise<void>;
    updatePracticeStats(table: bigint, correct: bigint, attempts: bigint): Promise<PracticeUpdate>;
}

import type { PillarId } from "./pillars";

// ── Types ──────────────────────────────────────────────────────────

export type EnergyLevel = "high" | "normal" | "low";

export interface DailyTask {
  id: string;
  text: string;
  completed: boolean;
  pillar: PillarId;
  isMIT: boolean;
  goalId?: string; // links to WeekGoal
  // Legacy compat
  category?: "project" | "work" | "personal";
  projectIndex?: number;
}

export interface DailyPlanData {
  dateKey: string; // "dailyPlan-YYYY-MM-DD"
  tasks: DailyTask[];
  energy?: EnergyLevel;
  createdAt: string;
}

export interface WeekGoal {
  id: string;
  text: string;
  pillar: PillarId;
}

export interface WeekPlanData {
  weekKey: string; // "weekPlan-YYYY-Www"
  goals: WeekGoal[] | string[]; // string[] for legacy compat
  updatedAt: string;
}

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  points: number;
  days: number[]; // 0=Sun, 1=Mon, ...6=Sat
}

export interface HabitCompletionData {
  dateKey: string; // "habits-YYYY-MM-DD"
  completed: string[]; // habit ids
}

export interface DailyPointsEntry {
  date: string; // YYYY-MM-DD
  points: number;
  tasksCompleted: number;
  totalTasks: number;
}

export interface ClaimedReward {
  rewardId: string;
  rewardName: string;
  emoji: string;
  pointCost: number;
  claimedAt: string;
}

export interface Reward {
  id: string;
  name: string;
  emoji: string;
  pointCost: number;
  category?: "pieni" | "keskikokoinen" | "suuri";
  isMilestone: boolean;
}

export interface GameState {
  currentPoints: number;
  lifetimePoints: number;
  currentStreak: number;
  lastActiveDate: string;
  claimedRewards: ClaimedReward[];
  dailyPointsLog: DailyPointsEntry[];
  rewards: Reward[];
  habits: Habit[];
}

export interface LevelInfo {
  level: number;
  name: string;
  currentXP: number;
  requiredXP: number;
  nextLevelXP: number;
  progress: number; // 0-1
}

export interface PointsBreakdown {
  taskPoints: number;
  mitBonus: number;
  frogBonus: number;
  habitPoints: number;
  allCompleteBonus: number;
  streakMultiplier: number;
  total: number;
}

// Legacy format for migration
export interface LegacyDailyPlanData {
  dateKey: string;
  projects: { name: string; tasks: string[] }[];
  otherWork: string[];
  otherTasks: string[];
  completedTasks: string[];
  createdAt: string;
}

// ── Types ──────────────────────────────────────────────────────────

export interface DailyTask {
  id: string;
  text: string;
  completed: boolean;
  category: "project" | "work" | "personal";
  projectIndex?: number; // 0-2, links to week goal index
}

export interface DailyPlanData {
  dateKey: string; // "dailyPlan-YYYY-MM-DD"
  tasks: DailyTask[];
  createdAt: string;
}

export interface WeekPlanData {
  weekKey: string; // "weekPlan-YYYY-Www"
  goals: string[]; // always 3
  updatedAt: string;
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
  category: "pieni" | "keskikokoinen" | "suuri";
  isMilestone: boolean; // milestone = lifetime-based, not spent
}

export interface GameState {
  currentPoints: number;
  lifetimePoints: number;
  currentStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  claimedRewards: ClaimedReward[];
  dailyPointsLog: DailyPointsEntry[];
  rewards: Reward[];
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
  topTaskBonus: number;
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

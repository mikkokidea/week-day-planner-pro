import { format, getISOWeek } from "date-fns";
import type {
  DailyPlanData,
  DailyTask,
  GameState,
  Habit,
  HabitCompletionData,
  LegacyDailyPlanData,
  Reward,
  WeekGoal,
  WeekPlanData,
} from "./types";
import type { PillarId } from "./pillars";

// ── Key helpers ────────────────────────────────────────────────────

const WEEK_PREFIX = "weekPlan-";
const DAY_PREFIX = "dailyPlan-";
const HABIT_PREFIX = "habits-";
const GAME_STATE_KEY = "gameState";

export function getWeekKey(date = new Date(), offset = 0): string {
  const d = new Date(date);
  d.setDate(d.getDate() + offset * 7);
  const week = getISOWeek(d);
  const year = d.getFullYear();
  return `${WEEK_PREFIX}${year}-W${String(week).padStart(2, "0")}`;
}

export function getDayKey(date = new Date()): string {
  return `${DAY_PREFIX}${format(date, "yyyy-MM-dd")}`;
}

export function dateFromDayKey(key: string): string {
  return key.replace(DAY_PREFIX, "");
}

export function weekLabelFromKey(key: string): string {
  return key.replace(WEEK_PREFIX, "");
}

// ── Category → Pillar migration ───────────────────────────────────

function migrateCategoryToPillar(category: string): PillarId {
  switch (category) {
    case "project": return "sales";
    case "work": return "automation";
    case "personal": return "life";
    default: return "life";
  }
}

function migrateTask(task: any): DailyTask {
  if (task.pillar) return task as DailyTask;
  return {
    id: task.id || crypto.randomUUID(),
    text: task.text,
    completed: task.completed ?? false,
    pillar: migrateCategoryToPillar(task.category || "personal"),
    isMIT: task.isMIT ?? false,
    goalId: task.goalId,
  };
}

// ── Week plan ──────────────────────────────────────────────────────

export function normalizeWeekGoals(goals: any): WeekGoal[] {
  if (!goals || !Array.isArray(goals)) return [];
  return goals.map((g: any, i: number) => {
    if (typeof g === "string") {
      return { id: `legacy-${i}`, text: g, pillar: "sales" as PillarId };
    }
    return g as WeekGoal;
  });
}

export function loadWeekPlan(key: string): WeekPlanData | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Normalize goals
    parsed.goals = normalizeWeekGoals(parsed.goals);
    return parsed;
  } catch {
    return null;
  }
}

export function saveWeekPlan(data: WeekPlanData): void {
  localStorage.setItem(data.weekKey, JSON.stringify(data));
}

// ── Daily plan ─────────────────────────────────────────────────────

export function loadDailyPlan(key: string): DailyPlanData | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);

    // Migration: legacy format → new format
    if ("projects" in parsed && !("tasks" in parsed)) {
      return migrateLegacyDailyPlan(parsed as LegacyDailyPlanData);
    }

    // Migrate individual tasks category→pillar
    if (parsed.tasks) {
      parsed.tasks = parsed.tasks.map(migrateTask);
    }

    return parsed as DailyPlanData;
  } catch {
    return null;
  }
}

function migrateLegacyDailyPlan(legacy: LegacyDailyPlanData): DailyPlanData {
  const tasks: DailyTask[] = [];

  legacy.projects.forEach((proj) => {
    proj.tasks.forEach((text) => {
      tasks.push({
        id: crypto.randomUUID(),
        text,
        completed: legacy.completedTasks?.includes(text) ?? false,
        pillar: "sales",
        isMIT: false,
      });
    });
  });

  legacy.otherWork?.forEach((text) => {
    tasks.push({
      id: crypto.randomUUID(),
      text,
      completed: legacy.completedTasks?.includes(text) ?? false,
      pillar: "automation",
      isMIT: false,
    });
  });

  legacy.otherTasks?.forEach((text) => {
    tasks.push({
      id: crypto.randomUUID(),
      text,
      completed: legacy.completedTasks?.includes(text) ?? false,
      pillar: "life",
      isMIT: false,
    });
  });

  const migrated: DailyPlanData = {
    dateKey: legacy.dateKey,
    tasks,
    createdAt: legacy.createdAt,
  };

  localStorage.setItem(legacy.dateKey, JSON.stringify(migrated));
  return migrated;
}

export function saveDailyPlan(data: DailyPlanData): void {
  localStorage.setItem(data.dateKey, JSON.stringify(data));
}

// ── Habits ─────────────────────────────────────────────────────────

export const DEFAULT_HABITS: Habit[] = [
  { id: "h1", name: "Liikunta", emoji: "🏃", points: 5, days: [1, 2, 3, 4, 5] },
  { id: "h2", name: "Lukeminen", emoji: "📖", points: 5, days: [1, 2, 3, 4, 5, 6, 0] },
  { id: "h3", name: "Meditaatio", emoji: "🧘", points: 5, days: [1, 2, 3, 4, 5, 6, 0] },
];

export function getHabitKey(date = new Date()): string {
  return `${HABIT_PREFIX}${format(date, "yyyy-MM-dd")}`;
}

export function loadHabitCompletions(key: string): HabitCompletionData | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveHabitCompletions(data: HabitCompletionData): void {
  localStorage.setItem(data.dateKey, JSON.stringify(data));
}

// ── Game state ─────────────────────────────────────────────────────

export const DEFAULT_REWARDS: Reward[] = [
  { id: "r1", name: "Kahvitauko", emoji: "☕", pointCost: 100, isMilestone: false },
  { id: "r2", name: "Someaika", emoji: "📱", pointCost: 100, isMilestone: false },
  { id: "r3", name: "Leffa-ilta", emoji: "🎬", pointCost: 500, isMilestone: false },
  { id: "r4", name: "Tilausruoka", emoji: "🍕", pointCost: 500, isMilestone: false },
  { id: "r5", name: "Kylpyläpäivä", emoji: "🧖", pointCost: 2000, isMilestone: false },
  { id: "r6", name: "Uusi peli", emoji: "🎮", pointCost: 2000, isMilestone: false },
  // Milestones
  { id: "m1", name: "Ensimmäinen viikko", emoji: "🌟", pointCost: 300, isMilestone: true },
  { id: "m2", name: "Kuukauden ahertaja", emoji: "🏅", pointCost: 3000, isMilestone: true },
  { id: "m3", name: "Mestari", emoji: "🏆", pointCost: 8000, isMilestone: true },
  { id: "m4", name: "Legenda", emoji: "👑", pointCost: 12000, isMilestone: true },
];

export function createDefaultGameState(): GameState {
  return {
    currentPoints: 0,
    lifetimePoints: 0,
    currentStreak: 0,
    lastActiveDate: "",
    claimedRewards: [],
    dailyPointsLog: [],
    rewards: DEFAULT_REWARDS,
    habits: DEFAULT_HABITS,
  };
}

export function loadGameState(): GameState {
  try {
    const raw = localStorage.getItem(GAME_STATE_KEY);
    if (!raw) return createDefaultGameState();
    const parsed = JSON.parse(raw) as GameState;
    if (!parsed.rewards) parsed.rewards = DEFAULT_REWARDS;
    if (!parsed.claimedRewards) parsed.claimedRewards = [];
    if (!parsed.dailyPointsLog) parsed.dailyPointsLog = [];
    if (!parsed.habits) parsed.habits = DEFAULT_HABITS;
    return parsed;
  } catch {
    return createDefaultGameState();
  }
}

export function saveGameState(state: GameState): void {
  localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
}

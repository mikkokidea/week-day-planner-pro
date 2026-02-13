import { format, getISOWeek } from "date-fns";
import type {
  DailyPlanData,
  DailyTask,
  GameState,
  LegacyDailyPlanData,
  Reward,
  WeekPlanData,
} from "./types";

// ── Key helpers ────────────────────────────────────────────────────

const WEEK_PREFIX = "weekPlan-";
const DAY_PREFIX = "dailyPlan-";
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

// ── Week plan ──────────────────────────────────────────────────────

export function loadWeekPlan(key: string): WeekPlanData | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
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

    return parsed as DailyPlanData;
  } catch {
    return null;
  }
}

function migrateLegacyDailyPlan(legacy: LegacyDailyPlanData): DailyPlanData {
  const tasks: DailyTask[] = [];

  legacy.projects.forEach((proj, i) => {
    proj.tasks.forEach((text) => {
      tasks.push({
        id: crypto.randomUUID(),
        text,
        completed: legacy.completedTasks?.includes(text) ?? false,
        category: "project",
        projectIndex: i,
      });
    });
  });

  legacy.otherWork?.forEach((text) => {
    tasks.push({
      id: crypto.randomUUID(),
      text,
      completed: legacy.completedTasks?.includes(text) ?? false,
      category: "work",
    });
  });

  legacy.otherTasks?.forEach((text) => {
    tasks.push({
      id: crypto.randomUUID(),
      text,
      completed: legacy.completedTasks?.includes(text) ?? false,
      category: "personal",
    });
  });

  const migrated: DailyPlanData = {
    dateKey: legacy.dateKey,
    tasks,
    createdAt: legacy.createdAt,
  };

  // Save migrated version
  localStorage.setItem(legacy.dateKey, JSON.stringify(migrated));
  return migrated;
}

export function saveDailyPlan(data: DailyPlanData): void {
  localStorage.setItem(data.dateKey, JSON.stringify(data));
}

// ── Game state ─────────────────────────────────────────────────────

export const DEFAULT_REWARDS: Reward[] = [
  { id: "r1", name: "Kahvitauko", emoji: "☕", pointCost: 100, category: "pieni", isMilestone: false },
  { id: "r2", name: "Someaika", emoji: "📱", pointCost: 100, category: "pieni", isMilestone: false },
  { id: "r3", name: "Leffa-ilta", emoji: "🎬", pointCost: 500, category: "keskikokoinen", isMilestone: false },
  { id: "r4", name: "Tilausruoka", emoji: "🍕", pointCost: 500, category: "keskikokoinen", isMilestone: false },
  { id: "r5", name: "Kylpyläpäivä", emoji: "🧖", pointCost: 2000, category: "suuri", isMilestone: false },
  { id: "r6", name: "Uusi peli", emoji: "🎮", pointCost: 2000, category: "suuri", isMilestone: false },
  // Milestones
  { id: "m1", name: "Ensimmäinen viikko", emoji: "🌟", pointCost: 300, category: "pieni", isMilestone: true },
  { id: "m2", name: "Kuukauden ahertaja", emoji: "🏅", pointCost: 3000, category: "keskikokoinen", isMilestone: true },
  { id: "m3", name: "Mestari", emoji: "🏆", pointCost: 8000, category: "suuri", isMilestone: true },
  { id: "m4", name: "Legenda", emoji: "👑", pointCost: 12000, category: "suuri", isMilestone: true },
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
  };
}

export function loadGameState(): GameState {
  try {
    const raw = localStorage.getItem(GAME_STATE_KEY);
    if (!raw) return createDefaultGameState();
    const parsed = JSON.parse(raw) as GameState;
    // Ensure rewards array exists
    if (!parsed.rewards) parsed.rewards = DEFAULT_REWARDS;
    if (!parsed.claimedRewards) parsed.claimedRewards = [];
    if (!parsed.dailyPointsLog) parsed.dailyPointsLog = [];
    return parsed;
  } catch {
    return createDefaultGameState();
  }
}

export function saveGameState(state: GameState): void {
  localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
}

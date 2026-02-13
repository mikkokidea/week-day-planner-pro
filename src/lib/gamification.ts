import { format, differenceInCalendarDays, parseISO } from "date-fns";
import type {
  DailyTask,
  GameState,
  LevelInfo,
  PointsBreakdown,
  Reward,
} from "./types";

// ── Level definitions ──────────────────────────────────────────────

const LEVELS: { name: string; threshold: number }[] = [
  { name: "Aloittelija", threshold: 0 },
  { name: "Oppija", threshold: 100 },
  { name: "Tekijä", threshold: 300 },
  { name: "Ahkera", threshold: 750 },
  { name: "Taitava", threshold: 1500 },
  { name: "Kokenut", threshold: 3000 },
  { name: "Ekspertti", threshold: 5000 },
  { name: "Mestari", threshold: 8000 },
  { name: "Legenda", threshold: 12000 },
  { name: "Eliitti", threshold: 20000 },
];

// ── Level calculation ──────────────────────────────────────────────

export function calculateLevelInfo(lifetimePoints: number): LevelInfo {
  let levelIndex = 0;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (lifetimePoints >= LEVELS[i].threshold) {
      levelIndex = i;
      break;
    }
  }

  const current = LEVELS[levelIndex];
  const next = LEVELS[levelIndex + 1];
  const currentXP = lifetimePoints - current.threshold;
  const requiredXP = next ? next.threshold - current.threshold : 0;
  const progress = requiredXP > 0 ? Math.min(currentXP / requiredXP, 1) : 1;

  return {
    level: levelIndex + 1,
    name: current.name,
    currentXP,
    requiredXP,
    nextLevelXP: next?.threshold ?? current.threshold,
    progress,
  };
}

// ── Points calculation ─────────────────────────────────────────────

export function calculateDailyPoints(
  tasks: DailyTask[],
  streak: number
): PointsBreakdown {
  if (tasks.length === 0) {
    return { taskPoints: 0, topTaskBonus: 0, allCompleteBonus: 0, streakMultiplier: 1, total: 0 };
  }

  const completedTasks = tasks.filter((t) => t.completed);
  const allCompleted = completedTasks.length === tasks.length && tasks.length > 0;

  // Base points: 10 per completed task
  const taskPoints = completedTasks.length * 10;

  // Top 3 bonus: extra 15 per completed top task (total 25)
  const top3 = tasks.slice(0, 3);
  const topTaskBonus = top3.filter((t) => t.completed).length * 15;

  // All complete bonus
  const allCompleteBonus = allCompleted ? 50 : 0;

  // Streak multiplier: +10% per day, max 2x
  const streakMultiplier = Math.min(1 + streak * 0.1, 2);

  const baseTotal = taskPoints + topTaskBonus + allCompleteBonus;
  const total = Math.round(baseTotal * streakMultiplier);

  return { taskPoints, topTaskBonus, allCompleteBonus, streakMultiplier, total };
}

// ── Streak ─────────────────────────────────────────────────────────

export function updateStreak(
  gameState: GameState,
  todayDate: string = format(new Date(), "yyyy-MM-dd")
): { currentStreak: number; lastActiveDate: string } {
  const { lastActiveDate, currentStreak } = gameState;

  if (!lastActiveDate) {
    return { currentStreak: 1, lastActiveDate: todayDate };
  }

  if (lastActiveDate === todayDate) {
    return { currentStreak, lastActiveDate: todayDate };
  }

  const diff = differenceInCalendarDays(
    parseISO(todayDate),
    parseISO(lastActiveDate)
  );

  if (diff === 1) {
    return { currentStreak: currentStreak + 1, lastActiveDate: todayDate };
  }

  // Streak broken
  return { currentStreak: 1, lastActiveDate: todayDate };
}

// ── Rewards ────────────────────────────────────────────────────────

export function claimReward(
  gameState: GameState,
  reward: Reward
): GameState | null {
  if (reward.isMilestone) {
    // Milestones don't cost points, just need lifetime threshold
    if (gameState.lifetimePoints < reward.pointCost) return null;
    // Check if already claimed
    if (gameState.claimedRewards.some((r) => r.rewardId === reward.id)) return null;
  } else {
    if (gameState.currentPoints < reward.pointCost) return null;
  }

  return {
    ...gameState,
    currentPoints: reward.isMilestone
      ? gameState.currentPoints
      : gameState.currentPoints - reward.pointCost,
    claimedRewards: [
      ...gameState.claimedRewards,
      {
        rewardId: reward.id,
        rewardName: reward.name,
        emoji: reward.emoji,
        pointCost: reward.pointCost,
        claimedAt: new Date().toISOString(),
      },
    ],
  };
}

export function getNextReward(
  currentPoints: number,
  rewards: Reward[]
): Reward | null {
  const affordable = rewards
    .filter((r) => !r.isMilestone)
    .sort((a, b) => a.pointCost - b.pointCost);

  // Find the cheapest reward the user can't yet afford, or the cheapest they can
  const nextUp = affordable.find((r) => r.pointCost > currentPoints);
  return nextUp ?? affordable[affordable.length - 1] ?? null;
}

export function getUnlockedMilestones(
  lifetimePoints: number,
  rewards: Reward[],
  claimedIds: string[]
): Reward[] {
  return rewards.filter(
    (r) =>
      r.isMilestone &&
      lifetimePoints >= r.pointCost &&
      !claimedIds.includes(r.id)
  );
}

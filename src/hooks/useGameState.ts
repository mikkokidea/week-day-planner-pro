import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { loadGameState, saveGameState } from "@/lib/storage";
import {
  calculateDailyPoints,
  calculateLevelInfo,
  claimReward as claimRewardFn,
  getNextReward,
  getUnlockedMilestones,
  updateStreak,
} from "@/lib/gamification";
import type {
  DailyTask,
  GameState,
  Habit,
  LevelInfo,
  PointsBreakdown,
  Reward,
} from "@/lib/types";

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(loadGameState);

  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  const levelInfo: LevelInfo = useMemo(
    () => calculateLevelInfo(gameState.lifetimePoints),
    [gameState.lifetimePoints]
  );

  const nextReward = useMemo(
    () => getNextReward(gameState.currentPoints, gameState.rewards),
    [gameState.currentPoints, gameState.rewards]
  );

  const unlockedMilestones = useMemo(
    () =>
      getUnlockedMilestones(
        gameState.lifetimePoints,
        gameState.rewards,
        gameState.claimedRewards.map((r) => r.rewardId)
      ),
    [gameState.lifetimePoints, gameState.rewards, gameState.claimedRewards]
  );

  const awardDailyPoints = useCallback(
    (tasks: DailyTask[], completedHabits = 0, totalHabits = 0, dateStr?: string): PointsBreakdown => {
      const today = dateStr ?? format(new Date(), "yyyy-MM-dd");

      setGameState((prev) => {
        const existing = prev.dailyPointsLog.find((e) => e.date === today);
        const streakUpdate = updateStreak(prev, today);
        const breakdown = calculateDailyPoints(tasks, streakUpdate.currentStreak, completedHabits, totalHabits);

        if (existing) {
          const pointDiff = breakdown.total - existing.points;
          return {
            ...prev,
            currentPoints: prev.currentPoints + pointDiff,
            lifetimePoints: prev.lifetimePoints + Math.max(0, pointDiff),
            currentStreak: streakUpdate.currentStreak,
            lastActiveDate: streakUpdate.lastActiveDate,
            dailyPointsLog: prev.dailyPointsLog.map((e) =>
              e.date === today
                ? {
                    ...e,
                    points: breakdown.total,
                    tasksCompleted: tasks.filter((t) => t.completed).length,
                    totalTasks: tasks.length,
                  }
                : e
            ),
          };
        }

        return {
          ...prev,
          currentPoints: prev.currentPoints + breakdown.total,
          lifetimePoints: prev.lifetimePoints + breakdown.total,
          currentStreak: streakUpdate.currentStreak,
          lastActiveDate: streakUpdate.lastActiveDate,
          dailyPointsLog: [
            ...prev.dailyPointsLog,
            {
              date: today,
              points: breakdown.total,
              tasksCompleted: tasks.filter((t) => t.completed).length,
              totalTasks: tasks.length,
            },
          ],
        };
      });

      const streakUpdate = updateStreak(gameState, today);
      return calculateDailyPoints(tasks, streakUpdate.currentStreak, completedHabits, totalHabits);
    },
    [gameState]
  );

  const claimReward = useCallback(
    (reward: Reward): boolean => {
      const result = claimRewardFn(gameState, reward);
      if (!result) return false;
      setGameState(result);
      return true;
    },
    [gameState]
  );

  const addReward = useCallback((reward: Reward) => {
    setGameState((prev) => ({
      ...prev,
      rewards: [...prev.rewards, reward],
    }));
  }, []);

  const removeReward = useCallback((rewardId: string) => {
    setGameState((prev) => ({
      ...prev,
      rewards: prev.rewards.filter((r) => r.id !== rewardId),
    }));
  }, []);

  const addHabit = useCallback((habit: Habit) => {
    setGameState((prev) => ({
      ...prev,
      habits: [...prev.habits, habit],
    }));
  }, []);

  const removeHabit = useCallback((habitId: string) => {
    setGameState((prev) => ({
      ...prev,
      habits: prev.habits.filter((h) => h.id !== habitId),
    }));
  }, []);

  return {
    gameState,
    levelInfo,
    nextReward,
    unlockedMilestones,
    awardDailyPoints,
    claimReward,
    addReward,
    removeReward,
    addHabit,
    removeHabit,
  };
}

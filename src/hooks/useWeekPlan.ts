import { useCallback, useEffect, useMemo, useState } from "react";
import { getWeekKey, loadWeekPlan, saveWeekPlan, weekLabelFromKey } from "@/lib/storage";
import type { WeekGoal, WeekPlanData } from "@/lib/types";
import type { PillarId } from "@/lib/pillars";

export function useWeekPlan() {
  const [weekOffset, setWeekOffset] = useState(0);
  const weekKey = useMemo(() => getWeekKey(new Date(), weekOffset), [weekOffset]);
  const weekLabel = useMemo(() => weekLabelFromKey(weekKey), [weekKey]);
  const isCurrentWeek = weekOffset === 0;

  const [goals, setGoals] = useState<WeekGoal[]>([]);

  useEffect(() => {
    const existing = loadWeekPlan(weekKey);
    if (existing?.goals) {
      // loadWeekPlan already normalizes to WeekGoal[]
      setGoals(existing.goals as WeekGoal[]);
    } else {
      setGoals([]);
    }
  }, [weekKey]);

  // Auto-save on goals change
  useEffect(() => {
    if (goals.length === 0 && !loadWeekPlan(weekKey)) return;
    const data: WeekPlanData = {
      weekKey,
      goals,
      updatedAt: new Date().toISOString(),
    };
    saveWeekPlan(data);
  }, [goals, weekKey]);

  const addGoal = useCallback((text: string, pillar: PillarId) => {
    if (!text.trim()) return;
    setGoals((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: text.trim(), pillar },
    ]);
  }, []);

  const removeGoal = useCallback((goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  }, []);

  const updateGoalText = useCallback((goalId: string, text: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, text } : g))
    );
  }, []);

  const goToPreviousWeek = useCallback(() => setWeekOffset((o) => o - 1), []);
  const goToNextWeek = useCallback(() => setWeekOffset((o) => o + 1), []);
  const goToCurrentWeek = useCallback(() => setWeekOffset(0), []);

  return {
    weekKey,
    weekLabel,
    weekOffset,
    isCurrentWeek,
    goals,
    addGoal,
    removeGoal,
    updateGoalText,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
  };
}

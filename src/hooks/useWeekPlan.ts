import { useCallback, useEffect, useMemo, useState } from "react";
import { getWeekKey, loadWeekPlan, saveWeekPlan, weekLabelFromKey } from "@/lib/storage";
import type { WeekPlanData } from "@/lib/types";

export function useWeekPlan() {
  const [weekOffset, setWeekOffset] = useState(0);
  const weekKey = useMemo(() => getWeekKey(new Date(), weekOffset), [weekOffset]);
  const weekLabel = useMemo(() => weekLabelFromKey(weekKey), [weekKey]);
  const isCurrentWeek = weekOffset === 0;

  const [goals, setGoals] = useState<string[]>(["", "", ""]);

  useEffect(() => {
    const existing = loadWeekPlan(weekKey);
    if (existing?.goals?.length === 3) {
      setGoals(existing.goals);
    } else {
      setGoals(["", "", ""]);
    }
  }, [weekKey]);

  const handleChange = useCallback((index: number, value: string) => {
    setGoals((g) => g.map((x, i) => (i === index ? value : x)));
  }, []);

  const save = useCallback(() => {
    const cleaned = goals.map((g) => g.trim());
    const data: WeekPlanData = {
      weekKey,
      goals: cleaned,
      updatedAt: new Date().toISOString(),
    };
    saveWeekPlan(data);
    return data;
  }, [goals, weekKey]);

  const goToPreviousWeek = useCallback(() => setWeekOffset((o) => o - 1), []);
  const goToNextWeek = useCallback(() => setWeekOffset((o) => o + 1), []);
  const goToCurrentWeek = useCallback(() => setWeekOffset(0), []);

  return {
    weekKey,
    weekLabel,
    weekOffset,
    isCurrentWeek,
    goals,
    handleChange,
    save,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
  };
}

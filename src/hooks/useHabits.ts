import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { getHabitKey, loadHabitCompletions, saveHabitCompletions } from "@/lib/storage";
import { useGame } from "@/contexts/GameContext";
import type { Habit, HabitCompletionData } from "@/lib/types";

export function useHabits(date: Date = new Date()) {
  const habitKey = useMemo(() => getHabitKey(date), [date]);
  const dayOfWeek = date.getDay(); // 0=Sun...6=Sat
  const { gameState } = useGame();

  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    const existing = loadHabitCompletions(habitKey);
    setCompletedIds(existing?.completed ?? []);
  }, [habitKey]);

  // Auto-save
  useEffect(() => {
    const data: HabitCompletionData = {
      dateKey: habitKey,
      completed: completedIds,
    };
    saveHabitCompletions(data);
  }, [completedIds, habitKey]);

  const todayHabits = useMemo(
    () => gameState.habits.filter((h) => h.days.includes(dayOfWeek)),
    [gameState.habits, dayOfWeek]
  );

  const toggleHabit = useCallback((habitId: string) => {
    setCompletedIds((prev) =>
      prev.includes(habitId)
        ? prev.filter((id) => id !== habitId)
        : [...prev, habitId]
    );
  }, []);

  const completedCount = useMemo(
    () => todayHabits.filter((h) => completedIds.includes(h.id)).length,
    [todayHabits, completedIds]
  );

  return {
    todayHabits,
    completedIds,
    toggleHabit,
    completedCount,
    totalCount: todayHabits.length,
  };
}

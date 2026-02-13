import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { getDayKey, loadDailyPlan, saveDailyPlan } from "@/lib/storage";
import type { DailyPlanData, DailyTask, EnergyLevel } from "@/lib/types";
import type { PillarId } from "@/lib/pillars";

export function useDailyPlan(date: Date = new Date()) {
  const dayKey = useMemo(() => getDayKey(date), [date]);
  const isToday = useMemo(
    () => format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"),
    [date]
  );

  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [energy, setEnergy] = useState<EnergyLevel>("normal");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Load on key change
  useEffect(() => {
    const existing = loadDailyPlan(dayKey);
    setTasks(existing?.tasks ?? []);
    setEnergy(existing?.energy ?? "normal");
  }, [dayKey]);

  // Debounced auto-save
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      const data: DailyPlanData = {
        dateKey: dayKey,
        tasks,
        energy,
        createdAt: new Date().toISOString(),
      };
      saveDailyPlan(data);
    }, 300);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [tasks, dayKey, energy]);

  const addTask = useCallback(
    (text: string, pillar: PillarId, isMIT = false, goalId?: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setTasks((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: trimmed,
          completed: false,
          pillar,
          isMIT,
          goalId,
        },
      ]);
    },
    []
  );

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const mitTasks = useMemo(
    () => tasks.filter((t) => t.isMIT),
    [tasks]
  );

  const tasksByPillar = useCallback(
    (pillar: PillarId) => tasks.filter((t) => t.pillar === pillar),
    [tasks]
  );

  const completedCount = useMemo(
    () => tasks.filter((t) => t.completed).length,
    [tasks]
  );

  return {
    tasks,
    dayKey,
    isToday,
    energy,
    setEnergy,
    addTask,
    removeTask,
    toggleTask,
    mitTasks,
    tasksByPillar,
    completedCount,
  };
}

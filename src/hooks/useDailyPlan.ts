import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { getDayKey, loadDailyPlan, saveDailyPlan } from "@/lib/storage";
import type { DailyPlanData, DailyTask } from "@/lib/types";

export function useDailyPlan(date: Date = new Date()) {
  const dayKey = useMemo(() => getDayKey(date), [date]);
  const isToday = useMemo(
    () => format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"),
    [date]
  );

  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Load on key change
  useEffect(() => {
    const existing = loadDailyPlan(dayKey);
    setTasks(existing?.tasks ?? []);
  }, [dayKey]);

  // Debounced auto-save
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      const data: DailyPlanData = {
        dateKey: dayKey,
        tasks,
        createdAt: new Date().toISOString(),
      };
      saveDailyPlan(data);
    }, 300);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [tasks, dayKey]);

  const addTask = useCallback(
    (text: string, category: DailyTask["category"], projectIndex?: number) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setTasks((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: trimmed,
          completed: false,
          category,
          projectIndex,
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

  const projectTasks = useMemo(
    () => tasks.filter((t) => t.category === "project"),
    [tasks]
  );
  const workTasks = useMemo(
    () => tasks.filter((t) => t.category === "work"),
    [tasks]
  );
  const personalTasks = useMemo(
    () => tasks.filter((t) => t.category === "personal"),
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
    addTask,
    removeTask,
    toggleTask,
    projectTasks,
    workTasks,
    personalTasks,
    completedCount,
  };
}

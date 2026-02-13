import { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { fi } from "date-fns/locale";
import { Plus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageContainer from "@/components/PageContainer";
import LevelBadge from "@/components/LevelBadge";
import StreakFlame from "@/components/StreakFlame";
import PointsBadge from "@/components/PointsBadge";
import EnergySelector from "@/components/EnergySelector";
import HabitStrip from "@/components/HabitStrip";
import MITCard from "@/components/MITCard";
import TabbedTaskList from "@/components/TabbedTaskList";
import AddTaskSheet from "@/components/AddTaskSheet";
import AddHabitSheet from "@/components/AddHabitSheet";
import WeekIntention from "@/components/WeekIntention";
import CelebrationOverlay from "@/components/CelebrationOverlay";
import { useGame } from "@/contexts/GameContext";
import { useDailyPlan } from "@/hooks/useDailyPlan";
import { useHabits } from "@/hooks/useHabits";
import { useWeekPlan } from "@/hooks/useWeekPlan";
import { calculateDailyPoints } from "@/lib/gamification";
import type { WeekGoal } from "@/lib/types";

export default function DashboardPage() {
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [addHabitOpen, setAddHabitOpen] = useState(false);
  const [showWeekIntention, setShowWeekIntention] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastCelebratedCount, setLastCelebratedCount] = useState(-1);

  const { gameState, levelInfo, awardDailyPoints, addHabit } = useGame();
  const { tasks, energy, setEnergy, addTask, removeTask, toggleTask, mitTasks, completedCount } = useDailyPlan();
  const { todayHabits, completedIds, toggleHabit, completedCount: habitCompleted, totalCount: habitTotal } = useHabits();
  const { goals } = useWeekPlan();

  const todayPoints = useMemo(
    () => calculateDailyPoints(tasks, gameState.currentStreak, habitCompleted, habitTotal),
    [tasks, gameState.currentStreak, habitCompleted, habitTotal]
  );

  // Award points
  useEffect(() => {
    if (tasks.length > 0 && tasks.some((t) => t.completed)) {
      awardDailyPoints(tasks, habitCompleted, habitTotal);
    }
  }, [tasks, habitCompleted, habitTotal, awardDailyPoints]);

  // Celebration
  useEffect(() => {
    if (tasks.length > 0 && completedCount === tasks.length && lastCelebratedCount !== tasks.length) {
      setShowCelebration(true);
      setLastCelebratedCount(tasks.length);
    }
  }, [completedCount, tasks.length, lastCelebratedCount]);

  const handleToggle = useCallback((id: string) => toggleTask(id), [toggleTask]);

  return (
    <PageContainer>
      <Helmet>
        <title>Dashboard – CEO Planner Pro</title>
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold">
            {format(new Date(), "EEEE d.M.", { locale: fi })}
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <LevelBadge levelInfo={levelInfo} showProgress={false} size="sm" />
            <StreakFlame streak={gameState.currentStreak} />
          </div>
        </div>
        <PointsBadge points={todayPoints.total} size="sm" />
      </div>

      {/* Energy selector */}
      <div className="mb-4">
        <EnergySelector value={energy} onChange={setEnergy} />
      </div>

      {/* Habits */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tavat</h2>
          <button onClick={() => setAddHabitOpen(true)} className="text-xs text-[hsl(var(--brand))]">+ Lisää</button>
        </div>
        <HabitStrip habits={todayHabits} completedIds={completedIds} onToggle={toggleHabit} />
      </div>

      {/* MIT Card */}
      {mitTasks.length > 0 && (
        <div className="mb-4">
          <MITCard mitTasks={mitTasks} onToggle={handleToggle} />
        </div>
      )}

      {/* Week intention button */}
      {goals.length > 0 && (
        <button
          onClick={() => setShowWeekIntention(true)}
          className="w-full flex items-center gap-2 px-3 py-2 mb-4 rounded-lg bg-muted/50 text-xs text-muted-foreground hover:bg-muted transition-colors"
        >
          <Target className="w-3.5 h-3.5" />
          <span>{goals.length} viikkotavoitetta</span>
        </button>
      )}

      {/* Task summary */}
      {tasks.length > 0 && (
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs text-muted-foreground">
            {completedCount}/{tasks.length} tehtävää valmis
          </span>
        </div>
      )}

      {/* Tabbed task list */}
      <TabbedTaskList tasks={tasks} onToggle={handleToggle} onRemove={removeTask} />

      {/* FAB */}
      <button
        onClick={() => setAddTaskOpen(true)}
        className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-2))] text-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Sheets */}
      <AddTaskSheet
        open={addTaskOpen}
        onOpenChange={setAddTaskOpen}
        onAdd={addTask}
        weekGoals={goals as WeekGoal[]}
      />
      <AddHabitSheet
        open={addHabitOpen}
        onOpenChange={setAddHabitOpen}
        onAdd={addHabit}
      />
      <WeekIntention show={showWeekIntention} onClose={() => setShowWeekIntention(false)} />

      <CelebrationOverlay
        show={showCelebration}
        message="Kaikki tehtävät valmiit!"
        emoji="🎉"
        points={todayPoints.allCompleteBonus}
        onDone={() => setShowCelebration(false)}
      />
    </PageContainer>
  );
}

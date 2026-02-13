import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import PageContainer from "@/components/PageContainer";
import PillarBadge from "@/components/PillarBadge";
import AddGoalSheet from "@/components/AddGoalSheet";
import { useWeekPlan } from "@/hooks/useWeekPlan";
import { useDailyPlan } from "@/hooks/useDailyPlan";
import type { WeekGoal } from "@/lib/types";
import { PILLARS } from "@/lib/pillars";

export default function WeekPlan() {
  const {
    weekLabel,
    isCurrentWeek,
    goals,
    addGoal,
    removeGoal,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
  } = useWeekPlan();

  const [goalSheetOpen, setGoalSheetOpen] = useState(false);
  const { tasks } = useDailyPlan();

  const pillarCounts = PILLARS.map((p) => ({
    ...p,
    total: tasks.filter((t) => t.pillar === p.id).length,
    done: tasks.filter((t) => t.pillar === p.id && t.completed).length,
  }));

  return (
    <PageContainer>
      <Helmet>
        <title>Viikko – CEO Planner Pro</title>
      </Helmet>

      {/* Week navigation */}
      <div className="flex items-center justify-between mb-5">
        <Button variant="ghost" size="icon" onClick={goToPreviousWeek} className="rounded-xl">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="text-center">
          <button
            onClick={goToCurrentWeek}
            className="font-display text-xl font-extrabold hover:text-gold transition-colors"
          >
            {weekLabel}
          </button>
          {!isCurrentWeek && (
            <p className="text-[10px] text-muted-foreground">Paina palataksesi nykyiseen</p>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={goToNextWeek} className="rounded-xl">
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Pillar overview */}
      <div className="grid grid-cols-5 gap-2 mb-5">
        {pillarCounts.map((p) => (
          <div key={p.id} className="flex flex-col items-center gap-1 text-center">
            <span className="text-lg">{p.emoji}</span>
            <span className="text-[8px] text-muted-foreground font-medium">{p.name}</span>
            {p.total > 0 && (
              <span className="text-[10px] font-medium">{p.done}/{p.total}</span>
            )}
          </div>
        ))}
      </div>

      {/* Goals */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Viikkotavoitteet</h2>
        {isCurrentWeek && (
          <Button variant="ghost" size="sm" onClick={() => setGoalSheetOpen(true)} className="text-xs h-7 text-gold">
            <Plus className="w-3.5 h-3.5 mr-1" /> Lisää
          </Button>
        )}
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-[13px]">Ei viikkotavoitteita.</p>
          {isCurrentWeek && (
            <Button
              variant="outline"
              size="sm"
              className="mt-3 rounded-xl"
              onClick={() => setGoalSheetOpen(true)}
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Lisää tavoite
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3.5">
          {goals.map((goal: WeekGoal, index: number) => {
            const linkedTasks = tasks.filter((t) => t.goalId === goal.id);
            const done = linkedTasks.filter((t) => t.completed).length;
            const progress = linkedTasks.length > 0 ? (done / linkedTasks.length) * 100 : 0;

            return (
              <Card key={goal.id} className="animate-slide-up rounded-2xl" style={{ animationDelay: `${index * 0.05}s` }}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <PillarBadge pillar={goal.pillar} size="sm" />
                      </div>
                      <p className="text-[13px] font-medium">{goal.text}</p>
                      {linkedTasks.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-[600ms]"
                              style={{
                                width: `${progress}%`,
                                backgroundColor: `hsl(var(--pillar-${goal.pillar}))`,
                              }}
                            />
                          </div>
                          <p className="text-[10px] text-muted-foreground">
                            {done}/{linkedTasks.length} tehtävää
                          </p>
                        </div>
                      )}
                    </div>
                    {isCurrentWeek && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive rounded-lg"
                        onClick={() => removeGoal(goal.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <AddGoalSheet open={goalSheetOpen} onOpenChange={setGoalSheetOpen} onAdd={addGoal} />
    </PageContainer>
  );
}

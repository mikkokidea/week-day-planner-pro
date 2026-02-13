import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import PageContainer from "@/components/PageContainer";
import { useWeekPlan } from "@/hooks/useWeekPlan";
import { useDailyPlan } from "@/hooks/useDailyPlan";

const WeekPlan = () => {
  const {
    weekLabel,
    isCurrentWeek,
    goals,
    handleChange,
    save,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
  } = useWeekPlan();

  const { tasks } = useDailyPlan();

  const goalProgress = useMemo(() => {
    return goals.map((_, i) => {
      const projectTasks = tasks.filter(
        (t) => t.category === "project" && t.projectIndex === i
      );
      const done = projectTasks.filter((t) => t.completed).length;
      return { done, total: projectTasks.length };
    });
  }, [goals, tasks]);

  const handleSave = () => {
    save();
    toast({
      title: "Viikkosuunnitelma tallennettu",
      description: weekLabel,
    });
  };

  return (
    <PageContainer>
      <Helmet>
        <title>Viikkosuunnittelu – Pelillistetty Suunnittelija</title>
      </Helmet>

      {/* Week navigation */}
      <div className="flex items-center justify-between mb-5">
        <Button variant="ghost" size="icon" onClick={goToPreviousWeek}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="text-center">
          <button
            onClick={goToCurrentWeek}
            className="text-lg font-bold hover:text-[hsl(var(--brand))] transition-colors"
          >
            {weekLabel}
          </button>
          {!isCurrentWeek && (
            <p className="text-xs text-muted-foreground">
              Paina viikkoa palataksesi nykyiseen
            </p>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={goToNextWeek}>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Goals */}
      <div className="space-y-4">
        {goals.map((goal, i) => (
          <Card key={i} className="animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-2))] text-white font-bold flex items-center justify-center text-sm flex-shrink-0">
                  {i + 1}
                </span>
                <Input
                  value={goal}
                  onChange={(e) => handleChange(i, e.target.value)}
                  placeholder={`Viikon tavoite ${i + 1}`}
                  className="text-base font-medium"
                  readOnly={!isCurrentWeek}
                />
              </div>

              {/* Progress for this goal */}
              {isCurrentWeek && goalProgress[i] && goalProgress[i].total > 0 && (
                <div className="ml-11 space-y-1">
                  <Progress
                    value={
                      (goalProgress[i].done / goalProgress[i].total) * 100
                    }
                    className="h-1.5"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    {goalProgress[i].done}/{goalProgress[i].total} tehtävää
                    valmiina
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Save button */}
      {isCurrentWeek && (
        <Button
          onClick={handleSave}
          className="w-full mt-5 bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-2))] text-white hover:opacity-90"
        >
          <Save className="w-4 h-4 mr-2" />
          Tallenna viikko
        </Button>
      )}
    </PageContainer>
  );
};

export default WeekPlan;

import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { NavLink } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, CheckSquare, Calendar, Trophy } from "lucide-react";
import { format } from "date-fns";
import { fi } from "date-fns/locale";
import PageContainer from "@/components/PageContainer";
import ThemeToggle from "@/components/ThemeToggle";
import StreakFlame from "@/components/StreakFlame";
import LevelBadge from "@/components/LevelBadge";
import PointsBadge from "@/components/PointsBadge";
import { useGame } from "@/contexts/GameContext";
import { useDailyPlan } from "@/hooks/useDailyPlan";
import { loadWeekPlan, getWeekKey } from "@/lib/storage";
import { calculateDailyPoints } from "@/lib/gamification";

const Index = () => {
  const { gameState, levelInfo, nextReward } = useGame();
  const { tasks, completedCount } = useDailyPlan();
  const today = new Date();

  const weekPlan = useMemo(() => loadWeekPlan(getWeekKey()), []);
  const todayPoints = useMemo(
    () => calculateDailyPoints(tasks, gameState.currentStreak),
    [tasks, gameState.currentStreak]
  );

  const goalsWithProgress = useMemo(() => {
    if (!weekPlan?.goals) return [];
    return weekPlan.goals.map((goal, i) => {
      const projectTasks = tasks.filter(
        (t) => t.category === "project" && t.projectIndex === i
      );
      const done = projectTasks.filter((t) => t.completed).length;
      return { goal, done, total: projectTasks.length };
    });
  }, [weekPlan, tasks]);

  return (
    <PageContainer>
      <Helmet>
        <title>Dashboard – Pelillistetty Suunnittelija</title>
      </Helmet>

      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-bold">
            {format(today, "EEEE d.M.", { locale: fi })}
          </h1>
          <p className="text-xs text-muted-foreground">Tervetuloa takaisin!</p>
        </div>
        <ThemeToggle />
      </div>

      {/* Hero card: Streak + Level */}
      <Card className="overflow-hidden mb-4 bg-gradient-to-br from-[hsl(var(--brand)/0.1)] to-[hsl(var(--brand-2)/0.1)] border-[hsl(var(--brand)/0.2)]">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <LevelBadge levelInfo={levelInfo} size="lg" />
              <StreakFlame streak={gameState.currentStreak} size="md" />
            </div>
            <div className="text-right space-y-1">
              <PointsBadge points={gameState.currentPoints} size="lg" />
              <p className="text-[10px] text-muted-foreground">
                Yhteensä: {gameState.lifetimePoints}p
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today summary */}
      <Card className="mb-4 animate-slide-up">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-sm">Päivän tilanne</h2>
            <span className="text-xs text-muted-foreground">
              {completedCount}/{tasks.length} tehtävää
            </span>
          </div>
          {tasks.length > 0 ? (
            <>
              <Progress
                value={tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0}
                className="h-2.5 mb-2"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Tänään: +{todayPoints.total}p</span>
                {todayPoints.streakMultiplier > 1 && (
                  <span className="text-streak">
                    Streak-kerroin: {todayPoints.streakMultiplier.toFixed(1)}x
                  </span>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Et ole vielä lisännyt tehtäviä tänään.
            </p>
          )}
          <Button asChild variant="ghost" size="sm" className="mt-2 w-full">
            <NavLink to="/paiva" className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              Avaa päiväsuunnitelma
              <ChevronRight className="w-4 h-4 ml-auto" />
            </NavLink>
          </Button>
        </CardContent>
      </Card>

      {/* Next reward */}
      {nextReward && (
        <Card className="mb-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{nextReward.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Seuraava palkinto</p>
                <p className="text-xs text-muted-foreground">{nextReward.name}</p>
                <Progress
                  value={Math.min(
                    (gameState.currentPoints / nextReward.pointCost) * 100,
                    100
                  )}
                  className="h-1.5 mt-1.5"
                />
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {gameState.currentPoints} / {nextReward.pointCost}p
                </p>
              </div>
              <Button asChild variant="ghost" size="icon">
                <NavLink to="/palkinnot">
                  <Trophy className="w-4 h-4" />
                </NavLink>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Week goals progress */}
      {goalsWithProgress.some((g) => g.goal) && (
        <Card className="mb-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-sm">Viikon tavoitteet</h2>
              <Button asChild variant="ghost" size="icon">
                <NavLink to="/viikko">
                  <Calendar className="w-4 h-4" />
                </NavLink>
              </Button>
            </div>
            <div className="space-y-3">
              {goalsWithProgress.map(
                (g, i) =>
                  g.goal && (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold bg-muted rounded-full w-5 h-5 flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-sm truncate flex-1">{g.goal}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {g.done}/{g.total}
                        </span>
                      </div>
                      {g.total > 0 && (
                        <Progress
                          value={(g.done / g.total) * 100}
                          className="h-1.5 ml-7"
                        />
                      )}
                    </div>
                  )
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button asChild variant="outline" className="h-auto py-3 flex-col gap-1">
          <NavLink to="/viikko">
            <Calendar className="w-5 h-5" />
            <span className="text-xs">Viikkosuunnitelma</span>
          </NavLink>
        </Button>
        <Button asChild variant="outline" className="h-auto py-3 flex-col gap-1">
          <NavLink to="/paiva">
            <CheckSquare className="w-5 h-5" />
            <span className="text-xs">Päiväsuunnitelma</span>
          </NavLink>
        </Button>
      </div>
    </PageContainer>
  );
};

export default Index;

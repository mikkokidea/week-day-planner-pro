import { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Briefcase, User, FolderOpen } from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { fi } from "date-fns/locale";
import PageContainer from "@/components/PageContainer";
import TaskInput from "@/components/TaskInput";
import TaskItem from "@/components/TaskItem";
import PointsBadge from "@/components/PointsBadge";
import CelebrationOverlay from "@/components/CelebrationOverlay";
import { useGame } from "@/contexts/GameContext";
import { useDailyPlan } from "@/hooks/useDailyPlan";
import { loadWeekPlan, getWeekKey } from "@/lib/storage";
import { calculateDailyPoints } from "@/lib/gamification";

const DailyPlan = () => {
  const [viewDate, setViewDate] = useState(new Date());
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastCelebratedCount, setLastCelebratedCount] = useState(-1);
  const [addTab, setAddTab] = useState<string>("project");

  const isToday = useMemo(
    () => format(viewDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"),
    [viewDate]
  );

  const {
    tasks,
    completedCount,
    projectTasks,
    workTasks,
    personalTasks,
    addTask,
    removeTask,
    toggleTask,
  } = useDailyPlan(viewDate);

  const { gameState, awardDailyPoints } = useGame();
  const weekPlan = useMemo(() => loadWeekPlan(getWeekKey(viewDate)), [viewDate]);
  const goals = weekPlan?.goals ?? ["", "", ""];

  const todayPoints = useMemo(
    () => calculateDailyPoints(tasks, gameState.currentStreak),
    [tasks, gameState.currentStreak]
  );

  // Award points when tasks change (only for today)
  useEffect(() => {
    if (isToday && tasks.length > 0 && tasks.some((t) => t.completed)) {
      awardDailyPoints(tasks);
    }
  }, [tasks, isToday, awardDailyPoints]);

  // Celebration when all tasks completed
  useEffect(() => {
    if (
      tasks.length > 0 &&
      completedCount === tasks.length &&
      lastCelebratedCount !== tasks.length &&
      isToday
    ) {
      setShowCelebration(true);
      setLastCelebratedCount(tasks.length);
    }
  }, [completedCount, tasks.length, lastCelebratedCount, isToday]);

  const handleToggle = useCallback(
    (id: string) => {
      if (!isToday) return;
      toggleTask(id);
    },
    [isToday, toggleTask]
  );

  // Find task's global index for top-3 detection
  const getGlobalIndex = (taskId: string) => tasks.findIndex((t) => t.id === taskId);

  const projectTasksByGoal = useMemo(() => {
    return [0, 1, 2].map((i) =>
      projectTasks.filter((t) => t.projectIndex === i)
    );
  }, [projectTasks]);

  return (
    <PageContainer>
      <Helmet>
        <title>Päiväsuunnittelu – Pelillistetty Suunnittelija</title>
      </Helmet>

      {/* Date navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setViewDate((d) => subDays(d, 1))}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="text-center">
          <h1 className="text-lg font-bold">
            {format(viewDate, "EEEE d.M.", { locale: fi })}
          </h1>
          {!isToday && (
            <button
              onClick={() => setViewDate(new Date())}
              className="text-xs text-[hsl(var(--brand))] hover:underline"
            >
              Palaa tähän päivään
            </button>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setViewDate((d) => addDays(d, 1))}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Points summary */}
      {tasks.length > 0 && (
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-sm text-muted-foreground">
            {completedCount}/{tasks.length} valmis
          </span>
          <PointsBadge points={todayPoints.total} size="sm" />
        </div>
      )}

      {/* Task sections per project goal */}
      {goals.map(
        (goal, i) =>
          (goal || projectTasksByGoal[i].length > 0) && (
            <Card key={i} className="mb-3 animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <CardHeader className="pb-2 pt-3 px-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-2))] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  {goal || `Projekti ${i + 1}`}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3 space-y-1">
                {projectTasksByGoal[i].map((task) => (
                  <TaskItem
                    key={task.id}
                    text={task.text}
                    completed={task.completed}
                    isTop3={getGlobalIndex(task.id) < 3}
                    onToggle={() => handleToggle(task.id)}
                    onRemove={() => removeTask(task.id)}
                    editable={isToday}
                  />
                ))}
                {projectTasksByGoal[i].length === 0 && (
                  <p className="text-xs text-muted-foreground py-1">
                    Ei tehtäviä
                  </p>
                )}
              </CardContent>
            </Card>
          )
      )}

      {/* Work tasks */}
      {workTasks.length > 0 && (
        <Card className="mb-3 animate-slide-up">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              Muut työtehtävät
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3 space-y-1">
            {workTasks.map((task) => (
              <TaskItem
                key={task.id}
                text={task.text}
                completed={task.completed}
                isTop3={getGlobalIndex(task.id) < 3}
                onToggle={() => handleToggle(task.id)}
                onRemove={() => removeTask(task.id)}
                editable={isToday}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Personal tasks */}
      {personalTasks.length > 0 && (
        <Card className="mb-3 animate-slide-up">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              Henkilökohtaiset
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3 space-y-1">
            {personalTasks.map((task) => (
              <TaskItem
                key={task.id}
                text={task.text}
                completed={task.completed}
                isTop3={getGlobalIndex(task.id) < 3}
                onToggle={() => handleToggle(task.id)}
                onRemove={() => removeTask(task.id)}
                editable={isToday}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Add task section */}
      {isToday && (
        <Card className="mb-3">
          <CardContent className="p-4">
            <Tabs value={addTab} onValueChange={setAddTab}>
              <TabsList className="w-full mb-3">
                <TabsTrigger value="project" className="flex-1 text-xs">
                  <FolderOpen className="w-3.5 h-3.5 mr-1" />
                  Projekti
                </TabsTrigger>
                <TabsTrigger value="work" className="flex-1 text-xs">
                  <Briefcase className="w-3.5 h-3.5 mr-1" />
                  Työ
                </TabsTrigger>
                <TabsTrigger value="personal" className="flex-1 text-xs">
                  <User className="w-3.5 h-3.5 mr-1" />
                  Henk.
                </TabsTrigger>
              </TabsList>

              <TabsContent value="project" className="space-y-2">
                {goals.map((goal, i) => (
                  <div key={i}>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      {goal || `Projekti ${i + 1}`}
                    </label>
                    <TaskInput
                      onAdd={(text) => addTask(text, "project", i)}
                      placeholder="Lisää tehtävä + Enter"
                    />
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="work">
                <TaskInput
                  onAdd={(text) => addTask(text, "work")}
                  placeholder="Lisää työtehtävä + Enter"
                />
              </TabsContent>

              <TabsContent value="personal">
                <TaskInput
                  onAdd={(text) => addTask(text, "personal")}
                  placeholder="Lisää henkilökohtainen tehtävä + Enter"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {tasks.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          <p className="text-sm">Ei vielä tehtäviä tälle päivälle.</p>
          {isToday && (
            <p className="text-xs mt-1">Lisää tehtäviä yllä olevista välilehdistä.</p>
          )}
        </div>
      )}

      {/* Celebration overlay */}
      <CelebrationOverlay
        show={showCelebration}
        message="Kaikki tehtävät valmiit!"
        emoji="🎉"
        points={todayPoints.allCompleteBonus}
        onDone={() => setShowCelebration(false)}
      />
    </PageContainer>
  );
};

export default DailyPlan;

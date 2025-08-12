import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";
import { getISOWeek, format } from "date-fns";

interface WeekPlanData { weekKey: string; goals: string[]; updatedAt: string }
interface DailyPlanData {
  dateKey: string;
  projects: { name: string; tasks: string[] }[];
  otherWork: string[];
  otherTasks: string[];
  completedTasks: string[];
  createdAt: string;
}

const WEEK_PREFIX = "weekPlan-";
const DAY_PREFIX = "dailyPlan-";

function getCurrentWeekKey(date = new Date()) {
  const week = getISOWeek(date);
  const year = date.getFullYear();
  return `${WEEK_PREFIX}${year}-W${String(week).padStart(2, "0")}`;
}

function getTodayKey(date = new Date()) {
  const d = new Date(date);
  const iso = d.toISOString().slice(0, 10);
  return `${DAY_PREFIX}${iso}`;
}

function loadWeekPlan(key: string): WeekPlanData | null {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null } catch { return null }
}

function loadDailyPlan(key: string): DailyPlanData | null {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null } catch { return null }
}

function saveDailyPlan(data: DailyPlanData) {
  localStorage.setItem(data.dateKey, JSON.stringify(data));
}

function findPreviousDaily(beforeKey: string): DailyPlanData | null {
  const keys = Object.keys(localStorage).filter((k) => k.startsWith(DAY_PREFIX));
  const parseDate = (k: string) => k.replace(DAY_PREFIX, "");
  const before = parseDate(beforeKey);
  const sorted = keys
    .map((k) => parseDate(k))
    .filter((d) => d < before)
    .sort()
    .reverse();
  if (!sorted.length) return null;
  return loadDailyPlan(`${DAY_PREFIX}${sorted[0]}`);
}

const DailyPlan = () => {
  const weekKey = useMemo(() => getCurrentWeekKey(), []);
  const todayKey = useMemo(() => getTodayKey(), []);
  const week = loadWeekPlan(weekKey);

  const [projects, setProjects] = useState<{ name: string; tasks: string[] }[]>(
    (week?.goals || ["", "", ""]).slice(0, 3).map((name) => ({ name, tasks: [] }))
  );
  const [otherWork, setOtherWork] = useState<string[]>([]);
  const [otherTasks, setOtherTasks] = useState<string[]>([]);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [prevOpen, setPrevOpen] = useState(false);
  const [prevPlan, setPrevPlan] = useState<DailyPlanData | null>(null);

  useEffect(() => {
    // Load today's if exists
    const existing = loadDailyPlan(todayKey);
    if (existing) {
      setProjects(existing.projects);
      setOtherWork(existing.otherWork);
      setOtherTasks(existing.otherTasks);
      setCompletedTasks(existing.completedTasks || []);
    }
  }, [todayKey]);

  useEffect(() => {
    // Sync project names with week plan if empty
    if (week?.goals) {
      setProjects((p) => p.map((proj, i) => ({ ...proj, name: week.goals[i] || proj.name })));
    }
  }, [weekKey]);

  const addTask = (i: number, task: string) => {
    const t = task.trim(); if (!t) return;
    setProjects((ps) => ps.map((p, idx) => idx === i ? { ...p, tasks: [...p.tasks, t] } : p));
  };
  const removeTask = (pi: number, ti: number) => {
    setProjects((ps) => ps.map((p, idx) => idx === pi ? { ...p, tasks: p.tasks.filter((_, j) => j !== ti) } : p));
  };

  const onSave = () => {
    const data: DailyPlanData = {
      dateKey: todayKey,
      projects,
      otherWork,
      otherTasks,
      completedTasks,
      createdAt: new Date().toISOString(),
    };
    saveDailyPlan(data);
    toast({ title: "Päiväsuunnitelma tallennettu", description: format(new Date(), "d.M.yyyy") });
  };

  const toggleTaskCompletion = (task: string) => {
    setCompletedTasks(prev => 
      prev.includes(task) 
        ? prev.filter(t => t !== task)
        : [...prev, task]
    );
  };

  const showPrev = () => {
    const prev = findPreviousDaily(todayKey);
    setPrevPlan(prev);
    setPrevOpen(true);
  };

  const allWorkTasks = projects.flatMap((p) => p.tasks);

  return (
    <div className="container mx-auto max-w-md px-4 py-6 space-y-6">
      <Helmet>
        <title>Päiväsuunnittelu – työ & muut työt | Suunnittelija</title>
        <meta name="description" content="Luo päivän suunnitelma: työprojektien tehtävät sekä muut työ- ja muut työt listana. Boldaa 3 ensimmäistä työtehtävää." />
        <link rel="canonical" href="/paiva" />
      </Helmet>

      {!week?.goals?.some(Boolean) && (
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">Et ole vielä asettanut viikon tavoitteita. Aloita viikkosuunnittelusta.</p>
            <div className="pt-3">
              <Button asChild variant="secondary">
                <a href="/viikko">Avaa viikkosuunnittelu</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task Overview List */}
      {allWorkTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Päivän työtehtävät</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Important tasks first */}
              {allWorkTasks.slice(0, 3).map((task, idx) => {
                const isCompleted = completedTasks.includes(task);
                return (
                  <div key={`important-${idx}`} className="flex items-center space-x-3 p-2 rounded-lg bg-primary/5">
                    <Checkbox 
                      checked={isCompleted}
                      onCheckedChange={() => toggleTaskCompletion(task)}
                    />
                    <span className={`font-semibold flex-1 ${isCompleted ? 'line-through opacity-50' : ''}`}>
                      {task}
                    </span>
                    {isCompleted && <CheckCircle className="w-4 h-4 text-green-600" />}
                  </div>
                );
              })}
              
              {/* Other tasks */}
              {allWorkTasks.slice(3).map((task, idx) => {
                const isCompleted = completedTasks.includes(task);
                return (
                  <div key={`other-${idx}`} className="flex items-center space-x-3 p-2">
                    <Checkbox 
                      checked={isCompleted}
                      onCheckedChange={() => toggleTaskCompletion(task)}
                    />
                    <span className={`flex-1 ${isCompleted ? 'line-through opacity-50' : ''}`}>
                      {task}
                    </span>
                    {isCompleted && <CheckCircle className="w-4 h-4 text-green-600" />}
                  </div>
                );
              })}
              
              {/* Other work tasks */}
              {otherWork.map((task, idx) => {
                const isCompleted = completedTasks.includes(task);
                return (
                  <div key={`work-${idx}`} className="flex items-center space-x-3 p-2">
                    <Checkbox 
                      checked={isCompleted}
                      onCheckedChange={() => toggleTaskCompletion(task)}
                    />
                    <span className={`flex-1 ${isCompleted ? 'line-through opacity-50' : ''}`}>
                      {task}
                    </span>
                    {isCompleted && <CheckCircle className="w-4 h-4 text-green-600" />}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2">
        <Button onClick={onSave} variant="hero" className="flex-1">Tallenna päivän suunnitelma</Button>
        <Button onClick={showPrev} variant="outline">Edellinen</Button>
      </div>

      {/* Projects */}
      {projects.map((proj, i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle className="text-lg">Projekti {i + 1}: {proj.name || "(nimeä viikolla)"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <TaskInput onAdd={(t) => addTask(i, t)} placeholder="Lisää tehtävä ja paina Enter" />
            <ul className="list-disc pl-5 space-y-1">
              {proj.tasks.map((t, idx) => (
                <li key={idx} className="flex items-start justify-between gap-2">
                  {(() => {
                    const globalIndex = projects.slice(0, i).reduce((s, p) => s + p.tasks.length, 0) + idx;
                    return (
                      <span className={globalIndex < 3 ? "font-semibold" : undefined}>{t}</span>
                    );
                  })()}
                  <button onClick={() => removeTask(i, idx)} className="text-sm text-muted-foreground hover:underline">Poista</button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}

      {/* Other work */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Muut työtehtävät</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <TaskInput onAdd={(t) => setOtherWork((l) => [...l, t])} placeholder="Lisää työtehtävä (Enter)" />
          <SimpleList items={otherWork} onRemove={(i) => setOtherWork((l) => l.filter((_, j) => i !== j))} />
        </CardContent>
      </Card>

      {/* Other personal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Muut työt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <TaskInput onAdd={(t) => setOtherTasks((l) => [...l, t])} placeholder="Lisää tehtävä (Enter)" />
          <SimpleList items={otherTasks} onRemove={(i) => setOtherTasks((l) => l.filter((_, j) => i !== j))} />
        </CardContent>
      </Card>

      {/* Aggregated preview for bolding first 3 work tasks */}
      {!!allWorkTasks.length && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Työtehtävät yhteensä</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1">
              {allWorkTasks.map((t, idx) => (
                <li key={idx} className={idx < 3 ? "font-semibold" : undefined}>{t}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Previous dialog */}
      <Dialog open={prevOpen} onOpenChange={setPrevOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edellinen päiväsuunnitelma</DialogTitle>
          </DialogHeader>
          {prevPlan ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Päivä: {prevPlan.dateKey.replace(DAY_PREFIX, "")}</p>
              <section>
                <h3 className="font-medium mb-2">Projektit</h3>
                {prevPlan.projects.map((p, i) => (
                  <div key={i} className="mb-3">
                    <p className="text-sm text-muted-foreground">{p.name}</p>
                    <ul className="list-disc pl-5">
                      {p.tasks.map((t, idx) => (
                        <li key={idx} className={idx < 3 ? "font-semibold" : undefined}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
              <section>
                <h3 className="font-medium mb-1">Muut työtehtävät</h3>
                <ul className="list-disc pl-5">
                  {prevPlan.otherWork.map((t, i) => (<li key={i}>{t}</li>))}
                </ul>
              </section>
              <section>
                <h3 className="font-medium mb-1">Muut työt</h3>
                <ul className="list-disc pl-5">
                  {prevPlan.otherTasks.map((t, i) => (<li key={i}>{t}</li>))}
                </ul>
              </section>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Ei aiempaa suunnitelmaa.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

function TaskInput({ onAdd, placeholder }: { onAdd: (t: string) => void; placeholder: string }) {
  const [val, setVal] = useState("");
  return (
    <Input
      value={val}
      onChange={(e) => setVal(e.target.value)}
      placeholder={placeholder}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onAdd(val);
          setVal("");
        }
      }}
    />
  );
}

function SimpleList({ items, onRemove }: { items: string[]; onRemove: (i: number) => void }) {
  return (
    <ul className="list-disc pl-5 space-y-1">
      {items.map((t, i) => (
        <li key={i} className="flex items-start justify-between gap-2">
          <span>{t}</span>
          <button onClick={() => onRemove(i)} className="text-sm text-muted-foreground hover:underline">Poista</button>
        </li>
      ))}
    </ul>
  );
}

export default DailyPlan;

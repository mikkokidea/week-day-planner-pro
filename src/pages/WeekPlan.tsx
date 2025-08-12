import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { getISOWeek, format } from "date-fns";

interface WeekPlanData {
  weekKey: string;
  goals: string[]; // 3 strings
  updatedAt: string;
}

const STORAGE_PREFIX = "weekPlan-";

function getCurrentWeekKey(date = new Date()) {
  const week = getISOWeek(date);
  const year = date.getFullYear();
  return `${STORAGE_PREFIX}${year}-W${String(week).padStart(2, "0")}`;
}

function loadWeekPlan(key: string): WeekPlanData | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as WeekPlanData;
  } catch {
    return null;
  }
}

function saveWeekPlan(data: WeekPlanData) {
  localStorage.setItem(data.weekKey, JSON.stringify(data));
}

const WeekPlan = () => {
  const weekKey = useMemo(() => getCurrentWeekKey(), []);
  const [goals, setGoals] = useState<string[]>(["", "", ""]);

  useEffect(() => {
    const existing = loadWeekPlan(weekKey);
    if (existing?.goals?.length === 3) setGoals(existing.goals);
  }, [weekKey]);

  const handleChange = (i: number, v: string) => {
    setGoals((g) => g.map((x, idx) => (idx === i ? v : x)));
  };

  const onSave = () => {
    const cleaned = goals.map((g) => g.trim());
    const data: WeekPlanData = {
      weekKey,
      goals: cleaned,
      updatedAt: new Date().toISOString(),
    };
    saveWeekPlan(data);
    toast({ title: "Viikkosuunnitelma tallennettu", description: format(new Date(), "d.M.yyyy") });
  };

  return (
    <div className="container mx-auto max-w-md px-4 py-8">
      <Helmet>
        <title>Viikkosuunnittelu – 3 tavoitetta | Suunnittelija</title>
        <meta name="description" content="Aseta viikon 3 tärkeintä tavoitetta. Nämä muodostavat päivän projektit ja tehtävät." />
        <link rel="canonical" href="/viikko" />
      </Helmet>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Viikon 3 tärkeintä tavoitetta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {goals.map((g, i) => (
            <div key={i} className="space-y-1">
              <label className="text-sm text-muted-foreground">Tavoite {i + 1}</label>
              <Input
                value={g}
                onChange={(e) => handleChange(i, e.target.value)}
                placeholder={`Kirjoita tavoite ${i + 1}`}
              />
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <Button onClick={onSave} variant="hero" className="flex-1">Tallenna viikko</Button>
          </div>
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground mt-3">Tämä viikko: {weekKey.replace(STORAGE_PREFIX, "")}</p>
    </div>
  );
};

export default WeekPlan;

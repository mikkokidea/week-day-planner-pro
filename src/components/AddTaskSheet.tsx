import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PILLARS, type PillarId } from "@/lib/pillars";
import BottomSheet from "./BottomSheet";
import type { WeekGoal } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AddTaskSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (text: string, pillar: PillarId, isMIT: boolean, goalId?: string) => void;
  weekGoals?: WeekGoal[];
}

export default function AddTaskSheet({ open, onOpenChange, onAdd, weekGoals = [] }: AddTaskSheetProps) {
  const [text, setText] = useState("");
  const [pillar, setPillar] = useState<PillarId>("sales");
  const [isMIT, setIsMIT] = useState(false);
  const [goalId, setGoalId] = useState<string | undefined>();

  const handleSubmit = () => {
    if (!text.trim()) return;
    onAdd(text.trim(), pillar, isMIT, goalId);
    setText("");
    setIsMIT(false);
    setGoalId(undefined);
    onOpenChange(false);
  };

  const pillarGoals = weekGoals.filter((g) => g.pillar === pillar);

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} title="Lisää tehtävä">
      <div className="space-y-4">
        <div>
          <Label className="text-xs mb-1.5 block">Pilari</Label>
          <div className="flex flex-wrap gap-2">
            {PILLARS.map((p) => (
              <button
                key={p.id}
                onClick={() => { setPillar(p.id); setGoalId(undefined); }}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                  pillar === p.id
                    ? "border-[hsl(var(--brand))] bg-[hsl(var(--brand)/0.08)]"
                    : "border-transparent bg-muted/50 text-muted-foreground"
                )}
              >
                {p.emoji} {p.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-xs">Tehtävä</Label>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Kirjoita tehtävä..."
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            autoFocus
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-xs flex items-center gap-1.5">
            ⭐ MIT (tärkeä tehtävä)
          </Label>
          <Switch checked={isMIT} onCheckedChange={setIsMIT} />
        </div>

        {pillarGoals.length > 0 && (
          <div>
            <Label className="text-xs mb-1.5 block">Linkitä viikkotavoitteeseen</Label>
            <div className="space-y-1">
              {pillarGoals.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGoalId(goalId === g.id ? undefined : g.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-xs border transition-all",
                    goalId === g.id
                      ? "border-[hsl(var(--brand))] bg-[hsl(var(--brand)/0.08)]"
                      : "border-transparent bg-muted/40"
                  )}
                >
                  {g.text}
                </button>
              ))}
            </div>
          </div>
        )}

        <Button onClick={handleSubmit} className="w-full bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-2))] text-white">
          Lisää tehtävä
        </Button>
      </div>
    </BottomSheet>
  );
}

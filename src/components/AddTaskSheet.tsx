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
          <Label className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5 block font-semibold">Pilari</Label>
          <div className="flex flex-wrap gap-2">
            {PILLARS.map((p) => {
              const isSelected = pillar === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => { setPillar(p.id); setGoalId(undefined); }}
                  className={cn(
                    "px-3.5 py-2 rounded-full text-xs font-medium border transition-all",
                    isSelected
                      ? ""
                      : "bg-transparent border-border text-muted-foreground"
                  )}
                  style={isSelected ? {
                    backgroundColor: `hsl(var(--pillar-${p.id}) / 0.12)`,
                    borderColor: `hsl(var(--pillar-${p.id}) / 0.4)`,
                    color: `hsl(var(--pillar-${p.id}))`,
                  } : undefined}
                >
                  {p.emoji} {p.name}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <Label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Tehtävä</Label>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Kirjoita tehtävä..."
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            autoFocus
            className="rounded-xl"
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
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5 block font-semibold">Linkitä viikkotavoitteeseen</Label>
            <div className="space-y-1">
              {pillarGoals.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGoalId(goalId === g.id ? undefined : g.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-xl text-xs border transition-all",
                    goalId === g.id
                      ? "border-gold/40 bg-gold/[0.08]"
                      : "border-border bg-muted/40"
                  )}
                >
                  {g.text}
                </button>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="w-full bg-gold hover:bg-gold/90 text-gold-foreground font-bold rounded-xl py-3.5 disabled:bg-muted disabled:text-muted-foreground"
        >
          Lisää tehtävä
        </Button>
      </div>
    </BottomSheet>
  );
}

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PILLARS, type PillarId } from "@/lib/pillars";
import BottomSheet from "./BottomSheet";
import { cn } from "@/lib/utils";

interface AddGoalSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (text: string, pillar: PillarId) => void;
}

export default function AddGoalSheet({ open, onOpenChange, onAdd }: AddGoalSheetProps) {
  const [text, setText] = useState("");
  const [pillar, setPillar] = useState<PillarId>("sales");

  const handleSubmit = () => {
    if (!text.trim()) return;
    onAdd(text.trim(), pillar);
    setText("");
    onOpenChange(false);
  };

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} title="Lisää viikkotavoite">
      <div className="space-y-4">
        <div>
          <Label className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5 block font-semibold">Pilari</Label>
          <div className="flex flex-wrap gap-2">
            {PILLARS.map((p) => {
              const isSelected = pillar === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPillar(p.id)}
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
          <Label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Tavoite</Label>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Kirjoita tavoite..."
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            autoFocus
            className="rounded-xl"
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="w-full bg-gold hover:bg-gold/90 text-gold-foreground font-bold rounded-xl py-3.5 disabled:bg-muted disabled:text-muted-foreground"
        >
          Lisää tavoite
        </Button>
      </div>
    </BottomSheet>
  );
}

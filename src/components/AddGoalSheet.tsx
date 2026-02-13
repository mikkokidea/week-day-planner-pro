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
          <Label className="text-xs mb-1.5 block">Pilari</Label>
          <div className="flex flex-wrap gap-2">
            {PILLARS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPillar(p.id)}
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
          <Label className="text-xs">Tavoite</Label>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Kirjoita tavoite..."
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            autoFocus
          />
        </div>
        <Button onClick={handleSubmit} className="w-full bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-2))] text-white">
          Lisää tavoite
        </Button>
      </div>
    </BottomSheet>
  );
}

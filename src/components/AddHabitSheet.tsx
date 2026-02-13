import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import BottomSheet from "./BottomSheet";
import type { Habit } from "@/lib/types";

const EMOJI_OPTIONS = ["🏃", "📖", "🧘", "💧", "🎵", "✍️", "🥗", "😴", "🧹", "📵"];
const DAY_LABELS = ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"];

interface AddHabitSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (habit: Habit) => void;
}

export default function AddHabitSheet({ open, onOpenChange, onAdd }: AddHabitSheetProps) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🏃");
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5]);

  const toggleDay = (d: number) =>
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd({
      id: crypto.randomUUID(),
      name: name.trim(),
      emoji,
      points: 5,
      days,
    });
    setName("");
    onOpenChange(false);
  };

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} title="Lisää tapa">
      <div className="space-y-4">
        <div>
          <Label className="text-xs">Emoji</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {EMOJI_OPTIONS.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className={`text-2xl p-1 rounded-lg ${emoji === e ? "ring-2 ring-[hsl(var(--brand))]" : ""}`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label className="text-xs">Nimi</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="esim. Liikunta" />
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">Päivät</Label>
          <div className="flex gap-1.5">
            {DAY_LABELS.map((label, i) => (
              <button
                key={i}
                onClick={() => toggleDay(i)}
                className={`w-9 h-9 rounded-full text-xs font-medium transition-all ${
                  days.includes(i)
                    ? "bg-[hsl(var(--brand))] text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <Button onClick={handleSubmit} className="w-full bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-2))] text-white">
          Lisää tapa
        </Button>
      </div>
    </BottomSheet>
  );
}

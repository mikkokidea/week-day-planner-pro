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
          <Label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Emoji</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {EMOJI_OPTIONS.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className={`text-2xl p-1 rounded-lg ${emoji === e ? "ring-2 ring-gold" : ""}`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Nimi</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="esim. Liikunta" className="rounded-xl" />
        </div>
        <div>
          <Label className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5 block font-semibold">Päivät</Label>
          <div className="flex gap-1.5">
            {DAY_LABELS.map((label, i) => (
              <button
                key={i}
                onClick={() => toggleDay(i)}
                className={`w-9 h-9 rounded-full text-xs font-medium transition-all ${
                  days.includes(i)
                    ? "bg-gold text-gold-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="w-full bg-gold hover:bg-gold/90 text-gold-foreground font-bold rounded-xl py-3.5 disabled:bg-muted disabled:text-muted-foreground"
        >
          Lisää tapa
        </Button>
      </div>
    </BottomSheet>
  );
}

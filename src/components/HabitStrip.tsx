import { cn } from "@/lib/utils";
import type { Habit } from "@/lib/types";

interface HabitStripProps {
  habits: Habit[];
  completedIds: string[];
  onToggle: (habitId: string) => void;
}

export default function HabitStrip({ habits, completedIds, onToggle }: HabitStripProps) {
  if (habits.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto py-1 px-1 no-scrollbar">
      {habits.map((habit) => {
        const done = completedIds.includes(habit.id);
        return (
          <button
            key={habit.id}
            onClick={() => onToggle(habit.id)}
            className={cn(
              "flex flex-col items-center gap-1 min-w-[56px] transition-all",
              done && "animate-habit-pop"
            )}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all",
                done
                  ? "border-gold bg-gold text-gold-foreground"
                  : "border-border bg-muted hover:border-muted-foreground/30"
              )}
            >
              {done ? (
                <span className="text-lg">✓</span>
              ) : (
                <span className="text-xl">{habit.emoji}</span>
              )}
            </div>
            <span className="text-[8px] text-muted-foreground truncate max-w-[52px] font-medium">
              {habit.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

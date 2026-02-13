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
                "w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 transition-all",
                done
                  ? "border-success bg-success/10 scale-105"
                  : "border-muted-foreground/20 bg-muted/50 hover:border-[hsl(var(--brand))]"
              )}
            >
              {habit.emoji}
            </div>
            <span className="text-[10px] text-muted-foreground truncate max-w-[56px]">
              {habit.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

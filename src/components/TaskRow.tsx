import { Check, Trash2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import PillarBadge from "./PillarBadge";
import type { DailyTask } from "@/lib/types";

interface TaskRowProps {
  task: DailyTask;
  onToggle: () => void;
  onRemove: () => void;
  editable?: boolean;
}

export default function TaskRow({ task, onToggle, onRemove, editable = true }: TaskRowProps) {
  return (
    <div
      className={cn(
        "group flex items-center gap-2 py-2 px-2 rounded-lg transition-all",
        task.completed && "opacity-60"
      )}
    >
      <button
        onClick={onToggle}
        disabled={!editable}
        className={cn(
          "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
          task.completed
            ? "bg-success border-success text-success-foreground animate-check-pop"
            : task.pillar === "frog"
            ? "border-green-500 hover:bg-green-500/10"
            : "border-muted-foreground/30 hover:border-[hsl(var(--brand))]"
        )}
      >
        {task.completed && <Check className="w-3.5 h-3.5" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {task.isMIT && <Star className="w-3 h-3 text-amber-500 flex-shrink-0" />}
          {task.pillar === "frog" && <span className="text-sm animate-frog-bounce">🐸</span>}
          <span
            className={cn(
              "text-sm truncate",
              task.completed && "line-through text-muted-foreground"
            )}
          >
            {task.text}
          </span>
        </div>
      </div>

      <PillarBadge pillar={task.pillar} size="sm" />

      {editable && (
        <button
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity p-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

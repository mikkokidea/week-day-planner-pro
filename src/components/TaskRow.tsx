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
  const isFrog = task.pillar === "frog";

  return (
    <div
      className={cn(
        "group relative flex items-center gap-2 py-2 px-2 rounded-lg transition-all",
        task.completed && "opacity-60",
        isFrog && "bg-orange-500/[0.08] border border-orange-500/20",
        task.isMIT && !isFrog && "bg-muted border border-border"
      )}
    >
      <button
        onClick={onToggle}
        disabled={!editable}
        className={cn(
          "rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all",
          task.isMIT ? "w-[22px] h-[22px]" : "w-[18px] h-[18px]",
          task.completed
            ? "bg-success border-success text-success-foreground animate-check-pop"
            : isFrog
            ? "border-pillar-frog hover:bg-pillar-frog/10"
            : "border-muted-foreground/30 hover:border-gold"
        )}
      >
        {task.completed && <Check className="w-3 h-3" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {task.isMIT && <Star className="w-3 h-3 text-gold flex-shrink-0" />}
          <span
            className={cn(
              "text-[13px] truncate",
              task.completed && "line-through text-muted-foreground",
              task.isMIT && !task.completed && "font-medium"
            )}
          >
            {task.text}
          </span>
        </div>
      </div>

      {isFrog && !task.completed && (
        <span className="text-lg animate-frog-bounce">🐸</span>
      )}

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

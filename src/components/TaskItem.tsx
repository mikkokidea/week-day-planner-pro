import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  text: string;
  completed: boolean;
  isTop3?: boolean;
  points?: number;
  onToggle: () => void;
  onRemove: () => void;
  editable?: boolean;
}

export default function TaskItem({
  text,
  completed,
  isTop3,
  points = 10,
  onToggle,
  onRemove,
  editable = true,
}: TaskItemProps) {
  const [showPoints, setShowPoints] = useState(false);

  const handleToggle = () => {
    if (!completed) {
      setShowPoints(true);
      setTimeout(() => setShowPoints(false), 800);
    }
    onToggle();
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-2.5 rounded-lg transition-all group relative",
        isTop3 && !completed && "bg-gold/10 border border-gold/20",
        completed && "opacity-60"
      )}
    >
      <Checkbox
        checked={completed}
        onCheckedChange={handleToggle}
        disabled={!editable}
        className={cn(
          completed && "bg-success border-success data-[state=checked]:bg-success"
        )}
      />

      <div className="flex-1 min-w-0">
        <span
          className={cn(
            "text-sm",
            isTop3 && "font-semibold",
            completed && "line-through"
          )}
        >
          {isTop3 && !completed && (
            <Star className="inline w-3.5 h-3.5 text-gold mr-1 -mt-0.5" />
          )}
          {text}
        </span>
      </div>

      {/* Points pop animation */}
      {showPoints && (
        <span className="absolute right-10 top-0 text-sm font-bold text-gold animate-points-pop">
          +{isTop3 ? 25 : points}p
        </span>
      )}

      {editable && (
        <button
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

import { Progress } from "@/components/ui/progress";
import type { LevelInfo } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LevelBadgeProps {
  levelInfo: LevelInfo;
  showProgress?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function LevelBadge({
  levelInfo,
  showProgress = true,
  size = "md",
  className,
}: LevelBadgeProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-2))] text-white font-bold",
            size === "sm" && "w-6 h-6 text-xs",
            size === "md" && "w-8 h-8 text-sm",
            size === "lg" && "w-10 h-10 text-base"
          )}
        >
          {levelInfo.level}
        </span>
        <span
          className={cn(
            "font-semibold",
            size === "sm" && "text-xs",
            size === "md" && "text-sm",
            size === "lg" && "text-base"
          )}
        >
          {levelInfo.name}
        </span>
      </div>
      {showProgress && levelInfo.progress < 1 && (
        <div className="space-y-0.5">
          <Progress
            value={levelInfo.progress * 100}
            className="h-2"
          />
          <p className="text-[10px] text-muted-foreground">
            {levelInfo.currentXP} / {levelInfo.requiredXP} XP
          </p>
        </div>
      )}
    </div>
  );
}

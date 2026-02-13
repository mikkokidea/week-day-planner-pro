import { cn } from "@/lib/utils";

interface StreakFlameProps {
  streak: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function StreakFlame({ streak, size = "md", className }: StreakFlameProps) {
  if (streak <= 0) return null;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 font-bold text-streak",
        size === "sm" && "text-sm",
        size === "md" && "text-base",
        size === "lg" && "text-xl",
        className
      )}
    >
      <span
        className={cn(
          "animate-streak-flame inline-block origin-bottom",
          size === "sm" && "text-lg",
          size === "md" && "text-2xl",
          size === "lg" && "text-4xl"
        )}
      >
        🔥
      </span>
      <span>{streak} pv</span>
    </div>
  );
}

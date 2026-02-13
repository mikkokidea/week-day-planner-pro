import { cn } from "@/lib/utils";
import { getPillar, type PillarId } from "@/lib/pillars";

interface PillarBadgeProps {
  pillar: PillarId;
  size?: "sm" | "md";
  className?: string;
}

const pillarBg: Record<PillarId, string> = {
  sales: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  automation: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  strategy: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  frog: "bg-green-500/15 text-green-700 dark:text-green-400",
  life: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
};

export default function PillarBadge({ pillar, size = "sm", className }: PillarBadgeProps) {
  const p = getPillar(pillar);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        pillarBg[pillar],
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
        className
      )}
    >
      <span>{p.emoji}</span>
      <span>{p.name}</span>
    </span>
  );
}

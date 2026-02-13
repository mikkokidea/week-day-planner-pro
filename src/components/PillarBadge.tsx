import { cn } from "@/lib/utils";
import { getPillar, type PillarId } from "@/lib/pillars";

interface PillarBadgeProps {
  pillar: PillarId;
  size?: "sm" | "md";
  className?: string;
}

const pillarStyles: Record<PillarId, string> = {
  sales: "bg-pillar-sales/[0.08] border-pillar-sales/20 text-pillar-sales",
  automation: "bg-pillar-automation/[0.08] border-pillar-automation/20 text-pillar-automation",
  strategy: "bg-pillar-strategy/[0.08] border-pillar-strategy/20 text-pillar-strategy",
  frog: "bg-pillar-frog/[0.08] border-pillar-frog/20 text-pillar-frog",
  life: "bg-pillar-life/[0.08] border-pillar-life/20 text-pillar-life",
};

export default function PillarBadge({ pillar, size = "sm", className }: PillarBadgeProps) {
  const p = getPillar(pillar);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium border",
        pillarStyles[pillar],
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
        className
      )}
    >
      <span>{p.emoji}</span>
      <span>{p.name}</span>
    </span>
  );
}

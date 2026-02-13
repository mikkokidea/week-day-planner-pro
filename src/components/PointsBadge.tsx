import { Coins } from "lucide-react";
import { cn } from "@/lib/utils";

interface PointsBadgeProps {
  points: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function PointsBadge({ points, size = "md", className }: PointsBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-gold/15 text-gold font-bold",
        size === "sm" && "text-xs px-2 py-0.5",
        size === "md" && "text-sm px-3 py-1",
        size === "lg" && "text-lg px-4 py-1.5",
        className
      )}
    >
      <Coins className={cn(
        size === "sm" && "w-3 h-3",
        size === "md" && "w-4 h-4",
        size === "lg" && "w-5 h-5"
      )} />
      {points}p
    </div>
  );
}

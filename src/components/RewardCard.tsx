import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Lock, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Reward } from "@/lib/types";

interface RewardCardProps {
  reward: Reward;
  currentPoints: number;
  lifetimePoints: number;
  isClaimed: boolean;
  onClaim: () => void;
  onRemove?: () => void;
}

export default function RewardCard({
  reward,
  currentPoints,
  lifetimePoints,
  isClaimed,
  onClaim,
  onRemove,
}: RewardCardProps) {
  const relevantPoints = reward.isMilestone ? lifetimePoints : currentPoints;
  const canAfford = relevantPoints >= reward.pointCost;
  const progress = Math.min(relevantPoints / reward.pointCost, 1);

  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-all",
        canAfford && !isClaimed && "animate-pulse-glow border-gold/40 bg-gold/5",
        isClaimed && "opacity-60 bg-success/5 border-success/30",
        !canAfford && !isClaimed && "bg-card"
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl">{reward.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">{reward.name}</h3>
            {reward.isMilestone && (
              <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">
                Milestone
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {reward.pointCost}p {reward.isMilestone ? "(elinaikaispisteet)" : ""}
          </p>

          {!isClaimed && (
            <div className="mt-2 space-y-1">
              <Progress value={progress * 100} className="h-1.5" />
              <p className="text-[10px] text-muted-foreground">
                {Math.min(relevantPoints, reward.pointCost)} / {reward.pointCost}p
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-1">
          {isClaimed ? (
            <span className="flex items-center gap-1 text-success text-xs font-medium">
              <Check className="w-4 h-4" /> Lunastettu
            </span>
          ) : canAfford ? (
            <Button
              size="sm"
              onClick={onClaim}
              className="bg-gold hover:bg-gold/90 text-gold-foreground text-xs"
            >
              Lunasta
            </Button>
          ) : (
            <Lock className="w-4 h-4 text-muted-foreground" />
          )}
          {onRemove && !isClaimed && (
            <button
              onClick={onRemove}
              className="text-[10px] text-muted-foreground hover:text-destructive"
            >
              Poista
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

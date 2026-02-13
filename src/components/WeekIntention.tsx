import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useWeekPlan } from "@/hooks/useWeekPlan";
import PillarBadge from "./PillarBadge";
import type { WeekGoal } from "@/lib/types";

interface WeekIntentionProps {
  show: boolean;
  onClose: () => void;
}

export default function WeekIntention({ show, onClose }: WeekIntentionProps) {
  const { goals } = useWeekPlan();

  if (!show || goals.length === 0) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/40 animate-scale-in">
      <Card className="w-full max-w-md mx-4 mb-20 sm:mb-0 animate-slide-up">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base">Viikon tavoitteet</h3>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {goals.map((goal: WeekGoal) => (
              <div key={goal.id} className="flex items-start gap-2">
                <PillarBadge pillar={goal.pillar} size="sm" />
                <span className="text-sm">{goal.text}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

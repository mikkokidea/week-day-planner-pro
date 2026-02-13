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
    <div className="fixed inset-0 z-[250] flex items-end justify-center bg-black/65">
      <div className="w-full max-w-md bg-card rounded-t-3xl border border-gold/20 border-b-0 px-6 pt-7 pb-8 pb-[env(safe-area-inset-bottom,20px)] animate-sheet-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex flex-col items-center w-full text-center">
            <span className="text-3xl mb-1">🧭</span>
            <h3 className="font-display text-xl font-extrabold">Viikon tavoitteet</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Muista nämä tänään</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 absolute right-6 top-7">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Goals */}
        <div className="space-y-2.5 mb-6">
          {goals.map((goal: WeekGoal) => {
            const pillarVar = `--pillar-${goal.pillar}`;
            return (
              <div
                key={goal.id}
                className="flex items-center gap-3 rounded-xl p-2.5 border"
                style={{
                  backgroundColor: `hsl(var(${pillarVar}) / 0.08)`,
                  borderColor: `hsl(var(${pillarVar}) / 0.20)`,
                }}
              >
                <PillarBadge pillar={goal.pillar} size="sm" />
                <span className="text-[13px]">{goal.text}</span>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <Button
          onClick={onClose}
          className="w-full bg-gold hover:bg-gold/90 text-gold-foreground font-bold rounded-xl py-3.5"
        >
          Aloitetaan päivä
        </Button>
      </div>
    </div>
  );
}

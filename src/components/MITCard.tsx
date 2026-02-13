import { Card, CardContent } from "@/components/ui/card";
import ProgressRing from "./ProgressRing";
import { Star } from "lucide-react";
import type { DailyTask } from "@/lib/types";

interface MITCardProps {
  mitTasks: DailyTask[];
  onToggle: (id: string) => void;
}

export default function MITCard({ mitTasks, onToggle }: MITCardProps) {
  const completed = mitTasks.filter((t) => t.completed).length;
  const progress = mitTasks.length > 0 ? completed / mitTasks.length : 0;

  return (
    <Card className="overflow-hidden rounded-2xl">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <ProgressRing progress={progress} size={44} strokeWidth={4}>
            <span className="text-[10px]">{completed}/{mitTasks.length}</span>
          </ProgressRing>
          <div>
            <h3 className="font-display text-base font-bold flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-gold" />
              Päivän 3 tärkeintä
            </h3>
            <p className="text-[10px] text-muted-foreground">25p per MIT-tehtävä</p>
          </div>
        </div>
        {mitTasks.length === 0 ? (
          <p className="text-xs text-muted-foreground">Merkitse tehtävät MIT:ksi lisätessäsi niitä.</p>
        ) : (
          <div className="space-y-1.5">
            {mitTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => onToggle(task.id)}
                className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg text-[13px] transition-all ${
                  task.completed ? "line-through text-muted-foreground opacity-60" : ""
                }`}
              >
                <div
                  className={`w-[22px] h-[22px] rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                    task.completed ? "bg-success border-success" : "border-gold"
                  }`}
                >
                  {task.completed && <span className="text-[8px] text-success-foreground">✓</span>}
                </div>
                <span className="truncate font-medium">{task.text}</span>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

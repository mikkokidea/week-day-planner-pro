import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PILLARS, type PillarId } from "@/lib/pillars";
import TaskRow from "./TaskRow";
import type { DailyTask } from "@/lib/types";

interface TabbedTaskListProps {
  tasks: DailyTask[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  editable?: boolean;
}

export default function TabbedTaskList({ tasks, onToggle, onRemove, editable = true }: TabbedTaskListProps) {
  const [activePillar, setActivePillar] = useState<PillarId>("sales");

  const filteredTasks = tasks.filter((t) => t.pillar === activePillar);

  return (
    <Tabs value={activePillar} onValueChange={(v) => setActivePillar(v as PillarId)}>
      <TabsList className="w-full h-auto flex-wrap gap-1 bg-transparent p-0 mb-3">
        {PILLARS.map((p) => {
          const count = tasks.filter((t) => t.pillar === p.id).length;
          return (
            <TabsTrigger
              key={p.id}
              value={p.id}
              className="text-xs px-2.5 py-1.5 data-[state=active]:bg-[hsl(var(--brand)/0.1)] data-[state=active]:text-foreground rounded-lg"
            >
              {p.emoji} {p.name}
              {count > 0 && <span className="ml-1 text-[10px] text-muted-foreground">({count})</span>}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {PILLARS.map((p) => (
        <TabsContent key={p.id} value={p.id} className="mt-0">
          {filteredTasks.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              Ei tehtäviä tässä pilarissa
            </p>
          ) : (
            <div className="space-y-0.5">
              {filteredTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggle={() => onToggle(task.id)}
                  onRemove={() => onRemove(task.id)}
                  editable={editable}
                />
              ))}
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}

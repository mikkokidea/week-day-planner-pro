import { useState } from "react";
import { PILLARS, type PillarId } from "@/lib/pillars";
import TaskRow from "./TaskRow";
import type { DailyTask } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TabbedTaskListProps {
  tasks: DailyTask[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  editable?: boolean;
}

type TabValue = "all" | PillarId;

export default function TabbedTaskList({ tasks, onToggle, onRemove, editable = true }: TabbedTaskListProps) {
  const [activeTab, setActiveTab] = useState<TabValue>("all");

  const filteredTasks = activeTab === "all" ? tasks : tasks.filter((t) => t.pillar === activeTab);

  const tabs: { value: TabValue; emoji: string; label: string }[] = [
    { value: "all", emoji: "✦", label: "Kaikki" },
    ...PILLARS.map((p) => ({ value: p.id as TabValue, emoji: p.emoji, label: p.name })),
  ];

  return (
    <div>
      {/* Tab bar */}
      <div className="flex border-b border-border overflow-x-auto no-scrollbar" style={{ WebkitOverflowScrolling: "touch" }}>
        {tabs.map((tab) => {
          const count = tab.value === "all" ? tasks.length : tasks.filter((t) => t.pillar === tab.value).length;
          const isActive = activeTab === tab.value;
          const pillar = PILLARS.find((p) => p.id === tab.value);

          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "px-3.5 py-2.5 text-[11px] whitespace-nowrap flex-shrink-0 border-b-2 transition-all flex items-center gap-1",
                isActive
                  ? "font-semibold border-current"
                  : "text-muted-foreground font-normal border-transparent"
              )}
              style={isActive ? {
                color: tab.value === "all"
                  ? "hsl(var(--gold))"
                  : pillar
                    ? `hsl(var(--pillar-${pillar.id}))`
                    : undefined,
              } : undefined}
            >
              <span className="text-xs">{tab.emoji}</span>
              <span>{count > 0 ? `${tasks.filter(t => tab.value === "all" ? true : t.pillar === tab.value).filter(t => t.completed).length}/${count}` : tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Task list */}
      <div className="mt-2">
        {filteredTasks.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            Ei tehtäviä
          </p>
        ) : (
          <div className="space-y-0.5">
            {filteredTasks.map((task, index) => (
              <div key={task.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                <TaskRow
                  task={task}
                  onToggle={() => onToggle(task.id)}
                  onRemove={() => onRemove(task.id)}
                  editable={editable}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

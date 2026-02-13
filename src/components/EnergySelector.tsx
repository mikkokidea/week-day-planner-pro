import type { EnergyLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

const LEVELS: { value: EnergyLevel; emoji: string; label: string; hint: string }[] = [
  { value: "high", emoji: "⚡", label: "Korkea", hint: "Isot projektit ja sammakot" },
  { value: "normal", emoji: "☀️", label: "Normaali", hint: "Tavallinen työpäivä" },
  { value: "low", emoji: "🌙", label: "Matala", hint: "Kevyet tehtävät ja arki" },
];

interface EnergySelectorProps {
  value: EnergyLevel;
  onChange: (level: EnergyLevel) => void;
}

export default function EnergySelector({ value, onChange }: EnergySelectorProps) {
  return (
    <div className="flex gap-2">
      {LEVELS.map((l) => (
        <button
          key={l.value}
          onClick={() => onChange(l.value)}
          className={cn(
            "flex-1 flex flex-col items-center gap-0.5 rounded-xl py-2 px-1 text-xs transition-all border",
            value === l.value
              ? "border-[hsl(var(--brand))] bg-[hsl(var(--brand)/0.08)] font-semibold"
              : "border-transparent bg-muted/50 text-muted-foreground hover:bg-muted"
          )}
        >
          <span className="text-lg">{l.emoji}</span>
          <span>{l.label}</span>
        </button>
      ))}
    </div>
  );
}

import type { EnergyLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

const LEVELS: { value: EnergyLevel; emoji: string; label: string; hint: string; activeClass: string }[] = [
  { value: "high", emoji: "⚡", label: "Korkea", hint: "Isot projektit ja sammakot", activeClass: "bg-amber-500/[0.1] border-amber-500/30 text-amber-500" },
  { value: "normal", emoji: "☀️", label: "Normaali", hint: "Tavallinen työpäivä", activeClass: "bg-emerald-500/[0.1] border-emerald-500/30 text-emerald-500" },
  { value: "low", emoji: "🌙", label: "Matala", hint: "Kevyet tehtävät ja arki", activeClass: "bg-red-500/[0.1] border-red-500/30 text-red-500" },
];

interface EnergySelectorProps {
  value: EnergyLevel;
  onChange: (level: EnergyLevel) => void;
}

export default function EnergySelector({ value, onChange }: EnergySelectorProps) {
  return (
    <div className="flex gap-1.5">
      {LEVELS.map((l) => (
        <button
          key={l.value}
          onClick={() => onChange(l.value)}
          className={cn(
            "flex-1 flex flex-col items-center gap-0.5 rounded-md py-2 px-1 text-xs transition-all border",
            value === l.value
              ? l.activeClass + " font-medium"
              : "bg-transparent border-border text-muted-foreground"
          )}
        >
          <span className="text-sm">{l.emoji}</span>
          <span className="text-[10px] font-medium">{l.hint}</span>
        </button>
      ))}
    </div>
  );
}

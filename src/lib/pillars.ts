export type PillarId = "sales" | "automation" | "strategy" | "frog" | "life";

export interface PillarConfig {
  id: PillarId;
  name: string;
  emoji: string;
  color: string; // CSS variable name
  description: string;
}

export const PILLARS: PillarConfig[] = [
  { id: "sales", name: "Myynti", emoji: "💰", color: "--pillar-sales", description: "Myynti ja asiakashankinta" },
  { id: "automation", name: "Automaatio", emoji: "⚙️", color: "--pillar-automation", description: "Prosessit ja automaatio" },
  { id: "strategy", name: "Strategia", emoji: "🎯", color: "--pillar-strategy", description: "Strategia ja suunnittelu" },
  { id: "frog", name: "Sammakot", emoji: "🐸", color: "--pillar-frog", description: "Vaikeat tehtävät ensin" },
  { id: "life", name: "Arki", emoji: "🏠", color: "--pillar-life", description: "Arki ja henkilökohtainen" },
];

export const PILLAR_MAP = Object.fromEntries(PILLARS.map((p) => [p.id, p])) as Record<PillarId, PillarConfig>;

export function getPillar(id: PillarId): PillarConfig {
  return PILLAR_MAP[id];
}

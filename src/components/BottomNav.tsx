import { NavLink } from "react-router-dom";
import { Home, Calendar, CheckSquare, Trophy } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", label: "Koti", icon: Home },
  { to: "/viikko", label: "Viikko", icon: Calendar },
  { to: "/paiva", label: "Päivä", icon: CheckSquare },
  { to: "/palkinnot", label: "Palkinnot", icon: Trophy },
] as const;

export default function BottomNav() {
  const { gameState } = useGame();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass safe-area-pb">
      <div className="max-w-md mx-auto flex items-center justify-around h-16">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all text-xs",
                isActive
                  ? "text-white bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-2))]"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {label === "Palkinnot" && gameState.currentPoints > 0 && (
                <span className="absolute -top-1.5 -right-3 bg-gold text-gold-foreground text-[10px] font-bold rounded-full px-1 min-w-[16px] text-center leading-4">
                  {gameState.currentPoints >= 1000
                    ? `${(gameState.currentPoints / 1000).toFixed(1)}k`
                    : gameState.currentPoints}
                </span>
              )}
            </div>
            <span className="font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

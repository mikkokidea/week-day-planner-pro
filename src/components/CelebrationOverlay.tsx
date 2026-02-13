import { useEffect, useState } from "react";

interface CelebrationOverlayProps {
  show: boolean;
  emoji?: string;
  message: string;
  points?: number;
  onDone: () => void;
}

const CONFETTI_EMOJIS = ["🎉", "🌟", "✨", "🎊", "💫", "⭐", "🏆", "🔥"];

export default function CelebrationOverlay({
  show,
  emoji = "🎉",
  message,
  points,
  onDone,
}: CelebrationOverlayProps) {
  const [particles, setParticles] = useState<
    { id: number; emoji: string; left: number; delay: number }[]
  >([]);

  useEffect(() => {
    if (!show) return;

    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      emoji: CONFETTI_EMOJIS[Math.floor(Math.random() * CONFETTI_EMOJIS.length)],
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
    }));
    setParticles(newParticles);

    const timer = setTimeout(onDone, 2000);
    return () => clearTimeout(timer);
  }, [show, onDone]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 animate-scale-in" />

      {/* Confetti particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 text-2xl animate-confetti"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.emoji}
        </span>
      ))}

      {/* Center content */}
      <div className="relative z-10 text-center animate-scale-in">
        <div className="text-6xl mb-3">{emoji}</div>
        <p className="text-xl font-bold text-white drop-shadow-lg">{message}</p>
        {points !== undefined && points > 0 && (
          <p className="text-lg text-gold font-bold mt-1 drop-shadow-lg">
            +{points} pistettä!
          </p>
        )}
      </div>
    </div>
  );
}

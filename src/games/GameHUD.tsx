import { Heart, Hourglass, Move, Sparkles, Trophy } from "lucide-react";
import type { ReactNode } from "react";

interface HudMetric {
  label: string;
  value: string | number;
  icon?: ReactNode;
  tone?: "primary" | "accent" | "danger";
}

interface GameHUDProps {
  metrics: HudMetric[];
}

export function GameHUD({ metrics }: GameHUDProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2"
        >
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--game-muted)]">
            {metric.icon}
            {metric.label}
          </div>
          <div
            className={
              metric.tone === "danger"
                ? "mt-1 text-lg font-black text-[var(--game-danger)]"
                : metric.tone === "accent"
                  ? "mt-1 text-lg font-black text-[var(--game-accent)]"
                  : "mt-1 text-lg font-black text-[var(--game-primary)]"
            }
          >
            {metric.value}
          </div>
        </div>
      ))}
    </div>
  );
}

export const hudIcons = {
  score: <Trophy aria-hidden className="h-3.5 w-3.5" />,
  time: <Hourglass aria-hidden className="h-3.5 w-3.5" />,
  health: <Heart aria-hidden className="h-3.5 w-3.5" />,
  moves: <Move aria-hidden className="h-3.5 w-3.5" />,
  spark: <Sparkles aria-hidden className="h-3.5 w-3.5" />
};


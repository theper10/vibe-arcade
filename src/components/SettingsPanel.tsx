import { Gauge, Music2, Volume2, VolumeX, Zap } from "lucide-react";
import type { Difficulty } from "../types/game";
import { cn } from "../lib/cn";
import { useArcadeStore } from "../store/useArcadeStore";

const difficulties: Array<{ id: Difficulty; label: string }> = [
  { id: "chill", label: "Chill" },
  { id: "normal", label: "Normal" },
  { id: "spicy", label: "Spicy" }
];

export function SettingsPanel() {
  const settings = useArcadeStore((state) => state.settings);
  const updateSettings = useArcadeStore((state) => state.updateSettings);

  return (
    <section className="space-y-4" aria-label="Generator settings">
      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label htmlFor="chaos" className="flex items-center gap-2 text-sm font-bold">
            <Zap aria-hidden className="h-4 w-4 text-[var(--game-accent)]" />
            Chaos
          </label>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-black text-[var(--game-accent)]">
            {settings.chaos}
          </span>
        </div>
        <input
          id="chaos"
          type="range"
          min={0}
          max={100}
          value={settings.chaos}
          onChange={(event) => updateSettings({ chaos: Number(event.target.value) })}
          className="h-3 w-full cursor-pointer accent-[var(--game-accent)]"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center gap-2 text-sm font-bold">
          <Gauge aria-hidden className="h-4 w-4 text-[var(--game-primary)]" />
          Difficulty
        </div>
        <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/[0.12] bg-black/20 p-1">
          {difficulties.map((difficulty) => (
            <button
              key={difficulty.id}
              type="button"
              className={cn(
                "min-h-10 rounded-xl px-2 text-sm font-black transition",
                settings.difficulty === difficulty.id
                  ? "bg-[var(--game-primary)] text-slate-950 shadow-glow"
                  : "text-[var(--game-muted)] hover:bg-white/10 hover:text-[var(--game-text)]"
              )}
              onClick={() => updateSettings({ difficulty: difficulty.id })}
            >
              {difficulty.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <button
          type="button"
          role="switch"
          aria-checked={settings.reducedMotion}
          className={cn(
            "flex min-h-12 items-center justify-between gap-3 rounded-2xl border px-3 text-left text-sm font-bold transition",
            settings.reducedMotion
              ? "border-[var(--game-accent)] bg-[color-mix(in_srgb,var(--game-accent)_16%,transparent)]"
              : "border-white/[0.12] bg-white/[0.07] hover:bg-white/10"
          )}
          onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
        >
          <span>Reduced motion</span>
          <span className="h-5 w-9 rounded-full bg-black/[0.35] p-0.5">
            <span
              className={cn(
                "block h-4 w-4 rounded-full bg-[var(--game-text)] transition",
                settings.reducedMotion && "translate-x-4 bg-[var(--game-accent)]"
              )}
            />
          </span>
        </button>
        <button
          type="button"
          role="switch"
          aria-checked={settings.soundEnabled}
          className={cn(
            "flex min-h-12 items-center justify-between gap-3 rounded-2xl border px-3 text-left text-sm font-bold transition",
            settings.soundEnabled
              ? "border-[var(--game-primary)] bg-[color-mix(in_srgb,var(--game-primary)_16%,transparent)]"
              : "border-white/[0.12] bg-white/[0.07] hover:bg-white/10"
          )}
          onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
        >
          <span className="flex items-center gap-2">
            <Music2 aria-hidden className="h-4 w-4" />
            Sound
          </span>
          {settings.soundEnabled ? (
            <Volume2 aria-hidden className="h-4 w-4 text-[var(--game-primary)]" />
          ) : (
            <VolumeX aria-hidden className="h-4 w-4 text-[var(--game-muted)]" />
          )}
        </button>
      </div>
    </section>
  );
}

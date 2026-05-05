import {
  Coins,
  Crown,
  Diamond,
  Eye,
  KeyRound,
  Leaf,
  Moon,
  RotateCcw,
  Save,
  Sparkles,
  Star,
  WandSparkles,
  Zap,
  type LucideIcon
} from "lucide-react";
import { playBeep } from "../lib/audio";
import { templateLabels } from "../lib/copy";
import type { GeneratedGame } from "../types/game";
import { useArcadeStore } from "../store/useArcadeStore";

interface GeneratedGameCardProps {
  game: GeneratedGame | null;
  onRestart: () => void;
}

const iconMap: Record<string, LucideIcon> = {
  diamond: Diamond,
  spark: Sparkles,
  moon: Moon,
  key: KeyRound,
  star: Star,
  crown: Crown,
  bolt: Zap,
  leaf: Leaf,
  eye: Eye,
  coin: Coins
};

export function GeneratedGameCard({ game, onRestart }: GeneratedGameCardProps) {
  const settings = useArcadeStore((state) => state.settings);
  const saveCurrent = useArcadeStore((state) => state.saveCurrent);
  const remixCurrent = useArcadeStore((state) => state.remixCurrent);

  if (!game) {
    return (
      <section className="glass-panel rounded-2xl p-5" aria-label="Generated game">
        <div className="grid min-h-56 place-items-center rounded-2xl border border-dashed border-white/[0.18] bg-black/20 p-6 text-center">
          <div>
            <Sparkles aria-hidden className="mx-auto mb-3 h-9 w-9 text-[var(--game-primary)]" />
            <h2 className="text-xl font-black">No cartridge loaded</h2>
            <p className="mt-2 text-sm text-[var(--game-muted)]">
              Type a vibe, press Generate, and the tiny cabinet will make something playable.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const Icon = iconMap[game.boxArt.icon] ?? Sparkles;

  return (
    <section className="glass-panel rounded-2xl p-4 sm:p-5" aria-labelledby="generated-title">
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.12] bg-black/30 p-4">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute left-6 top-5 h-24 w-24 rounded-full bg-[color-mix(in_srgb,var(--game-primary)_24%,transparent)] blur-2xl" />
          <div className="absolute bottom-0 right-4 h-24 w-24 rounded-full bg-[color-mix(in_srgb,var(--game-secondary)_22%,transparent)] blur-2xl" />
        </div>
        <div className="relative z-10 grid grid-cols-[4.5rem_1fr] gap-4">
          <div className="grid aspect-square place-items-center rounded-2xl border border-white/[0.15] bg-[linear-gradient(145deg,var(--game-primary),var(--game-secondary))] text-slate-950 shadow-glow">
            <Icon aria-hidden className="h-9 w-9" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--game-accent)]">
              {templateLabels[game.template]}
            </p>
            <h2 id="generated-title" className="mt-1 text-xl font-black leading-tight">
              {game.title}
            </h2>
            <p className="mt-1 text-sm text-[var(--game-muted)]">{game.subtitle}</p>
          </div>
        </div>
        <div className="relative z-10 mt-4 grid gap-2 text-sm text-[var(--game-muted)]">
          <p>
            <span className="font-black text-[var(--game-text)]">Studio:</span> {game.studio}
          </p>
          <p>
            <span className="font-black text-[var(--game-text)]">Objective:</span>{" "}
            {game.objective}
          </p>
          <p className="rounded-xl border border-white/10 bg-white/[0.07] px-3 py-2 font-semibold text-[var(--game-text)]">
            {game.boxArt.tagline} Motif: {game.boxArt.motif}.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <button
          type="button"
          className="arcade-button secondary px-3 text-sm font-black"
          onClick={() => {
            playBeep(settings, "click");
            onRestart();
          }}
        >
          <RotateCcw aria-hidden className="h-4 w-4" />
          Restart
        </button>
        <button
          type="button"
          className="arcade-button secondary px-3 text-sm font-black"
          onClick={() => {
            playBeep(settings, "click");
            remixCurrent();
          }}
        >
          <WandSparkles aria-hidden className="h-4 w-4" />
          Remix
        </button>
        <button
          type="button"
          className="arcade-button secondary px-3 text-sm font-black"
          onClick={() => {
            playBeep(settings, "good");
            saveCurrent();
          }}
        >
          <Save aria-hidden className="h-4 w-4" />
          Save
        </button>
      </div>
    </section>
  );
}

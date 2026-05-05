import { Gamepad2, HelpCircle, Sparkles } from "lucide-react";
import { useArcadeStore } from "../store/useArcadeStore";

export function Header() {
  const setHelpOpen = useArcadeStore((state) => state.setHelpOpen);

  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/[0.15] bg-[color-mix(in_srgb,var(--game-primary)_18%,black)] shadow-glow">
          <Gamepad2 aria-hidden className="h-6 w-6 text-[var(--game-accent)]" />
        </div>
        <div className="min-w-0">
          <h1 className="bg-[linear-gradient(100deg,var(--game-text),var(--game-primary),var(--game-accent),var(--game-text))] bg-[length:220%_100%] bg-clip-text text-3xl font-black tracking-normal text-transparent motion-safe:animate-shimmer sm:text-4xl">
            Vibe Arcade
          </h1>
          <p className="text-sm font-medium text-[var(--game-muted)]">
            Type a vibe. Get a weird little game.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.08] px-3 py-2 text-sm font-semibold text-[var(--game-muted)] sm:flex">
          <Sparkles aria-hidden className="h-4 w-4 text-[var(--game-primary)]" />
          offline generator
        </div>
        <button
          type="button"
          className="arcade-button secondary h-11 px-4 text-sm font-bold"
          onClick={() => setHelpOpen(true)}
        >
          <HelpCircle aria-hidden className="h-4 w-4" />
          Help
        </button>
      </div>
    </header>
  );
}

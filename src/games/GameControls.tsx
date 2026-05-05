import { ArrowDownToLine, Play, RotateCcw, WandSparkles } from "lucide-react";
import type { GameOutcome, GeneratedGame } from "../types/game";

interface GameOverlayProps {
  game: GeneratedGame;
  status: GameOutcome;
  resultText?: string;
  onStart: () => void;
  onRestart: () => void;
  onRemix: () => void;
  reducedMotion: boolean;
}

function backToGenerator() {
  const input = document.getElementById("vibe");
  input?.scrollIntoView({ behavior: "smooth", block: "center" });
  if (input instanceof HTMLElement) {
    input.focus();
  }
}

export function GameOverlay({
  game,
  status,
  resultText,
  onStart,
  onRestart,
  onRemix,
  reducedMotion
}: GameOverlayProps) {
  if (status === "playing") {
    return null;
  }

  const won = status === "won";
  const lost = status === "lost";

  return (
    <div className="absolute inset-0 z-30 grid place-items-center bg-slate-950/[0.72] p-4 backdrop-blur-sm">
      {!reducedMotion && won ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {Array.from({ length: 22 }).map((_, index) => (
            <span
              key={index}
              className="absolute h-2 w-2 rounded-sm bg-[var(--game-accent)] motion-safe:animate-floaty"
              style={{
                left: `${(index * 37) % 96}%`,
                top: `${(index * 19) % 86}%`,
                animationDelay: `${index * 80}ms`,
                background:
                  index % 3 === 0
                    ? "var(--game-primary)"
                    : index % 3 === 1
                      ? "var(--game-secondary)"
                      : "var(--game-accent)"
              }}
            />
          ))}
        </div>
      ) : null}
      <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.14] bg-[color-mix(in_srgb,var(--game-panel)_88%,black)] p-5 text-center shadow-panel">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--game-accent)]">
          {won ? "Victory" : lost ? "Cabinet says try again" : "Insert tiny token"}
        </p>
        <h3 className="mt-2 text-2xl font-black">{game.title}</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--game-muted)]">
          {resultText ?? game.objective}
        </p>
        {status === "idle" ? (
          <ul className="mt-4 grid gap-2 text-left text-sm text-[var(--game-muted)]">
            {game.instructions.map((instruction) => (
              <li key={instruction} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                {instruction}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          <button
            type="button"
            className="arcade-button px-4 text-sm font-black"
            onClick={status === "idle" ? onStart : onRestart}
          >
            {status === "idle" ? (
              <>
                <Play aria-hidden className="h-4 w-4" />
                Start
              </>
            ) : (
              <>
                <RotateCcw aria-hidden className="h-4 w-4" />
                Play Again
              </>
            )}
          </button>
          <button
            type="button"
            className="arcade-button secondary px-4 text-sm font-black"
            onClick={onRemix}
          >
            <WandSparkles aria-hidden className="h-4 w-4" />
            Remix
          </button>
          <button
            type="button"
            className="arcade-button secondary px-4 text-sm font-black"
            onClick={backToGenerator}
          >
            <ArrowDownToLine aria-hidden className="h-4 w-4" />
            Generator
          </button>
        </div>
      </div>
    </div>
  );
}

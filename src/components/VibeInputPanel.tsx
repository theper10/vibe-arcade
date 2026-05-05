import { Dices, WandSparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import { playBeep } from "../lib/audio";
import { useArcadeStore } from "../store/useArcadeStore";
import { ExampleVibeChips } from "./ExampleVibeChips";
import { SettingsPanel } from "./SettingsPanel";

export function VibeInputPanel() {
  const vibeInput = useArcadeStore((state) => state.vibeInput);
  const settings = useArcadeStore((state) => state.settings);
  const isGenerating = useArcadeStore((state) => state.isGenerating);
  const setVibeInput = useArcadeStore((state) => state.setVibeInput);
  const setGenerating = useArcadeStore((state) => state.setGenerating);
  const generateGame = useArcadeStore((state) => state.generateGame);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const triggerGenerate = (vibe?: string) => {
    playBeep(settings, "click");
    setGenerating(true);
    timeoutRef.current = window.setTimeout(
      () => generateGame(vibe),
      settings.reducedMotion ? 40 : 360
    );
  };

  return (
    <section className="glass-panel rounded-2xl p-4 sm:p-5" aria-labelledby="generator-title">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 id="generator-title" className="text-lg font-black">
            Generator
          </h2>
          <p className="text-sm text-[var(--game-muted)]">Feed the cabinet a phrase.</p>
        </div>
        <div className="hidden rounded-full border border-white/[0.12] bg-black/20 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[var(--game-accent)] sm:block">
          local rules
        </div>
      </div>

      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          triggerGenerate();
        }}
      >
        <div>
          <label htmlFor="vibe" className="mb-2 block text-sm font-bold">
            Vibe phrase
          </label>
          <textarea
            id="vibe"
            value={vibeInput}
            maxLength={80}
            rows={3}
            placeholder="cozy rainy detective"
            className="min-h-24 w-full resize-none rounded-2xl border border-white/[0.12] bg-black/30 px-4 py-3 text-base font-semibold text-[var(--game-text)] shadow-inner placeholder:text-white/40"
            onChange={(event) => setVibeInput(event.target.value)}
          />
          <div className="mt-1 text-right text-xs font-semibold text-[var(--game-muted)]">
            {vibeInput.length}/80
          </div>
        </div>

        <ExampleVibeChips />

        <SettingsPanel />

        <button
          type="submit"
          disabled={isGenerating}
          className="arcade-button w-full px-5 py-3 text-base font-black disabled:cursor-wait disabled:opacity-75"
        >
          {isGenerating ? (
            <>
              <Dices aria-hidden className="h-5 w-5 motion-safe:animate-spin" />
              Now generating...
            </>
          ) : (
            <>
              <WandSparkles aria-hidden className="h-5 w-5" />
              Generate Game
            </>
          )}
        </button>
      </form>
    </section>
  );
}

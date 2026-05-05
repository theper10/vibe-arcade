import { playBeep } from "../lib/audio";
import { exampleVibes } from "../lib/vibeAnalysis";
import { useArcadeStore } from "../store/useArcadeStore";

export function ExampleVibeChips() {
  const settings = useArcadeStore((state) => state.settings);
  const setVibeInput = useArcadeStore((state) => state.setVibeInput);
  const setGenerating = useArcadeStore((state) => state.setGenerating);
  const generateGame = useArcadeStore((state) => state.generateGame);

  const pickExample = (vibe: string) => {
    playBeep(settings, "click");
    setVibeInput(vibe);
    setGenerating(true);
    window.setTimeout(() => generateGame(vibe), settings.reducedMotion ? 40 : 280);
  };

  return (
    <div className="flex flex-wrap gap-2" aria-label="Example vibes">
      {exampleVibes.slice(0, 4).map((vibe) => (
        <button
          key={vibe}
          type="button"
          className="rounded-full border border-white/[0.12] bg-white/[0.08] px-3 py-2 text-sm font-bold text-[var(--game-muted)] transition hover:border-[var(--game-primary)] hover:text-[var(--game-text)]"
          onClick={() => pickExample(vibe)}
        >
          {vibe}
        </button>
      ))}
    </div>
  );
}

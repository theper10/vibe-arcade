import { Clipboard, TextCursorInput } from "lucide-react";
import { shareSummary } from "../lib/generation";
import type { GeneratedGame } from "../types/game";
import { useArcadeStore } from "../store/useArcadeStore";

interface SharePanelProps {
  game: GeneratedGame | null;
}

export function SharePanel({ game }: SharePanelProps) {
  const addToast = useArcadeStore((state) => state.addToast);
  const shareFallback = useArcadeStore((state) => state.shareFallback);
  const setShareFallback = useArcadeStore((state) => state.setShareFallback);

  const copyShare = async () => {
    if (!game) {
      addToast({ title: "Generate a cartridge before sharing.", tone: "warning" });
      return;
    }
    const summary = shareSummary(game);
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API unavailable.");
      }
      await navigator.clipboard.writeText(summary);
      setShareFallback(null);
      addToast({ title: "Share summary copied.", tone: "success" });
    } catch {
      setShareFallback(summary);
      addToast({ title: "Clipboard blocked. Manual copy is ready.", tone: "warning" });
    }
  };

  return (
    <section className="glass-panel rounded-2xl p-4" aria-labelledby="share-title">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <TextCursorInput aria-hidden className="h-4 w-4 text-[var(--game-primary)]" />
          <h2 id="share-title" className="text-sm font-black uppercase tracking-[0.16em]">
            Share
          </h2>
        </div>
        <button
          type="button"
          className="arcade-button secondary h-10 px-3 text-sm font-black"
          onClick={copyShare}
        >
          <Clipboard aria-hidden className="h-4 w-4" />
          Copy
        </button>
      </div>
      {shareFallback ? (
        <textarea
          className="min-h-32 w-full resize-none rounded-2xl border border-white/[0.12] bg-black/30 p-3 text-sm text-[var(--game-text)]"
          value={shareFallback}
          readOnly
          aria-label="Manual share summary"
        />
      ) : (
        <p className="text-sm text-[var(--game-muted)]">
          Copy a tiny cartridge summary with objective and patch notes.
        </p>
      )}
    </section>
  );
}

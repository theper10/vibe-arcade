import { Archive, Play, Trash2 } from "lucide-react";
import { templateLabels } from "../lib/copy";
import { useArcadeStore } from "../store/useArcadeStore";

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "unknown date";
  }
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export function SavedGallery() {
  const savedGames = useArcadeStore((state) => state.savedGames);
  const loadSavedGame = useArcadeStore((state) => state.loadSavedGame);
  const deleteSavedGame = useArcadeStore((state) => state.deleteSavedGame);

  return (
    <section className="glass-panel rounded-2xl p-4" aria-labelledby="gallery-title">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Archive aria-hidden className="h-4 w-4 text-[var(--game-secondary)]" />
          <h2 id="gallery-title" className="text-sm font-black uppercase tracking-[0.16em]">
            Saved Gallery
          </h2>
        </div>
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-black text-[var(--game-muted)]">
          {savedGames.length}
        </span>
      </div>

      {savedGames.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.14] bg-black/20 p-4 text-sm text-[var(--game-muted)]">
          Saved cartridges will line up here like tiny arcade bragging rights.
        </div>
      ) : (
        <div className="grid max-h-[30rem] gap-3 overflow-y-auto pr-1">
          {savedGames.map((game) => (
            <article
              key={game.id}
              className="rounded-2xl border border-white/10 bg-black/[0.24] p-3 transition hover:border-[color-mix(in_srgb,var(--game-primary)_50%,white)]"
            >
              <div className="flex gap-3">
                <div
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/[0.15] text-lg font-black text-slate-950"
                  style={{
                    background: `linear-gradient(145deg, ${game.palette.primary}, ${game.palette.secondary})`
                  }}
                  aria-hidden
                >
                  {game.title.slice(0, 1)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-black">{game.title}</h3>
                  <p className="truncate text-xs text-[var(--game-muted)]">{game.vibe}</p>
                  <p className="mt-1 text-xs font-semibold text-[var(--game-accent)]">
                    {templateLabels[game.template]} · {formatDate(game.createdAt)}
                  </p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="arcade-button secondary h-10 px-3 text-sm font-black"
                  onClick={() => loadSavedGame(game.id)}
                >
                  <Play aria-hidden className="h-4 w-4" />
                  Load
                </button>
                <button
                  type="button"
                  className="arcade-button secondary h-10 px-3 text-sm font-black"
                  onClick={() => deleteSavedGame(game.id)}
                >
                  <Trash2 aria-hidden className="h-4 w-4 text-[var(--game-danger)]" />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

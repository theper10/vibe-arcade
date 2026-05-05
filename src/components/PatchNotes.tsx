import { ScrollText } from "lucide-react";
import type { GeneratedGame } from "../types/game";

interface PatchNotesProps {
  game: GeneratedGame | null;
}

export function PatchNotes({ game }: PatchNotesProps) {
  return (
    <section className="glass-panel rounded-2xl p-4" aria-labelledby="patch-notes-title">
      <div className="mb-3 flex items-center gap-2">
        <ScrollText aria-hidden className="h-4 w-4 text-[var(--game-accent)]" />
        <h2 id="patch-notes-title" className="text-sm font-black uppercase tracking-[0.16em]">
          Patch Notes
        </h2>
      </div>
      {game ? (
        <ul className="space-y-2 text-sm text-[var(--game-muted)]">
          {game.patchNotes.map((note, index) => (
            <li key={`${note}-${index}`} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
              {note}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[var(--game-muted)]">
          The cabinet is warming up a patch nobody asked for.
        </p>
      )}
    </section>
  );
}

import { Gamepad2 } from "lucide-react";
import type { GeneratedGame, VibeSettings } from "../types/game";
import { AvoidEnemyGame } from "./AvoidEnemyGame";
import { ClickCollectGame } from "./ClickCollectGame";
import { MemoryMatchGame } from "./MemoryMatchGame";
import { TinyQuestGame } from "./TinyQuestGame";

interface GameStageProps {
  game: GeneratedGame | null;
  settings: VibeSettings;
}

export function GameStage({ game, settings }: GameStageProps) {
  return (
    <section
      className="stage-shell scanline-overlay aspect-[16/11] w-full rounded-2xl"
      aria-label="Playable game stage"
    >
      {!game ? (
        <div className="grid h-full place-items-center p-6 text-center">
          <div>
            <Gamepad2 aria-hidden className="mx-auto mb-4 h-12 w-12 text-[var(--game-primary)]" />
            <h2 className="text-2xl font-black">The stage is waiting.</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-[var(--game-muted)]">
              Generate a cartridge and the playable microgame will appear here immediately.
            </p>
          </div>
        </div>
      ) : game.template === "click_collect" ? (
        <ClickCollectGame game={game} settings={settings} />
      ) : game.template === "avoid_enemy" ? (
        <AvoidEnemyGame game={game} settings={settings} />
      ) : game.template === "memory_match" ? (
        <MemoryMatchGame game={game} settings={settings} />
      ) : (
        <TinyQuestGame game={game} settings={settings} />
      )}
    </section>
  );
}


import { useCallback, useRef, useState } from "react";
import { HeartHandshake, Search, Shield, Sparkles, Swords, Tent } from "lucide-react";
import { playBeep } from "../lib/audio";
import { randomInt, seededRandom } from "../lib/rng";
import { useArcadeStore } from "../store/useArcadeStore";
import type { GameOutcome, GeneratedGame, VibeSettings } from "../types/game";
import { GameOverlay } from "./GameControls";
import { GameHUD, hudIcons } from "./GameHUD";

interface TinyQuestGameProps {
  game: GeneratedGame;
  settings: VibeSettings;
}

type QuestAction = "search" | "charm" | "sneak" | "duel" | "rest";

interface QuestState {
  status: GameOutcome;
  health: number;
  progress: number;
  turn: number;
  log: string[];
}

const actionMeta: Array<{
  id: QuestAction;
  label: string;
  icon: typeof Search;
}> = [
  { id: "search", label: "Search", icon: Search },
  { id: "charm", label: "Charm", icon: HeartHandshake },
  { id: "sneak", label: "Sneak", icon: Shield },
  { id: "duel", label: "Duel", icon: Swords },
  { id: "rest", label: "Rest", icon: Tent }
];

export function TinyQuestGame({ game, settings }: TinyQuestGameProps) {
  const remixCurrent = useArcadeStore((state) => state.remixCurrent);
  const rngRef = useRef(seededRandom(game.seed + 404));
  const [quest, setQuest] = useState<QuestState>({
    status: "idle",
    health: game.tuning.maxHealth,
    progress: 0,
    turn: 0,
    log: []
  });

  const reset = useCallback(() => {
    rngRef.current = seededRandom(game.seed + 404);
    setQuest({
      status: "playing",
      health: game.tuning.maxHealth,
      progress: 0,
      turn: 0,
      log: [`${game.playerName} enters ${game.flavor.place} with one brave pocket.`]
    });
  }, [game]);

  const act = (action: QuestAction) => {
    if (quest.status !== "playing") {
      return;
    }

    const rng = rngRef.current;
    const roll = rng();
    let progressGain = 0;
    let healthDelta = 0;
    let message = "";

    if (action === "search") {
      progressGain = randomInt(rng, 2, 4);
      healthDelta = roll < 0.24 ? -1 : 0;
      message = healthDelta < 0
        ? `Search found ${progressGain} ${game.progressName}, plus ${game.hazardName} under the mat.`
        : `Search uncovered ${progressGain} ${game.progressName} near the ${game.collectibleName}.`;
    }

    if (action === "charm") {
      progressGain = roll > 0.2 ? randomInt(rng, 1, 3) : 0;
      healthDelta = roll > 0.68 ? 1 : 0;
      message = progressGain > 0
        ? `${game.enemyName} accepts a compliment and drops ${progressGain} ${game.progressName}.`
        : `${game.enemyName} blinks twice. Nothing explodes, which counts.`;
    }

    if (action === "sneak") {
      if (roll > 0.7) {
        progressGain = randomInt(rng, 4, 5);
        message = `Sneak found a premium stash of ${game.collectiblePlural}.`;
      } else if (roll > 0.34) {
        progressGain = 2;
        message = `Sneak tiptoed past ${game.hazardName} and pocketed useful nonsense.`;
      } else {
        healthDelta = -2;
        message = `Sneak stepped on ${game.flavor.soundLabel}. It was louder than planned.`;
      }
    }

    if (action === "duel") {
      if (roll > 0.42) {
        progressGain = randomInt(rng, 3, 5);
        healthDelta = -1;
        message = `Duel bonked ${game.enemyName} for ${progressGain} ${game.progressName}. Very official.`;
      } else {
        healthDelta = -3;
        message = `Duel challenged ${game.enemyName}; ${game.enemyName} brought paperwork.`;
      }
    }

    if (action === "rest") {
      healthDelta = randomInt(rng, 2, 3);
      progressGain = roll > 0.78 ? 1 : 0;
      message = progressGain > 0
        ? `Rest restored resolve and somehow produced one bonus ${game.progressName}.`
        : `Rest in ${game.flavor.place} restored resolve under suspicious lighting.`;
    }

    const nextTurn = quest.turn + 1;
    const nextHealth = Math.min(game.tuning.maxHealth, Math.max(0, quest.health + healthDelta));
    const nextProgress = Math.min(game.tuning.targetScore, quest.progress + progressGain);
    const maxTurns = game.tuning.maxTurns ?? 15;
    let nextStatus: GameOutcome = "playing";

    if (nextProgress >= game.tuning.targetScore) {
      nextStatus = "won";
      playBeep(settings, "win");
    } else if (nextHealth <= 0 || nextTurn >= maxTurns) {
      nextStatus = "lost";
      playBeep(settings, "bad");
    } else {
      playBeep(settings, progressGain > 0 ? "good" : "click");
    }

    setQuest({
      status: nextStatus,
      health: nextHealth,
      progress: nextProgress,
      turn: nextTurn,
      log: [message, ...quest.log].slice(0, 7)
    });
  };

  return (
    <div className="relative h-full">
      <div className="absolute inset-x-3 top-3 z-10">
        <GameHUD
          metrics={[
            { label: game.progressName, value: `${quest.progress}/${game.tuning.targetScore}`, icon: hudIcons.score },
            { label: "Resolve", value: `${quest.health}/${game.tuning.maxHealth}`, icon: hudIcons.health, tone: "danger" },
            { label: "Turns", value: `${quest.turn}/${game.tuning.maxTurns ?? 15}`, icon: hudIcons.moves, tone: "accent" },
            { label: "Place", value: game.flavor.place, icon: hudIcons.spark }
          ]}
        />
      </div>

      <div className="absolute inset-0 grid content-end gap-3 overflow-hidden rounded-2xl px-3 pb-4 pt-28 sm:px-5">
        <div className="min-h-40 rounded-2xl border border-white/10 bg-black/30 p-3">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--game-accent)]">
            Quest Log
          </p>
          <div className="grid max-h-44 gap-2 overflow-y-auto pr-1 text-sm text-[var(--game-muted)]">
            {quest.log.length === 0 ? (
              <p>Press Start and the tiny quest will begin behaving dramatically.</p>
            ) : (
              quest.log.map((entry, index) => (
                <p key={`${entry}-${index}`} className="rounded-xl bg-white/[0.07] px-3 py-2">
                  {entry}
                </p>
              ))
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {actionMeta.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                type="button"
                disabled={quest.status !== "playing"}
                className="arcade-button secondary px-3 text-sm font-black disabled:cursor-not-allowed disabled:opacity-45"
                onClick={() => act(action.id)}
              >
                <Icon aria-hidden className="h-4 w-4" />
                {action.label}
              </button>
            );
          })}
        </div>
      </div>

      <GameOverlay
        game={game}
        status={quest.status}
        resultText={quest.status === "won" ? game.winText : quest.status === "lost" ? game.loseText : undefined}
        onStart={reset}
        onRestart={reset}
        onRemix={remixCurrent}
        reducedMotion={settings.reducedMotion}
      />
    </div>
  );
}

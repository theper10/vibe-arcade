import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { playBeep } from "../lib/audio";
import { shuffle, seededRandom } from "../lib/rng";
import { useArcadeStore } from "../store/useArcadeStore";
import type { GameOutcome, GeneratedGame, VibeSettings } from "../types/game";
import { useInterval } from "../hooks/useInterval";
import { GameOverlay } from "./GameControls";
import { GameHUD, hudIcons } from "./GameHUD";
import { cn } from "../lib/cn";

interface MemoryMatchGameProps {
  game: GeneratedGame;
  settings: VibeSettings;
}

interface MemoryCard {
  id: string;
  pairId: string;
  label: string;
}

const fallbackLabels = [
  "moon",
  "token",
  "spark",
  "case",
  "lantern",
  "crown",
  "button",
  "map",
  "potion",
  "signal",
  "sprout",
  "pearl"
];

function makeDeck(game: GeneratedGame): MemoryCard[] {
  const rng = seededRandom(game.seed + 303);
  const pairCount = game.tuning.pairCount ?? 8;
  const themed = [
    game.collectibleName,
    game.collectiblePlural,
    game.hazardName,
    game.enemyName,
    game.progressName,
    game.flavor.place,
    game.flavor.motif,
    game.flavor.soundLabel,
    game.playerName,
    game.boxArt.tagline.split(" ")[0],
    ...fallbackLabels
  ];
  const uniqueLabels = Array.from(
    new Set(themed.map((label) => label.toLowerCase()).filter((label) => label.length > 1))
  ).slice(0, Math.max(pairCount, 6));
  const pairs = uniqueLabels.slice(0, pairCount).flatMap((label, index) => [
    { id: `${index}-a`, pairId: `${index}`, label },
    { id: `${index}-b`, pairId: `${index}`, label }
  ]);
  return shuffle(pairs, rng);
}

export function MemoryMatchGame({ game, settings }: MemoryMatchGameProps) {
  const remixCurrent = useArcadeStore((state) => state.remixCurrent);
  const timeoutRef = useRef<number | null>(null);
  const initialDeck = useMemo(() => makeDeck(game), [game]);
  const [status, setStatus] = useState<GameOutcome>("idle");
  const [deck, setDeck] = useState(initialDeck);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<string>>(() => new Set());
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(game.tuning.durationSeconds);
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const reset = useCallback(() => {
    setDeck(makeDeck(game));
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setTimeLeft(game.tuning.durationSeconds);
    setResolving(false);
    setStatus("playing");
  }, [game]);

  useInterval(
    () => setTimeLeft((current) => Math.max(0, current - 1)),
    status === "playing" ? 1000 : null
  );

  useEffect(() => {
    if (status !== "playing") {
      return;
    }
    if (matched.size >= (game.tuning.pairCount ?? 8)) {
      setStatus("won");
      playBeep(settings, "win");
    } else if (timeLeft <= 0) {
      setStatus("lost");
      playBeep(settings, "bad");
    }
  }, [game.tuning.pairCount, matched.size, settings, status, timeLeft]);

  const clickCard = (card: MemoryCard) => {
    if (
      status !== "playing" ||
      resolving ||
      matched.has(card.pairId) ||
      flipped.includes(card.id)
    ) {
      return;
    }

    const nextFlipped = [...flipped, card.id];
    setFlipped(nextFlipped);
    playBeep(settings, "click");

    if (nextFlipped.length !== 2) {
      return;
    }

    setResolving(true);
    const [firstId, secondId] = nextFlipped;
    const first = deck.find((candidate) => candidate.id === firstId);
    const second = deck.find((candidate) => candidate.id === secondId);
    const nextMoves = moves + 1;
    setMoves(nextMoves);

    timeoutRef.current = window.setTimeout(() => {
      if (first && second && first.pairId === second.pairId) {
        setMatched((current) => new Set(current).add(first.pairId));
        playBeep(settings, "good");
      } else {
        playBeep(settings, "bad");
      }
      setFlipped([]);
      setResolving(false);
      if (nextMoves >= (game.tuning.moveLimit ?? 24) && matched.size + (first?.pairId === second?.pairId ? 1 : 0) < (game.tuning.pairCount ?? 8)) {
        setStatus("lost");
      }
    }, first && second && first.pairId === second.pairId ? 260 : 720);
  };

  return (
    <div className="relative h-full">
      <div className="absolute inset-x-3 top-3 z-10">
        <GameHUD
          metrics={[
            { label: "Pairs", value: `${matched.size}/${game.tuning.pairCount ?? 8}`, icon: hudIcons.score },
            { label: "Moves", value: `${moves}/${game.tuning.moveLimit ?? 24}`, icon: hudIcons.moves, tone: "accent" },
            { label: "Time", value: `${timeLeft}s`, icon: hudIcons.time },
            { label: "Theme", value: game.collectiblePlural, icon: hudIcons.spark }
          ]}
        />
      </div>

      <div className="absolute inset-0 grid place-items-center overflow-hidden rounded-2xl px-3 pb-4 pt-28">
        <div
          className={cn(
            "grid w-full max-w-3xl gap-2",
            (game.tuning.pairCount ?? 8) > 8 ? "grid-cols-5" : "grid-cols-4"
          )}
        >
          {deck.map((card) => {
            const visible = flipped.includes(card.id) || matched.has(card.pairId);
            return (
              <button
                key={card.id}
                type="button"
                className={cn(
                  "group aspect-[4/3] min-h-14 rounded-2xl border p-1 text-center transition focus:z-10",
                  visible
                    ? "border-[var(--game-primary)] bg-[color-mix(in_srgb,var(--game-primary)_18%,black)]"
                    : "border-white/[0.12] bg-black/[0.35] hover:border-[var(--game-accent)] hover:bg-white/10"
                )}
                onClick={() => clickCard(card)}
                aria-label={visible ? card.label : "Hidden memory card"}
              >
                <span
                  className={cn(
                    "grid h-full w-full place-items-center rounded-xl px-1 text-xs font-black transition sm:text-sm",
                    visible ? "text-[var(--game-text)]" : "text-[var(--game-accent)]"
                  )}
                >
                  {visible ? card.label : "?"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <GameOverlay
        game={game}
        status={status}
        resultText={status === "won" ? game.winText : status === "lost" ? game.loseText : undefined}
        onStart={reset}
        onRestart={reset}
        onRemix={remixCurrent}
        reducedMotion={settings.reducedMotion}
      />
    </div>
  );
}

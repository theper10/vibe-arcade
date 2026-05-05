import { useCallback, useEffect, useRef, useState } from "react";
import { playBeep } from "../lib/audio";
import { randomInt, seededRandom } from "../lib/rng";
import { useArcadeStore } from "../store/useArcadeStore";
import type { GameOutcome, GeneratedGame, VibeSettings } from "../types/game";
import { GameOverlay } from "./GameControls";
import { GameHUD, hudIcons } from "./GameHUD";
import { useInterval } from "../hooks/useInterval";

interface ClickCollectGameProps {
  game: GeneratedGame;
  settings: VibeSettings;
}

interface StageItem {
  id: string;
  kind: "good" | "hazard";
  x: number;
  y: number;
  ttl: number;
}

interface FloatText {
  id: string;
  x: number;
  y: number;
  text: string;
  good: boolean;
}

export function ClickCollectGame({ game, settings }: ClickCollectGameProps) {
  const remixCurrent = useArcadeStore((state) => state.remixCurrent);
  const rngRef = useRef(seededRandom(game.seed + 101));
  const [status, setStatus] = useState<GameOutcome>("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(game.tuning.durationSeconds);
  const [items, setItems] = useState<StageItem[]>([]);
  const [floats, setFloats] = useState<FloatText[]>([]);

  const reset = useCallback(() => {
    rngRef.current = seededRandom(game.seed + 101);
    setScore(0);
    setTimeLeft(game.tuning.durationSeconds);
    setItems([]);
    setFloats([]);
    setStatus("playing");
  }, [game.seed, game.tuning.durationSeconds]);

  const spawnItem = useCallback(() => {
    const rng = rngRef.current;
    const hazardChance =
      settings.difficulty === "chill" ? 0.17 : settings.difficulty === "normal" ? 0.25 : 0.34;
    const kind = rng() < hazardChance ? "hazard" : "good";
    const ttl = kind === "good" ? randomInt(rng, 1700, 2600) : randomInt(rng, 1400, 2200);
    setItems((current) => [
      ...current.slice(-13),
      {
        id: `${Date.now()}-${Math.round(rng() * 100000)}`,
        kind,
        x: randomInt(rng, 8, 88),
        y: randomInt(rng, 14, 82),
        ttl
      }
    ]);
  }, [settings.difficulty]);

  useInterval(
    () => {
      setTimeLeft((current) => Math.max(0, Number((current - 0.1).toFixed(1))));
      setItems((current) => current.map((item) => ({ ...item, ttl: item.ttl - 100 })).filter((item) => item.ttl > 0));
    },
    status === "playing" ? 100 : null
  );

  useInterval(spawnItem, status === "playing" ? game.tuning.spawnRate ?? 900 : null);

  useEffect(() => {
    if (status !== "playing") {
      return;
    }
    if (score >= game.tuning.targetScore) {
      setStatus("won");
      playBeep(settings, "win");
    } else if (timeLeft <= 0) {
      setStatus("lost");
      playBeep(settings, "bad");
    }
  }, [game.tuning.targetScore, score, settings, status, timeLeft]);

  const clickItem = (item: StageItem) => {
    setItems((current) => current.filter((candidate) => candidate.id !== item.id));
    const good = item.kind === "good";
    setFloats((current) => [
      ...current,
      {
        id: `${item.id}-float`,
        x: item.x,
        y: item.y,
        text: good ? "+1" : "-oops",
        good
      }
    ]);
    window.setTimeout(() => {
      setFloats((current) => current.filter((float) => float.id !== `${item.id}-float`));
    }, 750);

    if (good) {
      playBeep(settings, "good");
      setScore((current) => current + 1);
    } else {
      playBeep(settings, "bad");
      setScore((current) => Math.max(0, current - 1));
      setTimeLeft((current) => Math.max(0, Number((current - 2.5).toFixed(1))));
    }
  };

  return (
    <div className="relative h-full">
      <div className="absolute inset-x-3 top-3 z-10">
        <GameHUD
          metrics={[
            { label: game.collectiblePlural, value: `${score}/${game.tuning.targetScore}`, icon: hudIcons.score },
            { label: "Time", value: `${Math.ceil(timeLeft)}s`, icon: hudIcons.time, tone: "accent" },
            { label: "Hazard", value: game.hazardName, icon: hudIcons.spark, tone: "danger" },
            { label: "Sound", value: game.flavor.soundLabel, icon: hudIcons.spark }
          ]}
        />
      </div>
      <div className="absolute inset-0 overflow-hidden rounded-2xl pt-28">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={
              item.kind === "good"
                ? "absolute grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white/40 bg-[var(--game-primary)] text-sm font-black text-slate-950 shadow-glow transition hover:scale-110 motion-safe:animate-pop"
                : "absolute grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white/[0.35] bg-[var(--game-danger)] text-sm font-black text-white shadow-lg transition hover:scale-110 motion-safe:animate-pop"
            }
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            onClick={() => clickItem(item)}
            aria-label={
              item.kind === "good"
                ? `Collect ${game.collectibleName}`
                : `Avoid ${game.hazardName}`
            }
          >
            {item.kind === "good" ? "+1" : "!"}
          </button>
        ))}
        {floats.map((float) => (
          <span
            key={float.id}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-lg font-black motion-safe:animate-floaty"
            style={{
              left: `${float.x}%`,
              top: `${float.y}%`,
              color: float.good ? "var(--game-accent)" : "var(--game-danger)"
            }}
          >
            {float.text}
          </span>
        ))}
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

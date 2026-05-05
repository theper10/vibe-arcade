import { useCallback, useEffect, useRef, useState } from "react";
import { playBeep } from "../lib/audio";
import { randomInt, seededRandom } from "../lib/rng";
import { useArcadeStore } from "../store/useArcadeStore";
import type { GameOutcome, GeneratedGame, VibeSettings } from "../types/game";
import { useKeyboard } from "../hooks/useKeyboard";
import { GameOverlay } from "./GameControls";
import { GameHUD, hudIcons } from "./GameHUD";

interface AvoidEnemyGameProps {
  game: GeneratedGame;
  settings: VibeSettings;
}

interface Vector {
  x: number;
  y: number;
}

interface Enemy extends Vector {
  id: string;
  vx: number;
  vy: number;
}

interface AvoidWorld {
  player: Vector;
  collectible: Vector;
  enemies: Enemy[];
  score: number;
  health: number;
  timeLeft: number;
  invulnerable: number;
}

function distance(a: Vector, b: Vector): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clampPosition(value: number): number {
  return Math.max(5, Math.min(95, value));
}

export function AvoidEnemyGame({ game, settings }: AvoidEnemyGameProps) {
  const remixCurrent = useArcadeStore((state) => state.remixCurrent);
  const pressed = useKeyboard(true);
  const pressedRef = useRef(pressed);
  const touchRef = useRef<Vector>({ x: 0, y: 0 });
  const rngRef = useRef(seededRandom(game.seed + 202));
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const [status, setStatus] = useState<GameOutcome>("idle");
  const [world, setWorld] = useState<AvoidWorld>(() => makeWorld(game));

  useEffect(() => {
    pressedRef.current = pressed;
  }, [pressed]);

  function makeWorld(sourceGame: GeneratedGame): AvoidWorld {
    const rng = seededRandom(sourceGame.seed + 202);
    rngRef.current = rng;
    const enemies = Array.from({ length: sourceGame.tuning.enemyCount ?? 3 }).map((_, index) => ({
      id: `enemy-${index}`,
      x: randomInt(rng, 12, 88),
      y: randomInt(rng, 18, 82),
      vx: rng() > 0.5 ? 1 : -1,
      vy: rng() > 0.5 ? 1 : -1
    }));
    return {
      player: { x: 50, y: 50 },
      collectible: { x: randomInt(rng, 12, 88), y: randomInt(rng, 18, 82) },
      enemies,
      score: 0,
      health: sourceGame.tuning.maxHealth,
      timeLeft: sourceGame.tuning.durationSeconds,
      invulnerable: 0
    };
  }

  const reset = useCallback(() => {
    setWorld(makeWorld(game));
    setStatus("playing");
    lastTimeRef.current = null;
  }, [game]);

  useEffect(() => {
    if (status !== "playing") {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      return undefined;
    }

    const tick = (time: number) => {
      const last = lastTimeRef.current ?? time;
      const dt = Math.min(0.032, (time - last) / 1000);
      lastTimeRef.current = time;

      setWorld((current) => {
        const keys = pressedRef.current;
        let dx = touchRef.current.x;
        let dy = touchRef.current.y;
        if (keys.has("arrowleft") || keys.has("a")) dx -= 1;
        if (keys.has("arrowright") || keys.has("d")) dx += 1;
        if (keys.has("arrowup") || keys.has("w")) dy -= 1;
        if (keys.has("arrowdown") || keys.has("s")) dy += 1;
        const length = Math.hypot(dx, dy) || 1;
        const speed = 40;
        const player = {
          x: clampPosition(current.player.x + (dx / length) * speed * dt),
          y: clampPosition(current.player.y + (dy / length) * speed * dt)
        };
        const enemySpeed = (game.tuning.enemySpeed ?? 0.7) * 28;
        const enemies = current.enemies.map((enemy) => {
          let vx = enemy.vx;
          let vy = enemy.vy;
          const chaseX = player.x - enemy.x;
          const chaseY = player.y - enemy.y;
          const chaseLength = Math.hypot(chaseX, chaseY) || 1;
          vx = vx * 0.985 + (chaseX / chaseLength) * 0.015;
          vy = vy * 0.985 + (chaseY / chaseLength) * 0.015;
          let x = enemy.x + vx * enemySpeed * dt;
          let y = enemy.y + vy * enemySpeed * dt;
          if (x < 5 || x > 95) vx *= -1;
          if (y < 12 || y > 90) vy *= -1;
          x = clampPosition(x);
          y = Math.max(12, Math.min(90, y));
          return { ...enemy, x, y, vx, vy };
        });

        let score = current.score;
        let health = current.health;
        let collectible = current.collectible;
        let invulnerable = Math.max(0, current.invulnerable - dt);
        let nextStatus: GameOutcome | null = null;

        if (distance(player, collectible) < 7.5) {
          score += 1;
          playBeep(settings, "good");
          collectible = {
            x: randomInt(rngRef.current, 10, 90),
            y: randomInt(rngRef.current, 16, 86)
          };
        }

        if (invulnerable <= 0 && enemies.some((enemy) => distance(player, enemy) < 7.2)) {
          health -= 1;
          invulnerable = 1.2;
          playBeep(settings, "bad");
        }

        const timeLeft = Math.max(0, current.timeLeft - dt);
        if (score >= game.tuning.targetScore) {
          nextStatus = "won";
        } else if (health <= 0 || timeLeft <= 0) {
          nextStatus = "lost";
        }

        if (nextStatus) {
          window.setTimeout(() => {
            setStatus(nextStatus);
            playBeep(settings, nextStatus === "won" ? "win" : "bad");
          }, 0);
        }

        return {
          player,
          collectible,
          enemies,
          score,
          health,
          timeLeft,
          invulnerable
        };
      });

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [game.tuning.enemySpeed, game.tuning.targetScore, settings, status]);

  const touchButton = (label: string, vector: Vector) => (
    <button
      type="button"
      className="arcade-button secondary h-12 w-12 rounded-2xl p-0 text-lg font-black"
      onPointerDown={() => {
        touchRef.current = vector;
      }}
      onPointerUp={() => {
        touchRef.current = { x: 0, y: 0 };
      }}
      onPointerCancel={() => {
        touchRef.current = { x: 0, y: 0 };
      }}
      aria-label={label}
    >
      {label}
    </button>
  );

  return (
    <div className="relative h-full">
      <div className="absolute inset-x-3 top-3 z-10">
        <GameHUD
          metrics={[
            { label: game.collectiblePlural, value: `${world.score}/${game.tuning.targetScore}`, icon: hudIcons.score },
            { label: "Time", value: `${Math.ceil(world.timeLeft)}s`, icon: hudIcons.time, tone: "accent" },
            { label: "Health", value: world.health, icon: hudIcons.health, tone: "danger" },
            { label: "Enemy", value: game.enemyName, icon: hudIcons.spark }
          ]}
        />
      </div>

      <div className="absolute inset-0 overflow-hidden rounded-2xl pt-28">
        <div
          className="absolute h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/60 bg-[var(--game-accent)] shadow-glow transition-colors"
          style={{
            left: `${world.player.x}%`,
            top: `${world.player.y}%`,
            opacity: world.invulnerable > 0 ? 0.55 : 1
          }}
          aria-label={game.playerName}
        />
        <div
          className="absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 border-white/50 bg-[var(--game-primary)] shadow-glow motion-safe:animate-pop"
          style={{ left: `${world.collectible.x}%`, top: `${world.collectible.y}%` }}
          aria-label={game.collectibleName}
        />
        {world.enemies.map((enemy) => (
          <div
            key={enemy.id}
            className="absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-[1rem] border-2 border-white/[0.35] bg-[var(--game-danger)] shadow-lg"
            style={{ left: `${enemy.x}%`, top: `${enemy.y}%` }}
            aria-label={game.enemyName}
          />
        ))}
      </div>

      <div className="absolute bottom-3 left-1/2 z-20 grid -translate-x-1/2 grid-cols-3 gap-2 sm:hidden">
        <span />
        {touchButton("Up", { x: 0, y: -1 })}
        <span />
        {touchButton("Left", { x: -1, y: 0 })}
        {touchButton("Down", { x: 0, y: 1 })}
        {touchButton("Right", { x: 1, y: 0 })}
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

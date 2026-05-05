import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { AppShell } from "./components/AppShell";
import { Footer } from "./components/Footer";
import { GeneratedGameCard } from "./components/GeneratedGameCard";
import { Header } from "./components/Header";
import { Modal } from "./components/Modal";
import { PatchNotes } from "./components/PatchNotes";
import { SavedGallery } from "./components/SavedGallery";
import { SharePanel } from "./components/SharePanel";
import { Toasts } from "./components/Toasts";
import { VibeInputPanel } from "./components/VibeInputPanel";
import { GameStage } from "./games/GameStage";
import { useArcadeStore } from "./store/useArcadeStore";

const defaultTheme = {
  background: "#090a1a",
  panel: "#171830",
  primary: "#6ee7f9",
  secondary: "#f472b6",
  accent: "#facc15",
  danger: "#fb7185",
  text: "#f8fafc",
  muted: "#a9b4c8"
};

function App() {
  const currentGame = useArcadeStore((state) => state.currentGame);
  const settings = useArcadeStore((state) => state.settings);
  const isHelpOpen = useArcadeStore((state) => state.isHelpOpen);
  const setHelpOpen = useArcadeStore((state) => state.setHelpOpen);
  const storagePersistent = useArcadeStore((state) => state.storagePersistent);
  const addToast = useArcadeStore((state) => state.addToast);
  const warnedAboutStorage = useRef(false);
  const [stageRestartKey, setStageRestartKey] = useState(0);

  useEffect(() => {
    if (!storagePersistent && !warnedAboutStorage.current) {
      warnedAboutStorage.current = true;
      addToast({ title: "localStorage is blocked; saves will last for this session.", tone: "warning" });
    }
  }, [addToast, storagePersistent]);

  const theme = currentGame?.palette ?? defaultTheme;
  const style = useMemo(
    () =>
      ({
        "--game-bg": theme.background,
        "--game-panel": theme.panel,
        "--game-primary": theme.primary,
        "--game-secondary": theme.secondary,
        "--game-accent": theme.accent,
        "--game-danger": theme.danger,
        "--game-text": theme.text,
        "--game-muted": theme.muted
      }) as CSSProperties,
    [theme]
  );

  return (
    <AppShell reducedMotion={settings.reducedMotion} style={style}>
      <Header />
      <main className="grid gap-5 lg:grid-cols-[minmax(18rem,23rem)_minmax(0,1fr)_minmax(18rem,24rem)]">
        <div className="space-y-5 lg:sticky lg:top-5 lg:self-start">
          <VibeInputPanel />
          <SavedGallery />
        </div>

        <div className="space-y-4">
          <GameStage
            key={`${currentGame?.id ?? "empty"}-${stageRestartKey}`}
            game={currentGame}
            settings={settings}
          />
          <div className="grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-[var(--game-muted)] sm:grid-cols-3">
            <p>
              <span className="font-black text-[var(--game-text)]">Desktop:</span> click, WASD,
              arrows.
            </p>
            <p>
              <span className="font-black text-[var(--game-text)]">Mobile:</span> tap cards,
              targets, and touch controls.
            </p>
            <p>
              <span className="font-black text-[var(--game-text)]">Offline:</span> deterministic
              rules, no backend.
            </p>
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-5 lg:self-start">
          <GeneratedGameCard
            game={currentGame}
            onRestart={() => setStageRestartKey((current) => current + 1)}
          />
          <PatchNotes game={currentGame} />
          <SharePanel game={currentGame} />
        </aside>
      </main>

      <Footer />
      <Modal title="How the Cabinet Thinks" open={isHelpOpen} onClose={() => setHelpOpen(false)}>
        <div className="space-y-4 text-sm leading-6 text-[var(--game-muted)]">
          <p>
            Vibe Arcade hashes your phrase, reads theme keywords, and uses a seeded random generator
            to make the same cartridge from the same phrase, settings, and remix number.
          </p>
          <p>
            Chaos changes copy weirdness and visual density. Difficulty changes timers, targets,
            hazards, health, moves, and enemy speed. Reduced motion trims nonessential animation.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
              <h3 className="font-black text-[var(--game-text)]">Controls</h3>
              <p>Click or tap collectibles, flip memory cards, choose quest actions, or move with WASD/arrows.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
              <h3 className="font-black text-[var(--game-text)]">Saves</h3>
              <p>Saved cartridges live in localStorage when your browser allows it.</p>
            </div>
          </div>
        </div>
      </Modal>
      <Toasts />
    </AppShell>
  );
}

export default App;


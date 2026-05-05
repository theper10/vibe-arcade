import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import type { GeneratedGame, ToastMessage, VibeSettings } from "../types/game";
import { createGeneratedGame } from "../lib/generation";
import { clamp } from "../lib/rng";
import { storageAvailable } from "../lib/storage";
import { exampleVibes } from "../lib/vibeAnalysis";

interface ArcadeState {
  vibeInput: string;
  currentGame: GeneratedGame | null;
  currentRemixIndex: number;
  settings: VibeSettings;
  savedGames: GeneratedGame[];
  toasts: ToastMessage[];
  isHelpOpen: boolean;
  isGenerating: boolean;
  storagePersistent: boolean;
  shareFallback: string | null;
  setVibeInput: (input: string) => void;
  updateSettings: (settings: Partial<VibeSettings>) => void;
  generateGame: (vibeOverride?: string) => void;
  remixCurrent: () => void;
  saveCurrent: () => void;
  loadSavedGame: (id: string) => void;
  deleteSavedGame: (id: string) => void;
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  dismissToast: (id: string) => void;
  setHelpOpen: (open: boolean) => void;
  setGenerating: (value: boolean) => void;
  setShareFallback: (value: string | null) => void;
}

const defaultSettings: VibeSettings = {
  chaos: 42,
  difficulty: "normal",
  reducedMotion: false,
  soundEnabled: false
};

const persistent = storageAvailable();
const memoryStorage = new Map<string, string>();

const safeStorage: StateStorage = {
  getItem: (name) => {
    if (persistent) {
      return window.localStorage.getItem(name);
    }
    return memoryStorage.get(name) ?? null;
  },
  setItem: (name, value) => {
    if (persistent) {
      window.localStorage.setItem(name, value);
      return;
    }
    memoryStorage.set(name, value);
  },
  removeItem: (name) => {
    if (persistent) {
      window.localStorage.removeItem(name);
      return;
    }
    memoryStorage.delete(name);
  }
};

function toastId(): string {
  return `toast-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function clampSettings(settings: VibeSettings): VibeSettings {
  return {
    chaos: clamp(Math.round(settings.chaos), 0, 100),
    difficulty: settings.difficulty,
    reducedMotion: Boolean(settings.reducedMotion),
    soundEnabled: Boolean(settings.soundEnabled)
  };
}

export const useArcadeStore = create<ArcadeState>()(
  persist(
    (set, get) => ({
      vibeInput: "",
      currentGame: null,
      currentRemixIndex: 0,
      settings: defaultSettings,
      savedGames: [],
      toasts: [],
      isHelpOpen: false,
      isGenerating: false,
      storagePersistent: persistent,
      shareFallback: null,
      setVibeInput: (input) => set({ vibeInput: input.slice(0, 80) }),
      updateSettings: (partial) => {
        const nextSettings = clampSettings({ ...get().settings, ...partial });
        set({ settings: nextSettings });
      },
      generateGame: (vibeOverride) => {
        const state = get();
        const vibe =
          vibeOverride?.trim() ||
          state.vibeInput.trim() ||
          exampleVibes[Math.floor(Math.random() * exampleVibes.length)];
        const game = createGeneratedGame(vibe, state.settings, 0);
        set({
          currentGame: game,
          currentRemixIndex: 0,
          vibeInput: vibe,
          isGenerating: false
        });
        get().addToast({ title: `${game.title} is ready.`, tone: "success" });
      },
      remixCurrent: () => {
        const state = get();
        const vibe = state.currentGame?.vibe || state.vibeInput || "";
        const remixIndex = state.currentRemixIndex + 1;
        const game = createGeneratedGame(vibe, state.settings, remixIndex);
        set({ currentGame: game, currentRemixIndex: remixIndex, vibeInput: vibe });
        get().addToast({ title: `Remixed into ${game.title}.`, tone: "info" });
      },
      saveCurrent: () => {
        const current = get().currentGame;
        if (!current) {
          get().addToast({ title: "Generate a game before saving.", tone: "warning" });
          return;
        }
        const alreadySaved = get().savedGames.some((game) => game.id === current.id);
        if (alreadySaved) {
          get().addToast({ title: "That cartridge is already in the gallery.", tone: "info" });
          return;
        }
        set({ savedGames: [current, ...get().savedGames].slice(0, 24) });
        get().addToast({ title: `${current.title} saved.`, tone: "success" });
      },
      loadSavedGame: (id) => {
        const game = get().savedGames.find((candidate) => candidate.id === id);
        if (!game) {
          get().addToast({ title: "Saved game could not be found.", tone: "danger" });
          return;
        }
        set({
          currentGame: game,
          currentRemixIndex: game.remixIndex,
          vibeInput: game.vibe
        });
        get().addToast({ title: `${game.title} loaded.`, tone: "success" });
      },
      deleteSavedGame: (id) => {
        const game = get().savedGames.find((candidate) => candidate.id === id);
        set({ savedGames: get().savedGames.filter((candidate) => candidate.id !== id) });
        get().addToast({
          title: game ? `${game.title} deleted.` : "Saved game deleted.",
          tone: "info"
        });
      },
      addToast: (toast) => {
        const message: ToastMessage = { id: toastId(), ...toast };
        set({ toasts: [message, ...get().toasts].slice(0, 4) });
      },
      dismissToast: (id) => {
        set({ toasts: get().toasts.filter((toast) => toast.id !== id) });
      },
      setHelpOpen: (open) => set({ isHelpOpen: open }),
      setGenerating: (value) => set({ isGenerating: value }),
      setShareFallback: (value) => set({ shareFallback: value })
    }),
    {
      name: "vibe-arcade-store",
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        settings: state.settings,
        savedGames: state.savedGames
      })
    }
  )
);


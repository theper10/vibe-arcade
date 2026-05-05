export type Difficulty = "chill" | "normal" | "spicy";

export type GameTemplate =
  | "click_collect"
  | "avoid_enemy"
  | "memory_match"
  | "tiny_quest";

export type GameOutcome = "idle" | "playing" | "won" | "lost";

export type VibeSignal =
  | "cozy"
  | "spooky"
  | "cyberpunk"
  | "fantasy"
  | "detective"
  | "food"
  | "garden"
  | "ocean"
  | "space"
  | "goblin"
  | "corporate"
  | "chaotic"
  | "cute"
  | "cursed"
  | "royal"
  | "desert"
  | "winter"
  | "arcade"
  | "noir"
  | "magical"
  | "academic"
  | "pirate"
  | "robot"
  | "forest"
  | "dream"
  | "horror-lite";

export interface VibeSettings {
  chaos: number;
  difficulty: Difficulty;
  reducedMotion: boolean;
  soundEnabled: boolean;
}

export interface ThemePalette {
  name: string;
  background: string;
  panel: string;
  primary: string;
  secondary: string;
  accent: string;
  danger: string;
  text: string;
  muted: string;
}

export interface VibeAnalysis {
  original: string;
  safePhrase: string;
  keywords: string[];
  signals: VibeSignal[];
  primarySignal: VibeSignal;
  chaosLevel: "tidy" | "sparky" | "unhinged";
}

export interface GeneratedGame {
  id: string;
  createdAt: string;
  vibe: string;
  seed: number;
  remixIndex: number;
  template: GameTemplate;
  title: string;
  subtitle: string;
  studio: string;
  palette: ThemePalette;
  playerName: string;
  collectibleName: string;
  collectiblePlural: string;
  hazardName: string;
  enemyName: string;
  progressName: string;
  objective: string;
  winText: string;
  loseText: string;
  instructions: string[];
  patchNotes: string[];
  boxArt: {
    icon: string;
    motif: string;
    tagline: string;
  };
  flavor: {
    actionVerb: string;
    place: string;
    soundLabel: string;
    uiNoun: string;
    motif: string;
  };
  tuning: {
    durationSeconds: number;
    targetScore: number;
    maxHealth: number;
    moveLimit?: number;
    enemySpeed?: number;
    spawnRate?: number;
    enemyCount?: number;
    pairCount?: number;
    maxTurns?: number;
  };
}

export interface ToastMessage {
  id: string;
  title: string;
  tone?: "info" | "success" | "warning" | "danger";
}


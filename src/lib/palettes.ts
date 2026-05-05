import type { ThemePalette, VibeSignal } from "../types/game";
import type { RNG } from "./rng";
import { pick } from "./rng";

const defaultPalette: ThemePalette = {
  name: "Midnight Tokens",
  background: "#090a1a",
  panel: "#171830",
  primary: "#6ee7f9",
  secondary: "#f472b6",
  accent: "#facc15",
  danger: "#fb7185",
  text: "#f8fafc",
  muted: "#a9b4c8"
};

const palettes: Partial<Record<VibeSignal, ThemePalette[]>> = {
  cozy: [
    {
      name: "Rainy Amber",
      background: "#0b1320",
      panel: "#172235",
      primary: "#8fd3ff",
      secondary: "#f6b461",
      accent: "#b6e3a8",
      danger: "#ff7d7d",
      text: "#f7fbff",
      muted: "#b9c7d8"
    }
  ],
  cyberpunk: [
    {
      name: "Chrome Afterparty",
      background: "#080715",
      panel: "#17112d",
      primary: "#00f5ff",
      secondary: "#ff4ecd",
      accent: "#faff00",
      danger: "#ff3864",
      text: "#f7fbff",
      muted: "#a6a2d0"
    }
  ],
  detective: [
    {
      name: "Wet Pavement",
      background: "#081018",
      panel: "#152231",
      primary: "#8db3d9",
      secondary: "#d59f54",
      accent: "#e8d7a4",
      danger: "#d85d5d",
      text: "#f4f1e8",
      muted: "#aeb8c4"
    }
  ],
  noir: [
    {
      name: "Jazz Alley",
      background: "#06080d",
      panel: "#151821",
      primary: "#c8d3dd",
      secondary: "#b87943",
      accent: "#f2ca68",
      danger: "#d9534f",
      text: "#f6f2e9",
      muted: "#9ca5b1"
    }
  ],
  goblin: [
    {
      name: "Shiny Ledger",
      background: "#08130d",
      panel: "#142618",
      primary: "#a3e635",
      secondary: "#fbbf24",
      accent: "#38bdf8",
      danger: "#fb7185",
      text: "#f6ffe8",
      muted: "#b8c8a0"
    }
  ],
  corporate: [
    {
      name: "Quarterly Glow",
      background: "#07111b",
      panel: "#102033",
      primary: "#60a5fa",
      secondary: "#34d399",
      accent: "#fbbf24",
      danger: "#fb7185",
      text: "#f8fbff",
      muted: "#a7b4c6"
    }
  ],
  garden: [
    {
      name: "Moon Greenhouse",
      background: "#07130f",
      panel: "#123023",
      primary: "#86efac",
      secondary: "#f9a8d4",
      accent: "#fde68a",
      danger: "#fb7185",
      text: "#f4fff7",
      muted: "#a8cbb5"
    }
  ],
  magical: [
    {
      name: "Potion Booth",
      background: "#100b22",
      panel: "#20133d",
      primary: "#c084fc",
      secondary: "#67e8f9",
      accent: "#f9a8d4",
      danger: "#fb7185",
      text: "#fff7ff",
      muted: "#c8b6df"
    }
  ],
  fantasy: [
    {
      name: "Dragon Lantern",
      background: "#0e1014",
      panel: "#1b2431",
      primary: "#f59e0b",
      secondary: "#22c55e",
      accent: "#93c5fd",
      danger: "#ef4444",
      text: "#fff8ec",
      muted: "#b9c1cb"
    }
  ],
  ocean: [
    {
      name: "Deep Snack Reef",
      background: "#031521",
      panel: "#0d2a3a",
      primary: "#2dd4bf",
      secondary: "#60a5fa",
      accent: "#f9a8d4",
      danger: "#fb7185",
      text: "#ecfeff",
      muted: "#9bc8d0"
    }
  ],
  space: [
    {
      name: "Orbital Soda",
      background: "#09091f",
      panel: "#171735",
      primary: "#a78bfa",
      secondary: "#38bdf8",
      accent: "#facc15",
      danger: "#fb7185",
      text: "#f8f7ff",
      muted: "#b6b7db"
    }
  ],
  royal: [
    {
      name: "Crown Cabinet",
      background: "#100715",
      panel: "#25132a",
      primary: "#f0abfc",
      secondary: "#facc15",
      accent: "#67e8f9",
      danger: "#fb7185",
      text: "#fff7fd",
      muted: "#cab6ce"
    }
  ],
  desert: [
    {
      name: "Dune Neon",
      background: "#130d09",
      panel: "#2b1d14",
      primary: "#fdba74",
      secondary: "#5eead4",
      accent: "#fef08a",
      danger: "#fb7185",
      text: "#fff8ea",
      muted: "#d5bea1"
    }
  ],
  winter: [
    {
      name: "Frost Cabinet",
      background: "#07111f",
      panel: "#122338",
      primary: "#bfdbfe",
      secondary: "#67e8f9",
      accent: "#fef3c7",
      danger: "#fb7185",
      text: "#f8fbff",
      muted: "#b7c9dc"
    }
  ],
  pirate: [
    {
      name: "Blacklight Booty",
      background: "#070d13",
      panel: "#16212d",
      primary: "#fbbf24",
      secondary: "#38bdf8",
      accent: "#fb7185",
      danger: "#f43f5e",
      text: "#fff9e8",
      muted: "#b9c0c7"
    }
  ],
  robot: [
    {
      name: "Circuit Punch",
      background: "#070d12",
      panel: "#111f2a",
      primary: "#5eead4",
      secondary: "#c084fc",
      accent: "#facc15",
      danger: "#fb7185",
      text: "#effffe",
      muted: "#a9bbc1"
    }
  ],
  forest: [
    {
      name: "Moss Arcade",
      background: "#06130d",
      panel: "#10291c",
      primary: "#4ade80",
      secondary: "#fcd34d",
      accent: "#93c5fd",
      danger: "#fb7185",
      text: "#f3fff6",
      muted: "#a9c3ad"
    }
  ],
  dream: [
    {
      name: "Lucid Tokens",
      background: "#0c0c1e",
      panel: "#1d1c39",
      primary: "#f0abfc",
      secondary: "#7dd3fc",
      accent: "#fde68a",
      danger: "#fb7185",
      text: "#fffbff",
      muted: "#c0bce0"
    }
  ],
  "horror-lite": [
    {
      name: "Friendly Crypt",
      background: "#0d0a13",
      panel: "#1d1526",
      primary: "#c084fc",
      secondary: "#86efac",
      accent: "#fbbf24",
      danger: "#fb7185",
      text: "#fff7ff",
      muted: "#b8aeca"
    }
  ],
  arcade: [defaultPalette],
  cute: [
    {
      name: "Button Candy",
      background: "#100d1d",
      panel: "#221b34",
      primary: "#f9a8d4",
      secondary: "#86efac",
      accent: "#fef08a",
      danger: "#fb7185",
      text: "#fff7fb",
      muted: "#c9bed5"
    }
  ],
  chaotic: [
    {
      name: "Confetti Voltage",
      background: "#080816",
      panel: "#17172e",
      primary: "#22d3ee",
      secondary: "#fb7185",
      accent: "#a3e635",
      danger: "#f97316",
      text: "#f8fafc",
      muted: "#b7bdd1"
    }
  ],
  cursed: [
    {
      name: "Cursed Candy",
      background: "#100712",
      panel: "#231026",
      primary: "#d946ef",
      secondary: "#84cc16",
      accent: "#fde047",
      danger: "#fb7185",
      text: "#fff7fd",
      muted: "#c7b2cb"
    }
  ],
  academic: [
    {
      name: "Library Laser",
      background: "#0b0f18",
      panel: "#171f2e",
      primary: "#93c5fd",
      secondary: "#fbbf24",
      accent: "#c084fc",
      danger: "#fb7185",
      text: "#f6f8ff",
      muted: "#adb8ca"
    }
  ],
  food: [
    {
      name: "Snack Cabinet",
      background: "#120b10",
      panel: "#271821",
      primary: "#fb923c",
      secondary: "#f9a8d4",
      accent: "#bef264",
      danger: "#fb7185",
      text: "#fff8f1",
      muted: "#ceb6bc"
    }
  ],
  spooky: [
    {
      name: "Pumpkin Static",
      background: "#0e0a14",
      panel: "#20142a",
      primary: "#fb923c",
      secondary: "#c084fc",
      accent: "#86efac",
      danger: "#fb7185",
      text: "#fff8ed",
      muted: "#bdb0c8"
    }
  ]
};

export function paletteForSignals(signals: VibeSignal[], rng: RNG): ThemePalette {
  const signal = signals.find((candidate) => palettes[candidate]?.length) ?? "arcade";
  return pick(palettes[signal] ?? [defaultPalette], rng);
}


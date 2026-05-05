import type { VibeAnalysis, VibeSettings, VibeSignal } from "../types/game";
import { clamp } from "./rng";

const signalKeywords: Record<VibeSignal, string[]> = {
  cozy: ["cozy", "warm", "rainy", "rain", "tea", "cafe", "blanket", "soft", "sleepy"],
  spooky: ["spooky", "ghost", "haunted", "mist", "crypt", "eerie", "pumpkin"],
  cyberpunk: ["cyberpunk", "neon", "cyber", "hacker", "glitch", "chrome", "laser"],
  fantasy: ["fantasy", "dragon", "castle", "quest", "knight", "elf", "dungeon"],
  detective: ["detective", "clue", "mystery", "case", "sleuth", "evidence", "noir"],
  food: ["food", "snack", "pizza", "ramen", "soup", "bakery", "chef", "taco"],
  garden: ["garden", "gardening", "sprout", "flower", "mushroom", "greenhouse", "herb"],
  ocean: ["ocean", "sea", "coral", "wave", "tide", "mermaid", "submarine"],
  space: ["space", "star", "moon", "planet", "orbit", "cosmic", "rocket"],
  goblin: ["goblin", "gremlin", "orc", "shiny", "trash", "mischief"],
  corporate: ["corporate", "capitalism", "office", "quarterly", "meeting", "invoice", "startup"],
  chaotic: ["chaos", "chaotic", "wild", "random", "panic", "mess", "fever"],
  cute: ["cute", "tiny", "kawaii", "adorable", "plush", "baby", "little"],
  cursed: ["cursed", "curse", "forbidden", "wrong", "eldritch", "hexed"],
  royal: ["royal", "queen", "king", "prince", "princess", "crown", "palace"],
  desert: ["desert", "dune", "sun", "cactus", "mirage", "sand"],
  winter: ["winter", "snow", "frost", "ice", "yeti", "blizzard", "cold"],
  arcade: ["arcade", "retro", "cabinet", "token", "pixel", "joystick"],
  noir: ["noir", "rain", "jazz", "trench", "alley", "shadow", "midnight"],
  magical: ["magic", "magical", "wizard", "witch", "spell", "potion", "wand"],
  academic: ["academic", "school", "library", "book", "exam", "professor", "homework"],
  pirate: ["pirate", "treasure", "ship", "parrot", "anchor", "captain", "plunder"],
  robot: ["robot", "bot", "android", "circuit", "machine", "automaton", "drone"],
  forest: ["forest", "woods", "tree", "moss", "fern", "owl", "glade"],
  dream: ["dream", "sleep", "surreal", "cloud", "moonbeam", "nap", "weird"],
  "horror-lite": ["horror", "monster", "scary", "creepy", "vampire", "werewolf", "zombie"]
};

const unsafePatterns = [
  /\b(?:porn|xxx|explicit|nude|fetish|incest)\b/i,
  /\b(?:genocide|supremacist|terrorist|nazi|white\s*power)\b/i
];

const fallbackVibes = [
  "cozy rainy detective",
  "neon cyberpunk stress relief",
  "goblin capitalism",
  "tiny wizard gardening",
  "space diner mystery",
  "royal cactus arcade",
  "pirate library dream"
];

export const exampleVibes = fallbackVibes;

export function sanitizeVibe(input: string): string {
  const trimmed = input.trim().slice(0, 80);
  const cleaned = trimmed
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned || unsafePatterns.some((pattern) => pattern.test(cleaned))) {
    return "weird arcade kindness";
  }

  return cleaned;
}

export function extractKeywords(input: string): string[] {
  return sanitizeVibe(input)
    .toLowerCase()
    .match(/[a-z0-9]+/g)?.slice(0, 12) ?? ["weird", "arcade"];
}

export function analyzeVibe(input: string, settings: VibeSettings): VibeAnalysis {
  const safePhrase = sanitizeVibe(input || fallbackVibes[0]);
  const keywords = extractKeywords(safePhrase);
  const signals: VibeSignal[] = [];

  for (const [signal, words] of Object.entries(signalKeywords) as Array<[VibeSignal, string[]]>) {
    if (keywords.some((keyword) => words.includes(keyword))) {
      signals.push(signal);
    }
  }

  if (signals.length === 0) {
    if (keywords.includes("rain") || keywords.includes("night")) {
      signals.push("noir");
    } else if (keywords.includes("tiny") || keywords.includes("small")) {
      signals.push("cute");
    } else {
      signals.push("arcade");
    }
  }

  if (settings.chaos > 68 && !signals.includes("chaotic")) {
    signals.push("chaotic");
  }

  const chaos = clamp(settings.chaos, 0, 100);
  const chaosLevel = chaos < 34 ? "tidy" : chaos < 72 ? "sparky" : "unhinged";

  return {
    original: input,
    safePhrase,
    keywords,
    signals,
    primarySignal: signals[0],
    chaosLevel
  };
}

